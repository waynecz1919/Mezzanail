import type { JobApplicationInput } from "@/lib/job/types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildJobApplicationEmail({
  application,
  applicationReference,
  submittedAt,
}: {
  application: JobApplicationInput;
  applicationReference: string;
  submittedAt: string;
}) {
  const portfolio = application.portfolio || "N/A";
  const subject = `New Job Application — ${application.position} — ${application.fullName} — ${applicationReference}`;
  const rows = [
    ["Application Reference", applicationReference],
    ["Applicant", application.fullName],
    ["Position", application.position],
    ["WhatsApp", application.whatsappNumber],
    ["Current Area", application.currentArea],
    ["Available Start Date", application.availableStartDate],
    ["Experience", application.workExperience],
    ["Portfolio", portfolio],
  ] as const;
  const text = [
    "New job application received from the Mezzanail website.",
    "",
    ...rows.flatMap(([label, value]) => [`${label}:`, value, ""]),
    "The complete application is attached as a PDF.",
    "",
    "Submitted from:",
    "https://www.mezzanail.com/job",
    "",
    "Submitted At:",
    submittedAt,
  ].join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#6b5b5d;font-size:12px">${escapeHtml(label)}</th><td style="padding:8px 12px;color:#292326;font-size:14px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const html = `
    <div style="background:#fbf7ef;padding:32px;font-family:Arial,sans-serif;color:#292326">
      <div style="max-width:680px;margin:0 auto;border:1px solid #ddcec6;background:#fffaf3;padding:28px">
        <div style="color:#641b2a;font-size:12px;letter-spacing:.14em">MEZZANAIL NAIL STUDIO</div>
        <h1 style="margin:12px 0 20px;color:#641b2a;font-size:24px">New job application</h1>
        <p>New job application received from the Mezzanail website.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">${htmlRows}</table>
        <p><strong>The complete application is attached as a PDF.</strong></p>
        <p style="margin-top:24px;color:#6b5b5d;font-size:12px">Submitted from:<br><a href="https://www.mezzanail.com/job">https://www.mezzanail.com/job</a><br><br>Submitted At:<br>${escapeHtml(submittedAt)}</p>
      </div>
    </div>`;
  return { subject, text, html };
}
