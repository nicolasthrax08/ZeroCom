import type {
  BrokerSignal,
  Conversation,
  EnforcementAction,
  Listing,
  ListingPhoto,
  Message,
  PaymentAuditLog,
  PaymentOrder,
  Report,
  SavedListing,
  Subscription,
  User,
  UserVerification,
} from './types';

// Demo users ----------------------------------------------------------------
export const SEED_USERS: User[] = [
  {
    id: 'user-free-buyer',
    phoneEncrypted: 'U2FsdGVkX1+free-buyer',
    phoneHash: 'hash-13800000001',
    displayName: '张伟 (免费用户)',
    role: 'USER',
    isShadowBanned: false,
    isHardBanned: false,
    termsAcceptedAt: '2026-06-01T00:00:00Z',
    privacyAcceptedAt: '2026-06-01T00:00:00Z',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'user-monthly-buyer',
    phoneEncrypted: 'U2FsdGVkX1+monthly',
    phoneHash: 'hash-13800000002',
    displayName: '李娜 (月度会员)',
    role: 'USER',
    isShadowBanned: false,
    isHardBanned: false,
    termsAcceptedAt: '2026-06-01T00:00:00Z',
    privacyAcceptedAt: '2026-06-01T00:00:00Z',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'user-annual-buyer',
    phoneEncrypted: 'U2FsdGVkX1+annual',
    phoneHash: 'hash-13800000003',
    displayName: '王芳 (年度会员)',
    role: 'USER',
    isShadowBanned: false,
    isHardBanned: false,
    termsAcceptedAt: '2026-06-01T00:00:00Z',
    privacyAcceptedAt: '2026-06-01T00:00:00Z',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'user-tier2-seller',
    phoneEncrypted: 'U2FsdGVkX1+seller',
    phoneHash: 'hash-13800000004',
    displayName: '陈刚 (认证卖家)',
    role: 'USER',
    isShadowBanned: false,
    isHardBanned: false,
    termsAcceptedAt: '2026-06-01T00:00:00Z',
    privacyAcceptedAt: '2026-06-01T00:00:00Z',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'user-shadow-banned',
    phoneEncrypted: 'U2FsdGVkX1+shadow',
    phoneHash: 'hash-13800000005',
    displayName: '刘某 (被_shadow-ban卖家)',
    role: 'USER',
    isShadowBanned: true,
    isHardBanned: false,
    termsAcceptedAt: '2026-06-01T00:00:00Z',
    privacyAcceptedAt: '2026-06-01T00:00:00Z',
    createdAt: '2026-06-10T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
  },
  {
    id: 'user-admin',
    phoneEncrypted: 'U2FsdGVkX1+admin',
    phoneHash: 'hash-13800000006',
    displayName: 'Admin',
    role: 'ADMIN',
    isShadowBanned: false,
    isHardBanned: false,
    termsAcceptedAt: '2026-06-01T00:00:00Z',
    privacyAcceptedAt: '2026-06-01T00:00:00Z',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'user-moderator',
    phoneEncrypted: 'U2FsdGVkX1+mod',
    phoneHash: 'hash-13800000007',
    displayName: 'Moderator',
    role: 'MODERATOR',
    isShadowBanned: false,
    isHardBanned: false,
    termsAcceptedAt: '2026-06-01T00:00:00Z',
    privacyAcceptedAt: '2026-06-01T00:00:00Z',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
];

export const SEED_PHONES: Record<string, string> = {
  'user-free-buyer': '13800000001',
  'user-monthly-buyer': '13800000002',
  'user-annual-buyer': '13800000003',
  'user-tier2-seller': '13800000004',
  'user-shadow-banned': '13800000005',
  'user-admin': '13800000006',
  'user-moderator': '13800000007',
};

export const SEED_VERIFICATIONS: UserVerification[] = [
  {
    id: 'ver-tier2-seller',
    userId: 'user-tier2-seller',
    status: 'ID_VERIFIED',
    realNameHash: 'realname-hash-1',
    idCardHash: 'id-card-hash-1',
    idCardFrontUrl: '/placeholder-id-card.svg',
    ocrProvider: 'mock',
    reviewedAt: '2026-06-05T00:00:00Z',
    createdAt: '2026-06-04T00:00:00Z',
    updatedAt: '2026-06-05T00:00:00Z',
  },
  {
    id: 'ver-shadow',
    userId: 'user-shadow-banned',
    status: 'ID_VERIFIED',
    realNameHash: 'realname-hash-2',
    idCardHash: 'id-card-hash-2',
    idCardFrontUrl: '/placeholder-id-card.svg',
    ocrProvider: 'mock',
    reviewedAt: '2026-06-12T00:00:00Z',
    createdAt: '2026-06-11T00:00:00Z',
    updatedAt: '2026-06-12T00:00:00Z',
  },
];

// Demo listings (18 realistic entries across tier-1 cities) -----------------
const photo = (seed: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='%230ea5e9'/>
          <stop offset='1' stop-color='%231e3a5f'/>
        </linearGradient>
      </defs>
      <rect width='800' height='500' fill='url(%23g)'/>
      <rect x='200' y='180' width='400' height='200' rx='16' fill='rgba(255,255,255,0.15)' stroke='rgba(255,255,255,0.3)' stroke-width='2'/>
      <path d='M220 280 L400 160 L580 280' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='3'/>
      <rect x='260' y='280' width='80' height='100' fill='rgba(255,255,255,0.2)'/>
      <rect x='460' y='280' width='80' height='100' fill='rgba(255,255,255,0.2)'/>
      <rect x='360' y='320' width='80' height='60' fill='rgba(255,255,255,0.3)'/>
      <text x='400' y='440' text-anchor='middle' fill='white' font-family='sans-serif' font-size='24' font-weight='bold'>${seed}</text>
    </svg>`,
  )}`;

const makePhoto = (listingId: string, idx: number): ListingPhoto => ({
  id: `${listingId}-photo-${idx}`,
  listingId,
  url: photo(`${listingId}-${idx}`),
  pHash: `phash-${listingId}-${idx}`,
  sortOrder: idx,
  createdAt: '2026-06-01T00:00:00Z',
});

function listing(
  id: string,
  sellerId: string,
  city: string,
  district: string,
  title: string,
  priceWan: number,
  area: number,
  beds: number,
  baths: number,
  status: Listing['status'],
  createdAtDaysAgo: number,
): Listing {
  const created = new Date(Date.now() - createdAtDaysAgo * 86_400_000).toISOString();
  return {
    id,
    sellerId,
    title,
    description:
      '此房源采光通透，户型方正，所在小区物业管理严格，绿化覆盖率高。近地铁、商圈成熟、生活配套完善。房东诚售，价格可议，诚邀有缘之客。',
    city,
    district,
    addressDetail: `${city} ${district} No. ${Math.floor(Math.random() * 999)} Some Street`,
    lat: 31.23,
    lng: 121.47,
    geoHash: `${city.slice(0, 2)}-${district.slice(0, 2)}-hash`,
    priceRmbWan: priceWan,
    areaSqm: area,
    bedrooms: beds,
    bathrooms: baths,
    propertyType: 'SECOND_HAND',
    verificationStatus: status === 'ACTIVE' || status === 'PAUSED' ? 'VERIFIED' : 'PENDING',
    status,
    publishedAt: status === 'ACTIVE' ? created : null,
    createdAt: created,
    updatedAt: created,
  };
}

const listingDefs: Array<Parameters<typeof listing>> = [
  ['listing-1', 'user-tier2-seller', 'Shanghai', 'Pudond', '浦东陆家嘴 精装三房 70年产权诚意出售', 980, 128, 3, 2, 'ACTIVE', 5],
  ['listing-2', 'user-tier2-seller', 'Shanghai', 'Huangpu', '人民广场 历史保护建筑 老洋房空间', 2450, 240, 4, 3, 'ACTIVE', 8],
  ['listing-3', 'user-tier2-seller', 'Beijing', 'Chaoyang', '国贸CBD 高层视野极佳 拎包入住', 880, 96, 2, 1, 'ACTIVE', 10],
  ['listing-4', 'user-tier2-seller', 'Beijing', 'Haidian', '中关村 学区房 理工附中旁', 760, 88, 2, 1, 'ACTIVE', 12],
  ['listing-5', 'user-tier2-seller', 'Shenzhen', 'Nanshan', '深圳湾 海景大平层 满五唯一', 1350, 168, 4, 2, 'ACTIVE', 3],
  ['listing-6', 'user-tier2-seller', 'Shenzhen', 'Futian', '香蜜公园旁 物业管家 改善型首选', 920, 110, 3, 2, 'ACTIVE', 6],
  ['listing-7', 'user-tier2-seller', 'Hangzhou', 'Xihu', '西湖 直线距离800m 低密度花园洋房', 1100, 140, 3, 2, 'ACTIVE', 7],
  ['listing-8', 'user-tier2-seller', 'Hangzhou', 'Binjiang', '滨江 ALIBABA 旁 码农最爱', 680, 90, 2, 2, 'ACTIVE', 9],
  ['listing-9', 'user-tier2-seller', 'Chengdu', 'Jinjiang', '太古里 旁 精装小户 投资绝佳', 320, 65, 1, 1, 'ACTIVE', 2],
  ['listing-10', 'user-tier2-seller', 'Chengdu', 'Wuhou', '金融城 南北通透 改善社区', 480, 105, 3, 2, 'ACTIVE', 4],
  ['listing-11', 'user-tier2-seller', 'Nanjing', 'Xuanwu', '玄武湖畔 稀缺房源 精装修首期少', 530, 92, 2, 1, 'ACTIVE', 1],
  ['listing-12', 'user-tier2-seller', 'Nanjing', 'Gulou', '鼓楼区 老牌学区 力学小学旁', 620, 78, 2, 1, 'ACTIVE', 11],
  ['listing-13', 'user-tier2-seller', 'Wuhan', 'Wuchand', '武昌滨江 一线江景 豪华装修', 410, 100, 2, 2, 'ACTIVE', 15],
  ['listing-14', 'user-tier2-seller', 'Xiamen', 'Siming', '鼓浪屿 小三居 稀缺房源', 780, 105, 3, 2, 'ACTIVE', 18],
  ['listing-15', 'user-tier2-seller', 'Guangzhou', 'Tianhe', '珠江新城 改善户型 豪华社区', 950, 115, 3, 2, 'ACTIVE', 16],
  ['listing-16', 'user-tier2-seller', 'Suzhou', 'Gusu', '平江路 古城区 老宅翻新', 480, 90, 2, 1, 'ACTIVE', 20],
  ['listing-17', 'user-tier2-seller', 'Shanghai', 'Minhang', '浦江镇 地铁房 低密度联排', 620, 150, 4, 3, 'PENDING_VERIFICATION', 1],
  ['listing-18', 'user-shadow-banned', 'Beijing', 'Chaoyang', '故意挂低价格钓鱼 小心上当', 80, 90, 2, 1, 'ACTIVE', 9],
];

export const SEED_LISTINGS: Listing[] = listingDefs.map((d) => listing(...d));

export const SEED_PHOTOS: ListingPhoto[] = SEED_LISTINGS.flatMap((l) => [
  makePhoto(l.id, 0),
  makePhoto(l.id, 1),
]);

// OTP test codes (dev-only convenience; these expire via normal rules but are seeded
// 24 hours before demo sessions).
export const SEED_TEST_OTP = '123456';

// Saved listings ------------------------------------------------------------
export const SEED_SAVED: SavedListing[] = [
  { id: 'saved-1', userId: 'user-free-buyer', listingId: 'listing-1', createdAt: '2026-06-15T00:00:00Z' },
  { id: 'saved-2', userId: 'user-free-buyer', listingId: 'listing-3', createdAt: '2026-06-15T00:00:00Z' },
  { id: 'saved-3', userId: 'user-free-buyer', listingId: 'listing-5', createdAt: '2026-06-15T00:00:00Z' },
];

// Subscriptions -------------------------------------------------------------
export const SEED_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-monthly-1',
    userId: 'user-monthly-buyer',
    planCode: 'MONTHLY_PRO',
    status: 'ACTIVE',
    startsAt: '2026-06-15T00:00:00Z',
    endsAt: '2026-07-15T00:00:00Z',
    autoRenew: false,
    createdAt: '2026-06-15T00:00:00Z',
  },
  {
    id: 'sub-annual-1',
    userId: 'user-annual-buyer',
    planCode: 'ANNUAL_PRO',
    status: 'ACTIVE',
    startsAt: '2026-06-01T00:00:00Z',
    endsAt: '2027-06-01T00:00:00Z',
    autoRenew: true,
    createdAt: '2026-06-01T00:00:00Z',
  },
];

