/* Statistics widgets: log2, variability, correlation, pvalues (multiple testing), rnaseq (guided differential-expression experiment). */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  BB.widgets = BB.widgets || {};
  const markLab = (id) => BB.markLab && BB.markLab(id);
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, ...kids) { const el = document.createElementNS(SVGNS, tag); for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v); for (const c of kids.flat()) if (c != null) el.append(c instanceof Node ? c : document.createTextNode(String(c))); return el; }

  /* ---------- statistics library (checked against SciPy in tools/test_stats.mjs) ---------- */
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  const variance = (a) => { const m = mean(a); return a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1); };
  function lgamma(x) {
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
    x -= 1;
    let a = c[0];
    const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function betacf(a, b, x) {
    const FPMIN = 1e-300;
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let hh = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; hh *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
      const del = d * c; hh *= del;
      if (Math.abs(del - 1) < 3e-14) break;
    }
    return hh;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  const tTwoSided = (t, df) => ibeta(df / (df + t * t), df / 2, 0.5);
  function welch(a, b) {
    const n1 = a.length, n2 = b.length, v1 = variance(a), v2 = variance(b);
    const se2 = v1 / n1 + v2 / n2;
    if (!(se2 > 0)) return { t: 0, df: n1 + n2 - 2, p: 1, diff: mean(b) - mean(a) };
    const t = (mean(b) - mean(a)) / Math.sqrt(se2);
    const df = se2 * se2 / ((v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1));
    return { t, df, p: tTwoSided(t, df), diff: mean(b) - mean(a) };
  }
  function bh(ps) {
    const m = ps.length, idx = ps.map((p, i) => [p, i]).sort((x, y) => x[0] - y[0]), out = new Array(m);
    let prev = 1;
    for (let k = m - 1; k >= 0; k--) { const [p, i] = idx[k]; prev = Math.min(prev, p * m / (k + 1)); out[i] = prev; }
    return out;
  }
  function pearson(x, y) {
    const mx = mean(x), my = mean(y);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
    const r = sxy / Math.sqrt(sxx * syy), slope = sxy / sxx;
    return { r, slope, intercept: my - slope * mx, r2: r * r };
  }
  function normal(rng) { let u = 0, v = 0; while (u === 0) u = rng.next(); while (v === 0) v = rng.next(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const fmtP = (p) => (p < 0.0001 ? p.toExponential(1) : p < 0.01 ? p.toFixed(4) : p.toFixed(3));
  BB.stats = { mean, variance, welch, bh, pearson, tTwoSided, ibeta, lgamma, normal, fmtP };

  /* ---------- small SVG plotting helpers ---------- */
  function frame(w, hgt, pad) { return { w, h: hgt, pad, x0: pad.l, x1: w - pad.r, y0: hgt - pad.b, y1: pad.t }; }
  const scale = (d0, d1, r0, r1) => (v) => r0 + (v - d0) / (d1 - d0) * (r1 - r0);
  function axes(f, xs, ys, xt, yt, xlab, ylab) {
    const g = svg('g', {});
    g.append(svg('line', { class: 'axis', x1: f.x0, x2: f.x1, y1: f.y0, y2: f.y0 }), svg('line', { class: 'axis', x1: f.x0, x2: f.x0, y1: f.y0, y2: f.y1 }));
    xt.forEach((t) => g.append(svg('line', { class: 'grid-line', x1: xs(t), x2: xs(t), y1: f.y0, y2: f.y1 }), svg('text', { x: xs(t), y: f.y0 + 14, 'text-anchor': 'middle' }, String(t))));
    yt.forEach((t) => g.append(svg('line', { class: 'grid-line', x1: f.x0, x2: f.x1, y1: ys(t), y2: ys(t) }), svg('text', { x: f.x0 - 6, y: ys(t) + 4, 'text-anchor': 'end' }, String(t))));
    if (xlab) g.append(svg('text', { x: (f.x0 + f.x1) / 2, y: f.h - 4, 'text-anchor': 'middle' }, xlab));
    if (ylab) g.append(svg('text', { x: 12, y: (f.y0 + f.y1) / 2, transform: `rotate(-90 12 ${(f.y0 + f.y1) / 2})`, 'text-anchor': 'middle' }, ylab));
    return g;
  }
  const ticks = (lo, hi, n) => { const step = (hi - lo) / n; const p = Math.pow(10, Math.floor(Math.log10(step))); const s = [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= step) || step; const out = []; for (let v = Math.ceil(lo / s) * s; v <= hi + 1e-9; v += s) out.push(+v.toFixed(6)); return out; };

  /* ---------- log2 fold change ---------- */
  BB.widgets.log2 = function () {
    const a = h('input', { type: 'number', min: '0', step: 'any', value: '11.43', 'aria-label': 'Control value', inputmode: 'decimal' });
    const b = h('input', { type: 'number', min: '0', step: 'any', value: '476.89', 'aria-label': 'Treated value', inputmode: 'decimal' });
    const pc = h('input', { type: 'checkbox', id: 'pc' });
    const out = h('div', { 'aria-live': 'polite' }), plot = h('div');
    const presets = [['HSPA1A', 11.43, 476.89], ['ACTB', 2270.3, 2264.54], ['FOS', 11.9, 43.8], ['HSPA6', 0.09, 44.85], ['Halved', 100, 50], ['Zero in control', 0, 20]];
    function draw() {
      const x = Math.max(0, +a.value || 0), y = Math.max(0, +b.value || 0), p = pc.checked ? 1 : 0;
      out.innerHTML = ''; plot.innerHTML = '';
      if ((x + p) === 0 || (y + p) === 0) { out.append(h('div.feedback.bad', h('strong.lead', 'The log of zero is undefined.'), 'A ratio involving zero is either zero or infinite, so log2 cannot be computed. Analyses add a small pseudocount (often 1) before taking logs. Tick the pseudocount box.')); return; }
      const ratio = (y + p) / (x + p), lfc = Math.log2(ratio);
      out.append(h('div.stats', h('div.stat', h('strong', ratio >= 100 ? BB.fmt(ratio, 0) : ratio.toFixed(2)), h('span', 'ratio treated / control')), h('div.stat', h('strong', (lfc > 0 ? '+' : '') + lfc.toFixed(2)), h('span', 'log2 fold change'))),
        h('p', { style: { marginTop: '10px' } }, Math.abs(lfc) < 0.1 ? 'Essentially no change: the ratio is close to 1, so log2 is close to 0.' : lfc > 0 ? `Up: about ${ratio.toFixed(ratio < 10 ? 1 : 0)} times more in the treated sample. Each +1 on the log2 scale is one doubling (2 to the power ${lfc.toFixed(2)} is ${ratio.toFixed(2)}).` : `Down: about ${(1 / ratio).toFixed(1)} times less. On the log2 scale, halving is -1, exactly as far from 0 as doubling (+1).`));
      const f = frame(560, 92, { l: 16, r: 16, t: 14, b: 30 });
      const xs = scale(-6, 6, f.x0, f.x1);
      const s = svg('svg', { class: 'plot', viewBox: `0 0 ${f.w} ${f.h}`, role: 'img', 'aria-label': `Number line showing log2 fold change ${lfc.toFixed(2)}` });
      s.append(svg('line', { class: 'axis', x1: f.x0, x2: f.x1, y1: 46, y2: 46 }));
      for (let t = -6; t <= 6; t++) s.append(svg('line', { class: 'axis', x1: xs(t), x2: xs(t), y1: 41, y2: 51 }), svg('text', { x: xs(t), y: 68, 'text-anchor': 'middle' }, (t > 0 ? '+' : '') + t));
      s.append(svg('text', { x: xs(-1), y: 84, 'text-anchor': 'middle' }, 'half'), svg('text', { x: xs(1), y: 84, 'text-anchor': 'middle' }, 'double'), svg('text', { x: xs(0), y: 84, 'text-anchor': 'middle' }, 'same'));
      const cx = xs(BB.clamp(lfc, -6, 6));
      s.append(svg('circle', { cx, cy: 46, r: 9, fill: 'var(--accent)' }), svg('text', { x: cx, y: 30, 'text-anchor': 'middle', style: 'font-weight:700;fill:var(--text)' }, lfc.toFixed(2)));
      plot.append(s);
      markLab('log2');
    }
    [a, b, pc].forEach((x) => x.addEventListener('input', draw));
    draw();
    return h('div.widget', { 'data-widget': 'log2' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Fold change on the log2 scale'))),
      h('div.grid-2', h('div.field', h('label', 'Control (mean CPM)'), a), h('div.field', h('label', 'Treated (mean CPM)'), b)),
      h('label.check-row', pc, 'Add a pseudocount of 1 before dividing (needed when a value is 0)'),
      h('div.btn-row', { style: { margin: '6px 0 10px' } }, h('span.small.muted', 'Examples:'), presets.map(([l, x, y]) => h('button.btn.btn-sm', { type: 'button', onclick: () => { a.value = x; b.value = y; draw(); } }, l))),
      out, plot,
      h('p.widget-note', 'Example values are mean CPM from the toy heat-shock data. The site\'s volcano plot uses log2((heat + 1) / (control + 1)), that is, a pseudocount of 1.'));
  };

  /* ---------- variability and replicates ---------- */
  BB.widgets.variability = function () {
    const n = h('input', { type: 'range', min: '2', max: '10', value: '3', 'aria-label': 'Replicates per group' });
    const diff = h('input', { type: 'range', min: '0', max: '4', step: '0.25', value: '1.5', 'aria-label': 'True difference between group means' });
    const sd = h('input', { type: 'range', min: '0.25', max: '3', step: '0.25', value: '1', 'aria-label': 'Spread between replicates (standard deviation)' });
    const labels = { n: h('strong'), d: h('strong'), s: h('strong') };
    let seedv = 7, mode = 'sim';
    const plotEl = h('div'), out = h('div', { 'aria-live': 'polite' });
    const realSel = h('select', { 'aria-label': 'Real gene from the toy data' }, ['HSPA1A', 'HSPB1', 'FOS', 'ACTB'].map((g) => h('option', { value: g }, g)));
    function data() {
      if (mode === 'real') {
        const D = BB.data.bulk, g = D.genes.find((x) => x.g === realSel.value);
        const cpm = g.c.map((c, j) => Math.log2(c / D.libsize[j] * 1e6 + 1));
        return { a: cpm.slice(0, 3), b: cpm.slice(3), ylab: 'log2(CPM + 1)', names: D.samples };
      }
      const r = BB.rng(seedv * 1000 + +n.value);
      const N = +n.value, S = +sd.value, Dd = +diff.value;
      return { a: Array.from({ length: N }, () => 8 + S * normal(r)), b: Array.from({ length: N }, () => 8 + Dd + S * normal(r)), ylab: 'expression (arbitrary units)' };
    }
    function draw() {
      labels.n.textContent = n.value; labels.d.textContent = diff.value; labels.s.textContent = sd.value;
      const { a, b, ylab } = data();
      const all = a.concat(b), lo = Math.min(...all), hi = Math.max(...all), padv = (hi - lo) * 0.15 + 0.5;
      const f = frame(520, 260, { l: 50, r: 16, t: 14, b: 34 });
      const ys = scale(lo - padv, hi + padv, f.y0, f.y1);
      const xs = (g) => (g === 0 ? f.x0 + (f.x1 - f.x0) * 0.28 : f.x0 + (f.x1 - f.x0) * 0.72);
      const s = svg('svg', { class: 'plot', viewBox: `0 0 ${f.w} ${f.h}`, role: 'img', 'aria-label': `Dot plot: control mean ${mean(a).toFixed(2)}, treated mean ${mean(b).toFixed(2)}` });
      s.append(axes(f, (v) => v, ys, [], ticks(lo - padv, hi + padv, 5), null, ylab));
      [[a, 0, 'var(--accent)', 'control'], [b, 1, 'var(--violet)', mode === 'real' ? 'heat shock' : 'treated']].forEach(([arr, g, col, lab]) => {
        arr.forEach((v, i) => s.append(svg('circle', { cx: xs(g) + ((i % 5) - 2) * 9, cy: ys(v), r: 6, fill: col, 'fill-opacity': 0.85 })));
        const m = mean(arr);
        s.append(svg('line', { x1: xs(g) - 34, x2: xs(g) + 34, y1: ys(m), y2: ys(m), stroke: col, 'stroke-width': 3 }), svg('text', { x: xs(g), y: f.y0 + 18, 'text-anchor': 'middle' }, lab));
      });
      plotEl.innerHTML = ''; plotEl.append(s);
      const w = welch(a, b);
      out.innerHTML = '';
      out.append(h('div.stats', h('div.stat', h('strong', w.diff.toFixed(2)), h('span', 'difference of means')), h('div.stat', h('strong', Math.sqrt(variance(a)).toFixed(2) + ' / ' + Math.sqrt(variance(b)).toFixed(2)), h('span', 'spread (SD) control / treated')), h('div.stat', h('strong', w.t.toFixed(2)), h('span', 'Welch t statistic')), h('div.stat', h('strong', fmtP(w.p)), h('span', 'p-value (two-sided)'))),
        h('p', { style: { marginTop: '10px' } }, w.p < 0.05 ? 'The groups differ by more than the replicate-to-replicate spread would easily explain, so the test gives a small p-value.' : 'The difference is not large compared with the spread between replicates, so the evidence is weak (large p-value). This does not prove there is no difference.'),
        mode === 'real' && realSel.value === 'FOS' ? h('div.callout.pitfall', h('strong', 'FOS: one replicate tells a different story'), 'heat_2 is far higher than the other two heated cultures. The mean rises, but the replicates disagree, so the evidence is weak. One unusual sample is not enough to show a biological effect.') : null);
      markLab('variability');
    }
    [n, diff, sd].forEach((x) => x.addEventListener('input', draw));
    realSel.addEventListener('change', draw);
    const modeTabs = h('div.tabs', { role: 'tablist' }, [['sim', 'Simulate'], ['real', 'Real toy genes']].map(([k, l]) => h('button.tab', { type: 'button', role: 'tab', 'aria-selected': String(k === mode), 'data-k': k, onclick: () => { mode = k; modeTabs.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.k === mode))); controls.hidden = mode !== 'sim'; realBox.hidden = mode !== 'real'; draw(); } }, l)));
    const controls = h('div.grid-3', h('div.field', h('label', 'Replicates per group: ', labels.n), n), h('div.field', h('label', 'True difference: ', labels.d), diff), h('div.field', h('label', 'Spread (SD): ', labels.s), sd));
    const realBox = h('div.field', { hidden: true }, h('label', 'Gene'), realSel);
    draw();
    return h('div.widget', { 'data-widget': 'variability' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Same difference, different evidence')), modeTabs),
      controls, realBox,
      h('div.btn-row', { style: { margin: '8px 0' } }, h('button.btn.btn-sm', { type: 'button', onclick: () => { seedv++; draw(); } }, BB.ui.icon('reset'), 'Draw new replicates')),
      h('div.split', plotEl, out),
      h('p.widget-note', 'Simulated values from normal distributions; the test is Welch\'s t-test. Try: keep the difference fixed and increase the spread, then increase the number of replicates.'));
  };

  /* ---------- correlation ---------- */
  BB.widgets.correlation = function () {
    const rho = h('input', { type: 'range', min: '-1', max: '1', step: '0.05', value: '0.7', 'aria-label': 'Strength of the underlying relationship' });
    const outlier = h('input', { type: 'checkbox' });
    const lab = h('strong');
    let seedv = 3;
    const plotEl = h('div'), out = h('div', { 'aria-live': 'polite' });
    function draw() {
      lab.textContent = (+rho.value).toFixed(2);
      const r = BB.rng(seedv), N = 30, p = +rho.value;
      const x = [], y = [];
      for (let i = 0; i < N; i++) { const z1 = normal(r), z2 = normal(r); x.push(6 + 1.4 * z1); y.push(7 + 1.4 * (p * z1 + Math.sqrt(1 - p * p) * z2)); }
      if (outlier.checked) { x.push(13.5); y.push(p >= 0 ? 1.5 : 13.5); }
      const fit = pearson(x, y);
      const f = frame(520, 300, { l: 46, r: 14, t: 12, b: 38 });
      const xs = scale(0, 15, f.x0, f.x1), ys = scale(0, 15, f.y0, f.y1);
      const s = svg('svg', { class: 'plot', viewBox: `0 0 ${f.w} ${f.h}`, role: 'img', 'aria-label': `Scatter plot with Pearson r ${fit.r.toFixed(2)}` });
      s.append(axes(f, xs, ys, [0, 3, 6, 9, 12, 15], [0, 3, 6, 9, 12, 15], 'Gene A (log2 CPM)', 'Gene B (log2 CPM)'));
      x.forEach((v, i) => s.append(svg('circle', { cx: xs(v), cy: ys(y[i]), r: i === N ? 7 : 5, fill: i === N ? 'var(--red)' : 'var(--accent)', 'fill-opacity': 0.8 })));
      s.append(svg('line', { x1: xs(0), y1: ys(fit.intercept), x2: xs(15), y2: ys(fit.intercept + 15 * fit.slope), stroke: 'var(--violet)', 'stroke-width': 2.5 }));
      plotEl.innerHTML = ''; plotEl.append(s);
      out.innerHTML = '';
      out.append(h('div.stats', h('div.stat', h('strong', fit.r.toFixed(2)), h('span', 'Pearson r')), h('div.stat', h('strong', fit.r2.toFixed(2)), h('span', 'R squared')), h('div.stat', h('strong', fit.slope.toFixed(2)), h('span', 'slope of the line')), h('div.stat', h('strong', fit.intercept.toFixed(2)), h('span', 'intercept'))),
        h('p', { style: { marginTop: '10px' } }, `Fitted line: B = ${fit.intercept.toFixed(2)} + ${fit.slope.toFixed(2)} x A. ` + (Math.abs(fit.r) > 0.7 ? 'A strong linear relationship.' : Math.abs(fit.r) > 0.3 ? 'A moderate linear relationship with a lot of scatter.' : 'Little or no linear relationship.')),
        outlier.checked ? h('div.callout.pitfall', h('strong', 'One point can move r a lot'), 'The red point is far from the rest. Pearson correlation and a straight-line fit are sensitive to outliers, which is why you plot data before trusting a number.') : null,
        h('div.callout.info', h('strong', 'Correlation is not causation'), 'Two genes can rise and fall together because a third factor (cell type, time of day, a transcription factor) drives both. A correlation suggests a hypothesis; an experiment that changes one gene tests it.'));
      markLab('correlation');
    }
    rho.addEventListener('input', draw); outlier.addEventListener('change', draw);
    draw();
    return h('div.widget', { 'data-widget': 'correlation' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Correlation and a straight-line fit'))),
      h('div.field', h('label', 'Underlying relationship: ', lab), rho),
      h('div.btn-row', { style: { margin: '8px 0' } }, h('label.check-row', outlier, 'Add one outlier'), h('button.btn.btn-sm', { type: 'button', onclick: () => { seedv++; draw(); } }, BB.ui.icon('reset'), 'New sample of 30')),
      h('div.split', plotEl, out),
      h('p.widget-note', 'Thirty simulated samples. In R the same numbers come from cor(a, b) and lm(b ~ a).'));
  };

  /* ---------- multiple testing ---------- */
  BB.widgets.pvalues = function () {
    const mSel = h('select', { 'aria-label': 'Number of genes tested' }, [100, 1000, 5000].map((m) => h('option', { value: String(m), selected: m === 1000 }, BB.fmt(m) + ' genes')));
    const trueSel = h('select', { 'aria-label': 'Genes that truly change' }, [0, 50, 200].map((k) => h('option', { value: String(k) }, k === 0 ? 'none truly change' : k + ' truly change')));
    const out = h('div', { 'aria-live': 'polite' }), plotEl = h('div');
    let seedv = 11;
    function run() {
      const m = +mSel.value, k = Math.min(+trueSel.value, m), r = BB.rng(seedv * 7919 + m + k), n = 3;
      const ps = [], truth = [];
      for (let i = 0; i < m; i++) {
        const real = i < k;
        const a = Array.from({ length: n }, () => normal(r)), b = Array.from({ length: n }, () => (real ? 3 : 0) + normal(r));
        ps.push(welch(a, b).p); truth.push(real);
      }
      const adj = bh(ps);
      const rawHits = ps.filter((p) => p < 0.05).length, rawFalse = ps.filter((p, i) => p < 0.05 && !truth[i]).length;
      const bhHits = adj.filter((q) => q < 0.05).length, bhFalse = adj.filter((q, i) => q < 0.05 && !truth[i]).length;
      const bins = Array(20).fill(0); ps.forEach((p) => bins[Math.min(19, Math.floor(p * 20))]++);
      const f = frame(520, 220, { l: 44, r: 12, t: 12, b: 36 });
      const maxB = Math.max(...bins), xs = scale(0, 1, f.x0, f.x1), ys = scale(0, maxB * 1.1, f.y0, f.y1);
      const s = svg('svg', { class: 'plot', viewBox: `0 0 ${f.w} ${f.h}`, role: 'img', 'aria-label': 'Histogram of p-values' });
      s.append(axes(f, xs, ys, [0, 0.25, 0.5, 0.75, 1], ticks(0, maxB * 1.1, 4), 'p-value', 'number of genes'));
      bins.forEach((c, i) => s.append(svg('rect', { x: xs(i / 20) + 1, width: (f.x1 - f.x0) / 20 - 2, y: ys(c), height: f.y0 - ys(c), fill: i === 0 ? 'var(--orange)' : 'var(--accent)', 'fill-opacity': 0.85 })));
      plotEl.innerHTML = ''; plotEl.append(s);
      out.innerHTML = '';
      out.append(h('div.stats',
        h('div.stat', h('strong', String(rawHits)), h('span', 'genes with p < 0.05')),
        h('div.stat', h('strong', String(rawFalse)), h('span', `of those are false positives (expected about ${Math.round(0.05 * (m - k))})`)),
        h('div.stat', h('strong', String(bhHits)), h('span', 'genes with BH-adjusted p < 0.05')),
        h('div.stat', h('strong', String(bhFalse)), h('span', 'false discoveries after BH'))),
        h('p', { style: { marginTop: '10px' } }, k === 0
          ? `None of these genes truly changed, yet about 5% of tests still gave p < 0.05 by chance. That is what "p < 0.05" allows. The Benjamini-Hochberg (BH) correction asks for stronger evidence when many genes are tested, so false hits mostly disappear.`
          : `${k} genes truly changed. Raw p < 0.05 finds many of them but also about ${Math.round(0.05 * (m - k))} false ones. BH keeps the proportion of false discoveries among the genes it reports low (at most about 5% on average), at the cost of missing some true changes when replicates are few.`));
      markLab('pvalues');
    }
    run();
    return h('div.widget', { 'data-widget': 'pvalues' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Simulation'), h('h3', 'What happens when you test thousands of genes?'))),
      h('div.btn-row', mSel, trueSel, h('button.btn.btn-primary.btn-sm', { type: 'button', onclick: () => { seedv++; run(); } }, BB.ui.icon('play'), 'Run the experiment again')),
      h('div.split', { style: { marginTop: '12px' } }, plotEl, out),
      h('p.widget-note', 'Each simulated gene has 3 control and 3 treated values from normal distributions; changed genes are shifted by 3 standard deviations; the test is Welch\'s t-test. Real RNA-seq tools use count models, but the multiple-testing logic is the same.'));
    function noop() {}
    noop();
  };

  /* ---------- guided RNA-seq differential expression experiment ---------- */
  BB.widgets.rnaseq = function () {
    const D = BB.data.bulk;
    const named = D.named;
    const byGene = Object.fromEntries(D.genes.map((g) => [g.g, g]));
    const cpm = (g) => g.c.map((c, j) => c / D.libsize[j] * 1e6);
    const STEPS = ['The experiment', 'Raw counts', 'Normalize', 'Replicates', 'Test every gene', 'Interpret'];
    let step = 0;
    const done = new Set();
    const tabs = h('div.step-tabs', { role: 'tablist', 'aria-label': 'Experiment steps' });
    const panel = h('div', { role: 'tabpanel' });
    let selGene = 'HSPA1A', fcT = 1, qT = 0.05;

    function nav() {
      tabs.innerHTML = '';
      STEPS.forEach((s, i) => tabs.append(h('button' + (done.has(i) && i !== step ? '.done' : ''), { type: 'button', role: 'tab', 'aria-selected': String(i === step), 'aria-current': i === step ? 'step' : null, onclick: () => { step = i; draw(); } }, `${i + 1}. ${s}`)));
    }
    const next = (label) => h('div.btn-row', { style: { marginTop: '14px' } }, step > 0 ? h('button.btn.btn-sm', { type: 'button', onclick: () => { step--; draw(); } }, BB.ui.icon('left'), 'Back') : null, step < STEPS.length - 1 ? h('button.btn.btn-sm.btn-primary', { type: 'button', onclick: () => { done.add(step); step++; draw(); } }, label || 'Next step', BB.ui.icon('right')) : null);
    const ask = (q) => h('div', { style: { marginTop: '12px' } }, BB.ui.mcq(q, { retry: true, onAnswer: (ok) => { if (ok) done.add(step); } }));

    function stepExperiment() {
      return h('div.stack',
        h('p', { html: md(D.story + ' This is a classic stress response: when proteins start to unfold, cells switch on **chaperone** genes that help refold them.') }),
        h('div.table-wrap', h('table.data', h('thead', h('tr', h('th', 'sample'), h('th', 'condition'), h('th.num', 'reads assigned (library size)'))), h('tbody', D.samples.map((s, i) => h('tr', h('td', s), h('td', D.condition[i]), h('td.num', BB.fmt(D.libsize[i]))))))),
        ask({ q: 'Before looking at any data: which result would support the idea that heat triggers the chaperone response?', options: [
          { t: 'Chaperone genes such as HSPA1A rise in all three heated cultures compared with controls, while typical housekeeping genes stay flat', why: 'Right. A consistent rise across independent replicates, with stable reference genes, is the pattern the hypothesis predicts.' },
          { t: 'Every gene rises after heating', why: 'If every gene rose equally, that would point to a technical effect (for example deeper sequencing) rather than a specific biological response.' },
          { t: 'One heated culture shows a huge rise in one gene', why: 'A single culture cannot tell a real effect from chance or a handling problem. Replicates are needed to see whether the change is consistent.' }], answer: 0 }),
        next('Look at the raw counts'));
    }
    function stepRaw() {
      return h('div.stack',
        h('p', 'These are reads assigned to 12 named genes. The toy dataset has 1,512 genes; a real human experiment measures about 20,000.'),
        h('div.table-wrap', h('table.data',
          h('thead', h('tr', h('th', 'gene'), D.samples.map((s) => h('th.num', s)))),
          h('tbody', named.map((g) => h('tr', h('td', h('strong', g)), byGene[g].c.map((c) => h('td.num', BB.fmt(c)))))))),
        ask({ q: 'ACTB has 44,289 reads in ctrl_1 and 55,945 in heat_1, about 26% more. What is the most important thing to check before concluding that heat raised ACTB?', options: [
          { t: 'How many reads each sample has in total (library size)', why: 'Right. heat_1 was sequenced more deeply (24.6 million vs 18.4 million reads), so almost every gene gets more reads in heat_1.' },
          { t: 'Whether ACTB is on chromosome 7', why: 'Chromosome location does not change how a count should be compared between samples.' },
          { t: 'Nothing: a 26% difference in raw counts is a real change', why: 'Raw counts mix biology with sequencing depth. Without adjusting for depth you cannot tell which caused the difference.' }], answer: 0 }),
        next('Normalize for sequencing depth'));
    }
    function stepNorm() {
      const rows = ['ACTB', 'GAPDH', 'HSPA1A', 'HSPA6'].map((g) => [g, byGene[g].c, cpm(byGene[g])]);
      return h('div.stack',
        h('p', { html: md('Counts per million (CPM) = count / library size x 1,000,000. It answers: out of every million reads in this sample, how many came from this gene?') }),
        h('div.table-wrap', h('table.data', h('thead', h('tr', h('th', 'gene'), h('th', 'value'), D.samples.map((s) => h('th.num', s)))), h('tbody', rows.flatMap(([g, raw, c]) => [h('tr', h('td', h('strong', g)), h('td', 'raw'), raw.map((v) => h('td.num', BB.fmt(v)))), h('tr.hl', h('td', ''), h('td', 'CPM'), c.map((v) => h('td.num', BB.fmt(v, v < 10 ? 2 : 0))))])))),
        ask({ q: 'After converting to CPM, ACTB is about 2,407 in ctrl_1 and about 2,274 in heat_1. What does that tell you?', options: [
          { t: 'The apparent rise in raw counts was caused by deeper sequencing; ACTB is roughly stable', why: 'Right. Once depth is accounted for, ACTB is flat (slightly lower, within normal variation).' },
          { t: 'Heat lowered ACTB by about 6%', why: 'A 6% difference between two single samples is well within normal variation between cultures. One pair of samples cannot show a real change.' },
          { t: 'CPM is wrong because it changed the numbers', why: 'CPM changes the numbers on purpose, to put samples sequenced to different depths on the same scale.' }], answer: 0 }),
        h('div.callout.info', h('strong', 'A simplification'), 'CPM fixes sequencing depth but not composition bias (when a few genes change hugely, everything else looks smaller). Tools such as DESeq2 and edgeR use more careful scaling factors.'),
        next('Compare replicates'));
    }
    function stepReplicates() {
      const box = h('div');
      const sel = h('select', { 'aria-label': 'Gene' }, named.map((g) => h('option', { value: g, selected: g === selGene }, g)));
      function drawGene() {
        const g = byGene[sel.value]; selGene = sel.value;
        const c = cpm(g), lc = c.map((v) => Math.log2(v + 1));
        const f = frame(480, 220, { l: 46, r: 12, t: 12, b: 32 });
        const lo = Math.min(...lc), hi = Math.max(...lc), pad = (hi - lo) * 0.2 + 0.3;
        const ys = scale(lo - pad, hi + pad, f.y0, f.y1);
        const s = svg('svg', { class: 'plot', viewBox: `0 0 ${f.w} ${f.h}`, role: 'img', 'aria-label': `${g.g} replicate values` });
        s.append(axes(f, (v) => v, ys, [], ticks(lo - pad, hi + pad, 4), null, 'log2(CPM + 1)'));
        const xs = (k) => f.x0 + (f.x1 - f.x0) * (k < 3 ? 0.28 : 0.72);
        lc.forEach((v, k) => s.append(svg('circle', { cx: xs(k) + ((k % 3) - 1) * 14, cy: ys(v), r: 7, fill: k < 3 ? 'var(--accent)' : 'var(--violet)' }), svg('text', { x: xs(k) + ((k % 3) - 1) * 14 + 9, y: ys(v) - 8 }, D.samples[k])));
        [[0, 'control'], [1, 'heat shock']].forEach(([gi, l]) => { const m = mean(lc.slice(gi * 3, gi * 3 + 3)); s.append(svg('line', { x1: xs(gi * 3) - 36, x2: xs(gi * 3) + 36, y1: ys(m), y2: ys(m), stroke: gi ? 'var(--violet)' : 'var(--accent)', 'stroke-width': 3 }), svg('text', { x: xs(gi * 3), y: f.y0 + 18, 'text-anchor': 'middle' }, l)); });
        box.innerHTML = '';
        box.append(h('div.split', s, h('div.stats', h('div.stat', h('strong', (g.lfc > 0 ? '+' : '') + g.lfc.toFixed(2)), h('span', 'log2 fold change')), h('div.stat', h('strong', fmtP(g.p)), h('span', 'p-value')), h('div.stat', h('strong', fmtP(g.padj)), h('span', 'adjusted p (BH)')), h('div.stat', h('strong', (Math.pow(2, g.lfc)).toFixed(1) + 'x'), h('span', 'fold change')))));
      }
      sel.addEventListener('change', drawGene);
      drawGene();
      return h('div.stack',
        h('p', 'Each dot is one independent culture. Compare the gap between groups with the spread inside each group. Try HSPA1A, HSPB1 and FOS.'),
        h('div.field', h('label', 'Gene'), sel), box,
        ask({ q: 'FOS has a log2 fold change of about +1.8 (about 3.5 times higher on average) but p = 0.40. Why is the evidence weak?', options: [
          { t: 'Only one heated culture (heat_2) is high; the other two look like the controls, so the replicates disagree', why: 'Right. The average is pulled up by one unusual sample. The test weighs the difference against this large spread.' },
          { t: 'A fold change of 3.5 is too small to matter', why: 'A 3.5-fold change would be large if it were consistent. The problem is inconsistency between replicates, not the size of the average.' },
          { t: 'FOS is not a real gene', why: 'FOS is a well-studied real gene. In this toy data it simply shows how one odd replicate can create a big average change with weak evidence.' }], answer: 0 }),
        next('Test every gene'));
    }
    function stepVolcano() {
      const fcIn = h('input', { type: 'range', min: '0', max: '3', step: '0.5', value: String(fcT), 'aria-label': 'Minimum absolute log2 fold change' });
      const qIn = h('select', { 'aria-label': 'Adjusted p-value cutoff' }, [0.01, 0.05, 0.1].map((q) => h('option', { value: String(q), selected: q === qT }, 'padj < ' + q)));
      const plotEl = h('div'), info = h('div', { 'aria-live': 'polite' }), count = h('div', { 'aria-live': 'polite' });
      const fcLab = h('strong');
      let picked = 'HSPA1A';
      const pickSel = h('select', { 'aria-label': 'Inspect a named gene' }, named.map((g) => h('option', { value: g, selected: g === picked }, g)));
      pickSel.addEventListener('change', () => { picked = pickSel.value; showInfo(); });
      function drawV() {
        fcT = +fcIn.value; qT = +qIn.value; fcLab.textContent = fcT;
        const f = frame(560, 360, { l: 48, r: 14, t: 14, b: 40 });
        const pts = D.genes.map((g) => ({ g: g.g, x: g.lfc, y: -Math.log10(Math.max(g.p, 1e-12)), sig: g.padj < qT && Math.abs(g.lfc) >= fcT, named: named.includes(g.g) }));
        const ymax = Math.max(...pts.map((p) => p.y)) * 1.08;
        const xs = scale(-6, 6, f.x0, f.x1), ys = scale(0, ymax, f.y0, f.y1);
        const s = svg('svg', { class: 'plot', viewBox: `0 0 ${f.w} ${f.h}`, role: 'img', 'aria-label': 'Volcano plot of all genes' });
        s.append(axes(f, xs, ys, [-6, -4, -2, 0, 2, 4, 6], ticks(0, ymax, 5), 'log2 fold change (heat vs control)', '-log10(p-value)'));
        if (fcT > 0) [-fcT, fcT].forEach((t) => s.append(svg('line', { x1: xs(t), x2: xs(t), y1: f.y0, y2: f.y1, stroke: 'var(--muted)', 'stroke-dasharray': '4 4' })));
        const gBg = svg('g', {}), gFg = svg('g', {});
        pts.forEach((p) => {
          const el = svg('circle', { cx: xs(BB.clamp(p.x, -6, 6)), cy: ys(p.y), r: p.named ? 5.5 : 2.6, fill: p.sig ? (p.x > 0 ? 'var(--red)' : 'var(--blue)') : 'var(--border-strong)', 'fill-opacity': p.named ? 1 : 0.7, stroke: p.named ? 'var(--text)' : null, 'stroke-width': p.named ? 1 : null });
          (p.named ? gFg : gBg).append(el);
          if (p.named && (p.sig || p.g === 'FOS' || p.g === 'ACTB')) { const right = p.x > 2.5; gFg.append(svg('text', { x: xs(BB.clamp(p.x, -6, 6)) + (right ? -8 : 7), y: ys(p.y) - 6, 'text-anchor': right ? 'end' : 'start', style: 'fill:var(--text);font-weight:700;paint-order:stroke;stroke:var(--surface);stroke-width:3px' }, p.g)); }
        });
        s.append(gBg, gFg);
        s.addEventListener('click', (e) => {
          const box = s.getBoundingClientRect();
          const px = (e.clientX - box.left) / box.width * f.w, py = (e.clientY - box.top) / box.height * f.h;
          let best = null, bd = 1e9;
          pts.forEach((p) => { const d = (xs(BB.clamp(p.x, -6, 6)) - px) ** 2 + (ys(p.y) - py) ** 2; if (d < bd) { bd = d; best = p; } });
          if (best && bd < 400) { picked = best.g; if (named.includes(picked)) pickSel.value = picked; showInfo(); }
        });
        plotEl.innerHTML = ''; plotEl.append(s);
        const sig = pts.filter((p) => p.sig);
        count.innerHTML = '';
        count.append(h('div.stats', h('div.stat', h('strong', String(sig.length)), h('span', 'genes pass both cutoffs')), h('div.stat', h('strong', String(sig.filter((p) => p.x > 0).length)), h('span', 'up after heat')), h('div.stat', h('strong', String(sig.filter((p) => p.x < 0).length)), h('span', 'down after heat')), h('div.stat', h('strong', String(D.genes.length)), h('span', 'genes tested'))));
        showInfo();
        markLab('rnaseq');
      }
      function showInfo() {
        const g = byGene[picked];
        info.innerHTML = '';
        info.append(h('div.callout.accent', h('strong', picked + (named.includes(picked) ? '' : ' (simulated background gene)')), h('span', ` log2FC ${g.lfc > 0 ? '+' : ''}${g.lfc.toFixed(2)}, p = ${fmtP(g.p)}, adjusted p = ${fmtP(g.padj)}. ${g.padj < qT && Math.abs(g.lfc) >= fcT ? 'Passes both cutoffs.' : g.padj < qT ? 'Significant, but the change is smaller than your fold-change cutoff.' : 'Does not pass the adjusted p-value cutoff.'}`)));
      }
      fcIn.addEventListener('input', drawV); qIn.addEventListener('change', drawV);
      drawV();
      return h('div.stack',
        h('p', { html: md('Each dot is one gene (12 named genes plus 1,500 simulated background genes). Right = higher after heat, up = stronger evidence. Red and blue genes pass your cutoffs. Tap a dot, or choose a named gene from the list, to inspect it.') }),
        h('div.grid-2', h('div.field', h('label', 'Minimum |log2 fold change|: ', fcLab), fcIn), h('div.field', h('label', 'Adjusted p-value cutoff'), qIn), h('div.field', h('label', 'Inspect a named gene'), pickSel)),
        plotEl, count, info,
        ask({ q: 'HSPB1 has p = 0.018 but an adjusted p of 0.23. With a cutoff of adjusted p < 0.05, how should you report it?', options: [
          { t: 'Not significant after correcting for testing about 1,500 genes; there may be a modest effect that this experiment cannot confirm', why: 'Right. Not significant is not the same as no effect. With three replicates, modest changes are hard to confirm.' },
          { t: 'Significant, because its raw p-value is below 0.05', why: 'With 1,512 tests, about 76 genes would have p < 0.05 by chance alone even if nothing changed. The adjusted p-value accounts for that.' },
          { t: 'Proven unchanged by heat', why: 'A large adjusted p-value means weak evidence, not proof of no change. HSPB1 is in fact a known heat-inducible gene; this experiment simply lacks power for a modest change.' }], answer: 0 }),
        next('Interpret the result'));
    }
    function stepInterpret() {
      const sig = named.filter((g) => byGene[g].padj < 0.05);
      return h('div.stack',
        h('p', `Named genes with adjusted p < 0.05: ${sig.join(', ')}. All are chaperone or co-chaperone genes and all increased. ACTB, GAPDH, EEF1A1 and TP53 showed no evidence of change.`),
        ask({ q: 'Which conclusion is justified by this experiment?', options: [
          { t: 'One hour at 42 C increased RNA levels of several chaperone genes in these cells; confirming key genes with an independent method and measuring protein would strengthen the finding', why: 'Right. It states what was measured (RNA), in what system, and what would strengthen it.' },
          { t: 'HSPA1A protects human cells from dying in fever', why: 'The experiment measured RNA levels, not protein, survival or fever in people. That claim needs different experiments.' },
          { t: 'Genes that were not significant, such as HSPB1 and BAG3, are not affected by heat', why: 'Not significant means the evidence was too weak here, not that there is no effect. Both are in fact known to be heat-inducible.' },
          { t: 'Heat increases the expression of all genes', why: 'Most genes, including ACTB and GAPDH, showed no evidence of change. The response is specific.' }], answer: 0 }),
        h('div.callout.info', h('strong', 'What a real analysis adds'), 'Quality control of reads, alignment or quantification, statistical models built for count data (DESeq2 and edgeR fit the counts; limma-voom weights log counts), checks for batch effects and outlier samples, shrinkage of fold changes for low counts, and pathway or enrichment analysis. The logic is the same as here.'),
        next());
    }
    function draw() {
      nav();
      panel.innerHTML = '';
      panel.append([stepExperiment, stepRaw, stepNorm, stepReplicates, stepVolcano, stepInterpret][step]());
    }
    draw();
    return h('div.widget', { 'data-widget': 'rnaseq' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Guided experiment'), h('h3', 'Which genes respond to heat?')), h('span.sim-label', 'Toy data, simplified statistics')),
      tabs, panel,
      h('p.widget-note', 'Teaching simplification: ' + D.method + ' Real RNA-seq tools model how count data vary (DESeq2 and edgeR fit the counts themselves) and share information across genes.'));
  };
})();
