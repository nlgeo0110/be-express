import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from './errors';
import { env } from '@/config/env';

export interface AuthTokenPayload extends JwtPayload {
  jti: string;
  user_id: number;
}

const verify = (
  token: string,
  secret: string,
  expiredMessage: string,
  invalidMessage: string
): AuthTokenPayload => {
  try {
    const decoded = jwt.verify(token, secret) as AuthTokenPayload;

    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError(expiredMessage);
    }
    throw new UnauthorizedError(invalidMessage);
  }
};

export const getTokenTTL = (exp?: number) =>
  exp ? Math.max(Math.ceil(exp - Date.now() / 1000), 0) : 0;

export const signAccessToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

export const signRefreshToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

export const verifyAccessToken = (token: string) =>
  verify(
    token,
    env.JWT_ACCESS_SECRET,
    'Access token has expired',
    'Invalid access token'
  );

export const verifyRefreshToken = (token: string) =>
  verify(
    token,
    env.JWT_REFRESH_SECRET,
    'Refresh token has expired',
    'Invalid refresh token'
  );

export const decodeToken = (token: string) => {
  return jwt.decode(token) as AuthTokenPayload;
};
