# Technical Design Document (TDD)
## ZeroCom — Peer-to-Peer Real Estate Platform

**Version:** 1.0  
**Date:** 2026-06-27  
**Source Documents:** PRD.md, TRD.md  
**Design Goal:** Define a production-shaped full-stack architecture and detailed implementation design for ZeroCom's Phase 1 website.

---

## 1. Executive Technical Summary
ZeroCom will be built as a responsive, trust-first web application with a modular full-stack architecture. The MVP should behave like a real marketplace while using replaceable provider adapters for SMS, ID OCR, maps, image forensics, and payment gateways until production credentials are available.

The application must support direct owner-buyer discovery, strict verification gates, subscription-based monetization, and anti-broker protections. A clean minimalistic white UI will reinforce transparency and trust.

---

## 2. Architecture Overview

### 2.1 Recommended Deployment Architecture

```text
Browser / Mobile Web
        |
        v
CDN + WAF + Rate Limiter
        |
        v
Next.js Web Application
  - App Router pages
  - Server Components
  - API Routes / Server Actions
        |
        +------------------+
        |                  |
        v                  v
PostgreSQL             Redis
(primary data)         (sessions, quotas, rate limits, jobs)
        |
        v
Object Storage / CDN
(listing photos, ID uploads)

External Provider Adapters
  - SMS OTP provider
  - PRC ID OCR provider
  - Map/geocoding provider
  - Alipay
  - WeChat Pay
  - CAPTCHA
  - Push/email notifications
```

### 2.2 MVP Architecture Choice
Use a monorepo-style Next.js application for fastest delivery:

```text
zerocom/
  app/
  components/
  lib/
  server/
  prisma/
  public/
  tests/
```

The backend domain logic should not be embedded directly in route handlers. Use service modules in `server/` so the app can later split into independent services.

---

## 3. System Modules

### 3.1 Frontend Modules

| Module | Description |
|---|---|
| Marketing | Landing, value proposition, trust sections, pricing |
| Auth | Phone entry, OTP verification, policy consent |
| Verification | Real-name and ID upload states |
| Listings | Feed, filters, detail, save, reveal contact |
| Seller Studio | Listing creation wizard and listing management |
| Subscription | Paywall, pricing, checkout, payment status |
| Messaging | Conversation list and listing-specific chat |
| Dashboard | Saved listings, own listings, subscription, verification status |
| Reports/Appeals | Suspected broker report and appeal forms |
| Admin | Moderation queues, broker signals, payments, user actions |
| Legal | Terms, Privacy, Refund Policy |

### 3.2 Backend Domain Services

| Service | Responsibilities |
|---|---|
| AuthService | OTP lifecycle, sessions, phone validation |
| VerificationService | real-name, ID hash/OCR, verification tiering |
| ListingService | CRUD, lifecycle, search, owner checks |
| ListingModerationService | flags, duplicate detection, price anomaly, approvals |
| QuotaService | daily detail view and chat quotas |
| SubscriptionService | plans, entitlements, expiration, auto-renew flags |
| PaymentService | order creation, provider adapters, webhooks, audit logs |
| ContactRevealService | intent checks, entitlement checks, reveal audit |
| MessagingService | conversations, messages, moderation scanning |
| BrokerRiskService | signal ingestion, risk scoring, enforcement recommendations |
| EnforcementService | warnings, challenges, bans, listing purge |
| ReportService | user reports and appeals |
| NotificationService | digest/real-time alert abstraction |
| AdminService | internal privileged operations |
| AuditService | immutable logs for sensitive actions |

---

## 4. Application Routes

### 4.1 Public and Buyer Routes

