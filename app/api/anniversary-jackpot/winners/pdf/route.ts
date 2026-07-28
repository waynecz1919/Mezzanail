import PDFDocument from "pdfkit";
import { getJackpotDb } from "@/lib/jackpot/db";
import {
  isJackpotAdmin,
  jackpotError,
  jackpotFailure,
  requireJackpotStaff,
} from "@/lib/jackpot/http";
import { getCampaign } from "@/lib/jackpot/service";

export const runtime = "nodejs";

function formatDate(value: unknown) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(String(value)));
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
              d.status, COALESCE(d.confirmed_by, d.drawn_by) AS operator
         FROM jackpot_draws d
         JOIN jackpot_prizes pr ON pr.id = d.prize_id
         JOIN jackpot_participants pa ON pa.id = d.participant_id
        WHERE d.campaign_id = $1
        ORDER BY pr.draw_order, d.draw_sequence`,
      [campaign.id],
    ) as Array<Record<string, unknown>>;

    const document = new PDFDocument({ size: "A4", margin: 42, info: { Title: campaign.name } });
    const chunks: Buffer[] = [];
    document.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    const completed = new Promise<Buffer>((resolve, reject) => {
      document.on("end", () => resolve(Buffer.concat(chunks)));
      document.on("error", reject);
    });

    document.fillColor("#5a1f2d").fontSize(10).text("MEZZANAIL · 7TH ANNIVERSARY");
    document.moveDown(0.5).fillColor("#1f1720").font("Helvetica-Bold").fontSize(22)
      .text("Jackpot Draw — Winner Summary");
    document.moveDown(0.4).font("Helvetica").fillColor("#71666a").fontSize(10)
      .text(`Event date: ${campaign.event_date} · Generated: ${formatDate(new Date())}`);
    document.moveDown(1.2);

    if (!rows.length) {
      document.fillColor("#71666a").fontSize(12).text("No draw records yet.");
    } else {
      rows.forEach((row, index) => {
        if (document.y > 730) document.addPage();
        document
          .roundedRect(42, document.y, 511, 76, 7)
          .fillAndStroke(index % 2 === 0 ? "#fbf7f4" : "#ffffff", "#ead9dc");
        const top = document.y + 12;
        document.fillColor("#9b7250").font("Helvetica-Bold").fontSize(8)
          .text(`DRAW ${row.draw_sequence} · ${String(row.status).toUpperCase()}`, 55, top);
        document.fillColor("#1f1720").fontSize(12)
          .text(String(row.prize_name), 55, top + 15, { width: 220 });
        document.font("Helvetica").fontSize(10)
          .text(`${row.customer_name} · ${row.member_id || "No member ID"} · ****${row.phone_last4}`, 55, top + 34);
        document.fillColor("#71666a").fontSize(8)
          .text(`Drawn ${formatDate(row.drawn_at)} · Confirmed ${formatDate(row.confirmed_at)} · ${row.operator}`, 55, top + 51);
        document.y = top + 77;
      });
    }

    document.moveDown(1).fillColor("#71666a").fontSize(8)
      .text("Internal record. Phone numbers are limited to the final four digits.");
    document.end();
    const pdf = await completed;

    await sql.query(
      `INSERT INTO jackpot_audit_log (
         campaign_id, action, entity_type, entity_id, new_value, performed_by
       ) VALUES ($1, 'export_performed', 'winner_list', $1::text, $2::jsonb, $3)`,
      [campaign.id, JSON.stringify({ format: "pdf", rows: rows.length }), session.staffId],
    );

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="mezzanail-jackpot-winners.pdf"',
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  } catch (error) {
    return jackpotFailure(error);
  }
}
