import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { VERIFICATION_LABELS, ROLE_LABELS, BROKER_SEVERITY_LABELS, label } from '@/lib/utils/i18n';
import { useLanguage } from '@/lib/i18n/language-context';
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
  const { t, lang } = useLanguage();
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-foreground">{user.displayName ?? t('admin.userCol')}</h3>
        </CardHeader>
        <CardBody className="space-y-2 text-sm">
          <p><strong>{t('admin.role')}</strong><Badge>{label(ROLE_LABELS, user.role, lang)}</Badge></p>
          <p><strong>{t('admin.verificationStatus')}</strong>{verification ? label(VERIFICATION_LABELS, verification.status, lang) : t('admin.unverified')}</p>
          <p><strong>{t('admin.shadowBanned')}</strong>{user.isShadowBanned ? t('admin.yes') : t('admin.no')}</p>
          <p><strong>{t('admin.hardBanned')}</strong>{user.isHardBanned ? t('admin.yes') : t('admin.no')}</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader><h4>{t('admin.subscription')}</h4></CardHeader>
        <CardBody>
          {subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('admin.noSubscription')}</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {subscriptions.map((s) => (
                <li key={s.id}>
                  {s.planCode} · {s.status} · {t('dash.validUntil')} {s.endsAt.slice(0, 10)}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader><h4>{t('admin.riskSignals')}</h4></CardHeader>
        <CardBody>
          {signals.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('admin.none')}</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {signals.map((s) => (
                <li key={s.id}>
                  <Badge tone={s.severity === 'CRITICAL' ? 'danger' : s.severity === 'HIGH' ? 'warning' : 'accent'}>
                    {label(BROKER_SEVERITY_LABELS, s.severity, lang)}
                  </Badge>{' '}
                  {s.signalType} · {t('admin.score')} {s.score}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader><h4>{t('admin.enforcements')}</h4></CardHeader>
        <CardBody>
          {enforcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('admin.none')}</p>
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
