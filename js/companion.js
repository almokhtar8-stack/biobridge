/* Companion (BioBridge 2.2): the default, lecture-aligned experience.
   Home asks "Which course and topic are you studying right now?", then a 2 to 4 minute topic page explains one
   lecture idea with a visual, a tiny verified example, an optional try-it and one unscored question, and sends the
   student back to Coursera. Nothing here is scored or required. Also: search and the visual library. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  const S = () => BB.store.state;
  const ORDER = ['ibm', 'rice', 'kaust'];
  const META = {
    ibm: { icon: 'terminal', what: 'Linux commands and shell scripting', cls: 'f1' },
    rice: { icon: 'code', what: 'Python: expressions, functions, logic and modules', cls: 'f2' },
    kaust: { icon: 'dna', what: 'R, statistics, Python data tools and RNA-seq', cls: 'f3' }
  };
  const homePath = (p) => String(p || '~/project').replace(/^~/, '/home/student');

  /* ---------- index ---------- */
  let IDX = null;
  function index() {
    if (IDX) return IDX;
    const topics = (BB.companion || []).filter((t) => t && t.id && BB.courses[t.course]);
    const byId = {}, byCourse = {}, byDiagram = {};
    for (const k of Object.keys(BB.courses)) byCourse[k] = BB.courses[k].modules.map((m) => ({ mod: m, topics: [] }));
    for (const t of topics) {
      byId[t.id] = t;
      const m = byCourse[t.course].find((x) => x.mod.id === t.module);
      if (m) m.topics.push(t);
      if (t.visual && t.visual.diagram) (byDiagram[t.visual.diagram] = byDiagram[t.visual.diagram] || []).push(t);
    }
    const flat = {};
    for (const k of Object.keys(byCourse)) flat[k] = byCourse[k].flatMap((m) => m.topics);
    IDX = { topics, byId, byCourse, flat, byDiagram };
    return IDX;
  }
  const modOf = (t) => BB.courses[t.course].modules.find((m) => m.id === t.module) || { n: '?', title: '' };
  const seen = () => { const c = S().companion; return (c && c.seen) || {}; };
  function markSeen(id) {
    const st = S();
    if (!st.companion || typeof st.companion !== 'object') st.companion = { seen: {}, last: null };
    st.companion.seen = st.companion.seen || {};
    st.companion.seen[id] = Date.now();
    st.companion.last = id;
    BB.store.saveSoon();
  }

  /* ---------- search ---------- */
  const clean = (s) => String(s || '').toLowerCase().replace(/[`*]/g, ' ');
  const tokens = (s) => clean(s).split(/[^a-z0-9.~$#|>_+-]+/).filter(Boolean);
  function search(q, limit) {
    const words = tokens(q);
    if (!words.length) return [];
    const out = [];
    for (const t of index().topics) {
      const title = clean(t.title), kw = clean((t.keywords || []).join(' | ')), lec = clean((t.lectures || []).join(' | ') + ' ' + (t.about || '')), body = clean(t.explain + ' ' + t.why + ' ' + (t.example ? t.example.code : ''));
      const tok = new Set(tokens(t.title + ' ' + (t.keywords || []).join(' ') + ' ' + (t.example ? t.example.code : '')));
      let score = 0;
      for (const w of words) {
        let s = 0;
        if (w.length <= 2) { if (tok.has(w)) s = 6; }
        else { if (title.includes(w)) s += 6; if (kw.includes(w)) s += 4; if (lec.includes(w)) s += 3; if (body.includes(w)) s += 1; }
        if (!s) { score = 0; break; }
        score += s;
      }
      if (score) out.push([score + (title.startsWith(words[0]) ? 2 : 0), t]);
    }
    return out.sort((a, b) => b[0] - a[0]).slice(0, limit || 12).map((x) => x[1]);
  }
  function searchExtras(q) {
    const words = tokens(q).filter((w) => w.length > 2);
    if (!words.length) return { lessons: [], terms: [] };
    const has = (s) => words.every((w) => clean(s).includes(w));
    const lessons = Object.entries(BB.lessonMeta).filter(([, m]) => has(m.title)).slice(0, 4);
    const terms = (BB.glossary || []).filter((g) => has(g.term + ' ' + (g.aka || []).join(' '))).slice(0, 4);
    return { lessons, terms };
  }

  /* ---------- shared pieces ---------- */
  function topicRow(t, opts = {}) {
    const isSeen = !!seen()[t.id];
    const lec = (t.lectures || []).length ? (t.background ? 'Background for: ' : 'Helps with: ') + t.lectures.join('; ') : (t.about || '');
    return h('a.topic-row' + (isSeen ? '.seen' : ''), { href: `#/c/${t.course}/${t.id}` },
      h('span.t-icon', BB.ui.icon(isSeen ? 'check' : 'right')),
      h('span.t-main', h('span.t-title', t.title),
        opts.course ? h('span.t-course', `${BB.courses[t.course].short} · Module ${modOf(t).n}`) : null,
        h('span.t-lec', lec)),
      h('span.t-min', `${t.minutes} min`));
  }
  function searchBox(opts = {}) {
    const input = h('input', { type: 'search', id: opts.id || 'topic-search', placeholder: opts.placeholder || 'Search a topic, command or word: cd, pipes, data frame, t-test', 'aria-label': 'Search Companion topics', autocomplete: 'off', enterkeyhint: 'search' });
    const results = h('div.search-results', { 'aria-live': 'polite' });
    const draw = () => {
      const q = input.value.trim();
      results.innerHTML = '';
      if (!q) return;
      const found = search(q, 10).filter((t) => !opts.course || t.course === opts.course);
      if (found.length) results.append(h('p.small.muted.sr-count', `${found.length} topic${found.length === 1 ? '' : 's'} found`), h('div.topic-list', found.map((t) => topicRow(t, { course: !opts.course }))));
      else results.append(h('p.small.muted', 'No Companion topic matches. Try a shorter word, or a command name such as ls, grep or cd.'));
      if (!opts.course) {
        const ex = searchExtras(q);
        if (ex.lessons.length || ex.terms.length) results.append(h('div.search-extra', h('div.eyebrow', 'Also in Explore deeply (optional)'),
          h('div.chips', ex.lessons.map(([id, m]) => h('a.chip.accent', { href: '#/lesson/' + id }, 'Lesson: ' + m.title)), ex.terms.map((g) => h('a.chip', { href: '#/glossary?q=' + encodeURIComponent(g.term) }, 'Glossary: ' + g.term)))));
      }
    };
    input.addEventListener('input', BB.debounce(draw, 120));
    const form = h('form.search-form', { role: 'search', onsubmit: (e) => { e.preventDefault(); draw(); const first = results.querySelector('a'); if (first) first.focus(); } },
      h('span.search-icon', BB.ui.icon('search')), input, h('button.btn.btn-primary', { type: 'submit' }, 'Search'));
    if (opts.q) { input.value = opts.q; setTimeout(draw, 0); }
    return h('div.search-wrap', form, results);
  }
  const courseLink = (key) => h('a.btn.btn-ghost', { href: BB.courses[key].url, target: '_blank', rel: 'noopener noreferrer' }, 'Open the course on Coursera', BB.ui.icon('external'));

  /* ---------- home: Quick Companion ---------- */
  function home() {
    const idx = index();
    const last = S().companion && S().companion.last && idx.byId[S().companion.last];
    const nSeen = Object.keys(seen()).filter((id) => idx.byId[id]).length;
    return h('div.companion-home',
      h('section.hero.companion-hero',
        h('div.confetti', { 'aria-hidden': 'true' }, Array.from({ length: 12 }, () => h('span'))),
        h('div.hero-inner',
          h('div.eyebrow', 'Coursera companion'),
          h('h1', 'Which course and topic are you studying ', h('span.hl', 'right now'), '?'),
          h('p.hero-lead', 'Pick your course, then the lecture you just watched. Each topic takes 2 to 4 minutes: a short explanation, a visual, a tiny example and an optional try-it. Then go back to Coursera.'),
          searchBox({ id: 'home-search' }))),
      h('section.course-pick', { 'aria-label': 'Choose your course' },
        ORDER.filter((k) => BB.courses[k]).map((k) => {
          const c = BB.courses[k], n = idx.flat[k].length, done = idx.flat[k].filter((t) => seen()[t.id]).length;
          return h('a.card.card-link.course-card', { href: '#/c/' + k },
            h('div.course-top', h('div.f-icon.' + META[k].cls, BB.ui.icon(META[k].icon)), h('div.course-names', h('div.eyebrow', c.tag), h('h2.h3', c.name)), h('span.course-go', { 'aria-hidden': 'true' }, BB.ui.icon('right'))),
            h('p.small.muted.course-what', META[k].what),
            h('p.small.course-meta', `${n} topics in ${c.modules.length} modules` + (done ? ` \u00b7 ${done} viewed` : '')));
        })),
      last ? h('div.card.soft.continue-card', h('div', h('div.eyebrow', 'Pick up where you left off'), h('a.continue-link', { href: `#/c/${last.course}/${last.id}` }, last.title), h('p.small.muted', `${BB.courses[last.course].short} · Module ${modOf(last).n}`))) : null,
      h('div.grid-3.home-extras',
        h('a.card.card-link', { href: '#/files' }, h('div.eyebrow', 'Practice files'), h('h3', 'Download the practice project'), h('p.small.muted', 'A small, simulated heat-shock RNA-seq project with data and scripts. Use it in the browser terminal or on your own computer.')),
        h('a.card.card-link', { href: '#/visuals' }, h('div.eyebrow', 'Visual explanations'), h('h3', 'Browse every visual'), h('p.small.muted', 'Step-by-step pictures of paths, pipes, Python, R, statistics and RNA-seq.')),
        h('a.card.card-link', { href: '#/explore' }, h('div.eyebrow', 'Optional'), h('h3', 'Explore deeply'), h('p.small.muted', `The full path: ${Object.keys(BB.lessonMeta).length} lessons, ${BB.pages.LABS.length} labs and placement practice, whenever you want more.`))),
      nSeen ? h('p.small.muted.center-note', `You have viewed ${nSeen} Companion topic${nSeen === 1 ? '' : 's'}. Viewing marks are only a reminder; nothing here is graded.`) : null,
      h('p.footer-note', 'BioBridge is an independent study companion. It is not affiliated with, endorsed by or run by KAUST, KAUST Academy, Coursera, Rice University or IBM. Topic lists follow the public course pages (checked 8 November 2026); complete the official courses and their assessments on Coursera.'));
  }

  /* ---------- course page ---------- */
  function course(params) {
    const key = params.course, c = BB.courses[key];
    if (!c) { BB.go('/', true); return null; }
    const groups = index().byCourse[key];
    return h('div',
      h('div.page-head', h('div.crumbs', h('a', { href: '#/' }, 'Companion'), ' / ', c.short), h('div.eyebrow', c.tag + ' on Coursera'), h('h1', c.name),
        h('p', 'Open the module you are on, then the topic that matches the lecture you just watched. Each topic takes 2 to 4 minutes.'),
        h('div.btn-row.center-row', h('a.btn.btn-primary', { href: c.url, target: '_blank', rel: 'noopener noreferrer' }, 'Open the course on Coursera', BB.ui.icon('external')))),
      h('nav.tabs.module-jump', { 'aria-label': 'Jump to a module' }, groups.map((g) => h('a.tab', { href: `#/c/${key}#m${g.mod.n}` }, `Module ${g.mod.n}`))),
      h('div', { style: { marginTop: '12px' } }, searchBox({ course: key, id: 'course-search', placeholder: `Search ${c.short} topics` })),
      groups.map((g) => h('section.section.module-block', { id: 'm' + g.mod.n },
        h('div.eyebrow', `Module ${g.mod.n}`), h('h2', g.mod.title), h('p.small.muted', g.mod.summary),
        g.topics.length ? h('div.topic-list', g.topics.map((t) => topicRow(t))) : h('p.small.muted', 'No Companion topics for this module yet.'),
        h('p.small', { style: { marginTop: '10px' } }, h('a', { href: '#/courses#' + key }, 'Go deeper (optional): BioBridge lessons for this course')))),
      h('p.footer-note', 'Topic titles are BioBridge\'s own. "Helps with" names the public course items each topic supports; BioBridge does not reproduce lecture content, quizzes or assignments.'));
  }

  /* ---------- topic page ---------- */
  function tryActivity(t) {
    const x = t.try;
    if (!x) return null;
    try {
      if (x.kind === 'terminal') return BB.widgets.terminal({ start: homePath(x.start), tries: x.tries, task: x.task, eyebrow: 'Try it', title: 'Practice terminal' });
      if (x.kind === 'mission') return BB.widgets.terminal({ mission: x.mission });
      if (x.kind === 'python') return BB.widgets.pyrun({ code: x.code, title: 'Edit and run real Python', intro: x.task, rows: Math.min(14, Math.max(6, x.code.split('\n').length + 2)) });
      if (x.kind === 'trace') return BB.widgets.trace({ program: x.program });
      if (x.kind === 'widget') return BB.widgets[x.widget] ? BB.widgets[x.widget](x.props || {}, { companion: t.id }) : null;
      if (x.kind === 'computer') {
        const tool = x.lang === 'r' ? 'RStudio (or R)' : x.lang === 'python' ? 'Jupyter or Python' : 'a terminal';
        return h('div.widget', { 'data-widget': 'computer' },
          h('div.widget-head', h('div', h('div.eyebrow', 'Try it on your computer'), h('h3', 'Use the practice files in ' + tool)), h('span.chip.green', 'Real ' + (x.lang === 'r' ? 'R' : x.lang === 'python' ? 'Python' : 'Bash'))),
          h('p.small', { html: md(x.task) }),
          h('ol.small.steps-compact', h('li', 'Download and extract the ', h('a', { href: '#/files' }, 'practice files'), '.'), h('li', `Open ${tool} with the biobridge-practice folder as the working folder.`), h('li', 'Run the code, then compare with the expected output.')),
          BB.ui.codeBlock({ lang: x.lang, code: x.code }),
          h('details.deeper', { style: { marginTop: '10px' } }, h('summary', 'Show the expected output'), h('pre.output-block.plain', BB.expandTabs(x.output))));
      }
    } catch (e) { console.error(e); return h('div.callout.bad', 'This activity could not be displayed. Please reload the page.'); }
    return null;
  }
  function topic(params) {
    const t = index().byId[params.topic];
    if (!t || t.course !== params.course) { BB.go(BB.courses[params.course] ? '/c/' + params.course : '/', true); return null; }
    markSeen(t.id);
    const c = BB.courses[t.course], m = modOf(t), list = index().flat[t.course], i = list.indexOf(t);
    const prev = list[i - 1], next = list[i + 1];
    const used = new Set();
    const sec = (id, eyebrow, title, ...body) => h('section.lsec.ctopic', { id: 'ct-' + id, 'aria-labelledby': 'cth-' + id }, h('div.eyebrow', eyebrow), title ? h('h2', { id: 'cth-' + id }, title) : null, ...body);
    const lec = (t.lectures || []).length
      ? h('p.helps', h('strong', t.background ? 'Background for: ' : 'Helps with: '), t.lectures.join('; '))
      : (t.about ? h('p.helps', t.about) : null);
    const v = t.visual || {};
    let visual = null;
    if (v.diagram) visual = BB.diagram.render(v.diagram, { eyebrow: 'See it' });
    else if (v.widget && BB.widgets[v.widget]) { try { visual = BB.widgets[v.widget](v.props || {}, { companion: t.id }); } catch (e) { console.error(e); } }
    const ex = t.example;
    const exOut = ex && typeof ex.output === 'string' && ex.output !== '' ? (ex.lang === 'bash' ? BB.expandTabs(ex.output) : ex.output) : undefined;
    const tryHolder = h('div.try-holder');
    const tryBtn = t.try ? h('button.btn.btn-primary', { type: 'button', 'aria-expanded': 'false', onclick: () => {
      if (tryHolder.childElementCount) return;
      const node = tryActivity(t);
      if (node) tryHolder.append(node);
      tryBtn.setAttribute('aria-expanded', 'true');
      tryBtn.hidden = true;
      const focusable = tryHolder.querySelector('input, textarea, button');
      if (focusable) focusable.focus({ preventScroll: false });
    } }, BB.ui.icon('play'), t.try.kind === 'computer' ? 'Show the exercise' : 'Start the activity') : null;
    const tryLabel = t.try ? ({ terminal: 'A short terminal practice in your browser (simulated, safe).', mission: 'A guided terminal mission in your browser (simulated, safe).', python: 'Edit and run real Python in your browser.', trace: 'Step through a real Python program and predict each change.', widget: 'An interactive lab.', computer: 'Practice on your own computer with the downloadable practice files.' }[t.try.kind] || '') : '';
    return h('article.companion-topic',
      h('header.lesson-top',
        h('div.crumbs', h('a', { href: '#/' }, 'Companion'), ' / ', h('a', { href: '#/c/' + t.course }, c.short), ' / ', h('a', { href: `#/c/${t.course}#m${m.n}` }, 'Module ' + m.n)),
        h('h1', t.title),
        h('div.chips', h('span.chip', BB.ui.icon('clock'), `About ${t.minutes} min`), h('span.chip.accent', `Module ${m.n}: ${m.title}`)),
        lec),
      sec('short', 'In short', null, h('p.topic-explain', { html: md(t.explain, used) }),
        h('div.callout.accent', { style: { marginTop: '12px' } }, h('strong', 'Why you need it'), h('span', { html: md(t.why, used) }))),
      visual ? h('section.lsec.ctopic', { id: 'ct-visual', 'aria-label': 'Visual explanation' }, visual) : null,
      ex ? sec('example', 'Example', 'A tiny example', BB.ui.codeBlock({ lang: ex.lang, code: ex.code, output: exOut, run: ex.lang === 'python' && ex.run }),
        h('p.prose', { style: { marginTop: '10px' }, html: md(ex.note, used) }),
        ex.lang === 'bash' && !ex.noVerify ? h('p.small.muted', 'Runs in the folder ', h('code.inline', ex.cwd || '~/project/data'), ' of the practice project. You will see the same in the browser terminal.') : null) : null,
      t.try ? sec('try', 'Optional', 'Try it', h('p.small.muted', tryLabel + ' Skip it if you are short on time.'), tryBtn, tryHolder) : null,
      t.mistake ? sec('mistake', 'Common mistake', null, h('div.pitfall-grid', h('div.callout.bad', h('strong', 'What beginners often do'), h('span', { html: md(t.mistake.wrong) })), h('div.callout.good', h('strong', 'What to do instead'), h('span', { html: md(t.mistake.fix, used) })))) : null,
      t.check ? sec('check', 'Quick check (optional, not scored)', null, BB.ui.mcq(Object.assign({}, t.check), { retry: true })) : null,
      h('section.lsec.back-card', h('div.card', h('div.eyebrow', 'Done? Go back to your course'), h('p', 'Return to Coursera and continue the lecture or exercise you were on.'),
        h('div.btn-row', h('a.btn.btn-primary', { href: c.url, target: '_blank', rel: 'noopener noreferrer' }, 'Back to Coursera', BB.ui.icon('external')), h('a.btn', { href: '#/c/' + t.course }, 'All ' + c.short + ' topics')),
        (t.deeper || []).length ? h('div.deeper-links', h('span.small.muted', 'Go deeper (optional): '), t.deeper.filter((d) => BB.lessonMeta[d]).map((d) => h('a.chip.accent', { href: '#/lesson/' + d }, BB.lessonMeta[d].title))) : null)),
      h('nav.lesson-nav', { 'aria-label': 'Previous and next topic' },
        prev ? h('a.btn', { href: `#/c/${prev.course}/${prev.id}` }, BB.ui.icon('left'), h('span', h('span.small.muted', 'Previous: '), prev.title)) : h('span'),
        next ? h('a.btn.btn-primary', { href: `#/c/${next.course}/${next.id}` }, h('span', h('span.small', 'Next: '), next.title), BB.ui.icon('right')) : h('a.btn.btn-primary', { href: '#/c/' + t.course }, 'Back to the topic list', BB.ui.icon('right'))));
  }

  /* ---------- visual library ---------- */
  const GROUPS = [['Linux and the shell', 'ibm'], ['Python', 'rice'], ['R, statistics and RNA-seq', 'kaust']];
  function visuals() {
    const idx = index(), names = BB.diagram.names();
    const groupOf = (n) => { const ts = idx.byDiagram[n] || []; return ts.length ? ts[0].course : 'other'; };
    const card = (n) => { const d = BB.diagrams[n], ts = idx.byDiagram[n] || []; return h('a.card.card-link.visual-card', { href: '#/visuals/' + n }, h('h3', d.title), h('p.small.muted', `${d.steps.length} steps` + (ts.length ? ` · ${ts.map((t) => t.title).slice(0, 2).join(', ')}` : ''))); };
    return h('div',
      h('div.page-head', h('div.eyebrow', 'Visual explanations'), h('h1', 'See how it works, step by step'), h('p', `${names.length} original visuals. Each one takes about a minute: press Next and read one short caption at a time.`)),
      GROUPS.map(([label, k]) => { const ns = names.filter((n) => groupOf(n) === k); return ns.length ? h('section.section', h('h2', label), h('div.grid-3', ns.map(card))) : null; }),
      (() => { const ns = names.filter((n) => groupOf(n) === 'other'); return ns.length ? h('section.section', h('h2', 'More'), h('div.grid-3', ns.map(card))) : null; })());
  }
  function visual(params) {
    const d = BB.diagrams[params.name];
    if (!d) { BB.go('/visuals', true); return null; }
    const ts = index().byDiagram[params.name] || [];
    return h('div',
      h('div.page-head', h('div.crumbs', h('a', { href: '#/visuals' }, 'Visual explanations')), h('h1', d.title), h('p', d.summary)),
      BB.diagram.render(params.name, { noHead: true }),
      ts.length ? h('div.card.soft', { style: { marginTop: '16px' } }, h('div.eyebrow', 'Used in'), h('div.topic-list', ts.map((t) => topicRow(t, { course: true })))) : null);
  }

  BB.companionApp = { home, course, topic, visuals, visual, search, index, topicRow };
})();
