import { NextRequest, NextResponse } from "next/server";
import type { JobApplicationFailure } from "@/lib/job/types";

export const jobPrivateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export function jobApiFailure(
  error: JobApplicationFailure,
  status: number,
  extraHeaders: Record<string, string> = {},
) {
  return NextResponse.json(error, {
    status,
    headers: { ...jobPrivateHeaders, ...extraHeaders },
  });
}

export function hasValidJobOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const requestHost =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    return Boolean(requestHost) && new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

export async function readLimitedJson(request: NextRequest, maxBytes = 64 * 1024) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) throw new Error("REQUEST_TOO_LARGE");
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) throw new Error("REQUEST_TOO_LARGE");
  return JSON.parse(text) as unknown;
}

export function hasJobCsrfHeaders(request: NextRequest) {
  return (
    hasValidJobOrigin(request) &&
    request.headers.get("x-mezzanail-request") === "job-application"
  );
}
