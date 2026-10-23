import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const campaignCopy = read("lib/promotion/campaign-copy.ts");
const termsCopy = campaignCopy.slice(campaignCopy.indexOf("export const termsCopy ="));
const aboutPage = read("app/about/page.tsx");
const homepagePage = read("app/page.tsx");
const jackpotPreview = read("app/anniversary-jackpot/preview/page.tsx");

test("promotion terms list Apple Watch SE 3 and the release date in every language", () => {
  assert.match(termsCopy, /lastUpdatedDate: "23 October 2026"/);
  assert.match(termsCopy, /lastUpdatedDate: "2026年10月23日"/);
  assert.match(termsCopy, /lastUpdatedDate: "23 Oktober 2026"/);
  assert.match(termsCopy, /Prizes include one Dyson Supersonic™ Travel Hair Dryer, one Apple Watch SE 3, one Xiaomi Robot Vacuum/);
  assert.match(termsCopy, /奖品包括一台 Dyson Supersonic™ 旅行吹风机、一只 Apple Watch SE 3、一台 Xiaomi 扫地机器人/);
  assert.match(termsCopy, /Hadiah termasuk satu Dyson Supersonic™ Travel Hair Dryer, satu Apple Watch SE 3, satu Xiaomi Robot Vacuum/);
  assert.doesNotMatch(termsCopy, /HUAWEI Watch Fit 5/);
});

test("about title is absolute and does not repeat the metadata template brand", () => {
  assert.match(aboutPage, /title: \{ absolute: "About Us \| Mezzanail Nail Studio" \}/);
});

test("homepage Open Graph and Twitter titles include the brand exactly once", () => {
  const expected = "Premium Nail Care in Melaka | Mezzanail Nail Studio";
  assert.match(homepagePage, new RegExp(`openGraph:[\\s\\S]*?title: "${expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  assert.match(homepagePage, new RegExp(`twitter:[\\s\\S]*?title: "${expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
});

test("jackpot preview returns not found outside development", () => {
  assert.match(jackpotPreview, /if \(process\.env\.NODE_ENV !== "development"\) notFound\(\);/);
});
