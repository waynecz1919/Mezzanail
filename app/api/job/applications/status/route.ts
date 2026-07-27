import { NextRequest, NextResponse } from "next/server";
import { findJobApplicationStatusByIdempotency } from "@/lib/job/db";
import { jobApiFailure, jobPrivateHeaders } from "@/lib/job/http";
import { hashIdempotencyKey, isValidIdempotencyKey } from "@/lib/job/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!isValidIdempotencyKey(idempotencyKey)) {
    return jobApiFailure(
      {
        success: false,
        errorCode: "INVALID_REQUEST",
        message: "Application status is unavailable.",
        retryable: false,
      },
      400,
    );
  }
  try {
    const record = await findJobApplicationStatusByIdempotency(
      hashIdempotencyKey(idempotencyKey!),
    );
    if (!record) throw new Error("NOT_FOUND");
    return NextResponse.json(
      {
        applicationReference: record.application_reference,
        submissionStatus: record.submission_status,
        emailAccepted: record.email_status === "accepted",
        errorCode: record.last_error_code,
      },
      { headers: jobPrivateHeaders },
    );
  } catch {
    return jobApiFailure(
      {
        success: false,
        errorCode: "SERVICE_UNAVAILABLE",
        message: "Application status is unavailable.",
        retryable: true,
      },
      404,
    );
  }
}
