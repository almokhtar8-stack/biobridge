/* Practice files page: preview, download (single files or the whole project as a ZIP), and two clearly
   separated routes: the browser simulation, or the student's own computer. Data: content/practice-files.js. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  const PROJECT = '/home/student/project/';

  const fileText = (rel) => { const f = BB.vfs.files[PROJECT + rel]; return f ? f.c : ''; };
  const lines = (s) => s.replace(/\n$/, '').split('\n');
  const bytes = (s) => new TextEncoder().encode(s).length;
  function download(rel) {
    const blob = new Blob([fileText(rel)], { type: 'text/plain;charset=utf-8' });
    const a = h('a', { href: URL.createObjectURL(blob), download: rel.split('/').pop() });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function preview(rel) {
    const text = fileText(rel);
    const L = lines(text);
    if (/\.tsv$/.test(rel)) {
      const rows = L.map((l) => l.split('\t'));
      const table = (n) => h('div.table-scroll', { tabindex: '0', role: 'region', 'aria-label': 'Preview of ' + rel + (n < rows.length ? ', first rows' : ', all rows') }, h('table.data.compact', h('thead', h('tr', rows[0].map((c) => h('th', { scope: 'col' }, c)))), h('tbody', rows.slice(1, n).map((r) => h('tr', r.map((c, j) => h(j ? 'td' : 'th', j ? { class: /^-?\d+(\.\d+)?$/.test(c) ? 'num' : null } : { scope: 'row' }, c)))))));
      return rows.length > 7
        ? h('div', table(7), h('details.deeper.small', { style: { marginTop: '8px' } }, h('summary', `Show all ${rows.length - 1} rows`), table(rows.length)))
        : table(rows.length);
    }
    const pre = (n) => h('pre.file-pre', { tabindex: '0', 'aria-label': 'Preview of ' + rel + (n < L.length ? ', first lines' : ', all lines') }, L.slice(0, n).join('\n'));
    return L.length > 10 ? h('div', pre(8), h('details.deeper.small', { style: { marginTop: '8px' } }, h('summary', `Show all ${L.length} lines`), pre(L.length))) : pre(L.length);
  }

  function fileCard(f) {
    const text = f.dir ? '' : fileText(f.path);
    const exec = f.path.endsWith('.sh') ? ((BB.vfs.files[PROJECT + f.path] || {}).mode === '755' ? 'executable' : 'not executable yet') : null;
    return h('article.card.file-card', { id: 'file-' + f.path.replace(/[^a-z0-9]+/gi, '-') },
      h('div.row.between', h('h3.file-name', f.path), h('span.chip' + (f.dir ? '.blue' : ''), f.kind)),
      f.dir ? h('p.small.muted', 'Empty folder') : h('p.small.muted', `${lines(text).length} lines \u00b7 ${bytes(text).toLocaleString('en-US')} bytes` + (exec ? ` \u00b7 ${exec}` : '')),
      h('p.file-what', { html: md(f.what) }),
      h('details.deeper.file-more', h('summary', f.dir ? 'Why it exists and how to use it' : 'Preview, why it exists and how to use it'),
        f.dir ? null : preview(f.path),
        h('dl.file-facts', h('dt', 'Why it exists'), h('dd', { html: md(f.why) }), h('dt', 'How you use it'), h('dd', { html: md(f.how) }))),
      f.dir ? null : h('div.btn-row', { style: { marginTop: '10px' } }, h('button.btn.btn-sm', { type: 'button', onclick: () => download(f.path) }, BB.ui.icon('download'), 'Download this file')));
  }

  function cmdBlock(c, i) {
    return h('li.cmd-item', h('div.cmd-head', h('span.cmd-n', String(i + 1)), h('code.cmd-line', '$ ' + c.cmd), h('button.btn.btn-sm.btn-quiet', { type: 'button', 'aria-label': 'Copy command ' + (i + 1), onclick: () => BB.ui.copyText(c.cmd) }, BB.ui.icon('copy'))),
      c.out ? h('pre.output-block.plain', BB.expandTabs(c.out)) : h('p.small.muted.no-out', 'No output: the command worked silently.'),
      h('p.small', { html: md(c.note) }));
  }

  const OS = {
    mac: ['macOS', [
      'Download the ZIP. Safari may unzip it for you into a **biobridge-practice** folder in Downloads; otherwise double-click the ZIP in Finder.',
      'Open the Terminal app: press Cmd+Space, type Terminal, press Enter.',
      'Go into the folder: `cd ~/Downloads/biobridge-practice`',
      'Check that you are in the right place: `ls` should print `README.txt  data  results  scripts`.',
      'macOS Terminal uses the zsh shell. Every command on this page works there too; a few outputs are spaced differently and some error messages are worded differently.']],
    linux: ['Linux', [
      'Download the ZIP into your Downloads folder.',
      'Open a terminal and go to Downloads: `cd ~/Downloads`',
      'Extract it: `unzip biobridge-practice.zip` (if unzip is missing: `sudo apt install unzip`).',
      'Go into the folder: `cd biobridge-practice`, then check with `ls`.']],
    windows: ['Windows', [
      '**Option A, WSL (a real Linux inside Windows, recommended):** once, open PowerShell as administrator, run `wsl --install`, restart, then open the Ubuntu app.',
      'In Ubuntu, go to your Windows Downloads folder: `cd /mnt/c/Users/YOUR-NAME/Downloads` (replace YOUR-NAME with your Windows user name), then `unzip biobridge-practice.zip` and `cd biobridge-practice`.',
      '**Option B, Git Bash (lighter):** install Git for Windows, right-click the ZIP and choose Extract All, open the extracted biobridge-practice folder, right-click inside it and choose Open Git Bash here (on Windows 11, Show more options first).',
      'Check with `ls`: you should see README.txt, data, results and scripts. If you see only another biobridge-practice folder, `cd biobridge-practice` once more.']]
  };

  function page() {
    const P = BB.practiceFiles;
    let osKey = /Mac/i.test(navigator.platform || navigator.userAgent) ? 'mac' : /Win/i.test(navigator.platform || navigator.userAgent) ? 'windows' : 'linux';
    const osBody = h('div', { 'aria-live': 'polite' });
    const osTabs = h('div.tabs', { role: 'tablist', 'aria-label': 'Your operating system' });
    const drawOS = () => {
      osTabs.innerHTML = '';
      Object.entries(OS).forEach(([k, [label]]) => osTabs.append(h('button.tab', { type: 'button', role: 'tab', 'aria-selected': String(k === osKey), onclick: () => { osKey = k; drawOS(); } }, label)));
      osBody.innerHTML = '';
      osBody.append(h('ol.os-steps', OS[osKey][1].map((s) => h('li', { html: md(s) }))));
    };
    drawOS();
    const termHolder = h('div');
    const termBtn = h('button.btn.btn-primary', { type: 'button', onclick: () => {
      if (!termHolder.childElementCount) termHolder.append(BB.widgets.terminal({ start: '/home/student/project', eyebrow: 'Browser route', title: 'Practice terminal in ~/project', tries: ['ls', 'ls data', 'head -3 data/counts.tsv', 'bash scripts/count_seqs.sh data/sequences.fa'] }));
      termBtn.hidden = true;
      const i = termHolder.querySelector('input'); if (i) i.focus();
    } }, BB.ui.icon('terminal'), 'Open the browser terminal here');
    const groups = [...new Set(P.commands.map((c) => c.group))];
    let n = 0;
    return h('div.files-page',
      h('div.page-head', h('div.eyebrow', 'Practice files'), h('h1', 'Download the heat-shock practice project'),
        h('p', 'A tiny, simulated RNA-seq project: five data files, two scripts and a results folder. Use it to practice the commands, Python and R from your courses, in your browser or on your own computer.'),
        h('div.btn-row.center-row', h('a.btn.btn-primary', { href: P.zip, download: 'biobridge-practice.zip' }, BB.ui.icon('download'), 'Download all files (ZIP, about 4 KB)'), h('a.btn.btn-ghost', { href: '#/files#files-routes' }, 'How to use them'))),
      h('div.callout.info', h('strong', 'Simulated data, real biology'), 'The gene names and the direction of the heat-shock response are real (heat strongly switches on heat-shock protein genes such as HSPA1A). Every number is invented for teaching, so do not use these files as research data.'),
      h('section.section', h('h2', 'What is inside'), h('p.muted', 'The ZIP contains one folder, biobridge-practice. Preview any file below before downloading.'),
        h('pre.file-tree', { tabindex: '0', 'aria-label': 'Folder structure of biobridge-practice' }, 'biobridge-practice/\n├── README.txt\n├── data/\n│   ├── annotation.tsv\n│   ├── counts.tsv\n│   ├── reads.fastq\n│   ├── samples.tsv\n│   └── sequences.fa\n├── results/\n└── scripts/\n    ├── count_seqs.sh\n    └── line_report.sh'),
        h('div.grid-2.file-grid', P.files.map(fileCard))),
      h('section.section', { id: 'files-routes' }, h('h2', 'Two ways to practice'), h('p.muted', 'Choose one. They use the same files, and the commands below give the same output in both.'),
        h('div.grid-2.routes',
          h('div.card.route-card', h('div.eyebrow', 'Route 1'), h('h3', 'In the browser (nothing to install)'),
            h('p', 'BioBridge\'s practice terminal already contains these files, in the folder ', h('code.inline', '~/project'), '. It is a safe simulation of Bash: nothing runs on your device, and Reset restores the original files.'),
            h('div.callout.warn.small', h('strong', 'Important'), 'The browser terminal uses its own built-in copy. It cannot open files on your computer, including the ZIP you download, and changes you make there are not saved to your computer.'),
            h('div.btn-row', { style: { marginTop: '10px' } }, termBtn), termHolder),
          h('div.card.route-card', h('div.eyebrow', 'Route 2'), h('h3', 'On your own computer'),
            h('p', 'Download the ZIP, extract it and open a terminal (or RStudio, or Jupyter) inside the biobridge-practice folder. Choose your system:'),
            osTabs, osBody,
            h('details.deeper', { style: { marginTop: '10px' } }, h('summary', 'Use the files in R or Python'),
              h('p.small', 'Set the working folder to biobridge-practice (in RStudio: Session, Set Working Directory, Choose Directory). Then:'),
              BB.ui.codeBlock({ lang: 'r', code: P.rCode.code, output: P.rCode.out }),
              h('p.small', { style: { marginTop: '10px' } }, 'In Python with pandas (for example in Jupyter started from the folder):'),
              BB.ui.codeBlock({ lang: 'python', code: P.pyCode.code, output: P.pyCode.out }))))),
      h('section.section', h('h2', 'Tested commands and what you should see'),
        h('p.muted', 'Run them in order from inside the project folder (biobridge-practice on your computer, ~/project in the browser terminal). Every output here was checked in real Bash and in the browser terminal.'),
        groups.map((g, gi) => h('details.deeper.cmd-group', { open: gi === 0 }, h('summary', `${g} (${P.commands.filter((c) => c.group === g).length} commands)`), h('ol.cmd-list', P.commands.filter((c) => c.group === g).map((c) => cmdBlock(c, n++)))))),
      h('section.section', h('h2', 'Simple challenges'), h('p.muted', 'Optional. Each one needs one or two commands. Try first, then reveal a possible answer.'),
        h('div.stack', P.challenges.map((ch, i) => h('div.card.flat.challenge', h('div.eyebrow', 'Challenge ' + (i + 1)), h('p', { html: md(ch.task) }),
          h('details.deeper', h('summary', 'Hint'), h('p.small', { html: md(ch.hint) })),
          h('details.deeper', { style: { marginTop: '8px' } }, h('summary', 'A possible answer'), h('code.cmd-line', '$ ' + ch.cmd), h('pre.output-block.plain', BB.expandTabs(ch.out)), h('p.small', { html: md(ch.answer) })))))),
      h('section.section', h('h2', 'Troubleshooting'),
        h('div.stack', P.trouble.map((t) => h('details.deeper.trouble', h('summary', { html: md(t.q) }), h('p.small', { html: md(t.a) }))))),
      h('p.footer-note', 'The ZIP is built from exactly the same files as the browser terminal, so both routes agree. Your downloads and your browser progress stay on your device.'));
  }

  BB.filesPage = page;
})();
