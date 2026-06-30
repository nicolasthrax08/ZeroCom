// Production data store backed by Prisma + PostgreSQL.
//
// This module exposes the SAME async API as the original in-memory store
// so no call sites need to change.

import { prisma } from './prisma';
import type {
  Appeal, AuditLog, BrokerSignal, ContactReveal, Conversation,
  DeviceFingerprint, EnforcementAction, Listing, ListingPhoto,
  ListingView, Message, PaymentAuditLog, PaymentOrder, Report,
  SavedListing, Subscription, User, UserVerification,
} from './types';

// Prisma returns Date objects; our domain types use ISO strings.
const iso = (d: Date | null) => d ? d.toISOString() : null;
const u = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString(), updatedAt: x.updatedAt.toISOString(),
  termsAcceptedAt: iso(x.termsAcceptedAt), privacyAcceptedAt: iso(x.privacyAcceptedAt) } : null;
const v = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString(), updatedAt: x.updatedAt.toISOString(), reviewedAt: iso(x.reviewedAt) } : null;
const l = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString(), updatedAt: x.updatedAt.toISOString(), publishedAt: iso(x.publishedAt),
  photos: x.photos?.map((p: any) => ({ ...p, createdAt: p.createdAt.toISOString() })) } : null;
const photo = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString() } : null;
const view = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString() } : null;
const sub = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString() } : null;
const order = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString(), updatedAt: x.updatedAt.toISOString(), paidAt: iso(x.paidAt) } : null;
const conv = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString(), updatedAt: x.updatedAt.toISOString() } : null;
const msg = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString() } : null;
const sig = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString() } : null;
const rep = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString(), resolvedAt: iso(x.resolvedAt) } : null;
const app = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString(), resolvedAt: iso(x.resolvedAt) } : null;
const aud = (x: any): any => x ? { ...x, createdAt: x.createdAt.toISOString() } : null;
const arr = (fn: (x: any) => any) => (rows: any[]) => rows.map((x) => fn(x) as unknown);

