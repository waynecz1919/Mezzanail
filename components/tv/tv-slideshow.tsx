/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties, SyntheticEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Minimize,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react";
import QRCode from "qrcode";
import {
  collectSlideshowAssets,
  getDisplaySlides,
  isSlideshowConfig,
  TV_SLIDESHOW_STORAGE_KEY,
  type TVMedia,
  type TVService,
  type TVSlide,
  type TVSlideshowConfig,
} from "@/lib/tv-slideshow";
import styles from "./tv-slideshow.module.css";

type SlideshowProps = {
  initialConfig: TVSlideshowConfig;
  dataUrl: string;
  previewMode: boolean;
  tvMode: boolean;
  additionalSlides?: readonly TVSlide[];
  embedded?: boolean;
};

type PictureProps = {
  media: TVMedia;
  alt: string;
  className?: string;
  eager?: boolean;
  onFailure: () => void;
};

function TVPicture({ media, alt, className = "", eager = false, onFailure }: PictureProps) {
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const fallback = media.fallbackImage;
    if (fallback && image.dataset.fallback !== "true") {
      image.dataset.fallback = "true";
      image.parentElement?.querySelectorAll("source").forEach((source) => source.remove());
      image.src = fallback;
      return;
    }
    onFailure();
  };

  return (
    <picture className={`${styles.picture} ${className}`}>
      {media.imageAvif ? <source srcSet={media.imageAvif} type="image/avif" /> : null}
      <source srcSet={media.image} type="image/webp" />
      <img
        src={media.fallbackImage ?? media.image}
        alt={alt}
        draggable={false}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        style={{ objectPosition: media.imagePosition ?? "50% 50%" }}
        onError={handleError}
      />
    </picture>
  );
}

function TVQrCode({ value, label, compact = false, onFailure }: { value: string; label?: string | null; compact?: boolean; onFailure: () => void }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(value, {
      width: compact ? 520 : 760,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#42131fff", light: "#fffaf7ff" },
    })
      .then((result) => {
        if (active) setDataUrl(result);
      })
      .catch(() => {
        if (active) onFailure();
      });
    return () => {
      active = false;
    };
  }, [compact, onFailure, value]);

  return (
    <div className={`${styles.qrCard} ${compact ? styles.qrCardCompact : ""}`}>
      {dataUrl ? <img src={dataUrl} alt="QR code" draggable={false} /> : <div className={styles.qrLoading} />}
      {label ? <span>{label}</span> : null}
    </div>
  );
}

function ArtworkSlide({ slide, onFailure }: { slide: TVSlide; onFailure: () => void }) {
  if (!slide.image) return null;
  return (
    <div className={styles.artworkSlide}>
      <TVPicture
        media={slide as TVMedia}
        alt={`${slide.title} — ${slide.category ?? "Mezzanail nail art"}`}
        className={styles.artworkMedia}
        eager
        onFailure={onFailure}
      />
      <div className={styles.artworkShade} />
      <div className={`${styles.artworkCaption} ${slide.captionPosition === "right" ? styles.captionRight : styles.captionLeft}`}>
        <div className={styles.artworkMeta}>
          {slide.designCode ? <span>{slide.designCode}</span> : null}
          {slide.category ? <span>{slide.category}</span> : null}
        </div>
        <h2>{slide.title}</h2>
        <p>{slide.subtitle}</p>
      </div>
    </div>
  );
}

function BrandSlide({ slide, closing = false, onFailure }: { slide: TVSlide; closing?: boolean; onFailure: () => void }) {
  if (!slide.image) return null;
  if (closing) {
    return (
      <div className={`${styles.brandSlide} ${styles.closingSlide}`}>
        <div className={styles.brandAura} />
        <div className={styles.closingCopy}>
          <TVPicture media={slide as TVMedia} alt="Mezzanail Nail Studio" className={styles.brandLogo} eager onFailure={onFailure} />
          <p className={styles.kicker}>{slide.subtitle}</p>
          <h2>{slide.title}</h2>
          <span className={styles.goldRule} />
        </div>
        {slide.qrUrl ? <TVQrCode value={slide.qrUrl} label={slide.qrLabel} compact onFailure={onFailure} /> : null}
      </div>
    );
  }

  return (
    <div className={styles.brandSlide}>
      <div className={styles.brandAura} />
      <div className={styles.brandFrame} />
      <TVPicture media={slide as TVMedia} alt="Mezzanail Nail Studio" className={styles.brandLogo} eager onFailure={onFailure} />
      <p className={styles.kicker}>{slide.subtitle}</p>
      <h1>{slide.title}</h1>
      <span className={styles.goldRule} />
    </div>
  );
}

