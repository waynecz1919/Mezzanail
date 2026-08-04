import { NextRequest, NextResponse } from "next/server";
import { getJackpotDb } from "@/lib/jackpot/db";
import {
  isJackpotAdmin,
  jackpotError,
  jackpotFailure,
  privateHeaders,
  requireJackpotStaff,
  requireMutationOrigin,
} from "@/lib/jackpot/http";
import { getCampaign } from "@/lib/jackpot/service";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  if (!requireMutationOrigin(request)) return jackpotError("Invalid request origin.", 403);
  const session = await requireJackpotStaff();
  if (!session) return jackpotError("Authentication required.", 401);
  if (!isJackpotAdmin(session)) return jackpotError("Owner or Admin access required.", 403);

  try {
    const payload = await request.json() as { allowMultipleWins?: unknown };
    if (typeof payload.allowMultipleWins !== "boolean") {
      return jackpotError("allowMultipleWins must be true or false.");
    }
    const campaign = await getCampaign();
    const sql = getJackpotDb();
    const rows = await sql.query(
      `WITH previous AS (
         SELECT * FROM jackpot_campaigns
          WHERE id = $1
            AND NOT EXISTS (
              SELECT 1 FROM jackpot_draws WHERE campaign_id = $1
            )
       ),
       updated AS (
         UPDATE jackpot_campaigns c
            SET allow_multiple_wins = $2, updated_at = NOW()
           FROM previous
          WHERE c.id = previous.id
          RETURNING c.*
       ),
       audit AS (
         INSERT INTO jackpot_audit_log (
           campaign_id, action, entity_type, entity_id,
           previous_value, new_value, performed_by
         )
         SELECT updated.id, 'campaign_rules_updated', 'campaign', updated.id::text,
                jsonb_build_object('allowMultipleWins', previous.allow_multiple_wins),
                jsonb_build_object('allowMultipleWins', updated.allow_multiple_wins),
                $3
           FROM updated, previous
       )
       SELECT * FROM updated`,
      [campaign.id, payload.allowMultipleWins, session.staffId],
    ) as unknown as Array<Record<string, unknown>>;
    if (!rows[0]) return jackpotError("Rules cannot be changed after drawing begins.", 409);
    return NextResponse.json({ success: true }, { headers: privateHeaders });
  } catch (error) {
    return jackpotFailure(error);
  }
}
