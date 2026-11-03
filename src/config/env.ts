import 'dotenv/config';
import type { SignOptions } from 'jsonwebtoken';

type ExpiresIn = NonNullable<SignOptions['expiresIn']>;

export const env = {
  NODE_ENV: process.env.NODE_ENV || '',
  PORT: process.env.PORT || 3000,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
  JWT_ACCESS_EXPIRES_IN: (process.env.JWT_ACCESS_EXPIRES_IN || '') as ExpiresIn,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN ||
    '') as ExpiresIn,

  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || '',
};

export const isProd = env.NODE_ENV === 'production';
