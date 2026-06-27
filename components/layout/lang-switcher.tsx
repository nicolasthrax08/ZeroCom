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
  const { lang, setLang } = useLanguage();
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
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Switch language"
      >
        <Globe size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border border-border bg-background py-1 shadow-lg">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-1.5 text-sm hover:bg-muted ${
                lang === l.code ? 'text-accent font-medium' : 'text-foreground'
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
