import { z } from 'zod';
import { OTP_LENGTH } from '@/utils/otp';

const emailSchema = z
  .string('email is invalid')
  .trim()
  .toLowerCase()
  .pipe(
    z.email('email is invalid').max(100, 'email must be at most 100 characters')
  );

// Quy tắc mật khẩu dùng chung cho register và reset-password, truyền tên field để message đúng
const newPasswordSchema = (field: string) =>
  z
    .string(`${field} is invalid`)
    .min(8, `${field} must be at least 8 characters`)
    .max(100, `${field} must be at most 100 characters`);

const otpSchema = z
  .string('otp is invalid')
  .trim()
  .regex(
    new RegExp(`^\\d{${OTP_LENGTH}}$`),
    `otp must be exactly ${OTP_LENGTH} digits`
  );

export const loginBodySchema = z.object({
  email: emailSchema,
  password: z.string('password is invalid').min(1, 'password is required'),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const registerBodySchema = z.object({
  email: emailSchema,
  password: newPasswordSchema('password'),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;

export const refreshTokenBodySchema = z.object({
  refresh_token: z
    .string('refresh_token is invalid')
    .min(1, 'refresh_token is required'),
});

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;

export const forgotPasswordBodySchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;

export const resetPasswordBodySchema = z.object({
  otp: otpSchema,
  newPassword: newPasswordSchema('newPassword'),
});

export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;
