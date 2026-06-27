import { Card, CardBody } from '@/components/ui/card';
import { ReportsQueue } from '@/components/admin/reports-queue';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  await requireAdmin();
  const reports = await store.listReports();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-foreground">举报队列</h1>
      <Card className="mt-4">
        <CardBody>
          <ReportsQueue reports={reports} />
        </CardBody>
      </Card>
    </main>
  );
}
