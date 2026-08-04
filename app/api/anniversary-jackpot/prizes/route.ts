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

type PrizeInput = {
  prizeId?: unknown;
  prizeName?: unknown;
  prizeDescription?: unknown;
  prizeImageUrl?: unknown;
  quantity?: unknown;
  drawOrder?: unknown;
  isJackpot?: unknown;
  allowPreviousWinner?: unknown;
  status?: unknown;
};

function parsePrizeInput(payload: PrizeInput) {
  const prizeName = typeof payload.prizeName === "string" ? payload.prizeName.trim().slice(0, 160) : "";
  const prizeDescription = typeof payload.prizeDescription === "string"
    ? payload.prizeDescription.trim().slice(0, 1000)
    : "";
  const prizeImageUrl = typeof payload.prizeImageUrl === "string"
    ? payload.prizeImageUrl.trim().slice(0, 500)
    : "";
  const quantity = Number(payload.quantity);
  const drawOrder = Number(payload.drawOrder);
  const isJackpot = payload.isJackpot === true;
  const allowPreviousWinner = isJackpot ? false : payload.allowPreviousWinner === true;
  const status = ["active", "inactive"].includes(String(payload.status))
    ? String(payload.status)
    : "active";
  if (!prizeName || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) return null;
  if (!Number.isInteger(drawOrder) || drawOrder < 1 || drawOrder > 1000) return null;
  if (isJackpot && quantity !== 1) return null;
  if (prizeImageUrl && !/^(https:\/\/|\/)/i.test(prizeImageUrl)) return null;
  return {
    prizeName,
    prizeDescription,
    prizeImageUrl,
    quantity,
    drawOrder,
    isJackpot,
    allowPreviousWinner,
    status,
  };
}

async function authorize(request: NextRequest) {
  if (!requireMutationOrigin(request)) return { error: jackpotError("Invalid request origin.", 403) };
  const session = await requireJackpotStaff();
  if (!session) return { error: jackpotError("Authentication required.", 401) };
  if (!isJackpotAdmin(session)) {
    return { error: jackpotError("Owner or Admin access required.", 403) };
  }
  return { session };
}

export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;
  try {
    const input = parsePrizeInput(await request.json() as PrizeInput);
    if (!input) return jackpotError("Enter valid prize details.");
    const campaign = await getCampaign();
    const sql = getJackpotDb();
    const rows = await sql.query(
      `WITH created AS (
         INSERT INTO jackpot_prizes (
           campaign_id, prize_name, prize_description, prize_image_url,
           quantity, remaining_quantity, draw_order, is_jackpot,
           allow_previous_winner, status
         )
         SELECT $1, $2, NULLIF($3, ''), NULLIF($4, ''), $5, $5, $6, $7, $8, $9
          WHERE NOT EXISTS (
            SELECT 1 FROM jackpot_draws WHERE campaign_id = $1
          )
            AND (
              $7 = FALSE
              OR $6 > COALESCE((
                SELECT MAX(draw_order) FROM jackpot_prizes
                 WHERE campaign_id = $1 AND is_jackpot = FALSE
              ), 0)
            )
            AND (
              $7 = TRUE
              OR NOT EXISTS (
                SELECT 1 FROM jackpot_prizes
                 WHERE campaign_id = $1
                   AND is_jackpot = TRUE
                   AND draw_order <= $6
              )
            )
         RETURNING *
       ),
       audit AS (
         INSERT INTO jackpot_audit_log (
           campaign_id, action, entity_type, entity_id, new_value, performed_by
         )
         SELECT campaign_id, 'prize_created', 'prize', id::text,
                jsonb_build_object(
                  'prizeName', prize_name,
                  'quantity', quantity,
                  'drawOrder', draw_order,
                  'isJackpot', is_jackpot
                ),
                $10
           FROM created
       )
       SELECT * FROM created`,
      [
        campaign.id,
        input.prizeName,
        input.prizeDescription,
        input.prizeImageUrl,
        input.quantity,
        input.drawOrder,
        input.isJackpot,
        input.allowPreviousWinner,
        input.status,
        auth.session!.staffId,
      ],
    ) as unknown as Array<Record<string, unknown>>;
    if (!rows[0]) return jackpotError("Prize order is invalid or drawing has already started.", 409);
    return NextResponse.json({ prize: rows[0] }, { status: 201, headers: privateHeaders });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "23505") return jackpotError("Prize order or Jackpot already exists.", 409);
    return jackpotFailure(error);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;
  try {
    const payload = await request.json() as PrizeInput;
    const prizeId = typeof payload.prizeId === "string" ? payload.prizeId : "";
    const input = parsePrizeInput(payload);
    if (!/^[0-9a-f-]{36}$/i.test(prizeId) || !input) return jackpotError("Enter valid prize details.");
    const campaign = await getCampaign();
    const sql = getJackpotDb();
    const rows = await sql.query(
      `WITH previous AS (
         SELECT * FROM jackpot_prizes
          WHERE id = $2 AND campaign_id = $1
            AND NOT EXISTS (
              SELECT 1 FROM jackpot_draws WHERE campaign_id = $1
            )
       ),
       updated AS (
         UPDATE jackpot_prizes pr
            SET prize_name = $3,
                prize_description = NULLIF($4, ''),
                prize_image_url = NULLIF($5, ''),
                quantity = $6,
                remaining_quantity = $6,
                draw_order = $7,
                is_jackpot = $8,
                allow_previous_winner = $9,
                status = $10,
                updated_at = NOW()
           FROM previous
          WHERE pr.id = previous.id
            AND (
              $8 = FALSE
              OR $7 > COALESCE((
                SELECT MAX(draw_order) FROM jackpot_prizes
                 WHERE campaign_id = $1 AND is_jackpot = FALSE AND id <> $2
              ), 0)
            )
            AND (
              $8 = TRUE
              OR NOT EXISTS (
                SELECT 1 FROM jackpot_prizes
                 WHERE campaign_id = $1 AND is_jackpot = TRUE
                   AND id <> $2 AND draw_order <= $7
              )
            )
         RETURNING pr.*
       ),
       audit AS (
         INSERT INTO jackpot_audit_log (
           campaign_id, action, entity_type, entity_id,
           previous_value, new_value, performed_by
         )
         SELECT updated.campaign_id, 'prize_updated', 'prize', updated.id::text,
                to_jsonb(previous), to_jsonb(updated), $11
           FROM updated, previous
       )
       SELECT * FROM updated`,
      [
        campaign.id,
        prizeId,
        input.prizeName,
        input.prizeDescription,
        input.prizeImageUrl,
        input.quantity,
        input.drawOrder,
        input.isJackpot,
        input.allowPreviousWinner,
        input.status,
        auth.session!.staffId,
      ],
    ) as unknown as Array<Record<string, unknown>>;
    if (!rows[0]) return jackpotError("Prize cannot be changed after drawing begins.", 409);
    return NextResponse.json({ prize: rows[0] }, { headers: privateHeaders });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "23505") return jackpotError("Prize order or Jackpot already exists.", 409);
    return jackpotFailure(error);
  }
}
