/* Data widgets: fastq (FASTQ and Phred decoder), countmatrix (count-matrix explorer), normalization (library size and composition). */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  BB.widgets = BB.widgets || {};
  const markLab = (id) => { const st = BB.store.state; if (!st.labs[id]) { st.labs[id] = { done: Date.now() }; BB.store.saveSoon(); BB.emit('progress'); } };
  BB.markLab = markLab;

  BB.widgets.fastq = function () {
    const reads = BB.data.examples.fastq;
    let r = 0, sel = null, threshold = 20;
    const recEl = h('div'), tableEl = h('div'), trimEl = h('div', { 'aria-live': 'polite' }), detail = h('div', { 'aria-live': 'polite' });
    const select = h('select', { 'aria-label': 'Choose a read' }, reads.map((x, i) => h('option', { value: String(i) }, x.id)));
    select.addEventListener('change', () => { r = +select.value; sel = null; draw(); });
    const slider = h('input', { type: 'range', min: '2', max: '40', value: '20', 'aria-label': 'Quality threshold for trimming' });
    const thrLabel = h('strong', '20');
    slider.addEventListener('input', () => { threshold = +slider.value; thrLabel.textContent = threshold; drawTrim(); });
    const Q = (ch) => ch.charCodeAt(0) - 33;
    const perr = (q) => Math.pow(10, -q / 10);
    function draw() {
      const rd = reads[r];
      recEl.innerHTML = '';
      const lines = [[rd.id, '1. Header: starts with @, then the read name'], [rd.seq, '2. Sequence: the bases the machine called'], ['+', '3. Separator: a + (sometimes repeated name)'], [rd.qual, '4. Quality: one character per base']];
      recEl.append(h('div.code-block', h('div.code-label', h('span', 'One FASTQ record = 4 lines')), h('pre', lines.map(([t]) => t).join('\n'))),
        h('ol.notes-list', { style: { listStyle: 'none' } }, lines.map(([, n]) => h('li', n))));
      tableEl.innerHTML = '';
      const strip = h('div.strand', { style: { gap: '2px' }, role: 'group', 'aria-label': 'Bases with quality. Select one for details.' });
      [...rd.seq].forEach((b, i) => {
        const q = Q(rd.qual[i]);
        strip.append(h('button', { type: 'button', 'aria-label': `Base ${i + 1}: ${b}, quality character ${rd.qual[i]}, Phred ${q}`, onclick: () => { sel = i; drawDetail(); }, style: { border: sel === i ? '2px solid var(--text)' : '1px solid var(--border)', borderRadius: '6px', padding: '2px', background: 'var(--surface)', display: 'grid', gap: '2px', justifyItems: 'center', minWidth: '28px' } },
          h('span.nt.nt-' + b, { style: { width: '22px', height: '24px', fontSize: '.8rem' } }, b),
          h('span', { style: { width: '22px', height: Math.max(3, q * 1.2) + 'px', background: q >= 30 ? 'var(--green)' : q >= 20 ? 'var(--orange)' : 'var(--red)', borderRadius: '3px', alignSelf: 'end' } }),
          h('span', { style: { fontFamily: 'var(--mono)', fontSize: '.7rem' } }, rd.qual[i])));
      });
      const qs = [...rd.qual].map(Q);
      const mean = qs.reduce((a, b) => a + b, 0) / qs.length;
      tableEl.append(h('div.eyebrow', 'Each base with its quality (bar height = Phred score)'), strip,
        h('p.small', { style: { marginTop: '8px' } }, `Mean quality ${mean.toFixed(1)}. Bases below Q20: ${qs.filter((q) => q < 20).length} of ${qs.length}. Green Q30 or more, orange Q20 to 29, red below 20.`));
      drawDetail(); drawTrim();
    }
    function drawDetail() {
      detail.innerHTML = '';
      if (sel == null) { detail.append(h('p.small.muted', 'Select any base above to decode its quality character.')); return; }
      const rd = reads[r], ch = rd.qual[sel], q = Q(ch), p = perr(q);
      detail.append(h('div.callout.accent', h('strong', `Base ${sel + 1}: ${rd.seq[sel]} with quality character ${ch}`),
        h('div', { html: md(`Character code of \`${ch}\` is ${ch.charCodeAt(0)}. Phred+33 encoding: ${ch.charCodeAt(0)} minus 33 = **Q${q}**.`) }),
        h('div', { html: md(`Error probability = 10^(-Q/10) = 10^(-${q}/10) = **${p < 0.001 ? p.toExponential(1) : p.toFixed(q >= 10 ? 4 : 2)}**, about 1 wrong call in ${BB.fmt(Math.round(1 / p))}.`) }),
        rd.seq[sel] === 'N' ? h('div', 'N means the instrument could not decide which base was there.') : null));
      markLab('fastq');
    }
    function drawTrim() {
      const rd = reads[r];
      let end = rd.seq.length;
      while (end > 0 && Q(rd.qual[end - 1]) < threshold) end--;
      trimEl.innerHTML = '';
      trimEl.append(h('div.code-block', h('div.code-label', h('span', `After trimming the 3' end below Q${threshold}`)), h('pre', h('code', (rd.seq.slice(0, end) || '(nothing left)') + '\n' + rd.qual.slice(0, end)))),
        h('p.small', `Kept ${end} of ${rd.seq.length} bases. Real trimming tools (for example fastp or Trimmomatic) use smarter rules such as sliding windows, and also remove adapter sequences.`));
    }
    draw();
    return h('div.widget', { 'data-widget': 'fastq' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Decode a FASTQ read')), h('div.field', select)),
      h('div.split', recEl, h('div', detail)), h('div', { style: { marginTop: '12px' } }, tableEl),
      h('div.card.soft', { style: { marginTop: '12px' } }, h('div.field', h('label', 'Trim low-quality bases from the end. Threshold: ', thrLabel), slider), trimEl),
      h('p.widget-note', 'Toy reads of 36 bases. Real Illumina reads are often 100 to 150 bases, and quality usually drops toward the end of a read, as it does here.'));
  };

  BB.widgets.countmatrix = function (props = {}) {
    const D = BB.data.bulk;
    const named = D.named;
    const rows = D.genes.filter((g) => named.includes(g.g));
    let mode = 'raw', sortKey = null, selGene = 'HSPA1A';
    const tableWrap = h('div.table-wrap'), chart = h('div', { 'aria-live': 'polite' });
    const val = (g, j) => { const c = g.c[j]; if (mode === 'raw') return c; const cpm = c / D.libsize[j] * 1e6; return mode === 'cpm' ? cpm : Math.log2(cpm + 1); };
    const fmtv = (v) => (mode === 'raw' ? BB.fmt(v) : mode === 'cpm' ? BB.fmt(v, v < 10 ? 2 : 1) : v.toFixed(2));
    const tabs = h('div.tabs', { role: 'tablist', 'aria-label': 'Value shown' }, [['raw', 'Raw counts'], ['cpm', 'Counts per million (CPM)'], ['log', 'log2(CPM + 1)']].map(([k, l]) => h('button.tab', { type: 'button', role: 'tab', 'aria-selected': String(k === mode), 'data-k': k, onclick: () => { mode = k; tabs.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.k === mode))); draw(); if (mode !== 'raw') markLab('countmatrix'); } }, l)));
    function draw() {
      let list = rows.slice();
      if (sortKey != null) list.sort((a, b) => val(b, sortKey) - val(a, sortKey));
      tableWrap.innerHTML = '';
      const head = h('tr', h('th', 'gene'), D.samples.map((s, j) => h('th.num', h('button', { type: 'button', style: { border: 0, background: 'none', font: 'inherit', color: sortKey === j ? 'var(--accent)' : 'inherit', cursor: 'pointer', textTransform: 'inherit', letterSpacing: 'inherit' }, 'aria-label': `Sort by ${s}`, onclick: () => { sortKey = sortKey === j ? null : j; draw(); } }, s, sortKey === j ? ' ↓' : ''))));
      const body = h('tbody', list.map((g) => h('tr' + (g.g === selGene ? '.hl' : ''), { tabindex: '0', style: { cursor: 'pointer' }, onclick: () => { selGene = g.g; draw(); }, onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selGene = g.g; draw(); } } }, h('td', h('strong', g.g)), D.samples.map((s, j) => h('td.num', fmtv(val(g, j)))))));
      const foot = h('tr', h('td', h('em', 'library size')), D.libsize.map((l) => h('td.num', h('em', (l / 1e6).toFixed(1) + 'M'))));
      tableWrap.append(h('table.data', h('thead', head), body, h('tfoot', foot)));
      const g = rows.find((x) => x.g === selGene);
      const vals = D.samples.map((s, j) => val(g, j));
      const max = Math.max(...vals, 1e-9);
      const mc = (vals[0] + vals[1] + vals[2]) / 3, mh = (vals[3] + vals[4] + vals[5]) / 3;
      chart.innerHTML = '';
      chart.append(h('h4', `${g.g} across the six samples`),
        h('div.bar-chart', { style: { marginTop: '8px' } }, D.samples.map((s, j) => h('div.bar-line', h('span', s), h('div.bar-track', h('div.bar-fill' + (j >= 3 ? '.b2' : ''), { style: { width: Math.max(1, vals[j] / max * 100) + '%' } })), h('span.v', fmtv(vals[j]))))),
        h('p.small', { style: { marginTop: '8px' } }, `Average: control ${fmtv(mc)}, heat ${fmtv(mh)}.` + (mode === 'raw' ? ' Raw counts also depend on how deeply each sample was sequenced (library size row), so compare CPM before drawing conclusions.' : mode === 'cpm' ? ` Ratio heat/control: ${(mh / Math.max(mc, 1e-9)).toFixed(2)}.` : ' On the log2 scale, a difference of 1 means a two-fold change (for genes well above 1 CPM; the +1 shrinks differences for very low counts).')),
        h('div.legend', h('span', h('i', { style: { background: 'var(--accent)' } }), 'control (37 C)'), h('span', h('i', { style: { background: 'var(--violet)' } }), 'heat shock (42 C)')));
    }
    draw();
    return h('div.widget', { 'data-widget': 'countmatrix' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Explore the count matrix')), h('span.sim-label', 'Toy data')),
      h('p.small', 'Rows are genes, columns are samples, each number is reads assigned to that gene in that sample. Select a gene; tap a sample name to sort.'),
      tabs, h('div', { style: { marginTop: '10px' } }, tableWrap), h('div.card.soft', { style: { marginTop: '12px' } }, chart),
      h('p.widget-note', 'Library size = total reads assigned to all genes in that sample (about 20 million), not just the 12 genes shown. CPM = count / library size x 1,000,000.'));
  };

  /* Normalization: preserves BioBridge 1.0's RNA lab idea (20/100 vs 40/200), extended with library size and composition. */
  BB.widgets.normalization = function () {
    const base = { X: 0.2, Y: 0.3, Z: 0.5 };
    let libB = 200, view = 'raw', boost = false;
    const slider = h('input', { type: 'range', min: '50', max: '400', step: '10', value: '200', 'aria-label': 'Total reads in sample B' });
    const libLabel = h('strong', '200');
    const chartEl = h('div'), tableEl = h('div.table-wrap'), insight = h('div', { 'aria-live': 'polite' });
    const viewTabs = h('div.tabs', { role: 'tablist' }, [['raw', 'Raw counts'], ['norm', 'Scaled per 100 reads']].map(([k, l]) => h('button.tab', { type: 'button', role: 'tab', 'aria-selected': String(k === view), 'data-k': k, onclick: () => { view = k; viewTabs.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.k === view))); draw(); } }, l)));
    const boostBtn = h('button.btn.btn-sm', { type: 'button', 'aria-pressed': 'false', onclick: () => { boost = !boost; boostBtn.setAttribute('aria-pressed', String(boost)); boostBtn.textContent = boost ? 'Gene Z surge in B: ON' : 'Gene Z surge in B: OFF'; draw(); } }, 'Gene Z surge in B: OFF');
    function samples() {
      const A = { X: 20, Y: 30, Z: 50 };
      let w = Object.assign({}, base);
      if (boost) w = { X: 0.2, Y: 0.3, Z: 0.5 * 5 };
      const sum = w.X + w.Y + w.Z;
      const Bc = Object.fromEntries(Object.entries(w).map(([k, v]) => [k, Math.round(v / sum * libB)]));
      return { A, B: Bc, totA: 100, totB: Object.values(Bc).reduce((a, b) => a + b, 0) };
    }
    function draw() {
      libLabel.textContent = libB;
      const s = samples();
      const value = (smp, g) => (view === 'raw' ? s[smp][g] : s[smp][g] / (smp === 'A' ? s.totA : s.totB) * 100);
      const all = ['X', 'Y', 'Z'].flatMap((g) => [value('A', g), value('B', g)]);
      const max = Math.max(...all);
      chartEl.innerHTML = '';
      ['X', 'Y', 'Z'].forEach((g) => chartEl.append(h('div', { style: { marginBottom: '10px' } }, h('strong.small', 'Gene ' + g),
        h('div.bar-chart', { style: { marginTop: '4px' } }, ['A', 'B'].map((smp) => h('div.bar-line', h('span', 'Sample ' + smp), h('div.bar-track', h('div.bar-fill' + (smp === 'B' ? '.b2' : ''), { style: { width: Math.max(1, value(smp, g) / max * 100) + '%' } })), h('span.v', view === 'raw' ? String(value(smp, g)) : value(smp, g).toFixed(1) + '%')))))));
      tableEl.innerHTML = '';
      tableEl.append(h('table.data', h('thead', h('tr', h('th', ''), h('th.num', 'Sample A'), h('th.num', 'Sample B'))), h('tbody',
        h('tr', h('td', 'Total reads'), h('td.num', String(s.totA)), h('td.num', String(s.totB))),
        ['X', 'Y', 'Z'].map((g) => h('tr', h('td', `Gene ${g} share`), h('td.num', (s.A[g] / s.totA * 100).toFixed(1) + '%'), h('td.num', (s.B[g] / s.totB * 100).toFixed(1) + '%'))))));
      insight.innerHTML = '';
      const xa = s.A.X / s.totA * 100, xb = s.B.X / s.totB * 100;
      if (!boost) insight.append(h('div.callout.accent', h('strong', 'What the numbers mean'), h('span', `Gene X is ${s.A.X} of ${s.totA} reads in A and ${s.B.X} of ${s.totB} in B. Raw counts differ ${(s.B.X / s.A.X).toFixed(1)}-fold only because B was sequenced ${(s.totB / s.totA).toFixed(1)} times as deeply; the share is ${xa.toFixed(1)}% vs ${xb.toFixed(1)}%. Same biology, different sequencing depth.`)));
      else insight.append(h('div.callout.pitfall', h('strong', 'Composition bias'), h('span', `Now gene Z truly rises five-fold in B, and X and Y do not change at all. But Z takes a bigger share of B's reads, so X's share drops from ${xa.toFixed(1)}% to ${xb.toFixed(1)}%. Simple per-total scaling (like CPM) would wrongly suggest X and Y went down. Tools such as DESeq2 (median of ratios) and edgeR (TMM) estimate scaling factors that are not dragged around by a few huge changes.`)));
      markLab('normalization');
    }
    slider.addEventListener('input', () => { libB = +slider.value; draw(); });
    const q = BB.ui.mcq({ q: 'Sample B has exactly twice the total reads of sample A, and gene X also doubles from 20 to 40 reads. Is that evidence that gene X is more active in B?', options: [
      { t: 'Yes, its count doubled', why: 'Its count doubled, but so did every count in B, because B was sequenced twice as deeply. Compare shares (20/100 and 40/200 are both 20 percent), not raw numbers.' },
      { t: 'No, not from raw counts alone: its share of the reads is the same', why: 'Right. 20 of 100 and 40 of 200 are both 20 percent, so the relative abundance is unchanged in this example.' },
      { t: 'No, because gene X has the lowest count', why: 'The size of a count does not decide whether a gene changed. The comparison has to account for how many reads each sample has in total.' }], answer: 1 }, { retry: true });
    draw();
    return h('div.widget', { 'data-widget': 'normalization' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Is gene X really higher?')), h('span.sim-label', 'Teaching simulation')),
      h('div.field', h('label', 'Total reads in sample B: ', libLabel, ' (sample A has 100)'), slider),
      h('div.btn-row', { style: { margin: '10px 0' } }, viewTabs, boostBtn),
      h('div.split', h('div', chartEl), h('div.stack', tableEl, insight)),
      h('div', { style: { marginTop: '14px' } }, h('div.eyebrow', 'Check your intuition'), q),
      h('p.widget-note', 'Important limitation: this uses simple proportions to teach sequencing depth and composition. It is not a full normalization or differential-expression method; real analyses also model variability between replicates and test thousands of genes.'));
  };
})();
