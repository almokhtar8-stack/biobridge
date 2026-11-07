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
    settings: { theme: 'system', courseStatus: {}, dailyMinutes: 45 },
    legacy: null
  });

  let state = blank();
  let available = true;
  let lastError = null;

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
        const parsed = JSON.parse(raw);
        state = Object.assign(blank(), parsed);
        state.settings = Object.assign(blank().settings, parsed.settings || {});
      } else state = blank();
    } catch (e) { state = blank(); lastError = 'Saved progress could not be read and was reset.'; }
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
    if (!incoming || typeof incoming !== 'object' || !('lessons' in incoming)) throw new Error('This file does not look like a BioBridge progress export.');
    state = Object.assign(blank(), incoming);
    state.settings = Object.assign(blank().settings, incoming.settings || {});
    saveNow();
  }
  function reset() { state = blank(); state.legacy = { skipped: true }; saveNow(); }

  BB.store = {
    load, saveSoon, saveNow, exportJSON, importJSON, reset,
    get state() { return state; },
    get available() { return available; },
    get error() { return lastError; },
    lesson(id) { return state.lessons[id] = state.lessons[id] || {}; },
    peekLesson(id) { return state.lessons[id] || {}; }
  };
})();
