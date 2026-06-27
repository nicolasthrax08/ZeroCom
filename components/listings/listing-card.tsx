'use client';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatWan } from '@/lib/utils/money';
import { useLanguage } from '@/lib/i18n/language-context';
import { formatLocation } from '@/lib/i18n/locations';
import type { Listing } from '@/server/data/types';

export function ListingCard({ listing, isOwner = false }: { listing: Listing; isOwner?: boolean }) {
  const { t, lang } = useLanguage();

  const statusBadge = (() => {
    const map: Record<string, React.ReactNode> = {
      ACTIVE: <Badge tone="success">{t('status.active')}</Badge>,
      PAUSED: <Badge tone="warning">{t('status.paused')}</Badge>,
      SOLD: <Badge tone="muted">{t('status.sold')}</Badge>,
      PENDING_VERIFICATION: <Badge tone="accent">{t('status.pending')}</Badge>,
      DRAFT: <Badge tone="muted">{t('status.draft')}</Badge>,
      REMOVED: <Badge tone="danger">{t('status.removed')}</Badge>,
    };
    return map[listing.status] ?? <Badge tone="muted">{listing.status}</Badge>;
  })();

  const cover = listing.photos?.[0]?.url;

  const propertyTypeLabel = (() => {
    const key = `status.${listing.propertyType === 'SECOND_HAND' ? 'secondHand' : listing.propertyType === 'NEW' ? 'new' : 'rental'}` as const;
    return t(key);
  })();

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={listing.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{t('card.noImage')}</div>
        )}
        <div className="absolute left-3 top-3">{statusBadge}</div>
        {listing.verificationStatus === 'VERIFIED' && (
          <div className="absolute right-3 top-3">
            <Badge tone="accent">
              <ShieldCheck size={12} className="mr-1" /> {t('status.verified')}
            </Badge>
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">{listing.title}</h3>
        </div>
        <div className="text-2xl font-bold text-accent tabular-nums">
          {formatWan(listing.priceRmbWan)}
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            · {propertyTypeLabel}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {formatLocation(listing.city, listing.district, lang)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble size={14} />
            {listing.bedrooms} 室
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} />
            {listing.bathrooms} 卫
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={14} />
            {listing.areaSqm} ㎡
          </span>
        </div>
        {isOwner && (
          <div className="pt-2 text-xs text-muted-foreground">{t('listings.yourListingNote')}</div>
        )}
      </div>
    </Link>
  );
}
