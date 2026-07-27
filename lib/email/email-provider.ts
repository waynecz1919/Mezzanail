import "server-only";

export type EmailAttachment = {
  filename: string;
  content: Uint8Array;
};

export type SendEmailRequest = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments: EmailAttachment[];
  idempotencyKey: string;
};

export type SendEmailResult = {
  accepted: true;
  providerMessageId: string;
};

export interface EmailProvider {
  send(request: SendEmailRequest): Promise<SendEmailResult>;
}

type ResendResponse = {
  id?: string;
  name?: string;
};

export function createEmailProvider(): EmailProvider {
  const provider = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();
  if (provider !== "resend") throw new Error("EMAIL_PROVIDER_NOT_SUPPORTED");
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  if (!apiKey) throw new Error("EMAIL_PROVIDER_NOT_CONFIGURED");

  return {
    async send(request) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": request.idempotencyKey,
        },
        body: JSON.stringify({
          from: request.from,
          to: [request.to],
          subject: request.subject,
          text: request.text,
          html: request.html,
          attachments: request.attachments.map((attachment) => ({
            filename: attachment.filename,
            content: Buffer.from(attachment.content).toString("base64"),
          })),
        }),
        cache: "no-store",
      });

      const body = (await response.json().catch(() => ({}))) as ResendResponse;
      if (!response.ok || !body.id) {
        throw new Error(`EMAIL_PROVIDER_REJECTED_${response.status}`);
      }
      return { accepted: true, providerMessageId: body.id };
    },
  };
}
