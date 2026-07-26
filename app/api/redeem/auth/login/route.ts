import { NextRequest, NextResponse } from "next/server";
import {
  createStaffSession,
  sessionCookie,
  verifyStaffCredentials,
} from "@/lib/redeem/auth";
import { apiError, hasValidOrigin, privateHeaders } from "@/lib/redeem/http";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return apiError("Invalid request origin.", 403);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return apiError("Too many login attempts. Try again later.", 429);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError("Invalid request.");
  }

  const input = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const staffId = typeof input.staffId === "string" ? input.staffId.trim().slice(0, 80) : "";
  const password = typeof input.password === "string" ? input.password.slice(0, 256) : "";
  if (!staffId || !password) return apiError("Enter your staff ID and password.");

  try {
    const verifiedStaffId = verifyStaffCredentials(staffId, password);
    if (!verifiedStaffId) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return apiError("Invalid staff ID or password.", 401);
    }

    attempts.delete(ip);
    const response = NextResponse.json(
      { success: true, staffId: verifiedStaffId },
      { headers: privateHeaders },
    );
    const cookie = sessionCookie(createStaffSession(verifiedStaffId));
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch (error) {
    console.error("Redeem login configuration error", error instanceof Error ? error.message : "unknown");
    return apiError("Staff login is not configured.", 503);
  }
}
