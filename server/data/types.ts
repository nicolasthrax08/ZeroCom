// Production-shaped TypeScript types mirroring prisma/schema.prisma.
// The in-memory store uses these types so swapping to Prisma is a 1-file change.

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';
export type VerificationStatus =
  | 'UNVERIFIED'
  | 'PHONE_ONLY'
  | 'ID_PENDING'
  | 'ID_VERIFIED'
  | 'ID_REJECTED'
  | 'CHALLENGE_REQUIRED';
export type ListingStatus =
  | 'DRAFT'
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'PAUSED'
  | 'SOLD'
  | 'REMOVED';
export type ListingVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type PropertyType = 'SECOND_HAND' | 'NEW' | 'RENTAL';
export type SubscriptionPlanCode = 'FREE' | 'MONTHLY_PRO' | 'ANNUAL_PRO';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
export type PaymentProvider = 'ALIPAY' | 'WECHATPAY';
export type PaymentOrderStatus =
  | 'CREATED'
  | 'PENDING_USER_PAY'
  | 'PAID'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUNDED';
export type BrokerSignalSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EnforcementType =
  | 'SOFT_WARNING'
  | 'VERIFICATION_CHALLENGE'
  | 'SHADOW_BAN'
  | 'HARD_BAN'
  | 'LISTING_PURGE';
export type ReportStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';

export interface User {
  id: string;
  phoneEncrypted: string;
  phoneHash: string;
  displayName: string | null;
  role: UserRole;
  isShadowBanned: boolean;
  isHardBanned: boolean;
  termsAcceptedAt: string | null;
  privacyAcceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserVerification {
  id: string;
  userId: string;
  status: VerificationStatus;
  realNameHash: string | null;
  idCardHash: string | null;
  idCardFrontUrl: string | null;
  ocrProvider: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceFingerprint {
  id: string;
  userId: string;
  deviceId: string;
  userAgent: string | null;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  city: string;
  district: string;
  addressDetail: string;
  lat: number | null;
  lng: number | null;
  geoHash: string | null;
  priceRmbWan: number;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  verificationStatus: ListingVerificationStatus;
  status: ListingStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  photos?: ListingPhoto[];
}

export interface ListingPhoto {
  id: string;
  listingId: string;
  url: string;
  pHash: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface ListingView {
  id: string;
  userId: string;
  listingId: string;
  businessDate: string;
  counted: boolean;
  createdAt: string;
}

export interface SavedListing {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface ContactReveal {
  id: string;
  userId: string;
  listingId: string;
  revealType: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planCode: SubscriptionPlanCode;
  status: SubscriptionStatus;
  startsAt: string;
  endsAt: string;
  autoRenew: boolean;
  createdAt: string;
}

export interface PaymentOrder {
  outTradeNo: string;
  userId: string;
  provider: PaymentProvider;
  planCode: SubscriptionPlanCode;
  amountFen: number;
  status: PaymentOrderStatus;
  expiresAt: string;
  paidAt: string | null;
  providerPayload: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAuditLog {
  id: string;
  orderId: string;
  eventType: string;
  payload: unknown;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  isFlagged: boolean;
  createdAt: string;
}

export interface BrokerSignal {
  id: string;
  userId: string | null;
  listingId: string | null;
  signalType: string;
  severity: BrokerSignalSeverity;
  score: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface EnforcementAction {
  id: string;
  userId: string;
  type: EnforcementType;
  reason: string;
  metadata: Record<string, unknown> | null;
  createdBy: string | null;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  listingId: string | null;
  reportedUserId: string | null;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
  resolvedAt: string | null;
}

export interface Appeal {
  id: string;
  userId: string;
  enforcementId: string;
  reason: string;
  supportingText: string | null;
  status: 'OPEN' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  resolvedAt: string | null;
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  action: string;
  target: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface NotificationPreference {
  userId: string;
  dailyDigest: boolean;
  realtimePush: boolean;
  listingAlerts: boolean;
  unsubscribedAt: string | null;
}
