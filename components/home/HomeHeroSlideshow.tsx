"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HomepageHeroImage } from "@/config/homepage";
import type { Locale } from "@/lib/i18n";
import styles from "./HomeHero.module.css";

type Props = {
  images: readonly HomepageHeroImage[];
  locale: Locale;
};

export function HomeHeroSlideshow({ images, locale }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readyForLazySlides, setReadyForLazySlides] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const loadLater = () => setReadyForLazySlides(true);
    if (document.readyState === "complete") {
      const id = window.setTimeout(loadLater, 0);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", loadLater, { once: true });
    return () => window.removeEventListener("load", loadLater);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || images.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [images.length, paused, reducedMotion]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const pause = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setPaused(true);
  };

  const resumeAfterIdle = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 5000);
  };

  const jumpTo = (index: number) => {
    setActiveIndex(index);
    pause();
    resumeAfterIdle();
  };

  if (!images.length) return null;

  const visibleImages = reducedMotion || !readyForLazySlides ? images.slice(0, 1) : images;

  return (
    <div
      ref={regionRef}
      className={styles.slideshow}
      role="region"
      aria-label="Mezzanail nail work"
      onMouseEnter={pause}
      onMouseLeave={resumeAfterIdle}
      onTouchStart={() => {
        pause();
        resumeAfterIdle();
      }}
      onFocusCapture={pause}
      onBlurCapture={(event) => {
        if (!regionRef.current?.contains(event.relatedTarget as Node | null)) {
          resumeAfterIdle();
        }
      }}
    >
      <div className={styles.slides}>
        {visibleImages.map((image, index) => {
          const active = reducedMotion ? index === 0 : index === activeIndex;
          return (
            <div
              key={image.src}
              className={active ? styles.slideActive : styles.slide}
              aria-hidden={!active}
            >
              <Image
                src={image.src}
                alt={image.alt[locale]}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                sizes="(max-width: 430px) 100vw, (max-width: 900px) 520px, 560px"
                className={styles.image}
                style={{ objectPosition: image.objectPosition ?? "60% 70%" }}
              />
            </div>
          );
        })}
        <div className={styles.topGradient} aria-hidden="true" />
      </div>

      {!reducedMotion && images.length > 1 ? (
        <div className={styles.dots} aria-label="Choose nail work slide">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={index === activeIndex ? styles.dotActive : styles.dotButton}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => jumpTo(index)}
            >
              <span className={styles.dot} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
