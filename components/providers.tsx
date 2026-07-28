"use client";

import { ThemeProvider } from "next-themes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Locale, localeNames, messages } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: (typeof messages)[Locale];
  localeNames: typeof localeNames;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    window.localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.documentElement.style.colorScheme = "light";

    const saved = window.localStorage.getItem("mezzanail-rewards-locale") as Locale | null;
    if (saved && saved in messages) {
      document.documentElement.lang =
        saved === "zh" ? "zh-CN" : saved === "ms" ? "ms" : "en";
      const frame = window.requestAnimationFrame(() => setLocaleState(saved));
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("mezzanail-rewards-locale", next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : next;
  };

  const value = useMemo(() => ({ locale, setLocale, dict: messages[locale], localeNames }), [locale]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange
    >
      <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
    </ThemeProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within Providers");
  return context;
}
