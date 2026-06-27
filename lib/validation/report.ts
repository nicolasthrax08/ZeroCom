import { z } from 'zod';

export const reportSchema = z.object({
  listingId: z.string().uuid().optional(),
  reportedUserId: z.string().uuid().optional(),
  reason: z.enum([
    'SUSPECTED_BROKER',
    'FAKE_LISTING',
    'PRICE_ANOMALY',
    'DUPLICATE',
    'HARASSMENT',
    'OTHER',
  ]),
  details: z.string().max(1000).optional(),
});

export const appealSchema = z.object({
  enforcementId: z.string().uuid(),
  reason: z.string().min(10, '申诉理由至少 10 字').max(2000),
  supportingText: z.string().max(2000).optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;
export type AppealInput = z.infer<typeof appealSchema>;
