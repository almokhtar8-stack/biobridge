/* Pages: home, learn, course companion, labs, glossary, notebook, study plan, about. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md, pct, fmt } = BB;
  const S = () => BB.store.state;
  const FICON = { f0: 'dna', f1: 'terminal', f2: 'code', f3: 'stats' };
  const lessonsIn = (f) => f.units.flatMap((u) => u.lessons);
  const doneIn = (ids) => ids.filter((id) => (S().lessons[id] || {}).completed).length;

  function nextActions() {
    const acts = [];
    const due = BB.practice.dueCount();
    if (due) acts.push({ icon: 'review', eyebrow: 'Spaced review', title: `${due} item${due === 1 ? '' : 's'} ready for review`, text: 'A few minutes of recall now keeps earlier lessons from fading.', href: '#/review', cta: 'Review now' });
    const path = BB.practice.recommendedPath();
    const nxt = path.find((x) => !x.optional) || path[0];
    if (nxt) { const m = BB.lessonMeta[nxt.id]; acts.push({ icon: 'learn', eyebrow: `Next lesson \u00b7 ${m.min} min`, title: m.title, text: nxt.reason || 'Next in your learning path.', href: '#/lesson/' + nxt.id, cta: (S().lessons[nxt.id] || {}).visited ? 'Continue' : 'Start lesson' }); }
    if (!S().diagnostic) acts.push({ icon: 'practice', eyebrow: 'About 15 minutes', title: 'Find your starting point', text: 'A short diagnostic builds a personal path and skips what you already know.', href: '#/practice', cta: 'Open practice', run: () => { BB.practice.startDiagnostic(); BB.go('/practice/session'); } });
    else {
      const st = BB.practice.objectiveStats();
      const weak = Object.entries(st).filter(([, s]) => s.status === 'weak').sort((a, b) => a[1].acc - b[1].acc)[0];
      if (weak) acts.push({ icon: 'practice', eyebrow: 'Targeted practice', title: BB.objectives[weak[0]].label, text: `Recent accuracy ${Math.round(weak[1].acc * 100)}%. Five fresh questions with explanations.`, cta: 'Practice', run: () => { BB.practice.startTopic({ objective: weak[0], n: 5 }); BB.go('/practice/session'); } });
    }
    return acts.slice(0, 3);
  }
  function actionCard(a) {
    return h('div.card.next-card', h('div.f-icon.f0', BB.ui.icon(a.icon)), h('div', h('div.eyebrow', a.eyebrow), h('h3', a.title), h('p.small.muted', a.text)),
      a.run ? h('button.btn.btn-primary', { type: 'button', onclick: a.run }, a.cta) : h('a.btn.btn-primary', { href: a.href }, a.cta));
  }


  function home() {
    const st = S();
    const total = Object.keys(BB.lessonMeta).length, done = BB.lessonsDone();
    const days = BB.daysLeft();
    const week = st.attempts.filter((a) => a.t > Date.now() - 7 * BB.DAY && a.m !== 'lesson');
    const fresh = !st.diagnostic && !Object.keys(st.lessons).length;
    const path = BB.practice.recommendedPath();
    const cont = path.find((x) => !x.optional) || path[0];
    const SEQ = [['What is it?', 'A plain definition first.'], ['Why does it exist?', 'The problem it solves.'], ['How does it work?', 'Step by step.'], ['Show me', 'A worked example with real output.'], ['Let me try', 'A lab, terminal or code activity.'], ['Test my understanding', 'Feedback that explains mistakes.'], ['Connect it', 'Where it matters in real science.']];
    return h('div',
      h('section.hero',
        h('div.confetti', { 'aria-hidden': 'true' }, Array.from({ length: 12 }, () => h('span'))),
        h('div.hero-inner',
          h('h1', 'Your ', h('span.hl', 'bridge'), ' into bioinformatics'),
          h('p.hero-lead', 'You do not need a background. You need the why. Learn biology, Linux, Python, R and statistics from absolute zero, see how each tool supports real discoveries, and prepare for the KAUST Academy placement assessment with original practice questions.'),
          h('div.btn-row',
            fresh ? h('button.btn.btn-primary', { type: 'button', onclick: () => { BB.practice.startDiagnostic(); BB.go('/practice/session'); } }, 'Find my starting point (15 min)') : cont ? h('a.btn.btn-primary', { href: '#/lesson/' + cont.id }, 'Continue: ' + BB.lessonMeta[cont.id].title) : h('a.btn.btn-primary', { href: '#/practice' }, 'Go to practice'),
            h('a.btn.btn-ghost', { href: '#/lesson/f0-bioinformatics' }, fresh ? 'Start from absolute zero' : 'Browse all lessons')),
          h('p.hero-note', 'Independent study companion. Not an official KAUST, KAUST Academy or Coursera site.'))),
      h('div.stats.lifted',
        h('div.stat', h('strong', days ? `${days} day${days === 1 ? '' : 's'}` : 'Deadline passed'), h('span', `until ${BB.config.deadlineLabel} (your cohort's course deadline)`)),
        h('div.stat', h('strong', `${done} / ${total}`), h('span', 'lessons explained in your own words')),
        h('div.stat', h('strong', String(BB.practice.dueCount())), h('span', 'review items due')),
        h('div.stat', h('strong', week.length ? pct(week.filter((a) => a.c).length, week.length) + '%' : 'n/a'), h('span', 'practice accuracy, last 7 days'))),
      h('div.section-head.center', h('div.eyebrow', 'Start here'), h('h2', 'Your next useful actions'), h('p', 'Chosen from your diagnostic, lessons and review queue.')),
      h('div.stack', nextActions().map(actionCard)),
      h('div.section-head.center', h('div.eyebrow', 'Your learning path'), h('h2', 'Four foundations'), h('p', 'One connected journey, ordered so that each idea builds on the one before.')),
      h('div.grid-2', BB.foundations.map((f) => {
        const ids = lessonsIn(f), d = doneIn(ids);
        return h('a.card.card-link', { href: '#/learn/' + f.id },
          h('div.row', h('div.f-icon.' + f.id, BB.ui.icon(FICON[f.id])), h('div', h('div.eyebrow', f.short), h('h3', f.title))),
          h('p.small.muted', { style: { marginTop: '8px' } }, f.blurb),
          h('div.row.between', { style: { marginTop: '10px' } }, h('span.small', `${d}/${ids.length} lessons explained`), h('span.small.muted', `${ids.reduce((s, id) => s + BB.lessonMeta[id].min, 0)} min`)),
          h('div.meter', { style: { marginTop: '6px' } }, h('span', { style: { width: pct(d, ids.length) + '%' } })));
      })),
      h('div.section-head.center', h('div.eyebrow', 'The method'), h('h2', 'How every lesson works'), h('p', 'Short sections, one idea at a time, with optional depth when you want it.')),
      h('div.grid-4', SEQ.map(([t, d], i) => h('div.card.flat', h('div.eyebrow', `Step ${i + 1}`), h('h3', t), h('p.small.muted', d)))),
      h('div.section-head.center', h('div.eyebrow', 'Why it matters'), h('h2', 'How a basic skill becomes a discovery'), h('p', 'Real question: what do human cells switch on when they overheat?')),
      h('div.grid-4', [['Biology', 'Ask what changed', 'Heat can switch genes on.', 'f0-expression'], ['Linux', 'Handle the reads', 'Millions of reads live in files on a server.', 'f1-bio-recipes'], ['Python and R', 'Build the table', 'Count reads per gene, compare samples fairly.', 'f3-counts'], ['Statistics', 'Find real changes', 'Separate signal from noise across 20,000 genes.', 'f3-de']].map(([e, t, d, id]) => h('a.card.card-link', { href: '#/lesson/' + id }, h('div.eyebrow', e), h('h3', t), h('p.small.muted', d)))),
      h('div.callout.info', { style: { marginTop: '12px' } }, h('strong', 'Where the courses fit: '), 'Linux handles files and workflows, Python organizes and processes data, R tests patterns and draws plots, and statistics decides what you can trust. Together they turn a biological question into a testable hypothesis, not an automatic answer.'),
      h('div.section-head.center', h('div.eyebrow', 'Course companion'), h('h2', 'Built around your three Coursera courses'), h('p', 'The course companion maps every module to the lessons that support it.')),
      h('div.grid-3', Object.entries(BB.courses).map(([k, c]) => h('a.card.card-link', { href: '#/courses#' + k }, h('div.eyebrow', c.org), h('h3', c.name), h('p.small.muted', `${c.modules.length} modules`)))),
      h('p.footer-note', 'BioBridge is an independent learning companion. It is not affiliated with, endorsed by or run by KAUST, KAUST Academy, Coursera, Rice University or IBM. The 5 December 2026 date comes from your cohort information; always confirm deadlines and requirements in your official invitation. Practice questions are original and are not official assessment questions.'));
  }

  function learn(params) {
    const sel = params.f || 'all';
    const filters = [['all', 'All foundations']].concat(BB.foundations.map((f) => [f.id, f.short + ': ' + f.title]));
    const wrap = h('div',
      h('div.page-head', h('div.eyebrow', 'Learn'), h('h1', 'Learn the pieces. Connect the whole.'), h('p', 'Every lesson starts from zero and follows the same sequence. Work from the top, follow your diagnostic path, or jump to the lessons that support the Coursera module you are on.')),
      h('div.tabs', { role: 'tablist', 'aria-label': 'Filter by foundation' }, filters.map(([k, l]) => h('a.tab', { href: '#/learn' + (k === 'all' ? '' : '/' + k), role: 'tab', 'aria-selected': String(k === sel) }, l))),
      h('div.legend', { style: { margin: '12px 0 0' } }, Object.values(BB.ALIGN).map(([l, c]) => h('span', h('span.chip.' + c, l)))));
    let n = 0;
    for (const f of BB.foundations) {
      const ids = lessonsIn(f);
      if (sel !== 'all' && sel !== f.id) { n += ids.length; continue; }
      const block = h('section.section', h('div.row', h('div.f-icon.' + f.id, BB.ui.icon(FICON[f.id])), h('div', h('div.eyebrow', f.short), h('h2', f.title))), h('p.muted', { style: { marginTop: '6px' } }, f.blurb));
      for (const u of f.units) {
        block.append(h('div.unit', h('h3.unit-title', u.title), h('div.lesson-list', u.lessons.map((id) => {
          n++;
          const m = BB.lessonMeta[id], st = BB.store.peekLesson(id);
          const [al, ac] = BB.ALIGN[m.align];
          return h('a.lesson-row' + (st.completed ? '.done' : st.visited ? '.started' : ''), { href: '#/lesson/' + id },
            h('span.num', st.completed ? BB.ui.icon('check') : String(n)),
            h('div', h('div.title', m.title), h('div.meta', `${m.min} min \u00b7 `, h('span', { style: { color: `var(--${ac})` } }, al), m.courses.length ? ' \u00b7 ' + m.courses.map(BB.courseLabel).join(', ') : '')),
            h('span.status', st.completed ? 'Explained' : st.checkPassed ? 'Checked' : st.visited ? 'Started' : ''));
        }))));
      }
      wrap.append(block);
    }
    return wrap;
  }

  const STATUS_OPTS = [['', 'Not started'], ['active', 'Taking it now'], ['done', 'Finished']];
  function courseStatusSelect(key) {
    const sel = h('select', { 'aria-label': 'My status in ' + BB.courses[key].name }, STATUS_OPTS.map(([v, l]) => h('option', { value: v, selected: (S().settings.courseStatus || {})[key] === v || (!v && !(S().settings.courseStatus || {})[key]) }, l)));
    sel.addEventListener('change', () => { S().settings.courseStatus = Object.assign({}, S().settings.courseStatus, { [key]: sel.value }); BB.store.saveSoon(); BB.ui.toast('Saved. Your recommended path now takes this into account.'); });
    return sel;
  }
  function courses() {
    const NOTES = {
      kaust: 'BioBridge follows this course most closely in Foundation 3 (R, statistics and RNA-seq) and in the data parts of Foundation 2 (pandas and NumPy). The course works from count data; the lessons on FASTA, FASTQ and alignment explain where those counts come from.',
      rice: 'This course covers expressions, variables, functions, logic, conditionals and modules. Strings, lists, loops, dictionaries and files are not part of it; BioBridge teaches them in Foundation 2B because the KAUST course uses Python with pandas and NumPy.',
      ibm: 'Foundation 1 follows this course module by module, using a simulated terminal with biological files. The final project (a scheduled backup script) is graded by peers, so BioBridge teaches the underlying skills without giving a solution.'
    };
    return h('div',
      h('div.page-head', h('div.eyebrow', 'Course companion'), h('h1', 'Follow your Coursera courses, fill the gaps'), h('p', 'Pick the module you are working on and open the lessons that explain it from zero. Module titles and summaries come from the public course pages (checked 7 November 2026). BioBridge does not replace the courses or their graded work.')),
      h('div.callout.warn', 'Complete the official Coursera courses and their assessments; that is what counts for the program. Check the official KAUST Academy program page and your invitation for the current requirements: ', h('a', { href: BB.academyUrl, target: '_blank', rel: 'noopener noreferrer' }, 'KAUST Academy Bioinformatics program')),
      Object.entries(BB.courses).map(([key, c]) => h('section.section', { id: key },
        h('div.card',
          h('div.row.between', h('div', h('div.eyebrow', c.org), h('h2', c.name)), h('div.field', { style: { minWidth: '180px' } }, h('label.small', 'My status'), courseStatusSelect(key))),
          h('p', { style: { marginTop: '8px' } }, c.about),
          h('div.chips', c.outcomes.map((o) => h('span.chip', o))),
          h('p.small', { style: { marginTop: '10px' } }, h('a', { href: c.url, target: '_blank', rel: 'noopener noreferrer' }, 'Open the course on Coursera ', BB.ui.icon('external'))),
          h('div.callout.info', { style: { marginTop: '10px' } }, NOTES[key]),
          c.modules.map((m) => {
            const ids = BB.lessonOrder().filter((id) => BB.lessonMeta[id].courses.includes(m.id));
            return h('div', { style: { marginTop: '16px' } }, h('h3', `Module ${m.n}: ${m.title}`), h('p.small.muted', m.summary),
              ids.length ? h('div.lesson-list', { style: { marginTop: '8px' } }, ids.map((id, i) => BB.practice.lessonRow(id, i + 1, BB.ALIGN[BB.lessonMeta[id].align][0]))) : h('p.small.muted', key === 'ibm' && m.n === 4 ? 'Revise Foundation 1, especially scripts, loops, archives and cron, before the final project and exam.' : 'No specific lesson.'));
          })))));
  }

  /* ---------- labs ---------- */
  const PY_EXAMPLES = [
    ['GC content of a sequence', 'seq = "ATGCGCGATTACAGGC"\ngc = seq.count("G") + seq.count("C")\nprint("length:", len(seq))\nprint("GC content:", round(gc / len(seq) * 100, 1), "%")'],
    ['Reverse complement', 'pairs = {"A": "T", "T": "A", "G": "C", "C": "G"}\nseq = "ATGGCCAAATTT"\nrc = ""\nfor base in seq:\n    rc = pairs[base] + rc\nprint(rc)'],
    ['Read samples.tsv', 'with open("samples.tsv") as f:\n    header = f.readline().strip().split("\\t")\n    print("columns:", header)\n    for line in f:\n        parts = line.strip().split("\\t")\n        print(parts[0], "is", parts[1])'],
    ['Mean counts per condition', 'with open("counts.tsv") as f:\n    f.readline()\n    for line in f:\n        parts = line.strip().split("\\t")\n        gene = parts[0]\n        counts = [int(x) for x in parts[1:]]\n        ctrl = sum(counts[:3]) / 3\n        heat = sum(counts[3:]) / 3\n        print(gene, round(heat / ctrl, 2))'],
    ['Days until a deadline (datetime)', 'import datetime\ntoday = datetime.date.today()\ndeadline = datetime.date(2026, 12, 5)\nprint("Days left:", (deadline - today).days)']
  ];
  function playground() {
    const sel = h('select', { 'aria-label': 'Example program' }, PY_EXAMPLES.map(([t], i) => h('option', { value: String(i) }, t)));
    const holder = h('div');
    const draw = () => { holder.innerHTML = ''; holder.append(BB.pyrun.editor(PY_EXAMPLES[+sel.value][1], { rows: 10 })); };
    sel.addEventListener('change', draw); draw();
    return h('div.widget', h('div.widget-head', h('div', h('div.eyebrow', 'Real Python'), h('h3', 'Python playground')), h('div.field', sel)), holder);
  }
  const LABS = [
    ['Biology', 'dogma', 'DNA to RNA to protein', 'Edit a gene, change single letters and see silent, missense, nonsense and frameshift changes.', () => BB.widgets.dogma(), ['f0-dogma']],
    ['Biology', 'expression', 'Same genome, different cells', 'Which genes are on in liver, nerve, muscle and blood cells, and what heat does.', () => BB.widgets.expression(), ['f0-expression']],
    ['Biology', 'journey', 'From question to discovery', 'Walk through a whole heat-shock project and see which skill each step needs.', () => BB.widgets.journey(), ['f0-discovery']],
    ['Linux', 'terminal', 'Practice terminal', 'A simulated Bash shell with the heat-shock project files. Explore freely; Reset restores everything.', () => BB.widgets.terminal({}), ['f1-navigate', 'f1-pipes']],
    ['Linux', 'missions', 'Terminal missions', 'Guided tasks on biological files, from finding your way to writing scripts.', null, []],
    ['Linux', 'filetree', 'Folders, files and paths', 'See absolute and relative paths change as you move around, then solve five path challenges.', () => BB.widgets.filetree(), ['f1-paths']],
    ['Linux', 'cron', 'Cron schedule explainer', 'Build a crontab line and read it in plain English with the next run times.', () => BB.widgets.cron(), ['f1-cron']],
    ['Python', 'python', 'Python playground', 'Edit and run real Python in your browser, with the practice files available.', playground, ['f2-first-program', 'f2-files']],
    ['Python', 'traces', 'Be the computer', 'Step through recorded Python programs line by line and predict each change.', null, []],
    ['Data', 'datatable', 'Read a dataset', 'Link a count table to its sample metadata and annotation.', () => BB.widgets.datatable(), ['f0-data']],
    ['Data', 'scale', 'How big is the data?', 'Estimate the size of a sequencing experiment and why computers are needed.', () => BB.widgets.scale(), ['f0-why-code']],
    ['Data', 'fastq', 'FASTQ decoder', 'Decode quality characters into Phred scores and error probabilities, and try trimming.', () => BB.widgets.fastq(), ['f3-fastq']],
    ['Data', 'countmatrix', 'Count-matrix explorer', 'Genes by samples: raw counts, counts per million and log scale.', () => BB.widgets.countmatrix(), ['f3-counts']],
    ['Data', 'normalization', 'Is gene X really higher?', 'Sequencing depth and composition bias with a slider (the BioBridge 1.0 lab, extended).', () => BB.widgets.normalization(), ['f3-normalization']],
    ['Statistics', 'rnaseq', 'Guided RNA-seq experiment', 'Heat shock versus control: normalize, compare replicates, read a volcano plot, interpret.', () => BB.widgets.rnaseq(), ['f3-de']],
    ['Statistics', 'log2', 'Fold change on the log2 scale', 'Why doubling is +1 and halving is -1, and what pseudocounts are for.', () => BB.widgets.log2(), ['f3-foldchange']],
    ['Statistics', 'variability', 'Same difference, different evidence', 'How replicates and spread change a t-test, with real toy genes.', () => BB.widgets.variability(), ['f3-variability', 'f3-tests']],
    ['Statistics', 'correlation', 'Correlation and a fitted line', 'Pearson r, R squared, outliers, and why correlation is not causation.', () => BB.widgets.correlation(), ['f3-correlation']],
    ['Statistics', 'pvalues', 'Testing thousands of genes', 'Simulate experiments with no real change and watch false positives appear.', () => BB.widgets.pvalues(), ['f3-multiple']],
    ['Single-cell', 'singlecell-qc', 'Single-cell quality control', 'Set cutoffs that remove damaged cells without losing healthy ones.', () => BB.widgets.singlecell({ mode: 'qc' }), ['f3-single-cell']],
    ['Single-cell', 'singlecell-clusters', 'Name the clusters', 'Use marker genes to label immune cell clusters.', () => BB.widgets.singlecell({ mode: 'clusters' }), ['f3-clusters']],
    ['Interpretation', 'methods', 'Choose the right method', 'Match biological questions to the right measurement and analysis.', () => BB.widgets.methods(), ['f3-interpret']]
  ];
  function labDone(id) { const st = S(); if (id === 'missions') return Object.keys(st.missions).length; if (id === 'traces') return Object.keys(st.traces).length; return st.labs[id] ? 1 : 0; }
  function labs() {
    const groups = [...new Set(LABS.map((l) => l[0]))];
    return h('div',
      h('div.page-head', h('div.eyebrow', 'Interactive labs'), h('h1', 'Touch the idea. Do not just read it.'), h('p', 'Every lab is also embedded in its lesson. Simulations are labelled as simulations; Python labs run real Python.')),
      groups.map((g) => h('section.section', h('h2', g), h('div.grid-3', LABS.filter((l) => l[0] === g).map(([, id, title, desc]) => h('a.card.card-link', { href: '#/labs/' + id }, h('h3', title), h('p.small.muted', desc), labDone(id) ? h('span.chip.green', id === 'missions' ? `${labDone(id)} completed` : id === 'traces' ? `${labDone(id)} completed` : 'Completed') : null))))));
  }
  function labPage(params) {
    const lab = LABS.find((l) => l[1] === params.id);
    if (!lab) { BB.go('/labs', true); return null; }
    const [group, id, title, desc, make, lessons] = lab;
    let body;
    if (id === 'missions') {
      const missions = Object.entries(BB.missions);
      const lessonFor = (mid) => BB.lessons.find((L) => L.try && L.try.kind === 'terminal' && L.try.mission === mid);
      body = h('div.grid-2', missions.map(([mid, m]) => { const L = lessonFor(mid); return h('a.card.card-link', { href: '#/labs/mission/' + mid }, h('h3', m.title), h('p.small.muted', `${m.steps.length} steps` + (L ? ` \u00b7 from "${BB.lessonMeta[L.id].title}"` : '')), S().missions[mid] ? h('span.chip.green', 'Completed') : null); }));
    } else if (id === 'traces') {
      body = h('div.grid-2', Object.entries(BB.pyPrograms).filter(([pid]) => BB.pyTraces && BB.pyTraces[pid]).map(([pid, p]) => h('a.card.card-link', { href: '#/labs/trace/' + pid }, h('h3', p.title), h('p.small.muted', `${BB.pyTraces[pid].steps.length} steps \u00b7 ${(BB.pyTraces[pid].asks || []).length} predictions`), S().traces[pid] ? h('span.chip.green', 'Completed') : null)));
    } else body = make();
    return h('div', h('div.page-head', h('div.crumbs', h('a', { href: '#/labs' }, 'Labs'), ' / ', group), h('h1', title), h('p', desc)), body,
      lessons.length ? h('div.btn-row', { style: { marginTop: '16px' } }, h('span.small.muted', 'Learn the idea in:'), lessons.map((l) => h('a.btn.btn-sm.btn-ghost', { href: '#/lesson/' + l }, BB.lessonMeta[l].title))) : null);
  }
  function missionPage(params) {
    const m = BB.missions[params.id];
    if (!m) { BB.go('/labs/missions', true); return null; }
    return h('div', h('div.page-head', h('div.crumbs', h('a', { href: '#/labs' }, 'Labs'), ' / ', h('a', { href: '#/labs/missions' }, 'Terminal missions')), h('h1', m.title)), BB.widgets.terminal({ mission: params.id }));
  }
  function tracePage(params) {
    const p = BB.pyPrograms[params.id];
    if (!p) { BB.go('/labs/traces', true); return null; }
    return h('div', h('div.page-head', h('div.crumbs', h('a', { href: '#/labs' }, 'Labs'), ' / ', h('a', { href: '#/labs/traces' }, 'Be the computer')), h('h1', p.title)), BB.widgets.trace({ program: params.id }));
  }

  function glossaryPage(params, query) {
    const input = h('input', { type: 'search', placeholder: 'Search 300+ terms', 'aria-label': 'Search the glossary', value: query.get('q') || '' });
    const list = h('div', { 'aria-live': 'polite' });
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      const items = (BB.glossary || []).slice().sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })).filter((g) => !q || (g.term + ' ' + (g.aka || []).join(' ') + ' ' + g.def).toLowerCase().includes(q));
      list.innerHTML = '';
      let letter = '';
      for (const g of items) {
        const L = g.term[0].toUpperCase();
        if (L !== letter) { letter = L; list.append(h('div.gloss-letter', L)); }
        list.append(h('div.gloss-item', h('h3', g.term), g.aka && g.aka.length ? h('div.aka', 'Also: ' + g.aka.join(', ')) : null, h('p', { html: md(g.def) }), h('div.why', { html: md(g.why) }), g.lesson && BB.lessonMeta[g.lesson] ? h('a.small', { href: '#/lesson/' + g.lesson }, 'Lesson: ' + BB.lessonMeta[g.lesson].title) : null));
      }
      if (!items.length) list.append(h('p.empty', 'No matching term.'));
    };
    input.addEventListener('input', draw); draw();
    return h('div', h('div.page-head', h('div.eyebrow', 'Glossary'), h('h1', 'Every scary word, made human'), h('p', `${(BB.glossary || []).length} plain-English definitions, each with why it matters. Inside lessons, dotted-underlined words open these definitions, and the book button at the top opens the glossary from any page.`)), input, h('div.card', { style: { marginTop: '12px' } }, list));
  }

  function notebook() {
    const items = BB.lessonOrder().map((id) => [id, S().lessons[id]]).filter(([, l]) => l && l.teach && l.teach.trim());
    const text = () => items.map(([id, l]) => `## ${BB.lessonMeta[id].title}\n${l.completed ? '(explained ' + new Date(l.completed).toLocaleDateString() + ')' : '(draft)'}\n\n${l.teach.trim()}\n`).join('\n');
    const download = () => { const blob = new Blob(['# My BioBridge explanations\n\n' + text()], { type: 'text/markdown' }); const a = h('a', { href: URL.createObjectURL(blob), download: 'my-biobridge-explanations.md' }); document.body.append(a); a.click(); a.remove(); };
    return h('div', h('div.page-head', h('div.eyebrow', 'My explanations'), h('h1', 'Your own words, in one place'), h('p', 'Everything you wrote in the teach-back sections. Rereading and improving these is one of the best ways to revise. They are stored only in this browser.')),
      items.length ? h('div.btn-row', h('button.btn', { type: 'button', onclick: download }, BB.ui.icon('download'), 'Download as a text file'), h('button.btn', { type: 'button', onclick: () => window.print() }, 'Print')) : null,
      items.length ? h('div.stack', { style: { marginTop: '14px' } }, items.map(([id, l]) => h('div.card', h('div.row.between', h('h3', BB.lessonMeta[id].title), l.completed ? h('span.chip.green', 'Explained') : h('span.chip', 'Draft')), h('p', { style: { whiteSpace: 'pre-wrap', marginTop: '8px' } }, l.teach.trim()), h('a.small', { href: '#/lesson/' + id }, 'Open the lesson to revise')))) : h('div.empty', 'No explanations yet. Each lesson ends with a short teach-back; what you write appears here.'));
  }

  function plan() {
    const st = S();
    const days = BB.daysLeft();
    const path = BB.practice.recommendedPath();
    const needed = path.filter((x) => !x.optional);
    const minutesLeft = needed.reduce((s, x) => s + BB.lessonMeta[x.id].min, 0) * 1.6; // lesson time plus practice and review
    const mins = h('input', { type: 'number', min: '10', max: '300', step: '5', value: String(st.settings.dailyMinutes || 45), 'aria-label': 'Minutes you can study per day', inputmode: 'numeric', style: { maxWidth: '120px' } });
    const pace = h('div', { 'aria-live': 'polite' });
    const drawPace = () => {
      const m = Math.max(10, +mins.value || 45);
      st.settings.dailyMinutes = m; BB.store.saveSoon();
      const need = Math.ceil(minutesLeft / m);
      pace.innerHTML = '';
      pace.append(h('p', needed.length ? `About ${Math.round(minutesLeft / 60)} hours remain for the ${needed.length} lessons in your path, including practice and review. At ${m} minutes a day that is about ${need} day${need === 1 ? '' : 's'}${days ? `; you have ${days} until ${BB.config.deadlineLabel}.` : '.'}` : 'Every lesson in your path is explained. Keep the review queue empty and take mock assessments.'),
        days && need > days ? h('div.callout.warn', 'At this pace the path will not be finished before the deadline. Prioritize the lessons for the course modules you have not passed yet, and use the diagnostic to skip what you know.') : null);
    };
    mins.addEventListener('input', BB.debounce(drawPace, 200));
    drawPace();
    const stages = [
      ['1', 'Foundations from zero', 'Foundation 0 gives you the biology and computing words everything else uses. If the diagnostic shows you know it, skim it.', 'f0'],
      ['2', 'Work through your Coursera courses with the companion', 'For each module you study, open the matching BioBridge lessons in the course companion. Complete the official course work first: that is what counts.', null],
      ['3', 'Practice, review, explain', 'Each study session: clear the review queue, do one lesson including its teach-back, then five practice questions on your weakest objective.', null],
      ['4', 'Mock assessments and final checks', 'Take timed mocks on fresh questions, study every explanation, and confirm on Coursera that each required course shows as complete before the deadline.', null]
    ];
    return h('div',
      h('div.page-head', h('div.eyebrow', 'Study plan'), h('h1', 'Learn before the deadline. Understand beyond it.'), h('p', `Your plan is ordered by what each idea depends on, not by calendar weeks, so you can move as fast as you are able. The ${BB.config.deadlineLabel} date comes from your cohort information; confirm it in your official invitation.`)),
      h('div.stats', h('div.stat', h('strong', days ? `${days} days` : 'Passed'), h('span', `until ${BB.config.deadlineLabel}`)), h('div.stat', h('strong', `${BB.lessonsDone()} / ${Object.keys(BB.lessonMeta).length}`), h('span', 'lessons explained')), h('div.stat', h('strong', String(needed.length)), h('span', 'lessons in your path')), h('div.stat', h('strong', String(BB.practice.dueCount())), h('span', 'review items due'))),
      h('div.card', { style: { marginTop: '14px' } }, h('h3', 'My Coursera courses'), h('p.small.muted', 'Tell BioBridge which course you are taking now; your path puts its supporting lessons first.'), h('div.grid-3', Object.entries(BB.courses).map(([k, c]) => h('div.field', h('label.small', c.short), courseStatusSelect(k))))),
      h('div.card', { style: { marginTop: '14px' } }, h('h3', 'Pace'), h('div.row', h('label', { for: 'pace-min' }, 'Minutes per day'), Object.assign(mins, { id: 'pace-min' })), pace),
      h('div.section', h('h2', 'Four stages'), h('div.grid-2', stages.map(([n, t, d, f]) => h('div.card.flat', h('div.eyebrow', 'Stage ' + n), h('h3', t), h('p.small.muted', d), f ? h('a.btn.btn-sm.btn-ghost', { href: '#/learn/' + f }, 'Open ' + BB.foundations.find((x) => x.id === f).short) : null)))),
      h('div.section', h('div.section-head', h('div', h('h2', 'Your recommended lessons'), h('p', st.diagnostic ? 'Based on your diagnostic, practice results and course status.' : 'Take the diagnostic to personalize this list; until then it follows the curriculum order.')), !st.diagnostic ? h('button.btn.btn-sm.btn-primary', { type: 'button', onclick: () => { BB.practice.startDiagnostic(); BB.go('/practice/session'); } }, 'Take the diagnostic') : null),
        h('div.lesson-list', path.slice(0, 20).map((x, i) => BB.practice.lessonRow(x.id, i + 1, x.reason))), path.length > 20 ? h('p.small.muted', { style: { marginTop: '8px' } }, `And ${path.length - 20} more. `, h('a', { href: '#/learn' }, 'See all lessons')) : null),
      h('div.section', h('h2', 'Use this standard of understanding'), h('div.grid-3',
        h('div.card.flat', h('h3', 'Recognize'), h('p.small.muted', 'Can I say what this term or tool actually means, in plain words?')),
        h('div.card.flat', h('h3', 'Predict'), h('p.small.muted', 'Can I predict what this command, code or analysis will do before I run it?')),
        h('div.card.flat', h('h3', 'Transfer'), h('p.small.muted', 'Can I use it on a new biological example without copying an answer?')))));
  }

  function about() {
    const fileIn = h('input', { type: 'file', accept: 'application/json,.json', 'aria-label': 'Choose a BioBridge progress file' });
    const msg = h('div', { 'aria-live': 'polite' });
    fileIn.addEventListener('change', () => {
      const f = fileIn.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { BB.store.importJSON(rd.result); msg.innerHTML = ''; msg.append(h('div.feedback.good', 'Progress imported.')); BB.ui.applyNav(); } catch (e) { msg.innerHTML = ''; msg.append(h('div.feedback.bad', e.message)); } };
      rd.readAsText(f);
    });
    const counts = { lessons: BB.lessons.length, questions: BB.questions.length, gens: (BB.generators || []).length, glossary: (BB.glossary || []).length, missions: Object.keys(BB.missions).length, traces: Object.keys(BB.pyPrograms).length };
    return h('div', { style: { maxWidth: '860px' } },
      h('div.page-head', h('div.eyebrow', 'About, data and help'), h('h1', 'About BioBridge'), h('p', 'An independent, beginner-first companion for the foundations of bioinformatics, built for students preparing for the KAUST Academy Bioinformatics Program through three Coursera courses.')),
      h('div.callout.warn', h('strong', 'Independent and unofficial'), 'BioBridge is not affiliated with, endorsed by or run by KAUST, KAUST Academy, Coursera, Rice University or IBM. It does not give official course credit. Its practice questions are original; they are not KAUST Academy questions and do not describe the real placement test.'),
      h('div.section', h('h2', 'What is inside'), h('div.stats', h('div.stat', h('strong', String(counts.lessons)), h('span', 'lessons')), h('div.stat', h('strong', String(counts.questions)), h('span', 'practice questions')), h('div.stat', h('strong', String(counts.gens)), h('span', 'question templates')), h('div.stat', h('strong', String(counts.glossary)), h('span', 'glossary terms'))),
        h('p.small.muted', { style: { marginTop: '8px' } }, `Plus ${counts.missions} terminal missions, ${counts.traces} recorded Python traces and ${LABS.length} interactive labs.`)),
      h('div.section', h('h2', 'Your data stays on this device'), h('p', 'Progress, explanations and settings are saved in this browser\'s local storage. Nothing is sent to a server, there is no account and nothing syncs between devices. Clearing browser data, private browsing or a different browser starts fresh, so export a copy now and then.'),
        BB.store.available ? null : h('div.callout.bad', 'This browser is blocking storage, so progress will be lost when you close the page. Export before leaving.'),
        h('div.btn-row', h('button.btn', { type: 'button', onclick: () => BB.store.exportJSON() }, BB.ui.icon('download'), 'Export my progress'), h('label.btn', BB.ui.icon('upload'), 'Import progress', h('span.sr-only', 'choose file'), Object.assign(fileIn, { style: 'position:absolute;opacity:0;width:1px;height:1px' })),
          h('button.btn.btn-danger', { type: 'button', onclick: () => { if (confirm('Delete all BioBridge progress on this device? Export first if you want a copy.')) { BB.store.reset(); BB.ui.toast('Progress reset'); BB.go('/', false); BB.ui.applyNav(); } } }, 'Reset all progress')), msg,
        S().legacy && S().legacy.lessons ? h('p.small.muted', { style: { marginTop: '8px' } }, `${S().legacy.lessons} lessons completed in BioBridge 1.0 were carried over.`) : null),
      h('div.section', h('h2', 'Sources'), h('ul', Object.values(BB.courses).map((c) => h('li', h('a', { href: c.url, target: '_blank', rel: 'noopener noreferrer' }, c.name), ` (${c.org})`)), h('li', h('a', { href: BB.academyUrl, target: '_blank', rel: 'noopener noreferrer' }, 'KAUST Academy Bioinformatics program page'))),
        h('p.small.muted', 'Course structure was checked against these public pages on 7 November 2026. Teaching datasets are simulated (seeded and reproducible); gene names and the direction of the heat-shock response are real biology, the numbers are invented.')),
      h('div.section', h('h2', 'How the interactive parts work'), h('ul',
        h('li', 'The Linux terminal is a teaching simulation written for BioBridge. It runs a defined set of commands on pretend files and matches GNU output formats; it is not a full Bash and nothing runs on your device.'),
        h('li', 'Python labs run real Python 3 in your browser (Pyodide, CPython compiled to WebAssembly). The first run downloads about 13 MB. pandas and NumPy are not loaded.'),
        h('li', 'Step-through Python traces were recorded from real Python and replay exactly what it did.'),
        h('li', 'R examples show output produced by real R when the content was built; there is no R engine in the browser.'),
        h('li', 'The RNA-seq and statistics labs use simplified statistics that are labelled as teaching simplifications.'))),
      h('div.section', h('h2', 'Accessibility'), h('p', 'Every control works with a keyboard, focus is always visible, interactive parts have labels, color is never the only signal, and the layout adapts to phones and tablets. Light and dark themes follow your device unless you choose one with the theme button. Motion is reduced when your device asks for it.')),
      h('div.section', h('h2', 'Credits'), h('p.small', 'Python in the browser: Pyodide (Mozilla Public License 2.0), with the CPython standard library (PSF license). BioBridge content and code: see the README in the project files.'), h('p.small.muted', 'Version ' + BB.config.version)));
  }

  BB.pages = { home, learn, courses, labs, labPage, missionPage, tracePage, glossaryPage, notebook, plan, about, LABS };
})();
