'use client';

import Link from 'next/link';
import { Home, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export function Footer() {
  const { t, lang } = useLanguage();
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-midnight text-ivory">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-champagne/12 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal/8 blur-3xl" />
        <div className="map-grid absolute inset-0 opacity-25" />
      </div>
      <div className="container-page relative grid gap-10 py-12 text-sm text-ivory/68 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-lg font-bold text-ivory">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-champagne to-teal/80 text-midnight shadow-gold">
              <Home size={18} />
            </span>
            ZeroCom
          </Link>
          <p className="max-w-sm leading-relaxed">{t('footer.tagline')}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-ivory/78">
              <ShieldCheck size={13} /> DirectMatch
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-ivory/78">
              <Sparkles size={13} /> {lang === 'en' ? 'Zero commission' : '零佣金'}
            </span>
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold text-ivory">{t('footer.product')}</p>
          <ul className="space-y-2">
            <li><Link className="luxury-link hover:text-ivory" href="/listings">{t('nav.browse')}</Link></li>
            <li><Link className="luxury-link hover:text-ivory" href="/pricing">{t('nav.pricing')}</Link></li>
            <li><Link className="luxury-link hover:text-ivory" href="/seller">{t('nav.sell')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-ivory">{t('footer.trust')}</p>
          <ul className="space-y-2">
            <li><Link className="luxury-link hover:text-ivory" href="/report">{t('footer.report')}</Link></li>
            <li><Link className="luxury-link hover:text-ivory" href="/appeal">{t('footer.appeal')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-ivory">{t('footer.legal')}</p>
          <ul className="space-y-2">
            <li><Link className="luxury-link hover:text-ivory" href="/legal/terms.html">{t('footer.terms')}</Link></li>
            <li><Link className="luxury-link hover:text-ivory" href="/legal/privacy.html">{t('footer.privacy')}</Link></li>
            <li><Link className="luxury-link hover:text-ivory" href="/refunds">{t('footer.refunds')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page relative border-t border-white/10 pb-7 pt-5 text-xs text-ivory/52">
        © {new Date().getFullYear()} ZeroCom · {t('footer.disclaimer')}
      </div>
    </footer>
  );
}
