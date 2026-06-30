'use client';
import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/language-context';

export default function VerificationPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [realName, setRealName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    const res = await fetch('/api/verification/real-name', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        realName,
        idCardNumber: idNumber,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!json.ok) {
      setError(json.error?.message ?? t('seller.submitFailed'));
      return;
    }
    router.push('/seller');
  }

  return (
    <main className="container-page py-8">
      <Card>
        <CardBody className="space-y-4">
          <h1 className="text-xl font-semibold text-foreground">{t('seller.verification.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('seller.verification.intro')}
          </p>
          <Input label={t('seller.verification.realName')} value={realName} onChange={(e) => setRealName(e.target.value)} />
          <Input label={t('seller.verification.idNumber')} value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
          <div>
            <p className="text-sm font-medium text-foreground">{t('seller.verification.idFront')}</p>
            <label className="mt-1 flex h-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border text-xs text-muted-foreground hover:border-accent hover:text-accent">
              {t('seller.verification.clickUpload')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  await fetch('/api/verification/id-card/upload', { method: 'POST' });
                }}
              />
            </label>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button onClick={submit} variant="accent" className="w-full" loading={busy}>
            {t('seller.verification.submit')}
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
