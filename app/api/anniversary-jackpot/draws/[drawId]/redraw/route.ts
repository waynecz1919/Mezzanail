import { NextRequest, NextResponse } from "next/server";
import { redrawReasons } from "@/lib/jackpot/core";
import {
  isJackpotAdmin,
  jackpotError,
  jackpotFailure,
  privateHeaders,
  requireJackpotStaff,
  requireMutationOrigin,
} from "@/lib/jackpot/http";
import { redrawWinner } from "@/lib/jackpot/service";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ drawId: string }> };
const uuidPattern = /^[0-9a-f-]{36}$/i;

export async function POST(request: NextRequest, context: RouteContext) {
  if (!requireMutationOrigin(request)) return jackpotError("Invalid request origin.", 403);
  const session = await requireJackpotStaff();
  if (!session) return jackpotError("Authentication required.", 401);
  if (!isJackpotAdmin(session)) return jackpotError("Owner or Admin access required.", 403);

  try {
    const drawId = (await context.params).drawId;
    const payload = await request.json() as {
      requestId?: unknown;
      reason?: unknown;
      confirmJackpot?: unknown;
    };
    const requestId = typeof payload.requestId === "string" ? payload.requestId : "";
    const reason = typeof payload.reason === "string" ? payload.reason.trim().slice(0, 240) : "";
    const standardReason = (redrawReasons as readonly string[]).includes(reason);
    const otherReason = reason.startsWith("Other:") && reason.length > 8;
    if (!uuidPattern.test(drawId) || !uuidPattern.test(requestId) || (!standardReason && !otherReason)) {
      return jackpotError("A valid redraw reason and requestId are required.");
    }

    const result = await redrawWinner(
      session,
      drawId,
      requestId,
      reason,
      payload.confirmJackpot === true,
    );
    return NextResponse.json(result, {
      status: result.idempotent ? 200 : 201,
      headers: privateHeaders,
    });
  } catch (error) {
    return jackpotFailure(error);
  }
}
