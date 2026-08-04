# Mezzanail job application runbook

## Public routes and SEO

- Canonical application page: `https://www.mezzanail.com/job`
- Legacy route: `/vacancy` permanently redirects to `/job`
- Private result page: `/job/application-received`
- Analytics page name: `Mezzanail Job Application`
- The canonical route is included in `app/sitemap.ts`
- The page publishes `JobPosting` structured data. The salary remains
  `RM2500–RM3000`.

## Submission sequence

1. The applicant completes the bilingual form and reviews every public field.
2. The applicant confirms data accuracy and the recruitment privacy notice.
3. The browser submits the form to `POST /api/job/applications` with a same-origin
   custom request header and an idempotency token.
4. The server enforces the request-size limit, origin/CSRF checks, honeypot,
   rate limit and full field validation.
5. PostgreSQL reserves one application reference for the idempotency token.
6. The server creates a real A4 PDF in memory with an embedded Noto Sans SC font.
7. Resend sends the PDF as an attachment. The provider request uses
   `job-application/{ApplicationReference}` as its idempotency key.
8. Only after Resend accepts the email does the database state become
   `submitted/accepted` and the browser show the success page.

The recipient, subject shape and message body are controlled by server code.
The applicant cannot submit or override a recipient.

## PDF

Filename:

`Mezzanail_Job_Application_{ApplicationReference}_{SafeApplicantName}.pdf`

The filename removes path characters, emoji, control characters and excessive
name length. The PDF contains only:

1. Basic Information / 基本资料
2. Experience / 相关经验
3. Nail Skills / 美甲技能
4. Additional Information / 附加资料
5. Applicant Declaration / 申请人确认

It never includes interviewer assessment, internal ratings, hiring decisions or
internal remarks. The PDF is attached directly from server memory and then
released; `pdf_storage_reference` remains `NULL`.

## Email

- Provider: Resend Email API
- Suggested sender: `Mezzanail Careers <jobs@mezzanail.com>`
- Actual sender: `EMAIL_FROM_ADDRESS`, which must be verified by the provider
- Fixed recipient: `mezzanailstudio@gmail.com`
- Subject:
  `New Job Application — {Position} — {ApplicantName} — {ApplicationReference}`

The API key and provider diagnostics never enter client code or browser
responses.

## Retry and failure handling

- PDF failure: no email is attempted; the draft and reference are retained.
- Email failure: success is not displayed; the draft and reference are retained.
- Retry: the browser reuses the same request token and the server reuses the same
  reference.
- Concurrency: PostgreSQL permits one processing lease at a time.
- Provider duplication: Resend receives the stable reference-based idempotency
  key.
- Refresh: the browser can query private submission status with the saved request
  token; no application data is placed in the URL.
- Applicant PDF download: a private same-origin POST regenerates the PDF. It does
  not create a permanent or public URL.
- WhatsApp fallback: `60162121332`, for submission help, portfolio photos and
  follow-up only.

## Privacy

The form does not collect NRIC, passport, bank, identity-document images or card
details. Drafts stay in browser `sessionStorage`. Analytics records only fixed
page names and paths. Application fields are never sent to analytics. Production
audit logs contain only the application reference, event, error code and the last
four phone digits.

## Manual QA

1. Run `pnpm db:migrate:job` against a non-production database.
2. Configure a Resend sending-only key and a verified
   `EMAIL_FROM_ADDRESS`; keep the fixed recipient value.
3. Run `pnpm dev`, open `http://localhost:3000/job`, and complete the form on
   desktop and a narrow mobile viewport.
4. Confirm Review blocks missing fields and unchecked declarations.
5. Submit once and confirm the button is disabled with the bilingual loading
   label until the provider responds.
6. Confirm the success page shows only the reference and status.
7. Inspect the received email subject, text and attached PDF; check Chinese
   glyphs, long paragraphs, page breaks and the absence of internal assessment
   fields.
8. Reuse the same request token in a test client and confirm no duplicate email
   is created.
9. Simulate an invalid provider key. Confirm no success page appears, the same
   reference is retained, PDF download works and Retry is available.
10. Open `/vacancy` and confirm the permanent redirect to `/job`.
