import { NextRequest, NextResponse } from "next/server";
import {
  acquireJobApplication,
  failJobApplication,
  isJobRateLimited,
  reserveJobApplication,
  submitJobApplication,
} from "@/lib/job/db";
import { generateJobApplicationPdf } from "@/lib/job/pdf";
import {
  auditJobApplication,
  hashApplicationPayload,
  hashIdempotencyKey,
  hashRequesterIp,
  isValidIdempotencyKey,
  requesterIp,
} from "@/lib/job/security";
import { hasJobCsrfHeaders, jobApiFailure, jobPrivateHeaders, readLimitedJson } from "@/lib/job/http";
import { validateJobApplication } from "@/lib/job/validation";
import { sendJobApplicationEmail } from "@/lib/email/send-job-application";
import type { JobApplicationFailure, JobApplicationSuccess } from "@/lib/job/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const invalidRequest: JobApplicationFailure = {
  success: false,
  errorCode: "INVALID_REQUEST",
  message: "Please review your application and try again.",
  retryable: true,
};

export async function POST(request: NextRequest) {
  if (!hasJobCsrfHeaders(request)) return jobApiFailure(invalidRequest, 403);
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!isValidIdempotencyKey(idempotencyKey)) return jobApiFailure(invalidRequest, 400);

  let payload: unknown;
  try {
    payload = await readLimitedJson(request);
  } catch {
    return jobApiFailure(invalidRequest, 413);
  }
  const validation = validateJobApplication(payload);
  if (!validation.ok) {
    return NextResponse.json(
      {
        ...invalidRequest,
        message: validation.message,
        fieldErrors: validation.fieldErrors,
      },
      { status: 422, headers: jobPrivateHeaders },
    );
  }
  const application = validation.value;
  if (application.website) {
    auditJobApplication("honeypot_rejected");
    return jobApiFailure(invalidRequest, 400);
  }

  let idempotencyHash: string;
  let payloadHash: string;
  let ipHash: string;
  try {
    idempotencyHash = hashIdempotencyKey(idempotencyKey!);
    payloadHash = hashApplicationPayload(application);
    ipHash = hashRequesterIp(requesterIp(request.headers));
    if (await isJobRateLimited(ipHash)) {
      auditJobApplication("rate_limited");
      return jobApiFailure(
        {
          success: false,
          errorCode: "RATE_LIMITED",
          message: "Too many applications were submitted. Please try again later.",
          retryable: true,
        },
        429,
        { "Retry-After": "600" },
      );
    }
  } catch {
    return jobApiFailure(
      {
        success: false,
        errorCode: "SERVICE_UNAVAILABLE",
        message: "The application service is temporarily unavailable. Please try again.",
        retryable: true,
      },
      503,
    );
  }

  let record: Awaited<ReturnType<typeof reserveJobApplication>>;
  try {
    record = await reserveJobApplication({
      application,
      idempotencyHash,
      payloadHash,
      ipHash,
    });
  } catch {
    auditJobApplication("database_reservation_failed");
    return jobApiFailure(
      {
        success: false,
        errorCode: "SERVICE_UNAVAILABLE",
        message: "The application service is temporarily unavailable. Please try again.",
        retryable: true,
      },
      503,
    );
  }

  if (record.application_payload_hash !== payloadHash) {
    return jobApiFailure(
      {
        ...invalidRequest,
        message: "This submission token belongs to a different application draft.",
        applicationReference: record.application_reference,
      },
      409,
    );
  }
  if (record.email_status === "accepted") {
    const response: JobApplicationSuccess = {
      success: true,
      applicationReference: record.application_reference,
      emailAccepted: true,
    };
    return NextResponse.json(response, { headers: jobPrivateHeaders });
  }

  const locked = await acquireJobApplication(record.application_id).catch(() => null);
  if (!locked) {
    return jobApiFailure(
      {
        success: false,
        errorCode: "SUBMISSION_IN_PROGRESS",
        message: "Your application is still being submitted. Please wait a moment.",
        applicationReference: record.application_reference,
        retryable: true,
      },
      409,
      { "Retry-After": "3" },
    );
  }

  const submittedAt = new Date(record.submitted_at);
  let generated: Awaited<ReturnType<typeof generateJobApplicationPdf>>;
  try {
    generated = await generateJobApplicationPdf({
      application,
      applicationReference: record.application_reference,
      submittedAt,
    });
  } catch {
    await failJobApplication(record.application_id, "PDF_GENERATION_FAILED").catch(() => undefined);
    auditJobApplication("pdf_generation_failed", {
      applicationReference: record.application_reference,
      phoneNumber: application.whatsappNumber,
      errorCode: "PDF_GENERATION_FAILED",
    });
    return jobApiFailure(
      {
        success: false,
        errorCode: "PDF_GENERATION_FAILED",
        message: "We could not generate your application PDF. Please try again.",
        applicationReference: record.application_reference,
        retryable: true,
      },
      500,
    );
  }

  try {
    const email = await sendJobApplicationEmail({
      application,
      applicationReference: record.application_reference,
      submittedAt: generated.submittedAtDisplay,
      pdf: generated.bytes,
      filename: generated.filename,
    });
    await submitJobApplication(record.application_id, email.providerMessageId);
    auditJobApplication("submitted", {
      applicationReference: record.application_reference,
      phoneNumber: application.whatsappNumber,
    });
    const response: JobApplicationSuccess = {
      success: true,
      applicationReference: record.application_reference,
      emailAccepted: true,
    };
    return NextResponse.json(response, { headers: jobPrivateHeaders });
  } catch {
    await failJobApplication(record.application_id, "EMAIL_SEND_FAILED").catch(() => undefined);
    auditJobApplication("email_send_failed", {
      applicationReference: record.application_reference,
      phoneNumber: application.whatsappNumber,
      errorCode: "EMAIL_SEND_FAILED",
    });
    return jobApiFailure(
      {
        success: false,
        errorCode: "EMAIL_SEND_FAILED",
        message: "We could not submit your application. Please try again.",
        applicationReference: record.application_reference,
        retryable: true,
      },
      502,
    );
  } finally {
    generated.bytes.fill(0);
  }
}
