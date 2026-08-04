import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MezzanailSlideshow } from "@/components/slideshow/mezzanail-slideshow";
import type { TVSlideshowConfig } from "@/lib/tv-slideshow";
import slideshowConfig from "@/public/data/slideshow.json";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-slideshow-sans",
  preload: true,
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mezzanail TV Slideshow",
  description: "Mezzanail Nail Studio in-store television display.",
  robots: { index: false, follow: false, noarchive: true },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function isEnabled(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.includes("1") : value === "1";
}

export default async function SlideshowPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <div className={inter.variable}>
      <MezzanailSlideshow
        initialConfig={slideshowConfig as TVSlideshowConfig}
        dataUrl={process.env.NEXT_PUBLIC_SLIDESHOW_DATA_URL ?? "/data/slideshow.json"}
        previewMode={isEnabled(params.preview)}
        tvMode={isEnabled(params.tv)}
      />
    </div>
  );
}
