"use client";

import { ArrowRight } from "lucide-react";
import { homepageContent } from "@/config/homepage";
import type { Locale } from "@/lib/i18n";
import { HomeLink } from "@/components/ui/HomeLink";

export function MembershipBanner({ locale }: { locale: Locale }) {
  const copy = homepageContent[locale].membership;

  return (
    <section className="home-membership mn-home-section" aria-labelledby="membership-title">
      <div className="mn-home-shell">
        <div className="membership-banner">
          <div>
            <p className="mn-eyebrow">{copy.eyebrow}</p>
            <h2 id="membership-title">{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </div>
          <HomeLink
            href="/rewards"
            variant="primary"
            event="membership_click"
            eventLabel="homepage_membership_banner"
          >
            {copy.action}
            <ArrowRight aria-hidden="true" size={16} />
          </HomeLink>
        </div>
      </div>
    </section>
  );
}
