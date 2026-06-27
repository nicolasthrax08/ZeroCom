import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  await requireAdmin();
  const allListings = await store.listListings({ includeShadowBanned: true });
  const allSignals = await store.listBrokerSignals();
  const allReports = await store.listReports();
  const allOrders = await store.listAllPaymentOrders();

  const stats = [
    { label: '总房源', value: allListings.length },
    { label: '已上架', value: allListings.filter((l) => l.status === 'ACTIVE').length },
    { label: '审核中', value: allListings.filter((l) => l.status === 'PENDING_VERIFICATION').length },
    { label: 'Broker 信号', value: allSignals.length },
    { label: '严重信号', value: allSignals.filter((s) => s.severity === 'CRITICAL').length },
    { label: '未决举报', value: allReports.filter((r) => r.status === 'OPEN').length },
    { label: '已支付', value: allOrders.filter((o) => o.status === 'PAID').length },
    { label: '待支付', value: allOrders.filter((o) => o.status === 'PENDING_USER_PAY').length },
  ];
  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">管理后台</h1>
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
      <p className="mt-6 text-xs text-muted-foreground">
        所有审核操作都会被写入不可篡改的审计日志。请在 24 小时内处理 pending 举报。
      </p>
    </main>
  );
}
