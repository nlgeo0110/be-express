import 'dotenv/config';
import httpStatus from 'http-status';
import express, { ErrorRequestHandler } from 'express';

import productRoutes from '@/routes/product.routes';
import { AppError, NotFoundError } from '@/utils/errors';

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/products', productRoutes);

app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(((error, req, res, _next) => {
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
