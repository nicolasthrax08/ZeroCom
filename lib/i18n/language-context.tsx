'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type Lang, translate, type DictKey } from './dictionary';

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: DictKey, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const COOKIE = 'zerocom_lang';

function readCookie(): Lang {
  if (typeof document === 'undefined') return 'zh';
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]*)`));
  const val = match ? decodeURIComponent(match[1]) : '';
  return val === 'en' ? 'en' : 'zh';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readCookie);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000`;
    document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN';
  }, []);

  const t = useCallback((key: DictKey, params?: Record<string, string | number>) => translate(key, lang, params), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
