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
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-lg border border-border bg-background px-3 pr-8 text-sm',
            'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
            error && 'border-danger',
            className,
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
