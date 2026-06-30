# Technical Requirements Document (TRD)
## ZeroCom — Peer-to-Peer Real Estate Platform

**Version:** 1.0  
**Date:** 2026-06-27  
**Source:** PRD.md v1.0  
**Primary Market:** Mainland China  
**Phase 1 Scope:** Responsive web application plus backend foundation for commission-free real estate marketplace

---

## 1. Purpose
This TRD translates the ZeroCom PRD into implementable technical requirements for engineering, design, QA, security, and future AI/code-generation execution. It defines the product architecture, core modules, data requirements, integrations, security controls, non-functional requirements, and implementation constraints.

---

## 2. Product Scope
ZeroCom is a zero-commission, peer-to-peer real estate marketplace that connects verified property owners and buyers directly. Phase 1 focuses on Mainland China users, Mainland phone verification, RMB subscriptions, anti-broker enforcement, listing discovery, seller listing publication, and paid contact reveal.

### 2.1 In Scope — Phase 1
- Public marketing website and marketplace landing experience.
- User registration/login using Mainland China mobile number and SMS OTP.
- Real-name verification tiering:
  - Tier 1: phone-only buyer access.
  - Tier 2: phone + ID/OCR verification required for seller publishing.
- Listing browsing, filtering, search, detail pages, quota enforcement, and paywall.
- Seller listing creation workflow with photo upload, address/geolocation verification, and moderation state.
- Paid subscription checkout UX for Monthly Pro and Annual Pro.
- Payment integration contracts for Alipay and WeChat Pay.
- Direct contact reveal for paid users after intent signal.
- In-app messaging foundation.
- Saved listings.
- Anti-broker signals, moderation dashboard, reporting, bans, and appeals.
- Admin/moderation operations.
- Security, audit logging, compliance, privacy, and observability foundations.
- Responsive, clean, minimalistic UI with white as primary color.

### 2.2 Out of Scope — Phase 1
- Mortgage origination.
- Escrow, title transfer, legal conveyancing.
- Property valuation/appraisal algorithms.
- Hong Kong market launch.
- HK payment rails: FPS, Octopus, AlipayHK, WeChat Pay HK.
- Western payment rails: Stripe, PayPal, Adyen, Braintree.
- Ads.
- Family plans.

---

## 3. Recommended Technology Stack
The final implementation may vary, but the following stack is recommended for fast full-stack delivery and long-term maintainability.

### 3.1 Frontend
- **Framework:** Next.js 15+ with App Router.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS.
- **UI System:** shadcn/ui-style component patterns or custom accessible primitives.
- **State/Data:** React Server Components where possible, TanStack Query for client mutations if needed.
- **Forms:** React Hook Form + Zod validation.
- **Maps:** Abstracted map provider interface; production can use AMap/Gaode for Mainland China.
- **Charts:** Recharts or lightweight SVG charts for price-history UI.

### 3.2 Backend
- **Runtime:** Node.js/TypeScript using Next.js API routes/server actions or a separate NestJS service for larger scale.
- **Database:** PostgreSQL 16+.
- **ORM:** Prisma.
- **Cache/Queue:** Redis for rate limits, OTP cooldown, quotas, job queues, and session invalidation.
- **Object Storage:** S3-compatible storage; in China use Alibaba Cloud OSS or Tencent COS.
- **Search:** PostgreSQL full-text search for MVP; upgrade path to OpenSearch/Elasticsearch.
- **Background Jobs:** BullMQ or managed queue.

### 3.3 Infrastructure
- **Deployment:** Containerized application on Kubernetes or managed PaaS.
- **CDN/WAF:** Aliyun CDN/WAF or Tencent Cloud equivalent.
- **Secrets/KMS:** Aliyun KMS/Tencent KMS; no payment keys in source or plain env files.
- **Observability:** OpenTelemetry, structured logs, metrics, error tracking.
- **CI/CD:** GitHub Actions/GitLab CI with lint, typecheck, tests, migrations, security scans.

