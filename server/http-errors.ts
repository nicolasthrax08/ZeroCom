// Map domain errors to HTTP responses without leaking internal messages.
// Usage in route handlers:
//   try { ... }
//   catch (err) { return handleRouteError(err); }

import { NextResponse } from 'next/server';
import { NotFound, Forbidden, BadRequest, Unauthorized, QuotaExceeded } from './errors';

export function handleRouteError(err: unknown): NextResponse {
  if (err instanceof NotFound) {
    return NextResponse.json(
      { ok: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } },
      { status: 404 },
    );
  }
  if (err instanceof Unauthorized) {
    return NextResponse.json(
      { ok: false, error: { code: 'UNAUTHENTICATED', message: 'Please sign in' } },
      { status: 401 },
    );
  }
  if (err instanceof Forbidden) {
    return NextResponse.json(
      { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action' } },
      { status: 403 },
    );
  }
  if (err instanceof BadRequest) {
    return NextResponse.json(
      { ok: false, error: { code: 'BAD_REQUEST', message: err.message } },
      { status: 400 },
    );
  }
  if (err instanceof QuotaExceeded) {
    return NextResponse.json(
      { ok: false, error: { code: 'QUOTA_EXCEEDED', message: 'Rate limit exceeded, please try again later' } },
      { status: 429 },
    );
  }
  // Unknown errors: log server-side, return generic 500.
  // NEVER expose err.message or stack trace to the client.
  console.error('[unhandled route error]', err);
  return NextResponse.json(
    { ok: false, error: { code: 'INTERNAL', message: 'An unexpected error occurred' } },
    { status: 500 },
  );
}
