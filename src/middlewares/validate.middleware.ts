import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { ZodType, flattenError } from 'zod';

const respondBadRequest = (res: Response, message: string, errors: unknown) =>
  res
    .status(httpStatus.BAD_REQUEST)
    .json({ status: httpStatus.BAD_REQUEST, message, errors });

export const validateQuery =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      respondBadRequest(
        res,
        'Invalid query',
        flattenError(result.error).fieldErrors
      );
      return;
    }
    res.locals.query = result.data;
    next();
  };

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    console.log('result', req.body);
    const result = schema.safeParse(req.body);
    if (!result.success) {
      respondBadRequest(
        res,
        'Invalid body',
        flattenError(result.error).fieldErrors
      );
      return;
    }
    res.locals.body = result.data;
    next();
  };

export const validateParams =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      respondBadRequest(
        res,
        'Invalid params',
        flattenError(result.error).fieldErrors
      );
      return;
    }
    res.locals.params = result.data;
    next();
  };
