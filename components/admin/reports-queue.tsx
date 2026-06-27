'use client';
import { useState } from 'react';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { REPORT_STATUS_LABELS } from '@/lib/utils/i18n';
import type { Report } from '@/server/data/types';

const TONE: Record<Report['status'], 'success' | 'warning' | 'danger' | 'accent' | 'muted'> = {
  OPEN: 'warning',
  IN_REVIEW: 'accent',
  RESOLVED: 'success',
  REJECTED: 'muted',
};

export function ReportsQueue({ reports }: { reports: Report[] }) {
  const [rows, setRows] = useState(reports);
  const [busy, setBusy] = useState<string | null>(null);

  async function resolve(id: string, action: 'resolve' | 'reject') {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}/resolve`, {
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
        { key: 'target', label: '被举报对象' },
        { key: 'reason', label: '原因' },
        { key: 'status', label: '状态' },
        { key: 'actions', label: '操作', align: 'right' },
      ]}
      rows={rows}
      empty="暂无举报"
      renderRow={(r) => (
        <>
          <td className="px-3 py-2 text-sm">
            {r.listingId ? `房源 ${r.listingId.slice(0, 8)}` : r.reportedUserId ? `用户 ${r.reportedUserId.slice(0, 8)}` : '—'}
          </td>
          <td className="px-3 py-2 text-sm text-muted-foreground">{r.reason}</td>
          <td className="px-3 py-2">
            <Badge tone={TONE[r.status]}>{REPORT_STATUS_LABELS[r.status]}</Badge>
          </td>
          <td className="px-3 py-2">
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="accent" onClick={() => resolve(r.id, 'resolve')} disabled={busy === r.id}>
                处理完成
              </Button>
              <Button size="sm" variant="outline" onClick={() => resolve(r.id, 'reject')} disabled={busy === r.id}>
                驳回
              </Button>
            </div>
          </td>
        </>
      )}
    />
  );
}
