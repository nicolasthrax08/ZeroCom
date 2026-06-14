import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, 'Invalid PRC phone'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/),
  code: z.string().regex(/^\d{6}$/),
});

export const validate = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      issues: r.error.issues,
    });
  }
  req.validated = r.data;
  next();
};
