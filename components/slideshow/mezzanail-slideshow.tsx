"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  IconBottle,
  IconClock,
  IconCreditCard,
  IconGift,
  type IconProps,
} from "@tabler/icons-react";
import QRCode from "qrcode";
import Image from "next/image";
import { TVSlideshow } from "@/components/tv/tv-slideshow";
import { slideshowDisplayConfig } from "@/config/slideshow-display";
import type { TVSlideshowConfig } from "@/lib/tv-slideshow";
import styles from "./mezzanail-slideshow.module.css";

const iconMap: Record<string, ComponentType<IconProps>> = {
  gift: IconGift,
  polish: IconBottle,
  "member-card": IconCreditCard,
  clock: IconClock,
};

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: slideshowDisplayConfig.timeZone,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: slideshowDisplayConfig.timeZone,
  weekday: "long",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: slideshowDisplayConfig.timeZone,
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function useMalaysiaClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let minuteInterval: number | undefined;
    const updateClock = () => setNow(new Date());
    updateClock();

    const delayToNextMinute = 60_000 - (Date.now() % 60_000);
    const minuteTimeout = window.setTimeout(() => {
      updateClock();
      minuteInterval = window.setInterval(updateClock, 60_000);
    }, delayToNextMinute);

    return () => {
      window.clearTimeout(minuteTimeout);
      if (minuteInterval) window.clearInterval(minuteInterval);
    };
  }, []);

  return now;
}

function MemberQrCode() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(slideshowDisplayConfig.memberQr.url, {
      width: 640,
      margin: 4,
      errorCorrectionLevel: "H",
      color: { dark: "#000000ff", light: "#ffffffff" },
    }).then((result) => {
      if (active) setDataUrl(result);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.qrContent} data-qr-target={slideshowDisplayConfig.memberQr.url}>
      <p className={styles.qrHeading}>
        <span>{slideshowDisplayConfig.memberQr.title}</span>
        <strong>{slideshowDisplayConfig.memberQr.subtitle}</strong>
      </p>
      <div className={styles.qrFrame} aria-busy={!dataUrl}>
        {dataUrl ? (
          <Image
            src={dataUrl}
            width={640}
            height={640}
            alt="QR code for Mezzanail member QR and credit"
            unoptimized
          />
        ) : null}
      </div>
    </div>
  );
}

type MezzanailSlideshowProps = {
  initialConfig: TVSlideshowConfig;
  dataUrl: string;
  previewMode: boolean;
  tvMode: boolean;
};

export function MezzanailSlideshow({
  initialConfig,
  dataUrl,
  previewMode,
  tvMode,
}: MezzanailSlideshowProps) {
  const now = useMalaysiaClock();

  const clock = useMemo(() => {
    if (!now) {
      return { time: "--:--", period: "", weekday: "", date: "" };
    }
    const parts = timeFormatter.formatToParts(now);
    const value = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? "";

    return {
      time: `${value("hour")}:${value("minute")}`,
      period: value("dayPeriod").toUpperCase(),
      weekday: weekdayFormatter.format(now).toUpperCase(),
      date: dateFormatter.format(now).toUpperCase(),
    };
  }, [now]);

  useEffect(() => {
    document.documentElement.classList.add("slideshow-display-active");
    document.body.classList.add("slideshow-display-active");
    return () => {
      document.documentElement.classList.remove("slideshow-display-active");
      document.body.classList.remove("slideshow-display-active");
    };
  }, []);

  return (
    <div className={styles.stage} role="main" aria-label={slideshowDisplayConfig.projectName}>
      <div className={styles.upperLayout}>
        <section className={styles.hero} aria-label="Mezzanail automatic slideshow">
          <TVSlideshow
            initialConfig={initialConfig}
            dataUrl={dataUrl}
            previewMode={previewMode}
            tvMode={tvMode}
            additionalSlides={slideshowDisplayConfig.slides}
            embedded
          />
        </section>

        <aside className={styles.infoPanel} aria-label="Mezzanail information">
          <section className={styles.brandBlock}>
            <p className={styles.wordmark}>{slideshowDisplayConfig.brand.name}</p>
            <p className={styles.slogan}>{slideshowDisplayConfig.brand.slogan}</p>
          </section>

          <section className={styles.clockBlock} aria-label="Malaysia time and date">
            <div className={styles.timeRow}>
              <time className={styles.time} dateTime={now?.toISOString()} suppressHydrationWarning>
                {clock.time}
              </time>
              <span className={styles.period} suppressHydrationWarning>{clock.period}</span>
            </div>
            <div className={styles.dateRow} suppressHydrationWarning>
              <span className={styles.weekday}>{clock.weekday}</span>
              <span className={styles.fullDate}>{clock.date}</span>
            </div>
          </section>

          <section className={styles.qrBlock} aria-label="Member credits QR code">
            <MemberQrCode />
          </section>

          <section className={styles.websiteBlock} aria-label="Mezzanail Member Center website">
            <p>{slideshowDisplayConfig.memberQr.displayUrl}</p>
          </section>
        </aside>
      </div>

      <footer className={styles.offerBar} aria-label="Member benefits and opening hours">
        {slideshowDisplayConfig.footerItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <article className={styles.offerItem} key={item.id}>
              <span className={styles.offerIcon} aria-hidden="true">
                <Icon stroke={1.35} />
              </span>
              <p>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </p>
            </article>
          );
        })}
      </footer>
    </div>
  );
}
