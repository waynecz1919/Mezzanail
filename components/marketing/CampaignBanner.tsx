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
  active?: boolean;
  inactiveSrc?: string;
  inactiveAlt?: string;
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
  active = true,
  inactiveSrc,
  inactiveAlt,
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

  const resolvedSrc = active ? desktopSrc : inactiveSrc ?? desktopSrc;
  const resolvedAlt = active ? alt : inactiveAlt ?? alt;
  const resolvedMobileSrc = active ? mobileSrc : undefined;

  const picture = (
    <picture className={styles.picture}>
      {resolvedMobileSrc ? (
        <source
          media="(max-width: 767px)"
          srcSet={resolvedMobileSrc}
          width={mobileWidth}
          height={mobileHeight}
        />
      ) : null}
      <Image
        className={styles.image}
        src={resolvedSrc}
        alt={resolvedAlt}
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
          {active ? <p className={styles.campaignTitle}>{campaignTitle}</p> : null}
          <h1 id="home-hero-title">{heading}</h1>
          <p className={styles.intro}>
            Manicure, pedicure, nail extensions, callus care and waxing from
            Mezzanail Nail Studio in Melaka.
          </p>
          {active ? (
            <>
              <p className={styles.date}>
                <CalendarDays aria-hidden="true" size={17} />
                {dates}
              </p>
              <p className={styles.invitation}>{invitation}</p>
            </>
          ) : null}
          <div className={styles.actions}>
            {active && href?.startsWith("/") && !openInNewTab ? (
              <Link
                href={href}
                className={styles.primary}
                onClick={() => trackClick(href, "view_promotion")}
              >
                {promotionLabel}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            ) : active && href ? (
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
              className={active ? styles.secondary : styles.primary}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(siteConfig.bookingUrl, "book_now")}
            >
              {bookingLabel}
            </a>
            {!active ? (
              <Link
                href="/services"
                className={styles.secondary}
                onClick={() => trackClick("/services", "view_services")}
              >
                View Services
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
