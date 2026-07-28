import type { Metadata } from "next";
import { RewardsSite } from "@/components/rewards-site";
import { createPublicMetadata } from "@/lib/metadata";
import { messages } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = createPublicMetadata({
  title: "Membership & Rewards",
  description:
    "Explore the Mezzanail membership experience and learn where to confirm current balances, rewards, validity and eligibility details.",
  path: "/rewards",
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
            name: "Membership & Rewards",
            item: `${siteUrl}/rewards`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: messages.en.faq.items.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <>
      <RewardsSite />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
