import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  await requireAdmin();
  const t = await serverT();
  const allListings = await store.listListings({ includeShadowBanned: true });
  const allSignals = await store.listBrokerSignals();
  const allReports = await store.listReports();
  const allOrders = await store.listAllPaymentOrders();

  const stats = [
    { label: t('admin.totalListings'), value: allListings.length },
    { label: t('admin.active'), value: allListings.filter((l) => l.status === 'ACTIVE').length },
    { label: t('admin.pending'), value: allListings.filter((l) => l.status === 'PENDING_VERIFICATION').length },
    { label: t('admin.brokerSignals'), value: allSignals.length },
    { label: t('admin.critical'), value: allSignals.filter((s) => s.severity === 'CRITICAL').length },
    { label: t('admin.openReports'), value: allReports.filter((r) => r.status === 'OPEN').length },
    { label: t('admin.paid'), value: allOrders.filter((o) => o.status === 'PAID').length },
    { label: t('admin.awaiting'), value: allOrders.filter((o) => o.status === 'PENDING_USER_PAY').length },
  ];
  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t('admin.title')}</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">{t('admin.auditNote')}</p>
    </main>
  );
}
