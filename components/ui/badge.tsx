import { cn } from '@/lib/utils/cn';

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'muted';

const TONE: Record<Tone, string> = {
  default: 'border-border/70 bg-ivory/80 text-foreground',
  success: 'border-accent/25 bg-accent-soft text-accent',
  warning: 'border-champagne/45 bg-champagne/10 text-amber-900',
  danger: 'border-danger/25 bg-danger/10 text-danger',
  accent: 'border-champagne/45 bg-gradient-to-r from-champagne/15 to-ivory text-accent',
  muted: 'border-border/70 bg-muted/70 text-muted-foreground',
};

export function Badge({
  tone = 'default',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
