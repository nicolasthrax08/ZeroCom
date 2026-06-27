'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container-page grid grid-cols-2 gap-6 py-10 text-sm text-muted-foreground md:grid-cols-4">
        <div>
          <p className="mb-2 font-semibold text-foreground">ZeroCom</p>
          <p>{t('footer.tagline')}</p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-foreground">{t('footer.product')}</p>
          <ul className="space-y-1">
            <li><Link href="/listings">{t('nav.browse')}</Link></li>
            <li><Link href="/pricing">{t('nav.pricing')}</Link></li>
            <li><Link href="/seller">{t('nav.sell')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-foreground">{t('footer.trust')}</p>
          <ul className="space-y-1">
            <li><Link href="/report">{t('footer.report')}</Link></li>
            <li><Link href="/appeal">{t('footer.appeal')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-foreground">{t('footer.legal')}</p>
          <ul className="space-y-1">
            <li><Link href="/terms">{t('footer.terms')}</Link></li>
            <li><Link href="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link href="/refunds">{t('footer.refunds')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page pb-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ZeroCom · {t('footer.disclaimer')}
      </div>
    </footer>
  );
}
