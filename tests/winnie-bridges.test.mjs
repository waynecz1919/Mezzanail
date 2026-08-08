import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const {
  bridgeConfigurationMissing,
  bridgeNoData,
  bridgePermissionDenied,
  bridgeStaleData,
  bridgeSuccess,
  bridgeUpstreamUnavailable,
} = await import("../lib/winnie/bridges/result.ts");

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const commonContracts = read("lib/winnie/bridges/contracts.ts");
const appointmentContracts = read("lib/winnie/bridges/appointments/contracts.ts");
const memberContracts = read("lib/winnie/bridges/members/contracts.ts");
const teamContracts = read("lib/winnie/bridges/team-hub/contracts.ts");
const appointmentBridge = read("lib/winnie/bridges/appointments/bridge.ts");
const memberBridge = read("lib/winnie/bridges/members/bridge.ts");
const teamBridge = read("lib/winnie/bridges/team-hub/bridge.ts");
const access = read("lib/winnie/bridges/access.ts");
const accessCore = read("lib/winnie/bridges/access-core.ts");
const queries = read("lib/winnie/bridges/queries.ts");
const registry = read("lib/winnie/bridges/registry.ts");

test("bridge results expose normalized status and freshness metadata", () => {
  const at = "2026-08-08T00:00:00.000Z";
  assert.deepEqual(bridgeSuccess("appointment-system", [{ id: "A-1" }], at), {
    status: "success",
    data: [{ id: "A-1" }],
    source: "appointment-system",
    fetchedAt: at,
    isStale: false,
  });
  assert.deepEqual(bridgeNoData("member-center", at), {
    status: "no_data",
    data: null,
    source: "member-center",
    fetchedAt: at,
    isStale: false,
  });
  assert.deepEqual(bridgeStaleData("team-hub", [{ staffId: "S-1" }], at), {
    status: "stale_data",
    data: [{ staffId: "S-1" }],
    source: "team-hub",
    fetchedAt: at,
    isStale: true,
    message: "The available data may be out of date.",
  });
});

test("bridge failures are normalized and do not expose upstream errors", () => {
  const denied = bridgePermissionDenied("appointment-system");
  const unavailable = bridgeUpstreamUnavailable("member-center");
  const missing = bridgeConfigurationMissing("team-hub");

  assert.equal(denied.status, "permission_denied");
  assert.equal(unavailable.status, "upstream_unavailable");
  assert.equal(missing.status, "configuration_missing");
  for (const result of [denied, unavailable, missing]) {
    assert.equal(result.data, null);
    assert.equal(result.isStale, false);
    assert.ok(result.fetchedAt);
    assert.equal(Object.hasOwn(result, "error"), false);
    assert.equal(Object.hasOwn(result, "stack"), false);
  }
});

test("normalized Winnie contracts cover appointment, member and team summaries", () => {
  for (const field of [
    "id",
    "customerId",
    "customerName",
    "startAt",
    "endAt",
    "serviceName",
    "staffId",
    "staffName",
    "status",
    "confirmationStatus",
    "reminderStatus",
  ]) assert.match(appointmentContracts, new RegExp(`\\b${field}\\b`));

  for (const field of ["customerId", "memberId", "name", "phone", "discountRate", "memberStatus"]) {
    assert.match(memberContracts, new RegExp(`\\b${field}\\b`));
  }
  for (const field of ["staffId", "name", "role", "workStatus", "attendanceStatus"]) {
    assert.match(teamContracts, new RegExp(`\\b${field}\\b`));
  }
  for (const status of [
    "success",
    "no_data",
    "permission_denied",
    "upstream_unavailable",
    "stale_data",
    "configuration_missing",
  ]) assert.match(commonContracts, new RegExp(status));
});

test("module bridges expose read methods only", () => {
  assert.match(appointmentBridge, /getTodayAppointments/);
  assert.match(appointmentBridge, /getAppointmentSummary/);
  assert.match(memberBridge, /getMemberSummary/);
  assert.match(teamBridge, /getTeamStatus/);

  const bridgeInterfaces = [appointmentBridge, memberBridge, teamBridge].join("\n");
  for (const writeMethod of [
    "createAppointment",
    "updateCredit",
    "deleteTransaction",
    "changeSchedule",
    "sendWhatsApp",
    "approveFamilySharing",
  ]) assert.doesNotMatch(bridgeInterfaces, new RegExp(writeMethod));
});

test("unconfigured member and team adapters fail closed until a future source is approved", () => {
  for (const path of [
    "lib/winnie/bridges/members/unconfigured.ts",
    "lib/winnie/bridges/team-hub/unconfigured.ts",
  ]) {
    const source = read(path);
    assert.match(source, /bridgeConfigurationMissing/);
    assert.doesNotMatch(source, /process\.env|fetch\(|database|D1Database/);
  }
  assert.match(registry, /ProductionAppointmentBridge/);
  assert.match(registry, /APPOINTMENT_READ_API_URL/);
  assert.match(registry, /WINNIE_APPOINTMENT_READ_TOKEN/);
  assert.doesNotMatch(registry, /NEXT_PUBLIC_APPOINTMENT|NEXT_PUBLIC_WINNIE_APPOINTMENT/);
  assert.match(registry, /UnconfiguredMemberBridge/);
  assert.match(registry, /UnconfiguredTeamHubBridge/);
});

test("server bridge reads retain the existing Winnie permission boundary", () => {
  assert.match(access, /import "server-only"/);
  assert.match(access, /runBridgeReadWithPermissions/);
  assert.match(accessCore, /permissions\.includes\(permission\)/);
  assert.match(access, /bridgePermissionDenied/);
  assert.match(access, /bridgeUpstreamUnavailable/);
  assert.match(queries, /permission: "appointments\.view"/);
  assert.match(queries, /permission: "member_credit\.view"/);
  assert.match(queries, /permission: "team_hub\.view"/);
});

test("bridge documentation and honest disconnected placeholders are present", () => {
  assert.equal(existsSync(new URL("../docs/winnie/module-bridge-foundation.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../docs/winnie/integration-inventory.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../docs/winnie/appointment-read-bridge.md", import.meta.url)), true);
  const placeholder = read("components/winnie/module-placeholder.tsx");
  assert.match(placeholder, /Bridge ready — source not connected/);
  assert.match(placeholder, /Read-only foundation/);
});
