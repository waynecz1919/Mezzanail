CREATE TABLE IF NOT EXISTS job_applications (
  application_id UUID PRIMARY KEY,
  application_reference VARCHAR(32) NOT NULL UNIQUE,
  idempotency_hash CHAR(64) NOT NULL UNIQUE,
  application_payload_hash CHAR(64) NOT NULL,
  requester_ip_hash CHAR(64) NOT NULL,
  applicant_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  position TEXT NOT NULL,
  current_area TEXT NOT NULL,
  start_date DATE NOT NULL,
  submission_status VARCHAR(16) NOT NULL DEFAULT 'pending'
    CHECK (submission_status IN ('pending', 'processing', 'failed', 'submitted')),
  email_status VARCHAR(16) NOT NULL DEFAULT 'pending'
    CHECK (email_status IN ('pending', 'failed', 'accepted')),
  email_provider_message_id TEXT,
  pdf_storage_reference TEXT,
  last_error_code VARCHAR(40),
  processing_started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT job_application_reference_format CHECK (
    application_reference ~ '^MN-JOB-[0-9]{8}-[A-Z0-9]{4}$'
  ),
  CONSTRAINT job_application_pdf_is_private CHECK (
    pdf_storage_reference IS NULL
  ),
  CONSTRAINT job_application_email_accepted_audit CHECK (
    email_status <> 'accepted'
    OR NULLIF(BTRIM(email_provider_message_id), '') IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS job_applications_reference_status_idx
  ON job_applications (application_reference, submission_status, email_status);

CREATE INDEX IF NOT EXISTS job_applications_rate_limit_idx
  ON job_applications (requester_ip_hash, submitted_at DESC);

CREATE INDEX IF NOT EXISTS job_applications_submitted_at_idx
  ON job_applications (submitted_at DESC);
