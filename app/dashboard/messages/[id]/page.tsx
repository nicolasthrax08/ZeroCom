import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function MessageThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect('/auth');
  const t = await serverT();
  const conv = await store.findConversationById(id);
  if (!conv) redirect('/dashboard/messages');
  if (conv.buyerId !== user.id && conv.sellerId !== user.id) redirect('/dashboard/messages');
  const messages = await store.listMessages(conv.id);
  const listing = await store.findListingById(conv.listingId);

  return (
    <main className="container-page py-8">
      <Card>
        <CardBody className="space-y-3">
          <h1 className="text-xl font-semibold text-foreground">
            {t('dash.conversationWith')} {listing?.title ?? conv.listingId.slice(0, 8)}
          </h1>
          <div className="space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg px-3 py-2 text-sm ${
                  m.senderId === user.id ? 'ml-8 bg-accent-soft text-right' : 'mr-8 bg-muted'
                }`}
              >
                <p>{m.body}</p>
                {m.isFlagged && (
                  <Badge tone="warning">{t('dash.suspicious')}</Badge>
                )}
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">{t('dash.noMessages')}</p>
            )}
          </div>
          <form
            action={async (formData: FormData) => {
              'use server';
              const message = String(formData.get('message') ?? '');
              if (!message.trim()) return;
              const { store } = await import('@/server/data/store');
              const { currentUserId } = await import('@/server/auth');
              const userId = await currentUserId();
              if (!userId) return;
              await store.createMessage({
                conversationId: conv.id,
                senderId: userId,
                body: message.trim(),
                isFlagged: false,
              });
            }}
            className="flex gap-2"
          >
            <input name="message" className="h-10 flex-1 rounded-lg border border-border px-3 text-sm" placeholder={t('dash.messagePlaceholder')} />
            <Button variant="accent" type="submit">{t('dash.send')}</Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
