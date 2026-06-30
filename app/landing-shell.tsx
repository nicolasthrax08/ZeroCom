'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { ListingCard } from '@/components/listings/listing-card';
import { FadeIn, FadeInStagger } from '@/components/ui/fade-in';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import {
  ShieldCheck,
  Search,
  Lock,
  ArrowRight,
  KeyRound,
  MapPinned,
  BadgeCheck,
  MessagesSquare,
  ScanSearch,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { formatWan } from '@/lib/utils/money';
import type { Lang } from '@/lib/i18n/dictionary';
import type { Listing } from '@/server/data/types';

const DEFAULT_SAVINGS_PCT = 2.5;
const COMMISSION_RATE = 0.025;

function estimateSavings(priceWan: number, pct = DEFAULT_SAVINGS_PCT): number {
  return Math.round(priceWan * (pct / 100));
}

export function LandingShell({ listings }: { listings: Listing[] }) {
  const { lang } = useLanguage();
  return (
    <main className="luxury-shell overflow-hidden">
      <HeroSection lang={lang} />
      <SavingsCalculator />
      {listings.length > 0 && <FeaturedListings listings={listings} />}
      <StepsSection />
      <WhyUsSection />
    </main>
  );
}

function HeroSection({ lang }: { lang: Lang }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden pb-20 pt-16 text-ivory sm:pb-28 sm:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,181,109,0.34),transparent_62%)] blur-3xl animate-aurora" />
        <div className="absolute right-[-12rem] top-24 h-[38rem] w-[38rem] rounded-full bg-teal/20 blur-3xl animate-slow-pan" />
        <div className="absolute bottom-8 left-[-10rem] h-[34rem] w-[34rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="map-grid absolute inset-0 opacity-35" />
      </div>

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <FadeIn className="max-w-3xl">
          <h1 className="max-w-4xl text-5xl font-black tracking-[-0.06em] text-ivory sm:text-7xl lg:text-8xl">
            {t('hero.title')}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ivory/72 sm:text-xl" data-testid="landing-hero">
            {t('hero.subtitle')}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/listings">
              <Button variant="accent" size="lg" className="group w-full sm:w-auto">
                {t('hero.cta.browse')}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/18 bg-white/8 text-ivory backdrop-blur hover:bg-white/14 sm:w-auto"
              >
                {t('hero.cta.pricing')}
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center text-sm text-ivory/68">
            {[
              ['¥0', lang === 'en' ? 'commission' : '佣金'],
              ['Direct', lang === 'en' ? 'owner contact' : '房东直连'],
              ['Verified', lang === 'en' ? 'safer listings' : '已核验'],
            ].map(([value, label]) => (
              <div key={value} className="glass-panel rounded-2xl px-3 py-4">
                <div className="text-xl font-bold text-ivory">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-ivory/46">{label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={140} direction="left">
          <HeroVisual lang={lang} />
        </FadeIn>
      </div>
    </section>
  );
}

function HeroVisual({ lang }: { lang: Lang }) {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md sm:max-w-lg"
      aria-hidden="true"
    >
      {/* Soft glow concentrated behind the scene */}
      <div className="absolute inset-1/4 rounded-full bg-champagne/15 blur-3xl" />

      {/* Orbital ring — purely decorative structure */}
      <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
      <div className="absolute inset-[12%] rounded-full border border-white/[0.04]" />

      {/* Main property card — centered */}
      <div className="absolute inset-0 m-auto w-[60%] sm:w-[58%]">
        <div className="glass-panel interactive-tilt h-full w-full rounded-[1.6rem] p-3.5 shadow-luxury animate-float">
          <div className="relative h-40 overflow-hidden rounded-[1.2rem] bg-gradient-to-b from-[#1a2b2e] to-[#0a1113]">
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-champagne/25 to-transparent" />
            <div className="absolute inset-x-6 bottom-0 flex items-end justify-center gap-1.5">
              <div className="h-12 w-8 rounded-t-sm bg-midnight/60" />
              <div className="h-20 w-10 rounded-t-sm bg-midnight/70" />
              <div className="h-28 w-14 rounded-t-md bg-midnight/85 shadow-gold">
                <div className="grid grid-cols-3 gap-1 p-2 pt-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-2.5 rounded-[1px] bg-champagne/40" />
                  ))}
                </div>
              </div>
              <div className="h-20 w-10 rounded-t-sm bg-midnight/70" />
              <div className="h-14 w-8 rounded-t-sm bg-midnight/60" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-teal/30 to-teal/10" />
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-ivory/90 px-2 py-0.5 text-[10px] font-bold text-accent shadow-soft">
              <ShieldCheck size={10} /> DirectMatch
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-sm font-semibold text-ivory">{lang === 'en' ? 'Riverside owner listing' : '河畔 · 房东直售'}</div>
              <div className="mt-0.5 text-[11px] text-ivory/50">Shanghai · 128㎡</div>
            </div>
            <Badge tone="accent" className="bg-ivory/90 text-xs">¥0佣</Badge>
          </div>
        </div>
      </div>

      {/* Satellite chip — top-right, on the orbital ring */}
      <div className="absolute right-0 top-[18%] w-44 sm:w-48">
        <div className="glass-panel animate-float rounded-2xl p-3 shadow-soft [animation-delay:600ms]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-champagne text-midnight">
              <KeyRound size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-ivory">{lang === 'en' ? 'Direct reveal' : '直接查看'}</div>
              <div className="text-[10px] text-ivory/50">{lang === 'en' ? 'No broker handoff' : '无中介经手'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Satellite chip — bottom-left, on the orbital ring */}
      <div className="absolute bottom-[14%] left-0 w-48 sm:w-52">
        <div className="glass-panel animate-float rounded-2xl p-3 shadow-soft [animation-delay:1000ms]">
          <div className="mb-2 flex items-center justify-between text-[11px] text-ivory/60">
            <span>{lang === 'en' ? 'Neighborhood pulse' : '周边动态'}</span>
            <MapPinned size={12} className="text-teal" />
          </div>
          <div className="relative h-16 overflow-hidden rounded-xl border border-white/10 bg-midnight/50">
            <div className="map-grid absolute inset-0 opacity-70" />
            <div className="absolute left-3 top-2 h-3 w-3 rounded-full border-2 border-champagne bg-midnight" />
            <div className="absolute bottom-2 right-4 h-2.5 w-2.5 rounded-full border-2 border-teal bg-midnight" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SavingsCalculator() {
  const { t, lang } = useLanguage();
  const price = 800;
  const saved = estimateSavings(price);
  return (
    <section className="container-page relative -mt-10 pb-14 sm:-mt-16">
      <ScrollReveal>
        <div className="ivory-panel mx-auto grid max-w-5xl gap-6 rounded-[2rem] p-5 sm:p-7 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between rounded-[1.5rem] bg-midnight p-6 text-ivory">
            <div>
              <h2 className="mt-8 text-3xl font-black tracking-tight sm:text-4xl">{t('calc.title')}</h2>
              <p className="mt-3 text-sm leading-6 text-ivory/62">
                {t('calc.savings')} <strong className="text-champagne">{formatWan(saved)}</strong>。
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label={t('calc.price')} value={formatWan(price)} />
            <MetricCard label={t('calc.traditional')} value={formatWan(Math.round(price * COMMISSION_RATE))} muted />
            <MetricCard label={t('calc.pro')} value="¥199" accent />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function MetricCard({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-[1.4rem] border p-5 ${accent ? 'border-champagne/45 bg-gradient-to-br from-accent to-champagne text-white shadow-gold' : 'border-border/80 bg-white/50'}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${accent ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</p>
      <p className={`mt-4 text-3xl font-black tabular-nums ${muted ? 'text-muted-foreground line-through' : accent ? 'text-white' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}

function FeaturedListings({ listings }: { listings: Listing[] }) {
  const { t } = useLanguage();
  return (
    <section className="container-page py-16 sm:py-24">
      <ScrollReveal>
        <SectionTitle kicker="Live marketplace" title={t('landing.featured')} subtitle={t('landing.featured.sub')} />
      </ScrollReveal>
      <FadeInStagger step={80} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </FadeInStagger>
      <ScrollReveal delay={120} className="mt-10 text-center">
        <Link href="/listings">
          <Button variant="outline" size="lg">
            {t('hero.cta.browse')}
            <ArrowRight size={16} />
          </Button>
        </Link>
      </ScrollReveal>
    </section>
  );
}

function StepsSection() {
  const { t } = useLanguage();
  const steps = [
    { n: '01', title: t('step.1'), desc: t('step.1.desc'), icon: BadgeCheck },
    { n: '02', title: t('step.2'), desc: t('step.2.desc'), icon: ScanSearch },
    { n: '03', title: t('step.3'), desc: t('step.3.desc'), icon: MessagesSquare },
  ];
  return (
    <section className="relative overflow-hidden bg-[#f3eadc] py-20 sm:py-28">
      <div className="map-grid absolute inset-0 opacity-45" />
      <div className="container-page relative">
        <ScrollReveal>
          <SectionTitle kicker="How it works" title={t('landing.steps')} subtitle={t('landing.steps.sub')} />
        </ScrollReveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 100}>
              <Card className="interactive-tilt h-full">
                <CardBody className="p-6">
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-13 w-13 h-14 w-14 items-center justify-center rounded-2xl bg-midnight text-champagne shadow-soft">
                      <s.icon size={24} />
                    </div>
                    <span className="text-5xl font-black tracking-tighter text-champagne/45">{s.n}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{s.desc}</p>
                </CardBody>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const { t } = useLanguage();
  const trust = [
    { icon: ShieldCheck, name: t('trust.verified'), desc: t('trust.verified.desc') },
    { icon: Search, name: t('trust.direct'), desc: t('trust.direct.desc') },
    { icon: Lock, name: t('trust.antiBroker'), desc: t('trust.antiBroker.desc') },
  ];
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <ScrollReveal>
          <div className="sticky top-24">
            <span className="section-kicker">Trust architecture</span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-5xl">{t('landing.whyUs')}</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">{t('landing.whyUs.sub')}</p>
          </div>
        </ScrollReveal>
        <div className="space-y-4">
          {trust.map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 100}>
              <Card className="interactive-tilt">
                <CardBody className="flex gap-5 p-6 sm:p-7">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-soft to-ivory text-accent shadow-soft">
                    <item.icon size={25} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-foreground">{item.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                  </div>
                </CardBody>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type KickerKey = 'Savings model' | 'Live marketplace' | 'How it works' | 'Trust architecture' | 'Zero commission';
const KICKER: Record<KickerKey, Record<Lang, string>> = {
  'Savings model': { zh: '佣金节省模型', en: 'Savings model' },
  'Live marketplace': { zh: '真实在售', en: 'Live marketplace' },
  'How it works': { zh: '如何上手', en: 'How it works' },
  'Trust architecture': { zh: '信任架构', en: 'Trust architecture' },
  'Zero commission': { zh: '零佣金', en: 'Zero commission' },
};

function SectionTitle({ kicker, title, subtitle }: { kicker: KickerKey; title: string; subtitle?: string }) {
  const { lang } = useLanguage();
  return (
    <div className="mb-10 text-center sm:mb-12">
      <span className="section-kicker">{KICKER[kicker][lang]}</span>
      <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
