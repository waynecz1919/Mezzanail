import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
  async redirects() {
    return [
      {
        source: "/vacancy",
        destination: "/job",
        permanent: true,
      },
      {
        source: "/career",
        destination: "/job",
        permanent: true,
      },
      {
        source: "/slideshow",
        destination: "/tv-slide",
        permanent: true,
      },
    ];
  },
  async headers() {
    const internalHeaders = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    const tvHeaders = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "fullscreen=(self)" },
    ];
    return [
      { source: "/tv-slide", headers: tvHeaders },
      {
        source: "/data/slideshow.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/sw-tv-slide.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      { source: "/redeem/:path*", headers: internalHeaders },
      { source: "/api/redeem/:path*", headers: internalHeaders },
      { source: "/anniversary-jackpot/:path*", headers: internalHeaders },
      { source: "/api/anniversary-jackpot/:path*", headers: internalHeaders },
      {
        source: "/api/job/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/job/application-received",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;

