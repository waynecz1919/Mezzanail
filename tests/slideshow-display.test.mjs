import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const config = read("config/slideshow-display.ts");
const component = read("components/slideshow/mezzanail-slideshow.tsx");
const css = read("components/slideshow/mezzanail-slideshow.module.css");
const page = read("app/slideshow/page.tsx");
const nextConfig = read("next.config.ts");

test("slideshow keeps promotional content in one future-ready configuration", () => {
  assert.match(config, /slides: \[/);
  assert.match(config, /id: "seventh-anniversary"/);
  assert.match(config, /Celebrating Beauty Together/);
  assert.match(config, /GET RM80 BONUS CREDIT/);
  assert.match(config, /10:30 AM – 7:00 PM/);
  assert.doesNotMatch(config, /FREE RM80 REBATE/);
  for (const extension of ["avif", "webp", "png"]) {
    assert.ok(existsSync(`public/slideshow/anniversary-hero.${extension}`));
  }
});

test("slideshow is a real component layout with Malaysia time", () => {
  assert.match(component, /Intl\.DateTimeFormat/);
  assert.match(config, /Asia\/Kuala_Lumpur/);
  assert.match(component, /setInterval\(updateClock, 60_000\)/);
  assert.match(component, /@tabler\/icons-react/);
  assert.match(component, /IconDeviceMobile/);
  assert.match(component, /IconQrcode/);
  assert.match(component, /slideshowDisplayConfig\.footerItems\.map/);
  assert.doesNotMatch(component, /setActiveSlide|currentSlideIndex|autoPlay/);
});

test("slideshow reserves 75 percent hero, 25 percent sidebar and 11.5 percent footer", () => {
  assert.match(css, /grid-template-columns: minmax\(0, 3fr\) minmax\(0, 1fr\)/);
  assert.match(css, /grid-template-rows: minmax\(0, 88\.5vh\) 11\.5vh/);
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /overflow: hidden !important/);
  assert.match(css, /object-fit: cover/);
  assert.match(css, /analytics-consent/);
});

test("slideshow has an independent noindex route without site chrome", () => {
  assert.doesNotMatch(page, /OfficialFrame|SiteHeader|SiteFooter/);
  assert.match(page, /robots: \{ index: false/);
  assert.doesNotMatch(nextConfig, /source: "\/slideshow"[\s\S]*destination: "\/tv-slide"/);
  assert.match(nextConfig, /source: "\/slideshow", headers: tvHeaders/);
});
