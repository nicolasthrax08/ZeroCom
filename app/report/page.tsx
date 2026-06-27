'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';

const REASONS = [
  { value: 'SUSPECTED_BROKER', label: '疑似中介' },
  { value: 'FAKE_LISTING', label: '虚假房源' },
  { value: 'PRICE_ANOMALY', label: '价格异常' },
  { value: 'DUPLICATE', label: '重复房源' },
  { value: 'HARASSMENT', label: '骚扰' },
  { value: 'OTHER', label: '其他' },
];

function ReportInner() {
  const sp = useSearchParams();
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
          <h2 className="text-lg font-semibold text-foreground">已提交举报</h2>
          <p className="mt-1 text-sm text-muted-foreground">我们将在 24 小时内调查、处理。</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="space-y-3">
        <h1 className="text-xl font-semibold text-foreground">举报可疑</h1>
        <p className="text-sm text-muted-foreground">所有举报都会进入审核队列，SLA：24 小时内处理。</p>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">举报原因</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <Textarea rows={4} value={details} onChange={(e) => setDetails(e.target.value)} label="补充说明" />
        <Button onClick={submit} variant="accent" className="w-full" loading={busy}>提交举报</Button>
      </CardBody>
    </Card>
  );
}

export default function ReportPage() {
  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-md">
        <Suspense fallback={<Card><CardBody>加载中…</CardBody></Card>}>
          <ReportInner />
        </Suspense>
      </div>
    </main>
  );
}
