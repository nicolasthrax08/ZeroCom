'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CITIES, DISTRICTS_BY_CITY } from '@/lib/constants';
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
    <div className="ivory-panel relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal/10 blur-3xl" />
      <div className="relative mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-midnight text-champagne shadow-soft">
          <SlidersHorizontal size={20} />
        </div>
        <div>
          <p className="text-sm font-black text-foreground">{t('filter.directMatchTitle')}</p>
          <p className="text-xs text-muted-foreground">{t('filter.directMatchDesc')}</p>
        </div>
      </div>
      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-6">
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
        <Input label={t('listings.filter.minPrice')} type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <Input label={t('listings.filter.maxPrice')} type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
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
        <Input
          label={t('listings.filter.keyword')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('listings.filter.keywordPlaceholder')}
        />
      </div>
      <div className="relative mt-4 flex justify-end">
        <Button onClick={apply} size="md" variant="accent">
          <SearchIcon size={16} />
          {t('listings.filter.apply')}
        </Button>
      </div>
    </div>
  );
}
