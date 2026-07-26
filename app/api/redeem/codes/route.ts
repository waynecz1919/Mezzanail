import { NextRequest, NextResponse } from "next/server";
import { createRedeemCode } from "@/lib/redeem/code";
import { getRedeemDb, refreshExpiredCodes } from "@/lib/redeem/db";
import {
  apiError,
  hasValidOrigin,
  privateHeaders,
  requireApiStaff,
} from "@/lib/redeem/http";
import type { RedeemCodeRecord } from "@/lib/redeem/types";
import { validateGenerateInput, validateStatus } from "@/lib/redeem/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const staff = await requireApiStaff();
    if (!staff) return apiError("Authentication required.", 401);
    await refreshExpiredCodes();

    const sql = getRedeemDb();
    const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 120) || "";
    const status = validateStatus(request.nextUrl.searchParams.get("status"));
    const search = `%${query}%`;
    let rows: RedeemCodeRecord[];

    if (status === "all") {
      rows = await sql.query(
        `SELECT *
           FROM redeem_codes
          WHERE ($1 = '' OR customer_name ILIKE $2 OR phone ILIKE $2 OR redeem_code ILIKE $2)
          ORDER BY created_at DESC
          LIMIT 101`,
        [query, search],
      ) as RedeemCodeRecord[];
    } else {
      rows = await sql.query(
        `SELECT *
           FROM redeem_codes
          WHERE status = $1
            AND ($2 = '' OR customer_name ILIKE $3 OR phone ILIKE $3 OR redeem_code ILIKE $3)
          ORDER BY created_at DESC
          LIMIT 101`,
        [status, query, search],
      ) as RedeemCodeRecord[];
    }

    return NextResponse.json(
      { records: rows.slice(0, 100), hasMore: rows.length > 100 },
      { headers: privateHeaders },
    );
  } catch (error) {
    console.error("Redeem records query failed", error instanceof Error ? error.message : "unknown");
    return apiError("Unable to load redeem records.", 503);
  }
}

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return apiError("Invalid request origin.", 403);

  try {
    const staff = await requireApiStaff();
    if (!staff) return apiError("Authentication required.", 401);

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return apiError("Invalid request.");
    }
    const validation = validateGenerateInput(payload);
    if (!validation.ok) return apiError(validation.error);

    const sql = getRedeemDb();
    const input = validation.value;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const code = createRedeemCode(input.voucherType);
      try {
        const rows = await sql.query(
          `INSERT INTO redeem_codes (
             customer_name, phone, customer_group, redeem_code, voucher_type,
             voucher_description, expiry_date, notes
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, NULLIF($8, ''))
           RETURNING *`,
          [
            input.customerName,
            input.phone,
            input.customerGroup,
            code,
            input.voucherType,
            input.voucherDescription,
            input.expiryDate,
            input.notes || "",
          ],
        ) as RedeemCodeRecord[];
        return NextResponse.json({ record: rows[0] }, { status: 201, headers: privateHeaders });
      } catch (error) {
        const code = (error as { code?: string })?.code;
        if (code === "23505") continue;
        throw error;
      }
    }
    return apiError("Unable to allocate a unique redeem code. Try again.", 503);
  } catch (error) {
    console.error("Redeem code generation failed", error instanceof Error ? error.message : "unknown");
    return apiError("Unable to generate redeem code.", 503);
  }
}
