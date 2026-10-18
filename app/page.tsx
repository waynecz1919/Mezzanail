import type { Metadata } from "next";
import { OfficialHome } from "@/components/official-site";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Premium Nail Care in Melaka",
  description:
    "Visit Mezzanail Nail Studio in Melaka for manicure, pedicure, nail extensions, callus care and waxing. Book online or enquire through WhatsApp.",
  path: "/",
});

export default function HomePage() {
  return <OfficialHome />;
}
