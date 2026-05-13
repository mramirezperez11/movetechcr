/* =====================================================
   MoveTech PWA — pwa.js
   App experience: retos diarios, racha, hidratación,
   notificaciones, tiempo en pantalla, 20-20-20, etc.
===================================================== */

(function () {
  'use strict';

  /* ============================
     1. CATÁLOGOS Y CONSTANTES
  ============================ */

  const CHALLENGES = [
    { id: 'walk5',     title: 'Caminar 5 minutos',       points: 20, icon: '🚶' },
    { id: 'stretch',   title: 'Estiramiento rápido',      points: 15, icon: '🧘' },
    { id: 'water',     title: 'Tomar un vaso de agua',    points: 10, icon: '💧' },
    { id: 'pause3',    title: 'Pausa activa de 3 min',     points: 15, icon: '⏱️' },
    { id: 'readcap',   title: 'Leer un tip educativo',     points: 10, icon: '📖' },
    { id: 'stairs',    title: 'Subir las escaleras',       points: 15, icon: '🪜' },
    { id: 'breath',    title: 'Respiración profunda 1 min', points: 10, icon: '🌬️' },
    { id: 'posture',   title: 'Corregir postura ahora',     points: 10, icon: '🪑' }
  ];

  const WEEKLY = [
    { id: 'w1', title: '7 días seguidos completando 3 retos', points: 100, icon: '🔥' },
    { id: 'w2', title: 'Tomar 8 vasos de agua 5 días',         points: 80,  icon: '💧' },
    { id: 'w3', title: 'Leer 5 tips educativos',                points: 60,  icon: '📚' }
  ];

  const TIPS = [
    { id: 't1', cat: 'Obesidad', title: 'La obesidad en Costa Rica',
      body: 'Según el Ministerio de Salud, en 2024 se notificaron 96.567 casos de obesidad en Costa Rica. Los adultos de 20 a 59 años concentran el 78,9% de los casos. La prevención cotidiana cuenta.' },
    { id: 't2', cat: 'Colesterol', title: '¿Qué es el colesterol?',
      body: 'Es una sustancia que el cuerpo necesita en cantidades adecuadas. En exceso, puede acumularse en las arterias y aumentar el riesgo cardiovascular.' },
    { id: 't3', cat: 'Cardiovascular', title: 'Tu corazón te lo agradece',
      body: 'Caminar 30 minutos al día reduce el riesgo de enfermedad cardiovascular. No tiene que ser de corrido: 3 caminatas de 10 min ya cuentan.' },
    { id: 't4', cat: 'Sedentarismo', title: 'Movete cada hora',
      body: 'Estar sentado más de 8 horas al día se asocia a mayor riesgo de obesidad y diabetes tipo 2. Levantate cada 60 minutos aunque sea por 2 minutos.' },
    { id: 't5', cat: 'Nutrición', title: 'Mitad de tu plato',
      body: 'Una guía simple: que la mitad de tu plato sean frutas y verduras, un cuarto proteína magra y un cuarto granos integrales.' },
    { id: 't6', cat: 'Omega 3', title: 'Omega 3 y salud',
      body: 'Presente en sardina, atún, semillas de chía y linaza, y nueces. Aporta a la salud cardiovascular dentro de una alimentación equilibrada.' },
    { id: 't7', cat: 'Diabetes', title: 'Diabetes tipo 2 y obesidad',
      body: 'La obesidad es un factor de riesgo clave para la diabetes tipo 2. Mantener un peso saludable mediante actividad física y buena alimentación ayuda a prevenirla.' },
    { id: 't8', cat: 'Salud', title: 'Hidratación matutina',
      body: 'Tomar un vaso de agua al despertar ayuda a activar el metabolismo. Apuntá a 8 vasos por día como referencia general.' },
    { id: 't9', cat: 'Salud mental', title: 'Movimiento y ánimo',
      body: 'La actividad física libera endorfinas, sustancias que mejoran el estado de ánimo. Aun una caminata corta puede ayudar a sentirte mejor.' },
    { id: 't10', cat: 'Sueño', title: 'Dormir bien también pesa',
      body: 'Dormir menos de 6 horas puede asociarse a mayor riesgo de obesidad. Buscá entre 7 y 9 horas de sueño regular.' },
    { id: 't11', cat: 'Mujeres', title: 'Doble carga en mujeres',
      body: 'En Costa Rica, las mujeres tienen prevalencia de obesidad 1,98 veces mayor que los hombres, especialmente entre los 40 y 59 años. La prevención temprana es clave.' },
    { id: 't12', cat: 'Hígado graso', title: 'Hígado graso no alcohólico',
      body: 'La obesidad se asocia con hígado graso. Reducir azúcares añadidos y ultraprocesados, y mantenerse activo, ayuda a prevenirlo.' }
  ];

  const BADGES = [
    { id: 'b1', title: 'Primer paso',     desc: '1 reto',   emoji: '👟', need: (s) => s.totalChallenges >= 1 },
    { id: 'b2', title: 'Constante',       desc: '10 retos', emoji: '💪', need: (s) => s.totalChallenges >= 10 },
    { id: 'b3', title: 'Imparable',       desc: '50 retos', emoji: '🚀', need: (s) => s.totalChallenges >= 50 },
    { id: 'b4', title: 'Hidratado',       desc: '8 vasos en un día', emoji: '💧', need: (s) => s.waterToday >= 8 },
    { id: 'b5', title: '3 días seguidos', desc: 'racha 3',  emoji: '🔥', need: (s) => s.streak >= 3 },
    { id: 'b6', title: '7 días seguidos', desc: 'racha 7',  emoji: '🌟', need: (s) => s.streak >= 7 },
    { id: 'b7', title: 'Curioso',         desc: '5 tips',   emoji: '📚', need: (s) => s.tipsRead >= 5 },
    { id: 'b8', title: 'Maestro',         desc: '500 pts',  emoji: '🏆', need: (s) => s.points >= 500 },
    { id: 'b9', title: 'Pausa sabia',     desc: '5 descansos visuales', emoji: '👀', need: (s) => s.eyeBreaks >= 5 }
  ];

  const STORAGE_KEY = 'movetech_v1';
  const SCREEN_TIME_THRESHOLD = 10 * 60; // 10 minutos en segundos
  const TIPS_NOTIF_INTERVAL = 30 * 60 * 1000; // 30 minutos

  // Comercios aliados simulados (coordenadas aprox. Gran Área Metropolitana de CR)
  const PARTNERS = [
    { id:'p1', name:'Smart Fit Curridabat',  cat:'Gimnasio',           lat: 9.9159, lng:-84.0344, reward:'20% descuento',  icon:'🏋️' },
    { id:'p2', name:'Auto Mercado Plaza',    cat:'Tienda saludable',   lat: 9.9352, lng:-84.0853, reward:'Bebida saludable gratis', icon:'🥦' },
    { id:'p3', name:'Farmacia Sucre',         cat:'Farmacia',           lat: 9.9281, lng:-84.0907, reward:'10% descuento',  icon:'💊' },
    { id:'p4', name:'Café Verde Heredia',     cat:'Cafetería saludable',lat: 9.9985, lng:-84.1162, reward:'Café del día',   icon:'☕' },
    { id:'p5', name:'Polideportivo Cartago',  cat:'Centro deportivo',   lat: 9.8638, lng:-83.9189, reward:'Clase grupal gratis', icon:'⚽' },
    { id:'p6', name:'Gimnasio San Pedro',     cat:'Gimnasio',           lat: 9.9333, lng:-84.0500, reward:'15% descuento',  icon:'🏋️' },
    { id:'p7', name:'Vindi Saludable',        cat:'Tienda saludable',   lat: 9.9450, lng:-84.0750, reward:'Snack saludable',icon:'🥬' },
    { id:'p8', name:'CCM Escazú',             cat:'Centro deportivo',   lat: 9.9180, lng:-84.1380, reward:'Clase de yoga gratis', icon:'🧘' }
  ];

  // Paso del paso: umbral de magnitud de aceleración
  const STEP_THRESHOLD = 12;     // m/s²
  const STEP_MIN_GAP   = 280;    // ms entre pasos (max ~3.5 pasos/seg)

  /* ============================
     2. ESTADO Y STORAGE
  ============================ */

  const defaultState = {
    consent: false,
    points: 0,
    totalChallenges: 0,
    tipsRead: 0,
    eyeBreaks: 0,
    streak: 0,
    lastActivityDate: null,
    streakLastUpdate: null,
    todayKey: null,
    todayChallenges: [],
    todayPoints: 0,
    waterToday: 0,
    screenTimeSec: 0,
    screenTimeDate: null,
    history: [],
    moods: [],
    // Pasos y ubicación
    stepsToday: 0,
    stepsDate: null,
    totalSteps: 0,
    location: null,           // { lat, lng, ts }
    locationGranted: false,
    motionGranted: false,
    fcmToken: null,
    syncId: null,             // UID anónimo de Firebase
    lastSync: null,
    settings: {
      dailyGoal: 5,
      waterGoal: 8,
      stepGoal: 6000,
      eyeBreakEnabled: false,
      vibrateEnabled: true,
      tipsNotifEnabled: false,
      pushEnabled: false,
      syncEnabled: false
    }
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      // Merge para garantizar nuevos campos
      return Object.assign({}, structuredClone(defaultState), parsed, {
        settings: Object.assign({}, defaultState.settings, parsed.settings || {})
      });
    } catch {
      return structuredClone(defaultState);
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = load();

  /* ============================
     3. HELPERS DE FECHA
  ============================ */

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function formatDate(d) {
    const opts = { weekday: 'long', day: 'numeric', month: 'short' };
    return new Date(d).toLocaleDateString('es-CR', opts);
  }
  function greetingByHour() {
    const h = new Date().getHours();
    if (h < 12) return '¡Buenos días!';
    if (h < 19) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  }

  /* ============================
     4. RESET DIARIO
  ============================ */

  function ensureDailyReset() {
    const tk = todayKey();
    if (state.todayKey !== tk) {
      // Actualizar racha
      if (state.streakLastUpdate === yesterdayKey() && (state.todayChallenges || []).length > 0) {
        // ya manejado más abajo
      }
      if (state.todayKey && state.todayChallenges && state.todayChallenges.length === 0) {
        // si el día anterior no completó nada, romper la racha
        if (state.streakLastUpdate !== tk && state.streakLastUpdate !== yesterdayKey()) {
          state.streak = 0;
        }
      }
      // Si el último update fue antes de ayer, romper racha
      if (state.streakLastUpdate && state.streakLastUpdate !== yesterdayKey() && state.streakLastUpdate !== tk) {
        state.streak = 0;
      }
      state.todayKey = tk;
      state.todayChallenges = [];
      state.todayPoints = 0;
      state.waterToday = 0;
    }
    if (state.screenTimeDate !== tk) {
      state.screenTimeDate = tk;
      state.screenTimeSec = 0;
    }
    if (state.stepsDate !== tk) {
      state.stepsDate = tk;
      state.stepsToday = 0;
    }
    save();
  }

  /* ============================
     5. NIVELES
  ============================ */

  function computeLevel(pts) {
    if (pts >= 500) return { level: 4, label: 'Nivel 4', min: 500, max: null };
    if (pts >= 250) return { level: 3, label: 'Nivel 3', min: 250, max: 500 };
    if (pts >= 100) return { level: 2, label: 'Nivel 2', min: 100, max: 250 };
    return { level: 1, label: 'Nivel 1', min: 0, max: 100 };
  }

  /* ============================
     6. TOAST + VIBRACIÓN
  ============================ */

  const toastEl = document.getElementById('appToast');
  let toastTimer = null;
  function toast(msg, type = 'success') {
    toastEl.textContent = msg;
    toastEl.className = 'toast show ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.className = 'toast', 2500);
  }
  function vibrate(pattern) {
    if (!state.settings.vibrateEnabled) return;
    if ('vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch {}
    }
  }

  /* ============================
     7. NOTIFICACIONES NATIVAS
  ============================ */

  function notifSupported() {
    return 'Notification' in window;
  }
  function notifPermitted() {
    return notifSupported() && Notification.permission === 'granted';
  }
  async function requestNotifPermission() {
    if (!notifSupported()) {
      toast('Tu navegador no soporta notificaciones', 'error');
      return false;
    }
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') {
      toast('Notificaciones bloqueadas en el navegador', 'error');
      return false;
    }
    const res = await Notification.requestPermission();
    return res === 'granted';
  }
  function sendNotif(title, body, options = {}) {
    if (!notifPermitted()) return;
    try {
      navigator.serviceWorker.getRegistration().then(reg => {
        const opts = Object.assign({
          body, icon: 'icon-192.png', badge: 'icon-192.png',
          vibrate: [120, 60, 120], tag: options.tag || 'movetech'
        }, options);
        if (reg && reg.showNotification) {
          reg.showNotification(title, opts);
        } else {
          new Notification(title, opts);
        }
      });
    } catch {
      try { new Notification(title, { body }); } catch {}
    }
  }

  /* ============================
     8. NAVEGACIÓN ENTRE PANTALLAS
  ============================ */

  const screens = document.querySelectorAll('.screen');
  const tabs    = document.querySelectorAll('.tab');

  function go(screen) {
    screens.forEach(s => s.classList.toggle('active', s.dataset.screen === screen));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.go === screen));
    document.getElementById('appMainScroll').scrollTo(0, 0);
    render();
  }
  tabs.forEach(t => t.addEventListener('click', () => go(t.dataset.go)));

  /* ============================
     9. ONBOARDING / CONSENT
  ============================ */

  const onboardingEl = document.getElementById('onboarding');
  const appMainEl    = document.getElementById('appMain');
  const onbCheck     = document.getElementById('onbConsentCheck');
  const onbBtn       = document.getElementById('onbContinueBtn');

  function showOnboarding() {
    onboardingEl.hidden = false;
    appMainEl.hidden = true;
  }
  function showApp() {
    onboardingEl.hidden = true;
    appMainEl.hidden = false;
    startScreenTimeTracking();
    render();
  }

  onbCheck.addEventListener('change', () => {
    onbBtn.disabled = !onbCheck.checked;
  });
  onbBtn.addEventListener('click', () => {
    if (!onbCheck.checked) return;
    state.consent = true;
    save();
    showApp();
    setTimeout(() => {
      toast('¡Bienvenido a MoveTech!', 'success');
      // Notificación de bienvenida
      if (notifPermitted()) {
        sendNotif('MoveTech', 'Tu primer reto te espera. ¡Comenzá ya!');
      }
    }, 300);
  });

  /* ============================
     10. RENDER GENERAL
  ============================ */

  function render() {
    ensureDailyReset();
    renderHeader();
    renderHome();
    renderChallenges();
    renderTips();
    renderProgress();
    renderProfile();
  }

  function renderHeader() {
    document.getElementById('greetTime').textContent = greetingByHour();
    document.getElementById('streakCount').textContent = state.streak;
  }

  /* ============================
     11. HOME
  ============================ */

  function renderHome() {
    document.getElementById('todayDate').textContent = formatDate(new Date());

    const dailyGoal = state.settings.dailyGoal;
    const doneCount = state.todayChallenges.length;
    document.getElementById('homeChallengesToday').textContent = doneCount + '/' + dailyGoal;
    document.getElementById('homePointsToday').textContent = state.todayPoints;
    document.getElementById('homeWater').textContent = state.waterToday + '/' + state.settings.waterGoal;

    const pct = Math.min(100, Math.round((doneCount / dailyGoal) * 100));
    document.getElementById('homeProgressBar').style.width = pct + '%';
    document.getElementById('homeProgressLabel').textContent = pct + '% de tu meta diaria';

    // Reto destacado: el primero no completado
    const remaining = CHALLENGES.filter(c => !state.todayChallenges.includes(c.id));
    const feat = remaining[0] || CHALLENGES[0];
    document.getElementById('featIcon').textContent = feat.icon;
    document.getElementById('featTitle').textContent = feat.title;
    document.getElementById('featPts').textContent = '+' + feat.points + ' pts';
    const featBtn = document.getElementById('featBtn');
    featBtn.disabled = state.todayChallenges.includes(feat.id);
    featBtn.textContent = state.todayChallenges.includes(feat.id) ? '✓ Listo' : 'Completar';
    featBtn.onclick = () => completeChallenge(feat.id);

    // Nudge notificaciones
    const nudge = document.getElementById('notifNudge');
    if (notifSupported() && Notification.permission === 'default') {
      nudge.hidden = false;
    } else {
      nudge.hidden = true;
    }

    // Motivacional
    const msgs = [
      'Pequeños movimientos, grandes cambios.',
      'Hoy es un gran día para moverte un poco más.',
      'La constancia gana a la intensidad.',
      'Tu cuerpo te lo agradece.',
      'Cada vaso de agua cuenta.',
      'Un paso a la vez.'
    ];
    document.getElementById('homeMotiv').textContent = msgs[Math.floor(Math.random() * msgs.length)];
  }

  // Quick actions
  document.getElementById('quickWater').onclick = () => {
    if (state.waterToday >= state.settings.waterGoal) {
      toast('¡Ya cumpliste la meta de agua de hoy!', 'info');
      return;
    }
    state.waterToday += 1;
    state.points += 5;
    state.todayPoints += 5;
    addHistory('agua', 'Vaso de agua', 5);
    vibrate(60);
    save();
    toast('+5 pts · Vaso #' + state.waterToday, 'success');
    render();
  };
  document.getElementById('quickStretch').onclick = () => completeChallenge('pause3');
  document.getElementById('quickEyes').onclick    = () => startEyeBreak();
  document.getElementById('quickTip').onclick     = () => {
    const t = TIPS[Math.floor(Math.random() * TIPS.length)];
    openTipModal(t);
  };
  document.getElementById('enableNotifBtn').onclick = async () => {
    const ok = await requestNotifPermission();
    if (ok) {
      toast('Notificaciones activadas', 'success');
      sendNotif('MoveTech listo', 'Te avisaremos cuando sea hora de moverte.');
    }
    render();
  };

  /* ============================
     12. RETOS
  ============================ */

  function renderChallenges() {
    const list = document.getElementById('challengesList');
    list.innerHTML = '';
    CHALLENGES.forEach(ch => {
      const done = state.todayChallenges.includes(ch.id);
      const item = document.createElement('div');
      item.className = 'ch-item' + (done ? ' done' : '');
      item.innerHTML = `
        <div class="ch-emoji">${ch.icon}</div>
        <div class="ch-body">
          <h4>${ch.title}</h4>
          <span class="ch-pts">+${ch.points} pts</span>
        </div>
        <button class="ch-action" ${done ? 'disabled' : ''}>
          ${done ? '✓ Listo' : 'Completar'}
        </button>
      `;
      item.querySelector('button').onclick = () => completeChallenge(ch.id);
      list.appendChild(item);
    });
    document.getElementById('challengesProgress').textContent =
      state.todayChallenges.length + '/' + CHALLENGES.length + ' completados hoy';

    // Weekly
    const weeklyList = document.getElementById('weeklyList');
    weeklyList.innerHTML = '';
    WEEKLY.forEach(w => {
      const item = document.createElement('div');
      item.className = 'ch-item';
      item.innerHTML = `
        <div class="ch-emoji">${w.icon}</div>
        <div class="ch-body">
          <h4>${w.title}</h4>
          <span class="ch-pts">+${w.points} pts al completar</span>
        </div>
        <span class="muted small">En curso</span>
      `;
      weeklyList.appendChild(item);
    });
  }

  function completeChallenge(id) {
    if (state.todayChallenges.includes(id)) {
      toast('Ya completaste este reto hoy', 'info');
      return;
    }
    const ch = CHALLENGES.find(c => c.id === id);
    if (!ch) return;
    state.todayChallenges.push(id);
    state.points += ch.points;
    state.todayPoints += ch.points;
    state.totalChallenges += 1;
    addHistory('reto', ch.title, ch.points);
    updateStreak();
    vibrate([60, 30, 60]);
    save();
    toast('+' + ch.points + ' pts · ' + ch.title, 'success');

    // Pedir mood ocasionalmente
    if (Math.random() < 0.4) setTimeout(openMoodModal, 700);

    // Notif de logro: meta diaria alcanzada
    if (state.todayChallenges.length === state.settings.dailyGoal) {
      sendNotif('¡Meta diaria!', '¡Lograste tu meta de ' + state.settings.dailyGoal + ' retos hoy! 🎉', { tag: 'goal' });
      toast('¡Meta diaria alcanzada! 🎉', 'success');
    }

    checkBadges();
    render();
  }

  function updateStreak() {
    const tk = todayKey();
    const yk = yesterdayKey();
    if (state.streakLastUpdate === tk) return; // ya contó hoy
    if (state.streakLastUpdate === yk) {
      state.streak += 1;
    } else {
      state.streak = 1;
    }
    state.streakLastUpdate = tk;
  }

  /* ============================
     13. HISTORIAL
  ============================ */

  function addHistory(type, label, points) {
    state.history.push({ type, label, points, ts: Date.now() });
    if (state.history.length > 200) state.history = state.history.slice(-200);
  }

  /* ============================
     14. BADGES
  ============================ */

  function checkBadges() {
    BADGES.forEach(b => {
      const had = state['badge_' + b.id];
      const got = b.need(state);
      if (got && !had) {
        state['badge_' + b.id] = true;
        save();
        toast('🏅 Nuevo logro: ' + b.title, 'success');
        sendNotif('¡Nuevo logro desbloqueado!', b.title + ' — ' + b.desc, { tag: 'badge' });
      }
    });
  }

  /* ============================
     15. TIPS
  ============================ */

  function renderTips() {
    document.getElementById('todayDateTip').textContent = formatDate(new Date());
    // Tip del día: rotación basada en fecha
    const idx = (new Date().getDate()) % TIPS.length;
    const t = TIPS[idx];
    const card = document.getElementById('tipOfDay');
    card.innerHTML = `
      <span class="tip-cat">${t.cat}</span>
      <h3>${t.title}</h3>
      <p>${t.body}</p>
    `;
    card.onclick = () => openTipModal(t);

    // Toggle
    document.getElementById('tipsNotifToggle').checked = state.settings.tipsNotifEnabled;

    // Lista
    const list = document.getElementById('tipsList');
    list.innerHTML = '';
    TIPS.forEach(tip => {
      const card = document.createElement('div');
      card.className = 'tip-card';
      card.innerHTML = `
        <span class="tip-cat">${tip.cat}</span>
        <h3>${tip.title}</h3>
        <p>${tip.body.substring(0, 90)}...</p>
      `;
      card.onclick = () => openTipModal(tip);
      list.appendChild(card);
    });
  }

  function openTipModal(tip) {
    document.getElementById('tipModalCat').textContent = tip.cat;
    document.getElementById('tipModalTitle').textContent = tip.title;
    document.getElementById('tipModalBody').textContent = tip.body;
    document.getElementById('tipModal').hidden = false;
    // Sumar tip leído (una vez por tip)
    if (!state['tip_' + tip.id]) {
      state['tip_' + tip.id] = true;
      state.tipsRead += 1;
      state.points += 10;
      addHistory('tip', 'Tip: ' + tip.title, 10);
      save();
      toast('+10 pts por leer un tip', 'success');
      checkBadges();
    }
  }
  document.getElementById('tipModalClose').onclick = () => {
    document.getElementById('tipModal').hidden = true;
    render();
  };

  document.getElementById('tipsNotifToggle').onchange = async (e) => {
    if (e.target.checked) {
      const ok = await requestNotifPermission();
      if (!ok) {
        e.target.checked = false;
        return;
      }
      state.settings.tipsNotifEnabled = true;
      startTipsNotifications();
      toast('Tips programados activados', 'success');
    } else {
      state.settings.tipsNotifEnabled = false;
      stopTipsNotifications();
      toast('Tips desactivados', 'info');
    }
    save();
  };

  let tipsInterval = null;
  function startTipsNotifications() {
    stopTipsNotifications();
    tipsInterval = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      const t = TIPS[Math.floor(Math.random() * TIPS.length)];
      sendNotif('💡 ' + t.title, t.body.substring(0, 90), { tag: 'tip' });
    }, TIPS_NOTIF_INTERVAL);
  }
  function stopTipsNotifications() {
    if (tipsInterval) clearInterval(tipsInterval);
    tipsInterval = null;
  }

  /* ============================
     16. PROGRESO
  ============================ */

  function renderProgress() {
    document.getElementById('statStreak').textContent = state.streak;
    document.getElementById('statPoints').textContent = state.points;
    document.getElementById('statChallenges').textContent = state.totalChallenges;
    document.getElementById('statCapsules').textContent = state.tipsRead;

    const lv = computeLevel(state.points);
    document.getElementById('levelPill').textContent = lv.label;
    const pct = lv.max === null ? 100 : Math.round(((state.points - lv.min) / (lv.max - lv.min)) * 100);
    document.getElementById('levelBar').style.width = pct + '%';
    document.getElementById('levelNext').textContent = lv.max === null
      ? 'Nivel máximo alcanzado'
      : 'A ' + (lv.max - state.points) + ' pts del Nivel ' + (lv.level + 1);

    // Badges
    const grid = document.getElementById('badgesGrid');
    grid.innerHTML = '';
    BADGES.forEach(b => {
      const unlocked = !!state['badge_' + b.id];
      const card = document.createElement('div');
      card.className = 'badge' + (unlocked ? ' unlocked' : '');
      card.innerHTML = `
        <span class="badge-emoji">${b.emoji}</span>
        <h5>${b.title}</h5>
        <span>${b.desc}</span>
      `;
      grid.appendChild(card);
    });

    // Screen time
    const mins = Math.floor(state.screenTimeSec / 60);
    document.getElementById('screenTimeToday').textContent = mins + ' min';
  }

  /* ============================
     17. PERFIL / SETTINGS
  ============================ */

  function renderProfile() {
    document.getElementById('profileConsent').textContent =
      state.consent ? 'Aceptado ✔' : 'No aceptado';

    document.getElementById('notifStatus').textContent =
      !notifSupported() ? 'No soportado por este navegador' :
      Notification.permission === 'granted' ? 'Activadas ✔' :
      Notification.permission === 'denied'  ? 'Bloqueadas en el navegador' :
      'Sin activar';

    document.getElementById('eyeBreakToggle').checked = state.settings.eyeBreakEnabled;
    document.getElementById('vibrateToggle').checked = state.settings.vibrateEnabled;
    document.getElementById('dailyGoal').value = state.settings.dailyGoal;
    document.getElementById('waterGoal').value = state.settings.waterGoal;
  }

  document.getElementById('reqNotifBtn').onclick = async () => {
    const ok = await requestNotifPermission();
    if (ok) {
      toast('Notificaciones activadas', 'success');
      sendNotif('MoveTech', 'Listo: te avisaremos cuando sea hora de moverte.');
    }
    render();
  };
  document.getElementById('eyeBreakToggle').onchange = (e) => {
    state.settings.eyeBreakEnabled = e.target.checked;
    save();
    if (e.target.checked) startEyeBreakTimer();
    else stopEyeBreakTimer();
    toast(e.target.checked ? 'Descansos 20-20-20 activados' : 'Desactivados', 'info');
  };
  document.getElementById('vibrateToggle').onchange = (e) => {
    state.settings.vibrateEnabled = e.target.checked;
    save();
  };
  document.getElementById('dailyGoal').onchange = (e) => {
    state.settings.dailyGoal = parseInt(e.target.value, 10);
    save();
    render();
  };
  document.getElementById('waterGoal').onchange = (e) => {
    state.settings.waterGoal = parseInt(e.target.value, 10);
    save();
    render();
  };

  document.getElementById('resetProgressBtn').onclick = () => {
    if (!confirm('¿Reiniciar progreso? Se mantiene el consentimiento.')) return;
    const consent = state.consent;
    state = structuredClone(defaultState);
    state.consent = consent;
    state.todayKey = todayKey();
    save();
    toast('Progreso reiniciado', 'info');
    render();
  };
  document.getElementById('clearAllBtn').onclick = () => {
    if (!confirm('¿Borrar todos los datos, incluido el consentimiento?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = load();
    showOnboarding();
    toast('Datos borrados', 'info');
  };

  /* ============================
     18. SCREEN TIME TRACKER
  ============================ */

  let activeStart = null;
  let stInterval = null;
  let stAlertShown = false;
  let continuousActiveSec = 0;

  function startScreenTimeTracking() {
    if (stInterval) return;
    activeStart = Date.now();
    stInterval = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      state.screenTimeSec += 1;
      continuousActiveSec += 1;
      if (state.screenTimeSec % 30 === 0) save();
      if (continuousActiveSec >= SCREEN_TIME_THRESHOLD && !stAlertShown) {
        stAlertShown = true;
        showScreenTimeAlert();
      }
    }, 1000);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        activeStart = Date.now();
      } else {
        continuousActiveSec = 0;
        stAlertShown = false;
        save();
      }
    });
  }

  function showScreenTimeAlert() {
    const suggest = CHALLENGES.find(c => !state.todayChallenges.includes(c.id)) || CHALLENGES[0];
    document.getElementById('stSuggest').innerHTML =
      '<strong>' + suggest.icon + ' ' + suggest.title + '</strong>' +
      '<span>+' + suggest.points + ' pts</span>';
    document.getElementById('screenTimeModal').hidden = false;
    sendNotif('⏰ ¡10 minutos en pantalla!',
      'Te sugerimos: ' + suggest.title + ' (+' + suggest.points + ' pts)', { tag: 'screen-time' });
    vibrate([100, 50, 100, 50, 100]);

    document.getElementById('stDoIt').onclick = () => {
      document.getElementById('screenTimeModal').hidden = true;
      continuousActiveSec = 0;
      stAlertShown = false;
      completeChallenge(suggest.id);
      go('challenges');
    };
    document.getElementById('stLater').onclick = () => {
      document.getElementById('screenTimeModal').hidden = true;
      continuousActiveSec = 0; // reinicia el contador continuo
    };
  }

  /* ============================
     19. EYE BREAK 20-20-20
  ============================ */

  let eyeTimer = null;
  let eyeCountInterval = null;

  function startEyeBreakTimer() {
    stopEyeBreakTimer();
    // Cada 20 min en uso activo, lanzar el break
    eyeTimer = setInterval(() => {
      if (document.visibilityState === 'visible') startEyeBreak();
    }, 20 * 60 * 1000);
  }
  function stopEyeBreakTimer() {
    if (eyeTimer) clearInterval(eyeTimer);
    eyeTimer = null;
  }
  function startEyeBreak() {
    const modal = document.getElementById('eyeModal');
    const count = document.getElementById('eyeCount');
    modal.hidden = false;
    let s = 20;
    count.textContent = s;
    if (eyeCountInterval) clearInterval(eyeCountInterval);
    eyeCountInterval = setInterval(() => {
      s -= 1;
      count.textContent = s;
      if (s <= 0) {
        clearInterval(eyeCountInterval);
        modal.hidden = true;
        state.eyeBreaks += 1;
        state.points += 5;
        addHistory('descanso', 'Descanso visual 20-20-20', 5);
        save();
        toast('+5 pts · Buen descanso visual', 'success');
        vibrate(80);
        checkBadges();
        render();
      }
    }, 1000);
    sendNotif('👀 Descanso visual', 'Mirá a 6 metros por 20 segundos.', { tag: 'eye' });
  }
  document.getElementById('eyeSkip').onclick = () => {
    if (eyeCountInterval) clearInterval(eyeCountInterval);
    document.getElementById('eyeModal').hidden = true;
  };

  /* ============================
     20. MOOD TRACKER
  ============================ */

  function openMoodModal() {
    document.getElementById('moodModal').hidden = false;
  }
  document.querySelectorAll('.mood-btn').forEach(b => {
    b.onclick = () => {
      const mood = parseInt(b.dataset.mood, 10);
      state.moods.push({ mood, ts: Date.now() });
      save();
      document.getElementById('moodModal').hidden = true;
      toast('Gracias por compartir cómo te sentís', 'success');
    };
  });
  document.getElementById('moodSkip').onclick = () => {
    document.getElementById('moodModal').hidden = true;
  };

  /* ============================
     21. NOTIFICACIÓN DE BIENVENIDA / RETO DIARIO
  ============================ */

  function dailyReminderIfNeeded() {
    // Si entró hoy y no completó ningún reto, animar
    if (state.todayChallenges.length === 0 && notifPermitted()) {
      setTimeout(() => {
        sendNotif('🎯 ¡Empezá tu día!', 'Hacé tu primer reto y sumá puntos.', { tag: 'daily' });
      }, 3000);
    }
  }

  /* ============================
     22. STEP COUNTER (DeviceMotion API)
  ============================ */

  let lastStepMag = 9.81;
  let lastStepTime = 0;
  let motionAttached = false;

  function motionSupported() {
    return 'DeviceMotionEvent' in window;
  }

  async function requestMotionPermission() {
    if (!motionSupported()) {
      toast('Tu dispositivo no soporta sensor de movimiento', 'error');
      return false;
    }
    // iOS 13+ requiere permiso explícito
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== 'granted') {
          toast('Permiso de movimiento denegado', 'error');
          return false;
        }
      } catch (err) {
        console.warn('Motion permission:', err);
        return false;
      }
    }
    state.motionGranted = true;
    save();
    attachMotion();
    return true;
  }

  function attachMotion() {
    if (motionAttached) return;
    motionAttached = true;
    window.addEventListener('devicemotion', onMotion, { passive: true });
  }

  function onMotion(e) {
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a || a.x == null) return;
    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    const now = Date.now();
    if (mag > STEP_THRESHOLD && lastStepMag <= STEP_THRESHOLD && now - lastStepTime > STEP_MIN_GAP) {
      lastStepTime = now;
      addStep();
    }
    lastStepMag = mag;
  }

  let stepSaveTimer = null;
  function addStep() {
    state.stepsToday += 1;
    state.totalSteps += 1;
    // Sumar pts cada 100 pasos
    if (state.stepsToday % 100 === 0) {
      state.points += 5;
      state.todayPoints += 5;
      addHistory('pasos', '+100 pasos', 5);
      toast('+5 pts · ' + state.stepsToday + ' pasos hoy', 'success');
    }
    // Meta de pasos diaria
    if (state.stepsToday === state.settings.stepGoal) {
      state.points += 50;
      state.todayPoints += 50;
      addHistory('meta-pasos', 'Meta diaria de pasos', 50);
      sendNotif('🎉 ¡Meta de pasos!',
        '¡Alcanzaste ' + state.settings.stepGoal + ' pasos hoy! +50 pts', { tag: 'step-goal' });
      vibrate([100, 50, 100]);
    }
    // Throttle de save (cada 5 seg)
    if (!stepSaveTimer) {
      stepSaveTimer = setTimeout(() => {
        save();
        stepSaveTimer = null;
        renderStepsUI();
      }, 5000);
    }
  }

  function renderStepsUI() {
    const stepsEl = document.getElementById('homeSteps');
    if (stepsEl) stepsEl.textContent = state.stepsToday;
    const stepsPct = Math.min(100, Math.round((state.stepsToday / state.settings.stepGoal) * 100));
    const stepBar = document.getElementById('stepsBar');
    if (stepBar) stepBar.style.width = stepsPct + '%';
    const stepLbl = document.getElementById('stepsLabel');
    if (stepLbl) stepLbl.textContent = state.stepsToday + ' / ' + state.settings.stepGoal + ' pasos';
    const progSteps = document.getElementById('statSteps');
    if (progSteps) progSteps.textContent = state.totalSteps;
  }

  /* ============================
     23. GEOLOCATION + PARTNERS
  ============================ */

  function geoSupported() {
    return 'geolocation' in navigator;
  }

  function requestLocation() {
    return new Promise((resolve, reject) => {
      if (!geoSupported()) {
        toast('Geolocalización no soportada', 'error');
        return reject(new Error('not-supported'));
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            ts: Date.now()
          };
          state.locationGranted = true;
          save();
          resolve(state.location);
        },
        (err) => {
          console.warn('geo error:', err);
          state.locationGranted = false;
          save();
          reject(err);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
      );
    });
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371; // km
    const toRad = x => x * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function formatDistance(km) {
    if (km < 1) return Math.round(km * 1000) + ' m';
    if (km < 10) return km.toFixed(1) + ' km';
    return Math.round(km) + ' km';
  }

  function partnersWithDistance() {
    if (!state.location) return PARTNERS.map(p => ({ ...p, distance: null }));
    return PARTNERS
      .map(p => ({
        ...p,
        distance: haversine(state.location.lat, state.location.lng, p.lat, p.lng)
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  function renderPartners() {
    const list = document.getElementById('partnersList');
    if (!list) return;
    list.innerHTML = '';
    const items = partnersWithDistance();
    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'partner-card';
      card.innerHTML = `
        <div class="partner-icon">${p.icon}</div>
        <div class="partner-info">
          <h4>${p.name}</h4>
          <span class="muted small">${p.cat}</span>
          <span class="partner-reward">${p.reward}</span>
        </div>
        <div class="partner-meta">
          <span class="partner-dist">${p.distance != null ? formatDistance(p.distance) : '—'}</span>
          <button class="btn-ghost btn-sm partner-go" data-id="${p.id}">Ver</button>
        </div>
      `;
      card.querySelector('.partner-go').onclick = () => openMaps(p);
      list.appendChild(card);
    });

    const note = document.getElementById('partnersNote');
    if (state.location) {
      note.textContent = 'Ordenados desde tu ubicación actual. Datos simulados con fines educativos.';
    } else {
      note.textContent = 'Activá tu ubicación para ver los comercios más cercanos. Datos simulados.';
    }
    const btn = document.getElementById('partnersEnableBtn');
    if (btn) btn.hidden = state.locationGranted;
  }

  function openMaps(p) {
    const url = 'https://www.google.com/maps/search/?api=1&query=' + p.lat + ',' + p.lng;
    window.open(url, '_blank', 'noopener');
  }

  /* ============================
     24. WEB SHARE API
  ============================ */

  function shareSupported() {
    return 'share' in navigator;
  }

  async function shareBadge(badge) {
    const text = '¡Desbloqueé el logro "' + badge.title + '" en MoveTech! 🏅 Una app para moverse más y vivir mejor. #MoveTech';
    const url  = window.location.origin + window.location.pathname;
    if (shareSupported()) {
      try {
        await navigator.share({ title: 'MoveTech', text, url });
        toast('¡Compartido!', 'success');
      } catch (err) {
        if (err && err.name !== 'AbortError') console.warn('share:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text + ' ' + url);
        toast('Copiado al portapapeles', 'success');
      } catch {
        toast('No se pudo compartir', 'error');
      }
    }
  }

  async function shareProgress() {
    const text = '¡Llevo ' + state.streak + ' días de racha, ' + state.points + ' pts y ' +
                 state.totalChallenges + ' retos en MoveTech! 🔥';
    const url  = window.location.origin + window.location.pathname;
    if (shareSupported()) {
      try {
        await navigator.share({ title: 'MoveTech', text, url });
      } catch (err) {
        if (err && err.name !== 'AbortError') console.warn('share:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text + ' ' + url);
        toast('Copiado al portapapeles', 'success');
      } catch {
        toast('No se pudo compartir', 'error');
      }
    }
  }

  /* ============================
     25. FIREBASE (opcional)
     - Anonymous Auth
     - Firestore sync de estado
     - FCM token para push real
  ============================ */

  let fbApp = null;
  let fbAuth = null;
  let fbDb = null;
  let fbMessaging = null;
  let fbUnsub = null;
  let syncSaveTimer = null;

  function firebaseEnabled() {
    return window.FIREBASE_ENABLED === true && typeof firebase !== 'undefined';
  }

  function initFirebase() {
    if (!firebaseEnabled()) return;
    try {
      fbApp  = firebase.initializeApp(window.FIREBASE_CONFIG);
      fbAuth = firebase.auth();
      fbDb   = firebase.firestore();
      if ('messaging' in firebase) {
        try { fbMessaging = firebase.messaging(); } catch (e) { console.warn('FCM init:', e); }
      }
      // Auth anónima
      fbAuth.signInAnonymously().catch(err => console.warn('anon auth:', err));
      fbAuth.onAuthStateChanged(user => {
        if (user) {
          state.syncId = user.uid;
          save();
          syncDownload();
          subscribeRealtime();
          renderProfile();
        }
      });
      console.log('[Firebase] inicializado');
    } catch (err) {
      console.warn('[Firebase] error init:', err);
    }
  }

  function syncUpload() {
    if (!firebaseEnabled() || !fbDb || !state.syncId) return;
    if (!state.settings.syncEnabled) return;
    if (syncSaveTimer) clearTimeout(syncSaveTimer);
    syncSaveTimer = setTimeout(() => {
      const data = Object.assign({}, state, { updatedAt: Date.now() });
      // Excluir history para reducir tamaño
      delete data.history;
      fbDb.collection('users').doc(state.syncId).set(data, { merge: true })
        .then(() => { state.lastSync = Date.now(); })
        .catch(err => console.warn('sync up:', err));
    }, 1500);
  }

  function syncDownload() {
    if (!firebaseEnabled() || !fbDb || !state.syncId) return;
    if (!state.settings.syncEnabled) return;
    fbDb.collection('users').doc(state.syncId).get()
      .then(doc => {
        if (!doc.exists) return;
        const remote = doc.data();
        if ((remote.updatedAt || 0) > (state.lastSync || 0)) {
          // Merge respetando ciertas claves locales
          const keep = { history: state.history, location: state.location };
          state = Object.assign({}, state, remote, keep);
          save();
          render();
          toast('Datos sincronizados', 'info');
        }
      })
      .catch(err => console.warn('sync down:', err));
  }

  function subscribeRealtime() {
    if (!firebaseEnabled() || !fbDb || !state.syncId) return;
    if (!state.settings.syncEnabled) return;
    if (fbUnsub) fbUnsub();
    fbUnsub = fbDb.collection('users').doc(state.syncId)
      .onSnapshot(snap => {
        if (!snap.exists) return;
        const remote = snap.data();
        if ((remote.updatedAt || 0) > (state.lastSync || 0) + 1000) {
          // Cambios de otro dispositivo
          const keep = { history: state.history, location: state.location };
          state = Object.assign({}, state, remote, keep);
          state.lastSync = remote.updatedAt;
          save();
          render();
        }
      }, err => console.warn('snapshot:', err));
  }

  async function enableSync() {
    if (!firebaseEnabled()) {
      toast('Firebase no está configurado', 'error');
      return false;
    }
    state.settings.syncEnabled = true;
    save();
    syncDownload();
    subscribeRealtime();
    toast('Sincronización activada', 'success');
    return true;
  }

  async function enablePush() {
    if (!firebaseEnabled() || !fbMessaging) {
      toast('Push no disponible (Firebase no configurado)', 'error');
      return false;
    }
    const ok = await requestNotifPermission();
    if (!ok) return false;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const token = await fbMessaging.getToken({
        vapidKey: window.FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: reg
      });
      if (!token) {
        toast('No se pudo obtener token de push', 'error');
        return false;
      }
      state.fcmToken = token;
      state.settings.pushEnabled = true;
      save();
      // Guardar token en Firestore para enviar pushes
      if (fbDb && state.syncId) {
        fbDb.collection('tokens').doc(state.syncId).set({
          token,
          updatedAt: Date.now()
        }, { merge: true }).catch(err => console.warn('token save:', err));
      }
      toast('Push notifications activadas', 'success');
      console.log('[FCM] token:', token);
      // Mensajes en foreground
      fbMessaging.onMessage(payload => {
        const n = payload.notification || {};
        sendNotif(n.title || 'MoveTech', n.body || '', { tag: 'fcm' });
      });
      return true;
    } catch (err) {
      console.warn('push enable:', err);
      toast('Error activando push: ' + (err.message || ''), 'error');
      return false;
    }
  }

  // Guardar override que incluye sync
  const _save = save;
  save = function () {
    _save();
    syncUpload();
  };

  /* ============================
     26. SERVICE WORKER (registrar)
  ============================ */

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .catch(err => console.warn('SW:', err));
    });
  }

  /* ============================
     27. WIRING DE BOTONES NUEVOS
  ============================ */

  // Botón habilitar geolocalización
  const partnersBtn = document.getElementById('partnersEnableBtn');
  if (partnersBtn) {
    partnersBtn.onclick = async () => {
      try {
        await requestLocation();
        toast('Ubicación obtenida', 'success');
        renderPartners();
      } catch {
        toast('No se pudo obtener tu ubicación', 'error');
      }
    };
  }

  // Botón habilitar sensor de pasos
  const stepsEnableBtn = document.getElementById('stepsEnableBtn');
  if (stepsEnableBtn) {
    stepsEnableBtn.onclick = async () => {
      const ok = await requestMotionPermission();
      if (ok) toast('Contador de pasos activado', 'success');
      renderStepsUI();
      renderStepsToggle();
    };
  }

  function renderStepsToggle() {
    const btn = document.getElementById('stepsEnableBtn');
    if (!btn) return;
    btn.hidden = state.motionGranted;
  }

  // Botón compartir progreso
  const shareProgBtn = document.getElementById('shareProgressBtn');
  if (shareProgBtn) shareProgBtn.onclick = shareProgress;

  // Botón Firebase: enable sync
  const syncBtn = document.getElementById('syncBtn');
  if (syncBtn) {
    syncBtn.onclick = () => enableSync();
  }

  // Botón Firebase: enable push real
  const pushBtn = document.getElementById('pushBtn');
  if (pushBtn) {
    pushBtn.onclick = () => enablePush();
  }

  /* ============================
     28. ENRIQUECER renderProgress + renderProfile
        con UI nueva (steps, partners, share)
  ============================ */

  const _renderProgress = renderProgress;
  renderProgress = function () {
    _renderProgress();
    const stepsEl = document.getElementById('statSteps');
    if (stepsEl) stepsEl.textContent = state.totalSteps;
  };

  const _renderHome = renderHome;
  renderHome = function () {
    _renderHome();
    renderStepsUI();
    renderPartners();
  };

  const _renderProfile = renderProfile;
  renderProfile = function () {
    _renderProfile();
    // Estado Firebase
    const fbStatus = document.getElementById('fbStatus');
    if (fbStatus) {
      fbStatus.textContent = firebaseEnabled()
        ? (state.settings.syncEnabled ? 'Sincronizado ✔' : 'Configurado, sin activar')
        : 'No configurado';
    }
    // Estado push
    const pushStatus = document.getElementById('pushStatus');
    if (pushStatus) {
      pushStatus.textContent = state.settings.pushEnabled ? 'Activadas ✔' : 'Sin activar';
    }
    renderStepsToggle();
  };

  // Render badges con share
  const _checkBadges = checkBadges;
  checkBadges = function () {
    _checkBadges();
    // Rerender progress para mostrar share
    if (document.querySelector('.screen.active')?.dataset.screen === 'progress') {
      renderProgress();
      attachBadgeShare();
    }
  };

  function attachBadgeShare() {
    document.querySelectorAll('.badge.unlocked').forEach(el => {
      if (el.dataset.shareWired) return;
      el.dataset.shareWired = '1';
      el.style.cursor = 'pointer';
      el.title = 'Tocar para compartir';
      el.onclick = () => {
        const id = el.dataset.badgeId;
        const b = BADGES.find(x => x.id === id);
        if (b) shareBadge(b);
      };
    });
  }

  // Sobrescribimos render de badges para que tengan data-badge-id
  // (parcheamos el HTML después de render)
  function decorateBadges() {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.badge');
    BADGES.forEach((b, i) => {
      const card = cards[i];
      if (card) card.dataset.badgeId = b.id;
    });
    attachBadgeShare();
  }
  const _renderProgress2 = renderProgress;
  renderProgress = function () {
    _renderProgress2();
    decorateBadges();
  };

  /* ============================
     29. INIT
  ============================ */

  function init() {
    if (!state.consent) {
      showOnboarding();
      return;
    }
    state.todayKey = state.todayKey || todayKey();
    save();
    showApp();
    dailyReminderIfNeeded();
    if (state.settings.eyeBreakEnabled) startEyeBreakTimer();
    if (state.settings.tipsNotifEnabled) startTipsNotifications();
    if (state.motionGranted) attachMotion();
    checkBadges();
    initFirebase();
  }

  init();
})();
