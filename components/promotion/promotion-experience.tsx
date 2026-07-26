"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Gift,
  Heart,
  MessageCircle,
  Nfc,
  QrCode,
  Share2,
  Sparkles,
  Watch,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  anniversaryCampaign,
  type PromotionLanguage,
  type PromotionSource,
} from "@/lib/promotion/campaign-config";
import {
  promotionCopy,
  promotionLanguageLabels,
  promotionLanguageShortLabels,
} from "@/lib/promotion/campaign-copy";
import { trackPromotionEvent } from "@/lib/promotion/analytics";
import {
  REFERRAL_STORAGE_KEY,
  validatePromotionSource,
  validateReferralCode,
} from "@/lib/promotion/referral";
import { getWhatsAppShareUrl } from "@/lib/promotion/share-message";

const PROMOTION_LANGUAGE_STORAGE_KEY = "mezzanail_promotion_language";

const prizeIcons = {
  watch: Watch,
  dryer: Wind,
  sparkles: Sparkles,
  gift: Gift,
};

export function PromotionExperience() {
  const [language, setLanguage] = useState<PromotionLanguage>("en");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [source, setSource] = useState<PromotionSource>("direct");
  const [ready, setReady] = useState(false);
  const pageViewTracked = useRef(false);
  const qrViewTracked = useRef(false);
  const copy = promotionCopy[language];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingReferral = validateReferralCode(params.get("ref"));
    const storedReferral = validateReferralCode(
      window.localStorage.getItem(REFERRAL_STORAGE_KEY),
    );
    const activeReferral = incomingReferral ?? storedReferral;
    const requestedLanguage = params.get("lang");
    const storedLanguage = window.localStorage.getItem(
      PROMOTION_LANGUAGE_STORAGE_KEY,
    );
    const activeLanguage = (
      ["en", "zh", "ms"].includes(requestedLanguage ?? "")
        ? requestedLanguage
        : ["en", "zh", "ms"].includes(storedLanguage ?? "")
          ? storedLanguage
          : "en"
    ) as PromotionLanguage;

    if (incomingReferral) {
      window.localStorage.setItem(REFERRAL_STORAGE_KEY, incomingReferral);
    }

    const frame = window.requestAnimationFrame(() => {
      setLanguage(activeLanguage);
      setReferralCode(activeReferral);
      setSource(validatePromotionSource(params.get("source")));
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready || pageViewTracked.current) return;
    pageViewTracked.current = true;
    trackPromotionEvent("promotion_page_view", {
      language,
      referralCode,
      source,
    });
  }, [language, ready, referralCode, source]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  }, [language]);

  useEffect(() => {
    if (!ready) return;
    const qrSection = document.querySelector("[data-promotion-qr]");
    if (!qrSection || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || qrViewTracked.current) return;
        qrViewTracked.current = true;
        trackPromotionEvent("promotion_qr_view", {
          language,
          referralCode,
          source,
        });
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(qrSection);
    return () => observer.disconnect();
  }, [language, ready, referralCode, source]);

  function handleLanguageChange(nextLanguage: PromotionLanguage) {
    setLanguage(nextLanguage);
    window.localStorage.setItem(
      PROMOTION_LANGUAGE_STORAGE_KEY,
      nextLanguage,
    );
    trackPromotionEvent("promotion_language_change", {
      language: nextLanguage,
      referralCode,
      source,
    });
  }

  function handleBookingClick() {
    trackPromotionEvent("promotion_book_click", {
      language,
      referralCode,
      source,
    });
  }

  function handleShareClick() {
    const whatsappShareUrl = getWhatsAppShareUrl(referralCode);

    void fetch("/api/promotion/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign: anniversaryCampaign.id,
        channel: "whatsapp",
        language,
        referralCode,
        page: window.location.pathname,
      }),
      keepalive: true,
    }).catch((error) => console.error("Promotion share tracking failed", error));

    trackPromotionEvent("promotion_whatsapp_share", {
      language,
      referralCode,
      source,
    });

    window.open(whatsappShareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="promotion-site">
      <header className="promotion-header">
        <div className="promotion-shell promotion-header-inner">
          <Link className="promotion-brand" href="/" aria-label="Mezzanail home">
            <Image
              src="/brand/mezzanail-nail-studio-wordmark.png"
              alt="Mezzanail Nail Studio"
              width={156}
              height={53}
              priority
            />
          </Link>
          <div className="promotion-header-actions">
            <div
              className="promotion-header-languages"
              aria-label={copy.languageLegend}
            >
              {(Object.keys(promotionLanguageShortLabels) as PromotionLanguage[]).map(
                (languageCode) => (
                  <button
                    key={languageCode}
                    type="button"
                    aria-label={promotionLanguageLabels[languageCode]}
                    aria-pressed={language === languageCode}
                    onClick={() => handleLanguageChange(languageCode)}
                  >
                    {promotionLanguageShortLabels[languageCode]}
                  </button>
                ),
              )}
            </div>
            <a
              className="promotion-header-book"
              href={anniversaryCampaign.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBookingClick}
            >
              {copy.bookAppointment}
            </a>
          </div>
        </div>
      </header>

      <section className="promotion-hero" aria-labelledby="promotion-title">
        <Image
          className="promotion-hero-image"
          src={anniversaryCampaign.banner.png}
          alt="Mezzanail 7th Anniversary Lucky Draw Campaign from 26 July to 30 September 2026, featuring Apple Watch and Dyson hair dryer prizes"
          fill
          priority
          sizes="100vw"
          unoptimized
        />
        <a
          className="promotion-hero-banner-link"
          href={anniversaryCampaign.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleBookingClick}
          aria-label={copy.bookAppointment}
        />
        <div className="promotion-hero-scrim" aria-hidden="true" />
        <div className="promotion-shell promotion-hero-content">
          <span className="promotion-status">
            <Sparkles size={15} aria-hidden="true" />
            {copy.status}
          </span>
          <p className="promotion-kicker">{copy.brandKicker}</p>
          <h1 id="promotion-title">
            {copy.heroTitle}
            <span>{copy.heroSubtitle}</span>
          </h1>
          <p className="promotion-date">
            <CalendarDays size={18} aria-hidden="true" />
            {copy.displayDates}
          </p>
          <div className="promotion-hero-actions">
            <a
              className="promotion-button promotion-button-primary"
              href={anniversaryCampaign.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBookingClick}
            >
              {copy.bookAppointment}
            </a>
            <button
              className="promotion-button promotion-button-whatsapp"
              type="button"
              onClick={handleShareClick}
              aria-label={copy.shareAccessibleName}
            >
              <MessageCircle size={19} aria-hidden="true" />
              {copy.shareViaWhatsApp}
            </button>
          </div>
        </div>
      </section>

      <section className="promotion-section promotion-intro">
        <div className="promotion-shell promotion-intro-grid">
          <div>
            <p className="promotion-eyebrow">{copy.introEyebrow}</p>
            <h2>{copy.introTitle}</h2>
          </div>
          <div>
            <p className="promotion-lead">{copy.introLead}</p>
            <div className="promotion-date-card">
              <CalendarDays size={22} aria-hidden="true" />
              <span>
                {copy.campaignPeriod}
                <strong>{copy.displayDates}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="promotion-section promotion-prizes" id="prizes">
        <div className="promotion-shell">
          <div className="promotion-section-heading">
            <div>
              <p className="promotion-eyebrow">{copy.prizeEyebrow}</p>
              <h2>{copy.prizeTitle}</h2>
            </div>
            <p>{copy.prizeLead}</p>
          </div>
          <div className="promotion-prize-grid">
            {anniversaryCampaign.prizes.map((prize, index) => {
              const Icon =
                prizeIcons[prize.icon as keyof typeof prizeIcons] ?? Gift;
              const localizedPrize = copy.prizes[index];
              return (
                <article
                  className={`promotion-prize-card promotion-prize-${index + 1}`}
                  key={prize.name}
                >
                  <div className="promotion-prize-number">0{index + 1}</div>
                  <div className="promotion-prize-icon">
                    <Icon size={34} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  {"winnerCount" in prize && (
                    <span className="promotion-winner-tag">
                      {prize.winnerCount} {copy.winner}
                    </span>
                  )}
                  <h3>{localizedPrize.name}</h3>
                  <p>{localizedPrize.description}</p>
                </article>
              );
            })}
          </div>
          <p className="promotion-disclaimer">{copy.prizeDisclaimer}</p>
        </div>
      </section>

      <section className="promotion-section promotion-how">
        <div className="promotion-shell">
          <div className="promotion-section-heading promotion-section-heading-centered">
            <div>
              <p className="promotion-eyebrow">{copy.howEyebrow}</p>
              <h2>{copy.howTitle}</h2>
            </div>
          </div>
          <div className="promotion-steps">
            {copy.steps.map((step, index) => (
              <article className="promotion-step" key={step.title}>
                <span className="promotion-step-number">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < copy.steps.length - 1 && (
                  <span className="promotion-step-line" aria-hidden="true" />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="promotion-section promotion-share" id="share">
        <div className="promotion-shell promotion-share-grid">
          <div className="promotion-share-copy">
            <p className="promotion-eyebrow">{copy.shareEyebrow}</p>
            <h2>{copy.shareTitle}</h2>
            <p className="promotion-lead">{copy.shareLead}</p>
            <fieldset className="promotion-languages">
              <legend>{copy.languageLegend}</legend>
              <div>
                {(
                  Object.keys(promotionLanguageLabels) as PromotionLanguage[]
                ).map((languageCode) => (
                  <button
                    key={languageCode}
                    type="button"
                    aria-pressed={language === languageCode}
                    className={
                      language === languageCode ? "is-selected" : undefined
                    }
                    onClick={() => handleLanguageChange(languageCode)}
                  >
                    {promotionLanguageLabels[languageCode]}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              className="promotion-button promotion-button-whatsapp promotion-share-button"
              type="button"
              onClick={handleShareClick}
              aria-label={`${copy.shareViaWhatsApp} — ${promotionLanguageLabels[language]}`}
            >
              <MessageCircle size={20} aria-hidden="true" />
              {copy.shareViaWhatsApp}
            </button>
            {ready && referralCode && (
              <p className="promotion-referral-note" role="status">
                <Check size={15} aria-hidden="true" />
                {copy.referralPrefix} {referralCode} {copy.referralSuffix}
              </p>
            )}
          </div>

          <div className="promotion-qr-card" data-promotion-qr>
            <div className="promotion-share-icons" aria-hidden="true">
              <Nfc size={26} />
              <QrCode size={26} />
              <MessageCircle size={26} />
            </div>
            <p className="promotion-eyebrow">{copy.qrEyebrow}</p>
            <h3>{copy.qrTitle}</h3>
            <div className="promotion-qr-frame">
              <Image
                src={anniversaryCampaign.qr.png}
                alt="QR code for promotion.mezzanail.com"
                width={1200}
                height={1200}
                sizes="220px"
              />
            </div>
            <div className="promotion-qr-downloads">
              <a href={anniversaryCampaign.qr.png} download>
                {copy.downloadPng}
              </a>
              <a href={anniversaryCampaign.qr.svg} download>
                {copy.downloadSvg}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="promotion-section promotion-final-cta">
        <div className="promotion-shell promotion-final-card">
          <Heart size={36} aria-hidden="true" />
          <p className="promotion-eyebrow">{copy.finalEyebrow}</p>
          <h2>{copy.finalTitle}</h2>
          <p>{copy.policy}</p>
          <div className="promotion-final-actions">
            <a
              className="promotion-button promotion-button-primary"
              href={anniversaryCampaign.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBookingClick}
            >
              {copy.bookAppointment}
            </a>
            <Link href={`/promotion/terms?lang=${language}`}>
              {copy.viewTerms}
            </Link>
          </div>
        </div>
      </section>

      <footer className="promotion-footer">
        <div className="promotion-shell promotion-footer-inner">
          <div>
            <strong>MEZZANAIL</strong>
            <span>{copy.footerCampaign}</span>
          </div>
          <p>© 2026 Mezzanail Nail Studio. All rights reserved.</p>
        </div>
      </footer>

      <nav className="promotion-mobile-cta" aria-label="Campaign actions">
        <a
          href={anniversaryCampaign.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleBookingClick}
        >
          <CalendarDays size={19} aria-hidden="true" />
          {copy.bookNow}
        </a>
        <button
          type="button"
          onClick={handleShareClick}
          aria-label={copy.shareAccessibleName}
        >
          <Share2 size={19} aria-hidden="true" />
          {copy.share}
        </button>
      </nav>
    </main>
  );
}
