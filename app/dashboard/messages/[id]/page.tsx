import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';

export const dynamic = 'force-dynamic';

export default async function MessageThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect('/auth');
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
            对话 · {listing?.title ?? conv.listingId.slice(0, 8)}
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
                  <Badge tone="warning">可疑标记</Badge>
                )}
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">暂无消息</p>
            )}
          </div>
          <form
            onSubmit={async (e) => {
              'use server';
              const form = new FormData(e.currentTarget);
              const message = String(form.get('message') ?? '');
              if (!message.trim()) return;
              await fetch(`/api/conversations/${conv.id}/messages`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ message }),
              });
              window.location.reload();
            }}
            className="flex gap-2"
          >
            <input name="message" className="h-10 flex-1 rounded-lg border border-border px-3 text-sm" placeholder="输入消息..." />
            <Button variant="accent" type="submit">发送</Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
