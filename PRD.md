Product Requirement Document (PRD)
ZeroCom — Peer-to-Peer Real Estate Platform
Field	Value
Document Owner	Senior Product Management
Status	Draft v1.0
Primary Market (Phase 1)	Mainland China
Secondary Market (Phase 2)	Hong Kong SAR
Business Model	Freemium Subscription (Zero Commission)
Last Updated	2026-06-14
1. Executive Summary & Business Goals
1.1 Vision
Build the first commission-free, peer-to-peer real estate marketplace in Greater China. ZeroCom connects property owners and buyers directly, removing the traditional brokerage layer that currently extracts 2–3% commissions (often amounting to ¥50,000–¥300,000+ per transaction in tier-1 cities) and replacing it with a transparent, subscription-supported platform.

1.2 Mission Statement
"Make every yuan of housing value stay with the people who earned it — sellers keep their equity, buyers keep their savings."

1.3 Business Goals (12-Month Horizon)
#	Goal	KPI / Success Metric
BG-1	Achieve product-market fit in Mainland China	100,000 verified monthly active users (MAU) by month 12
BG-2	Build a defensible listing inventory	50,000 active listings within 6 months
BG-3	Drive subscription conversion	Free-to-paid conversion rate ≥ 6%
BG-4	Maintain marketplace integrity	Broker infiltration rate < 1% of transactions
BG-5	Achieve operational sustainability	Gross margin > 70% on subscription revenue
BG-6	Lay groundwork for Hong Kong expansion	HK localization requirements documented; legal review initiated by month 9
1.4 Strategic Differentiators
Zero-commission economics — only revenue comes from subscriptions, never from transaction value.
Direct contact disclosure — verified buyers and sellers exchange real contact info (no middleman).
Hard anti-broker posture — by design, traditional agents have no legitimate role on the platform.
Identity-first trust model — real-name + phone verification enforced before any listing interaction.
1.5 Non-Goals (Phase 1)
Mortgage origination, title transfer, escrow, or legal conveyancing services.
Western payment rails (Stripe, Adyen) or HK-specific rails (Octopus, FPS).
Hong Kong launch (deferred to Phase 2; see §6).
Property valuation / appraisal algorithms.
2. Target Persona
2.1 Primary Persona — "Wei the Buyer" (Mainland China Buyer)
Attribute	Detail
Demographics	Age 28–45, urban professional, tier-1 / new-tier-1 city (Shanghai, Beijing, Shenzhen, Hangzhou, Chengdu)
Annual household income	¥300,000 – ¥1,500,000
Tech literacy	High — daily WeChat / Alipay / Douyin power user
Pain points	• Paying ¥80K–¥200K in agency commission for a single transaction.<br>• Listings on agency sites are bait-and-switch — actual inventory is hidden until a phone call.<br>• Brokers pressure-buy and gate information.
Motivations	Save commission; browse honestly without harassment; verify the actual owner/seller.
Behaviors	Searches property on Lianjia / Beike / Anjuke first; cross-references on Xiaohongshu; uses WeChat groups for peer intel.
Willingness to pay	Will pay ¥30–¥80/month to skip broker gatekeeping and see real listings.
2.2 Secondary Persona — "Mei the Seller" (Mainland China Homeowner)
Attribute	Detail
Demographics	Age 35–60, owns 1–3 properties, often upgrade-seller or relocation
Pain points	Forced to sign exclusive agency contracts at 2–3% commission.<br>Loses control of showing schedule and negotiation.<br>Fake lowball offers from agents fishing for listings.
Motivations	Reach real, qualified buyers directly; retain full commission savings; control communication.
Behaviors	Posts on Xiaohongshu, 58.com, or local WeChat groups; skeptical of agencies after one bad experience.
Willingness to pay	Willing to pay for premium listing placement and verified-buyer leads.
2.3 Anti-Persona — "The Broker"
The broker is the persona the platform is explicitly designed to exclude. We do not optimize for them. Their tactics (mass scraping, identity obfuscation, listing hijacking, inserting themselves between matched parties) are treated as abuse signals.

3. User Flows
3.1 Master Flow Overview
text

Anonymous Visitor
    └─► Phone Verification (real-name + SMS OTP)
            └─► Authenticated Free User
                    ├─► Browse Listings (capped at N/day)
                    ├─► Hit Paywall ─► Subscription Purchase (Alipay / WeChat Pay)
                    └─► Paid User (unlimited browsing + direct contact reveal)
