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
  promotionUrl: "https://www.mezzanail.com/promotion",
  bookingUrl:
    "https://booking.tunai.io/booking/mezzanail?outletID=4188#contact",
  whatsappContact: "60162121332",
  banner: {
    webp: "/images/promotion/mezzanail-7th-anniversary-banner-v2.webp",
    png: "/images/promotion/mezzanail-7th-anniversary-banner-v2.png",
    og: "/images/promotion/mezzanail-7th-anniversary-og-v2.jpg",
  },
  qr: {
    png: "/qr/mezzanail-7th-anniversary-qr-v2.png",
    svg: "/qr/mezzanail-7th-anniversary-qr-v2.svg",
  },
  prizes: [
    {
      name: "Dyson Supersonic™ Travel Hair Dryer",
      description:
        "A premium travel hair dryer for beautiful styling wherever you go.",
      winnerCount: 1,
      icon: "dryer",
    },
    {
      name: "HUAWEI Watch Fit 5",
      description: "A stylish smartwatch designed for everyday wellbeing.",
      winnerCount: 1,
      icon: "watch",
    },
    {
      name: "Xiaomi Robot Vacuum",
      description: "A smart home helper that keeps daily cleaning effortless.",
      winnerCount: 1,
      icon: "sparkles",
    },
    {
      name: "Beauty Vouchers & Weekly Rewards",
      description:
        "Enjoy beauty treats, member surprises and more chances to celebrate.",
      icon: "gift",
    },
  ],
  steps: [
    {
      title: "Join Our Membership",
      description:
        "Become a Mezzanail member to take part in our anniversary celebration.",
    },
    {
      title: "Scan & Share With 3 Friends",
      description:
        "Scan the campaign QR and share the celebration with three friends.",
    },
    {
      title: "Join the 7th Anniversary Lucky Draw",
      description:
        "Complete the campaign steps for your chance to win.",
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
        body: "Campaign prizes include one Dyson Supersonic™ Travel Hair Dryer, one HUAWEI Watch Fit 5, one Xiaomi Robot Vacuum, beauty vouchers and weekly rewards. Prizes are non-transferable and cannot be exchanged for cash unless Mezzanail states otherwise.",
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
