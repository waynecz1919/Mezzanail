import { NextRequest, NextResponse } from "next/server";
import { getCampaign } from "@/lib/jackpot/service";
import { getJackpotDb } from "@/lib/jackpot/db";
import {
  isJackpotAdmin,
  jackpotError,
  jackpotFailure,
  privateHeaders,
  requireJackpotStaff,
  requireMutationOrigin,
} from "@/lib/jackpot/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!requireMutationOrigin(request)) return jackpotError("Invalid request origin.", 403);
  const session = await requireJackpotStaff();
  if (!session) return jackpotError("Authentication required.", 401);
  if (!isJackpotAdmin(session)) return jackpotError("Owner or Admin access required.", 403);

  try {
    const payload = await request.json() as { action?: unknown; reason?: unknown };
    const action = String(payload.action || "");
    const reason = typeof payload.reason === "string" ? payload.reason.trim().slice(0, 500) : "";
    if (!["lock", "unlock"].includes(action)) return jackpotError("Invalid list action.");
    if (action === "unlock" && session.role !== "owner") {
      return jackpotError("Only the Owner can unlock the participant list.", 403);
    }
    if (action === "unlock" && !reason) return jackpotError("An unlock reason is required.");

    const campaign = await getCampaign();
    const sql = getJackpotDb();
    const rows = await sql.query(
      `WITH changed AS (
         UPDATE jackpot_campaigns
            SET participant_list_locked = $2,
                locked_at = CASE WHEN $2 THEN NOW() ELSE NULL END,
                locked_by = CASE WHEN $2 THEN $3 ELSE NULL END,
                status = CASE WHEN $2 THEN 'live' ELSE 'setup' END,
                updated_at = NOW()
          WHERE id = $1
            AND participant_list_locked <> $2
            AND (
              $2 = FALSE
              OR EXISTS (
                SELECT 1 FROM jackpot_participants
                 WHERE campaign_id = $1 AND eligible = TRUE AND ticket_count > 0
              )
            )
          RETURNING *
       ),
       audit AS (
         INSERT INTO jackpot_audit_log (
           campaign_id, action, entity_type, entity_id,
           previous_value, new_value, performed_by, reason
         )
         SELECT id,
                CASE WHEN $2 THEN 'participant_list_locked' ELSE 'participant_list_unlocked' END,
                'campaign', id::text,
                jsonb_build_object('participantListLocked', NOT $2),
                jsonb_build_object('participantListLocked', $2),
                $3, NULLIF($4, '')
           FROM changed
       )
       SELECT * FROM changed`,
      [campaign.id, action === "lock", session.staffId, reason],
    ) as unknown as Array<Record<string, unknown>>;
    if (!rows[0]) return jackpotError("The list is already in that state or has no eligible entries.", 409);
    return NextResponse.json({ success: true }, { headers: privateHeaders });
  } catch (error) {
    return jackpotFailure(error);
  }
}
