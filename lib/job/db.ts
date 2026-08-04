import "server-only";

import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { generateApplicationReference } from "@/lib/job/reference";
import type { JobApplicationInput } from "@/lib/job/types";

let client: ReturnType<typeof neon> | null = null;

type JobApplicationRow = {
  application_id: string;
  application_reference: string;
  application_payload_hash: string;
  submission_status: "pending" | "processing" | "failed" | "submitted";
  email_status: "pending" | "failed" | "accepted";
  email_provider_message_id: string | null;
  last_error_code: string | null;
  submitted_at: string | Date;
};

export function getJobDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("JOB_DATABASE_NOT_CONFIGURED");
  client ??= neon(connectionString);
  return client;
}

export async function isJobRateLimited(ipHash: string) {
  const sql = getJobDb();
  const rows = (await sql.query(
    `SELECT COUNT(*)::int AS count
       FROM job_applications
      WHERE requester_ip_hash = $1
        AND submitted_at > NOW() - INTERVAL '10 minutes'`,
    [ipHash],
  )) as { count: number }[];
  return Number(rows[0]?.count || 0) >= 5;
}

export async function reserveJobApplication({
  application,
  idempotencyHash,
  payloadHash,
  ipHash,
}: {
  application: JobApplicationInput;
  idempotencyHash: string;
  payloadHash: string;
  ipHash: string;
}) {
  const sql = getJobDb();
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const applicationReference = generateApplicationReference();
    try {
      const rows = (await sql.query(
        `INSERT INTO job_applications (
           application_id,
           application_reference,
           idempotency_hash,
           application_payload_hash,
           requester_ip_hash,
           applicant_name,
           phone_number,
           position,
           current_area,
           start_date
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (idempotency_hash) DO UPDATE
           SET updated_at = job_applications.updated_at
         RETURNING application_id, application_reference, application_payload_hash,
                   submission_status, email_status, email_provider_message_id, last_error_code,
                   submitted_at`,
        [
          randomUUID(),
          applicationReference,
          idempotencyHash,
          payloadHash,
          ipHash,
          application.fullName,
          application.whatsappNumber,
          application.position,
          application.currentArea,
          application.availableStartDate,
        ],
      )) as JobApplicationRow[];
      return rows[0];
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: unknown }).code)
          : "";
      if (code !== "23505" || attempt === 7) throw error;
    }
  }
  throw new Error("APPLICATION_REFERENCE_EXHAUSTED");
}

export async function acquireJobApplication(applicationId: string) {
  const sql = getJobDb();
  const rows = (await sql.query(
    `UPDATE job_applications
        SET submission_status = 'processing',
            email_status = CASE WHEN email_status = 'failed' THEN 'pending' ELSE email_status END,
            last_error_code = NULL,
            processing_started_at = NOW(),
            updated_at = NOW()
      WHERE application_id = $1
        AND email_status <> 'accepted'
        AND (
          submission_status <> 'processing'
          OR processing_started_at < NOW() - INTERVAL '5 minutes'
        )
      RETURNING application_id, application_reference, application_payload_hash,
                submission_status, email_status, email_provider_message_id, last_error_code,
                submitted_at`,
    [applicationId],
  )) as JobApplicationRow[];
  return rows[0] || null;
}

export async function failJobApplication(applicationId: string, errorCode: string) {
  const sql = getJobDb();
  await sql.query(
    `UPDATE job_applications
        SET submission_status = 'failed',
            email_status = CASE WHEN $2 = 'EMAIL_SEND_FAILED' THEN 'failed' ELSE email_status END,
            last_error_code = $2,
            processing_started_at = NULL,
            updated_at = NOW()
      WHERE application_id = $1
        AND email_status <> 'accepted'`,
    [applicationId, errorCode],
  );
}

export async function submitJobApplication(applicationId: string, providerMessageId: string) {
  const sql = getJobDb();
  await sql.query(
    `UPDATE job_applications
        SET submission_status = 'submitted',
            email_status = 'accepted',
            email_provider_message_id = $2,
            last_error_code = NULL,
            processing_started_at = NULL,
            updated_at = NOW()
      WHERE application_id = $1`,
    [applicationId, providerMessageId],
  );
}

export async function findJobApplicationStatus(
  applicationReference: string,
  idempotencyHash: string,
) {
  const sql = getJobDb();
  const rows = (await sql.query(
    `SELECT application_id, application_reference, application_payload_hash,
            submission_status, email_status, email_provider_message_id, last_error_code,
            submitted_at
       FROM job_applications
      WHERE application_reference = $1
        AND idempotency_hash = $2
      LIMIT 1`,
    [applicationReference, idempotencyHash],
  )) as JobApplicationRow[];
  return rows[0] || null;
}

export async function findJobApplicationStatusByIdempotency(idempotencyHash: string) {
  const sql = getJobDb();
  const rows = (await sql.query(
    `SELECT application_id, application_reference, application_payload_hash,
            submission_status, email_status, email_provider_message_id, last_error_code,
            submitted_at
       FROM job_applications
      WHERE idempotency_hash = $1
      LIMIT 1`,
    [idempotencyHash],
  )) as JobApplicationRow[];
  return rows[0] || null;
}
