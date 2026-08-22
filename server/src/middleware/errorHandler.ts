import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/appError';
import { sendError } from '../utils/response';

interface PrismaErrorLike extends Error {
  code?: string;
  meta?: {
    target?: string[] | string;
    field_name?: string;
    [key: string]: unknown;
  };
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Operational AppError
  if (err instanceof AppError) {
    sendError(res, err.message, err.errorCode, err.statusCode, err.details);
    return;
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      rule: e.code,
    }));
    sendError(res, 'Validation failed', 'VALIDATION_ERROR', 400, formattedErrors);
    return;
  }

  // Prisma Known Request Errors
  const prismaErr = err as PrismaErrorLike;
  if (prismaErr.code && prismaErr.code.startsWith('P')) {
    if (prismaErr.code === 'P2002') {
      const target = Array.isArray(prismaErr.meta?.target)
        ? (prismaErr.meta?.target as string[]).join(', ')
        : 'field';
      sendError(
        res,
        `A record with this ${target} already exists.`,
        'DUPLICATE_RESOURCE',
        409,
        { target: prismaErr.meta?.target }
      );
      return;
    }

    if (prismaErr.code === 'P2025') {
      sendError(
        res,
        'The requested resource was not found or has been deleted.',
        'RESOURCE_NOT_FOUND',
        404
      );
      return;
    }

    if (prismaErr.code === 'P2003') {
      sendError(
        res,
        'Foreign key constraint failed. Related record does not exist.',
        'FOREIGN_KEY_VIOLATION',
        400,
        { field: prismaErr.meta?.field_name }
      );
      return;
    }

    sendError(
      res,
      `Database error: ${prismaErr.message}`,
      `PRISMA_ERROR_${prismaErr.code}`,
      500
    );
    return;
  }

  // Fallback for Unexpected Errors
  const isDev = process.env.NODE_ENV === 'development';
  console.error('Unhandled Server Error:', err);

  sendError(
    res,
    isDev ? err.message : 'An unexpected internal server error occurred.',
    'INTERNAL_SERVER_ERROR',
    500,
    isDev ? { stack: err.stack } : undefined
  );
};
