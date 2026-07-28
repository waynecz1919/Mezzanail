"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Download,
  LoaderCircle,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import {
  employmentStatuses,
  jobPositions,
  nailSkillNames,
  skillLevels,
  transportationOptions,
  workingArrangements,
  type JobApplicationInput,
  type NailSkillName,
} from "@/lib/job/types";
import { validateJobApplication } from "@/lib/job/validation";
import { getWhatsappUrl } from "@/lib/site";

const DRAFT_KEY = "mezzanail-job-draft";
const PENDING_KEY = "mezzanail-job-pending";
const RESULT_KEY = "mezzanail-job-submission";
const nailSkillLabels: Record<NailSkillName, string> = {
  manicure: "Manicure · 手部护理",
  pedicure: "Pedicure · 足部护理",
  gelColor: "Gel Color · 色胶",
  nailArt: "Nail Art · 美甲设计",
  nailExtension: "Nail Extension · 延长",
  nailRemoval: "Nail Removal · 卸甲",
};

const emptyApplication: JobApplicationInput = {
  fullName: "",
  whatsappNumber: "",
  currentArea: "",
  isAdult: false,
  availableStartDate: "",
  position: "Nail Artist",
  workingArrangement: "Full-time",
  transportation: "Own transport",
  skillLevel: "No Experience",
  workExperience: "",
  previousWorkplace: "",
  employmentStatus: "Not currently employed",
  reasonForApplying: "",
  nailSkills: {
    manicure: "No Experience",
    pedicure: "No Experience",
    gelColor: "No Experience",
    nailArt: "No Experience",
    nailExtension: "No Experience",
    nailRemoval: "No Experience",
  },
  languagesSpoken: [],
  portfolio: "",
  additionalNotes: "",
  declarationAccepted: false,
  privacyAccepted: false,
  website: "",
};

type SubmitError = {
  errorCode: string;
  message: string;
  applicationReference?: string;
  fieldErrors?: Record<string, string>;
};

type PendingSubmission = {
  idempotencyKey: string;
  applicationReference?: string;
  submissionStatus: "processing" | "failed";
};

function Field({
  label,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="job-field">
      <span className="job-label">
        {label}
        {required ? <b aria-hidden="true">*</b> : null}
      </span>
      {children}
      {hint ? <small>{hint}</small> : null}
      {error ? <em role="alert">{error}</em> : null}
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="job-summary-item">
      <span>{label}</span>
      <strong>{value || "N/A"}</strong>
    </div>
  );
}

