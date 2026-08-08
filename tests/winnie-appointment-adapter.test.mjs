import assert from "node:assert/strict";
import test from "node:test";

const {
  APPOINTMENT_SALON_TIMEZONE,
  ProductionAppointmentBridge,
  normalizeProductionAppointment,
} = await import("../lib/winnie/bridges/appointments/production.ts");
const { runBridgeReadWithPermissions } = await import("../lib/winnie/bridges/access-core.ts");

const BASE_URL = "https://appointment.example/api/integrations/winnie/appointments";
const TOKEN = "test-read-token";
const NOW = Date.UTC(2026, 7, 8, 8, 2, 0);

const appointment = (overrides = {}) => ({
  appointmentId: "APT-1001",
  customerId: null,
  date: "2026-08-08",
  time: "14:30",
  customerName: "Amanda Lee",
  phoneLast4: "1332",
  service: "Premium Gel Manicure",
  services: ["Premium Gel Manicure"],
  pax: 1,
  status: "Confirmed",
  reminderState: "Sent",
  staffId: "STAFF-2",
  duration: 90,
  endTime: "16:00",
  ...overrides,
});

const todayPayload = (appointments, overrides = {}) => ({
  appointments,
  timezone: APPOINTMENT_SALON_TIMEZONE,
  generatedAt: "08/08/2026 4:00 PM",
  ...overrides,
});

const jsonResponse = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { "content-type": "application/json" },
});

const bridge = (fetchImpl, overrides = {}) => new ProductionAppointmentBridge({
  baseUrl: BASE_URL,
  token: TOKEN,
  fetchImpl,
  now: () => NOW,
  ...overrides,
});

test("valid today read uses the fixed server-only GET contract and normalizes data", async () => {
  let call;
  const result = await bridge(async (url, init) => {
    call = { url, init };
    return jsonResponse(todayPayload([appointment()]));
  }).getTodayAppointments();

  assert.equal(call.url, `${BASE_URL}/today`);
  assert.equal(call.init.method, "GET");
  assert.equal(call.init.headers.Authorization, `Bearer ${TOKEN}`);
  assert.equal(call.init.cache, "no-store");
  assert.equal(call.init.redirect, "error");
  assert.equal(result.status, "success");
  assert.equal(result.source, "appointment-system");
  assert.equal(result.fetchedAt, "2026-08-08T08:00:00.000Z");
  assert.equal(result.isStale, false);
  assert.deepEqual(result.data[0], {
    id: "APT-1001",
    customerId: null,
    customerName: "Amanda Lee",
    startAt: "2026-08-08T06:30:00.000Z",
    endAt: "2026-08-08T08:00:00.000Z",
    serviceName: "Premium Gel Manicure",
    staffId: "STAFF-2",
    staffName: null,
    status: "confirmed",
    confirmationStatus: "confirmed",
    reminderStatus: "sent",
  });
});

test("a successful empty today response is no_data, not unavailable", async () => {
  const result = await bridge(async () => jsonResponse(todayPayload([]))).getTodayAppointments();
  assert.equal(result.status, "no_data");
  assert.equal(result.data, null);
  assert.equal(result.source, "appointment-system");
});

test("salon-local values are converted from Asia/Kuala_Lumpur explicitly", () => {
  const normalized = normalizeProductionAppointment(appointment({
    date: "2026-12-31",
    time: "23:30",
    endTime: "2027-01-01 00:30",
  }));
  assert.equal(normalized.startAt, "2026-12-31T15:30:00.000Z");
  assert.equal(normalized.endAt, "2026-12-31T16:30:00.000Z");
});

test("known Appointment statuses map to controlled Winnie states", () => {
  const cases = [
    ["Pending", "scheduled", "pending"],
    ["Reminder Due", "scheduled", "pending"],
    ["Reminder Sent", "scheduled", "pending"],
    ["Confirmed", "confirmed", "confirmed"],
    ["Reschedule Requested", "scheduled", "pending"],
    ["Completed", "completed", "not_required"],
    ["Cancelled", "cancelled", "declined"],
    ["No Show", "no_show", "not_required"],
  ];
  for (const [upstream, status, confirmationStatus] of cases) {
    const normalized = normalizeProductionAppointment(appointment({ status: upstream }));
    assert.equal(normalized.status, status, upstream);
    assert.equal(normalized.confirmationStatus, confirmationStatus, upstream);
  }
});

test("unknown statuses do not flow into Winnie UI logic", () => {
  const normalized = normalizeProductionAppointment(appointment({
    status: "Surprise Status",
    reminderState: "Custom Reminder",
  }));
  assert.equal(normalized.status, "unknown");
  assert.equal(normalized.confirmationStatus, "unknown");
  assert.equal(normalized.reminderStatus, "unknown");
});

