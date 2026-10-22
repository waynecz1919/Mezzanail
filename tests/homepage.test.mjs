import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (filePath) => readFileSync(filePath, "utf8");
const officialSite = read("components/official-site.tsx");
const officialI18n = read("lib/official-i18n.ts");
const servicesCatalog = read("components/services-catalog.tsx");
const servicesData = read("lib/services.ts");
const currentOfferConfig = read("config/current-offer.ts");
const homepageConfig = read("config/homepage.ts");
const navigation = read("config/navigation.ts");
const globals = read("app/globals.css");
const homeLink = read("components/ui/HomeLink.tsx");
const homeHero = read("components/home/HomeHero.tsx");
const homeHeroSlideshow = read("components/home/HomeHeroSlideshow.tsx");
const homeHeroStyles = read("components/home/HomeHero.module.css");
const homepagePage = read("app/page.tsx");
const sectionHeading = read("components/ui/SectionHeading.tsx");
const signatureServices = read("components/home/SignatureServices.tsx");
const selectedNailWork = read("components/home/SelectedNailWork.tsx");
const whyMezzanail = read("components/home/WhyMezzanail.tsx");
const googleReviews = read("components/home/GoogleReviewsPreview.tsx");
const membershipBanner = read("components/home/MembershipBanner.tsx");
const studioBooking = read("components/home/StudioLocationBooking.tsx");
const findUsDirections = read("components/find-us-directions.tsx");

test("homepage renders the approved quiet-luxury section order", () => {
  const orderedComponents = [
    "<HomeHero",
    "<SignatureServices",
    "<SelectedNailWork",
    "<WhyMezzanail",
    "<GoogleReviewsPreview",
    "<MembershipBanner",
    "<StudioLocationBooking",
  ];
  let previousIndex = -1;
  for (const component of orderedComponents) {
    const currentIndex = officialSite.indexOf(component);
    assert.ok(currentIndex > previousIndex, `${component} must appear in the approved order`);
    previousIndex = currentIndex;
  }
  assert.doesNotMatch(officialSite, /<AnniversaryCampaign/);
  assert.doesNotMatch(officialSite, /<AppPromo/);
  assert.doesNotMatch(officialSite, /<Philosophy/);
});

