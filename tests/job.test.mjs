import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const page = read("app/job/page.tsx");
const form = read("components/job/job-application-experience.tsx");
const successPage = read("components/job/job-application-received.tsx");
const route = read("app/api/job/applications/route.ts");
const pdfRoute = read("app/api/job/applications/pdf/route.ts");
const pdf = read("lib/job/pdf.ts");
const validation = read("lib/job/validation.ts");
const reference = read("lib/job/reference.ts");
const email = read("lib/email/send-job-application.ts");
const emailTemplate = read("lib/email/templates/job-application-email.ts");
const provider = read("lib/email/email-provider.ts");
const migration = read("db/migrations/002_create_job_applications.sql");
const config = read("next.config.ts");

test("job route has exact canonical SEO and vacancy is a permanent redirect", () => {
  assert.match(page, /Nail Artist & Nail Apprentice Jobs \| Mezzanail Nail Studio Melaka/);
  assert.match(page, /https:\/\/www\.mezzanail\.com\/job/);
  assert.match(page, /"@type": "JobPosting"/);
  assert.match(page, /minValue: 2500/);
  assert.match(page, /maxValue: 3000/);
  assert.match(config, /source: "\/vacancy"/);
  assert.match(config, /destination: "\/job"/);
  assert.match(config, /permanent: true/);
  assert.match(read("app/sitemap.ts"), /`\$\{baseUrl\}\/job`/);
});

test("form collects only approved public application fields and validates on the server", () => {
  for (const field of [
    "fullName",
    "whatsappNumber",
    "currentArea",
    "availableStartDate",
    "position",
    "workingArrangement",
    "transportation",
    "workExperience",
    "reasonForApplying",
    "languagesSpoken",
  ]) {
    assert.match(form, new RegExp(field));
    assert.match(validation, new RegExp(field));
  }
  assert.doesNotMatch(validation, /\bnric\s*:/i);
  assert.doesNotMatch(validation, /\bpassport\s*:/i);
  assert.doesNotMatch(validation, /\bbankDetails\s*:/i);
  assert.match(validation, /input\.declarationAccepted !== true/);
  assert.match(validation, /input\.privacyAccepted !== true/);
});

test("application reference and filename exclude applicant identity data", () => {
  assert.match(reference, /\^MN-JOB-\\d\{8\}-\[A-Z0-9\]\{4\}\$/);
  assert.match(reference, /randomBytes/);
  assert.doesNotMatch(reference, /whatsapp|phone/i);
  assert.match(reference, /replace\(\/\[\^A-Za-z0-9\]\+\/g, "-"\)/);
  assert.match(reference, /Mezzanail_Job_Application_/);
});

test("PDF uses a real A4 bilingual layout and excludes internal assessment data", () => {
  assert.match(pdf, /const A4 = \{ width: 595\.28, height: 841\.89 \}/);
  assert.match(pdf, /NotoSansSC_400Regular\.ttf/);
  assert.match(pdf, /MEZZANAIL NAIL STUDIO/);
  for (const section of [
    "BASIC INFORMATION",
    "EXPERIENCE",
    "NAIL SKILLS",
    "ADDITIONAL INFORMATION",
    "APPLICANT DECLARATION",
  ]) {
    assert.match(pdf, new RegExp(section));
  }
  for (const forbidden of [
    "Interviewer Assessment",
    "Interview Result",
    "Internal Rating",
    "Hiring Decision",
  ]) {
    assert.doesNotMatch(pdf, new RegExp(forbidden));
  }
  assert.match(pdf, /ensureSpace/);
  assert.match(pdf, /document\.end/);
});

test("email recipient, subject, attachment and provider idempotency are server controlled", () => {
  assert.match(email, /JOB_APPLICATION_RECIPIENT = "mezzanailstudio@gmail\.com"/);
  assert.match(email, /JOB_APPLICATION_RECIPIENT_MISMATCH/);
  assert.match(
    emailTemplate,
    /New Job Application — \$\{application\.position\} — \$\{application\.fullName\} — \$\{applicationReference\}/,
  );
  assert.match(email, /attachments: \[\{ filename, content: pdf \}\]/);
  assert.match(email, /job-application\/\$\{applicationReference\}/);
  assert.match(provider, /https:\/\/api\.resend\.com\/emails/);
  assert.match(provider, /"Idempotency-Key": request\.idempotencyKey/);
  assert.match(provider, /EMAIL_PROVIDER_API_KEY/);
  assert.doesNotMatch(form, /EMAIL_PROVIDER_API_KEY|mezzanailstudio@gmail\.com/);
});

test("API waits for PDF and provider acceptance, returns private responses and safe failures", () => {
  const pdfIndex = route.indexOf("generateJobApplicationPdf({");
  const emailIndex = route.indexOf("sendJobApplicationEmail({");
  const submitIndex = route.indexOf("submitJobApplication(record.application_id");
  assert.ok(pdfIndex > -1 && emailIndex > pdfIndex && submitIndex > emailIndex);
  assert.match(route, /PDF_GENERATION_FAILED/);
  assert.match(route, /EMAIL_SEND_FAILED/);
  assert.match(route, /emailAccepted: true/);
  assert.match(read("lib/job/http.ts"), /private, no-store/);
  assert.doesNotMatch(route, /error\.stack|apiKey|smtp/i);
  assert.match(pdfRoute, /Content-Disposition/);
  assert.match(pdfRoute, /jobPrivateHeaders/);
});

test("database and browser flows prevent duplicate submissions and support retry", () => {
  assert.match(migration, /idempotency_hash CHAR\(64\) NOT NULL UNIQUE/);
  assert.match(migration, /application_reference VARCHAR\(32\) NOT NULL UNIQUE/);
  assert.match(
    migration,
    /submission_status IN \('pending', 'processing', 'failed', 'submitted'\)/,
  );
  assert.match(migration, /pdf_storage_reference IS NULL/);
  assert.match(
    read("lib/job/db.ts"),
    /processing_started_at < NOW\(\) - INTERVAL '5 minutes'/,
  );
  assert.match(form, /Idempotency-Key/);
  assert.match(form, /submissionStatus/);
  assert.match(form, /Try Again · 重新尝试/);
  assert.match(form, /Download Application PDF · 下载申请PDF/);
  assert.match(form, /Contact via WhatsApp · 通过WhatsApp联系/);
});

test("anti-abuse, privacy and success-page restrictions are present", () => {
  assert.match(route, /isJobRateLimited/);
  assert.match(route, /application\.website/);
  assert.match(route, /readLimitedJson/);
  assert.match(read("lib/job/http.ts"), /hasValidJobOrigin/);
  assert.match(read("lib/job/http.ts"), /x-mezzanail-request/);
  assert.match(read("lib/job/security.ts"), /phoneLast4/);
  assert.doesNotMatch(successPage, /fullName|whatsappNumber|currentArea|workExperience/);
  assert.match(successPage, /applicationReference/);
  assert.match(successPage, /portfolio photos through WhatsApp/);
  assert.match(form, /page_title: "Mezzanail Job Application"/);
});