3.2 Flow A — Phone Verification & Registration
Step	User Action	System Response
A1	User taps "Register" or attempts any gated action	Display phone-number entry screen
A2	User enters Mainland China mobile number	Validate format (^1[3-9]\d{9}$); reject HK/foreign numbers in Phase 1
A3	User taps "Send Code"	Send 6-digit SMS OTP via China Unicom/Telecom/Mobile aggregated SMS gateway; 60s cooldown + 3-attempt cap
A4	User enters OTP	Verify; if valid, transition to real-name step
A5	User enters real name (Chinese: 中文姓名) + uploads optional ID-card front (OCR-verified)	Hash + store name; flag verification tier (phone_only vs phone+ID); higher tier unlocks seller actions
A6	User accepts Terms of Service & Privacy Policy	Account created; session token (JWT) issued; redirect to onboarding
Verification tiers:

Tier 1 — Phone only: Can browse and contact as buyer.
Tier 2 — Phone + ID card (OCR): Required to publish listings as a seller.
3.3 Flow B — Listing Browsing (Free User)
Step	User Action	System Behavior
B1	User opens app / web, lands on listing feed	Server returns listings within quota (view_count_today < LIMIT_FREE)
B2	User scrolls / filters (city, district, price, area)	Filters applied server-side; results counted toward daily quota
B3	User opens listing detail page	Quota +1; if quota exhausted → redirect to Paywall (§3.5)
B4	Listing detail shows: photos, price, area, district, basic amenities, owner-verified badge	Contact info (phone, WeChat ID) is masked: 138****1234
B5	Free user clicks "Contact Seller"	Blocked; upsell modal: "Unlock unlimited access — Subscribe"
3.4 Flow C — Listing Publication (Seller)
Step	User Action	System Behavior
C1	User taps "Post Listing" (gated to Tier 2 verification)	Display listing creation form
C2	User uploads photos (≤ 20), enters title, price, area, address, description	Auto-flag duplicate listings by geo-hash + image perceptual hash (pHash)
C3	User taps "Verify Address"	Reverse-geocode + on-site check-in via GPS (user must be physically near the property, within 500m tolerance)
C4	User submits	Listing enters moderation queue; published within 4 hours if no flags
C5	Listing appears in feed	Visible to all users; contact info shown only to paid matched buyers
3.5 Flow D — Subscription Paywall & Checkout
Step	User Action	System Behavior
D1	Free user hits daily limit or taps "Contact Seller"	Show paywall modal with tier comparison (Free vs ¥29/mo vs ¥199/yr)
D2	User selects plan	Generate order via payment gateway (§5)
D3	System displays Alipay and WeChat Pay QR codes / SDK buttons	Native SDK integration inside app; H5 redirect for web
D4	User completes payment in wallet	Gateway webhook fires → backend verifies signature (RSA2) → flips user to paid tier
D5	User redirected to originally blocked action	Listing contact info revealed in full; quota removed for the day
3.6 Flow E — Match & Direct Contact (Paid User)
Step	User Action	System Behavior
E1	Paid user opens a listing	Full seller contact (phone + WeChat ID) revealed
E2	User taps "Call" or "Chat"	Native dialer / in-app chat opens
E3	Both parties see a "DirectMatch Confirmation" badge indicating the platform certifies this is owner↔buyer contact, not a broker	Persistent banner on listing page for 30 days post-match
4. Functional Requirements & Feature Specification
4.1 Listing Management
4.1.1 Listing Data Model
Field	Type	Required	Notes
listing_id	UUID	Yes	Internal only
seller_id	FK	Yes	Must be Tier-2 verified
title	String ≤ 60 chars	Yes	
description	Markdown ≤ 5,000 chars	Yes	
city	Enum (Shanghai, Beijing, …)	Yes	Phase 1: 10 tier-1 cities
district	String	Yes	Auto-suggested
address_detail	String	Yes	Geocoded to lat/lng
price_rmb	Decimal (wan)	Yes	Stored as integer 万
area_sqm	Decimal	Yes	
bedrooms, bathrooms	Int	Yes	
property_type	Enum (new/second-hand/rental)	Yes	Phase 1: second-hand only
photos	URL[]	Yes	1–20 images, pHash-checked
geo_hash	String	Auto	Used for duplicate detection
verification_status	Enum (pending/verified/rejected)	Auto	GPS check-in required
published_at	Timestamp	Auto	
status	Enum (active/paused/sold/removed)	Auto	
4.1.2 Listing Lifecycle States
text

