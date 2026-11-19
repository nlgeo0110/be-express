import { env } from '@/config/env';

export const emailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  // true cho port 465 (SSL), false cho 587/1025 (STARTTLS hoặc không mã hoá)
  secure: env.SMTP_SECURE,
  // Mailpit ở local không cần auth
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
    : undefined,
  from: env.EMAIL_FROM,
  pool: {
    maxConnections: 5,
    maxMessages: 100,
  },
};
