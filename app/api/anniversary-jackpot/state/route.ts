import { NextResponse } from "next/server";
import {
  jackpotError,
  jackpotFailure,
  privateHeaders,
  requireJackpotStaff,
} from "@/lib/jackpot/http";
import { loadJackpotState } from "@/lib/jackpot/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireJackpotStaff();
    if (!session) return jackpotError("Authentication required.", 401);
    const state = await loadJackpotState(session);
    return NextResponse.json(state, { headers: privateHeaders });
  } catch (error) {
    return jackpotFailure(error);
  }
}
