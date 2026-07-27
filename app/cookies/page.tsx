import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Cookies & Analytics",
  description:
    "Browser storage, Google Analytics cookies, retention and consent controls used by the Mezzanail website.",
  alternates: { canonical: "https://www.mezzanail.com/cookies" },
};

export default function Page() {
  return <LegalDocumentPage kind="cookies" />;
}
