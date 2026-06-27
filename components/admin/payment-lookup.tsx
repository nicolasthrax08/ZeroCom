'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PAYMENT_STATUS_LABELS } from '@/lib/utils/i18n';
import type { PaymentOrder } from '@/server/data/types';

export function PaymentLookup() {
  const [outTradeNo, setOutTradeNo] = useState('');
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    setError(null);
    setOrder(null);
    const res = await fetch(`/api/admin/payments?outTradeNo=${encodeURIComponent(outTradeNo)}`);
    const json = await res.json();
    if (!json.ok) {
      setError(json.error?.message ?? '查询失败');
      return;
    }
    setOrder(json.data);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="输入订单号 out_trade_no"
          value={outTradeNo}
          onChange={(e) => setOutTradeNo(e.target.value)}
        />
        <Button onClick={lookup} variant="accent">查询</Button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {order && (
        <div className="rounded-lg border border-border p-3 text-sm">
          <p><strong>订单号：</strong>{order.outTradeNo}</p>
          <p><strong>状态：</strong><Badge>{PAYMENT_STATUS_LABELS[order.status]}</Badge></p>
          <p><strong>金额：</strong>{(order.amountFen / 100).toFixed(2)} 元</p>
          <p><strong>方案：</strong>{order.planCode}</p>
          <p><strong>支付方式：</strong>{order.provider}</p>
        </div>
      )}
    </div>
  );
}
