export type TVSlideType =
  | "brand"
  | "artwork"
  | "membership"
  | "campaign"
  | "services"
  | "qr"
  | "closing"
  | "video";

export type TVMedia = {
  image: string;
  imageAvif?: string | null;
  fallbackImage?: string | null;
  imagePosition?: string | null;
};

export type TVService = TVMedia & {
  name: string;
  description: string;
};

export type TVSlide = {
  id: string;
  type: TVSlideType;
  title: string;
  subtitle: string;
  image: string | null;
  mobileImage: string | null;
  imageAvif?: string | null;
  fallbackImage?: string | null;
  imagePosition?: string | null;
  captionPosition?: "left" | "right" | null;
  video?: string | null;
  duration: number;
  enabled: boolean;
  startDate: string | null;
  endDate: string | null;
  displayOrder: number;
  qrUrl: string | null;
  designCode: string | null;
  category: string | null;
  qrLabel?: string | null;
  intendedQrUrl?: string | null;
  plans?: string[];
  benefits?: string[];
  highlights?: string[];
  services?: TVService[];
};

export type TVSlideshowConfig = {
  version: string;
  updatedAt: string;
  settings: {
    projectName: string;
    defaultDuration: number;
    artworkDuration: number;
    transitionDuration: number;
    galleryTargetUrl?: string;
    galleryFallbackUrl?: string;
  };
  slides: TVSlide[];
};

export const TV_SLIDESHOW_STORAGE_KEY = "mezzanail-tv-slideshow-config-v1";

function parseBoundary(value: string | null, endOfDay: boolean) {
  if (!value) return null;
  const malaysiaDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+08:00`
    : value;
  const timestamp = Date.parse(malaysiaDate);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function isSlideScheduled(slide: TVSlide, now = new Date()) {
  const timestamp = now.getTime();
  const startsAt = parseBoundary(slide.startDate, false);
  const endsAt = parseBoundary(slide.endDate, true);
  return (startsAt === null || timestamp >= startsAt) && (endsAt === null || timestamp <= endsAt);
}

export function getDisplaySlides(
  config: TVSlideshowConfig,
  failedSlideIds: ReadonlySet<string> = new Set(),
  now = new Date(),
) {
  return [...config.slides]
    .filter((slide) => slide.enabled && !failedSlideIds.has(slide.id) && isSlideScheduled(slide, now))
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

export function isSlideshowConfig(value: unknown): value is TVSlideshowConfig {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TVSlideshowConfig>;
  return (
    typeof candidate.version === "string" &&
    Boolean(candidate.settings) &&
    Array.isArray(candidate.slides) &&
    candidate.slides.every(
      (slide) =>
        Boolean(slide) &&
        typeof slide.id === "string" &&
        typeof slide.type === "string" &&
        typeof slide.title === "string" &&
        typeof slide.duration === "number" &&
        typeof slide.enabled === "boolean" &&
        typeof slide.displayOrder === "number",
    )
  );
}

export function collectSlideshowAssets(config: TVSlideshowConfig) {
  const assets = new Set<string>();
  const add = (value?: string | null) => {
    if (value) assets.add(value);
  };

  for (const slide of config.slides) {
    add(slide.image);
    add(slide.mobileImage);
    add(slide.imageAvif);
    add(slide.fallbackImage);
    for (const service of slide.services ?? []) {
      add(service.image);
      add(service.imageAvif);
      add(service.fallbackImage);
    }
  }

  return [...assets];
}
