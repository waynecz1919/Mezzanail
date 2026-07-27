import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Mezzanail Nail Studio collects, uses, shares, protects and retains personal data, and how to request access, correction or deletion.",
  alternates: { canonical: "https://www.mezzanail.com/privacy" },
};

export default function Page() { return <LegalDocumentPage kind="privacy" />; }
