'use client';
import { cn } from '@/lib/utils/cn';

const STEPS = [
  { key: 'eligibility', label: '资格核验' },
  { key: 'basic', label: '基本信息' },
  { key: 'address', label: '地址与地图' },
  { key: 'photos', label: '上传照片' },
  { key: 'price', label: '价格与描述' },
  { key: 'review', label: '提交审核' },
];

export function WizardStepper({ current }: { current: string }) {
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
          {s.label}
        </li>
      ))}
    </ol>
  );
}
