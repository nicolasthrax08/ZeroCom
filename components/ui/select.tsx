'use client';
import { cn } from '@/lib/utils/cn';
import { forwardRef, type SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className, label, error, id, options, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-2xl border border-border/85 bg-ivory/75 px-3.5 pr-9 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur',
            'transition-all duration-300 ease-luxury focus:border-accent/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent/15',
            error && 'border-danger focus:border-danger focus:ring-danger/15',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p id={`${inputId}-error`} className="text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
