import type { WinnieBridgeResult } from "../contracts";
import type { AppointmentBridge } from "./bridge";
import type {
  WinnieAppointment,
  WinnieAppointmentConfirmationStatus,
  WinnieAppointmentReminderStatus,
  WinnieAppointmentStatus,
} from "./contracts";

export const APPOINTMENT_SALON_TIMEZONE = "Asia/Kuala_Lumpur";
export const APPOINTMENT_STALE_AFTER_MS = 5 * 60 * 1000;
export const APPOINTMENT_ADAPTER_TIMEOUT_MS = 10_000;

const SOURCE = "appointment-system" as const;
const KUALA_LUMPUR_OFFSET_MS = 8 * 60 * 60 * 1000;
const MAX_RESPONSE_BYTES = 1_000_000;
const APPOINTMENT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

type AppointmentReadBridgeOptions = Readonly<{
  baseUrl?: string;
  token?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  now?: () => number;
}>;

type AppointmentReadConfiguration = Readonly<{
  baseUrl: string;
  token: string;
}>;

type UpstreamSuccess = Readonly<{
  kind: "success";
  payload: unknown;
  receivedAt: string;
  observedAt: number;
}>;

type UpstreamOutcome =
  | UpstreamSuccess
  | Readonly<{ kind: "configuration_failure"; at: string }>
  | Readonly<{ kind: "not_found"; at: string }>
  | Readonly<{ kind: "unavailable"; at: string }>;

const statusMap: Record<
  string,
  Readonly<{
    status: WinnieAppointmentStatus;
    confirmationStatus: WinnieAppointmentConfirmationStatus;
  }>
> = Object.freeze({
  Pending: { status: "scheduled", confirmationStatus: "pending" },
  "Reminder Due": { status: "scheduled", confirmationStatus: "pending" },
  "Reminder Sent": { status: "scheduled", confirmationStatus: "pending" },
  Confirmed: { status: "confirmed", confirmationStatus: "confirmed" },
  "Reschedule Requested": { status: "scheduled", confirmationStatus: "pending" },
  Completed: { status: "completed", confirmationStatus: "not_required" },
  Cancelled: { status: "cancelled", confirmationStatus: "declined" },
  "No Show": { status: "no_show", confirmationStatus: "not_required" },
});

function safeAt(now: () => number) {
  return new Date(now()).toISOString();
}

function configuration(options: AppointmentReadBridgeOptions): AppointmentReadConfiguration | null {
  const token = String(options.token || "").trim();
  const value = String(options.baseUrl || "").trim();
  if (!token || !value) return null;
  try {
    const url = new URL(value);
    if ((url.protocol !== "https:" && url.protocol !== "http:") || url.search || url.hash) return null;
    return { baseUrl: url.toString().replace(/\/$/, ""), token };
  } catch {
    return null;
  }
}

function failure(
  status: "configuration_missing" | "upstream_unavailable",
  at: string,
): WinnieBridgeResult<never, typeof SOURCE> {
  return {
    status,
    data: null,
    source: SOURCE,
    fetchedAt: at,
    isStale: false,
    message: status === "configuration_missing"
      ? "This source is not connected yet."
      : "The source system is temporarily unavailable.",
  };
}

function noData(at: string): WinnieBridgeResult<never, typeof SOURCE> {
  return { status: "no_data", data: null, source: SOURCE, fetchedAt: at, isStale: false };
}

function dataResult<Data>(data: Data, at: string, isStale: boolean): WinnieBridgeResult<Data, typeof SOURCE> {
  if (isStale) {
    return {
      status: "stale_data",
      data,
      source: SOURCE,
      fetchedAt: at,
      isStale: true,
      message: "The available data may be out of date.",
    };
  }
  return { status: "success", data, source: SOURCE, fetchedAt: at, isStale: false };
}

function localDateTimeToIso(dateValue: string, timeValue: string) {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
  const time = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(timeValue);
  if (!date || !time) throw new Error("Invalid salon-local date or time.");

  const year = Number(date[1]);
  const month = Number(date[2]);
  const day = Number(date[3]);
  const hour = Number(time[1]);
  const minute = Number(time[2]);
  const second = Number(time[3] || 0);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const validation = new Date(localAsUtc);
  if (
    validation.getUTCFullYear() !== year
    || validation.getUTCMonth() !== month - 1
    || validation.getUTCDate() !== day
    || validation.getUTCHours() !== hour
    || validation.getUTCMinutes() !== minute
    || validation.getUTCSeconds() !== second
  ) throw new Error("Invalid salon-local date or time.");

  return new Date(localAsUtc - KUALA_LUMPUR_OFFSET_MS).toISOString();
}

