// Lightweight analytics event logger. Production would send events to a pipeline
// such as Kafka / Datadog / 神策; the MVP records them in-memory and logs to console
// (suppressed in test environments).

import { store } from './data/store';

export type AnalyticsEvent =
  | 'visit_landing'
  | 'auth_otp_requested'
  | 'auth_completed'
  | 'verification_started'
  | 'verification_completed'
  | 'listing_feed_viewed'
  | 'listing_detail_viewed'
  | 'quota_exhausted'
  | 'paywall_viewed'
  | 'subscription_order_created'
  | 'subscription_paid'
  | 'contact_revealed'
  | 'listing_created'
  | 'listing_published'
  | 'broker_signal_triggered'
  | 'report_submitted';

export interface AnalyticsEntry {
  id: string;
  event: AnalyticsEvent;
  userId?: string | null;
  listingId?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const ringBuffer: AnalyticsEntry[] = [];
const MAX_BUFFER = 1000;

export async function logAnalytics(
  event: AnalyticsEvent,
  opts: { userId?: string | null; listingId?: string | null; metadata?: Record<string, unknown> } = {},
): Promise<AnalyticsEntry> {
  const entry: AnalyticsEntry = {
    id: crypto.randomUUID(),
    event,
    userId: opts.userId ?? null,
    listingId: opts.listingId ?? null,
    metadata: opts.metadata,
    createdAt: new Date().toISOString(),
  };
  ringBuffer.push(entry);
  if (ringBuffer.length > MAX_BUFFER) ringBuffer.shift();

  await store.appendAuditLog({
    actorId: opts.userId ?? null,
    action: `analytics:${event}`,
    target: opts.listingId ?? null,
    metadata: opts.metadata ?? null,
  });

  if (process.env.NODE_ENV !== 'test') {
    console.log(`[analytics] ${event}`, opts.userId ? `user=${opts.userId}` : '(anonymous)');
  }
  return entry;
}

export function listAnalytics(): AnalyticsEntry[] {
  return [...ringBuffer];
}
