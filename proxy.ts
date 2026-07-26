import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  if (host !== "promotion.mezzanail.com") {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = "/promotion";
  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: ["/"],
};
