import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/server/auth';
import { store } from '@/server/data/store';
import { type DictKey } from '@/lib/i18n/dictionary';
import { LISTING_STATUS_LABELS, ROLE_LABELS } from '@/lib/utils/i18n';
import { serverT, serverLabel } from '@/lib/i18n/lang-server';

const PLAN_KEY = {
  ANNUAL_PRO: 'dash.annualPro',
  MONTHLY_PRO: 'dash.monthlyPro',
} as const;

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const [t, lbl] = await Promise.all([serverT(), serverLabel()]);
  const listings = await store.listListings({ sellerId: user.id, includeShadowBanned: true });
  const sub = await store.activeSubscription(user.id);
  const planKey = sub ? (PLAN_KEY[sub.planCode as keyof typeof PLAN_KEY] ?? null) : null;

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t('dash.title')}</h1>
      <p className="text-sm text-muted-foreground">
        {user.displayName ?? t('dash.user')} · <Badge>{lbl(ROLE_LABELS, user.role)}</Badge>
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/subscription">
          <Card>
            <CardBody>
              <p className="text-xs text-muted-foreground">{t('dash.subscription')}</p>
              <p className="text-lg font-semibold text-foreground">
                {planKey ? t(planKey as DictKey) : t('dash.free')}
              </p>
              {sub && <p className="text-xs text-muted-foreground">{t('dash.validUntil')} {sub.endsAt.slice(0, 10)}</p>}
            </CardBody>
          </Card>
        </Link>
        <Link href="/dashboard/saved">
          <Card>
            <CardBody>
              <p className="text-xs text-muted-foreground">{t('dash.savedListings')}</p>
              <p className="text-lg font-semibold text-foreground">{t('dash.view')}</p>
            </CardBody>
          </Card>
        </Link>
        <Link href="/dashboard/messages">
          <Card>
            <CardBody>
              <p className="text-xs text-muted-foreground">{t('dash.messages')}</p>
              <p className="text-lg font-semibold text-foreground">{t('dash.view')}</p>
            </CardBody>
          </Card>
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-foreground">{t('dash.myListings')}</h2>
        <div className="flex justify-end mb-3">
          <Link href="/seller/new">
            <Button variant="accent" size="sm">{t('dash.newListing')}</Button>
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {listings.map((l) => (
            <Card key={l.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{l.title}</p>
                  <Badge tone={l.status === 'ACTIVE' ? 'success' : 'muted'}>{lbl(LISTING_STATUS_LABELS, l.status)}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{l.city} {l.district}</p>
                <Link href={`/seller/listings/${l.id}/edit`} className="mt-3 inline-block">
                  <Button variant="outline" size="sm">{t('dash.edit')}</Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
