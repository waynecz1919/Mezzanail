"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCRIPT_ID = "mezzanail-google-analytics";

export function DeferredGoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/redeem")) return;
    let timeoutId: number | undefined;

    function loadAnalytics() {
      if (document.getElementById(SCRIPT_ID)) return;
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        gaId,
      )}`;
      document.head.appendChild(script);
      window.removeEventListener("pointerdown", loadAnalytics);
      window.removeEventListener("keydown", loadAnalytics);
      if (timeoutId) window.clearTimeout(timeoutId);
    }

    window.addEventListener("pointerdown", loadAnalytics, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", loadAnalytics, { once: true });
    timeoutId = window.setTimeout(loadAnalytics, 12_000);

    return () => {
      window.removeEventListener("pointerdown", loadAnalytics);
      window.removeEventListener("keydown", loadAnalytics);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [gaId, pathname]);

  return null;
}
