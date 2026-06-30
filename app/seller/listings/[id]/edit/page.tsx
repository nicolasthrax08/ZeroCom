import { notFound } from 'next/navigation';
import { ListingForm } from '@/components/seller/listing-form';
import { requireUser } from '@/server/auth';
import { store } from '@/server/data/store';
import { SEED_PHONES } from '@/server/data/seed-data';
import { Card } from '@/components/ui/card';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const listing = await store.findListingById(id);
  if (!listing) return notFound();
  const t = await serverT();
  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t('seller.editTitle')}</h1>
      <Card className="mt-4">
        <div className="p-5">
          <p className="mb-4 text-sm text-muted-foreground">{t('seller.listingId')}{listing.id}</p>
        </div>
      </Card>
    </main>
  );
}
