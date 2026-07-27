import type { Metadata } from "next";
import { OfficialFrame } from "@/components/official-site";
import { JobApplicationReceived } from "@/components/job/job-application-received";

export const metadata: Metadata = {
  title: "Application Received",
  description: "Mezzanail Nail Studio job application submission status.",
  robots: { index: false, follow: false, nocache: true },
};

export default function ApplicationReceivedPage() {
  return (
    <OfficialFrame>
      <JobApplicationReceived />
    </OfficialFrame>
  );
}
