'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/lib/i18n/language-context';
import type { DictKey } from '@/lib/i18n/dictionary';

const ITEMS: { href: string; labelKey: DictKey }[] = [
  { href: '/admin', labelKey: 'admin.overview' },
  { href: '/admin/listings', labelKey: 'admin.listingsReview' },
  { href: '/admin/reports', labelKey: 'admin.reports' },
  { href: '/admin/broker-risk', labelKey: 'admin.brokerRiskSidebar' },
  { href: '/admin/appeals', labelKey: 'admin.appealsSidebar' },
  { href: '/admin/payments', labelKey: 'admin.paymentsSidebar' },
];

export function AdminSidebar({ current }: { current: string }) {
  const { t } = useLanguage();
  return (
    <aside className="w-48 shrink-0 border-r border-border bg-muted/40 p-4">
      <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">{t('admin.sidebarTitle')}</p>
      <ul className="space-y-1">
        {ITEMS.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm',
                current === i.href ? 'bg-accent-soft text-accent' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(i.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
