/* Python diagrams for the Rice course "Python Programming Essentials" (Python 3). Original visuals for BioBridge.
   Every Python value and message shown here was checked by running it with Python 3.12. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h } = BB;
  const def = BB.diagram.define;
  // SVG text collapses ordinary spaces, so indentation inside SVG code uses no-break spaces.
  const sp = (n) => ' '.repeat(n);
  // Small grey label above an HTML block; `gap` adds space above it; `k` makes it a keyed part.
  const label = (text, gap, k) => h('div.dg-label', { 'data-k': k || null, style: gap ? { marginTop: '12px' } : null }, text);
  // Code blocks whose spans mark single tokens: drop the side padding of the spans so the code keeps its real spacing
  // (needed when spacing or alignment is the point), and optionally use a slightly smaller font so lines do not wrap.
  const tight = (pre, small) => {
    pre.querySelectorAll('.dg-span').forEach((s) => { s.style.paddingLeft = '0'; s.style.paddingRight = '0'; });
    if (small) pre.style.fontSize = '.8rem';
    return pre;
  };

  /* ---------- Running a program ---------- */
  def('run-program', {
    title: 'What happens when you run a program',
    summary: 'The one-line program print("Hello, world!") goes into the Python interpreter, which runs it and shows Hello, world!; the interpreter can run in CodeSkulptor3, on your own computer or in the BioBridge Python playground, with the same result.',
    build(D) {
      return D.svg(400, 330,
        D.text('', 34, 31, 'code', { size: 11, cls: 'muted' }),
        D.box('code', 64, 12, 272, 38, 'print("Hello, world!")', { cls: 'code', size: 15 }),
        D.g('a1', D.arrow('', 200, 50, 200, 80)),
        D.box('interp', 100, 82, 200, 44, 'Python interpreter', { cls: 'navy', size: 15, weight: 700 }),
        D.g('a2', D.arrow('', 200, 126, 200, 156, { label: 'runs it', lx: 30, ly: 1, size: 11 })),
        D.text('outl', 34, 177, 'output', { size: 11, cls: 'muted' }),
        D.box('out', 100, 158, 200, 38, 'Hello, world!', { mono: true, size: 15, weight: 700 }),
        D.text('where', 200, 220, 'where the interpreter can run', { size: 12, cls: 'muted' }),
        D.box('p1', 8, 234, 120, 62, 'CodeSkulptor3\nin the browser', { cls: 'blue', size: 12 }),
        D.box('p2', 140, 234, 120, 62, 'your computer:\nterminal, IDLE\nor VS Code', { cls: 'blue', size: 12 }),
        D.box('p3', 272, 234, 120, 62, 'BioBridge\nPython\nplayground', { cls: 'blue', size: 12 }),
        D.text('same', 200, 316, 'same code, same output', { size: 13, cls: 'gold' }));
    },
    steps: [
      { cap: 'A **program** is text written in a programming language. This one line of Python asks the computer to display a greeting.', hi: ['code'] },
      { cap: 'The **Python interpreter** is the program that reads your code and carries it out, one line at a time from top to bottom.', show: ['a1', 'interp'], hi: ['interp'] },
      { cap: 'What the program displays is its **output**: `Hello, world!`. The quotes are not printed; they only mark where the text starts and ends.', show: ['a2', 'out', 'outl'], hi: ['out'] },
      { cap: 'The course uses **CodeSkulptor3**, a website that runs Python 3 in your web browser, so there is nothing to install.', show: ['where', 'p1'], hi: ['p1'] },
      { cap: 'You can also install Python on your own computer and run your file from a **terminal**, or from an editor such as **IDLE** or **VS Code**.', show: ['p2'], hi: ['p2'] },
      { cap: 'BioBridge\'s **Python playground** runs real Python in your browser too. Same language, same result: this program prints `Hello, world!` in all three places.', show: ['p3', 'same'], hi: ['p3', 'same'] }
    ]
  });

  /* ---------- Numbers: /, // and % ---------- */
  def('division', {
    title: 'Three ways to divide: /, // and %',
    summary: 'Seven dots grouped in pairs show that 7 / 2 is 3.5, 7 // 2 is 3 full pairs and 7 % 2 is 1 dot left over; notes below show that type(3.0) is float and that 0.1 + 0.2 prints 0.30000000000000004.',
    build(D) {
      const gx = [14, 110, 206, 302]; // left edge of each pair slot
      const dots = [];
      gx.slice(0, 3).forEach((x) => dots.push(D.dot('', x + 27, 42, 13), D.dot('', x + 57, 42, 13)));
      return h('div',
        D.svg(400, 104,
          D.g('pairs', gx.slice(0, 3).map((x) => D.box('pairs', x, 16, 84, 52, '', { cls: 'ghost' }))),
          D.g('halfbox', D.box('halfbox', gx[3], 16, 84, 52, '', { cls: 'ghost' })),
          D.g('dots', dots),
          D.dot('left', gx[3] + 27, 42, 13),
          D.g('lab-full', gx.slice(0, 3).map((x, i) => D.text('', x + 42, 88, 'pair ' + (i + 1), { size: 12 }))),
          D.text('lab-half', gx[3] + 42, 88, 'half a pair', { size: 12, cls: 'gold' }),
          D.text('lab-left', gx[3] + 42, 88, '1 left over', { size: 12, cls: 'gold' })),
        D.table([
          ['code', { t: 'result', cls: 'num' }, 'meaning'],
          ['`7 / 2`', { t: '`3.5`', cls: 'num' }, 'exact, a float'],
          ['`7 // 2`', { t: '`3`', cls: 'num' }, 'full pairs only'],
          ['`7 % 2`', { t: '`1`', cls: 'num' }, 'what is left over']
        ], { head: true }),
        D.note('types', "`type(3)` shows `<class 'int'>` and `type(3.0)` shows `<class 'float'>`"),
        D.note('float', '`print(0.1 + 0.2)` shows `0.30000000000000004`', { cls: 'gold' }));
    },
    steps: [
      { cap: 'Picture `7` as 7 dots. Dividing by 2 asks how they fit into **pairs**. Python has three division operators, and each one answers a different question.', hi: ['dots', 'left'] },
      { cap: '`7 / 2` is **true division**: 3 full pairs and half of another, so **3.5**. `/` always gives a float, even when the answer is whole: `6 / 2` is `3.0`.', show: ['pairs', 'halfbox', 'lab-full', 'lab-half', 'r0', 'r1'], hi: ['r1', 'halfbox'] },
      { cap: '`7 // 2` is **floor division**: it counts only the **full** pairs, so the answer is **3**. The extra dot is dropped.', hide: ['halfbox', 'lab-half'], show: ['r2'], hi: ['r2', 'pairs'] },
      { cap: '`7 % 2` gives the **remainder**: what is left over after making the full pairs. One dot is left, so the answer is **1**.', show: ['lab-left', 'r3'], hi: ['r3', 'left'] },
      { cap: '`3` is an **int**, a whole number. `3.0` is a **float**, a number with a decimal point. They are equal in value, but `type()` tells them apart.', show: ['types'], hi: ['types'] },
      { cap: 'Floats are stored in binary, so most decimals are tiny approximations: `0.1 + 0.2` prints `0.30000000000000004`. Use `round()` when you display results.', show: ['float'], hi: ['float'] }
    ]
  });

  /* ---------- Precedence: which operator goes first ---------- */
  def('precedence', {
    title: 'Evaluating 2 + 3 * 4 ** 2 step by step',
    summary: 'The expression 2 + 3 * 4 ** 2 shrinks as Python applies its operators by precedence: 4 ** 2 is 16, then 3 * 16 is 48, then 2 + 48 is 50; with brackets, (2 + 3) * 4 ** 2 is 80.',
    build(D) {
      const top = 96, gap = 42;
      const y = (i) => top + i * gap;
      const rung = (k, i, op, name) => D.g(k,
        D.box(k, 16, y(i), 214, 34, ''),
        D.text('', 30, y(i) + 17, op, { mono: true, size: 15, anchor: 'start', weight: 700 }),
        D.text('', 220, y(i) + 17, name, { size: 12, anchor: 'end', cls: 'muted' }));
      const work = (k, i, s) => D.text(k, 316, y(i) + 17, s, { mono: true, size: 14, cls: 'gold' });
      return D.svg(400, 280,
        D.box('expr', 16, 10, 368, 52, '2 + 3 * 4 ** 2', { cls: 'code', size: 22 }),
        D.text('', 123, 84, 'computed first', { size: 11, cls: 'muted' }),
        rung('k1', 0, '( )', 'brackets'),
        rung('k2', 1, '**', 'power'),
        rung('k3', 2, '* / // %', 'multiply, divide'),
        rung('k4', 3, '+ -', 'add, subtract'),
        D.text('', 123, 270, 'computed last', { size: 11, cls: 'muted' }),
        work('w2', 1, '4 ** 2 = 16'), work('w3', 2, '3 * 16 = 48'), work('w4', 3, '2 + 48 = 50'),
        work('p1', 0, '2 + 3 = 5'), work('p2', 1, '4 ** 2 = 16'), work('p3', 2, '5 * 16 = 80'));
    },
    steps: [
      { cap: 'Python does not simply work from left to right. Each operator has a **precedence**, a rank that decides what is computed first. The ladder lists the ranks from top to bottom.', hi: ['k1', 'k2', 'k3', 'k4'] },
      { cap: '`**` (power) ranks highest in this expression, so `4 ** 2` is computed first: 16. The expression shrinks to `2 + 3 * 16`.', set: { expr: '2 + 3 * 16' }, show: ['w2'], hi: ['k2', 'w2'] },
      { cap: 'Next comes `*`: `3 * 16` is 48. Only `2 + 48` is left.', set: { expr: '2 + 48' }, show: ['w3'], hi: ['k3', 'w3'] },
      { cap: '`+` ranks lowest, so it runs last: `2 + 48` is **50**, the value of the whole expression.', set: { expr: '50' }, show: ['w4'], hi: ['k4', 'w4', 'expr'] },
      { cap: '**Brackets** outrank everything. In `(2 + 3) * 4 ** 2` the addition goes first (5), then `4 ** 2` (16), and `5 * 16` gives **80**.', set: { expr: '(2 + 3) * 4 ** 2' }, hide: ['w2', 'w3', 'w4'], show: ['p1', 'p2', 'p3'], hi: ['k1', 'p1', 'p2', 'p3'] },
      { cap: 'Use brackets whenever you mean a different order. A mean needs them: `(212 + 282 + 203) / 3`. Without them, only 203 would be divided by 3.', set: { expr: '(212 + 282 + 203) / 3' }, hide: ['p1', 'p2', 'p3'], hi: ['k1', 'expr'] }
    ]
  });

  /* ---------- Reading a traceback ---------- */
  def('traceback', {
    title: 'Reading an error message from the bottom up',
    summary: 'A two-line program misspells gc_content on line 2, and Python 3.12 prints a traceback: the last line gives the error type NameError, the message and a hint; the lines above give the file, line 2 and the failing code with carets under the name.',
    build(D) {
      return h('div',
        label('gc.py'),
        tight(D.code(['gc_content = 0.67', 'print([[typo|gc_contnet]])']), true),
        label('what Python 3.12 prints', true),
        tight(D.code([
          '[[tb|Traceback (most recent call last):]]',
          '  [[file|File "/home/student/gc.py"]], [[line|line 2]], in <module>',
          '    [[src|print(gc_contnet)]]',
          '          [[caret|^^^^^^^^^^]]',
          "[[etype|NameError]]: [[msg|name 'gc_contnet' is not defined.]] [[hint|Did you mean: 'gc_content'?]]"
        ], { term: true }), true),
        label('reading order', true, 'ordl'),
        D.cells(['type', 'message', 'where'], { key: 'ord', start: 1, label: (i) => ['1st', '2nd', '3rd'][i - 1], keys: ['n1', 'n2', 'n3'] }),
        D.note('fix', 'Fixed line 2: `print(gc_content)` prints `0.67`', { cls: 'gold' }));
    },
    steps: [
      { cap: 'This program stores a value in `gc_content`, but line 2 misspells the name. Python stops at that line and prints an error report called a **traceback**.', hi: ['typo'] },
      { cap: 'Read it **from the bottom up**. The last line starts with the **error type**: `NameError` means Python met a name it does not know.', show: ['ordl', 'n1'], hi: ['etype', 'n1'] },
      { cap: 'After the colon comes the **message**: which name is unknown. Recent Python versions add a hint, here the name you probably meant.', show: ['n2'], hi: ['msg', 'hint', 'n2'] },
      { cap: 'Then look up. The `File` line names the file and the **line number**: line 2. Below it is that line of code, with `^^^` under the exact problem.', show: ['n3'], hi: ['line', 'src', 'caret', 'n3'] },
      { cap: 'Fix the spelling on line 2 and run the program again: it prints `0.67`. The top line of the report, `Traceback (most recent call last):`, only announces it.', show: ['fix'], hi: ['fix', 'tb'] },
      { cap: 'Older Python versions and CodeSkulptor3 word messages differently and may leave out the hint or the `^^^` line. Everywhere, look for the same two things: the **error type** and the **line number**.', hi: ['etype', 'line'] }
    ]
  });

  /* ---------- Anatomy of def ---------- */
  def('def-anatomy', {
    title: 'The parts of a function definition',
    summary: 'The line def gc_content(seq): is labeled part by part (keyword def, function name, parameter in brackets, colon), followed by a body indented by 4 spaces that ends with return, and a call gc_content("ATGC") that gives 0.5.',
    build(D) {
      return h('div',
        tight(D.code([
          '[[kw|def]] [[name|gc_content]][[par|(seq)]][[colon|:]]',
          '[[ind|    ]]g = seq.count("G")',
          '[[ind|    ]]c = seq.count("C")',
          '[[ind|    ]][[ret|return]] (g + c) / len(seq)',
          '',
          '[[call|result = gc_content("ATGC")]]',
          '[[call|print(result)]]  [[out|# 0.5]]'
        ])),
        label('line 1, part by part', true),
        D.cells(['def', 'gc_content', '(seq)', ':'], { key: 'part', start: 1, label: (i) => ['keyword', 'name', 'parameter', 'colon'][i - 1], keys: ['kw', 'name', 'par', 'colon'] }));
    },
    steps: [
      { cap: 'A function definition starts with the **keyword** `def`. It tells Python that a new function is being defined here.', hi: ['kw'] },
      { cap: 'Next is the **function name**, `gc_content`. Pick a name that says what the function computes; you type it every time you call the function.', hi: ['name'] },
      { cap: 'In brackets is the **parameter** `seq`: a name for the input the function will receive. A function can have several parameters, separated by commas, or none: `()`.', hi: ['par'] },
      { cap: 'The line ends with a **colon**, which announces an indented block. Without it, Python stops with `SyntaxError: expected \':\'`.', hi: ['colon'] },
      { cap: 'The **body** is every line indented by **4 spaces** below the `def` line. The body ends where the indentation ends.', hi: ['ind', 'L2', 'L3', 'L4'] },
      { cap: '`return` sends the result back to the code that called the function, and the function stops there.', hi: ['ret'] },
      { cap: 'Defining a function runs nothing. The body runs only when you **call** the function: `gc_content("ATGC")` gives 0.5, because 2 of the 4 letters are G or C.', show: ['call', 'out'], hi: ['call', 'out'] }
    ]
  });

  /* ---------- Frames: local variables live and die with a call ---------- */
  def('call-frames', {
    title: 'Each function call gets its own frame',
    summary: 'The global frame holds mean3 and later avg; calling mean3(2, 4, 9) creates a frame with a = 2, b = 4, c = 9 and total = 15, returns 5.0 into avg, and then the frame disappears, so print(total) at the top level raises a NameError.',
    build(D) {
      const pair = (k, x, y, name, val, o = {}) => D.g(k,
        D.box('', x, y, 60, 26, name, { cls: 'blue', mono: true, size: 13, r: 13 }),
        D.arrow('', x + 62, y + 13, x + 80, y + 13),
        D.box('', x + 82, y, o.w || 60, 26, val, { mono: !o.plain, size: o.plain ? 12 : 13 }));
      return h('div',
        D.code([
          '[[def|def mean3(a, b, c):]]',
          '    [[l2|total = a + b + c]]',
          '    [[l3|return total / 3]]',
          '',
          '[[call|avg = mean3(2, 4, 9)]]',
          '[[pt|print(total)]]'
        ]),
        D.svg(400, 236,
          D.text('', 100, 14, 'global frame', { size: 13, weight: 700 }),
          D.box('', 8, 26, 184, 202, '', { cls: 'ghost' }),
          pair('g-mean3', 18, 42, 'mean3', 'function', { w: 74, plain: true }),
          pair('g-avg', 18, 82, 'avg', '5.0'),
          D.text('ftitle', 300, 14, 'mean3 frame', { size: 13, weight: 700 }),
          D.box('ff', 208, 26, 184, 202, '', { cls: 'ghost' }),
          pair('f-a', 218, 42, 'a', '2'), pair('f-b', 218, 76, 'b', '4'), pair('f-c', 218, 110, 'c', '9'),
          pair('f-total', 218, 144, 'total', '15'),
          D.g('f-ret', D.text('', 248, 197, 'return', { size: 12, cls: 'muted' }), D.box('', 300, 184, 60, 26, '5.0', { cls: 'gold', mono: true, size: 13 })),
          D.route('back', 'M330,210 V218 H130 V112'),
          D.text('gone', 300, 126, 'frame removed', { size: 13, cls: 'muted' })),
        D.note('err', "`print(total)` gives `NameError: name 'total' is not defined`", { cls: 'gold' }));
    },
    steps: [
      { cap: 'Python keeps names in **frames**. The **global frame** holds the names made at the top level of the file. Running the `def` line puts one name there: `mean3`, the function.', hi: ['def', 'g-mean3'] },
      { cap: 'The call `mean3(2, 4, 9)` creates a **new frame** just for this call. The parameters become **local variables** inside it: `a` is 2, `b` is 4, `c` is 9.', show: ['ff', 'ftitle', 'f-a', 'f-b', 'f-c'], hi: ['call', 'f-a', 'f-b', 'f-c'] },
      { cap: 'The body runs inside the new frame. `total = a + b + c` creates one more local variable: `total` is 15.', show: ['f-total'], hi: ['l2', 'f-total'] },
      { cap: '`return total / 3` sends **5.0** back to the line that made the call, so the global name `avg` now refers to 5.0.', show: ['f-ret', 'back', 'g-avg'], hi: ['l3', 'f-ret', 'g-avg'] },
      { cap: 'When the call ends, its frame **disappears** with everything inside it: `a`, `b`, `c` and `total`. Only the returned value survives, in `avg`.', hide: ['f-a', 'f-b', 'f-c', 'f-total', 'f-ret', 'back'], show: ['gone'], hi: ['g-avg'] },
      { cap: 'So `print(total)` at the top level fails with `NameError: name \'total\' is not defined`. To use a result outside a function, return it and store it.', show: ['pt', 'err'], hi: ['pt', 'err'] }
    ]
  });

  /* ---------- print versus return ---------- */
  def('print-return', {
    title: 'print shows a value, return hands it back',
    summary: 'Side by side: show(n) prints n * 2, so a = show(5) puts 10 on the screen but a is None; double(n) returns n * 2, so b = double(5) prints nothing but b is 10.',
    build(D) {
      return D.svg(400, 292,
        D.text('', 100, 14, 'with print', { size: 13, weight: 700 }),
        D.text('', 300, 14, 'with return', { size: 13, weight: 700 }),
        D.box('lfun', 8, 26, 184, 54, 'def show(n):\n' + sp(4) + 'print(n * 2)', { cls: 'code', anchor: 'start', size: 13 }),
        D.box('rfun', 208, 26, 184, 54, 'def double(n):\n' + sp(4) + 'return n * 2', { cls: 'code', anchor: 'start', size: 13 }),
        D.box('lcall', 8, 92, 184, 30, 'a = show(5)', { cls: 'code', anchor: 'start', size: 13 }),
        D.box('rcall', 208, 92, 184, 30, 'b = double(5)', { cls: 'code', anchor: 'start', size: 13 }),
        D.text('', 100, 142, 'screen', { size: 11, cls: 'muted' }), D.text('', 300, 142, 'screen', { size: 11, cls: 'muted' }),
        D.box('lscr', 30, 152, 140, 40, '', { cls: 'ghost' }), D.box('rscr', 230, 152, 140, 40, '', { cls: 'ghost' }),
        D.text('lout', 100, 172, '10', { mono: true, size: 16, weight: 700 }),
        D.text('rout', 300, 172, '(nothing)', { size: 12, cls: 'muted' }),
        D.g('avar', D.box('', 24, 214, 52, 30, 'a', { cls: 'blue', mono: true, size: 15, r: 15 }), D.arrow('', 78, 229, 104, 229), D.box('', 106, 212, 72, 34, 'None', { mono: true, size: 15 })),
        D.g('bvar', D.box('', 224, 214, 52, 30, 'b', { cls: 'blue', mono: true, size: 15, r: 15 }), D.arrow('', 278, 229, 304, 229), D.box('', 306, 212, 72, 34, '10', { mono: true, size: 15 })),
        D.text('lfor', 100, 276, 'for people to read', { size: 12, cls: 'gold' }),
        D.text('rfor', 300, 276, 'for the program to use', { size: 12, cls: 'gold' }));
    },
    steps: [
      { cap: 'Two functions that both compute `n * 2`. `show` **prints** the result and `double` **returns** it. They look alike, but they do different jobs.', hi: ['lfun', 'rfun'] },
      { cap: '`a = show(5)` runs the body of `show`, so `print` puts **10** on the screen. Printed text is for people to read; the rest of the program cannot use it.', show: ['lout'], hi: ['lcall', 'lscr'] },
      { cap: '`show` has no `return`, so the call hands back **None**, Python\'s value for "nothing". So `a` is None, and `a + 1` would fail with a TypeError.', show: ['avar'], hi: ['avar'] },
      { cap: '`b = double(5)` prints **nothing**: `return` quietly hands 10 back to the line that called the function.', show: ['rout'], hi: ['rcall', 'rscr'] },
      { cap: 'The call is replaced by the returned value, so `b` is **10**, ready for more work: `b + 1` is 11.', show: ['bvar'], hi: ['bvar'] },
      { cap: 'Rule of thumb: `print` is for people, `return` is for the rest of the program. Let functions return values, and print them where you want to see them.', show: ['lfor', 'rfor'], hi: ['lfor', 'rfor'] }
    ]
  });

  /* ---------- Boolean logic ---------- */
  def('truth-table', {
    title: 'and, or, not: the truth table',
    summary: 'A truth table for two Booleans A and B with the columns A and B, A or B and not A, followed by the test count >= 10 and quality >= 30 for count 25 and quality 28, which is True and False, so False; with or it is True.',
    build(D) {
      const A = [true, true, false, false], B = [true, false, true, false];
      const cols = [
        { k: 'cA', x: 8, w: 56, head: 'A', v: A, key: 'a', plain: true },
        { k: 'cB', x: 68, w: 56, head: 'B', v: B, key: 'b', plain: true },
        { k: 'c-and', x: 128, w: 108, head: 'A and B', v: A.map((a, i) => a && B[i]), key: 'and' },
        { k: 'c-or', x: 240, w: 96, head: 'A or B', v: A.map((a, i) => a || B[i]), key: 'or' },
        { k: 'c-not', x: 340, w: 52, head: 'not A', v: A.map((a) => !a), key: 'not' }
      ];
      return D.svg(400, 288,
        cols.map((c) => D.g(c.k,
          D.text('', c.x + c.w / 2, 22, c.head, { mono: true, size: 13, weight: 700 }),
          c.v.map((v, i) => D.box(c.key + (i + 1), c.x, 40 + i * 34, c.w, 30, v ? 'True' : 'False', { mono: true, size: 13, cls: c.plain ? '' : v ? 'green' : 'red' })))),
        D.text('ex-vals', 200, 196, 'count = 25' + sp(6) + 'quality = 28', { mono: true, size: 13 }),
        D.box('ex', 12, 210, 376, 34, 'count >= 10 and quality >= 30', { cls: 'code', size: 14 }),
        D.g('ex-res',
          D.text('ex-l', 186, 266, 'True and False', { mono: true, size: 14, cls: 'gold', anchor: 'end' }),
          D.arrow('', 194, 266, 224, 266, { cls: 'gold' }),
          D.text('ex-r', 232, 266, 'False', { mono: true, size: 14, cls: 'gold', anchor: 'start' })));
    },
    steps: [
      { cap: 'Python\'s two logic values are `True` and `False`, called **Booleans**. `and`, `or` and `not` combine them. The table lists every combination of two values, A and B.', hi: ['cA', 'cB'] },
      { cap: '`A and B` is True **only when both** are True. A single False makes the result False.', show: ['c-and'], hi: ['c-and'] },
      { cap: '`A or B` is True when **at least one** of them is True. It is False only when both are False.', show: ['c-or'], hi: ['c-or'] },
      { cap: '`not A` flips the value: `not True` is False and `not False` is True.', show: ['c-not'], hi: ['c-not'] },
      { cap: 'In code, A and B are usually comparisons. Keep a result only if `count >= 10 and quality >= 30`. With count 25 and quality 28 that is True and False, so **False**.', show: ['ex-vals', 'ex', 'ex-res'], hi: ['ex', 'a2', 'b2', 'and2'] },
      { cap: 'With `or` instead, the same values give **True**: a much looser filter. Choosing between `and` and `or` decides which data you keep.', set: { ex: 'count >= 10 or quality >= 30', 'ex-l': 'True or False', 'ex-r': 'True' }, hi: ['ex', 'a2', 'b2', 'or2'] }
    ]
  });

  /* ---------- Comparison operators ---------- */
  def('comparisons', {
    title: 'Comparisons give True or False',
    summary: 'A table of the six comparison operators with examples and results (5 == 5 True, 5 != 3 True, 3 < 5 True, 3 > 5 False, 5 <= 5 True, 5 >= 6 False, "ACTB" == "actb" False), and x = 5 (assigns) next to x == 5 (compares).',
    build(D) {
      const rows = [
        ['==', '5 == 5', 'equal', true], ['!=', '5 != 3', 'not equal', true],
        ['<', '3 < 5', 'less than', true], ['>', '3 > 5', 'greater than', false],
        ['<=', '5 <= 5', 'at most', true], ['>=', '5 >= 6', 'at least', false],
        ['==', '"ACTB" == "actb"', 'case differs', false]
      ];
      return D.svg(400, 338,
        D.text('', 33, 12, 'operator', { size: 11, cls: 'muted' }),
        D.text('', 70, 12, 'example', { size: 11, cls: 'muted', anchor: 'start' }),
        D.text('', 353, 12, 'result', { size: 11, cls: 'muted' }),
        rows.map(([op, ex, mean, res], i) => D.g('q' + (i + 1),
          D.box('', 8, 24 + i * 34, 50, 28, op, { cls: 'blue', mono: true, size: 15, weight: 700 }),
          D.text('', 70, 38 + i * 34, ex, { mono: true, size: 14, anchor: 'start' }),
          D.text('', 216, 38 + i * 34, mean, { size: 12, anchor: 'start', cls: 'muted' }),
          D.box('', 316, 24 + i * 34, 74, 28, res ? 'True' : 'False', { mono: true, size: 14, cls: res ? 'green' : 'red' }))),
        D.g('asg', D.box('asg', 8, 274, 186, 32, 'x = 5', { cls: 'code', size: 15 }), D.text('', 101, 322, 'assigns: x refers to 5', { size: 12, cls: 'muted' })),
        D.g('cmp', D.box('cmp', 206, 274, 186, 32, 'x == 5', { cls: 'code', size: 15 }), D.text('', 299, 322, 'compares: gives True', { size: 12, cls: 'muted' })));
    },
    steps: [
      { cap: '`==` asks "are these equal?" and `!=` asks "are these different?". Every comparison answers with a Boolean: `True` or `False`.', show: ['q1', 'q2'], hi: ['q1', 'q2'] },
      { cap: '`<` and `>` compare sizes: `3 < 5` is True and `3 > 5` is False. A comparison is True when the open side of the symbol faces the larger number.', show: ['q3', 'q4'], hi: ['q3', 'q4'] },
      { cap: '`<=` means less than **or equal to**, so `5 <= 5` is True. `>=` means greater than or equal to, so `5 >= 6` is False.', show: ['q5', 'q6'], hi: ['q5', 'q6'] },
      { cap: 'Text can be compared too, and case matters: `"ACTB" == "actb"` is False. A gene name must match exactly, capital letters included.', show: ['q7'], hi: ['q7'] },
      { cap: 'Do not confuse `=` and `==`. `x = 5` **assigns**: it makes `x` refer to 5. `x == 5` **compares**: it asks a question and gives True.', show: ['asg', 'cmp'], hi: ['asg', 'cmp'] },
      { cap: 'Comparisons are the tests inside `if` statements. Writing `if x = 5:` is a mistake: Python stops with a SyntaxError and asks whether you meant `==`.', hi: ['cmp'] }
    ]
  });

  /* ---------- if, elif, else ---------- */
  def('if-flow', {
    title: 'if, elif, else: the first true branch wins',
    summary: 'A flowchart of if count >= 1000 (high), elif count >= 100 (medium), else (low): with count = 250 the first test is False and the second True, so label becomes medium and else is skipped; with count = 40 the else branch runs; the same chain is then shown in R.',
    build(D) {
      const diamond = (k, cy, text) => D.g(k, D.path(k, `M42,${cy} L130,${cy - 32} L218,${cy} L130,${cy + 32} Z`, { cls: 'fill' }), D.text('', 130, cy, text, { mono: true, size: 13 }));
      // One code block that changes from Python to R in the last step: every line is a single keyed span (p1 to p8),
      // so `set` can swap the text and Back restores it.
      return h('div',
        D.svg(400, 340,
          D.box('start', 55, 6, 150, 32, 'count = 250', { cls: 'code', size: 14 }),
          D.arrow('', 130, 38, 130, 58),
          diamond('d1', 92, 'count >= 1000'),
          D.arrow('', 218, 92, 250, 92, { label: 'True', ly: -10 }),
          D.box('high', 252, 74, 134, 36, 'label = "high"', { mono: true, size: 12 }),
          D.arrow('', 130, 124, 130, 150, { label: 'False', lx: -24, ly: 1 }),
          diamond('d2', 184, 'count >= 100'),
          D.arrow('', 218, 184, 250, 184, { label: 'True', ly: -10 }),
          D.box('medium', 252, 166, 134, 36, 'label = "medium"', { mono: true, size: 12 }),
          D.arrow('', 130, 216, 130, 244, { label: 'False', lx: -24, ly: 1 }),
          D.text('', 38, 264, 'else', { mono: true, size: 12, cls: 'muted' }),
          D.box('low', 66, 246, 128, 36, 'label = "low"', { mono: true, size: 12 }),
          D.path('', 'M386,92 H394 V316'), D.path('', 'M386,184 H394'), D.path('', 'M194,264 H394'),
          D.arrow('', 394, 316, 292, 316),
          D.box('end', 150, 300, 140, 32, 'print(label)', { cls: 'code', size: 13 }),
          D.route('r1', 'M130,38 V58 M130,124 V150'),
          D.route('r2', 'M218,184 H250'),
          D.route('r3', 'M386,184 H394 V316 H294'),
          D.route('r4', 'M130,38 V58 M130,124 V150 M130,216 V244'),
          D.text('sk-high', 319, 124, 'skipped', { size: 11, cls: 'muted' }),
          D.text('sk-low', 100, 296, 'skipped', { size: 11, cls: 'muted' })),
        label('Python', true, 'lang'),
        D.code([
          '[[p1 c1|if count >= 1000:]]',
          '    [[p2 b1|label = "high"]]',
          '[[p3 c2|elif count >= 100:]]',
          '    [[p4 b2|label = "medium"]]',
          '[[p5 c3|else:]]',
          '    [[p6 b3|label = "low"]]',
          '[[p7|]]',
          '[[p8 pr|print(label)]]'
        ]));
    },
    steps: [
      { cap: 'An `if` / `elif` / `else` chain runs **one** of its branches. Each test is a comparison that is either True or False. Follow the chain with `count = 250`.', hi: ['start'] },
      { cap: 'First test: is 250 >= 1000? **False**, so Python skips the `"high"` branch and moves on to the `elif` test.', show: ['r1'], hi: ['d1', 'c1'] },
      { cap: 'Second test: is 250 >= 100? **True**, so this branch runs and `label` becomes `"medium"`.', show: ['r2'], hi: ['d2', 'medium', 'c2', 'b2'] },
      { cap: 'Once a branch has run, the rest of the chain is skipped, `else` included. Python continues below the chain, so `print(label)` shows `medium`.', show: ['r3', 'sk-high', 'sk-low'], hi: ['end', 'pr'] },
      { cap: 'Only the **first** True test wins, so the order of the tests matters. If `count >= 100` were tested first, even 5000 would be labeled medium.', hi: ['d1', 'd2'] },
      { cap: '`else` has no test of its own. It runs only when every test above it is False: with `count = 40`, both tests fail and `label` becomes `"low"`.', set: { start: 'count = 40' }, hide: ['r1', 'r2', 'r3', 'sk-high', 'sk-low'], show: ['r4'], hi: ['low', 'c3', 'b3'] },
      { cap: 'R writes the same chain with round brackets around each test and curly braces around each branch: `if (...) { } else if (...) { } else { }`. The first True test wins there too.',
        set: { lang: 'R: the same chain', start: 'count <- 40', high: 'label <- "high"', medium: 'label <- "medium"', low: 'label <- "low"',
          p1: 'if (count >= 1000) {', p2: 'label <- "high"', p3: '} else if (count >= 100) {', p4: 'label <- "medium"', p5: '} else {', p6: 'label <- "low"', p7: '}' },
        hi: ['p1', 'p3', 'p5', 'p7'] }
    ]
  });

  /* ---------- Coding style ---------- */
  def('style-compare', {
    title: 'The same function, written badly and well',
    summary: 'The same triangle-area function written as def F(X,y):return X*y/2 and as def triangle_area(base, height): with a docstring and return base * height / 2 on separate 4-space indented lines; both return 6.0 for base 3 and height 4.',
    build(D) {
      return h('div',
        label('hard to read'),
        tight(D.code(['def [[bn|F]]([[bn bs|X,y]])[[bl|:return]] [[bn bs bl|X*y/2]]']), true),
        label('easy to read', true),
        tight(D.code([
          'def [[gn|triangle_area]]([[gn gs|base, height]]):',
          '[[gi|    ]][[doc|"""Area of a triangle."""]]',
          '[[gi|    ]]return [[gn gs|base * height / 2]]'
        ]), true),
        D.note('both', 'Both work: `F(3, 4)` and `triangle_area(3, 4)` each return `6.0`.'),
        D.note('pep8', '**PEP 8**: the official style guide for Python code', { cls: 'gold' }));
    },
    steps: [
      { cap: 'Both versions run and give the same answer, the area of a triangle: `6.0` for base 3 and height 4. Only one of them is easy to read.', hi: ['both'] },
      { cap: '**Names**: `F`, `X` and `y` say nothing. `triangle_area`, `base` and `height` explain themselves. Python names use lowercase words joined by underscores, called **snake_case**.', hi: ['bn', 'gn'] },
      { cap: '**Spaces** go after commas and around operators: `base, height` and `base * height / 2` are easier to scan than `X,y` and `X*y/2`.', hi: ['bs', 'gs'] },
      { cap: '**One statement per line**: the body goes on its own lines, indented by **4 spaces**, instead of being squeezed in after the colon.', hi: ['bl', 'gi'] },
      { cap: 'A **docstring**, text in triple quotes right below the `def` line, says what the function does. `help(triangle_area)` displays it.', hi: ['doc'] },
      { cap: 'These rules come from **PEP 8**, Python\'s official style guide. Code is read far more often than it is written, so write it for the reader.', show: ['pep8'], hi: ['pep8'] }
    ]
  });

  /* ---------- Modules ---------- */
  def('py-modules', {
    title: 'Modules: ready-made code you import',
    summary: 'Three standard library modules (math with sqrt and pi, datetime with date, random with choice) and a program that imports them: math.sqrt(16) prints 4.0, math.pi prints 3.141592653589793, date(2026, 12, 5) prints 2026-12-05 and random.choice("ACGT") prints a random letter.',
    build(D) {
      const mod = (k, x, name, items) => D.g(k,
        D.box(k, x, 26, 120, 94, '', { cls: 'file' }),
        D.text('', x + 60, 43, name, { mono: true, size: 15, weight: 700 }),
        D.line('', x + 14, 56, x + 106, 56, { cls: 'thin' }),
        items.map(([ik, t], i) => D.text(ik, x + 60, 71 + i * 16, t, { mono: true, size: 12 })));
      return h('div',
        D.svg(400, 124,
          D.text('', 200, 11, 'the standard library: modules that come with Python', { size: 12, cls: 'muted' }),
          mod('mmath', 8, 'math', [['t-sqrt', 'sqrt'], ['t-pi', 'pi'], ['', 'log2']]),
          mod('mdate', 140, 'datetime', [['t-date', 'date'], ['', 'timedelta']]),
          mod('mrand', 272, 'random', [['t-choice', 'choice'], ['', 'randint']])),
        label('your program', true),
        D.code([
          '[[i1|import math]]',
          '[[u1|print(math.sqrt(16))]]',
          '[[u2|print(math.pi)]]',
          '[[i2|from datetime import date]]',
          '[[u3|print(date(2026, 12, 5))]]',
          '[[i3|import random]]',
          '[[u4|print(random.choice("ACGT"))]]'
        ]),
        label('output', true),
        D.code(['[[o1|4.0]]', '[[o2|3.141592653589793]]', '[[o3|2026-12-05]]', '[[o4|G]]'], { term: true }));
    },
    steps: [
      { cap: 'A **module** is a file of ready-made code: functions and values that someone already wrote and tested. The **standard library** is the set of modules that comes with Python.', show: [], hi: ['mmath', 'mdate', 'mrand'] },
      { cap: '`import math` loads the math module. Reach inside it with a dot: `math.sqrt(16)` is the square root, `4.0`, and `math.pi` is 3.141592653589793.', show: ['i1', 'u1', 'u2', 'o1', 'o2'], hi: ['mmath', 't-sqrt', 't-pi', 'i1', 'u1', 'u2', 'o1', 'o2'] },
      { cap: '`from datetime import date` brings in just one name, so you write `date(...)` without `datetime.` in front. `date(2026, 12, 5)` is 5 December 2026; printed, it shows `2026-12-05`.', show: ['i2', 'u3', 'o3'], hi: ['mdate', 't-date', 'i2', 'u3', 'o3'] },
      { cap: '`import random` brings in chance. `random.choice("ACGT")` picks one of the four letters at random: this run printed `G`, and the next run may print another.', show: ['i3', 'u4', 'o4'], hi: ['mrand', 't-choice', 'i3', 'u4', 'o4'] },
      { cap: 'The standard library comes with every Python installation, so there is nothing to download. Put imports at the **top** of the file; forget one and you get a NameError such as `name \'math\' is not defined`.', hi: ['i1', 'i2', 'i3'] }
    ]
  });

  /* ---------- Dates: subtract and add ---------- */
  const X = (d) => 40 + d * 10.4; // x position of the day d days after 8 November 2026
  def('date-math', {
    title: 'Date arithmetic with datetime',
    summary: 'A timeline from 8 November to 8 December 2026: date(2026, 12, 5) - date(2026, 11, 8) is timedelta(days=27), .days gives 27, and date(2026, 11, 8) + timedelta(days=30) is date(2026, 12, 8).',
    build(D) {
      const ticks = [];
      for (let d = 0; d <= 30; d++) ticks.push(D.line('', X(d), 171, X(d), 181, { cls: 'thin' }));
      const rule = (y, left, right, cls) => [
        D.text('', 192, y, left, { mono: true, size: 13, anchor: 'end', cls }),
        D.arrow('', 200, y, 228, y),
        D.text('', 236, y, right, { mono: true, size: 13, anchor: 'start', cls })];
      return D.svg(400, 300,
        D.box('code', 10, 8, 380, 34, 'date(2026, 11, 8)', { cls: 'code', size: 13 }),
        D.arrow('', 200, 43, 200, 60),
        D.box('res', 90, 62, 220, 30, 'prints as 2026-11-08', { cls: 'gold', mono: true, size: 13 }),
        D.line('', 28, 176, 372, 176, { cls: 'axis' }),
        ticks,
        D.line('', X(22.5), 160, X(22.5), 206, { cls: 'dash' }),
        D.text('', (X(0) + X(22)) / 2, 198, 'November', { size: 12, cls: 'muted' }),
        D.text('', (X(23) + X(30)) / 2, 198, 'December', { size: 12, cls: 'muted' }),
        D.g('d-start', D.dot('', X(0), 176, 7), D.text('', X(0), 150, '8 Nov', { size: 12, weight: 700 })),
        D.g('d-end', D.dot('', X(27), 176, 7, { cls: 'red' }), D.text('', X(27) - 4, 154, '5 Dec', { size: 12, weight: 700, anchor: 'end' })),
        D.g('d-new', D.dot('', X(30), 176, 7, { cls: 'gold' }), D.text('', X(30) + 2, 154, '8 Dec', { size: 12, weight: 700, anchor: 'start' })),
        D.g('span', D.path('', `M${X(0)},134 V124 H${X(27)} V134`, { cls: 'gold' }), D.text('', (X(0) + X(27)) / 2, 112, '27 days', { size: 13, cls: 'gold' })),
        D.arrow('jump', X(0), 168, X(30), 168, { cls: 'gold', bend: -70, label: '+ 30 days', size: 13 }),
        D.g('rules', D.box('', 50, 222, 300, 70, '', { cls: 'ghost' }),
          rule(238, 'date - date', 'timedelta'),
          rule(258, 'date + timedelta', 'date'),
          rule(278, 'date + date', 'TypeError', 'red')));
    },
    steps: [
      { cap: 'A `date` object is one day on the calendar, built from year, month and day: `date(2026, 11, 8)` is 8 November 2026. Import it first: `from datetime import date, timedelta`.', hi: ['d-start', 'code'] },
      { cap: '**Date minus date gives a duration**, a `timedelta` object. From 8 November to 5 December is `timedelta(days=27)`.', set: { code: 'date(2026, 12, 5) - date(2026, 11, 8)', res: 'timedelta(days=27)' }, show: ['d-end', 'span'], hi: ['span', 'res'] },
      { cap: '`.days` turns the duration into a plain whole number, **27**, ready for arithmetic. datetime knows that November has 30 days, so you never count by hand.', set: { code: '(date(2026, 12, 5) - date(2026, 11, 8)).days', res: '27' }, hi: ['res', 'span'] },
      { cap: '**Date plus duration gives a date**: 30 days after 8 November is `date(2026, 12, 8)`. The count carries over into December for you.', set: { code: 'date(2026, 11, 8) + timedelta(days=30)', res: 'date(2026, 12, 8)' }, hide: ['d-end', 'span'], show: ['jump', 'd-new'], hi: ['jump', 'd-new', 'res'] },
      { cap: 'The rule: subtracting two dates gives a `timedelta`, and adding a `timedelta` to a date gives a new date. Adding two dates makes no sense, so Python raises a TypeError.', show: ['rules'], hi: ['rules'] }
    ]
  });

  /* ---------- Wrapping around with % ---------- */
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const WH = { cx: 200, cy: 132, R: 86 };
  const wAng = (i) => (-90 + i * 360 / 7) * Math.PI / 180;
  const wAt = (i, r) => [WH.cx + (r || WH.R) * Math.cos(wAng(i)), WH.cy + (r || WH.R) * Math.sin(wAng(i))];
  const wMove = (i) => { const [x, y] = wAt(i), [x4, y4] = wAt(4); return [+(x - x4).toFixed(1), +(y - y4).toFixed(1)]; };
  def('modulo-wheel', {
    title: 'Wrapping around with %: a week wheel',
    summary: 'The days of the week on a wheel numbered Monday 0 to Sunday 6; counting 10 days forward from Friday (4) passes Sunday, wraps to Monday and ends on Monday, which (4 + 10) % 7 = 0 computes directly; (4 + 100) % 7 = 6 lands on Sunday.',
    build(D) {
      const { cx, cy, R } = WH;
      const [x4, y4] = wAt(4);
      // The 10 days counted from Friday: day number (4 + k) % 7 for k = 1 to 10.
      const walk = [];
      for (let k = 1; k <= 10; k++) {
        const x = 12 + (k - 1) * 38;
        walk.push(D.text('', x + 17, 246, String(k), { size: 11, cls: 'muted' }),
          D.box('w' + k, x, 254, 34, 32, DAYS[(4 + k) % 7], { size: 12 }));
      }
      // Day names sit beside their circle (Monday above it), clear of the gold marker ring.
      const dayLabel = (i, d) => {
        const [x, y] = wAt(i);
        if (i === 0) return D.text('', x, y - 33, d, { size: 13, weight: 700 });
        const right = Math.cos(wAng(i)) > 0;
        return D.text('', x + (right ? 30 : -30), y, d, { size: 13, weight: 700, anchor: right ? 'start' : 'end' });
      };
      return D.svg(400, 338,
        D.path('', `M${cx + R},${cy} a${R},${R} 0 1,0 ${-2 * R},0 a${R},${R} 0 1,0 ${2 * R},0`),
        DAYS.map((d, i) => { const [x, y] = wAt(i); return D.g('day' + i, D.box('day' + i, x - 20, y - 20, 40, 40, String(i), { cls: 'blue', mono: true, size: 17, weight: 700, r: 20 }), dayLabel(i, d)); }),
        D.route('mark', `M${(x4 - 25).toFixed(1)},${y4.toFixed(1)} a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0`, { head: false }),
        D.g('walk', walk),
        D.box('calc', 30, 298, 340, 34, 'Monday = 0 ... Sunday = 6', { cls: 'code', size: 15 }));
    },
    steps: [
      { cap: 'Put the days of the week on a wheel and number them from 0: Monday is 0, Tuesday is 1, and so on up to Sunday, 6. Python\'s `date.weekday()` uses the same numbers.', hi: ['day0', 'day6'] },
      { cap: 'Start on **Friday**, day 4. Which day is 10 days later? Plain addition gives 4 + 10 = 14, but the wheel has no day 14.', set: { calc: '4 + 10 = 14 ?' }, show: ['mark'], hi: ['day4'] },
      { cap: 'Count 10 days around the wheel instead. After 7 days you are back on Friday, and 3 more days reach **Monday**, day 0.', show: ['walk'], move: { mark: wMove(0) }, hi: ['w7', 'w10', 'day0'] },
      { cap: '`%` does the counting for you: `(4 + 10) % 7` is `14 % 7`, the remainder after dividing 14 by 7. That is **0**: Monday.', set: { calc: '(4 + 10) % 7 = 14 % 7 = 0' }, hi: ['calc', 'day0', 'w10'] },
      { cap: 'A remainder after dividing by 7 is always between 0 and 6, so `(day + n) % 7` lands on a real day for any n. Friday plus 100 days: `(4 + 100) % 7` is 6, Sunday.', set: { calc: '(4 + 100) % 7 = 104 % 7 = 6' }, hide: ['walk'], move: { mark: wMove(6) }, hi: ['calc', 'day6'] }
    ]
  });

  /* ---------- Working on a graded project ---------- */
  def('dev-cycle', {
    title: 'Working on a project with an automated grader',
    summary: 'A vertical cycle: read the specification, write one small function, test it yourself, submit, read the feedback and fix what failed, with a loop from fix back to testing and a loop from feedback to the next function.',
    build(D) {
      const box = (k, i, t) => D.box(k, 102, 8 + i * 58, 196, 40, t, { size: 13, cls: i === 0 ? 'navy' : '' });
      const down = (k, i) => D.g(k, D.arrow('', 200, 48 + i * 58, 200, 64 + i * 58));
      return D.svg(400, 346,
        box('b1', 0, 'Read the specification'),
        down('a1', 0), box('b2', 1, 'Write one small function'),
        down('a2', 1), box('b3', 2, 'Test it yourself'),
        down('a3', 2), box('b4', 3, 'Submit'),
        down('a4', 3), box('b5', 4, 'Read the feedback'),
        down('a5', 4), box('b6', 5, 'Fix what failed'),
        D.route('loopfix', 'M298,318 H330 V144 H302'),
        D.text('lfix', 364, 228, 'test\nagain', { size: 11, cls: 'gold' }),
        D.g('loopnext', D.path('', 'M102,260 H70 V86'), D.arrow('', 70, 86, 98, 86)),
        D.text('lnext', 34, 172, 'all\npassed:\nnext\nfunction', { size: 11, weight: 700 }));
    },
    steps: [
      { cap: '**Read the specification** carefully, more than once. It tells you each function\'s name, what goes in and what must come out. Many lost points come from misreading it.', hi: ['b1'] },
      { cap: '**Write one small function** at a time, not the whole project at once. A small piece is easier to get right and easier to fix.', show: ['a1', 'b2'], hi: ['b2'] },
      { cap: '**Test it yourself** before you submit: call it with your own examples and compare with answers worked out by hand. Include **edge cases** such as 0, negative numbers or empty text.', show: ['a2', 'b3'], hi: ['b3'] },
      { cap: '**Submit** to the automated grader (OwlTest in this course). It runs its own tests on your code, often with inputs you did not think of.', show: ['a3', 'b4'], hi: ['b4'] },
      { cap: '**Read the feedback** carefully: which test failed, which input it used, what it expected and what your code returned.', show: ['a4', 'b5'], hi: ['b5'] },
      { cap: '**Fix** what failed, test again yourself, then resubmit. When everything passes, start the next function. Many small cycles beat one big attempt at the deadline.', show: ['a5', 'b6', 'loopfix', 'lfix', 'loopnext', 'lnext'], hi: ['b6', 'loopfix'] }
    ]
  });
})();
