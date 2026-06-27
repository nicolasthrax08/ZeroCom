'use client';

import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/language-context';

export function DirectMatchBadge() {
  const { t } = useLanguage();
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-accent-soft bg-accent-soft px-3 py-2 text-sm text-accent">
      <ShieldCheck size={16} />
      <span>
        <strong>DirectMatch™ · </strong>
        {t('listings.directMatch')}
      </span>
    </div>
  );
}
