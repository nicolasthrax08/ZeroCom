import { notFound } from 'next/navigation';
import { UserDetail } from '@/components/admin/user-detail';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const t = await serverT();
  const user = await store.findUserById(id);
  if (!user) return notFound();
  const verification = await store.findVerificationByUserId(user.id);
  const subscriptions = await store.listSubscriptions(user.id);
  const enforcements = await store.listEnforcements(user.id);
  const signals = await store.listBrokerSignalsForUser(user.id);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t('admin.userDetail')}</h1>
      <div className="mt-4">
        <UserDetail
          user={user}
          verification={verification ?? undefined}
          subscriptions={subscriptions}
          enforcements={enforcements}
          signals={signals}
        />
      </div>
    </main>
  );
}
