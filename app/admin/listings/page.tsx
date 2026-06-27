import { Card, CardBody } from '@/components/ui/card';
import { PendingListingsTable } from '@/components/admin/pending-listings-table';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';

export const dynamic = 'force-dynamic';

export default async function AdminListingsPage() {
  await requireAdmin();
  const pending = await store.listListings({ status: 'PENDING_VERIFICATION', includeShadowBanned: true });
  const allActive = await store.listListings({ status: 'ACTIVE' });

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-foreground">房源审核</h1>
      <Card>
        <CardBody>
          <h2 className="mb-3 text-base font-semibold text-foreground">待审核 ({pending.length})</h2>
          <PendingListingsTable listings={pending} />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h2 className="mb-3 text-base font-semibold text-foreground">已上架 ({allActive.length})</h2>
          <p className="text-sm text-muted-foreground">使用房源详情中的「移除 / 下架」功能进行单项操作。</p>
        </CardBody>
      </Card>
    </main>
  );
}
