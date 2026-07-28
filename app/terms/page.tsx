import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Terms of Use",
  description:
    "Terms governing use of the Mezzanail Nail Studio website, external booking links, content and services information.",
  path: "/terms",
});

export default function Page() { return <LegalDocumentPage kind="terms" />; }