Draft → Pending Verification → Active → (Paused | Sold | Removed)
Sold: Triggered by seller confirmation OR 90 days of inactivity.
Removed: Triggered by moderation (duplicate, suspicious, broker-flagged).
4.1.3 Duplicate & Fraud Detection
Geo-deduplication: Two listings within 50m geo-hash and ≥ 80% image pHash similarity → flagged for review.
Price anomaly detection: Listings priced > 40% below district median → automatic "Low Price" warning badge + manual review queue.
Image forensics: Detect stock photos via reverse-image search against a known stock dataset.
4.2 Free vs Paid Limits
4.2.1 Tier Matrix
Capability	Free User	Paid Monthly (¥29)	Paid Annual (¥199)
Property detail views per day	5	Unlimited	Unlimited
Saved listings	10	Unlimited	Unlimited
In-app chat messages / day	10	Unlimited	Unlimited
Direct contact (phone/WeChat) reveal	❌	✅	✅
New-listing email alerts	❌	✅ (daily digest)	✅ (real-time push)
"Verified Owner" badge visibility	❌	✅	✅
Price-history chart	❌	✅	✅
Advanced filters (school district, subway distance)	❌	✅	✅
Listing priority in search results	—	Boosted	Top-tier boost
Auto-renewal	—	Optional	Default ON
4.2.2 Quota Enforcement Rules
Daily quota resets at 00:00 Asia/Shanghai (UTC+8), not a rolling 24h window.
One property detail view = one count, regardless of time spent on the page (debounced 30s to prevent refresh exploits).
Listings the user themselves posted do not count against the quota.
Quota exhaustion triggers paywall, not account lockout — user can still register, log in, and subscribe.
4.2.3 Pricing Strategy
Monthly ¥29: Targets casual buyers browsing 1–2 weekends a month.
Annual ¥199: ~42% discount vs monthly, targets active buyers and sellers needing long-term posting.
Family plan (future): Not in Phase 1 scope.
4.3 Anti-Broker Detection Systems
This is the single most critical feature surface in the product. Brokers are explicitly adversarial users.

