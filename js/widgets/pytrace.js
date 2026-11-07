/* Python trace player: replays a program's real execution (recorded with CPython by tools/build_traces.py) line by line. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  BB.widgets = BB.widgets || {};

  function pytrace(props = {}) {
    const id = props.program;
    const prog = BB.pyPrograms[id];
    const tr = BB.pyTraces && BB.pyTraces[id];
    const wrap = h('div.widget', { 'data-widget': 'trace' });
    if (!prog || !tr) { wrap.append(h('p.muted', 'This trace is not available.')); return wrap; }
    const lines = prog.code.split('\n');
    const steps = tr.steps;
    const asks = new Map((tr.asks || []).map((a) => [a.step, a]));
    const answered = new Set();
    let i = 0;

    const codeEl = h('div.trace-code', { role: 'region', 'aria-label': 'Program code' });
    const framesEl = h('div.frames', { 'aria-live': 'polite' });
    const outEl = h('div.trace-out', { 'aria-label': 'Printed output' });
    const explainEl = h('div.trace-explain', { 'aria-live': 'polite' });
    const askEl = h('div');
    const pos = h('span.pos');
    const btn = (label, icon, fn, aria) => h('button.btn.btn-sm', { type: 'button', onclick: fn, 'aria-label': aria || label }, BB.ui.icon(icon), label);
    const first = btn('', 'prev', () => go(0), 'First step');
    const back = btn('Back', 'left', () => go(i - 1));
    const next = h('button.btn.btn-sm.btn-primary', { type: 'button', onclick: () => go(i + 1) }, 'Next step', BB.ui.icon('right'));
    const lastB = btn('', 'next', () => go(steps.length - 1), 'Last step');

    wrap.append(
      h('div.widget-head', h('div', h('div.eyebrow', 'Be the computer'), h('h3', prog.title)), h('span.chip.green', 'Recorded from real Python')),
      h('p.small.muted', 'Step through the program. The highlighted line is the next one Python will run. Watch the variables change and predict before you step.'),
      h('div.trace', h('div', codeEl, h('div.trace-controls', { style: { marginTop: '10px' } }, first, back, next, lastB, pos)),
        h('div.stack', h('div', h('div.eyebrow', 'Variables'), framesEl), h('div', h('div.eyebrow', 'Output'), outEl))),
      explainEl, askEl,
      h('div.btn-row', { style: { marginTop: '10px' } }, BB.pyrun ? h('button.btn.btn-sm.btn-ghost', { type: 'button', onclick: () => BB.pyrun.open(prog.code) }, BB.ui.icon('play'), 'Edit and run this code') : null));

    wrap.addEventListener('keydown', (e) => {
      if (e.target.closest('button.option, textarea, input')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    });

    function varsMap(step) { const m = new Map(); (step.s || []).forEach((f, k) => Object.entries(f.v).forEach(([n, v]) => m.set(k + ':' + n, v[1]))); return m; }

    function render() {
      const s = steps[i];
      const prevLine = i > 0 && steps[i - 1].e === 'line' ? steps[i - 1].l : null;
      codeEl.innerHTML = '';
      lines.forEach((text, k) => {
        const n = k + 1;
        const isNext = s.l === n && s.e === 'line';
        const isRet = s.l === n && s.e === 'return';
        codeEl.append(h('div.ln' + (isNext || isRet ? '.next' : n === prevLine ? '.prev' : ''), h('span.no', String(n)), h('span.mk', { 'aria-hidden': 'true' }, isNext ? '➜' : isRet ? '↵' : ''), h('span', text || ' ')));
      });
      const prev = i > 0 ? varsMap(steps[i - 1]) : new Map();
      framesEl.innerHTML = '';
      (s.s || []).forEach((f, k) => {
        const rows = Object.entries(f.v);
        const table = h('table', h('tbody', rows.length ? rows.map(([n, v]) => h('tr' + (prev.get(k + ':' + n) !== v[1] && i > 0 ? '.changed' : ''), h('td.n', n), h('td.v', v[1]), h('td.t', v[0]))) : h('tr', h('td.muted', { colspan: '3' }, 'no variables yet'))));
        framesEl.append(h('div.frame', h('div.frame-name', f.n), table));
      });
      outEl.textContent = s.o || '';
      if (!s.o) outEl.append(h('span.muted', 'nothing printed yet'));
      pos.textContent = `Step ${i + 1} of ${steps.length}`;
      if (s.e === 'end') explainEl.innerHTML = s.err ? `<strong>The program stopped with an error:</strong> <code class="inline">${BB.esc(s.err)}</code>` : '<strong>Finished.</strong> The program has run every line it needed to. Step back to review any moment.';
      else if (s.e === 'return') explainEl.innerHTML = `Function <code class="inline">${BB.esc(s.fn)}()</code> is finishing on line ${s.l} and hands back <code class="inline">${BB.esc(s.r)}</code> to the line that called it.`;
      else explainEl.innerHTML = `Python is about to run <strong>line ${s.l}</strong>: <code class="inline">${BB.esc((lines[s.l - 1] || '').trim())}</code>`;
      back.disabled = first.disabled = i === 0;
      const blocked = asks.has(i) && !answered.has(i);
      next.disabled = i >= steps.length - 1 || blocked;
      lastB.disabled = i >= steps.length - 1 || [...asks.keys()].some((k) => k >= i && !answered.has(k));
      askEl.innerHTML = '';
      if (asks.has(i)) {
        const a = asks.get(i);
        const q = { q: a.q, options: a.options.map((t, k) => ({ t, why: k === a.answer ? (a.why || 'This matches what Python does when it runs the line.') : 'Step forward to see what Python actually does, then compare it with your prediction.' })), answer: a.answer };
        const card = BB.ui.mcq(q, { mono: true, onAnswer: () => { answered.add(i); next.disabled = i >= steps.length - 1; lastB.disabled = false; } });
        askEl.append(h('div.callout.accent', { style: { marginTop: '10px' } }, h('strong', 'Predict before you step'), card));
        if (answered.has(i)) { card.querySelectorAll('.option').forEach((o) => (o.disabled = true)); }
      }
      if (i === steps.length - 1) { const st = BB.store.state; if (!st.traces[id]) { st.traces[id] = { done: Date.now() }; BB.store.saveSoon(); BB.emit('progress'); } }
    }
    function go(k) {
      k = BB.clamp(k, 0, steps.length - 1);
      for (let j = i; j < k; j++) if (asks.has(j) && !answered.has(j)) { k = j; break; }
      i = k;
      render();
    }
    render();
    return wrap;
  }
  BB.widgets.trace = pytrace;
})();
