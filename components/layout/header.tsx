import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/server/auth';
import { ROLE_LABELS } from '@/lib/utils/i18n';
import { LangSwitcher } from './lang-switcher';
import { MobileMenuNav } from './mobile-menu-nav';
import { NavLabel, NavItems } from './nav-items';
import type { DictKey } from '@/lib/i18n/dictionary';

const NAV_ITEMS: { href: string; labelKey: DictKey }[] = [
  { href: '/listings', labelKey: 'nav.browse' },
  { href: '/pricing', labelKey: 'nav.pricing' },
  { href: '/seller', labelKey: 'nav.sell' },
];

export async function Header() {
  const user = await currentUser();
  const items: { href: string; labelKey: DictKey }[] = [...NAV_ITEMS];
  if (user && (user.role === 'ADMIN' || user.role === 'MODERATOR')) {
    items.push({ href: '/admin', labelKey: 'nav.admin' as const });
  } else if (user) {
    items.push({ href: '/dashboard', labelKey: 'nav.dashboard' as const });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-base font-semibold text-foreground">
          <span className="text-accent">Zero</span>Com
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavItems items={items} />
        </nav>
        <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Badge tone="accent">{ROLE_LABELS[user.role]}</Badge>
              <span className="text-sm text-muted-foreground">{user.displayName ?? user.phoneEncrypted}</span>
              <form method="POST" action="/api/auth/logout">
                <Button variant="outline" size="sm" type="submit">
                  <NavLabel k="nav.logout" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  <NavLabel k="nav.login" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" variant="accent">
                  <NavLabel k="nav.signup" />
                </Button>
              </Link>
            </>
          )}
        </div>
        <LangSwitcher />
        <MobileMenuNav items={items} />
        </div>
      </div>
    </header>
  );
}

