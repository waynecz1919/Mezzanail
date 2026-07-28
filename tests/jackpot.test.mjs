import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const migration = read("db/migrations/003_create_anniversary_jackpot.sql");
const service = read("lib/jackpot/service.ts");
const core = read("lib/jackpot/core.ts");
const consolePage = read("components/jackpot/jackpot-console.tsx");
const participantRoute = read("app/api/anniversary-jackpot/participants/route.ts");
const importRoute = read("app/api/anniversary-jackpot/participants/import/route.ts");
const lockRoute = read("app/api/anniversary-jackpot/participants/lock/route.ts");
const drawRoute = read("app/api/anniversary-jackpot/draw/route.ts");
const redrawRoute = read("app/api/anniversary-jackpot/draws/[drawId]/redraw/route.ts");
const prizeRoute = read("app/api/anniversary-jackpot/prizes/route.ts");
const settingsRoute = read("app/api/anniversary-jackpot/settings/route.ts");
const auth = read("lib/redeem/auth.ts");
const config = read("next.config.ts");
const css = read("app/anniversary-jackpot/jackpot.css");

test("jackpot route is private and reuses role-based staff authentication", () => {
  assert.match(read("app/anniversary-jackpot/page.tsx"), /getStaffSession/);
  assert.match(read("app/anniversary-jackpot/layout.tsx"), /index: false/);
  assert.match(config, /\/anniversary-jackpot\/:path\*/);
  assert.match(config, /\/api\/anniversary-jackpot\/:path\*/);
  for (const role of ["owner", "admin", "staff"]) assert.match(auth, new RegExp(`"${role}"`));
  assert.match(auth, /process\.env\.JACKPOT_STAFF_USERS/);
  assert.match(drawRoute, /isJackpotAdmin/);
});

test("participant import consolidates tickets and reports invalid and duplicate records", () => {
  assert.match(core, /existing\.ticketCount \+= ticketValue/);
  assert.match(core, /duplicateMembers \+= 1/);
  assert.match(core, /invalidNumbers \+= 1/);
  assert.match(core, /ineligibleRecords \+= 1/);
  assert.match(importRoute, /participant_list_locked = FALSE/);
  assert.match(importRoute, /participant_list_imported/);
  assert.match(importRoute, /promotion_entries/);
});

test("admins can add one participant directly with validation and audit protection", () => {
  assert.match(consolePage, /Add Participant/);
  assert.match(consolePage, /\/api\/anniversary-jackpot\/participants/);
  assert.match(participantRoute, /normalizePhone/);
  assert.match(participantRoute, /isJackpotAdmin/);
  assert.match(participantRoute, /participant_list_locked = FALSE/);
  assert.match(participantRoute, /has_draws = FALSE/);
  assert.match(participantRoute, /DUPLICATE_PARTICIPANT/);
  assert.match(participantRoute, /participant_added/);
  assert.match(participantRoute, /'manual'/);
});

test("locked participant lists cannot be imported or silently unlocked", () => {
  assert.match(importRoute, /Unlock the participant list before importing/);
  assert.match(lockRoute, /session\.role !== "owner"/);
  assert.match(lockRoute, /An unlock reason is required/);
  assert.match(lockRoute, /participant_list_locked/);
  assert.match(lockRoute, /participant_list_unlocked/);
});

test("weighted selection uses secure server randomness and ticket counts", () => {
  assert.match(core, /randomInt\(1, totalTickets \+ 1\)/);
  assert.match(service, /SUM\(pa\.ticket_count\) OVER/);
  assert.match(service, /cumulative_tickets >= \$4/);
  assert.doesNotMatch(`${service}\n${consolePage}`, /Math\.random/);
});

test("draw requests are idempotent and concurrent draws are database-guarded", () => {
  assert.match(migration, /UNIQUE \(campaign_id, request_id\)/);
  assert.match(migration, /UNIQUE \(prize_id, draw_sequence\)/);
  assert.match(migration, /jackpot_one_open_draw_per_campaign/);
  assert.match(service, /pg_advisory_xact_lock/);
  assert.match(service, /ON CONFLICT \(campaign_id, request_id\) DO NOTHING/);
  assert.match(service, /status IN \('pending', 'unreachable'\)/);
});

