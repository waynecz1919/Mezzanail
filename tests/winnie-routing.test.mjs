import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const proxy = readFileSync("proxy.ts", "utf8");

test("Winnie hostname root redirects to the manager login", () => {
  const rootRedirect = proxy.match(
    /if \(host === "winnie\.mezzanail\.com" && request\.nextUrl\.pathname === "\/"\) \{[\s\S]*?\}/,
  );

  assert.ok(rootRedirect, "Winnie root guard must be hostname- and path-specific");
  assert.match(rootRedirect[0], /destination\.pathname = "\/manager\/login"/);
  assert.match(rootRedirect[0], /NextResponse\.redirect\(destination, 307\)/);
});

test("public roots pass through and manager/API paths are outside the proxy matcher", () => {
  assert.match(proxy, /return NextResponse\.next\(\)/);
  assert.doesNotMatch(proxy, /host === "www\.mezzanail\.com"/);
  assert.doesNotMatch(proxy, /host === "mezzanail\.com"/);

  const matcher = proxy.match(/matcher:\s*\[([^\]]+)\]/)?.[1];
  assert.ok(matcher, "proxy matcher must remain explicit");
  assert.match(matcher, /"\/"/);
  assert.match(matcher, /"\/login"/);
  for (const path of ["/manager/login", "/manager/", "/api/auth/"]) {
    assert.doesNotMatch(matcher, new RegExp(path.replaceAll("/", "\\/")));
  }
});
