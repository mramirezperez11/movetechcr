/* =====================================================
   MoveTech — firebase-messaging-sw.js
   Service Worker dedicado a Firebase Cloud Messaging (FCM)
   para manejar push notifications en segundo plano.
   Convive con service-worker.js (scope distinto).
===================================================== */

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyDIGE9PHat8q1DcyREkf-wHpxbD_YyRt_o",
  authDomain:        "movetech-1b2c3.firebaseapp.com",
  projectId:         "movetech-1b2c3",
  storageBucket:     "movetech-1b2c3.firebasestorage.app",
  messagingSenderId: "661371664254",
  appId:             "1:661371664254:web:592395df5762aabd57e52f"
});

const messaging = firebase.messaging();

// Mensajes en segundo plano (app cerrada o sin foco)
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  const title = n.title || 'MoveTech';
  const options = {
    body: n.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [120, 60, 120],
    tag: 'movetech-fcm',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

// Click en notificación: abrir / enfocar la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './app.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('app.html') && 'focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
