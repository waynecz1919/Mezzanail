import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const config = read("lib/promotion/campaign-config.ts");
const share = read("lib/promotion/share-message.ts");
const referral = read("lib/promotion/referral.ts");
const page = read("app/promotion/page.tsx");
const experience = read("components/promotion/promotion-experience.tsx");

test("campaign uses the approved promotion and booking URLs", () => {
  assert.match(config, /https:\/\/promotion\.mezzanail\.com/);
  assert.match(
    config,
    /https:\/\/booking\.tunai\.io\/booking\/mezzanail\?outletID=4188#contact/,
  );
});

test("all three WhatsApp languages and URL encoding are implemented", () => {
  assert.match(share, /en:/);
  assert.match(share, /zh:/);
  assert.match(share, /ms:/);
  assert.match(share, /encodeURIComponent/);
  assert.match(share, /https:\/\/wa\.me\/\?text=/);
});

test("referral and source validation are allow-listed", () => {
  const referralPattern = /^[A-Za-z0-9_-]{1,30}$/;
  assert.equal(referralPattern.test("M0001"), true);
  assert.equal(referralPattern.test("bad code!"), false);
  assert.equal(referralPattern.test("a".repeat(31)), false);
  for (const source of ["nfc", "qr", "whatsapp", "website", "direct"]) {
    assert.match(referral, new RegExp(`"${source}"`));
  }
});

test("metadata, canonical, OG image and Event JSON-LD are present", () => {
  assert.match(page, /alternates: \{ canonical:/);
  assert.match(page, /openGraph:/);
  assert.match(page, /1200/);
  assert.match(page, /630/);
  assert.match(page, /application\/ld\+json/);
  assert.match(page, /EventScheduled/);
});

test("tracking failure cannot block the WhatsApp action", () => {
  const fetchIndex = experience.indexOf('void fetch("/api/promotion/share"');
  const openIndex = experience.indexOf("window.open(whatsappShareUrl");
  assert.ok(fetchIndex >= 0);
  assert.ok(openIndex > fetchIndex);
  assert.match(experience, /\.catch\(/);
});
