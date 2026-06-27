// Bilingual dictionary for ZeroCom UI.
// Keys are stable identifiers; values are the string in each language.

export type Lang = 'zh' | 'en';

export const dictionary = {
  // Header / nav
  'nav.browse': { zh: '浏览房源', en: 'Browse' },
  'nav.pricing': { zh: '会员方案', en: 'Pricing' },
  'nav.sell': { zh: '发布房源', en: 'List' },
  'nav.admin': { zh: '后台管理', en: 'Admin' },
  'nav.dashboard': { zh: '我的', en: 'Dashboard' },
  'nav.login': { zh: '登录', en: 'Log in' },
  'nav.signup': { zh: '免费注册', en: 'Sign up' },
  'nav.logout': { zh: '退出', en: 'Log out' },

  // Hero
  'hero.badge': { zh: '零佣金 · 直连 · 无中介', en: 'Zero commission · Direct · No middleman' },
  'hero.title': { zh: '买房卖房，零佣金直连', en: 'Buy & sell real estate with zero commission' },
  'hero.subtitle': {
    zh: 'ZeroCom 让房东与买家直接见面。让每一分房款都留在该留的地方 —— 卖家保住产权，买家省下佣金。',
    en: 'ZeroCom connects sellers and buyers directly. Every yuan stays where it belongs — sellers keep their equity, buyers save on fees.',
  },
  'hero.cta.browse': { zh: '浏览房源', en: 'Browse listings' },
  'hero.cta.pricing': { zh: '了解会员方案', en: 'View pricing' },

  // Landing sections
  'landing.featured': { zh: '精选房源', en: 'Featured listings' },
  'landing.featured.sub': { zh: '真实上架 · 业主直卖', en: 'Live listings · Owner direct' },
  'landing.steps': { zh: '三步上手', en: 'Get started in 3 steps' },
  'landing.steps.sub': { zh: '简洁流程，保持透明', en: 'Simple process, full transparency' },
  'landing.whyUs': { zh: '为什么选 ZeroCom', en: 'Why ZeroCom' },
  'landing.whyUs.sub': { zh: '信任，是我们唯一的产品', en: 'Trust is our only product' },
  'landing.start': { zh: '开始你的零佣金之旅', en: 'Start your zero-commission journey' },
  'landing.start.sub': {
    zh: '实名、合规、透明 — 专为中国大陆的房东与买家打造。',
    en: 'Verified, compliant, transparent — built for sellers and buyers in Mainland China.',
  },
  'landing.cta.signup': { zh: '注册', en: 'Sign up' },

  // Trust items
  'trust.verified': { zh: '实名 + GPS 验证', en: 'Verified identity + GPS' },
  'trust.verified.desc': { zh: '所有房源均需实名、GPS 核验通过。', en: 'Every listing requires verified identity and GPS check.' },
  'trust.direct': { zh: '无中介直连', en: 'Direct, no middleman' },
  'trust.direct.desc': { zh: '买家直接联系卖家，佣金黄牛彻底消失。', en: 'Buyers contact sellers directly. Commission brokers are gone.' },
  'trust.antiBroker': { zh: '反中介机制', en: 'Anti-broker system' },
  'trust.antiBroker.desc': { zh: '高频浏览、证件复用等行为将被识别与处置。', en: 'High-frequency browsing, ID reuse, etc. are detected and acted on.' },

  // Steps
  'step.1': { zh: '注册', en: 'Sign up' },
  'step.1.desc': { zh: '中国大陆手机号 + 6 位短信验证即可开始。', en: 'Mainland China phone + 6-digit SMS code to start.' },
  'step.2': { zh: '浏览', en: 'Browse' },
  'step.2.desc': { zh: '按城市、区域、价格、户型筛选。', en: 'Filter by city, district, price, bedrooms.' },
  'step.3': { zh: '联系', en: 'Connect' },
  'step.3.desc': { zh: '成为 Pro 即可查看直连联系方式。', en: 'Go Pro to reveal direct contact info.' },

  // Savings calculator
  'calc.title': { zh: '佣金节省估算', en: 'Commission savings estimate' },
  'calc.price': { zh: '房价', en: 'Price' },
  'calc.traditional': { zh: '传统佣金（约 2.5%）', en: 'Traditional commission (~2.5%)' },
  'calc.pro': { zh: 'ZeroCom Pro 一年', en: 'ZeroCom Pro annual' },
  'calc.savings': { zh: '使用 ZeroCom，这笔交易省下约', en: 'With ZeroCom, you save about' },

  // Listings
  'listings.title': { zh: '浏览房源', en: 'Browse listings' },
  'listings.empty': { zh: '暂无房源', en: 'No listings yet' },
  'listings.empty.desc': { zh: '尝试调整筛选条件或稍后再来', en: 'Try adjusting filters or check back later' },
  'listings.filter.city': { zh: '城市', en: 'City' },
  'listings.filter.cityAll': { zh: '全城', en: 'All' },
  'listings.filter.district': { zh: '区域', en: 'District' },
  'listings.filter.districtAll': { zh: '不限', en: 'Any' },
  'listings.filter.minPrice': { zh: '最低价（万）', en: 'Min price (万)' },
  'listings.filter.maxPrice': { zh: '最高价（万）', en: 'Max price (万)' },
  'listings.filter.bedrooms': { zh: '卧室数', en: 'Bedrooms' },
  'listings.filter.bedroomsAll': { zh: '不限', en: 'Any' },
  'listings.filter.keyword': { zh: '关键词', en: 'Keyword' },
  'listings.filter.keywordPlaceholder': { zh: '标题、描述', en: 'Title, description' },
  'listings.filter.apply': { zh: '筛选', en: 'Apply' },
  'listings.back': { zh: '房源列表', en: 'Listings' },
  'listings.sqm': { zh: '元/㎡', en: 'CNY/㎡' },
  'listings.description': { zh: '房源描述', en: 'Description' },
  'listings.mapPlaceholder': { zh: '生产环境接入高德/百度地图', en: 'Gaode/Baidu Maps in production' },
  'listings.published': { zh: '发布于', en: 'Published' },
  'listings.sellerInfo': { zh: '卖家信息', en: 'Seller info' },
  'listings.verified': { zh: '实名认证：', en: 'Identity verified:' },
  'listings.verifiedYes': { zh: '已通过', en: 'Verified' },
  'listings.verifiedDesc': { zh: '该卖家已通过实名 + ID OCR 核验，与 ZeroCom 认证。', en: 'This seller has passed ID + OCR verification with ZeroCom.' },
  'listings.report': { zh: '举报可疑房源', en: 'Report suspicious listing' },
  'listings.reportDesc': { zh: '如发现疑似中介、虚假房源或诱骗行为，欢迎举报。我们将在 24 小时内处理。', en: 'If you spot a broker, fake listing, or scam, please report. We respond within 24 hours.' },
  'listings.reportBtn': { zh: '举报', en: 'Report' },
  'listings.contactSeller': { zh: '联系卖家', en: 'Contact seller' },
  'listings.loading': { zh: '加载中…', en: 'Loading…' },
  'listings.yourListing': { zh: '这是你的房源。', en: 'This is your listing.' },
  'listings.notActive': { zh: '房源已下架或移除，无法联系。', en: 'Listing is off-market or removed.' },
  'listings.subscribePrompt': { zh: '订阅 Pro 后，在「保存」或「发消息」后即可直接联系卖家。', en: 'Subscribe to Pro, then save or message to reveal contact.' },
  'listings.unlockContact': { zh: '解锁直接联系', en: 'Unlock direct contact' },
  'listings.proPrompt': { zh: 'Pro 用户需要先「保存房源」或「发消息」才会显示完整联系方式，防止中介批量导出。', en: 'Pro users must save or message first to reveal contact — prevents bulk scraping.' },
  'listings.directMatch': { zh: 'DirectMatch™ 认证 · 房东-买家直连，非中介牵线', en: 'DirectMatch™ verified · Seller-buyer direct, no broker' },
  'listings.reminder': { zh: '提醒：仅限个人看房使用', en: 'Reminder: personal viewing use only' },
  'listings.safetyNotice': { zh: '请保持平台沟通，切勿向陌生人转账。如有可疑中介行为，欢迎举报。', en: 'Keep communication on-platform. Never transfer money to strangers. Report suspicious broker behavior.' },
  'listings.yourListingNote': { zh: '你的房源 · 不计入免费浏览额度', en: 'Your listing · does not count against free views' },
  'listings.maskedPhone': { zh: '微信：WX****', en: 'WeChat: WX****' },

  // Listing card
  'card.bedrooms': { zh: '室', en: '' },
  'card.bathrooms': { zh: '卫', en: '' },
  'card.sqm': { zh: '㎡', en: '㎡' },
  'card.noImage': { zh: '暂无图片', en: 'No image' },

  // Status badges
  'status.active': { zh: '已上架', en: 'Active' },
  'status.paused': { zh: '已下架', en: 'Paused' },
  'status.sold': { zh: '已成交', en: 'Sold' },
  'status.pending': { zh: '审核中', en: 'Pending' },
  'status.draft': { zh: '草稿', en: 'Draft' },
  'status.removed': { zh: '已移除', en: 'Removed' },
  'status.verified': { zh: '已核验', en: 'Verified' },
  'status.secondHand': { zh: '二手房', en: 'Second-hand' },
  'status.new': { zh: '新房', en: 'New' },
  'status.rental': { zh: '出租', en: 'Rental' },
  'status.verifiedOwner': { zh: '已实名', en: 'Verified' },

  // Pricing
  'pricing.title': { zh: '订阅方案透明', en: 'Transparent pricing' },
  'pricing.subtitle': { zh: 'ZeroCom 永远不收交易佣金。一次订阅，无隐藏费用。30 天内可无理由退款。', en: 'ZeroCom never charges transaction commission. One subscription, no hidden fees. 30-day refund policy.' },
  'pricing.free': { zh: '免费', en: 'Free' },
  'pricing.free.forever': { zh: '永不扣费', en: 'Never charged' },
  'pricing.monthly': { zh: '月度 Pro', en: 'Monthly Pro' },
  'pricing.monthly.cadence': { zh: '/30 天 · 可随时取消', en: '/30 days · cancel anytime' },
  'pricing.annual': { zh: '年度 Pro', en: 'Annual Pro' },
  'pricing.annual.cadence': { zh: '/365 天 · 自动续期', en: '/365 days · auto-renews' },
  'pricing.current': { zh: '当前方案', en: 'Current plan' },
  'pricing.subscribeMonth': { zh: '订阅月度', en: 'Subscribe monthly' },
  'pricing.subscribeAnnual': { zh: '订阅年度', en: 'Subscribe annual' },
  'pricing.feature.views': { zh: '每日 {n} 个房源详情', en: '{n} listing details / day' },
  'pricing.feature.messages': { zh: '每日 {n} 条消息', en: '{n} messages / day' },
  'pricing.feature.saved': { zh: '最多 {n} 个收藏', en: 'Up to {n} saved' },
  'pricing.feature.basicFilter': { zh: '基础筛选', en: 'Basic filters' },
  'pricing.feature.maskedContact': { zh: '联系方式隐藏', en: 'Contact hidden' },
  'pricing.feature.unlimitedViews': { zh: '无限浏览房源', en: 'Unlimited browsing' },
  'pricing.feature.unlimitedMessages': { zh: '无限消息 · 无限收藏', en: 'Unlimited messages & saved' },
  'pricing.feature.directContact': { zh: '直接联系卖家（电话/微信）', en: 'Direct contact (phone / WeChat)' },
  'pricing.feature.advancedFilter': { zh: '高级筛选（学区、地铁距离）', en: 'Advanced filters (schools, metro)' },
  'pricing.feature.dailyEmail': { zh: '每日精选房源邮件', en: 'Daily curated listings email' },
  'pricing.feature.boost': { zh: '房源排序额外加权', en: 'Listing boost in search' },
  'pricing.feature.verifiedTag': { zh: 'Verified Owner 标签', en: 'Verified Owner badge' },
  'pricing.feature.push': { zh: '实时推送匹配', en: 'Real-time matching alerts' },
  'pricing.feature.priority': { zh: '房源排序最高优先级', en: 'Highest listing priority' },
  'pricing.feature.discount': { zh: '42% 折扣（相比月度）', en: '42% off vs monthly' },
  'pricing.feature.priceChart': { zh: '价格趋势图', en: 'Price trend chart' },

  // Auth
  'auth.title': { zh: '登录 / 注册', en: 'Log in / Sign up' },
  'auth.subtitle': { zh: '输入手机号，获取 6 位验证码完成登录。新用户将自动创建账户。', en: 'Enter your phone, get a 6-digit code. New users are created automatically.' },
  'auth.terms': { zh: '同意《服务条款》《隐私政策》后，方可创建或登录账户。', en: 'By continuing you agree to the Terms of Service and Privacy Policy.' },
  'auth.sendFailed': { zh: '发送失败', en: 'Send failed' },

  // Footer
  'footer.tagline': { zh: '零佣金 · 房东买家直接见面', en: 'Zero commission · Sellers and buyers meet directly' },
  'footer.product': { zh: '产品', en: 'Product' },
  'footer.trust': { zh: '信任与安全', en: 'Trust & Safety' },
  'footer.report': { zh: '举报可疑', en: 'Report' },
  'footer.appeal': { zh: '申诉', en: 'Appeal' },
  'footer.legal': { zh: '法律', en: 'Legal' },
  'footer.terms': { zh: '服务条款', en: 'Terms of Service' },
  'footer.privacy': { zh: '隐私政策', en: 'Privacy Policy' },
  'footer.refunds': { zh: '退款政策', en: 'Refund Policy' },
  'footer.disclaimer': { zh: '仅在中国大陆提供服务 · 本阶段不代收交易款、不收佣金', en: 'Available in Mainland China only · We currently do not hold transaction funds or charge commission' },

  // Common
  'common.you': { zh: '你', en: 'you' },
} as const;

export type DictKey = keyof typeof dictionary;

export function translate(key: DictKey, lang: Lang, params?: Record<string, string | number>): string {
  const entry = dictionary[key];
  if (!entry) return key;
  let value: string = entry[lang];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return value;
}
