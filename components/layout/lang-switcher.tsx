'use client';
import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import type { Lang } from '@/lib/i18n/dictionary';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
];

export function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-border/65 bg-white/35 p-2 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:bg-ivory hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        aria-label={t('lang.switcherAria')}
        aria-expanded={open}
      >
        <Globe size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-border/70 bg-ivory/95 py-1 shadow-luxury backdrop-blur-xl">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition hover:bg-white/65 ${
                lang === l.code ? 'font-semibold text-accent' : 'text-foreground'
              }`}
            >
              {l.label}
              {lang === l.code && <span className="text-accent">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
