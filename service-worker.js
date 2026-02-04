const CACHE_NAME = "looke-v2.2";
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

// Activación: AQUÍ BORRAMOS LA CACHÉ VIEJA (v1)
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Borrando caché antigua: " + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Reclama el control de los clientes inmediatamente
  return self.clients.claim();
});

// Interceptar peticiones y responder desde el cache si existe
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
