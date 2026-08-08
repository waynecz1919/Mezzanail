import assert from "node:assert/strict";
import test from "node:test";

const {
  MEMBER_MAX_RESULTS,
  ProductionMemberBridge,
  normalizeProductionMember,
} = await import("../lib/winnie/bridges/members/production.ts");
const {
  normalizeMalaysianPhone,
  normalizeMemberSearchQuery,
} = await import("../lib/winnie/bridges/members/phone.ts");
const { runBridgeReadWithPermissions } = await import("../lib/winnie/bridges/access-core.ts");

const BASE_URL = "https://member.mezzanail.com/api/integrations/winnie/members";
const TOKEN = "member-read-test-token";
const NOW = Date.parse("2026-08-08T12:00:00.000Z");

const member = (overrides = {}) => ({
  customerId: 42,
  memberNo: "MY-0042",
  name: "Alicia Tan",
  phone: "+60123456789",
  normalizedPhone: "60123456789",
  status: "ACTIVE",
  tier: "legacy-source-value",
  birthMonth: 8,
  sourceSystem: "member-center",
  syncedAt: "2026-08-08T11:55:00.000Z",
  ...overrides,
});

const jsonResponse = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { "content-type": "application/json" },
});

const bridge = (fetchImpl, overrides = {}) => new ProductionMemberBridge({
  baseUrl: BASE_URL,
  token: TOKEN,
  fetchImpl,
  now: () => NOW,
  ...overrides,
});

test("Malaysian phone forms normalize only for lookup", () => {
  assert.equal(normalizeMalaysianPhone("0123456789"), "60123456789");
  assert.equal(normalizeMalaysianPhone("60123456789"), "60123456789");
  assert.equal(normalizeMalaysianPhone("+60123456789"), "60123456789");
  assert.equal(normalizeMalaysianPhone("+60 12-345 6789"), "60123456789");
  assert.equal(normalizeMalaysianPhone("12345"), null);
  assert.equal(normalizeMemberSearchQuery("+6012 345 6789"), "60123456789");
  assert.equal(normalizeMemberSearchQuery("Alicia"), "Alicia");
});

test("successful search is bounded, server-authenticated and normalized", async () => {
  let call;
  const result = await bridge(async (url, init) => {
    call = { url, init };
    return jsonResponse({ members: [member()], count: 1, limit: 20 });
  }).searchMembers("+60 12-345 6789", 99);

  const url = new URL(call.url);
  assert.equal(url.pathname, "/api/integrations/winnie/members/search");
  assert.equal(url.searchParams.get("q"), "60123456789");
  assert.equal(url.searchParams.get("limit"), String(MEMBER_MAX_RESULTS));
  assert.equal(call.init.method, "GET");
  assert.equal(call.init.headers.Authorization, `Bearer ${TOKEN}`);
  assert.equal(call.init.cache, "no-store");
  assert.equal(call.init.redirect, "error");
  assert.equal(result.status, "success");
  assert.equal(result.source, "member-center");
  assert.equal(result.isStale, false);
  assert.deepEqual(result.data[0], {
    customerId: 42,
    memberNo: "MY-0042",
    name: "Alicia Tan",
    phone: "+60123456789",
    normalizedPhone: "60123456789",
    status: "active",
    sourceTier: "legacy-source-value",
    birthMonth: 8,
    sourceSystem: "member-center",
    syncedAt: "2026-08-08T11:55:00.000Z",
    memberDiscountRate: null,
  });
});

test("empty searches return no_data and do not fabricate records", async () => {
  const result = await bridge(async () => jsonResponse({ members: [], count: 0, limit: 20 }))
    .searchMembers("zz");
  assert.equal(result.status, "no_data");
  assert.equal(result.data, null);
});

test("fixed lookup methods use encoded approved paths only", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return jsonResponse({ member: member() });
  };

  assert.equal((await bridge(fetchImpl).getMemberSummary(42)).status, "success");
  assert.equal((await bridge(fetchImpl).getMemberByMemberNo("my-0042")).status, "success");
  assert.equal((await bridge(fetchImpl).getMemberByPhone("0123456789")).status, "success");
  assert.deepEqual(calls, [
    `${BASE_URL}/42`,
    `${BASE_URL}/by-member-no/MY-0042`,
    `${BASE_URL}/by-phone/60123456789`,
  ]);
});