4.3.1 Detection Signals
Signal	Mechanism	Severity
Behavioral — high-frequency viewing	User opens > 30 listings/hour across unrelated districts	Medium
Behavioral — geo-skip pattern	User views listings in 5+ cities within 24h	High
Behavioral — always-view, never-engage	100+ views but 0 in-app chats or calls within 7 days	Medium
Identity — multiple phones on same device	IMEI / device-fingerprint collision with > 2 verified phone numbers	High
Identity — ID card reuse	Same ID-card OCR hash registers > 1 account	Critical
Content — listing hijack	New account reposts identical listing within 24h of another account	High
Communication — off-platform redirect	User's first in-app message contains external contact (WeChat IDs, phone, QR codes)	Medium
Network — IP-cluster anomaly	Multiple "different" accounts from same ASN/IP block exhibiting broker patterns	High
4.3.2 Mitigation & Enforcement
Action	Trigger	Effect
Soft warning	Medium severity, first offense	In-app notice: "Reminder: ZeroCom is for personal transactions only"
Verification challenge	Medium severity, repeated	Re-verify phone + selfie liveness check
Shadow ban	High severity	User sees their own listings normally; others see nothing
Hard ban	Critical severity or 2nd high-severity violation	Account terminated; device fingerprint + ID hash + phone hash added to deny-list
Listing purge	Any ban event	All listings owned by banned user auto-removed and re-verified
4.3.3 Direct-Match Safeguards (Product Features)
Contact Reveal only after mutual intent. Phone/WeChat is shown to paid buyer only after buyer has sent an in-app message OR saved the listing. This makes passive scraping economically irrational.
"Verified Owner" badge. Sellers who complete full ID verification + GPS check-in get a persistent badge. Buyers see this on every listing — it is a direct signal against broker-lifted listings.
No public seller contact directory. Even paid users cannot bulk-export contact info. The platform API explicitly does not expose a seller-list endpoint.
Watermarked photos. Every listing photo embeds an invisible user-ID watermark; if a broker reposts the photo, the watermark is traceable.
On-platform messaging preferred. The product nudges users to keep the first 5–10 messages inside the in-app chat. External contact info is not shown to free users, so brokers cannot harvest it.
Anti-scraping at infrastructure layer.
Rate-limit anonymous requests: ≤ 60 req/min/IP.
CAPTCHA (hCaptcha or Tencent CAPTCHA) on any anonymous browse burst.
User-Agent fingerprinting; known scraping tool signatures blocked.
TLS fingerprinting (JA3/JA4) for non-browser clients.
Honeypot listings: invisible URLs known only to scrapers; traffic from these URLs auto-bans the source.
Post-match "Broker Intercept" survey. 7 days after a paid match, both parties are asked: "Was the other party a real owner/buyer, or an agent?" A "yes, agent" answer triggers an investigation.
4.3.4 Reporting & Appeals
Any user can report a listing or another user as "suspected broker."
Reports queue into a moderation dashboard; SLA: investigate within 24h.
Banned users receive written notice with right to appeal via in-app form.
5. Monetization & Payment Gateways
5.1 Revenue Model
100% of revenue from subscriptions. Zero commission, zero transaction fees, zero listing fees.
No ads in Phase 1 (deferred — would compromise trust model).
5.2 Pricing Tiers (Locked for Phase 1)
Plan	Price	Duration	Auto-Renew
Free	¥0	—	—
Monthly Pro	¥29	30 days	Optional
Annual Pro	¥199	365 days	ON by default
5.3 Supported Payment Gateways
5.3.1 Alipay (支付宝) Integration
Spec	Value
Integration mode	Alipay App Payment (mobile) + Alipay WAP / PC Web Payment (web)
SDK	alipay-sdk (Java/Python/Node) — server-side only; client never holds keys
Signing algorithm	RSA2 (SHA256 with RSA, 2048-bit key)
Product code	QUICK_MSECURITY_PAY (mobile) / FAST_INSTANT_TRADE_PAY (web)
Required merchant onboarding	Alipay merchant account; KYC with business license; signed Alipay Open Platform app
Webhook	Async notify URL (/webhooks/alipay); verify signature on receipt; idempotency via out_trade_no
Refund flow	Server-initiated refund via Alipay Open API; supports partial refunds (not used in Phase 1)
Reconciliation	Daily T+1 download of Alipay settlement file vs internal orders table
Failure handling	Polling fallback every 5 min for up to 2h for orders stuck in WAIT_BUYER_PAY
Settlement currency	RMB only
User experience	Native in-app Alipay SDK → biometric/fingerprint confirmation → return to app
5.3.2 WeChat Pay (微信支付) Integration
Spec	Value
Integration mode	WeChat Pay App Payment (mobile) + JSAPI / H5 (web in WeChat browser) + Native (web outside WeChat)
SDK	wechatpay-apache-httpclient or equivalent; server-side only
Signing algorithm	HMAC-SHA256 (V3 API, RSA also supported)
Required merchant onboarding	WeChat Pay merchant ID; ICP-registered domain for web H5; AppID registered to the platform's mobile app
Unified order API	/v3/pay/transactions/app for mobile; /v3/pay/transactions/jsapi for in-WeChat web
Webhook	Async notify URL (/webhooks/wechatpay); verify signature + decrypt callback ciphertext (AEAD_AES_256_GCM); idempotency via out_trade_no
Refund flow	/v3/refund/domestic/refunds; supports partial refunds (not used in Phase 1)
Reconciliation	Daily download from WeChat Pay merchant portal; cross-check internal orders
Failure handling	Same polling fallback as Alipay
Settlement currency	RMB only
User experience	Native in-app WeChat Pay SDK → confirm in WeChat → return to app
5.3.3 Payment Order Lifecycle
text

