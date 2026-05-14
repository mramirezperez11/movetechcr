# MoveTech 🏃‍♂️

> **Tecnología para moverse más y vivir mejor.** Una propuesta estudiantil para reducir el sedentarismo y prevenir la obesidad en adultos de 20 a 59 años en zonas urbanas de Costa Rica.

![Status](https://img.shields.io/badge/status-prototipo%20académico-green)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Firebase-blue)
![PWA](https://img.shields.io/badge/PWA-installable-orange)
![License](https://img.shields.io/badge/license-Educational-lightgrey)

---

## 📋 Tabla de contenido

- [Acerca del proyecto](#-acerca-del-proyecto)
- [El problema](#-el-problema)
- [La solución](#-la-solución)
- [Funcionalidades](#-funcionalidades)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Cómo ejecutar localmente](#-cómo-ejecutar-localmente)
- [Configurar Firebase (opcional)](#-configurar-firebase-opcional)
- [Capturas de pantalla](#-capturas-de-pantalla)
- [Limitaciones éticas](#-limitaciones-éticas)
- [Fuentes y referencias](#-fuentes-y-referencias)
- [Equipo](#-equipo)
- [Licencia](#-licencia)

---

## 🎯 Acerca del proyecto

MoveTech es un **prototipo académico estudiantil** desarrollado en el marco de una competencia de innovación. Combina:

- 🌐 Un **sitio web informativo** con datos epidemiológicos reales del Ministerio de Salud de Costa Rica.
- 📱 Una **Progressive Web App (PWA)** instalable en Android e iOS, con retos diarios, gamificación, sensores reales y notificaciones push.

Su enfoque es **educativo y preventivo**, **no médico**. No sustituye atención profesional en salud.

---

## ⚠️ El problema

Según el [Informe Anual de Incidencia de Obesidad en Costa Rica 2024](https://www.ministeriodesalud.go.cr) del Ministerio de Salud:

| Indicador | Valor |
|---|---|
| Casos de obesidad notificados (2024) | **96.567** |
| Tasa nacional por 100.000 habitantes | **1.778** |
| Casos en adultos de 20 a 59 años | **78,9%** |
| Razón de prevalencia mujeres / hombres | **1,98×** |
| Tasa más alta (Región Central Este) | **2.904** |
| Fallecimientos con obesidad como diagnóstico principal | **119** |

La obesidad adulta en Costa Rica pasó de **17,3% (2000)** a **31,4% (2022)** según la FAO.

---

## 💡 La solución

MoveTech aplica un ciclo educativo de 6 pasos:

1. **Detectar** hábitos sedentarios mediante uso de la app y tiempo en pantalla.
2. **Analizar** progreso del usuario y patrones de actividad.
3. **Proponer** retos rápidos: caminar, tomar agua, pausas activas, estiramientos.
4. **Motivar** con gamificación: puntos, niveles, racha, logros, recompensas.
5. **Educar** mediante cápsulas breves sobre salud, obesidad, colesterol y nutrición.
6. **Mantener** el cambio con hábitos sostenibles y notificaciones inteligentes.

---

## ✨ Funcionalidades

### Sitio web
- Landing informativa con datos del Ministerio de Salud de Costa Rica.
- Visualización de incidencia por región rectora de salud.
- Información educativa sobre obesidad, colesterol, omega 3, sedentarismo.
- Sección de equipo y créditos.
- Botón directo para abrir la app completa.

### App (PWA)
- **Onboarding con consentimiento educativo** obligatorio.
- **Retos diarios** con renovación automática a la medianoche.
- **Sistema de puntos y niveles** (4 niveles progresivos).
- **Racha de días consecutivos** 🔥 (streak counter).
- **Contador de pasos real** vía Device Motion API (Android e iOS).
- **Hidratación**: registro de vasos de agua con meta configurable.
- **Descanso visual 20-20-20** opcional cada 20 minutos.
- **Tiempo en pantalla**: alerta a los 10 minutos sugiriendo movimiento.
- **Tips de salud** con notificaciones programadas.
- **Cápsulas educativas** con datos del informe del Ministerio de Salud.
- **Logros / badges** desbloqueables.
- **Registro de ánimo** después de completar retos.
- **Vibración** al completar retos (Android).
- **Comercios aliados cercanos** vía geolocalización (simulados).
- **Compartir progreso y logros** vía Web Share API.
- **Sincronización en la nube** mediante Firebase Anonymous Auth + Firestore.
- **Push notifications reales** mediante Firebase Cloud Messaging.
- **Funciona offline** gracias al Service Worker.
- **Instalable** en Android, iOS y escritorio.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript ES2020 (vanilla) |
| PWA | Service Worker, Web App Manifest |
| Sensores | Device Motion API, Geolocation API |
| Compartir | Web Share API |
| Almacenamiento local | localStorage |
| Backend (opcional) | Firebase Anonymous Auth + Cloud Firestore |
| Notificaciones | Web Push API + Firebase Cloud Messaging (FCM) |
| Hosting | GitHub Pages |
| Sin frameworks | Sin React, Vue, Angular, ni dependencias npm |

---

## 📁 Estructura del proyecto

```
MoveTech/
├── 🌐 Sitio web informativo
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── 📱 App PWA standalone
│   ├── app.html
│   ├── pwa.css
│   └── pwa.js
│
├── 🔥 Configuración Firebase
│   ├── firebase-config.js
│   ├── firebase-messaging-sw.js
│   └── SETUP-FIREBASE.md
│
├── ⚙️ Infraestructura PWA
│   ├── manifest.webmanifest
│   ├── service-worker.js
│   ├── icon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png
│   ├── apple-touch-icon.png
│   └── generate-icons.html
│
└── 📄 Documentación
    └── README.md
```

---

## 🚀 Cómo ejecutar localmente

### Requisitos
- Visual Studio Code
- Extensión **Live Server** instalada en VS Code

### Pasos
1. Clonar este repositorio o descargar como ZIP.
2. Abrir la carpeta en VS Code.
3. Clic derecho sobre `index.html` → **"Open with Live Server"**.
4. Se abrirá automáticamente en `http://localhost:5500`.
5. Para abrir la app directamente: `http://localhost:5500/app.html`.

### Generar íconos (primera vez)
Si los archivos `icon-*.png` no existen:
1. Abrir `generate-icons.html` con doble clic.
2. Clic en **"Descargar TODOS los íconos"**.
3. Mover los 4 PNGs descargados a la carpeta del proyecto.

---

## 🔥 Configurar Firebase (opcional)

La app funciona perfectamente con localStorage. Para habilitar **sincronización en la nube** y **push notifications reales**:

1. Seguí la guía detallada en [`SETUP-FIREBASE.md`](SETUP-FIREBASE.md).
2. Tiempo estimado: 10 minutos.
3. Costo: gratis dentro del plan Spark de Firebase.

---

## 🛡️ Limitaciones éticas

MoveTech se rige por los siguientes principios:

- ❌ **NO** solicita peso, talla u otros datos corporales reales.
- ❌ **NO** solicita diagnósticos médicos.
- ❌ **NO** solicita historiales clínicos o enfermedades reales.
- ❌ **NO** sustituye la atención médica ni nutricional.
- ✅ **SÍ** requiere consentimiento educativo informado antes de usar.
- ✅ **SÍ** presenta toda la información como general, revisable por expertos.
- ✅ **SÍ** simula los comercios aliados y recompensas con fines educativos.
- ✅ **SÍ** persiste datos solo localmente (o anónimamente en Firebase si está activado).

---

## 📚 Fuentes y referencias

- **Ministerio de Salud de Costa Rica — Dirección de Vigilancia de la Salud**. *Informe Anual: Incidencia de Obesidad en Costa Rica, Vigilancia Epidemiológica, datos de notificación obligatoria 2024.* Elaborado por Ivannia Caravaca Rodríguez, Nutricionista Epidemióloga.
- **FAO (2023)**. *Estado de la seguridad alimentaria y la nutrición en América Latina y el Caribe.*
- **Federación Mundial de Obesidad (2025)**. *World Obesity Atlas 2025.* [worldobesity.org/atlas2025](https://www.worldobesity.org/atlas2025)

---

## 👥 Equipo

### Docente a cargo
- **Manuel Antonio Ramírez Pérez** — mramirez@colegiomiravalle.com

### Estudiantes
- **Estela Sofía Hernández Barboza** — ehernandez@cmiravalle.com
- **Fabián Alberto Muñoz López** — fmunozl@cmiravalle.com
- **Alejandro Ulloa Brenes** — aulloa@cmiravalle.com
- **Sergio Valverde González** — svalverde@cmiravalle.com
- **Caleb Méndez Araya** — cmendez@cmiravalle.com

**Institución**: Colegio Miravalle, Costa Rica.
**Año**: 2026.

---

## 📜 Licencia

© 2026 MoveTech · Proyecto estudiantil de innovación · Colegio Miravalle, Costa Rica.

Todos los derechos reservados. Prohibida la reproducción total o parcial sin autorización de los autores.

Este proyecto se desarrolla con fines educativos y académicos. No constituye una herramienta médica ni profesional de salud. El contenido informativo debe validarse con profesionales acreditados.

---

<div align="center">

**Pequeños movimientos, grandes cambios.** 🚶‍♀️💚

</div>