test("invalid identity values return no_data without an upstream request", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return jsonResponse({ member: member() });
  };
  assert.equal((await bridge(fetchImpl).getMemberSummary("../../write")).status, "no_data");
  assert.equal((await bridge(fetchImpl).getMemberByMemberNo("bad/route")).status, "no_data");
  assert.equal((await bridge(fetchImpl).getMemberByPhone("12345")).status, "no_data");
  assert.equal(calls, 0);
});

test("missing configuration fails closed before fetch", async () => {
  let calls = 0;
  const adapter = new ProductionMemberBridge({
    baseUrl: BASE_URL,
    token: "",
    fetchImpl: async () => {
      calls += 1;
      return jsonResponse({});
    },
    now: () => NOW,
  });
  const result = await adapter.searchMembers("Alicia");
  assert.equal(result.status, "configuration_missing");
  assert.equal(calls, 0);
});

test("permission denial happens before the member upstream read", async () => {
  let calls = 0;
  const result = await runBridgeReadWithPermissions({
    permissions: ["dashboard.view"],
    permission: "customer_profile.view",
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

test("upstream auth, not-found and rate-limit failures map safely", async () => {
  for (const status of [401, 403]) {
    const result = await bridge(async () => jsonResponse({ secret: "hidden" }, status)).searchMembers("Alicia");
    assert.equal(result.status, "configuration_missing");
    assert.doesNotMatch(result.message, /hidden|token|secret/i);
  }
  for (const status of [400, 404]) {
    const result = await bridge(async () => jsonResponse({ sql: "hidden" }, status)).getMemberSummary(42);
    assert.equal(result.status, "no_data");
    assert.equal(Object.hasOwn(result, "error"), false);
  }
  for (const status of [429, 500, 503]) {
    const result = await bridge(async () => jsonResponse({ stack: "hidden" }, status)).searchMembers("Alicia");
    assert.equal(result.status, "upstream_unavailable");
    assert.doesNotMatch(result.message, /hidden|stack|sql/i);
  }
});

test("timeouts and malformed JSON are unavailable without retries", async () => {
  let calls = 0;
  const timedOut = await bridge((_url, init) => {
    calls += 1;
    return new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    });
  }, { timeoutMs: 5 }).searchMembers("Alicia");
  assert.equal(timedOut.status, "upstream_unavailable");
  assert.equal(calls, 1);

  const malformed = await bridge(async () => new Response("not-json", { status: 200 })).searchMembers("Alicia");
  assert.equal(malformed.status, "upstream_unavailable");
});

test("stale source sync metadata is explicit and missing fields remain null", async () => {
  const result = await bridge(async () => jsonResponse({ member: member({
    memberNo: undefined,
    phone: undefined,
    normalizedPhone: undefined,
    tier: undefined,
    birthMonth: undefined,
    sourceSystem: undefined,
    syncedAt: "2026-08-08T11:00:00.000Z",
  }) })).getMemberSummary(42);
  assert.equal(result.status, "stale_data");
  assert.equal(result.isStale, true);
  assert.equal(result.data.memberNo, null);
  assert.equal(result.data.phone, null);
  assert.equal(result.data.normalizedPhone, null);
  assert.equal(result.data.sourceTier, null);
  assert.equal(result.data.birthMonth, null);
  assert.equal(result.data.sourceSystem, null);
  assert.equal(result.data.memberDiscountRate, null);
});

test("source tier is not interpreted as a discount and sensitive fields are excluded", () => {
  const normalized = normalizeProductionMember({
    ...member(),
    credits: 999,
    transactions: [{ amount: 20 }],
    familySharing: { approved: true },
  });
  assert.equal(normalized.sourceTier, "legacy-source-value");
  assert.equal(normalized.memberDiscountRate, null);
  assert.equal(Object.hasOwn(normalized, "credits"), false);
  assert.equal(Object.hasOwn(normalized, "transactions"), false);
  assert.equal(Object.hasOwn(normalized, "familySharing"), false);
});

test("ProductionMemberBridge exposes no write methods", () => {
  const methods = Object.getOwnPropertyNames(ProductionMemberBridge.prototype).sort();
  assert.deepEqual(methods, [
    "constructor",
    "getMemberByMemberNo",
    "getMemberByPhone",
    "getMemberSummary",
    "readSingle",
    "searchMembers",
  ]);
  for (const method of ["create", "update", "delete", "adjustCredit", "deleteTransaction", "approveFamilySharing", "write"]) {
    assert.equal(method in ProductionMemberBridge.prototype, false);
  }
});
