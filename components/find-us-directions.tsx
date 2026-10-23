import { Car, MapPin, Navigation } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export const locationCopy: Record<Locale, { eyebrow: string; heading: string; google: string; waze: string; landmark: string; parking: string }> = {
  en: {
    eyebrow: "VISIT OUR STUDIO",
    heading: "Find us / Get directions",
    google: "Navigate with Google Maps",
    waze: "Navigate with Waze",
    landmark: "Upstairs (1st floor) above Restoran Fogai, in the 7-Eleven row, opposite Caring Pharmacy · Taman Cheng Baru",
    parking: "Parking available right in front of the studio.",
  },
  zh: {
    eyebrow: "到店信息",
    heading: "找到我们 / 获取路线",
    google: "使用 Google Maps 导航",
    waze: "使用 Waze 导航",
    landmark: "Restoran Fogai 楼上（二楼），7-Eleven 那排店，Caring Pharmacy 对面 · Taman Cheng Baru",
    parking: "店门口可以停车。",
  },
  ms: {
    eyebrow: "LAWATI STUDIO KAMI",
    heading: "Cari kami / Dapatkan arah",
    google: "Navigasi dengan Google Maps",
    waze: "Navigasi dengan Waze",
    landmark: "Tingkat 1, di atas Restoran Fogai, sebaris dengan 7-Eleven, bertentangan Caring Pharmacy · Taman Cheng Baru",
    parking: "Tempat letak kereta tersedia di hadapan studio.",
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
        <p className="find-us-landmark">
          <MapPin size={15} aria-hidden="true" />
          <span>{copy.landmark}</span>
        </p>
        <p className="find-us-landmark find-us-parking">
          <Car size={15} aria-hidden="true" />
          <span>{copy.parking}</span>
        </p>
      </div>
    </section>
  );
}
