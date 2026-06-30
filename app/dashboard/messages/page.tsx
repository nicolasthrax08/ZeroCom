import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const t = await serverT();
  const convs = await store.listConversationsForUser(user.id);

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t('dash.messages')}</h1>
      <div className="mt-4 space-y-3">
        {convs.length === 0 ? (
          <Card>
            <CardBody>{t('dash.conversationsEmpty')}</CardBody>
          </Card>
        ) : (
          convs.map((c) => {
            const otherId = c.buyerId === user.id ? c.sellerId : c.buyerId;
            return (
              <Link key={c.id} href={`/dashboard/messages/${c.id}`}>
                <Card>
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{t('dash.listingConversation', { id: c.listingId.slice(0, 8) })}</p>
                      <Badge>{c.buyerId === user.id ? t('dash.buyerConversation') : t('dash.sellerConversation')}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{t('dash.peerId')} {otherId.slice(0, 8)}</p>
                  </CardBody>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}
