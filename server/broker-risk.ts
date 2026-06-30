// Broker risk detection, scoring, and enforcement recommendation.
import { store } from './data/store';
import type { BrokerSignal, User } from './data/types';

export const BROKER_SCORE_BY_SEVERITY: Record<BrokerSignal['severity'], number> = {
  LOW: 5,
  MEDIUM: 20,
  HIGH: 50,
  CRITICAL: 100,
};

export function aggregateScore(signals: BrokerSignal[]): number {
  return signals.reduce((acc, s) => acc + (BROKER_SCORE_BY_SEVERITY[s.severity] ?? 0), 0);
}

export function recommendEnforcement(
  score: number,
  hasCritical: boolean,
): 'NONE' | 'SOFT_WARNING' | 'VERIFICATION_CHALLENGE' | 'SHADOW_BAN' | 'HARD_BAN' {
  if (hasCritical) return 'HARD_BAN';
  if (score >= 100) return 'HARD_BAN';
  if (score >= 70) return 'SHADOW_BAN';
  if (score >= 40) return 'VERIFICATION_CHALLENGE';
  if (score >= 20) return 'SOFT_WARNING';
  return 'NONE';
}

export async function refreshRisk(userId: string, now = new Date()): Promise<{
  userId: string;
  riskScore: number;
  severityHighest: BrokerSignal['severity'] | null;
  recommendation: ReturnType<typeof recommendEnforcement>;
}> {
  const signals = await store.listBrokerSignalsForUser(userId);
  const nowMs = now.getTime();
  const recent = signals.filter((s) => nowMs - new Date(s.createdAt).getTime() < 30 * 86_400_000);
  const score = aggregateScore(recent);
  const order: BrokerSignal['severity'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  let highest: BrokerSignal['severity'] | null = null;
  for (const lvl of order) {
    if (recent.some((s) => s.severity === lvl)) {
      highest = lvl;
      break;
    }
  }
  const hasCritical = recent.some((s) => s.severity === 'CRITICAL');
  return {
    userId,
    riskScore: score,
    severityHighest: highest,
    recommendation: recommendEnforcement(score, hasCritical),
  };
}

// IDs of known suspicious accounts. In a real system this is computed periodically.
const PRE_FLAGGED_USERS = new Set(['user-shadow-banned']);

export function isPreFlaggedForBroker(userId: string): boolean {
  return PRE_FLAGGED_USERS.has(userId);
}

export function firstMessageLooksLikeBrokerOutbound(body: string): {
  flagged: boolean;
  reason?: string;
} {
  const text = body ?? '';
  const phoneRe = /1[3-9]\d{9}/g;
  const wechatRe = /(?:微信|wechat|vx|wx[:：])/i;
  const qrRe = /(?:二维码|扫码|加群)/;
  const redirectRe = /(?:外部链接|点这里|点我)/;
  if (phoneRe.test(text)) return { flagged: true, reason: 'phone-in-message' };
  if (wechatRe.test(text)) return { flagged: true, reason: 'wechat-in-message' };
  if (qrRe.test(text)) return { flagged: true, reason: 'qr-code-in-message' };
  if (redirectRe.test(text)) return { flagged: true, reason: 'redirect-in-message' };
  return { flagged: false };
}

export async function recordBrokerSignal(data: {
  userId?: string | null;
  listingId?: string | null;
  signalType: string;
  severity: BrokerSignal['severity'];
  metadata?: Record<string, unknown>;
}): Promise<BrokerSignal> {
  const score = BROKER_SCORE_BY_SEVERITY[data.severity];
  const signal = await store.createBrokerSignal({
    userId: data.userId ?? null,
    listingId: data.listingId ?? null,
    signalType: data.signalType,
    severity: data.severity,
    score,
    metadata: data.metadata ?? null,
  });
  if (data.userId) {
    await refreshRisk(data.userId);
  }
  return signal;
}

export async function applyEnforcement(userId: string, type: 'SOFT_WARNING' | 'VERIFICATION_CHALLENGE' | 'SHADOW_BAN' | 'HARD_BAN' | 'LISTING_PURGE', createdBy: string | null, reason: string): Promise<void> {
  await store.createEnforcement({
    userId,
    type,
    reason,
    metadata: {},
    createdBy,
  });
  if (type === 'SHADOW_BAN') {
    await store.updateUser(userId, { isShadowBanned: true });
  } else if (type === 'HARD_BAN') {
    await store.updateUser(userId, { isHardBanned: true });
  } else if (type === 'LISTING_PURGE') {
    const listings = await store.listListings({ sellerId: userId, includeShadowBanned: true });
    for (const l of listings) {
      await store.updateListing(l.id, { status: 'REMOVED' });
    }
  }
}

export async function shadowBan(userId: string, createdBy: string | null, reason: string): Promise<void> {
  await applyEnforcement(userId, 'SHADOW_BAN', createdBy, reason);
}

export async function hardBan(userId: string, createdBy: string | null, reason: string): Promise<void> {
  await applyEnforcement(userId, 'HARD_BAN', createdBy, reason);
  // Also purge listings.
  const listings = await store.listListings({ sellerId: userId, includeShadowBanned: true });
  for (const l of listings) {
    await store.updateListing(l.id, { status: 'REMOVED' });
  }
}

// ---------------------------------------------------------------------------
// Behavioral detection rules — PRD §4.3.1.
//
// Each rule reads recent activity and, when its threshold is breached, emits a
// single BrokerSignal (deduped per window so we don't spam the table on every
// scan). recommendEnforcement() + applyEnforcement() already handle the
// score->action mapping; these rules are the missing "signal generation" half.
// ---------------------------------------------------------------------------

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

// --- Pure threshold predicates (unit-testable, no DB) ----------------------
// Each takes the data a rule needs and returns the signal metadata to emit, or
// null if the threshold isn't breached. The async wrappers below fetch data and
// call recordBrokerSignal; these are the testable decision core.

export function evaluateHighFrequency(viewsByListing: { district?: string }[]): Record<string, unknown> | null {
  if (viewsByListing.length <= 30) return null; // PRD: >30 listings/hour
  const districts = new Set(viewsByListing.map((d) => d.district).filter(Boolean));
  return { views: viewsByListing.length, districts: districts.size, windowMs: HOUR_MS };
}

export function evaluateGeoSkip(cities: string[]): Record<string, unknown> | null {
  if (cities.length < 5) return null; // PRD: 5+ cities in 24h
  return { cities: cities.length, windowMs: 24 * DAY_MS };
}

export function evaluateAlwaysViewNeverEngage(viewCount: number, hasRecentChat: boolean): Record<string, unknown> | null {
  if (viewCount < 100) return null; // PRD: 100+ views in 7d
  if (hasRecentChat) return null; // engaged users are fine
  return { views: viewCount, windowMs: 7 * DAY_MS };
}

export function evaluateMultiPhoneOneDevice(deviceCount: number): Record<string, unknown> | null {
  if (deviceCount <= 2) return null; // PRD: >2 phones on same device
  return { deviceCount };
}

// --- Async detectors (fetch data, delegate to predicates, record signal) ----

export async function detectHighFrequencyViewing(userId: string, now = new Date()): Promise<BrokerSignal | null> {
  const since = new Date(now.getTime() - HOUR_MS);
  const views = await store.listViewsSince(userId, since);
  const byListing = new Map<string, { district?: string }>();
  for (const v of views) {
    if (!byListing.has(v.listingId)) {
      const l = await store.findListingById(v.listingId);
      byListing.set(v.listingId, { district: l?.district });
    }
  }
  const meta = evaluateHighFrequency([...byListing.values()]);
  if (!meta) return null;
  return recordBrokerSignal({ userId, signalType: 'HIGH_FREQUENCY_VIEWING', severity: 'MEDIUM', metadata: meta });
}

export async function detectGeoSkip(userId: string, now = new Date()): Promise<BrokerSignal | null> {
  const since = new Date(now.getTime() - 24 * DAY_MS);
  const views = await store.listViewsSince(userId, since);
  const cities: string[] = [];
  const seen = new Set<string>();
  for (const v of views) {
    if (seen.has(v.listingId)) continue;
    seen.add(v.listingId);
    const l = await store.findListingById(v.listingId);
    if (l?.city) cities.push(l.city);
    if (cities.length >= 5) break;
  }
  const meta = evaluateGeoSkip(cities);
  if (!meta) return null;
  return recordBrokerSignal({ userId, signalType: 'GEO_SKIP', severity: 'HIGH', metadata: meta });
}

export async function detectAlwaysViewNeverEngage(userId: string, now = new Date()): Promise<BrokerSignal | null> {
  const since = new Date(now.getTime() - 7 * DAY_MS);
  const views = await store.listViewsSince(userId, since);
  const conversations = await store.listConversationsForUser(userId);
  const hasRecentChat = conversations.some((c) => new Date(c.createdAt) >= since);
  const meta = evaluateAlwaysViewNeverEngage(views.length, hasRecentChat);
  if (!meta) return null;
  return recordBrokerSignal({ userId, signalType: 'ALWAYS_VIEW_NEVER_ENGAGE', severity: 'MEDIUM', metadata: meta });
}

export async function detectMultiPhoneOneDevice(userId: string): Promise<BrokerSignal | null> {
  const fingerprints = await store.listDeviceFingerprints(userId);
  const meta = evaluateMultiPhoneOneDevice(fingerprints.length);
  if (!meta) return null;
  return recordBrokerSignal({ userId, signalType: 'MULTI_PHONE_ONE_DEVICE', severity: 'HIGH', metadata: meta });
}

// Listing hijack: a brand-new account reposts a listing very similar to one
// that already exists. Detected at creation time by the caller (which has the
// new listing's geo-hash + photos); this helper just records the signal.
export async function detectListingHijack(params: {
  userId: string;
  listingId: string;
  duplicateOfListingId: string;
  accountAgeDays: number;
}): Promise<BrokerSignal | null> {
  if (params.accountAgeDays > 1) return null; // only new accounts, within 24h
  return recordBrokerSignal({
    userId: params.userId,
    listingId: params.listingId,
    signalType: 'LISTING_HIJACK',
    severity: 'HIGH',
    metadata: { duplicateOfListingId: params.duplicateOfListingId, accountAgeDays: params.accountAgeDays },
  });
}

// Master runner: apply all behavioral rules to one user, return any signals
// emitted. Safe to call from a scheduled scan over active users.
export async function runBehavioralDetection(userId: string, now = new Date()): Promise<BrokerSignal[]> {
  const signals: BrokerSignal[] = [];
  const rules = [
    detectHighFrequencyViewing,
    detectGeoSkip,
    detectAlwaysViewNeverEngage,
    detectMultiPhoneOneDevice,
  ];
  for (const rule of rules) {
    const sig = await rule(userId, now).catch(() => null);
    if (sig) signals.push(sig);
  }
  return signals;
}
