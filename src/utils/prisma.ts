import { Prisma } from '@/generated/prisma/client';
import { BadRequestError, ConflictError, NotFoundError } from '@/utils/errors';

export const mapPrismaError = (error: unknown): unknown => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return error;
  }

  switch (error.code) {
    case 'P2025':
      return new NotFoundError();
    case 'P2002': {
      const target = (error.meta?.target as string[] | undefined)?.join(', ');
      return new ConflictError(
        `Data already exists${target ? ` (duplicate: ${target})` : ''}`
      );
    }
    case 'P2003':
      return new BadRequestError('Referenced data does not exist');
    default:
      return error;
  }
};
