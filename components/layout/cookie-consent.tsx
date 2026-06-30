'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'zerocom_cookie_consent';

type ConsentState = 'unknown' | 'accepted' | 'declined';

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>('unknown');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored === 'accepted' || stored === 'declined') {
        setConsent(stored);
      }
    } catch {
      // localStorage unavailable — treat as unknown.
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {
      // localStorage unavailable — still hide banner.
    }
    setConsent('accepted');
  };

  const decline = () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    } catch {
      // localStorage unavailable — still hide banner.
    }
    setConsent('declined');
  };

  // Avoid hydration mismatch: only render banner after mount.
  if (!mounted || consent !== 'unknown') return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm shadow-lg"
    >
      <div className="container-page flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm text-muted-foreground">
          We use essential cookies for authentication and language preferences.
          We do not use third-party advertising cookies.{' '}
          <Link href="/legal/privacy.html" className="underline hover:text-foreground">
            Learn more
          </Link>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
