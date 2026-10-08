import { NextFunction, Request, RequestHandler, Response } from 'express';
import { mapPrismaError } from '@/utils/prisma';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const asyncHandler =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next).catch((error) => next(mapPrismaError(error)));
  };
