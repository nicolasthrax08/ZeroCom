import { Metadata } from 'next';
import { ListingCard } from '@/components/listings/listing-card';
import { store } from '@/server/data/store';
import { currentUser } from '@/server/auth';
import { logAnalytics } from '@/server/audit';
import { LandingShell } from './landing-shell';

export const metadata: Metadata = {
  title: 'ZeroCom · 零佣金房产直连',
  description: '零佣金，房东买家直接见面 — ZeroCom',
};

export default async function LandingPage() {
  const listings = (await store.listListings({ status: 'ACTIVE' })).slice(0, 6);
  const user = await currentUser();
  await logAnalytics('visit_landing', { userId: user?.id });

  return <LandingShell listings={listings} />;
}
