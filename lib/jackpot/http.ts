import { NextRequest, NextResponse } from "next/server";
import type { StaffSession } from "@/lib/redeem/auth";
import { getStaffSession } from "@/lib/redeem/auth";
import { hasValidOrigin, privateHeaders } from "@/lib/redeem/http";

export function jackpotError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: privateHeaders });
}

const publicErrors: Record<string, { message: string; status: number }> = {
  JACKPOT_DATABASE_NOT_CONFIGURED: { message: "Jackpot database is not configured.", status: 503 },
  JACKPOT_CAMPAIGN_NOT_INITIALIZED: { message: "Run the Jackpot database migration first.", status: 503 },
  PARTICIPANT_LIST_NOT_LOCKED: { message: "Lock the participant list before drawing.", status: 409 },
  PARTICIPANT_LIST_LOCKED: { message: "Unlock the participant list before adding a participant.", status: 409 },
  PARTICIPANT_MUTATION_CONFLICT: { message: "Participants cannot be added after drawing has started.", status: 409 },
  DUPLICATE_PARTICIPANT: { message: "A participant with this member ID or phone number already exists.", status: 409 },
  PRIZE_NOT_FOUND: { message: "Prize not found.", status: 404 },
  PRIZE_NOT_AVAILABLE: { message: "This prize is not available for drawing.", status: 409 },
  EMPTY_ELIGIBLE_POOL: { message: "No eligible tickets remain for this prize.", status: 409 },
  DRAW_CONFLICT: { message: "Another draw is already pending. Refresh before continuing.", status: 409 },
  DRAW_NOT_PENDING: { message: "This draw is no longer pending.", status: 409 },
  DRAW_CONFIRM_CONFLICT: { message: "The winner could not be confirmed. Refresh and try again.", status: 409 },
  DRAW_NOT_REDRAWABLE: { message: "This draw can no longer be redrawn.", status: 409 },
  JACKPOT_REDRAW_CONFIRMATION_REQUIRED: { message: "Confirm the Jackpot redraw warning first.", status: 409 },
  REDRAW_CONFLICT: { message: "The redraw could not be completed. Refresh and try again.", status: 409 },
};

export function jackpotFailure(error: unknown) {
  const code = error instanceof Error ? error.message : "UNKNOWN";
  const known = publicErrors[code];
  if (known) return jackpotError(known.message, known.status);
  console.error("Jackpot request failed", code);
  return jackpotError("Unable to complete this Jackpot request.", 503);
}

export async function requireJackpotStaff() {
  return getStaffSession();
}

export function isJackpotAdmin(session: StaffSession | null) {
  return session?.role === "owner" || session?.role === "admin";
}

export function requireMutationOrigin(request: NextRequest) {
  return hasValidOrigin(request);
}

export { privateHeaders };
