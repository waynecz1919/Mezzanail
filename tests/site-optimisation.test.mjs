import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const services = read("lib/services.ts");
const servicesCatalog = read("components/services-catalog.tsx");
const membership = read("lib/i18n.ts");
const rootLayout = read("app/layout.tsx");
const metadata = read("lib/metadata.ts");
const robots = read("app/robots.ts");
const officialSite = read("components/official-site.tsx");
const site = read("lib/site.ts");

test("unverified service durations are not presented as 90 minutes", () => {
  assert.doesNotMatch(`${services}\n${servicesCatalog}`, /Up to 90 mins/);
  assert.match(services, /const enquire = "Duration varies"/);
  assert.match(servicesCatalog, /aria-expanded=\{open\}/);
  assert.match(servicesCatalog, /aria-controls=\{panelId\}/);
  assert.match(servicesCatalog, /role="status"/);
  assert.match(servicesCatalog, /dualPrice/);
});

test("membership preview avoids unverified benefits and point values", () => {
  assert.doesNotMatch(membership, /500 points|800 points|500 积分|800 积分|500 mata|800 mata/);
  assert.doesNotMatch(membership, /No expiry pressure|Family sharing|Complimentary colour-gel refresh/);
  for (const type of [
    "Membership balance",
    "Bonus Credit",
    "Reward Credit",
    "Product Voucher",
    "Birthday Benefit",
  ]) {
    assert.match(membership, new RegExp(type));
  }
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
