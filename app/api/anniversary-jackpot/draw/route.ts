import { NextRequest, NextResponse } from "next/server";
import {
  isJackpotAdmin,
  jackpotError,
  jackpotFailure,
  privateHeaders,
  requireJackpotStaff,
  requireMutationOrigin,
} from "@/lib/jackpot/http";
import { createSecureDraw } from "@/lib/jackpot/service";

export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  if (!requireMutationOrigin(request)) return jackpotError("Invalid request origin.", 403);
  const session = await requireJackpotStaff();
  if (!session) return jackpotError("Authentication required.", 401);
  if (!isJackpotAdmin(session)) return jackpotError("Owner or Admin access required.", 403);

  try {
    const payload = await request.json() as { prizeId?: unknown; requestId?: unknown };
    const prizeId = typeof payload.prizeId === "string" ? payload.prizeId : "";
    const requestId = typeof payload.requestId === "string" ? payload.requestId : "";
    if (!uuidPattern.test(prizeId) || !uuidPattern.test(requestId)) {
      return jackpotError("Valid prizeId and requestId are required.");
    }

    const result = await createSecureDraw(session, prizeId, requestId);
    return NextResponse.json(result, {
      status: result.idempotent ? 200 : 201,
      headers: privateHeaders,
    });
  } catch (error) {
    return jackpotFailure(error);
  }
}
