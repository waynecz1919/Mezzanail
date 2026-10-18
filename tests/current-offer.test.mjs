import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { pathToFileURL } from "node:url";

const read = (filePath) => readFileSync(filePath, "utf8");
const offerPath = "config/current-offer.ts";
const offerSource = read(offerPath);
const hero = read("components/home/HomeHero.tsx");
const homepageConfig = read("config/homepage.ts");
const promotion = read("components/promotion/promotion-experience.tsx");
const globals = read("app/globals.css");

async function loadOffer() {
  try {
    // Node 22.18+ runs erasable TypeScript natively.
    return await import(pathToFileURL(offerPath).href);
  } catch {
    const { default: ts } = await import("typescript");
    const { outputText } = ts.transpileModule(offerSource, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  }
}

test("the Deepavali offer runs 15 Oct 00:00 to 8 Nov 23:59 Malaysia time", async () => {
  const { isOfferActive, currentOffer } = await loadOffer();
  assert.equal(currentOffer.id, "deepavali-gel-glow-2026");
  assert.equal(isOfferActive(new Date("2026-10-14T23:59:59+08:00")), false);
  assert.equal(isOfferActive(new Date("2026-10-15T00:00:00+08:00")), true);
  assert.equal(isOfferActive(new Date("2026-10-18T12:00:00+08:00")), true);
  assert.equal(isOfferActive(new Date("2026-11-08T23:59:59+08:00")), true);
  assert.equal(isOfferActive(new Date("2026-11-08T23:59:59.999+08:00")), true);
  assert.equal(isOfferActive(new Date("2026-11-09T00:00:00+08:00")), false);
  // 8 Nov 16:30 UTC is already 9 Nov 00:30 in Melaka.
  assert.equal(isOfferActive(new Date("2026-11-08T16:30:00Z")), false);
});

test("the offer price and terms match the approved poster in every language", async () => {
  const { currentOffer, getOfferWhatsappUrl } = await loadOffer();
  assert.equal(currentOffer.originalPrice, 95);
  assert.equal(currentOffer.offerPrice, 68);
  assert.equal(currentOffer.saving, currentOffer.originalPrice - currentOffer.offerPrice);
  for (const locale of ["en", "zh", "ms"]) {
    const copy = currentOffer.copy[locale];
    for (const field of ["title", "service", "includes", "validity", "terms", "action", "posterAlt"]) {
      assert.ok(copy[field].trim().length > 0, `${locale}.${field} must be filled`);
    }
    const url = getOfferWhatsappUrl(locale);
    assert.match(url, /^https:\/\/wa\.me\/60162121332\?text=/);
    assert.match(decodeURIComponent(url), /RM68/);
  }
  assert.match(currentOffer.copy.en.terms, /Nail art and gel removal are charged separately/);
});

test("the homepage hero shows real client work without cropping any nail", () => {
  assert.match(homepageConfig, /src: "\/home\/hero-tortoiseshell\.webp"/);
  assert.match(homepageConfig, /width: 848/);
  assert.match(homepageConfig, /height: 890/);
  assert.match(homepageConfig, /Tortoiseshell almond nails with pearl line art by Mezzanail/);
  assert.match(hero, /alt=\{heroImage\.alt\[locale\]\}/);
  assert.doesNotMatch(hero, /\bfill\b/);
  assert.match(globals, /aspect-ratio: 848 \/ 890/);
  assert.match(globals, /\.home-hero-image \{[^}]*object-fit: contain/);
  assert.doesNotMatch(globals, /\.home-hero-image \{[^}]*object-fit: cover/);
});

test("the hero offer and promotion section hide themselves after the offer ends", () => {
  assert.match(hero, /const offerActive = useOfferActive\(\)/);
  assert.match(hero, /\{offerActive \? \(\s*<div className="home-hero-offer"/);
  assert.ok(
    hero.indexOf('className="home-hero-offer"') < hero.indexOf("home-hero-media"),
    "the RM68 offer must sit in the hero copy, before the photo",
  );
  assert.match(hero, /RM\{currentOffer\.offerPrice\}/);
  assert.match(hero, /<h1 id="home-hero-title">Premium Nail Care in Melaka<\/h1>/);
  assert.match(promotion, /\{offerActive && \(/);
  assert.match(promotion, /id="current-offer"/);
  assert.ok(
    promotion.indexOf('id="current-offer"') < promotion.indexOf("promotion-expired-notice"),
    "the current offer must sit above the ended lucky-draw notice",
  );
  assert.doesNotMatch(homepageConfig, /RM\s?\d|price:/i);
});
