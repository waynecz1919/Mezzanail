import { NextRequest, NextResponse } from "next/server";
import { getRedeemDb, refreshExpiredCodes } from "@/lib/redeem/db";
import {
  apiError,
  hasValidOrigin,
  privateHeaders,
  requireApiStaff,
} from "@/lib/redeem/http";
import type { RedeemCodeRecord } from "@/lib/redeem/types";
import { validateCode } from "@/lib/redeem/validation";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ code: string }> };

function outcome(record: RedeemCodeRecord | undefined) {
  if (!record) return "invalid";
  if (record.status === "redeemed") return "already_redeemed";
  if (record.status === "expired") return "expired";
  if (record.status === "cancelled") return "cancelled";
  return "valid";
}

async function findRecord(code: string) {
  const sql = getRedeemDb();
  const rows = await sql.query(
    "SELECT * FROM redeem_codes WHERE redeem_code = $1 LIMIT 1",
    [code],
  ) as RedeemCodeRecord[];
  return rows[0];
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const staff = await requireApiStaff();
    if (!staff) return apiError("Authentication required.", 401);
    const code = validateCode((await context.params).code);
    if (!code) {
      return NextResponse.json({ outcome: "invalid", record: null }, { headers: privateHeaders });
    }
    await refreshExpiredCodes();
    const record = await findRecord(code);
    return NextResponse.json({ outcome: outcome(record), record: record || null }, { headers: privateHeaders });
  } catch (error) {
    console.error("Redeem code check failed", error instanceof Error ? error.message : "unknown");
    return apiError("Unable to check this code.", 503);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!hasValidOrigin(request)) return apiError("Invalid request origin.", 403);

  try {
    const staff = await requireApiStaff();
    if (!staff) return apiError("Authentication required.", 401);
    const code = validateCode((await context.params).code);
    if (!code) return apiError("Invalid redeem code.");

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("Invalid request.");
    }
    const action = payload && typeof payload === "object"
      ? String((payload as { action?: unknown }).action || "")
      : "";
    const sql = getRedeemDb();
    await refreshExpiredCodes();

    if (action === "redeem") {
      const updated = await sql.query(
        `UPDATE redeem_codes
            SET status = 'redeemed',
                redeemed_at = NOW(),
                redeemed_by = $2
          WHERE redeem_code = $1
            AND status IN ('pending', 'sent')
            AND expiry_date >= CURRENT_DATE
          RETURNING *`,
        [code, staff.staffId],
      ) as RedeemCodeRecord[];
      if (updated[0]) {
        return NextResponse.json(
          { outcome: "redeemed", record: updated[0] },
          { headers: privateHeaders },
        );
      }
      const record = await findRecord(code);
      return NextResponse.json(
        { outcome: outcome(record), record: record || null },
        { status: 409, headers: privateHeaders },
      );
    }

    if (action === "sent") {
      const updated = await sql.query(
        `UPDATE redeem_codes
            SET status = 'sent', sent_at = COALESCE(sent_at, NOW())
          WHERE redeem_code = $1
            AND status = 'pending'
            AND expiry_date >= CURRENT_DATE
          RETURNING *`,
        [code],
      ) as RedeemCodeRecord[];
      const record = updated[0] || await findRecord(code);
      if (!record) return apiError("Invalid redeem code.", 404);
      return NextResponse.json(
        { outcome: outcome(record), record },
        { status: record.status === "sent" ? 200 : 409, headers: privateHeaders },
      );
    }

    if (action === "cancel") {
      const updated = await sql.query(
        `UPDATE redeem_codes
            SET status = 'cancelled'
          WHERE redeem_code = $1
            AND status IN ('pending', 'sent')
          RETURNING *`,
        [code],
      ) as RedeemCodeRecord[];
      const record = updated[0] || await findRecord(code);
      if (!record) return apiError("Invalid redeem code.", 404);
      return NextResponse.json(
        { outcome: outcome(record), record },
        { status: record.status === "cancelled" ? 200 : 409, headers: privateHeaders },
      );
    }

    return apiError("Unsupported action.");
  } catch (error) {
    console.error("Redeem code update failed", error instanceof Error ? error.message : "unknown");
    return apiError("Unable to update this redeem code.", 503);
  }
}
