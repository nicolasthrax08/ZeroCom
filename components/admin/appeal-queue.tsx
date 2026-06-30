'use client';
import { useState } from 'react';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/language-context';
import type { Appeal } from '@/server/data/types';

export function AppealQueue({ appeals }: { appeals: Appeal[] }) {
  const { t } = useLanguage();
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
        { key: 'user', label: t('admin.appellant') },
        { key: 'reason', label: t('admin.reasonCol') },
        { key: 'status', label: t('admin.statusCol') },
        { key: 'actions', label: t('admin.actionsCol'), align: 'right' },
      ]}
      rows={rows}
      empty={t('admin.noAppeals')}
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
                {t('admin.approve')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => resolve(a.id, 'reject')} disabled={busy === a.id}>
                {t('admin.reject')}
              </Button>
            </div>
          </td>
        </>
      )}
    />
  );
}
