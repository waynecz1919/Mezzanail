import { NextResponse } from "next/server";
import { getJackpotDb } from "@/lib/jackpot/db";
import {
  isJackpotAdmin,
  jackpotError,
  jackpotFailure,
  requireJackpotStaff,
} from "@/lib/jackpot/http";
import { getCampaign } from "@/lib/jackpot/service";

export const runtime = "nodejs";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await requireJackpotStaff();
  if (!session) return jackpotError("Authentication required.", 401);
  if (!isJackpotAdmin(session)) return jackpotError("Owner or Admin access required.", 403);

  try {
    const campaign = await getCampaign();
    const sql = getJackpotDb();
    const rows = await sql.query(
      `SELECT d.draw_sequence, pr.prize_name, pa.customer_name,
              pa.member_id, pa.phone_last4, d.drawn_at, d.confirmed_at,
              d.status, COALESCE(d.confirmed_by, d.drawn_by) AS operator,
              d.void_reason
         FROM jackpot_draws d
         JOIN jackpot_prizes pr ON pr.id = d.prize_id
         JOIN jackpot_participants pa ON pa.id = d.participant_id
        WHERE d.campaign_id = $1
        ORDER BY pr.draw_order, d.draw_sequence`,
      [campaign.id],
    ) as Array<Record<string, unknown>>;
    const header = [
      "Draw Order", "Prize", "Winner Name", "Member ID", "Phone Last 4",
      "Drawn At", "Confirmed At", "Status", "Operator", "Void Reason",
    ];
    const csv = [
      header.map(csvCell).join(","),
      ...rows.map((row) => [
        row.draw_sequence,
        row.prize_name,
        row.customer_name,
        row.member_id,
        row.phone_last4,
        row.drawn_at,
        row.confirmed_at,
        row.status,
        row.operator,
        row.void_reason,
      ].map(csvCell).join(",")),
    ].join("\r\n");

    await sql.query(
      `INSERT INTO jackpot_audit_log (
         campaign_id, action, entity_type, entity_id, new_value, performed_by
       ) VALUES ($1, 'export_performed', 'winner_list', $1::text, $2::jsonb, $3)`,
      [campaign.id, JSON.stringify({ format: "csv", rows: rows.length }), session.staffId],
    );

    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="mezzanail-jackpot-winners.csv"',
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  } catch (error) {
    return jackpotFailure(error);
  }
}
