import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { pathToFileURL } from "node:url";

const read = (path) => readFileSync(path, "utf8");
const config = read("lib/promotion/campaign-config.ts");
const share = read("lib/promotion/share-message.ts");
const referral = read("lib/promotion/referral.ts");
const campaignCopy = read("lib/promotion/campaign-copy.ts");
const page = read("app/promotion/page.tsx");
const termsPage = read("app/promotion/terms/page.tsx");
const experience = read("components/promotion/promotion-experience.tsx");
const officialSite = read("components/official-site.tsx");
const currentCampaignBanner = read("components/home/CurrentCampaignBanner.tsx");
const campaignBanner = read("components/marketing/CampaignBanner.tsx");
const currentCampaign = read("config/current-campaign.ts");
const navigation = read("config/navigation.ts");
const site = read("lib/site.ts");
const servicesCatalog = read("components/services-catalog.tsx");
const servicesData = read("lib/services.ts");
const globals = read("app/globals.css");

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
  assert.doesNotMatch(site, /26th July .* 30th September 2026/);
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
  // The anniversary campaign has ended: the homepage leads with the hero, which
  // carries the current seasonal offer, instead of the anniversary banner.
  assert.doesNotMatch(officialSite, /<CurrentCampaignBanner/);
  assert.match(officialSite, /<HomeHero\/>/);
  assert.match(currentCampaignBanner, /<CampaignBanner/);
  assert.match(currentCampaignBanner, /currentCampaign\.enabled/);
  assert.match(navigation, /href: "\/promotion", labelKey: "promo"/);
  assert.match(currentCampaign, /enabled: false/);
  assert.match(currentCampaign, /href: "\/promotion"/);
  assert.match(currentCampaign, /banner-desktop\.webp/);
  assert.doesNotMatch(officialSite, /href="\/#anniversary"/);
  assert.doesNotMatch(officialSite, /function Hero\(/);
  assert.doesNotMatch(officialSite, /AnniversaryHomeIntro/);
});

test("the campaign banner uses responsive art direction and accessible HTML content", () => {
  assert.match(campaignBanner, /<picture/);
  assert.match(campaignBanner, /mobileSrc \?/);
  assert.match(campaignBanner, /sizes="100vw"/);
  assert.match(campaignBanner, /width=\{width\}/);
  assert.match(campaignBanner, /height=\{height\}/);
  assert.match(campaignBanner, /fetchPriority=\{priority \? "high" : undefined\}/);
  assert.match(campaignBanner, /<h1 id="home-hero-title">\{heading\}<\/h1>/);
  assert.match(campaignBanner, /\{campaignTitle\}/);
  assert.match(campaignBanner, /\{dates\}/);
  assert.match(campaignBanner, /\{invitation\}/);
  assert.match(campaignBanner, /\{promotionLabel\}/);
  assert.match(campaignBanner, /\{bookingLabel\}/);
  assert.match(currentCampaign, /banner-mobile\.webp/);
});