function generatedAtToIso(value: unknown) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)$/i.exec(
    String(value || "").trim(),
  );
  if (!match) return null;
  const hour12 = Number(match[4]);
  if (hour12 < 1 || hour12 > 12) return null;
  const hour = (hour12 % 12) + (match[6].toUpperCase() === "PM" ? 12 : 0);
  try {
    return localDateTimeToIso(
      `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`,
      `${String(hour).padStart(2, "0")}:${match[5]}`,
    );
  } catch {
    return null;
  }
}

function reminderStatus(status: string, value: unknown): WinnieAppointmentReminderStatus {
  if (!statusMap[status]) return "unknown";
  const reminder = String(value || "").trim().toLowerCase();
  if (["send today", "reminder due", "due", "pending", "overdue"].includes(reminder)) return "pending";
  if (["sent", "reminder sent"].includes(reminder)) return "sent";
  if (reminder === "failed") return "failed";
  if (["opted out", "opted_out"].includes(reminder)) return "opted_out";
  if (["confirmed", "cancelled", "not due", "not_due"].includes(reminder)) return "not_due";
  if (reminder) return "unknown";
  if (status === "Reminder Due") return "pending";
  if (status === "Reminder Sent") return "sent";
  if (["Pending", "Confirmed", "Completed", "Cancelled", "No Show"].includes(status)) return "not_due";
  return "unknown";
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function serviceName(value: Record<string, unknown>) {
  const primary = stringValue(value.service);
  if (primary) return primary;
  if (!Array.isArray(value.services)) return "";
  return value.services
    .map((item) => typeof item === "string" ? item.trim() : stringValue((item as Record<string, unknown>)?.serviceName))
    .filter(Boolean)
    .join(", ");
}

export function normalizeProductionAppointment(value: unknown): WinnieAppointment {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid appointment payload.");
  const item = value as Record<string, unknown>;
  const id = stringValue(item.appointmentId);
  const date = stringValue(item.date);
  const time = stringValue(item.time);
  if (!id || !APPOINTMENT_ID_PATTERN.test(id)) throw new Error("Invalid appointment payload.");
  const startAt = localDateTimeToIso(date, time);

  let endAt: string | null = null;
  const upstreamEnd = stringValue(item.endTime);
  const fullEnd = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2})?)$/.exec(upstreamEnd);
  const timeOnlyEnd = /^(\d{2}:\d{2}(?::\d{2})?)$/.exec(upstreamEnd);
  try {
    if (fullEnd) endAt = localDateTimeToIso(fullEnd[1], fullEnd[2]);
    else if (timeOnlyEnd) endAt = localDateTimeToIso(date, timeOnlyEnd[1]);
  } catch {
    endAt = null;
  }
  if (!endAt) {
    const duration = Number(item.duration);
    if (Number.isFinite(duration) && duration > 0 && duration <= 1440) {
      endAt = new Date(Date.parse(startAt) + duration * 60 * 1000).toISOString();
    }
  }

  const upstreamStatus = stringValue(item.status);
  const mapped = statusMap[upstreamStatus] || {
    status: "unknown" as const,
    confirmationStatus: "unknown" as const,
  };
  const customerId = stringValue(item.customerId) || null;
  const staffId = stringValue(item.staffId) || null;

  return {
    id,
    customerId,
    customerName: stringValue(item.customerName),
    startAt,
    endAt,
    serviceName: serviceName(item),
    staffId,
    staffName: null,
    status: mapped.status,
    confirmationStatus: mapped.confirmationStatus,
    reminderStatus: reminderStatus(upstreamStatus, item.reminderState),
  };
}