export class Store {
  async findUserById(id: string): Promise<User | null> {
    return u(await prisma.user.findUnique({ where: { id } })) as Promise<User | null>;
  }
  async findUserByPhoneHash(hash: string): Promise<User | null> {
    return u(await prisma.user.findUnique({ where: { phoneHash: hash } })) as Promise<User | null>;
  }
  async findUserByPhoneEncrypted(encrypted: string): Promise<User | null> {
    return u(await prisma.user.findFirst({ where: { phoneEncrypted: encrypted } })) as Promise<User | null>;
  }
  async createUser(data: any): Promise<User> {
    return u(await prisma.user.create({ data })) as Promise<User>;
  }
  async updateUser(id: string, patch: Partial<User>): Promise<User | null> {
    try { return u(await prisma.user.update({ where: { id }, data: patch })) as Promise<User>; }
    catch { return null; }
  }
  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } }).catch(() => {});
  }

  async findVerificationByUserId(userId: string): Promise<UserVerification | null> {
    return v(await prisma.userVerification.findUnique({ where: { userId } })) as Promise<UserVerification | null>;
  }
  async createVerification(userId: string): Promise<UserVerification> {
    return v(await prisma.userVerification.create({ data: { userId, status: 'ID_PENDING' } })) as Promise<UserVerification>;
  }
  async updateVerification(userId: string, patch: Partial<UserVerification>): Promise<UserVerification | null> {
    const existing = await prisma.userVerification.findUnique({ where: { userId } });
    if (!existing) return null;
    return v(await prisma.userVerification.update({ where: { id: existing.id }, data: patch })) as Promise<UserVerification>;
  }
  async idCardHashUsed(hash: string, excludeUserId?: string): Promise<User | null> {
    const found = await prisma.userVerification.findFirst({
      where: { idCardHash: hash, ...(excludeUserId ? { NOT: { userId: excludeUserId } } : {}) },
    });
    if (!found) return null;
    return this.findUserById(found.userId);
  }

  async listListings(opts: any): Promise<Listing[]> {
    const where: any = {};
    if (opts.status) where.status = opts.status;
    if (opts.city) where.city = opts.city;
    if (opts.district) where.district = opts.district;
    if (opts.sellerId) where.sellerId = opts.sellerId;
    if (opts.minPrice != null || opts.maxPrice != null) {
      where.priceRmbWan = {};
      if (opts.minPrice != null) where.priceRmbWan.gte = opts.minPrice;
      if (opts.maxPrice != null) where.priceRmbWan.lte = opts.maxPrice;
    }
    if (opts.minArea != null || opts.maxArea != null) {
      where.areaSqm = {};
      if (opts.minArea != null) where.areaSqm.gte = opts.minArea;
      if (opts.maxArea != null) where.areaSqm.lte = opts.maxArea;
    }
    if (opts.bedrooms != null) where.bedrooms = opts.bedrooms;
    if (opts.excludeSellerIds?.length) where.sellerId = { notIn: opts.excludeSellerIds };
    if (opts.q) {
      where.OR = [
        { title: { contains: opts.q, mode: 'insensitive' } },
        { description: { contains: opts.q, mode: 'insensitive' } },
        { district: { contains: opts.q, mode: 'insensitive' } },
      ];
    }
    if (!opts.includeShadowBanned) {
      const banned = await prisma.user.findMany({ where: { OR: [{ isShadowBanned: true }, { isHardBanned: true }] }, select: { id: true } });
      if (banned.length) where.sellerId = { notIn: banned.map((b: any) => b.id) };
    }
    const rows = await prisma.listing.findMany({ where, orderBy: { createdAt: 'desc' }, include: { photos: { orderBy: { sortOrder: 'asc' } } } });
    return arr(l)(rows) as Listing[];
  }
  async findListingById(id: string): Promise<Listing | null> {
    return l(await prisma.listing.findUnique({ where: { id } })) as Promise<Listing | null>;
  }
  async geoHashKey(lat: number, lng: number): Promise<string> {
    const { makeGeoHash } = await import('@/lib/utils/geohash');
    return makeGeoHash(lat, lng);
  }

  async createListing(data: any): Promise<Listing> {
    return l(await prisma.listing.create({ data })) as Promise<Listing>;
  }
  async updateListing(id: string, patch: Partial<Listing>): Promise<Listing | null> {
    try { return l(await prisma.listing.update({ where: { id }, data: patch as any })) as unknown as Listing; }
    catch { return null; }
  }
  async listPhotosByListing(listingId: string): Promise<ListingPhoto[]> {
    return arr(photo)(await prisma.listingPhoto.findMany({ where: { listingId }, orderBy: { sortOrder: 'asc' } })) as ListingPhoto[];
  }
  async addPhotos(listingId: string, urls: string[]): Promise<ListingPhoto[]> {
    const existing = await this.listPhotosByListing(listingId);
    const start = existing.length;
    const out: ListingPhoto[] = [];
    for (let i = 0; i < urls.length; i++) {
      const p = await prisma.listingPhoto.create({ data: { listingId, url: urls[i], pHash: `phash-${listingId}-${start + i}`, sortOrder: start + i } });
      out.push(photo(p));
    }
    return out;
  }

  async countViewsToday(userId: string | null, businessDate: string): Promise<number> {
    return prisma.listingView.count({ where: { userId: userId ?? null, businessDate, counted: true } });
  }
  // Behavioral detection: all counted views by a user within a window, with
  // the listing's city/district so detection rules can aggregate geographically.
  async listViewsSince(userId: string, since: Date): Promise<ListingView[]> {
    return arr(view)(await prisma.listingView.findMany({
      where: { userId, counted: true, createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
    })) as ListingView[];
  }
  // Distinct device fingerprints per user — powers the "multiple phones, same device" rule.
  async listDeviceFingerprints(userId: string): Promise<DeviceFingerprint[]> {
    return arr(view)(await prisma.deviceFingerprint.findMany({ where: { userId } })) as unknown as DeviceFingerprint[];
  }
  async findRecentView(userId: string | null, listingId: string, withinSeconds: number): Promise<boolean> {
    const cutoff = new Date(Date.now() - withinSeconds * 1000);
    return (await prisma.listingView.count({ where: { userId: userId ?? null, listingId, createdAt: { gte: cutoff } } })) > 0;
  }
  async recordView(userId: string | null, listingId: string, businessDate: string, counted: boolean): Promise<ListingView> {
    return view(await prisma.listingView.create({ data: { userId: userId ?? null, listingId, businessDate, counted } })) as unknown as ListingView;
  }

  async countSaved(userId: string): Promise<number> {
    return prisma.savedListing.count({ where: { userId } });
  }
  async findSaved(userId: string, listingId: string): Promise<SavedListing | null> {
    return (await prisma.savedListing.findUnique({ where: { userId_listingId: { userId, listingId } } })) as unknown as SavedListing | null;
  }
  async listSaved(userId: string): Promise<SavedListing[]> {
    return (await prisma.savedListing.findMany({ where: { userId } })) as unknown as SavedListing[];
  }
  async saveListing(userId: string, listingId: string): Promise<SavedListing> {
    return (await prisma.savedListing.upsert({ where: { userId_listingId: { userId, listingId } }, create: { userId, listingId }, update: {} })) as unknown as SavedListing;
  }
  async unsaveListing(userId: string, listingId: string): Promise<void> {
    await prisma.savedListing.delete({ where: { userId_listingId: { userId, listingId } } }).catch(() => {});
  }

  async hasContactReveal(userId: string, listingId: string): Promise<boolean> {
    return (await prisma.contactReveal.count({ where: { userId, listingId } })) > 0;
  }
  async recordContactReveal(userId: string, listingId: string, revealType: string): Promise<ContactReveal> {
    return (await prisma.contactReveal.create({ data: { userId, listingId, revealType } })) as unknown as ContactReveal;
  }

  async listSubscriptions(userId: string): Promise<Subscription[]> {
    return arr(sub)(await prisma.subscription.findMany({ where: { userId } })) as Subscription[];
  }
  async activeSubscription(userId: string, now = new Date()): Promise<Subscription | null> {
    return sub(await prisma.subscription.findFirst({ where: { userId, status: 'ACTIVE', startsAt: { lte: now }, endsAt: { gt: now } } })) as Promise<Subscription | null>;
  }
  async createSubscription(data: any): Promise<Subscription> {
    return sub(await prisma.subscription.create({ data })) as unknown as Subscription;
  }
  async updateSubscription(id: string, patch: Partial<Subscription>): Promise<Subscription | null> {
    try { return sub(await prisma.subscription.update({ where: { id }, data: patch })) as Subscription; }
    catch { return null; }
  }

  async findPaymentOrder(outTradeNo: string): Promise<PaymentOrder | null> {
    return order(await prisma.paymentOrder.findUnique({ where: { outTradeNo } })) as Promise<PaymentOrder | null>;
  }
  async createPaymentOrder(data: any): Promise<PaymentOrder> {
    return order(await prisma.paymentOrder.create({ data })) as PaymentOrder;
  }
  async updatePaymentOrder(outTradeNo: string, patch: Partial<PaymentOrder>): Promise<PaymentOrder | null> {
    try { return order(await prisma.paymentOrder.update({ where: { outTradeNo }, data: patch as any })) as unknown as PaymentOrder; }
    catch { return null; }
  }
  async listPaymentOrdersByUser(userId: string): Promise<PaymentOrder[]> {
    return arr(order)(await prisma.paymentOrder.findMany({ where: { userId } })) as PaymentOrder[];
  }
  async listAllPaymentOrders(): Promise<PaymentOrder[]> {
    return arr(order)(await prisma.paymentOrder.findMany({ orderBy: { createdAt: 'desc' } })) as PaymentOrder[];
  }
  async markPaymentOrderPaid(outTradeNo: string, tradeNo: string): Promise<{ order: PaymentOrder; alreadyPaid: boolean } | null> {
    const o = await this.findPaymentOrder(outTradeNo);
    if (!o) return null;
    if (o.status === 'PAID') return { order: o, alreadyPaid: true };
    if (o.status !== 'PENDING_USER_PAY') return null;
    try {
      const updated = await prisma.paymentOrder.update({
        where: { outTradeNo, status: 'PENDING_USER_PAY' },
        data: { status: 'PAID', paidAt: new Date(), providerPayload: { ...(o.providerPayload as object || {}), tradeNo } },
      });
      return { order: order(updated), alreadyPaid: false };
    } catch {
      const current = await this.findPaymentOrder(outTradeNo);
      if (current && current.status === 'PAID') return { order: current, alreadyPaid: true };
      return null;
    }
  }
  async appendPaymentAuditLog(data: any): Promise<PaymentAuditLog> {
    return (await prisma.paymentAuditLog.create({ data })) as unknown as PaymentAuditLog;
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    return conv(await prisma.conversation.findUnique({ where: { id } })) as Promise<Conversation | null>;
  }
  async findConversationForListingAndBuyer(listingId: string, buyerId: string): Promise<Conversation | null> {
    return conv(await prisma.conversation.findUnique({ where: { listingId_buyerId: { listingId, buyerId } } })) as Promise<Conversation | null>;
  }
  async listConversationsForUser(userId: string): Promise<Conversation[]> {
    return arr(conv)(await prisma.conversation.findMany({ where: { OR: [{ buyerId: userId }, { sellerId: userId }] } })) as Conversation[];
  }
  async createConversation(data: any): Promise<Conversation> {
    return conv(await prisma.conversation.create({ data })) as Conversation;
  }
  async listMessages(conversationId: string): Promise<Message[]> {
    return arr(msg)(await prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' } })) as Message[];
  }
  async createMessage(data: any): Promise<Message> {
    return msg(await prisma.message.create({ data })) as Message;
  }

  async listBrokerSignals(): Promise<BrokerSignal[]> {
    return arr(sig)(await prisma.brokerSignal.findMany({ orderBy: { createdAt: 'desc' } })) as BrokerSignal[];
  }
  async createBrokerSignal(data: any): Promise<BrokerSignal> {
    return sig(await prisma.brokerSignal.create({ data })) as BrokerSignal;
  }
  async listBrokerSignalsForUser(userId: string): Promise<BrokerSignal[]> {
    return arr(sig)(await prisma.brokerSignal.findMany({ where: { userId } })) as BrokerSignal[];
  }

  async listEnforcements(userId?: string): Promise<EnforcementAction[]> {
    return (await prisma.enforcementAction.findMany({ where: userId ? { userId } : undefined })) as unknown as EnforcementAction[];
  }
  async createEnforcement(data: any): Promise<EnforcementAction> {
    return (await prisma.enforcementAction.create({ data })) as unknown as EnforcementAction;
  }

  async listReports(): Promise<Report[]> {
    return arr(rep)(await prisma.report.findMany({ orderBy: { createdAt: 'desc' } })) as Report[];
  }
  async findReportById(id: string): Promise<Report | null> {
    return rep(await prisma.report.findUnique({ where: { id } })) as Promise<Report | null>;
  }
  async findOpenReport(reporterId: string, listingId: string | null, reportedUserId: string | null): Promise<Report | null> {
    return rep(await prisma.report.findFirst({ where: { reporterId, status: 'OPEN', ...(listingId ? { listingId } : {}), ...(reportedUserId ? { reportedUserId } : {}) } })) as Promise<Report | null>;
  }
  async countRecentReports(reporterId: string, windowMs: number): Promise<number> {
    return prisma.report.count({ where: { reporterId, createdAt: { gte: new Date(Date.now() - windowMs) } } });
  }
  async createReport(data: any): Promise<Report> {
    return rep(await prisma.report.create({ data })) as Report;
  }
  async updateReport(id: string, patch: Partial<Report>): Promise<Report | null> {
    try { return rep(await prisma.report.update({ where: { id }, data: patch })) as Report; }
    catch { return null; }
  }

  async listAppeals(): Promise<Appeal[]> {
    return arr(app)(await prisma.appeal.findMany({ orderBy: { createdAt: 'desc' } })) as Appeal[];
  }
  async findOpenAppeal(userId: string, enforcementId: string): Promise<Appeal | null> {
    return app(await prisma.appeal.findFirst({ where: { userId, enforcementId, status: 'OPEN' } })) as Promise<Appeal | null>;
  }
  async createAppeal(data: any): Promise<Appeal> {
    return app(await prisma.appeal.create({ data })) as Appeal;
  }
  async updateAppeal(id: string, patch: Partial<Appeal>): Promise<Appeal | null> {
    try { return app(await prisma.appeal.update({ where: { id }, data: patch })) as Appeal; }
    catch { return null; }
  }

  // OTP sessions
  async getOtpSession(phoneHash: string) {
    return prisma.otpSession.findUnique({ where: { phoneHash } });
  }
  async setOtpSession(phoneHash: string, data: any) {
    return prisma.otpSession.upsert({ where: { phoneHash }, create: { phoneHash, ...data }, update: { ...data } });
  }
  async incrementOtpAttempts(phoneHash: string): Promise<number> {
    const s = await prisma.otpSession.update({ where: { phoneHash }, data: { attempts: { increment: 1 } } });
    return s.attempts;
  }
  async deleteOtpSession(phoneHash: string): Promise<void> {
    await prisma.otpSession.delete({ where: { phoneHash } }).catch(() => {});
  }

  async appendAuditLog(data: any): Promise<AuditLog> {
    return aud(await prisma.auditLog.create({ data })) as AuditLog;
  }
  async listAuditLogs(): Promise<AuditLog[]> {
    return arr(aud)(await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } })) as AuditLog[];
  }
}

export const store = new Store();
