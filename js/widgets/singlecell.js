/* Single-cell widget: mode 'qc' (filter damaged cells) and mode 'clusters' (annotate clusters with marker genes). */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  BB.widgets = BB.widgets || {};
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, ...kids) { const el = document.createElementNS(SVGNS, tag); for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v); for (const c of kids.flat()) if (c != null) el.append(c instanceof Node ? c : document.createTextNode(String(c))); return el; }

  const TYPES = ['CD4 T cells', 'CD8 T cells', 'NK cells', 'B cells', 'CD14 monocytes', 'FCGR3A monocytes', 'Platelets'];
  const CLUSTER_OF = { 'B cells': 1, 'CD14 monocytes': 2, 'CD4 T cells': 3, 'NK cells': 4, 'Platelets': 5, 'CD8 T cells': 6, 'FCGR3A monocytes': 7 };
  const PALETTE = ['#2f7ed8', '#e07b39', '#2a9d8f', '#c0392b', '#8e6bbf', '#b8860b', '#6d7f8c'];

  function qc() {
    const S = BB.data.single;
    let minGenes = 200, maxMito = 100;
    const g1 = h('input', { type: 'range', min: '0', max: '800', step: '25', value: '200', 'aria-label': 'Minimum genes detected per cell' });
    const g2 = h('input', { type: 'range', min: '5', max: '60', step: '1', value: '60', 'aria-label': 'Maximum mitochondrial percent' });
    const l1 = h('strong'), l2 = h('strong');
    const plotEl = h('div'), out = h('div', { 'aria-live': 'polite' });
    function draw() {
      minGenes = +g1.value; maxMito = +g2.value; l1.textContent = minGenes; l2.textContent = maxMito + '%';
      const W = 540, H = 330, P = { l: 52, r: 12, t: 12, b: 40 };
      const xs = (v) => P.l + v / 1700 * (W - P.l - P.r), ys = (v) => H - P.b - v / 50 * (H - P.t - P.b);
      const s = svg('svg', { class: 'plot', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Scatter plot of genes detected versus mitochondrial percent for each cell' });
      s.append(svg('line', { class: 'axis', x1: P.l, x2: W - P.r, y1: H - P.b, y2: H - P.b }), svg('line', { class: 'axis', x1: P.l, x2: P.l, y1: H - P.b, y2: P.t }));
      [0, 400, 800, 1200, 1600].forEach((t) => s.append(svg('text', { x: xs(t), y: H - P.b + 15, 'text-anchor': 'middle' }, String(t))));
      [0, 10, 20, 30, 40, 50].forEach((t) => s.append(svg('text', { x: P.l - 6, y: ys(t) + 4, 'text-anchor': 'end' }, t + '%')));
      s.append(svg('text', { x: (P.l + W) / 2, y: H - 6, 'text-anchor': 'middle' }, 'genes detected in the cell'), svg('text', { x: 12, y: H / 2, transform: `rotate(-90 12 ${H / 2})`, 'text-anchor': 'middle' }, 'mitochondrial reads (%)'));
      s.append(svg('rect', { x: xs(0), y: ys(50), width: xs(minGenes) - xs(0), height: ys(0) - ys(50), fill: 'var(--red)', 'fill-opacity': 0.07 }), svg('rect', { x: xs(0), y: ys(50), width: xs(1700) - xs(0), height: Math.max(0, ys(maxMito) - ys(50)), fill: 'var(--red)', 'fill-opacity': 0.07 }));
      s.append(svg('line', { x1: xs(minGenes), x2: xs(minGenes), y1: P.t, y2: H - P.b, stroke: 'var(--red)', 'stroke-dasharray': '5 4' }), svg('line', { x1: P.l, x2: W - P.r, y1: ys(maxMito), y2: ys(maxMito), stroke: 'var(--red)', 'stroke-dasharray': '5 4' }));
      let keptGood = 0, keptBad = 0, removedGood = 0, removedBad = 0;
      S.cells.forEach((c) => {
        const keep = c.ng >= minGenes && c.mito <= maxMito, bad = c.t === 'Low-quality';
        if (keep) bad ? keptBad++ : keptGood++; else bad ? removedBad++ : removedGood++;
        s.append(svg('circle', { cx: xs(Math.min(c.ng, 1690)), cy: ys(Math.min(c.mito, 49.5)), r: 3.2, fill: keep ? 'var(--accent)' : 'var(--red)', 'fill-opacity': keep ? 0.55 : 0.9 }));
      });
      plotEl.innerHTML = ''; plotEl.append(s);
      const badTotal = keptBad + removedBad;
      out.innerHTML = '';
      out.append(h('div.stats', h('div.stat', h('strong', String(keptGood + keptBad)), h('span', 'cells kept')), h('div.stat', h('strong', String(removedGood + removedBad)), h('span', 'cells removed')),
        h('div.stat', h('strong', `${removedBad} / ${badTotal}`), h('span', 'damaged cells removed (known here because the data are simulated)')), h('div.stat', h('strong', String(removedGood)), h('span', 'healthy cells lost'))),
        h('p', { style: { marginTop: '10px' } }, removedBad === badTotal && removedGood === 0 ? 'These cutoffs separate the damaged cells cleanly. Real data are rarely this tidy, so thresholds are chosen by looking at plots like this one for each dataset.' : removedGood > 20 ? 'These cutoffs throw away many healthy cells. Over-filtering can remove real cell types (some cells naturally express fewer genes).' : keptBad > 0 ? 'Some damaged cells (top left: few genes, many mitochondrial reads) are still kept. They can form fake clusters later.' : 'Adjust the cutoffs and watch which cells are removed.'));
      if (removedBad === badTotal) BB.markLab('singlecell-qc');
    }
    g1.addEventListener('input', draw); g2.addEventListener('input', draw);
    draw();
    return h('div.widget', { 'data-widget': 'singlecell' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Quality control: find the damaged cells')), h('span.sim-label', 'Toy data')),
      h('p.small', { html: md('Each dot is one cell. Damaged cells usually show **few genes detected** and a **high fraction of mitochondrial reads**: when the cell membrane breaks, much of the RNA in the cytoplasm leaks out, while RNA inside the mitochondria is kept. Set two cutoffs.') }),
      h('div.grid-2', h('div.field', h('label', 'Keep cells with at least ', l1, ' genes'), g1), h('div.field', h('label', 'Keep cells with at most ', l2, ' mitochondrial reads'), g2)),
      h('div.split', { style: { marginTop: '10px' } }, plotEl, out),
      h('p.widget-note', 'Simulated values. Typical real cutoffs depend on the tissue and technology (for example a few hundred genes minimum and 5 to 20 percent mitochondrial reads); also check for doublets, droplets that captured two cells.'));
  }

  function clusters() {
    const S = BB.data.single;
    const cells = S.cells.filter((c) => c.t !== 'Low-quality');
    let colorBy = 'cluster';
    const guesses = {};
    const sel = h('select', { 'aria-label': 'Color cells by' }, h('option', { value: 'cluster' }, 'Cluster number'), S.genes.filter((g) => g !== 'MT-CO1').map((g) => h('option', { value: g }, 'Expression of ' + g)));
    const plotEl = h('div'), legend = h('div.legend'), tableEl = h('div'), fb = h('div', { 'aria-live': 'polite' });
    function draw() {
      const W = 520, H = 400, P = 24;
      const xs = (v) => P + (v + 8) / 16 * (W - 2 * P), ys = (v) => H - P - (v + 8) / 16 * (H - 2 * P);
      const s = svg('svg', { class: 'plot', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': colorBy === 'cluster' ? 'Cells colored by cluster' : `Cells colored by ${colorBy} expression` });
      s.append(svg('text', { x: W / 2, y: H - 6, 'text-anchor': 'middle' }, 'UMAP-like axis 1 (toy layout)'), svg('text', { x: 12, y: H / 2, transform: `rotate(-90 12 ${H / 2})`, 'text-anchor': 'middle' }, 'axis 2'));
      const gi = colorBy === 'cluster' ? -1 : S.genes.indexOf(colorBy);
      const maxE = gi >= 0 ? Math.max(1, ...cells.map((c) => c.e[gi])) : 1;
      const order = gi >= 0 ? cells.slice().sort((a, b) => a.e[gi] - b.e[gi]) : cells;
      order.forEach((c) => {
        const fill = gi < 0 ? PALETTE[CLUSTER_OF[c.t] - 1] : (c.e[gi] === 0 ? 'var(--surface-3)' : `color-mix(in srgb, var(--red) ${25 + 75 * c.e[gi] / maxE}%, var(--surface))`);
        s.append(svg('circle', { cx: xs(c.x), cy: ys(c.y), r: 3.6, fill, stroke: gi >= 0 && c.e[gi] > 0 ? 'none' : null }));
      });
      if (gi < 0) for (const t of TYPES) { const cs = cells.filter((c) => c.t === t); const mx = cs.reduce((a, c) => a + c.x, 0) / cs.length, my = cs.reduce((a, c) => a + c.y, 0) / cs.length; s.append(svg('text', { x: xs(mx), y: ys(my), 'text-anchor': 'middle', style: 'font-size:15px;font-weight:800;fill:var(--text);paint-order:stroke;stroke:var(--surface);stroke-width:4px' }, String(CLUSTER_OF[t]))); }
      plotEl.innerHTML = ''; plotEl.append(s);
      legend.innerHTML = '';
      if (gi < 0) Object.entries(CLUSTER_OF).sort((a, b) => a[1] - b[1]).forEach(([, n]) => legend.append(h('span', h('i', { style: { background: PALETTE[n - 1] } }), 'Cluster ' + n)));
      else legend.append(h('span', h('i', { style: { background: 'var(--surface-3)', border: '1px solid var(--border)' } }), '0 UMIs'), h('span', h('i', { style: { background: 'var(--red)' } }), `high ${colorBy}`), h('span', `${cells.filter((c) => c.e[gi] > 0).length} of ${cells.length} cells have at least one ${colorBy} UMI`));
    }
    function drawTable() {
      tableEl.innerHTML = '';
      const t = h('table.data', h('thead', h('tr', h('th', 'Cluster'), h('th.num', 'cells'), h('th', 'Your label'))));
      const tb = h('tbody');
      Object.entries(CLUSTER_OF).sort((a, b) => a[1] - b[1]).forEach(([type, n]) => {
        const cnt = cells.filter((c) => c.t === type).length;
        const s = h('select', { 'aria-label': `Cell type for cluster ${n}` }, h('option', { value: '' }, 'choose...'), TYPES.map((x) => h('option', { value: x, selected: guesses[n] === x }, x)));
        s.addEventListener('change', () => { guesses[n] = s.value; });
        tb.append(h('tr', h('td', h('span', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: PALETTE[n - 1], marginRight: '6px' } }), 'Cluster ' + n), h('td.num', String(cnt)), h('td', s)));
      });
      t.append(tb);
      tableEl.append(h('div.table-wrap', t), h('div.btn-row', { style: { marginTop: '10px' } }, h('button.btn.btn-primary.btn-sm', { type: 'button', onclick: check }, 'Check my labels')));
    }
    function check() {
      fb.innerHTML = '';
      let right = 0;
      const notes = [];
      Object.entries(CLUSTER_OF).forEach(([type, n]) => {
        const g = guesses[n];
        if (g === type) right++;
        else if (g) {
          const why = {
            'CD8 T cells|NK cells': 'Cluster 6 expresses NKG7 and GNLY a little, like NK cells, but it also expresses CD3E and CD8A, so it is a T-cell population with cytotoxic features.',
            'NK cells|CD8 T cells': 'Cluster 4 has very high NKG7 and GNLY but no CD3E. NK cells are not T cells, so they lack the T-cell receptor complex marker CD3E.',
            'FCGR3A monocytes|NK cells': 'FCGR3A is also expressed by NK cells, but cluster 7 has high LYZ (a monocyte marker) and no NKG7 or GNLY.',
            'NK cells|FCGR3A monocytes': 'Cluster 4 expresses some FCGR3A, but its strongest markers are NKG7 and GNLY, and it lacks LYZ.',
            'CD4 T cells|CD8 T cells': 'Cluster 3 expresses CD3E and IL7R but almost no CD8A.',
            'CD8 T cells|CD4 T cells': 'Cluster 6 expresses CD8A as well as CD3E.',
            'CD14 monocytes|FCGR3A monocytes': 'Cluster 2 has the highest LYZ and expresses CD14, not FCGR3A.',
            'FCGR3A monocytes|CD14 monocytes': 'Cluster 7 expresses FCGR3A and less LYZ; CD14 is low.'
          }[`${type}|${g}`];
          notes.push(`Cluster ${n} is not ${g}. ` + (why || `Color by its markers: ${S.markers[type].join(' and ')} point to ${type}.`));
        }
      });
      const total = Object.keys(CLUSTER_OF).length;
      fb.append(h('div.feedback.' + (right === total ? 'good' : 'bad'), h('strong.lead', `${right} of ${total} clusters labelled correctly.`), notes.length ? h('ul', notes.map((n) => h('li', n))) : null,
        right === total ? h('div', 'Every cluster matches the cell type that was simulated. In real data, annotation is a hypothesis: you check several markers, compare with reference datasets and stay open to unexpected cell states.') : h('div.small', 'Tip: switch "Color cells by" to each marker gene and see which cluster lights up.')));
      if (right === total) BB.markLab('singlecell-clusters');
    }
    sel.addEventListener('change', () => { colorBy = sel.value; draw(); });
    draw(); drawTable();
    return h('div.widget', { 'data-widget': 'singlecell' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Name the clusters with marker genes')), h('span.sim-label', 'Toy data')),
      h('p.small', { html: md('Each dot is one blood immune cell after quality control. Cells with similar expression sit close together. Color the cells by marker genes, then label each cluster. Markers: T cells `CD3E` (CD4 T `IL7R`, CD8 T `CD8A`), B cells `MS4A1` `CD79A`, NK cells `NKG7` `GNLY`, monocytes `LYZ` (`CD14` or `FCGR3A`), platelets `PPBP`.') }),
      h('div.field', h('label', 'Color cells by'), sel),
      h('div.split', { style: { marginTop: '10px' } }, h('div', plotEl, legend), h('div', tableEl, fb)),
      h('p.widget-note', 'The 2D positions are hand-placed to look like a UMAP plot; they are not computed from the counts. In real analyses distances between clusters on a UMAP are not reliable measures of similarity, and cluster boundaries depend on parameter choices. Cluster numbers are arbitrary labels, so they do not match the numbers in the lesson\'s example table.'));
  }

  BB.widgets.singlecell = (props = {}) => (props.mode === 'clusters' ? clusters() : qc());
})();
