"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { homepageContent } from "@/config/homepage";
import type { Locale } from "@/lib/i18n";
import { HomeLink } from "@/components/ui/HomeLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SignatureServices({ locale }: { locale: Locale }) {
  const copy = homepageContent[locale].services;

  return (
    <section className="home-signature-services mn-home-section" aria-labelledby="signature-services-title">
      <div className="mn-home-shell">
        <div id="signature-services-title">
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            subtitle={copy.subtitle}
          />
        </div>
        <div className="signature-services-grid">
          {copy.items.map((item, index) => (
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
                      ? "(max-width: 767px) 92vw, (max-width: 1279px) 48vw, 600px"
                      : "(max-width: 767px) 92vw, (max-width: 1279px) 48vw, 390px"
                  }
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="signature-service-copy">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <HomeLink
                  href={item.href}
                  variant="text"
                  event="service_category_click"
                  eventLabel={item.title}
                  ariaLabel={`${copy.action}: ${item.title}`}
                >
                  {copy.action}
                  <ArrowUpRight aria-hidden="true" size={16} />
                </HomeLink>
              </div>
              <span className="signature-service-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
