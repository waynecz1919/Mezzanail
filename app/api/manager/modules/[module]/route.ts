import { NextResponse } from "next/server";

import { winnieNavigationItems } from "@/config/winnie-navigation";
import { authorizeWinnieApi } from "@/lib/auth/guards";

type ModuleRouteContext = { params: Promise<{ module: string }> };

export async function GET(_request: Request, { params }: ModuleRouteContext) {
  const { module } = await params;
  const item = winnieNavigationItems.find((candidate) => candidate.id === module && candidate.id !== "dashboard");
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });

  const authorization = await authorizeWinnieApi(item.permission);
  if (authorization.response) return authorization.response;
  return NextResponse.json({ module: item.id, permission: item.permission, user: authorization.session.user }, { headers: { "Cache-Control": "no-store" } });
}
