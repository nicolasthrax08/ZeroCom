import { z } from 'zod';

// PRC ID card checksum: mod-11 with weights [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2].
const ID_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const ID_CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

function isValidIdCardChecksum(id: string): boolean {
  if (!/^[1-9]\d{17}$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += Number(id[i]) * ID_WEIGHTS[i];
  }
  const expected = ID_CHECK_CODES[sum % 11];
  const actual = id[17].toUpperCase();
  return expected === actual;
}

export const realNameSchema = z.object({
  realName: z
    .string()
    .min(2, '请输入真实姓名')
    .max(50)
    .regex(/^[\u4e00-\u9fa5a-zA-Z·]+$/, '姓名只能包含中文、字母和间隔号'),
  idCardNumber: z
    .string()
    .regex(/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, '请输入有效的身份证号')
    .refine(isValidIdCardChecksum, '身份证校验位不正确'),
});

export type RealNameInput = z.infer<typeof realNameSchema>;
