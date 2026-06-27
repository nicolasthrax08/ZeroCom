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
  const text = body ?? [];
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
