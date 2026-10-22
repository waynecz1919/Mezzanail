"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers";
import { useOfferActive } from "@/components/offer/use-offer-active";
import { HomeLink } from "@/components/ui/HomeLink";
import { currentOffer, getOfferWhatsappUrl } from "@/config/current-offer";
import { homepage, homepageContent } from "@/config/homepage";
import { siteConfig } from "@/lib/site";
import { HomeHeroSlideshow } from "./HomeHeroSlideshow";
import styles from "./HomeHero.module.css";

export function HomeHero() {
  const { locale } = useLanguage();
  const offerActive = useOfferActive();
  const heroImages = homepage.heroImages;
  const heroCopy = homepageContent[locale].hero;
  const offer = currentOffer.copy[locale];

  return (
    <>
      <section
        className={styles.hero}
        aria-labelledby="home-hero-title"
      >
        <div className={styles.desktopCopy}>
          <p className="mn-eyebrow">{heroCopy.eyebrow}</p>
          <h1 id="home-hero-title">{heroCopy.title}</h1>

          {offerActive ? (
            <div className={styles.desktopOffer} role="group" aria-labelledby="home-hero-offer-title">
              <p className={styles.offerLabel}>
                {offer.eyebrow} · {offer.validity}
              </p>
              <p className={styles.offerTitle} id="home-hero-offer-title">
                {offer.title} — {offer.service}
              </p>
              <p className={styles.offerPrice}>
                <s>RM{currentOffer.originalPrice}</s>
                <strong>RM{currentOffer.offerPrice}</strong>
                <span className={styles.offerSave}>{offer.save}</span>
              </p>
              <p className={styles.offerExtras}>{offer.otherOffersLine}</p>
              <p className={styles.offerIncludes}>{offer.includes}</p>
              <div className={styles.actions}>
                <HomeLink href={getOfferWhatsappUrl(locale)} variant="primary" external>
                  {offer.action}
                </HomeLink>
                <HomeLink
                  href={siteConfig.bookingUrl}
                  variant="secondary"
                  event="book_appointment_click"
                  eventLabel="homepage_hero"
                  external
                >
                  {offer.otherServices}
                </HomeLink>
              </div>
              <Link className={styles.detailsLink} href="/promotion#current-offer">
                {offer.details}
              </Link>
            </div>
          ) : null}

          <p className={styles.lede}>{heroCopy.lede}</p>
          {offerActive ? null : (
            <HomeLink
              href={siteConfig.bookingUrl}
              variant="primary"
              event="book_appointment_click"
              eventLabel="homepage_hero"
              external
            >
              {heroCopy.bookNow}
            </HomeLink>
          )}
        </div>

        <div className={styles.mediaWrap}>
          <HomeHeroSlideshow images={heroImages} locale={locale} />
          <div className={styles.mobileOverlayCopy}>
            <p className="mn-eyebrow">{heroCopy.eyebrow}</p>
            <h1>{heroCopy.title}</h1>
          </div>
        </div>

        {offerActive ? (
          <div className={styles.mobileOfferStrip} role="group" aria-label={offer.title}>
            <p>
              {offer.title} · {offer.service} <strong>RM{currentOffer.offerPrice}</strong>{" "}
              <s>(RM{currentOffer.originalPrice})</s>
            </p>
            <HomeLink href={getOfferWhatsappUrl(locale)} variant="primary" external>
              {offer.action}
            </HomeLink>
          </div>
        ) : null}
      </section>

      {offerActive ? (
        <section className={styles.mobileOfferDetails} aria-label={offer.details}>
          <div className={styles.mobileOfferDetailsInner}>
            <p className={styles.offerExtras}>{offer.otherOffersLine}</p>
            <p>{offer.includes}</p>
            <div className={styles.actions}>
              <HomeLink
                href={siteConfig.bookingUrl}
                variant="secondary"
                event="book_appointment_click"
                eventLabel="homepage_hero_other_services"
                external
              >
                {offer.otherServices}
              </HomeLink>
              <Link className={styles.detailsLink} href="/promotion#current-offer">
                {offer.details}
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
