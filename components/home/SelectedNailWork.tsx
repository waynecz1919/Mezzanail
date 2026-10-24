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
          {homepageNailWorkImages.map(({ src, alt }, index) => (
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="selected-work-item"
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
                alt={alt}
                fill
                sizes="(max-width: 767px) 46vw, 33vw"
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