---

## 4. User Roles and Permissions

| Role | Description | Core Permissions |
|---|---|---|
| Anonymous Visitor | Unauthenticated site visitor | View public landing pages, limited public listing previews if enabled |
| Free Buyer | Authenticated Tier 1 user without subscription | Browse within daily quota, save limited listings, masked contacts, limited chat |
| Paid Buyer | Active Monthly/Annual Pro user | Unlimited views, direct contact reveal after intent, unlimited saves/chat, advanced filters |
| Seller | Tier 2 verified user | Create, edit, pause, mark sold listings; view buyer interest |
| Moderator | Internal operations user | Review listings, reports, verification flags, appeals, suspected broker events |
| Admin | Internal platform operator | Manage users, subscriptions, payments, settings, fraud rules, moderation policies |

---

## 5. Functional Technical Requirements

## 5.1 Authentication and Registration

### Requirements
- System shall support registration/login using Mainland China mobile numbers only for Phase 1.
- Mobile number validation regex: `^1[3-9]\\d{9}$`.
- System shall send 6-digit SMS OTP with:
  - 60-second resend cooldown.
  - Maximum 3 attempts per OTP session.
  - OTP expiry of 5 minutes.
- System shall hash stored phone numbers for sensitive comparisons while preserving encrypted display/contact values where needed.
- System shall issue secure HTTP-only session cookies or JWT-backed sessions after successful verification.
- System shall require Terms of Service and Privacy Policy acceptance before account activation.

### Acceptance Criteria
- Invalid Mainland phone numbers are rejected client-side and server-side.
- OTP cannot be brute-forced beyond configured attempts.
- Expired OTP cannot authenticate.
- Session is not issued until phone and policy acceptance are complete.

---

## 5.2 Identity Verification

### Requirements
- Tier 1 shall require phone verification only.
- Tier 2 shall require real name and ID card OCR verification before seller listing publication.
- Real names and ID-derived values shall be encrypted or hashed at rest according to sensitivity.
- ID card images shall be stored in restricted private object storage with signed access only.
- Verification state shall be auditable.

### Verification States
- `unverified`
- `phone_only`
- `id_pending`
- `id_verified`
- `id_rejected`
- `challenge_required`

### Acceptance Criteria
- Tier 1 users can browse/contact according to buyer rules.
- Only Tier 2 verified users can submit listings for publication.
- Reused ID hash across accounts is flagged as Critical anti-broker signal.

---

## 5.3 Listing Management

### Requirements
- Seller shall create listings with required fields:
  - title, description, city, district, address_detail, price_rmb_wan, area_sqm, bedrooms, bathrooms, property_type, photos.
- Title max length: 60 chars.
- Description max length: 5,000 chars.
- Photos: 1–20 images.
- Phase 1 city support shall be configurable, defaulting to 10 tier-1/new-tier-1 cities.
- Property type shall be second-hand residential for Phase 1, with schema extensibility for new/rental later.
- Listings shall support lifecycle: `draft -> pending_verification -> active -> paused|sold|removed`.
- System shall calculate geohash after geocoding.
- System shall calculate image perceptual hashes for uploaded photos.
- Duplicate listings shall be flagged when within 50m and >=80% image similarity.
- Price anomaly shall be flagged when price is >40% below district median.
- Listing moderation queue shall display flags and allow approve/reject/remove.

### Acceptance Criteria
- A non-Tier-2 user cannot submit a listing.
- Listings with missing mandatory fields cannot be submitted.
- Submitted listings enter moderation before publication.
- Active listings appear in search/feed.
- Removed listings are not visible to regular users.

---

## 5.4 Listing Browsing, Search, and Filters

### Requirements
- Listing feed shall support filtering by:
  - city, district, price range, area range, bedrooms, bathrooms, property type, subway distance, school district where available.
