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
const phaseMarker = "/* WEBSITE PHASE 1.5 - mobile homepage compaction */";
const markerIndex = css.indexOf(phaseMarker);
const mobileRules = css.slice(markerIndex);

test("desktop CSS remains byte-identical to the Production baseline", () => {
  assert.ok(markerIndex >= 0, "the mobile-only rules are present");
  assert.equal(css.slice(0, markerIndex).trimEnd(), baselineCss.trimEnd());
  assert.match(
    mobileRules,
    /^\/\* WEBSITE PHASE 1\.5 - mobile homepage compaction \*\/\s*@media\s*\(max-width:\s*767px\)\s*\{[\s\S]*\}\s*$/,
  );
});

test("signature service cards are compact, two-column, and full-card links only on mobile", () => {
  assert.match(services, /className="signature-service-description"/);
  assert.match(services, /className="signature-service-action"/);
  assert.match(services, /className="signature-service-card-link hidden"/);
  assert.match(services, /href=\{item\.href\}[\s\S]*?event="service_category_click"[\s\S]*?eventLabel=\{item\.title\}/);
  assert.match(mobileRules, /\.public-site \.signature-services-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileRules, /\.public-site \.signature-service-image[\s\S]*?aspect-ratio:\s*1;/);
  assert.match(mobileRules, /\.public-site \.signature-service-description,[\s\S]*?display:\s*none;/);
  assert.match(mobileRules, /\.public-site \.signature-service-card-link\s*\{[^}]*display:\s*block/);
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
