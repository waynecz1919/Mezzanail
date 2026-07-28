import { NextRequest, NextResponse } from "next/server";
import { parseParticipantCsv } from "@/lib/jackpot/core";
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

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function promotionEntriesCsv() {
  const sql = getJackpotDb();
  const registry = await sql.query(
    "SELECT to_regclass('public.promotion_entries')::text AS table_name",
  ) as Array<{ table_name: string | null }>;
  if (!registry[0]?.table_name) throw new Error("PROMOTION_ENTRY_TABLE_NOT_FOUND");

  const rows = await sql.query(
    `SELECT entry_id, member_id, customer_name, phone_number,
            draw_tickets, eligibility_status, source, created_at
       FROM promotion_entries
      ORDER BY created_at`,
  ) as Array<Record<string, unknown>>;
  const headers = [
    "Entry ID", "Member ID", "Customer Name", "Phone Number",
    "Draw Tickets", "Eligibility Status", "Source", "Created At",
  ];
  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) => [
      row.entry_id,
      row.member_id,
      row.customer_name,
      row.phone_number,
      row.draw_tickets,
      row.eligibility_status,
      row.source,
      row.created_at,
    ].map(csvCell).join(",")),
  ].join("\n");
}

export async function POST(request: NextRequest) {
  if (!requireMutationOrigin(request)) return jackpotError("Invalid request origin.", 403);
  const session = await requireJackpotStaff();
  if (!session) return jackpotError("Authentication required.", 401);
  if (!isJackpotAdmin(session)) return jackpotError("Owner or Admin access required.", 403);

  try {
    const payload = await request.json() as { source?: unknown; csvText?: unknown };
    const source = payload.source === "promotion" ? "promotion" : "csv";
    let csvText = source === "promotion"
      ? await promotionEntriesCsv()
      : typeof payload.csvText === "string"
        ? payload.csvText
        : "";
    if (csvText.length > 2_500_000) return jackpotError("CSV is larger than 2.5 MB.");
    if (!csvText.trim()) return jackpotError("Choose a CSV file containing participants.");

    const { participants, summary } = parseParticipantCsv(csvText);
    csvText = "";
    if (!participants.length) {
      return jackpotError(summary.errors[0] || "No valid participants were found.");
    }

    const campaign = await getCampaign();
    if (campaign.participant_list_locked) {
      return jackpotError("Unlock the participant list before importing.", 409);
    }
    const sql = getJackpotDb();
    const importRows = participants.map((participant) => ({
      entry_id: participant.entryId,
      member_id: participant.memberId,
      customer_name: participant.customerName,
      phone_number: participant.phoneNumber,
      phone_last4: participant.phoneLast4,
      ticket_count: participant.ticketCount,
      eligible: participant.eligible,
      eligibility_status: participant.eligibilityStatus,
      source: source === "promotion" ? "promotion_database" : participant.source,
    }));

    const rows = await sql.query(
      `WITH import_lock AS (
         SELECT pg_advisory_xact_lock(hashtextextended($1::text, 0))
       ),
       target AS (
         SELECT c.id
           FROM jackpot_campaigns c, import_lock
          WHERE c.id = $1
            AND c.participant_list_locked = FALSE
            AND NOT EXISTS (
              SELECT 1 FROM jackpot_draws d WHERE d.campaign_id = c.id
            )
       ),
       removed AS (
         DELETE FROM jackpot_participants p
          USING target
          WHERE p.campaign_id = target.id
          RETURNING p.id
       ),
       imported AS (
         INSERT INTO jackpot_participants (
           campaign_id, entry_id, member_id, customer_name, phone_number,
           phone_last4, ticket_count, eligible, eligibility_status, source
         )
         SELECT target.id, x.entry_id, NULLIF(x.member_id, ''), x.customer_name,
                x.phone_number, x.phone_last4, x.ticket_count, x.eligible,
                x.eligibility_status, x.source
           FROM target
           CROSS JOIN jsonb_to_recordset($2::jsonb) AS x(
             entry_id text,
             member_id text,
             customer_name text,
             phone_number text,
             phone_last4 text,
             ticket_count integer,
             eligible boolean,
             eligibility_status text,
             source text
           )
         RETURNING id
       ),
       audit AS (
         INSERT INTO jackpot_audit_log (
           campaign_id, action, entity_type, entity_id,
           previous_value, new_value, performed_by
         )
         SELECT target.id, 'participant_list_imported', 'campaign', target.id::text,
                jsonb_build_object('removedParticipants', (SELECT COUNT(*) FROM removed)),
                $3::jsonb,
                $4
           FROM target
       )
       SELECT COUNT(*)::int AS imported_count FROM imported`,
      [campaign.id, JSON.stringify(importRows), JSON.stringify(summary), session.staffId],
    ) as Array<{ imported_count: number }>;
    if (!rows[0] || Number(rows[0].imported_count) !== participants.length) {
      throw new Error("PARTICIPANT_IMPORT_CONFLICT");
    }

    return NextResponse.json({ summary }, { status: 201, headers: privateHeaders });
  } catch (error) {
    if (error instanceof Error && error.message === "PROMOTION_ENTRY_TABLE_NOT_FOUND") {
      return jackpotError(
        "No compatible promotion_entries table was found. Export the final list as CSV and import it here.",
        409,
      );
    }
    if (error instanceof Error && error.message.startsWith("CSV ")) {
      return jackpotError(error.message);
    }
    return jackpotFailure(error);
  }
}
