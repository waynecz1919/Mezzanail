import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (filePath) => readFileSync(filePath, "utf8");
const memberCenter = read("config/member-center.ts");
const nextConfig = read("next.config.ts");
const navigation = read("config/navigation.ts");
const officialSite = read("components/official-site.tsx");
const membershipBanner = read("components/home/MembershipBanner.tsx");
const sitemap = read("app/sitemap.ts");
const messages = read("lib/official-i18n.ts");

test("legacy membership routes use framework-level permanent redirects", () => {
  const destinationMatch = memberCenter.match(
    /MEMBER_CENTER_URL\s*=\s*[\"']([^\"']+)[\"']/,
  );
  assert.ok(destinationMatch, "MEMBER_CENTER_URL must be declared");
  const destination = destinationMatch[1];
  assert.equal(destination, "https://member.mezzanail.com/member-credits");
  assert.match(destination, /^https:\/\//);
  assert.doesNotMatch(destination, /credits\.mezzanail\.com/);
  assert.doesNotMatch(destination, /\/(?:login|rewards)(?:\/|$)/);

  for (const source of ["/rewards", "/login"]) {
    const redirect = new RegExp(
      `source: "${source}",[\\s\\S]*?destination: MEMBER_CENTER_URL,[\\s\\S]*?permanent: true`,
    );
    assert.match(nextConfig, redirect);
  }
  assert.equal(existsSync("app/login/page.tsx"), false);
  assert.equal(existsSync("app/rewards/page.tsx"), false);
});

test("legacy redirects preserve query strings through Next.js defaults", () => {
  assert.doesNotMatch(nextConfig, /source: "\/(?:rewards|login)"[\s\S]*?has:/);
  assert.doesNotMatch(nextConfig, /source: "\/(?:rewards|login)"[\s\S]*?missing:/);
  assert.match(nextConfig, /destination: MEMBER_CENTER_URL/);
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
