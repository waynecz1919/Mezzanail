import type { Metadata } from "next";
import { PromotionExperience } from "@/components/promotion/promotion-experience";
import { anniversaryCampaign } from "@/lib/promotion/campaign-config";

const promotionDescription =
  "Celebrate Mezzanail's 7th Anniversary from 26 July to 30 September 2026. Book your appointment and discover our anniversary lucky draw.";

export const metadata: Metadata = {
  metadataBase: new URL(anniversaryCampaign.promotionUrl),
  title: "Mezzanail 7th Anniversary Celebration",
  description: promotionDescription,
  alternates: { canonical: anniversaryCampaign.promotionUrl },
  openGraph: {
    title: "Mezzanail 7th Anniversary Celebration",
    description:
      "Book your appointment and celebrate 7 wonderful years with Mezzanail.",
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
    title: "Mezzanail 7th Anniversary Celebration",
    description: "Book your appointment and join our anniversary celebration.",
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
    eventStatus: "https://schema.org/EventScheduled",
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
