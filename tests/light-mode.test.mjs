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

test("the active provider cannot reactivate dark mode", () => {
  const provider = read("components/providers.tsx");

  assert.doesNotMatch(provider, /useTheme|setTheme|resolvedTheme|Moon/);
  assert.match(provider, /defaultTheme="light"/);
  assert.match(provider, /enableSystem=\{false\}/);
  assert.match(provider, /forcedTheme="light"/);
});
