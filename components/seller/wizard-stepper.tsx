'use client';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/lib/i18n/language-context';
import type { DictKey } from '@/lib/i18n/dictionary';

const STEPS: { key: string; labelKey: DictKey }[] = [
  { key: 'eligibility', labelKey: 'wizard.eligibility' },
  { key: 'basic', labelKey: 'wizard.basicInfo' },
  { key: 'address', labelKey: 'wizard.addressMap' },
  { key: 'photos', labelKey: 'wizard.photos' },
  { key: 'price', labelKey: 'wizard.priceDesc' },
  { key: 'review', labelKey: 'wizard.submit' },
];

export function WizardStepper({ current }: { current: string }) {
  const { t } = useLanguage();
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <ol className="flex flex-wrap gap-2">
      {STEPS.map((s, i) => (
        <li
          key={s.key}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-1 text-xs',
            i === idx
              ? 'border-accent bg-accent-soft text-accent'
              : i < idx
                ? 'border-border bg-muted text-foreground'
                : 'border-border text-muted-foreground',
          )}
        >
          <span className="font-semibold">{i + 1}.</span>
          {t(s.labelKey)}
        </li>
      ))}
    </ol>
  );
}
