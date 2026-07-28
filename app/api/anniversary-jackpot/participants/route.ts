import { NextRequest, NextResponse } from "next/server";
import { normalizePhone } from "@/lib/jackpot/core";
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

type ParticipantInput = {
  customerName?: unknown;
  memberId?: unknown;
  phoneNumber?: unknown;
  ticketCount?: unknown;
  eligibilityStatus?: unknown;
  entryId?: unknown;
};

function parseParticipantInput(payload: ParticipantInput) {
  const customerName = typeof payload.customerName === "string"
    ? payload.customerName.trim().slice(0, 160)
    : "";
  const memberId = typeof payload.memberId === "string"
    ? payload.memberId.trim().slice(0, 80)
    : "";
  const phoneNumber = typeof payload.phoneNumber === "string"
    ? normalizePhone(payload.phoneNumber)
    : "";
  const ticketCount = Number(payload.ticketCount);
  const eligibilityStatus = payload.eligibilityStatus === "ineligible"
    ? "ineligible"
    : "eligible";
  const entryId = typeof payload.entryId === "string"
    ? payload.entryId.trim().slice(0, 100)
    : "";

  if (!customerName || !/^\d{10,15}$/.test(phoneNumber)) return null;
  if (!Number.isInteger(ticketCount) || ticketCount < 1 || ticketCount > 10000) return null;

  return {
    customerName,
    memberId,
    phoneNumber,
    ticketCount,
    eligible: eligibilityStatus === "eligible",
    eligibilityStatus,
    entryId,
  };
}

export async function POST(request: NextRequest) {
  if (!requireMutationOrigin(request)) return jackpotError("Invalid request origin.", 403);
  const session = await requireJackpotStaff();
  if (!session) return jackpotError("Authentication required.", 401);
  if (!isJackpotAdmin(session)) return jackpotError("Owner or Admin access required.", 403);

  try {
    const input = parseParticipantInput(await request.json() as ParticipantInput);
    if (!input) {
      return jackpotError("Enter a customer name, a valid phone number, and 1–10,000 draw tickets.");
    }

    const campaign = await getCampaign();
    const sql = getJackpotDb();
    const rows = await sql.query(
      `WITH mutation_lock AS (
         SELECT pg_advisory_xact_lock(hashtextextended($1::text, 0))
       ),
       campaign AS (
         SELECT c.id,
                c.participant_list_locked,
                EXISTS (
                  SELECT 1 FROM jackpot_draws d WHERE d.campaign_id = c.id
                ) AS has_draws
           FROM jackpot_campaigns c, mutation_lock
          WHERE c.id = $1
       ),
       duplicate AS (
         SELECT p.id
           FROM jackpot_participants p
           JOIN campaign c ON c.id = p.campaign_id
          WHERE p.phone_number = $5
             OR ($3 <> '' AND LOWER(p.member_id) = LOWER($3))
          LIMIT 1
       ),
       created AS (
         INSERT INTO jackpot_participants (
           campaign_id, entry_id, member_id, customer_name, phone_number,
           phone_last4, ticket_count, eligible, eligibility_status, source
         )
         SELECT c.id, NULLIF($2, ''), NULLIF($3, ''), $4, $5,
                RIGHT($5, 4), $6, $7, $8, 'manual'
           FROM campaign c
          WHERE c.participant_list_locked = FALSE
            AND c.has_draws = FALSE
            AND NOT EXISTS (SELECT 1 FROM duplicate)
         RETURNING id, campaign_id, customer_name, member_id, phone_last4,
                   ticket_count, eligible, eligibility_status
       ),
       audit AS (
         INSERT INTO jackpot_audit_log (
           campaign_id, action, entity_type, entity_id, new_value, performed_by
         )
         SELECT campaign_id, 'participant_added', 'participant', id::text,
                jsonb_build_object(
                  'customerName', customer_name,
                  'memberId', member_id,
                  'phoneLast4', phone_last4,
                  'ticketCount', ticket_count,
                  'eligible', eligible,
                  'eligibilityStatus', eligibility_status,
                  'source', 'manual'
                ),
                $9
           FROM created
       )
       SELECT c.participant_list_locked,
              c.has_draws,
              EXISTS (SELECT 1 FROM duplicate) AS duplicate,
              EXISTS (SELECT 1 FROM created) AS created
         FROM campaign c`,
      [
        campaign.id,
        input.entryId,
        input.memberId,
        input.customerName,
        input.phoneNumber,
        input.ticketCount,
        input.eligible,
        input.eligibilityStatus,
        session.staffId,
      ],
    ) as unknown as Array<{
      participant_list_locked: boolean;
      has_draws: boolean;
      duplicate: boolean;
      created: boolean;
    }>;

    const outcome = rows[0];
    if (outcome?.participant_list_locked) throw new Error("PARTICIPANT_LIST_LOCKED");
    if (outcome?.has_draws) throw new Error("PARTICIPANT_MUTATION_CONFLICT");
    if (outcome?.duplicate) throw new Error("DUPLICATE_PARTICIPANT");
    if (!outcome?.created) throw new Error("PARTICIPANT_MUTATION_CONFLICT");

    return NextResponse.json({ success: true }, { status: 201, headers: privateHeaders });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "23505") return jackpotError("A participant with this member ID or phone number already exists.", 409);
    return jackpotFailure(error);
  }
}
