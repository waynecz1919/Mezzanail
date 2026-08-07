import { NextResponse } from "next/server";

import { getWinnieSession } from "@/lib/auth/guards";

export async function GET() {
  const session = await getWinnieSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ user: session.user }, { headers: { "Cache-Control": "no-store" } });
}
