import type { Metadata } from "next";
import { ContactPage } from "@/components/official-site";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Contact & Visit Us",
  description: "Contact Mezzanail Nail Studio at Taman Cheng Baru, Melaka. View opening hours, directions, phone and WhatsApp details.",
  path: "/contact",
});
export default function Page() { return <ContactPage />; }
