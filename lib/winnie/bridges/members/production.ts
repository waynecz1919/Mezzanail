import type { WinnieBridgeResult } from "../contracts";
import {
  bridgeConfigurationMissing,
  bridgeNoData,
  bridgeStaleData,
  bridgeSuccess,
  bridgeUpstreamUnavailable,
} from "../result.ts";
import type { MemberBridge } from "./bridge";
import type { WinnieMember, WinnieMemberStatus } from "./contracts";
import { normalizeMalaysianPhone, normalizeMemberSearchQuery } from "./phone.ts";

export const MEMBER_STALE_AFTER_MS = 15 * 60 * 1000;
export const MEMBER_ADAPTER_TIMEOUT_MS = 10_000;
export const MEMBER_MAX_RESULTS = 20;

const SOURCE = "member-center" as const;
const MAX_RESPONSE_BYTES = 1_000_000;
const CUSTOMER_ID_PATTERN = /^\d{1,20}$/;
const MEMBER_NO_PATTERN = /^[A-Z0-9-]{3,24}$/;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

type ProductionMemberBridgeOptions = Readonly<{
  baseUrl?: string;
  token?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  now?: () => number;
}>;

type MemberReadConfiguration = Readonly<{
  baseUrl: string;
  token: string;
}>;

type UpstreamOutcome =
  | Readonly<{ kind: "success"; payload: unknown; at: string; observedAt: number }>
  | Readonly<{ kind: "configuration_failure"; at: string }>
  | Readonly<{ kind: "not_found"; at: string }>
  | Readonly<{ kind: "unavailable"; at: string }>;

type MemberRow = Readonly<Record<string, unknown>>;

function safeAt(now: () => number) {
  return new Date(now()).toISOString();
}

function configuration(options: ProductionMemberBridgeOptions): MemberReadConfiguration | null {
  const baseUrl = String(options.baseUrl || "").trim();
  const token = String(options.token || "").trim();
  if (!baseUrl || !token) return null;

  try {
    const url = new URL(baseUrl);
    if (
      url.protocol !== "https:"
      || url.search
      || url.hash
      || url.username
      || url.password
    ) return null;
    return { baseUrl: url.toString().replace(/\/$/, ""), token };
  } catch {
    return null;
  }
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: unknown) {
  const result = stringValue(value);
  return result || null;
}

function customerIdValue(value: unknown) {
  const result = typeof value === "number" && Number.isSafeInteger(value)
    ? String(value)
    : stringValue(value);
  if (!CUSTOMER_ID_PATTERN.test(result)) throw new Error("Invalid member identity.");
  const customerId = Number(result);
  if (!Number.isSafeInteger(customerId) || customerId < 1) throw new Error("Invalid member identity.");
  return customerId;
}

function statusValue(value: unknown): WinnieMemberStatus {
  const normalized = stringValue(value).toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "active") return "active";
  if (normalized === "pending") return "pending";
  if (normalized === "inactive") return "inactive";
  if (normalized === "suspended") return "suspended";
  if (normalized === "expired") return "expired";
  return "unknown";
}

function birthMonthValue(value: unknown) {
  const month = typeof value === "number" ? value : Number(value);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

function isoTimestamp(value: unknown) {
  const raw = stringValue(value);
  if (!raw) return null;
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

export function normalizeProductionMember(value: unknown): WinnieMember {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid member payload.");
  }
  const row = value as MemberRow;
  const normalizedPhone = optionalString(row.normalizedPhone);
  if (normalizedPhone && !/^\d{8,15}$/.test(normalizedPhone)) {
    throw new Error("Invalid member phone.");
  }

  return {
    customerId: customerIdValue(row.customerId),
    memberNo: optionalString(row.memberNo),
    name: stringValue(row.name),
    phone: optionalString(row.phone),
    normalizedPhone,
    status: statusValue(row.status),
    sourceTier: optionalString(row.tier),
    birthMonth: birthMonthValue(row.birthMonth),
    sourceSystem: optionalString(row.sourceSystem),
    syncedAt: isoTimestamp(row.syncedAt),
    memberDiscountRate: null,
  };
}

function staleData(records: readonly WinnieMember[], now: number) {
  return records.some((record) => {
    if (!record.syncedAt) return false;
    const syncedAt = Date.parse(record.syncedAt);
    return !Number.isNaN(syncedAt) && now - syncedAt > MEMBER_STALE_AFTER_MS;
  });
}

function dataResult<Data>(data: Data, at: string, stale: boolean): WinnieBridgeResult<Data, typeof SOURCE> {
  return stale ? bridgeStaleData(SOURCE, data, at) : bridgeSuccess(SOURCE, data, at);
}

function payloadRecord(payload: unknown): MemberRow | null {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? payload as MemberRow
    : null;
}

function memberPayload(payload: unknown): unknown {
  const record = payloadRecord(payload);
  return record?.member;
}

async function upstreamRead(
  config: MemberReadConfiguration,
  url: string,
  fetchImpl: FetchLike,
  timeoutMs: number,
  now: () => number,
): Promise<UpstreamOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      cache: "no-store",
      redirect: "error",
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timer);
    return { kind: "unavailable", at: safeAt(now) };
  }

  const at = safeAt(now);
  if (response.status === 401 || response.status === 403) {
    clearTimeout(timer);
    return { kind: "configuration_failure", at };
  }
  if (response.status === 400 || response.status === 404) {
    clearTimeout(timer);
    return { kind: "not_found", at };
  }
  if (response.status === 429 || response.status >= 500 || !response.ok) {
    clearTimeout(timer);
    return { kind: "unavailable", at };
  }

  try {
    const text = await response.text();
    if (!text || text.length > MAX_RESPONSE_BYTES) return { kind: "unavailable", at };
    return { kind: "success", payload: JSON.parse(text), at, observedAt: now() };
  } catch {
    return { kind: "unavailable", at };
  } finally {
    clearTimeout(timer);
  }
}

