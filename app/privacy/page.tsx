import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Privacy Policy",
  description:
    "How Mezzanail Nail Studio collects, uses, shares, protects and retains personal data, and how to request access, correction or deletion.",
  path: "/privacy",
});

export default function Page() { return <LegalDocumentPage kind="privacy" />; }
