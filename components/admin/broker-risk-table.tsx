'use client';
import { useState } from 'react';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BROKER_SEVERITY_LABELS, BROKER_SIGNAL_LABELS, label } from '@/lib/utils/i18n';
import { useLanguage } from '@/lib/i18n/language-context';
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
  const { t, lang } = useLanguage();

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
        { key: 'user', label: lang === 'en' ? 'User' : '用户' },
        { key: 'signal', label: lang === 'en' ? 'Signal' : '信号' },
        { key: 'severity', label: lang === 'en' ? 'Severity' : '严重度' },
        { key: 'score', label: lang === 'en' ? 'Score' : '分值', align: 'right' },
        { key: 'actions', label: lang === 'en' ? 'Actions' : '操作', align: 'right' },
      ]}
      rows={rows}
      empty={lang === 'en' ? 'No broker risk signals' : '暂无 broker 风险信号'}
      renderRow={(s) => {
        const u = users.find((x) => x.id === s.userId);
        return (
          <>
            <td className="px-3 py-2">{u?.displayName ?? u?.phoneEncrypted ?? '—'}</td>
            <td className="px-3 py-2 text-muted-foreground">{label(BROKER_SIGNAL_LABELS, s.signalType, lang)}</td>
            <td className="px-3 py-2">
              <Badge tone={SEVERITY_TONE[s.severity]}>{label(BROKER_SEVERITY_LABELS, s.severity, lang)}</Badge>
            </td>
            <td className="px-3 py-2 text-right tabular-nums">{s.score}</td>
            <td className="px-3 py-2">
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="outline" onClick={() => enforce(s.userId!, 'warn')} disabled={busy === s.userId}>
                  {t('admin.warn')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => enforce(s.userId!, 'challenge')} disabled={busy === s.userId}>
                  {t('admin.challenge')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => enforce(s.userId!, 'shadow-ban')} disabled={busy === s.userId}>
                  {t('admin.shadowBan')}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => enforce(s.userId!, 'hard-ban')} disabled={busy === s.userId}>
                  {t('admin.hardBan')}
                </Button>
              </div>
            </td>
          </>
        );
      }}
    />
  );
}