function pathValue(value: string, pattern: RegExp) {
  const normalized = String(value || "").trim().toUpperCase();
  return pattern.test(normalized) ? normalized : null;
}

export class ProductionMemberBridge implements MemberBridge {
  readonly source = SOURCE;
  private readonly config: MemberReadConfiguration | null;
  private readonly fetchImpl: FetchLike;
  private readonly timeoutMs: number;
  private readonly now: () => number;

  constructor(options: ProductionMemberBridgeOptions = {}) {
    this.config = configuration(options);
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
    this.timeoutMs = Math.max(1, Math.min(options.timeoutMs || MEMBER_ADAPTER_TIMEOUT_MS, MEMBER_ADAPTER_TIMEOUT_MS));
    this.now = options.now || Date.now;
  }

  private async readSingle(path: string): Promise<WinnieBridgeResult<WinnieMember, typeof SOURCE>> {
    if (!this.config) return bridgeConfigurationMissing(SOURCE, safeAt(this.now));
    const outcome = await upstreamRead(
      this.config,
      `${this.config.baseUrl}${path}`,
      this.fetchImpl,
      this.timeoutMs,
      this.now,
    );
    if (outcome.kind === "configuration_failure") return bridgeConfigurationMissing(SOURCE, outcome.at);
    if (outcome.kind === "not_found") return bridgeNoData(SOURCE, outcome.at);
    if (outcome.kind !== "success") return bridgeUpstreamUnavailable(SOURCE, outcome.at);

    try {
      const member = normalizeProductionMember(memberPayload(outcome.payload));
      return dataResult(member, outcome.at, staleData([member], outcome.observedAt));
    } catch {
      return bridgeUpstreamUnavailable(SOURCE, outcome.at);
    }
  }

  async searchMembers(query: string, limit = MEMBER_MAX_RESULTS) {
    if (!this.config) return bridgeConfigurationMissing(SOURCE, safeAt(this.now));
    const normalizedQuery = normalizeMemberSearchQuery(query);
    if (!normalizedQuery || normalizedQuery.length > 80) return bridgeNoData(SOURCE, safeAt(this.now));
    const safeLimit = Math.max(1, Math.min(Number.isFinite(limit) ? Math.trunc(limit) : MEMBER_MAX_RESULTS, MEMBER_MAX_RESULTS));
    const url = new URL(`${this.config.baseUrl}/search`);
    url.searchParams.set("q", normalizedQuery);
    url.searchParams.set("limit", String(safeLimit));
    const outcome = await upstreamRead(this.config, url.toString(), this.fetchImpl, this.timeoutMs, this.now);
    if (outcome.kind === "configuration_failure") return bridgeConfigurationMissing(SOURCE, outcome.at);
    if (outcome.kind === "not_found") return bridgeNoData(SOURCE, outcome.at);
    if (outcome.kind !== "success") return bridgeUpstreamUnavailable(SOURCE, outcome.at);

    try {
      const payload = payloadRecord(outcome.payload);
      if (!payload || !Array.isArray(payload.members)) return bridgeUpstreamUnavailable(SOURCE, outcome.at);
      const members = payload.members.map(normalizeProductionMember);
      if (members.length === 0) return bridgeNoData(SOURCE, outcome.at);
      return dataResult(members, outcome.at, staleData(members, outcome.observedAt));
    } catch {
      return bridgeUpstreamUnavailable(SOURCE, outcome.at);
    }
  }

  async getMemberSummary(customerId: string | number) {
    const id = pathValue(String(customerId), CUSTOMER_ID_PATTERN);
    if (!id || Number(id) < 1) return bridgeNoData(SOURCE, safeAt(this.now));
    return this.readSingle(`/${encodeURIComponent(id)}`);
  }

  async getMemberByMemberNo(memberNo: string) {
    const value = pathValue(memberNo, MEMBER_NO_PATTERN);
    if (!value) return bridgeNoData(SOURCE, safeAt(this.now));
    return this.readSingle(`/by-member-no/${encodeURIComponent(value)}`);
  }

  async getMemberByPhone(normalizedPhone: string) {
    const value = normalizeMalaysianPhone(normalizedPhone);
    if (!value) return bridgeNoData(SOURCE, safeAt(this.now));
    return this.readSingle(`/by-phone/${encodeURIComponent(value)}`);
  }
}
