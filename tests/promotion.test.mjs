import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const config = read("lib/promotion/campaign-config.ts");
const share = read("lib/promotion/share-message.ts");
const referral = read("lib/promotion/referral.ts");
const campaignCopy = read("lib/promotion/campaign-copy.ts");
const page = read("app/promotion/page.tsx");
const termsPage = read("app/promotion/terms/page.tsx");
const experience = read("components/promotion/promotion-experience.tsx");
const officialSite = read("components/official-site.tsx");
const site = read("lib/site.ts");

test("campaign uses the official promotion and booking URLs", () => {
  assert.match(config, /https:\/\/www\.mezzanail\.com\/promotion/);
  assert.match(config, /mezzanail-7th-anniversary-qr-v2/);
  assert.match(
    config,
    /https:\/\/booking\.tunai\.io\/booking\/mezzanail\?outletID=4188#contact/,
  );
});

test("campaign dates, prizes and entry steps match the approved brief", () => {
  assert.match(config, /26 July .* 30 September 2026/);
  assert.match(site, /26th July .* 30th September 2026/);
  for (const prize of [
    "Dyson Supersonic",
    "HUAWEI Watch Fit 5",
    "Xiaomi Robot Vacuum",
    "Beauty Vouchers & Weekly Rewards",
  ]) {
    assert.match(config, new RegExp(prize.replace(/[&]/g, "\\&")));
    assert.match(campaignCopy, new RegExp(prize.replace(/[&]/g, "\\&")));
  }
  for (const step of [
    "Join Our Membership",
    "Scan & Share With 3 Friends",
    "Join the 7th Anniversary Lucky Draw",
  ]) {
    assert.match(config, new RegExp(step.replace(/[&]/g, "\\&")));
    assert.match(campaignCopy, new RegExp(step.replace(/[&]/g, "\\&")));
  }
});

test("the WhatsApp message includes English and Chinese in one share", () => {
  assert.match(share, /MEZZANAIL 7th Anniversary Celebration/);
  assert.match(share, /MEZZANAIL 七周年庆典/);
  assert.match(share, /scan and share with 3 friends/);
  assert.match(share, /扫码分享给3位朋友/);
  assert.match(share, /https:\/\/www\.mezzanail\.com\/promotion/);
  assert.match(share, /encodeURIComponent/);
  assert.match(share, /https:\/\/wa\.me\/\?text=/);
});

test("the full campaign supports English, Chinese and Bahasa Melayu", () => {
  assert.match(campaignCopy, /Join Our Membership/);
  assert.match(campaignCopy, /加入会员/);
  assert.match(campaignCopy, /Sertai Keahlian Kami/);
  assert.match(campaignCopy, /扫码并分享给3位朋友/);
  assert.match(campaignCopy, /Imbas & Kongsi Dengan 3 Rakan/);
  assert.match(experience, /promotionLanguageShortLabels/);
  assert.match(experience, /promotionCampaignDetails/);
});

test("the official homepage routes every anniversary entry to promotion", () => {
  assert.match(officialSite, /<AnniversaryHomeIntro\/>/);
  assert.match(officialSite, /\["\/promotion",t\.nav\.promo\]/);
  assert.match(
    officialSite,
    /mezzanail-7th-anniversary-banner-v2\.png/,
  );
  assert.doesNotMatch(officialSite, /href="\/#anniversary"/);
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
  assert.match(termsPage, /promotionUrl\}\/terms/);
});

test("tracking failure cannot block the WhatsApp action", () => {
  const fetchIndex = experience.indexOf('void fetch("/api/promotion/share"');
  const openIndex = experience.indexOf("window.open(whatsappShareUrl");
  assert.ok(fetchIndex >= 0);
  assert.ok(openIndex > fetchIndex);
  assert.match(experience, /\.catch\(/);
});
