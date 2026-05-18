/* =====================================================
   MoveTech — Service Worker
   Caché de app shell + estrategia network-first
===================================================== */

const CACHE_NAME = 'movetech-v1.8.0';
const APP_SHELL = [
  './',
  './index.html',
  './app.html',
  './styles.css',
  './pwa.css',
  './app.js',
  './pwa.js',
  './firebase-config.js',
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

  // Para navegación: network-first, fallback al cacheado (modo offline).
  // Si la URL pide app.html, fallback a app.html; si no, fallback a index.html.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() => {
          const url = new URL(req.url);
          const isApp = url.pathname.endsWith('app.html');
          return caches.match(isApp ? './app.html' : './index.html')
            .then(r => r || caches.match('./index.html'));
        })
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

/* ---------------- Push event (FCM / Web Push) ---------------- */
self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { notification: { title: 'MoveTech', body: event.data ? event.data.text() : '' } };
  }
  const n = payload.notification || payload;
  const title = n.title || 'MoveTech';
  const options = {
    body: n.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [120, 60, 120],
    tag: (payload.data && payload.data.tag) || 'movetech',
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Abrir app' },
      { action: 'close', title: 'Cerrar' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

/* ---------------- Click en notificación ---------------- */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'close') return;

  const targetUrl = (event.notification.data && event.notification.data.url) || './app.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Si hay una ventana abierta, enfocarla
      for (const client of list) {
        if (client.url.includes('app.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
