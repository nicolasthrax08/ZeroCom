import { Card, CardBody } from '@/components/ui/card';
import { formatRMB } from '@/lib/utils/money';

export function QrPlaceholder({
  provider,
  amountFen,
  outTradeNo,
}: {
  provider: 'ALIPAY' | 'WECHATPAY';
  amountFen: number;
  outTradeNo: string;
}) {
  const label = provider === 'ALIPAY' ? '支付宝扫码支付' : '微信扫码支付';
  const color = provider === 'ALIPAY' ? 'bg-blue-500' : 'bg-green-500';
  return (
    <Card>
      <CardBody className="space-y-3 text-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-lg border border-border bg-muted">
          <div className={`h-20 w-20 ${color} opacity-80`} aria-hidden />
        </div>
        <p className="text-2xl font-bold text-foreground tabular-nums">{formatRMB(amountFen)}</p>
        <p className="text-xs text-muted-foreground">订单号：{outTradeNo}</p>
        <p className="text-xs text-amber-700">（演示模式 · 15 分钟内有效）</p>
      </CardBody>
    </Card>
  );
}
