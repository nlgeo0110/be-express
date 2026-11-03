import { z } from 'zod';

export const loginBodySchema = z.object({
  username: z
    .string('username is invalid')
    .trim()
    .min(1, 'username is required'),
  password: z.string('password is invalid').min(1, 'password is required'),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const registerBodySchema = z.object({
  username: z
    .string('username is invalid')
    .trim()
    .min(8, 'username must be at least 8 characters')
    .max(100, 'username must be at most 100 characters'),
  password: z
    .string('password is invalid')
    .min(8, 'password must be at least 8 characters')
    .max(100, 'password must be at most 100 characters'),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;

export const refreshTokenBodySchema = z.object({
  refresh_token: z
    .string('refresh_token is invalid')
    .min(1, 'refresh_token is required'),
});

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;
