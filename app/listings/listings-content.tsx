'use client';

import { ListingFilters } from '@/components/listings/listing-filters';
import { ListingCard } from '@/components/listings/listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn, FadeInStagger } from '@/components/ui/fade-in';
import { useLanguage } from '@/lib/i18n/language-context';

export function ListingsContent({ listings }: { listings: Awaited<ReturnType<typeof import('@/server/data/store').store.listListings>> }) {
  const { t } = useLanguage();

  return (
    <main className="relative overflow-hidden pb-16">
      <div className="absolute inset-x-0 top-0 h-80 bg-midnight" />
      <div className="map-grid absolute inset-x-0 top-0 h-96 opacity-35" />
      <div className="container-page relative space-y-6 py-10 sm:py-14">
        <FadeIn>
          <div className="max-w-3xl text-ivory">
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{t('listings.title')}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ivory/68">{t('listings.subtitle')}</p>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <ListingFilters />
        </FadeIn>
        {listings.length === 0 ? (
          <FadeIn>
            <EmptyState title={t('listings.empty')} description={t('listings.empty.desc')} />
          </FadeIn>
        ) : (
          <FadeInStagger step={70} className="grid grid-cols-1 gap-5 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </FadeInStagger>
        )}
      </div>
    </main>
  );
}
