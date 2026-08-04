# Mezzanail TV Display

The production route is `/tv-slide`. `/slideshow` is a permanent redirect for compatibility.

## Display modes

- `/tv-slide?tv=1` attempts fullscreen, hides all controls, disables selection and the context menu, and keeps looping.
- `/tv-slide?preview=1` shows previous, pause/play, next, slide/time status, fullscreen, and content reload controls.
- Keyboard: `F` fullscreen, `Space` pause/play, arrows previous/next, `R` reload content. Double-click also toggles fullscreen.

## Content updates

The bundled source is `public/data/slideshow.json`. Slides are sorted by `displayOrder`, require `enabled: true`, and use inclusive Malaysia-time `startDate`/`endDate` scheduling. A failed configured image removes only its slide from the current loop.

For a future admin or Cloudflare source, set `NEXT_PUBLIC_SLIDESHOW_DATA_URL` to a CORS-enabled JSON endpoint using the same schema. The client keeps the bundled JSON, the last successful local copy, and the service-worker cache as fallbacks.

`nstudio.mezzanail.com` did not resolve when this display was prepared, so the Nail Gallery slide currently uses the official Instagram URL from the JSON. Change that slide's `qrUrl` to the intended gallery URL when the gallery is live; no component change is needed.

## Media

Run `pnpm assets:tv` after replacing source artwork. It creates the TV WebP and AVIF assets in `public/tv` while preserving the original files as fallbacks. Keep the nail design near the configured `imagePosition` so 16:9 cover cropping does not remove the subject.

The service worker pre-caches the TV shell, configuration, Next.js runtime assets, and configured artwork. It refreshes successful responses in the background and continues using the most recent cache during an outage.
