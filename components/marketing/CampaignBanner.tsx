"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { siteConfig } from "@/lib/site";
import styles from "./CampaignBanner.module.css";

type CampaignBannerProps = {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  href?: string;
  openInNewTab?: boolean;
  priority?: boolean;
  width: number;
  height: number;
  mobileWidth?: number;
  mobileHeight?: number;
  campaignId: string;
  campaignName: string;
  heading: string;
  campaignTitle: string;
  dates: string;
  invitation: string;
  promotionLabel: string;
  bookingLabel: string;
};

export function CampaignBanner({
  desktopSrc,
  mobileSrc,
  alt,
  href,
  openInNewTab = false,
  priority = false,
  width,
  height,
  mobileWidth,
  mobileHeight,
  campaignId,
  campaignName,
  heading,
  campaignTitle,
  dates,
  invitation,
  promotionLabel,
  bookingLabel,
}: CampaignBannerProps) {
  const trackClick = (destination: string, label: string) => {
    if (typeof window === "undefined") return;

    const analyticsWindow = window as Window & {
      gtag?: (...args: unknown[]) => void;
    };

    analyticsWindow.gtag?.("event", "campaign_banner_click", {
      campaign_id: campaignId,
      campaign_name: campaignName,
      destination,
      content_label: label,
    });
  };

  const picture = (
    <picture className={styles.picture}>
      {mobileSrc ? (
        <source
          media="(max-width: 767px)"
          srcSet={mobileSrc}
          width={mobileWidth}
          height={mobileHeight}
        />
      ) : null}
      <Image
        className={styles.image}
        src={desktopSrc}
        alt={alt}
        width={width}
        height={height}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
        sizes="100vw"
      />
    </picture>
  );

  return (
    <section
      className={styles.section}
      data-campaign-banner
      aria-labelledby="home-hero-title"
    >
      <div className={styles.media}>{picture}</div>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <p className={styles.campaignTitle}>{campaignTitle}</p>
          <h1 id="home-hero-title">{heading}</h1>
          <p className={styles.intro}>
            Manicure, pedicure, nail extensions, callus care and waxing from
            Mezzanail Nail Studio in Melaka.
          </p>
          <p className={styles.date}>
            <CalendarDays aria-hidden="true" size={17} />
            {dates}
          </p>
          <p className={styles.invitation}>{invitation}</p>
          <div className={styles.actions}>
            {href?.startsWith("/") && !openInNewTab ? (
              <Link
                href={href}
                className={styles.primary}
                onClick={() => trackClick(href, "view_promotion")}
              >
                {promotionLabel}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            ) : href ? (
              <a
                href={href}
                className={styles.primary}
                target={openInNewTab ? "_blank" : undefined}
                rel={openInNewTab ? "noopener noreferrer" : undefined}
                onClick={() => trackClick(href, "view_promotion")}
              >
                {promotionLabel}
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            ) : null}
            <a
              href={siteConfig.bookingUrl}
              className={styles.secondary}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(siteConfig.bookingUrl, "book_now")}
            >
              {bookingLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
