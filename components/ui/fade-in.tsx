'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  /** Delay in ms before the transition starts (useful for staggering). */
  delay?: number;
  /** Tailwind classes merged onto the wrapper (e.g. "w-full"). */
  className?: string;
  /** Direction the element appears from. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Whether to scale slightly while fading for a "breathe in" feel. */
  zoom?: boolean;
};

const directionClasses: Record<NonNullable<FadeInProps['direction']>, string> = {
  up: 'translate-y-6',
  down: '-translate-y-6',
  left: 'translate-x-6',
  right: '-translate-x-6',
  none: '',
};

export function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  zoom = false,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    const show = () => {
      if (cancelled) return;
      // Force a paint of the hidden state first.
      void el.offsetHeight;
      setVisible(true);
    };

    if (delay === 0) {
      // Double rAF to ensure at least one paint of the initial state.
      requestAnimationFrame(() => requestAnimationFrame(show));
    } else {
      const id = setTimeout(() => {
        requestAnimationFrame(show);
      }, delay);
      return () => {
        cancelled = true;
        clearTimeout(id);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [delay]);

  const hiddenClasses = [
    'opacity-0',
    direction !== 'none' ? directionClasses[direction] : '',
    zoom ? 'scale-[0.98]' : '',
  ].filter(Boolean).join(' ');

  const visibleClasses = 'opacity-100 translate-y-0 translate-x-0 scale-100';

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? visibleClasses : hiddenClasses} ${className}`}
    >
      {children}
    </div>
  );
}

type FadeInStaggerProps = {
  children: ReactNode;
  /** Stagger delay between children, in ms. */
  step?: number;
  className?: string;
  direction?: FadeInProps['direction'];
  zoom?: FadeInProps['zoom'];
};

export function FadeInStagger({
  children,
  step = 60,
  className = '',
  direction,
  zoom,
}: FadeInStaggerProps) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <FadeIn key={i} delay={i * step} direction={direction} zoom={zoom}>
              {child}
            </FadeIn>
          ))
        : children}
    </div>
  );
}
