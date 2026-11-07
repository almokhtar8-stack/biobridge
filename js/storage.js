/* Local progress storage: versioned, migrates BioBridge 1.0 progress, survives private-mode failures, exports/imports JSON. */
(function () {
  'use strict';
  const BB = window.BB;
  const KEY = BB.config.storageKey;
  const LEGACY = BB.config.legacyStorageKey;

  const blank = () => ({
    v: 2, createdAt: Date.now(), updatedAt: Date.now(),
    lessons: {},          // id -> { visited, checks: {i: bool}, checkPassed, teach, teachTs, selfCheck: [], completed }
    attempts: [],         // { q, o: [objectives], c: 0|1, t, m: mode, l: level, g: generator key or null }
    review: {},           // itemKey -> { box, due, obj, last, kind: 'q'|'gen'|'check', ref }
    sessions: [],         // { id, mode, t, n, correct, secs, byObj, label }
    diagnostic: null,     // { t, results: {obj: [correct, total]}, unsure: n, recommended: [lessonIds] }
    labs: {},             // labId -> { done: ts }
    missions: {},         // missionId -> { done: ts }
    traces: {},           // programId -> { done: ts }
    companion: { seen: {}, last: null },  // Companion topics viewed (a reminder only, never scored): id -> ts; last opened id
    settings: { theme: 'system', courseStatus: {}, dailyMinutes: 45 },
    legacy: null
  });

  // Repair saved or imported data whose fields have the wrong type, so a damaged file can never crash the app.
  const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  function sanitize(input) {
    const src = isObj(input) ? input : {};
    const out = Object.assign(blank(), src);
    for (const k of ['lessons', 'review', 'labs', 'missions', 'traces']) if (!isObj(out[k])) out[k] = {};
    for (const k of ['attempts', 'sessions']) out[k] = Array.isArray(out[k]) ? out[k].filter(isObj) : [];
    for (const [id, L] of Object.entries(out.lessons)) if (!isObj(L)) delete out.lessons[id];
    for (const [k, r] of Object.entries(out.review)) if (!isObj(r) || typeof r.due !== 'number') delete out.review[k];
    out.settings = Object.assign(blank().settings, isObj(src.settings) ? src.settings : {});
    if (!isObj(out.settings.courseStatus)) out.settings.courseStatus = {};
    if (!isObj(out.companion)) out.companion = { seen: {}, last: null };
    if (!isObj(out.companion.seen)) out.companion.seen = {};
    for (const [id, t] of Object.entries(out.companion.seen)) if (typeof t !== 'number') delete out.companion.seen[id];
    if (typeof out.companion.last !== 'string') out.companion.last = null;
    if (out.diagnostic != null && !(isObj(out.diagnostic) && isObj(out.diagnostic.byObj))) out.diagnostic = null;
    const okQ = (q) => isObj(q) && Array.isArray(q.options) && q.options.length > 0 && typeof q.answer === 'number';
    const a = out.activeSession;
    if (a != null) {
      if (isObj(a) && Array.isArray(a.items) && a.items.length && a.items.every(okQ) && Array.isArray(a.answers) && a.answers.length === a.items.length) {
        const n = a.items.length;
        for (const k of ['unsure', 'flags', 'firstTry', 'seeds']) {
          if (!Array.isArray(a[k]) || a[k].length !== n) a[k] = a.items.map(() => (k === 'seeds' ? BB.seed() : k === 'firstTry' ? null : false));
        }
        a.at = Math.min(Math.max(0, Number.isInteger(a.at) ? a.at : 0), n - 1);
      } else out.activeSession = null;
    }
    if (out.lastResult != null && !(isObj(out.lastResult) && Array.isArray(out.lastResult.items) && out.lastResult.items.every(okQ))) out.lastResult = null;
    return out;
  }

  let state = blank();
  let available = true;
  let lastError = null;
  let loadError = null;

  function test() {
    try { const k = '__bb_test__'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch (e) { return false; }
  }

  function migrateLegacy(s) {
    try {
      const raw = localStorage.getItem(LEGACY);
      if (!raw || s.legacy) return false;
      const old = JSON.parse(raw) || {};
      const done = Array.isArray(old.done) ? old.done : [];
      let moved = 0;
      for (const oldId of done) {
        const id = BB.legacyLessonMap[oldId];
        if (!id) continue;
        const L = s.lessons[id] = s.lessons[id] || {};
        if (!L.completed) { L.completed = Date.now(); L.fromV1 = true; L.visited = L.visited || Date.now(); moved++; }
      }
      const hist = Array.isArray(old.practiceHistory) ? old.practiceHistory : [];
      for (const p of hist) s.sessions.push({ id: 'v1-' + (p.at || Math.random()), mode: 'v1', t: Date.parse(p.at) || Date.now(), n: null, correct: null, pct: p.score, label: 'Practice check from BioBridge 1.0' });
      s.legacy = { migratedAt: Date.now(), lessons: moved, sessions: hist.length };
      return true;
    } catch (e) { return false; }
  }

  function load() {
    available = test();
    if (!available) { state = blank(); return state; }
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        state = sanitize(JSON.parse(raw));
      } else state = blank();
    } catch (e) {
      // Keep the unreadable text so it is not lost when the fresh state is saved over it.
      try { localStorage.setItem(KEY + '-unreadable-backup', localStorage.getItem(KEY)); } catch (e2) { /* storage full or blocked */ }
      state = blank();
      loadError = lastError = 'Saved progress could not be read and was reset. A copy of the unreadable data was kept in this browser.';
    }
    if (migrateLegacy(state)) persist();
    return state;
  }

  let timer = null;
  function persist() {
    if (!available) return;
    try {
      state.updatedAt = Date.now();
      if (state.attempts.length > 4000) state.attempts = state.attempts.slice(-4000);
      if (state.sessions.length > 120) state.sessions = state.sessions.slice(-120);
      localStorage.setItem(KEY, JSON.stringify(state));
      lastError = null;
    } catch (e) {
      lastError = 'Your browser refused to save progress (storage may be full or disabled). Use Export on the About page to keep a copy.';
      BB.emit('storage-error', lastError);
    }
  }
  function saveSoon() { clearTimeout(timer); timer = setTimeout(persist, 150); }
  function saveNow() { clearTimeout(timer); persist(); }
  window.addEventListener('pagehide', saveNow);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); });

  function exportJSON() {
    const data = JSON.stringify({ app: 'BioBridge', exportedAt: new Date().toISOString(), version: BB.config.version, state }, null, 1);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'biobridge-progress-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function importJSON(text) {
    const parsed = JSON.parse(text);
    const incoming = parsed && parsed.state ? parsed.state : parsed;
    if (!isObj(incoming) || !isObj(incoming.lessons)) throw new Error('This file does not look like a BioBridge progress export.');
    state = sanitize(incoming);
    saveNow();
  }
  function reset() { state = blank(); state.legacy = { skipped: true }; saveNow(); }

  BB.store = {
    load, saveSoon, saveNow, exportJSON, importJSON, reset, sanitize,
    get state() { return state; },
    get available() { return available; },
    get error() { return lastError; },
    get loadError() { return loadError; },
    lesson(id) { return state.lessons[id] = state.lessons[id] || {}; },
    peekLesson(id) { return state.lessons[id] || {}; }
  };
})();
