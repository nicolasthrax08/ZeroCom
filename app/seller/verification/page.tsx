'use client';
import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
  const router = useRouter();
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
      setError(json.error?.message ?? '提交失败');
      return;
    }
    router.push('/seller');
  }

  return (
    <main className="container-page py-8">
      <Card>
        <CardBody className="space-y-4">
          <h1 className="text-xl font-semibold text-foreground">二级卖家认证</h1>
          <p className="text-sm text-muted-foreground">
            完成真实姓名 + 身份证号核验后方可发布房源。图像仅用于身份核验。
          </p>
          <Input label="真实姓名" value={realName} onChange={(e) => setRealName(e.target.value)} />
          <Input label="身份证号" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
          <div>
            <p className="text-sm font-medium text-foreground">身份证正面（上传）</p>
            <label className="mt-1 flex h-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border text-xs text-muted-foreground hover:border-accent hover:text-accent">
              点击上传
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
            提交实名申请
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
