import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export const metadata = {
  title: '隐私政策 · ZeroCom',
  description: 'ZeroCom 隐私政策 — 符合 GDPR/CCPA/PIPL。',
};

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const en = lang === 'en';
  const t = (zh: string, enStr: string) => (en ? enStr : zh);

  return (
    <main className="container-page py-12">
      <article className="prose prose-sm max-w-3xl text-foreground">
        <h1>{t('隐私政策', 'Privacy Policy')}</h1>
        <p className="text-muted-foreground">{t('最后更新：2026-06-28', 'Last updated: 2026-06-28')}</p>

        <p>
          {t(
            '本隐私政策说明 ZeroCom（"我们"、"我方"）在您使用 ZeroCom 平台（"服务"）时如何收集、使用、披露和保护您的个人信息。本政策符合欧盟《通用数据保护条例》(GDPR)、《加州消费者隐私法》(CCPA/CPRA) 以及中国《个人信息保护法》(PIPL)。',
            'This Privacy Policy explains how ZeroCom ("we", "us", or "our") collects, uses, discloses, and safeguards your personal information when you use the ZeroCom platform (the "Service"). This policy complies with the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA/CPRA), and China\'s Personal Information Protection Law (PIPL).',
          )}
        </p>

        <h2>{t('1. 数据控制者', '1. Data Controller')}</h2>
        <p>
          {t(
            '就 GDPR 与 PIPL 而言，数据控制者为 ZeroCom。如需联系数据保护官，请发送邮件至 ',
            'For the purposes of GDPR and PIPL, the data controller is ZeroCom. Contact our Data Protection Officer at ',
          )}
          <a href="mailto:privacy@zerocom.app">privacy@zerocom.app</a>。
        </p>

        <h2>{t('2. 我们收集的信息', '2. Information We Collect')}</h2>
        <h3>{t('2.1 您提供的信息', '2.1 Information You Provide')}</h3>
        <ul>
          <li><strong>{t('账户数据：', 'Account data:')}</strong>{t('手机号（哈希处理）、昵称、角色。', 'phone number (hashed), display name, role.')}</li>
          <li><strong>{t('实名认证：', 'Identity verification:')}</strong>{t('真实姓名、身份证号（加密）、身份证图像。', 'real name, ID card number (encrypted), ID card images.')}</li>
          <li><strong>{t('房源数据：', 'Listing data:')}</strong>{t('房源照片、描述、地址、价格。', 'property photos, descriptions, addresses, pricing.')}</li>
          <li><strong>{t('通信内容：', 'Communications:')}</strong>{t('通过平台发送的消息。', 'messages sent through the platform.')}</li>
          <li><strong>{t('支付数据：', 'Payment data:')}</strong>{t('订阅订单、交易 ID、金额、支付渠道。我们从不存储完整支付卡号。', 'subscription orders, transaction IDs, amount, provider. We never store full payment card numbers.')}</li>
        </ul>
        <h3>{t('2.2 自动收集的信息', '2.2 Information Collected Automatically')}</h3>
        <ul>
          <li><strong>{t('设备数据：', 'Device data:')}</strong>{t('IP 地址、浏览器类型、操作系统、设备标识符。', 'IP address, browser type, OS, device identifiers.')}</li>
          <li><strong>{t('使用数据：', 'Usage data:')}</strong>{t('访问页面、操作行为、时间戳。', 'pages visited, actions taken, timestamps.')}</li>
          <li><strong>{t('位置数据：', 'Location data:')}</strong>{t('基于 IP 的粗略位置（未经同意不收集精确 GPS）。', 'coarse location derived from IP (we do not collect precise GPS without consent).')}</li>
        </ul>

        <h2>{t('3. 处理的法律依据（GDPR）', '3. Legal Basis for Processing (GDPR)')}</h2>
        <ul>
          <li><strong>{t('合同：', 'Contract:')}</strong>{t('为提供服务所必需的处理（第 6(1)(b) 条）。', 'processing necessary to provide the Service (Art. 6(1)(b)).')}</li>
          <li><strong>{t('法定义务：', 'Legal obligation:')}</strong>{t('实名认证、税务记录、反欺诈（第 6(1)(c) 条）。', 'identity verification, tax records, fraud prevention (Art. 6(1)(c)).')}</li>
          <li><strong>{t('正当利益：', 'Legitimate interest:')}</strong>{t('平台安全、反欺诈、数据分析（第 6(1)(f) 条）。', 'platform security, anti-fraud, analytics (Art. 6(1)(f)).')}</li>
          <li><strong>{t('同意：', 'Consent:')}</strong>{t('营销通信、可选的数据共享（第 6(1)(a) 条）。', 'marketing communications, optional data sharing (Art. 6(1)(a)).')}</li>
        </ul>

        <h2>{t('4. 我们如何使用您的信息', '4. How We Use Your Information')}</h2>
        <p>{t('我们使用您的数据以：', 'We use your data to:')}</p>
        <ul>
          <li>{t('提供、维护和改进服务。', 'Provide, maintain, and improve the Service.')}</li>
          <li>{t('实名认证并防止欺诈。', 'Verify your identity and prevent fraud.')}</li>
          <li>{t('处理订阅与支付。', 'Process subscriptions and payments.')}</li>
          <li>{t('发送服务相关通知（OTP、账户提醒）。', 'Send service-related notifications (OTP, account alerts).')}</li>
          <li>{t('遵守法律义务并响应合法请求。', 'Comply with legal obligations and respond to lawful requests.')}</li>
          <li>{t('以聚合（非可识别）形式分析平台使用情况。', 'Analyze platform usage in aggregate (non-identifying) form.')}</li>
        </ul>

        <h2>{t('5. 数据共享与第三方', '5. Data Sharing & Third Parties')}</h2>
        <p>{t('我们<strong>不</strong>出售您的个人数据。仅在以下情况下共享数据：', 'We do <strong>not</strong> sell your personal data. We share data only with:')}</p>
        <ul>
          <li><strong>{t('支付处理方：', 'Payment processors:')}</strong>{t('支付宝 / 微信支付（仅用于交易处理）。', 'Alipay / WeChat Pay (transaction processing only).')}</li>
          <li><strong>{t('云基础设施：', 'Cloud infrastructure:')}</strong>{t('托管、CDN、短信提供商（签署数据处理协议）。', 'hosting, CDN, SMS providers (under DPA).')}</li>
          <li><strong>{t('法律机关：', 'Legal authorities:')}</strong>{t('法律要求或合法程序要求时。', 'when required by law or valid legal process.')}</li>
        </ul>

        <h2>{t('6. 国际数据传输', '6. International Data Transfers')}</h2>
        <p>
          {t(
            '第一阶段仅在中国大陆运营。任何未来的跨境传输将符合 PIPL 要求：标准合同条款、安全评估或您的明确同意。对于 GDPR 主体，我们将确保具备充分保障措施。',
            'Phase 1 operates solely within Mainland China. Any future cross-border transfer will comply with PIPL requirements: standard contractual clauses, security assessment, or your explicit consent. For GDPR subjects, we ensure adequate safeguards are in place.',
          )}
        </p>

        <h2>{t('7. 数据保留', '7. Data Retention')}</h2>
        <p>
          {t(
            '账户删除后我们保留个人数据 365 天，或按法律要求保留。支付记录可能为税务合规保留最多 7 年。保留期届满后，数据将被安全删除或不可逆匿名化。',
            'We retain personal data for 365 days after account deletion or as required by law. Payment records may be retained up to 7 years for tax compliance. After retention periods expire, data is securely deleted or irreversibly anonymized.',
          )}
        </p>

        <h2>{t('8. 您的权利', '8. Your Rights')}</h2>
        <h3>{t('GDPR（EEA/英国用户）', 'GDPR (EEA/UK users)')}</h3>
        <p>
          {t(
            '您有权：访问、更正、删除、限制处理、数据携带、反对处理，以及随时撤回同意。行使这些权利请发送邮件至 ',
            'You have the right to: access, rectify, erase, restrict processing, data portability, object to processing, and withdraw consent at any time. To exercise these rights, email ',
          )}
          <a href="mailto:privacy@zerocom.app">privacy@zerocom.app</a>。
        </p>
        <h3>{t('CCPA/CPRA（加州用户）', 'CCPA/CPRA (California users)')}</h3>
        <p>
          {t(
            '您有权：了解收集了哪些个人信息、请求删除、拒绝出售个人信息（我们不出售数据），以及行使权利时不受歧视。',
            'You have the right to: know what personal information is collected, request deletion, opt-out of any sale of personal information (we do not sell data), and non-discrimination for exercising your rights.',
          )}
        </p>
        <h3>{t('PIPL（中国用户）', 'PIPL (China users)')}</h3>
        <p>
          {t(
            '您有权：访问、更正、删除、携带数据，以及撤回同意。联系我们：',
            'You have the right to: access, correct, delete, port your data, and withdraw consent. Contact us at ',
          )}
          <a href="mailto:privacy@zerocom.app">privacy@zerocom.app</a>。
        </p>

        <h2>{t('9. Cookie 与跟踪', '9. Cookies & Tracking')}</h2>
        <p>
          {t(
            'ZeroCom 使用必要的 Cookie 进行身份验证（会话 Cookie）和偏好存储（语言）。我们不使用第三方广告 Cookie。有关 Cookie 使用的更多详情，请参阅我们的<Link href="/legal/terms.html">服务条款</Link>。',
            'ZeroCom uses essential cookies for authentication (session cookie) and preference storage (language). We do not use third-party advertising cookies. See our <Link href="/legal/terms.html">Terms of Service</Link> for more details on cookie usage.',
          )}
        </p>

        <h2>{t('10. 安全', '10. Security')}</h2>
        <p>
          {t(
            '我们采用行业标准安全措施：传输层 TLS 加密、手机号 HMAC-SHA256 哈希、敏感字段加密存储、访问控制和审计日志。尽管我们尽力，没有系统能做到 100% 安全。如有安全顾虑，请联系 ',
            'We implement industry-standard security measures: TLS encryption in transit, HMAC-SHA256 for phone hashing, encrypted storage for sensitive fields, access controls, and audit logging. Despite our efforts, no system is 100% secure. Report security concerns to ',
          )}
          <a href="mailto:privacy@zerocom.app">privacy@zerocom.app</a>。
        </p>

        <h2>{t('11. 未成年人隐私', '11. Children\'s Privacy')}</h2>
        <p>
          {t(
            'ZeroCom 不面向 16 周岁以下用户。我们不会故意收集未成年人的数据。如认为未成年人已向我们提供个人数据，请联系我们以删除。',
            'ZeroCom is not intended for users under 16. We do not knowingly collect data from children. If you believe a child has provided us with personal data, contact us for deletion.',
          )}
        </p>

        <h2>{t('12. 政策变更', '12. Changes to This Policy')}</h2>
        <p>
          {t(
            '我们可能定期更新本隐私政策。重大变更将在生效前至少 30 天通过电子邮件或应用内通知告知。变更后继续使用即表示接受。',
            'We may update this Privacy Policy periodically. Material changes will be communicated via email or in-app notification at least 30 days before taking effect. Continued use after changes constitutes acceptance.',
          )}
        </p>

        <h2>{t('13. 联系我们', '13. Contact Us')}</h2>
        <p>
          {t('如有隐私问题、数据访问请求或疑虑，请联系：', 'For privacy questions, data access requests, or concerns:')}<br />
          {t('邮箱：', 'Email: ')}<a href="mailto:privacy@zerocom.app">privacy@zerocom.app</a>
        </p>

        <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
          <p>
            {t('相关：', 'Related: ')}<Link href="/legal/terms.html">{t('服务条款', 'Terms of Service')}</Link> ·{' '}
            <Link href="/refunds">{t('退款政策', 'Refund Policy')}</Link>
          </p>
        </div>
      </article>
    </main>
  );
}