| Route | Page |
|---|---|
| `/` | Landing page |
| `/auth` | Phone auth start |
| `/auth/verify` | OTP verification |
| `/onboarding` | Policy consent and verification guidance |
| `/listings` | Listing feed and filters |
| `/listings/[id]` | Listing detail |
| `/pricing` | Subscription pricing |
| `/checkout` | Checkout |
| `/payment/status/[orderId]` | Payment status |
| `/dashboard` | User dashboard |
| `/dashboard/saved` | Saved listings |
| `/dashboard/messages` | Messages |
| `/dashboard/subscription` | Subscription management |
| `/report` | Report suspected broker/listing |
| `/appeal` | Appeal enforcement action |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/refunds` | Refund Policy |

### 4.2 Seller Routes

| Route | Page |
|---|---|
| `/seller` | Seller studio |
| `/seller/new` | Listing creation wizard |
| `/seller/listings/[id]/edit` | Edit listing |
| `/seller/verification` | Tier 2 verification |

### 4.3 Admin Routes

| Route | Page |
|---|---|
| `/admin` | Admin overview |
| `/admin/listings` | Listing moderation queue |
| `/admin/reports` | User reports |
| `/admin/broker-risk` | Broker risk queue |
| `/admin/appeals` | Appeals |
| `/admin/payments` | Payment/order lookup |
| `/admin/users/[id]` | User admin detail |

---

## 5. Data Model Design

### 5.1 Entity Relationship Overview

```text
User 1--1 UserVerification
User 1--N DeviceFingerprint
User 1--N Listing
User 1--N ListingView
User 1--N SavedListing
User 1--N Subscription
User 1--N PaymentOrder
User 1--N BrokerSignal
User 1--N EnforcementAction

Listing 1--N ListingPhoto
Listing 1--N ListingModerationFlag
Listing 1--N ListingView
Listing 1--N SavedListing
Listing 1--N ContactReveal
Listing 1--N Report
Listing 1--N Conversation

Conversation 1--N Message
PaymentOrder 1--N PaymentAuditLog
Report 0--1 Appeal
```

### 5.2 Prisma Schema Draft

```prisma
enum UserRole { USER MODERATOR ADMIN }
enum VerificationStatus { UNVERIFIED PHONE_ONLY ID_PENDING ID_VERIFIED ID_REJECTED CHALLENGE_REQUIRED }
enum ListingStatus { DRAFT PENDING_VERIFICATION ACTIVE PAUSED SOLD REMOVED }
enum ListingVerificationStatus { PENDING VERIFIED REJECTED }
enum PropertyType { SECOND_HAND NEW RENTAL }
enum SubscriptionPlanCode { FREE MONTHLY_PRO ANNUAL_PRO }
enum SubscriptionStatus { ACTIVE EXPIRED CANCELLED REFUNDED }
enum PaymentProvider { ALIPAY WECHATPAY }
enum PaymentOrderStatus { CREATED PENDING_USER_PAY PAID EXPIRED CANCELLED REFUNDED }
enum BrokerSignalSeverity { LOW MEDIUM HIGH CRITICAL }
enum EnforcementType { SOFT_WARNING VERIFICATION_CHALLENGE SHADOW_BAN HARD_BAN LISTING_PURGE }
enum ReportStatus { OPEN IN_REVIEW RESOLVED REJECTED }

model User {
  id                 String   @id @default(uuid())
  phoneEncrypted     String
  phoneHash          String   @unique
  displayName        String?
  role               UserRole @default(USER)
  isShadowBanned     Boolean  @default(false)
  isHardBanned       Boolean  @default(false)
  termsAcceptedAt    DateTime?
  privacyAcceptedAt  DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  verification       UserVerification?
  listings           Listing[]
  subscriptions      Subscription[]
  paymentOrders      PaymentOrder[]
}

model UserVerification {
  id                 String @id @default(uuid())
  userId             String @unique
  status             VerificationStatus @default(UNVERIFIED)
  realNameHash       String?
  idCardHash         String?
  idCardFrontUrl     String?
  ocrProvider        String?
  reviewedAt         DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  user               User @relation(fields: [userId], references: [id])
}

model Listing {
  id                 String @id @default(uuid())
  sellerId           String
  title              String
  description        String
  city               String
  district           String
  addressDetail      String
  lat                Float?
  lng                Float?
  geoHash            String?
  priceRmbWan        Int
  areaSqm            Decimal
  bedrooms           Int
  bathrooms          Int
  propertyType       PropertyType @default(SECOND_HAND)
  verificationStatus ListingVerificationStatus @default(PENDING)
  status             ListingStatus @default(DRAFT)
  publishedAt        DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  seller             User @relation(fields: [sellerId], references: [id])
  photos             ListingPhoto[]
}

