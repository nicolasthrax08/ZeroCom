import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';

export const dynamic = 'force-dynamic';

export default async function SavedPage() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const saved = await store.listSaved(user.id);
  const listings = (
    await Promise.all(saved.map((s) => store.findListingById(s.listingId)))
  ).filter((l): l is NonNullable<typeof l> => !!l && l.status === 'ACTIVE');

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">已保存房源</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.length === 0 ? (
          <EmptyState
            title="暂未保存房源"
            description="浏览房源时点击「保存」即可加入收藏。"
            action={
              <Link href="/listings">
                <Button variant="accent">浏览房源</Button>
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
