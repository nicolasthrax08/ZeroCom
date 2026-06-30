import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';
import { formatRMB } from '@/lib/utils/money';
import { serverT } from '@/lib/i18n/lang-server';

export const dynamic = 'force-dynamic';

export default async function SubscriptionPage() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const t = await serverT();
  const sub = await store.activeSubscription(user.id);
  const subs = await store.listSubscriptions(user.id);

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t('dash.subscription')}</h1>
      <Card className="mt-4">
        <CardBody>
          <p className="text-xs text-muted-foreground">{t('dash.currentPlan')}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {sub ? t(sub.planCode === 'ANNUAL_PRO' ? 'dash.annualPro' : 'dash.monthlyPro') : t('dash.free')}
          </p>
          {sub && (
            <p className="text-xs text-muted-foreground">
              {t('dash.validity')}{sub.startsAt.slice(0, 10)} — {sub.endsAt.slice(0, 10)}
            </p>
          )}
          <div className="mt-3">
            <Link href="/pricing">
              <Button variant={sub ? 'outline' : 'accent'} size="sm">
                {sub ? t('pay.changePlan') : t('pay.upgradePro')}
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">{t('pay.notifyPrefs')}</h2>
        <Card>
          <CardBody>
            <NotificationPrefs />
          </CardBody>
        </Card>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">{t('pay.history')}</h2>
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

async function NotificationPrefs() {
  const t = await serverT();
  return (
    <form className="space-y-2 text-sm">
      <label className="flex items-center gap-2">
        <input type="checkbox" defaultChecked className="accent-accent" /> {t('pay.dailyDigest')}
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" defaultChecked className="accent-accent" /> {t('pay.newMessage')}
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-accent" /> {t('pay.platformUpdates')}
      </label>
      <Button size="sm" variant="outline">{t('pay.save')}</Button>
    </form>
  );
}
