import { NextRequest, NextResponse } from "next/server";
import { findJobApplicationStatus } from "@/lib/job/db";
import { jobApiFailure, jobPrivateHeaders } from "@/lib/job/http";
import { APPLICATION_REFERENCE_PATTERN } from "@/lib/job/reference";
import { hashIdempotencyKey, isValidIdempotencyKey } from "@/lib/job/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ reference: string }> },
) {
  const { reference } = await context.params;
  const idempotencyKey = request.headers.get("idempotency-key");
  if (
    !APPLICATION_REFERENCE_PATTERN.test(reference) ||
    !isValidIdempotencyKey(idempotencyKey)
  ) {
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
    const record = await findJobApplicationStatus(
      reference,
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
