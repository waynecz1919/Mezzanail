import { MEMBER_CENTER_URL } from "@/config/member-center";

export const primaryNavigation = [
  { href: "/", labelKey: "home" },
  { href: "/services", labelKey: "services" },
  { href: MEMBER_CENTER_URL, labelKey: "rewards" },
  { href: "/promotion", labelKey: "promo" },
  { href: "/about", labelKey: "story" },
  { href: "/contact", labelKey: "contact" },
] as const;
