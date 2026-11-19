import httpStatus from 'http-status';
import express, { ErrorRequestHandler } from 'express';

import { env } from '@/config/env';
import { AppError, NotFoundError } from '@/utils/errors';
import { mapPrismaError } from '@/utils/prisma';

import productRoute from '@/routes/product.route';
import adminRoute from '@/routes/admin';
import authRoute from '@/routes/auth.route';
import { requestContext } from '@/utils/request-context';

const app = express();
const PORT = env.PORT;

app.use(requestContext);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/products', productRoute);
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);

app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(((err, req, res, _next) => {
  const error = mapPrismaError(err);
  if (error instanceof AppError) {
    console.warn({ err: error }, error.message);
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }

  console.warn({ err: error }, 'Unhandled error');
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  });
}) as ErrorRequestHandler);

app.listen(PORT, () => {
  console.info(`App listening on port ${PORT}`);
});
