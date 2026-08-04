"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  homepageContent,
  homepageNailWorkImages,
} from "@/config/homepage";
import { siteConfig } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { HomeLink } from "@/components/ui/HomeLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SelectedNailWork({ locale }: { locale: Locale }) {
  const copy = homepageContent[locale].work;

  return (
    <section className="home-selected-work mn-home-section" id="work" aria-labelledby="selected-work-title">
      <div className="mn-home-shell">
        <div className="selected-work-heading" id="selected-work-title">
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            subtitle={copy.subtitle}
          />
          <HomeLink
            href={siteConfig.instagramUrl}
            variant="secondary"
            event="nail_work_click"
            eventLabel="instagram_gallery"
            external
            ariaLabel={`${siteConfig.brandName} Instagram`}
          >
            {copy.action}
            <ArrowUpRight aria-hidden="true" size={16} />
          </HomeLink>
        </div>
        <div className="selected-work-grid" aria-label={copy.title}>
          {homepageNailWorkImages.map((src, index) => (
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`selected-work-item ${index === 0 ? "is-primary" : ""}`}
              aria-label={`${copy.categories[index]} — ${copy.action}`}
              key={src}
              onClick={() => {
                const analyticsWindow = window as Window & {
                  gtag?: (...args: unknown[]) => void;
                };
                analyticsWindow.gtag?.("event", "nail_work_click", {
                  content_label: copy.categories[index],
                  destination: siteConfig.instagramUrl,
                });
              }}
            >
              <Image
                src={src}
                alt={`${siteConfig.brandName} — ${copy.categories[index]}`}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 767px) 82vw, (max-width: 1279px) 50vw, 590px"
                    : "(max-width: 767px) 82vw, (max-width: 1279px) 35vw, 290px"
                }
                className="object-cover"
                loading="lazy"
              />
              <span>{copy.categories[index]}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
