"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";

const RESULT_KEY = "mezzanail-job-submission";

type StoredResult = {
  applicationReference: string;
  idempotencyKey: string;
  submissionStatus: string;
};

export function JobApplicationReceived() {
  const [result, setResult] = useState<StoredResult | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    window.gtag?.("event", "page_view", {
      page_title: "Mezzanail Job Application Received",
      page_path: "/job/application-received",
      page_location: "https://www.mezzanail.com/job/application-received",
    });
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const raw = window.sessionStorage.getItem(RESULT_KEY);
      if (!raw) {
        setChecking(false);
        return;
      }
      try {
        const stored = JSON.parse(raw) as StoredResult;
        if (!/^MN-JOB-\d{8}-[A-Z0-9]{4}$/.test(stored.applicationReference)) {
          throw new Error("INVALID_REFERENCE");
        }
        setResult(stored);
        fetch(`/api/job/applications/${encodeURIComponent(stored.applicationReference)}`, {
          headers: { "Idempotency-Key": stored.idempotencyKey },
          cache: "no-store",
        })
          .then(async (response) => {
            if (!response.ok) return;
            const status = (await response.json()) as {
              applicationReference: string;
              submissionStatus: string;
              emailAccepted: boolean;
            };
            if (status.emailAccepted) {
              const next = { ...stored, submissionStatus: "submitted" };
              setResult(next);
              window.sessionStorage.setItem(RESULT_KEY, JSON.stringify(next));
            }
          })
          .finally(() => setChecking(false));
      } catch {
        window.sessionStorage.removeItem(RESULT_KEY);
        setChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!result) {
    return (
      <main className="job-result-shell">
        <div className="job-result-card">
          <div className="eyebrow">APPLICATION STATUS · 申请状态</div>
          <h1>Application reference unavailable</h1>
          <p>
            Return to the application page to review or submit your draft.
            <br />
            请返回申请页面查看或提交草稿。
          </p>
          <Link href="/job" className="btn btn-dark">
            Return to application · 返回申请
          </Link>
        </div>
      </main>
    );
  }

  const whatsappMessage = [
    "Hello Mezzanail Nail Studio, I would like to send my nail portfolio photos.",
    "",
    "Application Reference:",
    result.applicationReference,
  ].join("\n");
  const whatsappUrl = `https://api.whatsapp.com/send?phone=60162121332&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="job-result-shell">
      <div className="job-result-card">
        <span className="job-result-icon" aria-hidden="true">
          <CheckCircle2 size={34} />
        </span>
        <div className="eyebrow">APPLICATION RECEIVED · 申请已收到</div>
        <h1>Application Received</h1>
        <h2>申请已收到</h2>
        <p>
          Your application PDF has been sent to the Mezzanail hiring team.
          <br />
          申请PDF已发送至Mezzanail招聘负责人。
        </p>
        <div className="job-reference-box">
          <span>Application Reference · 申请编号</span>
          <strong>{result.applicationReference}</strong>
        </div>
        <p>
          Our team will contact shortlisted candidates through WhatsApp.
          <br />
          招聘团队将通过WhatsApp联系合适的申请者。
        </p>
        <p className="job-result-note">
          You may send your nail portfolio photos through WhatsApp and include your application
          reference.
          <br />
          您可以通过WhatsApp发送美甲作品照片，并附上申请编号。
        </p>
        <div className="job-result-actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            <MessageCircle size={17} />
            Send portfolio via WhatsApp
          </a>
          <Link href="/" className="btn btn-ghost">
            Return to Mezzanail
          </Link>
        </div>
        {checking ? <span className="job-status-check">Confirming submission status…</span> : null}
      </div>
    </main>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
