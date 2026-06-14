# ZeroCom

Peer-to-peer real estate marketplace. Zero commission. Direct owner↔buyer contact. Freemium subscription via Alipay + WeChat Pay.

## Quick Start

```bash
docker compose up -d redis   # start Redis on :6379
npm install                  # install deps
cp .env.example .env         # copy env template (edit secrets!)
npm run dev                  # main API on :3001
npm run research             # research API on :3002
```

## Tests

```bash
npm run test:otp             # OTP send/verify flow
npm run test:auth            # end-to-end auth + JWT
npm run test:listings        # CRUD + quota + tier gating
npm run test:all             # all of the above
```

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/health | none | Liveness |
| POST | /api/auth/send-otp | none | Send OTP to PRC phone (`^1[3-9]\d{9}$`) |
| POST | /api/auth/verify-otp | none | Verify code, mint JWT |
| POST | /api/listings | Bearer + tier-2 | Create listing |
| GET | /api/listings | optional | Browse (free: 5/day, contact masked) |
| GET | /api/listings/:id | optional | Detail (quota-gated) |
| GET | /api/research/trends | none | Price trends by city/district |
| GET | /api/research/districts | none | District medians |
| GET | /api/research/comparables | none | Comparable listings |

See `docs/prd.md` for the full product spec.

## Architecture

- `src/api/` — main API server (port 3001)
- `src/api-research/` — market research server (port 3002, fully isolated)
- `scripts/` — native-fetch test scripts (no test framework)
- `docs/prd.md` — product requirement document
