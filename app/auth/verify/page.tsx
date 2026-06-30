'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { OtpForm } from '@/components/auth/otp-form';
import { useLanguage } from '@/lib/i18n/language-context';

function VerifyInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const phone = sp.get('phone') ?? '';
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [devOtp] = useState<string | undefined>(undefined);

  async function verify(otp: string, acceptTerms: boolean, acceptPrivacy: boolean) {
    setLoading(true);
    setError(undefined);
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phone, otp, acceptTerms, acceptPrivacy }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setError(json.error?.message ?? t('auth.verify.failed'));
      return;
    }
    router.push('/onboarding');
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <h1 className="text-xl font-semibold text-foreground">{t('auth.verify.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.verify.sentSixTo', { phone })}</p>
        <OtpForm phone={phone} onVerify={verify} loading={loading} error={error} devOtp={devOtp} />
      </CardBody>
    </Card>
  );
}

function VerifyFallback() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardBody>{t('auth.verify.loading')}</CardBody>
    </Card>
  );
}

export default function AuthVerifyPage() {
  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-md">
        <Suspense fallback={<VerifyFallback />}>
          <VerifyInner />
        </Suspense>
      </div>
    </main>
  );
}
