import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const migration = read("db/migrations/001_create_redeem_codes.sql");
const codeRoute = read("app/api/redeem/codes/[code]/route.ts");
const auth = read("lib/redeem/auth.ts");
const core = read("lib/redeem/core.ts");
const proxy = read("proxy.ts");
const page = read("components/redeem/redeem-center.tsx");

test("redeem migration enforces unique codes, allowed statuses and redemption audit", () => {
  assert.match(migration, /redeem_code VARCHAR\(32\) NOT NULL UNIQUE/);
  for (const status of ["pending", "sent", "redeemed", "expired", "cancelled"]) {
    assert.match(migration, new RegExp(`'${status}'`));
  }
  assert.match(migration, /redeemed_at IS NOT NULL/);
  assert.match(migration, /NULLIF\(BTRIM\(redeemed_by\), ''\) IS NOT NULL/);
});

test("redemption is a guarded atomic update and records the authenticated staff member", () => {
  assert.match(codeRoute, /SET status = 'redeemed'/);
  assert.match(codeRoute, /redeemed_by = \$2/);
  assert.match(codeRoute, /status IN \('pending', 'sent'\)/);
  assert.match(codeRoute, /expiry_date >= CURRENT_DATE/);
  assert.match(codeRoute, /\[code, staff\.staffId\]/);
});

test("staff sessions are signed, expiring and stored in a secure HttpOnly cookie", () => {
  assert.match(auth, /createHmac\("sha256"/);
  assert.match(auth, /SESSION_SECONDS = 8 \* 60 \* 60/);
  assert.match(auth, /httpOnly: true/);
  assert.match(auth, /sameSite: "strict"/);
  assert.match(auth, /timingSafeEqual/);
});

test("redeem codes and WhatsApp copy follow the approved format", () => {
  assert.match(core, /\^MN-\[A-Z0-9\]\{2,8\}-\[A-Z0-9\]\{4\}\$/);
  assert.match(core, /this is your exclusive Mezzanail Redeem Voucher/);
  assert.match(core, /Please show this code to our staff when you visit Mezzanail/);
  assert.match(core, /\*Term & Conditions Apply/);
  assert.match(core, /"\",\s+"Thank you\."/);
  assert.match(page, /Send via WhatsApp/);
  assert.match(page, /Buy 1 Classic Pedicure, Free 1 Basic Manicure Voucher\(B1F1\)/);
  assert.match(page, /nextType === "B1F1" \? B1F1_DESCRIPTION : ""/);
  assert.match(page, /useState\("B1F1"\)/);
});

test("redeem subdomain routes into the existing app and is not indexed", () => {
  assert.match(proxy, /redeem\.mezzanail\.com/);
  assert.match(proxy, /destination\.pathname = "\/redeem"/);
  assert.match(proxy, /X-Robots-Tag", "noindex, nofollow, noarchive"/);
  assert.match(proxy, /rewritePrivateRoute\(destination\)/);
  assert.match(read("app/redeem/layout.tsx"), /index: false/);
  assert.match(read("next.config.ts"), /noindex, nofollow, noarchive/);
});