CREATED → PENDING_USER_PAY → (PAID | EXPIRED | CANCELLED | REFUNDED)
Order expiration: 15 minutes (matches Alipay/WeChat default).
Successful payment flips user to paid tier only after webhook signature verification.
All order state transitions are logged to an append-only payment_audit_log table.
5.3.4 Security & Compliance
PCI scope: Out — ZeroCom never touches raw card data; wallets handle PAN.
Key custody: RSA private keys stored in HSM or cloud KMS (Aliyun KMS / Tencent KMS), never in app code or env files.
Replay protection: Idempotency key = out_trade_no = <user_id>_<plan_id>_<nonce>, unique.
Network security: Webhooks must be served over HTTPS with valid cert; IP-allowlist the gateway callback IPs in production.
Regulatory: Comply with PBOC (中国人民银行) regulations on non-bank payment; non-bank payment license (支付牌照) not required because ZeroCom does not hold user funds — payments settle directly to merchant account.
Refund window: 30 days, refundable on request via in-app support.
5.3.5 Out of Scope (Phase 1)
❌ Stripe, Adyen, Braintree, PayPal
❌ UnionPay direct card processing
❌ Apple Pay / Google Pay
❌ Crypto payments
❌ Octopus, FPS, AlipayHK, WeChat Pay HK (Hong Kong rails — deferred to Phase 2)
6. Future Scope — Scaling to Hong Kong
6.1 Strategic Rationale
Hong Kong is the natural second market: same Cantonese-speaking cultural cohort, a market even more dominated by agencies (中原, 美聯, 利嘉閣 hold ~80% combined share), and some of the world's highest commission rates (typically 1% from each side = 2% total, but in absolute HKD terms the per-transaction cost is brutal on a HK$10M+ apartment).

6.2 Localization Requirements (Phase 2)
Area	Mainland China (Phase 1)	Hong Kong (Phase 2)
Phone verification	Mainland mobile (^1[3-9]\d{9}$)	HK mobile (^\+852\s?[2-9]\d{7}$); +852 country code
ID verification	PRC ID card (OCR)	HKID card (OCR + MRZ validation); passport fallback for expats
Language	Simplified Chinese only	Traditional Chinese + English (bilingual UI)
Currency	RMB only	HKD primary; RMB display optional
Payment gateways	Alipay, WeChat Pay	FPS (轉數快), AlipayHK, WeChat Pay HK, Octopus (card / O! ePay) — Western rails (Stripe) also considered
Legal entity	PRC mainland operating company	Separate HK subsidiary; potentially separate data residency
Listings language	Simplified Chinese	Traditional Chinese + English
Address format	Chinese street + number	English + Chinese; floor/unit mandatory
Property type	Second-hand residential	Second-hand residential + subdivided flats (劏房) flagged separately
6.3 Phase 2 Functional Additions
Multi-currency subscriptions: HK$38 / month equivalent pricing.
Stamp duty calculator (HK-specific: 從價印花稅, 買家印花稅, 新住宅從價印花稅).
Mortgage rate display from major HK banks (HSBC, Hang Seng, Bank of China HK).
Cross-border listing flag for Mainland-owned HK properties (with regulatory caveats — see §6.4).
6.4 Regulatory & Legal Watchlist (HK)
Estate Agents Ordinance (Cap. 511): Any platform facilitating HK real estate transactions may itself fall under regulation. Legal opinion required before launch.
Personal Data (Privacy) Ordinance (Cap. 486): HKID handling has stricter consent requirements than PRC PIPL.
Anti-Money Laundering: HK requires source-of-funds checks for property transactions above HK$8M; the platform should be ready to surface this requirement to users.
Cross-border data: Moving user data between Mainland and HK servers requires explicit consent under both PIPL and PDPO.
6.5 Phase 2 Sequencing
Month 9: Legal review + entity setup in HK.
Month 10–11: Localize payment integration (FPS, AlipayHK, Octopus).
Month 11: Beta launch in 1 HK district (e.g., Kowloon).
Month 12+: Expand to all HK districts; cross-border feature roadmap.
Appendix A — Glossary
Term	Meaning
P2P	Peer-to-peer — direct owner↔buyer transactions without intermediaries
Disintermediation	Removing the broker layer from the transaction
Freemium	Free base product + paid premium tier
Geo-hash	Hierarchical spatial index for location-based deduplication
pHash	Perceptual hash for image similarity detection
OTA	Over-the-air (used here for push notifications)
HSM	Hardware Security Module
KMS	Key Management Service
PBOC	People's Bank of China (中国人民银行)
PIPL	Personal Information Protection Law (个人信息保护法)
PDPO	Personal Data (Privacy) Ordinance (HK)
Appendix B — Open Questions for Stakeholder Review
Should paid buyers see seller WeChat IDs, or only phone numbers? (WeChat ID exposure is higher-stakes for spam.)
Refund policy for users who subscribe but never see contact info revealed — proration or no refund?
Should the platform take a small (≤ ¥99) listing-posting fee from sellers to deter spam listings, or keep seller-side fully free?
Family sharing of paid subscriptions — single seat per account, or up to N devices?
Will there be a government partnership or sandbox (e.g., with 房管局) for verified address data, or fully self-served?