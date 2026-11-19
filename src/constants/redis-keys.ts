export const RedisKeys = {
  accessTokenBlacklist: (jti: string) => `blacklist:${jti}`,
  refreshToken: (userId: number, jti: string) =>
    `refresh_token:${userId}:${jti}`,
  refreshTokenUser: (userId: number) => `refresh_token:${userId}`,
  resetPasswordOtp: (otp: string) => `reset_password_otp:${otp}`,
  resetPasswordOtpUser: (userId: string) => `reset_password_otp:user:${userId}`,
} as const;
