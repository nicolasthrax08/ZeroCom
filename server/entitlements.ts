// Entitlements: subscription checks, quota, saved-listing limits.

import { store } from './data/store';
import { FREE_VIEWS_PER_DAY, FREE_MESSAGES_PER_DAY, FREE_SAVED_LIMIT } from '@/lib/constants';
import { shanghaiBusinessDate } from '@/lib/utils/date';
import { logAnalytics } from './audit';
import { QuotaExceeded, Forbidden } from './errors';

export async function hasActivePro(userId: string, now = new Date()): Promise<boolean> {
  const sub = await store.activeSubscription(userId, now);
  return !!sub;
}

export async function subscriptionPlanOf(
  userId: string,
): Promise<'FREE' | 'MONTHLY_PRO' | 'ANNUAL_PRO' | null> {
  const sub = await store.activeSubscription(userId);
  return sub ? sub.planCode : null;
}

export async function remainingFreeViews(userId: string, now = new Date()): Promise<number> {
  const today = shanghaiBusinessDate(now);
  const used = await store.countViewsToday(userId, today);
  return Math.max(0, FREE_VIEWS_PER_DAY - used);
}

export async function recordListingView(
  userId: string,
  listingId: string,
  opts: { isOwner: boolean; isPaid: boolean },
): Promise<{ counted: boolean; remaining?: number; unlimited?: true }> {
  if (opts.isOwner) return { counted: false };
  if (opts.isPaid) {
    await store.recordView(userId, listingId, shanghaiBusinessDate(), false);
    await logAnalytics('listing_detail_viewed', { userId, listingId });
    return { counted: false, unlimited: true };
  }
  const today = shanghaiBusinessDate();
  const debounceHit = await store.findRecentView(userId, listingId, 30);
  if (debounceHit) return { counted: false };
  const used = await store.countViewsToday(userId, today);
  if (used >= FREE_VIEWS_PER_DAY) {
    await logAnalytics('quota_exhausted', { userId, metadata: { type: 'views' } });
    throw new QuotaExceeded('FREE_VIEWS_PER_DAY');
  }
  await store.recordView(userId, listingId, today, true);
  await logAnalytics('listing_detail_viewed', { userId, listingId });
  return { counted: true, remaining: Math.max(0, FREE_VIEWS_PER_DAY - used - 1) };
}

export async function assertCanSaveListing(userId: string, listingId: string): Promise<void> {
  const isPaid = await hasActivePro(userId);
  const existing = await store.findSaved(userId, listingId);
  if (existing) return;
  const count = await store.countSaved(userId);
  if (!isPaid && count >= FREE_SAVED_LIMIT) {
    throw new Forbidden('FREE_SAVED_LIMIT');
  }
}

export async function assertCanSendMessage(
  userId: string,
  opts: { isOwner: boolean; isPaid: boolean },
): Promise<void> {
  if (opts.isPaid) return;
  // Free users cap applies regardless of ownership.
  const today = shanghaiBusinessDate();
  let count = 0;
  for (const c of await store.listConversationsForUser(userId)) {
    for (const m of await store.listMessages(c.id)) {
      if (m.senderId === userId && m.createdAt.startsWith(today)) count++;
    }
  }
  if (count >= FREE_MESSAGES_PER_DAY) throw new QuotaExceeded('FREE_MESSAGES_PER_DAY');
}

export async function canRevealContact(
  viewerId: string,
  listingId: string,
  listing: { sellerId: string; status: string; },
): Promise<{
  ok: boolean;
  reason?:
    | 'NOT_PAID'
    | 'NOT_ACTIVE'
    | 'IS_OWNER'
    | 'NOT_REVEALED'
    | 'NO_INTENT';
}> {
  if (listing.sellerId === viewerId) return { ok: false, reason: 'IS_OWNER' };
  if (listing.status !== 'ACTIVE') return { ok: false, reason: 'NOT_ACTIVE' };
  const isPaid = await hasActivePro(viewerId);
  if (!isPaid) return { ok: false, reason: 'NOT_PAID' };
  const hasReveal = await store.hasContactReveal(viewerId, listingId);
  if (hasReveal) return { ok: true };
  // Intent = saved OR has message in conversation.
  const saved = await store.findSaved(viewerId, listingId);
  if (saved) return { ok: true };
  const conv = await store.findConversationForListingAndBuyer(listingId, viewerId);
  if (conv) {
    const msgs = await store.listMessages(conv.id);
    if (msgs.some((m) => m.senderId === viewerId)) return { ok: true };
  }
  return { ok: false, reason: 'NO_INTENT' };
}
