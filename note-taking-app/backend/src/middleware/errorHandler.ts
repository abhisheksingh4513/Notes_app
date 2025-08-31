import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Something went wrong',
    status: err.status || 500,
  };

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error.status = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.status = 401;
  }

  // PostgreSQL errors
  if (err.code === '23505') {
    error.message = 'Duplicate field value entered';
    error.status = 400;
  }

  if (err.code === '23503') {
    error.message = 'Foreign key constraint violation';
    error.status = 400;
  }

  res.status(error.status).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
