const CACHE_NAME = "looke-v1";
const urlsToCache = [
  "/app/",
  "/app/index.html",
  "/app/style.css",
  "/app/script.js"
];

// Instalación del service worker y cacheo de archivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar peticiones y responder desde el cache si existe
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
