"use client";

import { ArrowUpRight, Star } from "lucide-react";
import { homepageContent } from "@/config/homepage";
import { siteConfig } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { HomeLink } from "@/components/ui/HomeLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GoogleReviewsPreview({ locale }: { locale: Locale }) {
  const copy = homepageContent[locale].reviews;

  return (
    <section className="home-reviews mn-home-section" id="reviews" aria-labelledby="reviews-title">
      <div className="mn-home-shell">
        <div className="reviews-heading" id="reviews-title">
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            subtitle={copy.subtitle}
          />
          <a
            className="google-rating"
            href={siteConfig.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${copy.rating} out of 5 on Google — ${copy.ratingNote}`}
            onClick={() => {
              const analyticsWindow = window as Window & {
                gtag?: (...args: unknown[]) => void;
              };
              analyticsWindow.gtag?.("event", "google_reviews_click", {
                destination: siteConfig.googleReviewUrl,
                content_label: "rating",
              });
            }}
          >
            <Star aria-hidden="true" size={20} fill="currentColor" />
            <strong>{copy.rating}</strong>
            <span>/ 5</span>
            <small>{copy.ratingNote}</small>
          </a>
        </div>
        <div className="reviews-grid">
          {copy.reviews.map((review) => (
            <figure className="review-quote" key={review}>
              <blockquote>“{review}”</blockquote>
              <figcaption>{copy.sourceLabel}</figcaption>
            </figure>
          ))}
        </div>
        <HomeLink
          href={siteConfig.googleReviewUrl}
          variant="secondary"
          event="google_reviews_click"
          eventLabel="all_reviews"
          external
          ariaLabel={`${copy.action} — ${siteConfig.brandName}`}
          className="reviews-action"
        >
          {copy.action}
          <ArrowUpRight aria-hidden="true" size={16} />
        </HomeLink>
      </div>
    </section>
  );
}
