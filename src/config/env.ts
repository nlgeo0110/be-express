import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV || '',
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
};

export const isProd = env.NODE_ENV === 'production';
