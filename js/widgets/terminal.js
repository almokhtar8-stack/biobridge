/* Terminal widget: an interactive front end for BB.Shell with guided missions. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md, esc } = BB;
  BB.widgets = BB.widgets || {};

  function isSubsequence(want, have) { let i = 0; for (const x of have) if (x === want[i]) i++; return i === want.length; }
  function checkStep(check, res, sh, line) {
    if (check.any) return check.any.some((c) => checkStep(c, res, sh, line));
    if (!check.allowFail && res.status !== 0) return false;
    const names = res.ran.filter((r) => r.name).map((r) => r.name);
    if (check.cmd && ![].concat(check.cmd).every((c) => names.includes(c))) return false;
    if (check.pipeline && !res.ran.filter((r) => r.pipeline).some((r) => isSubsequence(check.pipeline, r.pipeline))) return false;
    if (check.args && !new RegExp(check.args).test(line)) return false;
    const out = res.chunks.filter((c) => c.cls !== 'sys').map((c) => c.s).join('');
    if (check.outputIncludes && !out.includes(check.outputIncludes)) return false;
    if (check.outputEquals != null && out.trim() !== String(check.outputEquals).trim()) return false;
    if (check.outputRegex && !new RegExp(check.outputRegex, 'm').test(out)) return false;
    if (check.cwd && sh.cwd !== check.cwd) return false;
    if (check.exists && !sh.node(check.exists)) return false;
    if (check.notExists && sh.node(check.notExists)) return false;
    if (check.fileIncludes) { const n = sh.node(check.fileIncludes.path); if (!n || n.type !== 'file' || !n.content.includes(check.fileIncludes.text)) return false; }
    if (check.executable) { const n = sh.node(check.executable); if (!n || !(n.mode & 0o100)) return false; }
    return true;
  }
  BB.checkMissionStep = checkStep;

  function charWidth(el) {
    const probe = h('span', { style: { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre', font: getComputedStyle(el).font } }, 'M'.repeat(50));
    document.body.append(probe);
    const w = probe.getBoundingClientRect().width / 50;
    probe.remove();
    return w || 8;
  }

  function terminal(props = {}, ctx = {}) {
    const mission = props.mission ? BB.missions[props.mission] : null;
    let sh = new BB.Shell(BB.vfs);
    if (mission && mission.start) sh.cwd = mission.start;
    else if (props.start) sh.cwd = props.start;
    let histIdx = null, stepIdx = 0, hintShown = false, solutionShown = false, attempts = 0;
    const warned = new Set();
    const watched = Object.keys(BB.vfs.files).filter((p) => p.includes('/project/data/') || p.includes('/project/scripts/'));

    const screen = h('div.term-screen', { role: 'log', 'aria-live': 'polite', 'aria-label': 'Terminal output', tabindex: '0' });
    const promptEl = h('span.p');
    const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', placeholder: 'type a command here', 'aria-label': 'Type a command and press Enter', enterkeyhint: 'send' });
    const form = h('form.term-input', promptEl, input, h('button', { type: 'submit' }, 'Run'));
    const resetBtn = h('button', { type: 'button', title: 'Restore the original files and start again' }, 'Reset');
    const bar = h('div.term-bar', h('span.dots', h('i'), h('i'), h('i')), h('span.title', 'Practice terminal (simulated Bash, nothing runs on your device)'), resetBtn);
    const keys = h('div.term-keys', { 'aria-label': 'Helper keys' },
      ['Tab', 'Up', 'Down', '|', '>', '~', '/', '-', '"', '*', 'Clear line'].map((k) => h('button', { type: 'button', 'data-k': k, 'aria-label': k === 'Up' ? 'Previous command' : k === 'Down' ? 'Next command' : k === 'Tab' ? 'Complete name' : k }, k === 'Up' ? '↑' : k === 'Down' ? '↓' : k)));
    const term = h('div.terminal', bar, screen, form, keys);

    const missionPanel = h('div');
    const warnBox = h('div', { 'aria-live': 'polite' });
    const wrap = h('div.widget', { 'data-widget': 'terminal' });
    if (mission) {
      wrap.append(h('div.widget-head', h('div', h('div.eyebrow', 'Terminal mission'), h('h3', mission.title)), h('span.sim-label', 'Simulation')),
        h('p.small', { html: md(mission.intro) }),
        h('div.split', term, h('div', missionPanel, warnBox)));
    } else {
      // props.tries and props.task let a Companion topic suggest its own commands.
      const tries = props.tries || ['ls', 'cd project', 'cd data', 'head -3 counts.tsv', 'grep HSP counts.tsv', 'wc -l *.tsv', 'help'];
      wrap.append(h('div.widget-head', h('div', h('div.eyebrow', props.eyebrow || 'Free practice'), h('h3', props.title || 'Explore the practice project')), h('span.sim-label', 'Simulation')),
        props.task ? h('p.small', { html: md(props.task) }) : null,
        term, warnBox,
        h('p.widget-note', props.tries ? 'Tap a command to put it in the terminal, then press Run: ' : 'Try: ', tries.map((c) => h('button.btn.btn-sm.btn-quiet.term-try', { type: 'button', onclick: () => { input.value = c; input.focus(); } }, c))));
    }
    wrap.append(h('p.widget-note', 'This is a teaching simulation of a Linux shell running on pretend files. It supports a defined set of commands (type help), formats output like GNU tools, and resets to the original files with Reset. It is not a full Bash environment.'));

    function print(text, cls) {
      if (!text) return;
      const span = document.createElement('span');
      if (cls) span.className = cls;
      span.textContent = text;
      screen.append(span);
    }
    function scroll() { screen.scrollTop = screen.scrollHeight; }
    function setPrompt() { promptEl.textContent = sh.prompt(); }
    function welcome() {
      screen.innerHTML = '';
      print('BioBridge practice server. Type help for commands. Files reset with Reset.\n', 'sys');
      setPrompt();
    }
    function sizeColumns() { const cw = charWidth(screen); const width = screen.clientWidth - 28; sh.columns = Math.max(20, Math.min(120, Math.floor(width / cw))); }

    function drawMission() {
      if (!mission) return;
      missionPanel.innerHTML = '';
      const done = stepIdx >= mission.steps.length;
      const list = h('ol.list-plain', { 'aria-label': 'Mission steps' });
      mission.steps.forEach((s, i) => {
        const cls = i < stepIdx ? '.done' : i === stepIdx ? '.current' : '';
        const li = h('li.mission-step' + cls,
          h('span.dot', { 'aria-hidden': 'true' }, i < stepIdx ? '✓' : String(i + 1)),
          h('div', h('div.goal', { html: md(s.goal) }), i < stepIdx && s.explain ? h('div.explain', { html: md(s.explain) }) : null,
            i === stepIdx ? h('div.btn-row', { style: { marginTop: '8px' } },
              !hintShown ? h('button.btn.btn-sm', { type: 'button', onclick: () => { hintShown = true; drawMission(); } }, 'Show a hint') : h('div.callout.info.small', { style: { width: '100%' } }, h('strong', 'Hint'), h('span', { html: md(s.hint) })),
              hintShown && s.solution && !solutionShown ? h('button.btn.btn-sm.btn-quiet', { type: 'button', onclick: () => { solutionShown = true; drawMission(); } }, 'Show the command') : null,
              solutionShown && s.solution ? h('div.callout.small', { style: { width: '100%' } }, h('strong', 'One command that works'), h('code.inline', s.solution), ' ', h('button.btn.btn-sm.btn-quiet', { type: 'button', onclick: () => { input.value = s.solution; input.focus(); } }, 'Put it in the terminal')) : null) : null));
        list.append(li);
      });
      missionPanel.append(h('div.eyebrow', `Step ${Math.min(stepIdx + 1, mission.steps.length)} of ${mission.steps.length}`), list);
      if (done) {
        missionPanel.append(h('div.callout.good', { style: { marginTop: '10px' } }, h('strong', 'Mission complete'), h('span', { html: md(mission.done || 'Well done.') })));
        const st = BB.store.state;
        if (!st.missions[props.mission]) { st.missions[props.mission] = { done: Date.now() }; BB.store.saveSoon(); BB.emit('progress'); }
      }
    }

    function checkDamage() {
      for (const p of watched) {
        if (warned.has(p)) continue;
        const n = sh.node(p);
        if (!n || (n.type === 'file' && !n.content && BB.vfs.files[p].c)) {
          warned.add(p);
          warnBox.append(h('div.callout.warn', { style: { marginTop: '10px' } }, h('strong', n ? `${p.split('/').pop()} is now empty` : `${p.split('/').pop()} was deleted`),
            h('span', n ? 'A command overwrote this file. A common cause is an unquoted > (for example grep -c > file) or redirecting a command into the same file it reads (sort file > file). On a real server the data would be gone. ' : 'On a real server there is no recycle bin, so it would be gone. '),
            h('button.btn.btn-sm', { type: 'button', onclick: reset }, 'Restore original files')));
        }
      }
    }

    function run(line) {
      print(sh.prompt() + ' ', 'p');
      print(line + '\n');
      const res = sh.run(line);
      for (const c of res.chunks) print(c.s, c.cls === 'out' ? '' : c.cls);
      if (res.clear) screen.innerHTML = '';
      setPrompt();
      scroll();
      if (res.edit) openEditor(res.edit);
      checkDamage();
      if (mission && stepIdx < mission.steps.length) {
        attempts++;
        const step = mission.steps[stepIdx];
        if (checkStep(step.check, res, sh, line)) {
          stepIdx++; hintShown = false; solutionShown = false; attempts = 0;
          print('✓ Step complete\n', 'ok');
          scroll();
          drawMission();
        } else if (attempts === 3 && !hintShown) { hintShown = true; drawMission(); }
      }
    }

    function openEditor(req) {
      const step = mission && stepIdx < mission.steps.length ? mission.steps[stepIdx] : null;
      const exampleText = step && step.editorAppend ? step.editorAppend : null;
      const ta = h('textarea', { 'aria-label': 'File contents', spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off' });
      ta.value = req.content;
      const overlay = h('div.editor-overlay', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Editor' },
        h('div.editor-box',
          h('div.bar', h('strong', req.crontab ? 'crontab -e' : `${req.editor}  ${req.shown}`), h('span', { style: { flex: 1 } }), h('span', 'Simplified editor')),
          ta,
          h('div.bar',
            h('button.btn.btn-sm.btn-primary', { type: 'button', onclick: () => close(true) }, 'Save and exit'),
            exampleText ? h('button.btn.btn-sm', { type: 'button', onclick: () => { ta.value = (ta.value && !ta.value.endsWith('\n') ? ta.value + '\n' : ta.value) + exampleText + '\n'; ta.focus(); } }, 'Insert the example text') : null,
            h('button.btn.btn-sm', { type: 'button', onclick: () => close(false) }, 'Exit without saving'),
            h('span', req.editor === 'nano' ? 'In real nano: Ctrl+O saves, Ctrl+X exits.' : req.crontab ? 'Format: minute hour day-of-month month day-of-week command' : 'In real Vim: Esc then :wq saves and quits.'))));
      function close(save) {
        if (save) {
          if (req.crontab) {
            const bad = ta.value.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#') && !/^(@(reboot|yearly|annually|monthly|weekly|daily|hourly)\s+\S|(\S+\s+){5}\S)/.test(l.trim()));
            if (bad.length) { print(`crontab: errors in crontab file, can't install.\n(BioBridge: each job line needs 5 time fields and a command, e.g. 0 2 * * * /home/student/project/scripts/backup.sh)\n`, 'err'); }
            else { sh.crontab = ta.value.endsWith('\n') ? ta.value : ta.value + '\n'; print('crontab: installing new crontab\n'); }
          } else {
            try { sh.writeFile(req.path, ta.value.endsWith('\n') || !ta.value ? ta.value : ta.value + '\n', false, req.editor); print(`[ Wrote ${ta.value.split('\n').filter((x, i, a) => i < a.length - 1 || x).length} lines to ${req.shown} ]\n`, 'sys'); }
            catch (e) { print(e.message + '\n', 'err'); }
          }
        }
        overlay.remove();
        scroll();
        input.focus();
        if (mission && stepIdx < mission.steps.length && checkStep(mission.steps[stepIdx].check, { status: 0, ran: [{ name: req.editor }], chunks: [] }, sh, req.editor + ' ' + (req.shown || ''))) { stepIdx++; hintShown = false; solutionShown = false; drawMission(); }
      }
      overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(false); });
      document.body.append(overlay);
      ta.focus();
    }

    function complete() {
      const v = input.value;
      const caret = input.selectionStart == null ? v.length : input.selectionStart;
      const before = v.slice(0, caret);
      const m = /(\S*)$/.exec(before);
      const word = m[1];
      const isFirst = !before.slice(0, before.length - word.length).trim() || /[|;&]\s*$/.test(before.slice(0, before.length - word.length));
      let candidates = [];
      if (isFirst && !word.includes('/')) candidates = Object.keys(BB.shellInternals.COMMANDS).filter((c) => c.startsWith(word) && /^[a-z]/.test(c)).sort();
      else {
        const slash = word.lastIndexOf('/');
        const dirPart = slash >= 0 ? word.slice(0, slash + 1) : '';
        const rest = slash >= 0 ? word.slice(slash + 1) : word;
        const dir = sh.node(dirPart || '.');
        if (dir && dir.type === 'dir') candidates = Array.from(dir.children.keys()).filter((n) => n.startsWith(rest) && (rest.startsWith('.') || !n.startsWith('.'))).sort().map((n) => dirPart + n + (dir.children.get(n).type === 'dir' ? '/' : ''));
      }
      if (!candidates.length) return;
      let common = candidates[0];
      for (const c of candidates) while (!c.startsWith(common)) common = common.slice(0, -1);
      if (candidates.length === 1 && !common.endsWith('/')) common += ' ';
      if (common.length > word.length) { input.value = before.slice(0, before.length - word.length) + common + v.slice(caret); const pos = before.length - word.length + common.length; input.setSelectionRange(pos, pos); }
      else { print(sh.prompt() + ' ', 'p'); print(v + '\n'); print(candidates.map((c) => c.replace(/.*\/(?=.)/, '')).join('  ') + '\n'); scroll(); }
    }
    function histMove(d) {
      if (!sh.history.length) return;
      if (histIdx == null) histIdx = sh.history.length;
      histIdx = BB.clamp(histIdx + d, 0, sh.history.length);
      input.value = sh.history[histIdx] || '';
      input.setSelectionRange(input.value.length, input.value.length);
    }
    function reset() {
      const hist = sh.history;
      sh = new BB.Shell(BB.vfs);
      sh.history = hist;
      if (mission && mission.start) sh.cwd = mission.start; else if (props.start) sh.cwd = props.start;
      warned.clear(); warnBox.innerHTML = '';
      sizeColumns();
      welcome();
      print('(Files restored to their original state.)\n', 'sys');
    }

    form.addEventListener('submit', (e) => { e.preventDefault(); const line = input.value; input.value = ''; histIdx = null; run(line); input.focus(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); complete(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); histMove(-1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); histMove(1); }
      else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); screen.innerHTML = ''; }
      else if (e.key === 'c' && e.ctrlKey && !window.getSelection().toString()) { e.preventDefault(); print(sh.prompt() + ' ' + input.value + '^C\n', 'p'); input.value = ''; scroll(); }
    });
    keys.addEventListener('click', (e) => {
      const k = e.target.closest('button'); if (!k) return;
      const key = k.dataset.k;
      if (key === 'Tab') complete();
      else if (key === 'Up') histMove(-1);
      else if (key === 'Down') histMove(1);
      else if (key === 'Clear line') input.value = '';
      else { const pos = input.selectionStart == null ? input.value.length : input.selectionStart; input.value = input.value.slice(0, pos) + key + input.value.slice(pos); input.setSelectionRange(pos + 1, pos + 1); }
      input.focus();
    });
    resetBtn.addEventListener('click', reset);
    screen.addEventListener('click', () => { if (!window.getSelection().toString()) input.focus({ preventScroll: true }); });
    welcome();
    drawMission();
    requestAnimationFrame(() => { sizeColumns(); setPrompt(); });
    if (window.ResizeObserver) new ResizeObserver(BB.debounce(sizeColumns, 150)).observe(screen);
    return wrap;
  }

  BB.widgets.terminal = terminal;
})();
