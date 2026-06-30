'use client';
import { cn } from '@/lib/utils/cn';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, label, hint, error, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-2xl border border-border/85 bg-ivory/75 px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur',
            'text-sm text-foreground placeholder:text-muted-foreground/70',
            'transition-all duration-300 ease-luxury focus:border-accent/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent/15',
            error && 'border-danger focus:border-danger focus:ring-danger/15',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-danger">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, rows = 4, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'w-full rounded-2xl border border-border/85 bg-ivory/75 px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur',
            'text-sm text-foreground placeholder:text-muted-foreground/70',
            'transition-all duration-300 ease-luxury focus:border-accent/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent/15',
            error && 'border-danger focus:border-danger focus:ring-danger/15',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {error && <p id={`${inputId}-error`} className="text-xs font-medium text-danger">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
