'use client';
import { cn } from '@/lib/utils/cn';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';

type Variant = 'default' | 'outline' | 'ghost' | 'accent' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
  as?: 'link';
  href?: string;
  children?: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-border text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
  accent: 'bg-accent text-accent-soft hover:bg-accent/90',
  destructive: 'bg-danger text-white hover:bg-danger/90',
};

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, disabled, full, as, href, children, ...rest }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-colors focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-accent focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      VARIANT[variant],
      SIZE[size],
      full && 'w-full',
      className,
    );
    if (as === 'link' && href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
