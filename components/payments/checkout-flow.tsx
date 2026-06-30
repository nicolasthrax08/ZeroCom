'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRMB } from '@/lib/utils/money';
import { useLanguage } from '@/lib/i18n/language-context';

const PLANS: Record<string, { nameKey: 'pay.monthly' | 'pay.annual'; amountFen: number; days: number; autoRenew: boolean }> = {
  MONTHLY_PRO: { nameKey: 'pay.monthly', amountFen: 2900, days: 30, autoRenew: false },
  ANNUAL_PRO: { nameKey: 'pay.annual', amountFen: 19900, days: 365, autoRenew: true },
};

const PROVIDERS: { key: 'ALIPAY' | 'WECHATPAY'; labelKey: 'pay.alipay' | 'pay.wechat'; color: string }[] = [
  { key: 'ALIPAY', labelKey: 'pay.alipay', color: 'text-blue-600' },
  { key: 'WECHATPAY', labelKey: 'pay.wechat', color: 'text-green-600' },
];

export function CheckoutFlow() {
  const router = useRouter();
  const sp = useSearchParams();
  const { t } = useLanguage();
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
      if (!json.ok) throw new Error(json.error?.message ?? t('pay.orderFailed'));
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
          <h3 className="font-semibold text-foreground">{t(plan.nameKey)}</h3>
          <Badge tone="accent">{t('pay.trialDays', { n: plan.days })}</Badge>
        </div>
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {formatRMB(plan.amountFen)}
          {plan.autoRenew && <span className="ml-2 text-xs text-muted-foreground">{t('pay.autoRenew')}</span>}
        </p>
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">{t('pay.chooseMethod')}</p>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.key}
                onClick={() => setProvider(p.key)}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                  provider === p.key ? 'border-accent ring-2 ring-accent/20' : 'border-border'
                }`}
              >
                <span className={p.color}>{t(p.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>
        {err && <p className="text-sm text-danger">{err}</p>}
        <Button onClick={start} variant="accent" className="w-full" loading={submitting}>
          {t('pay.payNow')} {formatRMB(plan.amountFen)}
        </Button>
        <p className="text-center text-xs text-muted-foreground">{t('pay.agree')}</p>
      </CardBody>
    </Card>
  );
}
