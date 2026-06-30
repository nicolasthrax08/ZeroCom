'use client';
import { useState } from 'react';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { REPORT_STATUS_LABELS, label } from '@/lib/utils/i18n';
import { useLanguage } from '@/lib/i18n/language-context';
import type { Report } from '@/server/data/types';

const TONE: Record<Report['status'], 'success' | 'warning' | 'danger' | 'accent' | 'muted'> = {
  OPEN: 'warning',
  IN_REVIEW: 'accent',
  RESOLVED: 'success',
  REJECTED: 'muted',
};

export function ReportsQueue({ reports }: { reports: Report[] }) {
  const { t, lang } = useLanguage();
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
        { key: 'target', label: t('admin.targetCol') },
        { key: 'reason', label: t('report.reason') },
        { key: 'status', label: t('admin.statusCol') },
        { key: 'actions', label: t('admin.actionsCol'), align: 'right' },
      ]}
      rows={rows}
      empty={t('admin.noReports')}
      renderRow={(r) => (
        <>
          <td className="px-3 py-2 text-sm">
            {r.listingId ? t('admin.listingN', { id: r.listingId.slice(0, 8) }) : r.reportedUserId ? t('admin.userN', { id: r.reportedUserId.slice(0, 8) }) : '—'}
          </td>
          <td className="px-3 py-2 text-sm text-muted-foreground">{r.reason}</td>
          <td className="px-3 py-2">
            <Badge tone={TONE[r.status]}>{label(REPORT_STATUS_LABELS, r.status, lang)}</Badge>
          </td>
          <td className="px-3 py-2">
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="accent" onClick={() => resolve(r.id, 'resolve')} disabled={busy === r.id}>
                {t('admin.resolve')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => resolve(r.id, 'reject')} disabled={busy === r.id}>
                {t('admin.reject')}
              </Button>
            </div>
          </td>
        </>
      )}
    />
  );
}
