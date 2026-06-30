'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export function DisclaimerFooter() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-muted/30 py-4">
      <div className="container-page text-xs text-muted-foreground">
        <p className="mb-2">
          <strong>{t('disclaimer.title')}：</strong>
          {t('disclaimer.body')}
        </p>
        <p className="mb-2">
          &copy; {new Date().getFullYear()} ZeroCom · contact@zerocom.app
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/legal/privacy.html" className="underline hover:text-foreground">Privacy Policy</Link>
          <Link href="/legal/terms.html" className="underline hover:text-foreground">Terms of Service</Link>
          <Link href="/refunds" className="underline hover:text-foreground">Refund Policy</Link>
        </p>
      </div>
    </footer>
  );
}
