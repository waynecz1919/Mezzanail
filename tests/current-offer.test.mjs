import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { pathToFileURL } from "node:url";

const read = (filePath) => readFileSync(filePath, "utf8");
const offerPath = "config/current-offer.ts";
const offerSource = read(offerPath);
const servicesSource = read("lib/services.ts");
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

async function loadHomepage() {
  const homepagePath = "config/homepage.ts";
  try {
    return await import(pathToFileURL(homepagePath).href);
  } catch {
    const { default: ts } = await import("typescript");
    const { outputText } = ts.transpileModule(read(homepagePath), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  }
}

test("the Deepavali offer runs 15 Oct 00:00 to 8 Nov 23:59 Malaysia time", async () => {
  const { isOfferActive, currentOffer, getOfferEndDateLabel } = await loadOffer();
  assert.equal(currentOffer.id, "deepavali-gel-glow-2026");
  assert.equal(isOfferActive(new Date("2026-10-14T23:59:59+08:00")), false);
  assert.equal(isOfferActive(new Date("2026-10-15T00:00:00+08:00")), true);
  assert.equal(isOfferActive(new Date("2026-10-18T12:00:00+08:00")), true);
  assert.equal(isOfferActive(new Date("2026-11-08T23:59:59+08:00")), true);
  assert.equal(isOfferActive(new Date("2026-11-08T23:59:59.999+08:00")), true);
  assert.equal(isOfferActive(new Date("2026-11-09T00:00:00+08:00")), false);
  // 8 Nov 16:30 UTC is already 9 Nov 00:30 in Melaka.
  assert.equal(isOfferActive(new Date("2026-11-08T16:30:00Z")), false);
  assert.equal(getOfferEndDateLabel("en"), "8 Nov");
  assert.equal(getOfferEndDateLabel("zh"), "11月8日");
  assert.equal(getOfferEndDateLabel("ms"), "8 Nov");
});

test("the offer price and terms match the approved poster in every language", async () => {
  const { currentOffer, getOfferWhatsappUrl } = await loadOffer();
  assert.equal(currentOffer.originalPrice, 95);
  assert.equal(currentOffer.offerPrice, 68);
  assert.equal(currentOffer.saving, currentOffer.originalPrice - currentOffer.offerPrice);
  for (const locale of ["en", "zh", "ms"]) {
    const copy = currentOffer.copy[locale];
    for (const field of ["title", "service", "includes", "validity", "terms", "action", "otherOffersLine", "posterAlt"]) {
      assert.ok(copy[field].trim().length > 0, `${locale}.${field} must be filled`);
    }
    const url = getOfferWhatsappUrl(locale);
    assert.match(url, /^https:\/\/wa\.me\/60162121332\?text=/);
    assert.match(decodeURIComponent(url), /RM68/);
  }
  assert.match(currentOffer.copy.en.terms, /Nail art and gel removal are charged separately/);
  assert.equal(currentOffer.copy.en.includes, "Basic Manicure + solid Gelish colour");
  assert.equal(currentOffer.copy.zh.includes, "Basic Manicure + 纯色 Gelish");
  assert.equal(currentOffer.copy.ms.includes, "Basic Manicure + warna Gelish solid");
  assert.equal(currentOffer.copy.zh.otherOffersLine, "另有：Gelish Pedicure RM98 · Mani + Pedi RM138");
  assert.equal(currentOffer.copy.ms.otherOffersLine, "Juga: Gelish Pedicure RM98 · Mani + Pedi RM138");
  assert.equal(
    currentOffer.copy.zh.posterAlt,
    "屠妖节 Gel Glow 海报：Gelish Manicure RM68，原价 RM95，2026年10月15日至11月8日",
  );
  assert.equal(
    currentOffer.copy.ms.posterAlt,
    "Poster Deepavali Gel Glow: Gelish Manicure RM68, harga biasa RM95, sah 15 Oktober hingga 8 November 2026",
  );
});

test("all three offers save the configured amount and match the service catalog prices", async () => {
  const { currentOffer } = await loadOffer();
  const offers = [currentOffer, ...currentOffer.extras];
  const manicurePrice = Number(servicesSource.match(/service\("Gelish Manicure", "RM(\d+)"/)?.[1]);
  const pedicurePrice = Number(servicesSource.match(/service\("Gelish Pedicure", "RM(\d+)"/)?.[1]);

  assert.equal(manicurePrice, 95);
  assert.equal(pedicurePrice, 120);
  assert.deepEqual(
    offers.map(({ id }) => id),
    ["deepavali-gel-glow-2026", "gelish-pedicure", "gelish-mani-pedi"],
  );
  for (const offer of offers) {
    assert.equal(offer.originalPrice - offer.offerPrice, offer.saving, `${offer.id} saving`);
  }
  assert.equal(currentOffer.originalPrice, manicurePrice);
  assert.equal(currentOffer.extras[0].originalPrice, pedicurePrice);
  assert.equal(currentOffer.extras[1].originalPrice, manicurePrice + pedicurePrice);
});

test("each extra offer has localized copy and its own WhatsApp message", async () => {
  const { currentOffer, getOfferWhatsappUrl } = await loadOffer();
  const expected = {
    "gelish-pedicure": {
      en: "Hello Mezzanail, I would like to book the Deepavali Gelish Pedicure (RM98).",
      zh: "您好 Mezzanail，我想预约屠妖节 Gelish Pedicure（RM98）。",
      ms: "Hai Mezzanail, saya ingin menempah Gelish Pedicure Deepavali (RM98).",
    },
    "gelish-mani-pedi": {
      en: "Hello Mezzanail, I would like to book the Deepavali Gelish Manicure + Pedicure combo (RM138).",
      zh: "您好 Mezzanail，我想预约屠妖节 Gelish Manicure + Pedicure 套餐（RM138）。",
      ms: "Hai Mezzanail, saya ingin menempah kombo Gelish Manicure + Pedicure Deepavali (RM138).",
    },
  };

  for (const extra of currentOffer.extras) {
    for (const locale of ["en", "zh", "ms"]) {
      const copy = extra.copy[locale];
      assert.ok(copy.service && copy.includes && copy.save);
      if (extra.id === "gelish-pedicure") {
        assert.equal(copy.includes, {
          en: "Classic Pedicure + solid Gelish colour",
          zh: "Classic Pedicure + 纯色 Gelish",
          ms: "Classic Pedicure + warna Gelish solid",
        }[locale]);
      }
      const url = getOfferWhatsappUrl(locale, extra.id);
      assert.match(url, /^https:\/\/wa\.me\/60162121332\?text=/);
      assert.equal(decodeURIComponent(url.split("?text=")[1]), expected[extra.id][locale]);
    }
  }
});

test("ZH and MS service names stay in English for offers and homepage service cards", async () => {
  const [{ currentOffer }, { homepageContent }] = await Promise.all([loadOffer(), loadHomepage()]);
  const forbiddenTranslatedName = /美甲|足部|手部|Manikur|Pedikur/i;
  const expectedOfferServiceNames = [
    "Gelish Manicure",
    "Gelish Pedicure",
    "Gelish Manicure + Pedicure",
  ];
  const expectedHomepageServiceTitles = [
    "Hand Care",
    "Foot Care",
    "Nail Extensions",
    "Callus Removal",
    "Waxing",
  ];

  for (const locale of ["zh", "ms"]) {
    const offerServiceNames = [currentOffer, ...currentOffer.extras].map(
      (offer) => offer.copy[locale].service,
    );
    const homepageServiceTitles = homepageContent[locale].services.items.map(({ title }) => title);
    assert.deepEqual(offerServiceNames, expectedOfferServiceNames, `${locale} offer service names`);
    assert.deepEqual(homepageServiceTitles, expectedHomepageServiceTitles, `${locale} homepage service titles`);
    for (const name of [...offerServiceNames, ...homepageServiceTitles]) {
      assert.doesNotMatch(name, forbiddenTranslatedName, `${locale} service name should stay English: ${name}`);
    }
  }
});

test("the homepage hero photo is swappable, localized, and uncropped", () => {
  const heroImageBlock = homepageConfig.match(/heroImage:\s*\{([\s\S]*?)\n  \},/)?.[1] ?? "";
  const src = heroImageBlock.match(/src:\s*"([^"]+)"/)?.[1] ?? "";
  const width = heroImageBlock.match(/width:\s*(\d+)/)?.[1];
  const height = heroImageBlock.match(/height:\s*(\d+)/)?.[1];

  assert.match(src, /^\/home\/hero-[^/]+\.webp$/);
  assert.equal(existsSync(`public${src}`), true);
  assert.equal(Number(width), 1280);
  assert.equal(Number(height), 1280);
  assert.match(heroImageBlock, /en: "Bride in a lace gown with French-tip almond nails, hands clasped behind her back"/);
  assert.match(heroImageBlock, /zh: "身穿蕾丝婚纱的新娘，双手背在身后，法式杏仁甲"/);
  assert.match(heroImageBlock, /ms: "Pengantin bergaun renda dengan kuku badam French tip, tangan digenggam di belakang"/);
  assert.match(hero, /alt=\{heroImage\.alt\[locale\]\}/);
  assert.doesNotMatch(hero, /\bfill\b/);
  assert.match(hero, /<figure\s+className="home-hero-media"\s+style=\{\{\s*aspectRatio:\s*`\$\{heroImage\.width\} \/ \$\{heroImage\.height\}`\s*\}\}/);
  assert.doesNotMatch(globals, /\.home-hero-media\s*\{[^}]*aspect-ratio\s*:/);
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
  assert.match(hero, /<h1 id="home-hero-title">\{heroCopy\.title\}<\/h1>/);
  assert.match(promotion, /\{offerActive && \(/);
  assert.match(promotion, /id="current-offer"/);
  assert.ok(
    promotion.indexOf('id="current-offer"') < promotion.indexOf("promotion-past-campaign"),
    "the current offer must sit above the ended lucky-draw notice",
  );
  assert.doesNotMatch(homepageConfig, /RM\s?\d|price:/i);
});

test("all three offers share the active-date gate on the homepage and promotion page", async () => {
  const { isOfferActive, currentOffer } = await loadOffer();
  assert.equal(isOfferActive(new Date("2026-11-09T00:00:00+08:00")), false);
  assert.equal(currentOffer.extras.length + 1, 3);
  assert.match(hero, /\{offerActive \? \(\s*<div className="home-hero-offer"/);
  assert.match(hero, /home-hero-offer-extras/);
  assert.match(promotion, /\{offerActive && \(\s*<section[\s\S]*?className="promotion-current-offer"/);
  assert.match(promotion, /offerRows\.map\(\(offer\) =>/);
});
