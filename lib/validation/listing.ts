import { z } from 'zod';

// Photo URLs must be https and point to our trusted CDN domains.
const PHOTO_HOSTS = ['images.zerocom.app', 'cdn.zerocom.app', 'localhost'];
const photoUrlSchema = z
  .string()
  .url()
  .refine((url) => {
    try {
      const u = new URL(url);
      return u.protocol === 'https:' && PHOTO_HOSTS.includes(u.hostname);
    } catch {
      return false;
    }
  }, '照片必须为来自可信 CDN 的 HTTPS 链接');

export const listingCreateSchema = z.object({
  title: z.string().min(1, '请输入标题').max(60, '标题不超过 60 字'),
  description: z.string().min(10, '描述至少 10 字').max(5000, '描述不超过 5000 字'),
  city: z.string().min(1, '请选择城市'),
  district: z.string().min(1, '请选择区域'),
  addressDetail: z.string().min(1, '请输入详细地址').max(200, '详细地址不超过 200 字'),
  priceRmbWan: z.number().positive('价格必须为正数').max(999999, '价格过大'),
  areaSqm: z.number().positive('面积必须为正数').max(100000, '面积过大'),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  propertyType: z.enum(['SECOND_HAND', 'NEW', 'RENTAL']).default('SECOND_HAND'),
  photos: z.array(photoUrlSchema).min(1, '至少上传一张照片').max(20, '照片最多 20 张'),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

export const listingReportSchema = z.object({
  listingId: z.string().uuid(),
  reason: z.enum([
    'SUSPECTED_BROKER',
    'FAKE_LISTING',
    'PRICE_ANOMALY',
    'DUPLICATE',
    'OTHER',
  ]),
  details: z.string().max(1000).optional(),
});

export type ListingCreateInput = z.infer<typeof listingCreateSchema>;
export type ListingReportInput = z.infer<typeof listingReportSchema>;
