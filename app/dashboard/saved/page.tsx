import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function SavedPage() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const t = await serverT();
  const saved = await store.listSaved(user.id);
  const listings = (
    await Promise.all(saved.map((s) => store.findListingById(s.listingId)))
  ).filter((l): l is NonNullable<typeof l> => !!l && l.status === 'ACTIVE');

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t('dash.savedListings')}</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.length === 0 ? (
          <EmptyState
            title={t('dash.savedEmpty')}
            description={t('dash.savedEmpty.desc')}
            action={
              <Link href="/listings">
                <Button variant="accent">{t('dash.browse')}</Button>
              </Link>
            }
          />
        ) : (
          listings.map((l) => <ListingCard key={l.id} listing={l} />)
        )}
      </div>
    </main>
  );
}
