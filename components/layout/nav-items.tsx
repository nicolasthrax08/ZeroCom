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
          className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {t(i.labelKey)}
        </Link>
      ))}
    </>
  );
}
