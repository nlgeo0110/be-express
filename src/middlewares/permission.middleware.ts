import { ForbiddenError } from '@/utils/errors';
import { requireCurrentUser } from '@/utils/request-context';
import { RequestHandler } from 'express';

export const permissionMiddleware = (permission: string): RequestHandler => {
  return (_req, _res, next) => {
    const currentUser = requireCurrentUser();

    const permissions = new Set(currentUser.permissions || []);
    if (!permissions.has(permission)) throw new ForbiddenError();

    next();
  };
};
