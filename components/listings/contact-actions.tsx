'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ContactActions({ listingId, saved }: { listingId: string; saved: boolean }) {
  const [isSaved, setIsSaved] = useState(saved);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/save`, {
        method: isSaved ? 'DELETE' : 'POST',
      });
      if (res.ok) setIsSaved((v) => !v);
    } finally {
      setBusy(false);
    }
  }

  async function handleMessage() {
    window.location.href = `/dashboard/messages?listingId=${listingId}`;
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleSave} disabled={busy || isSaved}>
        {isSaved ? '已保存' : '保存房源'}
      </Button>
      <Button variant="outline" onClick={handleMessage}>发消息</Button>
    </div>
  );
}
