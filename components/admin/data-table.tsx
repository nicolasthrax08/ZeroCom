import { cn } from '@/lib/utils/cn';

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  renderRow,
  empty,
}: {
  columns: { key: string; label: string; align?: 'left' | 'right' }[];
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
  empty?: React.ReactNode;
}) {
  if (rows.length === 0 && empty) {
    return <div className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">{empty}</div>;
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  'px-3 py-2 text-xs font-medium text-muted-foreground',
                  c.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border">
              {renderRow(r)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
