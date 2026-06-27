import { z } from 'zod';
import { PHONE_REGEX } from '@/lib/constants';

export const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_REGEX, '请输入有效的中国大陆手机号码');

export type PhoneInput = z.infer<typeof phoneSchema>;
