# Legal Compliance Checklist — ZeroCom

This document provides a pre-deployment legal compliance checklist for the ZeroCom platform.
Review every item and fill in the placeholders before going live.

---

## 1. Required Legal Pages

| Page | Route | Status |
|------|-------|--------|
| Privacy Policy | `/legal/privacy.html` (legacy `/privacy` redirects) | ✅ Implemented |
| Terms of Service | `/legal/terms.html` (legacy `/terms` redirects) | ✅ Implemented |
| Refund Policy | `/refunds` | ✅ Existing |

All pages include:
- GDPR-compliant data subject rights (access, rectification, erasure, portability, objection)
- CCPA/CPRA rights (know, delete, opt-out, non-discrimination)
- PIPL compliance (consent, data localization, cross-border transfer restrictions)
- Cross-links between legal pages

---

## 2. Cookie Consent

| Requirement | Status |
|-------------|--------|
| Cookie consent banner component | ✅ `components/layout/cookie-consent.tsx` |
| Stores preference in `localStorage` | ✅ Key: `zerocom_cookie_consent` |
| Accept / Decline buttons | ✅ |
| No third-party cookies loaded before consent | ✅ (only essential session + language cookies) |
| Link to Privacy Policy from banner | ✅ |

**Note:** ZeroCom uses only essential cookies:
- `zerocom_session` — session authentication (httpOnly, secure, sameSite=strict)
- `zerocom_lang` — language preference

No analytics or advertising cookies are used.

---

## 3. Placeholder Replacement Checklist

**⚠️ CRITICAL: Replace ALL placeholders before deploying.**

Search the codebase for these placeholders and replace with real values:

| Placeholder | Where to Replace | Your Value |
|-------------|------------------|------------|
| `[COMPANY_NAME]` | `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/legal/privacy/page.tsx`, `app/legal/terms/page.tsx`, `components/layout/disclaimer-footer.tsx` | Your registered company name |
| `[CONTACT_EMAIL]` | All legal pages, disclaimer footer | privacy@yourdomain.com |
| `[DATA_RETENTION_DAYS]` | `app/privacy/page.tsx`, `app/legal/privacy/page.tsx` | e.g., `365` |
| `[YOUR_JURISDICTION]` | `app/terms/page.tsx`, `app/legal/terms/page.tsx` | e.g., `Beijing` |

---

## 4. GDPR Compliance (EEA/UK Users)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Lawful basis documented | ✅ | Section 3 of Privacy Policy |
| Right to access | ✅ | Via email request |
| Right to rectification | ✅ | Via email request |
| Right to erasure | ✅ | Via email request |
| Right to data portability | ✅ | Via email request |
| Right to object | ✅ | Via email request |
| Data Processing Agreement (DPA) | ⚠️ **TODO** | Required if using EU-based cloud providers |
| Data Protection Officer (DPO) | ⚠️ **TODO** | Appoint if processing EU user data at scale |
| Cross-border transfer safeguards | ✅ | Phase 1: China-only; future transfers require SCCs |
| Cookie consent | ✅ | Implemented |
| Breach notification process | ⚠️ **TODO** | Establish internal procedure (72h GDPR deadline) |

---

## 5. CCPA/CPRA Compliance (California Users)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Right to know | ✅ | Section 8 of Privacy Policy |
| Right to delete | ✅ | Via email request |
| Right to opt-out of sale | ✅ | We do not sell data |
| Non-discrimination | ✅ | Stated in Privacy Policy |
| Privacy policy updates | ✅ | 30-day notice for material changes |
| "Do Not Sell" link | ✅ N/A | No data selling; can add banner if desired |

---

## 6. PIPL Compliance (China Users)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Consent obtained | ✅ | OTP + terms acceptance |
| Data minimization | ✅ | Only necessary data collected |
| Data localization | ✅ | Phase 1: China-only storage |
| Cross-border transfer assessment | ⚠️ **TODO** | Required if expanding overseas |
| Personal information protection impact assessment | ⚠️ **TODO** | Recommended for large-scale processing |
| Designated personal information protection officer | ⚠️ **TODO** | Required under PIPL for large platforms |

---

## 7. Pre-Launch Action Items

### Must Do Before Launch
- [x] Replace `[COMPANY_NAME]` with your registered company name → ZeroCom Technology Co., Ltd.
- [x] Replace `[CONTACT_EMAIL]` with a monitored privacy inbox → privacy@zerocom.app / legal@zerocom.app
- [x] Replace `[DATA_RETENTION_DAYS]` with your retention period → 365
- [x] Replace `[YOUR_JURISDICTION]` with your legal jurisdiction → Shanghai, PRC
- [ ] Have a lawyer review all legal pages
- [ ] Register your company if not already done
- [ ] Set up the privacy email inbox and response SLA
- [ ] Establish data breach response procedure

### Should Do Before Launch
- [ ] Sign Data Processing Agreements (DPAs) with cloud provider
- [ ] Conduct a Personal Information Protection Impact Assessment (PIPL)
- [ ] Set up automated data deletion for expired retention periods
- [ ] Configure HTTPS and verify TLS configuration
- [ ] Test cookie consent banner on mobile devices

### Nice to Have Post-Launch
- [ ] Add "Do Not Sell My Info" button (CCPA)
- [ ] Implement data export/download feature (GDPR portability)
- [ ] Add cookie preference center (if non-essential cookies are added)
- [ ] Set up periodic legal page review cadence (quarterly)
- [ ] Consider cyber insurance

---

## 8. File Reference

| File | Purpose |
|------|---------|
| `app/legal/privacy.html/page.tsx` | Privacy Policy (canonical `/legal/privacy.html` route) |
| `app/legal/terms.html/page.tsx` | Terms of Service (canonical `/legal/terms.html` route) |
| `app/privacy/page.tsx` | Redirects to `/legal/privacy.html` |
| `app/terms/page.tsx` | Redirects to `/legal/terms.html` |
| `components/layout/cookie-consent.tsx` | Cookie consent banner |
| `components/layout/disclaimer-footer.tsx` | Disclaimer footer |
| `docs/LEGAL-COMPLIANCE.md` | This checklist |

---

## 9. Disclaimer

> This legal compliance kit is provided as a **template** and does not constitute legal advice.
> Laws vary by jurisdiction and change over time. Consult a qualified attorney licensed
> in your jurisdiction before deploying this platform to ensure full compliance with all
> applicable laws and regulations.
