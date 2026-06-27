// In-memory store for ZeroCom MVP/demo.
//
// All accessors are async so the same surface can be backed by Prisma+Postgres
// in production. To migrate:
//   1. Replace every method body below with a Prisma call.
//   2. Keep method signatures (including Promise return types).
//   3. The app does not import Prisma directly — only through this module.

import type {
  Appeal,
  AuditLog,
  BrokerSignal,
  ContactReveal,
  Conversation,
  DeviceFingerprint,
  EnforcementAction,
  Listing,
  ListingPhoto,
  ListingView,
  Message,
  PaymentAuditLog,
  PaymentOrder,
  Report,
  SavedListing,
  Subscription,
  User,
  UserVerification,
} from './types';
import {
  SEED_BROKER_SIGNALS,
  SEED_CONVERSATIONS,
  SEED_ENFORCEMENTS,
  SEED_LISTINGS,
  SEED_MESSAGES,
  SEED_PAYMENT_AUDIT_LOGS,
  SEED_PAYMENT_ORDERS,
  SEED_PHOTOS,
  SEED_REPORTS,
  SEED_SAVED,
  SEED_SUBSCRIPTIONS,
  SEED_USERS,
  SEED_VERIFICATIONS,
} from './seed-data';

class Store {
  users = new Map<string, User>();
  verifications = new Map<string, UserVerification>();
  devices = new Map<string, DeviceFingerprint>();
  listings = new Map<string, Listing>();
  photos = new Map<string, ListingPhoto>();
  views = new Map<string, ListingView>();
  saved = new Map<string, SavedListing>();
  reveals = new Map<string, ContactReveal>();
  subscriptions = new Map<string, Subscription>();
  paymentOrders = new Map<string, PaymentOrder>();
  paymentAuditLogs = new Map<string, PaymentAuditLog>();
  conversations = new Map<string, Conversation>();
  messages = new Map<string, Message>();
  brokerSignals = new Map<string, BrokerSignal>();
  enforcements = new Map<string, EnforcementAction>();
  reports = new Map<string, Report>();
  appeals = new Map<string, Appeal>();
  auditLogs = new Map<string, AuditLog>();

  // OTP session store (phoneHash -> state)
  otpSessions = new Map<
    string,
    { otp: string; phone: string; attempts: number; expiresAt: string; lastSentAt: string }
  >();

  constructor() {
    this.seed();
  }

  private seed() {
    SEED_USERS.forEach((u) => this.users.set(u.id, u));
    SEED_VERIFICATIONS.forEach((v) => this.verifications.set(v.id, v));
    SEED_LISTINGS.forEach((l) => this.listings.set(l.id, l));
    SEED_PHOTOS.forEach((p) => this.photos.set(p.id, p));
    SEED_SAVED.forEach((s) => this.saved.set(s.id, s));
    SEED_SUBSCRIPTIONS.forEach((s) => this.subscriptions.set(s.id, s));
    SEED_PAYMENT_ORDERS.forEach((o) => this.paymentOrders.set(o.outTradeNo, o));
    SEED_PAYMENT_AUDIT_LOGS.forEach((a) => this.paymentAuditLogs.set(a.id, a));
    SEED_CONVERSATIONS.forEach((c) => this.conversations.set(c.id, c));
    SEED_MESSAGES.forEach((m) => this.messages.set(m.id, m));
    SEED_BROKER_SIGNALS.forEach((s) => this.brokerSignals.set(s.id, s));
    SEED_ENFORCEMENTS.forEach((e) => this.enforcements.set(e.id, e));
    SEED_REPORTS.forEach((r) => this.reports.set(r.id, r));
  }