model ListingPhoto {
  id                 String @id @default(uuid())
  listingId          String
  url                String
  pHash              String?
  sortOrder          Int @default(0)
  createdAt          DateTime @default(now())
  listing            Listing @relation(fields: [listingId], references: [id])
}

model ListingView {
  id                 String @id @default(uuid())
  userId             String
  listingId          String
  businessDate       String
  counted            Boolean @default(true)
  createdAt          DateTime @default(now())
}

model SavedListing {
  id                 String @id @default(uuid())
  userId             String
  listingId          String
  createdAt          DateTime @default(now())
  @@unique([userId, listingId])
}

model ContactReveal {
  id                 String @id @default(uuid())
  userId             String
  listingId          String
  revealType         String
  createdAt          DateTime @default(now())
  @@index([userId, listingId])
}

model Subscription {
  id                 String @id @default(uuid())
  userId             String
  planCode           SubscriptionPlanCode
  status             SubscriptionStatus
  startsAt           DateTime
  endsAt             DateTime
  autoRenew          Boolean @default(false)
  createdAt          DateTime @default(now())
  user               User @relation(fields: [userId], references: [id])
}

model PaymentOrder {
  id                 String @id @default(uuid())
  outTradeNo         String @unique
  userId             String
  provider           PaymentProvider
  planCode           SubscriptionPlanCode
  amountFen          Int
  status             PaymentOrderStatus @default(CREATED)
  expiresAt          DateTime
  paidAt             DateTime?
  providerPayload    Json?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  user               User @relation(fields: [userId], references: [id])
  auditLogs          PaymentAuditLog[]
}

model PaymentAuditLog {
  id                 String @id @default(uuid())
  orderId            String
  eventType          String
  payload            Json
  createdAt          DateTime @default(now())
  order              PaymentOrder @relation(fields: [orderId], references: [id])
}

