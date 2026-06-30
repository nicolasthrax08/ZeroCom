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
  default:
    'border border-midnight/10 bg-midnight text-ivory shadow-soft hover:-translate-y-0.5 hover:bg-midnight/92 hover:shadow-luxury',
  outline:
    'border border-border/90 bg-ivory/60 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur hover:-translate-y-0.5 hover:border-champagne/55 hover:bg-ivory hover:shadow-soft',
  ghost:
    'text-foreground hover:bg-muted/75 hover:text-foreground',
  accent:
    'magnetic-button relative overflow-hidden border border-champagne/55 bg-gradient-to-r from-[#0f766e] via-[#0d6c65] to-[#c9a866] text-white shadow-gold hover:-translate-y-0.5 hover:shadow-luxury',
  destructive: 'border border-danger/20 bg-danger text-white hover:-translate-y-0.5 hover:bg-danger/90',
};

const SIZE: Record<Size, string> = {
  sm: 'min-h-9 px-3.5 py-2 text-sm',
  md: 'min-h-10 px-4 py-2.5 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, disabled, full, as, href, children, ...rest }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
      'transition-all duration-300 ease-luxury focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
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
      <button ref={ref} className={classes} disabled={disabled || loading} {...rest}>
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
        )}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
Button.displayName = 'Button';
