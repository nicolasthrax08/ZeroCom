'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n/language-context';
import type { DictKey } from '@/lib/i18n/dictionary';

const REASONS: { value: string; labelKey: DictKey }[] = [
  { value: 'SUSPECTED_BROKER', labelKey: 'report.reason.broker' },
  { value: 'FAKE_LISTING', labelKey: 'report.reason.fake' },
  { value: 'PRICE_ANOMALY', labelKey: 'report.reason.price' },
  { value: 'DUPLICATE', labelKey: 'report.reason.duplicate' },
  { value: 'HARASSMENT', labelKey: 'report.reason.harassment' },
  { value: 'OTHER', labelKey: 'report.reason.other' },
];

function ReportInner() {
  const sp = useSearchParams();
  const { t } = useLanguage();
  const listingId = sp.get('listingId') ?? '';
  const [reason, setReason] = useState('SUSPECTED_BROKER');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const payload: Record<string, string> = { reason, details };
    if (listingId) payload.listingId = listingId;
    const res = await fetch('/api/report', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold text-foreground">{t('report.submittedTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('report.submittedDesc')}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="space-y-3">
        <h1 className="text-xl font-semibold text-foreground">{t('report.heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('report.intro')}</p>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">{t('report.reason')}</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {t(r.labelKey)}
              </option>
            ))}
          </select>
        </div>
        <Textarea rows={4} value={details} onChange={(e) => setDetails(e.target.value)} label={t('report.details')} />
        <Button onClick={submit} variant="accent" className="w-full" loading={busy}>{t('report.submit')}</Button>
      </CardBody>
    </Card>
  );
}

function ReportFallback() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardBody>{t('order.loading')}</CardBody>
    </Card>
  );
}

export default function ReportPage() {
  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-md">
        <Suspense fallback={<ReportFallback />}>
          <ReportInner />
        </Suspense>
      </div>
    </main>
  );
}
