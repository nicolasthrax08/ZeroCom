'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardBody } from '@/components/ui/card';
import { CITIES, DISTRICTS_BY_CITY, PROPERTY_TYPES } from '@/lib/constants';
import { WizardStepper } from './wizard-stepper';
import { useLanguage } from '@/lib/i18n/language-context';

interface FormState {
  title: string;
  description: string;
  city: string;
  district: string;
  addressDetail: string;
  priceRmbWan: string;
  areaSqm: string;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  photos: string[];
}

const INITIAL: FormState = {
  title: '',
  description: '',
  city: 'Shanghai',
  district: '',
  addressDetail: '',
  priceRmbWan: '',
  areaSqm: '',
  bedrooms: '2',
  bathrooms: '1',
  propertyType: 'SECOND_HAND',
  photos: [],
};

export function ListingForm({
  onSubmit,
  submitting,
  serverError,
}: {
  onSubmit: (data: FormState) => void | Promise<void>;
  submitting?: boolean;
  serverError?: string;
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<FormState>(INITIAL);
  const [step, setStep] = useState('basic');
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>({});

  const districts = state.city ? (DISTRICTS_BY_CITY[state.city] ?? []) : [];

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!state.title || state.title.length > 60) e.title = t('form.titleError');
    if (state.description.length < 10) e.description = t('form.descError');
    if (!state.district) e.district = t('form.districtError');
    if (!state.addressDetail) e.addressDetail = t('form.addressError');
    if (!Number(state.priceRmbWan) || Number(state.priceRmbWan) <= 0) e.priceRmbWan = t('form.priceError');
    if (!Number(state.areaSqm) || Number(state.areaSqm) <= 0) e.areaSqm = t('form.areaError');
    if (state.photos.length === 0) e.photos = t('form.photosPrompt');
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    void onSubmit(state);
  }

  function mockAddPhotos() {
    const seed = Math.random().toString(36).slice(2, 8);
    const newPhotos = Array.from({ length: 3 }, (_, i) =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><rect width='800' height='500' fill='%23a7f3d0'/><text x='400' y='260' text-anchor='middle' font-size='32' fill='white'>${seed}-${i}</text></svg>`,
      )}`,
    );
    update('photos', [...state.photos, ...newPhotos].slice(0, 20));
  }

  return (
    <Card>
      <CardBody className="space-y-5">
        <WizardStepper current={step} />
        {serverError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {serverError}
          </p>
        )}

        {step === 'basic' && (
          <>
            <Input
              label={t('form.titleLabel')}
              value={state.title}
              onChange={(e) => update('title', e.target.value)}
              error={errs.title}
              placeholder={t('form.titlePlaceholder')}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label={t('form.city')}
                value={state.city}
                onChange={(e) => {
                  update('city', e.target.value);
                  update('district', '');
                }}
                options={CITIES.map((c) => ({ value: c, label: c }))}
              />
              <Select
                label={t('form.district')}
                value={state.district}
                onChange={(e) => update('district', e.target.value)}
                options={[
                  { value: '', label: t('form.pleaseSelect') },
                  ...districts.map((d) => ({ value: d, label: d })),
                ]}
                error={errs.district}
              />
            </div>
            <Input
              label={t('form.address')}
              value={state.addressDetail}
              onChange={(e) => update('addressDetail', e.target.value)}
              error={errs.addressDetail}
              placeholder={t('form.addressPlaceholder')}
            />
            <Select
              label={t('form.propertyType')}
              value={state.propertyType}
              onChange={(e) => update('propertyType', e.target.value)}
              options={PROPERTY_TYPES.map((p) => ({ value: p.key, label: p.label }))}
            />
            <Button type="button" variant="accent" onClick={() => setStep('address')}>{t('form.next')}</Button>
          </>
        )}

        {step === 'address' && (
          <>
            <p className="text-sm text-muted-foreground">{t('form.mapPlaceholder')}</p>
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted text-sm text-muted-foreground">
              {t('form.mapPlaceholder')}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('basic')}>{t('form.prev')}</Button>
              <Button variant="accent" onClick={() => setStep('photos')}>{t('form.next')}</Button>
            </div>
          </>
        )}

        {step === 'photos' && (
          <>
            <p className="text-sm text-muted-foreground">{t('form.photosPrompt')}</p>
            <div className="grid grid-cols-3 gap-2">
              {state.photos.map((p, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt={`photo-${i}`} className="h-full w-full object-cover" />
                </div>
              ))}
              {state.photos.length < 20 && (
                <button
                  type="button"
                  onClick={mockAddPhotos}
                  className="aspect-square rounded-md border-2 border-dashed border-border text-sm text-muted-foreground hover:border-accent hover:text-accent"
                >
                  {t('form.upload')}
                </button>
              )}
            </div>
            {errs.photos && <p className="text-xs text-danger">{errs.photos}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('address')}>{t('form.prev')}</Button>
              <Button variant="accent" onClick={() => setStep('price')}>{t('form.next')}</Button>
            </div>
          </>
        )}

        {step === 'price' && (
          <>
            <Input
              label={t('form.priceWan')}
              type="number"
              value={state.priceRmbWan}
              onChange={(e) => update('priceRmbWan', e.target.value)}
              error={errs.priceRmbWan}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('form.areaSqm')}
                type="number"
                value={state.areaSqm}
                onChange={(e) => update('areaSqm', e.target.value)}
                error={errs.areaSqm}
              />
              <Input
                label={t('form.bedrooms')}
                type="number"
                value={state.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
              />
              <Input
                label={t('form.bathrooms')}
                type="number"
                value={state.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)}
              />
            </div>
            <Textarea
              label={t('form.description')}
              rows={5}
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              error={errs.description}
              placeholder={t('form.descPlaceholder')}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('photos')}>{t('form.prev')}</Button>
              <Button variant="accent" onClick={() => setStep('review')}>{t('form.next')}</Button>
            </div>
          </>
        )}

        {step === 'review' && (
          <>
            <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <p><strong>{t('form.reviewTitle')}</strong>{state.title}</p>
              <p><strong>{t('form.reviewLocation')}</strong>{state.city} {state.district} {state.addressDetail}</p>
              <p><strong>{t('form.reviewPrice')}</strong>{state.priceRmbWan}{t('detail.wan')} · {state.areaSqm}{t('detail.sqm')} · {state.bedrooms}{t('detail.room')}{state.bathrooms}{t('detail.bath')}</p>
              <p><strong>{t('form.reviewPhotos')}</strong>{state.photos.length}</p>
            </div>
            <p className="text-xs text-muted-foreground">{t('form.reviewNote')}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('price')}>{t('form.prev')}</Button>
              <Button variant="accent" onClick={handleSubmit} loading={submitting}>{t('form.submitReview')}</Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
