import { randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const APPLICATION_REFERENCE_PATTERN = /^MN-JOB-\d{8}-[A-Z0-9]{4}$/;

function malaysiaDate(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}${value.month}${value.day}`;
}

export function generateApplicationReference(
  now = new Date(),
  entropy: (size: number) => Uint8Array = randomBytes,
) {
  const bytes = entropy(4);
  const suffix = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
  return `MN-JOB-${malaysiaDate(now)}-${suffix}`;
}

export function safeApplicantName(name: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
    .replace(/-+$/g, "");
  return cleaned || "Applicant";
}

export function jobApplicationFilename(applicationReference: string, applicantName: string) {
  if (!APPLICATION_REFERENCE_PATTERN.test(applicationReference)) {
    throw new Error("INVALID_APPLICATION_REFERENCE");
  }
  return `Mezzanail_Job_Application_${applicationReference}_${safeApplicantName(applicantName)}.pdf`;
}
