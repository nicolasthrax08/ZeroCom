'use client';
import { useState } from 'react';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BROKER_SEVERITY_LABELS, BROKER_SIGNAL_LABELS } from '@/lib/utils/i18n';
import type { BrokerSignal, User } from '@/server/data/types';

const SEVERITY_TONE: Record<BrokerSignal['severity'], 'success' | 'warning' | 'danger' | 'accent'> = {
  LOW: 'accent',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'danger',
};

export function BrokerRiskTable({
  signals,
  users,
}: {
  signals: BrokerSignal[];
  users: User[];
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [rows, setRows] = useState(signals);

  async function enforce(userId: string, action: 'warn' | 'challenge' | 'shadow-ban' | 'hard-ban') {
    setBusy(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, { method: 'POST' });
      const json = await res.json();
      if (json.ok) {
        // remove the user's signals from the queue after enforcement
        setRows((rs) => rs.filter((r) => r.userId !== userId));
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <DataTable
      columns={[
        { key: 'user', label: '用户' },
        { key: 'signal', label: '信号' },
        { key: 'severity', label: '严重度' },
        { key: 'score', label: '分值', align: 'right' },
        { key: 'actions', label: '操作', align: 'right' },
      ]}
      rows={rows}
      empty="暂无 broker 风险信号"
      renderRow={(s) => {
        const u = users.find((x) => x.id === s.userId);
        return (
          <>
            <td className="px-3 py-2">{u?.displayName ?? u?.phoneEncrypted ?? '—'}</td>
            <td className="px-3 py-2 text-muted-foreground">{BROKER_SIGNAL_LABELS[s.signalType] ?? s.signalType}</td>
            <td className="px-3 py-2">
              <Badge tone={SEVERITY_TONE[s.severity]}>{BROKER_SEVERITY_LABELS[s.severity]}</Badge>
            </td>
            <td className="px-3 py-2 text-right tabular-nums">{s.score}</td>
            <td className="px-3 py-2">
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="outline" onClick={() => enforce(s.userId!, 'warn')} disabled={busy === s.userId}>
                  警告
                </Button>
                <Button size="sm" variant="outline" onClick={() => enforce(s.userId!, 'challenge')} disabled={busy === s.userId}>
                  要求核验
                </Button>
                <Button size="sm" variant="outline" onClick={() => enforce(s.userId!, 'shadow-ban')} disabled={busy === s.userId}>
                  影子封禁
                </Button>
                <Button size="sm" variant="destructive" onClick={() => enforce(s.userId!, 'hard-ban')} disabled={busy === s.userId}>
                  永久封禁
                </Button>
              </div>
            </td>
          </>
        );
      }}
    />
  );
}
