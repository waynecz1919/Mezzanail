import type { Metadata } from "next";
import "./redeem.css";

export const metadata: Metadata = {
  title: "Mezzanail Redeem Center",
  description: "Staff Internal Use Only",
  robots: { index: false, follow: false, nocache: true },
};

export default function RedeemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
