'use client';
import { useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

type ToastTone = 'success' | 'error' | 'info';

export function ToastItem({
  id,
  message,
  tone = 'info',
  onDismiss,
}: {
  id: string;
  message: string;
  tone?: ToastTone;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 4500);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  const toneClass = {
    success: 'border-green-200 bg-green-50 text-green-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    info: 'border-border bg-muted text-foreground',
  }[tone];

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border px-4 py-3 shadow-sm', toneClass)} role="status">
      {tone === 'success' && <CheckCircle size={18} />}
      {tone === 'error' && <AlertCircle size={18} />}
      <p className="flex-1 text-sm">{message}</p>
      <button onClick={() => onDismiss(id)} className="rounded p-0.5 hover:bg-black/5" aria-label="关闭">
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastViewport({ children }: { children: React.ReactNode }) {
  return <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-2">{children}</div>;
}
