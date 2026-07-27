import type { MetadataRoute } from "next";

const baseUrl = "https://www.mezzanail.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/rewards`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/promotion`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/job`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy/job-applicants`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/membership/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/promotion/terms`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/cookies`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
