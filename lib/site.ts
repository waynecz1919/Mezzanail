import type { Locale } from "@/lib/i18n";

export const siteUrl = "https://www.mezzanail.com";
export const BOOKING_URL = "https://booking.tunai.io/mezzanail";

export type WhatsappContext =
  | "general"
  | "services"
  | "membership"
  | "promotion"
  | "career";

export const siteConfig = {
  brandName: "Mezzanail Nail Studio",
  description: "Mezzanail Nail Studio is a modern luxury nail studio in Melaka, Malaysia.",
  logoPath: "/brand/mezzanail-nail-studio-wordmark.png",
  circleLogoPath: "/brand/mezzanail-circle-logo.png",
  whatsappQrPath: "/brand/mezzanail-whatsapp-qr.png",
  xiaohongshuProfileImagePath: "/brand/mezzanail-xiaohongshu-profile.jpeg",

  bookingUrl: BOOKING_URL,
  appStoreUrl: "https://apps.apple.com/my/app/tunaiapp/id6446320035",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=io.tunai.userapp",

  whatsappNumber: "60162121332",
  whatsappUrl: "https://api.whatsapp.com/send?phone=60162121332",
  whatsappMessages: {
    general: {
      en: "Hello Mezzanail Nail Studio, I would like to enquire about your services and make an appointment.",
      zh: "您好 Mezzanail Nail Studio，我想咨询服务并进行预约。",
      ms: "Hello Mezzanail Nail Studio, saya ingin bertanya tentang servis dan membuat janji temu.",
    },
    services: {
      en: "Hello Mezzanail Nail Studio, I would like help choosing a service before I book.",
      zh: "您好 Mezzanail Nail Studio，我想在预约前咨询适合我的服务。",
      ms: "Hello Mezzanail Nail Studio, saya ingin bantuan memilih servis sebelum membuat tempahan.",
    },
    membership: {
      en: "Hello Mezzanail Nail Studio, I would like to confirm the current membership options and benefits.",
      zh: "您好 Mezzanail Nail Studio，我想确认目前的会员配套与礼遇。",
      ms: "Hello Mezzanail Nail Studio, saya ingin mengesahkan pilihan dan manfaat keahlian semasa.",
    },
    promotion: {
      en: "Hello Mezzanail Nail Studio, I would like to enquire about the 7th Anniversary Lucky Draw Campaign.",
      zh: "您好 Mezzanail Nail Studio，我想咨询七周年幸运抽奖活动。",
      ms: "Hello Mezzanail Nail Studio, saya ingin bertanya tentang Kempen Cabutan Bertuah Ulang Tahun Ke-7.",
    },
    career: {
      en: "Hello Mezzanail Nail Studio, I would like to enquire about the current Nail Artist or Nail Apprentice opportunities.",
      zh: "您好 Mezzanail Nail Studio，我想咨询目前的美甲师或美甲学徒职位。",
      ms: "Hello Mezzanail Nail Studio, saya ingin bertanya tentang peluang Nail Artist atau Nail Apprentice semasa.",
    },
  },

  phoneDisplay: "06 288 5267",
  phoneLink: "tel:+6062885267",
  mobileDisplay: "016 2121 332",
  mobileLink: "tel:+60162121332",
  email: "REPLACE_WITH_OFFICIAL_EMAIL_ADDRESS",
  address: {
    lines: ["36-1, Jalan Seri 7", "Taman Cheng Baru", "75260 Melaka", "Malaysia"],
    singleLine: "36-1, Jalan Seri 7, Taman Cheng Baru, 75260 Melaka, Malaysia",
  },
  businessHours: "Daily · 10:30 AM – 7:00 PM",

  googleMapsEmbedUrl: "https://www.google.com/maps?q=36-1%2C%20Jalan%20Seri%207%2C%20Taman%20Cheng%20Baru%2C%2075260%20Melaka%2C%20Malaysia&output=embed",
  googleMapsDirectionsUrl: "https://goo.gl/maps/gofTvzwvNNtdq9fPA",
  googleReviewUrl: "https://www.google.com/maps/place/Mezzanail+Nail+Studio/@2.2728968,102.215505,17z/data=!3m1!4b1!4m6!3m5!1s0x31d1fb33053bfa07:0x7a6aea873ecdf8d5!8m2!3d2.2728914!4d102.2180799!16s%2Fg%2F11h4n9cxk9?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D",
  googleReviewsEmbedUrl: "REPLACE_WITH_OFFICIAL_GOOGLE_REVIEWS_EMBED_URL",
  facebookUrl: "https://www.facebook.com/mezzanail/",
  instagramUrl: "https://www.instagram.com/mezzanail_nail_studio/",
  xiaohongshuUrl: "https://xhslink.com/m/5g3Myox7iC2",
  xiaohongshuName: "Mezzanail Nail Studio",

  announcement: {
    enabled: true,
    campaign: "7th Anniversary",
    dates: "26th July — 30th September 2026",
  },
} as const;

export function isConfiguredUrl(url: string) {
  return url.startsWith("https://") && !url.startsWith("https://REPLACE_WITH_") && !url.includes("REPLACE_WITH_");
}

export function getWhatsappUrl(
  locale: Locale = "en",
  context: WhatsappContext = "general",
) {
  return `${siteConfig.whatsappUrl}${siteConfig.whatsappUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent(siteConfig.whatsappMessages[context][locale])}`;
}

// Compatibility properties used by the existing membership experience.
export const legacySiteConfig = {
  name: `${siteConfig.brandName} Rewards`,
  description: "Mezzanail's membership experience, designed around meaningful beauty privileges.",
  whatsappUrl: getWhatsappUrl("en", "membership"),
  instagramUrl: siteConfig.instagramUrl,
  locationUrl: siteConfig.googleMapsDirectionsUrl,
};
