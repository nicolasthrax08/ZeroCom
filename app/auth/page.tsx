'use client';
import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { PhoneForm } from '@/components/auth/phone-form';
import { useLanguage } from '@/lib/i18n/language-context';

export default function AuthStartPage() {
  const { t } = useLanguage();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  async function handlePhone(value: string) {
    setPhone(value);
    setLoading(true);
    setError(undefined);
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phone: value }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setError(json.error?.message ?? t('auth.sendFailed'));
      return;
    }
    window.location.href = `/auth/verify?phone=${encodeURIComponent(value)}`;
  }

  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-md">
        <Card>
          <CardBody className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{t('auth.title')}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t('auth.subtitle')}</p>
            </div>
            <PhoneForm onSubmit={handlePhone} error={error} loading={loading} />
            <p className="text-xs text-muted-foreground">{t('auth.terms')}</p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
