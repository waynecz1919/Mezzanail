import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Cookies & Analytics",
  description:
    "Browser storage, Google Analytics cookies, retention and consent controls used by the Mezzanail website.",
  path: "/cookies",
});

export default function Page() {
  return <LegalDocumentPage kind="cookies" />;
}
