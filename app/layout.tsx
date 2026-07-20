import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "@/components/providers";
import { isConfiguredUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope", preload: true });
const beautyDisplay = Bodoni_Moda({ subsets: ["latin"], display: "swap", variable: "--font-beauty", weight: ["400", "500"], preload: true });

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

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#050505" }] };

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
  return <html lang="en" suppressHydrationWarning><body className={`${manrope.variable} ${beautyDisplay.variable}`}><Providers>{children}</Providers><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/><GoogleAnalytics gaId="G-DXWYYRT6QX" /></body></html>;
}
