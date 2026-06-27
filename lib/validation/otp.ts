import { z } from 'zod';
import { phoneSchema } from './phone';

export const otpSendSchema = z.object({
  phone: phoneSchema,
});

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6, '验证码为 6 位数字'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: '必须同意《服务条款》' }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: '必须同意《隐私政策》' }),
  }),
});

export type OtpSendInput = z.infer<typeof otpSendSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
