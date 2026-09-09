const CACHE_NAME = "cracksvenska-pwa-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png"
];

// Install Event: pre-caches the main app skeleton
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: cleans up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: serves from cache / network depending on strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip POST requests (like API calls) and external API/Gemini queries
  if (request.method !== "GET" || request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // If response is valid, clone and cache it for future offline use
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails (completely offline), try to fetch from cache
        console.log("[Service Worker] Offline mode: fetching from cache", request.url);
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to index.html for navigation requests (Single Page App routing support)
          if (request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});
