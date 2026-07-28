import type { Metadata } from "next";
import { preload } from "react-dom";
import { OfficialHome } from "@/components/official-site";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Premium Nail Care in Melaka",
  description:
    "Visit Mezzanail Nail Studio in Melaka for manicure, pedicure, nail extensions, callus care and waxing. Book online or enquire through WhatsApp.",
  path: "/",
});

export default function HomePage() {
  preload("/campaigns/7th-anniversary/banner-mobile.webp", {
    as: "image",
    fetchPriority: "high",
    media: "(max-width: 767px)",
  });
  preload("/campaigns/7th-anniversary/banner-desktop.webp", {
    as: "image",
    fetchPriority: "high",
    media: "(min-width: 768px)",
  });

  return <OfficialHome />;
}
