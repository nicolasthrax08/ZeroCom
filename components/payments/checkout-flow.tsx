'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRMB } from '@/lib/utils/money';

const PLANS: Record<string, { name: string; amountFen: number; days: number; autoRenew: boolean }> = {
  MONTHLY_PRO: { name: '月度 Pro', amountFen: 2900, days: 30, autoRenew: false },
  ANNUAL_PRO: { name: '年度 Pro', amountFen: 19900, days: 365, autoRenew: true },
};

const PROVIDERS: { key: 'ALIPAY' | 'WECHATPAY'; label: string; color: string }[] = [
  { key: 'ALIPAY', label: '支付宝', color: 'text-blue-600' },
  { key: 'WECHATPAY', label: '微信支付', color: 'text-green-600' },
];

export function CheckoutFlow() {
  const router = useRouter();
  const sp = useSearchParams();
  const planCode = sp.get('plan') ?? 'MONTHLY_PRO';
  const plan = PLANS[planCode] ?? PLANS.MONTHLY_PRO;
  const [provider, setProvider] = useState<'ALIPAY' | 'WECHATPAY'>('ALIPAY');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function start() {
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch('/api/payments/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ planCode, provider }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? '下单失败');
      router.push(`/payment/status/${json.data.outTradeNo}`);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{plan.name}</h3>
          <Badge tone="accent">{plan.days} 天</Badge>
        </div>
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {formatRMB(plan.amountFen)}
          {plan.autoRenew && <span className="ml-2 text-xs text-muted-foreground">默认自动续期</span>}
        </p>
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">选择支付方式</p>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.key}
                onClick={() => setProvider(p.key)}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                  provider === p.key ? 'border-accent ring-2 ring-accent/20' : 'border-border'
                }`}
              >
                <span className={p.color}>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
        {err && <p className="text-sm text-danger">{err}</p>}
        <Button onClick={start} variant="accent" className="w-full" loading={submitting}>
          立即支付 {formatRMB(plan.amountFen)}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          支付即表示同意《服务条款》《隐私政策》《退款政策》。
        </p>
      </CardBody>
    </Card>
  );
}
