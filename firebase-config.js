/* =====================================================
   MoveTech — firebase-config.js
   --------------------------------------------------
   Configuración real del proyecto Firebase de MoveTech
   (proyecto: movetech-1b2c3 · plan Spark · gratis).

   Estas claves son PÚBLICAS por diseño — la seguridad
   real vive en las reglas de Firestore/Auth. Está OK
   subirlas a un repo público.
===================================================== */

window.FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDIGE9PHat8q1DcyREkf-wHpxbD_YyRt_o",
  authDomain:        "movetech-1b2c3.firebaseapp.com",
  projectId:         "movetech-1b2c3",
  storageBucket:     "movetech-1b2c3.firebasestorage.app",
  messagingSenderId: "661371664254",
  appId:             "1:661371664254:web:592395df5762aabd57e52f"
};

// VAPID key para Push Notifications (Web Push certificates)
window.FIREBASE_VAPID_KEY = "BCdF8lPkzQSErSNIIetf2GCFUJY2DctxgwzFnflWOoyFUNTLwrVnKkbV8MfaMbpoGcGprD0yTKYJRfuuHSYBCSQ";

// Helper: ¿está configurado?
window.FIREBASE_ENABLED = (function () {
  const c = window.FIREBASE_CONFIG;
  return c && c.apiKey && !c.apiKey.startsWith("TU_") && c.projectId && !c.projectId.startsWith("TU_");
})();
