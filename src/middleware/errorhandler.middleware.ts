import logger from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const stack = process.env.NODE_ENV === 'production' ? undefined : err.stack;

  res.status(statusCode).json({
    status: 'error',
    success: false,
    statusCode,
    message,
    stack,
  });
  next();
}
