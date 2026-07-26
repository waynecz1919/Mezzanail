import { NextRequest, NextResponse } from "next/server";
import { expiredSessionCookie } from "@/lib/redeem/auth";
import { apiError, hasValidOrigin, privateHeaders } from "@/lib/redeem/http";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return apiError("Invalid request origin.", 403);
  const response = NextResponse.json({ success: true }, { headers: privateHeaders });
  const cookie = expiredSessionCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
