import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (filePath) => readFileSync(filePath, "utf8");
const analytics = read("components/deferred-google-analytics.tsx");
const homeLink = read("components/ui/HomeLink.tsx");
const homeHero = read("components/home/HomeHero.tsx");
const studio = read("components/home/StudioLocationBooking.tsx");
const officialSite = read("components/official-site.tsx");
const promotion = read("components/promotion/promotion-experience.tsx");

test("GA4 queues arguments objects after consent, matching Google's gtag shim", () => {
  assert.match(
    analytics,
    /analyticsWindow\.dataLayer = analyticsWindow\.dataLayer \|\| \[\];\s*analyticsWindow\.gtag = function gtag\(\)\s*\{\s*analyticsWindow\.dataLayer!\.push\(arguments\);\s*\};/,
  );
  assert.doesNotMatch(analytics, /function gtag\(\.\.\.args/);
  assert.match(analytics, /if \(current\?\.choice === "granted"\) loadAnalytics\(\)/);
  assert.match(analytics, /if \(choice === "granted"\) \{\s*window\.location\.reload\(\);/);
});

test("delegated contact and booking events are consent-gated and use beacon transport", () => {
  assert.match(analytics, /document\.addEventListener\("click", trackLinkClick, true\)/);
  assert.match(analytics, /document\.removeEventListener\("click", trackLinkClick, true\)/);
  assert.match(analytics, /if \(!hasAnalyticsConsent\(\)\) return;/);
  assert.match(analytics, /analyticsWindow\.gtag\("event", "whatsapp_click",/);
  assert.match(analytics, /analyticsWindow\.gtag\("event", "phone_click",/);
  assert.match(analytics, /analyticsWindow\.gtag\("event", "booking_click",/);
  assert.match(analytics, /link_url: linkUrl/);
  assert.match(analytics, /page_path: pagePath/);
  assert.match(analytics, /link_text: linkText/);
  assert.equal((analytics.match(/transport_type: "beacon"/g) ?? []).length, 3);
  assert.match(analytics, /host === "wa\.me"/);
  assert.match(analytics, /host === "api\.whatsapp\.com"/);
  assert.match(analytics, /url\.protocol === "whatsapp:"/);
  assert.match(analytics, /url\.protocol === "tel:"/);
  assert.match(analytics, /host === "booking\.tunai\.io"/);
});

test("WhatsApp links use only the delegated click event", () => {
  assert.doesNotMatch(homeLink, /"whatsapp_click"/);
  assert.doesNotMatch(homeHero, /event="whatsapp_click"/);
  assert.doesNotMatch(studio, /event="whatsapp_click"/);
  assert.doesNotMatch(officialSite, /trackPublicAction\("whatsapp_click"/);
  assert.doesNotMatch(promotion, /window\.gtag\?\.\("event", "whatsapp_click"/);
});
