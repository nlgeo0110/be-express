import authService from '@/services/auth.service';
import userService from '@/services/user.service';
import { UnauthorizedError } from '@/utils/errors';
import { getTokenTTL, verifyAccessToken } from '@/utils/jwt';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // 1. Verify token có hợp lệ
  const accessToken = req.headers.authorization?.replace(/^Bearer /, '');
  if (!accessToken) throw new UnauthorizedError();
  const decodedToken = verifyAccessToken(accessToken);

  // 2. Kiểm tra access_token có tồn tại trong blacklist không
  const isRevoked = await authService.isAccessTokenRevoked(decodedToken.jti);
  if (isRevoked) throw new UnauthorizedError();

  // 3. Tìm xem user có tồn tại trong DB
  const user = await userService.getUserById(decodedToken?.user_id);
  if (!user) throw new UnauthorizedError();

  // 4. Gắn user, jti vào req
  req.user = user;
  req.jti = decodedToken.jti;

  next();
};
