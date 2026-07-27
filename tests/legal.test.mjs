import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const legal = read("components/legal-document.tsx");
const officialSite = read("components/official-site.tsx");
const layout = read("app/layout.tsx");
const analytics = read("components/deferred-google-analytics.tsx");
const job = read("components/job/job-application-experience.tsx");
const promotion = read("lib/promotion/campaign-copy.ts");

test("public legal pages contain bilingual notices and no draft placeholder", () => {
  assert.match(legal, /Personal Data Protection Act 2010/);
  assert.match(legal, /Akta Perlindungan Data Peribadi 2010/);
  assert.match(legal, /Privacy Request/);
  assert.match(legal, /Permintaan Privasi/);
  assert.match(legal, /up to 14 months/);
  assert.match(legal, /sehingga 14 bulan/);
  assert.doesNotMatch(`${legal}\n${officialSite}`, /Draft placeholder|Business review required/);
});

test("all requested legal routes are linked from the public site", () => {
  for (const route of [
    "/privacy",
    "/terms",
    "/cookies",
    "/privacy/job-applicants",
    "/membership/terms",
    "/promotion/terms",
  ]) {
    assert.match(officialSite, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.match(job, /href="\/privacy\/job-applicants"/);
});

test("Google Analytics loads only after a stored consent choice", () => {
  assert.doesNotMatch(layout, /analyticsBootstrap|window\.gtag\("config"/);
  assert.match(analytics, /mezzanail-analytics-consent-v1/);
  assert.match(analytics, /current\?\.choice === "granted"/);
  assert.match(analytics, /Accept analytics/);
  assert.match(analytics, /Reject non-essential/);
  assert.match(analytics, /allow_google_signals: false/);
  assert.match(analytics, /allow_ad_personalization_signals: false/);
});

test("promotion terms state the current prizes and formal draw controls", () => {
  for (const prize of [
    "Dyson Supersonic",
    "HUAWEI Watch Fit 5",
    "Xiaomi Robot Vacuum",
    "beauty vouchers and weekly rewards",
  ]) {
    assert.match(promotion, new RegExp(prize));
  }
  assert.match(promotion, /random draw from verified eligible entries/);
  assert.match(promotion, /Personal data is used to verify entries/);
  assert.doesNotMatch(promotion, /Campaign prizes include one Apple Watch SE 3/);
});
