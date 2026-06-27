import { cn } from '@/lib/utils/cn';

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'muted';

const TONE: Record<Tone, string> = {
  default: 'bg-muted text-foreground',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  accent: 'bg-accent-soft text-accent',
  muted: 'bg-muted text-muted-foreground',
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
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
