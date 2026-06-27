'use client';
import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

export default function AppealPage() {
  const [enforcementId, setEnforcementId] = useState('');
  const [reason, setReason] = useState('');
  const [supportingText, setSupportingText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const res = await fetch('/api/appeal', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enforcementId, reason, supportingText }),
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="container-page py-12">
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-foreground">申诉已提交</h2>
            <p className="mt-1 text-sm text-muted-foreground">审核团队将在合理时间内联系你。</p>
          </CardBody>
        </Card>
      </main>
    );
  }

  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-md">
        <Card>
          <CardBody className="space-y-3">
            <h1 className="text-xl font-semibold text-foreground">申诉</h1>
            <p className="text-sm text-muted-foreground">
              如你认为平台封禁存在误解，可在此提交申诉。
            </p>
            <Input
              label="执行记录 ID"
              value={enforcementId}
              onChange={(e) => setEnforcementId(e.target.value)}
              placeholder="Enforcement ID"
            />
            <Textarea
              label="申诉理由（至少 10 字）"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Textarea
              label="补充说明（可选）"
              rows={3}
              value={supportingText}
              onChange={(e) => setSupportingText(e.target.value)}
            />
            <Button onClick={submit} variant="accent" className="w-full" loading={busy}>
              提交申诉
            </Button>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