- Listing detail views shall count against free quota.
- Free users shall have 5 property detail views per day.
- Daily quota shall reset at 00:00 Asia/Shanghai.
- Quota counting shall be debounced by 30 seconds to prevent refresh abuse.
- Listings posted by the current user shall not count against quota.
- Paid users shall have unlimited listing detail views.
- Search shall support keyword matching across title, district, and description.

### Acceptance Criteria
- Free users are redirected to paywall when quota is exhausted.
- Paid users never see quota paywall for view limits.
- Filters are applied server-side.
- Quota timestamps use Asia/Shanghai business date.

---

## 5.5 Contact Reveal and Direct Match

### Requirements
- Seller phone and WeChat ID shall be masked for free users.
- Paid users can reveal direct contact only after buyer intent signal:
  - saved listing, or
  - sent in-app message.
- Contact reveal shall be logged.
- DirectMatch confirmation badge shall appear after reveal/match.
- No bulk seller contact endpoint shall exist.
- API shall only reveal contact for one listing interaction at a time after authorization checks.

### Acceptance Criteria
- Free users cannot reveal seller contact.
- Paid user without intent sees prompt to save/message first.
- Paid user with intent sees full contact.
- Every reveal event creates an audit record.

---

## 5.6 Subscriptions and Payments

### Requirements
- Plans:
  - Free: ¥0.
  - Monthly Pro: ¥29 for 30 days, optional auto-renew.
  - Annual Pro: ¥199 for 365 days, auto-renew default ON.
- Payment providers:
  - Alipay App/WAP/Web.
  - WeChat Pay App/JSAPI/H5/Native.
- Payment order lifecycle:
  - `created -> pending_user_pay -> paid|expired|cancelled|refunded`.
- Order expiration: 15 minutes.
- Successful payment shall activate subscription only after signed webhook verification.
- Webhook handling shall be idempotent using `out_trade_no`.
- Payment audit log shall be append-only.
- System shall support reconciliation import/reporting.

### Acceptance Criteria
- Paid tier is not granted on client-side callback alone.
- Duplicate webhooks do not duplicate subscriptions.
- Invalid webhook signatures are rejected and logged.
- Expired orders cannot activate subscriptions.

---

## 5.7 In-App Messaging

### Requirements
- Users shall send messages about a listing.
- Free users shall be limited to 10 in-app chat messages/day.
- Paid users shall have unlimited messages.
- First-message external contact detection shall flag phone numbers, WeChat IDs, QR references, and suspicious redirects.
- Conversations shall be associated with listing, buyer, and seller.
- Messages shall support moderation review if reported/flagged.

### Acceptance Criteria
- Message quota enforced for free users.
- Suspicious first message triggers anti-broker signal.
- Buyer and seller can access their own conversations only.

---

## 5.8 Saved Listings and Alerts

### Requirements
- Free users can save up to 10 listings.
- Paid users have unlimited saved listings.
- Paid Monthly users can receive daily digest alerts.
- Paid Annual users can receive real-time push alerts.
- Notification preferences shall be configurable.

### Acceptance Criteria
- Save limit enforced for free users.
- Removed/sold listings display inactive state in saved list.

---

## 5.9 Anti-Broker System

### Requirements
The platform shall detect and mitigate broker abuse using configurable rules and risk scoring.

### Signals
- High-frequency viewing: >30 listings/hour across unrelated districts.
- Geo-skip pattern: 5+ cities within 24h.
- Always-view-never-engage: 100+ views and 0 chats/calls in 7 days.
- Multiple phones on same device fingerprint: >2 phone numbers.
- ID card reuse: same ID hash registers >1 account.
- Listing hijack: duplicate listing repost within 24h by new account.
- Off-platform redirect in first message.
- IP/ASN cluster anomaly.
- Honeypot listing access.

### Enforcement Actions
- Soft warning.
- Verification challenge.
- Shadow ban.
- Hard ban.
- Listing purge.

