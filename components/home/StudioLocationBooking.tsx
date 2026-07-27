"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays, MessageCircle } from "lucide-react";
import { homepageContent, homepageStudioImage } from "@/config/homepage";
import type { Locale } from "@/lib/i18n";
import { getWhatsappUrl, siteConfig } from "@/lib/site";
import { HomeLink } from "@/components/ui/HomeLink";

export function StudioLocationBooking({ locale }: { locale: Locale }) {
  const copy = homepageContent[locale].studio;

  return (
    <section className="home-studio mn-home-section" id="studio" aria-labelledby="studio-title">
      <div className="mn-home-shell studio-grid">
        <div className="studio-copy">
          <p className="mn-eyebrow">{copy.eyebrow}</p>
          <h2 id="studio-title">{copy.title}</h2>
          <p className="studio-subtitle">{copy.subtitle}</p>
          <dl className="studio-details">
            <div>
              <dt>{copy.addressLabel}</dt>
              <dd>{siteConfig.address.lines.map((line) => <span key={line}>{line}</span>)}</dd>
            </div>
            <div>
              <dt>{copy.hoursLabel}</dt>
              <dd>{siteConfig.businessHours}</dd>
            </div>
            <div>
              <dt>{copy.phoneLabel}</dt>
              <dd>
                <a href={siteConfig.phoneLink}>{siteConfig.phoneDisplay}</a>
                <a href={siteConfig.mobileLink}>{siteConfig.mobileDisplay}</a>
              </dd>
            </div>
          </dl>
          <div className="studio-actions">
            <HomeLink
              href={siteConfig.googleMapsDirectionsUrl}
              variant="secondary"
              event="open_maps_click"
              eventLabel="studio_location"
              external
            >
              {copy.mapAction}
              <ArrowUpRight aria-hidden="true" size={16} />
            </HomeLink>
            <HomeLink
              href={siteConfig.bookingUrl}
              variant="primary"
              event="book_appointment_click"
              eventLabel="studio_section"
              external
            >
              <CalendarDays aria-hidden="true" size={16} />
              {copy.bookAction}
            </HomeLink>
            <HomeLink
              href={getWhatsappUrl(locale)}
              variant="text"
              event="whatsapp_click"
              eventLabel="studio_section"
              external
            >
              <MessageCircle aria-hidden="true" size={16} />
              {copy.whatsappAction}
            </HomeLink>
          </div>
        </div>
        <div className="studio-image">
          <Image
            src={homepageStudioImage}
            alt={copy.imageAlt}
            fill
            sizes="(max-width: 767px) 92vw, (max-width: 1279px) 50vw, 590px"
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
