import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const dashboard = read("app/manager/page.tsx");
const shell = read("components/winnie/manager-shell.tsx");
const profile = read("app/manager/profile/page.tsx");

test("dashboard presents operational KPI placeholders without fabricated data", () => {
  for (const label of ["Today’s Appointments", "Unreplied WhatsApp", "Pending Actions"]) {
    assert.match(dashboard, new RegExp(label));
  }
  assert.match(dashboard, /Not connected yet/);
  assert.match(dashboard, /<p className="winnie-kpi-value">--<\/p>/);
  assert.doesNotMatch(dashboard, /Module bridge|Phase 2C/);
  assert.doesNotMatch(dashboard, /winnie-kpi-label">Role|winnie-kpi-label">Permissions/);
});

test("quick access uses permission-driven operational actions and labels disconnected actions", () => {
  for (const label of ["New Appointment", "Find Member", "Send Reminder", "Ask Winnie"]) {
    assert.match(dashboard, new RegExp(label));
  }
  assert.match(dashboard, /Available after system connection/);
  assert.match(dashboard, /hasPermission\(session\.user\.permissions, action\.permission\)/);
  assert.match(dashboard, /aria-disabled="true"/);
  assert.match(dashboard, /href: "\/manager\/winnie-tools"/);
});

test("sidebar groups visible WhatsApp routes without changing permission filtering", () => {
  assert.match(shell, /winnieNavigationItems\.filter/);
  assert.match(shell, /hasPermission\(user\.permissions/);
  assert.match(shell, /item\.id === "whatsapp" \|\| item\.id === "whatsapp-service"/);
  assert.match(shell, /winnie-nav-group-label">WhatsApp/);
  assert.match(shell, /Secure access/);
  assert.match(shell, /roleLabel\(user\.role\)/);
});

test("role and permission details remain available in Account Access", () => {
  assert.match(profile, /Account Access/);
  assert.match(profile, />Role</);
  assert.match(profile, />Permissions</);
  assert.match(profile, /session\.user\.permissions\.length/);
});