test("missing optional identity and staffing fields remain null", () => {
  const normalized = normalizeProductionAppointment(appointment({
    customerId: undefined,
    staffId: undefined,
    service: undefined,
    services: undefined,
    duration: undefined,
    endTime: undefined,
  }));
  assert.equal(normalized.customerId, null);
  assert.equal(normalized.staffId, null);
  assert.equal(normalized.staffName, null);
  assert.equal(normalized.serviceName, "");
  assert.equal(normalized.endAt, null);
  assert.equal(Object.hasOwn(normalized, "phone"), false);
  assert.equal(Object.hasOwn(normalized, "phoneLast4"), false);
});

test("missing configuration fails closed without an upstream call", async () => {
  let calls = 0;
  const adapter = new ProductionAppointmentBridge({
    baseUrl: BASE_URL,
    token: "",
    fetchImpl: async () => {
      calls += 1;
      return jsonResponse({});
    },
    now: () => NOW,
  });
  const result = await adapter.getTodayAppointments();
  assert.equal(result.status, "configuration_missing");
  assert.equal(calls, 0);
});

test("permission denial returns before invoking the bridge read", async () => {
  let calls = 0;
  const result = await runBridgeReadWithPermissions({
    permissions: ["dashboard.view"],
    permission: "appointments.view",
    read: async () => {
      calls += 1;
      return { status: "success" };
    },
    permissionDenied: () => ({ status: "permission_denied" }),
    upstreamUnavailable: () => ({ status: "upstream_unavailable" }),
  });
  assert.equal(result.status, "permission_denied");
  assert.equal(calls, 0);
});

test("upstream authentication failures map to configuration_missing", async () => {
  for (const status of [401, 403]) {
    const result = await bridge(async () => jsonResponse({ error: "secret detail" }, status))
      .getTodayAppointments();
    assert.equal(result.status, "configuration_missing");
    assert.doesNotMatch(result.message, /secret detail|token/i);
  }
});

test("appointment 400 and 404 responses map to no_data", async () => {
  for (const status of [400, 404]) {
    const result = await bridge(async () => jsonResponse({ error: "raw upstream" }, status))
      .getAppointmentSummary("APT-404");
    assert.equal(result.status, "no_data");
    assert.equal(Object.hasOwn(result, "error"), false);
  }
});

test("5xx and malformed JSON map to upstream_unavailable", async () => {
  const unavailable = await bridge(async () => jsonResponse({ error: "database trace" }, 500))
    .getTodayAppointments();
  assert.equal(unavailable.status, "upstream_unavailable");
  assert.doesNotMatch(unavailable.message, /database trace/);

  const malformed = await bridge(async () => new Response("not-json", { status: 200 }))
    .getTodayAppointments();
  assert.equal(malformed.status, "upstream_unavailable");
});

test("the bounded timeout aborts once and maps to upstream_unavailable", async () => {
  let calls = 0;
  const result = await bridge((_url, init) => {
    calls += 1;
    return new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    });
  }, { timeoutMs: 5 }).getTodayAppointments();
  assert.equal(result.status, "upstream_unavailable");
  assert.equal(calls, 1);
});

test("old generatedAt metadata returns controlled stale_data", async () => {
  const result = await bridge(async () => jsonResponse(todayPayload(
    [appointment()],
    { generatedAt: "08/08/2026 3:50 PM" },
  ))).getTodayAppointments();
  assert.equal(result.status, "stale_data");
  assert.equal(result.fetchedAt, "2026-08-08T07:50:00.000Z");
  assert.equal(result.isStale, true);
  assert.equal(result.data.length, 1);
});

test("by-ID success uses only the encoded fixed path and normalizes the record", async () => {
  let calledUrl;
  const result = await bridge(async (url) => {
    calledUrl = url;
    return jsonResponse({
      appointment: appointment({ appointmentId: "APT_2002" }),
      timezone: APPOINTMENT_SALON_TIMEZONE,
      generatedAt: "08/08/2026 4:00 PM",
    });
  }).getAppointmentSummary("APT_2002");
  assert.equal(calledUrl, `${BASE_URL}/APT_2002`);
  assert.equal(result.status, "success");
  assert.equal(result.data.id, "APT_2002");
});

test("invalid IDs are rejected locally without expanding the upstream route", async () => {
  let calls = 0;
  const result = await bridge(async () => {
    calls += 1;
    return jsonResponse({});
  }).getAppointmentSummary("../../write?action=delete");
  assert.equal(result.status, "no_data");
  assert.equal(calls, 0);
});

test("ProductionAppointmentBridge exposes no write methods", () => {
  assert.deepEqual(
    Object.getOwnPropertyNames(ProductionAppointmentBridge.prototype).sort(),
    ["constructor", "getAppointmentSummary", "getTodayAppointments"],
  );
  for (const method of [
    "create",
    "update",
    "cancel",
    "reschedule",
    "delete",
    "checkIn",
    "sendReminder",
    "updateStaff",
    "writeSheet",
  ]) assert.equal(method in ProductionAppointmentBridge.prototype, false);
});
