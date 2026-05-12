/* =====================================================
   MoveTech — app.js
   Lógica del prototipo: navegación, retos, puntos,
   niveles, recompensas, cápsulas y localStorage.
===================================================== */

(function () {
  'use strict';

  /* ---------------- Storage keys ---------------- */
  const KEYS = {
    consent:      'mt_consent',
    points:       'mt_points',
    challenges:   'mt_challenges_done',  // [{id, ts}]
    capsules:     'mt_capsules_read',    // [id, ...]
    redemptions:  'mt_redemptions',      // [{id, code, ts}]
    history:      'mt_history',          // [{type, label, points, ts}]
    sedentary:    'mt_sedentary'         // minutos simulados
  };

  /* ---------------- Catálogos ---------------- */
  const CHALLENGES = [
    { id: 'walk5',    title: 'Caminar 5 minutos',          points: 20, icon: '🚶' },
    { id: 'stretch',  title: 'Estiramiento rápido',         points: 15, icon: '🧘' },
    { id: 'water',    title: 'Tomar agua',                   points: 10, icon: '💧' },
    { id: 'pause3',   title: 'Pausa activa de 3 minutos',    points: 15, icon: '⏱️' },
    { id: 'readcap',  title: 'Leer una cápsula educativa',   points: 10, icon: '📖' }
  ];

  const REWARDS = [
    { id: 'r100', title: '5% de descuento en comercio aliado', cost: 100, icon: '🏷️' },
    { id: 'r200', title: 'Bebida saludable gratis',             cost: 200, icon: '🥤' },
    { id: 'r300', title: 'Clase grupal de actividad física',     cost: 300, icon: '🤸' },
    { id: 'r500', title: 'Cupón especial de bienestar',          cost: 500, icon: '🎁' }
  ];

  const CAPSULES = [
    { id: 'c1', title: '¿Qué es el colesterol?',
      body: 'El colesterol es una sustancia que el cuerpo necesita en cantidades adecuadas. En exceso, puede acumularse en las arterias y aumentar el riesgo cardiovascular. Mantener hábitos activos y una alimentación equilibrada ayuda a cuidarlo. Recordá: este contenido es informativo y debe validarse con un profesional de salud.' },
    { id: 'c2', title: 'Obesidad en Costa Rica (2024)',
      body: 'Según el Ministerio de Salud, en 2024 se notificaron 96.567 casos de obesidad en Costa Rica, con una tasa nacional de 1.778 por cada 100.000 habitantes. Los adultos de 20 a 59 años concentran el 78,9% de los casos. La obesidad adulta pasó de 17,3% (2000) a 31,4% (2022) según la FAO.' },
    { id: 'c3', title: 'Enfermedades asociadas a la obesidad',
      body: 'La obesidad se asocia con diabetes tipo 2, dislipidemias, hipertensión, apnea del sueño y enfermedad cardiovascular. La Federación Mundial de Obesidad estima 1,6 millones de muertes prematuras al año por enfermedades no transmisibles relacionadas con sobrepeso y obesidad.' },
    { id: 'c4', title: 'Cómo prevenir el sedentarismo',
      body: 'El patrón observado en la Gran Área Metropolitana de Costa Rica se asocia a factores urbanísticos, acceso a alimentos ultraprocesados y estilos de vida sedentarios. Pausas activas, caminar más, usar escaleras y reducir tiempo continuo frente a pantallas ayudan. Lo importante es la constancia.' },
    { id: 'c5', title: 'Consejos nutricionales generales',
      body: 'Priorizá frutas, verduras, agua, granos integrales y proteínas magras. Moderá ultraprocesados, azúcares añadidos y bebidas azucaradas. El Ministerio de Salud recomienda fortalecer la educación nutricional. Para una dieta personalizada consultá con un nutricionista.' },
    { id: 'c6', title: 'Omega 3 y salud',
      body: 'El Omega 3 es un ácido graso esencial presente en pescados como sardina y atún, semillas de chía y linaza, y nueces. Aporta a la salud cardiovascular dentro de una alimentación equilibrada.' },
    { id: 'c7', title: 'Mujeres y obesidad: doble carga',
      body: 'Los datos del Ministerio de Salud muestran que las mujeres presentan una prevalencia de obesidad 1,98 veces mayor que los hombres. La diferencia es especialmente marcada entre los 40 y 59 años, con una brecha de +2.307 casos por 100.000 en el grupo de 50-54 años. Por eso es clave la prevención temprana enfocada en este grupo.' }
  ];

  /* ---------------- Helpers de storage ---------------- */
  const read = (k, def) => {
    try {
      const raw = localStorage.getItem(k);
      if (raw === null) return def;
      return JSON.parse(raw);
    } catch { return def; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  /* ---------------- Estado en memoria ---------------- */
  const state = {
    consent:     read(KEYS.consent, false),
    points:      read(KEYS.points, 0),
    challenges:  read(KEYS.challenges, []),
    capsules:    read(KEYS.capsules, []),
    redemptions: read(KEYS.redemptions, []),
    history:     read(KEYS.history, []),
    sedentary:   read(KEYS.sedentary, 0)
  };

  function persistAll() {
    write(KEYS.consent,     state.consent);
    write(KEYS.points,      state.points);
    write(KEYS.challenges,  state.challenges);
    write(KEYS.capsules,    state.capsules);
    write(KEYS.redemptions, state.redemptions);
    write(KEYS.history,     state.history);
    write(KEYS.sedentary,   state.sedentary);
  }

  /* ---------------- Niveles ---------------- */
  function computeLevel(pts) {
    if (pts >= 500) return { level: 4, label: 'Nivel 4', min: 500, max: null };
    if (pts >= 250) return { level: 3, label: 'Nivel 3', min: 250, max: 500 };
    if (pts >= 100) return { level: 2, label: 'Nivel 2', min: 100, max: 250 };
    return { level: 1, label: 'Nivel 1', min: 0, max: 100 };
  }
  function levelProgress(pts) {
    const lv = computeLevel(pts);
    if (lv.max === null) return { pct: 100, next: null };
    const pct = ((pts - lv.min) / (lv.max - lv.min)) * 100;
    return { pct: Math.min(100, Math.max(0, pct)), next: lv.max };
  }

  /* ---------------- Toast ---------------- */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg, type = 'success') {
    toastEl.textContent = msg;
    toastEl.className = 'toast show ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.className = 'toast';
    }, 2400);
  }

  /* ---------------- Navegación entre pantallas ---------------- */
  const screens = document.querySelectorAll('.screen');
  const tabs    = document.querySelectorAll('.tab');

  function go(screenName) {
    if (!state.consent && screenName !== 'welcome' && screenName !== 'consent') {
      screenName = 'consent';
      showToast('Primero debes aceptar el consentimiento', 'info');
    }
    screens.forEach(s => s.classList.toggle('active', s.dataset.screen === screenName));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.go === screenName));
    if (screenName === 'dashboard') renderDashboard();
    if (screenName === 'challenges') renderChallenges();
    if (screenName === 'points')     renderPoints();
    if (screenName === 'rewards')    renderRewards();
    if (screenName === 'capsules')   renderCapsules();
    if (screenName === 'progress')   renderProgress();
    if (screenName === 'profile')    renderProfile();
  }

  // Botones con data-go
  document.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => go(el.dataset.go));
  });

  /* ---------------- Consentimiento ---------------- */
  const consentCheck = document.getElementById('consentCheck');
  const consentBtn   = document.getElementById('consentBtn');

  consentCheck.addEventListener('change', () => {
    consentBtn.disabled = !consentCheck.checked;
  });

  consentBtn.addEventListener('click', () => {
    if (!consentCheck.checked) return;
    state.consent = true;
    persistAll();
    showToast('Consentimiento aceptado', 'success');
    go('dashboard');
  });

  // Si ya hay consentimiento previo, reflejarlo
  if (state.consent) {
    consentCheck.checked = true;
    consentBtn.disabled = false;
  }

  /* ---------------- Dashboard ---------------- */
  function dailyProgressPct() {
    // Progreso diario: porción de retos completados sobre total de retos
    const total = CHALLENGES.length;
    const done = state.challenges.filter(c => isToday(c.ts)).length;
    return Math.round((done / total) * 100);
  }
  function isToday(ts) {
    const d = new Date(ts);
    const n = new Date();
    return d.getFullYear() === n.getFullYear()
        && d.getMonth() === n.getMonth()
        && d.getDate() === n.getDate();
  }

  function renderDashboard() {
    document.getElementById('dashPoints').textContent = state.points;
    document.getElementById('dashChallenges').textContent = state.challenges.length;
    document.getElementById('dashSedentary').textContent = state.sedentary + ' min';
    const pct = dailyProgressPct();
    document.getElementById('dashProgressBar').style.width = pct + '%';
    document.getElementById('dashProgressLabel').textContent = pct + '%';
    document.getElementById('dashLevelPill').textContent = computeLevel(state.points).label;

    const msgs = [
      '¡Cada paso cuenta! Hoy es un gran día para moverte un poquito más.',
      'Tu próximo reto está a un clic. ¡Vamos!',
      'Pequeños movimientos, grandes cambios.',
      'Recordá hidratarte y tomar pausas activas.',
      'La constancia es más importante que la intensidad.'
    ];
    document.getElementById('motivationalBox').textContent = msgs[Math.floor(Math.random() * msgs.length)];
  }

  /* ---------------- Retos ---------------- */
  function isChallengeDoneToday(id) {
    return state.challenges.some(c => c.id === id && isToday(c.ts));
  }

  function renderChallenges() {
    const wrap = document.getElementById('challengesList');
    wrap.innerHTML = '';
    CHALLENGES.forEach(ch => {
      const done = isChallengeDoneToday(ch.id);
      const item = document.createElement('div');
      item.className = 'list-item' + (done ? ' done' : '');
      item.innerHTML = `
        <div>
          <h5>${ch.icon} ${ch.title}</h5>
          <span class="challenge-points">+${ch.points} pts</span>
        </div>
        <button data-id="${ch.id}" ${done ? 'disabled' : ''}>
          ${done ? 'Completado' : 'Completar'}
        </button>
      `;
      item.querySelector('button').addEventListener('click', () => completeChallenge(ch));
      wrap.appendChild(item);
    });
  }

  function completeChallenge(ch) {
    if (isChallengeDoneToday(ch.id)) {
      showToast('Ya completaste este reto hoy', 'info');
      return;
    }
    state.challenges.push({ id: ch.id, ts: Date.now() });
    state.points += ch.points;
    // Simular reducción de tiempo sedentario
    state.sedentary = Math.max(0, state.sedentary - 5);
    addHistory('reto', ch.title, ch.points);
    persistAll();
    showToast('¡+' + ch.points + ' pts! Reto completado', 'success');
    renderChallenges();
  }

  document.getElementById('resetChallengesBtn').addEventListener('click', () => {
    // Solo elimina los del día actual (permite volver a intentar)
    state.challenges = state.challenges.filter(c => !isToday(c.ts));
    persistAll();
    renderChallenges();
    showToast('Retos del día reiniciados', 'info');
  });

  /* ---------------- Puntos y niveles ---------------- */
  function renderPoints() {
    document.getElementById('pointsTotal').textContent = state.points;
    const lv = computeLevel(state.points);
    document.getElementById('levelPill').textContent = lv.label;
    const prog = levelProgress(state.points);
    document.getElementById('levelBar').style.width = prog.pct + '%';
    document.getElementById('nextLevelLabel').textContent =
      prog.next === null
        ? 'Nivel máximo alcanzado'
        : `Próximo: ${lv.level === 4 ? 'Máximo' : 'Nivel ' + (lv.level + 1)} (${prog.next} pts)`;

    const ul = document.getElementById('pointsHistory');
    ul.innerHTML = '';
    if (state.history.length === 0) {
      ul.innerHTML = '<li class="empty">Sin movimientos todavía</li>';
      return;
    }
    state.history.slice().reverse().slice(0, 15).forEach(h => {
      const li = document.createElement('li');
      const sign = h.points >= 0 ? '+' : '';
      li.innerHTML = `
        <span>${h.label}</span>
        <span class="h-points ${h.points < 0 ? 'neg' : ''}">${sign}${h.points} pts</span>
      `;
      ul.appendChild(li);
    });
  }

  function addHistory(type, label, points) {
    state.history.push({ type, label, points, ts: Date.now() });
  }

  /* ---------------- Recompensas ---------------- */
  function renderRewards() {
    const wrap = document.getElementById('rewardsList');
    wrap.innerHTML = '';
    REWARDS.forEach(r => {
      const canRedeem = state.points >= r.cost;
      const item = document.createElement('div');
      item.className = 'list-item' + (canRedeem ? '' : ' locked');
      item.innerHTML = `
        <div>
          <h5>${r.icon} ${r.title}</h5>
          <span class="reward-points">${r.cost} pts</span>
        </div>
        <button data-id="${r.id}" ${canRedeem ? '' : 'disabled'}>Canjear</button>
      `;
      item.querySelector('button').addEventListener('click', () => redeem(r));
      wrap.appendChild(item);
    });

    const ul = document.getElementById('redemptionsHistory');
    ul.innerHTML = '';
    if (state.redemptions.length === 0) {
      ul.innerHTML = '<li class="empty">Aún no realizás canjes</li>';
      return;
    }
    state.redemptions.slice().reverse().forEach(rd => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${rd.title}</span><span class="h-points">${rd.code}</span>`;
      ul.appendChild(li);
    });
  }

  function redeem(r) {
    if (state.points < r.cost) {
      showToast('No tenés puntos suficientes', 'error');
      return;
    }
    state.points -= r.cost;
    const code = 'MOVE-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    state.redemptions.push({
      id: r.id, title: r.title, code, ts: Date.now()
    });
    addHistory('canje', 'Canje: ' + r.title, -r.cost);
    persistAll();
    showToast('Canje simulado realizado. Código: ' + code, 'success');
    renderRewards();
  }

  /* ---------------- Cápsulas ---------------- */
  function renderCapsules() {
    const wrap = document.getElementById('capsulesList');
    wrap.innerHTML = '';
    CAPSULES.forEach(cap => {
      const read = state.capsules.includes(cap.id);
      const item = document.createElement('div');
      item.className = 'list-item' + (read ? ' done' : '');
      item.innerHTML = `
        <div>
          <h5>📚 ${cap.title}</h5>
          <span class="challenge-points">${read ? 'Leída' : '+10 pts al leer'}</span>
        </div>
        <button data-id="${cap.id}">${read ? 'Releer' : 'Leer'}</button>
      `;
      item.querySelector('button').addEventListener('click', () => readCapsule(cap));
      wrap.appendChild(item);
    });
  }

  function readCapsule(cap) {
    const alreadyRead = state.capsules.includes(cap.id);
    // Modal simple usando alert para mantener simpleza
    alert(cap.title + '\n\n' + cap.body +
      '\n\n— Información general con fines educativos. No sustituye atención profesional.');
    if (!alreadyRead) {
      state.capsules.push(cap.id);
      state.points += 10;
      addHistory('cápsula', 'Leíste: ' + cap.title, 10);
      persistAll();
      showToast('+10 pts por leer la cápsula', 'success');
      renderCapsules();
    } else {
      showToast('Ya habías leído esta cápsula', 'info');
    }
  }

  /* ---------------- Progreso ---------------- */
  function renderProgress() {
    const totalChallenges = CHALLENGES.length * 3; // meta visual semanal
    const totalCapsules   = CAPSULES.length;
    const goalPoints      = 500;
    const goalRedemptions = 4;

    const c   = state.challenges.length;
    const p   = state.points;
    const ca  = state.capsules.length;
    const rd  = state.redemptions.length;

    document.getElementById('progChallenges').textContent  = c;
    document.getElementById('progPoints').textContent      = p;
    document.getElementById('progCapsules').textContent    = ca;
    document.getElementById('progRedemptions').textContent = rd;

    document.getElementById('progChallengesBar').style.width  = pct(c,  totalChallenges) + '%';
    document.getElementById('progPointsBar').style.width      = pct(p,  goalPoints) + '%';
    document.getElementById('progCapsulesBar').style.width    = pct(ca, totalCapsules) + '%';
    document.getElementById('progRedemptionsBar').style.width = pct(rd, goalRedemptions) + '%';
  }
  function pct(a, b) { return Math.min(100, Math.round((a / b) * 100)); }

  /* ---------------- Perfil ---------------- */
  function renderProfile() {
    document.getElementById('profileConsent').textContent =
      state.consent ? 'Aceptado ✔' : 'No aceptado';
  }

  document.getElementById('resetProgressBtn').addEventListener('click', () => {
    if (!confirm('¿Reiniciar progreso? Se conservará tu consentimiento, pero se borrarán puntos, retos, cápsulas y canjes.')) return;
    state.points = 0;
    state.challenges = [];
    state.capsules = [];
    state.redemptions = [];
    state.history = [];
    state.sedentary = 0;
    persistAll();
    showToast('Progreso reiniciado', 'info');
    renderProfile();
    go('dashboard');
  });

  document.getElementById('clearAllBtn').addEventListener('click', () => {
    if (!confirm('¿Borrar TODOS los datos y el consentimiento? Esto te llevará nuevamente al inicio.')) return;
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    state.consent = false;
    state.points = 0;
    state.challenges = [];
    state.capsules = [];
    state.redemptions = [];
    state.history = [];
    state.sedentary = 0;
    consentCheck.checked = false;
    consentBtn.disabled = true;
    showToast('Todos los datos fueron borrados', 'info');
    go('welcome');
  });

  /* ---------------- Sedentario simulado ---------------- */
  // Aumenta de a poquito el tiempo sedentario simulado cada vez que se abre
  function simulateSedentary() {
    state.sedentary += Math.floor(Math.random() * 15) + 5;
    persistAll();
  }

  /* ---------------- Navbar mobile ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ---------------- Init ---------------- */
  function init() {
    simulateSedentary();
    if (state.consent) {
      go('dashboard');
    } else {
      go('welcome');
    }
  }

  init();
})();

/* =====================================================
   PWA — Service Worker + Install Prompt
===================================================== */
(function () {
  'use strict';

  /* ---------------- Registrar service worker ---------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('[PWA] Service Worker registrado:', reg.scope))
        .catch(err => console.warn('[PWA] Error registrando SW:', err));
    });
  }

  /* ---------------- Detectores de plataforma ---------------- */
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  /* ---------------- Elementos DOM ---------------- */
  const installBtn  = document.getElementById('installBtn');
  const modal       = document.getElementById('pwaModal');
  const modalClose  = document.getElementById('pwaModalClose');
  const iosHelp     = document.getElementById('pwaIosHelp');
  const androidHelp = document.getElementById('pwaAndroidHelp');
  const desktopHelp = document.getElementById('pwaDesktopHelp');

  let deferredPrompt = null;

  /* ---------------- Si ya está instalada, ocultar botón ---------------- */
  if (isStandalone) {
    if (installBtn) installBtn.hidden = true;
  } else {
    // Mostrar siempre el botón si no está instalada (con instrucciones
    // adecuadas según plataforma cuando no haya evento de install).
    if (installBtn) installBtn.hidden = false;
  }

  /* ---------------- Capturar prompt nativo (Chrome/Edge/Android) ---------------- */
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });

  /* ---------------- Mostrar modal con instrucciones por plataforma ---------------- */
  function showInstallModal() {
    if (!modal) return;
    iosHelp.hidden = !isIOS;
    androidHelp.hidden = !(isAndroid && !deferredPrompt);
    desktopHelp.hidden = isIOS || isAndroid;
    modal.hidden = false;
  }

  function hideModal() {
    if (modal) modal.hidden = true;
  }

  if (modalClose) modalClose.addEventListener('click', hideModal);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  /* ---------------- Click sobre el botón "Instalar" ---------------- */
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          installBtn.hidden = true;
        }
        deferredPrompt = null;
      } else {
        // Sin prompt nativo (iOS o navegador que no lo soporta) → mostrar modal
        showInstallModal();
      }
    });
  }

  /* ---------------- Detectar instalación exitosa ---------------- */
  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.hidden = true;
    deferredPrompt = null;
    console.log('[PWA] App instalada con éxito');
  });

  /* ---------------- Soporte para shortcuts (deep links) ---------------- */
  const params = new URLSearchParams(window.location.search);
  const targetScreen = params.get('screen');
  if (targetScreen) {
    window.addEventListener('load', () => {
      // Solo si ya hay consentimiento
      const consent = localStorage.getItem('mt_consent');
      if (consent === 'true') {
        const btn = document.querySelector('[data-go="' + targetScreen + '"]');
        if (btn) btn.click();
        document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();
