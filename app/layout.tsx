import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Noto_Sans_SC } from "next/font/google";
import { Providers } from "@/components/providers";
import { DeferredGoogleAnalytics } from "@/components/deferred-google-analytics";
import { isConfiguredUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const GOOGLE_ANALYTICS_ID = "G-DXWYYRT6QX";
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope", preload: true });
const beautyDisplay = Cormorant_Garamond({ subsets: ["latin"], display: "swap", variable: "--font-beauty", weight: ["400", "500", "600"], preload: true });
const chineseSans = Noto_Sans_SC({ subsets: ["latin"], display: "swap", variable: "--font-cjk", weight: ["400", "500", "600"], preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://mezzanail.com"),
  title: { default: "Mezzanail Nail Studio | Premium Nail Care Melaka", template: "%s | Mezzanail Nail Studio" },
  description: "Mezzanail Nail Studio in Melaka, Malaysia offers professional manicure, pedicure, nail extensions and specialised foot care in a modern premium studio.",
  keywords: ["Mezzanail Nail Studio", "nail studio Melaka", "manicure Melaka", "pedicure Melaka", "premium nail care Malaysia"],
  openGraph: { title: "Mezzanail Nail Studio", description: "Modern premium nail care in Melaka, Malaysia.", type: "website", locale: "en_MY", siteName: "Mezzanail Nail Studio", images: [{ url: "/opengraph-image.png", width: 3456, height: 1152, alt: "Mezzanail Nail Studio official logo" }] },
  twitter: { card: "summary_large_image", title: "Mezzanail Nail Studio", description: "Modern premium nail care in Melaka, Malaysia.", images: ["/opengraph-image.png"] },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fbf7f4" }, { media: "(prefers-color-scheme: dark)", color: "#130b0e" }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sameAs = [siteConfig.facebookUrl, siteConfig.instagramUrl, siteConfig.xiaohongshuUrl].filter(isConfiguredUrl);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: siteConfig.brandName,
    image: `https://mezzanail.com${siteConfig.logoPath}`,
    logo: `https://mezzanail.com${siteConfig.logoPath}`,
    url: "https://mezzanail.com",
    telephone: "+6062885267",
    address: { "@type": "PostalAddress", streetAddress: "36-1, Jalan Seri 7, Taman Cheng Baru", postalCode: "75260", addressLocality: "Melaka", addressCountry: "MY" },
    openingHours: "Mo-Su 10:30-19:00",
    sameAs,
  };
  const analyticsBootstrap = `
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
    window.gtag("js", new Date());
    window.gtag("config", "${GOOGLE_ANALYTICS_ID}");
  `;

  return <html lang="en" suppressHydrationWarning><body className={`${manrope.variable} ${beautyDisplay.variable} ${chineseSans.variable}`}><script dangerouslySetInnerHTML={{ __html: analyticsBootstrap }}/><Providers>{children}</Providers><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/><DeferredGoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} /></body></html>;
}
