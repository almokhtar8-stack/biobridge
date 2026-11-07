/* UI shell: icons, layout, navigation, glossary drawer, dialogs, toasts, theme, shared renderers (code blocks, multiple choice). */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, esc, md, $, $$ } = BB;

  const P = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    home: P('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>'),
    learn: P('<path d="M3 5.5C3 4.7 3.7 4 4.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4.5c-.8 0-1.5-.7-1.5-1.5z"/><path d="M21 5.5c0-.8-.7-1.5-1.5-1.5H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h5.5c.8 0 1.5-.7 1.5-1.5z"/>'),
    courses: P('<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3M7 9h6M7 13h10"/>'),
    labs: P('<path d="M9 3h6M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3"/><path d="M7.5 15h9"/>'),
    practice: P('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
    review: P('<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>'),
    progress: P('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    glossary: P('<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 8h8M8 12h6"/>'),
    notebook: P('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>'),
    plan: P('<path d="M4 6h16M4 12h10M4 18h7"/><circle cx="18" cy="17" r="3"/>'),
    about: P('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
    menu: P('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    more: P('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'),
    close: P('<path d="M6 6l12 12M18 6 6 18"/>'),
    search: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    sun: P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: P('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
    check: P('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    right: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    left: P('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    up: P('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    down: P('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    play: P('<path d="M7 4.5v15l12-7.5z"/>'),
    next: P('<path d="M6 5l8 7-8 7"/><path d="M18 5v14"/>'),
    prev: P('<path d="M18 5l-8 7 8 7"/><path d="M6 5v14"/>'),
    reset: P('<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 5v6h6"/>'),
    terminal: P('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M12 15h5"/>'),
    dna: P('<path d="M7 3c0 6 10 6 10 12 0 3-2 5-5 6"/><path d="M17 3c0 6-10 6-10 12 0 3 2 5 5 6"/><path d="M8.5 7h7M8.5 17h7"/>'),
    code: P('<path d="m9 8-5 4 5 4M15 8l5 4-5 4"/>'),
    stats: P('<path d="M3 20h18"/><circle cx="7" cy="14" r="1.6"/><circle cx="11" cy="9" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="19" cy="6" r="1.6"/>'),
    external: P('<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>'),
    download: P('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
    upload: P('<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>'),
    clock: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    bulb: P('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"/>'),
    alert: P('<path d="M12 4 2.5 20h19z"/><path d="M12 10v4M12 17v.5"/>'),
    copy: P('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
    flag: P('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    star: P('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
    bridge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 16c3-8 17-8 20 0"/><path d="M6 12v6M10 10.3V18M14 10.3V18M18 12v6M2 18h20"/></svg>'
  };
  const icon = (name) => { const s = document.createElement('span'); s.innerHTML = ICONS[name] || ''; s.style.display = 'contents'; return s; };

  const NAV = [
    { id: 'home', label: 'Home', href: '#/', icon: 'home', tab: true },
    { id: 'learn', label: 'Learn', href: '#/learn', icon: 'learn', tab: true },
    { id: 'courses', label: 'Course companion', href: '#/courses', icon: 'courses' },
    { id: 'labs', label: 'Interactive labs', href: '#/labs', icon: 'labs' },
    { id: 'practice', label: 'Placement practice', href: '#/practice', icon: 'practice', tab: true, short: 'Practice' },
    { id: 'review', label: 'Review queue', href: '#/review', icon: 'review', tab: true, short: 'Review' },
    { id: 'progress', label: 'Progress', href: '#/progress', icon: 'progress' },
    { id: 'glossary', label: 'Glossary', href: '#/glossary', icon: 'glossary' },
    { id: 'notebook', label: 'My explanations', href: '#/notebook', icon: 'notebook' },
    { id: 'plan', label: 'Study plan', href: '#/plan', icon: 'plan' },
    { id: 'about', label: 'About, data and help', href: '#/about', icon: 'about' }
  ];

  let current = 'home';
  let lastFocus = null;

  function navLinks(withCounts) {
    const due = BB.practice ? BB.practice.dueCount() : 0;
    return h('nav.nav-list', { 'aria-label': 'Main' },
      h('div.nav-label', 'Learn'),
      NAV.slice(0, 4).map((n) => link(n)),
      h('div.nav-label', 'Practice'),
      NAV.slice(4, 7).map((n) => link(n)),
      h('div.nav-label', 'Tools'),
      NAV.slice(7).map((n) => link(n)));
    function link(n) {
      const a = h('a.nav-link', { href: n.href, 'data-nav': n.id }, icon(n.icon), h('span', n.label));
      if (n.id === 'review' && due && withCounts) a.append(h('span.count', { 'aria-label': due + ' items due' }, String(due)));
      return a;
    }
  }

  function buildShell() {
    const app = $('#app');
    app.innerHTML = '';
    const done = BB.lessonsDone ? BB.lessonsDone() : 0;
    const total = Object.keys(BB.lessonMeta).length;
    const side = h('aside.sidebar', { 'aria-label': 'Sidebar' },
      h('a.brand', { href: '#/' }, h('span.mark', { html: ICONS.bridge }), h('span', 'BioBridge', h('small', 'Bioinformatics foundations'))),
      navLinks(true),
      h('div.side-meter', { id: 'side-meter' }, h('strong', `${done} / ${total}`), 'lessons explained in your own words', h('div.meter', h('span', { style: { width: BB.pct(done, total) + '%' } }))),
      h('div.side-foot', 'Independent learning companion. Not affiliated with, endorsed by or run by KAUST, KAUST Academy, Coursera, Rice University or IBM.'));
    const top = h('header.topbar',
      h('button.icon-btn.menu-btn', { type: 'button', 'aria-label': 'Open menu', onclick: () => openDrawer('nav-drawer') }, icon('menu')),
      h('a.brand', { href: '#/' }, h('span.mark', { html: ICONS.bridge }), 'BioBridge'),
      h('div.crumb', { id: 'crumb', 'aria-live': 'polite' }),
      h('div.actions',
        h('button.icon-btn', { type: 'button', id: 'gloss-btn', 'aria-label': 'Open glossary', title: 'Glossary', onclick: () => openGlossary() }, icon('glossary')),
        h('button.icon-btn', { type: 'button', id: 'theme-btn', 'aria-label': 'Change color theme', title: 'Theme', onclick: cycleTheme }, icon(themeIcon()))));
    const main = h('main.main', { id: 'main', tabindex: '-1' });
    const tabbar = h('nav.tabbar', { 'aria-label': 'Quick navigation' },
      NAV.filter((n) => n.tab).map((n) => h('a', { href: n.href, 'data-nav': n.id }, icon(n.icon), h('span', n.short || n.label), n.id === 'review' ? h('span.badge-dot', { id: 'tab-due', hidden: true }) : null)),
      h('button', { type: 'button', 'aria-label': 'More pages', onclick: () => openDrawer('nav-drawer') }, icon('more'), h('span', 'More')));
    const navDrawer = drawer('nav-drawer', 'Menu', 'left', navLinks(true));
    const glossDrawer = drawer('gloss-drawer', 'Glossary', 'right', glossaryPanel());
    const toasts = h('div.toast-zone', { id: 'toasts', role: 'status', 'aria-live': 'polite' });
    app.append(side, h('div.shell', top, main), tabbar, navDrawer, glossDrawer, toasts);
    navDrawer.addEventListener('click', (e) => { if (e.target.closest('a')) closeDrawer('nav-drawer'); });
    applyNav();
  }

  function drawer(id, title, side, body) {
    const el = h('div.drawer', { id, role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('div.drawer-backdrop', { onclick: () => closeDrawer(id) }),
      h('div.drawer-panel.' + side,
        h('div.drawer-head', h('h2', title), h('button.icon-btn', { type: 'button', 'aria-label': 'Close ' + title.toLowerCase(), onclick: () => closeDrawer(id) }, icon('close'))),
        h('div.drawer-body', body)));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeDrawer(id); }
      if (e.key === 'Tab') trapFocus(e, el.querySelector('.drawer-panel'));
    });
    return el;
  }
  function trapFocus(e, root) {
    const f = $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', root).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openDrawer(id) {
    lastFocus = document.activeElement;
    const d = document.getElementById(id);
    d.classList.add('open');
    document.body.style.overflow = 'hidden';
    const target = d.querySelector('input, a, button');
    setTimeout(() => target && target.focus(), 30);
  }
  function closeDrawer(id) {
    const d = document.getElementById(id);
    if (!d || !d.classList.contains('open')) return;
    d.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  /* ---------- Glossary drawer ---------- */
  function sortedGlossary() { return (BB.glossary || []).slice().sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })); }
  function glossEntryNode(g, focus) {
    const meta = BB.lessonMeta[g.lesson];
    return h('div.gloss-item' + (focus ? '.focus' : ''), { 'data-key': BB.glossaryKey(g), id: 'g-' + BB.glossaryKey(g).replace(/[^a-z0-9]+/g, '-') },
      h('h3', g.term),
      g.aka && g.aka.length ? h('div.aka', 'Also: ' + g.aka.join(', ')) : null,
      h('p', { html: md(g.def) }),
      h('div.why', { html: md(g.why) }),
      meta ? h('a.small', { href: '#/lesson/' + g.lesson }, 'Lesson: ' + meta.title) : null);
  }
  function glossaryPanel() {
    const input = h('input', { type: 'search', placeholder: 'Search terms, e.g. FASTQ, pipe, p-value', 'aria-label': 'Search the glossary', id: 'gloss-search', autocomplete: 'off' });
    const list = h('div', { id: 'gloss-list', 'aria-live': 'polite' });
    const draw = (focusKey) => {
      const q = input.value.trim().toLowerCase();
      const items = sortedGlossary().filter((g) => !q || (g.term + ' ' + (g.aka || []).join(' ') + ' ' + g.def).toLowerCase().includes(q));
      list.innerHTML = '';
      if (!items.length) { list.append(h('p.empty', 'No matching term. Try a shorter word.')); return; }
      if (focusKey) {
        const f = items.find((g) => BB.glossaryKey(g) === focusKey);
        if (f) list.append(glossEntryNode(f, true), h('div.gloss-letter', 'All terms'));
      }
      for (const g of items) if (BB.glossaryKey(g) !== focusKey) list.append(glossEntryNode(g, false));
    };
    input.addEventListener('input', () => draw(null));
    BB.on('glossary-focus', (key) => { input.value = ''; draw(key); const body = document.querySelector('#gloss-drawer .drawer-body'); if (body) body.scrollTop = 0; });
    setTimeout(() => draw(null), 0);
    return h('div', h('p.small.muted', 'Plain-English definitions. Terms with a dotted underline in lessons open here.'), input, h('div', { style: { marginTop: '10px' } }, list));
  }
  function openGlossary(key) {
    openDrawer('gloss-drawer');
    BB.emit('glossary-focus', key || null);
    if (key) setTimeout(() => { const n = document.querySelector('#gloss-drawer .gloss-item.focus'); if (n) { n.setAttribute('tabindex', '-1'); n.focus(); } }, 60);
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.term-link');
    if (t) { e.preventDefault(); openGlossary(t.dataset.term); }
  });

  /* ---------- Theme ---------- */
  function themeIcon() { const t = BB.store.state.settings.theme; return t === 'dark' ? 'moon' : 'sun'; }
  function applyTheme() {
    const t = BB.store.state.settings.theme;
    const dark = t === 'dark' || (t === 'system' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    // Match the phone browser bar to the top bar: navy behind the desktop sidebar, the page surface on phones and tablets.
    if (meta) meta.setAttribute('content', window.innerWidth >= 1024 ? (dark ? '#0c1620' : '#0f1e2c') : (dark ? '#12202c' : '#ffffff'));
  }
  function cycleTheme() {
    const s = BB.store.state.settings;
    s.theme = s.theme === 'system' ? 'dark' : s.theme === 'dark' ? 'light' : 'system';
    BB.store.saveSoon();
    applyTheme();
    const b = $('#theme-btn'); if (b) { b.innerHTML = ''; b.append(icon(themeIcon())); }
    toast(s.theme === 'system' ? 'Theme follows your device setting' : s.theme === 'dark' ? 'Dark theme' : 'Light theme');
  }
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  /* ---------- Page plumbing ---------- */
  function applyNav() {
    $$('[data-nav]').forEach((a) => { if (a.dataset.nav === current) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const due = BB.practice ? BB.practice.dueCount() : 0;
    const dot = $('#tab-due'); if (dot) { dot.hidden = !due; dot.textContent = due > 99 ? '99+' : String(due); }
    $$('.nav-link[data-nav="review"] .count').forEach((c) => c.remove());
    if (due) $$('.nav-link[data-nav="review"]').forEach((a) => a.append(h('span.count', { 'aria-label': due + ' items due' }, String(due))));
    const sm = $('#side-meter');
    if (sm && BB.lessonsDone) {
      const done = BB.lessonsDone(), total = Object.keys(BB.lessonMeta).length;
      sm.innerHTML = '';
      sm.append(h('strong', `${done} / ${total}`), 'lessons explained in your own words', h('div.meter', h('span', { style: { width: BB.pct(done, total) + '%' } })));
    }
  }
  function setPage(nav, title, crumb) {
    current = nav;
    document.title = (title ? title + ' | ' : '') + 'BioBridge';
    const c = $('#crumb'); if (c) c.textContent = crumb || title || '';
    applyNav();
  }
  function mount(node, opts = {}) {
    const main = $('#main');
    main.innerHTML = '';
    main.append(node);
    if (!opts.keepScroll) window.scrollTo(0, 0);
    if (!opts.noFocus) main.focus({ preventScroll: true });
    BB.emit('mounted');
  }

  function toast(msg, ms = 2600) {
    const z = $('#toasts'); if (!z) return;
    const t = h('div.toast', msg);
    z.append(t);
    setTimeout(() => t.remove(), ms);
  }

  function modal({ title, body, wide, onClose }) {
    const d = h('dialog.modal' + (wide ? '.wide' : ''), { 'aria-label': title },
      h('div.modal-head', h('h2', title), h('button.icon-btn', { type: 'button', 'aria-label': 'Close', onclick: () => d.close() }, icon('close'))),
      h('div.modal-body', body));
    d.addEventListener('close', () => { d.remove(); if (onClose) onClose(); });
    document.body.append(d);
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    return d;
  }

  /* ---------- Shared renderers ---------- */
  const LANG = { bash: 'Bash', python: 'Python', r: 'R', text: 'Text', fasta: 'FASTA', fastq: 'FASTQ', tsv: 'TSV table' };
  function codeBlock({ lang, code, output, run, label }) {
    const head = h('div.code-label', h('span', label || LANG[lang] || lang || 'Code'));
    const btns = h('span.btn-row');
    if (run && lang === 'python' && BB.pyrun) btns.append(h('button.btn', { type: 'button', onclick: () => BB.pyrun.open(code) }, icon('play'), 'Run real Python'));
    btns.append(h('button.btn', { type: 'button', 'aria-label': 'Copy code', onclick: () => copyText(code) }, icon('copy'), 'Copy'));
    head.append(btns);
    const block = h('div.code-block', head, h('pre', h('code', code)));
    if (output == null) return block;
    return h('div', block, h('div.output-block', output));
  }
  function copyText(text) {
    const done = () => toast('Copied');
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      const ta = h('textarea', { style: { position: 'fixed', top: '-200px' } }); ta.value = text; document.body.append(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Copy is not available here; select the text instead.'); }
      ta.remove();
    }
  }

  /* Multiple-choice question.
     q: { q, code?, options: [{t, why}], answer, explain?, noShuffle? }
     opts: { mode: 'instant'|'select', retry: bool, onAnswer(correct, chosenIndex, q), mono: bool, seed } */
  function mcq(q, opts = {}) {
    const mode = opts.mode || 'instant';
    const order = (q.noShuffle || q.options.length <= 2 && /^(true|false)$/i.test(q.options[0].t)) ? q.options.map((_, i) => i) : BB.rng(opts.seed || BB.seed()).shuffle(q.options.map((_, i) => i));
    const mono = opts.mono != null ? opts.mono : !!(q.verify || q.options.some((o) => /\n/.test(o.t)));
    const wrap = h('div.q-card' + (opts.flat ? '' : ''));
    if (opts.meta) wrap.append(opts.meta);
    wrap.append(h('div.q-text', { html: md(q.q) }));
    if (q.code) wrap.append(codeBlock({ lang: q.code.lang, code: q.code.src }));
    const list = h('div.options', { role: 'group', 'aria-label': 'Answer options' });
    const fb = h('div', { 'aria-live': 'polite' });
    const keys = 'ABCDE';
    let answered = false;
    order.forEach((oi, k) => {
      const o = q.options[oi];
      const b = h('button.option', { type: 'button', 'data-i': oi, 'aria-pressed': 'false' },
        h('span.key', { 'aria-hidden': 'true' }, keys[k]),
        mono ? h('span.opt-pre', o.t) : h('span', { html: md(o.t) }));
      b.addEventListener('click', () => choose(oi, b));
      list.append(b);
    });
    wrap.append(list, fb);
    if (opts.selected != null) setTimeout(() => { const b = list.querySelector(`[data-i="${opts.selected}"]`); if (b) b.setAttribute('aria-pressed', 'true'); }, 0);

    function choose(oi, btn) {
      if (mode === 'select') {
        $$('.option', list).forEach((x) => x.setAttribute('aria-pressed', x === btn ? 'true' : 'false'));
        if (opts.onAnswer) opts.onAnswer(oi === q.answer, oi, q);
        return;
      }
      if (answered) return;
      answered = true;
      const correct = oi === q.answer;
      $$('.option', list).forEach((x) => {
        const i = +x.dataset.i;
        x.disabled = true;
        if (i === q.answer) x.classList.add('correct');
        if (i === oi && !correct) x.classList.add('wrong');
        if (i === oi) x.setAttribute('aria-pressed', 'true');
      });
      const chosen = q.options[oi], right = q.options[q.answer];
      fb.innerHTML = '';
      const box = h('div.feedback.' + (correct ? 'good' : 'bad'));
      if (correct) {
        box.append(h('strong.lead', 'Correct.'), h('div', { html: md(stripLead(right.why)) }));
      } else {
        box.append(h('strong.lead', 'Not quite. Here is why that answer does not work:'), h('div', { html: md(chosen.why) }),
          h('div.also', h('strong', 'The answer is: '), h('span', { html: md(right.t) }), '. ', h('span', { html: md(stripLead(right.why)) })));
      }
      if (q.explain && !correct) box.append(h('div.also', { html: md(q.explain) }));
      if (q.explain && correct && opts.showExplainOnCorrect) box.append(h('div.also', { html: md(q.explain) }));
      fb.append(box);
      if (!correct && opts.retry) fb.append(h('div.btn-row', { style: { marginTop: '10px' } }, h('button.btn.btn-sm', { type: 'button', onclick: () => { const fresh = mcq(q, Object.assign({}, opts, { seed: BB.seed() })); wrap.replaceWith(fresh); const f = fresh.querySelector('.option'); if (f) f.focus(); } }, icon('reset'), 'Try again')));
      if (opts.onAnswer) opts.onAnswer(correct, oi, q);
    }
    return wrap;
  }
  const stripLead = (s) => String(s || '').replace(/^(Correct|Right|Yes)[.:!,]\s*/i, '');

  BB.ui = { icon, ICONS, buildShell, setPage, mount, toast, modal, codeBlock, mcq, copyText, openGlossary, openDrawer, closeDrawer, applyTheme, applyNav, NAV };
})();
