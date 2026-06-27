'use client';
import { useState } from 'react';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Appeal } from '@/server/data/types';

export function AppealQueue({ appeals }: { appeals: Appeal[] }) {
  const [rows, setRows] = useState(appeals);
  const [busy, setBusy] = useState<string | null>(null);

  async function resolve(id: string, action: 'approve' | 'reject') {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/appeals/${id}/resolve`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (json.ok) {
        setRows((rs) => rs.filter((r) => r.id !== id));
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <DataTable
      columns={[
        { key: 'user', label: '申诉人' },
        { key: 'reason', label: '申诉理由' },
        { key: 'status', label: '状态' },
        { key: 'actions', label: '操作', align: 'right' },
      ]}
      rows={rows}
      empty="暂无申诉"
      renderRow={(a) => (
        <>
          <td className="px-3 py-2 text-sm">{a.userId.slice(0, 8)}</td>
          <td className="px-3 py-2 text-sm text-muted-foreground">{a.reason}</td>
          <td className="px-3 py-2">
            <Badge tone={a.status === 'OPEN' ? 'warning' : a.status === 'APPROVED' ? 'success' : 'muted'}>
              {a.status}
            </Badge>
          </td>
          <td className="px-3 py-2">
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="accent" onClick={() => resolve(a.id, 'approve')} disabled={busy === a.id}>
                通过
              </Button>
              <Button size="sm" variant="outline" onClick={() => resolve(a.id, 'reject')} disabled={busy === a.id}>
                驳回
              </Button>
            </div>
          </td>
        </>
      )}
    />
  );
}
