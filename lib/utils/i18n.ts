// Display labels for enums. Each map is bilingual; pick a value with label(map, key, lang).
import type { Lang } from '@/lib/i18n/dictionary';

type Bilingual = { zh: string; en: string };
export type EnumMap = Record<string, Bilingual>;

function build(en: Record<string, string>, zh: Record<string, string>): EnumMap {
  const out: EnumMap = {};
  for (const k of Object.keys(en)) out[k] = { en: en[k], zh: zh[k] };
  return out;
}

export function label(map: EnumMap, key: string, lang: Lang): string {
  const e = map[key];
  if (!e) return key;
  return e[lang];
}

export const ROLE_LABELS: EnumMap = build(
  { USER: 'User', MODERATOR: 'Moderator', ADMIN: 'Admin' },
  { USER: '普通用户', MODERATOR: '审核员', ADMIN: '管理员' },
);

export const VERIFICATION_LABELS: EnumMap = build(
  {
    UNVERIFIED: 'Unverified',
    PHONE_ONLY: 'Phone verified',
    ID_PENDING: 'ID under review',
    ID_VERIFIED: 'Identity verified',
    ID_REJECTED: 'ID rejected',
    CHALLENGE_REQUIRED: 'Re-verification required',
  },
  {
    UNVERIFIED: '未验证',
    PHONE_ONLY: '手机号已验证',
    ID_PENDING: '身份证审核中',
    ID_VERIFIED: '实名已认证',
    ID_REJECTED: '实名认证未通过',
    CHALLENGE_REQUIRED: '需要重新核验',
  },
);

export const LISTING_STATUS_LABELS: EnumMap = build(
  {
    DRAFT: 'Draft',
    PENDING_VERIFICATION: 'Pending',
    ACTIVE: 'Active',
    PAUSED: 'Paused',
    SOLD: 'Sold',
    REMOVED: 'Removed',
  },
  {
    DRAFT: '草稿',
    PENDING_VERIFICATION: '审核中',
    ACTIVE: '已上架',
    PAUSED: '已下架',
    SOLD: '已成交',
    REMOVED: '已移除',
  },
);

export const LISTING_TYPE_LABELS: EnumMap = build(
  { SECOND_HAND: 'Second-hand', NEW: 'New', RENTAL: 'Rental' },
  { SECOND_HAND: '二手房', NEW: '新房', RENTAL: '出租' },
);

export const PAYMENT_STATUS_LABELS: EnumMap = build(
  {
    CREATED: 'Created',
    PENDING_USER_PAY: 'Awaiting payment',
    PAID: 'Paid',
    EXPIRED: 'Expired',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  },
  {
    CREATED: '已创建',
    PENDING_USER_PAY: '待支付',
    PAID: '已支付',
    EXPIRED: '已过期',
    CANCELLED: '已取消',
    REFUNDED: '已退款',
  },
);

export const BROKER_SEVERITY_LABELS: EnumMap = build(
  { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', CRITICAL: 'Critical' },
  { LOW: '低', MEDIUM: '中', HIGH: '高', CRITICAL: '严重' },
);

export const BROKER_SIGNAL_LABELS: EnumMap = build(
  {
    HIGH_FREQUENCY_VIEWING: 'High-frequency viewing',
    GEO_SKIP_PATTERN: 'Cross-city browsing',
    ALWAYS_VIEW_NEVER_ENGAGE: 'Views only, never engages',
    MULTIPLE_PHONES_SAME_DEVICE: 'Multiple phones, same device',
    ID_CARD_REUSE: 'ID card reuse',
    LISTING_HIJACK: 'Listing plagiarism',
    OFF_PLATFORM_REDIRECT: 'Off-platform redirect',
    IP_ASN_CLUSTER: 'IP cluster',
    HONEYPOT_ACCESS: 'Honeypot access',
  },
  {
    HIGH_FREQUENCY_VIEWING: '高频浏览',
    GEO_SKIP_PATTERN: '跨城市浏览',
    ALWAYS_VIEW_NEVER_ENGAGE: '只看不联系',
    MULTIPLE_PHONES_SAME_DEVICE: '同设备多号',
    ID_CARD_REUSE: '身份证复用',
    LISTING_HIJACK: '房源抄袭',
    OFF_PLATFORM_REDIRECT: '引导站外联系',
    IP_ASN_CLUSTER: 'IP 聚集',
    HONEYPOT_ACCESS: '触饵房源访问',
  },
);

export const ENFORCEMENT_LABELS: EnumMap = build(
  {
    SOFT_WARNING: 'Warning',
    VERIFICATION_CHALLENGE: 'Re-verify required',
    SHADOW_BAN: 'Shadow ban',
    HARD_BAN: 'Permanent ban',
    LISTING_PURGE: 'Listing purge',
  },
  {
    SOFT_WARNING: '警告提醒',
    VERIFICATION_CHALLENGE: '要求重新核验',
    SHADOW_BAN: '影子封禁',
    HARD_BAN: '永久封禁',
    LISTING_PURGE: '房源清理',
  },
);

export const REPORT_STATUS_LABELS: EnumMap = build(
  { OPEN: 'Open', IN_REVIEW: 'In review', RESOLVED: 'Resolved', REJECTED: 'Rejected' },
  { OPEN: '待处理', IN_REVIEW: '处理中', RESOLVED: '已处理', REJECTED: '已驳回' },
);

export const PROPERTY_LABELS: EnumMap = build(
  { SECOND_HAND: 'Second-hand', NEW: 'New', RENTAL: 'Rental' },
  { SECOND_HAND: '二手', NEW: '新房', RENTAL: '出租' },
);
