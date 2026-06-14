import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      issues: err.issues,
    });
  }

  return res.status(500).json({
    error: 'INTERNAL',
    requestId: req.id,
  });
};
