import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (filePath) => readFileSync(filePath, "utf8");
const officialSite = read("components/official-site.tsx");
const homepageConfig = read("config/homepage.ts");
const navigation = read("config/navigation.ts");
const globals = read("app/globals.css");
const homeLink = read("components/ui/HomeLink.tsx");

test("homepage renders the approved quiet-luxury section order", () => {
  const orderedComponents = [
    "<CurrentCampaignBanner",
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
  for (const route of ["/", "/services", "/rewards", "/promotion", "/about", "/contact"]) {
    assert.match(navigation, new RegExp(`href: "${route.replace("/", "\\/")}"`));
  }
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
  assert.match(homepageConfig, /Precision/);
  assert.match(homepageConfig, /Comfort/);
  assert.match(homepageConfig, /Confidence/);
  assert.doesNotMatch(homepageConfig, /RM\s?\d|price:/i);
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
