import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';
import { formatRMB } from '@/lib/utils/money';

export const dynamic = 'force-dynamic';

export default async function SubscriptionPage() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const sub = await store.activeSubscription(user.id);
  const subs = await store.listSubscriptions(user.id);

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">订阅管理</h1>
      <Card className="mt-4">
        <CardBody>
          <p className="text-xs text-muted-foreground">当前方案</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {sub ? sub.planCode === 'ANNUAL_PRO' ? '年度 Pro' : '月度 Pro' : '免费'}
          </p>
          {sub && (
            <p className="text-xs text-muted-foreground">
              有效期：{sub.startsAt.slice(0, 10)} — {sub.endsAt.slice(0, 10)}
            </p>
          )}
          <div className="mt-3">
            <Link href="/pricing">
              <Button variant={sub ? 'outline' : 'accent'} size="sm">
                {sub ? '变更方案' : '升级 Pro'}
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">通知偏好</h2>
        <Card>
          <CardBody>
            <NotificationPrefs />
          </CardBody>
        </Card>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">历史订单</h2>
        <Card>
          <CardBody>
            <ul className="divide-y text-sm">
              {subs.map((s) => (
                <li key={s.id} className="py-2">
                  {s.planCode} · {s.status} · {s.startsAt.slice(0, 10)}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}

function NotificationPrefs() {
  return (
    <form className="space-y-2 text-sm">
      <label className="flex items-center gap-2">
        <input type="checkbox" defaultChecked className="accent-accent" /> 每日房源精选
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" defaultChecked className="accent-accent" /> 新消息通知
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-accent" /> 平台更新与政策
      </label>
      <Button size="sm" variant="outline">保存</Button>
    </form>
  );
}
