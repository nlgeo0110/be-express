import httpStatus from 'http-status';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, httpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'You must be logged in to perform this action') {
    super(message, httpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, httpStatus.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Data not found') {
    super(message, httpStatus.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Data already exists') {
    super(message, httpStatus.CONFLICT);
  }
}