export function JobApplicationExperience() {
  const router = useRouter();
  const [application, setApplication] = useState<JobApplicationInput>(emptyApplication);
  const [step, setStep] = useState<"form" | "review">("form");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<SubmitError | null>(null);
  const [applicationReference, setApplicationReference] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    window.gtag?.("event", "page_view", {
      page_title: "Mezzanail Job Application",
      page_path: "/job",
      page_location: "https://www.mezzanail.com/job",
    });
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const saved = window.sessionStorage.getItem(DRAFT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<JobApplicationInput>;
          setApplication({
            ...emptyApplication,
            ...parsed,
            nailSkills: { ...emptyApplication.nailSkills, ...parsed.nailSkills },
          });
        }
        const pendingRaw = window.sessionStorage.getItem(PENDING_KEY);
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw) as PendingSubmission;
          setIdempotencyKey(pending.idempotencyKey);
          setApplicationReference(pending.applicationReference || "");
          void refreshSubmissionStatus(pending);
        } else {
          setIdempotencyKey(window.crypto.randomUUID());
        }
      } catch {
        setIdempotencyKey(window.crypto.randomUUID());
      } finally {
        setHydrated(true);
      }
    });
    return () => {
      cancelled = true;
    };
    // The hydration pass intentionally runs once for this browser session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(application));
  }, [application, hydrated]);

  async function refreshSubmissionStatus(pending: PendingSubmission) {
    const path = pending.applicationReference
      ? `/api/job/applications/${encodeURIComponent(pending.applicationReference)}`
      : "/api/job/applications/status";
    try {
      const response = await fetch(path, {
        headers: { "Idempotency-Key": pending.idempotencyKey },
        cache: "no-store",
      });
      if (!response.ok) return;
      const status = (await response.json()) as {
        applicationReference: string;
        submissionStatus: string;
        emailAccepted: boolean;
        errorCode?: string;
      };
      setApplicationReference(status.applicationReference);
      if (status.emailAccepted) {
        completeSubmission(status.applicationReference, pending.idempotencyKey);
      } else if (status.submissionStatus === "failed") {
        setSubmitError({
          errorCode: status.errorCode || "EMAIL_SEND_FAILED",
          message: "Your previous submission did not complete. Your draft and application reference have been kept.",
          applicationReference: status.applicationReference,
        });
        window.sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify({
            ...pending,
            applicationReference: status.applicationReference,
            submissionStatus: "failed",
          }),
        );
      }
    } catch {
      // The draft remains available and can be retried manually.
    }
  }

  function completeSubmission(reference: string, token = idempotencyKey) {
    window.sessionStorage.removeItem(DRAFT_KEY);
    window.sessionStorage.removeItem(PENDING_KEY);
    window.sessionStorage.setItem(
      RESULT_KEY,
      JSON.stringify({
        applicationReference: reference,
        idempotencyKey: token,
        submissionStatus: "submitted",
      }),
    );
    router.push("/job/application-received");
  }

  function update<K extends keyof JobApplicationInput>(key: K, value: JobApplicationInput[K]) {
    if (submitError || applicationReference) {
      const token = window.crypto.randomUUID();
      setIdempotencyKey(token);
      setApplicationReference("");
      setSubmitError(null);
      window.sessionStorage.removeItem(PENDING_KEY);
    }
    setApplication((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function updateNailSkill(name: NailSkillName, value: JobApplicationInput["skillLevel"]) {
    update("nailSkills", { ...application.nailSkills, [name]: value });
  }

  function toggleLanguage(language: string) {
    const next = application.languagesSpoken.includes(language)
      ? application.languagesSpoken.filter((item) => item !== language)
      : [...application.languagesSpoken, language];
    update("languagesSpoken", next);
  }

  function reviewApplication() {
    const reviewValidation = validateJobApplication({
      ...application,
      declarationAccepted: true,
      privacyAccepted: true,
    });
    if (!reviewValidation.ok) {
      setFieldErrors(reviewValidation.fieldErrors);
      document.getElementById("job-application")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setFieldErrors({});
    setStep("review");
    document.getElementById("job-application")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitApplication() {
    const validation = validateJobApplication(application);
    if (!validation.ok) {
      setFieldErrors(validation.fieldErrors);
      setStep("review");
      return;
    }
    const token = idempotencyKey || window.crypto.randomUUID();
    setIdempotencyKey(token);
    setSubmitting(true);
    setSubmitError(null);
    window.sessionStorage.setItem(
      PENDING_KEY,
      JSON.stringify({ idempotencyKey: token, submissionStatus: "processing" }),
    );
    try {
      const response = await fetch("/api/job/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": token,
          "X-Mezzanail-Request": "job-application",
        },
        body: JSON.stringify(application),
      });
      const result = (await response.json()) as
        | { success: true; applicationReference: string; emailAccepted: true }
        | (SubmitError & { success: false });
      if (result.success && result.emailAccepted) {
        completeSubmission(result.applicationReference, token);
        return;
      }
      const error = result as SubmitError;
      setSubmitError(error);
      if (error.fieldErrors) setFieldErrors(error.fieldErrors);
      const reference = error.applicationReference || applicationReference;
      setApplicationReference(reference);
      window.sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          idempotencyKey: token,
          applicationReference: reference || undefined,
          submissionStatus: "failed",
        }),
      );
    } catch {
      setSubmitError({
        errorCode: "SERVICE_UNAVAILABLE",
        message: "We could not submit your application. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadPdf() {
    if (!applicationReference || downloading) return;
    setDownloading(true);
    try {
      const response = await fetch("/api/job/applications/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
          "X-Mezzanail-Request": "job-application",
        },
        body: JSON.stringify({ ...application, applicationReference }),
      });
      if (!response.ok) throw new Error("PDF_DOWNLOAD_FAILED");
      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") || "";
      const filename =
        disposition.match(/filename="([^"]+)"/)?.[1] ||
        `Mezzanail_Job_Application_${applicationReference}.pdf`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setSubmitError((current) => ({
        errorCode: current?.errorCode || "PDF_GENERATION_FAILED",
        message: "We could not prepare the PDF download. Your application draft is still saved.",
        applicationReference,
      }));
    } finally {
      setDownloading(false);
    }
  }

  const whatsappUrl = getWhatsappUrl("en", "career");

  return (
    <main>
      <section className="job-hero">
        <div className="shell job-hero-grid">
          <div>
            <div className="eyebrow">CAREERS · 招聘</div>
            <h1>Grow your craft with Mezzanail.</h1>
            <p>
              We are welcoming thoughtful Nail Artists and Nail Apprentices who care about
              precision, people and beautiful work.
              <br />
              我们诚邀重视细节、服务与专业成长的美甲师及美甲学徒加入团队。
            </p>
            <a href="#job-application" className="btn btn-gold">
              Start Application · 开始申请 <ArrowRight size={17} />
            </a>
          </div>
          <aside className="job-opening-card" aria-label="Open positions">
            <span>OPEN POSITIONS · 招聘职位</span>
            <h2>Nail Artist</h2>
            <h2>Nail Apprentice</h2>
            <div>
              <small>Monthly salary · 月薪</small>
              <strong>RM2500–RM3000</strong>
            </div>
            <p>Melaka · Full-time and part-time arrangements available</p>
          </aside>
        </div>
      </section>

      <section className="job-process">
        <div className="shell job-process-grid">
          {[
            ["01", "Complete", "填写资料"],
            ["02", "Review", "检查申请"],
            ["03", "Submit", "安全提交"],
          ].map(([number, title, chinese]) => (
            <div key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <small>{chinese}</small>
            </div>
          ))}
        </div>
      </section>

      <section id="job-application" className="job-application-section">
        <div className="shell">
          <div className="job-application-heading">
            <div>
              <div className="eyebrow">
                {step === "form" ? "APPLICATION FORM · 申请表" : "REVIEW APPLICATION · 检查申请"}
              </div>
              <h2>{step === "form" ? "Tell us about yourself." : "Review before submitting."}</h2>
            </div>
            <div className="job-step-indicator" aria-label={`Step ${step === "form" ? 1 : 2} of 2`}>
              <span className="is-active">1</span>
              <i />
              <span className={step === "review" ? "is-active" : ""}>2</span>
            </div>
          </div>

          {step === "form" ? (
            <form className="job-form" onSubmit={(event) => event.preventDefault()} noValidate>
              <FormSection number="01" title="Basic Information" chinese="基本资料">
                <div className="job-form-grid">
                  <Field label="Full Name · 姓名" error={fieldErrors.fullName} required>
                    <input
                      value={application.fullName}
                      onChange={(event) => update("fullName", event.target.value)}
                      autoComplete="name"
                    />
                  </Field>
                  <Field
                    label="WhatsApp Number · WhatsApp号码"
                    error={fieldErrors.whatsappNumber}
                    required
                  >
                    <input
                      value={application.whatsappNumber}
                      onChange={(event) => update("whatsappNumber", event.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+60"
                    />
                  </Field>
                  <Field label="Current Area · 目前居住地区" error={fieldErrors.currentArea} required>
                    <input
                      value={application.currentArea}
                      onChange={(event) => update("currentArea", event.target.value)}
                      autoComplete="address-level2"
                    />
                  </Field>
                  <Field
                    label="Available Start Date · 可上班日期"
                    error={fieldErrors.availableStartDate}
                    required
                  >
                    <input
                      type="date"
                      value={application.availableStartDate}
                      onChange={(event) => update("availableStartDate", event.target.value)}
                    />
                  </Field>
                  <Field label="Position Applied For · 申请职位" error={fieldErrors.position} required>
                    <select
                      value={application.position}
                      onChange={(event) =>
                        update("position", event.target.value as JobApplicationInput["position"])
                      }
                    >
                      {jobPositions.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Working Arrangement · 工作安排"
                    error={fieldErrors.workingArrangement}
                    required
                  >
                    <select
                      value={application.workingArrangement}
                      onChange={(event) =>
                        update(
                          "workingArrangement",
                          event.target.value as JobApplicationInput["workingArrangement"],
                        )
                      }
                    >
                      {workingArrangements.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Transportation · 交通安排"
                    error={fieldErrors.transportation}
                    required
                  >
                    <select
                      value={application.transportation}
                      onChange={(event) =>
                        update(
                          "transportation",
                          event.target.value as JobApplicationInput["transportation"],
                        )
                      }
                    >
                      {transportationOptions.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </Field>
                  <label className="job-check-card">
                    <input
                      type="checkbox"
                      checked={application.isAdult}
                      onChange={(event) => update("isAdult", event.target.checked)}
                    />
                    <span>
                      <Check size={15} />
                    </span>
                    <strong>
                      I am 18 years old or above
                      <small>我已年满18岁</small>
                    </strong>
                    {fieldErrors.isAdult ? <em>{fieldErrors.isAdult}</em> : null}
                  </label>
                </div>
              </FormSection>

              <FormSection number="02" title="Experience" chinese="相关经验">
                <div className="job-form-grid">
                  <Field label="Skill Level · 技能程度" error={fieldErrors.skillLevel} required>
                    <select
                      value={application.skillLevel}
                      onChange={(event) =>
                        update("skillLevel", event.target.value as JobApplicationInput["skillLevel"])
                      }
                    >
                      {skillLevels.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Current Employment Status · 目前就业状态"
                    error={fieldErrors.employmentStatus}
                    required
                  >
                    <select
                      value={application.employmentStatus}
                      onChange={(event) =>
                        update(
                          "employmentStatus",
                          event.target.value as JobApplicationInput["employmentStatus"],
                        )
                      }
                    >
                      {employmentStatuses.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Work Experience · 工作经验"
                    error={fieldErrors.workExperience}
                    required
                  >
                    <textarea
                      rows={5}
                      value={application.workExperience}
                      onChange={(event) => update("workExperience", event.target.value)}
                      placeholder="Tell us about relevant work or learning experience."
                    />
                  </Field>
                  <Field label="Previous Workplace · 曾任职地点">
                    <input
                      value={application.previousWorkplace}
                      onChange={(event) => update("previousWorkplace", event.target.value)}
                    />
                  </Field>
                  <Field
                    label="Reason for Applying · 申请原因"
                    error={fieldErrors.reasonForApplying}
                    required
                  >
                    <textarea
                      rows={6}
                      value={application.reasonForApplying}
                      onChange={(event) => update("reasonForApplying", event.target.value)}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection number="03" title="Nail Skills" chinese="美甲技能">
                <p className="job-section-intro">
                  Select your current level for each skill. No experience is welcome for apprentice
                  applications.
                  <br />
                  请为每项技能选择目前程度；美甲学徒职位欢迎零经验申请者。
                </p>
                <div className="job-skills-grid">
                  {nailSkillNames.map((name) => (
                    <Field key={name} label={nailSkillLabels[name]}>
                      <select
                        value={application.nailSkills[name]}
                        onChange={(event) =>
                          updateNailSkill(
                            name,
                            event.target.value as JobApplicationInput["skillLevel"],
                          )
                        }
                      >
                        {skillLevels.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </Field>
                  ))}
                </div>
              </FormSection>

              <FormSection number="04" title="Additional Information" chinese="附加资料">
                <div className="job-form-grid">
                  <div className="job-field job-field-wide">
                    <span className="job-label">
                      Languages Spoken · 使用语言<b>*</b>
                    </span>
                    <div className="job-language-options">
                      {["English", "中文", "Bahasa Melayu", "Other"].map((language) => (
                        <label key={language}>
                          <input
                            type="checkbox"
                            checked={application.languagesSpoken.includes(language)}
                            onChange={() => toggleLanguage(language)}
                          />
                          <span>{language}</span>
                        </label>
                      ))}
                    </div>
                    {fieldErrors.languagesSpoken ? (
                      <em role="alert">{fieldErrors.languagesSpoken}</em>
                    ) : null}
                  </div>
                  <Field
                    label="Portfolio / Instagram · 作品集"
                    hint="Optional. You can also send photos through WhatsApp after submitting."
                  >
                    <input
                      value={application.portfolio}
                      onChange={(event) => update("portfolio", event.target.value)}
                      placeholder="@username or portfolio URL"
                    />
                  </Field>
                  <Field label="Additional Notes · 附加说明">
                    <textarea
                      rows={5}
                      value={application.additionalNotes}
                      onChange={(event) => update("additionalNotes", event.target.value)}
                    />
                  </Field>
                  <label className="job-honeypot" aria-hidden="true">
                    Website
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={application.website}
                      onChange={(event) => update("website", event.target.value)}
                    />
                  </label>
                </div>
              </FormSection>

              <div className="job-form-footer">
                <div>
                  <ShieldCheck size={20} />
                  <p>
                    We do not ask for NRIC, passport, bank or card details.
                    <br />
                    我们不会收集身份证、护照、银行或信用卡资料。
                  </p>
                </div>
                <button type="button" className="btn btn-dark" onClick={reviewApplication}>
                  Review Application · 检查申请 <ArrowRight size={17} />
                </button>
              </div>
            </form>
          ) : (
            <div className="job-review">
              <ReviewSection title="Basic Information · 基本资料">
                <SummaryItem label="Full Name" value={application.fullName} />
                <SummaryItem label="WhatsApp Number" value={application.whatsappNumber} />
                <SummaryItem label="Current Area" value={application.currentArea} />
                <SummaryItem label="18 Years Old or Above" value={application.isAdult ? "Yes" : "No"} />
                <SummaryItem label="Available Start Date" value={application.availableStartDate} />
                <SummaryItem label="Position" value={application.position} />
                <SummaryItem label="Working Arrangement" value={application.workingArrangement} />
                <SummaryItem label="Transportation" value={application.transportation} />
              </ReviewSection>
              <ReviewSection title="Experience · 相关经验">
                <SummaryItem label="Skill Level" value={application.skillLevel} />
                <SummaryItem label="Work Experience" value={application.workExperience} />
                <SummaryItem label="Previous Workplace" value={application.previousWorkplace} />
                <SummaryItem label="Employment Status" value={application.employmentStatus} />
                <SummaryItem label="Reason for Applying" value={application.reasonForApplying} />
              </ReviewSection>
              <ReviewSection title="Nail Skills · 美甲技能">
                {nailSkillNames.map((name) => (
                  <SummaryItem
                    key={name}
                    label={nailSkillLabels[name]}
                    value={application.nailSkills[name]}
                  />
                ))}
              </ReviewSection>
              <ReviewSection title="Additional Information · 附加资料">
                <SummaryItem label="Languages Spoken" value={application.languagesSpoken.join(", ")} />
                <SummaryItem label="Portfolio / Instagram" value={application.portfolio} />
                <SummaryItem label="Additional Notes" value={application.additionalNotes} />
              </ReviewSection>

              <div className="job-consent-panel">
                <p>
                  Your application will be converted into a PDF and sent securely to Mezzanail Nail
                  Studio for recruitment review.
                  <br />
                  您的申请资料将转换为PDF，并安全发送至Mezzanail Nail Studio作招聘审核用途。
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={application.declarationAccepted}
                    onChange={(event) => update("declarationAccepted", event.target.checked)}
                  />
                  <span>
                    I confirm that the information provided is accurate and I agree that Mezzanail
                    may contact me regarding this job application.
                    <small>我确认所提供的资料准确，并同意Mezzanail就此工作申请联系我。</small>
                  </span>
                </label>
                {fieldErrors.declarationAccepted ? (
                  <em>{fieldErrors.declarationAccepted}</em>
                ) : null}
                <label>
                  <input
                    type="checkbox"
                    checked={application.privacyAccepted}
                    onChange={(event) => update("privacyAccepted", event.target.checked)}
                  />
                  <span>
                    I have read and understand the{" "}
                    <Link href="/privacy/job-applicants" target="_blank">
                      Job Applicant Privacy Notice
                    </Link>
                    .
                    <small>
                      我已阅读并了解
                      <Link href="/privacy/job-applicants" target="_blank">
                        招聘申请人隐私说明
                      </Link>
                      。
                    </small>
                  </span>
                </label>
                {fieldErrors.privacyAccepted ? <em>{fieldErrors.privacyAccepted}</em> : null}
              </div>

              {submitError ? (
                <div className="job-error-panel" role="alert">
                  <span>{submitError.errorCode}</span>
                  <h3>Application not submitted · 申请尚未提交</h3>
                  <p>{submitError.message}</p>
                  {applicationReference ? (
                    <div className="job-reference-box">
                      <span>Application Reference · 申请编号</span>
                      <strong>{applicationReference}</strong>
                    </div>
                  ) : null}
                  <div className="job-error-actions">
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={submitApplication}
                      disabled={submitting}
                    >
                      Try Again · 重新尝试
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={downloadPdf}
                      disabled={!applicationReference || downloading}
                    >
                      {downloading ? (
                        <LoaderCircle className="job-spinner" size={17} />
                      ) : (
                        <Download size={17} />
                      )}
                      Download Application PDF · 下载申请PDF
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                    >
                      <MessageCircle size={17} />
                      Contact via WhatsApp · 通过WhatsApp联系
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="job-review-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setStep("form");
                    document
                      .getElementById("job-application")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  disabled={submitting}
                >
                  Edit Application · 修改申请
                </button>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={submitApplication}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="job-spinner" size={18} />
                      Submitting your application… · 正在提交您的申请……
                    </>
                  ) : (
                    <>
                      Submit Application · 提交申请 <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="job-contact-strip">
        <div className="shell">
          <div>
            <div className="eyebrow">NEED HELP? · 需要协助？</div>
            <h2>WhatsApp is available for submission help and portfolio photos.</h2>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <MessageCircle size={18} />
            Contact via WhatsApp · 通过WhatsApp联系
          </a>
        </div>
      </section>
    </main>
  );
}

function FormSection({
  number,
  title,
  chinese,
  children,
}: {
  number: string;
  title: string;
  chinese: string;
  children: React.ReactNode;
}) {
  return (
    <section className="job-form-section">
      <header>
        <span>{number}</span>
        <div>
          <h3>{title}</h3>
          <p>{chinese}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="job-review-section">
      <h3>{title}</h3>
      <div className="job-summary-grid">{children}</div>
    </section>
  );
}
