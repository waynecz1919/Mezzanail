import type { Metadata } from "next";
import Link from "next/link";
import { anniversaryCampaign } from "@/lib/promotion/campaign-config";

export const metadata: Metadata = {
  title: "7th Anniversary Campaign Terms",
  description:
    "Terms and conditions for the Mezzanail 7th Anniversary Lucky Draw Campaign.",
  alternates: {
    canonical: `${anniversaryCampaign.promotionUrl}/promotion/terms`,
  },
};

export default function PromotionTermsPage() {
  return (
    <main className="promotion-site promotion-terms-page">
      <header className="promotion-terms-header">
        <div className="promotion-shell">
          <Link href="/promotion">← Back to celebration</Link>
          <p className="promotion-eyebrow">Mezzanail 7th Anniversary</p>
          <h1>Campaign Terms &amp; Conditions</h1>
          <p>Last updated {anniversaryCampaign.terms.lastUpdated}</p>
        </div>
      </header>
      <div className="promotion-shell promotion-terms-content">
        <p className="promotion-terms-intro">
          These concise terms explain the main conditions for the Mezzanail 7th
          Anniversary Lucky Draw Campaign. Mezzanail may publish further
          operational details when required.
        </p>
        {anniversaryCampaign.terms.sections.map((section, index) => (
          <section key={section.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          </section>
        ))}
        <div className="promotion-terms-actions">
          <Link
            className="promotion-button promotion-button-primary"
            href="/promotion"
          >
            Return to Campaign
          </Link>
          <a
            href={`https://wa.me/${anniversaryCampaign.whatsappContact}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Mezzanail
          </a>
        </div>
      </div>
    </main>
  );
}
