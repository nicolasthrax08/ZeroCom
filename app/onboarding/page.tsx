import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ListChecks, FileText } from 'lucide-react';
import { serverT } from '@/lib/i18n/lang-server';

export default async function OnboardingPage() {
  const t = await serverT();
  return (
    <main className="container-page py-12">
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardBody>
            <h1 className="text-xl font-semibold text-foreground">{t('onboarding.welcome')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('onboarding.intro')}</p>
            <ul className="mt-4 space-y-3">
              <Step
                icon={<ShieldCheck size={20} />}
                title={t('onboarding.phoneDone')}
                desc={t('onboarding.phoneDone.desc')}
                done
              />
              <Step
                icon={<ListChecks size={20} />}
                title={t('onboarding.realName')}
                desc={t('onboarding.realName.desc')}
              />
              <Step
                icon={<FileText size={20} />}
                title={t('onboarding.policies')}
                desc={t('onboarding.policies.desc')}
              />
            </ul>
            <div className="mt-4 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
              <p className="font-medium text-background">{t('onboarding.antiBroker')}</p>
              <p>{t('onboarding.antiBroker.desc')}</p>
            </div>
            <div className="mt-5 flex gap-2">
              <Link href="/listings" className="flex-1">
                <Button variant="accent" className="w-full">{t('onboarding.start')}</Button>
              </Link>
              <Link href="/seller/verification" className="flex-1">
                <Button variant="outline" className="w-full">{t('onboarding.imSeller')}</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}

function Step({
  icon,
  title,
  desc,
  done,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  done?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {done && <Badge tone="success">已完成</Badge>}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}