// Payment orders ------------------------------------------------------------
export const SEED_PAYMENT_ORDERS: PaymentOrder[] = [
  {
    outTradeNo: 'user-monthly-buyer_MONTHLY_PRO_seed001',
    userId: 'user-monthly-buyer',
    provider: 'ALIPAY',
    planCode: 'MONTHLY_PRO',
    amountFen: 2900,
    status: 'PAID',
    expiresAt: '2026-06-15T00:15:00Z',
    paidAt: '2026-06-15T00:05:00Z',
    providerPayload: { tradeNo: 'alipay-trade-seed-001' },
    createdAt: '2026-06-15T00:00:00Z',
    updatedAt: '2026-06-15T00:05:00Z',
  },
  {
    outTradeNo: 'user-annual-buyer_ANNUAL_PRO_seed002',
    userId: 'user-annual-buyer',
    provider: 'WECHATPAY',
    planCode: 'ANNUAL_PRO',
    amountFen: 19900,
    status: 'PAID',
    expiresAt: '2026-06-01T00:15:00Z',
    paidAt: '2026-06-01T00:05:00Z',
    providerPayload: { prepayId: 'wx-seed-002' },
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:05:00Z',
  },
  {
    outTradeNo: 'user-free-buyer_MONTHLY_PRO_seed003',
    userId: 'user-free-buyer',
    provider: 'ALIPAY',
    planCode: 'MONTHLY_PRO',
    amountFen: 2900,
    status: 'EXPIRED',
    expiresAt: '2026-06-15T00:15:00Z',
    paidAt: null,
    providerPayload: null,
    createdAt: '2026-06-15T00:00:00Z',
    updatedAt: '2026-06-15T00:15:00Z',
  },
  {
    outTradeNo: 'user-free-buyer_ANNUAL_PRO_seed004',
    userId: 'user-free-buyer',
    provider: 'WECHATPAY',
    planCode: 'ANNUAL_PRO',
    amountFen: 19900,
    status: 'PENDING_USER_PAY',
    expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    paidAt: null,
    providerPayload: { qrUrl: 'wechatmock-qr-seed-004' },
    createdAt: new Date(Date.now() - 3 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60_000).toISOString(),
  },
];

