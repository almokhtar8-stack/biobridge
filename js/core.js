/* Core utilities: DOM helpers, escaping, events, seeded randomness, routing. */
(function () {
  'use strict';
  const BB = window.BB = window.BB || {};

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* h('div.card#id', {attrs}, children...) builds DOM nodes. Strings are text (escaped). */
  function h(tag, attrs, ...children) {
    const m = /^([a-z0-9-]+)?((?:[.#][\w-]+)*)$/i.exec(tag) || [];
    const el = document.createElement(m[1] || 'div');
    (m[2] || '').replace(/([.#])([\w-]+)/g, (_, t, v) => { if (t === '.') el.classList.add(v); else el.id = v; return ''; });
    if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { children.unshift(attrs); attrs = null; }
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }
  function frag(html) { const t = document.createElement('template'); t.innerHTML = html; return t.content; }

  /* Simple event bus */
  const listeners = {};
  const on = (ev, fn) => ((listeners[ev] = listeners[ev] || []).push(fn), () => off(ev, fn));
  const off = (ev, fn) => { listeners[ev] = (listeners[ev] || []).filter((f) => f !== fn); };
  const emit = (ev, data) => (listeners[ev] || []).slice().forEach((fn) => { try { fn(data); } catch (e) { console.error(e); } });

  /* Seeded RNG (mulberry32) so generated questions are reproducible within a session */
  function rng(seed) {
    let a = (seed >>> 0) || 1;
    const next = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const r = { next, int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)), pick: (arr) => arr[Math.floor(next() * arr.length)], shuffle: (arr) => { const a2 = arr.slice(); for (let i = a2.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a2[i], a2[j]] = [a2[j], a2[i]]; } return a2; }, chance: (p) => next() < p };
    return r;
  }
  const seed = () => (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
  const shuffle = (arr) => rng(seed()).shuffle(arr);

  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const uid = () => Math.random().toString(36).slice(2, 10);
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const daysLeft = () => { const ms = new Date(BB.config.deadline).getTime() - Date.now(); return ms <= 0 ? 0 : Math.ceil(ms / 86400000); };
  const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
  const DAY = 86400000;

  /* Hash router: #/path/parts?query */
  const routes = [];
  function route(pattern, handler) { routes.push({ re: new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '/?$'), handler }); }
  // A second # after the route (#/courses#ibm) names a section on that page to scroll to.
  function currentPath() { const raw = location.hash.replace(/^#/, '') || '/'; const [main, anchor] = raw.split('#'); const [p, q] = main.split('?'); return { path: p || '/', query: new URLSearchParams(q || ''), anchor: anchor || '' }; }
  function go(path, replace) { const url = '#' + path; if (replace) history.replaceState(null, '', url); else if (location.hash !== url) location.hash = url; else dispatch(); if (replace) dispatch(); }
  function dispatch() {
    const { path, query, anchor } = currentPath();
    for (const r of routes) {
      const m = r.re.exec(path);
      if (m) {
        r.handler(Object.assign({}, m.groups || {}), query, path);
        if (anchor) requestAnimationFrame(() => { const el = document.getElementById(anchor); if (el) el.scrollIntoView({ block: 'start' }); });
        return;
      }
    }
    go('/', true);
  }

  Object.assign(BB, { esc, $, $$, h, frag, on, off, emit, rng, seed, shuffle, pct, clamp, fmt, uid, debounce, daysLeft, today, DAY, route, go, dispatch, currentPath });
})();
