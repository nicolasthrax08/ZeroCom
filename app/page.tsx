import { Metadata } from 'next';
import { ListingCard } from '@/components/listings/listing-card';
import { store } from '@/server/data/store';
import { currentUser } from '@/server/auth';
import { logAnalytics } from '@/server/audit';
import { LandingShell } from './landing-shell';
import { cookies } from 'next/headers';
import { translate, type Lang } from '@/lib/i18n/dictionary';

export async function generateMetadata(): Promise<Metadata> {
  const lang: Lang = (await cookies()).get('zerocom_lang')?.value === 'en' ? 'en' : 'zh';
  return {
    title: translate('meta.title', lang),
    description: translate('meta.description', lang),
  };
}

export default async function LandingPage() {
  const listings = (await store.listListings({ status: 'ACTIVE' })).slice(0, 6);
  const user = await currentUser();
  await logAnalytics('visit_landing', { userId: user?.id });

  return <LandingShell listings={listings} />;
}
