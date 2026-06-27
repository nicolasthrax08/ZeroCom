'use client';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRMB } from '@/lib/utils/money';
import { PAYMENT_STATUS_LABELS } from '@/lib/utils/i18n';
import type { PaymentOrder } from '@/server/data/types';

const TONE: Record<PaymentOrder['status'], 'success' | 'warning' | 'danger' | 'muted' | 'accent'> = {
  CREATED: 'muted',
  PENDING_USER_PAY: 'warning',
  PAID: 'success',
  EXPIRED: 'danger',
  CANCELLED: 'muted',
  REFUNDED: 'accent',
};

export function OrderStatus({
  order,
  onSimulate,
}: {
  order: PaymentOrder;
  onSimulate?: () => void;
}) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">订单状态</h3>
          <Badge tone={TONE[order.status]}>{PAYMENT_STATUS_LABELS[order.status]}</Badge>
        </div>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">订单号</dt>
            <dd className="font-mono text-xs">{order.outTradeNo}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">金额</dt>
            <dd className="tabular-nums">{formatRMB(order.amountFen)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">方案</dt>
            <dd>{order.planCode === 'ANNUAL_PRO' ? '年度 Pro' : '月度 Pro'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">支付方式</dt>
            <dd>{order.provider === 'ALIPAY' ? '支付宝' : '微信支付'}</dd>
          </div>
        </dl>
        {order.status === 'PENDING_USER_PAY' && onSimulate && (
          <Button onClick={onSimulate} variant="outline" size="sm" className="w-full">
            模拟支付成功（仅开发模式）
          </Button>
        )}
        {order.status === 'PAID' && (
          <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
            支付成功，Pro 权益已激活。
          </p>
        )}
        {order.status === 'EXPIRED' && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            订单已过期，请重新下单。
          </p>
        )}
      </CardBody>
    </Card>
  );
}