model Conversation {
  id                 String @id @default(uuid())
  listingId          String
  buyerId            String
  sellerId           String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Message {
  id                 String @id @default(uuid())
  conversationId     String
  senderId           String
  body               String
  isFlagged          Boolean @default(false)
  createdAt          DateTime @default(now())
}

model BrokerSignal {
  id                 String @id @default(uuid())
  userId             String?
  listingId          String?
  signalType         String
  severity           BrokerSignalSeverity
  score              Int
  metadata           Json?
  createdAt          DateTime @default(now())
}

model EnforcementAction {
  id                 String @id @default(uuid())
  userId             String
  type               EnforcementType
  reason             String
  metadata           Json?
  createdBy          String?
  createdAt          DateTime @default(now())
}

model Report {
  id                 String @id @default(uuid())
  reporterId         String
  listingId          String?
  reportedUserId     String?
  reason             String
  details            String?
  status             ReportStatus @default(OPEN)
  createdAt          DateTime @default(now())
  resolvedAt         DateTime?
}
```

---

## 6. API Design Details

### 6.1 API Response Envelope

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
  requestId: string;
};

type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
};
```

### 6.2 Authentication

#### `POST /api/auth/otp/send`
Request:
```json
{ "phone": "13800138000" }
```
Response:
```json
{ "ok": true, "data": { "cooldownSeconds": 60, "devOtp": "123456" }, "requestId": "..." }
```
For local/demo builds only, return `devOtp`; never expose it in production.

#### `POST /api/auth/otp/verify`
Request:
```json
{ "phone": "13800138000", "otp": "123456", "acceptTerms": true, "acceptPrivacy": true }
```
Response:
```json
{ "ok": true, "data": { "userId": "uuid", "verificationStatus": "PHONE_ONLY" }, "requestId": "..." }
```

### 6.3 Listing Search

#### `GET /api/listings`
Query:
```text
city=Shanghai&district=Pudong&minPrice=300&maxPrice=900&bedrooms=2&q=river
```
Response should include active listings only unless admin route.

### 6.4 Listing Detail

#### `GET /api/listings/:id`
Responsibilities:
- Auth check.
- If free user and not owner, call `QuotaService.countDetailView()`.
- Return masked contact fields by default.
- Return entitlement metadata:
  - remaining free views.
  - canRevealContact.
  - needsIntent.
  - needsSubscription.

### 6.5 Contact Reveal

#### `POST /api/listings/:id/reveal-contact`
Authorization conditions:
1. Authenticated user.
2. Active paid subscription.
3. User is not seller of listing.
4. Listing is active.
5. User has saved listing or sent message.
6. User is not banned/challenge-blocked.

Response:
```json
{
  "ok": true,
  "data": {
    "sellerPhone": "13800138000",
    "sellerWeChat": "owner_wechat_id",
    "directMatchBadge": true
  },
  "requestId": "..."
}
```

---

## 7. Key Business Logic Designs

### 7.1 Free Quota Calculation

Business day must use Asia/Shanghai.

Pseudo-code:
```ts
async function countListingView(userId: string, listingId: string) {
  const listing = await listingRepo.get(listingId);
  if (listing.sellerId === userId) return { counted: false };

  if (await subscriptionService.hasActivePro(userId)) {
    await viewRepo.insert({ userId, listingId, businessDate, counted: false });
    return { counted: false, unlimited: true };
  }

  const recent = await viewRepo.findRecent(userId, listingId, 30);
  if (recent) return { counted: false };

  const used = await viewRepo.countCountedViews(userId, businessDate);
  if (used >= 5) throw new QuotaExceededError();

  await viewRepo.insert({ userId, listingId, businessDate, counted: true });
  return { counted: true, remaining: 4 - used };
}
```

### 7.2 Subscription Entitlement

```ts
function hasActivePro(user: User, now = new Date()) {
  return subscriptions.exists({
    userId: user.id,
    status: 'ACTIVE',
    startsAt: { lte: now },
    endsAt: { gt: now },
    planCode: { in: ['MONTHLY_PRO', 'ANNUAL_PRO'] }
  });
}
```

### 7.3 Broker Risk Scoring

Use event-driven signal creation:

```text
User action -> BrokerSignalDetector -> BrokerSignal -> RiskScore aggregate -> Enforcement recommendation -> Admin/realtime action
```

Example weights:
- Medium signal: +20.
- High signal: +50.
- Critical signal: +100.

Recommended thresholds:
- 20–39: soft warning.
- 40–69: verification challenge.
- 70–99: shadow ban pending review.
- 100+: hard ban or immediate admin review.

Critical signals such as ID reuse can bypass aggregate threshold and directly trigger hard-ban workflow.

### 7.4 Shadow Ban Semantics

- `User.isShadowBanned = true`.
- Listings by shadow-banned sellers are visible to the seller but excluded from all other users' feeds and details.
- User can still login, but contact reveal and messaging may be blocked or silently degraded depending on policy.
- Admin UI clearly displays shadow-ban status.

---

## 8. Payment Design

### 8.1 Payment Adapter Interface

```ts
interface PaymentProviderAdapter {
  provider: 'ALIPAY' | 'WECHATPAY';
  createOrder(input: CreatePaymentOrderInput): Promise<CreatePaymentOrderResult>;
  verifyWebhook(headers: Headers, rawBody: Buffer): Promise<VerifiedPaymentEvent>;
  queryOrder(outTradeNo: string): Promise<ProviderOrderStatus>;
  refund(input: RefundInput): Promise<RefundResult>;
}
```

### 8.2 Payment Flow

```text
User chooses plan
  -> PaymentService creates PaymentOrder with out_trade_no
  -> Provider adapter creates provider order/QR/deeplink
  -> User pays in Alipay/WeChat
  -> Provider webhook reaches /api/webhooks/provider
  -> Verify signature and decrypt if needed
  -> Idempotently mark order PAID
  -> Create/extend subscription
  -> Append PaymentAuditLog
  -> Redirect/status page shows active Pro
```

### 8.3 MVP Mock Payment
For demo builds, provide a clearly labeled mock payment panel in non-production mode:
- Generate order.
- Show QR placeholder cards for Alipay/WeChat Pay.
- Provide "Simulate successful webhook" button for local testing.
- Still route through the same `PaymentService.markPaidFromWebhook()` path.

---

## 9. UI Design System

### 9.1 Design Principles
- White-first, calm, transparent, trustworthy.
- Minimal decoration.
- Dense information only where useful.
- Large readable numbers for price, area, and savings.
- Soft borders instead of heavy shadows.
- Clear verification and anti-broker badges.

### 9.2 Color Tokens
```css
--background: #ffffff;
--foreground: #111827;
--muted: #f6f7f9;
--muted-foreground: #6b7280;
--border: #e5e7eb;
--card: #ffffff;
--primary: #111827;
--primary-foreground: #ffffff;
--accent: #0f766e;
--accent-soft: #ecfdf5;
--warning: #f59e0b;
--danger: #dc2626;
```

### 9.3 Typography
- Use system sans-serif stack for speed and Mainland compatibility.
- Headline: 48–72px desktop, 36–44px mobile.
- Body: 16px base.
- Listing numeric data: tabular numbers.

### 9.4 Components
- Header with logo, browse, pricing, seller CTA, auth state.
- Hero with commission-savings calculator.
- Trust badges: zero commission, verified owner, direct contact, anti-broker.
- Listing cards.
- Filter bar.
- Listing detail photo gallery.
- Verification badge.
- Paywall modal.
- Pricing cards.
- OTP input.
- Seller wizard stepper.
- Admin data tables.
- Empty states.
- Loading skeletons.
- Toasts.

---

## 10. Page-Level Designs

### 10.1 Landing Page
Sections:
1. Header.
2. Hero: "买房卖房，零佣金直连" / or bilingual-friendly wording if desired.
3. Savings calculator: property price -> estimated 2–3% commission saved.
4. Featured listings preview.
5. How it works: verify, browse, direct match.
6. Anti-broker trust model.
7. Pricing.
8. Seller CTA.
9. FAQ.
10. Footer/legal.

### 10.2 Listing Feed
- Sticky top filter bar.
- Left/top filters depending viewport.
- Listing cards in 3-column desktop, 1-column mobile.
- Each card shows photo, city/district, price, area, bedrooms, owner badge, masked contact state.
- Free quota indicator.

### 10.3 Listing Detail
- Gallery.
- Price/area/spec summary.
- Address district map placeholder.
- Description.
- Owner verification card.
- Contact card:
  - Free: masked + subscribe CTA.
  - Paid without intent: save/message first CTA.
  - Paid with intent: full contact.
- DirectMatch badge after reveal.
- Report suspected broker link.

### 10.4 Seller Wizard
Steps:
1. Eligibility/verification check.
2. Basic property details.
3. Address and GPS/map verification.
4. Photos upload.
5. Pricing and description.
6. Review and submit.

### 10.5 Admin Dashboard
- Overview metrics.
- Pending listings table.
- Broker signal queue.
- Reports and appeals queue.
- Payment lookup.
- User detail drawer.

---

## 11. Security Design

### 11.1 Authentication Security
- OTP hashes stored in Redis with TTL.
- Attempt counters stored separately.
- Rate limit by phone hash, IP, and device fingerprint.
- HTTP-only secure cookies.
- Session rotation after verification and sensitive actions.

### 11.2 API Security
- Server-side authorization on every protected route.
- Role-based access control for admin.
- Input validation using Zod schemas.
- Output filtering to avoid accidental PII exposure.
- CSRF protection where cookie sessions are used.

### 11.3 PII Security
- Phone numbers encrypted for display/contact, hashed for lookup.
- Real names hashed or encrypted based on lookup requirements.
- ID card data restricted and encrypted.
- Admin access to PII audited.

### 11.4 Payment Security
- Raw webhook body preserved for signature verification.
- Webhook idempotency by `out_trade_no` and provider transaction id.
- KMS/HSM for private keys.
- Append-only audit log.

### 11.5 Anti-Scraping
- Anonymous request limit: <=60 req/min/IP.
- CAPTCHA on burst behavior.
- User-Agent and TLS fingerprint checks at edge where available.
- Honeypot listing routes.
- No bulk contact endpoints.

---

## 12. Background Jobs

| Job | Frequency/Trigger | Purpose |
|---|---|---|
| expirePaymentOrders | every minute | Mark unpaid 15-minute orders expired |
| reconcilePayments | daily | Compare provider settlement files with internal orders |
| expireSubscriptions | hourly | Mark ended subscriptions expired |
| brokerRiskAggregation | every 5 minutes | Aggregate signals and recommend actions |
| listingInactivitySweep | daily | Mark inactive 90-day listings sold/pending seller confirmation |
| dailyDigestAlerts | daily | Send listing alerts to Monthly Pro |
| photoForensics | async after upload | pHash, duplicate, stock-photo checks |

---

## 13. Testing Strategy

### 13.1 Unit Test Targets
- `isMainlandPhone()`.
- OTP cooldown/attempt/expiry logic.
- Asia/Shanghai business date calculation.
- Listing quota rules.
- Subscription entitlement checks.
- Contact reveal authorization.
- Broker risk scoring.
- Payment order state transitions.

### 13.2 Integration Test Targets
- Registration/login.
- Seller Tier 2 gating.
- Listing submit and admin approve.
- Quota exhaustion and paywall.
- Mock webhook to active subscription.
- Paid contact reveal with intent.
- Broker report to admin queue.

### 13.3 E2E Scenarios
1. Visitor registers, browses 5 listings, sees paywall on sixth.
2. User subscribes monthly via mock Alipay and reveals contact.
3. Seller verifies, creates listing, admin approves, buyer sees listing.
4. Broker-like account triggers high-frequency signal and admin sees queue.

---

## 14. Implementation Milestones

### Milestone 1 — Foundation
- Project setup.
- Design system.
- Database schema.
- Seed data.
- Landing and listing feed.

### Milestone 2 — Auth and Quota
- Phone OTP mock provider.
- Session handling.
- Listing detail with quota/paywall.

### Milestone 3 — Subscriptions and Contact Reveal
- Pricing/checkout.
- Mock Alipay/WeChat provider.
- Subscription entitlements.
- Intent and contact reveal.

### Milestone 4 — Seller Flow
- Tier 2 verification mock.
- Listing creation wizard.
- Photo upload mock.
- Moderation workflow.

### Milestone 5 — Anti-Broker and Admin
- Signals.
- Reports.
- Enforcement actions.
- Admin dashboard.

### Milestone 6 — Polish and QA
- Accessibility pass.
- Responsive polish.
- Error/empty/loading states.
- Test suite.
- Deployment documentation.

---

## 15. Production Adapter Notes

### 15.1 SMS
Implement `SmsProvider` interface:
```ts
interface SmsProvider {
  sendOtp(phone: string, code: string): Promise<void>;
}
```
Local implementation logs or returns OTP. Production implementation uses selected Mainland provider.

### 15.2 OCR
Implement `OcrProvider` interface:
```ts
interface OcrProvider {
  verifyPrcIdCard(imageUrl: string, realName: string): Promise<OcrResult>;
}
```
Use provider-specific implementation after selection.

### 15.3 Maps
Implement `GeoProvider`:
```ts
interface GeoProvider {
  geocode(address: string, city: string): Promise<{ lat: number; lng: number; district?: string }>;
  reverseGeocode(lat: number, lng: number): Promise<AddressResult>;
}
```

### 15.4 Payments
Keep mock and real payment adapters behind the same interface. Never directly couple UI to provider-specific objects.

---

## 16. Known Design Tradeoffs
- A Next.js monolith accelerates MVP but may require service extraction at scale.
- Web GPS check-in may be less reliable than native mobile; design should allow later native app integration.
- PostgreSQL search is sufficient for 50k listings but should be abstracted for future OpenSearch migration.
- Mock payments are necessary for development but must be impossible to enable in production.

---

## 17. Correction Note
In the OCR adapter example, use a valid method name such as `verifyPrcIdCard`; do not include spaces in code identifiers.
