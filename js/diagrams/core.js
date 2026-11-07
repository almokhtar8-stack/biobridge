/* Core visuals required by the 2.2 brief: file system and paths, how commands change files, Python variables,
   loops and functions, DNA to protein, FASTA and FASTQ, the RNA-seq workflow, count matrices and normalization,
   and basic statistical ideas. All original; numbers come from BioBridge's simulated practice data. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h } = BB;
  const def = BB.diagram.define;
  // Elbow connector from a parent (bottom center) to a child (top center).
  const elbow = (D, k, x1, y1, x2, y2) => D.path(k, `M${x1},${y1} V${(y1 + y2) / 2} H${x2} V${y2}`);

  /* ---------- Linux: the file system tree ---------- */
  def('fs-tree', {
    title: 'The Linux file system is one tree',
    summary: 'A tree of folders starting at the root slash, with bin, etc, home and tmp below it, then /home/student, then the project folder with data, scripts and results.',
    build(D) {
      const W = 64, H = 28;
      const node = (k, x, y, label, cls, w) => D.box(k, x - (w || W) / 2, y, w || W, H, label, { cls: cls || 'dir', mono: true, size: 13 });
      return D.svg(400, 350,
        node('root', 200, 10, '/', 'navy', 44),
        D.g('sys', elbow(D, '', 200, 38, 48, 76), elbow(D, '', 200, 38, 128, 76), elbow(D, '', 200, 38, 352, 76),
          node('', 48, 76, 'bin'), node('', 128, 76, 'etc'), node('', 352, 76, 'tmp'),
          D.text('', 128, 122, 'system folders', { size: 11, cls: 'muted' })),
        D.g('home', elbow(D, '', 200, 38, 240, 76), node('home-b', 240, 76, 'home')),
        D.g('student', elbow(D, '', 240, 104, 240, 142), node('student-b', 240, 142, 'student', 'dir', 84), D.text('tilde', 312, 156, '= ~', { size: 13, cls: 'gold', mono: true })),
        D.g('notes', elbow(D, '', 240, 170, 150, 210), node('', 150, 210, 'notes.txt', 'file', 92)),
        D.g('project', elbow(D, '', 240, 170, 300, 210), node('project-b', 300, 210, 'project', 'dir', 80)),
        D.g('kids', elbow(D, '', 300, 238, 214, 280), elbow(D, '', 300, 238, 300, 280), elbow(D, '', 300, 238, 368, 280),
          node('data-b', 214, 280, 'data'), node('', 300, 280, 'scripts', 'dir', 70), node('', 368, 280, 'results', 'dir', 60)),
        D.text('pathlabel', 200, 334, '/home/student/project/data', { mono: true, size: 14, cls: 'gold' }));
    },
    steps: [
      { cap: 'Linux keeps every file and folder in **one tree**. The top of the tree is the **root**, written as a single slash: `/`.', show: [], hi: ['root'] },
      { cap: 'Below the root are system folders: `bin` holds programs, `etc` holds settings, `tmp` holds temporary files. You rarely change these.', show: ['sys'], hi: ['sys'] },
      { cap: 'Every user has a folder inside `home`. Yours is `/home/student`, your **home folder**. The shortcut `~` means exactly this folder.', show: ['home', 'student'], hi: ['student', 'tilde'] },
      { cap: 'Your files live inside your home folder: a file `notes.txt` and a folder `project`.', show: ['notes', 'project'], hi: ['notes', 'project'] },
      { cap: 'The project folder holds `data`, `scripts` and `results`. Folders inside folders: that is why it is called a tree.', show: ['kids'], hi: ['kids'] },
      { cap: 'A **path** lists the folders from the root down to a place, separated by `/`. The data folder is `/home/student/project/data`.', show: ['pathlabel'], hi: ['root', 'home', 'student', 'project', 'data-b', 'pathlabel'] }
    ]
  });

  /* ---------- Linux: absolute and relative paths ---------- */
  def('paths', {
    title: 'Two ways to reach the same file',
    summary: 'From the scripts folder, counts.tsv can be reached by the absolute path /home/student/project/data/counts.tsv or the relative path ../data/counts.tsv.',
    build(D) {
      const n = (k, x, y, label, cls, w) => D.box(k, x - (w || 76) / 2, y, w || 76, 26, label, { cls: cls || 'dir', mono: true, size: 13 });
      return D.svg(400, 352,
        // tree edges
        D.line('', 200, 36, 200, 62), D.line('', 200, 88, 200, 114), D.line('', 200, 140, 200, 166),
        elbow(D, '', 200, 192, 120, 224), elbow(D, '', 200, 192, 290, 224), D.line('', 120, 250, 120, 276),
        // routes drawn over the edges
        D.route('abs', 'M200,36 V166 M200,192 V208 H120 V224 M120,250 V274'),
        D.route('relup', 'M290,224 V208 H204 V196', { cls: 'blue' }),
        D.route('reldown', 'M196,192 V212 H124 V222 M124,250 V274', { cls: 'blue' }),
        n('root', 200, 10, '/', 'navy', 40), n('home', 200, 62, 'home'), n('student', 200, 114, 'student', 'dir', 86),
        D.text('tilde', 262, 127, '= ~', { size: 14, cls: 'gold', mono: true, anchor: 'start' }),
        n('project', 200, 166, 'project', 'dir', 84), n('data', 120, 224, 'data'), n('scripts', 290, 224, 'scripts', 'dir', 84),
        n('counts', 120, 276, 'counts.tsv', 'file', 100),
        D.g('you', D.box('', 246, 258, 88, 24, 'you are here', { cls: 'gold', size: 11, r: 12 })),
        D.text('dots', 252, 198, '..', { size: 16, cls: 'blue', mono: true }),
        D.text('abslabel', 200, 318, 'absolute: /home/student/project/data/counts.tsv', { mono: true, size: 12, cls: 'gold' }),
        D.text('rellabel', 200, 340, 'relative (from scripts): ../data/counts.tsv', { mono: true, size: 12, cls: 'blue' }));
    },
    steps: [
      { cap: 'You are in `~/project/scripts` and you want the file `counts.tsv`, which lives in the `data` folder.', show: [], hi: ['scripts', 'counts', 'you'] },
      { cap: 'An **absolute path** starts at the root `/` and names every folder on the way down: `/home/student/project/data/counts.tsv`. It works from anywhere.', show: ['abs', 'abslabel'], hi: ['abslabel', 'root', 'home', 'student', 'project', 'data', 'counts'] },
      { cap: 'A **relative path** starts where you are. `..` means "one folder up", so from scripts it climbs to project.', hide: ['abs'], show: ['relup', 'dots'], hi: ['project', 'dots'] },
      { cap: 'Then it goes down into `data` and names the file: `../data/counts.tsv`. Shorter, but it only works from the scripts folder.', show: ['reldown', 'rellabel'], hi: ['rellabel', 'data', 'counts'] },
      { cap: '`~` is short for your home folder, `/home/student`. So `~/project/data/counts.tsv` also works from anywhere, like an absolute path.', hide: ['relup', 'reldown', 'dots'], hi: ['tilde', 'student'] }
    ]
  });

  /* ---------- Linux: cd moves you around the tree ---------- */
  def('cd-moves', {
    title: 'Moving around with cd',
    summary: 'A you-are-here marker moves through the tree as you type cd project, cd data, cd .. and cd, while pwd shows the current folder.',
    build(D) {
      const n = (k, x, y, label, cls, w) => D.box(k, x - (w || 76) / 2, y, w || 76, 28, label, { cls: cls || 'dir', mono: true, size: 13 });
      return D.svg(400, 272,
        D.box('cmd', 20, 8, 360, 34, '$ pwd', { cls: 'code', anchor: 'start', size: 14 }),
        D.text('out', 200, 62, 'you are in: /home/student', { mono: true, size: 13, cls: 'gold' }),
        elbow(D, '', 200, 120, 110, 156), elbow(D, '', 200, 120, 270, 156),
        elbow(D, '', 270, 184, 190, 228), elbow(D, '', 270, 184, 270, 228), elbow(D, '', 270, 184, 352, 228),
        n('home', 200, 92, 'student (~)', 'dir', 110), n('notes', 110, 156, 'notes.txt', 'file', 92), n('project', 270, 156, 'project', 'dir', 84),
        n('data', 190, 228, 'data', 'dir', 66), n('scripts', 270, 228, 'scripts', 'dir', 74), n('results', 352, 228, 'results', 'dir', 70),
        D.g('you', D.dot('', 136, 106, 9, { cls: 'gold' }), D.text('', 136, 132, 'you', { size: 11, cls: 'gold' })));
    },
    steps: [
      { cap: 'You start in your home folder. `pwd` (print working directory) tells you where you are: `/home/student`.', hi: ['home', 'you'] },
      { cap: '`cd project` moves you **down** into the project folder. The name is relative to where you are.', set: { cmd: '$ cd project', out: 'you are in: /home/student/project' }, move: { you: [70, 64] }, hi: ['project', 'you'] },
      { cap: '`cd data` goes one level deeper, into data.', set: { cmd: '$ cd data', out: 'you are in: /home/student/project/data' }, move: { you: [-10, 136] }, hi: ['data', 'you'] },
      { cap: '`cd ..` goes **up** one level, back to project. `..` always means the folder above.', set: { cmd: '$ cd ..', out: 'you are in: /home/student/project' }, move: { you: [70, 64] }, hi: ['project', 'you'] },
      { cap: '`cd` on its own (or `cd ~`) always takes you home, wherever you are.', set: { cmd: '$ cd', out: 'you are in: /home/student' }, move: { you: [0, 0] }, hi: ['home', 'you'] }
    ]
  });

  /* ---------- Linux: how commands change files ---------- */
  def('file-ops', {
    title: 'What each command does to your files',
    summary: 'A data folder and a results folder change as mkdir, touch, cp, mv and rm run one after another.',
    build(D) {
      const chip = (k, label, dir) => h('li.dg-chip' + (dir ? '.dir' : ''), { 'data-k': k }, label);
      return h('div',
        D.code(['$ [[cmd|ls results]]'], { term: true }),
        h('div.dg-row', { style: { marginTop: '12px' } },
          h('div.dg-col.dg-folder', h('div.dg-label', 'data/'), h('ul.dg-chips', chip('d-counts', 'counts.tsv'), chip('', 'samples.tsv'), chip('', 'reads.fastq'))),
          h('div.dg-col.dg-folder', { 'data-k': 'res' }, h('div.dg-label', 'results/'),
            h('ul.dg-chips',
              h('li.dg-chip.dir', { 'data-k': 'r-plots' }, 'plots/', h('ul.dg-chips.inner', chip('p-notes', 'notes.txt'))),
              chip('r-notes', 'notes.txt'), chip('r-counts', 'counts.tsv')),
            h('p.dg-empty', { 'data-k': 'empty' }, '(empty)'))),
        D.note('warn', '`rm` does not use a trash bin. A removed file is gone.', { cls: 'gold' }));
    },
    steps: [
      { cap: 'The results folder starts empty. `ls results` prints nothing.', show: ['empty'] },
      { cap: '`mkdir results/plots` makes a new, empty folder.', set: { cmd: 'mkdir results/plots' }, show: ['r-plots'], hide: ['empty'], hi: ['r-plots'] },
      { cap: '`touch results/notes.txt` creates an empty file (or updates the time of an existing one).', set: { cmd: 'touch results/notes.txt' }, show: ['r-notes'], hi: ['r-notes'] },
      { cap: '`cp data/counts.tsv results/` **copies**: now there are two files, and the original in data is untouched.', set: { cmd: 'cp data/counts.tsv results/' }, show: ['r-counts'], hi: ['r-counts', 'd-counts'] },
      { cap: '`mv` with a new name **renames**: `mv results/counts.tsv results/counts_copy.tsv`.', set: { cmd: 'mv results/counts.tsv results/counts_copy.tsv', 'r-counts': 'counts_copy.tsv' }, hi: ['r-counts'] },
      { cap: '`mv` with a folder as the target **moves**: `mv results/notes.txt results/plots/`. The file leaves results and appears in plots.', set: { cmd: 'mv results/notes.txt results/plots/' }, hide: ['r-notes'], show: ['p-notes'], hi: ['p-notes'] },
      { cap: '`rm results/counts_copy.tsv` deletes the file. There is no undo, so check the name before pressing Enter.', set: { cmd: 'rm results/counts_copy.tsv' }, hide: ['r-counts'], show: ['warn'], hi: ['warn'] }
    ]
  });

  /* ---------- Linux: a pipeline ---------- */
  def('pipeline', {
    title: 'A pipeline: each command feeds the next',
    summary: 'cut -f 1 counts.tsv | grep HSP | sort | wc -l, with the data that flows out of each stage: 13 names, 5 HSP genes, the same 5 sorted, then the number 5.',
    build(D) {
      const stage = (k, cmd, out, n) => h('li.dg-node', { 'data-k': k }, h('code.dg-cmd', cmd), h('span.dg-d', h('span.dg-out', out)), n ? h('span.dg-tag', n) : null);
      return h('div',
        D.code(['$ [[s1|cut -f 1 counts.tsv]] [[p||]] [[s2|grep HSP]] [[p||]] [[s3|sort]] [[p||]] [[s4|wc -l]]'], { term: true }),
        h('ol.dg-flow.compact', { style: { marginTop: '14px' } },
          stage('n1', 'cut -f 1 counts.tsv', 'gene HSPA1A HSPA1B HSPA6 DNAJB1 HSPH1 HSPB1 BAG3 ACTB GAPDH EEF1A1 TP53 FOS', '13 lines'),
          stage('n2', 'grep HSP', 'HSPA1A HSPA1B HSPA6 HSPH1 HSPB1', '5 lines'),
          stage('n3', 'sort', 'HSPA1A HSPA1B HSPA6 HSPB1 HSPH1', '5 lines, sorted'),
          stage('n4', 'wc -l', '5', 'the answer')));
    },
    steps: [
      { cap: '`cut -f 1 counts.tsv` keeps only column 1: the header word `gene` and the 12 gene names, one per line.', show: ['n1'], hi: ['n1', 's1'] },
      { cap: 'The pipe `|` sends that output straight into `grep HSP`, which keeps only lines containing HSP: 5 genes.', show: ['n2'], hi: ['n2', 's2', 'p'] },
      { cap: '`sort` puts the 5 names in order (here, character by character).', show: ['n3'], hi: ['n3', 's3'] },
      { cap: '`wc -l` counts the lines it receives and prints `5`. That is the final output you see.', show: ['n4'], hi: ['n4', 's4'] },
      { cap: 'Each command is a small **filter**. The pipe connects one command\'s output to the next command\'s input, with no temporary files in between.', hi: ['p'] }
    ]
  });

  /* ---------- Python: variables are labels ---------- */
  def('py-variables', {
    title: 'Variables are names attached to values',
    summary: 'x = 5 attaches the name x to the value 5; y = x attaches y to the same value; x = x + 1 computes 6 and moves x to it, while y stays 5.',
    build(D) {
      return D.svg(400, 250,
        D.box('code', 20, 8, 360, 34, 'x = 5', { cls: 'code', anchor: 'start', size: 15 }),
        D.text('', 90, 66, 'names', { size: 12, cls: 'muted' }), D.text('', 300, 66, 'values', { size: 12, cls: 'muted' }),
        D.box('nx', 50, 92, 80, 34, 'x', { cls: 'blue', mono: true, size: 16, r: 17 }),
        D.box('ny', 50, 164, 80, 34, 'y', { cls: 'blue', mono: true, size: 16, r: 17 }),
        D.box('v5', 262, 92, 76, 40, '5', { mono: true, size: 18 }),
        D.box('v6', 262, 176, 76, 40, '6', { mono: true, size: 18 }),
        D.arrow('ax5', 132, 109, 258, 111),
        D.arrow('ay5', 132, 178, 258, 120, { bend: -10 }),
        D.arrow('ax6', 132, 112, 258, 192, { cls: 'gold', bend: 10 }),
        D.text('calc', 300, 234, 'x + 1 is computed first: 5 + 1 = 6', { size: 12, cls: 'gold' }));
    },
    steps: [
      { cap: '`x = 5` creates the value 5 and attaches the **name** `x` to it. `=` means "make this name refer to this value", not "is equal to".', show: ['nx', 'v5', 'ax5'], hi: ['nx', 'ax5', 'v5'] },
      { cap: '`y = x` attaches a second name, `y`, to the **same value** that `x` refers to right now: 5.', set: { code: 'y = x' }, show: ['ny', 'ay5'], hi: ['ny', 'ay5'] },
      { cap: '`x = x + 1`: Python works out the right side first. It reads `x` (5), adds 1 and gets a new value, 6.', set: { code: 'x = x + 1' }, show: ['v6', 'calc'], hi: ['v6', 'calc'] },
      { cap: 'Then the name `x` moves to the new value. `y` still refers to 5: changing `x` later did not change `y`.', hide: ['ax5'], show: ['ax6'], hi: ['ax6', 'ny'] },
      { cap: 'So `print(x, y)` prints `6 5`. When a result surprises you, ask: which value does each name refer to at this line?', set: { code: 'print(x, y)   # 6 5' }, hi: ['nx', 'ny'] }
    ]
  });

  /* ---------- Loops (language-neutral) ---------- */
  def('loop-trace', {
    title: 'A loop visits each value in turn',
    summary: 'A loop visits the values 12, 0, 7 and 30 one at a time and adds each to a running total that ends at 49.',
    build(D) {
      return h('div',
        D.cells([12, 0, 7, 30], { key: 'x', start: 1, label: (i) => ['1st', '2nd', '3rd', '4th'][i - 1] }),
        h('div.dg-row', { style: { marginTop: '14px' } },
          h('div.dg-col', h('div.dg-label', 'current value'), h('div.dg-big', { 'data-k': 'cur' }, '-')),
          h('div.dg-col', h('div.dg-label', 'total'), h('div.dg-big', { 'data-k': 'tot' }, '0'))),
        h('div.dg-row', { style: { marginTop: '14px' } },
          h('div.dg-col', h('div.dg-label', 'Python'), D.code(['[[i|total = 0]]', '[[f|for v in values:]]', '    [[b|total = total + v]]', '[[a|print(total)]]'])),
          h('div.dg-col', h('div.dg-label', 'R'), D.code(['[[i|total <- 0]]', '[[f|for (v in values) {]]', '  [[b|total <- total + v]]', '}', '[[a|print(total)]]']))));
    },
    steps: [
      { cap: 'Before the loop, set up an **accumulator**: a variable that will collect the result. `total` starts at 0.', hi: ['i', 'tot'] },
      { cap: 'First pass: the loop variable `v` takes the first value, 12. The body runs: total = 0 + 12 = **12**.', set: { cur: '12', tot: '12' }, hi: ['x1', 'f', 'b'] },
      { cap: 'Second pass: `v` is 0. total = 12 + 0 = **12**. The same body runs again with a new value.', set: { cur: '0', tot: '12' }, hi: ['x2', 'b'] },
      { cap: 'Third pass: `v` is 7. total = 12 + 7 = **19**.', set: { cur: '7', tot: '19' }, hi: ['x3', 'b'] },
      { cap: 'Fourth pass: `v` is 30. total = 19 + 30 = **49**.', set: { cur: '30', tot: '49' }, hi: ['x4', 'b'] },
      { cap: 'No values are left, so the loop ends and the next line runs: it prints **49**. The indented (or braced) lines are the body; they run once per value.', set: { cur: 'done', tot: '49' }, hi: ['a', 'tot'] }
    ]
  });

  /* ---------- Python: a function call ---------- */
  def('py-function', {
    title: 'What happens when you call a function',
    summary: 'gc_content("ATGCGC") sends the argument into the function as seq, the body counts G and C, return sends back 0.67, and the call is replaced by that value.',
    build(D) {
      return h('div',
        D.code(['[[def|def gc_content(]][[par|seq]][[def|):]]', '    [[body|gc = seq.count("G") + seq.count("C")]]', '    [[ret|return round(gc / len(seq), 2)]]', '', '[[call|result = gc_content(]][[arg|"ATGCGC"]][[call|)]]', '[[pr|print(result)]]   [[out|# 0.67]]']),
        h('ol.dg-flow.compact', { style: { marginTop: '14px' } },
          h('li.dg-node', { 'data-k': 'n1' }, h('strong', 'Argument in'), h('span.dg-d', h('code', '"ATGCGC"'), ' becomes the parameter ', h('code', 'seq'))),
          h('li.dg-node', { 'data-k': 'n2' }, h('strong', 'Body runs'), h('span.dg-d', '2 G + 2 C = 4 letters; 4 / 6 = 0.666..., rounded to 0.67')),
          h('li.dg-node', { 'data-k': 'n3' }, h('strong', 'Value out'), h('span.dg-d', h('code', 'return'), ' hands back 0.67 and the function stops')),
          h('li.dg-node.navy', { 'data-k': 'n4' }, h('strong', 'Call replaced'), h('span.dg-d', h('code', 'result = 0.67')))));
    },
    steps: [
      { cap: 'A **function** is a named recipe. `def` defines it once; the name in brackets, `seq`, is a **parameter**: a placeholder for the input.', hi: ['def', 'par'] },
      { cap: 'Calling `gc_content("ATGCGC")` sends the **argument** "ATGCGC" in. Inside the function, `seq` now refers to "ATGCGC".', show: ['n1'], hi: ['n1', 'arg', 'par'] },
      { cap: 'The body runs line by line: there are 2 G and 2 C, so `gc` is 4, and 4 / 6 is 0.666..., rounded to 0.67.', show: ['n2'], hi: ['n2', 'body'] },
      { cap: '`return` sends 0.67 back to the place that called the function, and the function stops.', show: ['n3'], hi: ['n3', 'ret'] },
      { cap: 'The call is **replaced by its value**, so `result` refers to 0.67 and `print(result)` shows `0.67`. Call it again with another sequence to reuse the recipe.', show: ['n4'], hi: ['n4', 'call', 'out'] }
    ]
  });

  /* ---------- Biology: DNA to RNA to protein ---------- */
  def('dogma', {
    title: 'From DNA to RNA to protein',
    summary: 'A short gene ATG GCT TGG AAA TAG is transcribed to the mRNA AUG GCU UGG AAA UAG and translated, three letters at a time, into Met Ala Trp Lys, then stop.',
    build(D) {
      const row = (k, label, items, cls) => h('div.dg-seqrow', { 'data-k': k }, h('div.dg-label', label), h('div.dg-cells', items.map((c, i) => h('div.dg-cell' + (cls ? '.' + cls : ''), { 'data-k': k + (i + 1) + ' cod' + (i + 1) }, h('span.dg-v', c)))));
      return h('div',
        row('dna', 'DNA (coding strand)', ['ATG', 'GCT', 'TGG', 'AAA', 'TAG']),
        h('div.dg-step', { 'data-k': 'tx' }, h('span', '↓'), ' transcription (T becomes U)'),
        row('rna', 'mRNA', ['AUG', 'GCU', 'UGG', 'AAA', 'UAG']),
        h('div.dg-step', { 'data-k': 'tl' }, h('span', '↓'), ' translation (one codon, one amino acid)'),
        row('pro', 'Protein', ['Met', 'Ala', 'Trp', 'Lys', 'stop'], 'dg-aa'),
        D.note('rnaseq', 'RNA-seq counts mRNA molecules: how many copies of each gene\'s RNA a sample contains.', { cls: 'gold' }));
    },
    steps: [
      { cap: 'A **gene** is a stretch of DNA, a long text written with four letters: A, C, G and T. Here is a tiny made-up gene.', hi: ['dna'] },
      { cap: '**Transcription**: the cell copies the gene into messenger RNA (**mRNA**). The copy matches the coding strand, except RNA uses U where DNA has T.', show: ['tx', 'rna'], hi: ['rna', 'rna1', 'rna3', 'rna5'] },
      { cap: 'The ribosome reads the mRNA **three letters at a time**. Each three-letter word is a **codon**.', hi: ['rna1', 'rna2', 'rna3', 'rna4', 'rna5'] },
      { cap: '**Translation**: each codon names one amino acid. AUG = Met (the start), GCU = Ala, UGG = Trp, AAA = Lys. UAG is a **stop** codon: the protein ends there.', show: ['tl', 'pro'], hi: ['pro'] },
      { cap: 'The chain of amino acids folds into a protein that does a job in the cell. A cell controls how much protein it makes partly by how much mRNA it makes.', hi: ['pro1', 'pro2', 'pro3', 'pro4'] },
      { cap: 'RNA-seq measures the middle step: how many mRNA copies of each gene a sample holds. That is why it is called **gene expression** data.', show: ['rnaseq'], hi: ['rna', 'rnaseq'] }
    ]
  });

  /* ---------- Data: FASTA and FASTQ ---------- */
  def('fasta-fastq', {
    title: 'Reading FASTA and FASTQ files',
    summary: 'A FASTA record has a header line starting with > and sequence lines. A FASTQ record has four lines: @name, bases, +, and one quality character per base, which decodes to a Phred score and an error chance.',
    build(D) {
      return h('div',
        h('div.dg-label', 'FASTA (sequences.fa)'),
        D.code(['[[fah|>seq_06 toy sequence F]]', '[[fas|ATGCCCTTTAAACCCGGGTTTAAATAG]]']),
        h('div.dg-label', { style: { marginTop: '12px' } }, 'FASTQ (reads.fastq)'),
        D.code(['[[q1|@READ_0001]]', '[[b1|A]][[q2|ACAATGACGGGAGAAGGAAAAAGTTGGAAACTCAA]]', '[[q3|+]]', '[[c1|I]][[q4|HHHAGGFEEBCCECB?@C@@@AA@@<6?<=]][[c2|*]][[q4|<,<=]]']),
        D.table([['Character', 'ASCII code', 'Phred score', 'Chance the base is wrong'], [{ t: '`I`', k: 'tI' }, { t: '73', k: 'tI' }, { t: '73 - 33 = 40', k: 'tI' }, { t: '1 in 10,000', k: 'tI' }], [{ t: '`*`', k: 'tS' }, { t: '42', k: 'tS' }, { t: '42 - 33 = 9', k: 'tS' }, { t: 'about 1 in 8', k: 'tS' }]], { head: true }));
    },
    steps: [
      { cap: '**FASTA** stores sequences. A line starting with `>` is the **header**: the sequence name, then an optional description.', hi: ['fah'], show: [] },
      { cap: 'The lines after the header hold the sequence letters, until the next `>`. Long sequences are often split over several lines.', hi: ['fas'] },
      { cap: '**FASTQ** stores sequencing reads, and every read takes exactly **4 lines**. Line 1 starts with `@` and names the read.', hi: ['q1'] },
      { cap: 'Line 2 holds the bases the sequencer read.', hi: ['q2', 'b1'] },
      { cap: 'Line 3 is a separator that starts with `+` (sometimes the name is repeated after it).', hi: ['q3'] },
      { cap: 'Line 4 has **one quality character per base**, so lines 2 and 4 are always the same length.', hi: ['q4', 'c1', 'c2'] },
      { cap: 'Decoding: `I` has ASCII code 73. Subtract 33 to get the **Phred score** 40, which means a 1 in 10,000 chance that the first base `A` is wrong.', hi: ['c1', 'b1', 'tI'] },
      { cap: 'Near the end of the read, `*` decodes to Phred 9: about a 1 in 8 chance of an error. Quality often drops toward the end of a read, so tools trim low-quality ends.', hi: ['c2', 'tS'] }
    ]
  });

  /* ---------- RNA-seq: the whole workflow ---------- */
  def('rnaseq-workflow', {
    title: 'An RNA-seq experiment, from cells to biology',
    summary: 'Cells under two conditions, RNA extraction, a cDNA library, sequencing into FASTQ reads, alignment and counting into a count matrix, normalization, statistics, and a biological conclusion.',
    build(D) {
      return D.flow([
        { k: 'n1', tag: 'Lab', t: 'Cells in two conditions', d: 'For example control (37 C) and heat shock (42 C), with replicates.' },
        { k: 'n2', tag: 'Lab', t: 'Extract RNA', d: 'Collect the RNA molecules from each sample.' },
        { k: 'n3', tag: 'Lab', t: 'Make a cDNA library', d: 'Copy RNA into DNA (cDNA), break it into short pieces, add adapters.' },
        { k: 'n4', tag: 'Sequencer', t: 'Sequence', d: 'Read millions of short fragments: the **reads**.' },
        { k: 'n5', tag: 'Files', t: 'FASTQ files', d: 'Each read with a quality score per base. Often gigabytes per sample.' },
        { k: 'n6', tag: 'Linux tools', t: 'Align and count', d: 'Find where each read comes from and count reads per gene.' },
        { k: 'n7', tag: 'Python or R', t: 'Count matrix', d: 'One row per gene, one column per sample.' },
        { k: 'n8', tag: 'R', t: 'Normalize', d: 'Correct for how deeply each sample was sequenced.' },
        { k: 'n9', tag: 'R and statistics', t: 'Test every gene', d: 'Fold change, p-value, and a correction for testing thousands of genes.' },
        { k: 'n10', tag: 'You', t: 'Biology', d: 'Which genes respond to heat? Heat-shock genes such as HSPA1A go up.', cls: 'navy' }
      ], { compact: true });
    },
    steps: [
      { cap: 'Start with a biological question and cells in at least two conditions, with **replicates** (several samples per condition) so you can see natural variation.', show: ['n1'], hi: ['n1'] },
      { cap: 'In the lab, RNA is extracted and copied into a DNA **library** of short fragments, because sequencers read DNA, not RNA.', show: ['n2', 'n3'], hi: ['n2', 'n3'] },
      { cap: 'The sequencer reads millions of fragments per sample. The output is **FASTQ** files: this is where the Linux command line takes over.', show: ['n4', 'n5'], hi: ['n4', 'n5'] },
      { cap: 'Software matches each read to the gene it came from and counts them. The result is the **count matrix**: genes by samples.', show: ['n6', 'n7'], hi: ['n6', 'n7'] },
      { cap: 'Before comparing samples, **normalize** for sequencing depth. Then test every gene and correct for doing thousands of tests.', show: ['n8', 'n9'], hi: ['n8', 'n9'] },
      { cap: 'Finally, interpret: which genes changed, by how much, and what that means biologically. Code supports every step, but the question and the interpretation are yours.', show: ['n10'], hi: ['n10'] }
    ]
  });

  /* ---------- RNA-seq: count matrix and normalization ---------- */
  const CM = { genes: ['HSPA1A', 'ACTB', 'TP53'], raw: [[212, 11018], [44289, 55945], [613, 881]], lib: [18400000, 24600000] };
  const cpm = (c, j) => c / CM.lib[j] * 1e6;
  const f1 = (x) => (Math.round(x * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const f2 = (x) => (Math.round(x * 100) / 100).toFixed(2);
  const setVals = (fn) => { const o = {}; CM.genes.forEach((g, i) => [0, 1].forEach((j) => { o[`r${i + 1}c${j + 1}`] = fn(CM.raw[i][j], j); })); return o; };
  def('count-matrix', {
    title: 'A count matrix, raw and normalized',
    summary: 'Three genes in two samples from the practice data: raw counts, counts per million, and log2 of CPM plus 1.',
    build(D) {
      const rows = [['gene', { t: 'ctrl_1', cls: 'num' }, { t: 'heat_1', cls: 'num' }]].concat(CM.genes.map((g, i) => [g, { t: CM.raw[i][0].toLocaleString('en-US'), cls: 'num' }, { t: CM.raw[i][1].toLocaleString('en-US'), cls: 'num' }]));
      rows.push([{ t: 'reads in sample', k: 'lib' }, { t: '18.4 million', cls: 'num', k: 'lib' }, { t: '24.6 million', cls: 'num', k: 'lib' }]);
      return h('div',
        D.el('div.dg-label', 'unit', 'raw counts (reads assigned to each gene)'),
        D.table(rows, { head: true, rowHead: true, mono: true }),
        D.note('fcpm', 'CPM = count / reads in sample × 1,000,000'),
        D.note('flog', 'log2(CPM + 1): +1 on this scale means twice as much'));
    },
    steps: [
      { cap: 'A **count matrix** has one row per gene and one column per sample. Each number is how many reads were assigned to that gene in that sample.', hi: ['c1', 'c2'], show: [] },
      { cap: 'Raw counts also depend on **sequencing depth**: heat_1 was sequenced more deeply (24.6 million reads) than ctrl_1 (18.4 million), so its counts are inflated.', show: ['lib'], hi: ['lib'] },
      { cap: '**CPM** (counts per million) divides each count by the sample\'s total reads and multiplies by one million. Now the samples are on the same scale.', show: ['fcpm'], set: Object.assign({ unit: 'counts per million (CPM)' }, setVals((c, j) => f1(cpm(c, j)))), hi: ['fcpm', 'c1', 'c2'] },
      { cap: 'After normalization ACTB, a housekeeping gene, is about the same in both samples. HSPA1A, a heat-shock gene, is about **39 times** higher after heat.', hi: ['r1', 'r2'] },
      { cap: '**log2(CPM + 1)** squeezes the huge range of values. A difference of 1 means doubled, so HSPA1A rises by about 5 steps (2 to the 5th is 32). The +1 avoids log of 0.', show: ['flog'], set: Object.assign({ unit: 'log2(CPM + 1)' }, setVals((c, j) => f2(Math.log2(cpm(c, j) + 1)))), hi: ['flog', 'r1'] },
      { cap: 'These are 2 of 6 samples in simulated practice data. Real analyses compare all replicates and use more careful normalization, but the idea is the same.', hi: [] }
    ]
  });

  /* ---------- Statistics: two groups and the t-test ---------- */
  const TT = [{ c: [10, 11, 12], t: [15, 16, 17], tval: '6.12', p: '0.004' }, { c: [6, 11, 16], t: [11, 16, 21], tval: '1.22', p: '0.29' }];
  def('ttest', {
    title: 'Same difference, different evidence',
    summary: 'Two experiments with the same difference in means (11 versus 16). With small spread t is 6.12 and p is 0.004; with large spread t is 1.22 and p is 0.29.',
    build(D) {
      const y = (v) => 200 - (v - 4) * 8.5; // values 4..22 -> y 200..47
      const panel = (k, ox, d, title) => D.g(k,
        D.text('', ox + 95, 22, title, { size: 13, weight: 700 }),
        D.line('', ox + 18, 40, ox + 18, 205, { cls: 'axis' }), D.line('', ox + 18, 205, ox + 186, 205, { cls: 'axis' }),
        D.text('', ox + 60, 222, 'control', { size: 12 }), D.text('', ox + 140, 222, 'heat', { size: 12 }),
        D.g(k + '-spread', D.path('', `M${ox + 32},${y(Math.min(...d.c))} V${y(Math.max(...d.c))}`, { cls: 'gold' }), D.path('', `M${ox + 112},${y(Math.min(...d.t))} V${y(Math.max(...d.t))}`, { cls: 'gold' })),
        d.c.map((v, i) => D.dot('', ox + 48 + i * 12, y(v), 6)), d.t.map((v, i) => D.dot('', ox + 128 + i * 12, y(v), 6, { cls: 'red' })),
        D.g(k + '-means', D.line('', ox + 40, y(11), ox + 82, y(11), { cls: 'axis' }), D.line('', ox + 120, y(16), ox + 162, y(16), { cls: 'axis' })),
        D.g(k + '-diff', D.arrow('', ox + 96, y(11), ox + 96, y(16) + 2, { cls: 'gold' }), D.text('', ox + 96, y(11) + 14, 'diff 5', { size: 11, cls: 'gold' })),
        D.text(k + '-t', ox + 100, 244, `t = ${d.tval}, p = ${d.p}`, { size: 13, weight: 700, mono: true }));
      return D.svg(400, 256, panel('A', 0, TT[0], 'Experiment A'), panel('B', 204, TT[1], 'Experiment B'));
    },
    steps: [
      { cap: 'Two small experiments, 3 control and 3 heat samples each. In both, the control mean is 11 and the heat mean is 16 (the horizontal lines).', show: ['A-means', 'B-means'], hi: ['A-means', 'B-means'] },
      { cap: 'The **difference in means** is 5 in both. Is that a real effect or just chance? The difference alone cannot tell you.', show: ['A-diff', 'B-diff'], hi: ['A-diff', 'B-diff'] },
      { cap: 'Look at the **spread** within each group (the gold bars). In A the values are tight (10 to 12); in B they are scattered (6 to 16).', show: ['A-spread', 'B-spread'], hi: ['A-spread', 'B-spread'] },
      { cap: 'A **t-test** divides the difference by the noise (how much the means would wobble by chance). In A: t = 6.12, p = 0.004. Strong evidence of a difference.', show: ['A-t'], hi: ['A-t', 'A-spread'] },
      { cap: 'In B the same difference sits inside large noise: t = 1.22, p = 0.29. The data are compatible with no real change. More replicates would help.', show: ['B-t'], hi: ['B-t', 'B-spread'] }
    ]
  });

  /* ---------- Statistics: the p-value ---------- */
  def('null-pvalue', {
    title: 'What a p-value is',
    summary: 'A bell-shaped null distribution of a test statistic, an observed value of 2.2, and the two shaded tails beyond plus and minus 2.2 that add up to a p-value of about 0.03.',
    build(D) {
      const X = (z) => 200 + z * 52, Y = (z) => 200 - 150 * Math.exp(-z * z / 2);
      const curve = (a, b) => { let d = ''; for (let z = a; z <= b + 1e-9; z += 0.05) d += (d ? ' L' : 'M') + X(z).toFixed(1) + ',' + Y(z).toFixed(1); return d; };
      const tail = (a, b) => `M${X(a)},200 ` + curve(a, b).replace(/^M/, 'L') + ` L${X(b)},200 Z`;
      return D.svg(400, 250,
        D.line('', 30, 200, 370, 200, { cls: 'axis' }),
        [-3, -2, -1, 0, 1, 2, 3].map((z) => D.text('', X(z), 214, String(z), { size: 11, cls: 'muted' })),
        D.text('', 200, 236, 'test statistic if nothing really changed', { size: 12, cls: 'muted' }),
        D.g('curve', D.path('', curve(-3.3, 3.3), {})),
        D.g('tails', D.path('', tail(2.2, 3.3), { cls: 'goldfill' }), D.path('', tail(-3.3, -2.2), { cls: 'goldfill' })),
        D.g('obs', D.line('', X(2.2), 60, X(2.2), 200, { cls: 'dash' }), D.text('', X(2.2), 50, 'your result: 2.2', { size: 12, weight: 700 })),
        D.text('plabel', 200, 30, 'p = shaded area = 0.03', { size: 14, cls: 'gold' }));
    },
    steps: [
      { cap: 'Start by assuming the **null hypothesis**: heat really changes nothing. If you repeated the experiment many times, the test statistic would still vary by chance, mostly near 0. This curve shows how.', hi: ['curve'] },
      { cap: 'Your experiment gave a test statistic of 2.2 (marked). Is that unusual if nothing changed?', show: ['obs'], hi: ['obs'] },
      { cap: 'The **p-value** is the chance, assuming nothing changed, of a result at least as extreme as yours. That is the area in both shaded tails.', show: ['tails'], hi: ['tails'] },
      { cap: 'Here the tails add up to about 0.03. So p = 0.03: a result this extreme would happen about 3 times in 100 if nothing changed.', show: ['plabel'], hi: ['plabel', 'tails'] },
      { cap: 'A p-value is **not** the chance that the null hypothesis is true, and it says nothing about how big or important the effect is. Report the effect size too.', hi: [] }
    ]
  });

  /* ---------- Statistics: correlation ---------- */
  const CORR = [
    { x: [-0.07, 0.67, 1.44, -0.68, 0.2, -0.46, 0.13, -1.19, -0.58, -0.2, 0.9, 1.15, -1.32, -0.79], y: [0.22, -0.27, 1.09, -0.65, 0.73, -0.12, -0.03, -1.23, -0.63, 0.49, 0.62, 0.9, -1.04, -0.77] },
    { x: [-1.3, -1.44, 0.79, -0.19, 0.22, 1.0, -1.73, -0.78, 0.18, 0.39, -0.38, 1.03, 0.21, -1.21], y: [-0.93, 0.81, 0.46, -1.9, 1.35, 0.6, 1.34, -0.38, -0.3, -1.13, 2.54, -0.18, 1.59, -0.65] },
    { x: [-0.65, -0.26, 0.64, 0.43, 0.21, -1.51, 0.54, 1.17, 1.01, 0.23, -1.56, 0.94, -0.15, -2.53], y: [0.75, -0.42, -1.14, -0.66, 0.37, 1.2, -0.37, -0.29, -0.21, -0.26, 1.3, -1.4, -0.17, 2.46] }
  ];
  const pearson = (x, y) => { const n = x.length, mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n; let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); };
  def('correlation', {
    title: 'Correlation: do two measurements move together?',
    summary: 'Three scatter plots: a strong positive correlation near +0.9, no correlation near 0, and a strong negative correlation near -0.9.',
    build(D) {
      const panel = (k, i, ox, label) => {
        const d = CORR[i], r = pearson(d.x, d.y);
        const X = (v) => ox + 64 + v * 20, Y = (v) => 110 - v * 20;
        return D.g(k, D.box('', ox + 8, 30, 112, 150, '', { cls: 'ghost' }),
          d.x.map((v, j) => D.dot('', X(v), Y(d.y[j]), 4.5, { cls: i === 1 ? 'muted' : i === 0 ? '' : 'red' })),
          D.text('', ox + 64, 16, label, { size: 12, weight: 700 }),
          D.text(k + '-r', ox + 64, 198, 'r = ' + (r >= 0 ? '+' : '') + r.toFixed(2), { size: 13, mono: true, weight: 700 }));
      };
      return D.svg(400, 240, panel('p1', 0, 4, 'positive'), panel('p2', 1, 136, 'none'), panel('p3', 2, 268, 'negative'),
        D.text('cause', 200, 228, 'correlation is not causation', { size: 13, cls: 'gold' }));
    },
    steps: [
      { cap: 'Each dot is one sample measured twice (for example, the expression of two genes). **Correlation** asks whether the two measurements rise and fall together.', hi: [] },
      { cap: '**Positive**: when one is high, the other tends to be high. Pearson\'s r is near +1.', hi: ['p1', 'p1-r'] },
      { cap: '**No correlation**: knowing one tells you almost nothing about the other. r is near 0.', hi: ['p2', 'p2-r'] },
      { cap: '**Negative**: when one is high, the other tends to be low. r is near -1.', hi: ['p3', 'p3-r'] },
      { cap: 'r measures only straight-line patterns and can be pulled by a single outlier, so always plot the data. And two genes that move together may both respond to a third cause.', show: ['cause'], hi: ['cause'] }
    ]
  });
})();
