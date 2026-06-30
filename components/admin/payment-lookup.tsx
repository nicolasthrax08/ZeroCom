'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PAYMENT_STATUS_LABELS, label } from '@/lib/utils/i18n';
import { useLanguage } from '@/lib/i18n/language-context';
import type { PaymentOrder } from '@/server/data/types';

export function PaymentLookup() {
  const { t, lang } = useLanguage();
  const [outTradeNo, setOutTradeNo] = useState('');
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    setError(null);
    setOrder(null);
    const res = await fetch(`/api/admin/payments?outTradeNo=${encodeURIComponent(outTradeNo)}`);
    const json = await res.json();
    if (!json.ok) {
      setError(json.error?.message ?? t('admin.lookupFailed'));
      return;
    }
    setOrder(json.data);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder={t('admin.inputOrderNo')}
          value={outTradeNo}
          onChange={(e) => setOutTradeNo(e.target.value)}
        />
        <Button onClick={lookup} variant="accent">{t('admin.lookup')}</Button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {order && (
        <div className="rounded-lg border border-border p-3 text-sm">
          <p><strong>{t('admin.orderNoCol')}</strong>{order.outTradeNo}</p>
          <p><strong>{t('admin.statusCol2')}</strong><Badge>{label(PAYMENT_STATUS_LABELS, order.status, lang)}</Badge></p>
          <p><strong>{t('admin.amountCol')}</strong>{(order.amountFen / 100).toFixed(2)} 元</p>
          <p><strong>{t('admin.planCol')}</strong>{order.planCode}</p>
          <p><strong>{t('admin.methodCol')}</strong>{order.provider}</p>
        </div>
      )}
    </div>
  );
}
