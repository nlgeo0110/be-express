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

  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 1025,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '',

  OTP_TTL: Number(process.env.OTP_TTL) || 300,
};

export const isProd = env.NODE_ENV === 'production';
