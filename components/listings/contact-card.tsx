'use client';

import { Phone, MessageCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContactActions } from './contact-actions';
import { useLanguage } from '@/lib/i18n/language-context';

type RevealState =
  | { status: 'LOADING' }
  | { status: 'MASKED' }
  | { status: 'NO_INTENT' }
  | { status: 'REVEALED'; phone: string; wechat?: string }
  | { status: 'IS_OWNER' }
  | { status: 'NOT_ACTIVE' };

export function ContactCard({
  revealState,
  listingId,
  saved,
}: {
  revealState: RevealState;
  listingId: string;
  saved: boolean;
}) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{t('listings.contactSeller')}</h3>
          <Badge tone="accent">{t('status.verifiedOwner')}</Badge>
        </div>

        {revealState.status === 'LOADING' && <div className="text-sm text-muted-foreground">{t('listings.loading')}</div>}

        {revealState.status === 'IS_OWNER' && (
          <p className="text-sm text-muted-foreground">{t('listings.yourListing')}</p>
        )}

        {revealState.status === 'NOT_ACTIVE' && (
          <p className="text-sm text-muted-foreground">{t('listings.notActive')}</p>
        )}

        {revealState.status === 'MASKED' && (
          <>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground" />
              <span className="text-foreground">138****1234</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MessageCircle size={16} className="text-muted-foreground" />
              <span className="text-foreground">{t('listings.maskedPhone')}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('listings.subscribePrompt')}</p>
            <Button as="link" href="/pricing" variant="accent" full>
              {t('listings.unlockContact')}
            </Button>
          </>
        )}

        {revealState.status === 'NO_INTENT' && (
          <>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground" />
              <span className="text-foreground">138****1234</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('listings.proPrompt')}</p>
            <ContactActions listingId={listingId} saved={saved} />
          </>
        )}

        {revealState.status === 'REVEALED' && (
          <>
            <div className="flex items-center gap-3 rounded-lg border border-accent-soft bg-accent-soft px-3 py-2 text-sm">
              <ShieldCheck size={18} className="text-accent" />
              <span className="text-accent">{t('listings.directMatch')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground" />
              <a href={`tel:${revealState.phone}`} className="text-foreground hover:text-accent">
                {revealState.phone}
              </a>
            </div>
            {revealState.wechat && (
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle size={16} className="text-muted-foreground" />
                <span className="text-foreground">{revealState.wechat}</span>
              </div>
            )}
            <Button variant="accent" full>{t('listings.reminder')}</Button>
          </>
        )}

        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <AlertCircle size={14} className="mt-0.5" />
          {t('listings.safetyNotice')}
        </div>
      </CardBody>
    </Card>
  );
}
