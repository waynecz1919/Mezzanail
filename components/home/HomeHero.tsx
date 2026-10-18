"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers";
import { useOfferActive } from "@/components/offer/use-offer-active";
import { HomeLink } from "@/components/ui/HomeLink";
import { currentOffer, getOfferWhatsappUrl } from "@/config/current-offer";
import { homepage } from "@/config/homepage";
import { siteConfig } from "@/lib/site";

export function HomeHero() {
  const { locale } = useLanguage();
  const offerActive = useOfferActive();
  const heroImage = homepage.heroImage;
  const offer = currentOffer.copy[locale];

  return (
    <section
      className={`home-hero${heroImage ? " home-hero--with-image" : ""}${offerActive ? " home-hero--with-offer" : ""}`}
      aria-labelledby="home-hero-title"
    >
      <div className="home-hero-copy">
        <p className="mn-eyebrow">Nail Studio · Melaka</p>
        <h1 id="home-hero-title">Premium Nail Care in Melaka</h1>
        {offerActive ? (
          <div className="home-hero-offer" role="group" aria-labelledby="home-hero-offer-title">
            <p className="home-hero-offer-label">
              {offer.eyebrow} · {offer.validity}
            </p>
            <p className="home-hero-offer-title" id="home-hero-offer-title">
              {offer.title}
              <span> — {offer.service}</span>
            </p>
            <p className="home-hero-offer-price">
              <s>RM{currentOffer.originalPrice}</s>
              <strong>RM{currentOffer.offerPrice}</strong>
              <span className="home-hero-offer-save">{offer.save}</span>
            </p>
            <p className="home-hero-offer-includes">{offer.includes}</p>
            <div className="home-hero-actions">
              <HomeLink
                href={getOfferWhatsappUrl(locale)}
                variant="primary"
                event="whatsapp_click"
                eventLabel={`${currentOffer.id}_homepage_hero`}
                external
              >
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
            <Link className="home-hero-offer-details" href="/promotion#current-offer">
              {offer.details}
            </Link>
          </div>
        ) : null}
        <p className="home-hero-lede">
          Manicure, pedicure, nail extensions, callus care and waxing from
          Mezzanail Nail Studio in Melaka.
        </p>
        {offerActive ? null : (
          <HomeLink
            href={siteConfig.bookingUrl}
            variant="primary"
            event="book_appointment_click"
            eventLabel="homepage_hero"
            external
          >
            Book Now
          </HomeLink>
        )}
      </div>
      {heroImage ? (
        <figure className="home-hero-media">
          <Image
            src={heroImage.src}
            alt={heroImage.alt[locale]}
            width={heroImage.width}
            height={heroImage.height}
            priority
            sizes="(max-width: 900px) min(100vw, 520px), 560px"
            className="home-hero-image"
          />
        </figure>
      ) : null}
    </section>
  );
}
