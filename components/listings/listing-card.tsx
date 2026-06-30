'use client';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize2, ShieldCheck, ArrowUpRight } from 'lucide-react';
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
      className="group premium-card interactive-tilt block overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-champagne/55"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-midnight">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-700 ease-luxury group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="relative flex h-full items-center justify-center overflow-hidden text-sm text-ivory/68">
            <div className="map-grid absolute inset-0 opacity-70" />
            <div className="absolute h-40 w-40 rounded-full bg-teal/20 blur-3xl" />
            <span className="relative">{t('card.noImage')}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/78 via-midnight/10 to-transparent" />
        <div className="absolute left-3 top-3">{statusBadge}</div>
        {listing.verificationStatus === 'VERIFIED' && (
          <div className="absolute right-3 top-3">
            <Badge tone="accent" className="bg-ivory/90 backdrop-blur">
              <ShieldCheck size={12} className="mr-1" /> {t('status.verified')}
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="rounded-2xl border border-white/15 bg-midnight/48 px-3 py-2 text-ivory shadow-soft backdrop-blur-md">
            <div className="text-xl font-bold tabular-nums">{formatWan(listing.priceRmbWan)}</div>
            <div className="text-[11px] font-medium text-ivory/72">{propertyTypeLabel}</div>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur transition duration-300 group-hover:rotate-12 group-hover:bg-champagne/90 group-hover:text-midnight">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
      <div className="relative z-10 space-y-3 p-4.5 p-4">
        <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-accent">{listing.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={15} className="text-accent" />
          <span className="line-clamp-1">{formatLocation(listing.city, listing.district, lang)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center justify-center gap-1 rounded-full bg-muted/75 px-2 py-1.5">
            <BedDouble size={14} />
            {listing.bedrooms} 室
          </span>
          <span className="flex items-center justify-center gap-1 rounded-full bg-muted/75 px-2 py-1.5">
            <Bath size={14} />
            {listing.bathrooms} 卫
          </span>
          <span className="flex items-center justify-center gap-1 rounded-full bg-muted/75 px-2 py-1.5">
            <Maximize2 size={14} />
            {listing.areaSqm} ㎡
          </span>
        </div>
        {isOwner && <div className="pt-1 text-xs text-muted-foreground">{t('listings.yourListingNote')}</div>}
      </div>
    </Link>
  );
}
