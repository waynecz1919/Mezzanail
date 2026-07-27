import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of the Mezzanail Nail Studio website, external booking links, content and services information.",
  alternates: { canonical: "https://www.mezzanail.com/terms" },
};

export default function Page() { return <LegalDocumentPage kind="terms" />; }
