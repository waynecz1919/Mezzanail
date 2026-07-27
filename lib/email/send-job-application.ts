import "server-only";

import {
  createEmailProvider,
  type EmailProvider,
  type SendEmailResult,
} from "@/lib/email/email-provider";
import { buildJobApplicationEmail } from "@/lib/email/templates/job-application-email";
import type { JobApplicationInput } from "@/lib/job/types";

export const JOB_APPLICATION_RECIPIENT = "mezzanailstudio@gmail.com";
export const DEFAULT_JOB_EMAIL_FROM = "Mezzanail Careers <jobs@mezzanail.com>";

export async function sendJobApplicationEmail({
  application,
  applicationReference,
  submittedAt,
  pdf,
  filename,
  provider = createEmailProvider(),
}: {
  application: JobApplicationInput;
  applicationReference: string;
  submittedAt: string;
  pdf: Uint8Array;
  filename: string;
  provider?: EmailProvider;
}): Promise<SendEmailResult> {
  const configuredRecipient = process.env.JOB_APPLICATION_RECIPIENT?.trim();
  if (configuredRecipient && configuredRecipient.toLowerCase() !== JOB_APPLICATION_RECIPIENT) {
    throw new Error("JOB_APPLICATION_RECIPIENT_MISMATCH");
  }
  const from = process.env.EMAIL_FROM_ADDRESS?.trim() || DEFAULT_JOB_EMAIL_FROM;
  const content = buildJobApplicationEmail({
    application,
    applicationReference,
    submittedAt,
  });
  return provider.send({
    from,
    to: JOB_APPLICATION_RECIPIENT,
    subject: content.subject,
    text: content.text,
    html: content.html,
    attachments: [{ filename, content: pdf }],
    idempotencyKey: `job-application/${applicationReference}`,
  });
}
