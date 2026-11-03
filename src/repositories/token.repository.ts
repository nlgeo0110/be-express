import { RedisKeys } from '@/constants/redis-keys';
import { redisClient } from '@/database/redis.database';

export default {
  async revokeAccessToken(jti: string, ttlSeconds: number) {
    await redisClient.setex(
      RedisKeys.accessTokenBlacklist(jti),
      'true',
      ttlSeconds
    );
  },

  async isAccessTokenRevoked(jti: string) {
    return (
      (await redisClient.exists(RedisKeys.accessTokenBlacklist(jti))) === 1
    );
  },

  async setRefreshToken(
    userId: number,
    jti: string,
    value: string,
    ttlSeconds: number
  ) {
    return redisClient.setex(
      RedisKeys.refreshToken(userId, jti),
      value,
      ttlSeconds
    );
  },

  async consumeRefreshToken(userId: number, jti: string) {
    return redisClient.getdel(RedisKeys.refreshToken(userId, jti));
  },

  async delRefreshToken(key: string) {
    return redisClient.del(key);
  },

  async getRefreshTokensByUser(userId: number) {
    const prefix = `${RedisKeys.refreshTokenUser(userId)}:`;
    const keys = await redisClient.keys(`${prefix}*`);

    if (!keys.length) return [];

    const values = await redisClient.mget(keys);
    return keys.map((key, index) => ({
      key,
      jti: key.slice(prefix.length),
      accessExp: Number(values[index]),
    }));
  },
};
