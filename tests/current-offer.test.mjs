import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { pathToFileURL } from "node:url";

const read = (filePath) => readFileSync(filePath, "utf8");
const offerPath = "config/current-offer.ts";
const offerSource = read(offerPath);
const servicesSource = read("lib/services.ts");
const hero = read("components/home/HomeHero.tsx");
const heroSlideshow = read("components/home/HomeHeroSlideshow.tsx");
const heroStyles = read("components/home/HomeHero.module.css");
const homepageConfig = read("config/homepage.ts");
const promotion = read("components/promotion/promotion-experience.tsx");

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

test("the homepage hero slideshow uses the supplied localized images in approved order", () => {
  const slides = [
    {
      src: "/brand/hero/hero-1-v2.jpg",
      position: "50% 70%",
      alt: [
        "Macro view of nude-pink nails with fine gold line art",
        "裸粉色美甲与细致金线设计的近景",
        "Pandangan dekat kuku merah jambu nude dengan garisan seni emas halus",
      ],
      slogan: ["Artistry at your fingertips.", "指尖上的艺术", "Seni di hujung jari."],
    },
    {
      src: "/brand/hero/hero-2.jpg",
      position: "65% 70%",
      alt: [
        "Nail artist in black gloves applying polish during a manicure",
        "美甲师戴着黑色手套为顾客涂抹指甲油",
        "Jurukuku bersarung tangan hitam sedang menyapu pengilat kuku",
      ],
      slogan: ["Precision in every stroke.", "每一笔，都是讲究", "Teliti dalam setiap sapuan."],
    },
    {
      src: "/brand/hero/hero-3.jpg",
      position: "90% 65%",
      alt: [
        "Two hands with French-tip nails holding a latte",
        "双手展示法式美甲并捧着拿铁",
        "Dua tangan berkuku French tip memegang latte",
      ],
      slogan: ["Effortless elegance, every day.", "优雅，成为日常", "Anggun, setiap hari."],
    },
    {
      src: "/brand/hero/hero-4.jpg",
      position: "70% 75%",
      alt: [
        "Pedicure with polished toes resting on a spa towel beside a petal foot bath",
        "修饰整齐的双脚放在水疗毛巾上，旁边是花瓣泡脚盆",
        "Pedicure dengan kedua-dua kaki di atas tuala spa di sisi rendaman kaki berkelopak",
      ],
      slogan: ["Luxury, from heel to toe.", "从足尖开始的宠爱", "Kemewahan dari tumit ke hujung jari."],
    },
  ];
  const heroImageList = homepageConfig.match(/heroImages:\s*\[([\s\S]*?)\n  \],/)?.[1] ?? "";

  assert.equal((heroImageList.match(/src:\s*"\/brand\/hero\/hero-(?:1-v2|[234])\.jpg"/g) ?? []).length, 4);
  let previousImageIndex = -1;
  for (const slide of slides) {
    const imageIndex = heroImageList.indexOf(`src: "${slide.src}"`);
    assert.ok(imageIndex > previousImageIndex, `${slide.src} is in the approved order`);
    previousImageIndex = imageIndex;
    assert.ok(heroImageList.includes(`objectPosition: "${slide.position}"`));
    for (const alt of slide.alt) assert.ok(heroImageList.includes(alt));
    for (const slogan of slide.slogan) assert.ok(heroImageList.includes(slogan));

    const filePath = `public${slide.src}`;
    assert.equal(existsSync(filePath), true, `${filePath} exists`);
    assert.equal(statSync(filePath).size < 200 * 1024, true, `${filePath} is under 200 KB`);
  }
  assert.match(heroImageList, /src:\s*"\/brand\/hero\/hero-1-v2\.jpg",\s*width:\s*816,\s*height:\s*1020,\s*objectPosition:\s*"50% 70%"/);
  assert.match(heroImageList, /width:\s*1024,\s*height:\s*1280/);
  assert.match(hero, /<HomeHeroSlideshow[\s\S]*?images=\{heroImages\}[\s\S]*?locale=\{locale\}[\s\S]*?onActiveIndexChange=\{setActiveSlideIndex\}/);
  assert.match(heroSlideshow, /alt=\{image\.alt\[locale\]\}/);
  assert.match(heroSlideshow, /priority=\{index === 0\}/);
  assert.match(heroSlideshow, /loading=\{index === 0 \? undefined : "lazy"\}/);
  assert.match(heroSlideshow, /onActiveIndexChange\?\.\(reducedMotion \? 0 : activeIndex\)/);
  assert.match(heroSlideshow, /if \(reducedMotion \|\| paused \|\| !readyForLazySlides \|\| images\.length < 2\) return/);
  assert.match(heroStyles, /\.image\s*\{[^}]*object-fit:\s*contain/);
  assert.match(heroStyles, /@media \(max-width: 430px\)\s*\{[\s\S]*?\.image\s*\{\s*object-fit:\s*cover/);
  assert.match(heroStyles, /\.desktopSlogans\s*\{\s*display:\s*grid;[\s\S]*?grid-template-areas:\s*"slogan"/);
  assert.match(heroStyles, /\.mobileSlogans\s*\{\s*display:\s*grid;[\s\S]*?grid-template-areas:\s*"slogan"/);
  assert.match(heroStyles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.mobileSlogans \.sloganActive\s*\{\s*transition:\s*none/);
  assert.match(hero, /aria-hidden=\{index !== activeIndex\}/);
  assert.doesNotMatch(hero + heroSlideshow, /aria-live/);
});

test("the hero offer and promotion section hide themselves after the offer ends", () => {
  assert.match(hero, /const offerActive = useOfferActive\(\)/);
  assert.match(hero, /\{offerActive \? \(\s*<div className=\{styles\.desktopOffer\}/);
  assert.ok(
    hero.indexOf("className={styles.desktopOffer}") < hero.indexOf("<HomeHeroSlideshow"),
    "the desktop RM68 offer must sit in the hero copy, before the photo",
  );
  assert.match(hero, /<strong>RM\{currentOffer\.offerPrice\}<\/strong>/);
  assert.match(hero, /<h1 className="sr-only" id="home-hero-title">\{heroCopy\.title\}<\/h1>/);
  assert.equal((hero.match(/<h1\b/g) ?? []).length, 1, "the homepage hero has exactly one H1");
  assert.doesNotMatch(hero, /heroCopy\.lede/);
  assert.match(hero, /className=\{styles\.mobileOfferStrip\}/);
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
  assert.match(hero, /\{offerActive \? \(\s*<div className=\{styles\.desktopOffer\}/);
  assert.match(hero, /className=\{styles\.offerExtras\}>\{offer\.otherOffersLine\}<\/p>/);
  assert.match(promotion, /\{offerActive && \(\s*<section[\s\S]*?className="promotion-current-offer"/);
  assert.match(promotion, /offerRows\.map\(\(offer\) =>/);
});