export const SEED_PAYMENT_AUDIT_LOGS: PaymentAuditLog[] = [
  {
    id: 'audit-1',
    orderId: 'user-monthly-buyer_MONTHLY_PRO_seed001',
    eventType: 'ORDER_CREATED',
    payload: {},
    createdAt: '2026-06-15T00:00:00Z',
  },
  {
    id: 'audit-2',
    orderId: 'user-monthly-buyer_MONTHLY_PRO_seed001',
    eventType: 'WEBHOOK_RECEIVED',
    payload: { tradeNo: 'alipay-trade-seed-001', status: 'TRADE_SUCCESS' },
    createdAt: '2026-06-15T00:05:00Z',
  },
  {
    id: 'audit-3',
    orderId: 'user-monthly-buyer_MONTHLY_PRO_seed001',
    eventType: 'SUBSCRIPTION_ACTIVATED',
    payload: {},
    createdAt: '2026-06-15T00:05:00Z',
  },
];

// Conversations -------------------------------------------------------------
export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    listingId: 'listing-1',
    buyerId: 'user-free-buyer',
    sellerId: 'user-tier2-seller',
    createdAt: '2026-06-20T10:00:00Z',
    updatedAt: '2026-06-20T12:00:00Z',
  },
  {
    id: 'conv-2',
    listingId: 'listing-3',
    buyerId: 'user-monthly-buyer',
    sellerId: 'user-tier2-seller',
    createdAt: '2026-06-19T09:00:00Z',
    updatedAt: '2026-06-19T11:30:00Z',
  },
];

