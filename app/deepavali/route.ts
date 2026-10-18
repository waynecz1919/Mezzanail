import { NextResponse, type NextRequest } from "next/server";

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/promotion#current-offer", request.url), 307);
}

export const HEAD = GET;
