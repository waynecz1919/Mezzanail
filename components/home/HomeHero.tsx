"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers";
import { HomeLink } from "@/components/ui/HomeLink";
import { homepage } from "@/config/homepage";
import { siteConfig } from "@/lib/site";

export function HomeHero() {
  const { locale } = useLanguage();
  const heroImage = homepage.heroImage;
  return (
    <section
      className={`home-hero${heroImage ? " home-hero--with-image" : ""}`}
      aria-labelledby="home-hero-title"
    >
      <div className="home-hero-copy">
        <p className="mn-eyebrow">Nail Studio · Melaka</p>
        <h1 id="home-hero-title">Premium Nail Care in Melaka</h1>
        <p className="home-hero-lede">
          Manicure, pedicure, nail extensions, callus care and waxing from
          Mezzanail Nail Studio in Melaka.
        </p>
        <HomeLink
          href={siteConfig.bookingUrl}
          variant="primary"
          event="book_appointment_click"
          eventLabel="homepage_hero"
          external
        >
          Book Now
        </HomeLink>
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
