import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the site is forced to light mode", () => {
  const layout = read("app/layout.tsx");
  const providers = read("components/providers.tsx");
  const globals = read("app/globals.css");

  assert.match(layout, /colorScheme:\s*"light"/);
  assert.doesNotMatch(layout, /prefers-color-scheme:\s*dark/);
  assert.match(providers, /defaultTheme="light"/);
  assert.match(providers, /enableSystem=\{false\}/);
  assert.match(providers, /forcedTheme="light"/);
  assert.match(providers, /localStorage\.removeItem\("theme"\)/);
  assert.match(globals, /:root\{color-scheme:light;/);
  assert.match(globals, /html,body\{background-color:#fff;color:#111\}/);
  assert.doesNotMatch(globals, /@custom-variant\s+dark/);
  assert.doesNotMatch(globals, /\.dark\s*\{/);
  assert.doesNotMatch(globals, /prefers-color-scheme:\s*dark/);
});

test("theme controls cannot reactivate dark mode", () => {
  const controls = `${read("components/login-tools.tsx")}\n${read("components/rewards-site.tsx")}`;

  assert.doesNotMatch(controls, /useTheme|setTheme|resolvedTheme|Moon/);
  assert.doesNotMatch(controls, /Toggle colour mode/);
  assert.match(controls, /Light colour mode/);
});
