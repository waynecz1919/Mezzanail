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
      title: "ANNIVERSARY",
      ordinal: "7th",
      subtitle: "Celebrating Beauty Together",
      image: {
        avif: "/slideshow/anniversary-hero.avif",
        webp: "/slideshow/anniversary-hero.webp",
        fallback: "/slideshow/anniversary-hero.png",
        alt: "Elegant nude almond manicure arranged on champagne satin with soft blush flowers",
        objectPosition: "center center",
      },
    },
  ],
  memberReminder: {
    title: "SHOW YOUR MEMBER QR",
    emphasis: "BEFORE PAYMENT",
  },
  website: "www.mezzanail.com",
  footerItems: [
    {
      id: "birthday",
      icon: "gift",
      title: "BIRTHDAY TREAT",
      emphasis: "50% OFF",
    },
    {
      id: "monthly",
      icon: "polish",
      title: "MONTHLY MEMBER TREAT",
      emphasis: "FREE GEL COLOR",
    },
    {
      id: "package",
      icon: "member-card",
      title: "RM199 NAIL PACKAGE",
      emphasis: "GET RM80 BONUS CREDIT",
    },
    {
      id: "hours",
      icon: "clock",
      title: "OPEN EVERY DAY",
      emphasis: "10:30 AM – 7:00 PM",
    },
  ],
} as const;

export type SlideshowDisplayConfig = typeof slideshowDisplayConfig;
