import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const config = read("config/slideshow-display.ts");
const component = read("components/slideshow/mezzanail-slideshow.tsx");
const css = read("components/slideshow/mezzanail-slideshow.module.css");
const tvCss = read("components/tv/tv-slideshow.module.css");
const page = read("app/slideshow/page.tsx");
const nextConfig = read("next.config.ts");

test("slideshow keeps the anniversary feature as one presentation slide", () => {
  assert.match(config, /slides: \[/);
  assert.match(config, /id: "seventh-anniversary"/);
  assert.match(config, /type: "artwork"/);
  assert.match(config, /Celebrating Beauty Together/);
  assert.match(config, /displayOrder: 1\.5/);
  assert.match(config, /duration: 10_000/);
  assert.match(config, /enabled: true/);
  assert.match(config, /value: "RM80 BONUS CREDIT"/);
  assert.match(config, /10:30 AM – 7:00 PM/);
  assert.match(config, /label: "Birthday Treat"/);
  assert.match(config, /label: "Every Month"/);
  assert.doesNotMatch(config, /GET RM80 BONUS CREDIT/);
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
  assert.match(component, /QRCode\.toDataURL/);
  assert.match(component, /<TVSlideshow/);
  assert.match(component, /additionalSlides=\{slideshowDisplayConfig\.slides\}/);
  assert.match(component, /embedded/);
  assert.doesNotMatch(component, /setActiveSlideIndex|rotationTimer/);
  assert.doesNotMatch(component, /IconDeviceMobile|IconQrcode/);
  assert.match(component, /slideshowDisplayConfig\.footerItems\.map/);
});

test("slideshow consumes the original managed slide source without replacing it", () => {
  assert.match(page, /public\/data\/slideshow\.json/);
  assert.match(page, /NEXT_PUBLIC_SLIDESHOW_DATA_URL/);
  assert.match(page, /initialConfig=\{slideshowConfig as TVSlideshowConfig\}/);
  assert.match(page, /params\.preview/);
  assert.match(page, /params\.tv/);
});

test("member QR uses local generation with scan-safe settings and the exact target", () => {
  assert.match(config, /https:\/\/member\.mezzanail\.com\/member-credits/);
  assert.match(config, /displayUrl: "member\.mezzanail\.com"/);
  assert.match(config, /title: "SCAN TO OPEN"/);
  assert.match(config, /subtitle: "MEMBER CENTER"/);
  assert.match(component, /width: 640/);
  assert.match(component, /margin: 4/);
  assert.match(component, /errorCorrectionLevel: "H"/);
  assert.match(component, /dark: "#000000ff"/);
  assert.match(component, /light: "#ffffffff"/);
  assert.match(css, /object-fit: contain/);
  assert.match(css, /--qr-background: #ffffff/);
});

test("slideshow reserves 75 percent hero, 25 percent sidebar and 14 percent footer", () => {
  assert.match(css, /grid-template-columns: minmax\(0, 3fr\) minmax\(0, 1fr\)/);
  assert.match(css, /grid-template-rows: minmax\(0, 86vh\) 14vh/);
  assert.match(css, /grid-template-rows: 15% 25% 46% 14%/);
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /overflow: hidden !important/);
  assert.match(tvCss, /object-fit: cover/);
  assert.match(css, /analytics-consent/);
  assert.match(css, /--ink: #302724/);
  assert.match(css, /--rose: #a74757/);
  assert.match(css, /--gold: #b28a3b/);
  assert.match(css, /--ivory: #fbf6ee/);
  assert.match(css, /width: clamp\(176px, 13vw, 260px\)/);
  assert.match(css, /font-size: clamp\(20px, 1\.45vw, 32px\)/);
});

test("slideshow has an independent noindex route without site chrome", () => {
  assert.doesNotMatch(page, /OfficialFrame|SiteHeader|SiteFooter/);
  assert.match(page, /robots: \{ index: false/);
  assert.doesNotMatch(nextConfig, /source: "\/slideshow"[\s\S]*destination: "\/tv-slide"/);
  assert.match(nextConfig, /source: "\/slideshow", headers: tvHeaders/);
});
