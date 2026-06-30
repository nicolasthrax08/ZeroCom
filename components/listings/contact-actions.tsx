'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';

export function ContactActions({ listingId, saved }: { listingId: string; saved: boolean }) {
  const { t } = useLanguage();
  const [isSaved, setIsSaved] = useState(saved);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        disabled={busy || isSaved}
        onClick={async () => {
          setBusy(true);
          try {
            const res = await fetch(`/api/listings/${listingId}/save`, { method: isSaved ? 'DELETE' : 'POST' });
            if (res.ok) setIsSaved((v) => !v);
          } finally {
            setBusy(false);
          }
        }}
      >
        {isSaved ? t('contact.saved') : t('contact.save')}
      </Button>
      <Button variant="outline" onClick={() => { window.location.href = `/dashboard/messages?listingId=${listingId}`; }}>{t('contact.message')}</Button>
    </div>
  );
}
