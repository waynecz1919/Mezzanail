import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const normalizeEol = (text) => text.replace(/\r\n/g, "\n");
const baseCommit = "b710938f75650ed50ec03f70295ee51f59fe68ce";
const baselineCss = normalizeEol(
  execFileSync("git", ["show", baseCommit + ":app/globals.css"], { encoding: "utf8" }),
);
const css = normalizeEol(read("app/globals.css"));
const services = read("components/home/SignatureServices.tsx");
const reviews = read("components/home/GoogleReviewsPreview.tsx");
const homepagePage = read("app/page.tsx");
const homepageConfig = read("config/homepage.ts");
const phaseMarker = "/* WEBSITE PHASE 1.5 - mobile homepage compaction */";
const approvedRefinementsMarker = "/* WEBSITE PHASE 1.5 - approved full-pass refinements. */";
const markerIndex = css.indexOf(phaseMarker);
const refinementsIndex = css.indexOf(approvedRefinementsMarker);
const mobileRules = css.slice(markerIndex, refinementsIndex);
const baselineVisitStyles = baselineCss.match(/\.contact-visit-grid\{[\s\S]*?(?=\.social-contact-grid\{)/)?.[0] ?? "";
const baselineRatingStyles = baselineCss.match(/\.home-reviews\{[\s\S]*?(?=\.reviews-grid\{)/)?.[0] ?? "";
const normalizeApprovedDirectionsStyles = (source) =>
  source
    .replace(/\.contact-visit-grid\{[\s\S]*?(?=\.social-contact-grid\{)/, baselineVisitStyles)
    .replace(/\.home-reviews\{[\s\S]*?(?=\.reviews-grid\{)/, baselineRatingStyles)
    .replace(".find-us-map{height:280px}.find-us-directions-actions{grid-template-columns:1fr}", ".map-frame{min-height:420px}")
    .replace(
      /\n?\.promotion-site \.find-us-directions--promotion\s*\{[^}]*\}\s*\.promotion-site \.find-us-directions--promotion \.find-us-map\s*\{[^}]*\}\n?/g,
      "",
    );
const normalizeApprovedGalleryStyles = (source) =>
  source
    .replace(/\.home-selected-work\{[\s\S]*?(?=\.home-why\{)/, ".home-selected-work-gallery-approved\n")
    .replace(/\.selected-work-item>span\{opacity:1;transform:none\}/g, "")
    .replace(/,\.selected-work-item img,\.selected-work-item>span/g, "")
    .replace(/\.public-site \.selected-work-item>span\s*\{[^}]*\}\s*/g, "");
const normalizeApprovedStyles = (source) =>
  normalizeApprovedGalleryStyles(normalizeApprovedDirectionsStyles(source));
const desktopCssBeforeMobileRules = normalizeApprovedStyles(css.slice(0, markerIndex));
const baselineDesktopCss = normalizeApprovedStyles(baselineCss);

test("desktop CSS remains unchanged apart from approved directions and gallery caption styling", () => {
  assert.ok(markerIndex >= 0, "the mobile-only rules are present");
  assert.ok(baselineVisitStyles, "the production contact styles are available for comparison");
  assert.equal(desktopCssBeforeMobileRules.trimEnd(), baselineDesktopCss.trimEnd());
  assert.match(
    mobileRules,
    /^\/\* WEBSITE PHASE 1\.5 - mobile homepage compaction \*\/\s*@media\s*\(max-width:\s*767px\)\s*\{[\s\S]*\}\s*$/,
  );
  assert.ok(refinementsIndex > markerIndex, "approved full-pass rules are isolated from mobile compaction");
});

test("signature service cards are compact, two-column, and full-card links only on mobile", () => {
  assert.match(services, /className="signature-service-description"/);
  assert.match(services, /className="signature-service-price"/);
  assert.match(services, /className="signature-service-action"/);
  assert.match(services, /className="signature-service-card-link hidden"/);
  assert.match(services, /href=\{item\.href\}[\s\S]*?event="service_category_click"[\s\S]*?eventLabel=\{item\.title\}/);
  assert.match(mobileRules, /\.public-site \.signature-services-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileRules, /\.public-site \.signature-service-image[\s\S]*?aspect-ratio:\s*1;/);
  assert.match(mobileRules, /\.public-site \.signature-service-description,[\s\S]*?display:\s*none;/);
  assert.match(mobileRules, /\.public-site \.signature-service-card-link\s*\{[^}]*display:\s*block/);
  assert.match(mobileRules, /\.public-site \.signature-service-description,[\s\S]*?\.public-site \.signature-service-action,[\s\S]*?display:\s*none/);
  assert.match(homepageConfig, /serviceCategoryId: "manicure"[\s\S]*serviceCategoryId: "pedicure"[\s\S]*serviceCategoryId: "extensions"[\s\S]*serviceCategoryId: "callus"[\s\S]*serviceCategoryId: "waxing"/);
  assert.match(homepagePage, /getHomepageStartingPrices\(/);
});

test("Google reviews keep the rating and all-reviews action around a swipe carousel", () => {
  const ratingPosition = reviews.indexOf('className="google-rating"');
  const carouselPosition = reviews.indexOf('className="reviews-grid"');
  const actionPosition = reviews.indexOf('className="reviews-action"');
  assert.ok(ratingPosition >= 0 && ratingPosition < carouselPosition);
  assert.ok(carouselPosition < actionPosition);
  assert.match(mobileRules, /\.public-site \.reviews-grid\s*\{[^}]*display:\s*flex;[\s\S]*scroll-snap-type:\s*x mandatory;/);
  assert.match(mobileRules, /\.public-site \.reviews-grid \.review-quote\s*\{[^}]*flex:\s*0 0 85%;/);
  assert.match(mobileRules, /\.public-site \.reviews-action\s*\{[^}]*width:\s*100%;/);
  assert.match(mobileRules, /\.public-site \.reviews-grid \.review-quote\s*\{[^}]*min-height:\s*0/);
});

test("Why Mezzanail rows put number and title together with body below", () => {
  assert.match(mobileRules, /\.public-site \.why-mezzanail-item\s*\{[^}]*display:\s*grid;[\s\S]*grid-template-columns:\s*auto minmax\(0,\s*1fr\)/);
  assert.match(mobileRules, /\.public-site \.why-mezzanail-item > span\s*\{[^}]*grid-row:\s*1/);
  assert.match(mobileRules, /\.public-site \.why-mezzanail-item h3\s*\{[^}]*grid-row:\s*1/);
  assert.match(mobileRules, /\.public-site \.why-mezzanail-item p\s*\{[^}]*grid-column:\s*1 \/ -1/);
});

test("the mobile footer uses two link columns and preserves 44px targets", () => {
  assert.match(mobileRules, /\.public-site \.official-footer \.shell > \.grid:first-child\s*\{[^}]*grid-template-columns:\s*repeat\(2,/);
  assert.match(mobileRules, /\.public-site \.official-footer \.shell > \.grid:first-child > div:not\(:first-child\)\s*\{[^}]*grid-template-columns:\s*repeat\(2,/);
  assert.match(mobileRules, /\.public-site \.official-footer \.shell > div:last-child a\s*\{[^}]*min-width:\s*44px;[\s\S]*min-height:\s*44px/);
});

test("the homepage compaction remains scoped to widths at or below 767px", () => {
  assert.equal(desktopCssBeforeMobileRules.trimEnd(), baselineDesktopCss.trimEnd());
  assert.match(mobileRules, /@media\s*\(max-width:\s*767px\)/);
  assert.doesNotMatch(mobileRules, /@media\s*\(min-width/);
});
