import { cn } from '@/lib/utils/cn';

export function ListBulletItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <li className={cn('text-sm text-muted-foreground', className)}>{children}</li>;
}
