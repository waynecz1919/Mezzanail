import type { Metadata } from "next";
import "../redeem/redeem.css";
import "./jackpot.css";

export const metadata: Metadata = {
  title: "Mezzanail 7th Anniversary Jackpot Draw",
  description: "Staff Internal Use Only",
  robots: { index: false, follow: false, nocache: true },
};

export default function JackpotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
