import { NextRequest, NextResponse } from "next/server";
import {
  isJackpotAdmin,
  jackpotError,
  jackpotFailure,
  privateHeaders,
  requireJackpotStaff,
  requireMutationOrigin,
} from "@/lib/jackpot/http";
import { updateDrawStatus } from "@/lib/jackpot/service";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ drawId: string }> };
const uuidPattern = /^[0-9a-f-]{36}$/i;

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!requireMutationOrigin(request)) return jackpotError("Invalid request origin.", 403);
  const session = await requireJackpotStaff();
  if (!session) return jackpotError("Authentication required.", 401);
  if (!isJackpotAdmin(session)) return jackpotError("Owner or Admin access required.", 403);

  try {
    const drawId = (await context.params).drawId;
    const payload = await request.json() as { action?: unknown };
    const action = payload.action;
    if (!uuidPattern.test(drawId) || !["confirm", "unreachable"].includes(String(action))) {
      return jackpotError("Invalid draw update.");
    }
    await updateDrawStatus(session, drawId, action as "confirm" | "unreachable");
    return NextResponse.json({ success: true }, { headers: privateHeaders });
  } catch (error) {
    return jackpotFailure(error);
  }
}
