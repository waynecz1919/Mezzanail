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
import { trackPromotionEvent } from "@/lib/promotion/analytics";
import {
  REFERRAL_STORAGE_KEY,
  validatePromotionSource,
  validateReferralCode,
} from "@/lib/promotion/referral";
import { getWhatsAppShareUrl } from "@/lib/promotion/share-message";

const languageLabels: Record<PromotionLanguage, string> = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
};

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingReferral = validateReferralCode(params.get("ref"));
    const storedReferral = validateReferralCode(
      window.localStorage.getItem(REFERRAL_STORAGE_KEY),
    );
    const activeReferral = incomingReferral ?? storedReferral;

    if (incomingReferral) {
      window.localStorage.setItem(REFERRAL_STORAGE_KEY, incomingReferral);
    }

    const frame = window.requestAnimationFrame(() => {
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
    const whatsappShareUrl = getWhatsAppShareUrl(language, referralCode);

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
          <a
            className="promotion-header-book"
            href={anniversaryCampaign.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBookingClick}
          >
            Book Appointment
          </a>
        </div>
      </header>

      <section className="promotion-hero" aria-labelledby="promotion-title">
        <Image
          className="promotion-hero-image"
          src={anniversaryCampaign.banner.webp}
          alt="Rose-gold seventh anniversary display with smartwatch and premium hair dryer prizes"
          fill
          priority
          sizes="100vw"
        />
        <div className="promotion-hero-scrim" aria-hidden="true" />
        <div className="promotion-shell promotion-hero-content">
          <span className="promotion-status">
            <Sparkles size={15} aria-hidden="true" />
            7th Anniversary Celebration
          </span>
          <p className="promotion-kicker">Mezzanail Nail Studio</p>
          <h1 id="promotion-title">
            7th Anniversary
            <span>Lucky Draw Campaign</span>
          </h1>
          <p className="promotion-date">
            <CalendarDays size={18} aria-hidden="true" />
            {anniversaryCampaign.displayDates}
          </p>
          <div className="promotion-hero-actions">
            <a
              className="promotion-button promotion-button-primary"
              href={anniversaryCampaign.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBookingClick}
            >
              Book Appointment
            </a>
            <button
              className="promotion-button promotion-button-whatsapp"
              type="button"
              onClick={handleShareClick}
              aria-label="Share the Mezzanail anniversary campaign via WhatsApp"
            >
              <MessageCircle size={19} aria-hidden="true" />
              Share via WhatsApp
            </button>
          </div>
        </div>
      </section>

      <section className="promotion-section promotion-intro">
        <div className="promotion-shell promotion-intro-grid">
          <div>
            <p className="promotion-eyebrow">Seven wonderful years</p>
            <h2>Celebrate 7 Wonderful Years With Us</h2>
          </div>
          <div>
            <p className="promotion-lead">
              Book your appointment, enjoy our anniversary celebration and
              stand a chance to win exciting prizes.
            </p>
            <div className="promotion-date-card">
              <CalendarDays size={22} aria-hidden="true" />
              <span>
                Campaign period
                <strong>{anniversaryCampaign.displayDates}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="promotion-section promotion-prizes" id="prizes">
        <div className="promotion-shell">
          <div className="promotion-section-heading">
            <div>
              <p className="promotion-eyebrow">Anniversary lucky draw</p>
              <h2>Beautiful Reasons to Celebrate</h2>
            </div>
            <p>
              Every prize is part of our thank-you to the community that has
              grown with Mezzanail.
            </p>
          </div>
          <div className="promotion-prize-grid">
            {anniversaryCampaign.prizes.map((prize, index) => {
              const Icon =
                prizeIcons[prize.icon as keyof typeof prizeIcons] ?? Gift;
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
                      {prize.winnerCount} Winner
                    </span>
                  )}
                  <h3>{prize.name}</h3>
                  <p>{prize.description}</p>
                </article>
              );
            })}
          </div>
          <p className="promotion-disclaimer">
            Prize eligibility is subject to the official campaign terms.
            Participation does not guarantee a prize.
          </p>
        </div>
      </section>

      <section className="promotion-section promotion-how">
        <div className="promotion-shell">
          <div className="promotion-section-heading promotion-section-heading-centered">
            <div>
              <p className="promotion-eyebrow">How it works</p>
              <h2>Three Simple Steps</h2>
            </div>
          </div>
          <div className="promotion-steps">
            {anniversaryCampaign.steps.map((step, index) => (
              <article className="promotion-step" key={step.title}>
                <span className="promotion-step-number">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < anniversaryCampaign.steps.length - 1 && (
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
            <p className="promotion-eyebrow">Pass the celebration on</p>
            <h2>Share With Someone Special</h2>
            <p className="promotion-lead">
              Choose your language, then send the campaign directly through
              WhatsApp. Any valid referral code in your link stays attached.
            </p>
            <fieldset className="promotion-languages">
              <legend>WhatsApp message language</legend>
              <div>
                {(Object.keys(languageLabels) as PromotionLanguage[]).map(
                  (languageCode) => (
                    <button
                      key={languageCode}
                      type="button"
                      aria-pressed={language === languageCode}
                      className={
                        language === languageCode ? "is-selected" : undefined
                      }
                      onClick={() => handleLanguageChange(languageCode)}
                    >
                      {languageLabels[languageCode]}
                    </button>
                  ),
                )}
              </div>
            </fieldset>
            <button
              className="promotion-button promotion-button-whatsapp promotion-share-button"
              type="button"
              onClick={handleShareClick}
              aria-label={`Share via WhatsApp in ${languageLabels[language]}`}
            >
              <MessageCircle size={20} aria-hidden="true" />
              Share via WhatsApp
            </button>
            {ready && referralCode && (
              <p className="promotion-referral-note" role="status">
                <Check size={15} aria-hidden="true" />
                Referral code {referralCode} will be preserved in your share.
              </p>
            )}
          </div>

          <div className="promotion-qr-card" data-promotion-qr>
            <div className="promotion-share-icons" aria-hidden="true">
              <Nfc size={26} />
              <QrCode size={26} />
              <MessageCircle size={26} />
            </div>
            <p className="promotion-eyebrow">Share the celebration</p>
            <h3>Tap, scan or share this page with your friends.</h3>
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
                Download PNG
              </a>
              <a href={anniversaryCampaign.qr.svg} download>
                Download SVG
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="promotion-section promotion-final-cta">
        <div className="promotion-shell promotion-final-card">
          <Heart size={36} aria-hidden="true" />
          <p className="promotion-eyebrow">Celebrate with Mezzanail</p>
          <h2>Your Next Beautiful Appointment Awaits</h2>
          <p>{anniversaryCampaign.policy}</p>
          <div className="promotion-final-actions">
            <a
              className="promotion-button promotion-button-primary"
              href={anniversaryCampaign.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBookingClick}
            >
              Book Appointment
            </a>
            <Link href="/promotion/terms">View Terms &amp; Conditions</Link>
          </div>
        </div>
      </section>

      <footer className="promotion-footer">
        <div className="promotion-shell promotion-footer-inner">
          <div>
            <strong>MEZZANAIL</strong>
            <span>7th Anniversary Celebration</span>
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
          Book Now
        </a>
        <button
          type="button"
          onClick={handleShareClick}
          aria-label="Share the anniversary campaign via WhatsApp"
        >
          <Share2 size={19} aria-hidden="true" />
          Share
        </button>
      </nav>
    </main>
  );
}
