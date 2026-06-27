'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { ListingCard } from '@/components/listings/listing-card';
import { FadeIn, FadeInStagger } from '@/components/ui/fade-in';
import { ShieldCheck, Search, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { formatWan } from '@/lib/utils/money';
import { store } from '@/server/data/store';

const DEFAULT_SAVINGS_PCT = 2.5;
const COMMISSION_RATE = 0.025;

function estimateSavings(priceWan: number, pct = DEFAULT_SAVINGS_PCT): number {
  return Math.round(priceWan * (pct / 100));
}

export function LandingShell({ listings }: { listings: Awaited<ReturnType<typeof store.listListings>> }) {
  return (
    <main>
      <HeroSection />
      <SavingsCalculator />
      <FeaturedListings listings={listings} />
      <StepsSection />
      <WhyUsSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="container-page py-16">
      <FadeIn className="mx-auto max-w-3xl text-center">
        <Badge tone="accent" className="mb-3">{t('hero.badge')}</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg" data-testid="landing-hero">
          {t('hero.subtitle')}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/listings">
            <Button variant="accent">{t('hero.cta.browse')}</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline">{t('hero.cta.pricing')}</Button>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

function SavingsCalculator() {
  const { t } = useLanguage();
  const price = 800;
  const saved = estimateSavings(price);
  return (
    <section className="container-page">
      <Card>
        <CardBody>
          <h3 className="text-base font-semibold text-foreground">{t('calc.title')}</h3>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">{t('calc.price')}</p>
              <p className="text-3xl font-bold text-foreground tabular-nums">{formatWan(price)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('calc.traditional')}</p>
              <p className="text-3xl font-bold text-muted-foreground tabular-nums line-through">{formatWan(Math.round(price * COMMISSION_RATE))}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('calc.pro')}</p>
              <p className="text-3xl font-bold text-accent tabular-nums">¥199</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {t('calc.savings')} <strong className="text-accent">{formatWan(saved)}</strong>。
          </p>
        </CardBody>
      </Card>
    </section>
  );
}

function FeaturedListings({ listings }: { listings: Awaited<ReturnType<typeof store.listListings>> }) {
  const { t } = useLanguage();
  return (
    <section className="container-page py-12">
      <FadeIn>
        <SectionTitle title={t('landing.featured')} subtitle={t('landing.featured.sub')} />
      </FadeIn>
      <FadeInStagger step={70} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </FadeInStagger>
    </section>
  );
}

function StepsSection() {
  const { t } = useLanguage();
  const steps = [
    { n: '1', title: t('step.1'), desc: t('step.1.desc') },
    { n: '2', title: t('step.2'), desc: t('step.2.desc') },
    { n: '3', title: t('step.3'), desc: t('step.3.desc') },
  ];
  return (
    <section className="container-page py-12">
      <FadeIn>
        <SectionTitle title={t('landing.steps')} subtitle={t('landing.steps.sub')} />
      </FadeIn>
      <FadeInStagger step={80} className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.n}>
            <CardBody>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                {s.n}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </CardBody>
          </Card>
        ))}
      </FadeInStagger>
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
    <section className="bg-muted/40 py-16">
      <div className="container-page">
        <FadeIn>
          <SectionTitle title={t('landing.whyUs')} subtitle={t('landing.whyUs.sub')} />
        </FadeIn>
        <FadeInStagger step={80} className="grid gap-4 md:grid-cols-3">
          {trust.map((item) => (
            <Card key={item.name}>
              <CardBody>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <item.icon size={22} />
                </div>
                <h4 className="font-semibold text-foreground">{item.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </CardBody>
            </Card>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}

function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="container-page py-16 text-center">
      <FadeIn zoom>
        <Card>
          <CardBody>
            <h2 className="text-2xl font-semibold text-foreground">{t('landing.start')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('landing.start.sub')}</p>
            <div className="mt-4 flex justify-center gap-2">
              <Link href="/listings">
                <Button variant="accent">{t('hero.cta.browse')}</Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline">{t('landing.cta.signup')}</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </FadeIn>
    </section>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
