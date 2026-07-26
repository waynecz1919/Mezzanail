export type PromotionLanguage = "en" | "zh" | "ms";
export type PromotionSource = "nfc" | "qr" | "whatsapp" | "website" | "direct";

export const anniversaryCampaign = {
  id: "mezzanail-7th-anniversary-2026",
  analyticsName: "mezzanail_7th_anniversary_2026",
  title: "Mezzanail 7th Anniversary Celebration",
  campaignName: "7th Anniversary Lucky Draw Campaign",
  startDate: "2026-07-26",
  endDate: "2026-09-30",
  displayDates: "26 July – 30 September 2026",
  promotionUrl: "https://promotion.mezzanail.com",
  bookingUrl:
    "https://booking.tunai.io/booking/mezzanail?outletID=4188#contact",
  whatsappContact: "60162121332",
  banner: {
    webp: "/images/promotion/mezzanail-7th-anniversary-banner.webp",
    png: "/images/promotion/mezzanail-7th-anniversary-banner.png",
    og: "/images/promotion/mezzanail-7th-anniversary-og.jpg",
  },
  qr: {
    png: "/qr/mezzanail-7th-anniversary-qr.png",
    svg: "/qr/mezzanail-7th-anniversary-qr.svg",
  },
  prizes: [
    {
      name: "Apple Watch SE 3",
      description: "A stylish everyday smartwatch for one lucky winner.",
      winnerCount: 1,
      icon: "watch",
    },
    {
      name: "Dyson Supersonic™ Travel Hair Dryer",
      description:
        "Compact, premium and designed for beautiful hair wherever you go.",
      winnerCount: 1,
      icon: "dryer",
    },
    {
      name: "Exclusive Member Rewards",
      description:
        "Enjoy anniversary rewards, member benefits and special surprises.",
      icon: "sparkles",
    },
    {
      name: "Lucky Draw Prizes",
      description:
        "Every eligible participation brings another chance to celebrate and win.",
      icon: "gift",
    },
  ],
  steps: [
    {
      title: "Book Your Appointment",
      description:
        "Choose your preferred service, date and appointment time.",
    },
    {
      title: "Visit Mezzanail",
      description:
        "Enjoy your nail appointment and participate in our anniversary celebration.",
    },
    {
      title: "Share With Friends",
      description:
        "Share this celebration through WhatsApp and invite your friends to discover Mezzanail.",
    },
  ],
  policy:
    "Appointment availability is subject to confirmation. Promotion participation and prize eligibility are subject to the official campaign terms and conditions.",
  terms: {
    lastUpdated: "26 July 2026",
    sections: [
      {
        title: "Campaign period",
        body: "The Mezzanail 7th Anniversary Lucky Draw Campaign runs from 26 July to 30 September 2026, inclusive, unless Mezzanail announces an amendment.",
      },
      {
        title: "Participation",
        body: "Participation is available to eligible Mezzanail customers during the campaign period. Appointment availability remains subject to confirmation. A booking alone does not guarantee a prize.",
      },
      {
        title: "Prizes",
        body: "Campaign prizes include one Apple Watch SE 3, one Dyson Supersonic™ Travel Hair Dryer, exclusive member rewards and other lucky draw prizes. Prizes are non-transferable and cannot be exchanged for cash unless Mezzanail states otherwise.",
      },
      {
        title: "Winner selection",
        body: "Eligible winners will be selected and contacted using the details available to Mezzanail. Mezzanail may request reasonable proof of identity or participation before releasing a prize.",
      },
      {
        title: "Referral links",
        body: "Referral codes in shared links are recorded only for campaign attribution at this stage. They do not automatically grant bonus credit, rewards or additional entries.",
      },
      {
        title: "Changes and enquiries",
        body: "Mezzanail may update these terms when reasonably necessary. Material updates will be published on this page. For campaign enquiries, contact Mezzanail through WhatsApp.",
      },
    ],
  },
} as const;
