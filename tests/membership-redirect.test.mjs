import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (filePath) => readFileSync(filePath, "utf8");
const memberCenter = read("config/member-center.ts");
const nextConfig = read("next.config.ts");
const navigation = read("config/navigation.ts");
const officialSite = read("components/official-site.tsx");
const membershipBanner = read("components/home/MembershipBanner.tsx");
const rewardsPage = read("app/rewards/page.tsx");
const loginPage = read("app/login/page.tsx");
const sitemap = read("app/sitemap.ts");
const messages = read("lib/official-i18n.ts");

test("legacy membership routes use framework-level permanent redirects", () => {
  assert.match(memberCenter, /https:\/\/credits\.mezzanail\.com\/member-credits/);
  for (const source of ["/rewards", "/login"]) {
    const redirect = new RegExp(
      `source: "${source}",[\\s\\S]*?destination: MEMBER_CENTER_URL,[\\s\\S]*?permanent: true`,
    );
    assert.match(nextConfig, redirect);
  }
  assert.match(rewardsPage, /permanentRedirect\(MEMBER_CENTER_URL\)/);
  assert.match(loginPage, /permanentRedirect\(MEMBER_CENTER_URL\)/);
  assert.doesNotMatch(rewardsPage, /RewardsSite|createPublicMetadata|canonical/);
});

test("public membership links go directly to Member Center in the same tab", () => {
  assert.match(navigation, /href: MEMBER_CENTER_URL/);
  assert.match(officialSite, /target="_self"/);
  assert.match(membershipBanner, /href=\{MEMBER_CENTER_URL\}/);
  assert.match(membershipBanner, /target="_self"/);
});

test("membership labels and sitemap no longer present Rewards as a content page", () => {
  assert.match(messages, /rewards: "Membership"/);
  assert.match(messages, /rewards: "会员中心"/);
  assert.match(messages, /rewards: "Keahlian"/);
  assert.doesNotMatch(sitemap, /\/rewards/);
});
