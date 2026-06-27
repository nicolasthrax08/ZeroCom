import { notFound } from 'next/navigation';
import { UserDetail } from '@/components/admin/user-detail';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';

export const dynamic = 'force-dynamic';

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const user = await store.findUserById(id);
  if (!user) return notFound();
  const verification = await store.findVerificationByUserId(user.id);
  const subscriptions = await store.listSubscriptions(user.id);
  const enforcements = await store.listEnforcements(user.id);
  const signals = await store.listBrokerSignalsForUser(user.id);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-sem">用户详情</h1>
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