async function upstreamRead(
  config: AppointmentReadConfiguration,
  path: string,
  fetchImpl: FetchLike,
  timeoutMs: number,
  now: () => number,
): Promise<UpstreamOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetchImpl(`${config.baseUrl}${path}`, {
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
    return { kind: "unavailable", at: safeAt(now) };
  } finally {
    clearTimeout(timer);
  }

  const at = safeAt(now);
  if (response.status === 401 || response.status === 403) return { kind: "configuration_failure", at };
  if (response.status === 400 || response.status === 404) return { kind: "not_found", at };
  if (!response.ok) return { kind: "unavailable", at };

  try {
    const text = await response.text();
    if (!text || text.length > MAX_RESPONSE_BYTES) return { kind: "unavailable", at };
    return { kind: "success", payload: JSON.parse(text), receivedAt: at, observedAt: now() };
  } catch {
    return { kind: "unavailable", at };
  }
}

function payloadRecord(payload: unknown) {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : null;
}

function freshness(payload: Record<string, unknown>, receivedAt: string, observedAt: number) {
  const sourceAt = generatedAtToIso(payload.generatedAt) || receivedAt;
  return {
    fetchedAt: sourceAt,
    isStale: observedAt - Date.parse(sourceAt) > APPOINTMENT_STALE_AFTER_MS,
  };
}

export class ProductionAppointmentBridge implements AppointmentBridge {
  readonly source = SOURCE;
  private readonly config: AppointmentReadConfiguration | null;
  private readonly fetchImpl: FetchLike;
  private readonly timeoutMs: number;
  private readonly now: () => number;

  constructor(options: AppointmentReadBridgeOptions = {}) {
    this.config = configuration(options);
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
    this.timeoutMs = Math.max(1, Math.min(options.timeoutMs || APPOINTMENT_ADAPTER_TIMEOUT_MS, 15_000));
    this.now = options.now || Date.now;
  }

  async getTodayAppointments(): Promise<WinnieBridgeResult<readonly WinnieAppointment[], typeof SOURCE>> {
    if (!this.config) return failure("configuration_missing", safeAt(this.now));
    const outcome = await upstreamRead(this.config, "/today", this.fetchImpl, this.timeoutMs, this.now);
    if (outcome.kind === "configuration_failure") return failure("configuration_missing", outcome.at);
    if (outcome.kind !== "success") return failure("upstream_unavailable", outcome.at);
    const payload = payloadRecord(outcome.payload);
    if (!payload || payload.timezone !== APPOINTMENT_SALON_TIMEZONE || !Array.isArray(payload.appointments)) {
      return failure("upstream_unavailable", outcome.receivedAt);
    }
    let appointments: readonly WinnieAppointment[];
    try {
      appointments = payload.appointments.map(normalizeProductionAppointment);
    } catch {
      return failure("upstream_unavailable", outcome.receivedAt);
    }
    const meta = freshness(payload, outcome.receivedAt, outcome.observedAt);
    if (appointments.length === 0 && !meta.isStale) return noData(meta.fetchedAt);
    return dataResult(appointments, meta.fetchedAt, meta.isStale);
  }

  async getAppointmentSummary(
    appointmentId: string,
  ): Promise<WinnieBridgeResult<WinnieAppointment, typeof SOURCE>> {
    if (!this.config) return failure("configuration_missing", safeAt(this.now));
    const id = String(appointmentId || "").trim();
    if (!APPOINTMENT_ID_PATTERN.test(id)) return noData(safeAt(this.now));
    const outcome = await upstreamRead(
      this.config,
      `/${encodeURIComponent(id)}`,
      this.fetchImpl,
      this.timeoutMs,
      this.now,
    );
    if (outcome.kind === "configuration_failure") return failure("configuration_missing", outcome.at);
    if (outcome.kind === "not_found") return noData(outcome.at);
    if (outcome.kind !== "success") return failure("upstream_unavailable", outcome.at);
    const payload = payloadRecord(outcome.payload);
    if (!payload || payload.timezone !== APPOINTMENT_SALON_TIMEZONE) {
      return failure("upstream_unavailable", outcome.receivedAt);
    }
    try {
      const meta = freshness(payload, outcome.receivedAt, outcome.observedAt);
      return dataResult(normalizeProductionAppointment(payload.appointment), meta.fetchedAt, meta.isStale);
    } catch {
      return failure("upstream_unavailable", outcome.receivedAt);
    }
  }
}
