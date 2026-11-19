import { ForbiddenError } from '@/utils/errors';
import { requireCurrentUser } from '@/utils/request-context';
import { RequestHandler } from 'express';

export const roleMiddleware = (allowedRoles: string[]): RequestHandler => {
  if (!allowedRoles.length)
    throw Error('roleMiddleware requires at least one role');
  const allowed = new Set(allowedRoles);

  return (_req, _res, next) => {
    const { roles } = requireCurrentUser(); // 401 nếu chưa đăng nhập
    if (!roles.some((role) => allowed.has(role))) throw new ForbiddenError();

    next();
  };
};
