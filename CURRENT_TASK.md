# Current Task — ZeroCom

## Status: Mid-build-loop (Pomo 2 complete). Green-field ready for next feature.

## Pomodoro Log
| Pomo | Task | Status | Commit |
|------|------|--------|--------|
| 0-1 | Bootstrap: fix DB permissions, migrate, seed, smoke-test app + build accumulated prior-session work (server layer, landing redesign, infra) | DONE | `00db264` |
| 1 | Prisma migration already applied (0001_init, Jun 28); DB fully functional | DONE | `00db264` |
| 2 | Fix auth 500→401: wrap 31 auth-throwing API handlers with `withErrorHandling()` | DONE | `3fe9494` |
| 3 | Anti-broker behavioral detection: 5 PRD §4.3.1 rules (high-freq/geo-skip/always-view/multi-phone/hijack) + pure predicates + real-time hook + 10 tests | DONE | `5666de8` |

## Verified Working
- Tests: 19/19 green (`npx vitest run`)
- App serves real data: `/`, `/listings`, `/api/listings`, `/api/session`, `/seller/new`, `/pricing` → 200
- Auth redirects correct: `/seller`, `/dashboard` → 307
- API auth errors now JSON 401 not 500

## Blockers
- None

## Next Task (Pomo 3) — NOT YET STARTED
**Anti-broker engine (PRD §4.3 "single most critical feature").**
The existing `server/broker-risk.ts` is shallow relative to the PRD (which requires behavioral detection, identity clustering, shadow/hard bans, honeypot listings, CAPTCHA, post-match surveys, and a moderation dashboard with 24h SLA).

Steps:
1. Read `server/broker-risk.ts` + `server/data/store.ts` to find what signals are already tracked.
2. Read `TRD.md` for the anti-broker spec (decision on ban levels, detection windows).
3. Implement detection flags as a scheduled scan reading activity → write to `enforcement_actions`.
4. Implement enforcement middleware (soft warning / shadow ban / hard ban / listing purge).
5. Add honeypot listings + CAPTCHA-on-burst.
6. Tests for each detection rule.

## Decisions Needed
- **Hermes reporting**: loop says report every 3 pomodoros to `http://localhost:8765/hermes/report`, but nothing was last confirmed listening on 8765. Confirm endpoint or skip before first report (due Pomo 3).
