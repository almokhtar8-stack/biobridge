/* Lesson activities: predict, parsons (order the lines), debug (diagnose a real error), methods (choose the right method). */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  BB.widgets = BB.widgets || {};
  BB.activities = {};

  BB.activities.predict = function (t) {
    return h('div.widget', { 'data-widget': 'predict' }, h('div.widget-head', h('div', h('div.eyebrow', 'Predict first'), h('h3', 'What do you think?'))), BB.ui.mcq(t, { retry: true }));
  };

  BB.activities.parsons = function (t) {
    const correct = t.lines.slice();
    let order = BB.shuffle(correct.map((_, i) => i));
    if (order.every((v, i) => v === i)) order = order.slice().reverse();
    const list = h('div.parsons', { role: 'list', 'aria-label': 'Lines to put in order' });
    const fb = h('div', { 'aria-live': 'polite' });
    let checked = false;
    function draw(focusIdx) {
      list.innerHTML = '';
      order.forEach((li, pos) => {
        const up = h('button', { type: 'button', 'aria-label': `Move line up: ${correct[li].trim()}`, disabled: pos === 0, onclick: () => move(pos, -1) }, BB.ui.icon('up'));
        const down = h('button', { type: 'button', 'aria-label': `Move line down: ${correct[li].trim()}`, disabled: pos === order.length - 1, onclick: () => move(pos, 1) }, BB.ui.icon('down'));
        list.append(h('div.p-line' + (checked ? (li === pos ? '.ok' : '.no') : ''), { role: 'listitem' }, h('code', correct[li] || ' '), h('span.moves', up, down)));
      });
      if (focusIdx != null) { const btns = list.querySelectorAll('.p-line')[focusIdx]; if (btns) (btns.querySelector('button:not([disabled])') || btns).focus(); }
    }
    function move(pos, d) { const np = pos + d; [order[pos], order[np]] = [order[np], order[pos]]; checked = false; fb.innerHTML = ''; draw(np); }
    function check() {
      checked = true;
      const ok = order.every((li, pos) => li === pos);
      draw();
      fb.innerHTML = '';
      const wrongCount = order.filter((li, pos) => li !== pos).length;
      fb.append(h('div.feedback.' + (ok ? 'good' : 'bad'), ok ? h('strong.lead', 'Correct order.') : h('strong.lead', `${wrongCount} line${wrongCount === 1 ? ' is' : 's are'} in the wrong place (outlined in red).`),
        h('div', { html: md(ok ? (t.explain || '') : (t.hintWrong || 'Think about what each line needs to exist before it runs: a variable must be created before it is used, and indented lines belong under the line that opens their block.')) }),
        ok && t.output != null ? h('div', { style: { marginTop: '8px' } }, h('div.small.muted', 'This program prints:'), h('pre.output-block', { style: { margin: '6px 0 0', borderRadius: '10px' } }, t.output)) : null));
      if (ok && t.lang === 'python' && BB.pyrun) fb.append(h('div.btn-row', { style: { marginTop: '8px' } }, h('button.btn.btn-sm.btn-ghost', { type: 'button', onclick: () => BB.pyrun.open(correct.join('\n')) }, BB.ui.icon('play'), 'Run it with real Python')));
    }
    draw();
    return h('div.widget', { 'data-widget': 'parsons' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Build it'), h('h3', 'Put the lines in the right order')), h('span.chip', { 'aria-hidden': 'true' }, { python: 'Python', r: 'R', bash: 'Bash', text: 'Steps' }[t.lang] || 'Code')),
      h('p.small', { html: md(t.prompt) }), list,
      h('div.btn-row', { style: { marginTop: '10px' } }, h('button.btn.btn-primary.btn-sm', { type: 'button', onclick: check }, 'Check order'), h('button.btn.btn-sm', { type: 'button', onclick: () => { order = BB.shuffle(order); checked = false; fb.innerHTML = ''; draw(); } }, 'Shuffle again')),
      fb);
  };

  BB.activities.debug = function (t) {
    const q = { q: t.prompt || 'This program crashes. What is the real cause?', options: t.options, answer: t.answer };
    const after = h('div');
    const card = BB.ui.mcq(q, { retry: true, onAnswer: (ok) => {
      if (!ok) return;
      after.innerHTML = '';
      after.append(h('div.eyebrow', { style: { marginTop: '12px' } }, 'The fix'), BB.ui.codeBlock({ lang: t.lang || 'python', code: t.fixed, output: t.fixedOutput, run: (t.lang || 'python') === 'python' }));
    } });
    return h('div.widget', { 'data-widget': 'debug' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Debug it'), h('h3', 'Read the error, find the cause')), h('span.chip.green', 'Real Python error')),
      BB.ui.codeBlock({ lang: t.lang || 'python', code: t.code }),
      h('div.code-block', { style: { marginTop: '8px', background: '#3a1d22' } }, h('div.code-label', h('span', 'Error message')), h('pre', h('code', t.error))),
      h('div', { style: { marginTop: '12px' } }, card), after,
      h('p.widget-note', 'Read error messages from the bottom: the last line names the problem, the line number tells you where Python noticed it.'));
  };

  BB.widgets.methods = function () {
    const list = BB.scenarios || [];
    let i = 0, right = 0;
    const box = h('div');
    const progress = h('div.small.muted');
    function draw() {
      box.innerHTML = '';
      progress.textContent = list.length ? `Scenario ${Math.min(i + 1, list.length)} of ${list.length}` : '';
      if (!list.length) { box.append(h('p.muted', 'Scenarios are not available.')); return; }
      if (i >= list.length) {
        box.append(h('div.callout.good', h('strong', `Finished: ${right} of ${list.length} right on the first try.`), h('span', 'Choosing a method starts from the question: what exactly do you need to measure, in which cells, and how will you know the answer is real?')), h('div.btn-row', { style: { marginTop: '10px' } }, h('button.btn.btn-sm', { type: 'button', onclick: () => { i = 0; right = 0; draw(); } }, 'Start again')));
        BB.markLab('methods');
        return;
      }
      const s = list[i];
      let first = true;
      const card = BB.ui.mcq(s, { retry: true, onAnswer: (ok) => {
        if (ok && first) right++;
        first = false;
        if (ok) nextBtn.hidden = false;
      } });
      const nextBtn = h('button.btn.btn-primary.btn-sm', { type: 'button', hidden: true, onclick: () => { i++; draw(); } }, i + 1 < list.length ? 'Next scenario' : 'See my result', BB.ui.icon('right'));
      box.append(s.context ? h('p.small', { html: md(s.context) }) : null, card, h('div.btn-row', { style: { marginTop: '10px' } }, nextBtn));
    }
    draw();
    return h('div.widget', { 'data-widget': 'methods' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Scenarios'), h('h3', 'Choose the right method')), progress), box);
  };
})();
