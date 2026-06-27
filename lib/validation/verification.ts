import { z } from 'zod';

export const realNameSchema = z.object({
  realName: z.string().min(2, '请输入真实姓名').max(50),
  idCardNumber: z
    .string()
    .regex(/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, '请输入有效的身份证号'),
});

export type RealNameInput = z.infer<typeof realNameSchema>;
