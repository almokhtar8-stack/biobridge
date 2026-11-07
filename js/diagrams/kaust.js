/* KAUST "Fundamental Skills in Bioinformatics" diagrams: R, statistics, Python with pandas and NumPy, and bulk and
   single-cell RNA-seq. Original visuals for BioBridge. Numbers come from the simulated practice data (counts.tsv,
   samples.tsv and BB.data) or from small made-up examples that are labeled as such; every printed output was checked
   by running it in R or Python. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h } = BB;
  const def = BB.diagram.define;

  /* ---------- shared helpers ---------- */
  // Keep runs of spaces in SVG text (R pads its printed output with spaces).
  const pre = (el) => { el.setAttribute('style', 'white-space:pre'); return el; };
  // A keyed group holding a rect plus children, so texts inside take the box colors (code, navy, ...).
  const panel = (D, k, x, y, w, hh, cls, ...kids) => D.s('g', { k, cls: 'dg-box' + (cls ? ' ' + cls : '') }, D.s('rect', { x, y, width: w, height: hh, rx: 8 }), kids);
  // A dark code box whose lines are separate keyed texts, so steps can replace each line with `set`.
  const codeLines = (D, k, x, y, w, hh, lines, o = {}) => panel(D, k, x, y, w, hh, 'code',
    lines.map(([lk, txt], i) => pre(D.text(lk, x + 10, y + (o.top || 14) + i * (o.lh || 16), txt, { anchor: 'start', size: o.size || 12, mono: true }))));
  // Plain rect with inline theme-aware style (for bars, shading and backgrounds).
  const rect = (D, k, x, y, w, hh, style, rx) => D.s('rect', { k, x, y, width: w, height: hh, rx: rx || 0, style });
  // HTML code block whose spans are keyed (texts may contain square brackets, which D.code cannot key).
  const codeHTML = (parts) => h('pre.dg-code', parts.map((p) => typeof p === 'string' ? p : h('span.dg-span', { 'data-k': p[0] }, p[1])));
  // Single-cell practice data, read when a diagram is drawn.
  const SC = () => (BB.data && BB.data.single) || { genes: [], cells: [] };
  const fmt = (x, d) => Number(x).toFixed(d);

  /* ---------- 1. What R does ---------- */
  def('r-role', {
    title: 'What R does: data in, results out',
    summary: 'Data files such as count tables and lab measurements go into R, which runs statistics and draws plots with help from packages from CRAN and Bioconductor, and results come out as tables, figures and reports; the same code can be rerun.',
    build(D) {
      return D.svg(400, 282,
        D.text('lab-in', 155, 12, 'data in', { size: 11, cls: 'muted' }),
        D.box('d1', 40, 22, 108, 34, 'count tables', { cls: 'file', size: 12 }),
        D.box('d2', 162, 22, 108, 34, 'measurements', { cls: 'file', size: 12 }),
        D.g('in', D.arrow('', 94, 58, 128, 92), D.arrow('', 216, 58, 182, 92)),
        panel(D, 'rbox', 40, 94, 230, 94, 'navy', D.text('', 155, 114, 'R', { size: 20, weight: 800 }), D.text('', 155, 133, 'a language for data', { size: 11 })),
        D.box('c-stat', 46, 146, 70, 32, 'statistics', { size: 12 }),
        D.box('c-plot', 120, 146, 70, 32, 'plots', { size: 12 }),
        D.box('c-pkg', 194, 146, 70, 32, 'packages', { size: 12 }),
        D.g('repos',
          D.box('', 286, 94, 108, 42, 'CRAN\ngeneral', { cls: 'blue', size: 12 }),
          D.box('', 286, 146, 108, 42, 'Bioconductor\nbiology', { cls: 'green', size: 12 }),
          D.arrow('', 286, 115, 266, 152), D.arrow('', 286, 167, 266, 163)),
        D.g('out', D.arrow('', 155, 190, 155, 220)),
        D.g('res',
          D.box('', 40, 222, 72, 34, 'tables', { cls: 'gold', size: 12 }),
          D.box('', 117, 222, 76, 34, 'figures', { cls: 'gold', size: 12 }),
          D.box('', 198, 222, 72, 34, 'reports', { cls: 'gold', size: 12 }),
          D.text('', 155, 270, 'results out', { size: 11, cls: 'muted' })),
        D.arrow('rerun', 34, 236, 34, 42, { cls: 'dash', bend: -26 }));
    },
    steps: [
      { cap: 'Analysis starts with **data**: count tables from sequencing, or measurements from the lab, saved as files such as counts.tsv.', show: [], hi: ['d1', 'd2'] },
      { cap: '**R** is a free programming language built for data. You write instructions as code, and R runs them on your data to compute **statistics** and draw **plots**.', show: ['in', 'rbox', 'c-stat', 'c-plot'], hi: ['c-stat', 'c-plot'] },
      { cap: 'Thousands of free **packages** add new functions. **CRAN** is the main collection; **Bioconductor** specializes in biology, for example tools for RNA-seq data.', show: ['c-pkg', 'repos'], hi: ['c-pkg', 'repos'] },
      { cap: 'Results come out as **tables**, **figures** and **reports** that you can share.', show: ['out', 'res'], hi: ['res'] },
      { cap: 'The code is a written record of every step. Rerun it to check a result or to analyze new data the same way: that makes the analysis **reproducible**.', show: ['rerun'], hi: ['rerun'] }
    ]
  });

  /* ---------- 2. RStudio's four panes ---------- */
  def('rstudio-panes', {
    title: 'RStudio: four panes, four jobs',
    summary: 'A schematic of RStudio: Source pane with a script (top left), Console with results (bottom left), Environment and History (top right), and Files, Plots, Packages and Help (bottom right).',
    build(D) {
      // header bar drawn as a polygon so the pane highlight outlines only the pane itself
      const bar = (x, y, w) => D.s('polygon', { points: `${x + 2},${y + 2} ${x + w - 2},${y + 2} ${x + w - 2},${y + 22} ${x + 2},${y + 22}`, style: 'fill: var(--surface-3)' });
      const pane = (k, x, y, w, hh, title) => D.g(k, D.box('', x, y, w, hh, '', { cls: 'file' }), bar(x, y, w), title ? D.text('', x + 10, y + 12, title, { size: 12, weight: 700, anchor: 'start' }) : null);
      const mono = (k, x, y, t, o = {}) => pre(D.text(k, x, y, t, Object.assign({ size: 11, mono: true, anchor: 'start' }, o)));
      const bars = [12, 0, 7, 30];
      return D.svg(400, 300,
        pane('src', 6, 6, 216, 140, 'Source'), pane('con', 6, 154, 216, 140, 'Console'),
        pane('env', 230, 6, 164, 140, 'Environment'), pane('plt', 230, 154, 164, 140, ''),
        D.text('', 336, 18, 'History', { size: 11, cls: 'muted', anchor: 'start' }),
        D.text('', 240, 166, 'Files', { size: 11, anchor: 'start' }), D.text('tabplots', 274, 166, 'Plots', { size: 11, anchor: 'start' }),
        D.text('', 308, 166, 'Packages', { size: 11, anchor: 'start' }), D.text('', 362, 166, 'Help', { size: 11, anchor: 'start' }),
        D.g('curline', rect(D, '', 20, 54, 198, 17, 'fill: var(--dg-hi-fill); stroke: var(--dg-hi); stroke-width: 1.4', 4)),
        D.text('', 12, 44, '1', { size: 11, cls: 'muted' }), D.text('', 12, 62, '2', { size: 11, cls: 'muted' }), D.text('', 12, 80, '3', { size: 11, cls: 'muted' }),
        mono('', 24, 44, 'x <- c(12, 0, 7, 30)'), mono('', 24, 62, 'mean(x)'), mono('', 24, 80, 'barplot(x)'),
        D.text('', 14, 128, 'script.R (saved file)', { size: 11, cls: 'muted', anchor: 'start' }),
        D.g('con1', mono('', 14, 192, '> x <- c(12, 0, 7, 30)'), mono('', 14, 210, '> mean(x)'), mono('', 14, 228, '[1] 12.25', { weight: 700 })),
        D.g('con2', mono('', 14, 246, '> barplot(x)')),
        D.g('envx', D.text('', 240, 44, 'Values', { size: 11, cls: 'muted', anchor: 'start' }), mono('', 240, 64, 'x', { weight: 700 }), mono('', 256, 64, 'num [1:4] 12 0 7 30')),
        D.g('bars', D.line('', 252, 282, 386, 282, { cls: 'axis' }),
          bars.map((v, i) => rect(D, '', 262 + i * 30, 282 - v * 2.8, 20, Math.max(v * 2.8, 0.01), 'fill: var(--blue-soft); stroke: var(--blue); stroke-width: 1.2'))));
    },
    steps: [
      { cap: 'RStudio is a workspace around R. With a script open, the default layout has **four panes**, each with its own job.', show: [], hi: [] },
      { cap: 'Write code in the **Source** pane (top left): a script file you can save, reopen and rerun. Here it has three lines about a vector `x`.', hi: ['src'] },
      { cap: 'Put the cursor on a line and press **Ctrl+Enter** (Cmd+Enter on a Mac). The line runs in the **Console** (bottom left), and the result appears there: `mean(x)` is 12.25.', show: ['con1', 'curline'], hi: ['con', 'curline'] },
      { cap: 'Objects you create appear in the **Environment** pane (top right): `x` holds 4 numbers. Its **History** tab lists the commands you ran.', show: ['envx'], hi: ['env'] },
      { cap: 'Run `barplot(x)` and the plot appears in the bottom-right pane. Its other tabs show your **Files**, installed **Packages** and **Help** pages.', show: ['con2', 'bars'], move: { curline: [0, 18] }, hi: ['plt', 'curline', 'tabplots'] },
      { cap: 'You can resize the panes or rearrange them (Tools, Global Options, Pane Layout). The jobs stay the same: write in Source, run, read results in Console.', hi: ['src', 'con'] }
    ]
  });

  /* ---------- 3. A vector in R ---------- */
  def('r-vector', {
    title: 'A vector: values in numbered positions',
    summary: 'The vector x <- c(12, 0, 7, 30) with positions 1 to 4, and the results of x[2] (0), x * 2 (24 0 14 60), x > 5 (TRUE FALSE TRUE TRUE), x[x > 5] (12 7 30) and c(1, "a") ("1" "a").',
    build(D) {
      const cell = (k, v, idx, vk) => h('div.dg-cell', { 'data-k': k }, h('span.dg-v', vk ? { 'data-k': vk } : null, v), idx != null ? h('span.dg-i', idx) : null);
      return h('div',
        codeHTML([['cmd', '> x <- c(12, 0, 7, 30)'], '\n', ['out', ' ']]),
        h('div.dg-label', { style: { marginTop: '12px' } }, 'x (positions below)'),
        h('div.dg-cells', [12, 0, 7, 30].map((v, i) => cell('x' + (i + 1), String(v), String(i + 1)))),
        D.el('div.dg-label', 'rlab', 'result'),
        h('div.dg-cells', { style: { justifyContent: 'center' } }, [1, 2, 3, 4].map((i) => cell('res' + i + ' res', '', null, 'rv' + i))));
    },
    steps: [
      { cap: '`x <- c(12, 0, 7, 30)` stores four numbers in a **vector** named `x`. Each value has a position, and R counts positions from **1**.', show: [], hi: ['x1', 'x2', 'x3', 'x4'] },
      { cap: '`x[2]` asks for the value in position 2: 0. Square brackets select by position (in Python, which counts from 0, `x[2]` would be 7).', show: ['res1', 'rlab'], set: { cmd: '> x[2]', out: '[1] 0', rlab: 'x[2]', rv1: '0' }, hi: ['x2', 'res1'] },
      { cap: '`x * 2` doubles **every** element at once: 24, 0, 14, 60. Arithmetic on a vector works element by element, with no loop.', show: ['res2', 'res3', 'res4'], set: { cmd: '> x * 2', out: '[1] 24  0 14 60', rlab: 'x * 2', rv1: '24', rv2: '0', rv3: '14', rv4: '60' }, hi: ['res'] },
      { cap: '`x > 5` compares every element with 5 and gives TRUE or FALSE for each: a **logical vector**.', set: { cmd: '> x > 5', out: '[1]  TRUE FALSE  TRUE  TRUE', rlab: 'x > 5', rv1: 'TRUE', rv2: 'FALSE', rv3: 'TRUE', rv4: 'TRUE' }, hi: ['res'] },
      { cap: '`x[x > 5]` puts that logical vector inside the brackets: R keeps the values where it is TRUE, so you get 12, 7 and 30.', hide: ['res4'], set: { cmd: '> x[x > 5]', out: '[1] 12  7 30', rlab: 'x[x > 5]', rv1: '12', rv2: '7', rv3: '30' }, hi: ['x1', 'x3', 'x4', 'res'] },
      { cap: 'A vector holds **one type**. Mix a number with text, `c(1, "a")`, and R turns everything into text (character): the number 1 becomes "1".', hide: ['res3'], set: { cmd: '> c(1, "a")', out: '[1] "1" "a"', rlab: 'c(1, "a")', rv1: '"1"', rv2: '"a"' }, hi: ['res'] }
    ]
  });

  /* ---------- 4. R data structures ---------- */
  def('r-structures', {
    title: 'Four ways R holds data',
    summary: 'A vector (one row of values of one type), a matrix (rows and columns of one type), a list (a bag holding text, numbers, TRUE and even another list) and a data frame (a table like samples.tsv whose columns have their own types).',
    build(D) {
      const lab = (y, name, desc) => [D.text('', 10, y, name, { size: 14, weight: 700, anchor: 'start' }), D.text('', 10, y + 26, desc, { size: 11, cls: 'muted', anchor: 'start', lh: 14 })];
      const vals = [12, 0, 7, 30], m = [[613, 868, 714], [220, 223, 277]];
      const dfx = [140, 210, 304], dfRows = [['ctrl_1', 'control', '1'], ['ctrl_2', 'control', '2'], ['...', '...', '...'], ['heat_3', 'heat_shock', '3']];
      return D.svg(400, 372,
        D.g('v', lab(22, 'vector', 'one dimension,\none type'),
          vals.map((v, i) => D.box('', 140 + i * 62, 12, 56, 32, String(v), { mono: true, size: 14 })),
          vals.map((v, i) => D.text('', 168 + i * 62, 54, String(i + 1), { size: 11, cls: 'muted', mono: true }))),
        D.g('mx', lab(96, 'matrix', 'rows and columns,\none type'),
          m.map((row, i) => row.map((v, j) => D.box(i === 1 && j === 2 ? 'm23' : '', 140 + j * 62, 82 + i * 34, 58, 30, String(v), { mono: true, size: 13 }))),
          D.text('', 337, 99, 'row 1', { size: 11, cls: 'muted', anchor: 'start' }), D.text('', 337, 133, 'row 2', { size: 11, cls: 'muted', anchor: 'start' })),
        D.g('li', lab(178, 'list', 'a bag that holds\nanything'),
          D.box('', 132, 166, 262, 96, '', { cls: 'ghost', r: 14 }),
          D.text('', 168, 178, 'gene', { size: 11, cls: 'muted' }), D.text('', 262, 178, 'counts', { size: 11, cls: 'muted' }), D.text('', 352, 178, 'ok', { size: 11, cls: 'muted' }),
          D.box('', 142, 186, 54, 26, '"TP53"', { cls: 'violet', mono: true, size: 12 }),
          D.box('', 204, 186, 116, 26, '613 868 714', { mono: true, size: 12 }),
          D.box('', 328, 186, 52, 26, 'TRUE', { cls: 'green', mono: true, size: 12 }),
          D.box('', 142, 222, 178, 32, 'another list inside', { cls: 'ghost', size: 11, r: 10 })),
        D.g('df', lab(282, 'data frame', 'a table: each column\nhas its own type'),
          rect(D, '', 136, 270, 258, 98, 'fill: var(--dg-fill); stroke: var(--dg-line); stroke-width: 1.2', 8),
          ['sample', 'condition', 'replicate'].map((t, j) => D.text('', dfx[j] + 6, 282, t, { size: 11, weight: 700, mono: true, anchor: 'start' })),
          D.g('types', ['chr', 'chr', 'int'].map((t, j) => D.text('', dfx[j] + 6, 298, t, { size: 11, cls: 'gold', mono: true, anchor: 'start' }))),
          D.line('', 140, 306, 390, 306, { cls: 'thin' }),
          dfRows.map((r, i) => r.map((t, j) => D.text('', dfx[j] + 6, 318 + i * 15, t, { size: 11, mono: true, anchor: 'start' })))));
    },
    steps: [
      { cap: 'A **vector** is a row of values of one type, in one dimension, with positions 1, 2, 3 and so on. `c(12, 0, 7, 30)` makes a numeric vector.', show: [], hi: ['v'] },
      { cap: 'A **matrix** has rows and columns but still one type, like counts for 2 genes in 3 samples. `m[2, 3]` means row 2, column 3: here 277.', show: ['mx'], hi: ['m23'] },
      { cap: 'A **list** is a bag that holds anything: text, a vector of numbers, TRUE or FALSE, even another list. Many R results, such as a t-test, come back as lists.', show: ['li'], hi: ['li'] },
      { cap: 'A **data frame** is a table: each column is a vector with its own type, and all columns have the same length. Reading samples.tsv gives one.', show: ['df'], hi: ['df'] },
      { cap: 'Not sure what you have? `class(x)` names the structure, and `str(x)` lists its parts and their types: for samples.tsv, chr for text and int for whole numbers.', hi: ['types'] }
    ]
  });

  /* ---------- 5. Reading and writing a table ---------- */
  def('read-table', {
    title: 'From a text file to a table, and back',
    summary: 'The tab-separated text of samples.tsv becomes a data frame with 6 rows and 4 columns via read.delim; counts.tsv read with row.names = 1 uses gene names as row names; pandas reads the same file with row labels from 0; write.table saves a data frame as text; relative file names are looked for in the working directory.',
    build(D) {
      const mono = (k, x, y, t, o = {}) => pre(D.text(k, x, y, t, Object.assign({ size: 11, mono: true, anchor: 'start' }, o)));
      // a text line with tabs drawn as gold arrows
      const tabLine = (y, cells) => { const t = pre(D.text('', 16, y, '', { size: 11, mono: true, anchor: 'start' })); t.textContent = ''; cells.forEach((c, i) => { if (i) t.append(D.s('tspan', { cls: 'dg-t gold', 'font-size': 14 }, '→')); t.append(D.s('tspan', null, c)); }); return t; };
      const sx = [30, 56, 128, 218, 298], sh = ['', 'sample', 'condition', 'replicate', 'temperature_C'];
      const sRows = [['ctrl_1', 'control', '1', '37'], ['ctrl_2', 'control', '2', '37'], ['ctrl_3', 'control', '3', '37'], ['heat_1', 'heat_shock', '1', '42'], ['heat_2', 'heat_shock', '2', '42'], ['heat_3', 'heat_shock', '3', '42']];
      const cx = [30, 142, 212, 282, 344], cRows = [['HSPA1A', 212, 282, 203], ['HSPA1B', 172, 202, 155], ['HSPA6', 2, 0, 3], ['ACTB', 44289, 46223, 46941], ['...', '', '', '']];
      return D.svg(400, 340,
        D.text('fname', 14, 10, 'samples.tsv (a text file)', { size: 12, weight: 700, mono: true, anchor: 'start' }),
        D.box('fbox', 8, 20, 384, 74, '', { cls: 'file' }),
        D.g('ftxt-s', tabLine(34, ['sample', 'condition', 'replicate', 'temperature_C']), tabLine(50, ['ctrl_1', 'control', '1', '37']), tabLine(66, ['ctrl_2', 'control', '2', '37']), mono('', 16, 82, '...')),
        D.g('ftxt-c', tabLine(34, ['gene', 'ctrl_1', 'ctrl_2', 'ctrl_3', 'heat_1', 'heat_2', 'heat_3']), tabLine(50, ['HSPA1A', '212', '282', '203', '11018', '8441', '10838']), tabLine(66, ['HSPA1B', '172', '202', '155', '10345', '7330', '7541']), mono('', 16, 82, '...')),
        codeLines(D, 'code', 8, 102, 384, 40, [['code1', 'samples <- read.delim("samples.tsv")'], ['code2', '']], { size: 11, top: 13 }),
        D.g('arr', D.arrow('', 200, 144, 200, 162)),
        D.g('df-s',
          rect(D, '', 24, 166, 368, 128, 'fill: var(--dg-fill); stroke: var(--dg-line); stroke-width: 1.2', 8),
          sh.map((t, j) => mono('', sx[j] + 4, 178, t, { weight: 700 })), D.line('', 26, 186, 390, 186, { cls: 'thin' }),
          sRows.map((r, i) => [mono('rn' + (i + 1) + ' rn', sx[0] + 4, 196 + i * 17, String(i + 1), { cls: 'muted' }), r.map((t, j) => mono('', sx[j + 1] + 4, 196 + i * 17, t))])),
        D.g('df-c',
          rect(D, '', 24, 166, 368, 112, 'fill: var(--dg-fill); stroke: var(--dg-line); stroke-width: 1.2', 8),
          D.g('rown', rect(D, '', 26, 188, 112, 88, 'fill: var(--blue-soft)', 4)),
          ['', 'ctrl_1', 'ctrl_2', 'ctrl_3', '...'].map((t, j) => mono('', cx[j] + 4, 178, t, { weight: 700 })), D.line('', 26, 186, 390, 186, { cls: 'thin' }),
          cRows.map((r, i) => r.map((t, j) => mono('', cx[j] + 4, 198 + i * 17, String(t), { weight: j === 0 ? 700 : null }))),
          D.text('', 82, 290, 'row names', { size: 11, cls: 'gold' })),
        D.g('wd',
          D.box('', 70, 172, 260, 112, '', { cls: 'dir' }),
          mono('', 84, 190, 'project/data/', { weight: 700, size: 12 }), D.text('', 84, 208, 'the working directory', { size: 11, cls: 'muted', anchor: 'start' }),
          D.box('', 84, 222, 110, 26, 'samples.tsv', { cls: 'file', mono: true, size: 11 }),
          D.box('', 204, 222, 110, 26, 'counts.tsv', { cls: 'file', mono: true, size: 11 }),
          D.text('', 200, 268, 'read.delim("samples.tsv") looks here', { size: 11, mono: true })),
        D.g('warr', D.arrow('', 200, 164, 200, 146, { cls: 'gold' })),
        mono('o1', 14, 312, 'dim(samples)', { size: 12, cls: 'muted' }), mono('o2', 14, 330, '[1] 6 4', { size: 12, weight: 700 }));
    },
    steps: [
      { cap: 'A **.tsv** file is plain text: one line per row, with a **tab** (drawn here as →) between values. The first line is the **header** with the column names.', show: ['ftxt-s'], hide: ['ftxt-c', 'df-c', 'wd'], hi: ['fbox'] },
      { cap: '`read.delim("samples.tsv")` reads tab-separated text into a **data frame**: 6 rows and 4 columns, named from the header. R numbers the rows 1 to 6.', show: ['code', 'arr', 'df-s', 'o1', 'o2'], hi: ['df-s', 'o2'] },
      { cap: 'For counts.tsv, `row.names = 1` turns the first column (gene names) into **row names**, so the 6 columns left are all numbers: 12 rows by 6 columns.', show: ['ftxt-c', 'df-c'], hide: ['ftxt-s', 'df-s'], set: { fname: 'counts.tsv (a text file)', code1: 'counts <- read.delim("counts.tsv", row.names = 1)', o1: 'dim(counts)', o2: '[1] 12  6' }, hi: ['rown'] },
      { cap: 'Python reads the same file with pandas: `pd.read_csv("samples.tsv", sep="\\t")`. Same table, but the row labels start at **0**.', show: ['ftxt-s', 'df-s'], hide: ['ftxt-c', 'df-c'], set: { fname: 'samples.tsv (a text file)', code1: 'df = pd.read_csv("samples.tsv", sep="\\t")', o1: 'df.shape', o2: '(6, 4)', rn1: '0', rn2: '1', rn3: '2', rn4: '3', rn5: '4', rn6: '5' }, hi: ['rn', 'o2'] },
      { cap: 'Writing goes the other way: `write.table()` saves a data frame as text. With these options, out.tsv has exactly the same text as samples.tsv.', show: ['warr'], hide: ['arr', 'o1', 'o2'], set: { fname: 'out.tsv (a text file)', code1: 'write.table(samples, "out.tsv", sep = "\\t",', code2: '            quote = FALSE, row.names = FALSE)', rn1: '1', rn2: '2', rn3: '3', rn4: '4', rn5: '5', rn6: '6' }, hi: ['warr', 'fbox'] },
      { cap: 'A bare file name is looked for in the **working directory**, and `getwd()` shows which folder that is. If the file is elsewhere, give a path such as "data/samples.tsv".', show: ['wd'], hide: ['df-s', 'warr'], set: { fname: 'samples.tsv (a text file)', code1: 'getwd()   # the folder R reads from', code2: '' }, hi: ['wd'] }
    ]
  });

  /* ---------- 6. R Markdown ---------- */
  def('rmarkdown', {
    title: 'R Markdown: notes, code and results in one file',
    summary: 'A .Rmd file with a header, a heading, a sentence and an R code chunk; pressing Knit runs every chunk in a fresh session and builds one report with the text, the code, its output marked ## and a histogram.',
    build(D) {
      const page = { background: 'var(--surface)', border: '1px solid var(--dg-line)', borderRadius: '10px', padding: '8px 12px', marginTop: '4px' };
      const codeSt = { fontFamily: 'var(--mono)', fontSize: '.78rem', lineHeight: '1.45', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'var(--surface-3)', borderRadius: '6px', padding: '4px 8px', margin: '5px 0 0' };
      const outSt = Object.assign({}, codeSt, { background: 'none', padding: '2px 8px', margin: '2px 0 0', color: 'var(--text-2)' });
      // histogram of log2(ctrl_1 + 1) for the 12 practice genes: breaks 0, 5, 10, 15, 20 and counts 1, 6, 2, 3 (checked in R)
      const X = (v) => 40 + v * 9.5, Y = (c) => 112 - c * 13;
      const bar = (x0, x1, c) => D.s('polygon', { points: `${x0},112 ${x0},${Y(c)} ${x1},${Y(c)} ${x1},112`, style: 'fill: var(--blue-soft); stroke: var(--blue); stroke-width: 1.2' });
      const plot = D.svg(250, 150,
        D.text('', 135, 10, 'Histogram of log2(counts$ctrl_1 + 1)', { size: 11, weight: 700 }),
        [1, 6, 2, 3].map((c, i) => bar(X(i * 5), X(i * 5 + 5), c)),
        D.line('', X(0), 112, X(20), 112, { cls: 'axis' }), D.line('', 34, Y(0), 34, Y(6), { cls: 'axis' }),
        [0, 5, 10, 15, 20].map((v) => D.text('', X(v), 122, String(v), { size: 11, cls: 'muted' })),
        [0, 2, 4, 6].map((c) => D.text('', 28, Y(c), String(c), { size: 11, cls: 'muted', anchor: 'end' })),
        D.text('', 135, 140, 'log2(counts$ctrl_1 + 1)', { size: 11, cls: 'muted' }));
      const src = D.code(['[[yaml|---]]', '[[yaml|title: "Heat-shock counts"]]', '[[yaml|output: html_document]]', '[[yaml|---]]', '[[head|## Load the data]]', '[[txt|Gene names become row names.]]',
        '[[fence|```{r}]]', '[[chunk|counts <- read.delim("counts.tsv", row.names = 1)]]', '[[chunk|dim(counts)]]', '[[chunk|hist(log2(counts$ctrl_1 + 1))]]', '[[fence|```]]']);
      src.style.fontSize = '.8rem';
      src.style.lineHeight = '1.5';
      return h('div',
        h('div.dg-label', 'report.Rmd: plain text that you edit'),
        src,
        h('div.dg-step', { 'data-k': 'knit' }, h('span', '↓'), ' Knit: run every chunk in a fresh R session'),
        h('div', { 'data-k': 'report' },
          h('div.dg-label', 'report.html (or PDF, or Word)'),
          h('div', { style: page },
            h('div', { style: { fontWeight: 800, fontSize: '1.05rem', color: 'var(--heading)' } }, 'Heat-shock counts'),
            h('div', { 'data-k': 'r-head', style: { fontWeight: 700, color: 'var(--heading)', marginTop: '4px', fontSize: '.95rem' } }, 'Load the data'),
            h('div', { style: { fontSize: '.88rem' } }, 'Gene names become row names.'),
            h('div', { 'data-k': 'r-code', style: codeSt }, 'counts <- read.delim("counts.tsv", row.names = 1)\ndim(counts)'),
            h('div', { 'data-k': 'r-out', style: outSt }, '## [1] 12  6'),
            h('div', { 'data-k': 'r-code', style: codeSt }, 'hist(log2(counts$ctrl_1 + 1))'),
            h('div', { 'data-k': 'r-plot', style: { marginTop: '6px', maxWidth: '230px' } }, plot))));
    },
    steps: [
      { cap: 'An **R Markdown** file (`.Rmd`) is plain text that mixes notes with R code. The header between the `---` lines sets the title and the output format.', show: [], hi: ['yaml'] },
      { cap: 'Write notes as ordinary text. A line starting with `#` is a heading (`##` is one level smaller).', hi: ['head', 'txt'] },
      { cap: 'Code goes in **chunks**: a line of three backticks with `{r}`, then the code, then three backticks to close the chunk.', hi: ['fence', 'chunk'] },
      { cap: 'Press **Knit** in RStudio. R starts a **fresh** session and runs every chunk from top to bottom.', show: ['knit'], hi: ['knit'] },
      { cap: 'Out comes one report (HTML, PDF or Word) with your text, the code, its output (marked `##`) and the plot, all together and easy to share.', show: ['report'], hi: ['r-out', 'r-plot'] },
      { cap: 'Knit starts from nothing, so objects that exist only in your Console do not count. If the report knits, the analysis can be rerun from the files alone: it is reproducible.', hi: ['chunk', 'r-code'] }
    ]
  });
  /* ---------- 7. Logical vectors ---------- */
  def('logical-mask', {
    title: 'TRUE and FALSE: count, find and keep',
    summary: 'The FOS counts in six samples, 220 223 277 311 1906 260; x > 300 gives FALSE FALSE FALSE TRUE TRUE FALSE; sum gives 2, which gives positions 4 and 5, x[x > 300] keeps 311 and 1906, and x > 250 & x < 1000 keeps 277, 311 and 260.',
    build(D) {
      const x = [220, 223, 277, 311, 1906, 260], names = ['ctrl_1', 'ctrl_2', 'ctrl_3', 'heat_1', 'heat_2', 'heat_3'];
      const gt = x.map((v) => v > 300), both = x.map((v) => v > 250 && v < 1000);
      const cx = (i) => 37 + i * 65;
      const lg = (key, arr) => arr.map((t, i) => D.box(key + (i + 1) + ' ' + key, cx(i) - 29, 136, 58, 28, t ? 'TRUE' : 'FALSE', { cls: t ? 'green' : 'muted', mono: true, size: 12, weight: 700 }));
      return D.svg(400, 286,
        codeLines(D, 'code', 8, 6, 384, 32, [['cmd', 'x <- c(220, 223, 277, 311, 1906, 260)']], { size: 13, top: 16 }),
        names.map((n, i) => D.text('', cx(i), 52, n, { size: 11, cls: 'muted', mono: true })),
        D.g('vals', x.map((v, i) => D.box('v' + (i + 1), cx(i) - 29, 62, 58, 32, String(v), { mono: true, size: 14, weight: 700 }))),
        x.map((v, i) => D.text('p' + (i + 1), cx(i), 106, 'position ' + (i + 1), { size: 11, cls: 'muted' })),
        D.text('lglab', 8, 126, 'x > 300', { size: 12, mono: true, weight: 700, anchor: 'start', cls: 'gold' }),
        D.g('lg', lg('lg', gt)), D.g('lc', lg('lc', both)),
        pre(D.text('out', 200, 186, '', { size: 13, mono: true, weight: 700 })),
        D.text('keptlab', 8, 214, 'kept', { size: 12, weight: 700, anchor: 'start', cls: 'gold' }),
        x.map((v, i) => i < 2 ? null : D.box('kp' + (i + 1), cx(i) - 29, 224, 58, 32, String(v), { cls: 'gold', mono: true, size: 14, weight: 700 })));
    },
    steps: [
      { cap: 'The FOS counts in the six practice samples: `x <- c(220, 223, 277, 311, 1906, 260)`. Positions 1 to 6 follow the sample order.', show: [], hi: ['vals'] },
      { cap: '`x > 300` compares every value with 300 and returns a **logical vector**: one TRUE or FALSE per sample.', show: ['lglab', 'lg', 'out'], set: { cmd: 'x > 300', out: '[1] FALSE FALSE FALSE  TRUE  TRUE FALSE' }, hi: ['lg', 'out'] },
      { cap: '`sum(x > 300)` counts the TRUE values, because R treats TRUE as 1 and FALSE as 0: 2 samples are above 300.', set: { cmd: 'sum(x > 300)', out: '[1] 2' }, hi: ['lg4', 'lg5', 'out'] },
      { cap: '`which(x > 300)` returns the **positions** of the TRUE values: 4 and 5, that is heat_1 and heat_2.', set: { cmd: 'which(x > 300)', out: '[1] 4 5' }, hi: ['p4', 'p5', 'out'] },
      { cap: '`x[x > 300]` keeps the values where the test is TRUE: 311 and 1906. The 1906 in heat_2 is far above the other replicates and worth a closer look.', show: ['keptlab', 'kp4', 'kp5'], set: { cmd: 'x[x > 300]', out: '[1]  311 1906' }, hi: ['kp4', 'kp5'] },
      { cap: 'Combine tests with `&` (both must be TRUE) or `|` (at least one). `x[x > 250 & x < 1000]` keeps 277, 311 and 260: the outlier drops out.', show: ['lc', 'kp3', 'kp6'], hide: ['lg', 'kp5'], set: { cmd: 'x[x > 250 & x < 1000]', out: '[1] 277 311 260', lglab: 'x > 250 & x < 1000' }, hi: ['lc3', 'lc4', 'lc6', 'kp3', 'kp4', 'kp6'] }
    ]
  });

  /* ---------- 8. Quality control ---------- */
  const QC = [['HSPA1A', '212', '11018'], ['ACTB', '44289', '55945'], ['GAPDH', '35384', 'NA', 'missing value'], ['ACTB', '44289', '55945', 'repeat of row 2'], ['TP53', '-613', '881', 'negative count'], ['GENE_X', '0', '1', 'total only 1'], ['FOS', '220', '311']];
  def('qc-filter', {
    title: 'Quality control: find problems, fix or remove',
    summary: 'A made-up table of 7 genes with a missing value, a duplicated row, a negative count and a gene with almost no reads; is.na, duplicated, a range check and a minimum total remove one problem row each, leaving 3 clean rows and a written record of what was removed.',
    build(D) {
      const rowY = (i) => 98 + i * 22;
      return D.svg(400, 358,
        codeLines(D, 'code', 6, 4, 388, 44, [['c1', 'nrow(df)'], ['c2', '[1] 7']], { size: 11, top: 14, lh: 17 }),
        D.text('', 10, 58, 'made-up table, problems added on purpose', { size: 11, cls: 'gold', anchor: 'start' }),
        D.text('', 16, 76, 'gene', { size: 12, weight: 700, anchor: 'start', mono: true }), D.text('', 190, 76, 'ctrl_1', { size: 12, weight: 700, anchor: 'end', mono: true }), D.text('', 262, 76, 'heat_1', { size: 12, weight: 700, anchor: 'end', mono: true }),
        D.line('', 8, 85, 392, 85, { cls: 'thin' }),
        QC.map((r, i) => D.g('row' + (i + 1),
          r[3] ? D.g('mk' + (i + 1), D.box('', 6, rowY(i) - 10, 388, 20, '', { cls: 'red', r: 5 }), D.text('', 276, rowY(i), r[3], { size: 11, cls: 'red', anchor: 'start' })) : null,
          D.text('', 16, rowY(i), r[0], { size: 12, mono: true, anchor: 'start' }), pre(D.text('', 190, rowY(i), r[1], { size: 12, mono: true, anchor: 'end' })), pre(D.text('', 262, rowY(i), r[2], { size: 12, mono: true, anchor: 'end' })))),
        D.box('log', 6, 254, 388, 98, '', { cls: 'ghost' }),
        D.text('', 16, 270, 'removed, and why', { size: 12, weight: 700, anchor: 'start' }),
        D.text('log1', 16, 290, 'GAPDH: missing value (NA)', { size: 11, anchor: 'start' }),
        D.text('log2', 16, 305, 'ACTB, second copy: duplicate row', { size: 11, anchor: 'start' }),
        D.text('log3', 16, 320, 'TP53: impossible negative count', { size: 11, anchor: 'start' }),
        D.text('log4', 16, 335, 'GENE_X: 1 read in total (minimum 10)', { size: 11, anchor: 'start' }));
    },
    steps: [
      { cap: 'This **made-up** table has 7 rows and four problems planted on purpose. Quality control finds each one with a written rule and handles it before any analysis.', show: [], hi: [] },
      { cap: '**Missing value**: `is.na()` flags the NA in GAPDH. Calculations with NA give NA, so the row is removed (or the value is recovered from its source).', show: ['mk3', 'log1'], set: { c1: 'which(is.na(df$heat_1))   # 3', c2: 'df <- df[!is.na(df$heat_1), ]' }, hi: ['row3'] },
      { cap: '**Duplicate**: `duplicated()` is TRUE for a row identical to an earlier one. The second ACTB row would count that gene twice, so it goes.', show: ['mk4', 'log2'], hide: ['row3'], move: { row4: [0, -22], row5: [0, -22], row6: [0, -22], row7: [0, -22] }, set: { c1: 'sum(duplicated(df))   # 1', c2: 'df <- df[!duplicated(df), ]' }, hi: ['row4'] },
      { cap: '**Impossible value**: a count cannot be negative, so a range check catches -613 in TP53, perhaps a typing error. Check the source; if it cannot be fixed, remove the row.', show: ['mk5', 'log3'], hide: ['row4'], move: { row5: [0, -44], row6: [0, -44], row7: [0, -44] }, set: { c1: '# counts must be 0 or more', c2: 'df <- df[df$ctrl_1 >= 0 & df$heat_1 >= 0, ]' }, hi: ['row5'] },
      { cap: '**Very low counts**: GENE_X has 1 read in total, too few to measure anything. A minimum total, here 10 reads, removes such rows.', show: ['mk6', 'log4'], hide: ['row5'], move: { row6: [0, -66], row7: [0, -66] }, set: { c1: '# keep genes with at least 10 reads', c2: 'df <- df[df$ctrl_1 + df$heat_1 >= 10, ]' }, hi: ['row6'] },
      { cap: 'Three clean rows remain. Always **record** what you removed and why (the rule and the number of rows), so others can check and repeat your quality control.', hide: ['row6'], move: { row7: [0, -88] }, set: { c1: 'nrow(df)', c2: '[1] 3' }, hi: ['log'] }
    ]
  });

  /* ---------- 9. Exploratory plots ---------- */
  // Box statistics from R's boxplot.stats() for two made-up groups:
  // a = 4.2 4.6 4.9 5.1 5.3 5.6 6.0 8.9 -> 4.2 4.75 5.2 5.8 6.0, outlier 8.9; b = 6.1 6.6 7.0 7.2 7.5 7.9 8.4 -> 6.1 6.8 7.2 7.7 8.4
  const BOX = [{ s: [4.2, 4.75, 5.2, 5.8, 6.0], out: [8.9], lab: 'ctrl' }, { s: [6.1, 6.8, 7.2, 7.7, 8.4], out: [], lab: 'heat' }];
  def('eda-plots', {
    title: 'Look first: three plots, three questions',
    summary: 'Three small schematic plots: a histogram of one variable with a long right tail, a boxplot comparing two groups with an outlier, and a scatter plot of two variables rising together with one point far off the trend.',
    build(D) {
      const band = (y0, name, code, q) => [D.text('', 196, y0 + 18, name, { size: 14, weight: 700, anchor: 'start' }), D.text('', 196, y0 + 40, code, { size: 12, mono: true, anchor: 'start', cls: 'blue' }), D.text('', 196, y0 + 70, q, { size: 12, anchor: 'start', lh: 15 })];
      const frame = (k, y0) => D.box(k, 8, y0, 176, 104, '', { cls: 'file' });
      const hist = [30, 46, 34, 22, 14, 9, 5, 3, 2], H0 = 4;
      const hb = (c, i) => D.s('polygon', { points: `${20 + i * 17},${H0 + 94} ${20 + i * 17},${H0 + 94 - c * 1.7} ${37 + i * 17},${H0 + 94 - c * 1.7} ${37 + i * 17},${H0 + 94}`, style: 'fill: var(--blue-soft); stroke: var(--blue); stroke-width: 1.1' });
      const B0 = 120, BY = (v) => B0 + 92 - (v - 4) * 16.5;
      const boxG = (b, cx) => [D.line('', cx, BY(b.s[0]), cx, BY(b.s[1])), D.line('', cx, BY(b.s[3]), cx, BY(b.s[4])),
        D.line('', cx - 10, BY(b.s[0]), cx + 10, BY(b.s[0])), D.line('', cx - 10, BY(b.s[4]), cx + 10, BY(b.s[4])),
        D.s('polygon', { points: `${cx - 20},${BY(b.s[1])} ${cx + 20},${BY(b.s[1])} ${cx + 20},${BY(b.s[3])} ${cx - 20},${BY(b.s[3])}`, style: 'fill: var(--blue-soft); stroke: var(--blue); stroke-width: 1.2' }),
        D.s('line', { x1: cx - 20, y1: BY(b.s[2]), x2: cx + 20, y2: BY(b.s[2]), style: 'stroke: var(--heading); stroke-width: 3' }),
        D.text('', cx, B0 + 98, b.lab, { size: 11, cls: 'muted' })];
      const S0 = 236, pts = [[0.5, 1.6], [1.2, 1.9], [2, 2.9], [2.6, 2.7], [3.4, 3.9], [4.1, 4.1], [4.8, 4.6], [5.5, 5.6], [6.3, 5.9], [7, 6.9], [7.8, 7.2], [8.6, 8.1]];
      const SX = (v) => 26 + v * 16.5, SY = (v) => S0 + 94 - v * 10;
      return D.svg(400, 344,
        D.g('b1', frame('f1', 4), D.line('', 16, H0 + 94, 176, H0 + 94, { cls: 'axis' }), hist.slice(0, 5).map(hb),
          D.g('tail', hist.slice(5).map((c, i) => hb(c, i + 5))), band(4, 'Histogram', 'hist(x)', 'How is one variable\ndistributed?')),
        D.g('b2', frame('f2', 120), D.line('', 16, B0 + 4, 16, B0 + 92, { cls: 'axis' }), boxG(BOX[0], 70), boxG(BOX[1], 130),
          D.dot('outl', 70, BY(8.9), 4.5, { cls: 'red' }), band(120, 'Boxplot', 'boxplot(y ~ group)', 'Do groups differ?')),
        D.g('b3', frame('f3', 236), D.line('', 16, S0 + 94, 176, S0 + 94, { cls: 'axis' }), D.line('', 16, S0 + 6, 16, S0 + 94, { cls: 'axis' }),
          pts.map(([a, b]) => D.dot('', SX(a), SY(b), 4)), D.dot('odd', SX(7.6), SY(1.6), 4.5, { cls: 'red' }),
          band(236, 'Scatter plot', 'plot(x, y)', 'Do two variables\nmove together?')),
        D.g('warn', D.path('', 'M104,80 V74 H174 V80', { cls: 'gold' }), D.text('', 139, 64, 'long tail', { size: 11, cls: 'gold' }), D.text('', 42, B0 + 11, 'outlier', { size: 11, cls: 'gold' }), D.text('', 150, S0 + 62, 'a mistake?', { size: 11, cls: 'gold' })));
    },
    steps: [
      { cap: 'Before any test, **look** at your data. Three basic plots answer three different questions.', show: [], hi: [] },
      { cap: 'A **histogram** (`hist(x)`) sorts the values of one variable into bins and counts each bin. It shows the center, the spread and the shape.', hi: ['f1'] },
      { cap: 'A **boxplot** compares groups. The thick line is the median, the box holds the middle half of the values, the whiskers reach the rest, and a lone dot marks an outlier.', hi: ['f2'] },
      { cap: 'A **scatter plot** (`plot(x, y)`) shows two measurements of the same samples, one dot per sample. Here they rise together.', hi: ['f3'] },
      { cap: 'Look before you test: plots reveal skew (a long tail), outliers and mistakes such as typing errors, which a mean or a p-value would hide.', show: ['warn'], hi: ['outl', 'odd'] }
    ]
  });

  /* ---------- 10. Linear model ---------- */
  // Made-up points; lm(y ~ x) in R gives intercept 1.2467, slope 1.1200, R-squared 0.9408, slope p-value 0.00134.
  const LMX = [1, 2, 3, 4, 5, 6], LMY = [2.5, 3.1, 5.2, 5.0, 7.4, 7.8], LMB = [1.246667, 1.12];
  def('linear-model', {
    title: 'A linear model: the best straight line',
    summary: 'Six made-up points with the fitted line y = 1.25 + 1.12 * x from lm(y ~ x): the intercept where the line meets x = 0, the slope as the rise for one step in x, the residuals as vertical gaps, and R squared 0.94.',
    build(D) {
      const X = (v) => 56 + v * 46, Y = (v) => 252 - v * 25, f = (v) => LMB[0] + LMB[1] * v;
      const seg = (k, d, style) => D.s('path', { k, d, cls: 'dg-path', style });
      return D.svg(400, 336,
        D.line('', 56, 252, 386, 252, { cls: 'axis' }), D.line('', 56, 252, 56, 22, { cls: 'axis' }),
        [0, 1, 2, 3, 4, 5, 6].map((v) => D.text('', X(v), 264, String(v), { size: 11, cls: 'muted' })),
        [0, 3, 6, 9].map((v) => D.text('', 48, Y(v), String(v), { size: 11, cls: 'muted', anchor: 'end' })),
        D.text('', 380, 278, 'x', { size: 13, weight: 700, mono: true }), D.text('', 30, 22, 'y', { size: 13, weight: 700, mono: true }),
        D.g('resid', LMX.map((v, i) => seg('', `M${X(v)},${Y(LMY[i])} V${Y(f(v))}`, 'stroke: var(--dg-hi); stroke-width: 2; stroke-dasharray: 4 3'))),
        D.g('line', seg('', `M${X(0)},${Y(f(0))} L${X(6.8)},${Y(f(6.8))}`, 'stroke: var(--red); stroke-width: 2.4')),
        D.g('tri', seg('', `M${X(4.5)},${Y(f(4.5))} H${X(5.5)} V${Y(f(5.5))}`, 'stroke: var(--text); stroke-width: 1.6'),
          D.text('', X(5), Y(f(4.5)) + 11, '+1', { size: 12, weight: 700 }), D.text('', X(5.5) + 5, Y(f(5)) + 2, '+1.12', { size: 12, weight: 700, anchor: 'start' })),
        D.g('icpt', D.dot('', X(0), Y(f(0)), 5.5, { cls: 'gold' }), D.text('', X(0) + 10, Y(f(0)) + 14, 'intercept 1.25', { size: 12, weight: 700, anchor: 'start', cls: 'gold' })),
        D.g('pts', LMX.map((v, i) => D.dot('', X(v), Y(LMY[i]), 6))),
        D.text('eq', 70, 30, 'y = 1.25 + 1.12 * x', { size: 14, mono: true, weight: 700, anchor: 'start' }),
        D.text('r2', 70, 52, 'R squared = 0.94', { size: 14, mono: true, weight: 700, anchor: 'start', cls: 'blue' }),
        codeLines(D, 'code', 8, 288, 384, 44, [['c1', 'fit <- lm(y ~ x)'], ['c2', '']], { size: 12, top: 14, lh: 17 }));
    },
    steps: [
      { cap: 'Six made-up points, for example a dose (x) and a response (y). As x grows, y tends to grow too. Can one straight line describe that?', show: [], hi: ['pts'] },
      { cap: '`lm(y ~ x)` fits the line y = intercept + slope * x; read `~` as "explained by". For these points the line is y = 1.25 + 1.12 * x.', show: ['line', 'eq', 'code'], hi: ['line', 'eq'] },
      { cap: 'The **intercept** (1.25) is where the line crosses x = 0. The **slope** (1.12) is how much y changes, on average, when x goes up by 1.', show: ['icpt', 'tri'], hi: ['icpt', 'tri'] },
      { cap: '**Residuals** are the vertical gaps between the points and the line. `lm()` picks the line that makes the sum of the squared residuals as small as possible: least squares.', show: ['resid'], hi: ['resid'] },
      { cap: '`summary(fit)` reports **R squared** = 0.94: the line explains 94% of the variation in y. It also tests the slope: p = 0.0013.', show: ['r2'], set: { c2: 'summary(fit)   # R-squared: 0.9408' }, hi: ['r2', 'code'] }
    ]
  });

  /* ---------- 11. ANOVA ---------- */
  // Made-up values (the same as the topic example); summary(aov()) in R: between SS 13.976 (df 2, MS 6.988),
  // within SS 0.447 (df 6, MS 0.0744), F = 93.87, p = 2.97e-05. TukeyHSD: C-A and C-B p < 0.001, B-A p = 0.497.
  const AOV = { A: [5.1, 5.4, 4.9], B: [5.3, 5.7, 5.2], C: [7.9, 8.2, 7.6] };
  def('anova', {
    title: 'ANOVA: between groups versus within groups',
    summary: 'Three made-up groups of three values: the group means around the overall mean (between-group variation) and the values around their own group mean (within-group variation); F = 6.988 / 0.0744 = 93.87 and p = 2.97e-05.',
    build(D) {
      const Y = (v) => 232 - (v - 4.5) * 48, cxs = { A: 116, B: 214, C: 312 };
      const mean = (a) => a.reduce((p, q) => p + q, 0) / a.length, all = [].concat(AOV.A, AOV.B, AOV.C), gm = mean(all);
      const seg = (d, style) => D.s('path', { d, cls: 'dg-path', style });
      const groups = Object.keys(AOV);
      return D.svg(400, 322,
        D.text('', 200, 12, 'made-up values: one gene, 3 cell lines, 3 cultures each', { size: 11, cls: 'muted' }),
        D.line('', 54, 240, 54, 30, { cls: 'axis' }), [5, 6, 7, 8].map((v) => D.text('', 46, Y(v), String(v), { size: 11, cls: 'muted', anchor: 'end' })),
        D.g('overall', D.line('', 62, Y(gm), 384, Y(gm), { cls: 'dash' }), D.text('', 250, Y(gm) - 10, 'overall mean ' + fmt(gm, 2), { size: 11, cls: 'muted' })),
        D.g('between', groups.map((g) => D.arrow('', cxs[g] + 40, Y(gm), cxs[g] + 40, Y(mean(AOV[g])) + (mean(AOV[g]) > gm ? 3 : -3), { cls: 'gold' })),
          D.text('', 165, 224, 'between', { size: 11, cls: 'gold' })),
        D.g('within', groups.map((g) => AOV[g].map((v, i) => seg(`M${cxs[g] - 16 + i * 16},${Y(v)} V${Y(mean(AOV[g]))}`, 'stroke: var(--blue); stroke-width: 2.4'))),
          D.text('', cxs.C - 34, Y(8.2) - 4, 'within', { size: 11, cls: 'blue', anchor: 'end' })),
        D.g('means', groups.map((g) => D.s('line', { x1: cxs[g] - 30, y1: Y(mean(AOV[g])), x2: cxs[g] + 30, y2: Y(mean(AOV[g])), style: 'stroke: var(--heading); stroke-width: 2.6' }))),
        groups.map((g) => D.g('g' + g, AOV[g].map((v, i) => D.dot('', cxs[g] - 16 + i * 16, Y(v), 6)), D.text('', cxs[g], 252, g, { size: 14, weight: 700 }))),
        D.text('ftext', 200, 280, 'F = 6.988 / 0.0744 = 93.87', { size: 13, mono: true, weight: 700 }),
        D.text('ptext', 200, 304, 'p = 2.97e-05 (0.0000297)', { size: 13, mono: true, weight: 700, cls: 'blue' }));
    },
    steps: [
      { cap: 'Made-up values: one gene measured in three cell lines (A, B, C), three cultures each. Do the three group means differ?', show: [], hi: ['gA', 'gB', 'gC'] },
      { cap: '**Between-group** variation: how far each group mean (solid line) sits from the overall mean of all nine values (dashed, 6.14).', show: ['means', 'overall', 'between'], hi: ['between'] },
      { cap: '**Within-group** variation: how far each culture sits from its own group mean. This is the noise; here the cultures agree closely.', show: ['within'], hi: ['within'] },
      { cap: '**F** divides the between-group variance by the within-group variance (each is a sum of squares divided by its degrees of freedom): 6.988 / 0.0744 = 93.87.', show: ['ftext'], hi: ['ftext'] },
      { cap: 'A large F gives a small p-value. `summary(aov(expr ~ group))` reports p = 2.97e-05, that is 0.0000297: strong evidence that the three means are not all equal.', show: ['ptext'], hi: ['ptext'] },
      { cap: 'ANOVA says that **at least one** mean differs, not which. A follow-up test such as `TukeyHSD()` compares the pairs: C differs from A and from B, while A and B do not.', hi: ['gC'] }
    ]
  });

  /* ---------- 12. A whole analysis ---------- */
  def('analysis-flow', {
    title: 'A first analysis, start to finish',
    summary: 'Six stages from top to bottom: load with read.delim, check with summary and is.na, explore with hist, boxplot and plot, test with t.test, aov or lm, interpret in biological terms, and report; dashed arrows show that going back a step is normal.',
    build(D) {
      const st = [['Load', 'read.delim()  dim()'], ['Check', 'summary()  is.na()'], ['Explore', 'hist()  boxplot()  plot()'], ['Test', 't.test()  aov()  lm()'], ['Interpret', 'effect size, p-value, biology'], ['Report', 'R Markdown, figures']];
      const y = (i) => 8 + i * 56;
      return D.svg(400, 344,
        st.map(([name, fns], i) => D.g('n' + (i + 1),
          D.box('', 64, y(i), 328, 40, '', { cls: i === 5 ? 'gold' : 'file' }),
          D.text('', 76, y(i) + 20, name, { size: 13, weight: 700, anchor: 'start' }),
          pre(D.text('', 382, y(i) + 20, fns, { size: 11, mono: i < 4, anchor: 'end', cls: i < 4 ? 'blue' : 'muted' })))),
        [0, 1, 2, 3, 4].map((i) => D.g('a' + (i + 1), D.arrow('', 228, y(i) + 41, 228, y(i) + 55))),
        D.g('back', D.arrow('', 62, y(2) + 20, 62, y(1) + 20, { cls: 'dash', bend: -22 }), D.arrow('', 62, y(4) + 20, 62, y(2) + 22, { cls: 'dash', bend: -34 }),
          D.text('', 18, y(2) + 40, 'back', { size: 11, cls: 'muted' })));
    },
    steps: [
      { cap: '**Load**: read the files with `read.delim()` and confirm their size with `dim()`, for example 12 genes by 6 samples.', show: ['n1'], hi: ['n1'] },
      { cap: '**Check** before you trust: `summary()` shows ranges, `is.na()` finds missing values, and the samples must match between tables.', show: ['n2', 'a1'], hi: ['n2'] },
      { cap: '**Explore** with plots: `hist()` for one variable, `boxplot()` for groups, `plot()` for two variables. Look for outliers and odd samples.', show: ['n3', 'a2'], hi: ['n3'] },
      { cap: '**Test** with a method that fits the question: `t.test()` for two groups, `aov()` for three or more, `lm()` for a trend along a number.', show: ['n4', 'a3'], hi: ['n4'] },
      { cap: '**Interpret** in biological terms: how big is the effect, how strong is the evidence, what does it mean for the cells? Then **report** it, for example with R Markdown.', show: ['n5', 'n6', 'a4', 'a5'], hi: ['n5', 'n6'] },
      { cap: 'Going back is normal. A plot can reveal a problem that sends you back to checking, and a result can raise a new question to explore.', show: ['back'], hi: ['back'] }
    ]
  });

  /* ---------- 13. Packages ---------- */
  def('r-packages', {
    title: 'R packages: install once, load every session',
    summary: 'Packages come from CRAN or Bioconductor; install.packages or BiocManager::install copies them into the library on your computer once, library() loads them into each new R session, and the error there is no package called means a package is not installed yet.',
    build(D) {
      return D.svg(400, 352,
        D.g('cran', D.box('', 8, 8, 184, 50, 'CRAN\ngeneral packages', { cls: 'blue', size: 12 })),
        D.g('bioc', D.box('', 208, 8, 184, 50, 'Bioconductor\npackages for biology', { cls: 'green', size: 12 })),
        D.g('inst', D.arrow('', 100, 60, 148, 110), D.arrow('', 300, 60, 252, 110), D.text('', 200, 78, 'install', { size: 12, weight: 700 }), D.text('', 200, 94, 'once per computer', { size: 11, cls: 'muted' })),
        D.box('libbox', 40, 112, 320, 58, '', { cls: 'dir' }),
        D.text('', 200, 124, 'library: packages installed on this computer', { size: 11, cls: 'muted' }),
        D.box('lib-gg', 110, 136, 84, 26, 'ggplot2', { mono: true, size: 12 }), D.box('lib-de', 206, 136, 84, 26, 'DESeq2', { mono: true, size: 12 }),
        D.g('load', D.arrow('', 200, 172, 200, 212), D.text('', 212, 186, 'load', { size: 12, weight: 700, anchor: 'start' }), D.text('', 212, 201, 'every new session', { size: 11, cls: 'muted', anchor: 'start' })),
        panel(D, 'sesbox', 40, 214, 320, 58, 'navy', D.text('', 200, 226, 'R session: packages loaded now', { size: 11 })),
        D.box('ses-gg', 110, 238, 84, 26, 'ggplot2', { mono: true, size: 12 }), D.box('ses-de', 206, 238, 84, 26, 'DESeq2', { mono: true, size: 12 }),
        codeLines(D, 'code', 8, 282, 384, 64, [['c1', ''], ['c2', ''], ['c3', '']], { size: 11.5, top: 15, lh: 17 }));
    },
    steps: [
      { cap: '**Packages** add functions to R. Most come from **CRAN**, the main collection (such as ggplot2 for plots); many biology packages come from **Bioconductor** (such as DESeq2 for RNA-seq).', show: [], hi: ['cran', 'bioc'] },
      { cap: '`install.packages("ggplot2")` downloads a package from CRAN into the **library** on your computer. Do it **once** per computer, and again only to update.', show: ['code', 'inst', 'lib-gg'], set: { c1: 'install.packages("ggplot2")', c2: '# once per computer' }, hi: ['lib-gg', 'cran'] },
      { cap: '`library(ggplot2)` loads an installed package into the current R session. Do it in **every new session**, usually at the top of your script.', show: ['load', 'ses-gg'], set: { c1: 'library(ggplot2)', c2: '# every new session' }, hi: ['ses-gg'] },
      { cap: 'Loading a package that was never installed fails with "there is no package called". The fix is to install it first; retyping `library()` will not help.', set: { c1: '> library(DESeq2)', c2: 'Error in library(DESeq2) :', c3: '  there is no package called ‘DESeq2’' }, hi: ['code'] },
      { cap: 'Bioconductor packages are installed with BiocManager, itself a CRAN package: `install.packages("BiocManager")` once, then `BiocManager::install("DESeq2")`. Now `library(DESeq2)` works.', show: ['lib-de', 'ses-de'], set: { c1: 'install.packages("BiocManager")', c2: 'BiocManager::install("DESeq2")', c3: 'library(DESeq2)' }, hi: ['lib-de', 'ses-de', 'bioc'] }
    ]
  });
  /* ---------- 14. Python and R ---------- */
  def('python-vs-r', {
    title: 'Python and R: same ideas, different spelling',
    summary: 'A side-by-side table of Python and R syntax: assignment, making a list or vector, the first element (x[0] versus x[1]), length, defining a function, a for loop, reading a table and missing values.',
    build(D) {
      const rows = [['assign', 'x = 5', 'x <- 5'], ['list or vector', '[1, 2, 3]', 'c(1, 2, 3)'], ['first element', 'x[0]', 'x[1]'], ['length', 'len(x)', 'length(x)'],
        ['function', 'def f(a):', 'f <- function(a) { }'], ['loop', 'for v in x:', 'for (v in x) { }'], ['read a table', 'pd.read_csv(...)', 'read.delim(...)'], ['missing value', 'None or NaN', 'NA']];
      const y = (i) => 34 + i * 32;
      return D.svg(400, 294,
        D.s('rect', { x: 4, y: 4, width: 392, height: 286, rx: 10, style: 'fill: var(--dg-fill); stroke: var(--dg-line); stroke-width: 1.2' }),
        D.s('polygon', { points: '6,6 394,6 394,32 6,32', style: 'fill: var(--surface-3)' }),
        D.s('polygon', { points: '6,32 104,32 104,288 6,288', style: 'fill: var(--surface-3)' }),
        D.text('', 112, 19, 'Python', { size: 13, weight: 700, anchor: 'start' }), D.text('', 238, 19, 'R', { size: 13, weight: 700, anchor: 'start' }),
        rows.map((r, i) => D.g('r' + (i + 1),
          D.s('rect', { x: 8, y: y(i) + 2, width: 384, height: 28, rx: 6, fill: 'transparent', stroke: 'none' }),
          i ? D.line('', 6, y(i), 394, y(i), { cls: 'thin' }) : null,
          D.text('', 14, y(i) + 16, r[0], { size: 12, weight: 700, anchor: 'start' }),
          pre(D.text('', 112, y(i) + 16, r[1], { size: 12, mono: true, anchor: 'start', cls: 'blue' })),
          pre(D.text('', 238, y(i) + 16, r[2], { size: 12, mono: true, anchor: 'start', cls: 'green' })))));
    },
    steps: [
      { cap: 'Both languages do the same jobs with different spelling. Python assigns with `=`, R usually with `<-`. A Python list `[1, 2, 3]` plays the role of an R vector `c(1, 2, 3)`.', show: [], hi: ['r1', 'r2'] },
      { cap: 'Python counts positions from **0**, R from **1**: the first element is `x[0]` in Python but `x[1]` in R. The length is `len(x)` or `length(x)`.', hi: ['r3', 'r4'] },
      { cap: 'Blocks of code: Python ends the first line with a colon and **indents** the body; R wraps the body in **braces** `{ }`.', hi: ['r5', 'r6'] },
      { cap: 'Reading a table: `pd.read_csv("counts.tsv", sep="\\t")` with pandas in Python, `read.delim("counts.tsv")` in R. Both give a table with named columns.', hi: ['r7'] },
      { cap: 'Missing values: `None` or `NaN` in Python, `NA` in R. They behave differently: R\'s `mean()` gives NA unless you add `na.rm = TRUE`, while pandas skips NaN by default.', hi: ['r8'] },
      { cap: 'Once you think in vectors, tables and loops, switching language is mostly spelling. This course uses R for bulk RNA-seq and Python for single-cell data.', hi: [] }
    ]
  });

  /* ---------- 15. Environments and Jupyter ---------- */
  def('env-jupyter', {
    title: 'Environments and Jupyter notebooks',
    summary: 'Two conda environments with their own Python version and packages (pandas for RNA-seq, scanpy for single-cell), the conda create and activate commands, and a Jupyter notebook whose cells show execution numbers; running a cell twice changes the result until the kernel is restarted and all cells run in order.',
    build(D) {
      const env = (k, x, name, py, p1, p2) => D.g(k, D.box('', x, 20, 188, 86, '', { cls: 'blue' }),
        D.text('', x + 94, 33, name, { size: 13, weight: 700, mono: true }),
        D.box('', x + 12, 44, 164, 24, py, { size: 12 }), D.box('', x + 12, 74, 78, 24, p1, { size: 12, mono: true }), D.box('', x + 98, 74, 78, 24, p2, { size: 12, mono: true }));
      const cell = (i, code) => D.g('cell' + i, D.text('num' + i, 50, 197 + (i - 1) * 28, '[' + i + ']:', { size: 12, mono: true, anchor: 'end', cls: 'blue' }),
        D.box('', 56, 186 + (i - 1) * 28, 190, 22, code, { mono: true, size: 12, anchor: 'start' }));
      return D.svg(400, 340,
        D.text('', 200, 10, 'two separate environments', { size: 11, cls: 'muted' }),
        env('env1', 8, 'rnaseq', 'Python 3.11', 'pandas', 'numpy'), env('env2', 204, 'singlecell', 'Python 3.12', 'scanpy', 'anndata'),
        codeLines(D, 'code', 8, 114, 384, 40, [['', 'conda create -n rnaseq python=3.11'], ['', 'conda activate rnaseq']], { size: 11, top: 13 }),
        D.g('nb', D.box('', 8, 162, 384, 174, '', { cls: 'file' }),
          D.text('', 18, 175, 'analysis.ipynb', { size: 12, weight: 700, mono: true, anchor: 'start' }), D.text('', 384, 175, 'kernel: rnaseq', { size: 11, cls: 'muted', anchor: 'end' }),
          cell(1, 'n = 10'), cell(2, 'n = n * 2'), cell(3, 'print(n)')),
        D.text('out', 66, 281, '20', { size: 15, mono: true, weight: 700, anchor: 'start' }),
        D.g('mem', D.box('', 258, 186, 126, 56, '', { cls: 'gold' }), D.text('', 321, 200, 'kernel remembers', { size: 11 }), D.text('memv', 321, 224, 'n = 20', { size: 15, mono: true, weight: 700 })),
        D.g('restart', D.box('', 18, 298, 364, 28, 'Restart Kernel and Run All Cells', { cls: 'gold', size: 12, weight: 700 })));
    },
    steps: [
      { cap: 'An **environment** is a separate box with its own Python version and packages. One for RNA-seq (pandas) and one for single-cell work (scanpy) cannot break each other.', show: [], hi: ['env1', 'env2'] },
      { cap: '`conda create -n rnaseq python=3.11` makes an environment and `conda activate rnaseq` switches into it; then install packages there. Python\'s built-in `venv` does the same job.', show: ['code'], hi: ['code', 'env1'] },
      { cap: '**Jupyter Lab** notebooks are made of cells. Run a cell (Shift+Enter) and a number appears beside it: [1], [2], [3] record the order in which the cells ran.', show: ['nb', 'out'], hi: ['num1', 'num2', 'num3'] },
      { cap: 'The **kernel**, the Python process behind the notebook, remembers every variable. Cell 2 used `n` from cell 1, so cell 3 prints 20.', show: ['mem'], hi: ['mem', 'out'] },
      { cap: 'Now run cell 2 again, then cell 3: `n` doubled again to 40. The numbers read [1], [4], [5], and the page no longer matches a top-to-bottom reading.', set: { num2: '[4]:', num3: '[5]:', out: '40', memv: 'n = 40' }, hi: ['num2', 'num3', 'out', 'mem'] },
      { cap: 'Before sharing, choose **Restart Kernel and Run All Cells**: the kernel forgets everything and runs the cells in page order, giving [1], [2], [3] and 20 again.', show: ['restart'], set: { num2: '[2]:', num3: '[3]:', out: '20', memv: 'n = 20' }, hi: ['restart', 'out', 'num2', 'num3'] }
    ]
  });

  /* ---------- 16. Python containers ---------- */
  def('py-structures', {
    title: 'Lists, tuples, sets and dictionaries',
    summary: 'A list of genes with positions from 0 that grows with append, a tuple holding a chromosome and a position that cannot change, a set of the four DNA letters without order, and a dictionary that looks up a count by gene name.',
    build(D) {
      const lab = (y0, name, desc) => [D.text('', 10, y0 + 14, name, { size: 14, weight: 700, anchor: 'start' }), D.text('', 10, y0 + 46, desc, { size: 11, cls: 'muted', anchor: 'start', lh: 13 })];
      const code = (y0, t) => pre(D.text('', 118, y0 + 10, t, { size: 11, mono: true, anchor: 'start' }));
      const op = (k, y0, t, cls) => pre(D.text(k, 118, y0 + 72, t, { size: 11, mono: true, anchor: 'start', cls: cls || 'blue' }));
      const B = [6, 92, 178, 264];
      return D.svg(400, 350,
        D.g('list', lab(B[0], 'list', 'ordered,\nchangeable,\nrepeats allowed'), code(B[0], 'genes = ["ACTB", "TP53", "ACTB"]'),
          ['"ACTB"', '"TP53"', '"ACTB"'].map((t, i) => [D.box('', 118 + i * 66, B[0] + 20, 60, 26, t, { mono: true, size: 11 }), D.text('', 148 + i * 66, B[0] + 55, String(i), { size: 11, cls: 'muted', mono: true })])),
        D.g('l-fos', D.box('', 316, B[0] + 20, 60, 26, '"FOS"', { mono: true, size: 11, cls: 'gold' }), D.text('', 346, B[0] + 55, '3', { size: 11, cls: 'muted', mono: true })),
        op('l-op', B[0], 'genes.append("FOS")'),
        D.g('tuple', lab(B[1], 'tuple', 'ordered,\ncannot change'), code(B[1], 'loc = ("chr6", 31815464)'),
          D.box('', 118, B[1] + 20, 60, 26, '"chr6"', { mono: true, size: 11, cls: 'violet' }), D.box('', 184, B[1] + 20, 96, 26, '31815464', { mono: true, size: 11, cls: 'violet' }),
          D.text('', 148, B[1] + 55, '0', { size: 11, cls: 'muted', mono: true }), D.text('', 232, B[1] + 55, '1', { size: 11, cls: 'muted', mono: true })),
        op('t-op', B[1], 'loc[0] = "chr7"   # TypeError', 'red'),
        D.g('set', lab(B[2], 'set', 'unique items,\nno order'), code(B[2], 'bases = {"A", "C", "G", "T"}'),
          D.box('', 118, B[2] + 18, 170, 38, '', { cls: 'ghost', r: 19 }),
          [['"G"', 150, 30], ['"A"', 192, 44], ['"T"', 232, 28], ['"C"', 262, 44]].map(([t, x, dy]) => D.text('', x, B[2] + dy, t, { size: 12, mono: true, weight: 700 }))),
        op('s-op', B[2], '"G" in bases   # True'),
        D.g('dict', lab(B[3], 'dict', 'look up a value\nby its key'), code(B[3], 'counts = {"ACTB": 44289, "TP53": 613}'),
          [['"ACTB"', '44289', 118], ['"TP53"', '613', 258]].map(([k, v, x]) => [D.box('', x, B[3] + 20, 60, 26, k, { mono: true, size: 11, cls: 'orange' }), D.arrow('', x + 62, B[3] + 33, x + 76, B[3] + 33), D.box('', x + 78, B[3] + 20, 52, 26, v, { mono: true, size: 11 })])),
        op('d-op', B[3], 'counts["TP53"]   # 613'));
    },
    steps: [
      { cap: 'A **list** keeps items in order, with positions from 0, and can change: `genes.append("FOS")` adds an item at the end. Repeats are allowed: ACTB appears twice.', show: ['l-op', 'l-fos'], hi: ['list', 'l-fos'] },
      { cap: 'A **tuple** is ordered but cannot change once made, which suits fixed records such as a chromosome and a position. `loc[0] = "chr7"` raises a TypeError.', show: ['tuple', 't-op'], hi: ['tuple'] },
      { cap: 'A **set** keeps each item once and has no order, so there is no position 0. It answers "is this in?" quickly: `"G" in bases` is True.', show: ['set', 's-op'], hi: ['set'] },
      { cap: 'A **dict** links keys to values, so you look up by name, not by position: `counts["TP53"]` gives 613, the TP53 count in ctrl_1.', show: ['dict', 'd-op'], hi: ['dict'] },
      { cap: 'Pick by job: a list for an ordered collection that may grow, a tuple for a fixed record, a set for unique items, a dict for lookup by name.', hi: [] }
    ]
  });

  /* ---------- 17. NumPy axes ---------- */
  const NP = { genes: ['HSPA1A', 'TP53', 'FOS'], samples: ['ctrl_1', 'ctrl_2', 'heat_1', 'heat_2'], v: [[212, 282, 11018, 8441], [613, 868, 881, 603], [220, 223, 311, 1906]] };
  def('numpy-axes', {
    title: 'NumPy arrays: shape and axis',
    summary: 'A 3 by 4 array of practice counts (genes HSPA1A, TP53 and FOS by samples ctrl_1, ctrl_2, heat_1 and heat_2) with shape (3, 4); mean with axis=0 gives one value per sample, mean with axis=1 one value per gene, and np.log2(arr + 1) transforms every value at once.',
    build(D) {
      const cx = (j) => 98 + j * 64, cy = (i) => 75 + i * 32;
      const m0 = [0, 1, 2, 3].map((j) => NP.v.reduce((a, r) => a + r[j], 0) / 3), m1 = NP.v.map((r) => r.reduce((a, b) => a + b, 0) / 4);
      const band = (x, y, w, hh) => D.s('rect', { x, y, width: w, height: hh, rx: 8, style: 'fill: var(--dg-hi-fill); stroke: var(--dg-hi); stroke-width: 1.5' });
      return D.svg(400, 296,
        codeLines(D, 'code', 8, 4, 384, 32, [['cmd', 'arr.shape   # (3, 4)']], { size: 13, top: 16 }),
        D.g('b0', [0, 1, 2, 3].map((j) => band(cx(j) - 30, 60, 60, 160)), [0, 1, 2, 3].map((j) => D.arrow('', cx(j), 163, cx(j), 186, { cls: 'gold' }))),
        D.g('b1', [0, 1, 2].map((i) => band(68, cy(i) - 14, 328, 28)), [0, 1, 2].map((i) => D.arrow('', 324, cy(i), 340, cy(i), { cls: 'gold' }))),
        D.g('grid', D.s('rect', { x: 66, y: 58, width: 256, height: 98, rx: 6, style: 'fill: none; stroke: var(--dg-line); stroke-width: 1.4' }),
          [1, 2, 3].map((j) => D.line('', 66 + j * 64, 60, 66 + j * 64, 154, { cls: 'thin' })), [1, 2].map((i) => D.line('', 68, 59 + i * 32, 320, 59 + i * 32, { cls: 'thin' })),
          NP.v.map((r, i) => r.map((v, j) => D.text('v' + i + j, cx(j), cy(i), String(v), { size: 13, mono: true })))),
        NP.samples.map((t, j) => D.text('', cx(j), 48, t, { size: 11, mono: true, weight: 700 })),
        NP.genes.map((t, i) => D.text('', 60, cy(i), t, { size: 11, mono: true, weight: 700, anchor: 'end' })),
        D.g('m0', D.text('', 60, 202, 'mean', { size: 11, weight: 700, anchor: 'end', cls: 'gold' }), m0.map((v, j) => D.text('', cx(j), 202, fmt(v, 2), { size: 12, mono: true, weight: 700 }))),
        D.g('m1', D.text('', 368, 48, 'mean', { size: 11, weight: 700, cls: 'gold' }), m1.map((v, i) => D.text('', 368, cy(i), fmt(v, 2), { size: 12, mono: true, weight: 700 }))),
        D.text('l0', 200, 240, 'axis=0: down the rows, one value per column', { size: 12, cls: 'gold' }),
        D.text('l1', 200, 262, 'axis=1: across the columns, one value per row', { size: 12, cls: 'gold' }),
        D.text('aid', 200, 284, 'the axis you name is the one that disappears', { size: 12, weight: 700 }));
    },
    steps: [
      { cap: 'A NumPy **array** is a grid of numbers of one type. Here: practice counts for 3 genes (rows) in 4 samples (columns), so `arr.shape` is `(3, 4)`, rows first.', show: [], hi: ['grid'] },
      { cap: '`arr.mean(axis=0)` works **down** each column and collapses the rows: one mean per sample. For heat_1: (11018 + 881 + 311) / 3 = 4070.', show: ['b0', 'm0', 'l0'], set: { cmd: 'arr.mean(axis=0)' }, hi: ['m0'] },
      { cap: '`arr.mean(axis=1)` works **across** each row and collapses the columns: one mean per gene. For HSPA1A: (212 + 282 + 11018 + 8441) / 4 = 4988.25.', show: ['b1', 'm1', 'l1'], hide: ['b0'], set: { cmd: 'arr.mean(axis=1)' }, hi: ['m1'] },
      { cap: 'A memory aid: the axis you name is the one that disappears. axis=0 removes the 3 rows (4 values left), axis=1 removes the 4 columns (3 values left).', show: ['aid'], hide: ['b1'], set: { cmd: 'arr.mean(axis=0).shape   # (4,)' }, hi: ['aid'] },
      { cap: 'Arithmetic applies to every element at once, with no loop: `np.log2(arr + 1)` transforms all 12 counts in one step (shown rounded to 1 decimal).', hide: ['m0', 'm1', 'l0', 'l1', 'aid'], set: Object.assign({ cmd: 'np.log2(arr + 1).round(1)' }, (() => { const o = {}; NP.v.forEach((r, i) => r.forEach((v, j) => { o['v' + i + j] = fmt(Math.log2(v + 1), 1); })); return o; })()), hi: ['grid'] }
    ]
  });

  /* ---------- 18. pandas DataFrame ---------- */
  const DF = [['HSPA1A', 212, 11018, 8441], ['HSPA6', 2, 999, 725], ['ACTB', 44289, 55945, 39466], ['TP53', 613, 881, 603]];
  def('dataframe', {
    title: 'A pandas DataFrame: index, columns, values',
    summary: 'Part of the practice counts as a pandas DataFrame: gene names as the index, sample names as the columns and counts as the values; selecting the heat_1 column, the ACTB row, and filtering with heat_1 > 10000, which keeps 5 of the 12 genes.',
    build(D) {
      const ry = (i) => 94 + i * 28, colx = [96, 172, 248], cols = ['ctrl_1', 'heat_1', 'heat_2'];
      return D.svg(400, 300,
        codeLines(D, 'code', 6, 4, 388, 32, [['cmd', 'df = pd.read_csv("counts.tsv", sep="\\t", index_col=0)']], { size: 11, top: 16 }),
        D.text('lab-idx', 52, 48, 'index', { size: 12, cls: 'gold' }), D.text('lab-col', 210, 48, 'columns', { size: 12, cls: 'gold' }),
        D.s('rect', { x: 8, y: 56, width: 316, height: 152, rx: 8, style: 'fill: var(--dg-fill); stroke: var(--dg-line); stroke-width: 1.4' }),
        D.g('idx', D.s('rect', { x: 9, y: 81, width: 87, height: 126, rx: 6, style: 'fill: var(--blue-soft)' })),
        D.g('cols', D.s('rect', { x: 96, y: 57, width: 227, height: 24, rx: 6, style: 'fill: var(--surface-3)' }), cols.map((t, j) => D.text('', colx[j] + 38, 69, t, { size: 12, mono: true, weight: 700 }))),
        D.text('', 16, 69, 'gene', { size: 11, mono: true, cls: 'muted', anchor: 'start' }),
        D.g('colH', D.s('rect', { x: 174, y: 59, width: 72, height: 146, rx: 6, style: 'fill: none; stroke: var(--dg-hi); stroke-width: 3' })),
        DF.map((r, i) => D.g('row' + (i + 1),
          D.g(r[0] === 'ACTB' ? 'rowA' : '', D.s('rect', { x: 10, y: ry(i) - 13, width: 312, height: 26, rx: 6, style: 'fill: none; stroke: none' })),
          D.text('', 16, ry(i), r[0], { size: 12, mono: true, weight: 700, anchor: 'start' }),
          r.slice(1).map((v, j) => D.text('', colx[j] + 66, ry(i), String(v), { size: 12, mono: true, anchor: 'end' })),
          D.g('mask', D.box('', 334, ry(i) - 12, 58, 24, r[2] > 10000 ? 'True' : 'False', { cls: r[2] > 10000 ? 'green' : 'muted', mono: true, size: 12, weight: 700 })))),
        D.g('mask', D.text('', 363, 63, 'heat_1', { size: 11, mono: true }), D.text('', 363, 75, '> 10000', { size: 11, mono: true })),
        D.text('', 16, 200, '... 8 more genes', { size: 11, cls: 'muted', anchor: 'start' }),
        D.text('', 324, 222, 'showing 4 of 12 genes, 3 of 6 samples', { size: 11, cls: 'muted', anchor: 'end' }),
        pre(D.text('o1', 12, 252, '', { size: 12, mono: true, anchor: 'start', cls: 'muted' })),
        pre(D.text('o2', 12, 274, '', { size: 12, mono: true, anchor: 'start', weight: 700 })));
    },
    steps: [
      { cap: '`pd.read_csv("counts.tsv", sep="\\t", index_col=0)` reads the practice counts into a **DataFrame**. `index_col=0` makes the gene names the **index**: row labels, not data.', show: ['lab-idx'], hide: ['colH'], hi: ['idx'] },
      { cap: 'Across the top are the **columns** (samples), and inside are the **values**. `df.shape` is `(12, 6)`: 12 rows by 6 columns, of which only a part is shown here.', show: ['lab-col', 'o1', 'o2'], set: { o1: 'df.shape', o2: '(12, 6)' }, hi: ['cols'] },
      { cap: '`df["heat_1"]` selects one column by its name. The result is a **Series**: one value per gene, still labeled with the gene names.', show: ['colH'], set: { cmd: 'df["heat_1"]', o1: 'one column: a Series of 12 values', o2: 'HSPA1A 11018, HSPA1B 10345, ...' }, hi: [] },
      { cap: '`df.loc["ACTB"]` selects one row by its index label: the ACTB counts in all 6 samples. `loc` always works with labels.', hide: ['colH'], set: { cmd: 'df.loc["ACTB"]', o1: 'ctrl_1 to heat_3:', o2: '44289 46223 46941 55945 39466 49070' }, hi: ['rowA'] },
      { cap: '`df["heat_1"] > 10000` compares every value in that column and gives True or False per gene. Put it inside `df[...]` to keep only the True rows.', show: ['mask', 'colH'], set: { cmd: 'df[df["heat_1"] > 10000]', o1: '', o2: '' }, hi: ['mask'] },
      { cap: 'In the full table the filter keeps 5 of the 12 genes: HSPA1A, HSPA1B, ACTB, GAPDH and EEF1A1. Here HSPA6 and TP53 drop out.', hide: ['row2', 'row4', 'colH'], move: { row3: [0, -28] }, set: { cmd: 'df[df["heat_1"] > 10000].index.tolist()', o1: '', o2: "['HSPA1A', 'HSPA1B', 'ACTB', 'GAPDH', 'EEF1A1']" }, hi: ['o2'] }
    ]
  });

  /* ---------- 19. Choosing a plot ---------- */
  def('plot-choice', {
    title: 'Pick the plot from the question',
    summary: 'Five questions matched to plot types and pandas calls: distribution of one variable (histogram, df.plot.hist), comparing groups (boxplot, df.boxplot), two numbers together (scatter, df.plot.scatter), values in order such as time (line, df.plot.line) and counts per category (bar chart, df.plot.bar).',
    build(D) {
      const rows = [['How is one variable spread?', 'histogram (or boxplot)', 'df.plot.hist()'], ['Do groups differ?', 'boxplot', 'df.boxplot()'],
        ['Do two numbers move together?', 'scatter plot', 'df.plot.scatter(x=..., y=...)'], ['How does a value change over time?', 'line plot', 'df.plot.line()'], ['How many in each category?', 'bar chart', 'df.plot.bar()']];
      const poly = (pts) => D.s('polygon', { points: pts, style: 'fill: var(--blue-soft); stroke: var(--blue); stroke-width: 1.2' });
      const barP = (x, w, base, top) => poly(`${x},${base} ${x},${top} ${x + w},${top} ${x + w},${base}`);
      const icons = [
        (y) => [D.line('', 16, y + 52, 84, y + 52, { cls: 'axis' }), [14, 30, 40, 26, 14, 8].map((v, i) => barP(20 + i * 10, 10, y + 52, y + 52 - v))],
        (y) => [[[32, 24, 32, 38, 44, 54], [66, 8, 16, 22, 30, 40]].map(([cx, wt, bt, md, bb, wb]) => [D.line('', cx, y + wt, cx, y + wb), poly(`${cx - 9},${y + bt} ${cx + 9},${y + bt} ${cx + 9},${y + bb} ${cx - 9},${y + bb}`), D.s('line', { x1: cx - 9, y1: y + md, x2: cx + 9, y2: y + md, style: 'stroke: var(--heading); stroke-width: 2.4' })])],
        (y) => [D.line('', 16, y + 52, 84, y + 52, { cls: 'axis' }), D.line('', 16, y + 8, 16, y + 52, { cls: 'axis' }), [[22, 46], [30, 42], [36, 38], [44, 36], [50, 28], [58, 26], [66, 18], [76, 14]].map(([a, b]) => D.dot('', a, y + b, 3))],
        (y) => [D.line('', 16, y + 52, 84, y + 52, { cls: 'axis' }), D.path('', `M20,${y + 44} L32,${y + 36} L44,${y + 38} L56,${y + 24} L68,${y + 20} L80,${y + 12}`, { cls: 'gold' }), [[20, 44], [32, 36], [44, 38], [56, 24], [68, 20], [80, 12]].map(([a, b]) => D.dot('', a, y + b, 2.6))],
        (y) => [D.line('', 16, y + 52, 84, y + 52, { cls: 'axis' }), [30, 16, 40, 22].map((v, i) => barP(22 + i * 16, 10, y + 52, y + 52 - v))]
      ];
      return D.svg(400, 346, rows.map(([q, plot, code], i) => {
        const y = 6 + i * 68;
        return D.g('p' + (i + 1), D.box('', 8, y, 84, 62, '', { cls: 'file' }), icons[i](y),
          D.text('', 104, y + 14, q, { size: 12.5, weight: 700, anchor: 'start' }), D.text('', 104, y + 32, plot, { size: 12, anchor: 'start', cls: 'blue' }),
          D.text('', 104, y + 50, code, { size: 11, mono: true, anchor: 'start' }));
      }));
    },
    steps: [
      { cap: 'One variable: how are its values spread? A **histogram** shows the shape; a boxplot gives a compact summary. In pandas: `df.plot.hist()`.', show: [], hi: ['p1'] },
      { cap: 'Do groups differ? A **boxplot** per group shows medians and spread side by side: `df.boxplot()` (or `df.plot.box()`).', hi: ['p2'] },
      { cap: 'Two numbers measured on the same samples: do they move together? A **scatter plot**, one dot per sample: `df.plot.scatter(x="ctrl_1", y="ctrl_2")`.', hi: ['p3'] },
      { cap: 'Values in an order, such as time points: a **line plot** connects them so the trend is easy to follow: `df.plot.line()`.', hi: ['p4'] },
      { cap: 'How many in each category? A **bar chart**: `df.plot.bar()`. Its bars have gaps because categories are separate, unlike the touching bins of a histogram.', hi: ['p5'] },
      { cap: 'Start from the question, then pick the plot. Label both axes (with units) and keep one message per plot.', hi: [] }
    ]
  });
  /* ---------- 20. PCA ---------- */
  // prcomp() on log2(CPM + 1) of the 12 practice genes (library sizes in millions, as in the topic example):
  // PC1 95.5%, PC2 4.0%. Two-gene illustration: prcomp() on HSPA1A and HSPA1B only, PC1 direction (0.7016, 0.7126).
  const PCA = {
    two: [[3.646, 3.371], [3.782, 3.342], [3.459, 3.110], [8.810, 8.719], [8.884, 8.681], [9.001, 8.479]], mid: [6.264, 5.950], dir: [0.7016, 0.7126],
    pcs: [[-5.037, 0.011], [-4.934, 0.175], [-5.023, -0.233], [4.819, 0.969], [5.163, -2.005], [5.012, 1.083]]
  };
  def('pca', {
    title: 'PCA: many genes squeezed into two axes',
    summary: 'Illustration computed from the 12 practice genes: each sample has many gene values; with two genes, PC1 is the direction of most spread and PC2 is perpendicular to it; on PC1 and PC2 the three controls and the three heat samples form two groups, PCA never used the labels, and an outlier sample would sit apart.',
    build(D) {
      const B = BB.data && BB.data.bulk;
      const lib = B ? B.libsize.map((v) => v / 1e6) : [18.4, 22.1, 20.3, 24.6, 17.9, 21.2];
      const genes = B ? B.genes.slice(0, 12) : [];
      const names = ['ctrl_1', 'ctrl_2', 'ctrl_3', 'heat_1', 'heat_2', 'heat_3'];
      const lc = (g, j) => Math.log2(g.c[j] / lib[j] + 1);
      // two-gene scatter
      const TX = (v) => 110 + (v - 2.5) * 25, TY = (v) => 318 - (v - 2.5) * 25;
      const along = (t, d) => [PCA.mid[0] + t * d[0], PCA.mid[1] + t * d[1]], perp = [-PCA.dir[1], PCA.dir[0]];
      const p1a = along(-4.6, PCA.dir), p1b = along(4.6, PCA.dir), p2a = along(-1.3, perp), p2b = along(1.3, perp);
      // PCA plot
      const PX = (v) => 220 + v * 24, PY = (v) => 236 - v * 24;
      const diamond = (k, x, y) => D.s('path', { k, d: `M${x},${y - 7} L${x + 7},${y} L${x},${y + 7} L${x - 7},${y} Z`, style: 'fill: var(--red); stroke: var(--surface); stroke-width: 1' });
      return D.svg(400, 344,
        D.g('mat', D.text('', 200, 9, '12 genes per sample here (stronger color = higher)', { size: 11, cls: 'muted' }),
          names.map((n, r) => D.text('', 54, 25 + r * 13, n, { size: 11, mono: true, anchor: 'end' })),
          genes.map((g, c) => names.map((n, r) => { const x = 60 + c * 26, y = 19 + r * 13; return D.s('polygon', { points: `${x},${y} ${x + 24},${y} ${x + 24},${y + 11} ${x},${y + 11}`, style: `fill: var(--blue); fill-opacity: ${(0.06 + 0.86 * lc(g, r) / 12.4).toFixed(2)}` }); })),
          D.s('rect', { x: 56, y: 15, width: 316, height: 82, rx: 6, fill: 'transparent', stroke: 'none', style: 'fill-opacity: 0' })),
        D.g('two', D.line('', 110, 318, 300, 318, { cls: 'axis' }), D.line('', 110, 318, 110, 128, { cls: 'axis' }),
          D.text('', 205, 333, 'HSPA1A (log2 CPM)', { size: 11, cls: 'muted' }), D.text('', 104, 121, 'HSPA1B', { size: 11, cls: 'muted', anchor: 'start' }),
          PCA.two.map(([a, b]) => D.s('circle', { cx: TX(a), cy: TY(b), r: 5, style: 'fill: var(--text-2); stroke: var(--surface); stroke-width: 1' }))),
        D.g('pc1', D.arrow('', TX(p1a[0]), TY(p1a[1]), TX(p1b[0]), TY(p1b[1]), { cls: 'gold' }), D.text('', TX(p1b[0]) + 8, TY(p1b[1]) + 4, 'PC1', { size: 13, weight: 700, anchor: 'start', cls: 'gold' })),
        D.g('pc2', D.arrow('', TX(p2a[0]), TY(p2a[1]), TX(p2b[0]), TY(p2b[1]), { cls: 'blue' }), D.text('', TX(p2b[0]) - 6, TY(p2b[1]) - 6, 'PC2', { size: 13, weight: 700, anchor: 'end', cls: 'blue' })),
        D.g('pca', D.line('', 40, 312, 392, 312, { cls: 'axis' }), D.line('', 40, 312, 40, 150, { cls: 'axis' }),
          D.text('', 216, 328, 'PC1 (95.5% of the variation)', { size: 11, cls: 'muted' }), D.text('', 46, 154, 'PC2 (4.0%)', { size: 11, cls: 'muted', anchor: 'start' }),
          D.line('', PX(0), 306, PX(0), 312, { cls: 'thin' }), D.text('', PX(0), 300, '0', { size: 11, cls: 'muted' }),
          PCA.pcs.map(([a, b]) => D.s('circle', { cx: PX(a), cy: PY(b), r: 5.5, style: 'fill: var(--text-2); stroke: var(--surface); stroke-width: 1' }))),
        D.g('col', PCA.pcs.map(([a, b], i) => i < 3 ? D.dot('', PX(a), PY(b), 6) : diamond(i === 4 ? 'h2' : '', PX(a), PY(b))),
          D.text('', PX(-5), PY(1.2), 'controls', { size: 12, weight: 700, cls: 'blue' }), D.text('', PX(4.0), PY(1.85), 'heat', { size: 12, weight: 700, cls: 'red' }),
          D.text('h2lab', PX(5.163) - 12, PY(-2.005), 'heat_2', { size: 11, mono: true, anchor: 'end' }),
          D.dot('', 266, 168, 5), D.text('', 276, 168, 'control', { size: 11, anchor: 'start' }), diamond('', 330, 168), D.text('', 340, 168, 'heat', { size: 11, anchor: 'start' })),
        D.g('out', D.s('circle', { cx: PX(-2), cy: PY(1.4), r: 8, style: 'fill: none; stroke: var(--dg-hi); stroke-width: 2; stroke-dasharray: 3 3' }),
          D.text('', PX(-2), PY(1.4) - 16, 'a failed sample would sit apart (imagined)', { size: 11, cls: 'gold' })));
    },
    steps: [
      { cap: 'Each sample is described by many gene values: 12 in the practice counts (log2 CPM, stronger color means higher), thousands in real data. Far too many axes to plot at once.', show: [], hide: ['pca', 'col', 'out', 'pc1', 'pc2', 'two'], hi: ['mat'] },
      { cap: 'Take just two genes, HSPA1A and HSPA1B: each sample becomes a point. **PC1** is the direction along which the samples spread the most.', show: ['two', 'pc1'], hi: ['pc1'] },
      { cap: '**PC2** is the next direction, at a right angle to PC1, catching what is left. With thousands of genes, PCA finds such directions the same way, ranked by how much they explain.', show: ['pc2'], hi: ['pc2'] },
      { cap: 'Now all 12 genes, with `prcomp()` on the practice counts, plotted on PC1 and PC2. Three samples sit on the left, three on the right. PC1 holds 95.5% of the variation.', show: ['pca'], hide: ['two', 'pc1', 'pc2'], hi: [] },
      { cap: 'Only now add the labels: the left group is the 3 controls, the right group the 3 heat samples. PCA never used the labels (it is **unsupervised**), so heat is the main source of variation.', show: ['col'], hi: [] },
      { cap: 'An outlier, such as a failed sample, would sit far from its group (dashed circle, imagined). Here heat_2 sits a little apart on PC2, which holds only 4%, mainly because of its high FOS count.', show: ['out'], hi: ['h2', 'h2lab'] }
    ]
  });

  /* ---------- 21. Volcano plot ---------- */
  def('volcano', {
    title: 'A volcano plot: effect size and evidence',
    summary: 'All 1,512 simulated genes of the practice data, plotted by log2 fold change (across) and minus log10 of the adjusted p-value (up), with dashed cutoffs at log2 fold change -1 and +1 and adjusted p 0.05; 13 genes are up and significant, 4 down, and HSPA1A is labeled.',
    build(D) {
      const G = (BB.data && BB.data.bulk && BB.data.bulk.genes) || [];
      const X = (l) => 60 + (l + 3) * 36, Y = (v) => 300 - v * 85, ny = (g) => -Math.log10(g.padj);
      const up = G.filter((g) => g.padj < 0.05 && g.lfc > 1), down = G.filter((g) => g.padj < 0.05 && g.lfc < -1);
      const hs = G.find((g) => g.g === 'HSPA1A') || { lfc: 5.265, padj: 0.00353 }, bag = G.find((g) => g.g === 'BAG3') || { lfc: 1.822, padj: 0.149 };
      return D.svg(400, 340,
        D.line('', 60, 300, 388, 300, { cls: 'axis' }), D.line('', 60, 300, 60, 34, { cls: 'axis' }),
        [-2, 0, 2, 4, 6].map((v) => D.text('', X(v), 312, String(v), { size: 11, cls: 'muted' })),
        [0, 1, 2, 3].map((v) => D.text('', 52, Y(v), String(v), { size: 11, cls: 'muted', anchor: 'end' })),
        D.text('', 224, 330, 'log2 fold change (heat versus control)', { size: 12, cls: 'muted' }),
        D.text('', 66, 30, '-log10(adjusted p)', { size: 12, cls: 'muted', anchor: 'start' }),
        D.g('dots', G.map((g) => D.s('circle', { cx: X(g.lfc).toFixed(1), cy: Y(ny(g)).toFixed(1), r: 1.9, style: 'fill: var(--border-strong)' }))),
        D.g('vl', D.line('', X(-1), 300, X(-1), 56, { cls: 'dash' }), D.line('', X(1), 300, X(1), 56, { cls: 'dash' }),
          D.text('', X(-1), 46, '-1', { size: 12, weight: 700 }), D.text('', X(1), 46, '+1', { size: 12, weight: 700 })),
        D.g('hl', D.line('', 60, Y(1.301), 388, Y(1.301), { cls: 'dash' }), D.text('', 386, Y(1.301) - 9, 'padj 0.05', { size: 11, weight: 700, anchor: 'end' })),
        D.g('sig', up.map((g) => D.dot('', X(g.lfc), Y(ny(g)), 3.6, { cls: 'red' })), down.map((g) => D.dot('', X(g.lfc), Y(ny(g)), 3.6))),
        D.g('reg', D.text('', 300, 58, 'up: ' + up.length + ' genes', { size: 12, weight: 700, cls: 'red' }), D.text('', 98, 120, 'down: ' + down.length, { size: 12, weight: 700, cls: 'blue' }),
          D.text('', 330, 262, 'not significant: ' + (G.length - up.length - down.length).toLocaleString('en-US'), { size: 12, weight: 700, cls: 'muted' })),
        D.g('labh', D.line('', X(hs.lfc) - 5, Y(ny(hs)), 322, Y(ny(hs)), { cls: 'thin' }), D.text('', 318, Y(ny(hs)), 'HSPA1A', { size: 12, weight: 700, mono: true, anchor: 'end' })),
        D.g('labb', D.dot('', X(bag.lfc), Y(ny(bag)), 3.6, { cls: 'gold' }), D.line('', X(bag.lfc) + 4, Y(ny(bag)) + 2, 296, 244, { cls: 'thin' }), D.text('', 300, 244, 'BAG3', { size: 12, weight: 700, mono: true, anchor: 'start' })));
    },
    steps: [
      { cap: 'Each dot is one gene: 1,512 simulated genes from the practice data. Across: the **log2 fold change**, heat versus control. Up: **minus log10 of the adjusted p-value**.', show: [], hi: [] },
      { cap: 'Right of 0 means higher after heat, left means lower. +1 is double and -1 is half, so the dashed lines at -1 and +1 mark a two-fold change.', show: ['vl'], hi: ['vl'] },
      { cap: 'Higher means stronger evidence: padj = 0.05 sits at 1.3 (minus log10 of 0.05) and padj = 0.001 at 3. The dashed line marks padj = 0.05.', show: ['hl'], hi: ['hl'] },
      { cap: 'Upper right: **up** in heat and significant (13 genes: padj below 0.05 and log2 fold change above 1). Upper left: **down** (4 genes). The other 1,495 are not significant.', show: ['sig', 'reg'], hi: ['reg'] },
      { cap: 'HSPA1A: log2 fold change 5.27 (about 38 times higher) with padj 0.0035. Five of the 13 up genes are heat-shock genes, as expected for cells at 42 C.', show: ['labh'], hi: ['labh'] },
      { cap: 'Both cutoffs matter: BAG3 rises 3.5-fold (log2 fold change 1.82) but its padj is 0.149, so it is not called. These data are simulated; tools such as DESeq2 model real counts more carefully.', show: ['labb'], hi: ['labb'] }
    ]
  });

  /* ---------- 22. Bulk versus single-cell ---------- */
  // Six cells from BB.data.single (T: cells 5 and 10, B: cells 8 and 21, monocytes: cells 0 and 1), counts of CD3E, MS4A1, LYZ.
  const BVS = { order: ['T', 'B', 'M', 'T', 'M', 'B'], counts: [[3, 0, 0], [0, 7, 0], [0, 0, 8], [4, 0, 0], [0, 0, 10], [0, 4, 0]] };
  def('bulk-vs-single', {
    title: 'Bulk versus single-cell RNA-seq',
    summary: 'Six blood cells (two T cells, two B cells, two monocytes) give one averaged profile in bulk RNA-seq (CD3E 1.2, MS4A1 1.8, LYZ 3.0) but one profile per cell in single-cell RNA-seq, where grouping similar cells reveals the cell types and most values are zero.',
    build(D) {
      const cls = { T: 'blue', B: 'green', M: 'orange' }, gx = [278, 324, 370], genes = ['CD3E', 'MS4A1', 'LYZ'];
      const avg = [0, 1, 2].map((j) => BVS.counts.reduce((a, r) => a + r[j], 0) / BVS.counts.length);
      const cells = SC().cells || [];
      const zeroPct = cells.length ? Math.round(100 * cells.reduce((a, c) => a + c.e.filter((v) => v === 0).length, 0) / cells.reduce((a, c) => a + c.e.length, 0)) : 72;
      const bar = (x, v) => D.s('polygon', { points: `${x - 14},252 ${x - 14},${252 - v * 18} ${x + 14},${252 - v * 18} ${x + 14},252`, style: 'fill: var(--violet-soft); stroke: var(--violet); stroke-width: 1.2' });
      return D.svg(400, 336,
        D.text('', 200, 9, 'one blood sample', { size: 11, cls: 'muted' }),
        D.box('sample', 92, 17, 216, 54, '', { cls: 'ghost', r: 27 }),
        BVS.order.map((t, i) => D.box('c' + (i + 1), 108 + i * 32, 30, 26, 26, t, { cls: cls[t], r: 13, size: 12, weight: 700 })),
        D.g('bulk', D.arrow('', 150, 74, 100, 98), D.box('', 8, 100, 184, 26, 'bulk RNA-seq', { cls: 'navy', size: 12, weight: 700 }),
          D.text('', 100, 142, 'one profile per sample', { size: 11, cls: 'muted' }),
          genes.map((g, j) => [bar(52 + j * 48, avg[j]), D.text('', 52 + j * 48, 244 - avg[j] * 18, fmt(avg[j], 1), { size: 12, mono: true, weight: 700 }), D.text('', 52 + j * 48, 264, g, { size: 11, mono: true })]),
          D.line('', 26, 252, 174, 252, { cls: 'axis' }), D.text('', 100, 284, 'average of all 6 cells', { size: 11, cls: 'muted' })),
        D.g('sc', D.arrow('', 250, 74, 300, 98), D.box('', 208, 100, 184, 26, 'single-cell RNA-seq', { cls: 'navy', size: 12, weight: 700 }),
          D.text('', 300, 142, 'one profile per cell', { size: 11, cls: 'muted' }),
          genes.map((g, j) => D.text('', gx[j], 160, g, { size: 11, mono: true, weight: 700 })),
          BVS.counts.map((r, i) => D.g('row' + (i + 1), D.text('', 212, 178 + i * 18, 'cell ' + (i + 1), { size: 11, anchor: 'start' }),
            r.map((v, j) => v === 0 ? D.g('z', D.s('rect', { x: gx[j] - 11, y: 170 + i * 18, width: 22, height: 16, rx: 4, fill: 'transparent', stroke: 'none' }), D.text('', gx[j], 178 + i * 18, '0', { size: 12, mono: true, cls: 'muted' }))
              : D.text('', gx[j], 178 + i * 18, String(v), { size: 12, mono: true, weight: 700 })),
            D.text('ty', 396, 178 + i * 18, BVS.order[i], { size: 12, weight: 700, anchor: 'end', cls: cls[BVS.order[i]] })))),
        D.text('zn', 300, 300, '12 of these 18 values are 0', { size: 12, weight: 700 }),
        D.text('zp', 300, 318, zeroPct + '% zeros in the practice data', { size: 11, cls: 'muted' }));
    },
    steps: [
      { cap: 'A blood sample is a mixture of cell types: T cells, B cells and monocytes (letters T, B and M). Here, six cells from the practice single-cell data.', show: [], hi: ['sample'] },
      { cap: '**Bulk RNA-seq** pools the RNA of all the cells: one profile per sample. Each gene gets one average, so the cell types blur together.', show: ['bulk'], hi: ['bulk'] },
      { cap: '**Single-cell RNA-seq** keeps the cells apart: one profile per cell, one row per cell (counts of RNA molecules for each gene).', show: ['sc'], hi: [] },
      { cap: 'Group cells with similar profiles and the types appear: CD3E marks T cells, MS4A1 B cells and LYZ monocytes. The bulk average cannot show this.', show: ['ty'], move: { row4: [0, -36], row2: [0, 18], row6: [0, -36], row3: [0, 36], row5: [0, 18] }, hi: ['ty'] },
      { cap: 'Single-cell data are **sparse**: most values are 0, because each cell holds little RNA and only part of it is captured. Here 12 of 18; in the practice data 72%.', show: ['zn', 'zp'], hi: ['z'] }
    ]
  });

  /* ---------- 23. AnnData ---------- */
  // Four cells of BB.data.single (cells 5, 8, 1 and 10); sample names are made up for the illustration.
  const AD = { genes: ['CD3E', 'MS4A1', 'LYZ', 'MT-CO1'], hv: ['True', 'True', 'True', 'False'],
    obs: [['cell_1', 's1', 951, 0], ['cell_2', 's1', 797, 1], ['cell_3', 's2', 835, 2], ['cell_4', 's2', 766, 0]], X: [[3, 0, 0, 3], [0, 7, 0, 6], [0, 0, 10, 3], [4, 0, 0, 3]] };
  def('anndata', {
    title: 'AnnData: one object for a single-cell experiment',
    summary: 'The AnnData layout: X in the middle with one row per cell and one column per gene, obs on the left with one row per cell (cell id, sample, n_genes, cluster), var on top with one row per gene (gene name, highly_variable); adata.shape gives (cells, genes).',
    build(D) {
      const gx = (j) => 238 + j * 44, ry = (i) => 88 + i * 28, ox = [6, 74, 128, 182];
      const nCells = (SC().cells || []).length || 418, nGenes = (SC().genes || []).length || 12;
      return D.svg(400, 300,
        D.g('var', D.s('rect', { x: 216, y: 4, width: 176, height: 50, rx: 8, style: 'fill: var(--orange-soft); stroke: var(--orange); stroke-width: 1.4' }),
          AD.genes.map((g, j) => D.text('', gx(j), 18, g, { size: 11, mono: true, weight: 700 })), AD.hv.map((t, j) => D.text('', gx(j), 41, t, { size: 11, mono: true })),
          D.text('', 210, 41, 'highly_variable', { size: 11, mono: true, anchor: 'end' }), D.text('', 6, 16, 'var: one row per gene', { size: 12, weight: 700, anchor: 'start', cls: 'orange' })),
        D.g('obs', D.s('rect', { x: 2, y: 58, width: 208, height: 130, rx: 8, style: 'fill: var(--violet-soft); stroke: var(--violet); stroke-width: 1.4' }),
          ['', 'sample', 'n_genes', 'cluster'].map((t, j) => D.text('', j ? ox[j] : 6, 68, t, { size: 11, mono: true, weight: 700, anchor: j ? 'middle' : 'start' })),
          AD.obs.map((r, i) => r.map((v, j) => D.text('', j ? ox[j] : 6, ry(i), String(v), { size: 11, mono: true, anchor: j ? 'middle' : 'start', weight: j ? null : 700 }))),
          D.text('', 106, 202, 'obs: one row per cell', { size: 12, weight: 700, cls: 'violet' })),
        D.g('X', D.s('rect', { x: 216, y: 58, width: 176, height: 130, rx: 8, style: 'fill: var(--blue-soft); stroke: var(--blue); stroke-width: 1.4' }),
          AD.X.map((r, i) => r.map((v, j) => D.text('', gx(j), ry(i), String(v), { size: 13, mono: true, weight: v ? 700 : null, cls: v ? null : 'muted' }))),
          D.text('', 304, 202, 'X: cells by genes', { size: 12, weight: 700, cls: 'blue' })),
        D.g('r2', D.s('rect', { x: 4, y: ry(1) - 12, width: 386, height: 24, rx: 6, fill: 'transparent', stroke: 'none', style: 'fill-opacity: .35' })),
        D.g('g3', D.s('rect', { x: gx(2) - 21, y: 6, width: 42, height: 180, rx: 6, fill: 'transparent', stroke: 'none', style: 'fill-opacity: .35' })),
        codeLines(D, 'code', 8, 218, 384, 32, [['cmd', 'adata.X']], { size: 13, top: 16 }),
        pre(D.text('res', 16, 272, '(' + nCells + ', ' + nGenes + ')   # (cells, genes) in the practice data', { size: 12, mono: true, anchor: 'start', weight: 700 })));
    },
    steps: [
      { cap: '**AnnData** holds a single-cell experiment in one object. At its center, `adata.X` is a matrix with one row per **cell** and one column per **gene**: counts of RNA molecules.', show: [], hide: ['obs', 'var', 'res'], hi: ['X'] },
      { cap: '`adata.obs` is a table with one row per cell, in the same order as the rows of X: the cell id, the sample, the genes detected (n_genes) and, after clustering, the cluster.', show: ['obs'], set: { cmd: 'adata.obs' }, hi: ['obs'] },
      { cap: '`adata.var` is a table with one row per gene, in the same order as the columns of X: the gene name and flags such as highly_variable.', show: ['var'], set: { cmd: 'adata.var' }, hi: ['var'] },
      { cap: 'The three parts stay aligned: row 2 of X belongs to cell_2 in obs, and column 3 of X belongs to LYZ in var. Subsetting cells or genes keeps them in step.', set: { cmd: 'adata["cell_2", "LYZ"]   # one cell, one gene' }, hi: ['r2', 'g3'] },
      { cap: '`adata.shape` gives (cells, genes): (418, 12) for the practice single-cell data. Cells come first, the opposite of a bulk count table, which has genes in rows.', show: ['res'], set: { cmd: 'adata.shape' }, hi: ['res'] }
    ]
  });

  /* ---------- 24. Single-cell workflow ---------- */
  def('sc-workflow', {
    title: 'Single-cell analysis, step by step',
    summary: 'The scanpy workflow from top to bottom: quality control, normalize, log1p, highly variable genes, PCA, neighbor graph, UMAP and Leiden clustering, marker genes and cell type labels, each with the scanpy function that does it.',
    build(D) {
      const node = (k, t, fns, d, cls) => h('li.dg-node' + (cls ? '.' + cls : ''), { 'data-k': k }, h('strong', t), fns ? h('code.dg-cmd', fns) : null, h('span.dg-d', d));
      return h('ol.dg-flow.compact',
        node('n1', 'Quality control', 'sc.pp.filter_cells  sc.pp.filter_genes', 'Remove cells with few genes or a high mitochondrial percentage, and very rare genes.'),
        node('n2', 'Normalize', 'sc.pp.normalize_total', 'Scale every cell to the same total.'),
        node('n3', 'Log transform', 'sc.pp.log1p', 'log(1 + x) tames huge values.'),
        node('n4', 'Highly variable genes', 'sc.pp.highly_variable_genes', 'Keep the genes that vary most, often about 2,000.'),
        node('n5', 'PCA', 'sc.tl.pca', 'Compress them into a few dozen components.'),
        node('n6', 'Neighbor graph', 'sc.pp.neighbors', 'Link each cell to its most similar cells.'),
        node('n7', 'UMAP and clusters', 'sc.tl.umap  sc.tl.leiden', 'UMAP: a 2D view. Leiden: the clusters.'),
        node('n8', 'Marker genes', 'sc.tl.rank_genes_groups', 'Genes much higher in one cluster.'),
        node('n9', 'Cell types', null, 'You name clusters from their markers.', 'navy'));
    },
    steps: [
      { cap: 'Start with **quality control**: remove cells that look damaged or empty (few genes, many mitochondrial reads) and genes detected in almost no cells.', show: ['n1'], hi: ['n1'] },
      { cap: 'Cells are captured with different efficiency, so **normalize** each cell to the same total, then take **log1p**, log(1 + x), so a few huge values do not dominate.', show: ['n2', 'n3'], hi: ['n2', 'n3'] },
      { cap: 'Keep the **highly variable genes**, often about 2,000: they carry the differences between cell types, while the rest mostly add noise.', show: ['n4'], hi: ['n4'] },
      { cap: '**PCA** compresses those genes into a few dozen components. The **neighbor graph** then links each cell to the cells most similar to it.', show: ['n5', 'n6'], hi: ['n5', 'n6'] },
      { cap: '**UMAP** draws that graph in two dimensions for you to look at; **Leiden** splits the graph into clusters of similar cells.', show: ['n7'], hi: ['n7'] },
      { cap: '**Marker genes**, much higher in one cluster than in the rest, let you name each cluster. A **cell type** label is your interpretation, not an output of the software.', show: ['n8', 'n9'], hi: ['n8', 'n9'] },
      { cap: 'The order matters: each step uses the result of the one before. Clusters come from the neighbor graph, not from the UMAP picture, which is only a view.', hi: ['n6', 'n7'] }
    ]
  });

  /* ---------- 25. Marker genes ---------- */
  const MK = { genes: ['CD3E', 'MS4A1', 'LYZ', 'PPBP'], names: ['T cells', 'B cells', 'monocytes', 'platelets'],
    of: { 'CD4 T cells': 0, 'CD8 T cells': 0, 'B cells': 1, 'CD14 monocytes': 2, 'FCGR3A monocytes': 2, 'Platelets': 3 }, col: ['--blue', '--green', '--orange', '--violet'] };
  def('marker-genes', {
    title: 'Naming clusters with marker genes',
    summary: 'A simplified UMAP of the practice single-cell data with clusters 0 to 3, and a table of marker genes CD3E, MS4A1, LYZ and PPBP showing high or low expression per cluster; the clusters are named T cells, B cells, monocytes and platelets, with a warning that UMAP distances are unreliable and labels are hypotheses.',
    build(D) {
      const S = SC(), gi = MK.genes.map((g) => (S.genes || []).indexOf(g));
      const cells = (S.cells || []).filter((c) => MK.of[c.t] != null);
      // mean count per cluster and gene; "high" when the mean is at least 1 count per cell
      const mean = [0, 1, 2, 3].map((k) => { const cs = cells.filter((c) => MK.of[c.t] === k); return gi.map((j, n) => cs.length && j >= 0 ? cs.reduce((a, c) => a + c.e[j], 0) / cs.length : (n === k ? 9 : 0)); });
      const UX = (v) => 200 + v * 25, UY = (v) => 70 - v * 9.6;
      const cent = [0, 1, 2, 3].map((k) => { const cs = cells.filter((c) => MK.of[c.t] === k); return cs.length ? [cs.reduce((a, c) => a + c.x, 0) / cs.length, cs.reduce((a, c) => a + c.y, 0) / cs.length] : [0, 0]; });
      const cx = (j) => 108 + j * 56, ry = (k) => 186 + k * 42;
      return D.svg(400, 352,
        D.g('umap', D.box('', 8, 4, 384, 134, '', { cls: 'file' }), D.text('', 384, 130, 'UMAP (simplified)', { size: 11, cls: 'muted', anchor: 'end' }),
          D.g('', cells.map((c) => D.s('circle', { cx: UX(c.x).toFixed(1), cy: UY(c.y).toFixed(1), r: 2.2, style: `fill: var(${MK.col[MK.of[c.t]]}); fill-opacity: .75` }))),
          cent.map(([a, b], k) => { const ox = k === 3 ? -26 : 0; return D.g('', D.s('circle', { cx: UX(a) + ox, cy: UY(b), r: 10, style: 'fill: var(--surface); stroke: var(--text); stroke-width: 1.4' }), D.text('', UX(a) + ox, UY(b), String(k), { size: 13, weight: 800 })); })),
        D.g('table',
          D.g('hdr', D.s('rect', { x: 80, y: 147, width: 224, height: 22, rx: 6, fill: 'transparent', stroke: 'none' })),
          MK.genes.map((g, j) => D.text('', cx(j), 158, g, { size: 12, mono: true, weight: 700 })),
          [0, 1, 2, 3].map((k) => D.g('row' + k,
            D.s('rect', { x: 8, y: ry(k) - 19, width: 384, height: 38, rx: 8, fill: 'transparent', stroke: 'none' }),
            D.text('', 14, ry(k), 'cluster ' + k, { size: 12, weight: 700, anchor: 'start' }),
            MK.genes.map((g, j) => {
              const high = mean[k][j] >= 1;
              return D.g('', D.s('circle', { cx: cx(j), cy: ry(k) - 6, r: high ? 9 : 4, style: high ? 'fill: var(--heading); stroke: none' : 'fill: none; stroke: var(--muted); stroke-width: 1.4' }),
                D.text('', cx(j), ry(k) + 11, high ? 'high' : 'low', { size: 11, weight: high ? 700 : null, cls: high ? null : 'muted' }));
            }),
            D.text('nm' + k, 318, ry(k), MK.names[k], { size: 12, weight: 700, anchor: 'start', cls: 'gold' })))));
    },
    steps: [
      { cap: 'After clustering, Leiden has split the cells into groups numbered 0 to 3 (shown on a UMAP). The numbers are arbitrary labels: which cell types are these?', show: [], hide: ['table'], hi: ['umap'] },
      { cap: 'Check known **marker genes** in every cluster. A big filled dot with "high" means the gene is high in that cluster; a small open circle with "low" means it is low.', show: ['table'], hide: ['nm0', 'nm1', 'nm2', 'nm3'], hi: ['hdr'] },
      { cap: 'Read across each row. Cluster 0 is high only for **CD3E**: T cells. Cluster 1 is high only for **MS4A1**: B cells.', show: ['nm0', 'nm1'], hi: ['row0', 'row1'] },
      { cap: 'Cluster 2 is high for **LYZ**: monocytes. Cluster 3 is high for **PPBP**: platelets. One clear marker per cluster makes the naming easy here.', show: ['nm2', 'nm3'], hi: ['row2', 'row3'] },
      { cap: 'Two cautions. Distances between clusters on a UMAP are not reliable. And a label is a hypothesis: check several markers, such as IL7R or CD8A for T cells and CD79A for B cells.', hi: ['umap'] }
    ]
  });
})();
