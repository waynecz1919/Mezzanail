"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { homepageContent } from "@/config/homepage";
import type { Locale } from "@/lib/i18n";
import { HomeLink } from "@/components/ui/HomeLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HomepageStartingPrices } from "@/lib/homepage-service-prices";

export function SignatureServices({
  locale,
  startingPrices,
}: {
  locale: Locale;
  startingPrices: HomepageStartingPrices;
}) {
  const copy = homepageContent[locale].services;

  return (
    <section className="home-signature-services mn-home-section" aria-labelledby="signature-services-title">
      <div className="mn-home-shell">
        <div id="signature-services-title">
          <SectionHeading
            title={copy.title}
            subtitle={copy.subtitle}
          />
        </div>
        <div className="signature-services-grid">
          {copy.items.map((item, index) => {
            const amount = startingPrices[item.serviceCategoryId];
            const startingPrice = amount == null
              ? null
              : locale === "zh"
                ? `RM${amount} 起`
                : locale === "ms"
                  ? `Dari RM${amount}`
                  : `From RM${amount}`;

            return (
              <article
                className={`signature-service-card ${item.featured ? "is-featured" : ""}`}
                key={item.title}
              >
                <div className="signature-service-image">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes={
                      item.featured
                        ? "(max-width: 767px) 44vw, (max-width: 1279px) 48vw, 600px"
                        : "(max-width: 767px) 44vw, (max-width: 1279px) 48vw, 390px"
                    }
                    className="object-cover"
                    style={item.title === "Waxing" ? { objectPosition: "center 40%" } : undefined}
                    loading="lazy"
                  />
                </div>
                <div className="signature-service-copy">
                  <h3>{item.title}</h3>
                  {startingPrice ? <p className="signature-service-price">{startingPrice}</p> : null}
                  <p className="signature-service-description">{item.body}</p>
                  <HomeLink
                    href={item.href}
                    variant="text"
                    className="signature-service-action"
                    event="service_category_click"
                    eventLabel={item.title}
                    ariaLabel={`${copy.action}: ${item.title}`}
                  >
                    {copy.action}
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </HomeLink>
                </div>
                <HomeLink
                  href={item.href}
                  variant="text"
                  className="signature-service-card-link hidden"
                  event="service_category_click"
                  eventLabel={item.title}
                  ariaLabel={item.title}
                >
                  <span className="sr-only">{copy.action}: {item.title}</span>
                </HomeLink>
                <span className="signature-service-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
