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
const homepagePage = read("app/page.tsx");
const sectionHeading = read("components/ui/SectionHeading.tsx");
const signatureServices = read("components/home/SignatureServices.tsx");
const selectedNailWork = read("components/home/SelectedNailWork.tsx");
const whyMezzanail = read("components/home/WhyMezzanail.tsx");
const googleReviews = read("components/home/GoogleReviewsPreview.tsx");
const membershipBanner = read("components/home/MembershipBanner.tsx");
const studioBooking = read("components/home/StudioLocationBooking.tsx");

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
  assert.match(homeHero, /<h1 id="home-hero-title">\{heroCopy\.title\}<\/h1>/);
});

test("hero eyebrow, heading, lede and booking action are localized in en, zh and ms", () => {
  for (const copy of [
    "Nail Studio · Melaka",
    "美甲工作室 · 马六甲",
    "Studio Kuku · Melaka",
    "Premium Nail Care in Melaka",
    "马六甲高品质美甲护理",
    "Penjagaan Kuku Premium di Melaka",
    "Manicure, pedicure, nail extensions, callus care and waxing from Mezzanail Nail Studio in Melaka.",
    "马六甲 Mezzanail Nail Studio 提供手部美甲、足部护理、延长甲、去茧护理与脱毛服务。",
    "Manikur, pedikur, sambungan kuku, rawatan kalus dan waxing di Mezzanail Nail Studio, Melaka.",
    "Book Now",
    "立即预约",
    "Tempah Sekarang",
  ]) {
    assert.ok(homepageConfig.includes(copy), `localized hero copy missing: ${copy}`);
  }
  assert.match(homeHero, /const heroCopy = homepageContent\[locale\]\.hero/);
  assert.match(homeHero, /\{heroCopy\.eyebrow\}/);
  assert.match(homeHero, /\{heroCopy\.title\}/);
  assert.match(homeHero, /\{heroCopy\.lede\}/);
  assert.match(homeHero, /\{heroCopy\.bookNow\}/);
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
  assert.match(homeHero, /home-hero-offer-label/);
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

test("public eyebrow is at least 11px and mobile offer title uses separate lines", () => {
  assert.match(globals, /\.public-site \.mn-eyebrow\s*\{\s*font-size:\s*11px;/);
  assert.match(homeHero, /className="home-hero-offer-separator"/);
  assert.match(homeHero, /className="home-hero-offer-service"/);
  assert.match(globals, /\.public-site \.home-hero-offer-separator\s*\{\s*display:\s*none;/);
  assert.match(globals, /\.public-site \.home-hero-offer-service\s*\{\s*display:\s*block;/);
});

test("homepage analytics include only approved interaction context", () => {
  for (const event of [
    "service_category_click",
    "nail_work_click",
    "google_reviews_click",
    "membership_click",
    "open_maps_click",
    "book_appointment_click",
    "whatsapp_click",
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
