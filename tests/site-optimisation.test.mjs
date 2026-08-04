import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const services = read("lib/services.ts");
const servicesCatalog = read("components/services-catalog.tsx");
const membership = read("lib/i18n.ts");
const membershipConfig = read("lib/membership.ts");
const membershipTerms = read("components/legal-document.tsx");
const rootLayout = read("app/layout.tsx");
const metadata = read("lib/metadata.ts");
const robots = read("app/robots.ts");
const officialSite = read("components/official-site.tsx");
const site = read("lib/site.ts");
const analytics = read("components/deferred-google-analytics.tsx");
const notFound = read("app/not-found.tsx");

test("unverified service durations are not presented as 90 minutes", () => {
  assert.doesNotMatch(`${services}\n${servicesCatalog}`, /Up to 90 mins/);
  assert.match(services, /const enquire = "Duration varies"/);
  assert.match(servicesCatalog, /aria-expanded=\{open\}/);
  assert.match(servicesCatalog, /aria-controls=\{panelId\}/);
  assert.match(servicesCatalog, /role="status"/);
  assert.match(servicesCatalog, /dualPrice/);
  assert.match(servicesCatalog, /window\.history\.replaceState/);
  assert.match(servicesCatalog, /searchParams\.set\("category"/);
  assert.match(servicesCatalog, /searchParams\.set\("q"/);
});

test("membership preview avoids unverified benefits and point values", () => {
  const membershipSources = `${membership}\n${membershipConfig}\n${membershipTerms}`;
  assert.doesNotMatch(membershipSources, /500 points|800 points|500 积分|800 积分|500 mata|800 mata/);
  assert.doesNotMatch(membershipSources, /No expiry pressure|Family sharing|Complimentary colour-gel refresh/);
  for (const type of [
    "Membership balance",
    "Bonus Credit",
    "Reward Credit",
    "Product Voucher",
    "Birthday Benefit",
  ]) {
    assert.match(membershipConfig, new RegExp(type));
  }
  assert.match(membership, /membershipFactItems\("en"\)/);
  assert.match(membershipTerms, /membershipTermsBullets\("en"\)/);
});

test("public SEO uses the canonical www host without fake hreflang", () => {
  assert.match(site, /https:\/\/www\.mezzanail\.com/);
  assert.match(rootLayout, /metadataBase: new URL\(siteUrl\)/);
  assert.match(metadata, /alternates: \{ canonical \}/);
  assert.doesNotMatch(`${rootLayout}\n${metadata}`, /hreflang|languages:/);
  assert.match(robots, /sitemap:/);
  assert.match(robots, /\/anniversary-jackpot\//);
  assert.match(robots, /\/redeem\//);
});

test("homepage has one content H1 and contextual WhatsApp routing", () => {
  assert.doesNotMatch(officialSite, /<h1><BrandLogo/);
  assert.match(site, /type WhatsappContext/);
  for (const context of ["general", "services", "membership", "promotion", "career"]) {
    assert.match(site, new RegExp(`${context}:`));
  }
});

test("cookie choice follows the active language and the 404 is branded", () => {
  assert.match(analytics, /consentCopy/);
  assert.match(analytics, /const \{ locale \} = useLanguage\(\)/);
  assert.match(analytics, /只有在您同意后/);
  assert.match(analytics, /Analitik pilihan/);
  assert.match(notFound, /<OfficialFrame>/);
  assert.match(notFound, /<h1/);
});
