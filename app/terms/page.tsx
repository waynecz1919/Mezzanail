import type { Metadata } from "next";
import { LegalPage } from "@/components/official-site";

export const metadata: Metadata = { title: "Terms of Use | Mezzanail Nail Studio" };

export default function Page() { return <LegalPage kind="terms" />; }
