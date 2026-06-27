'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const ITEMS = [
  { href: '/admin', label: '概览' },
  { href: '/admin/listings', label: '房源审核' },
  { href: '/admin/reports', label: '举报' },
  { href: '/admin/broker-risk', label: 'Broker 风险' },
  { href: '/admin/appeals', label: '申诉' },
  { href: '/admin/payments', label: '支付订单' },
];

export function AdminSidebar({ current }: { current: string }) {
  return (
    <aside className="w-48 shrink-0 border-r border-border bg-muted/40 p-4">
      <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">后台管理</p>
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
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
