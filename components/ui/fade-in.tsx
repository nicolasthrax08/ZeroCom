import { type ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  /** Delay in ms before the animation starts. */
  delay?: number;
  /** Tailwind classes merged onto the wrapper. */
  className?: string;
  /** Direction the element appears from. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Whether to scale slightly while fading. */
  zoom?: boolean;
};

const directionTransform: Record<NonNullable<FadeInProps['direction']>, string> = {
  up: 'translateY(24px)',
  down: 'translateY(-24px)',
  left: 'translateX(24px)',
  right: 'translateX(-24px)',
  none: 'none',
};

export function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  zoom = false,
}: FadeInProps) {
  const transform = directionTransform[direction];
  const scale = zoom ? ' scale(0.97)' : '';

  const style: React.CSSProperties = {
    animation: `fade-up 0.7s ease-out ${delay}ms both`,
    // If the element has a custom transform direction, override via CSS variable.
    // We use inline style for the from-state so it composes with Tailwind utilities.
  };

  // Use a CSS variable to communicate the direction to the @keyframes via the
  // animation name. Simpler: just use a per-direction class.
  const keyframeName =
    direction === 'up'
      ? 'fade-up'
      : direction === 'down'
        ? 'fade-down'
        : direction === 'left'
          ? 'fade-left'
          : direction === 'right'
            ? 'fade-right'
            : 'fade-in';

  const zoomKeyframe = zoom ? `-${keyframeName}` : keyframeName;

  return (
    <div
      className={className}
      style={{
        animation: `${zoom ? 'fade-up' : keyframeName} 0.7s ease-out ${delay}ms both`,
      }}
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
