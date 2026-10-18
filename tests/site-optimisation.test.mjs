import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const services = read("lib/services.ts");
const servicesCatalog = read("components/services-catalog.tsx");
const membershipConfig = read("lib/membership.ts");
const membershipTerms = read("components/legal-document.tsx");
const rootLayout = read("app/layout.tsx");
const metadata = read("lib/metadata.ts");
const robots = read("app/robots.ts");
const officialSite = read("components/official-site.tsx");
const globals = read("app/globals.css");
const site = read("lib/site.ts");
const analytics = read("components/deferred-google-analytics.tsx");
const notFound = read("app/not-found.tsx");
const jobPage = read("app/job/page.tsx");
const promotion = read("components/promotion/promotion-experience.tsx");
const homepagePage = read("app/page.tsx");
const homepageConfig = read("config/homepage.ts");
const signatureServices = read("components/home/SignatureServices.tsx");
const homepagePrices = read("lib/homepage-service-prices.ts");
const approvedStyles = globals.slice(globals.indexOf("/* WEBSITE PHASE 1.5 - approved full-pass refinements. */"));

const require = createRequire(import.meta.url);
const typescript = require("typescript");

function evaluateTypeScript(source, resolveImport) {
  const output = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2020,
    },
  }).outputText;
  const testModule = { exports: {} };
  runInNewContext(output, { exports: testModule.exports, require: resolveImport, module: testModule });
  return testModule.exports;
}

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
  const membershipSources = `${membershipConfig}\n${membershipTerms}`;
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
  assert.match(notFound, /<OfficialFrame publicSite>/);
  assert.match(notFound, /<h1/);
  assert.match(notFound, /Return home/);
});

test("homepage starting prices are computed from matching service categories", () => {
  const serviceModule = evaluateTypeScript(services, (specifier) => {
    throw new Error(`unexpected service module import: ${specifier}`);
  });
  const priceModule = evaluateTypeScript(homepagePrices, (specifier) => {
    assert.equal(specifier, "./services");
    return serviceModule;
  });
  const categoryIds = ["manicure", "pedicure", "extensions", "callus", "waxing"];
  const computed = priceModule.getHomepageStartingPrices(categoryIds);

  for (const categoryId of categoryIds) {
    const matches = serviceModule.serviceCategories.filter((category) => category.id === categoryId);
    assert.equal(matches.length, 1, `${categoryId} must match one service category`);
    const amounts = matches[0].services.flatMap(({ price }) =>
      [...price.matchAll(/\bRM\s*(\d+(?:\.\d{1,2})?)\b/gi)].map((match) => Number(match[1])),
    );
    assert.ok(amounts.length > 0, `${categoryId} needs a numeric source price`);
    assert.equal(computed[categoryId], Math.min(...amounts));
  }

  assert.match(homepagePage, /getHomepageStartingPrices\(/);
  assert.match(signatureServices, /startingPrices\[item\.serviceCategoryId\]/);
  assert.match(signatureServices, /`From RM\$\{amount\}`/);
  assert.match(signatureServices, /`RM\$\{amount\} 起`/);
  assert.match(signatureServices, /`Dari RM\$\{amount\}`/);
  assert.doesNotMatch(homepageConfig, /RM\s?\d|price:/i);
});

test("job uses the public palette without changing application behavior", () => {
  assert.match(jobPage, /<OfficialFrame publicSite>/);
  assert.match(jobPage, /className="job-page"/);
  const jobPaletteStart = globals.indexOf(".public-site .job-page");
  const promotionHeaderStart = globals.indexOf(
    ".promotion-site:not(.promotion-terms-page) .promotion-header",
    jobPaletteStart,
  );
  const jobPalette = globals.slice(jobPaletteStart, promotionHeaderStart);
  assert.ok(jobPaletteStart >= 0 && promotionHeaderStart > jobPaletteStart);
  assert.match(jobPalette, /--bg:\s*var\(--color-cream\)/);
  assert.match(jobPalette, /--surface:\s*var\(--color-white\)/);
  assert.match(jobPalette, /--surface-2:\s*var\(--color-pink\)/);
  assert.match(jobPalette, /--wine:\s*var\(--color-ink\)/);
  assert.match(jobPalette, /\.job-hero\s*\{[\s\S]*var\(--color-ink\)/);
  assert.match(jobPalette, /\.job-contact-strip\s*\{\s*background:\s*var\(--color-ink\)/);
  assert.match(jobPalette, /\.job-hero \.btn-gold\s*\{[\s\S]*background:\s*var\(--color-white\)[\s\S]*color:\s*var\(--color-ink\)/);
  assert.match(jobPalette, /\.job-page small\s*\{\s*font-size:\s*11px/);
  assert.doesNotMatch(jobPalette, /#130b0e|#8a2537|#a4263d|#9a2b3e|rgba\(145,33,54/);
});

test("promotion header uses the main-site palette while preserving its controls", () => {
  assert.match(promotion, /className="promotion-header"/);
  assert.match(promotion, /className="promotion-header-languages"/);
  assert.match(promotion, /className="promotion-header-book"/);
  assert.match(approvedStyles, /\.promotion-site:not\(\.promotion-terms-page\) \.promotion-header\s*\{[^}]*background:\s*var\(--color-cream\)/);
  assert.match(approvedStyles, /\.promotion-site:not\(\.promotion-terms-page\) \.promotion-brand\s*\{[^}]*background:\s*transparent;[\s\S]*box-shadow:\s*none/);
  assert.match(approvedStyles, /\.promotion-site:not\(\.promotion-terms-page\) \.promotion-brand\s*\{[^}]*min-height:\s*44px/);
  assert.match(approvedStyles, /\.promotion-site:not\(\.promotion-terms-page\) \.promotion-brand img\s*\{[^}]*filter:\s*brightness\(0\.2\)/);
  assert.match(approvedStyles, /\.promotion-site:not\(\.promotion-terms-page\) \.promotion-header-inner\s*\{\s*min-height:\s*84px/);
  assert.match(approvedStyles, /\.promotion-site:not\(\.promotion-terms-page\) \.promotion-header-languages button,[\s\S]*?min-width:\s*44px/);
  assert.match(approvedStyles, /\.promotion-site:not\(\.promotion-terms-page\) \.promotion-header-book\s*\{[^}]*background:\s*var\(--color-ink\)[\s\S]*color:\s*var\(--color-white\)/);
});
