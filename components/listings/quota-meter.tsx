'use client';

export function QuotaMeter({ remaining, total }: { remaining: number; total: number }) {
  const used = total - remaining;
  const pct = Math.min(100, Math.round((used / total) * 100));
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>今日剩余免费浏览额度</span>
        <span>
          {remaining} / {total}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-muted">
        <div
          className="h-full bg-accent"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}
