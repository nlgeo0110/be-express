import { AuthUser } from '@/mappers/user.mapper';
import { RequestHandler } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { UnauthorizedError } from './errors';

interface RequestContext {
  requestId: string;
  user?: AuthUser;
  jti?: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

export const requestContext: RequestHandler = (req, res, next) => {
  const requestId = req.get('x-request-id') ?? randomUUID();
  res.setHeader('x-request-id', requestId);
  storage.run({ requestId }, next);
};

export const getRequestContext = (): Readonly<RequestContext> | undefined =>
  storage.getStore();

export const setAuthContext = (user: AuthUser, jti: string) => {
  const store = storage.getStore();
  if (!store) throw new Error('requestContext middleware is not mounted');
  store.user = user;
  store.jti = jti;
};

export const getCurrentUser = () => storage.getStore()?.user;

export const requireCurrentUser = () => {
  const user = getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
};

export const requireAuthContext = () => {
  const { user, jti } = storage.getStore() ?? {};
  if (!user || !jti) throw new UnauthorizedError();
  return { user, jti };
};