test("the frontend receives the server result before starting animation", () => {
  assert.match(consolePage, /const result = await api<DrawResponse>\("\/api\/anniversary-jackpot\/draw"/);
  assert.match(consolePage, /showWinnerAfterAnimation\(result\.winner\)/);
  assert.match(consolePage, /setBusy\(true\)/);
  assert.match(consolePage, /disabled=\{[\s\S]*spinning[\s\S]*busy[\s\S]*openDraw/);
  assert.match(css, /12\.8s cubic-bezier/);
  assert.match(consolePage, /return 7200 \+ hash/);
  assert.match(consolePage, /}, 12800\)/);
});

test("confirmation decrements a prize once and no winner is auto-confirmed", () => {
  assert.match(service, /remaining_quantity = pr\.remaining_quantity - 1/);
  assert.match(service, /status = 'confirmed'/);
  assert.match(service, /confirmed_by = \$3/);
  assert.match(consolePage, /Confirm Winner/);
  assert.doesNotMatch(consolePage, /showWinnerAfterAnimation[\s\S]{0,300}updateWinner\("confirm"\)/);
});

test("multiple-win policy defaults off and supports global or prize overrides", () => {
  assert.match(migration, /allow_multiple_wins BOOLEAN NOT NULL DEFAULT FALSE/);
  assert.match(service, /c\.allow_multiple_wins = TRUE/);
  assert.match(service, /pr\.allow_previous_winner = TRUE/);
  assert.match(settingsRoute, /campaign_rules_updated/);
  assert.match(prizeRoute, /allow_previous_winner/);
});

test("the Jackpot is single-unit, final, and blocked by unfinished ordinary prizes", () => {
  assert.match(migration, /is_jackpot = FALSE OR quantity = 1/);
  assert.match(migration, /jackpot_one_grand_prize/);
  assert.match(service, /pr\.draw_order = \(/);
  assert.match(service, /ordinary\.is_jackpot = FALSE/);
  assert.match(service, /ordinary\.remaining_quantity > 0/);
});

test("redraw preserves the old result and requires a reason", () => {
  assert.match(redrawRoute, /redrawReasons/);
  assert.match(redrawRoute, /reason\.startsWith\("Other:"\)/);
  assert.match(service, /SET status = 'voided'/);
  assert.match(service, /void_reason = \$4/);
  assert.match(service, /redraw_performed/);
  assert.doesNotMatch(service, /DELETE FROM jackpot_draws/);
  assert.match(consolePage, /This will void the Jackpot winner and create a new draw/);
});

test("live and winner views expose only masked identity data", () => {
  assert.match(service, /pa\.phone_last4/);
  assert.match(consolePage, /\*\*\*\*\{activeWinner\.phoneLast4\}/);
  assert.doesNotMatch(consolePage, /phone_number/);
  assert.match(read("app/api/anniversary-jackpot/winners/export/route.ts"), /phone_last4/);
});

test("audit log covers required administrative events and exports are available", () => {
  for (const action of [
    "participant_list_imported",
    "participant_added",
    "participant_list_locked",
    "participant_list_unlocked",
    "prize_created",
    "prize_updated",
    "draw_initiated",
    "winner_generated",
    "winner_confirmed",
    "draw_voided",
    "redraw_performed",
    "export_performed",
  ]) {
    assert.match(`${service}\n${participantRoute}\n${importRoute}\n${lockRoute}\n${prizeRoute}\n${read("app/api/anniversary-jackpot/winners/export/route.ts")}`, new RegExp(action));
  }
  assert.match(consolePage, /winners\/export/);
  assert.match(consolePage, /winners\/pdf/);
  assert.match(consolePage, /window\.print/);
});

test("mobile and fullscreen layouts avoid horizontal overflow", () => {
  assert.match(css, /\.jackpot-root\{[^}]*overflow-x:hidden/);
  assert.match(css, /\.jackpot-root\.is-live/);
  assert.match(css, /min-height:100dvh/);
  assert.match(css, /@media\(max-width:680px\)/);
  assert.match(consolePage, /requestFullscreen/);
});
