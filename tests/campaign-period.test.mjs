import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function loadCampaignModule() {
  const source = await fs.readFile(
    new URL("../lib/promotion/campaign-period.ts", import.meta.url),
    "utf8",
  );
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}

test("campaign is active at 2026-09-30T23:59+08:00", async () => {
  const { isCampaignActive } = await loadCampaignModule();
  assert.equal(
    isCampaignActive(new Date("2026-09-30T23:59:00+08:00")),
    true,
  );
});

test("campaign is inactive at 2026-10-01T00:00+08:00", async () => {
  const { isCampaignActive } = await loadCampaignModule();
  assert.equal(
    isCampaignActive(new Date("2026-10-01T00:00:00+08:00")),
    false,
  );
});
