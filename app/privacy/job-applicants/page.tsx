import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Job Applicant Privacy Notice",
  description:
    "How Mezzanail Nail Studio handles job applicant information, recruitment PDFs, retention and privacy requests.",
  alternates: { canonical: "https://www.mezzanail.com/privacy/job-applicants" },
};

export default function Page() {
  return <LegalDocumentPage kind="job-privacy" />;
}
