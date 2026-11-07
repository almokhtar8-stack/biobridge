/* Practice system: question pools, diagnostic, topic practice, timed/untimed mock assessments, spaced review, objective tracking.
   All practice items are original BioBridge questions. Nothing here reproduces or predicts the official placement test. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md, pct } = BB;
  const S = () => BB.store.state;
  const DAY = BB.DAY;
  const INTERVALS = [0, 1, 2, 4, 8, 16, 32]; // days per review box
  const FOUND = { f0: 'Foundation 0: Starting from zero', f1: 'Foundation 1: Linux', f2: 'Foundation 2: Python', f3: 'Foundation 3: Bioinformatics, R and statistics' };
  const LEVEL = { 1: 'Beginner', 2: 'Intermediate', 3: 'Application' };

  const fOf = (q) => (BB.objectives[(q.obj || [])[0]] || {}).f;
  const lessonsForObj = (o) => Object.keys(BB.lessonMeta).filter((id) => BB.lessonMeta[id].obj.includes(o));

  /* ---------------- evidence and objective status ---------------- */
  function objectiveStats() {
    const st = {};
    for (const o of Object.keys(BB.objectives)) st[o] = { n: 0, w: 0, wc: 0, last: 0, items: new Set(), hiLevel: 0 };
    const atts = S().attempts;
    // most recent first; weight decays with recency, lesson checks count half
    const perObjCount = {};
    for (let i = atts.length - 1; i >= 0; i--) {
      const a = atts[i];
      for (const o of a.o || []) {
        if (!st[o]) continue;
        perObjCount[o] = (perObjCount[o] || 0) + 1;
        if (perObjCount[o] > 12) continue;
        const w = Math.pow(0.85, perObjCount[o] - 1) * (a.m === 'lesson' ? 0.5 : 1);
        st[o].n++; st[o].w += w; st[o].wc += w * a.c; st[o].last = Math.max(st[o].last, a.t); st[o].items.add(a.g || a.q);
        if (a.c && a.l) st[o].hiLevel = Math.max(st[o].hiLevel, a.l);
      }
    }
    for (const [o, s] of Object.entries(st)) {
      s.acc = s.w ? s.wc / s.w : null;
      s.distinct = s.items.size;
      s.status = !s.n ? 'none' : s.n < 3 ? 'start' : s.acc < 0.6 ? 'weak' : s.acc < 0.8 || s.distinct < 3 || s.hiLevel < 2 ? 'developing' : 'consistent';
      delete s.items;
    }
    return st;
  }
  const STATUS = { none: ['Not practiced yet', ''], start: ['Just started', 'blue'], weak: ['Needs work', 'red'], developing: ['Developing', 'orange'], consistent: ['Consistent in practice', 'green'] };

  function record(q, correct, mode) {
    S().attempts.push({ q: q.id, g: q.gen || null, o: q.obj || [], c: correct ? 1 : 0, t: Date.now(), m: mode, l: q.level || 1 });
    BB.store.saveSoon();
  }

  /* ---------------- spaced review queue ---------------- */
  function reviewKey(q) { return q.gen ? 'gen:' + q.gen : q.checkRef ? 'chk:' + q.checkRef : 'q:' + q.id; }
  function schedule(q, correct) {
    const rv = S().review;
    const k = reviewKey(q);
    const cur = rv[k];
    if (!correct) rv[k] = { box: 1, due: Date.now() + INTERVALS[1] * DAY, obj: q.obj || [], last: Date.now(), lapses: ((cur && cur.lapses) || 0) + 1 };
    else if (cur) {
      const box = Math.min(cur.box + 1, INTERVALS.length - 1);
      if (box >= INTERVALS.length - 1) delete rv[k];
      else rv[k] = Object.assign(cur, { box, due: Date.now() + INTERVALS[box] * DAY, last: Date.now() });
    }
    BB.store.saveSoon();
  }
  function addLessonToReview(lessonId) {
    const L = BB.lessons.find((x) => x.id === lessonId);
    if (!L) return;
    const rv = S().review;
    L.check.forEach((_, i) => { const k = `chk:${lessonId}#${i}`; if (!rv[k]) rv[k] = { box: 1, due: Date.now() + DAY, obj: BB.lessonMeta[lessonId].obj, last: Date.now() }; });
    BB.store.saveSoon();
  }
  function dueKeys() { const now = Date.now(); return Object.entries(S().review).filter(([, v]) => v.due <= now).sort((a, b) => a[1].due - b[1].due).map(([k]) => k); }
  function dueCount() { try { return dueKeys().length; } catch (e) { return 0; } }
  function itemFromKey(k, seed) {
    if (k.startsWith('gen:')) return BB.generate(k.slice(4), seed);
    if (k.startsWith('q:')) return BB.questions.find((q) => q.id === k.slice(2)) || null;
    if (k.startsWith('chk:')) {
      const [lid, idx] = k.slice(4).split('#');
      const L = BB.lessons.find((x) => x.id === lid);
      if (!L || !L.check[+idx]) return null;
      return Object.assign({ id: k, checkRef: `${lid}#${idx}`, obj: BB.lessonMeta[lid].obj, level: L.check[+idx].level || 1, lesson: lid }, L.check[+idx]);
    }
    return null;
  }

  /* ---------------- selection ---------------- */
  function pool(filter) {
    const items = [];
    for (const q of BB.questions) if (filter(q)) items.push(q);
    for (const g of BB.generators || []) {
      const proto = { obj: g.obj, level: g.level };
      if (filter(proto)) items.push({ genKey: g.key, obj: g.obj, level: g.level, lesson: g.lesson });
    }
    return items;
  }
  function recentIds(sessions = 4) {
    const ids = new Set();
    const atts = S().attempts;
    const cutoff = (S().sessions.slice(-sessions)[0] || {}).t || 0;
    for (let i = atts.length - 1; i >= 0 && atts[i].t >= cutoff; i--) ids.add(atts[i].g ? 'gen:' + atts[i].g : atts[i].q);
    return ids;
  }
  function choose(items, n, { weights, rng, balanceBy } = {}) {
    rng = rng || BB.rng(BB.seed());
    const recent = recentIds();
    const stats = objectiveStats();
    const scored = items.map((it) => {
      const id = it.genKey ? 'gen:' + it.genKey : it.id;
      let s = rng.next();
      if (!recent.has(id)) s += 1.2;
      const o = (it.obj || [])[0], so = stats[o];
      if (so && (so.status === 'weak' || so.status === 'none' || so.status === 'start')) s += 0.5;
      if (it.genKey) s += 0.25;
      if (weights) s += weights(it) || 0;
      return { it, s };
    }).sort((a, b) => b.s - a.s);
    if (!balanceBy) return scored.slice(0, n).map((x) => x.it);
    const groups = {};
    for (const x of scored) (groups[balanceBy(x.it)] = groups[balanceBy(x.it)] || []).push(x.it);
    const out = [];
    const keys = Object.keys(groups);
    let k = 0;
    while (out.length < n && keys.some((g) => groups[g].length)) { const g = keys[k++ % keys.length]; if (groups[g].length) out.push(groups[g].shift()); }
    return out;
  }
  function materialize(it, seed) {
    if (it.genKey) return BB.generate(it.genKey, seed);
    return it;
  }

  /* ---------------- sessions ---------------- */
  function newSession(mode, items, opts = {}) {
    const seedBase = BB.seed();
    const qs = items.map((it, i) => materialize(it, seedBase + i * 104729)).filter(Boolean);
    const sess = { id: BB.uid(), mode, label: opts.label || mode, items: qs, at: 0, answers: qs.map(() => null), unsure: qs.map(() => false), flags: qs.map(() => false), firstTry: qs.map(() => null), started: Date.now(), timed: !!opts.timed, endsAt: opts.timed ? Date.now() + opts.minutes * 60000 : null, deferred: !!opts.deferred, seeds: qs.map(() => BB.seed()), finished: false, extra: opts.extra || {} };
    S().activeSession = sess;
    BB.store.saveNow();
    return sess;
  }
  function startDiagnostic() {
    const plan = [['F0.BIOINF', 1], ['F0.DOGMA', 1], ['F0.EXPR', 1], ['F0.COMP', 1], ['LX.PATHS', 1], ['LX.NAV', 1], ['LX.SEARCH', 1], ['LX.PIPES', 1], ['LX.PERMS', 1],
      ['PY.EXPR', 1], ['PY.VARS', 1], ['PY.FUNC', 1], ['PY.COND', 1], ['PY.LOOPS', 1], ['PY.STR', 1], ['R.BASICS', 1], ['BI.FASTQ', 1], ['BI.COUNTS', 1], ['BI.NORM', 1], ['ST.FC', 1], ['ST.TEST', 1], ['BI.SC', 1]];
    const rng = BB.rng(BB.seed());
    const items = [];
    for (const [o] of plan) {
      const cands = pool((q) => (q.obj || []).includes(o) && (q.level || 1) <= 2);
      const pick = choose(cands, 1, { rng });
      if (pick[0] && !items.includes(pick[0])) items.push(pick[0]);
    }
    return newSession('diagnostic', items, { deferred: true, label: 'Diagnostic: your starting point' });
  }
  function startTopic({ foundation, objective, n = 10, weakest }) {
    let filter;
    if (weakest) {
      const st = objectiveStats();
      const weak = Object.entries(st).filter(([, s]) => s.status === 'weak' || s.status === 'developing' || s.status === 'start').sort((a, b) => (a[1].acc == null ? 0.5 : a[1].acc) - (b[1].acc == null ? 0.5 : b[1].acc)).slice(0, 4).map(([o]) => o);
      const targets = weak.length ? weak : Object.keys(st).filter((o) => st[o].status === 'none').slice(0, 4);
      filter = (q) => (q.obj || []).some((o) => targets.includes(o));
    } else if (objective) filter = (q) => (q.obj || []).includes(objective);
    else if (foundation) filter = (q) => fOf(q) === foundation;
    else filter = () => true;
    const items = choose(pool(filter), n, { balanceBy: (it) => (it.obj || [])[0] });
    const label = weakest ? 'Practice: your weakest areas' : objective ? 'Practice: ' + BB.objectives[objective].label : foundation ? 'Practice: ' + FOUND[foundation] : 'Mixed practice';
    return newSession('topic', items, { label });
  }
  function startMock({ n = 20, timed = true }) {
    const quota = { f0: Math.round(n * 0.1), f1: Math.round(n * 0.25), f2: Math.round(n * 0.3) };
    quota.f3 = n - quota.f0 - quota.f1 - quota.f2;
    const items = [];
    // Mocks stay inside the three courses: objectives marked beyond: true (workflow tools) are practiced in topic mode only.
    const inScope = (q) => !(q.obj || []).every((o) => BB.objectives[o] && BB.objectives[o].beyond);
    for (const f of ['f0', 'f1', 'f2', 'f3']) items.push(...choose(pool((q) => fOf(q) === f && inScope(q)), quota[f], { balanceBy: (it) => String(it.level || 1) + ((it.obj || [])[0] || '') }));
    const ordered = BB.shuffle(items);
    return newSession('mock', ordered, { deferred: true, timed, minutes: Math.round(n * 1.5), label: `Mock assessment (${n} questions, ${timed ? 'timed' : 'untimed'})`, extra: { n, timed } });
  }
  function startReview() {
    const keys = dueKeys().slice(0, 15);
    const items = keys.map((k, i) => itemFromKey(k, BB.seed() + i)).filter(Boolean);
    return newSession('review', items, { label: `Review: ${items.length} due item${items.length === 1 ? '' : 's'}` });
  }

  function finish(sess) {
    if (sess.finished) return;
    sess.finished = true;
    sess.ended = Date.now();
    const byObj = {};
    let correct = 0, added = 0;
    sess.items.forEach((q, i) => {
      const a = sess.answers[i];
      const ok = a != null && a === q.answer;
      if (sess.deferred) {
        record(q, ok, sess.mode);
        if (!ok) { schedule(q, false); added++; }
        else if (S().review[reviewKey(q)]) schedule(q, true);
      }
      if (ok) correct++;
      for (const o of q.obj || []) { byObj[o] = byObj[o] || [0, 0]; byObj[o][1]++; if (ok) byObj[o][0]++; }
    });
    sess.result = { correct, total: sess.items.length, byObj, added, secs: Math.round((sess.ended - sess.started) / 1000) };
    S().sessions.push({ id: sess.id, mode: sess.mode, t: sess.ended, n: sess.items.length, correct, pct: pct(correct, sess.items.length), secs: sess.result.secs, label: sess.label, byObj });
    if (sess.mode === 'diagnostic') {
      S().diagnostic = { t: sess.ended, byObj, unsure: sess.unsure.filter(Boolean).length, correct, total: sess.items.length };
    }
    S().lastResult = sess;
    S().activeSession = null;
    BB.store.saveNow();
    BB.emit('progress');
  }

  /* ---------------- recommended path ---------------- */
  function recommendedPath() {
    const st = S();
    const diag = st.diagnostic;
    const order = BB.foundations.flatMap((f) => f.units.flatMap((u) => u.lessons));
    const objStat = objectiveStats();
    const courseStatus = st.settings.courseStatus || {};
    const out = [];
    for (const id of order) {
      const meta = BB.lessonMeta[id];
      const done = (st.lessons[id] || {}).completed;
      if (done) continue;
      let reason = null, optional = false;
      const diagHits = meta.obj.map((o) => diag && diag.byObj[o]).filter(Boolean);
      const known = diagHits.length && diagHits.every((x) => x[0] === x[1]) && meta.obj.every((o) => objStat[o].status === 'consistent' || (diag && diag.byObj[o] && diag.byObj[o][0] === diag.byObj[o][1]));
      const weak = meta.obj.some((o) => objStat[o].status === 'weak') || diagHits.some((x) => x[0] < x[1]);
      const activeCourse = meta.courses.some((m) => courseStatus[m.split('-')[0]] === 'active');
      if (weak) reason = 'You missed related questions';
      else if (activeCourse) reason = 'Supports the course you are taking now';
      if (known && !weak) { optional = true; reason = 'You answered this correctly: skim or skip'; }
      out.push({ id, reason, optional });
    }
    // put recommended (non-optional, with reason) first while keeping curriculum order, then the rest
    const priority = out.filter((x) => x.reason && !x.optional), rest = out.filter((x) => !x.reason), optional = out.filter((x) => x.optional);
    return diag || Object.values(courseStatus).includes('active') ? priority.concat(rest, optional) : out;
  }

  /* ---------------- UI ---------------- */
  const disclaimer = () => h('div.callout.warn', h('strong', 'Unofficial practice'), 'These are original BioBridge questions written from the public course syllabi. They are not KAUST Academy questions and do not show the format, length or difficulty of the real placement test. A practice score is not official course credit or proof of mastery.');

  function hub() {
    const st = S();
    const active = st.activeSession;
    const stats = objectiveStats();
    const weakCount = Object.values(stats).filter((s) => s.status === 'weak').length;
    const fSel = h('select', { 'aria-label': 'Choose a foundation' }, h('option', { value: '' }, 'All foundations'), Object.entries(FOUND).map(([k, v]) => h('option', { value: k }, v)));
    const oSel = h('select', { 'aria-label': 'Choose a learning objective' }, h('option', { value: '' }, 'Any objective'));
    const fillObj = () => { oSel.innerHTML = ''; oSel.append(h('option', { value: '' }, 'Any objective')); Object.entries(BB.objectives).filter(([, o]) => !fSel.value || o.f === fSel.value).forEach(([k, o]) => oSel.append(h('option', { value: k }, o.label))); };
    fSel.addEventListener('change', fillObj); fillObj();
    const nSel = h('select', { 'aria-label': 'Number of questions' }, [5, 10, 15].map((n) => h('option', { value: String(n), selected: n === 10 }, n + ' questions')));
    const mockN = h('select', { 'aria-label': 'Mock length' }, [20, 40].map((n) => h('option', { value: String(n) }, n + ' questions')));
    const timed = h('input', { type: 'checkbox', checked: true, id: 'mock-timed' });
    const go = (fn) => () => { fn(); BB.go('/practice/session'); };
    const total = BB.questions.length, gens = (BB.generators || []).length;
    return h('div',
      h('div.page-head', h('div.eyebrow', 'Placement practice'), h('h1', 'Test your understanding, not your memory'), h('p', `${total} original questions across 4 foundations, plus ${gens} question templates that create fresh variations every time. Levels: beginner, intermediate and application.`)),
      active ? h('div.callout.accent', { style: { marginBottom: '14px' } }, h('strong', 'You have an unfinished session'), `${active.label}: ${active.answers.filter((a) => a != null).length} of ${active.items.length} answered. `, h('div.btn-row', { style: { marginTop: '8px' } }, h('a.btn.btn-primary.btn-sm', { href: '#/practice/session' }, 'Resume'), h('button.btn.btn-sm', { type: 'button', onclick: () => { S().activeSession = null; BB.store.saveNow(); BB.dispatch(); } }, 'Discard it'))) : null,
      disclaimer(),
      h('div.grid-2', { style: { marginTop: '16px' } },
        h('div.card', h('div.eyebrow', 'Start here'), h('h3', 'Diagnostic'), h('p.small.muted', `${st.diagnostic ? 'Taken ' + new Date(st.diagnostic.t).toLocaleDateString() + '. Retake it any time.' : 'About 20 short questions across everything, with an "I don\'t know yet" option so you never have to guess.'} Your answers build a personal learning path.`), h('button.btn.btn-primary', { type: 'button', onclick: go(startDiagnostic) }, st.diagnostic ? 'Retake diagnostic' : 'Start diagnostic')),
        h('div.card', h('div.eyebrow', 'Spaced review'), h('h3', `Review queue: ${dueCount()} due`), h('p.small.muted', 'Questions you missed and lessons you finished come back after 1, 2, 4, 8 and 16 days. Retrieving an idea when it is starting to fade makes it stick.'), h('a.btn' + (dueCount() ? '.btn-primary' : ''), { href: '#/review' }, 'Open review queue')),
        h('div.card', h('div.eyebrow', 'Topic practice'), h('h3', 'Immediate feedback'), h('p.small.muted', 'Pick a foundation or one learning objective. After each answer you see why it is right or what reasoning went wrong.'),
          h('div.stack', h('div.field', fSel), h('div.field', oSel), h('div.field', nSel)),
          h('div.btn-row', { style: { marginTop: '12px' } }, h('button.btn.btn-primary', { type: 'button', onclick: go(() => startTopic({ foundation: fSel.value || null, objective: oSel.value || null, n: +nSel.value })) }, 'Start practice'), h('button.btn.btn-ghost', { type: 'button', onclick: go(() => startTopic({ weakest: true, n: 10 })) }, weakCount ? `My ${weakCount} weakest areas` : 'Target weak areas'))),
        h('div.card', h('div.eyebrow', 'Mock assessment'), h('h3', 'Mixed, with a clock'), h('p.small.muted', 'Questions from all four foundations at all three levels, drawn from what the three courses teach. You can move back and forth and flag questions; explanations appear after you submit. About 90 seconds per question when timed.'),
          h('div.stack', h('div.field', mockN), h('label.check-row', timed, 'Timed')),
          h('button.btn.btn-primary', { type: 'button', style: { marginTop: '12px' }, onclick: go(() => startMock({ n: +mockN.value, timed: timed.checked })) }, 'Start mock'))),
      sessionsList(),
      h('div.section', h('h2', 'How to read your scores'), h('div.grid-3',
        h('div.card.flat', h('h3', 'Below 60%'), h('p.small.muted', 'Go back to the lessons for the objectives you missed. Read the explanation for every wrong answer: the reasoning matters more than the letter.')),
        h('div.card.flat', h('h3', '60 to 79%'), h('p.small.muted', 'The basics are there. Practice your weakest objectives and explain each answer in your own words before checking it.')),
        h('div.card.flat', h('h3', '80% or more'), h('p.small.muted', 'Strong on these questions. Keep testing yourself on new variations and application questions, and keep up with your Coursera assignments.')))));
  }
  function sessionsList() {
    const ss = S().sessions.slice(-8).reverse();
    if (!ss.length) return null;
    return h('div.section', h('h2', 'Recent sessions'), h('div.card', h('ul.list-plain', ss.map((s) => h('li.row.between', h('span', h('strong', s.label || s.mode), h('span.small.muted', ' ' + new Date(s.t).toLocaleString())), h('span.chip' + (s.pct >= 80 ? '.green' : s.pct >= 60 ? '.orange' : '.red'), s.pct != null ? s.pct + '%' : ''))))));
  }

  let timerHandle = null;
  function sessionView() {
    const sess = S().activeSession;
    if (!sess) {
      const last = S().lastResult;
      return last ? resultsView(last) : h('div.empty', 'No active session. ', h('a', { href: '#/practice' }, 'Start one from the practice page.'));
    }
    if (!sess.items.length) { S().activeSession = null; BB.store.saveNow(); return h('div.empty', 'There were no questions for that choice yet. ', h('a', { href: '#/practice' }, 'Choose another topic.')); }
    const i = sess.at, q = sess.items[i];
    const wrap = h('div', { style: { maxWidth: '820px', margin: '0 auto' } });
    const top = h('div.quiz-top', h('div', h('div.eyebrow', sess.label), h('strong', `Question ${i + 1} of ${sess.items.length}`)));
    if (sess.timed) {
      const tEl = h('span.timer', { 'aria-live': 'off', role: 'timer' });
      const tick = () => {
        const s = Math.max(0, Math.round((sess.endsAt - Date.now()) / 1000));
        tEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} left`;
        tEl.classList.toggle('low', s < 120);
        if (s <= 0) { clearInterval(timerHandle); finish(sess); BB.go('/practice/results'); }
      };
      clearInterval(timerHandle); timerHandle = setInterval(tick, 1000); tick();
      top.append(tEl);
    }
    wrap.append(top, h('div.meter.thin', { style: { margin: '6px 0 14px' } }, h('span', { style: { width: pct(sess.answers.filter((a) => a != null).length, sess.items.length) + '%' } })));
    const objLabel = (q.obj || []).map((o) => BB.objectives[o] && BB.objectives[o].label).filter(Boolean)[0];
    const meta = h('div.q-meta', h('span.level-badge', LEVEL[q.level || 1]), objLabel ? h('span.chip', objLabel) : null, q.gen ? h('span.chip.violet', 'Fresh variation') : null);
    let card;
    if (sess.deferred) {
      const qx = sess.mode === 'diagnostic' ? Object.assign({}, q, { options: q.options.concat([{ t: "I don't know yet", why: 'Choosing this is honest and useful: it tells BioBridge to include this topic in your path.' }]), noShuffle: false }) : q;
      const idkIndex = qx.options.length - 1;
      card = BB.ui.mcq(qx, { mode: 'select', meta, seed: sess.seeds[i], selected: sess.mode === 'diagnostic' && sess.unsure[i] ? idkIndex : sess.answers[i], onAnswer: (_, oi) => {
        if (sess.mode === 'diagnostic' && oi === idkIndex) { sess.answers[i] = -1; sess.unsure[i] = true; } else { sess.answers[i] = oi; sess.unsure[i] = false; }
        BB.store.saveSoon(); navBtns();
      } });
    } else {
      const answered = sess.answers[i] != null;
      card = BB.ui.mcq(q, { meta, seed: sess.seeds[i], showExplainOnCorrect: true, onAnswer: (ok, oi) => {
        sess.answers[i] = oi;
        record(q, ok, sess.mode);
        schedule(q, ok);
        BB.store.saveSoon(); navBtns();
        const L = q.lesson && BB.lessonMeta[q.lesson];
        if (!ok && L) card.append(h('div.btn-row', { style: { marginTop: '10px' } }, h('a.btn.btn-sm.btn-ghost', { href: '#/lesson/' + q.lesson, target: '_self' }, BB.ui.icon('learn'), 'Revisit: ' + L.title), h('span.small.muted', 'Added to your review queue.')));
      } });
      if (answered) setTimeout(() => { const b = card.querySelector(`.option[data-i="${sess.answers[i]}"]`); if (b) b.click(); }, 0);
    }
    wrap.append(card);
    const navRow = h('div.btn-row', { style: { marginTop: '16px', justifyContent: 'space-between' } });
    wrap.append(navRow);
    function navBtns() {
      navRow.innerHTML = '';
      const prev = h('button.btn', { type: 'button', disabled: i === 0, onclick: () => { sess.at--; BB.dispatch(); } }, BB.ui.icon('left'), 'Previous');
      const isLast = i === sess.items.length - 1;
      const canNext = sess.deferred || sess.answers[i] != null;
      const next = h('button.btn.btn-primary', { type: 'button', disabled: !canNext, onclick: () => {
        if (isLast) {
          const unanswered = sess.answers.filter((a) => a == null).length;
          if (sess.deferred && unanswered && !confirm(`${unanswered} question${unanswered === 1 ? ' is' : 's are'} unanswered. Submit anyway?`)) return;
          clearInterval(timerHandle); finish(sess); BB.go('/practice/results');
        } else { sess.at++; BB.store.saveSoon(); BB.dispatch(); }
      } }, isLast ? (sess.deferred ? 'Submit and see results' : 'Finish') : 'Next', isLast ? null : BB.ui.icon('right'));
      const left = h('div.btn-row', sess.deferred ? prev : null, sess.mode === 'mock' ? h('button.btn' + (sess.flags[i] ? '.btn-ghost' : ''), { type: 'button', 'aria-pressed': String(sess.flags[i]), onclick: () => { sess.flags[i] = !sess.flags[i]; BB.store.saveSoon(); navBtns(); grid(); } }, BB.ui.icon('flag'), sess.flags[i] ? 'Flagged' : 'Flag') : null);
      navRow.append(left, h('div.btn-row', h('button.btn.btn-quiet', { type: 'button', onclick: () => { if (confirm('Leave this session? Your answers so far are kept and you can resume from the practice page.')) BB.go('/practice'); } }, 'Pause'), next));
    }
    navBtns();
    const gridEl = h('div');
    function grid() {
      gridEl.innerHTML = '';
      if (!sess.deferred) return;
      gridEl.append(h('div.section', h('div.eyebrow', 'Jump to a question'), h('div.btn-row', sess.items.map((_, k) => h('button.btn.btn-sm' + (k === i ? '.btn-primary' : sess.answers[k] != null ? '.btn-ghost' : ''), { type: 'button', 'aria-label': `Question ${k + 1}${sess.answers[k] != null ? ', answered' : ''}${sess.flags[k] ? ', flagged' : ''}`, onclick: () => { sess.at = k; BB.dispatch(); } }, String(k + 1), sess.flags[k] ? ' ⚑' : '')))));
    }
    grid();
    wrap.append(gridEl);
    if (sess.mode === 'diagnostic') wrap.append(h('p.small.muted', { style: { marginTop: '16px' } }, 'No feedback during the diagnostic, so it measures what you already know. You will see every explanation at the end.'));
    return wrap;
  }

  function resultsView(sess) {
    const r = sess.result || { correct: 0, total: 0, byObj: {} };
    const p = pct(r.correct, r.total);
    const wrap = h('div', { style: { maxWidth: '900px', margin: '0 auto' } });
    const isDiag = sess.mode === 'diagnostic';
    wrap.append(h('div.score-hero', h('div.eyebrow', { style: { color: '#9be6d2' } }, isDiag ? 'Diagnostic complete' : sess.mode === 'mock' ? 'Mock assessment complete' : 'Session complete'),
      h('div.big', p + '%'), h('p', `${r.correct} of ${r.total} correct` + (r.secs ? ` in ${Math.floor(r.secs / 60)} min ${r.secs % 60} s` : '') + (isDiag && sess.unsure ? `. You chose "I don't know yet" ${sess.unsure.filter(Boolean).length} times.` : '.')),
      h('p', isDiag ? 'This is a starting point, not a grade. Your learning path below puts the lessons you need first.' : p >= 80 ? 'Strong on these questions. Keep testing yourself on fresh variations; strong practice scores are evidence, not proof, of mastery.' : p >= 60 ? 'A solid base. Work on the objectives below that are in red or orange, then practice them again.' : 'Rebuild the foundations first: the explanations below and the linked lessons will help more than retaking straight away.')));
    const fRows = Object.entries(FOUND).map(([f, label]) => {
      const objs = Object.entries(r.byObj).filter(([o]) => BB.objectives[o] && BB.objectives[o].f === f);
      const c = objs.reduce((s, [, v]) => s + v[0], 0), n = objs.reduce((s, [, v]) => s + v[1], 0);
      return n ? h('div.obj-row', h('span.label', label), h('span.val', `${c}/${n}`), h('div.meter', h('span', { style: { width: pct(c, n) + '%' } }))) : null;
    });
    wrap.append(h('div.section', h('h2', 'By foundation'), h('div.card', fRows)));
    const weak = Object.entries(r.byObj).filter(([, v]) => v[0] < v[1]).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).slice(0, 5);
    if (weak.length) wrap.append(h('div.section', h('h2', 'Targeted revision'), h('p.muted', 'Objectives with mistakes in this session, weakest first.'), h('div.card', weak.map(([o, v]) => h('div.obj-row', h('span.label', BB.objectives[o].label), h('span.val', `${v[0]}/${v[1]}`),
      h('div.btn-row', { style: { gridColumn: '1 / -1' } }, lessonsForObj(o).slice(0, 2).map((id) => h('a.btn.btn-sm.btn-ghost', { href: '#/lesson/' + id }, BB.lessonMeta[id].title)), h('button.btn.btn-sm', { type: 'button', onclick: () => { startTopic({ objective: o, n: 5 }); BB.go('/practice/session'); } }, 'Practice 5 more')))))));
    if (isDiag) {
      const path = recommendedPath().slice(0, 8);
      wrap.append(h('div.section', h('h2', 'Your recommended path'), h('p.muted', 'Ordered so that each lesson builds on the ones before it. The full plan is on the Study plan page.'),
        h('div.lesson-list', path.map((x, k) => lessonRow(x.id, k + 1, x.reason))), h('div.btn-row', { style: { marginTop: '12px' } }, h('a.btn.btn-primary', { href: '#/lesson/' + (path[0] ? path[0].id : 'f0-bioinformatics') }, 'Start the first lesson'), h('a.btn', { href: '#/plan' }, 'See the full plan'))));
    }
    if (r.added) wrap.append(h('div.callout.info', { style: { marginTop: '16px' } }, `${r.added} question${r.added === 1 ? '' : 's'} added to your review queue. They come back tomorrow, then at growing intervals.`));
    const onlyWrong = h('input', { type: 'checkbox', id: 'only-wrong', checked: r.correct < r.total });
    const list = h('div.stack');
    const drawList = () => {
      list.innerHTML = '';
      sess.items.forEach((q, i) => {
        const a = sess.answers[i];
        const ok = a === q.answer;
        if (onlyWrong.checked && ok) return;
        const chosen = a != null && a >= 0 ? q.options[a] : null;
        list.append(h('div.card',
          h('div.q-meta', h('span.chip.' + (ok ? 'green' : 'red'), ok ? 'Correct' : a === -1 ? "Didn't know yet" : a == null ? 'Not answered' : 'Incorrect'), h('span.level-badge', LEVEL[q.level || 1]), h('span.chip', (BB.objectives[(q.obj || [])[0]] || {}).label || '')),
          h('div.q-text', { html: md(q.q) }), q.code ? BB.ui.codeBlock({ lang: q.code.lang, code: q.code.src }) : null,
          chosen && !ok ? h('div.feedback.bad', h('strong.lead', 'Your answer: '), h('span', { html: md(chosen.t) }), h('div', { html: md(chosen.why) })) : null,
          h('div.feedback.good', h('strong.lead', 'Answer: '), h('span', { html: md(q.options[q.answer].t) }), h('div', { html: md(q.options[q.answer].why) }), q.explain ? h('div.also', { html: md(q.explain) }) : null),
          q.lesson && BB.lessonMeta[q.lesson] ? h('a.small', { href: '#/lesson/' + q.lesson }, 'Lesson: ' + BB.lessonMeta[q.lesson].title) : null));
      });
      if (!list.children.length) list.append(h('p.muted', 'Nothing to review here: every answer was correct.'));
    };
    onlyWrong.addEventListener('change', drawList);
    drawList();
    wrap.append(h('div.section', h('div.section-head', h('h2', 'Review the reasoning'), h('label.check-row', onlyWrong, 'Show only the questions to review')), list),
      h('div.btn-row', { style: { marginTop: '18px' } }, h('a.btn.btn-primary', { href: '#/practice' }, 'Back to practice'), h('a.btn', { href: '#/progress' }, 'See progress by objective')));
    return wrap;
  }

  function lessonRow(id, n, note) {
    const meta = BB.lessonMeta[id];
    const st = BB.store.peekLesson(id);
    const state = st.completed ? 'done' : st.visited ? 'started' : '';
    return h('a.lesson-row' + (state ? '.' + state : ''), { href: '#/lesson/' + id },
      h('span.num', st.completed ? BB.ui.icon('check') : String(n)),
      h('div', h('div.title', meta.title), h('div.meta', `${meta.min} min` + (note ? ` · ${note}` : '') + (meta.align === 'beyond' ? ' · beyond the prerequisites' : ''))),
      h('span.status', st.completed ? 'Explained' : st.checkPassed ? 'Checked' : st.visited ? 'Started' : ''));
  }

  function reviewView() {
    const due = dueKeys();
    const all = Object.entries(S().review);
    const upcoming = {};
    for (const [, v] of all) { const d = Math.max(0, Math.ceil((v.due - Date.now()) / DAY)); if (d > 0 && d <= 7) upcoming[d] = (upcoming[d] || 0) + 1; }
    const byObj = {};
    for (const [, v] of all) for (const o of v.obj || []) byObj[o] = (byObj[o] || 0) + 1;
    return h('div',
      h('div.page-head', h('div.eyebrow', 'Spaced review'), h('h1', due.length ? `${due.length} item${due.length === 1 ? '' : 's'} ready for review` : 'Nothing due right now'), h('p', 'Missed questions and the checkpoint questions of lessons you finished come back after 1 day, then 2, 4, 8 and 16 days each time you get them right. A miss sends an item back to the start. Question templates come back as a fresh variation, so you practice the idea, not the wording.')),
      h('div.btn-row', h('button.btn.btn-primary', { type: 'button', disabled: !due.length, onclick: () => { startReview(); BB.go('/practice/session'); } }, BB.ui.icon('review'), due.length ? `Start review (${Math.min(15, due.length)} items)` : 'Start review'), h('a.btn', { href: '#/practice' }, 'Practice something new')),
      h('div.grid-2', { style: { marginTop: '18px' } },
        h('div.card', h('h3', 'Coming up'), Object.keys(upcoming).length ? h('ul.list-plain', Object.entries(upcoming).sort((a, b) => a[0] - b[0]).map(([d, n]) => h('li.row.between', h('span', d === '1' ? 'Tomorrow' : `In ${d} days`), h('strong', String(n))))) : h('p.muted', 'Nothing scheduled in the next week.'), h('p.small.muted', `${all.length} item${all.length === 1 ? '' : 's'} in your queue in total.`)),
        h('div.card', h('h3', 'What is in your queue'), Object.keys(byObj).length ? h('ul.list-plain', Object.entries(byObj).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([o, n]) => h('li.row.between', h('span.small', (BB.objectives[o] || {}).label || o), h('span.chip', String(n))))) : h('p.muted', 'Finish a lesson or a practice session to fill your queue.'))));
  }

  function progressView() {
    const st = S();
    const stats = objectiveStats();
    const done = Object.values(st.lessons).filter((l) => l.completed).length;
    const checked = Object.values(st.lessons).filter((l) => l.checkPassed).length;
    const total = Object.keys(BB.lessonMeta).length;
    const week = st.attempts.filter((a) => a.t > Date.now() - 7 * DAY && a.m !== 'lesson');
    const labsDone = Object.keys(st.labs).length + Object.keys(st.missions).length + Object.keys(st.traces).length;
    const wrap = h('div',
      h('div.page-head', h('div.eyebrow', 'Progress'), h('h1', 'What you have practiced'), h('p', 'Lessons, practice and review are tracked separately. Completing a lesson is not the same as mastering it, so each learning objective shows how you do on practice questions over time.')),
      h('div.stats',
        h('div.stat', h('strong', `${done}/${total}`), h('span', 'lessons explained in your own words')),
        h('div.stat', h('strong', `${checked}/${total}`), h('span', 'lesson checkpoints passed')),
        h('div.stat', h('strong', week.length ? pct(week.filter((a) => a.c).length, week.length) + '%' : 'n/a'), h('span', `practice accuracy, last 7 days (${week.length} answers)`)),
        h('div.stat', h('strong', String(labsDone)), h('span', 'labs, missions and traces completed'))),
      h('div.callout.info', { style: { marginTop: '14px' } }, h('strong', 'How to read the labels'), '"Consistent in practice" needs at least 80% recent accuracy across 3 or more different questions, including an intermediate or application question. It is evidence, not proof: the real test of understanding is explaining an idea and using it on a problem you have not seen.'));
    for (const f of BB.foundations) {
      const objs = Object.entries(BB.objectives).filter(([, o]) => o.f === f.id);
      wrap.append(h('div.section', h('h2', `${f.short}: ${f.title}`), h('div.card', objs.map(([o, ob]) => {
        const s = stats[o], [label, color] = STATUS[s.status];
        return h('div.obj-row',
          h('span.label', ob.label),
          h('span.val', h('span.chip' + (color ? '.' + color : ''), label), ' ', s.n ? `${Math.round(s.acc * 100)}% of ${s.n}` : ''),
          h('div.meter', h('span', { style: { width: (s.acc == null ? 0 : Math.round(s.acc * 100)) + '%', background: s.status === 'weak' ? 'var(--red)' : s.status === 'developing' ? 'var(--orange)' : undefined } })),
          h('div.btn-row', { style: { gridColumn: '1 / -1' } }, lessonsForObj(o).slice(0, 2).map((id) => h('a.btn.btn-sm.btn-quiet', { href: '#/lesson/' + id }, BB.lessonMeta[id].title)), h('button.btn.btn-sm', { type: 'button', onclick: () => { startTopic({ objective: o, n: 5 }); BB.go('/practice/session'); } }, 'Practice')));
      }))));
    }
    return wrap;
  }

  BB.practice = { objectiveStats, record, schedule, addLessonToReview, dueCount, dueKeys, startDiagnostic, startTopic, startMock, startReview, finish, recommendedPath, hub, sessionView, resultsView, reviewView, progressView, lessonRow, STATUS, FOUND, LEVEL, lessonsForObj, pool };
})();
