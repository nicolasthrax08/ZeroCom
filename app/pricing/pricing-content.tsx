'use client';

import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { FREE_VIEWS_PER_DAY, FREE_MESSAGES_PER_DAY, FREE_SAVED_LIMIT } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n/language-context';

export function PricingContent() {
  const { t } = useLanguage();

  const features = (key: string) => {
    switch (key) {
      case 'FREE':
        return [
          t('pricing.feature.views', { n: String(FREE_VIEWS_PER_DAY) }),
          t('pricing.feature.messages', { n: String(FREE_MESSAGES_PER_DAY) }),
          t('pricing.feature.saved', { n: String(FREE_SAVED_LIMIT) }),
          t('pricing.feature.basicFilter'),
          t('pricing.feature.maskedContact'),
        ];
      case 'MONTHLY_PRO':
        return [
          t('pricing.feature.unlimitedViews'),
          t('pricing.feature.unlimitedMessages'),
          t('pricing.feature.directContact'),
          t('pricing.feature.advancedFilter'),
          t('pricing.feature.dailyEmail'),
          t('pricing.feature.boost'),
          t('pricing.feature.verifiedTag'),
        ];
      case 'ANNUAL_PRO':
        return [
          t('pricing.feature.unlimitedViews'),
          t('pricing.feature.push'),
          t('pricing.feature.priority'),
          t('pricing.feature.discount'),
          t('pricing.feature.priceChart'),
        ];
      default:
        return [];
    }
  };

  const plans = [
    {
      key: 'FREE',
      name: t('pricing.free'),
      price: '¥0',
      cadence: t('pricing.free.forever'),
      highlight: false,
      cta: t('pricing.current'),
    },
    {
      key: 'MONTHLY_PRO',
      name: t('pricing.monthly'),
      price: '¥29',
      cadence: t('pricing.monthly.cadence'),
      highlight: true,
      cta: t('pricing.subscribeMonth'),
    },
    {
      key: 'ANNUAL_PRO',
      name: t('pricing.annual'),
      price: '¥199',
      cadence: t('pricing.annual.cadence'),
      highlight: false,
      cta: t('pricing.subscribeAnnual'),
    },
  ];

  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold text-foreground">{t('pricing.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('pricing.subtitle')}</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.key} className={p.highlight ? 'border-accent ring-2 ring-accent/20' : ''}>
            <CardBody className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
              <p>
                <span className="text-4xl font-bold tabular-nums text-foreground">{p.price}</span>
                <span className="ml-1 text-xs text-muted-foreground">{p.cadence}</span>
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {features(p.key).map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={{ pathname: '/checkout', query: { plan: p.key } }}>
                <Button variant={p.highlight ? 'accent' : 'outline'} className="w-full">
                  {p.cta}
                </Button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
