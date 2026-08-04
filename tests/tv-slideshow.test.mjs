import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const { getDisplaySlides } = await import("../lib/tv-slideshow.ts");

const read = (path) => readFileSync(path, "utf8");
const config = JSON.parse(read("public/data/slideshow.json"));
const component = read("components/tv/tv-slideshow.tsx");
const css = read("components/tv/tv-slideshow.module.css");
const page = read("app/tv-slide/page.tsx");
const nextConfig = read("next.config.ts");
const serviceWorker = read("public/sw-tv-slide.js");

test("TV display has the complete ordered, configurable slide set", () => {
  assert.equal(config.settings.projectName, "Mezzanail TV Display");
  assert.equal(config.slides.length, 11);
  assert.deepEqual(config.slides.map((slide) => slide.displayOrder), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const required = ["id", "type", "title", "subtitle", "image", "mobileImage", "duration", "enabled", "startDate", "endDate", "displayOrder", "qrUrl", "designCode", "category"];
  for (const slide of config.slides) {
    for (const key of required) assert.ok(Object.hasOwn(slide, key), `${slide.id} must define ${key}`);
  }
  assert.equal(config.slides.filter((slide) => slide.type === "artwork").length, 4);
  assert.deepEqual(config.slides.find((slide) => slide.type === "membership").plans, ["RM199", "RM399", "RM599"]);
  assert.equal(config.slides.find((slide) => slide.type === "services").services.length, 6);
});

test("campaign scheduling is inclusive and expires automatically", () => {
  const campaign = config.slides.find((slide) => slide.id === "anniversary-lucky-draw");
  assert.equal(campaign.startDate, "2026-07-26");
  assert.equal(campaign.endDate, "2026-09-30");
  const beforeEnd = Date.parse(`${campaign.endDate}T23:59:59.999+08:00`);
  const afterEnd = Date.parse("2026-10-01T00:00:00.000+08:00");
  assert.ok(beforeEnd < afterEnd);
  const duringCampaign = getDisplaySlides(config, new Set(), new Date("2026-09-30T15:59:59.999Z"));
  const afterCampaign = getDisplaySlides(config, new Set(), new Date("2026-09-30T16:00:00.000Z"));
  assert.ok(duringCampaign.some((slide) => slide.id === campaign.id));
  assert.ok(!afterCampaign.some((slide) => slide.id === campaign.id));
  assert.ok(!getDisplaySlides(config, new Set(["art-minimalist"]), new Date("2026-08-04T00:00:00Z")).some((slide) => slide.id === "art-minimalist"));
  assert.match(read("lib/tv-slideshow.ts"), /slide\.enabled[\s\S]*isSlideScheduled/);
  assert.match(read("lib/tv-slideshow.ts"), /displayOrder/);
});

test("TV assets have AVIF, WebP and original fallbacks", () => {
  for (const slide of config.slides.filter((item) => item.imageAvif)) {
    assert.ok(existsSync(`public${slide.imageAvif}`), `${slide.imageAvif} must exist`);
    assert.ok(existsSync(`public${slide.image}`), `${slide.image} must exist`);
    assert.ok(existsSync(`public${slide.fallbackImage}`), `${slide.fallbackImage} must exist`);
  }
  for (const service of config.slides.find((slide) => slide.type === "services").services) {
    assert.ok(existsSync(`public${service.imageAvif}`));
    assert.ok(existsSync(`public${service.image}`));
    assert.ok(existsSync(`public${service.fallbackImage}`));
  }
});

test("playback supports TV, preview, recovery, controls and safe video", () => {
  assert.match(page, /params\.preview/);
  assert.match(page, /params\.tv/);
  assert.match(component, /event\.code === "Space"/);
  assert.match(component, /event\.key === "ArrowLeft"/);
  assert.match(component, /event\.key === "ArrowRight"/);
  assert.match(component, /key === "f"/);
  assert.match(component, /key === "r"/);
  assert.match(component, /requestFullscreen/);
  assert.match(component, /onDoubleClick/);
  assert.match(component, /visibilitychange/);
  assert.match(component, /muted[\s\S]*playsInline[\s\S]*autoPlay[\s\S]*loop/);
  assert.match(component, /markSlideFailed/);
  assert.match(component, /\[1, 2\]/);
});

test("layout is fullscreen, scroll-free, control-free outside preview, and 5 percent safe", () => {
  assert.doesNotMatch(page, /OfficialFrame|SiteHeader|SiteFooter/);
  assert.match(css, /position: fixed/);
  assert.match(css, /overflow: hidden !important/);
  assert.match(css, /cursor: none/);
  assert.match(css, /padding: 6vh 5vw/);
  assert.match(css, /left: 5vw/);
  assert.match(css, /right: 5vw/);
  assert.match(component, /previewMode \?/);
  assert.match(css, /tv-display-active \.analytics-consent/);
});

test("offline cache and final route are wired without hardcoding the future gallery in the component", () => {
  assert.match(serviceWorker, /precacheShell/);
  assert.match(serviceWorker, /networkFirst/);
  assert.match(serviceWorker, /cacheFirst/);
  assert.match(serviceWorker, /TV_SLIDESHOW_PREFETCH/);
  assert.match(component, /TV_SLIDESHOW_STORAGE_KEY/);
  assert.match(component, /NEXT_PUBLIC_SLIDESHOW_DATA_URL|dataUrl/);
  assert.match(nextConfig, /source: "\/slideshow"/);
  assert.match(nextConfig, /destination: "\/tv-slide"/);
  assert.doesNotMatch(component, /nstudio\.mezzanail\.com/);
  assert.equal(config.slides.find((slide) => slide.id === "nail-gallery-qr").qrUrl, config.settings.galleryFallbackUrl);
});
