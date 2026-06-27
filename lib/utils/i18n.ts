// Display labels for enums.
export const ROLE_LABELS: Record<string, string> = {
  USER: '普通用户',
  MODERATOR: '审核员',
  ADMIN: '管理员',
};

export const VERIFICATION_LABELS: Record<string, string> = {
  UNVERIFIED: '未验证',
  PHONE_ONLY: '手机号已验证',
  ID_PENDING: '身份证审核中',
  ID_VERIFIED: '实名已认证',
  ID_REJECTED: '实名认证未通过',
  CHALLENGE_REQUIRED: '需要重新核验',
};

export const LISTING_STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  PENDING_VERIFICATION: '审核中',
  ACTIVE: '已上架',
  PAUSED: '已下架',
  SOLD: '已成交',
  REMOVED: '已移除',
};

export const LISTING_TYPE_LABELS: Record<string, string> = {
  SECOND_HAND: '二手房',
  NEW: '新房',
  RENTAL: '出租',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  CREATED: '已创建',
  PENDING_USER_PAY: '待支付',
  PAID: '已支付',
  EXPIRED: '已过期',
  CANCELLED: '已取消',
  REFUNDED: '已退款',
};

export const BROKER_SEVERITY_LABELS: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  CRITICAL: '严重',
};

export const BROKER_SIGNAL_LABELS: Record<string, string> = {
  HIGH_FREQUENCY_VIEWING: '高频浏览',
  GEO_SKIP_PATTERN: '跨城市浏览',
  ALWAYS_VIEW_NEVER_ENGAGE: '只看不联系',
  MULTIPLE_PHONES_SAME_DEVICE: '同设备多号',
  ID_CARD_REUSE: '身份证复用',
  LISTING_HIJACK: '房源抄袭',
  OFF_PLATFORM_REDIRECT: '引导站外联系',
  IP_ASN_CLUSTER: 'IP 聚集',
  HONEYPOT_ACCESS: '触饵房源访问',
};

export const ENFORCEMENT_LABELS: Record<string, string> = {
  SOFT_WARNING: '警告提醒',
  VERIFICATION_CHALLENGE: '要求重新核验',
  SHADOW_BAN: '影子封禁',
  HARD_BAN: '永久封禁',
  LISTING_PURGE: '房源清理',
};

export const REPORT_STATUS_LABELS: Record<string, string> = {
  OPEN: '待处理',
  IN_REVIEW: '处理中',
  RESOLVED: '已处理',
  REJECTED: '已驳回',
};

export const PROPERTY_LABELS: Record<string, string> = {
  SECOND_HAND: '二手',
  NEW: '新房',
  RENTAL: '出租',
};
