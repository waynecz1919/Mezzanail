import type { Metadata } from "next";
import { siteConfig, siteUrl } from "@/lib/site";

const socialImage = {
  url: "/brand/mezzanail-nail-studio-og.jpg",
  width: 1200,
  height: 630,
  alt: "Mezzanail Nail Studio in Melaka",
};

export function createPublicMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: `/${string}` | "/";
}): Metadata {
  const canonical = `${siteUrl}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "en_MY",
      siteName: siteConfig.brandName,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}
