"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SCRIPT_ID = "mezzanail-google-analytics";
const CONSENT_KEY = "mezzanail-analytics-consent-v1";
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

type ConsentChoice = "granted" | "denied";

type StoredConsent = {
  choice: ConsentChoice;
  savedAt: number;
};

export function DeferredGoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
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

    window.addEventListener("mezzanail:open-analytics-settings", openSettings);
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
        <span>PRIVACY CHOICE · PILIHAN PRIVASI</span>
        <h2 id="analytics-consent-title">Cookies & Analytics</h2>
        <p>
          Optional analytics loads only if you accept.
          <small>Analitik pilihan dimuatkan hanya jika anda menerima.</small>
        </p>
        <Link href="/cookies">Read details / Baca butiran</Link>
      </div>
      <div className="analytics-consent-actions">
        <button type="button" className="btn btn-dark" onClick={() => saveChoice("granted")}>
          Accept
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => saveChoice("denied")}>
          Reject
        </button>
      </div>
    </aside>
  );
}
