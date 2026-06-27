import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/server/auth';
import { redirect } from 'next/navigation';
import { store } from '@/server/data/store';

export const dynamic = 'force-dynamic';

export default async function SellerStudio() {
  const user = await currentUser();
  if (!user) redirect('/auth');
  const listings = await store.listListings({ sellerId: user.id, includeShadowBanned: true });

  return (
    <main className="container-page py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">卖家中心</h1>
        <Link href="/seller/new">
          <Button variant="accent" size="sm">发布新房源</Button>
        </Link>
      </div>

      <Card className="mt-4">
        <CardBody>
          <h2 className="text-base font-semibold text-foreground">我的房源</h2>
          <ul className="mt-3 divide-y">
            {listings.length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">暂无房源。</li>
            ) : (
              listings.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">{l.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.city} {l.district} · {l.priceRmbWan}万
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={l.status === 'ACTIVE' ? 'muted' : l.status === 'DRAFT' ? 'muted' : 'warning'}>{l.status}</Badge>
                    <Link href={`/seller/listings/${l.id}/edit`}>
                      <Button variant="outline" size="sm">编辑</Button>
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
