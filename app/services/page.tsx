import type { Metadata } from "next";
import { ServicesPage } from "@/components/official-site";
import { createPublicMetadata } from "@/lib/metadata";
import { serviceCategories } from "@/lib/services";
import { siteConfig, siteUrl } from "@/lib/site";

export const metadata: Metadata = createPublicMetadata({
  title: "Nail Services & Prices in Melaka",
  description:
    "Explore Mezzanail Nail Studio manicure, pedicure, nail extension, callus care and waxing services with current prices and available duration guidance.",
  path: "/services",
});

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${siteUrl}/services`,
          },
        ],
      },
      ...serviceCategories.map((category) => ({
        "@type": "Service",
        name: category.label.en,
        provider: { "@type": "BeautySalon", name: siteConfig.brandName },
        areaServed: { "@type": "City", name: "Melaka" },
        url: `${siteUrl}/services#service-${category.id}`,
      })),
    ],
  };

  return (
    <>
      <ServicesPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