test("the full campaign banner click is tracked without customer data", () => {
  assert.match(campaignBanner, /campaign_banner_click/);
  assert.match(campaignBanner, /campaign_id: campaignId/);
  assert.match(campaignBanner, /campaign_name: campaignName/);
  assert.match(campaignBanner, /destination,/);
  assert.doesNotMatch(campaignBanner, /phone|email|customer/i);
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

test("promotion metadata and canonical remain while Event JSON-LD is absent", () => {
  assert.match(page, /alternates: \{ canonical:/);
  assert.match(page, /openGraph:/);
  assert.match(page, /1200/);
  assert.match(page, /630/);
  assert.doesNotMatch(page, /"@type"\s*:\s*"Event"/);
  assert.doesNotMatch(page, /EventScheduled/);
  assert.match(termsPage, /promotionUrl\}\/terms/);
});

test("the expired homepage campaign config is disabled", async () => {
  const { currentCampaign: campaign } = await import(
    pathToFileURL("config/current-campaign.ts").href
  );
  assert.equal(campaign.enabled, false);
});

test("tracking failure cannot block the WhatsApp action", () => {
  const fetchIndex = experience.indexOf('void fetch("/api/promotion/share"');
  const openIndex = experience.indexOf("window.open(whatsappShareUrl");
  assert.ok(fetchIndex >= 0);
  assert.ok(openIndex > fetchIndex);
  assert.match(experience, /\.catch\(/);
});

test("promotion metadata uses the active offer and its uncropped social image", () => {
  assert.match(page, /const promotionTitle = `\$\{currentOffer\.copy\.en\.title\}/);
  assert.match(page, /const promotionOgDescription = `\$\{currentOffer\.copy\.en\.title\}/);
  assert.match(page, /const promotionDescription = `\$\{promotionOgDescription\} Also Gelish Pedicure RM98 and Gelish Manicure \+ Pedicure RM138\.`/);
  assert.match(page, /const promotionOgImage = "https:\/\/www\.mezzanail\.com\/campaigns\/deepavali-2026\/og-1200x630\.jpg"/);
  assert.match(page, /title: promotionTitle/);
  assert.match(page, /description: promotionDescription/);
  assert.match(page, /openGraph:\s*\{[\s\S]*?description: promotionOgDescription/);
  assert.match(page, /twitter:\s*\{[\s\S]*?description: promotionOgDescription/);
  assert.match(page, /url: promotionOgImage/);
  assert.match(page, /alt: currentOffer\.copy\.en\.posterAlt/);
  assert.match(page, /canonical: anniversaryCampaign\.promotionUrl/);
});

test("the active offer section lists all three localized prices and separate WhatsApp links", () => {
  assert.match(experience, /const offerRows = \[/);
  assert.match(experience, /currentOffer\.extras\.map\(\(extra\) =>/);
  assert.match(experience, /offerRows\.map\(\(offer\) =>/);
  assert.match(experience, /className=\{`promotion-current-offer-option/);
  assert.match(experience, /<h2>\{offer\.copy\.service\}<\/h2>/);
  assert.match(experience, /<p>\{offer\.copy\.includes\}<\/p>/);
  assert.match(experience, /<s>RM\{offer\.originalPrice\}<\/s>/);
  assert.match(experience, /<strong>RM\{offer\.offerPrice\}<\/strong>/);
  assert.match(experience, /<span>\{offer\.copy\.save\}<\/span>/);
  assert.match(experience, /href=\{getOfferWhatsappUrl\(language, offer\.id\)\}/);
  assert.equal((experience.match(/currentOffer\.copy\[language\]\.validity/g) ?? []).length, 1);
  assert.equal((experience.match(/currentOffer\.copy\[language\]\.terms/g) ?? []).length, 1);
  assert.match(experience, /src=\{currentOffer\.poster\[language\]\}/);
  assert.match(globals, /\.promotion-current-offer-option-price strong\s*\{[^}]*color:\s*var\(--color-ink\)/);
  assert.match(globals, /\.promotion-current-offer-option--primary \.promotion-current-offer-option-price strong\s*\{\s*color:\s*#7E1A2A/);
});

test("ended anniversary sections are conditional and the offer is the only promotion h1", () => {
  assert.equal((experience.match(/<h1\b/g) ?? []).length, 1);
  assert.match(experience, /\{campaignEnded && \(\s*<section className="promotion-past-campaign"/);
  for (const section of ["promotion-hero", "promotion-intro", "promotion-prizes", "promotion-final-cta"]) {
    assert.match(experience, new RegExp(`\\{!campaignEnded && \\(\\s*<section className="promotion-section ${section}|\\{!campaignEnded && \\(\\s*<section className="${section}"`));
  }
  assert.match(experience, /href=\{getOfferWhatsappUrl\(language, offer\.id\)\}/);
  assert.match(experience, /Book RM\$\{currentOffer\.offerPrice\} on WhatsApp/);
  assert.match(servicesCatalog, /offerActive && service\.name === "Gelish Manicure"/);
  assert.doesNotMatch(servicesData, /Deepavali RM68|offerBadge/);
});
