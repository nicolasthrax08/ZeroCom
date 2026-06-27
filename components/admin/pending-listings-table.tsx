'use client';
import { useState } from 'react';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LISTING_STATUS_LABELS } from '@/lib/utils/i18n';
import type { Listing } from '@/server/data/types';

export function PendingListingsTable({ listings }: { listings: Listing[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [rows, setRows] = useState(listings);

  async function act(id: string, action: 'approve' | 'reject' | 'remove') {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}/${action}`, { method: 'POST' });
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
        { key: 'title', label: '标题' },
        { key: 'city', label: '城市' },
        { key: 'price', label: '价格（万）', align: 'right' },
        { key: 'status', label: '状态' },
        { key: 'actions', label: '操作', align: 'right' },
      ]}
      rows={rows}
      empty="暂无待审核房源"
      renderRow={(l) => (
        <>
          <td className="px-3 py-2">{l.title}</td>
          <td className="px-3 py-2 text-muted-foreground">
            {l.city} {l.district}
          </td>
          <td className="px-3 py-2 text-right tabular-nums">{l.priceRmbWan}</td>
          <td className="px-3 py-2">
            <Badge tone="warning">{LISTING_STATUS_LABELS[l.status]}</Badge>
          </td>
          <td className="px-3 py-2">
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="accent" onClick={() => act(l.id, 'approve')} disabled={busy === l.id}>
                通过
              </Button>
              <Button size="sm" variant="outline" onClick={() => act(l.id, 'reject')} disabled={busy === l.id}>
                驳回
              </Button>
              <Button size="sm" variant="destructive" onClick={() => act(l.id, 'remove')} disabled={busy === l.id}>
                移除
              </Button>
            </div>
          </td>
        </>
      )}
    />
  );
}
