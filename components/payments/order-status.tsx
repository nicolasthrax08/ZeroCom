'use client';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRMB } from '@/lib/utils/money';
import { PAYMENT_STATUS_LABELS, label } from '@/lib/utils/i18n';
import { useLanguage } from '@/lib/i18n/language-context';
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
  const { t, lang } = useLanguage();
  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{t('order.title')}</h3>
          <Badge tone={TONE[order.status]}>{label(PAYMENT_STATUS_LABELS, order.status, lang)}</Badge>
        </div>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('order.orderNo')}</dt>
            <dd className="font-mono text-xs">{order.outTradeNo}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('order.amount')}</dt>
            <dd className="tabular-nums">{formatRMB(order.amountFen)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('order.plan')}</dt>
            <dd>{order.planCode === 'ANNUAL_PRO' ? t('dash.annualPro') : t('dash.monthlyPro')}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t('order.method')}</dt>
            <dd>{order.provider === 'ALIPAY' ? t('pay.alipay') : t('pay.wechat')}</dd>
          </div>
        </dl>
        {order.status === 'PENDING_USER_PAY' && onSimulate && (
          <Button onClick={onSimulate} variant="outline" size="sm" className="w-full">
            {t('order.simulate')}
          </Button>
        )}
        {order.status === 'PAID' && (
          <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
            {t('order.paidSuccess')}
          </p>
        )}
        {order.status === 'EXPIRED' && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            {t('order.expired')}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
