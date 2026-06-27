'use client';

import { ListingFilters } from '@/components/listings/listing-filters';
import { ListingCard } from '@/components/listings/listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn, FadeInStagger } from '@/components/ui/fade-in';
import { useLanguage } from '@/lib/i18n/language-context';

export function ListingsContent({ listings }: { listings: Awaited<ReturnType<typeof import('@/server/data/store').store.listListings>> }) {
  const { t } = useLanguage();

  return (
    <main className="container-page py-8 space-y-4">
      <FadeIn>
        <h1 className="text-2xl font-semibold text-foreground">{t('listings.title')}</h1>
      </FadeIn>
      <FadeIn delay={60}>
        <ListingFilters />
      </FadeIn>
      {listings.length === 0 ? (
        <FadeIn>
          <EmptyState title={t('listings.empty')} description={t('listings.empty.desc')} />
        </FadeIn>
      ) : (
        <FadeInStagger step={70} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </FadeInStagger>
      )}
    </main>
  );
}