function MembershipSlide({ slide }: { slide: TVSlide }) {
  return (
    <div className={styles.membershipSlide}>
      <div className={styles.membershipBloom} />
      <div className={styles.membershipHeading}>
        <p className={styles.kicker}>Mezzanail Membership</p>
        <h2>{slide.title}</h2>
        <p>{slide.subtitle}</p>
      </div>
      <div className={styles.planGrid}>
        {(slide.plans ?? []).map((plan, index) => (
          <div className={styles.planCard} key={plan}>
            <span>0{index + 1}</span>
            <strong>{plan}</strong>
            <small>Membership</small>
          </div>
        ))}
      </div>
      <div className={styles.benefitRow}>
        {(slide.benefits ?? []).map((benefit) => <span key={benefit}>{benefit}</span>)}
      </div>
    </div>
  );
}

function CampaignSlide({ slide, onFailure }: { slide: TVSlide; onFailure: () => void }) {
  if (!slide.image) return null;
  return (
    <div className={styles.campaignSlide}>
      <TVPicture media={slide as TVMedia} alt="Mezzanail 7th Anniversary Lucky Draw" className={styles.campaignMedia} eager onFailure={onFailure} />
      <div className={styles.campaignVeil} />
      <div className={styles.campaignCopy}>
        <p className={styles.kicker}>Celebrating 7 Beautiful Years</p>
        <h2>{slide.title}</h2>
        <p>{slide.subtitle}</p>
        <div className={styles.campaignHighlights}>
          {(slide.highlights ?? []).map((highlight, index) => (
            <div key={highlight}><span>0{index + 1}</span><strong>{highlight}</strong></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesSlide({ slide, serviceIndex, onFailure }: { slide: TVSlide; serviceIndex: number; onFailure: () => void }) {
  const services = slide.services ?? [];
  const service = services[serviceIndex % Math.max(services.length, 1)] as TVService | undefined;
  if (!service) return null;

  return (
    <div className={styles.servicesSlide}>
      <div className={styles.serviceMediaWrap} key={`${slide.id}-${service.name}`}>
        <TVPicture media={service} alt={service.name} className={styles.serviceMedia} eager onFailure={onFailure} />
      </div>
      <div className={styles.serviceCopy} key={`${service.name}-copy`}>
        <p className={styles.kicker}>{slide.title}</p>
        <span className={styles.serviceNumber}>{String(serviceIndex + 1).padStart(2, "0")}</span>
        <h2>{service.name}</h2>
        <p>{service.description}</p>
        <div className={styles.serviceDots} aria-hidden="true">
          {services.map((item, index) => <span key={item.name} className={index === serviceIndex ? styles.serviceDotActive : ""} />)}
        </div>
      </div>
    </div>
  );
}

function QrSlide({ slide, onFailure }: { slide: TVSlide; onFailure: () => void }) {
  if (!slide.qrUrl) return null;
  return (
    <div className={styles.qrSlide}>
      <div className={styles.qrOrnament} />
      <div className={styles.qrCopy}>
        <p className={styles.kicker}>{slide.category}</p>
        <h2>{slide.title}</h2>
        <p>{slide.subtitle}</p>
        <span className={styles.scanPrompt}>Scan with your phone camera</span>
      </div>
      <TVQrCode value={slide.qrUrl} label={slide.qrLabel} onFailure={onFailure} />
    </div>
  );
}

function VideoSlide({ slide, onFailure }: { slide: TVSlide; onFailure: () => void }) {
  if (!slide.video) return null;
  return (
    <div className={styles.videoSlide}>
      <video
        src={slide.video}
        poster={slide.image ?? undefined}
        muted
        playsInline
        autoPlay
        loop
        onError={onFailure}
      />
      <div className={styles.videoCopy}><h2>{slide.title}</h2><p>{slide.subtitle}</p></div>
    </div>
  );
}

function SlideContent({ slide, serviceIndex, onFailure }: { slide: TVSlide; serviceIndex: number; onFailure: () => void }) {
  switch (slide.type) {
    case "brand": return <BrandSlide slide={slide} onFailure={onFailure} />;
    case "artwork": return <ArtworkSlide slide={slide} onFailure={onFailure} />;
    case "membership": return <MembershipSlide slide={slide} />;
    case "campaign": return <CampaignSlide slide={slide} onFailure={onFailure} />;
    case "services": return <ServicesSlide slide={slide} serviceIndex={serviceIndex} onFailure={onFailure} />;
    case "qr": return <QrSlide slide={slide} onFailure={onFailure} />;
    case "closing": return <BrandSlide slide={slide} closing onFailure={onFailure} />;
    case "video": return <VideoSlide slide={slide} onFailure={onFailure} />;
    default: return null;
  }
}

function formatTime(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function preloadMedia(media: Pick<TVMedia, "image" | "fallbackImage">, onFailure?: () => void) {
  if (typeof window === "undefined" || !media.image) return;
  const image = new window.Image();
  image.decoding = "async";
  image.src = media.image;
  image.onerror = () => {
    if (!media.fallbackImage) {
      onFailure?.();
      return;
    }
    const fallback = new window.Image();
    fallback.src = media.fallbackImage;
    fallback.onerror = () => onFailure?.();
  };
}

function mergeAdditionalSlides(config: TVSlideshowConfig, additionalSlides: readonly TVSlide[]) {
  if (!additionalSlides.length) return config;
  const configuredIds = new Set(config.slides.map((slide) => slide.id));
  const presentationSlides = additionalSlides.filter((slide) => !configuredIds.has(slide.id));
  if (!presentationSlides.length) return config;
  return { ...config, slides: [...config.slides, ...presentationSlides] };
}

export function TVSlideshow({
  initialConfig,
  dataUrl,
  previewMode,
  tvMode,
  additionalSlides = [],
  embedded = false,
}: SlideshowProps) {
  const mergedInitialConfig = useMemo(
    () => mergeAdditionalSlides(initialConfig, additionalSlides),
    [additionalSlides, initialConfig],
  );
  const [config, setConfig] = useState(mergedInitialConfig);
  const [failedSlides, setFailedSlides] = useState<Set<string>>(() => new Set());
  const [scheduleNow, setScheduleNow] = useState(() => new Date());
  const slides = useMemo(
    () => getDisplaySlides(config, failedSlides, scheduleNow),
    [config, failedSlides, scheduleNow],
  );
  const [currentId, setCurrentId] = useState(() => getDisplaySlides(mergedInitialConfig)[0]?.id ?? "");
  const [previousSlide, setPreviousSlide] = useState<TVSlide | null>(null);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const elapsedRef = useRef(0);
  const startedAtRef = useRef(0);
  const transitionTimerRef = useRef<number | null>(null);

  const matchedIndex = slides.findIndex((slide) => slide.id === currentId);
  const currentIndex = Math.max(0, matchedIndex);
  const currentSlide = slides[currentIndex];

  const markSlideFailed = useCallback((id: string) => {
    setFailedSlides((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }, []);

  const resetClock = useCallback(() => {
    elapsedRef.current = 0;
    startedAtRef.current = typeof performance === "undefined" ? 0 : performance.now();
    setElapsed(0);
  }, []);

  const handleCurrentSlideFailure = useCallback((failedId: string) => {
    const failedIndex = slides.findIndex((slide) => slide.id === failedId);
    const nextSlide = slides.length > 1
      ? slides[(Math.max(0, failedIndex) + 1) % slides.length]
      : undefined;
    setPreviousSlide(null);
    setCurrentId(nextSlide?.id ?? "");
    setServiceIndex(0);
    resetClock();
    markSlideFailed(failedId);
  }, [markSlideFailed, resetClock, slides]);

  const goToIndex = useCallback((targetIndex: number) => {
    if (!slides.length) return;
    const safeIndex = ((targetIndex % slides.length) + slides.length) % slides.length;
    const next = slides[safeIndex];
    if (!next || next.id === currentSlide?.id) return;
    setPreviousSlide(currentSlide ?? null);
    setCurrentId(next.id);
    setServiceIndex(0);
    resetClock();
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(
      () => setPreviousSlide(null),
      config.settings.transitionDuration + 120,
    );
  }, [config.settings.transitionDuration, currentSlide, resetClock, slides]);

  const goNext = useCallback(() => goToIndex(currentIndex + 1), [currentIndex, goToIndex]);
  const goPrevious = useCallback(() => goToIndex(currentIndex - 1), [currentIndex, goToIndex]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen can require a user gesture; TV mode retries on the first pointer action.
    }
  }, []);

  const refreshContent = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch(dataUrl, { cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("SLIDESHOW_DATA_UNAVAILABLE");
      const candidate: unknown = await response.json();
      if (!isSlideshowConfig(candidate)) throw new Error("SLIDESHOW_DATA_INVALID");
      const mergedCandidate = mergeAdditionalSlides(candidate, additionalSlides);
      setConfig(mergedCandidate);
      setFailedSlides(new Set());
      window.localStorage.setItem(TV_SLIDESHOW_STORAGE_KEY, JSON.stringify(candidate));
      navigator.serviceWorker?.controller?.postMessage({
        type: "TV_SLIDESHOW_PREFETCH",
        urls: collectSlideshowAssets(mergedCandidate),
      });
    } catch {
      const stored = window.localStorage.getItem(TV_SLIDESHOW_STORAGE_KEY);
      if (stored) {
        try {
          const candidate: unknown = JSON.parse(stored);
          if (isSlideshowConfig(candidate)) setConfig(mergeAdditionalSlides(candidate, additionalSlides));
        } catch {
          // The server-rendered configuration remains the safe final fallback.
        }
      }
    } finally {
      setRefreshing(false);
    }
  }, [additionalSlides, dataUrl]);

  useEffect(() => {
    document.documentElement.classList.add("tv-display-active");
    document.body.classList.add("tv-display-active");
    return () => {
      document.documentElement.classList.remove("tv-display-active");
      document.body.classList.remove("tv-display-active");
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw-tv-slide.js", { scope: "/" }).then((registration) => registration.update()).catch(() => undefined);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshContent(), 0);
    return () => window.clearTimeout(timer);
  }, [refreshContent]);

  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 15).getTime();
    const midnightTimer = window.setTimeout(() => {
      setScheduleNow(new Date());
      void refreshContent();
    }, Math.max(1000, nextMidnight - now.getTime()));
    const dailyTimer = window.setInterval(() => {
      setScheduleNow(new Date());
      void refreshContent();
    }, oneDay);
    const scheduleTimer = window.setInterval(() => setScheduleNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(midnightTimer);
      window.clearInterval(dailyTimer);
      window.clearInterval(scheduleTimer);
    };
  }, [refreshContent]);

  useEffect(() => {
    if (matchedIndex >= 0) return;
    if (slides[0]) {
      const timer = window.setTimeout(() => {
        setCurrentId(slides[0].id);
        setPreviousSlide(null);
        resetClock();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [matchedIndex, resetClock, slides]);

  useEffect(() => {
    if (!currentSlide || paused || !visible) return;
    if (startedAtRef.current === 0) startedAtRef.current = performance.now();
    startedAtRef.current = performance.now() - elapsedRef.current;
    let frame = 0;
    let lastPaint = 0;
    const tick = (now: number) => {
      const nextElapsed = now - startedAtRef.current;
      elapsedRef.current = nextElapsed;
      if (now - lastPaint > 180) {
        setElapsed(nextElapsed);
        lastPaint = now;
      }
      if (nextElapsed >= currentSlide.duration) {
        goNext();
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [currentSlide, goNext, paused, visible]);

  useEffect(() => {
    if (currentSlide?.type !== "services" || paused || !visible) return;
    const services = currentSlide.services ?? [];
    if (services.length < 2) return;
    const interval = Math.max(2500, Math.floor(currentSlide.duration / services.length));
    const timer = window.setInterval(
      () => setServiceIndex((index) => (index + 1) % services.length),
      interval,
    );
    return () => window.clearInterval(timer);
  }, [currentSlide, paused, visible]);

  useEffect(() => {
    if (!slides.length || !currentSlide) return;
    for (const offset of [1, 2]) {
      const slide = slides[(currentIndex + offset) % slides.length];
      if (slide?.image) preloadMedia(slide as TVMedia, () => markSlideFailed(slide.id));
    }
    if (currentSlide.type === "services") {
      for (const service of currentSlide.services ?? []) preloadMedia(service);
    }
  }, [currentIndex, currentSlide, markSlideFailed, slides]);

  useEffect(() => {
    const onVisibility = () => {
      const pageVisible = document.visibilityState === "visible";
      setVisible(pageVisible);
      if (pageVisible) startedAtRef.current = performance.now() - elapsedRef.current;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    if (!tvMode) return;
    const enterFullscreen = () => {
      if (!document.fullscreenElement) void document.documentElement.requestFullscreen().catch(() => undefined);
    };
    enterFullscreen();
    document.addEventListener("pointerdown", enterFullscreen, { once: true });
    return () => document.removeEventListener("pointerdown", enterFullscreen);
  }, [tvMode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (event.code === "Space") {
        event.preventDefault();
        setPaused((value) => !value);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
      } else if (key === "r") {
        event.preventDefault();
        void refreshContent();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrevious, refreshContent, toggleFullscreen]);

  useEffect(() => () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
  }, []);

  const stageStyle = {
    "--tv-duration": `${Math.max(currentSlide?.duration ?? 10000, 1000)}ms`,
    "--tv-transition": `${Math.max(config.settings.transitionDuration, 500)}ms`,
  } as CSSProperties;

  if (!currentSlide) {
    return (
      <main className={`${styles.stage} ${embedded ? styles.embedded : ""} ${previewMode ? styles.preview : ""} ${tvMode ? styles.tvMode : ""}`}>
        <div className={styles.emptyState}>
          <span>MEZZANAIL</span>
          <h1>Our gallery is taking a quiet moment.</h1>
          <p>Please reconnect to refresh the display.</p>
          {previewMode ? <button type="button" onClick={() => void refreshContent()}><RefreshCw size={20} />Reload content</button> : null}
        </div>
      </main>
    );
  }

  return (
    <main
      className={`${styles.stage} ${embedded ? styles.embedded : ""} ${previewMode ? styles.preview : ""} ${tvMode ? styles.tvMode : ""}`}
      style={stageStyle}
      onDoubleClick={() => void toggleFullscreen()}
      onContextMenu={tvMode ? (event) => event.preventDefault() : undefined}
      data-tv-mode={tvMode ? "1" : "0"}
    >
      {previousSlide ? (
        <div className={`${styles.slideLayer} ${styles.slidePrevious}`} aria-hidden="true">
          <SlideContent slide={previousSlide} serviceIndex={serviceIndex} onFailure={() => markSlideFailed(previousSlide.id)} />
        </div>
      ) : null}
      <div
        className={`${styles.slideLayer} ${styles.slideActive}`}
        key={currentSlide.id}
        data-slide-id={currentSlide.id}
        data-slide-index={currentIndex + 1}
      >
        <SlideContent slide={currentSlide} serviceIndex={serviceIndex} onFailure={() => handleCurrentSlideFailure(currentSlide.id)} />
      </div>

      {paused && !previewMode ? <div className={styles.pausedMark} aria-label="Slideshow paused"><Pause size={22} /></div> : null}

      {previewMode ? (
        <div className={styles.previewControls} onDoubleClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={goPrevious} aria-label="Previous slide"><ChevronLeft size={23} /></button>
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Continue slideshow" : "Pause slideshow"}>
            {paused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
          </button>
          <button type="button" onClick={goNext} aria-label="Next slide"><ChevronRight size={23} /></button>
          <div className={styles.previewStatus}>
            <strong>{String(currentIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</strong>
            <span>{formatTime(elapsed)} / {formatTime(currentSlide.duration)}</span>
            <div><i style={{ width: `${Math.min(100, (elapsed / currentSlide.duration) * 100)}%` }} /></div>
          </div>
          <button type="button" onClick={() => void toggleFullscreen()} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            {isFullscreen ? <Minimize size={20} /> : <Expand size={20} />}
          </button>
          <button type="button" onClick={() => void refreshContent()} aria-label="Reload content" disabled={refreshing}>
            <RefreshCw size={20} className={refreshing ? styles.spinning : ""} />
          </button>
        </div>
      ) : null}
    </main>
  );
}
