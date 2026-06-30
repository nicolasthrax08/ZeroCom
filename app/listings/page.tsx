import { store } from '@/server/data/store';
import { currentUser } from '@/server/auth';
import { ListingsContent } from './listings-content';

export const dynamic = 'force-dynamic';

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; district?: string; bedrooms?: string; minPrice?: string; maxPrice?: string; q?: string }>;
}) {
  const filters = await searchParams;
  const user = await currentUser();
  const listings = await store.listListings({
    city: filters.city,
    district: filters.district,
    bedrooms: filters.bedrooms ? Number(filters.bedrooms) : undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    q: filters.q,
    status: 'ACTIVE',
  });

  return <ListingsContent listings={listings} />;
}
