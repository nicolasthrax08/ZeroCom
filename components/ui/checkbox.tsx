'use client';
import { cn } from '@/lib/utils/cn';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ className, id, label, ...rest }, ref) => {
    return (
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-sm">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={cn(
            'mt-0.5 h-4 w-4 rounded border-border accent-accent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            className,
          )}
          {...rest}
        />
        <span className="text-foreground">{label}</span>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
