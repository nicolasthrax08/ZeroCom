'use client';

import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/fade-in';
import { ListingGallery } from '@/components/listings/listing-gallery';
import { ContactCard } from '@/components/listings/contact-card';
import { DirectMatchBadge } from '@/components/listings/directmatch-badge';
import { MapPin, BedDouble, Bath, Maximize2, Calendar, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { formatLocation } from '@/lib/i18n/locations';
import type { Listing, User } from '@/server/data/types';

type RevealState =
  | { status: 'LOADING' }
  | { status: 'MASKED' }
  | { status: 'NO_INTENT' }
  | { status: 'REVEALED'; phone: string; wechat?: string }
  | { status: 'IS_OWNER' }
  | { status: 'NOT_ACTIVE' };

export function ListingDetailShell({
  listing, photos, viewer, saved, revealState,
}: {
  listing: Listing;
  photos: Awaited<ReturnType<typeof import('@/server/data/store').store.listPhotosByListing>>;
  viewer: User | null;
  saved: Awaited<ReturnType<typeof import('@/server/data/store').store.findSaved>>;
  revealState: RevealState;
}) {
  const { t, lang } = useLanguage();

  const statusBadge = listing.status === 'ACTIVE'
    ? <Badge tone="success">{t('status.active')}</Badge>
    : <Badge tone="muted">{listing.status}</Badge>;

  const propertyTypeLabel = listing.propertyType === 'SECOND_HAND'
    ? t('status.secondHand')
    : listing.propertyType === 'NEW'
      ? t('status.new')
      : t('status.rental');

  return (
    <main className="container-page py-8">
      <FadeIn>
        <div className="mb-3 text-sm text-muted-foreground">
          <Link href="/listings" className="hover:text-foreground">{t('listings.back')}</Link>
          <span className="mx-1">·</span>
          {formatLocation(listing.city, listing.district, lang)}
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <FadeIn delay={60}>
            <ListingGallery photos={photos} />
          </FadeIn>
          <FadeIn delay={120}>
            <Card>
              <CardBody className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {statusBadge}
                  <Badge tone="accent">{propertyTypeLabel}</Badge>
                  {listing.verificationStatus === 'VERIFIED' && <Badge tone="success">{t('status.verified')}</Badge>}
                </div>
                <h1 className="text-2xl font-semibold text-foreground">{listing.title}</h1>
                <div className="text-3xl font-bold text-accent tabular-nums">
                  {listing.priceRmbWan} 万
                  <span className="ml-2 text-base text-muted-foreground">
                    约 {Math.round((listing.priceRmbWan * 10000) / Number(listing.areaSqm))} {t('listings.sqm')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1"><BedDouble size={16}/>{listing.bedrooms} 室</span>
                  <span className="flex items-center gap-1"><Bath size={16}/>{listing.bathrooms} 卫</span>
                  <span className="flex items-center gap-1"><Maximize2 size={16}/>{listing.areaSqm} ㎡</span>
                  <span className="flex items-center gap-1"><MapPin size={16}/>{listing.addressDetail}</span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{t('listings.description')}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
                </div>
                <div className="rounded-md border border-border bg-muted/50 p-4">
                  <p className="text-xs font-medium text-muted-foreground">{t('listings.mapPlaceholder')}</p>
                  <div className="mt-2 flex h-32 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                    {listing.city} {listing.district} · {t('listings.mapPlaceholder')}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <Calendar size={12} className="inline" />
                  {t('listings.published')} {listing.createdAt.slice(0, 10)}
                </div>
              </CardBody>
            </Card>
          </FadeIn>

          <FadeIn delay={180}>
            <Card>
              <CardBody className="space-y-2">
                <h3 className="font-semibold text-foreground">{t('listings.sellerInfo')}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('listings.verified')}</span>
                  <Badge tone="success">{t('listings.verifiedYes')}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{t('listings.verifiedDesc')}</p>
              </CardBody>
            </Card>
          </FadeIn>
        </div>

        <aside className="space-y-4">
          <FadeIn delay={100}>
            <ContactCard revealState={revealState} listingId={listing.id} saved={!!saved} />
          </FadeIn>
          <FadeIn delay={160}>
            <DirectMatchBadge />
          </FadeIn>
          <FadeIn delay={220}>
            <Card>
              <CardBody className="space-y-2 text-sm">
                <p className="flex items-center gap-2 font-medium text-foreground">
                  <AlertTriangle size={16} className="text-warning" /> {t('listings.report')}
                </p>
                <p className="text-xs text-muted-foreground">{t('listings.reportDesc')}</p>
                <Link href={`/report?listingId=${listing.id}`}>
                  <Button variant="outline" size="sm" className="w-full">{t('listings.reportBtn')}</Button>
                </Link>
              </CardBody>
            </Card>
          </FadeIn>
        </aside>
      </div>
    </main>
  );
}
