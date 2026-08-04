import type { Metadata } from "next";
import { MezzanailSlideshow } from "@/components/slideshow/mezzanail-slideshow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mezzanail TV Slideshow",
  description: "Mezzanail Nail Studio in-store television display.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function SlideshowPage() {
  return <MezzanailSlideshow />;
}
