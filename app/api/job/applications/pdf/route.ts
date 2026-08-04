import { NextRequest, NextResponse } from "next/server";
import { findJobApplicationStatus } from "@/lib/job/db";
import { hasJobCsrfHeaders, jobApiFailure, jobPrivateHeaders, readLimitedJson } from "@/lib/job/http";
import { generateJobApplicationPdf, pdfGenerationFailureCode } from "@/lib/job/pdf";
import {
  hashApplicationPayload,
  hashIdempotencyKey,
  isValidIdempotencyKey,
} from "@/lib/job/security";
import { validateJobApplication } from "@/lib/job/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!hasJobCsrfHeaders(request)) {
    return jobApiFailure(
      {
        success: false,
        errorCode: "INVALID_REQUEST",
        message: "The PDF request was not accepted.",
        retryable: true,
      },
      403,
    );
  }
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!isValidIdempotencyKey(idempotencyKey)) {
    return jobApiFailure(
      {
        success: false,
        errorCode: "INVALID_REQUEST",
        message: "The PDF request was not accepted.",
        retryable: true,
      },
      400,
    );
  }

  try {
    const payload = await readLimitedJson(request);
    const validation = validateJobApplication(payload);
    if (!validation.ok || validation.value.website) throw new Error("INVALID_APPLICATION");
    const idempotencyHash = hashIdempotencyKey(idempotencyKey!);
    const reference =
      payload && typeof payload === "object" && "applicationReference" in payload
        ? String((payload as { applicationReference: unknown }).applicationReference)
        : "";
    const record = await findJobApplicationStatus(reference, idempotencyHash);
    if (!record || record.application_payload_hash !== hashApplicationPayload(validation.value)) {
      throw new Error("APPLICATION_NOT_FOUND");
    }
    const generated = await generateJobApplicationPdf({
      application: validation.value,
      applicationReference: record.application_reference,
      submittedAt: new Date(record.submitted_at),
    });
    const response = new NextResponse(Buffer.from(generated.bytes), {
      status: 200,
      headers: {
        ...jobPrivateHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${generated.filename}"`,
        "Content-Length": String(generated.bytes.byteLength),
      },
    });
    generated.bytes.fill(0);
    return response;
  } catch (error) {
    console.info(
      JSON.stringify({
        scope: "job-application",
        event: "pdf_download_failed",
        errorCode: pdfGenerationFailureCode(error),
        at: new Date().toISOString(),
      }),
    );
    return jobApiFailure(
      {
        success: false,
        errorCode: "PDF_GENERATION_FAILED",
        message: "We could not prepare the application PDF. Please try again.",
        retryable: true,
      },
      500,
    );
  }
}
