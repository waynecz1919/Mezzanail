import type { Metadata } from "next";
import { OfficialFrame } from "@/components/official-site";
import { JobApplicationExperience } from "@/components/job/job-application-experience";

const title = "Nail Artist & Nail Apprentice Jobs | Mezzanail Nail Studio Melaka";
const description =
  "Apply for Nail Artist and Nail Apprentice opportunities at Mezzanail Nail Studio in Melaka. Review the role and submit a secure online application.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://www.mezzanail.com/job" },
  openGraph: {
    title,
    description,
    url: "https://www.mezzanail.com/job",
    type: "website",
    locale: "en_MY",
    siteName: "Mezzanail Nail Studio",
    images: [
      {
        url: "/brand/mezzanail-nail-studio-og.jpg",
        width: 1200,
        height: 630,
        alt: "Mezzanail Nail Studio Melaka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/mezzanail-nail-studio-og.jpg"],
  },
};

export default function JobPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Nail Artist & Nail Apprentice",
    description:
      "Join Mezzanail Nail Studio in Melaka as a Nail Artist or Nail Apprentice. Applicants must be 18 or above and able to work from our Melaka studio.",
    datePosted: "2026-07-27",
    directApply: true,
    employmentType: ["FULL_TIME", "PART_TIME"],
    hiringOrganization: {
      "@type": "Organization",
      name: "Mezzanail Nail Studio",
      sameAs: "https://www.mezzanail.com",
      logo: "https://www.mezzanail.com/brand/mezzanail-circle-logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "36-1, Jalan Seri 7, Taman Cheng Baru",
        addressLocality: "Melaka",
        postalCode: "75260",
        addressCountry: "MY",
      },
    },
    url: "https://www.mezzanail.com/job",
  };

  return (
    <OfficialFrame>
      <JobApplicationExperience />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </OfficialFrame>
  );
}
