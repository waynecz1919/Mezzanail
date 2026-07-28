import type { Metadata } from "next";
import Link from "next/link";
import {
  anniversaryCampaign,
  type PromotionLanguage,
} from "@/lib/promotion/campaign-config";
import {
  promotionLanguageLabels,
  promotionLanguageShortLabels,
  termsCopy,
} from "@/lib/promotion/campaign-copy";
import { getWhatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "7th Anniversary Campaign Terms",
  description:
    "Terms and conditions for the Mezzanail 7th Anniversary Lucky Draw Campaign.",
  alternates: {
    canonical: `${anniversaryCampaign.promotionUrl}/terms`,
  },
};

export default async function PromotionTermsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const requestedLanguage = (await searchParams).lang;
  const language = (
    ["en", "zh", "ms"].includes(requestedLanguage ?? "")
      ? requestedLanguage
      : "en"
  ) as PromotionLanguage;
  const copy = termsCopy[language];

  return (
    <main
      className="promotion-site promotion-terms-page"
      lang={language === "zh" ? "zh-CN" : language}
    >
      <header className="promotion-terms-header">
        <div className="promotion-shell">
          <div className="promotion-terms-topbar">
            <Link href={`/promotion?lang=${language}`}>← {copy.back}</Link>
            <nav
              className="promotion-header-languages"
              aria-label="Language"
            >
              {(
                Object.keys(
                  promotionLanguageShortLabels,
                ) as PromotionLanguage[]
              ).map((languageCode) => (
                <Link
                  key={languageCode}
                  href={`/promotion/terms?lang=${languageCode}`}
                  aria-current={
                    language === languageCode ? "page" : undefined
                  }
                  aria-label={promotionLanguageLabels[languageCode]}
                >
                  {promotionLanguageShortLabels[languageCode]}
                </Link>
              ))}
            </nav>
          </div>
          <p className="promotion-eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>
            {copy.updated} {copy.lastUpdatedDate}
          </p>
        </div>
      </header>
      <div className="promotion-shell promotion-terms-content">
        <p className="promotion-terms-intro">{copy.intro}</p>
        {copy.sections.map((section, index) => (
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
            href={`/promotion?lang=${language}`}
          >
            {copy.returnCampaign}
          </Link>
          <a
            href={getWhatsappUrl(language, "promotion")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.contact}
          </a>
          <Link href="/privacy">Privacy / Privasi</Link>
          <Link href="/cookies">Cookies & Analytics</Link>
        </div>
      </div>
    </main>
  );
}
