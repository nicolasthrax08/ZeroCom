import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/auth');

  const listings = await store.listListings({ sellerId: user.id, includeShadowBanned: true });
  const sub = await store.activeSubscription(user.id);

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">我的账户</h1>
      <p className="text-sm text-muted-foreground">
        {user.displayName ?? '用户'} · <Badge>{user.role}</Badge>
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/subscription">
          <Card>
            <CardBody>
              <p className="text-xs text-muted-foreground">订阅</p>
              <p className="text-lg font-semibold text-foreground">
                {sub ? (sub.planCode === 'ANNUAL_PRO' ? '年度 Pro' : '月度 Pro') : '免费'}
              </p>
              {sub && <p className="text-xs text-muted-foreground">至 {sub.endsAt.slice(0, 10)}</p>}
            </CardBody>
          </Card>
        </Link>
        <Link href="/dashboard/saved">
          <Card>
            <CardBody>
              <p className="text-xs text-muted-foreground">已保存房源</p>
              <p className="text-lg font-semibold text-foreground">查看 →</p>
            </CardBody>
          </Card>
        </Link>
        <Link href="/dashboard/messages">
          <Card>
            <CardBody>
              <p className="text-xs text-muted-foreground">消息</p>
              <p className="text-lg font-semibold text-foreground">查看 →</p>
            </CardBody>
          </Card>
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-foreground">我的房源</h2>
        <div className="flex justify-end mb-3">
          <Link href="/seller/new">
            <Button variant="accent" size="sm">发布新房源</Button>
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {listings.map((l) => (
            <Card key={l.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{l.title}</p>
                  <Badge tone={l.status === 'ACTIVE' ? 'success' : 'muted'}>{l.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{l.city} {l.district}</p>
                <Link href={`/seller/listings/${l.id}/edit`} className="mt-3 inline-block">
                  <Button variant="outline" size="sm">编辑</Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
