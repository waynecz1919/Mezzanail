import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Membership Terms",
  description:
    "Terms for Mezzanail membership, rewards, balances, redemptions, expiry, account use and programme changes.",
  alternates: { canonical: "https://www.mezzanail.com/membership/terms" },
};

export default function Page() {
  return <LegalDocumentPage kind="membership-terms" />;
}
