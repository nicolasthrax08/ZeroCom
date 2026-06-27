export const FREE_VIEWS_PER_DAY = 5;
export const FREE_MESSAGES_PER_DAY = 10;
export const FREE_SAVED_LIMIT = 10;
export const OTP_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_TTL_SECONDS = 300;
export const VIEW_DEBOUNCE_SECONDS = 30;
export const ORDER_EXPIRE_MINUTES = 15;
export const PHONE_REGEX = /^1[3-9]\d{9}$/;

// Demo phone numbers used in seed data and dev OTP flows.
export const SEED_PHONES = [
  '13800000001',
  '13800000002',
  '13800000003',
  '13800000004',
  '13800000005',
  '13800000006',
  '13800000007',
];

export const CITIES = [
  'Shanghai',
  'Beijing',
  'Shenzhen',
  'Hangzhou',
  'Chengdu',
  'Nanjing',
  'Wuhan',
  'Xiamen',
  'Guangzhou',
  'Suzhou',
] as const;

export const DISTRICTS_BY_CITY: Record<string, string[]> = {
  Shanghai: ['Pudong', 'Huangpu', 'Xuhui', 'Jing\'an', 'Changning', 'Minhang'],
  Beijing: ['Chaoyang', 'Haidian', 'Dongcheng', 'Xicheng', 'Fengtai', 'Tongzhou'],
  Shenzhen: ['Nanshan', 'Futian', 'Luohu', 'Bao\'an', 'Longgang', 'Yantian'],
  Hangzhou: ['Xihu', 'Binjiang', 'Shangcheng', 'Gongshu', 'Yuhang', 'Xiaoshan'],
  Chengdu: ['Jinjiang', 'Qingyang', 'Wuhou', 'Chenghua', 'Jinniu', 'Gaoxin'],
  Nanjing: ['Xuanwu', 'Jianye', 'Gulou', 'Qixia', 'Yuhuatai', 'Jiangning'],
  Wuhan: ['Wuchang', 'Hanyang', 'Jiangxia', 'Hongshan', 'Dongxihu', 'Huangpi'],
  Xiamen: ['Siming', 'Huli', 'Jimei', 'Haicang', 'Tongan', 'Xiang\'an'],
  Guangzhou: ['Tianhe', 'Yuexiu', 'Haizhu', 'Panyu', 'Baiyun', 'Huangpu'],
  Suzhou: ['Gusu', 'Wuzhong', 'Xiangcheng', 'Huqiu', 'Wujiang', 'Changshu'],
};

export const PROPERTY_TYPES = [
  { key: 'SECOND_HAND', label: '二手房' },
  { key: 'NEW', label: '新房' },
  { key: 'RENTAL', label: '租房' },
] as const;

export const BROKER_SIGNAL_TYPES = [
  'HIGH_FREQUENCY_VIEWING',
  'GEO_SKIP_PATTERN',
  'ALWAYS_VIEW_NEVER_ENGAGE',
  'MULTIPLE_PHONES_SAME_DEVICE',
  'ID_CARD_REUSE',
  'LISTING_HIJACK',
  'OFF_PLATFORM_REDIRECT',
  'IP_ASN_CLUSTER',
  'HONEYPOT_ACCESS',
] as const;

export const ENFORCEMENT_ACTIONS = [
  'SOFT_WARNING',
  'VERIFICATION_CHALLENGE',
  'SHADOW_BAN',
  'HARD_BAN',
  'LISTING_PURGE',
] as const;

export function formatPrice(wan: number): string {
  return `${wan}万`;
}

export function maskPhone(phone: string): string {
  if (phone.length !== 11) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(7)}`;
}
