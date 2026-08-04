export const slideshowDisplayConfig = {
  projectName: "Mezzanail TV Slideshow",
  timeZone: "Asia/Kuala_Lumpur",
  brand: {
    name: "MEZZANAIL",
    slogan: "Beauty, Made Personal.",
  },
  slides: [
    {
      id: "seventh-anniversary",
      type: "artwork",
      title: "7th Anniversary",
      subtitle: "Celebrating Beauty Together",
      image: "/slideshow/anniversary-hero.webp",
      mobileImage: "/slideshow/anniversary-hero.webp",
      imageAvif: "/slideshow/anniversary-hero.avif",
      fallbackImage: "/slideshow/anniversary-hero.png",
      imagePosition: "center center",
      captionPosition: "left",
      duration: 10_000,
      enabled: true,
      startDate: null,
      endDate: null,
      displayOrder: 1.5,
      qrUrl: null,
      designCode: "7TH",
      category: "Anniversary",
    },
  ],
  memberQr: {
    title: "SCAN TO OPEN",
    subtitle: "MEMBER CENTER",
    url: "https://member.mezzanail.com/member-credits",
    displayUrl: "member.mezzanail.com",
  },
  footerItems: [
    {
      id: "birthday",
      icon: "gift",
      label: "Birthday Treat",
      value: "50% OFF",
    },
    {
      id: "monthly",
      icon: "polish",
      label: "Every Month",
      value: "FREE GEL COLOR",
    },
    {
      id: "package",
      icon: "member-card",
      label: "RM199 Nail Package",
      value: "RM80 BONUS CREDIT",
    },
    {
      id: "hours",
      icon: "clock",
      label: "Open Every Day",
      value: "10:30 AM – 7:00 PM",
    },
  ],
} as const;

export type SlideshowDisplayConfig = typeof slideshowDisplayConfig;
