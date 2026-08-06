# Mezzanail Display Routes

This repository currently ships two independent display pages. `/slideshow` does
not redirect to `/tv-slide`, and `/tv-slide` does not redirect to `/slideshow`.

- `/slideshow` renders the independent `MezzanailSlideshow` experience from
  `app/slideshow/page.tsx`, using `config/slideshow-display.ts` and the assets in
  `public/slideshow`.
- `/tv-slide` renders the configurable TV display from `app/tv-slide/page.tsx`,
  using `public/data/slideshow.json`, `components/tv/tv-slideshow.tsx`, and the
  generated assets in `public/tv`.

Both routes are display-only and excluded from search indexing. Their page
metadata sets `robots.index` to `false`, and `next.config.ts` supplies the
`X-Robots-Tag: noindex, nofollow, noarchive` header for each route.

## TV Slide display modes

- `/tv-slide?tv=1` attempts fullscreen, hides all controls, disables selection and the context menu, and keeps looping.
- `/tv-slide?preview=1` shows previous, pause/play, next, slide/time status, fullscreen, and content reload controls.
- Keyboard: `F` fullscreen, `Space` pause/play, arrows previous/next, `R` reload content. Double-click also toggles fullscreen.

## TV Slide content updates

The bundled source is `public/data/slideshow.json`. Slides are sorted by `displayOrder`, require `enabled: true`, and use inclusive Malaysia-time `startDate`/`endDate` scheduling. A failed configured image removes only its slide from the current loop.

For a future admin or Cloudflare source, set `NEXT_PUBLIC_SLIDESHOW_DATA_URL` to a CORS-enabled JSON endpoint using the same schema. The client keeps the bundled JSON, the last successful local copy, and the service-worker cache as fallbacks.

`nstudio.mezzanail.com` did not resolve when this display was prepared, so the Nail Gallery slide currently uses the official Instagram URL from the JSON. Change that slide's `qrUrl` to the intended gallery URL when the gallery is live; no component change is needed.

## Slideshow content

The independent `/slideshow` page reads its display content from
`config/slideshow-display.ts` and its artwork from `public/slideshow`. It does
not use the TV Slide JSON schema or service worker.

## TV Slide media

Run `pnpm assets:tv` after replacing source artwork. It creates the TV WebP and AVIF assets in `public/tv` while preserving the original files as fallbacks. Keep the nail design near the configured `imagePosition` so 16:9 cover cropping does not remove the subject.

The service worker pre-caches the TV shell, configuration, Next.js runtime assets, and configured artwork. It refreshes successful responses in the background and continues using the most recent cache during an outage.
