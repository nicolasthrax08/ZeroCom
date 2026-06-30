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

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('mobile.menuAria')}
        aria-expanded={open}
        className="rounded-full border border-border/70 bg-white/35 p-2 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>
      <div
        className={`absolute left-0 top-16 w-full border-b border-border/70 bg-ivory/95 shadow-luxury backdrop-blur-2xl transition-all duration-300 ease-luxury md:hidden ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <ul className="space-y-1 p-4">
          {items.map((i, idx) => (
            <li key={i.href} className="animate-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <Link
                href={i.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold transition-colors hover:bg-white/60"
              >
                {t(i.labelKey)}
                <ChevronRight size={14} className="text-muted-foreground" />
              </Link>
            </li>
          ))}
          <li className="border-t border-border/70 pt-3">
            <Link href="/auth" onClick={() => setOpen(false)}>
              <Button variant="accent" size="sm" className="w-full">
                {t('nav.login')} / {t('nav.signup')}
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
