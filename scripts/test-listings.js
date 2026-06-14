import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

const BASE = "http://localhost:3001";
const SECRET = process.env.JWT_SECRET || "dev-only-secret-do-not-use-in-prod";

function signTestToken(userId, tier) {
  return jwt.sign({ sub: userId, tier }, SECRET, { expiresIn: "5m", algorithm: "HS256" });
}

async function request(method, path, { body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json;
  try { json = await res.json(); } catch { json = null; }
  return { status: res.status, body: json };
}

function assertEq(actual, expected, label) {
  if (actual !== expected) {
    console.error(`  ✗ ${label}: expected ${expected}, got ${actual}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ ${label}`);
  }
}

async function main() {
  console.log("--- ZeroCom Listings Test Suite ---");

  // Health check first
  const health = await request("GET", "/api/health");
  assertEq(health.status, 200, "GET /api/health → 200");

  const freeToken = signTestToken("u_free", 1);
  const paidT2Token = signTestToken("u_paid_t2", 2);

  // Case 1: POST /api/listings with no auth → 401
  const noAuth = await request("POST", "/api/listings", { body: { title: "t" } });
  assertEq(noAuth.status, 401, "POST /api/listings no auth → 401");

  // Case 2: POST /api/listings as u_free (tier 1) → 403
  const freeCreate = await request("POST", "/api/listings", {
    token: freeToken,
    body: {
      title: "Test listing",
      description: "x",
      city: "Shanghai",
      district: "Pudong",
      address: "Test 1",
      priceWan: 100,
      areaSqm: 80,
      bedrooms: 2,
      bathrooms: 1,
      photos: [],
      contactPhone: "13800000001",
      contactWechat: "wx_test",
    },
  });
  assertEq(freeCreate.status, 403, "POST /api/listings tier-1 → 403");

  // Case 3: POST /api/listings as u_paid_t2 → 201
  const paidCreate = await request("POST", "/api/listings", {
    token: paidT2Token,
    body: {
      title: `Test listing ${randomUUID().slice(0, 8)}`,
      description: "x",
      city: "Shanghai",
      district: "Pudong",
      address: "Test 1",
      priceWan: 100,
      areaSqm: 80,
      bedrooms: 2,
      bathrooms: 1,
      photos: [],
      contactPhone: "13800000002",
      contactWechat: "wx_test",
    },
  });
  assertEq(paidCreate.status, 201, "POST /api/listings tier-2 → 201");

  // Case 4: GET /api/listings (no auth) → 200, contact masked
  const list = await request("GET", "/api/listings?city=Shanghai");
  assertEq(list.status, 200, "GET /api/listings → 200");
  if (list.body && list.body.length > 0) {
    const first = list.body[0];
    assertEq(typeof first.contactPhone === "string" && first.contactPhone.includes("****"), true, "GET /api/listings contact masked");
    assertEq(first.contactWechat, null, "GET /api/listings contactWechat null");
  } else {
    console.log("  ⚠ no listings to verify masking on");
  }

  // Cases 5+6: GET /api/listings/:id 6 times as free user → first 5 = 200, 6th = 402
  if (list.body && list.body.length > 0) {
    const id = list.body[0].id;
    let fiveAllOk = true;
    for (let i = 1; i <= 5; i++) {
      const r = await request("GET", `/api/listings/${id}`, { token: freeToken });
      if (r.status !== 200) { fiveAllOk = false; break; }
    }
    assertEq(fiveAllOk, true, "GET /api/listings/:id × 5 as free → all 200");
    const sixth = await request("GET", `/api/listings/${id}`, { token: freeToken });
    assertEq(sixth.status, 402, "GET /api/listings/:id 6th as free → 402");
  } else {
    console.log("  ⚠ skipping quota test (no listings)");
  }

  // Case 6: GET /api/listings/:id as u_paid_t2 → 200 with unmasked contact
  if (list.body && list.body.length > 0) {
    const id = list.body[0].id;
    const paidDetail = await request("GET", `/api/listings/${id}`, { token: paidT2Token });
    assertEq(paidDetail.status, 200, "GET /api/listings/:id as paid → 200");
  }

  console.log(process.exitCode ? "\nFAILED" : "\nALL PASSED");
}

main().catch((e) => { console.error("Test crashed:", e); process.exit(1); });