export const SEED_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-free-buyer',
    body: '您好，房子还在吗？想预约看一下周末方便吗？',
    isFlagged: false,
    createdAt: '2026-06-20T11:00:00Z',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-tier2-seller',
    body: '在的，随时方便，可以约周六下午来看。',
    isFlagged: false,
    createdAt: '2026-06-20T12:00:00Z',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-2',
    senderId: 'user-monthly-buyer',
    body: '请加我微信 wechatid-abc123 详细谈',
    isFlagged: true,
    createdAt: '2026-06-19T11:00:00Z',
  },
];

// Broker signals ------------------------------------------------------------
export const SEED_BROKER_SIGNALS: BrokerSignal[] = [
  {
    id: 'signal-medium-1',
    userId: 'user-free-buyer',
    listingId: null,
    signalType: 'HIGH_FREQUENCY_VIEWING',
    severity: 'MEDIUM',
    score: 20,
    metadata: { viewCount: 34 },
    createdAt: '2026-06-26T10:00:00Z',
  },
  {
    id: 'signal-high-1',
    userId: 'user-shadow-banned',
    listingId: null,
    signalType: 'ALWAYS_VIEW_NEVER_ENGAGE',
    severity: 'HIGH',
    score: 50,
    metadata: { viewCount: 124, days: 7 },
    createdAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'signal-critical-1',
    userId: 'user-shadow-banned',
    listingId: null,
    signalType: 'ID_CARD_REUSE',
    severity: 'CRITICAL',
    score: 100,
    metadata: { reusedHash: 'id-card-hash-2' },
    createdAt: '2026-06-25T10:00:00Z',
  },
];

