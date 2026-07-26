import { isRedeemCode, normalizeRedeemCode } from "@/lib/redeem/core";
import { redeemStatuses, type GenerateRedeemCodeInput, type RedeemStatus } from "@/lib/redeem/types";

type ValidationResult =
  | { ok: true; value: GenerateRedeemCodeInput }
  | { ok: false; error: string };

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function validateGenerateInput(payload: unknown): ValidationResult {
  const input = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const value: GenerateRedeemCodeInput = {
    customerName: clean(input.customerName, 120),
    phone: clean(input.phone, 32),
    customerGroup: clean(input.customerGroup, 80),
    voucherType: clean(input.voucherType, 80),
    voucherDescription: clean(input.voucherDescription, 500),
    expiryDate: clean(input.expiryDate, 10),
    notes: clean(input.notes, 1000),
  };

  if (!value.customerName || !value.phone || !value.customerGroup || !value.voucherType || !value.voucherDescription || !value.expiryDate) {
    return { ok: false, error: "Please complete all required fields." };
  }
  if (!/^\+?[\d\s()-]{7,32}$/.test(value.phone)) {
    return { ok: false, error: "Enter a valid phone number." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.expiryDate)) {
    return { ok: false, error: "Enter a valid expiry date." };
  }
  const expiry = new Date(`${value.expiryDate}T00:00:00+08:00`);
  if (Number.isNaN(expiry.getTime())) {
    return { ok: false, error: "Enter a valid expiry date." };
  }
  const todayMalaysia = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  if (value.expiryDate < todayMalaysia) {
    return { ok: false, error: "Expiry date cannot be in the past." };
  }
  return { ok: true, value };
}

export function validateCode(value: string) {
  const code = normalizeRedeemCode(value);
  return isRedeemCode(code) ? code : null;
}

export function validateStatus(value: string | null): RedeemStatus | "all" {
  if (!value || value === "all") return "all";
  return (redeemStatuses as readonly string[]).includes(value)
    ? (value as RedeemStatus)
    : "all";
}
