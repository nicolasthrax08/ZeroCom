import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { VERIFICATION_LABELS, ROLE_LABELS } from '@/lib/utils/i18n';
import type { User, UserVerification, Subscription, EnforcementAction, BrokerSignal } from '@/server/data/types';

export function UserDetail({
  user,
  verification,
  subscriptions,
  enforcements,
  signals,
}: {
  user: User;
  verification?: UserVerification;
  subscriptions: Subscription[];
  enforcements: EnforcementAction[];
  signals: BrokerSignal[];
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-foreground">{user.displayName ?? '用户'}</h3>
        </CardHeader>
        <CardBody className="space-y-2 text-sm">
          <p><strong>角色：</strong><Badge>{ROLE_LABELS[user.role]}</Badge></p>
          <p><strong>认证状态：</strong>{verification ? VERIFICATION_LABELS[verification.status] : '未认证'}</p>
          <p><strong>影子封禁：</strong>{user.isShadowBanned ? '是' : '否'}</p>
          <p><strong>永久封禁：</strong>{user.isHardBanned ? '是' : '否'}</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader><h4>订阅</h4></CardHeader>
        <CardBody>
          {subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">无订阅</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {subscriptions.map((s) => (
                <li key={s.id}>
                  {s.planCode} · {s.status} · 至 {s.endsAt.slice(0, 10)}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader><h4>风险信号</h4></CardHeader>
        <CardBody>
          {signals.length === 0 ? (
            <p className="text-sm text-muted-foreground">无</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {signals.map((s) => (
                <li key={s.id}>
                  <Badge tone={s.severity === 'CRITICAL' ? 'danger' : s.severity === 'HIGH' ? 'warning' : 'accent'}>
                    {s.severity}
                  </Badge>{' '}
                  {s.signalType} · 分值 {s.score}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader><h4>执行记录</h4></CardHeader>
        <CardBody>
          {enforcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">无</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {enforcements.map((e) => (
                <li key={e.id}>
                  <Badge>{e.type}</Badge> {e.reason}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
