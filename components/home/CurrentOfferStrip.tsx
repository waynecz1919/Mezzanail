"use client";

import Link from "next/link";
import { HomeLink } from "@/components/ui/HomeLink";
import { useLanguage } from "@/components/providers";
import { useOfferActive } from "@/components/offer/use-offer-active";
import { currentOffer, getOfferWhatsappUrl } from "@/config/current-offer";

export function CurrentOfferStrip() {
  const { locale } = useLanguage();
  const active = useOfferActive();
  if (!active) return null;

  const copy = currentOffer.copy[locale];

  return (
    <section className="current-offer-strip" aria-labelledby="current-offer-title">
      <div className="current-offer-strip-inner">
        <div className="current-offer-strip-copy">
          <p className="current-offer-eyebrow">{copy.eyebrow}</p>
          <h2 id="current-offer-title">{copy.title}</h2>
          <p className="current-offer-service">
            {copy.service}
            <span aria-hidden="true"> · </span>
            <span className="current-offer-includes">{copy.includes}</span>
          </p>
        </div>
        <p className="current-offer-price">
          <s>RM{currentOffer.originalPrice}</s>
          <strong>RM{currentOffer.offerPrice}</strong>
          <span className="current-offer-save">{copy.save}</span>
          <span className="current-offer-validity">{copy.validity}</span>
        </p>
        <div className="current-offer-actions">
          <HomeLink
            href={getOfferWhatsappUrl(locale)}
            variant="primary"
            event="whatsapp_click"
            eventLabel={`${currentOffer.id}_homepage_strip`}
            external
          >
            {copy.action}
          </HomeLink>
          <Link className="current-offer-details" href="/promotion#current-offer">
            {copy.details}
          </Link>
        </div>
      </div>
    </section>
  );
}
