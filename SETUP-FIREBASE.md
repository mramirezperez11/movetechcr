# SETUP de Firebase para MoveTech

Esta guía explica cómo activar **sincronización en la nube** y **push notifications reales** en MoveTech. Sin este setup la app funciona perfecto con localStorage; estas dos features quedan inactivas pero el resto opera normal.

Tiempo estimado: **8-12 minutos**. Costo: **gratis** dentro del plan Spark de Firebase.

---

## Paso 1 — Crear cuenta y proyecto Firebase

1. Andá a [console.firebase.google.com](https://console.firebase.google.com) y entrá con tu cuenta de Google.
2. Clic en **"Crear un proyecto"** (o "Add project").
3. Nombre del proyecto: `movetech` (o el que prefieras).
4. **Desactivar** Google Analytics para este proyecto (no lo necesitamos).
5. Clic en **"Crear proyecto"** y esperar.

---

## Paso 2 — Registrar la web app

1. En el dashboard del proyecto, clic en el ícono `</>` (Web).
2. Apodo de la app: `MoveTech Web`.
3. **NO marqués** "Configurar Firebase Hosting" (usamos GitHub Pages).
4. Clic en **"Registrar app"**.
5. Te aparecerá un bloque de código con un objeto `firebaseConfig` así:

```js
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXX",
  authDomain: "movetech-xxx.firebaseapp.com",
  projectId: "movetech-xxx",
  storageBucket: "movetech-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. **Copiá esos valores** — los vas a pegar en `firebase-config.js` en el Paso 6.

---

## Paso 3 — Activar Authentication (anónima)

1. Menú lateral → **"Build" → "Authentication"** → **"Get started"**.
2. Pestaña **"Sign-in method"**.
3. Buscá **"Anonymous"** en la lista → habilitá el toggle → **"Save"**.

Esto permite que cada usuario tenga un UID único sin tener que crear cuenta.

---

## Paso 4 — Crear base de datos Firestore

1. Menú lateral → **"Build" → "Firestore Database"** → **"Create database"**.
2. Modo: **"Start in test mode"** (más fácil para prototipos).
3. Ubicación: elegí **`southamerica-east1`** o **`us-central1`** → **Enable**.

Las reglas en modo test permiten lectura/escritura por 30 días. Después podés ajustarlas.

---

## Paso 5 — Activar Cloud Messaging y obtener VAPID key

1. Clic en el ⚙️ (arriba a la izquierda) → **"Project settings"**.
2. Pestaña **"Cloud Messaging"**.
3. Bajá hasta **"Web Push certificates"**.
4. Clic en **"Generate key pair"**.
5. Te genera una clave larga tipo `BPxxxxxxxxxxxx...`. **Copiala** — la vas a pegar en el Paso 6.

---

## Paso 6 — Pegar las credenciales en `firebase-config.js`

Abrí el archivo `firebase-config.js` en VS Code y reemplazá los valores `TU_...` con los valores reales:

```js
window.FIREBASE_CONFIG = {
  apiKey:            "AIzaSyXXXXXXXXXX",
  authDomain:        "movetech-xxx.firebaseapp.com",
  projectId:         "movetech-xxx",
  storageBucket:     "movetech-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};

window.FIREBASE_VAPID_KEY = "BPxxxxxxxxxxxx...";
```

Guardá con `Ctrl + S`.

---

## Paso 7 — Probar en local

1. Recargá la app (`Ctrl + Shift + R` en el navegador).
2. Andá a la pestaña **Perfil** → sección **"Nube y sincronización"**.
3. Tocá **"Activar"** junto a Sincronización → debería decir *"Sincronizado ✔"*.
4. Tocá **"Activar"** junto a Push notifications → te va a pedir permiso → aceptá.
5. Volvé a Firebase Console → **Firestore Database** → vas a ver una colección `users` con tu UID y otra `tokens` con tu token de push.

---

## Paso 8 — Enviar una push notification de prueba

1. En Firebase Console, menú lateral → **"Messaging"**.
2. **"Create your first campaign"** → **"Notifications"**.
3. Título: `¡Hora de moverte!`. Texto: `Hacé un reto rápido y sumá puntos.`.
4. **"Send test message"** → pegá tu token FCM (lo ves en la consola del navegador: `[FCM] token: BX...`) → **"Test"**.
5. Deberías recibir la notificación en tu dispositivo (Android Chrome o iOS Safari instalada como PWA).

---

## Notas importantes

- **Seguridad**: los valores en `firebase-config.js` son **claves públicas** (la seguridad real está en las reglas de Firestore y Authentication). Está OK subirlas a GitHub.
- **Costo**: el plan Spark (gratis) incluye:
  - 50.000 lecturas, 20.000 escrituras y 20.000 borrados por día en Firestore.
  - Push notifications ilimitadas.
  - Más que suficiente para una demo o competencia.
- **iOS**: las push notifications solo funcionan en iOS 16.4+ y solo si la PWA está instalada en la pantalla de inicio.
- **Sin Firebase**: si dejás los valores como `TU_...`, la app sigue funcionando perfectamente, solo no se sincroniza ni manda push reales.

---

## Reglas de Firestore más seguras (opcional, después de probar)

Cuando termine el modo test, podés poner estas reglas más restrictivas en Firestore → **Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /tokens/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Esto garantiza que cada usuario solo puede leer y escribir sus propios datos.

---

## Listo
Con esto tenés MoveTech con backend real, sincronización entre dispositivos y push notifications reales — todo gratis.
