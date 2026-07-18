import type { Metadata } from "next";
import { LegalPage } from "@/components/official-site";

export const metadata: Metadata = { title: "Privacy Policy | Mezzanail Nail Studio" };

export default function Page() { return <LegalPage kind="privacy" />; }
