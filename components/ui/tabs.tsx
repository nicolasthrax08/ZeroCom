'use client';
import { cn } from '@/lib/utils/cn';

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div role="tablist" className="flex border-b border-border">
      {items.map((it) => (
        <button
          key={it.key}
          role="tab"
          aria-selected={active === it.key}
          onClick={() => onChange(it.key)}
          className={cn(
            '-mb-px px-4 py-2 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            active === it.key
              ? 'border-b-2 border-accent text-accent'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
