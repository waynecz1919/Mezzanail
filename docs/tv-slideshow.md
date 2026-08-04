# Mezzanail TV Display

The fixed in-store display route is `/slideshow`. `/tv-slide` remains available as the standalone full-canvas player.

## Display modes

- `/slideshow?tv=1` attempts fullscreen, hides all controls, disables selection and the context menu, and keeps looping.
- `/slideshow?preview=1` shows previous, pause/play, next, slide/time status, fullscreen, and content reload controls over the embedded player.
- Keyboard: `F` fullscreen, `Space` pause/play, arrows previous/next, `R` reload content. Double-click also toggles fullscreen.

## Content updates

The bundled source is `public/data/slideshow.json`. Slides are sorted by `displayOrder`, require `enabled: true`, and use inclusive Malaysia-time `startDate`/`endDate` scheduling. A failed configured image removes only its slide from the current loop. The fixed display adds the presentation-only anniversary artwork from `config/slideshow-display.ts` without changing the managed source schema.

For a future admin or Cloudflare source, set `NEXT_PUBLIC_SLIDESHOW_DATA_URL` to a CORS-enabled JSON endpoint using the same schema. The client keeps the bundled JSON, the last successful local copy, and the service-worker cache as fallbacks.

Legacy QR slides, the QR closing slide, and the RM199/RM399/RM599 membership comparison slide were removed on 2026-08-04. The removal inventory is recorded in `docs/tv-slideshow-cleanup-2026-08-04.md`. The fixed right-side Member Center QR is separate from the managed slide data and remains enabled.

## Media

Run `pnpm assets:tv` after replacing source artwork. It creates the TV WebP and AVIF assets in `public/tv` while preserving the original files as fallbacks. Keep the nail design near the configured `imagePosition` so 16:9 cover cropping does not remove the subject.

The service worker pre-caches the TV shell, configuration, Next.js runtime assets, and configured artwork. It refreshes successful responses in the background and continues using the most recent cache during an outage.
