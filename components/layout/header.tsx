import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/server/auth';
import { ROLE_LABELS, label } from '@/lib/utils/i18n';
import { LangSwitcher } from './lang-switcher';
import { MobileMenuNav } from './mobile-menu-nav';
import { NavLabel, NavItems } from './nav-items';
import type { DictKey, Lang } from '@/lib/i18n/dictionary';

const NAV_ITEMS: { href: string; labelKey: DictKey }[] = [
  { href: '/listings', labelKey: 'nav.browse' },
  { href: '/pricing', labelKey: 'nav.pricing' },
  { href: '/seller', labelKey: 'nav.sell' },
];

export async function Header() {
  const user = await currentUser();
  const cookieLang = (await cookies()).get('zerocom_lang')?.value;
  const lang: Lang = cookieLang === 'en' ? 'en' : 'zh';
  const items: { href: string; labelKey: DictKey }[] = [...NAV_ITEMS];
  if (user && (user.role === 'ADMIN' || user.role === 'MODERATOR')) {
    items.push({ href: '/admin', labelKey: 'nav.admin' as const });
  } else if (user) {
    items.push({ href: '/dashboard', labelKey: 'nav.dashboard' as const });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ivory/78 shadow-[0_14px_40px_-28px_rgba(8,17,19,0.55)] backdrop-blur-2xl supports-[backdrop-filter]:bg-ivory/62">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-midnight text-ivory shadow-soft transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-champagne/60 to-teal/40 opacity-60" />
            <span className="relative">Z</span>
          </span>
          <span><span className="text-accent">Zero</span>Com</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-white/30 px-1.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] md:flex">
          <NavItems items={items} />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Badge tone="accent">{label(ROLE_LABELS, user.role, lang)}</Badge>
                <span className="max-w-36 truncate text-sm font-medium text-muted-foreground">{user.displayName ?? user.phoneEncrypted}</span>
                <form method="POST" action="/api/auth/logout">
                  <Button variant="outline" size="sm" type="submit">
                    <NavLabel k="nav.logout" />
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" size="sm">
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
