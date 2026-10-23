import type { Metadata } from "next";
import { OfficialHome } from "@/components/official-site";
import { homepageContent } from "@/config/homepage";
import { createPublicMetadata } from "@/lib/metadata";
import { getHomepageStartingPrices } from "@/lib/homepage-service-prices";

const homepageStartingPrices = getHomepageStartingPrices(
  homepageContent.en.services.items.map((item) => item.serviceCategoryId),
);

const homepageMetadata = createPublicMetadata({
  title: "Premium Nail Care in Melaka",
  description:
    "Visit Mezzanail Nail Studio in Melaka for manicure, pedicure, nail extensions, callus care and waxing. Book online or enquire through WhatsApp.",
  path: "/",
});

export const metadata: Metadata = {
  ...homepageMetadata,
  title: { absolute: "Premium Nail Care in Melaka | Mezzanail Nail Studio" },
  openGraph: {
    ...homepageMetadata.openGraph,
    title: "Premium Nail Care in Melaka | Mezzanail Nail Studio",
  },
  twitter: {
    ...homepageMetadata.twitter,
    title: "Premium Nail Care in Melaka | Mezzanail Nail Studio",
  },
};

export default function HomePage() {
  return <OfficialHome startingPrices={homepageStartingPrices} />;
}
