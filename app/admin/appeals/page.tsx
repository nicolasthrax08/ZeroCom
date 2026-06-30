import { Card, CardBody } from '@/components/ui/card';
import { AppealQueue } from '@/components/admin/appeal-queue';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function AdminAppealsPage() {
  await requireAdmin();
  const t = await serverT();
  const appeals = await store.listAppeals();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t('admin.appeals')}</h1>
      <Card className="mt-4">
        <CardBody>
          <AppealQueue appeals={appeals} />
        </CardBody>
      </Card>
    </main>
  );
}