### Requirements
- Risk scoring shall be configurable without code deployment.
- Enforcement actions shall be logged.
- Users shall be able to appeal bans.
- Moderators shall review reports and appeals with 24h SLA target.

### Acceptance Criteria
- Critical ID reuse can trigger hard ban workflow.
- Shadow-banned user sees their own listings, while others do not.
- Reports appear in moderation queue.

---

## 5.10 Moderation and Admin

### Requirements
- Admin dashboard shall include:
  - Pending listings.
  - Duplicate/price anomaly flags.
  - Suspected broker users.
  - User reports.
  - Appeals.
  - Payment/order lookup.
  - User subscription status.
- Moderators can approve, reject, remove, shadow ban, hard ban, request re-verification, and resolve reports.
- Every moderation action shall be audit logged.

### Acceptance Criteria
- Admin-only routes require admin role.
- Actions are immutable in audit history.

---

## 6. Data Requirements

### 6.1 Core Entities
- User
- UserVerification
- DeviceFingerprint
- Listing
- ListingPhoto
- ListingModerationFlag
- ListingView
- SavedListing
- Conversation
- Message
- ContactReveal
- SubscriptionPlan
- Subscription
- PaymentOrder
- PaymentAuditLog
- BrokerSignal
- EnforcementAction
- Report
- Appeal
- NotificationPreference
- AuditLog

### 6.2 Data Retention
- Payment audit logs: retain according to financial compliance requirements, minimum 7 years recommended.
- Authentication/session logs: minimum 180 days.
- Broker enforcement logs: minimum 2 years.
- ID card images: retain only while required for verification/compliance; restrict access and support deletion request where legally permissible.

---

## 7. API Requirements

### 7.1 Public/Auth APIs
- `POST /api/auth/otp/send`
- `POST /api/auth/otp/verify`
- `POST /api/auth/logout`
- `GET /api/session`

### 7.2 Verification APIs
- `POST /api/verification/real-name`
- `POST /api/verification/id-card/upload`
- `GET /api/verification/status`

### 7.3 Listing APIs
- `GET /api/listings`
- `POST /api/listings`
- `GET /api/listings/:id`
- `PATCH /api/listings/:id`
- `POST /api/listings/:id/submit`
- `POST /api/listings/:id/pause`
- `POST /api/listings/:id/mark-sold`
- `POST /api/listings/:id/report`
- `POST /api/listings/:id/save`
- `DELETE /api/listings/:id/save`

### 7.4 Contact APIs
- `POST /api/listings/:id/intent`
- `POST /api/listings/:id/reveal-contact`

### 7.5 Messaging APIs
- `GET /api/conversations`
- `POST /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`

### 7.6 Payment APIs
- `POST /api/payments/orders`
- `GET /api/payments/orders/:id`
- `POST /api/webhooks/alipay`
- `POST /api/webhooks/wechatpay`

### 7.7 Admin APIs
- `GET /api/admin/listings/pending`
- `POST /api/admin/listings/:id/approve`
- `POST /api/admin/listings/:id/reject`
- `POST /api/admin/users/:id/shadow-ban`
- `POST /api/admin/users/:id/hard-ban`
- `GET /api/admin/reports`
- `POST /api/admin/reports/:id/resolve`
- `GET /api/admin/appeals`
- `POST /api/admin/appeals/:id/resolve`

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Landing page LCP target: <2.5s on 4G.
- Listing feed API p95: <500ms for cached/common queries.
- Listing detail API p95: <400ms excluding image CDN.
- Payment webhook processing p95: <1s.

### 8.2 Scalability
- Support 100,000 verified MAU by month 12.
- Support 50,000 active listings by month 6.
- Support spike traffic during evening/weekend browsing windows.

### 8.3 Availability
- Public browsing and auth: 99.9% monthly uptime target.
- Payment webhook endpoint: 99.95% target.
- Graceful degradation if SMS/payment provider unavailable.