  // --- User ----------------------------------------------------------------
  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findUserByPhoneHash(hash: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.phoneHash === hash) return u;
    }
    return null;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const user: User = { id, createdAt: now, updatedAt: now, ...data };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, patch: Partial<User>): Promise<User | null> {
    const u = this.users.get(id);
    if (!u) return null;
    const updated = { ...u, ...patch, updatedAt: new Date().toISOString() };
    this.users.set(id, updated);
    return updated;
  }

  // --- Verification --------------------------------------------------------
  async findVerificationByUserId(userId: string): Promise<UserVerification | null> {
    for (const v of this.verifications.values()) {
      if (v.userId === userId) return v;
    }
    return null;
  }

  async createVerification(userId: string): Promise<UserVerification> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const v: UserVerification = {
      id,
      userId,
      status: 'ID_PENDING',
      realNameHash: null,
      idCardHash: null,
      idCardFrontUrl: null,
      ocrProvider: null,
      reviewedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.verifications.set(id, v);
    return v;
  }

  async updateVerification(
    userId: string,
    patch: Partial<UserVerification>,
  ): Promise<UserVerification | null> {
    const v = await this.findVerificationByUserId(userId);
    if (!v) return null;
    const updated = { ...v, ...patch, updatedAt: new Date().toISOString() };
    this.verifications.set(v.id, updated);
    return updated;
  }

  async idCardHashUsed(hash: string, excludeUserId?: string): Promise<User | null> {
    for (const v of this.verifications.values()) {
      if (v.idCardHash === hash && v.userId !== excludeUserId) {
        return this.users.get(v.userId) ?? null;
      }
    }
    return null;
  }

  // --- Listing -------------------------------------------------------------
  async listListings(opts: {
    city?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    bedrooms?: number;
    q?: string;
    status?: Listing['status'];
    sellerId?: string;
    excludeSellerIds?: string[];
    includeShadowBanned?: boolean;
  }): Promise<Listing[]> {
    let rows = [...this.listings.values()];
    if (opts.status) rows = rows.filter((l) => l.status === opts.status);
    if (opts.city) rows = rows.filter((l) => l.city === opts.city);
    if (opts.district) rows = rows.filter((l) => l.district === opts.district);
    if (opts.minPrice != null) rows = rows.filter((l) => l.priceRmbWan >= opts.minPrice!);
    if (opts.maxPrice != null) rows = rows.filter((l) => l.priceRmbWan <= opts.maxPrice!);
    if (opts.minArea != null) rows = rows.filter((l) => l.areaSqm >= opts.minArea!);
    if (opts.maxArea != null) rows = rows.filter((l) => l.areaSqm <= opts.maxArea!);
    if (opts.bedrooms != null) rows = rows.filter((l) => l.bedrooms === opts.bedrooms);
    if (opts.sellerId) rows = rows.filter((l) => l.sellerId === opts.sellerId);
    if (opts.excludeSellerIds && opts.excludeSellerIds.length) {
      rows = rows.filter((l) => !opts.excludeSellerIds!.includes(l.sellerId));
    }
    if (!opts.includeShadowBanned) {
      const banned = new Set<string>();
      for (const u of this.users.values()) {
        if (u.isShadowBanned || u.isHardBanned) banned.add(u.id);
      }
      rows = rows.filter((l) => !banned.has(l.sellerId));
    }
    if (opts.q) {
      const q = opts.q.toLowerCase();
      rows = rows.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q),
      );
    }
    return rows
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((l) => ({
        ...l,
        photos: [...this.photos.values()]
          .filter((p) => p.listingId === l.id)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      }));
  }

  async findListingById(id: string): Promise<Listing | null> {
    return this.listings.get(id) ?? null;
  }

  async createListing(data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const listing: Listing = { id, createdAt: now, updatedAt: now, ...data };
    this.listings.set(id, listing);
    return listing;
  }

  async updateListing(id: string, patch: Partial<Listing>): Promise<Listing | null> {
    const l = this.listings.get(id);
    if (!l) return null;
    const updated = { ...l, ...patch, updatedAt: new Date().toISOString() };
    this.listings.set(id, updated);
    return updated;
  }

  async listPhotosByListing(listingId: string): Promise<ListingPhoto[]> {
    return [...this.photos.values()]
      .filter((p) => p.listingId === listingId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async addPhotos(listingId: string, urls: string[]): Promise<ListingPhoto[]> {
    const existing = await this.listPhotosByListing(listingId);
    const start = existing.length;
    const out: ListingPhoto[] = [];
    urls.forEach((url, i) => {
      const id = crypto.randomUUID();
      const photo: ListingPhoto = {
        id,
        listingId,
        url,
        pHash: `phash-${id}`,
        sortOrder: start + i,
        createdAt: new Date().toISOString(),
      };
      this.photos.set(id, photo);
      out.push(photo);
    });
    return out;
  }

  // --- Views / quota -------------------------------------------------------
  async countViewsToday(userId: string, businessDate: string): Promise<number> {
    let n = 0;
    for (const v of this.views.values()) {
      if (v.userId === userId && v.businessDate === businessDate && v.counted) n++;
    }
    return n;
  }

  async findRecentView(userId: string, listingId: string, withinSeconds: number): Promise<boolean> {
    const cutoff = Date.now() - withinSeconds * 1000;
    for (const v of this.views.values()) {
      if (
        v.userId === userId &&
        v.listingId === listingId &&
        new Date(v.createdAt).getTime() >= cutoff
      ) {
        return true;
      }
    }
    return false;
  }

  async recordView(
    userId: string,
    listingId: string,
    businessDate: string,
    counted: boolean,
  ): Promise<ListingView> {
    const id = crypto.randomUUID();
    const v: ListingView = {
      id,
      userId,
      listingId,
      businessDate,
      counted,
      createdAt: new Date().toISOString(),
    };
    this.views.set(id, v);
    return v;
  }

  // --- Saved listings ------------------------------------------------------
  async countSaved(userId: string): Promise<number> {
    let n = 0;
    for (const s of this.saved.values()) if (s.userId === userId) n++;
    return n;
  }

  async findSaved(userId: string, listingId: string): Promise<SavedListing | null> {
    for (const s of this.saved.values()) {
      if (s.userId === userId && s.listingId === listingId) return s;
    }
    return null;
  }

  async listSaved(userId: string): Promise<SavedListing[]> {
    return [...this.saved.values()].filter((s) => s.userId === userId);
  }

  async saveListing(userId: string, listingId: string): Promise<SavedListing> {
    const existing = await this.findSaved(userId, listingId);
    if (existing) return existing;
    const id = crypto.randomUUID();
    const s: SavedListing = {
      id,
      userId,
      listingId,
      createdAt: new Date().toISOString(),
    };
    this.saved.set(id, s);
    return s;
  }

  async unsaveListing(userId: string, listingId: string): Promise<void> {
    for (const [id, s] of this.saved.entries()) {
      if (s.userId === userId && s.listingId === listingId) {
        this.saved.delete(id);
        return;
      }
    }
  }

  // --- Contact reveal ------------------------------------------------------
  async hasContactReveal(userId: string, listingId: string): Promise<boolean> {
    for (const r of this.reveals.values()) {
      if (r.userId === userId && r.listingId === listingId) return true;
    }
    return false;
  }

  async recordContactReveal(userId: string, listingId: string, revealType: string): Promise<ContactReveal> {
    const id = crypto.randomUUID();
    const r: ContactReveal = {
      id,
      userId,
      listingId,
      revealType,
      createdAt: new Date().toISOString(),
    };
    this.reveals.set(id, r);
    return r;
  }

  // --- Subscriptions --------------------------------------------------------
  async listSubscriptions(userId: string): Promise<Subscription[]> {
    return [...this.subscriptions.values()].filter((s) => s.userId === userId);
  }

  async activeSubscription(userId: string, now = new Date()): Promise<Subscription | null> {
    for (const s of this.subscriptions.values()) {
      if (
        s.userId === userId &&
        s.status === 'ACTIVE' &&
        new Date(s.startsAt) <= now &&
        new Date(s.endsAt) > now
      ) {
        return s;
      }
    }
    return null;
  }

  async createSubscription(data: Omit<Subscription, 'id' | 'createdAt'>): Promise<Subscription> {
    const id = crypto.randomUUID();
    const s: Subscription = { id, createdAt: new Date().toISOString(), ...data };
    this.subscriptions.set(id, s);
    return s;
  }

  async updateSubscription(id: string, patch: Partial<Subscription>): Promise<Subscription | null> {
    const s = this.subscriptions.get(id);
    if (!s) return null;
    const updated = { ...s, ...patch };
    this.subscriptions.set(id, updated);
    return updated;
  }

  // --- Payments ------------------------------------------------------------
  async findPaymentOrder(outTradeNo: string): Promise<PaymentOrder | null> {
    return this.paymentOrders.get(outTradeNo) ?? null;
  }

  async createPaymentOrder(data: PaymentOrder): Promise<PaymentOrder> {
    this.paymentOrders.set(data.outTradeNo, data);
    return data;
  }

  async updatePaymentOrder(
    outTradeNo: string,
    patch: Partial<PaymentOrder>,
  ): Promise<PaymentOrder | null> {
    const o = this.paymentOrders.get(outTradeNo);
    if (!o) return null;
    const updated = { ...o, ...patch, updatedAt: new Date().toISOString() };
    this.paymentOrders.set(outTradeNo, updated);
    return updated;
  }

  async listPaymentOrdersByUser(userId: string): Promise<PaymentOrder[]> {
    return [...this.paymentOrders.values()].filter((o) => o.userId === userId);
  }

  async listAllPaymentOrders(): Promise<PaymentOrder[]> {
    return [...this.paymentOrders.values()];
  }

  async appendPaymentAuditLog(data: Omit<PaymentAuditLog, 'id' | 'createdAt'>): Promise<PaymentAuditLog> {
    const id = crypto.randomUUID();
    const log: PaymentAuditLog = { id, createdAt: new Date().toISOString(), ...data };
    this.paymentAuditLogs.set(id, log);
    return log;
  }

  // --- Conversations / messages -------------------------------------------
  async findConversationById(id: string): Promise<Conversation | null> {
    return this.conversations.get(id) ?? null;
  }

  async findConversationForListingAndBuyer(
    listingId: string,
    buyerId: string,
  ): Promise<Conversation | null> {
    for (const c of this.conversations.values()) {
      if (c.listingId === listingId && c.buyerId === buyerId) return c;
    }
    return null;
  }

  async listConversationsForUser(userId: string): Promise<Conversation[]> {
    return [...this.conversations.values()].filter(
      (c) => c.buyerId === userId || c.sellerId === userId,
    );
  }

  async createConversation(data: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const c: Conversation = { id, createdAt: now, updatedAt: now, ...data };
    this.conversations.set(id, c);
    return c;
  }

  async listMessages(conversationId: string): Promise<Message[]> {
    return [...this.messages.values()]
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async createMessage(data: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const id = crypto.randomUUID();
    const m: Message = { id, createdAt: new Date().toISOString(), ...data };
    this.messages.set(id, m);
    return m;
  }

  // --- Broker signals ------------------------------------------------------
  async listBrokerSignals(): Promise<BrokerSignal[]> {
    return [...this.brokerSignals.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async createBrokerSignal(data: Omit<BrokerSignal, 'id' | 'createdAt'>): Promise<BrokerSignal> {
    const id = crypto.randomUUID();
    const s: BrokerSignal = { id, createdAt: new Date().toISOString(), ...data };
    this.brokerSignals.set(id, s);
    return s;
  }

  async listBrokerSignalsForUser(userId: string): Promise<BrokerSignal[]> {
    return [...this.brokerSignals.values()].filter((s) => s.userId === userId);
  }

  // --- Enforcement ---------------------------------------------------------
  async listEnforcements(userId?: string): Promise<EnforcementAction[]> {
    const rows = [...this.enforcements.values()];
    return userId ? rows.filter((e) => e.userId === userId) : rows;
  }

  async createEnforcement(data: Omit<EnforcementAction, 'id' | 'createdAt'>): Promise<EnforcementAction> {
    const id = crypto.randomUUID();
    const e: EnforcementAction = { id, createdAt: new Date().toISOString(), ...data };
    this.enforcements.set(id, e);
    return e;
  }

  // --- Reports / appeals ---------------------------------------------------
  async listReports(): Promise<Report[]> {
    return [...this.reports.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async findReportById(id: string): Promise<Report | null> {
    return this.reports.get(id) ?? null;
  }

  async createReport(data: Omit<Report, 'id' | 'createdAt'>): Promise<Report> {
    const id = crypto.randomUUID();
    const r: Report = { id, createdAt: new Date().toISOString(), ...data };
    this.reports.set(id, r);
    return r;
  }

  async updateReport(id: string, patch: Partial<Report>): Promise<Report | null> {
    const r = this.reports.get(id);
    if (!r) return null;
    const updated = { ...r, ...patch };
    this.reports.set(id, updated);
    return updated;
  }

  async listAppeals(): Promise<Appeal[]> {
    return [...this.appeals.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async createAppeal(data: Omit<Appeal, 'id' | 'createdAt'>): Promise<Appeal> {
    const id = crypto.randomUUID();
    const a: Appeal = { id, createdAt: new Date().toISOString(), ...data };
    this.appeals.set(id, a);
    return a;
  }

  async updateAppeal(id: string, patch: Partial<Appeal>): Promise<Appeal | null> {
    const a = this.appeals.get(id);
    if (!a) return null;
    const updated = { ...a, ...patch };
    this.appeals.set(id, updated);
    return updated;
  }

  // --- Audit log -----------------------------------------------------------
  async appendAuditLog(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const id = crypto.randomUUID();
    const a: AuditLog = { id, createdAt: new Date().toISOString(), ...data };
    this.auditLogs.set(id, a);
    return a;
  }

  async listAuditLogs(): Promise<AuditLog[]> {
    return [...this.auditLogs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export const store = new Store();