// Enforcement actions -------------------------------------------------------
export const SEED_ENFORCEMENTS: EnforcementAction[] = [
  {
    id: 'enforce-1',
    userId: 'user-shadow-banned',
    type: 'SHADOW_BAN',
    reason: '多次触发高风险 broker 信号（高频查看、从不联系、身份证复用）',
    metadata: { triggeredBy: 'system' },
    createdBy: 'user-admin',
    createdAt: '2026-06-25T10:00:00Z',
  },
];

// Reports -------------------------------------------------------------------
export const SEED_REPORTS: Report[] = [
  {
    id: 'report-1',
    reporterId: 'user-monthly-buyer',
    listingId: 'listing-18',
    reportedUserId: 'user-shadow-banned',
    reason: 'SUSPECTED_BROKER',
    details: '该房源价格是市价 1/10，极可能是钓鱼房源。',
    status: 'OPEN',
    createdAt: '2026-06-26T14:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'report-2',
    reporterId: 'user-annual-buyer',
    listingId: null,
    reportedUserId: 'user-shadow-banned',
    reason: 'DUPLICATE',
    details: '与多人共用同一号码注册多个账户',
    status: 'RESOLVED',
    createdAt: '2026-06-20T10:00:00Z',
    resolvedAt: '2026-06-21T10:00:00Z',
  },
];
