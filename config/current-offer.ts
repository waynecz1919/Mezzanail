// Seasonal offer shown inside the homepage hero and at the top of /promotion.
// Kept separate from config/homepage.ts so the homepage content stays price-free.
// Times are Malaysia time (Asia/Kuala_Lumpur, UTC+8, no daylight saving).

export type OfferLocale = "en" | "zh" | "ms";

type OfferCopy = {
  eyebrow: string;
  title: string;
  service: string;
  includes: string;
  save: string;
  validity: string;
  terms: string;
  action: string;
  details: string;
  otherServices: string;
  posterAlt: string;
  whatsappMessage: string;
};

export const currentOffer = {
  id: "deepavali-gel-glow-2026",
  startsAt: "2026-10-15T00:00:00+08:00",
  endsAt: "2026-11-08T23:59:59+08:00",
  // First instant the offer is no longer valid (exclusive end).
  endsBefore: "2026-11-09T00:00:00+08:00",
  originalPrice: 95,
  offerPrice: 68,
  saving: 27,
  whatsappPhone: "60162121332",
  poster: {
    en: "/campaigns/deepavali-2026/deepavali-gel-glow-en.webp",
    zh: "/campaigns/deepavali-2026/deepavali-gel-glow-zh.webp",
    ms: "/campaigns/deepavali-2026/deepavali-gel-glow-en.webp",
    width: 1080,
    height: 1350,
  },
  copy: {
    en: {
      eyebrow: "Deepavali offer",
      title: "Deepavali Gel Glow",
      service: "Gelish Manicure",
      includes: "Basic manicure + solid Gelish colour",
      save: "Save RM27",
      validity: "Valid 15 Oct – 8 Nov 2026",
      terms:
        "Solid colour only. Nail art and gel removal are charged separately. Not valid with other offers or packages.",
      action: "Book on WhatsApp",
      details: "Offer details",
      otherServices: "Book other services",
      posterAlt:
        "Deepavali Gel Glow poster: Gelish Manicure RM68, usual price RM95, valid 15 October to 8 November 2026",
      whatsappMessage:
        "Hello Mezzanail, I would like to book the Deepavali Gel Glow Gelish Manicure (RM68).",
    },
    zh: {
      eyebrow: "屠妖节优惠",
      title: "屠妖节 Gel Glow",
      service: "Gelish 手部美甲",
      includes: "基础修甲 + 纯色 Gelish",
      save: "立省 RM27",
      validity: "活动日期 2026年10月15日 – 11月8日",
      terms: "仅限纯色；彩绘及卸甲另计；不可与其他优惠或配套同时使用。",
      action: "WhatsApp 预约",
      details: "优惠详情",
      otherServices: "预约其他服务",
      posterAlt: "屠妖节 Gel Glow 海报：Gelish 手部美甲 RM68，原价 RM95，2026年10月15日至11月8日",
      whatsappMessage: "您好 Mezzanail，我想预约屠妖节 Gel Glow Gelish 手部美甲（RM68）。",
    },
    ms: {
      eyebrow: "Tawaran Deepavali",
      title: "Deepavali Gel Glow",
      service: "Manikur Gelish",
      includes: "Manikur asas + warna Gelish solid",
      save: "Jimat RM27",
      validity: "Sah 15 Okt – 8 Nov 2026",
      terms:
        "Warna solid sahaja. Seni kuku dan penanggalan gel dicaj berasingan. Tidak sah bersama tawaran atau pakej lain.",
      action: "Tempah melalui WhatsApp",
      details: "Butiran tawaran",
      otherServices: "Tempah servis lain",
      posterAlt:
        "Poster Deepavali Gel Glow: Manikur Gelish RM68, harga biasa RM95, sah 15 Oktober hingga 8 November 2026",
      whatsappMessage:
        "Hai Mezzanail, saya ingin menempah Manikur Gelish Deepavali Gel Glow (RM68).",
    },
  } satisfies Record<OfferLocale, OfferCopy>,
} as const;

const startsAtMs = Date.parse(currentOffer.startsAt);
const endsBeforeMs = Date.parse(currentOffer.endsBefore);

export function isOfferActive(now: Date = new Date()): boolean {
  const time = now.getTime();
  return time >= startsAtMs && time < endsBeforeMs;
}

export function getOfferEndDateLabel(locale: OfferLocale): string {
  const endDate = new Date(currentOffer.endsAt);
  const format = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: locale === "zh" ? "numeric" : "short",
    timeZone: "Asia/Kuala_Lumpur",
  });
  const parts = format.formatToParts(endDate);
  const dayPart = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = dayPart ? String(Number(dayPart)) : "";
  return locale === "zh" ? `${month}月${day}日` : `${day} ${month}`;
}

export function getOfferWhatsappUrl(locale: OfferLocale = "en"): string {
  const message = currentOffer.copy[locale].whatsappMessage;
  return `https://wa.me/${currentOffer.whatsappPhone}?text=${encodeURIComponent(message)}`;
}
