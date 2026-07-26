import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function rewritePrivateRoute(destination: URL) {
  const response = NextResponse.rewrite(destination);
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  const destination = request.nextUrl.clone();

  if (host === "promotion.mezzanail.com" && request.nextUrl.pathname === "/") {
    destination.pathname = "/promotion";
    return NextResponse.rewrite(destination);
  }

  if (host === "redeem.mezzanail.com") {
    if (request.nextUrl.pathname === "/") {
      destination.pathname = "/redeem";
      return rewritePrivateRoute(destination);
    }
    if (request.nextUrl.pathname === "/login") {
      destination.pathname = "/redeem/login";
      return rewritePrivateRoute(destination);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
