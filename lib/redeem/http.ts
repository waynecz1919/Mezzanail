import { NextRequest, NextResponse } from "next/server";
import { getStaffSession } from "@/lib/redeem/auth";

export const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: privateHeaders });
}

export async function requireApiStaff() {
  return getStaffSession();
}

export function hasValidOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const requestHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
    return Boolean(requestHost) && new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}
