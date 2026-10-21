import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const landingPage = readFileSync(join(root, "app/anniversary-jackpot/page.tsx"), "utf8");
const landingStyles = readFileSync(join(root, "app/anniversary-jackpot/landing.module.css"), "utf8");
const staffPage = readFileSync(join(root, "app/anniversary-jackpot/staff/page.tsx"), "utf8");
const loginPage = readFileSync(join(root, "app/anniversary-jackpot/login/page.tsx"), "utf8");

test("public jackpot landing is the approved static artwork with one staff login link", () => {
  assert.match(landingPage, /href="\/anniversary-jackpot\/login"/);
  assert.match(landingPage, /aria-label="Staff login"/);
  assert.doesNotMatch(landingPage, /JackpotConsole|loadJackpotState|\/api\/anniversary-jackpot|onClick/);
  assert.match(landingStyles, /anniversary-jackpot-landing-approved\.png/);
  assert.match(landingStyles, /aspect-ratio:\s*1672\s*\/\s*941/);
  assert.match(landingStyles, /background-size:\s*100%\s+100%/);
  assert.match(landingStyles, /min-width:\s*44px/);
  assert.match(landingStyles, /min-height:\s*44px/);
});

test("staff console stays session-gated and staff login redirects to it", () => {
  assert.match(staffPage, /const session = await getStaffSession\(\)/);
  assert.match(staffPage, /if \(!session\) redirect\("\/anniversary-jackpot\/login"\)/);
  assert.match(loginPage, /redirect\("\/anniversary-jackpot\/staff"\)/);
  assert.match(loginPage, /redirectTo="\/anniversary-jackpot\/staff"/);
});
