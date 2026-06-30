import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export const metadata = {
  title: '服务条款 · ZeroCom',
  description: 'ZeroCom 服务条款 — ZeroCom 房产交易平台用户协议。',
};

export default function TermsPage() {
  const { lang } = useLanguage();
  const en = lang === 'en';
  const t = (zh: string, enStr: string) => (en ? enStr : zh);

  return (
    <main className="container-page py-12">
      <article className="prose prose-sm max-w-3xl text-foreground">
        <h1>{t('服务条款', 'Terms of Service')}</h1>
        <p className="text-muted-foreground">{t('最后更新：2026-06-28', 'Last updated: 2026-06-28')}</p>

        <p>
          {t(
            '本服务条款（"条款"）构成您（"用户"）与 ZeroCom（"我们"）之间的法律约束协议。访问或使用 ZeroCom 平台（"服务"），即表示您同意受本条款约束。',
            'These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and ZeroCom ("we", "us", or "our"). By accessing or using the ZeroCom platform (the "Service"), you agree to be bound by these Terms.',
          )}
        </p>

        <h2>{t('1. 准入资格', '1. Eligibility')}</h2>
        <ul>
          <li>{t('您必须年满 18 周岁，具有完全民事行为能力。', 'You must be at least 18 years old and capable of forming a binding contract.')}</li>
          <li>{t('您必须是自然人（非机器人、爬虫或自动化代理）。', 'You must be a natural person (not a bot, scraper, or automated agent).')}</li>
          <li>{t('您的使用须遵守包括《个人信息保护法》、GDPR 在内的所有适用法律法规。', 'Your use must comply with all applicable laws including PIPL, GDPR, and local regulations.')}</li>
        </ul>

        <h2>{t('2. 账户与认证', '2. Account & Authentication')}</h2>
        <ul>
          <li>{t('您必须提供有效的中国大陆手机号进行 OTP 认证。', 'You must provide a valid Mainland China phone number for OTP-based authentication.')}</li>
          <li>{t('您有责任保护自身会话的机密性。', 'You are responsible for maintaining the confidentiality of your session.')}</li>
          <li>{t('您不得将账户共享、出售或转让给任何第三方。', 'You must not share, sell, or transfer your account to any third party.')}</li>
          <li>{t('我们保留暂停或终止违反本条款的账户的权利。', 'We reserve the right to suspend or terminate accounts that violate these Terms.')}</li>
        </ul>

        <h2>{t('3. 可接受使用', '3. Acceptable Use')}</h2>
        <p>{t('您承诺不：', 'You agree NOT to:')}</p>
        <ul>
          <li>{t('以房产经纪人、代理人或机构卖家身份使用平台（经授权的除外）。', 'Use the platform as a real-estate broker, agent, or institutional seller (unless authorized).')}</li>
          <li>{t('发布虚假、误导或欺诈性房源。', 'Post false, misleading, or fraudulent listings.')}</li>
          <li>{t('上传侵犯知识产权、隐私权或其他权利的内容。', 'Upload content that infringes intellectual property, privacy, or other rights.')}</li>
          <li>{t('尝试逆向工程、爬取或破坏平台。', 'Attempt to reverse-engineer, scrape, or disrupt the platform.')}</li>
          <li>{t('绕过速率限制、访问控制或安全措施。', 'Circumvent rate limits, access controls, or security measures.')}</li>
          <li>{t('利用平台进行洗钱、欺诈或其他违法活动。', 'Use the platform to facilitate money laundering, fraud, or other illegal activity.')}</li>
        </ul>

        <h2>{t('4. 实名认证', '4. Identity Verification')}</h2>
        <p>
          {t(
            'ZeroCom 要求通过手机号与身份证 OCR 完成实名认证。使用服务即表示您依据《个人信息保护法》及反欺诈相关规定同意该认证流程。拒绝认证将限制您使用房源发布与消息功能。',
            'ZeroCom requires real-name verification via phone number and ID card OCR. By using the Service, you consent to this verification process in accordance with PIPL and anti-fraud regulations. Refusal to verify limits your access to listing and messaging features.',
          )}
        </p>

        <h2>{t('5. 房源与内容', '5. Listings & Content')}</h2>
        <ul>
          <li>{t('您保留上传内容的所有权，但授予 ZeroCom 在平台展示该内容的许可。', 'You retain ownership of content you upload, but grant ZeroCom a license to display it on the platform.')}</li>
          <li>{t('您保证房源信息真实、合法，不侵犯第三方权利。', 'You warrant that your listings are accurate, legal, and do not violate third-party rights.')}</li>
          <li>{t('我们有权在未经事先通知的情况下移除或审核违反政策的房源。', 'We may remove or moderate listings that violate our policies without prior notice.')}</li>
        </ul>

        <h2>{t('6. 订阅与支付', '6. Subscriptions & Payments')}</h2>
        <ul>
          <li>{t('ZeroCom 采用订阅制（月度 ¥29 / 年度 ¥199）。', 'ZeroCom operates on a subscription model (Monthly ¥29 / Annual ¥199).')}</li>
          <li>{t('支付通过支付宝或微信支付完成。我们不存储支付卡信息。', 'Payments are processed via Alipay or WeChat Pay. We do not store payment card details.')}</li>
          <li>{t('购买后 30 天内可退款（见<Link href="/refunds">退款政策</Link>）。', 'Refunds are available within 30 days of purchase (see <Link href="/refunds">Refund Policy</Link>).')}</li>
          <li>{t('我们保留提前 30 天通知后调整价格的权利。', 'We reserve the right to change pricing with 30 days\' advance notice.')}</li>
        </ul>

        <h2>{t('7. 隐私与数据', '7. Privacy & Data')}</h2>
        <p>
          {t(
            '您的使用受我们的<Link href="/legal/privacy.html">隐私政策</Link>约束。使用服务即表示您同意其中所述的数据收集与使用方式。',
            'Your use is governed by our <Link href="/legal/privacy.html">Privacy Policy</Link>. By using the Service, you consent to the collection and use of your data as described therein.',
          )}
        </p>

        <h2>{t('8. 知识产权', '8. Intellectual Property')}</h2>
        <p>
          {t(
            'ZeroCom 平台，包括其设计、代码、品牌和内容，归 ZeroCom 所有，受版权、商标和其他知识产权法律保护。',
            'The ZeroCom platform, including its design, code, branding, and content, is owned by ZeroCom and protected by copyright, trademark, and other intellectual property laws.',
          )}
        </p>

        <h2>{t('9. 终止', '9. Termination')}</h2>
        <p>
          {t(
            '任一方均可随时终止本协议。如您违反本条款，我们可立即暂停或终止您的访问权限。终止后您使用服务的权利即告终止，但有关责任、知识产权和争议解决的条款仍然有效。',
            'Either party may terminate this agreement at any time. We may suspend or terminate your access immediately if you violate these Terms. Upon termination, your right to use the Service ceases, but provisions regarding liability, IP, and dispute resolution survive.',
          )}
        </p>

        <h2>{t('10. 责任限制', '10. Limitation of Liability')}</h2>
        <p>
          {t(
            '在法律允许的最大范围内，ZeroCom 不对因您使用服务而产生的间接、附带、特殊、后果性或惩罚性损害承担责任。我们的赔偿责任总额不超过您在索赔前 12 个月内向我们支付的金额。',
            'To the maximum extent permitted by law, ZeroCom shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.',
          )}
        </p>

        <h2>{t('11. 赔偿', '11. Indemnification')}</h2>
        <p>
          {t(
            '您同意赔偿并使 ZeroCom 免受因您使用服务或违反本条款而产生的任何索赔、损害或费用。',
            'You agree to indemnify and hold harmless ZeroCom from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.',
          )}
        </p>

        <h2>{t('12. 争议解决', '12. Dispute Resolution')}</h2>
        <p>
          {t(
            '本条款受中华人民共和国法律管辖。任何争议应通过中华人民共和国法院解决。',
            'These Terms are governed by the laws of the People\'s Republic of China. Any disputes shall be resolved through the courts of the PRC.',
          )}
        </p>

        <h2>{t('13. 条款变更', '13. Changes to Terms')}</h2>
        <p>
          {t(
            '我们可随时修改本条款。重大变更将在生效前至少 30 天通过电子邮件或应用内通知告知。变更后继续使用即表示接受修改后的条款。',
            'We may modify these Terms at any time. Material changes will be communicated via email or in-app notification at least 30 days before taking effect. Continued use after changes constitutes acceptance of the modified Terms.',
          )}
        </p>

        <h2>{t('14. 联系方式', '14. Contact')}</h2>
        <p>
          {t('如有疑问，请联系：', 'For questions about these Terms:')}<br />
          {t('邮箱：', 'Email: ')}<a href="mailto:legal@zerocom.app">legal@zerocom.app</a>
        </p>

        <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
          <p>
            {t('相关：', 'Related: ')}<Link href="/legal/privacy.html">{t('隐私政策', 'Privacy Policy')}</Link> ·{' '}
            <Link href="/refunds">{t('退款政策', 'Refund Policy')}</Link>
          </p>
        </div>
      </article>
    </main>
  );
}