### 8.4 Security
- HTTPS only.
- Secure, HTTP-only, SameSite cookies.
- CSRF protection for state-changing browser requests.
- Rate limits for anonymous and authenticated APIs.
- CAPTCHA on suspicious anonymous browse bursts.
- No secrets in client bundles.
- Payment keys stored in KMS/HSM.
- Sensitive PII encrypted at rest.
- Principle of least privilege for admin routes.

### 8.5 Privacy and Compliance
- PIPL-conscious collection minimization and consent.
- Clear Privacy Policy and Terms acceptance tracking.
- User data export/deletion request workflow.
- Explicit consent for ID card handling.
- Production domain should satisfy Mainland compliance requirements, including ICP where applicable.

### 8.6 Accessibility
- WCAG 2.1 AA target.
- Keyboard navigability.
- Visible focus states.
- Proper semantic headings and labels.
- Color contrast compliant.

### 8.7 Localization
- Phase 1 default language: Simplified Chinese.
- Code architecture shall support future Traditional Chinese and English.
- Currency format: RMB/CNY.
- Timezone: Asia/Shanghai for business logic.

---

## 9. UX/UI Requirements

### Visual Direction
- Clean, minimal, premium, trust-first real estate marketplace.
- White primary background.
- Neutral grayscale palette with restrained accent color.
- High whitespace density.
- Clear card hierarchy.
- Minimal shadows and fine borders.
- Avoid aggressive sales styling.

### Core Pages
- Landing page.
- Auth/phone verification page.
- Onboarding/verification page.
- Listing feed/search page.
- Listing detail page.
- Paywall/checkout page.
- Seller listing creation wizard.
- Dashboard for saved listings, messages, subscription, own listings.
- In-app chat page.
- Report/appeal flows.
- Admin moderation dashboard.
- Legal pages: Terms, Privacy, Refund Policy.

---

## 10. Testing Requirements

### Unit Tests
- Phone validation.
- OTP attempt/cooldown logic.
- Quota reset and debounce rules.
- Subscription state transition logic.
- Payment webhook signature verification adapters.
- Broker risk scoring.

### Integration Tests
- Registration flow.
- Listing create/submit/moderate/publish flow.
- Free quota exhaustion to paywall.
- Paid payment webhook activates subscription.
- Contact reveal authorization.
- Report to moderation queue.

### E2E Tests
- Anonymous visitor -> register -> browse -> hit paywall -> subscribe -> reveal contact.
- Tier 2 seller -> create listing -> submit -> admin approve -> active feed.
- Suspicious broker pattern -> signal -> enforcement action.

---

## 11. Analytics Requirements

### Key Events
- `visit_landing`
- `auth_otp_requested`
- `auth_completed`
- `verification_started`
- `verification_completed`
- `listing_feed_viewed`
- `listing_detail_viewed`
- `quota_exhausted`
- `paywall_viewed`
- `subscription_order_created`
- `subscription_paid`
- `contact_revealed`
- `listing_created`
- `listing_published`
- `broker_signal_triggered`
- `report_submitted`

### KPIs
- Verified MAU.
- Active listings.
- Free-to-paid conversion.
- Broker infiltration rate.
- Subscription gross margin.
- Listing approval SLA.

---

## 12. Open Technical Questions
1. Which SMS provider will be selected for Mainland China aggregation?
2. Which OCR provider will be used for PRC ID cards?
3. Is GPS check-in mandatory in the web flow or deferred to native mobile?
4. Should WeChat ID reveal be included in Phase 1, or phone-only initially?
5. Which map/geocoding vendor is approved for production?
6. What is the exact list of Phase 1 cities?
7. What ICP/domain/cloud provider constraints apply?

---

## 13. MVP Delivery Recommendation
For a website MVP/demo, implement production-shaped flows with mock adapters for SMS, OCR, payments, maps, and pHash. Preserve interfaces so real providers can be swapped in without redesigning the application.
