import type { Metadata } from "next";
import { TVSlideshow } from "@/components/tv/tv-slideshow";
import type { TVSlideshowConfig } from "@/lib/tv-slideshow";
import slideshowConfig from "@/public/data/slideshow.json";

export const metadata: Metadata = {
  title: "Mezzanail TV Display",
  description: "Mezzanail Nail Studio in-store television display.",
  alternates: { canonical: "/tv-slide" },
  robots: { index: false, follow: false, noarchive: true },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function isEnabled(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.includes("1") : value === "1";
}

export default async function TVSlidePage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <TVSlideshow
      initialConfig={slideshowConfig as TVSlideshowConfig}
      dataUrl={process.env.NEXT_PUBLIC_SLIDESHOW_DATA_URL ?? "/data/slideshow.json"}
      previewMode={isEnabled(params.preview)}
      tvMode={isEnabled(params.tv)}
    />
  );
}
