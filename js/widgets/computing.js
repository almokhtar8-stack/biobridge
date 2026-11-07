/* Computing widgets: filetree (paths explorer), datatable (linked tables), scale (size of biological data), cron (schedule explainer). */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  BB.widgets = BB.widgets || {};
  const markLab = (id) => { const st = BB.store.state; if (!st.labs[id]) { st.labs[id] = { done: Date.now() }; BB.store.saveSoon(); BB.emit('progress'); } };

  function relPath(fromDir, to) {
    const a = fromDir.split('/').filter(Boolean), b = to.split('/').filter(Boolean);
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    const up = a.slice(i).map(() => '..'), down = b.slice(i);
    const r = up.concat(down).join('/');
    return r || '.';
  }
  BB.relPath = relPath;

  BB.widgets.filetree = function () {
    const home = BB.vfs.home;
    const paths = Object.keys(BB.vfs.files).filter((p) => p.startsWith(home)).concat(BB.vfs.dirs.filter((d) => d.startsWith(home)));
    const tree = {};
    for (const p of paths) {
      const parts = p.slice(home.length).split('/').filter(Boolean);
      let node = tree;
      parts.forEach((part, i) => { node[part] = node[part] || { __dir: !(BB.vfs.files[p] && i === parts.length - 1), __children: {} }; if (BB.vfs.dirs.includes(home + '/' + parts.slice(0, i + 1).join('/'))) node[part].__dir = true; node = node[part].__children; });
    }
    let cwd = home + '/project/data', sel = home + '/project/scripts/count_seqs.sh', mode = 'explore', task = 0, score = 0;
    const TASKS = [
      { from: home + '/project/data', target: home + '/project/scripts/count_seqs.sh' },
      { from: home + '/project', target: home + '/project/data/samples.tsv' },
      { from: home + '/project/results', target: home + '/notes.txt' },
      { from: home, target: home + '/project/data/reads.fastq' },
      { from: home + '/project/scripts', target: home + '/project/results' }
    ];
    const treeEl = h('div.tree', { role: 'tree', 'aria-label': 'Folder tree' });
    const infoEl = h('div', { 'aria-live': 'polite' });
    function nodeBtn(path, name, isDir, depth) {
      const isSel = path === sel, isCwd = path === cwd;
      return h('div', { role: 'treeitem', 'aria-selected': String(isSel), style: { paddingLeft: depth * 18 + 'px' } },
        h('button' + (isSel ? '.sel' : '') + (isDir ? '.dir' : ''), { type: 'button', onclick: () => pick(path) }, (isDir ? '\u{1F4C1} ' : '\u{1F4C4} ') + name + (isDir ? '/' : '')),
        isCwd ? h('span.chip.accent', { style: { marginLeft: '6px' } }, 'you are here') : null);
    }
    function drawTree() {
      treeEl.innerHTML = '';
      treeEl.append(nodeBtn(home, home, true, 0));
      const walk = (node, base, depth) => {
        for (const name of Object.keys(node).sort()) {
          const p = base + '/' + name;
          treeEl.append(nodeBtn(p, name, node[name].__dir, depth));
          if (node[name].__dir) walk(node[name].__children, p, depth + 1);
        }
      };
      walk(tree, home, 1);
    }
    function pick(path) {
      sel = path;
      if (mode === 'challenge') {
        const t = TASKS[task];
        const ok = path === t.target;
        if (ok) score++;
        infoEl.innerHTML = '';
        infoEl.append(h('div.feedback.' + (ok ? 'good' : 'bad'), ok ? h('strong.lead', 'Correct.') : h('strong.lead', 'Not that one.'),
          h('span', ok ? `From ${t.from}, the relative path ${relPath(t.from, t.target)} leads here: each .. climbs one folder up, then the names walk down.` : `You picked ${path}. Start at ${t.from}: ${explainSteps(t.from, t.target)}`),
          h('div.btn-row', { style: { marginTop: '8px' } }, ok ? h('button.btn.btn-sm.btn-primary', { type: 'button', onclick: () => { task++; if (task >= TASKS.length) { markLab('filetree'); mode = 'done'; } drawAll(); } }, task + 1 < TASKS.length ? 'Next challenge' : 'Finish') : null)));
        drawTree();
        return;
      }
      drawAll();
    }
    function explainSteps(from, to) {
      const r = relPath(from, to).split('/');
      let cur = from;
      const steps = r.map((part) => { if (part === '..') { cur = cur.slice(0, cur.lastIndexOf('/')) || '/'; return `.. takes you up to ${cur}`; } cur += '/' + part; return `${part} takes you into ${cur}`; });
      return steps.join('; ') + '.';
    }
    function drawAll() {
      drawTree();
      infoEl.innerHTML = '';
      if (mode === 'explore') {
        const isDir = !BB.vfs.files[sel];
        infoEl.append(
          h('div.stack',
            h('div', h('div.eyebrow', 'Absolute path (from the root /)'), h('div.path-box', sel)),
            h('div', h('div.eyebrow', `Relative path from where you are (${cwd.replace(home, '~')})`), h('div.path-box', relPath(cwd, sel))),
            h('div', h('div.eyebrow', 'With the ~ shortcut for your home folder'), h('div.path-box', sel.replace(home, '~'))),
            h('div.btn-row', isDir ? h('button.btn.btn-sm', { type: 'button', onclick: () => { cwd = sel; drawAll(); } }, 'Make this my current folder (cd)') : null,
              h('button.btn.btn-sm.btn-ghost', { type: 'button', onclick: () => { mode = 'challenge'; task = 0; score = 0; drawAll(); } }, 'Try 5 path challenges'))));
      } else if (mode === 'challenge') {
        const t = TASKS[task];
        cwd = t.from;
        drawTree();
        infoEl.append(h('div.callout.accent', h('strong', `Challenge ${task + 1} of ${TASKS.length}`), h('span', 'You are in '), h('code.inline', t.from.replace(home, '~')), h('span', '. Tap the item that this relative path points to: '), h('code.inline', relPath(t.from, t.target))));
      } else {
        infoEl.append(h('div.callout.good', h('strong', 'All five challenges done'), h('span', `You found ${score} on the first try. Relative paths depend on where you are; absolute paths always start at /.`), h('div.btn-row', { style: { marginTop: '8px' } }, h('button.btn.btn-sm', { type: 'button', onclick: () => { mode = 'explore'; drawAll(); } }, 'Back to exploring'))));
      }
    }
    drawAll();
    return h('div.widget', { 'data-widget': 'filetree' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Folders, files and paths'))),
      h('p.small', 'Tap any file or folder to see its absolute and relative paths. Then make a folder your current location and watch the relative path change.'),
      h('div.split', h('div.card.soft', treeEl), infoEl));
  };

  /* Linked tables: counts.tsv + samples.tsv + annotation.tsv */
  BB.widgets.datatable = function () {
    const D = BB.data.bulk;
    const named = D.named;
    const counts = Object.fromEntries(D.genes.filter((g) => named.includes(g.g)).map((g) => [g.g, g.c]));
    let selSample = null, selGene = null;
    const left = h('div.table-wrap'), right = h('div.table-wrap'), info = h('div', { 'aria-live': 'polite', style: { marginTop: '10px' } });
    function draw() {
      left.innerHTML = ''; right.innerHTML = '';
      const t = h('table.data', h('thead', h('tr', h('th', 'gene'), D.samples.map((s) => h('th.num', h('button.btn-quiet', { type: 'button', style: { border: 0, background: 'none', font: 'inherit', color: selSample === s ? 'var(--accent)' : 'inherit', cursor: 'pointer', textDecoration: 'underline dotted' }, onclick: () => { selSample = s; draw(); } }, s))))));
      const tb = h('tbody');
      named.forEach((g) => tb.append(h('tr' + (selGene === g ? '.hl' : ''), h('td', h('button', { type: 'button', style: { border: 0, background: 'none', font: 'inherit', fontWeight: 700, color: 'inherit', cursor: 'pointer', textDecoration: 'underline dotted', padding: 0 }, onclick: () => { selGene = g; draw(); } }, g)), counts[g].map((v, i) => h('td.num', { style: selSample === D.samples[i] ? { background: 'var(--accent-soft)' } : null }, BB.fmt(v))))));
      t.append(tb);
      left.append(t);
      const meta = h('table.data', h('thead', h('tr', ['sample', 'condition', 'replicate', 'temperature_C'].map((x) => h('th', x)))),
        h('tbody', D.samples.map((s, i) => h('tr' + (selSample === s ? '.hl' : ''), h('td', s), h('td', D.condition[i]), h('td', String((i % 3) + 1)), h('td', D.condition[i] === 'control' ? '37' : '42')))));
      right.append(meta);
      info.innerHTML = '';
      if (selSample) { const i = D.samples.indexOf(selSample); info.append(h('div.callout.accent', h('strong', selSample), h('span', `${D.condition[i] === 'control' ? 'A control culture kept at 37 C' : 'A culture heated to 42 C for one hour'}, replicate ${(i % 3) + 1}. The count table alone could not tell you this; the metadata table can, because both use the same sample name.`))); }
      if (selGene) { const a = D.annotation[selGene]; info.append(h('div.callout', { style: { marginTop: '8px' } }, h('strong', `${selGene} (annotation.tsv)`), h('span', `${a[2]}. Chromosome ${a[0]}, category ${a[1]}. Annotation is another table linked by the gene name.`))); }
    }
    const answer = h('input', { type: 'number', inputmode: 'numeric', 'aria-label': 'Your answer', style: { maxWidth: '160px' } });
    const fb = h('div', { 'aria-live': 'polite' });
    draw();
    return h('div.widget', { 'data-widget': 'datatable' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Read a real-shaped dataset')), h('span.sim-label', 'Toy data')),
      h('p.small', 'Left: counts.tsv (reads per gene per sample). Right: samples.tsv (metadata). Tap a sample name or a gene name.'),
      h('div.split', left, right), info,
      h('div.card.soft', { style: { marginTop: '12px' } }, h('strong', 'Quick task: '), h('span', 'How many reads were assigned to HSPA6 in sample heat_2?'),
        h('div.btn-row', { style: { marginTop: '8px' } }, answer, h('button.btn.btn-sm.btn-primary', { type: 'button', onclick: () => {
          const v = Number(answer.value); const right2 = counts.HSPA6[4];
          fb.innerHTML = '';
          fb.append(h('div.feedback.' + (v === right2 ? 'good' : 'bad'), v === right2 ? `Correct: ${right2}. Row HSPA6, column heat_2. Notice HSPA6 is almost zero in every control: the gene is essentially off until cells are stressed.` : (v === counts.HSPA6[1] ? 'That is ctrl_2. Check the column header: heat_2 is the fifth sample column.' : 'Find the HSPA6 row, then move across to the heat_2 column (the fifth sample).')));
          if (v === right2) markLab('datatable');
        } }, 'Check')), fb));
  };

  /* How big is biological data? */
  BB.widgets.scale = function () {
    const samples = h('input', { type: 'range', min: '1', max: '200', value: '6', 'aria-label': 'Number of samples' });
    const reads = h('input', { type: 'range', min: '1', max: '100', value: '20', 'aria-label': 'Millions of reads per sample' });
    const out = h('div', { 'aria-live': 'polite' });
    const sv = h('strong'), rv = h('strong');
    const years = (sec) => sec / (3600 * 24 * 365);
    function human(sec) {
      if (sec < 60) return `${Math.max(1, Math.round(sec))} seconds`;
      if (sec < 3600) return `${Math.round(sec / 60)} minutes`;
      if (sec < 86400 * 2) return `${(sec / 3600).toFixed(1)} hours`;
      if (sec < 86400 * 365) return `${Math.round(sec / 86400)} days`;
      return `${BB.fmt(years(sec), years(sec) < 10 ? 1 : 0)} years`;
    }
    function draw() {
      const n = +samples.value, m = +reads.value;
      sv.textContent = n; rv.textContent = m + ' million';
      const total = n * m * 1e6;
      const lines = total * 4;
      const gb = total * 250 / 1e9;
      out.innerHTML = '';
      out.append(h('div.stats', { style: { marginTop: '12px' } },
        h('div.stat', h('strong', BB.fmt(total)), h('span', 'reads in total')),
        h('div.stat', h('strong', BB.fmt(lines)), h('span', 'lines of FASTQ text (4 lines per read)')),
        h('div.stat', h('strong', gb < 1 ? (gb * 1000).toFixed(0) + ' MB' : gb.toFixed(1) + ' GB'), h('span', 'of uncompressed text (about 250 bytes per read)')),
        h('div.stat', h('strong', human(total)), h('span', 'to look at every read by hand, one per second, without sleeping'))),
        h('p.small', { style: { marginTop: '10px' } }, `A command such as grep can scan roughly tens of millions of short lines per second on a typical server, so a first pass over these files takes on the order of ${human(lines / 3e7)} rather than ${human(total)}.`));
    }
    samples.addEventListener('input', draw); reads.addEventListener('input', draw);
    draw();
    return h('div.widget', { 'data-widget': 'scale' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'How big is a sequencing experiment?'))),
      h('div.grid-2', h('div.field', h('label', 'Samples: ', sv), samples), h('div.field', h('label', 'Reads per sample: ', rv), reads)),
      out,
      h('p.widget-note', 'Rough, rounded assumptions for intuition only: about 250 bytes per FASTQ record (100-letter reads), and a scanning speed that varies a lot between computers. The human genome alone has about 3.1 billion letters: reading one letter per second would take about 98 years.'));
  };

  /* Cron explainer */
  const FIELD = [
    { name: 'minute', min: 0, max: 59 }, { name: 'hour', min: 0, max: 23 }, { name: 'day of month', min: 1, max: 31 },
    { name: 'month', min: 1, max: 12 }, { name: 'day of week', min: 0, max: 7 }
  ];
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MON = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function parseField(s, f) {
    const set = new Set();
    for (const part of s.split(',')) {
      const m = /^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/.exec(part.trim());
      if (!m) throw new Error(`"${part}" is not valid in the ${f.name} field`);
      let lo = f.min, hi = f.max;
      if (m[1] !== '*') { const [a, b] = m[1].split('-').map(Number); lo = a; hi = b == null ? (m[2] ? f.max : a) : b; }
      const step = m[2] ? +m[2] : 1;
      if (lo < f.min || hi > f.max || lo > hi || step < 1) throw new Error(`${part} is out of range for the ${f.name} field (${f.min} to ${f.max})`);
      for (let v = lo; v <= hi; v += step) set.add(f.name === 'day of week' && v === 7 ? 0 : v);
    }
    return set;
  }
  function describeField(s, f, fmt) {
    if (s === '*') return null;
    const m = /^\*\/(\d+)$/.exec(s);
    if (m) return `every ${m[1]} ${f.name === 'minute' ? 'minutes' : f.name === 'hour' ? 'hours' : f.name + 's'}`;
    return s.split(',').map((p) => p.includes('-') ? p.split('-').map(fmt).join(' through ') : fmt(p)).join(', ');
  }
  function describe(fields) {
    const [mi, ho, dom, mo, dow] = fields;
    let time;
    if (/^\d+$/.test(mi) && /^\d+$/.test(ho)) time = `At ${String(ho).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
    else {
      const a = describeField(mi, FIELD[0], (x) => `minute ${x}`), b = describeField(ho, FIELD[1], (x) => `hour ${x}`);
      time = a ? (a.startsWith('every') ? a[0].toUpperCase() + a.slice(1) : 'At ' + a) : 'Every minute';
      if (b) time += b.startsWith('every') ? `, ${b}` : ` past ${b}`;
    }
    const parts = [time];
    const d1 = describeField(dom, FIELD[2], (x) => `day ${x} of the month`);
    const d2 = describeField(dow, FIELD[4], (x) => DOW[+x]);
    const mm = describeField(mo, FIELD[3], (x) => MON[+x]);
    if (d1 && d2) parts.push(`on ${d1} and also on every ${d2} (cron runs if either day field matches)`);
    else if (d1) parts.push(`on ${d1}`);
    else if (d2) parts.push(`on ${d2.startsWith('every') ? d2 : d2.replace(/^/, '')}`);
    else parts.push('every day');
    if (mm) parts.push(`in ${mm}`);
    return parts.join(' ') + '.';
  }
  function nextRuns(fields, n) {
    const sets = fields.map((s, i) => parseField(s, FIELD[i]));
    const domStar = fields[2] === '*', dowStar = fields[4] === '*';
    const out = [];
    const d = new Date(); d.setSeconds(0, 0); d.setMinutes(d.getMinutes() + 1);
    for (let k = 0; k < 600000 && out.length < n; k++) {
      const dayOk = domStar && dowStar ? true : domStar ? sets[4].has(d.getDay()) : dowStar ? sets[2].has(d.getDate()) : sets[2].has(d.getDate()) || sets[4].has(d.getDay());
      if (sets[0].has(d.getMinutes()) && sets[1].has(d.getHours()) && sets[3].has(d.getMonth() + 1) && dayOk) out.push(new Date(d));
      d.setMinutes(d.getMinutes() + 1);
    }
    return out;
  }
  BB.cron = { describe, nextRuns, parseField };
  BB.widgets.cron = function () {
    const inputs = FIELD.map((f, i) => h('input', { type: 'text', value: ['30', '2', '*', '*', '*'][i], 'aria-label': f.name, autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', spellcheck: 'false', inputmode: 'text' }));
    const cmd = h('input', { type: 'text', value: '/home/student/project/scripts/backup.sh', 'aria-label': 'Command to run', autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', spellcheck: 'false', style: { fontFamily: 'var(--mono)' } });
    const out = h('div', { 'aria-live': 'polite' });
    const presets = [['Every day at 02:30', '30 2 * * *'], ['Every 15 minutes', '*/15 * * * *'], ['Weekdays at 08:00', '0 8 * * 1-5'], ['Sundays at midnight', '0 0 * * 0'], ['1st of every month, 06:00', '0 6 1 * *']];
    function draw() {
      const f = inputs.map((x) => x.value.trim() || '*');
      out.innerHTML = '';
      try {
        const runs = nextRuns(f, 5);
        out.append(h('div.callout.accent', h('strong', 'In plain English'), h('span', describe(f))),
          h('div.code-block', { style: { marginTop: '10px' } }, h('div.code-label', h('span', 'crontab line')), h('pre', h('code', f.join(' ') + ' ' + cmd.value))),
          h('p.small', { style: { marginTop: '10px' } }, h('strong', 'Next runs (your device clock): '), runs.length ? runs.map((d) => d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })).join('  |  ') : 'none in the next year'));
        markLab('cron');
      } catch (e) { out.append(h('div.feedback.bad', e.message + '. Allowed: numbers, *, ranges like 1-5, lists like 1,15 and steps like */10.')); }
    }
    inputs.forEach((x) => x.addEventListener('input', draw)); cmd.addEventListener('input', draw);
    draw();
    return h('div.widget', { 'data-widget': 'cron' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Read and build a cron schedule'))),
      h('div.cron-fields', inputs.map((x, i) => h('div.field', x, h('label', FIELD[i].name)))),
      h('div.field', { style: { marginTop: '10px' } }, h('label', 'Command'), cmd),
      h('div.btn-row', { style: { margin: '10px 0' } }, presets.map(([l, v]) => h('button.btn.btn-sm', { type: 'button', onclick: () => { v.split(' ').forEach((p, i) => (inputs[i].value = p)); draw(); } }, l))),
      out,
      h('p.widget-note', 'Fields: minute (0 to 59), hour (0 to 23), day of month (1 to 31), month (1 to 12), day of week (0 to 7, where 0 and 7 are Sunday). Cron uses the server clock, and scripts run by cron should use full paths because cron starts with a minimal environment.'));
  };
})();
