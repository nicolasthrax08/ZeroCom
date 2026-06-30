import { NextRequest, NextResponse } from 'next/server';

// CSP is computed per environment so dev (HMR / hydration / inline bootstrap)
// and production (strict) policies stay distinct. It is intentionally NOT a
// module constant.
function contentSecurityPolicy(): string {
  const isDev = process.env.NODE_ENV !== 'production';

  // Next.js App Router hydrates with inline bootstrap + RSC scripts; dev also
  // needs React Refresh / HMR (eval + websockets).
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";

  // Dev HMR uses websockets to localhost; production just talks to same origin.
  const connectSrc = isDev
    ? "'self' ws: wss: http://localhost:* http://127.0.0.1:*"
    : "'self'";

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', contentSecurityPolicy());
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  // L-01 FIX: Suppress X-Powered-By header to avoid leaking framework info.
  response.headers.delete('x-powered-by');
  response.headers.set('X-Request-Id', crypto.randomUUID());
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
