'use client';
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/card';
import { OrderStatus } from '@/components/payments/order-status';
import { QrPlaceholder } from '@/components/payments/qr-placeholder';
import type { PaymentOrder } from '@/server/data/types';
import { useLanguage } from '@/lib/i18n/language-context';

function StatusInner() {
  const params = useParams<{ orderId: string }>();
  const { t } = useLanguage();
  const orderId = decodeURIComponent(params.orderId ?? '');
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch(`/api/payments/orders/${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((j) => {
        setLoading(false);
        if (!j.ok) {
          setError(j.error?.message ?? t('order.loadFailed'));
          return;
        }
        setOrder(j.data);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [orderId]);

  async function simulate() {
    const res = await fetch('/api/webhooks/alipay', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ out_trade_no: orderId, trade_no: `sim-${orderId}` }),
    });
    const json = await res.json();
    if (json.ok) {
      load();
    }
  }

  if (loading) {
    return (
      <Card>
        <CardBody>{t('order.loading')}</CardBody>
      </Card>
    );
  }
  if (error || !order) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm text-danger">{error ?? t('order.notFound')}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-md space-y-4">
        <Card>
          <CardBody>
            <h1 className="mb-3 text-xl font-semibold text-foreground">{t('order.title')}</h1>
            <OrderStatus order={order} onSimulate={order.status === 'PENDING_USER_PAY' ? simulate : undefined} />
          </CardBody>
        </Card>
        {order.status === 'PENDING_USER_PAY' && (
          <QrPlaceholder provider={order.provider} amountFen={order.amountFen} outTradeNo={order.outTradeNo} />
        )}
      </div>
    </main>
  );
}

function StatusFallback() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardBody>{t('order.loading')}</CardBody>
    </Card>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<StatusFallback />}>
      <StatusInner />
    </Suspense>
  );
}
