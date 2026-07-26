"use client";

import Image from "next/image";
import Link from "next/link";
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
}: CampaignBannerProps) {
  const trackClick = () => {
    if (!href || typeof window === "undefined") return;

    const analyticsWindow = window as Window & {
      gtag?: (...args: unknown[]) => void;
    };

    analyticsWindow.gtag?.("event", "campaign_banner_click", {
      campaign_id: campaignId,
      campaign_name: campaignName,
      destination: href,
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
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes="100vw"
      />
    </picture>
  );

  if (!href) {
    return <section className={styles.section} data-campaign-banner>{picture}</section>;
  }

  const linkProps = {
    className: styles.link,
    onClick: trackClick,
    "aria-label": alt,
    ...(openInNewTab
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {}),
  };

  return (
    <section className={styles.section} data-campaign-banner>
      {href.startsWith("/") && !openInNewTab ? (
        <Link href={href} {...linkProps}>
          {picture}
        </Link>
      ) : (
        <a href={href} {...linkProps}>
          {picture}
        </a>
      )}
    </section>
  );
}
