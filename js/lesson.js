/* Lesson page: What -> Why -> How -> Show me -> Let me try -> Test my understanding -> Connect -> Teach it back. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;

  const ORDER = () => BB.foundations.flatMap((f) => f.units.flatMap((u) => u.lessons));
  const courseLabel = (modId) => { const [c, m] = modId.split('-m'); const C = BB.courses[c]; return C ? `${C.tag} · Module ${m}` : modId; };
  const ALIGN = { core: ['Taught in the course', 'green'], support: ['Background the courses assume', 'blue'], beyond: ['Beyond the prerequisites', 'violet'] };
  function whereIs(id) { for (const f of BB.foundations) for (const u of f.units) if (u.lessons.includes(id)) return { f, u }; return {}; }

  function activity(t, lessonId) {
    if (!t) return null;
    try {
      if (t.kind === 'terminal') return BB.widgets.terminal({ mission: t.mission });
      if (t.kind === 'trace') return BB.widgets.trace({ program: t.program });
      if (t.kind === 'widget') return BB.widgets[t.widget] ? BB.widgets[t.widget](t.props || {}, { lesson: lessonId }) : null;
      if (t.kind === 'predict') return BB.activities.predict(t);
      if (t.kind === 'parsons') return BB.activities.parsons(t);
      if (t.kind === 'debug') return BB.activities.debug(t);
    } catch (e) { console.error(e); return h('div.callout.bad', 'This activity could not be displayed. Please reload the page.'); }
    return null;
  }

  const STOPWORDS = new Set('the a an and or of to in on for is are be it its that this with as by from at into than then they them their what which when why how not only also can each one two more most very just your you about after before between does'.split(' '));
  function keywords(point) { return point.toLowerCase().replace(/[`*().,;:'"]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOPWORDS.has(w)).sort((a, b) => b.length - a.length).slice(0, 2); }

  function render(id) {
    const L = BB.lessons.find((x) => x.id === id);
    const meta = BB.lessonMeta[id];
    if (!meta) { BB.go('/learn', true); return null; }
    if (!L) return h('div.empty', 'This lesson could not be loaded. ', h('a', { href: '#/learn' }, 'Back to all lessons'));
    const st = BB.store.lesson(id);
    if (!st.visited) { st.visited = Date.now(); BB.store.saveSoon(); }
    const used = new Set();
    const { f, u } = whereIs(id);
    const order = ORDER(), idx = order.indexOf(id);
    const prev = order[idx - 1], next = order[idx + 1];
    const [alignLabel, alignColor] = ALIGN[meta.align] || ALIGN.support;

    const sec = (key, n, title, ...body) => h('section.lsec', { id: 'sec-' + key, 'data-sec': key, 'aria-labelledby': 'h-' + key }, h('div.eyebrow', h('span.n', String(n)), title), ...body);
    const SECTIONS = [['what', 'What is it?'], ['why', 'Why it exists'], ['how', 'How it works'], ['show', 'Show me'], ['try', 'Let me try'], ['check', 'Check'], ['connect', 'Real science'], ['teach', 'Teach it back']];

    const stepper = h('nav.stepper', { 'aria-label': 'Lesson sections' }, SECTIONS.filter(([k]) => k !== 'try' || L.try).map(([k, label]) => h('a', { href: '#/lesson/' + id, 'data-go': k, onclick: (e) => { e.preventDefault(); const t = document.getElementById('sec-' + k); if (t) { t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); t.querySelector('h2, .eyebrow').setAttribute('tabindex', '-1'); } } }, label)));

    const head = h('header.lesson-top',
      h('div.small.muted', h('a', { href: '#/learn/' + (f ? f.id : '') }, f ? f.short : 'Learn'), ' / ', u ? u.title : ''),
      h('h1', meta.title),
      h('div.chips', h('span.chip', BB.ui.icon('clock'), `${meta.min} min`), h('span.chip.' + alignColor, alignLabel), meta.courses.map((c) => h('a.chip.accent', { href: '#/courses', title: BB.courses[c.split('-m')[0]].name }, courseLabel(c)))),
      h('details.deeper', { style: { marginTop: '12px' } }, h('summary', 'What you will be able to do'), h('div', h('ul', meta.obj.map((o) => h('li', 'I can ' + BB.objectives[o].label.charAt(0).toLowerCase() + BB.objectives[o].label.slice(1) + '.'))), meta.pre.length ? h('p.small.muted', 'Builds on: ', meta.pre.map((p, i) => [i ? ', ' : '', h('a', { href: '#/lesson/' + p }, BB.lessonMeta[p].title)])) : null)));

    const what = sec('what', 1, 'What is it?', h('h2.sr-only', { id: 'h-what' }, 'What is it?'), h('p.big-idea', { html: md(L.what, used) }));
    const why = sec('why', 2, 'Why does it exist?', h('h2', { id: 'h-why' }, 'The problem it solves'), h('p.prose', { html: md(L.problem, used) }), h('div.callout.accent', h('strong', 'Why should a beginner care?'), h('span', { html: md(L.care, used) })));
    const how = sec('how', 3, 'How does it work?', h('h2', { id: 'h-how' }, 'Step by step'), h('ol.steps-list', L.steps.map((s) => h('li', { html: md(s, used) }))),
      L.deeper ? h('details.deeper', { style: { marginTop: '12px' } }, h('summary', 'Go deeper (optional)'), h('div', { html: md(L.deeper, used) })) : null);
    const show = sec('show', 4, 'Show me', h('h2', { id: 'h-show' }, 'A worked example'), L.show.intro ? h('p.prose', { html: md(L.show.intro, used) }) : null,
      BB.ui.codeBlock({ lang: L.show.lang, code: L.show.code, output: L.show.output, run: L.show.run }),
      h('h3', { style: { marginTop: '16px' } }, 'What it means'), h('ul.notes-list', L.show.notes.map((n) => h('li', { html: md(n, used) }))),
      h('h3', { style: { marginTop: '18px' } }, 'Common misunderstanding'),
      h('div.pitfall-grid', { style: { marginTop: '8px' } }, h('div.callout.bad', h('strong', 'A common belief'), h('span', { html: md(L.pitfall.wrong) })), h('div.callout.good', h('strong', 'What is actually true'), h('span', { html: md(L.pitfall.right, used) }))));
    const tryEl = L.try ? sec('try', 5, 'Let me try', h('h2', { id: 'h-try' }, 'Try it yourself'), activity(L.try, id)) : null;

    /* checks */
    const results = L.check.map((_, i) => (st.checks && st.checks[i]) || null);
    const checkStatus = h('div', { 'aria-live': 'polite' });
    const drawCheckStatus = () => {
      const right = results.filter((r) => r === 'right').length;
      checkStatus.innerHTML = '';
      if (right === L.check.length) checkStatus.append(h('div.callout.good', h('strong', 'Checkpoint passed.'), h('span', ' Now explain the idea in your own words below. These questions will come back in your review queue.')));
      else checkStatus.append(h('p.small.muted', `${right} of ${L.check.length} answered correctly. If you miss one, read why, then try again.`));
    };
    const checks = L.check.map((q, i) => h('div', { style: { marginTop: '12px' } }, BB.ui.mcq(Object.assign({}, q), { retry: true, onAnswer: (ok) => {
      const s2 = BB.store.lesson(id);
      s2.checks = s2.checks || {};
      if (!s2.checks[i]) { BB.practice.record(Object.assign({ id: `chk:${id}#${i}`, obj: meta.obj, level: q.level || 1 }), ok, 'lesson'); }
      if (ok) { s2.checks[i] = 'right'; results[i] = 'right'; } else if (!s2.checks[i]) s2.checks[i] = 'tried';
      if (results.every((r) => r === 'right') && !s2.checkPassed) { s2.checkPassed = Date.now(); BB.emit('progress'); }
      BB.store.saveSoon(); drawCheckStatus(); updateTeach();
    } })));
    const checkSec = sec('check', 6, 'Test my understanding', h('h2', { id: 'h-check' }, 'Checkpoint'), h('p.small.muted', 'Short questions about this lesson. They test whether you can use the idea, not whether you remember the wording.'), checks, checkStatus);

    const connect = sec('connect', 7, 'Connect it to real science', h('h2', { id: 'h-connect' }, 'Where this matters'), h('p.prose', { html: md(L.real, used) }));

    /* teach-back */
    const ta = h('textarea', { id: 'teach-' + id, 'aria-describedby': 'teach-help', placeholder: 'Write as if a friend missed this lesson. Use your own words.' });
    ta.value = st.teach || '';
    const boxes = L.teach.points.map((p, i) => { const cb = h('input', { type: 'checkbox', id: `tp-${id}-${i}`, checked: !!(st.selfCheck && st.selfCheck[i]) }); return { cb, p, row: h('label.check-row', { for: `tp-${id}-${i}` }, cb, h('span', { html: md(p) })) }; });
    const hintEl = h('div.small', { 'aria-live': 'polite', style: { marginTop: '6px' } });
    const saveBtn = h('button.btn', { type: 'button' }, 'Save my explanation');
    const doneBtn = h('button.btn.btn-primary', { type: 'button' }, BB.ui.icon('check'), st.completed ? 'Explained ✓' : 'I can explain this now');
    const teachNote = h('div', { 'aria-live': 'polite' });
    function updateTeach() {
      const s2 = BB.store.peekLesson(id);
      const text = ta.value.trim();
      const ticked = boxes.filter((b) => b.cb.checked).length;
      const ready = s2.checkPassed && text.length >= 60 && ticked >= Math.ceil(boxes.length / 2);
      doneBtn.disabled = !!s2.completed || !ready;
      const words = text.toLowerCase();
      const covered = L.teach.points.filter((p) => keywords(p).some((k) => words.includes(k.slice(0, Math.max(4, k.length - 2)))));
      hintEl.innerHTML = '';
      if (text.length > 20) hintEl.append(h('span.muted', `Your text seems to touch ${covered.length} of ${L.teach.points.length} key ideas (a rough word match, not a grade).`));
      if (!s2.completed) {
        const missing = [];
        if (!s2.checkPassed) missing.push('pass the checkpoint above');
        if (text.length < 60) missing.push('write at least two sentences');
        if (ticked < Math.ceil(boxes.length / 2)) missing.push('tick the key ideas you honestly covered');
        teachNote.innerHTML = '';
        if (missing.length) teachNote.append(h('p.small.muted', 'To mark this lesson as explained: ' + missing.join(', ') + '.'));
      }
    }
    const persistDraft = BB.debounce(() => { const s2 = BB.store.lesson(id); s2.teach = ta.value; s2.teachTs = Date.now(); BB.store.saveSoon(); }, 600);
    ta.addEventListener('input', () => { persistDraft(); updateTeach(); });
    boxes.forEach((b, i) => b.cb.addEventListener('change', () => { const s2 = BB.store.lesson(id); s2.selfCheck = s2.selfCheck || []; s2.selfCheck[i] = b.cb.checked; BB.store.saveSoon(); updateTeach(); }));
    saveBtn.addEventListener('click', () => { const s2 = BB.store.lesson(id); s2.teach = ta.value; s2.teachTs = Date.now(); BB.store.saveNow(); BB.ui.toast('Saved to My explanations'); });
    doneBtn.addEventListener('click', () => {
      const s2 = BB.store.lesson(id);
      s2.teach = ta.value; s2.teachTs = Date.now(); s2.completed = Date.now();
      BB.practice.addLessonToReview(id);
      BB.store.saveNow();
      doneBtn.disabled = true; doneBtn.innerHTML = ''; doneBtn.append(BB.ui.icon('check'), 'Explained ✓');
      teachNote.innerHTML = '';
      teachNote.append(h('div.callout.good', h('strong', 'Lesson marked as explained.'), ' The checkpoint questions will return in your review queue tomorrow. Being able to explain it now is a good sign; using it on a new problem later is the real test.'));
      BB.emit('progress'); BB.ui.applyNav();
    });
    const teach = sec('teach', 8, 'Teach it back', h('h2', { id: 'h-teach' }, 'Explain it in your own words'),
      h('p.prose', { html: md(L.teach.prompt) }),
      h('div.field', h('label', { for: 'teach-' + id }, 'Your explanation (saved on this device only)'), ta, hintEl),
      h('div.card.soft', { style: { marginTop: '12px' } }, h('strong', 'Did your explanation cover these ideas?'), h('p.small.muted', { id: 'teach-help' }, 'Compare honestly, then improve your text before ticking.'), h('div.teach-points', boxes.map((b) => b.row))),
      h('div.btn-row', { style: { marginTop: '12px' } }, saveBtn, doneBtn), teachNote);

    const footer = h('div',
      h('div.callout', { style: { marginTop: '28px' } }, h('strong', 'Keep it alive'), h('div.btn-row', { style: { marginTop: '8px' } },
        h('button.btn.btn-sm', { type: 'button', onclick: () => { BB.practice.startTopic({ objective: meta.obj[0], n: 5 }); BB.go('/practice/session'); } }, BB.ui.icon('practice'), 'Practice 5 questions on this'),
        h('button.btn.btn-sm.btn-quiet', { type: 'button', onclick: () => BB.ui.openGlossary() }, BB.ui.icon('glossary'), 'Glossary'))),
      h('nav.lesson-nav', { 'aria-label': 'Previous and next lesson' },
        prev ? h('a.btn', { href: '#/lesson/' + prev }, BB.ui.icon('left'), h('span', h('span.small.muted', 'Previous: '), BB.lessonMeta[prev].title)) : h('span'),
        next ? h('a.btn.btn-primary', { href: '#/lesson/' + next }, h('span', h('span.small', 'Next: '), BB.lessonMeta[next].title), BB.ui.icon('right')) : h('a.btn.btn-primary', { href: '#/practice' }, 'Go to placement practice', BB.ui.icon('right'))));

    const page = h('article.lesson', head, stepper, what, why, how, show, tryEl, checkSec, connect, teach, footer);
    drawCheckStatus(); updateTeach();
    // restore previous check results visually (answered questions show as fresh, but status reflects history)
    requestAnimationFrame(() => {
      if (!('IntersectionObserver' in window)) return;
      const links = Array.from(stepper.querySelectorAll('a'));
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { const k = en.target.dataset.sec; links.forEach((a) => a.classList.toggle('active', a.dataset.go === k)); const act = links.find((a) => a.dataset.go === k); if (act && act.scrollIntoView && stepper.scrollWidth > stepper.clientWidth) stepper.scrollLeft = act.offsetLeft - 16; } });
      }, { rootMargin: '-35% 0px -60% 0px' });
      page.querySelectorAll('.lsec').forEach((s) => io.observe(s));
      BB.on('mounted', () => io.disconnect());
    });
    return page;
  }

  BB.lessonPage = render;
  BB.lessonsDone = () => Object.values(BB.store.state.lessons).filter((l) => l.completed).length;
  BB.lessonOrder = ORDER;
  BB.courseLabel = courseLabel;
  BB.ALIGN = ALIGN;
})();
