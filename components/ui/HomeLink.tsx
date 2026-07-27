"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type HomepageAnalyticsEvent =
  | "service_category_click"
  | "nail_work_click"
  | "google_reviews_click"
  | "membership_click"
  | "open_maps_click"
  | "book_appointment_click"
  | "whatsapp_click";

type HomeLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  ariaLabel?: string;
  event?: HomepageAnalyticsEvent;
  eventLabel?: string;
  external?: boolean;
};

function trackHomepageAction(
  event: HomepageAnalyticsEvent | undefined,
  destination: string,
  label: string | undefined,
) {
  if (!event || typeof window === "undefined") return;
  const analyticsWindow = window as Window & {
    gtag?: (...args: unknown[]) => void;
  };
  analyticsWindow.gtag?.("event", event, {
    destination,
    content_label: label,
  });
}

export function HomeLink({
  href,
  children,
  variant = "text",
  className = "",
  ariaLabel,
  event,
  eventLabel,
  external = false,
}: HomeLinkProps) {
  const classes = `mn-button mn-button--${variant} ${className}`.trim();
  const onClick = () => trackHomepageAction(event, href, eventLabel);

  if (!external && href.startsWith("/")) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
