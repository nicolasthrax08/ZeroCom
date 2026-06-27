'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardBody } from '@/components/ui/card';
import { CITIES, DISTRICTS_BY_CITY, PROPERTY_TYPES } from '@/lib/constants';
import { WizardStepper } from './wizard-stepper';

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
  const [state, setState] = useState<FormState>(INITIAL);
  const [step, setStep] = useState('basic');
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>({});

  const districts = state.city ? (DISTRICTS_BY_CITY[state.city] ?? []) : [];

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!state.title || state.title.length > 60) e.title = '标题 1–60 字';
    if (state.description.length < 10) e.description = '描述至少 10 字';
    if (!state.district) e.district = '请选择区域';
    if (!state.addressDetail) e.addressDetail = '请输入详细地址';
    if (!Number(state.priceRmbWan) || Number(state.priceRmbWan) <= 0) e.priceRmbWan = '请输入价格';
    if (!Number(state.areaSqm) || Number(state.areaSqm) <= 0) e.areaSqm = '请输入面积';
    if (state.photos.length === 0) e.photos = '至少上传 1 张照片';
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
              label="标题（最多 60 字）"
              value={state.title}
              onChange={(e) => update('title', e.target.value)}
              error={errs.title}
              placeholder="例如：浦东陆家嘴 精装三房 70年产权诚意出售"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="城市"
                value={state.city}
                onChange={(e) => {
                  update('city', e.target.value);
                  update('district', '');
                }}
                options={CITIES.map((c) => ({ value: c, label: c }))}
              />
              <Select
                label="区域"
                value={state.district}
                onChange={(e) => update('district', e.target.value)}
                options={[
                  { value: '', label: '请选择' },
                  ...districts.map((d) => ({ value: d, label: d })),
                ]}
                error={errs.district}
              />
            </div>
            <Input
              label="详细地址"
              value={state.addressDetail}
              onChange={(e) => update('addressDetail', e.target.value)}
              error={errs.addressDetail}
              placeholder="例如：某街道 100 号"
            />
            <Select
              label="物业类型"
              value={state.propertyType}
              onChange={(e) => update('propertyType', e.target.value)}
              options={PROPERTY_TYPES.map((p) => ({ value: p.key, label: p.label }))}
            />
            <Button type="button" variant="accent" onClick={() => setStep('address')}>下一步</Button>
          </>
        )}

        {step === 'address' && (
          <>
            <p className="text-sm text-muted-foreground">
              系统将自动识别地址坐标。请确保地址准确，以便买家找到。
            </p>
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted text-sm text-muted-foreground">
              地图占位（生产环境接入高德 / 百度地图）
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('basic')}>上一步</Button>
              <Button variant="accent" onClick={() => setStep('photos')}>下一步</Button>
            </div>
          </>
        )}

        {step === 'photos' && (
          <>
            <p className="text-sm text-muted-foreground">上传 1–20 张真实房源照片。</p>
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
                  + 上传
                </button>
              )}
            </div>
            {errs.photos && <p className="text-xs text-danger">{errs.photos}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('address')}>上一步</Button>
              <Button variant="accent" onClick={() => setStep('price')}>下一步</Button>
            </div>
          </>
        )}

        {step === 'price' && (
          <>
            <Input
              label="售价（万）"
              type="number"
              value={state.priceRmbWan}
              onChange={(e) => update('priceRmbWan', e.target.value)}
              error={errs.priceRmbWan}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="建筑面积（㎡）"
                type="number"
                value={state.areaSqm}
                onChange={(e) => update('areaSqm', e.target.value)}
                error={errs.areaSqm}
              />
              <Input
                label="卧室数"
                type="number"
                value={state.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
              />
              <Input
                label="卫生间数"
                type="number"
                value={state.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)}
              />
            </div>
            <Textarea
              label="描述（最多 5000 字）"
              rows={5}
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              error={errs.description}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('photos')}>上一步</Button>
              <Button variant="accent" onClick={() => setStep('review')}>下一步</Button>
            </div>
          </>
        )}

        {step === 'review' && (
          <>
            <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <p><strong>标题：</strong>{state.title}</p>
              <p><strong>位置：</strong>{state.city} {state.district} {state.addressDetail}</p>
              <p><strong>价格：</strong>{state.priceRmbWan} 万 · {state.areaSqm} ㎡ · {state.bedrooms}室{state.bathrooms}卫</p>
              <p><strong>照片数：</strong>{state.photos.length}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              提交后进入审核队列，审核通过即上架。
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('price')}>上一步</Button>
              <Button variant="accent" onClick={handleSubmit} loading={submitting}>提交审核</Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
