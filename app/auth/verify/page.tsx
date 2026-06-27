'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { OtpForm } from '@/components/auth/otp-form';

function VerifyInner() {
  const sp = useSearchParams();
  const router = useRouter();
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
      setError(json.error?.message ?? '验证失败');
      return;
    }
    router.push('/onboarding');
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <h1 className="text-xl font-semibold text-foreground">输入验证码</h1>
        <p className="text-sm text-muted-foreground">已发送 6 位验证码到 {phone}</p>
        <OtpForm phone={phone} onVerify={verify} loading={loading} error={error} devOtp={devOtp} />
      </CardBody>
    </Card>
  );
}

export default function AuthVerifyPage() {
  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-md">
        <Suspense fallback={<Card><CardBody>加载中…</CardBody></Card>}>
          <VerifyInner />
        </Suspense>
      </div>
    </main>
  );
}
