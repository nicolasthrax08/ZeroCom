import { z } from 'zod';

export const orderCreateSchema = z.object({
  planCode: z.enum(['MONTHLY_PRO', 'ANNUAL_PRO']),
  provider: z.enum(['ALIPAY', 'WECHATPAY']),
});

export const webhookSimulateSchema = z.object({
  outTradeNo: z.string().min(1),
});

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type WebhookSimulateInput = z.infer<typeof webhookSimulateSchema>;
