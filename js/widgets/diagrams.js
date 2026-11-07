/* Diagram engine: original, labeled, step-by-step visuals (SVG or HTML) with a caption for every step.
   A diagram is registered with BB.diagram.define(name, spec):
     spec = {
       title:   'Short title shown above the visual',
       summary: 'One sentence describing the whole visual (accessible name).',
       build(D) { return node; },   // builds the visual with the helpers below; parts that steps refer to carry keys
       steps: [ { cap: 'Caption (inline `code` and **bold** allowed)',
                  show: ['k'],          // keys hidden until this step (then they stay visible)
                  hide: ['k'],          // keys hidden again from this step
                  hi:   ['k'],          // keys highlighted during this step only
                  set:  { k: 'text' },  // replace the text of a keyed element from this step on
                  move: { k: [dx, dy] } // translate a keyed SVG group from this step on
                }, ... ]
     }
   Keys: an element can carry several space-separated keys in data-k. Rendering: BB.diagram.render(name) or
   BB.widgets.diagram({ name }). Everything is recomputed from the first step, so Back always works. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  const NS = 'http://www.w3.org/2000/svg';
  const registry = {};
  let uid = 0;

  /* ---------- builders ---------- */
  function s(tag, attrs, ...children) {
    const el = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'k') { if (v) el.setAttribute('data-k', v); }
      else if (k === 'cls') el.setAttribute('class', v);
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat(Infinity)) { if (c == null || c === false) continue; el.append(c instanceof Node ? c : document.createTextNode(String(c))); }
    return el;
  }
  // Multi-line SVG text: '\n' starts a new line. size in viewBox units.
  function textEl(x, y, str, o = {}) {
    const lines = String(str).split('\n');
    const size = o.size || 14, lh = o.lh || size * 1.25;
    const t = s('text', { x, y: y - ((lines.length - 1) * lh) / 2, 'text-anchor': o.anchor || 'middle', 'dominant-baseline': 'central', cls: 'dg-t' + (o.mono ? ' mono' : '') + (o.cls ? ' ' + o.cls : ''), 'font-size': size, 'font-weight': o.weight || null });
    lines.forEach((ln, i) => t.append(s('tspan', { x, dy: i ? lh : 0 }, ln)));
    return t;
  }

  function makeHelpers(svgId) {
    const D = {
      s,
      // SVG root. Design at width 400 so text stays readable on phones.
      svg(w, hgt, ...children) {
        const mk = (id, cls) => s('marker', { id: svgId + '-' + id, viewBox: '0 0 10 10', refX: '8.5', refY: '5', markerWidth: '10', markerHeight: '10', markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse' }, s('path', { d: 'M0,0 L10,5 L0,10 z', cls: 'dg-head' + (cls ? ' ' + cls : '') }));
        const defs = s('defs', null, mk('a', ''), mk('g', 'gold'), mk('b', 'blue'));
        return s('svg', { viewBox: `0 0 ${w} ${hgt}`, cls: 'dg-svg', 'aria-hidden': 'true', focusable: 'false', style: `max-width:${Math.round(w * 1.3)}px` }, defs, children);
      },
      g(k, ...children) { return s('g', { k }, children); },
      // Rounded box with a centered label. o.cls: dir | file | navy | gold | green | red | blue | violet | orange | muted | code | ghost
      box(k, x, y, w, hgt, label, o = {}) {
        const g = s('g', { k, cls: 'dg-box' + (o.cls ? ' ' + o.cls : '') });
        g.append(s('rect', { x, y, width: w, height: hgt, rx: o.r != null ? o.r : 8 }));
        if (label != null && label !== '') g.append(textEl(o.tx != null ? o.tx : x + (o.anchor === 'start' ? 10 : w / 2), y + hgt / 2, label, { size: o.size, mono: o.mono, weight: o.weight, anchor: o.anchor, lh: o.lh }));
        return g;
      },
      text(k, x, y, str, o = {}) { const t = textEl(x, y, str, o); if (k) t.setAttribute('data-k', k); return t; },
      // Arrow from (x1,y1) to (x2,y2). o.bend: curve offset; o.label; o.cls 'gold' | 'dash'
      arrow(k, x1, y1, x2, y2, o = {}) {
        const g = s('g', { k, cls: 'dg-arrow' + (o.cls ? ' ' + o.cls : '') });
        const mid = [(x1 + x2) / 2, (y1 + y2) / 2];
        let d = `M${x1},${y1} L${x2},${y2}`;
        if (o.bend) { const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1; const cx = mid[0] - (dy / len) * o.bend, cy = mid[1] + (dx / len) * o.bend; d = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`; mid[0] = (x1 + 2 * cx + x2) / 4; mid[1] = (y1 + 2 * cy + y2) / 4; }
        const mid0 = o.cls && o.cls.includes('gold') ? 'g' : o.cls && o.cls.includes('blue') ? 'b' : 'a';
        g.append(s('path', { d, 'marker-end': o.noHead ? null : `url(#${svgId}-${mid0})`, 'marker-start': o.both ? `url(#${svgId}-${mid0})` : null }));
        if (o.label) g.append(textEl(mid[0] + (o.lx || 0), mid[1] + (o.ly != null ? o.ly : -10), o.label, { size: o.size || 12, cls: 'dg-alabel' + (o.cls && o.cls.includes('gold') ? ' gold' : ''), mono: o.mono }));
        return g;
      },
      // A route drawn as a thick colored path (o.cls 'gold' or 'blue'), with an optional arrowhead at the end.
      route(k, d, o = {}) { const mid0 = o.cls === 'blue' ? 'b' : 'g'; return s('g', { k, cls: 'dg-arrow ' + (o.cls || 'gold') }, s('path', { d, 'marker-end': o.head === false ? null : `url(#${svgId}-${mid0})` })); },
      line(k, x1, y1, x2, y2, o = {}) { return s('line', { k, x1, y1, x2, y2, cls: 'dg-line' + (o.cls ? ' ' + o.cls : '') }); },
      path(k, d, o = {}) { return s('path', { k, d, cls: 'dg-path' + (o.cls ? ' ' + o.cls : '') }); },
      dot(k, cx, cy, r, o = {}) { return s('circle', { k, cx, cy, r, cls: 'dg-dot' + (o.cls ? ' ' + o.cls : '') }); },

      /* ---------- HTML helpers ---------- */
      // Vertical chain of steps: items [{ k, t, d, tag }]
      flow(items, o = {}) {
        return h('ol.dg-flow' + (o.compact ? '.compact' : ''), items.map((it, i) => h('li.dg-node' + (it.cls ? '.' + it.cls : ''), { 'data-k': it.k || 'n' + i },
          it.tag ? h('span.dg-tag', it.tag) : null, h('strong', it.t), it.d ? h('span.dg-d', { html: md(it.d) }) : null)));
      },
      // Table: rows = array of arrays (first row is the header when o.head). Cells get keys r{i}c{j}, r{i}, c{j}.
      table(rows, o = {}) {
        const t = h('table.dg-table' + (o.mono ? '.mono' : ''));
        rows.forEach((row, i) => {
          const tr = h('tr', { 'data-k': 'r' + i });
          row.forEach((cell, j) => {
            const isHead = (o.head && i === 0) || (o.rowHead && j === 0);
            const td = h(isHead ? 'th' : 'td', { 'data-k': `r${i}c${j} r${i} c${j}`, scope: isHead ? (i === 0 ? 'col' : 'row') : null });
            if (cell && typeof cell === 'object' && !(cell instanceof Node)) { td.innerHTML = md(cell.t); if (cell.k) td.dataset.k += ' ' + cell.k; if (cell.cls) td.className = cell.cls; }
            else if (cell instanceof Node) td.append(cell);
            else td.innerHTML = md(String(cell));
            tr.append(td);
          });
          t.append(tr);
        });
        return h('div.dg-table-wrap', t);
      },
      // Row of value boxes with position labels. o.start: 1 (R) or 0 (Python); o.key: prefix for keys (key1, key2...)
      cells(values, o = {}) {
        const start = o.start == null ? 1 : o.start, key = o.key || 'x';
        return h('div.dg-cells', values.map((v, i) => h('div.dg-cell', { 'data-k': key + (i + start) + (o.keys && o.keys[i] ? ' ' + o.keys[i] : '') },
          h('span.dg-v', String(v)), o.noIdx ? null : h('span.dg-i', o.label ? o.label(i + start) : String(i + start)))));
      },
      // Code or terminal text with keyed spans: '[[key|text]]'. Lines are joined with newlines.
      code(lines, o = {}) {
        const pre = h('pre.dg-code' + (o.term ? '.term' : ''));
        lines.forEach((ln, i) => {
          const lineEl = h('span.dg-line-row', { 'data-k': 'L' + (i + 1) });
          String(ln).split(/(\[\[[^\]|]+\|[^\]]*\]\])/g).forEach((part) => {
            const m = /^\[\[([^\]|]+)\|([^\]]*)\]\]$/.exec(part);
            if (m) lineEl.append(h('span.dg-span', { 'data-k': m[1] }, m[2]));
            else if (part) lineEl.append(document.createTextNode(part));
          });
          pre.append(lineEl, i < lines.length - 1 ? '\n' : '');
        });
        return pre;
      },
      // Small labelled note that a step can reveal.
      note(k, text, o = {}) { return h('div.dg-note' + (o.cls ? '.' + o.cls : ''), { 'data-k': k, html: md(text) }); },
      // Generic keyed HTML element: D.el('div.dg-x', 'key', children...)
      el(tag, k, ...children) { return h(tag, { 'data-k': k }, ...children); }
    };
    return D;
  }

  /* ---------- step state ---------- */
  function keyed(root, key) { return root.querySelectorAll(`[data-k~="${CSS.escape(key)}"]`); }
  function setText(el, t) {
    const target = el.tagName.toLowerCase() === 'g' ? el.querySelector('text') : el;
    if (!target) return;
    // Keep the original markup (multi-line SVG text has several tspans) so Back can restore it exactly.
    if (target.dataset.orig == null) { target.dataset.orig = target.textContent; target.dataset.origHtml = target.innerHTML; }
    if (target.namespaceURI === NS && target.tagName.toLowerCase() === 'text') {
      const first = target.querySelector('tspan');
      if (first) { first.textContent = t; target.querySelectorAll('tspan').forEach((ts, i) => { if (i) ts.remove(); }); }
      else target.textContent = t;
    } else target.textContent = t;
  }
  function apply(root, spec, k) {
    root.querySelectorAll('.dg-hi, .dg-off').forEach((el) => el.classList.remove('dg-hi', 'dg-off'));
    root.querySelectorAll('[data-orig]').forEach((el) => { el.innerHTML = el.dataset.origHtml; });
    root.querySelectorAll('[data-moved]').forEach((el) => { el.removeAttribute('transform'); el.removeAttribute('data-moved'); });
    const hidden = new Set(spec.steps.flatMap((st) => st.show || []));
    const texts = {}, moves = {};
    for (let i = 0; i <= k; i++) {
      const st = spec.steps[i];
      (st.show || []).forEach((x) => hidden.delete(x));
      (st.hide || []).forEach((x) => hidden.add(x));
      Object.assign(texts, st.set || {});
      Object.assign(moves, st.move || {});
    }
    hidden.forEach((key) => keyed(root, key).forEach((el) => el.classList.add('dg-off')));
    for (const [key, t] of Object.entries(texts)) keyed(root, key).forEach((el) => setText(el, t));
    for (const [key, [dx, dy]] of Object.entries(moves)) keyed(root, key).forEach((el) => { el.setAttribute('transform', `translate(${dx} ${dy})`); el.setAttribute('data-moved', '1'); });
    (spec.steps[k].hi || []).forEach((key) => keyed(root, key).forEach((el) => el.classList.add('dg-hi')));
  }

  /* ---------- widget ---------- */
  function render(name, opts = {}) {
    const spec = registry[name];
    if (!spec) return h('div.callout', 'This visual is not available.');
    const id = 'dg' + (++uid);
    let node;
    try { node = spec.build(makeHelpers(id)); }
    catch (e) { console.error(e); return h('div.callout.bad', 'This visual could not be drawn. Please reload the page.'); }
    const stage = h('div.dg-stage', node);
    const n = spec.steps.length;
    let k = 0;
    const count = h('div.dg-count');
    const cap = h('p.dg-cap', { 'aria-live': 'polite', id: id + '-cap' });
    const back = h('button.btn.btn-sm', { type: 'button', 'aria-label': 'Previous step' }, BB.ui.icon('left'), 'Back');
    const next = h('button.btn.btn-sm.btn-primary', { type: 'button' });
    const dots = h('div.dg-dots', { role: 'group', 'aria-label': 'Jump to a step' }, spec.steps.map((_, i) => h('button', { type: 'button', 'aria-label': `Step ${i + 1}`, 'data-i': i, onclick: () => go(i) })));
    const fig = h('figure.dg', { 'data-diagram': name, id, 'aria-labelledby': id + '-t', tabindex: '-1' },
      opts.noHead ? null : h('div.dg-headrow', h('div', h('div.eyebrow', opts.eyebrow || 'Visual explanation'), h('h3', { id: id + '-t' }, spec.title)), h('span.dg-steps-chip', `${n} step${n === 1 ? '' : 's'}`)),
      opts.noHead ? h('span.sr-only', { id: id + '-t' }, spec.title) : null,
      h('div.dg-body', h('div.dg-stagewrap', { role: 'img', 'aria-label': spec.summary }, stage), h('div.dg-side', count, cap, h('div.dg-ctrl', back, next), dots)),
      h('details.dg-textv', h('summary', 'Text version of all steps'), h('ol', spec.steps.map((st) => h('li', { html: md(st.cap) })))));
    function go(i) {
      k = Math.max(0, Math.min(n - 1, i));
      apply(stage, spec, k);
      count.textContent = `Step ${k + 1} of ${n}`;
      cap.innerHTML = md(spec.steps[k].cap);
      back.disabled = k === 0;
      next.innerHTML = '';
      if (k < n - 1) next.append('Next', BB.ui.icon('right')); else next.append(BB.ui.icon('reset'), 'Start again');
      dots.querySelectorAll('button').forEach((b, j) => { b.setAttribute('aria-current', j === k ? 'step' : 'false'); });
    }
    back.addEventListener('click', () => go(k - 1));
    next.addEventListener('click', () => go(k < n - 1 ? k + 1 : 0));
    fig.addEventListener('keydown', (e) => {
      if (e.target.closest('summary, a, input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(k + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(k - 1); }
    });
    go(opts.step || 0);
    // A part that scrolls sideways on a small screen must be reachable with the keyboard.
    requestAnimationFrame(() => fig.querySelectorAll('.dg-stage, .dg-table-wrap, .dg-code').forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1 && !el.hasAttribute('tabindex')) { el.setAttribute('tabindex', '0'); if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Scrollable part of the visual'); }
    }));
    return fig;
  }

  BB.diagrams = registry;
  BB.diagram = { define: (name, spec) => { registry[name] = Object.assign({ name }, spec); }, render, names: () => Object.keys(registry) };
  BB.widgets = BB.widgets || {};
  BB.widgets.diagram = (props = {}) => render(props.name, props);
})();
