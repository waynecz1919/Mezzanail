import type { Metadata } from "next";
import { AboutPage } from "@/components/official-site";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "About Mezzanail Nail Studio",
  description: "Discover Mezzanail Nail Studio's modern, precise and personal approach to premium nail care in Melaka, Malaysia.",
  path: "/about",
});
export default function Page() { return <AboutPage />; }
