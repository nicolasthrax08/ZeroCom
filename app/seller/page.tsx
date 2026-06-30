import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/server/auth';
import { redirect } from 'next/navigation';
import { store } from '@/server/data/store';
import { serverT, serverLabel } from '@/lib/i18n/lang-server';
import { LISTING_STATUS_LABELS } from '@/lib/utils/i18n';

export const dynamic = 'force-dynamic';

export default async function SellerStudio() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const [t, lbl] = await Promise.all([serverT(), serverLabel()]);
  const listings = await store.listListings({ sellerId: user.id, includeShadowBanned: true });

  return (
    <main className="container-page py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t('seller.center')}</h1>
        <Link href="/seller/new">
          <Button variant="accent" size="sm">{t('dash.newListing')}</Button>
        </Link>
      </div>

      <Card className="mt-4">
        <CardBody>
          <h2 className="text-base font-semibold text-foreground">{t('dash.myListings')}</h2>
          <ul className="mt-3 divide-y">
            {listings.length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">{t('seller.noListings')}</li>
            ) : (
              listings.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">{l.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.city} {l.district} · {l.priceRmbWan}
                      {t('detail.wan')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={l.status === 'ACTIVE' ? 'muted' : l.status === 'DRAFT' ? 'muted' : 'warning'}>
                      {lbl(LISTING_STATUS_LABELS, l.status)}
                    </Badge>
                    <Link href={`/seller/listings/${l.id}/edit`}>
                      <Button variant="outline" size="sm">
                        {t('dash.edit')}
                      </Button>
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        </CardBody>
      </Card>
    </main>
  );
}
