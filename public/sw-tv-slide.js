const CACHE_PREFIX = "mezzanail-tv-display";
const CACHE_NAME = `${CACHE_PREFIX}-2026-08-04-v1`;
const TV_ROUTE = "/tv-slide";
const CONFIG_ROUTE = "/data/slideshow.json";
const CORE_ASSETS = [
  TV_ROUTE,
  CONFIG_ROUTE,
  "/brand/mezzanail-nail-studio-wordmark.png",
  "/brand/mezzanail-nail-studio-logo.jpg",
];

async function cacheResponse(cache, request, response) {
  if (response && response.ok) await cache.put(request, response.clone());
  return response;
}

function collectConfigAssets(value, output = new Set()) {
  if (typeof value === "string" && /^\/.+\.(?:avif|webp|png|jpe?g|svg)$/i.test(value)) {
    output.add(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectConfigAssets(item, output);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectConfigAssets(item, output);
  }
  return [...output];
}

async function fetchAndCache(cache, request) {
  try {
    const response = await fetch(request);
    return await cacheResponse(cache, request, response);
  } catch {
    return undefined;
  }
}

async function precacheShell() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(CORE_ASSETS.map((asset) => fetchAndCache(cache, asset)));

  const html = await cache.match(TV_ROUTE);
  if (html) {
    const markup = await html.clone().text();
    const nextAssets = [...markup.matchAll(/(?:src|href)="([^"?]+\/_next\/static\/[^"?]+)"/g)]
      .map((match) => match[1]);
    await Promise.allSettled(nextAssets.map((asset) => fetchAndCache(cache, asset)));
  }

  const configResponse = await cache.match(CONFIG_ROUTE);
  if (configResponse) {
    try {
      const config = await configResponse.clone().json();
      const assets = collectConfigAssets(config);
      await Promise.allSettled(assets.map((asset) => fetchAndCache(cache, asset)));
    } catch {
      // The app retains its bundled and local-storage configuration fallbacks.
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, fallbackRequest = request) {
  const cache = await caches.open(CACHE_NAME);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeout);
    return await cacheResponse(cache, request, response);
  } catch {
    clearTimeout(timeout);
    return (await cache.match(request)) || (await cache.match(fallbackRequest));
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  return fetchAndCache(cache, request);
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => cacheResponse(cache, request, response))
    .catch(() => undefined);
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate" && (url.pathname === TV_ROUTE || url.pathname === "/slideshow")) {
    event.respondWith(networkFirst(request, TV_ROUTE));
    return;
  }

  if (url.pathname === CONFIG_ROUTE || url.pathname.endsWith("/slideshow.json")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.destination === "image" || /\.(?:avif|webp|png|jpe?g|svg)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.origin === self.location.origin && (url.pathname.startsWith("/_next/static/") || request.destination === "style" || request.destination === "script" || request.destination === "font")) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "TV_SLIDESHOW_PREFETCH" || !Array.isArray(event.data.urls)) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(event.data.urls.map((url) => fetchAndCache(cache, url)));
  })());
});
