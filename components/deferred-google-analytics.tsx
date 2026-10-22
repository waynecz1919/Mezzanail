"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers";

const SCRIPT_ID = "mezzanail-google-analytics";
const CONSENT_KEY = "mezzanail-analytics-consent-v1";
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

type ConsentChoice = "granted" | "denied";

type StoredConsent = {
  choice: ConsentChoice;
  savedAt: number;
};

function hasAnalyticsConsent() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(CONSENT_KEY) || "null",
    ) as StoredConsent | null;
    const current =
      stored &&
      (stored.choice === "granted" || stored.choice === "denied") &&
      Date.now() - stored.savedAt < CONSENT_MAX_AGE
        ? stored
        : null;
    return current?.choice === "granted";
  } catch {
    return false;
  }
}

const consentCopy = {
  en: {
    eyebrow: "PRIVACY CHOICE",
    title: "Cookies & Analytics",
    body: "Optional analytics loads only if you accept.",
    details: "Read cookie details",
    accept: "Accept",
    reject: "Reject",
  },
  zh: {
    eyebrow: "隐私选择",
    title: "Cookies 与数据分析",
    body: "只有在您同意后，网站才会加载可选的数据分析。",
    details: "查看 Cookie 详情",
    accept: "接受",
    reject: "拒绝",
  },
  ms: {
    eyebrow: "PILIHAN PRIVASI",
    title: "Kuki & Analitik",
    body: "Analitik pilihan hanya dimuatkan jika anda menerima.",
    details: "Baca butiran kuki",
    accept: "Terima",
    reject: "Tolak",
  },
} as const;

export function DeferredGoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const copy = consentCopy[locale];
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/redeem")) return;

    function loadAnalytics() {
      if (document.getElementById(SCRIPT_ID)) return;
      const analyticsWindow = window as Window & {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
      };
      analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
      analyticsWindow.gtag =
        analyticsWindow.gtag ||
        function gtag(...args: unknown[]) {
          analyticsWindow.dataLayer?.push(args);
        };
      analyticsWindow.gtag("js", new Date());
      analyticsWindow.gtag("config", gaId, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: 31_536_000,
      });
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        gaId,
      )}`;
      document.head.appendChild(script);
    }

    function openSettings() {
      setShowSettings(true);
    }

    function requestSettings() {
      queueMicrotask(() => setShowSettings(true));
    }

    function trackLinkClick(event: MouseEvent) {
      if (!hasAnalyticsConsent()) return;
      const analyticsWindow = window as Window & {
        gtag?: (...args: unknown[]) => void;
      };
      if (!analyticsWindow.gtag) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      const pagePath = window.location.pathname;
      const linkUrl = anchor.href;
      const host = url.hostname.toLowerCase();
      if (
        url.protocol === "whatsapp:" ||
        host === "wa.me" ||
        host.endsWith(".wa.me") ||
        host === "api.whatsapp.com" ||
        host.endsWith(".api.whatsapp.com")
      ) {
        const linkText =
          anchor.innerText.trim() ||
          anchor.getAttribute("aria-label")?.trim() ||
          anchor.title.trim();
        analyticsWindow.gtag("event", "whatsapp_click", {
          link_url: linkUrl,
          page_path: pagePath,
          link_text: linkText,
          transport_type: "beacon",
        });
        return;
      }

      if (url.protocol === "tel:") {
        analyticsWindow.gtag("event", "phone_click", {
          link_url: linkUrl,
          page_path: pagePath,
          transport_type: "beacon",
        });
        return;
      }

      if (
        host === "booking.tunai.io" &&
        /^\/mezzanail(?:\/|$)/i.test(url.pathname)
      ) {
        analyticsWindow.gtag("event", "booking_click", {
          link_url: linkUrl,
          page_path: pagePath,
          transport_type: "beacon",
        });
      }
    }

    window.addEventListener("mezzanail:open-analytics-settings", openSettings);
    document.addEventListener("click", trackLinkClick, true);
    try {
      const stored = JSON.parse(
        window.localStorage.getItem(CONSENT_KEY) || "null",
      ) as StoredConsent | null;
      const current =
        stored &&
        (stored.choice === "granted" || stored.choice === "denied") &&
        Date.now() - stored.savedAt < CONSENT_MAX_AGE
          ? stored
          : null;
      if (current?.choice === "granted") loadAnalytics();
      else if (!current) requestSettings();
    } catch {
      requestSettings();
    }

    return () => {
      window.removeEventListener("mezzanail:open-analytics-settings", openSettings);
      document.removeEventListener("click", trackLinkClick, true);
    };
  }, [gaId, pathname]);

  function removeAnalyticsCookies() {
    for (const entry of document.cookie.split(";")) {
      const name = entry.split("=")[0]?.trim();
      if (!name || (name !== "_ga" && !name.startsWith("_ga_"))) continue;
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.mezzanail.com; SameSite=Lax`;
    }
  }

  function saveChoice(choice: ConsentChoice) {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ choice, savedAt: Date.now() } satisfies StoredConsent),
    );
    const analyticsWindow = window as unknown as Record<
      `ga-disable-${string}`,
      boolean
    >;
    analyticsWindow[`ga-disable-${gaId}`] = choice === "denied";
    if (choice === "granted") {
      window.location.reload();
      return;
    }
    removeAnalyticsCookies();
    setShowSettings(false);
  }

  if (!showSettings || pathname.startsWith("/redeem")) return null;

  return (
    <aside className="analytics-consent" role="dialog" aria-modal="false" aria-labelledby="analytics-consent-title">
      <div>
        <span>{copy.eyebrow}</span>
        <h2 id="analytics-consent-title">{copy.title}</h2>
        <p>{copy.body}</p>
        <Link href="/cookies">{copy.details}</Link>
      </div>
      <div className="analytics-consent-actions">
        <button type="button" className="btn btn-dark" onClick={() => saveChoice("granted")}>
          {copy.accept}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => saveChoice("denied")}>
          {copy.reject}
        </button>
      </div>
    </aside>
  );
}
