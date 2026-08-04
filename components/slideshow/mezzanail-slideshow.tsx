"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  IconBottle,
  IconClock,
  IconCreditCard,
  IconDeviceMobile,
  IconGift,
  IconQrcode,
  type IconProps,
} from "@tabler/icons-react";
import { slideshowDisplayConfig } from "@/config/slideshow-display";
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

function MemberQrReminder() {
  return (
    <div className={styles.memberReminder}>
      <span className={styles.memberPhoneIcon} aria-hidden="true">
        <IconDeviceMobile className={styles.phoneOutline} stroke={1.35} />
        <IconQrcode className={styles.phoneQr} stroke={1.45} />
      </span>
      <p>
        <span>{slideshowDisplayConfig.memberReminder.title}</span>
        <strong>{slideshowDisplayConfig.memberReminder.emphasis}</strong>
      </p>
    </div>
  );
}

export function MezzanailSlideshow() {
  const now = useMalaysiaClock();
  const activeSlide = slideshowDisplayConfig.slides[0];

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
    <main className={styles.stage} aria-label={slideshowDisplayConfig.projectName}>
      <div className={styles.upperLayout}>
        <section className={styles.hero} aria-label="Seventh anniversary feature">
          <picture className={styles.heroPicture}>
            <source srcSet={activeSlide.image.avif} type="image/avif" />
            <source srcSet={activeSlide.image.webp} type="image/webp" />
            <img
              src={activeSlide.image.fallback}
              alt={activeSlide.image.alt}
              style={{ objectPosition: activeSlide.image.objectPosition }}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className={styles.heroReadability} aria-hidden="true" />
          <div className={styles.anniversaryCopy}>
            <p className={styles.ordinal}>
              <span>7</span><sup>th</sup>
            </p>
            <h1>{activeSlide.title}</h1>
            <p className={styles.anniversarySubtitle}>{activeSlide.subtitle}</p>
          </div>
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

          <section className={styles.memberBlock}>
            <MemberQrReminder />
          </section>

          <section className={styles.websiteBlock}>
            <p>{slideshowDisplayConfig.website}</p>
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
                <span>{item.title}</span>
                <strong>{item.emphasis}</strong>
              </p>
            </article>
          );
        })}
      </footer>
    </main>
  );
}
