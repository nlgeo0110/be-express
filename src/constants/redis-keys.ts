export const RedisKeys = {
  accessTokenBlacklist: (jti: string) => `blacklist:${jti}`,
  refreshToken: (userId: number, jti: string) =>
    `refresh_token:${userId}:${jti}`,
  refreshTokenUser: (userId: number) => `refresh_token:${userId}`,
} as const;
