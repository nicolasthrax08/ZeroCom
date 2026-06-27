'use client';
import { useRef, useEffect, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils/cn';

export function OtpInput({
  length = 6,
  onComplete,
  disabled,
  error,
}: {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: string;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function handleChange(val: string, idx: number) {
    if (!/^\d*$/.test(val)) return;
    const digit = val.slice(-1);
    if (!digit) return;
    refs.current[idx]!.value = digit;
    if (idx < length - 1) refs.current[idx + 1]?.focus();
    const joined = refs.current.map((i) => i?.value ?? '').join('');
    if (joined.length === length) onComplete(joined);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === 'Backspace') {
      const el = refs.current[idx];
      if (!el?.value && idx > 0) refs.current[idx - 1]?.focus();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2" role="group" aria-label="验证码">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            className={cn(
              'h-12 w-10 rounded-lg border border-border text-center text-lg font-semibold',
              'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
              error && 'border-danger',
            )}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKey(e, i)}
          />
        ))}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
