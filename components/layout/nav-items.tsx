'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';
import type { DictKey } from '@/lib/i18n/dictionary';

export function NavLabel({ k }: { k: DictKey }) {
  const { t } = useLanguage();
  return <>{t(k)}</>;
}

export function NavItems({ items }: { items: { href: string; labelKey: DictKey }[] }) {
  const { t } = useLanguage();
  return (
    <>
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className="luxury-link rounded-full px-3.5 py-2 text-sm font-medium text-foreground/72 transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          {t(i.labelKey)}
        </Link>
      ))}
    </>
  );
}
