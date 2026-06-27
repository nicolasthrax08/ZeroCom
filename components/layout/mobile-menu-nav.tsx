'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import type { DictKey } from '@/lib/i18n/dictionary';

export function MobileMenuNav({ items }: { items: { href: string; labelKey: DictKey }[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen((v) => !v)} aria-label="菜单" className="rounded p-1 hover:bg-muted">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="absolute left-0 top-14 w-full border-b border-border bg-background p-4 shadow-sm">
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {t(i.labelKey)}
                  <ChevronRight size={14} className="text-muted-foreground" />
                </Link>
              </li>
            ))}
            <li className="border-t border-border pt-2">
              <Link href="/auth" onClick={() => setOpen(false)}>
                <Button variant="accent" size="sm" className="w-full">
                  {t('nav.login')} / {t('nav.signup')}
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
