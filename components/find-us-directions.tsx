import { MapPin, Navigation } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const locationCopy: Record<Locale, { eyebrow: string; heading: string; google: string; waze: string }> = {
  en: {
    eyebrow: "VISIT OUR STUDIO",
    heading: "Find us / Get directions",
    google: "Navigate with Google Maps",
    waze: "Navigate with Waze",
  },
  zh: {
    eyebrow: "到店信息",
    heading: "找到我们 / 获取路线",
    google: "使用 Google Maps 导航",
    waze: "使用 Waze 导航",
  },
  ms: {
    eyebrow: "LAWATI STUDIO KAMI",
    heading: "Cari kami / Dapatkan arah",
    google: "Navigasi dengan Google Maps",
    waze: "Navigasi dengan Waze",
  },
};

const directionsDestination = encodeURIComponent(
  `${siteConfig.brandName}, ${siteConfig.address.singleLine}`,
);
const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  `${siteConfig.brandName} ${siteConfig.address.singleLine}`,
)}&output=embed`;
const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${directionsDestination}`;

export function FindUsDirections({
  locale,
  promotion = false,
}: {
  locale: Locale;
  promotion?: boolean;
}) {
  const copy = locationCopy[locale];

  return (
    <section
      className={`find-us-directions${promotion ? " find-us-directions--promotion" : ""}`}
      aria-labelledby={`find-us-heading-${promotion ? "promotion" : "contact"}`}
    >
      <div className={`find-us-directions-inner${promotion ? " promotion-shell" : ""}`}>
        <div className="find-us-directions-heading">
          <p className="find-us-directions-eyebrow">{copy.eyebrow}</p>
          <h2 id={`find-us-heading-${promotion ? "promotion" : "contact"}`}>
            {copy.heading}
          </h2>
        </div>
        <div className="find-us-map">
          <iframe
            src={googleMapsEmbedUrl}
            title="Mezzanail Nail Studio location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="find-us-directions-actions">
          <a
            className="find-us-directions-action"
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin size={18} aria-hidden="true" />
            <span>{copy.google}</span>
          </a>
          <a
            className="find-us-directions-action find-us-directions-action--secondary"
            href="https://waze.com/ul?ll=2.2728914,102.2180799&navigate=yes"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation size={18} aria-hidden="true" />
            <span>{copy.waze}</span>
          </a>
        </div>
        <p className="find-us-landmark">LANDMARK_TEXT_FROM_WAYNE</p>
      </div>
    </section>
  );
}
