import { Card, CardBody } from '@/components/ui/card';
import { PendingListingsTable } from '@/components/admin/pending-listings-table';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function AdminListingsPage() {
  await requireAdmin();
  const t = await serverT();
  const pending = await store.listListings({ status: 'PENDING_VERIFICATION', includeShadowBanned: true });
  const allActive = await store.listListings({ status: 'ACTIVE' });

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t('admin.reviewListings')}</h1>
      <Card>
        <CardBody>
          <h2 className="mb-3 text-base font-semibold text-foreground">{t('admin.pendingN', { n: pending.length })}</h2>
          <PendingListingsTable listings={pending} />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h2 className="mb-3 text-base font-semibold text-foreground">{t('admin.activeN', { n: allActive.length })}</h2>
          <p className="text-sm text-muted-foreground">{t('admin.reviewHint')}</p>
        </CardBody>
      </Card>
    </main>
  );
}
