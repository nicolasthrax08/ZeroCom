'use client';
import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n/language-context';

export default function AppealPage() {
  const { t } = useLanguage();
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
            <h2 className="text-lg font-semibold text-foreground">{t('appeal.submittedTitle')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('appeal.submittedDesc')}</p>
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
            <h1 className="text-xl font-semibold text-foreground">{t('appeal.heading')}</h1>
            <p className="text-sm text-muted-foreground">{t('appeal.intro')}</p>
            <Input
              label={t('appeal.enforcementId')}
              value={enforcementId}
              onChange={(e) => setEnforcementId(e.target.value)}
              placeholder="Enforcement ID"
            />
            <Textarea
              label={t('appeal.reason')}
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Textarea
              label={t('appeal.details')}
              rows={3}
              value={supportingText}
              onChange={(e) => setSupportingText(e.target.value)}
            />
            <Button onClick={submit} variant="accent" className="w-full" loading={busy}>
              {t('appeal.submit')}
            </Button>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
