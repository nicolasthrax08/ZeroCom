import { Card, CardBody } from '@/components/ui/card';
import { PaymentLookup } from '@/components/admin/payment-lookup';
import { requireAdmin } from '@/server/auth';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  await requireAdmin();
  const t = await serverT();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t('admin.payments')}</h1>
      <Card className="mt-4">
        <CardBody>
          <PaymentLookup />
        </CardBody>
      </Card>
    </main>
  );
}
