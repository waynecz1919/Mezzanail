import Image from "next/image";
import { HomeLink } from "@/components/ui/HomeLink";
import { siteConfig } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
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
      <div className="home-hero-media">
        <Image
          src="/services/homepage/hand-care.png"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 45vw, 560px"
          className="home-hero-image"
        />
        <span className="home-hero-placeholder">
          Placeholder — Owner to confirm
        </span>
      </div>
    </section>
  );
}
