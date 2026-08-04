import "server-only";

import { createHmac } from "node:crypto";
import type { JobApplicationInput } from "@/lib/job/types";

function secret() {
  const value = process.env.JOB_APPLICATION_HASH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JOB_APPLICATION_HASH_SECRET_NOT_CONFIGURED");
  }
  return value;
}

function hmac(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function isValidIdempotencyKey(value: string | null) {
  return Boolean(value && /^[A-Za-z0-9._-]{16,128}$/.test(value));
}

export function hashIdempotencyKey(value: string) {
  return hmac(`idempotency:${value}`);
}

export function hashRequesterIp(value: string) {
  return hmac(`ip:${value}`);
}

export function hashApplicationPayload(value: JobApplicationInput) {
  return hmac(`payload:${JSON.stringify(value)}`);
}

export function requesterIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

export function auditJobApplication(
  event: string,
  details: {
    applicationReference?: string;
    phoneNumber?: string;
    errorCode?: string;
  } = {},
) {
  const phoneLast4 = details.phoneNumber?.replace(/\D/g, "").slice(-4);
  console.info(
    JSON.stringify({
      scope: "job-application",
      event,
      applicationReference: details.applicationReference,
      phoneLast4: phoneLast4 || undefined,
      errorCode: details.errorCode,
      at: new Date().toISOString(),
    }),
  );
}
