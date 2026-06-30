import { Card, CardBody } from '@/components/ui/card';
import { formatRMB } from '@/lib/utils/money';
import { useLanguage } from '@/lib/i18n/language-context';

export function QrPlaceholder({
  provider,
  amountFen,
  outTradeNo,
}: {
  provider: 'ALIPAY' | 'WECHATPAY';
  amountFen: number;
  outTradeNo: string;
}) {
  const { t } = useLanguage();
  const isAlipay = provider === 'ALIPAY';
  const labelKey = isAlipay ? 'pay.qrAlipay' : 'pay.qrWechat';
  const color = isAlipay ? 'bg-blue-500' : 'bg-green-500';
  return (
    <Card>
      <CardBody className="space-y-3 text-center">
        <p className="text-sm text-muted-foreground">{t(labelKey)}</p>
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-lg border border-border bg-muted">
          <div className={`h-20 w-20 ${color} opacity-80`} aria-hidden />
        </div>
        <p className="text-2xl font-bold text-foreground tabular-nums">{formatRMB(amountFen)}</p>
        <p className="text-xs text-muted-foreground">{t('pay.qrOrderNo')}{outTradeNo}</p>
        <p className="text-xs text-amber-700">{t('pay.qrExpiry', { n: 15 })}</p>
      </CardBody>
    </Card>
  );
}
