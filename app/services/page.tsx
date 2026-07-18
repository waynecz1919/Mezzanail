import type { Metadata } from "next";
import { ServicesPage } from "@/components/official-site";

export const metadata: Metadata = { title: "Services & Duration", description: "Explore Mezzanail Nail Studio manicure, pedicure, nail extensions, foot treatments and service durations in Melaka." };
export default function Page() { return <ServicesPage />; }
