import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(p, "utf8");

test("old campaign short links redirect permanently to /promotion", () => {
  for (const route of ["luckydraw", "lucky-draw", "promo"]) {
    const routeFile = `app/${route}/route.ts`;
    assert.equal(existsSync(routeFile), true);
    assert.equal(existsSync(`app/${route}/page.tsx`), false);
    const handler = read(routeFile);
    assert.match(handler, /NextResponse\.redirect\(new URL\("\/promotion", request\.url\), 308\)/);
    assert.match(handler, /export const HEAD = GET/);
  }
});

test("the seasonal /deepavali short link redirects temporarily to the current offer", () => {
  const routeFile = "app/deepavali/route.ts";
  assert.equal(existsSync(routeFile), true);
  assert.equal(existsSync("app/deepavali/page.tsx"), false);
  const handler = read(routeFile);
  assert.match(handler, /NextResponse\.redirect\(new URL\("\/promotion#current-offer", request\.url\), 307\)/);
  assert.match(handler, /export const HEAD = GET/);
});

test("promotion document title is absolute while social titles keep the shorter brand", () => {
  const page = read("app/promotion/page.tsx");
  assert.match(page, /title: \{ absolute: "Deepavali Gel Glow – Gelish Manicure RM68 \| Mezzanail Nail Studio" \}/);
  assert.match(page, /openGraph:\s*\{\s*title: promotionTitle/);
  assert.match(page, /twitter:\s*\{\s*card: "summary_large_image",\s*title: promotionTitle/);
  assert.match(page, /const promotionTitle = `\$\{currentOffer\.copy\.en\.title\} – \$\{currentOffer\.copy\.en\.service\} RM\$\{currentOffer\.offerPrice\} \| Mezzanail`/);
});

test("promotion footer shows the localized current offer only while active", () => {
  const experience = read("components/promotion/promotion-experience.tsx");
  const footerStart = experience.indexOf('<footer className="promotion-footer">');
  const footerEnd = experience.indexOf("</footer>", footerStart);
  assert.ok(footerStart >= 0 && footerEnd > footerStart);
  const footer = experience.slice(footerStart, footerEnd);
  assert.match(experience, /const offerActive = useOfferActive\(\)/);
  assert.match(footer, /\{offerActive && <span>\{currentOffer\.copy\[language\]\.title\}<\/span>\}/);
  assert.doesNotMatch(footer, /footerCampaign/);
});