test("homepage navigation is concise and jobs remain in the footer", () => {
  for (const route of ["/", "/services", "/promotion", "/about", "/contact"]) {
    assert.match(navigation, new RegExp(`href: "${route.replace("/", "\\/")}"`));
  }
  assert.match(navigation, /href: MEMBER_CENTER_URL/);
  assert.doesNotMatch(navigation, /\/job|\/#app/);
  assert.match(officialSite, /<Link href="\/job">\{t\.nav\.jobs\}<\/Link>/);
  assert.match(officialSite, /siteConfig\.bookingUrl/);
});

test("homepage visit actions are ordered without duplicate WhatsApp tracking", () => {
  const actions = studioBooking.match(/<div className="studio-actions">([\s\S]*?)<\/div>/)?.[1] ?? "";
  const links = [...actions.matchAll(/<HomeLink([\s\S]*?)<\/HomeLink>/g)].map((match) => match[1]);

  assert.equal(links.length, 3);
  assert.match(links[0], /href=\{siteConfig\.bookingUrl\}/);
  assert.match(links[0], /variant="primary"/);
  assert.match(links[1], /href=\{getWhatsappUrl\(locale\)\}/);
  assert.match(links[1], /variant="secondary"/);
  assert.match(links[1], /<MessageCircle/);
  assert.doesNotMatch(links[1], /whatsapp_click/);
  assert.match(links[2], /href=\{siteConfig\.googleMapsDirectionsUrl\}/);
  assert.match(links[2], /variant="secondary"/);
  assert.match(links[2], /event="open_maps_click"/);
  assert.match(links[2], /eventLabel="studio_location"/);
});

test("find-us landmark is localized and rendered with a decorative map pin", () => {
  for (const landmark of [
    "Upstairs (1st floor) above Restoran Fogai, in the 7-Eleven row, opposite Caring Pharmacy · Taman Cheng Baru",
    "Restoran Fogai 楼上（二楼），7-Eleven 那排店，Caring Pharmacy 对面 · Taman Cheng Baru",
    "Tingkat 1, di atas Restoran Fogai, sebaris dengan 7-Eleven, bertentangan Caring Pharmacy · Taman Cheng Baru",
  ]) {
    assert.ok(findUsDirections.includes(landmark));
  }
  assert.match(findUsDirections, /<MapPin size=\{15\} aria-hidden="true"\s*\/>/);
  assert.match(findUsDirections, /<span>\{copy\.landmark\}<\/span>/);
  assert.match(globals, /\.find-us-landmark\s*\{[^}]*white-space:\s*normal/);
  assert.match(globals, /\.find-us-landmark svg\s*\{[^}]*flex:\s*none/);
  assert.match(globals, /@media \(max-width: 767px\) \{[\s\S]*?\.public-site \.home-studio \.studio-actions \.mn-button\s*\{[^}]*height: 52px;[^}]*min-height: 52px;/);
});

test("find-us parking is localized, uses a decorative car icon, and matches the landmark style", () => {
  for (const parking of [
    "Parking available right in front of the studio.",
    "店门口可以停车。",
    "Tempat letak kereta tersedia di hadapan studio.",
  ]) {
    assert.ok(findUsDirections.includes(parking));
  }
  assert.match(findUsDirections, /<p className="find-us-landmark find-us-parking">\s*<Car size=\{15\} aria-hidden="true"\s*\/>\s*<span>\{copy\.parking\}<\/span>/);
});

test("mobile public footer reserves space above the floating chat button", () => {
  const mobileRuleStart = globals.indexOf("/* WEBSITE PHASE 1.5 - mobile homepage compaction */");
  const approvedRefinementsStart = globals.indexOf("/* WEBSITE PHASE 1.5 - approved full-pass refinements. */");
  const mobileRules = globals.slice(mobileRuleStart, approvedRefinementsStart);

  assert.match(mobileRules, /^\/\* WEBSITE PHASE 1\.5 - mobile homepage compaction \*\/\s*@media \(max-width: 767px\)/);
  assert.match(mobileRules, /.public-site \.official-footer\s*\{[^}]*padding-bottom:\s*calc\(var\(--public-bottom-nav-height\) \+ 48px \+ env\(safe-area-inset-bottom\)\)/);
});

test("homepage content is centralised and does not expose prices", () => {
  for (const category of [
    "Hand Care",
    "Foot Care",
    "Nail Extensions",
    "Callus Removal",
    "Waxing",
  ]) {
    assert.match(homepageConfig, new RegExp(category));
  }
  for (const proofPoint of [
    "Since 2019 in Melaka",
    "Footlogix foot care",
    "Member rewards",
    "2019 年起扎根马六甲",
    "Footlogix 专业足部护理",
    "会员礼遇",
    "Sejak 2019 di Melaka",
    "Penjagaan kaki Footlogix",
    "Ganjaran ahli",
  ]) {
    assert.ok(homepageConfig.includes(proofPoint), `homepage proof point missing: ${proofPoint}`);
  }
  assert.doesNotMatch(homepageConfig, /title: "(?:Precision|Comfort|Confidence)"/);
  assert.doesNotMatch(homepageConfig, /RM\s?\d|price:/i);
});

test("homepage title is absolute while description, canonical and H1 stay unchanged", () => {
  assert.match(homepagePage, /title: \{ absolute: "Premium Nail Care in Melaka \| Mezzanail Nail Studio" \}/);
  assert.match(homepagePage, /title: "Premium Nail Care in Melaka"/);
  assert.match(homepagePage, /description:\s*"Visit Mezzanail Nail Studio in Melaka for manicure, pedicure, nail extensions, callus care and waxing\. Book online or enquire through WhatsApp\."/);
  assert.match(homepagePage, /path: "\/"/);
  assert.match(homeHero, /<h1 className="sr-only" id="home-hero-title">\{heroCopy\.title\}<\/h1>/);
  assert.equal((homeHero.match(/<h1\b/g) ?? []).length, 1);
});

test("homepage Google rating and localized review notes match the owner-approved values", () => {
  assert.match(homepageConfig, /const reviewSource = \{\s*rating: "4\.8"/);
  for (const note of [
    "120+ Google reviews",
    "120+ 则 Google 评价",
    "120+ ulasan Google",
  ]) {
    assert.ok(homepageConfig.includes(note), `localized review note missing: ${note}`);
  }
});

test("Google rating is grouped on one line, with the note below and the number in ink", () => {
  assert.match(globals, /\.google-rating\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;[^}]*align-items:\s*baseline;[^}]*column-gap:\s*8px/);
  assert.match(globals, /\.google-rating strong\s*\{[^}]*color:\s*var\(--color-ink\)/);
  assert.match(globals, /\.google-rating small\s*\{[^}]*flex-basis:\s*100%/);
  assert.match(globals, /\.public-site \.review-stars,[\s\S]*?\.public-site \.google-rating\s*\{[\s\S]*?color:\s*var\(--color-gold\)/);
  assert.match(googleReviews, /className="google-rating"[\s\S]*?<Star aria-hidden="true" size=\{20\} fill="currentColor" \/>[\s\S]*?<strong>\{copy\.rating\}<\/strong>[\s\S]*?<span>\/ 5<\/span>[\s\S]*?<small>\{copy\.ratingNote\}<\/small>/);
});

test("hero eyebrow, accessible title and booking action are localized in en, zh and ms", () => {
  for (const copy of [
    "Nail Studio · Melaka",
    "美甲工作室 · 马六甲",
    "Studio Kuku · Melaka",
    "Premium Nail Care in Melaka",
    "马六甲高品质美甲护理",
    "Penjagaan Kuku Premium di Melaka",
    "Manicure, pedicure, nail extensions, callus care and waxing from Mezzanail Nail Studio in Melaka.",
    "马六甲 Mezzanail Nail Studio 提供 Manicure、Pedicure、Nail Extensions、Callus Removal 与 Waxing 服务。",
    "Manicure, Pedicure, Nail Extensions, Callus Removal dan Waxing di Mezzanail Nail Studio, Melaka.",
    "Book Now",
    "立即预约",
    "Tempah Sekarang",
  ]) {
    assert.ok(homepageConfig.includes(copy), `localized hero copy missing: ${copy}`);
  }
  assert.match(homeHero, /const heroCopy = homepageContent\[locale\]\.hero/);
  assert.match(homeHero, /\{heroCopy\.eyebrow\}/);
  assert.match(homeHero, /\{heroCopy\.title\}/);
  assert.match(homeHero, /\{heroCopy\.bookNow\}/);
  assert.doesNotMatch(homeHero, /heroCopy\.lede/);
});

test("premium slogans rotate with the four images without adding headings or live announcements", () => {
  for (const slogan of [
    "Artistry at your fingertips.", "指尖上的艺术", "Seni di hujung jari.",
    "Precision in every stroke.", "每一笔，都是讲究", "Teliti dalam setiap sapuan.",
    "Effortless elegance, every day.", "优雅，成为日常", "Anggun, setiap hari.",
    "Luxury, from heel to toe.", "从足尖开始的宠爱", "Kemewahan dari tumit ke hujung jari.",
  ]) {
    assert.ok(homepageConfig.includes(slogan), `slogan missing: ${slogan}`);
  }
  assert.match(homeHero, /<h1 className="sr-only" id="home-hero-title">\{heroCopy\.title\}<\/h1>/);
  assert.equal((homeHero.match(/<h1\b/g) ?? []).length, 1);
  assert.match(homeHero, /aria-hidden=\{index !== activeIndex\}/);
  assert.match(homeHero, /className=\{styles\.desktopSlogans\}/);
  assert.match(homeHero, /className=\{styles\.mobileSlogans\}/);
  assert.match(homeHeroSlideshow, /onActiveIndexChange\?\.\(reducedMotion \? 0 : activeIndex\)/);
  assert.doesNotMatch(homeHero + homeHeroSlideshow, /aria-live/);
  assert.doesNotMatch(homeHero, /heroCopy\.lede/);
  assert.match(homeHeroStyles, /desktopSlogans \.sloganActive[\s\S]*?transition: opacity 1s ease/);
  assert.match(homeHeroStyles, /mobileSlogans \.sloganActive[\s\S]*?transition: opacity 1s ease/);
  assert.match(homeHeroStyles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?mobileSlogans \.sloganActive[\s\S]*?transition: none/);
});

test("only the hero eyebrow remains among the homepage section labels", () => {
  assert.match(sectionHeading, /eyebrow\?: string/);
  assert.match(sectionHeading, /\{eyebrow \? <p className="mn-eyebrow">\{eyebrow\}<\/p> : null\}/);
  for (const component of [signatureServices, selectedNailWork, whyMezzanail, googleReviews]) {
    assert.doesNotMatch(component, /eyebrow=\{copy\.eyebrow\}/);
  }
  assert.doesNotMatch(membershipBanner, /className="mn-eyebrow"/);
  assert.doesNotMatch(studioBooking, /className="mn-eyebrow"/);
  assert.match(homeHero, /\{heroCopy\.eyebrow\}/);
  assert.match(homeHero, /className=\{styles\.offerLabel\}/);
});

test("homepage uses the approved palette, typography and restrained buttons", () => {
  for (const token of [
    "--mn-background:#fbf7f4",
    "--mn-wine:#5a1f2d",
    "--mn-blush:#d9a6ad",
    "--mn-champagne:#c6a46a",
    "--mn-border:#e9deda",
  ]) {
    assert.match(globals, new RegExp(token));
  }
  assert.match(globals, /var\(--font-beauty\)/);
  assert.match(globals, /\.mn-button--primary/);
  assert.match(globals, /\.mn-button--secondary/);
  assert.match(globals, /\.mn-button--text/);
});

test("the homepage offer card includes one compact localized line for the extra offers", () => {
  for (const copy of [
    "Also: Gelish Pedicure RM98 · Mani + Pedi RM138",
    "另有：Gelish Pedicure RM98 · Mani + Pedi RM138",
    "Juga: Gelish Pedicure RM98 · Mani + Pedi RM138",
  ]) {
    assert.ok(currentOfferConfig.includes(copy), `offer line missing: ${copy}`);
  }
  assert.match(homeHero, /<p className=\{styles\.offerExtras\}>\{offer\.otherOffersLine\}<\/p>/);
  const offerLineRule = homeHeroStyles.match(/\.offerExtras\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(offerLineRule, /font-size:\s*13px/);
  assert.match(homeHeroStyles, /\.desktopOffer\s*\{[^}]*color:\s*var\(--color-ink\)/);
  assert.match(homeHeroStyles, /\.mobileOfferDetails\s*\{[^}]*color:\s*var\(--color-ink\)/);
});

test("mobile hero text meets the public minimum and shows the localized offer strip", () => {
  assert.match(globals, /\.public-site \.mn-eyebrow\s*\{\s*font-size:\s*11px;/);
  assert.match(homeHeroStyles, /\.mobileOverlayCopy :global\(\.mn-eyebrow\)\s*\{[^}]*font-size:\s*11px/);
  assert.match(homeHero, /className=\{styles\.mobileOfferStrip\}/);
  assert.match(homeHero, /\{offer\.title\} · \{offer\.service\} <strong>RM\{currentOffer\.offerPrice\}<\/strong>/);
});

test("homepage analytics include only approved interaction context", () => {
  for (const event of [
    "service_category_click",
    "nail_work_click",
    "google_reviews_click",
    "membership_click",
    "open_maps_click",
    "book_appointment_click",
  ]) {
    assert.match(`${homeLink}\n${officialSite}`, new RegExp(event));
  }
  assert.doesNotMatch(homeLink, /customer_name|phone_number|appointment_data|member_balance/);
});

test("public announcement is localized, offer-gated and keeps home clear", () => {
  const announcementBlocks = officialI18n.match(/announcement: \{[^}]*\}/g) ?? [];
  assert.equal(announcementBlocks.length, 3);
  for (const block of announcementBlocks) {
    assert.doesNotMatch(block, /7TH ANNIVERSARY|七周年庆典|ULANG TAHUN KE-7/);
  }
  assert.match(officialSite, /const offerActive = useOfferActive\(\)/);
  assert.match(officialSite, /!isHome && !pathname\.startsWith\("\/job"\) && offerActive/);
  assert.match(officialSite, /href="\/promotion#current-offer"/);
  assert.match(officialSite, /currentOffer\.offerPrice/);
  assert.match(currentOfferConfig, /getOfferEndDateLabel/);
  assert.match(officialSite, /className="announcement-label"/);
});

test("the public offer announcement has white text on an ink background", () => {
  const announcement = globals.match(/\.announcement--offer\s*\{([^}]+)\}/)?.[1] ?? "";
  const label = globals.match(/\.announcement--offer\s+\.announcement-label\s*\{([^}]+)\}/)?.[1] ?? "";
  const link = globals.match(/\.announcement--offer\s+a\s*\{([^}]+)\}/)?.[1] ?? "";

  assert.match(announcement, /background:\s*var\(--color-ink\)/);
  assert.match(announcement, /color:\s*var\(--color-white\)/);
  assert.match(label, /color:\s*var\(--color-white\)/);
  assert.match(link, /color:\s*var\(--color-white\)/);
  assert.match(link, /border:\s*1px solid color-mix\(in srgb,\s*var\(--color-white\) 55%,\s*transparent\)/);
});

test("Gelish service offer badge is active-gated without changing listed service data", () => {
  assert.match(servicesCatalog, /const offerActive = useOfferActive\(\)/);
  assert.match(servicesCatalog, /offerActive && service\.name === "Gelish Manicure"/);
  assert.match(servicesCatalog, /href="\/promotion#current-offer"/);
  assert.match(servicesCatalog, /currentOffer\.offerPrice/);
  assert.doesNotMatch(servicesData, /Deepavali RM68|offerBadge/);
});
