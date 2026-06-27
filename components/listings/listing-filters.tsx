'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CITIES, DISTRICTS_BY_CITY, PROPERTY_TYPES } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n/language-context';

export function ListingFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const { t } = useLanguage();
  const [city, setCity] = useState(sp.get('city') ?? '');
  const [district, setDistrict] = useState(sp.get('district') ?? '');
  const [minPrice, setMinPrice] = useState(sp.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(sp.get('maxPrice') ?? '');
  const [bedrooms, setBedrooms] = useState(sp.get('bedrooms') ?? '');
  const [q, setQ] = useState(sp.get('q') ?? '');

  const districts = city ? (DISTRICTS_BY_CITY[city] ?? []) : [];

  function apply() {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (district) params.set('district', district);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (q) params.set('q', q);
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <Select
          label={t('listings.filter.city')}
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setDistrict('');
          }}
          options={[
            { value: '', label: t('listings.filter.cityAll') },
            ...CITIES.map((c) => ({ value: c, label: c })),
          ]}
        />
        <Select
          label={t('listings.filter.district')}
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          options={[
            { value: '', label: t('listings.filter.districtAll') },
            ...districts.map((d) => ({ value: d, label: d })),
          ]}
        />
        <Input
          label={t('listings.filter.minPrice')}
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          label={t('listings.filter.maxPrice')}
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Select
          label={t('listings.filter.bedrooms')}
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          options={[
            { value: '', label: t('listings.filter.bedroomsAll') },
            { value: '1', label: '1室' },
            { value: '2', label: '2室' },
            { value: '3', label: '3室' },
            { value: '4', label: '4室+' },
          ]}
        />
        <Input label={t('listings.filter.keyword')} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('listings.filter.keywordPlaceholder')} />
      </div>
      <div className="mt-3 flex justify-end">
        <Button onClick={apply} size="sm">{t('listings.filter.apply')}</Button>
      </div>
    </div>
  );
}

export function ReadOnlyNotice() {
  const { t } = useLanguage();
  return (
    <div className="mb-3 rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
      {t('listings.proPrompt')}
    </div>
  );
}

export function PremiumFilterNotice() {
  const { t } = useLanguage();
  return (
    <div className="mb-3 rounded-md border border-accent-soft bg-accent-soft px-3 py-2 text-xs text-accent">
      {t('listings.subscribePrompt')}
    </div>
  );
}
