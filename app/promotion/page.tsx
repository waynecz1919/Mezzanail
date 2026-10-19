import type { Metadata } from "next";
import { PromotionExperience } from "@/components/promotion/promotion-experience";
import { currentOffer } from "@/config/current-offer";
import { anniversaryCampaign } from "@/lib/promotion/campaign-config";

const promotionTitle = `${currentOffer.copy.en.title} – ${currentOffer.copy.en.service} RM${currentOffer.offerPrice} | Mezzanail`;
const promotionDescription = `${currentOffer.copy.en.title} at Mezzanail Nail Studio, Melaka: ${currentOffer.copy.en.service} RM${currentOffer.offerPrice} (usual RM${currentOffer.originalPrice}), ${currentOffer.copy.en.includes[0].toLowerCase()}${currentOffer.copy.en.includes.slice(1)}. ${currentOffer.copy.en.validity}.`;
const promotionOgImage = "/campaigns/deepavali-2026/og-1200x630.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(anniversaryCampaign.promotionUrl),
  title: { absolute: "Deepavali Gel Glow – Gelish Manicure RM68 | Mezzanail Nail Studio" },
  description: promotionDescription,
  alternates: { canonical: anniversaryCampaign.promotionUrl },
  openGraph: {
    title: promotionTitle,
    description: promotionDescription,
    url: anniversaryCampaign.promotionUrl,
    siteName: "Mezzanail",
    images: [
      {
        url: promotionOgImage,
        width: 1200,
        height: 630,
        alt: currentOffer.copy.en.posterAlt,
      },
    ],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: promotionTitle,
    description: promotionDescription,
    images: [promotionOgImage],
  },
  robots: { index: true, follow: true },
};

export default function PromotionPage() {
  return <PromotionExperience />;
}
