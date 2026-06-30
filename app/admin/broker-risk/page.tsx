import { Card, CardBody } from '@/components/ui/card';
import { BrokerRiskTable } from '@/components/admin/broker-risk-table';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function AdminBrokerRiskPage() {
  await requireAdmin();
  const t = await serverT();
  const signals = await store.listBrokerSignals();
  const usersArr = await Promise.all(
    signals.map((s) => (s.userId ? store.findUserById(s.userId) : Promise.resolve(null))),
  );
  const users = usersArr.filter((u): u is NonNullable<typeof u> => !!u);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t('admin.brokerRisk')}</h1>
      <Card className="mt-4">
        <CardBody>
          <BrokerRiskTable signals={signals} users={users} />
        </CardBody>
      </Card>
    </main>
  );
}
