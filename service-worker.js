/* =====================================================
   MoveTech — Service Worker
   Caché de app shell + estrategia network-first
===================================================== */

const CACHE_NAME = 'movetech-v1.0.0';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

/* ---------------- Install: precache app shell ---------------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cacheamos uno por uno para que un 404 no rompa todo el SW
      return Promise.all(
        APP_SHELL.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] no se pudo cachear:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

/* ---------------- Activate: limpia cachés viejos ---------------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ---------------- Fetch: network-first con fallback a caché ---------------- */
self.addEventListener('fetch', event => {
  const req = event.request;

  // Solo GET
  if (req.method !== 'GET') return;

  // Para navegación: network-first, fallback al index cacheado (modo offline)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Para assets: cache-first, fallback a red
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // Solo cacheamos respuestas válidas same-origin
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

/* ---------------- Mensaje desde la app (ej. forzar update) ---------------- */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
