import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Membership Terms",
  description:
    "Terms for Mezzanail membership, rewards, balances, redemptions, expiry, account use and programme changes.",
  path: "/membership/terms",
});

export default function Page() {
  return <LegalDocumentPage kind="membership-terms" />;
}
