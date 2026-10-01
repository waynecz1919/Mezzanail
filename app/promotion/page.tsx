import type { Metadata } from "next";
import { PromotionExperience } from "@/components/promotion/promotion-experience";
import { anniversaryCampaign } from "@/lib/promotion/campaign-config";

const promotionDescription =
  "Mezzanail's 7th Anniversary campaign ran from 26 July to 30 September 2026. Thank you for celebrating seven wonderful years with us.";

export const metadata: Metadata = {
  metadataBase: new URL(anniversaryCampaign.promotionUrl),
  title: "Mezzanail 7th Anniversary Campaign Has Ended",
  description: promotionDescription,
  alternates: { canonical: anniversaryCampaign.promotionUrl },
  openGraph: {
    title: "Mezzanail 7th Anniversary Campaign Has Ended",
    description:
      "Mezzanail's 7th Anniversary campaign ended on 30 September 2026. The campaign featured Dyson, HUAWEI, Xiaomi and beauty rewards.",
    url: anniversaryCampaign.promotionUrl,
    siteName: "Mezzanail",
    images: [
      {
        url: anniversaryCampaign.banner.og,
        width: 1200,
        height: 630,
        alt: "Mezzanail 7th Anniversary Celebration",
      },
    ],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mezzanail 7th Anniversary Campaign Has Ended",
    description:
      "Mezzanail's 7th Anniversary campaign ended on 30 September 2026. Thank you for celebrating with us.",
    images: [anniversaryCampaign.banner.og],
  },
  robots: { index: true, follow: true },
};

export default function PromotionPage() {
  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: anniversaryCampaign.title,
    startDate: anniversaryCampaign.startDate,
    endDate: anniversaryCampaign.endDate,
    eventStatus: "https://schema.org/EventCompleted",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Mezzanail Nail Studio",
    },
    organizer: {
      "@type": "Organization",
      name: "Mezzanail",
      url: "https://www.mezzanail.com",
    },
    url: anniversaryCampaign.promotionUrl,
  };

  return (
    <>
      <PromotionExperience />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }}
      />
    </>
  );
}
