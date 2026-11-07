/* Real Python in the browser (Pyodide, CPython compiled to WebAssembly), loaded only when a learner presses Run.
   Runs in a Web Worker so a runaway loop can be stopped. Loads the copy in vendor/pyodide when the site is served over
   http(s); otherwise (or if that copy is missing) it falls back to the jsDelivr CDN. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h } = BB;
  BB.widgets = BB.widgets || {};

  const CDN = 'https://cdn.jsdelivr.net/npm/pyodide@314.0.7/';
  const TIMEOUT_MS = 10000;
  /* The worker's code, turned into a Blob URL and started as a module worker (Pyodide 314 requires module workers). */
  function workerMain() {
    let py = null;
    const mkdirs = (FS, p) => { let cur = ''; for (const part of p.split('/').filter(Boolean)) { cur += '/' + part; try { FS.mkdir(cur); } catch (e) { /* exists */ } } };
    const cleanTraceback = (msg) => {
      const kept = [];
      let skip = false;
      for (const ln of String(msg).split('\n')) {
        if (/^\s*File "\/lib\//.test(ln)) { skip = true; continue; }
        if (/^\s*File "/.test(ln)) { skip = false; kept.push(ln.replace('"<exec>"', '"your_code.py"')); continue; }
        if (skip && /^\s{4,}/.test(ln)) continue;
        skip = false;
        kept.push(ln);
      }
      return kept.join('\n');
    };
    self.onmessage = async (e) => {
      const m = e.data;
      if (m.type === 'init') {
        try {
          const mod = await import(m.indexURL + 'pyodide.mjs');
          py = await mod.loadPyodide({ indexURL: m.indexURL });
          for (const [p, c] of m.files) { mkdirs(py.FS, p.slice(0, p.lastIndexOf('/'))); py.FS.writeFile(p, c); }
          py.FS.chdir(m.cwd);
          self.postMessage({ type: 'ready', version: py.version });
        } catch (err) { self.postMessage({ type: 'init-error', error: String((err && err.message) || err) }); }
        return;
      }
      if (m.type === 'run') {
        py.setStdout({ batched: (s) => self.postMessage({ type: 'out', text: s + '\n' }) });
        py.setStderr({ batched: (s) => self.postMessage({ type: 'err', text: s + '\n' }) });
        try {
          py.runPython('import os\nos.chdir(' + JSON.stringify(m.cwd) + ')\nfor _k in [k for k in list(globals()) if not k.startswith("_") and k != "os"]:\n    del globals()[_k]');
          await py.runPythonAsync(m.code);
          self.postMessage({ type: 'done' });
        } catch (err) { self.postMessage({ type: 'pyerror', text: cleanTraceback((err && err.message) || err) }); }
      }
    };
  }
  const WORKER_SRC = '(' + workerMain.toString() + ')();';

  let worker = null, ready = null, busy = false, version = '';
  const files = () => Object.entries(BB.vfs.files).filter(([p]) => p.startsWith('/home/student')).map(([p, f]) => [p, f.c]);
  const CWD = '/home/student/project/data';

  function indexCandidates() {
    const list = [];
    if (/^https?:$/.test(location.protocol)) list.push(new URL('vendor/pyodide/', location.href).href);
    list.push(CDN);
    return list;
  }
  function startWorker(onStatus) {
    if (ready) return ready;
    ready = new Promise((resolve, reject) => {
      const candidates = indexCandidates();
      const tryNext = (k) => {
        if (k >= candidates.length) { ready = null; reject(new Error(location.protocol === 'file:' ? 'Python could not be loaded. When BioBridge is opened as a file, Python has to be downloaded (about 13 MB), so check your internet connection. To run Python offline, serve the folder instead: run python3 -m http.server in the BioBridge folder and open http://localhost:8000.' : 'Python could not be loaded. Check your internet connection (the first run downloads about 13 MB), then try again.')); return; }
        let w;
        try { w = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' })), { type: 'module' }); }
        catch (e) { ready = null; reject(new Error('This browser blocked the Python worker. Try opening BioBridge from a web address (for example GitHub Pages) instead of a local file.')); return; }
        onStatus(k === 0 ? 'Loading Python (first time only, about 13 MB)...' : 'Trying the online copy of Python...');
        w.onmessage = (e) => {
          if (e.data.type === 'ready') { worker = w; version = e.data.version; w.onmessage = null; resolve(w); }
          else if (e.data.type === 'init-error') { console.warn('Python could not load from ' + candidates[k] + ': ' + e.data.error); w.terminate(); tryNext(k + 1); }
        };
        w.onerror = (ev) => { console.warn('Python worker error for ' + candidates[k] + ': ' + (ev && ev.message)); w.terminate(); tryNext(k + 1); };
        w.postMessage({ type: 'init', indexURL: candidates[k], files: files(), cwd: CWD });
      };
      tryNext(0);
    });
    return ready;
  }
  function run(code, { onOut, onErr, onStatus }) {
    return new Promise(async (resolve) => {
      if (busy) { onStatus('Already running a program.'); return resolve(false); }
      busy = true;
      let w;
      try { w = await startWorker(onStatus); }
      catch (e) { busy = false; onErr(e.message + '\n'); onStatus('Python unavailable'); return resolve(false); }
      onStatus('Running...');
      const timer = setTimeout(() => {
        w.terminate(); worker = null; ready = null; busy = false;
        onErr(`\nStopped: the program ran for more than ${TIMEOUT_MS / 1000} seconds. Check for a loop that never ends.\n`);
        onStatus('Stopped');
        resolve(false);
      }, TIMEOUT_MS);
      w.onmessage = (e) => {
        const m = e.data;
        if (m.type === 'out') onOut(m.text);
        else if (m.type === 'err') onErr(m.text);
        else if (m.type === 'pyerror') { clearTimeout(timer); busy = false; onErr(m.text.endsWith('\n') ? m.text : m.text + '\n'); onStatus('Finished with an error (read the last line first)'); resolve(true); }
        else if (m.type === 'done') { clearTimeout(timer); busy = false; onStatus('Finished' + (version ? ` (Python via Pyodide ${version})` : '')); resolve(true); }
      };
      w.postMessage({ type: 'run', code, cwd: CWD });
    });
  }

  function editor(code, opts = {}) {
    const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', 'aria-label': 'Python code editor', style: { fontFamily: 'var(--mono)', fontSize: '16px', minHeight: (opts.rows || 9) * 1.6 + 'em', tabSize: 4 } });
    ta.value = code || '';
    const out = h('div.output-block', { style: { marginTop: '8px', borderRadius: '12px', minHeight: '3em' }, 'aria-live': 'polite' });
    const status = h('span.small.muted', { 'aria-live': 'polite' }, 'Ready. Press Run to execute this code with real Python.');
    const runBtn = h('button.btn.btn-primary', { type: 'button' }, BB.ui.icon('play'), 'Run');
    const resetBtn = h('button.btn.btn-sm', { type: 'button', onclick: () => { ta.value = code || ''; out.textContent = ''; } }, 'Reset code');
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey && !ta.dataset.escaped) { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); }
      if (e.key === 'Escape') { ta.dataset.escaped = '1'; setTimeout(() => delete ta.dataset.escaped, 1500); }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runBtn.click(); }
    });
    runBtn.addEventListener('click', async () => {
      out.textContent = '';
      runBtn.disabled = true;
      const add = (t, err) => { const s = document.createElement('span'); if (err) s.style.color = 'var(--red)'; s.textContent = t; out.append(s); };
      await run(ta.value, { onOut: (t) => add(t), onErr: (t) => add(t, true), onStatus: (t) => (status.textContent = t) });
      runBtn.disabled = false;
      if (!out.textContent) out.append(h('span.muted', '(the program printed nothing)'));
    });
    return h('div', ta, h('div.btn-row', { style: { marginTop: '8px' } }, runBtn, resetBtn, status), out,
      h('p.widget-note', 'Real Python 3 (CPython compiled to WebAssembly by the Pyodide project) running inside your browser. The practice files (counts.tsv, samples.tsv, ...) are available in the working folder. Tab inserts spaces; press Esc then Tab to move on; Ctrl+Enter runs. pandas and NumPy are not loaded here.'));
  }

  function open(code) {
    BB.ui.modal({ title: 'Run real Python', wide: true, body: editor(code, { rows: Math.min(18, Math.max(8, String(code || '').split('\n').length + 2)) }) });
  }

  BB.widgets.pyrun = (props = {}) => h('div.widget', { 'data-widget': 'pyrun' },
    h('div.widget-head', h('div', h('div.eyebrow', 'Let me try'), h('h3', props.title || 'Edit and run real Python')), h('span.chip.green', 'Real Python')),
    props.intro ? h('p.small', { html: BB.md(props.intro) }) : null,
    editor(props.code || 'print("Hello, BioBridge")', { rows: props.rows }));
  BB.pyrun = { open, run, editor };
})();
