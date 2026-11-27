import { env } from '@/config/env';
import { RedisKeys } from '@/constants/redis-keys';
import { redisClient } from '@/database/redis.database';
import { toAuthUser, toUserResponse } from '@/mappers/user.mapper';
import { emailProducer } from '@/queues/email/email.producer';
import tokenRepository from '@/repositories/token.repository';
import userRepository from '@/repositories/user.repository';
import { BadRequestError, UnauthorizedError } from '@/utils/errors';
import { comparePassword, hashPassword } from '@/utils/hash';
import {
  decodeToken,
  getTokenTTL,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import { generateOTP } from '@/utils/otp';

export default {
  async generateToken(user_id: number) {
    const jti = crypto.randomUUID();
    const access_token = signAccessToken({ user_id, jti });
    const refresh_token = signRefreshToken({ user_id, jti });

    const decodedAccessToken = decodeToken(access_token);
    const decodedRefreshToken = decodeToken(refresh_token);
    const refreshTTLSeconds = getTokenTTL(decodedRefreshToken.exp);
    await tokenRepository.setRefreshToken(
      user_id,
      jti,
      String(decodedAccessToken.exp),
      refreshTTLSeconds
    );

    return { access_token, refresh_token };
  },

  async login({ email, password }: { email: string; password: string }) {
    const userWithPassword =
      await userRepository.findByEmailWithPassword(email);
    if (!userWithPassword)
      throw new BadRequestError('Invalid email or password');

    const user = toAuthUser(userWithPassword);
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch)
      throw new BadRequestError('Invalid email or password');

    const { access_token, refresh_token } = await this.generateToken(user.id);

    return { user: toUserResponse(user), access_token, refresh_token };
  },

  async register({ email, password }: { email: string; password: string }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new BadRequestError('Email already exists');
    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      email,
      password: hashedPassword,
    });
    const { id: user_id } = user;
    const { access_token, refresh_token } = await this.generateToken(user_id);

    return {
      user: toUserResponse(toAuthUser(user)),
      access_token,
      refresh_token,
    };
  },

  async refreshToken({
    refresh_token: refreshTokenParam,
  }: {
    refresh_token: string;
  }) {
    // 1. Verify refresh_token có hợp lệ không
    const { user_id, jti } = verifyRefreshToken(refreshTokenParam);

    // 2. Revoke access_token, refresh_token (chỉ request đầu tiên thành công)
    const revoked = await this.revokeToken(user_id, jti);
    if (!revoked) throw new UnauthorizedError('Refresh token has been revoked');

    // 3. Tạo access_token, refresh_token mới
    const { access_token, refresh_token } = await this.generateToken(user_id);

    return { access_token, refresh_token };
  },

  async logout({ userId, jti }: { userId: number; jti: string }) {
    await this.revokeToken(userId, jti);
    return null;
  },

  async revokeToken(userId: number, jti: string) {
    const accessExpireTime = await tokenRepository.consumeRefreshToken(
      userId,
      jti
    );
    if (!accessExpireTime) return false;

    const accessTTLSeconds = getTokenTTL(Number(accessExpireTime));
    if (accessTTLSeconds > 0) {
      await tokenRepository.revokeAccessToken(jti, accessTTLSeconds);
    }
    return true;
  },

  async revokeOtherTokens(userId: number, jti: string) {
    const tokens = await tokenRepository.getRefreshTokensByUser(userId);
    const otherTokens = tokens.filter((token) => token.jti !== jti);

    // 1. Thu hồi access_token còn hạn
    await Promise.all(
      otherTokens
        .map((token) => ({ jti: token.jti, ttl: getTokenTTL(token.accessExp) }))
        .filter((token) => token.ttl > 0)
        .map((token) => tokenRepository.revokeAccessToken(token.jti, token.ttl))
    );

    // 2. Xoá refresh_token
    await Promise.all(
      otherTokens.map((token) => tokenRepository.delRefreshToken(token.key))
    );
  },

  isAccessTokenRevoked(jti: string) {
    return tokenRepository.isAccessTokenRevoked(jti);
  },

  async removeOldResetPasswordOtp(userId: number) {
    if (!userId) return;

    const oldOtp = await redisClient.getdel(
      RedisKeys.resetPasswordOtpUser(String(userId))
    );
    if (oldOtp) redisClient.del(RedisKeys.resetPasswordOtp(oldOtp));
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return;

    const otp = generateOTP();
    const userId = user.id;

    await this.removeOldResetPasswordOtp(userId);

    await redisClient.setex(
      RedisKeys.resetPasswordOtp(otp),
      env.OTP_TTL,
      userId
    );
    await redisClient.setex(
      RedisKeys.resetPasswordOtpUser(String(userId)),
      env.OTP_TTL,
      otp
    );
    await emailProducer.sendResetPasswordOtp({
      to: user.email,
      otp,
    });

    return { email };
  },

  async resetPassword(otp: string, newPassword: string) {
    const userId =
      (await redisClient.getdel(RedisKeys.resetPasswordOtp(otp))) || '';
    if (!userId) throw new BadRequestError('OTP không hợp lệ hoặc đã hết hạn');
    const storedOtp = await redisClient.getdel(
      RedisKeys.resetPasswordOtpUser(userId)
    );
    if (!storedOtp)
      throw new BadRequestError('OTP không hợp lệ hoặc đã hết hạn');

    const hashedPassword = await hashPassword(newPassword);
    const user = await userRepository.updatePassword(+userId, hashedPassword);
    await emailProducer.sendResetPasswordSuccess({
      to: user.email,
      changedAt: new Date().toISOString(),
    });
  },
};
