/* Linux diagrams for the IBM course topics: where Linux comes from, the terminal, commands and help, permissions,
   text tools, networking, archives and shell scripting. Original visuals for BioBridge; every number shown was checked
   against the simulated practice files in ~/project with tools/run_in_vfs.py. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h } = BB;
  const def = BB.diagram.define;

  /* ---------- helpers ---------- */
  const XMLNS = 'http://www.w3.org/XML/1998/namespace';
  // Keep runs of spaces in SVG text (terminal output, ls -l columns).
  function keep(node) {
    const list = node.tagName.toLowerCase() === 'text' ? [node] : Array.from(node.querySelectorAll('text'));
    list.forEach((t) => { t.setAttributeNS(XMLNS, 'xml:space', 'preserve'); t.style.whiteSpace = 'pre'; });
    return node;
  }
  // Terminal text in a dark box (code text color); a step can outline the box in gold.
  const term = (D, k, x, y, w, hgt, text, size) => keep(D.box(k, x, y, w, hgt, text, { cls: 'code', anchor: 'start', size: size || 12, r: 4 }));
  // Code-colored text without a box of its own, for drawing on top of a dark background.
  const ctext = (D, k, x, y, str, size) => { const t = keep(D.text(k, x, y, str, { mono: true, size: size || 12, anchor: 'start' })); t.style.fill = 'var(--code-text)'; return t; };

  // Practice data (from ~/project/data).
  const COUNTS = [['gene', 'ctrl_1', 'ctrl_2'], ['HSPA1A', 212, 282], ['HSPA1B', 172, 202], ['HSPA6', 2, 0], ['DNAJB1', 813, 1035],
    ['HSPH1', 1554, 2122], ['HSPB1', 2541, 2722], ['BAG3', 270, 511], ['ACTB', 44289, 46223], ['GAPDH', 35384, 42943],
    ['EEF1A1', 98622, 107855], ['TP53', 613, 868], ['FOS', 220, 223]];
  const SAMPLES = [['sample', 'condition', 'replicate', 'temperature_C'], ['ctrl_1', 'control', '1', '37'], ['ctrl_2', 'control', '2', '37'],
    ['ctrl_3', 'control', '3', '37'], ['heat_1', 'heat_shock', '1', '42'], ['heat_2', 'heat_shock', '2', '42'], ['heat_3', 'heat_shock', '3', '42']];

  /* ---------- Module 1: where Linux comes from ---------- */
  def('unix-family', {
    title: 'Where Linux comes from',
    summary: 'A family tree: Unix, created at Bell Labs in 1969, leads to BSD and then macOS. The GNU tools (from 1983) and the Linux kernel (1991) are free, Unix-like rewrites; together they form the Linux distributions.',
    build(D) {
      return D.svg(400, 288,
        D.box('unix', 125, 8, 150, 48, 'Unix\nBell Labs, 1969', { cls: 'navy', size: 14 }),
        D.g('e-bsd', D.path('', 'M200,56 V82 H82 V108')),
        D.box('bsd', 14, 108, 136, 44, 'BSD\nBerkeley', { cls: 'blue', size: 13 }),
        D.g('e-mac', D.line('', 82, 152, 82, 212)),
        D.box('mac', 14, 212, 136, 44, 'macOS', { cls: 'blue', size: 14 }),
        D.g('e-gnu', D.line('', 200, 82, 216, 82, { cls: 'dash' }), D.line('', 216, 82, 216, 108, { cls: 'dash' }),
          D.text('', 236, 72, 'free, Unix-like', { size: 11, cls: 'muted', anchor: 'start' })),
        D.g('e-kernel', D.line('', 216, 82, 340, 82, { cls: 'dash' }), D.line('', 340, 82, 340, 108, { cls: 'dash' })),
        D.box('gnu', 164, 108, 104, 44, 'GNU tools\nfrom 1983', { cls: 'green', size: 13 }),
        D.box('kernel', 288, 108, 104, 44, 'Linux kernel\n1991', { cls: 'orange', size: 13 }),
        D.g('e-dist', D.text('', 278, 130, '+', { size: 16, weight: 700 }), D.path('', 'M216,152 V180 H340 V152'), D.arrow('', 278, 180, 278, 210)),
        D.box('dist', 180, 212, 196, 44, 'Linux distributions\nkernel + GNU tools', { cls: 'navy', size: 13 }),
        D.g('why', D.text('', 82, 274, 'on a Mac', { size: 12, cls: 'gold' }), D.text('', 278, 274, 'servers, clusters, cloud', { size: 12, cls: 'gold' })));
    },
    steps: [
      { cap: '**Unix** was created at Bell Labs in **1969**. Its ideas still shape Linux today: small tools that each do one job, combined by typing commands in a shell.', show: [], hi: ['unix'] },
      { cap: 'Unix spread to universities and companies, and versions branched off. **BSD**, from the University of California, Berkeley, is one of them. Apple\'s **macOS** descends from BSD.', show: ['e-bsd', 'bsd', 'e-mac', 'mac'], hi: ['bsd', 'mac'] },
      { cap: 'From **1983**, the **GNU project** wrote free versions of the Unix tools, such as the shell and commands like `ls`. Free means anyone may use, study, change and share them.', show: ['e-gnu', 'gnu'], hi: ['gnu'] },
      { cap: 'In **1991**, Linus Torvalds released the **Linux kernel**: the core program that controls the hardware. Like the GNU tools, it works like Unix but was written from scratch.', show: ['e-kernel', 'kernel'], hi: ['kernel'] },
      { cap: 'The Linux kernel plus the GNU tools make a complete, free operating system. Groups package it with other software as **distributions**, such as Ubuntu and Fedora.', show: ['e-dist', 'dist'], hi: ['gnu', 'kernel', 'dist'] },
      { cap: 'Why it matters: most servers, clusters and cloud machines that run bioinformatics run Linux. And the commands you learn here also work, almost unchanged, in the Terminal of a Mac.', show: ['why'], hi: ['dist', 'mac', 'why'] }
    ]
  });

  /* ---------- Module 1: distributions ---------- */
  def('distros', {
    title: 'One kernel, many distributions',
    summary: 'The Linux kernel in the center with distribution families around it: Debian and Ubuntu (apt, .deb files), Red Hat Enterprise Linux, Fedora, Rocky Linux and AlmaLinux (dnf, .rpm files), Arch (pacman) and openSUSE (zypper).',
    build(D) {
      const fam = (k, x, y, cls, name, pm, lx, ly) => D.g(k,
        D.line('', 200, 160, lx, ly),
        D.box('', x, y, 176, 92, '', { cls }),
        D.text('', x + 88, y + 30, name, { size: 13, weight: 700 }),
        D.box(k + '-pm', x + 16, y + 56, 144, 26, pm, { mono: true, size: 12, r: 13 }));
      return D.svg(400, 334,
        fam('deb', 8, 8, 'violet', 'Debian, Ubuntu', 'apt, .deb files', 96, 54),
        fam('rh', 216, 8, 'orange', 'RHEL, Fedora,\nRocky, AlmaLinux', 'dnf, .rpm files', 304, 54),
        fam('arch', 8, 214, 'green', 'Arch', 'pacman', 96, 260),
        fam('suse', 216, 214, 'blue', 'openSUSE', 'zypper', 304, 260),
        D.box('kernel', 136, 132, 128, 56, 'Linux\nkernel', { cls: 'navy', size: 15 }),
        D.g('same', D.text('', 62, 326, 'ls, cd, grep', { mono: true, size: 12, cls: 'gold', anchor: 'start' }),
          D.text('', 158, 326, 'work the same on all of them', { size: 12, cls: 'gold', anchor: 'start' })));
    },
    steps: [
      { cap: 'Every Linux distribution runs the same **Linux kernel**. A distribution adds the GNU tools, other software, settings and its own way to install programs.', hi: ['kernel'] },
      { cap: '**Debian** and **Ubuntu** form one family. They install software with `apt`, from packages stored as `.deb` files.', show: ['deb'], hi: ['deb'] },
      { cap: '**Red Hat Enterprise Linux** (RHEL), **Fedora**, **Rocky Linux** and **AlmaLinux** form another family. They install software with `dnf`, from `.rpm` packages.', show: ['rh'], hi: ['rh'] },
      { cap: 'Other distributions have their own tools: **Arch** uses `pacman` and **openSUSE** uses `zypper`.', show: ['arch', 'suse'], hi: ['arch', 'suse'] },
      { cap: 'Same kernel, nearly the same commands: `ls`, `cd` and `grep` work everywhere. The main difference a beginner meets is the **package manager**, the command that installs software.', show: ['same'], hi: ['deb-pm', 'rh-pm', 'arch-pm', 'suse-pm', 'same'] }
    ]
  });

  /* ---------- Module 1: architecture ---------- */
  def('linux-layers', {
    title: 'Linux in layers, from hardware to you',
    summary: 'Five stacked layers: hardware at the bottom, then the kernel, the shell and system tools, applications, and you at the top. A command such as ls travels down through the layers and its result comes back up.',
    build(D) {
      const layer = (k, y, cls, name, ex, mono) => D.g(k, D.box('', 10, y, 288, 46, '', { cls }),
        D.text('', 24, y + 16, name, { size: 14, weight: 700, anchor: 'start' }), D.text('', 24, y + 33, ex, { size: 12, anchor: 'start', mono }));
      return D.svg(400, 298,
        layer('you', 34, 'blue', 'You', 'type commands, read the results'),
        layer('apps', 86, 'violet', 'Applications', 'Python, R, RStudio, a browser'),
        layer('shell', 138, 'green', 'Shell and system tools', 'bash, ls, grep', true),
        layer('kernel', 190, 'orange', 'Kernel', 'processes, memory, files, devices'),
        layer('hw', 242, 'muted', 'Hardware', 'CPU, memory, disk'),
        D.g('trip',
          D.text('', 326, 16, 'ls', { mono: true, size: 14, cls: 'gold' }),
          D.text('', 370, 16, 'result', { size: 12, cls: 'blue' }),
          D.arrow('down', 326, 30, 326, 284, { cls: 'gold' }),
          D.arrow('up', 370, 284, 370, 30, { cls: 'blue' })));
    },
    steps: [
      { cap: '**Hardware** is the physical machine: the CPU that computes, the memory that holds running programs, and the disk that stores your files.', show: ['hw'], hi: ['hw'] },
      { cap: 'The **kernel** is the core of Linux and the only layer that talks to the hardware directly. It runs processes, shares out memory, and manages files and devices.', show: ['kernel'], hi: ['kernel'] },
      { cap: 'The **shell** (usually bash) reads the commands you type. **System tools** such as `ls` and `grep` are small programs that each do one job.', show: ['shell'], hi: ['shell'] },
      { cap: '**Applications** such as Python, R, RStudio and a web browser also run on top of the kernel and ask it for what they need: files, memory, the network.', show: ['apps'], hi: ['apps'] },
      { cap: '**You** are the top layer. You type into the shell or work in an application, and never have to drive the hardware yourself.', show: ['you'], hi: ['you'] },
      { cap: 'A command travels **down**: you type `ls`, bash starts the `ls` program, which asks the kernel for the folder, and the kernel reads the disk. The result comes back **up** to your screen.', show: ['trip'], hi: [] }
    ]
  });

  /* ---------- Module 1: the prompt ---------- */
  def('prompt-anatomy', {
    title: 'Reading the prompt',
    summary: 'The prompt student@biobridge:~/project$ followed by the command ls -l data, split into the user name, @, the host (machine) name, a colon, the current folder, the dollar sign, and what you type.',
    build(D) {
      const part = (k, x, w, t, cls) => D.box(k, x, 62, w, 32, t, { cls, mono: true, size: 12, r: 6 });
      const lab = (k, x, ly, y, t) => D.g(k, D.line('', x, 96, x, ly, { cls: 'thin' }), D.text('', x, y, t, { size: 12 }));
      return D.svg(400, 212,
        term(D, 'line', 8, 8, 384, 34, 'student@biobridge:~/project$ ls -l data', 14),
        part('user', 18, 60, 'student', 'green'), part('at', 81, 16, '@', 'muted'), part('host', 100, 75, 'biobridge', 'violet'),
        part('colon', 178, 16, ':', 'muted'), part('dir', 197, 75, '~/project', 'dir'), part('dollar', 275, 16, '$', 'orange'),
        part('cmd', 301, 82, 'ls -l data', 'code'),
        lab('l-user', 48, 106, 122, 'user\nname'), lab('l-host', 137.5, 152, 168, 'host\n(machine)'),
        lab('l-dir', 234.5, 106, 122, 'current\nfolder'), lab('l-dollar', 283, 156, 164, 'ready'),
        lab('l-cmd', 342, 106, 122, 'what you\ntype'),
        D.g('root', D.box('', 30, 188, 22, 24, '#', { cls: 'code', size: 13 }),
          D.text('', 60, 200, 'in place of $ means root, the administrator', { size: 12, cls: 'red', anchor: 'start' })),
        D.g('tip', D.text('', 46, 200, 'tutorial:', { size: 12, cls: 'muted' }),
          term(D, '', 78, 188, 112, 24, '$ ls -l data', 12), D.arrow('', 196, 200, 218, 200),
          D.text('', 252, 200, 'you type:', { size: 12, cls: 'muted' }), term(D, '', 290, 188, 92, 24, 'ls -l data', 12)));
    },
    steps: [
      { cap: 'Before every command, the shell prints a **prompt**: a sign that it is ready. It also tells you who you are, which machine you are on, and where you are.', hi: ['line'] },
      { cap: '`student` is your **user name**, `@` means "at", and `biobridge` is the **host**: the name of the machine you are logged in to, which may be a remote server.', show: ['l-user', 'l-host'], hi: ['user', 'at', 'host'] },
      { cap: 'After the `:` comes the **current folder**. `~` is short for your home folder, so `~/project` means `/home/student/project`.', show: ['l-dir'], hi: ['colon', 'dir'] },
      { cap: '`$` means the shell is ready for a normal user. A `#` in its place usually means you are **root**, the administrator, who can change anything: be careful.', show: ['l-dollar', 'root'], hi: ['dollar', 'root'] },
      { cap: 'Everything after the prompt is **what you type**: here the command `ls -l data`. Press Enter to run it; the prompt comes back when it has finished.', show: ['l-cmd'], hi: ['cmd'] },
      { cap: 'Tutorials often print the prompt sign too, as in `$ ls -l data`. Do not type the `$`: type only `ls -l data`.', hide: ['root'], show: ['tip'], hi: ['dollar', 'tip'] }
    ]
  });

  /* ---------- Module 1: Tab completion and history ---------- */
  const P0 = 'student@biobridge:~$ ', P1 = 'student@biobridge:~/project/data$ ';
  def('tab-history', {
    title: 'Type less: Tab completion and history',
    summary: 'A terminal where Tab completes cd pro to cd project/, two Tabs list samples.tsv and sequences.fa, the Up arrow brings back earlier commands, and history lists them with numbers.',
    build(D) {
      const L = (k, i, t) => term(D, k, 14, 16 + i * 22, 372, 20, t);
      const key = (k, x, w, t) => D.box(k, x, 140, w, 28, t, { size: 13, r: 7, weight: 700 });
      const hrow = (k, y, t) => D.box(k, 18, y, 150, 22, t, { mono: true, size: 12, anchor: 'start', r: 4 });
      return D.svg(400, 290,
        D.box('', 8, 8, 384, 122, '', { cls: 'code', r: 10 }),
        D.g('scrA', L('a1', 0, P0 + 'cd pro')),
        D.g('scrB', L('b1', 0, P1 + 'ls s'), L('b2', 1, 'samples.tsv   sequences.fa'), L('b3', 2, P1 + 'ls s')),
        D.g('scrC', L('c1', 0, P1 + 'ls samples.tsv')),
        D.g('scrD', L('d1', 0, P1 + 'history'), D.box('dout', 12, 39, 376, 88, '', { cls: 'code', r: 6 }),
          ['    1  cd project/', '    2  cd data', '    3  ls samples.tsv', '    4  history'].map((t, i) => ctext(D, '', 24, 49 + i * 22, t, 12))),
        key('kTab', 8, 60, 'Tab'), key('kTab2', 76, 92, 'Tab Tab'), key('kUp', 176, 72, '↑ Up'), key('kDown', 256, 88, '↓ Down'),
        D.g('hist', D.box('', 8, 182, 384, 100, '', { cls: 'ghost' }),
          D.text('', 20, 198, 'your earlier commands', { size: 12, anchor: 'start', cls: 'muted' }),
          hrow('h1', 208, 'cd project/'), hrow('h2', 232, 'cd data'), hrow('h3', 256, 'ls samples.tsv'),
          D.arrow('', 196, 266, 196, 212, { cls: 'gold' }), D.text('', 208, 222, 'Up: older', { size: 12, anchor: 'start', cls: 'gold' }),
          D.arrow('', 296, 212, 296, 266, { cls: 'blue' }), D.text('', 308, 256, 'Down: newer', { size: 12, anchor: 'start', cls: 'blue' })));
    },
    steps: [
      { cap: 'Typing long names is slow, and typos are easy. Type just the start of a name, here `cd pro`, and press **Tab**.', show: [], hi: ['a1', 'kTab'] },
      { cap: 'Only one name in your home folder starts with `pro`, so Tab completes it: `cd project/`. The `/` at the end shows that it is a folder.', set: { a1: P0 + 'cd project/' }, hi: ['a1'] },
      { cap: 'Now in `~/project/data`, two names start with `s`. Tab completes only as far as they agree, here nothing more, so press **Tab twice** to list the choices.', hide: ['scrA'], show: ['scrB'], hi: ['b2', 'kTab2'] },
      { cap: 'Type one more letter, `a`. Now only samples.tsv matches, and **Tab** finishes the name: `ls samples.tsv`.', set: { b3: P1 + 'ls samples.tsv' }, hi: ['b3', 'kTab'] },
      { cap: 'Press **Up** to bring back your last command, and again for the one before. **Down** goes forward again. Edit the line, or press Enter to run it again.', hide: ['scrB'], show: ['scrC', 'hist'], hi: ['c1', 'kUp', 'h3'] },
      { cap: '`history` prints your earlier commands with numbers, oldest first. It is a quick way to see exactly what you ran.', hide: ['scrC'], show: ['scrD'], hi: ['dout'] }
    ]
  });

  /* ---------- Module 1: editors ---------- */
  def('vim-modes', {
    title: 'Vim has modes; nano does not',
    summary: 'A state diagram: Vim starts in Normal mode, i switches to Insert mode and Esc switches back, and a colon opens the command line where :w saves, :q quits, :wq saves and quits and :q! quits without saving. Below, nano: no modes, Ctrl+O saves and Ctrl+X exits.',
    build(D) {
      const cmd = (k, x, y, c, what) => D.g(k, D.box('', x, y, 46, 24, c, { cls: 'code', size: 13 }), D.text('', x + 54, y + 12, what, { size: 12, anchor: 'start' }));
      return D.svg(400, 330,
        D.g('start', D.text('', 95, 12, 'vim notes.txt', { mono: true, size: 12, cls: 'muted' }), D.arrow('', 95, 20, 95, 44)),
        D.box('normal', 20, 46, 150, 58, 'Normal mode\nkeys are commands', { cls: 'blue', size: 13 }),
        D.box('insert', 230, 46, 150, 58, 'Insert mode\nkeys type text', { cls: 'green', size: 13 }),
        D.arrow('a-i', 172, 60, 228, 60, { bend: -16, label: 'i', mono: true, size: 15 }),
        D.arrow('a-esc', 228, 90, 172, 90, { bend: -16, label: 'Esc', ly: 13, size: 13 }),
        D.arrow('a-colon', 95, 106, 95, 148, { label: ':', lx: 12, ly: 1, mono: true, size: 18 }),
        D.g('cmdline', D.box('', 20, 150, 360, 100, ''),
          D.text('', 32, 168, 'command line: type a command, then Enter', { size: 12, anchor: 'start', cls: 'muted' }),
          cmd('cw', 32, 182, ':w', 'save'), cmd('cwq', 186, 182, ':wq', 'save and quit'),
          cmd('cq', 32, 216, ':q', 'quit'), cmd('cqf', 186, 216, ':q!', 'quit without saving')),
        D.g('nano', D.box('', 20, 266, 360, 56, '', { cls: 'muted' }),
          D.text('', 32, 283, 'nano: no modes, you just type', { size: 13, anchor: 'start', weight: 700 }),
          D.box('', 32, 294, 34, 22, '^O', { cls: 'code', size: 12 }), D.text('', 74, 305, 'save (Ctrl+O)', { size: 12, anchor: 'start' }),
          D.box('', 196, 294, 34, 22, '^X', { cls: 'code', size: 12 }), D.text('', 238, 305, 'exit (Ctrl+X)', { size: 12, anchor: 'start' })));
    },
    steps: [
      { cap: 'Vim starts in **Normal mode**. Here every key is a command, so typing a sentence would do strange things. Whenever you feel lost, press **Esc** to get back here.', show: [], hi: ['normal', 'start'] },
      { cap: 'Press `i` to switch to **Insert mode**. Now the keys type text, as in any other editor.', show: ['insert', 'a-i'], hi: ['insert', 'a-i'] },
      { cap: 'Press **Esc** to leave Insert mode and return to Normal mode. You must be in Normal mode to save or quit.', show: ['a-esc'], hi: ['a-esc', 'normal'] },
      { cap: 'In Normal mode, `:` opens the **command line** at the bottom of the screen. Type a command and press Enter: `:w` saves (writes) the file, `:q` quits.', show: ['a-colon', 'cmdline'], hi: ['a-colon', 'cw', 'cq'] },
      { cap: '`:wq` saves and quits. `:q!` quits **without saving**: the `!` means "yes, throw away my changes". A plain `:q` refuses to quit while there are unsaved changes.', hi: ['cwq', 'cqf'] },
      { cap: '**nano** has no modes: you just type. `Ctrl+O` saves and `Ctrl+X` exits. nano lists its shortcuts at the bottom of its screen, written as `^O` and `^X`.', show: ['nano'], hi: ['nano'] }
    ]
  });

  /* ---------- Module 1: installing software ---------- */
  def('package-manager', {
    title: 'How a package manager installs software',
    summary: 'An online repository of packages above your computer. apt update refreshes the list of available versions, apt install samtools downloads samtools plus the packages it depends on, apt upgrade installs newer versions, and sudo runs these as the administrator. dnf and conda are shown as alternatives.',
    build(D) {
      const chip = (k, x, y, w, t, cls) => D.box(k, x, y, w, 24, t, { mono: true, size: 12, r: 12, cls });
      return D.svg(400, 356,
        D.g('cmdbar', D.box('', 8, 6, 384, 30, '', { cls: 'code', r: 6 }), D.box('', 12, 9, 18, 24, '$', { cls: 'code', size: 13 }),
          term(D, 'cmd', 62, 9, 320, 24, 'apt update', 13), D.box('sudo', 29.5, 10, 38, 22, 'sudo', { cls: 'code', size: 13, r: 4 })),
        D.g('repo', D.box('rbox', 8, 46, 384, 66, '', { cls: 'violet' }),
          D.text('', 20, 62, 'online repository: thousands of packages', { size: 12, anchor: 'start', weight: 700 }),
          chip('', 18, 76, 80, 'samtools'), D.text('', 118, 88, 'needs', { size: 11, cls: 'muted' }),
          chip('', 138, 76, 50, 'lib A', 'muted'), chip('', 192, 76, 50, 'lib B', 'muted'),
          chip('', 258, 76, 48, 'nano'), chip('', 312, 76, 48, 'bash'), D.text('', 377, 86, '...', { size: 14 })),
        D.arrow('a-update', 86, 114, 86, 156, { cls: 'blue', label: 'update', lx: 30, ly: 1 }),
        D.arrow('a-dl', 284, 114, 284, 156, { cls: 'gold', label: 'download', lx: 54, ly: 1 }),
        D.g('pc', D.box('', 8, 158, 384, 138, '', { cls: 'ghost' }), D.text('', 20, 174, 'your computer', { size: 12, anchor: 'start', weight: 700 })),
        D.box('list', 20, 184, 150, 100, 'package list:\nwhat exists, and\nthe newest versions', { cls: 'blue', size: 12 }),
        D.g('inst', D.box('', 182, 184, 198, 100, '', { cls: 'green' }), D.text('', 194, 200, 'installed', { size: 12, anchor: 'start', weight: 700 })),
        chip('p-nano', 194, 210, 50, 'nano'), chip('p-bash', 250, 210, 50, 'bash'),
        D.text('upg', 308, 222, '↑ newer', { size: 12, anchor: 'start', cls: 'gold' }),
        D.g('p-sam', chip('', 194, 246, 80, 'samtools'), chip('', 280, 246, 46, 'lib A', 'muted'), chip('', 330, 246, 46, 'lib B', 'muted')),
        D.g('note', D.box('', 8, 306, 384, 46, '', { cls: 'ghost' }),
          D.text('', 18, 321, 'Fedora, Red Hat', { size: 12, anchor: 'start', weight: 700 }),
          D.text('', 128, 321, 'sudo dnf install samtools', { size: 12, anchor: 'start', mono: true }),
          D.text('', 18, 341, 'with conda', { size: 12, anchor: 'start', weight: 700 }),
          D.text('', 128, 341, 'conda install -c bioconda samtools', { size: 12, anchor: 'start', mono: true })));
    },
    steps: [
      { cap: 'Linux installs software from an online **repository**: a server holding thousands of ready-made packages. Each package also lists the other packages it **depends on**.', hi: ['rbox'] },
      { cap: '`sudo apt update` downloads a fresh **package list**: what exists and the newest versions. It installs nothing; it only updates what your computer knows.', show: ['cmdbar', 'a-update'], hi: ['a-update', 'list'] },
      { cap: '`sudo apt install samtools` downloads samtools **plus every package it depends on**, then installs them all. You never have to fetch dependencies by hand.', set: { cmd: 'apt install samtools' }, show: ['a-dl', 'p-sam'], hi: ['a-dl', 'p-sam'] },
      { cap: '`sudo apt upgrade` installs newer versions of the packages you **already have**. Run `sudo apt update` first, so apt knows what is new.', set: { cmd: 'apt upgrade', 'a-dl': 'newer versions' }, show: ['upg'], hi: ['a-dl', 'p-nano', 'p-bash', 'upg'] },
      { cap: '`sudo` runs one command as the **administrator** (root), because installing changes the whole system. It may ask for your password. Use it only when a command needs it.', hi: ['sudo'] },
      { cap: 'On Fedora or Red Hat the tool is `dnf`. Many bioinformatics tools are also installed with **conda**, from the **bioconda** channel, which does not need sudo.', show: ['note'], hi: ['note'] }
    ]
  });

  /* ---------- Module 2: the parts of a command ---------- */
  def('command-anatomy', {
    title: 'The parts of a command',
    summary: 'ls -l -h data split into the command ls, the options -l and -h, and the argument data. The options can be combined as -lh. man ls opens the manual and ls --help prints a short summary.',
    build(D) {
      const part = (k, x, w, t, cls) => D.box(k, x, 60, w, 40, t, { cls, mono: true, size: 16, r: 8 });
      const lab = (k, x, t, sub) => D.g(k, D.text('', x, 128, t, { size: 13, weight: 700 }), D.text('', x, 146, sub, { size: 12, cls: 'muted' }));
      return D.svg(400, 286,
        term(D, 'line', 8, 8, 384, 34, '$ ls -l -h data', 15),
        part('cmd', 72, 48, 'ls', 'navy'), part('o1', 136, 48, '-l', 'orange'), part('o2', 200, 48, '-h', 'orange'), part('arg', 264, 64, 'data', 'dir'),
        lab('l-cmd', 96, 'command', 'what to run'),
        D.g('l-opt', D.path('', 'M138,106 V112 H246 V106'), D.line('', 192, 112, 192, 116),
          D.text('', 192, 128, 'options', { size: 13, weight: 700 }), D.text('', 192, 146, 'how', { size: 12, cls: 'muted' })),
        lab('l-arg', 296, 'argument', 'what to act on'),
        D.g('comb', D.text('', 64, 190, 'combined:', { size: 12, cls: 'muted' }),
          D.box('', 104, 172, 48, 36, 'ls', { cls: 'navy', mono: true, size: 15, r: 8 }),
          D.box('c-lh', 160, 172, 64, 36, '-lh', { cls: 'orange', mono: true, size: 15, r: 8 }),
          D.box('', 232, 172, 64, 36, 'data', { cls: 'dir', mono: true, size: 15, r: 8 })),
        D.g('help', term(D, 'man', 8, 226, 186, 30, '$ man ls', 13), D.text('', 101, 272, 'full manual (q quits)', { size: 12 }),
          term(D, 'hlp', 206, 226, 186, 30, '$ ls --help', 13), D.text('', 299, 272, 'short summary', { size: 12 })));
    },
    steps: [
      { cap: 'The shell splits what you type into words at the spaces. The first word is the **command**: the program to run. `ls` lists what is in a folder.', show: ['l-cmd'], hi: ['cmd'] },
      { cap: '**Options** change how the command works and start with `-`. Here `-l` asks for the long listing (permissions, size, date) and `-h` for human-readable sizes, like 4.0K instead of 4096.', show: ['l-opt'], hi: ['o1', 'o2'] },
      { cap: 'The **argument** says what to act on: here the folder `data`. Without an argument, `ls` lists the folder you are in.', show: ['l-arg'], hi: ['arg'] },
      { cap: 'Single-letter options can be combined: `ls -lh data` does exactly the same as `ls -l -h data`.', show: ['comb'], hi: ['c-lh'] },
      { cap: 'Forgot an option? `man ls` opens the full manual (arrow keys scroll, `q` quits). `ls --help` prints a shorter summary straight into the terminal.', show: ['help'], hi: ['man', 'hlp'] }
    ]
  });

  /* ---------- Module 2: informational commands ---------- */
  def('info-commands', {
    title: 'Ask the system: informational commands',
    summary: 'Questions paired with the commands that answer them, grouped into you (whoami, id), the machine (hostname, uname -a, date), storage (df -h, du -sh data) and programs (ps, top).',
    build(D) {
      const ROWS = [['Who am I?', 'whoami'], ['Which groups am I in?', 'id'], ['What is this machine called?', 'hostname'],
        ['Which system and kernel?', 'uname -a'], ['What is the date and time?', 'date'], ['How full are the disks?', 'df -h'],
        ['How big is this folder?', 'du -sh data'], ['What is running?', 'ps, top']];
      const y = (i) => 30 + i * 32 + (i >= 2 ? 6 : 0) + (i >= 5 ? 6 : 0) + (i >= 7 ? 6 : 0);
      const row = (r, i) => D.g('r' + (i + 1), D.box('', 86, y(i), 306, 28, '', { r: 6 }),
        D.text('', 98, y(i) + 14, r[0], { size: 12, anchor: 'start' }), D.text('', 296, y(i) + 14, r[1], { mono: true, size: 13, anchor: 'start', cls: 'blue' }));
      const grp = (k, i1, i2, t, cls) => D.box(k, 8, y(i1), 72, y(i2) + 28 - y(i1), t, { cls, size: 12, r: 6 });
      return D.svg(400, 306,
        D.text('', 98, 16, 'question', { size: 11, anchor: 'start', cls: 'muted' }), D.text('', 296, 16, 'command', { size: 11, anchor: 'start', cls: 'muted' }),
        grp('g-you', 0, 1, 'you', 'green'), grp('g-mach', 2, 4, 'the\nmachine', 'violet'), grp('g-disk', 5, 6, 'storage', 'orange'), grp('g-prog', 7, 7, 'programs', 'blue'),
        ROWS.map(row));
    },
    steps: [
      { cap: 'Informational commands answer quick questions about you and the system. They only print an answer and change nothing, so they are safe to try.', hi: [] },
      { cap: 'About you: `whoami` prints your user name. `id` also shows your user number and the **groups** you belong to; groups decide which shared files you may use.', hi: ['g-you', 'r1', 'r2'] },
      { cap: 'About the machine: `hostname` prints its name, `uname -a` the system and kernel version, and `date` the current date and time.', hi: ['g-mach', 'r3', 'r4', 'r5'] },
      { cap: 'About storage: `df -h` shows how full each disk is. `du -sh data` adds up the space one folder uses: `-s` gives one total, `-h` human-readable sizes.', hi: ['g-disk', 'r6', 'r7'] },
      { cap: 'About programs: `ps` lists the programs (processes) running from your terminal. `top` shows a live, updating view of the busiest ones; press `q` to quit it.', hi: ['g-prog', 'r8'] },
      { cap: 'The answers differ from machine to machine. Before a big analysis, `df -h` tells you whether there is room for the output, and `top` whether the machine is busy.', hi: ['r6', 'r8'] }
    ]
  });

  /* ---------- Module 2: permissions ---------- */
  def('permissions', {
    title: 'Reading and changing permissions',
    summary: 'The ls -l line for an example script, report.sh, starts with -rwxr-xr--, split into the file type, owner rwx, group r-x and others r--. With r = 4, w = 2 and x = 1 the sets add up to 7, 5 and 4, so 754. chmod +x and chmod 755 change permissions; without x, running ./script.sh gives Permission denied.',
    build(D) {
      const X = { t: 33, o: [75, 105, 135], g: [177, 207, 237], e: [279, 309, 339] };
      const cell = (x, ch, cls) => D.box('', x, 54, 28, 36, ch, { cls, mono: true, size: 18, r: 5 });
      const nums = (xs, chars) => xs.map((x, i) => D.text('', x + 14, 146, String(chars[i] === '-' ? 0 : [4, 2, 1][i]), { mono: true, size: 13 }));
      const sum = (cx, n) => D.box('', cx - 18, 160, 36, 28, n, { cls: 'green', mono: true, size: 16 });
      const row = (k, y, cmd, out, o) => D.g(k, term(D, '', 8, y, 232, 24, cmd, 12), D.text('', 250, y + 12, out, Object.assign({ size: 12, anchor: 'start' }, o)));
      return D.svg(400, 334,
        D.box('', 8, 8, 384, 30, '', { cls: 'code', r: 6 }),
        D.box('lperm', 13, 11, 76, 24, '', { cls: 'code', r: 4 }),
        ctext(D, '', 18, 23, '-rwxr-xr-- 1 student student 167 Nov  8 09:30 report.sh', 11),
        D.g('type', cell(X.t, '-', 'muted')),
        D.g('owner', X.o.map((x, i) => cell(x, 'rwx'[i], 'blue'))),
        D.g('group', X.g.map((x, i) => cell(x, 'r-x'[i], 'violet'))),
        D.g('others', X.e.map((x, i) => cell(x, 'r--'[i], 'orange'))),
        D.text('l-type', 47, 106, 'type', { size: 13, weight: 700 }),
        D.g('l-sets', D.text('', 119, 106, 'owner', { size: 13, weight: 700 }), D.text('', 221, 106, 'group', { size: 13, weight: 700 }), D.text('', 323, 106, 'others', { size: 13, weight: 700 })),
        D.g('means', D.text('', 47, 124, 'file', { size: 11, cls: 'muted' }), D.text('', 119, 124, 'read, write, run', { size: 11, cls: 'muted' }),
          D.text('', 221, 124, 'read, run', { size: 11, cls: 'muted' }), D.text('', 323, 124, 'read only', { size: 11, cls: 'muted' })),
        D.g('nums', nums(X.o, 'rwx'), nums(X.g, 'r-x'), nums(X.e, 'r--')),
        D.g('sums', sum(119, '7'), sum(221, '5'), sum(323, '4')),
        D.box('n754', 150, 198, 100, 30, '754', { cls: 'green', mono: true, size: 18, weight: 700 }),
        row('c1', 244, '$ ./script.sh', 'Permission denied', { cls: 'red' }),
        row('c2', 274, '$ chmod 755 script.sh', 'now rwxr-xr-x', { mono: true }),
        row('c3', 304, '$ chmod +x count_seqs.sh', 'adds x', {}));
    },
    steps: [
      { cap: '`ls -l` begins each line with 10 permission characters (here for an example script, report.sh). The first is the **type**: `-` for a regular file, `d` for a directory (folder).', show: ['l-type'], hi: ['lperm', 'type', 'l-type'] },
      { cap: 'The other 9 come in three sets of `rwx`: what the file\'s **owner** may do, what its **group** may do, and what all **others** may do.', show: ['l-sets'], hi: ['owner', 'group', 'others'] },
      { cap: '`r` = read, `w` = write (change), `x` = execute (run as a program), `-` = not allowed. Here the owner may do everything, the group may read and run, others may only read.', show: ['means'], hi: ['means'] },
      { cap: 'Each letter has a value: r = 4, w = 2, x = 1, and `-` = 0. Add them per set: rwx = 7, r-x = 5, r-- = 4. So these permissions are **754**.', show: ['nums', 'sums', 'n754'], hi: ['sums', 'n754'] },
      { cap: 'Without `x`, running a script as `./script.sh` fails with **Permission denied**: Linux will not run a file that is not marked as executable.', show: ['c1'], hi: ['c1'] },
      { cap: '`chmod` changes permissions. `chmod 755 script.sh` sets exactly `rwxr-xr-x`, so `./script.sh` now runs. `chmod +x count_seqs.sh` just adds `x`. Or run any script with `bash script.sh`.', show: ['c2', 'c3'], hi: ['c2', 'c3'] }
    ]
  });

  /* ---------- Module 2: viewing files ---------- */
  def('head-tail', {
    title: 'Peeking into a file: head, tail, wc, less',
    summary: 'counts.tsv drawn as 13 lines (a header and 12 genes). head -3 shows the header, HSPA1A and HSPA1B; tail -2 shows TP53 and FOS; wc -l counts 13 lines; less pages through the file one screen at a time.',
    build(D) {
      const y = (i) => 60 + i * 20;
      const bar = (r, i) => keep(D.box('b' + (i + 1), 38, y(i), 214, 16, String(r[0]).padEnd(8) + String(r[1]).padEnd(8) + String(r[2]).padEnd(8) + '...', { mono: true, size: 11, anchor: 'start', r: 3, cls: i === 0 ? 'blue' : '' }));
      const num = (r, i) => D.text('', 30, y(i) + 8, String(i + 1), { size: 11, anchor: 'end', cls: 'muted' });
      const bracket = (x, i1, i2) => D.path('', `M${x},${y(i1) + 1} H${x + 6} V${y(i2) + 15} H${x}`);
      const lab = (x, yy, t, o) => D.text('', x, yy, t, Object.assign({ size: 12, anchor: 'start' }, o));
      return D.svg(400, 326,
        term(D, 'cmd', 8, 6, 384, 30, '$ head -3 counts.tsv', 13),
        D.text('', 38, 46, 'counts.tsv', { size: 12, anchor: 'start', weight: 700 }),
        COUNTS.map(num), COUNTS.map(bar),
        D.g('hb', bracket(258, 0, 2), lab(272, 84, 'head -3', { mono: true, size: 13, cls: 'gold' }), lab(272, 102, 'first 3 lines')),
        D.g('tb', bracket(258, 11, 12), lab(272, 300, 'tail -2', { mono: true, size: 13, cls: 'gold' }), lab(272, 282, 'last 2 lines')),
        D.g('wb', bracket(258, 0, 12), lab(272, 178, 'wc -l', { mono: true, size: 13, cls: 'gold' }), lab(272, 198, '13 lines', { size: 14, weight: 700 })),
        D.g('lw', D.box('', 35, 56, 221, 124, '', { cls: 'ghost' }), D.path('', 'M266,74 V164'), D.arrow('', 266, 150, 266, 170),
          lab(276, 84, 'less: one screen', { weight: 700 }), lab(276, 110, 'Space: next page'), lab(276, 132, 'q: quit')));
    },
    steps: [
      { cap: 'counts.tsv has a header line plus one line per gene: **13 lines**. Real files can have millions, so instead of printing everything, peek at parts.', hi: [] },
      { cap: '`head -3 counts.tsv` prints the **first 3 lines**: the header, HSPA1A and HSPA1B. Without a number, `head` shows 10 lines.', show: ['cmd', 'hb'], hi: ['b1', 'b2', 'b3', 'hb'] },
      { cap: '`tail -2 counts.tsv` prints the **last 2 lines**: TP53 and FOS. Handy for checking that a file ends where you expect.', set: { cmd: '$ tail -2 counts.tsv' }, hide: ['hb'], show: ['tb'], hi: ['b12', 'b13', 'tb'] },
      { cap: '`wc -l counts.tsv` counts lines and prints `13 counts.tsv`: the header plus 12 genes. Remember the header when you count records.', set: { cmd: '$ wc -l counts.tsv' }, hide: ['tb'], show: ['wb'], hi: ['wb'] },
      { cap: '`less counts.tsv` shows a long file one screen at a time: **Space** for the next page, **q** to quit. It only shows the file; it never changes it.', set: { cmd: '$ less counts.tsv' }, hide: ['wb'], show: ['lw'], hi: ['lw'] }
    ]
  });

  /* ---------- Module 2: cut, sort, uniq ---------- */
  def('cut-columns', {
    title: 'Cutting columns, then counting with uniq',
    summary: 'samples.tsv as a table with the columns sample, condition, replicate and temperature_C. cut -f 1,2 keeps the first two columns. cut -f 2 piped into sort and uniq -c prints 1 condition, 3 control and 3 heat_shock.',
    build(D) {
      const X = [12, 84, 182, 274], W = [70, 96, 90, 114], ry = (i) => 58 + i * 20;
      const col = (j) => D.g('col' + (j + 1), D.box('', X[j], 54, W[j], 144, '', { r: 6 }),
        SAMPLES.map((r, i) => D.text('', X[j] + 8, ry(i) + 10, r[j], { mono: true, size: 12, anchor: 'start', weight: i === 0 ? 700 : null })));
      const COND = SAMPLES.map((r) => r[1]);
      const sy = (i) => 226 + i * 17;
      const cells = (x, list) => list.map((c, i) => D.box('', x, sy(i), 100, 15, c, { mono: true, size: 11, anchor: 'start', r: 3 }));
      const brace = (i1, i2) => D.path('', `M246,${sy(i1) + 1} H252 V${sy(i2) + 14} H246`);
      const out = (i1, i2, t) => { const mid = (sy(i1) + sy(i2) + 15) / 2; return [D.arrow('', 253, mid, 270, mid), D.box('', 272, mid - 8, 116, 16, t, { mono: true, size: 11, anchor: 'start', r: 3, cls: 'green' })]; };
      return D.svg(400, 346,
        term(D, 'cmd', 8, 6, 384, 28, '$ cut -f 1,2 samples.tsv', 13),
        [0, 1, 2, 3].map((j) => D.text('f' + (j + 1), X[j] + W[j] / 2, 46, 'field ' + (j + 1), { size: 11, cls: 'muted' })),
        [0, 1, 2, 3].map(col),
        D.g('stA', D.text('', 62, 214, 'cut -f 2', { mono: true, size: 12, weight: 700 }), cells(12, COND)),
        D.g('stB', D.arrow('', 114, 285, 140, 285), D.text('', 192, 214, 'sort', { mono: true, size: 12, weight: 700 }), cells(142, COND.slice().sort())),
        D.g('stC', D.text('', 330, 214, 'uniq -c', { mono: true, size: 12, weight: 700 }), brace(1, 3), brace(4, 6),
          out(0, 0, '1 condition'), out(1, 3, '3 control'), out(4, 6, '3 heat_shock')));
    },
    steps: [
      { cap: 'samples.tsv is a table in plain text: one line per row, with a **Tab** character between the columns. `cut` numbers the columns (fields) from 1, and Tab is its default separator.', hi: ['f1', 'f2', 'f3', 'f4'] },
      { cap: '`cut -f 1,2 samples.tsv` keeps fields 1 and 2, sample and condition, on every line, including the header line.', show: ['cmd'], hi: ['col1', 'col2'] },
      { cap: '`cut -f 2 samples.tsv` keeps only the condition column: 7 lines, with the header word `condition` first.', set: { cmd: '$ cut -f 2 samples.tsv' }, show: ['stA'], hi: ['col2', 'stA'] },
      { cap: 'The pipe sends those lines to `sort`, which puts identical lines next to each other. Here they happened to be in order already; usually they are not.', set: { cmd: '$ cut -f 2 samples.tsv | sort' }, show: ['stB'], hi: ['stB'] },
      { cap: '`uniq -c` merges **neighboring** identical lines and counts them: `1 condition`, `3 control`, `3 heat_shock`. Notice that the header line was counted too.', set: { cmd: '$ cut -f 2 samples.tsv | sort | uniq -c' }, show: ['stC'], hi: ['stC'] },
      { cap: 'Why sort first? `uniq` only merges neighbors. Without sort, `cut -f 3 samples.tsv | uniq -c` reports replicate 1 twice, as two separate groups, instead of `2 1`.', hi: ['col3', 'stB'] }
    ]
  });

  /* ---------- Module 2: grep ---------- */
  def('grep-filter', {
    title: 'grep keeps the lines that match',
    summary: 'The 13 lines of counts.tsv go into grep HSP and 5 lines come out: HSPA1A, HSPA1B, HSPA6, HSPH1 and HSPB1. grep -c HSP prints 5, grep -v HSP prints the other 8 lines, and grep -i hsp finds the same 5 lines.',
    build(D) {
      const y = (i) => 36 + i * 20;
      const names = COUNTS.map((r) => r[0]);
      const hit = (n) => n.includes('HSP');
      const bar = (k, x, n, i) => D.box(k, x, y(i), 108, 16, n + ' ...', { mono: true, size: 11, anchor: 'start', r: 3, cls: i === 0 ? 'blue' : '' });
      const pass = (want, cls) => names.map((n, i) => (hit(n) === want ? D.arrow('', 120, y(i) + 8, 280, y(i) + 8, { cls }) : null));
      const outs = (want) => names.map((n, i) => (hit(n) === want ? bar('', 282, n, i) : null));
      return D.svg(400, 300,
        D.text('', 64, 20, 'counts.tsv', { size: 12, weight: 700 }),
        D.text('flabel', 200, 20, 'grep HSP', { mono: true, size: 13, weight: 700 }),
        D.text('', 336, 20, 'output', { size: 12, weight: 700 }),
        D.box('filter', 150, 30, 100, 266, '', { cls: 'ghost' }),
        names.map((n, i) => D.line('', 118, y(i) + 8, 150, y(i) + 8, { cls: 'thin' })),
        names.map((n, i) => bar('r' + (i + 1) + (hit(n) ? ' hsp' : ''), 10, n, i)),
        D.g('mA', pass(true, 'gold')), D.g('oA', outs(true)),
        D.g('mV', pass(false, 'blue')), D.g('oV', outs(false)),
        D.text('dnote', 200, y(4) + 8, 'no HSP here', { size: 11, cls: 'red' }),
        D.g('cnt', D.arrow('', 252, 150, 290, 150, { cls: 'gold' }), D.box('', 294, 130, 80, 40, '5', { cls: 'green', mono: true, size: 20 })));
    },
    steps: [
      { cap: '`grep HSP counts.tsv` reads the file line by line and keeps only the lines that contain the text **HSP** anywhere. All 13 lines go in.', hi: ['filter', 'flabel'] },
      { cap: '5 lines contain HSP: HSPA1A, HSPA1B, HSPA6, HSPH1 and HSPB1. DNAJB1 is a heat-shock gene too, but its name lacks the letters HSP, so grep skips it.', show: ['mA', 'oA', 'dnote'], hi: ['hsp', 'oA', 'dnote'] },
      { cap: '`grep -c HSP counts.tsv` counts the matching lines instead of printing them, and prints `5`.', set: { flabel: 'grep -c HSP' }, hide: ['mA', 'oA', 'dnote'], show: ['cnt'], hi: ['hsp', 'cnt'] },
      { cap: '`grep -v HSP counts.tsv` inverts the match: it prints the **other 8 lines**, including the header line.', set: { flabel: 'grep -v HSP' }, hide: ['cnt'], show: ['mV', 'oV'], hi: ['oV'] },
      { cap: '`grep -i hsp counts.tsv` ignores upper and lower case, so it finds the same 5 lines. Without `-i`, `grep hsp` finds nothing here: grep is case-sensitive.', set: { flabel: 'grep -i hsp' }, hide: ['mV', 'oV'], show: ['mA', 'oA'], hi: ['hsp', 'oA'] }
    ]
  });

  /* ---------- Module 2: networking ---------- */
  def('network', {
    title: 'Your computer, the internet and a data server',
    summary: 'Your computer connects through the internet to a remote data server such as a public sequence database. ping sends a request and times the reply, curl -O and wget download a file, and hostname -I shows your own address.',
    build(D) {
      return D.svg(400, 262,
        term(D, 'cmd', 8, 6, 384, 30, '$ ping HOST', 13),
        D.line('', 116, 134, 146, 134), D.line('', 254, 134, 284, 134),
        D.box('pc', 8, 100, 108, 68, 'your\ncomputer', { cls: 'blue', size: 14 }),
        D.box('net', 146, 106, 108, 56, 'the internet', { cls: 'ghost', r: 28, size: 13 }),
        D.g('srv', D.box('', 284, 92, 108, 84, '', { cls: 'violet' }), D.text('', 338, 110, 'data server', { size: 13, weight: 700 }),
          D.text('', 338, 146, 'for example a\npublic sequence\ndatabase', { size: 11 })),
        D.g('ping', D.arrow('', 70, 96, 330, 88, { bend: -34, cls: 'gold', label: 'request' }),
          D.arrow('', 330, 180, 70, 172, { bend: -34, cls: 'blue', label: 'reply', ly: 14 }),
          D.text('', 200, 240, 'round trip: time in milliseconds', { size: 12, cls: 'gold' })),
        D.g('dl', D.arrow('', 336, 180, 112, 228, { bend: -26, cls: 'gold', label: 'download', ly: 14 }),
          D.box('', 14, 214, 96, 28, 'data file', { cls: 'file', size: 12 })),
        D.g('addr', D.text('', 62, 190, '10.0.0.15', { mono: true, size: 13, cls: 'gold' }), D.text('', 62, 208, 'your address', { size: 12 })));
    },
    steps: [
      { cap: 'Your computer reaches other machines through the **internet**. Much bioinformatics data lives on remote **data servers**, such as public sequence databases.', hi: ['pc', 'net', 'srv'] },
      { cap: '`ping HOST` checks whether a machine answers: it sends a small request, the machine replies, and ping prints the **round-trip time** in milliseconds. Press Ctrl+C to stop it.', show: ['cmd', 'ping'], hi: ['ping'] },
      { cap: '`curl -O URL` downloads the file at a web address (URL) and saves it under its own name. `wget URL` does the same. HOST and URL stand for real names.', set: { cmd: '$ curl -O URL' }, hide: ['ping'], show: ['dl'], hi: ['dl'] },
      { cap: '`hostname -I` (or `ip addr`) shows your own computer\'s network **addresses**: the numbers other machines use to reach it, for example 10.0.0.15.', set: { cmd: '$ hostname -I' }, hide: ['dl'], show: ['addr'], hi: ['addr', 'pc'] },
      { cap: 'Sequencing files are often huge. Run `wget` or `curl` on the machine that will do the analysis, such as a cluster, so the file lands where you need it.', set: { cmd: '$ wget URL' }, hide: ['addr'], show: ['dl'], hi: ['dl', 'srv'] }
    ]
  });

  /* ---------- Module 2: archiving and compression ---------- */
  def('archive', {
    title: 'Bundling and compressing files',
    summary: 'The data folder with five files; tar -cf bundles them into one data.tar file of about the same size; gzip compresses one file into a smaller .gz file; tar -czf does both; tar -xzf extracts; zip and unzip do both in one format.',
    build(D) {
      const files = ['annotation.tsv', 'counts.tsv', 'reads.fastq', 'samples.tsv', 'sequences.fa'];
      const flag = (i, l, t) => D.g('', D.box('', 12 + i * 76, 262, 72, 44, '', { r: 8 }), D.text('', 48 + i * 76, 277, l, { mono: true, size: 15, weight: 700 }), D.text('', 48 + i * 76, 295, t, { size: 11 }));
      return D.svg(400, 346,
        term(D, 'cmd', 8, 6, 384, 30, '$ tar -cf data.tar data', 13),
        D.g('folder', D.box('fbox', 8, 48, 120, 180, '', { cls: 'dir' }), D.text('', 20, 64, 'data/', { mono: true, size: 13, weight: 700, anchor: 'start' }),
          files.map((f, i) => D.box('', 16, 76 + i * 30, 104, 24, f, { mono: true, size: 11, r: 6 }))),
        D.g('tarf', D.arrow('', 130, 148, 156, 148), D.text('', 205, 64, 'data.tar', { mono: true, size: 12, weight: 700 }),
          D.box('', 160, 76, 90, 144, '', { cls: 'file' }), [106, 136, 166, 196].map((yy) => D.line('', 160, yy, 250, yy, { cls: 'thin' }))),
        D.g('gzf', D.arrow('', 252, 148, 286, 148, { label: 'gzip', lx: -6, ly: -13 }), D.text('', 340, 110, 'data.tar.gz', { mono: true, size: 12, weight: 700 }),
          D.box('', 290, 120, 100, 56, '', { cls: 'orange' }), [131, 142, 153, 164].map((yy) => D.line('', 290, yy, 390, yy, { cls: 'thin' }))),
        D.g('xback', D.arrow('', 340, 180, 112, 228, { bend: -60, cls: 'blue', label: 'tar -xzf', ly: 14, mono: true })),
        D.g('flags', flag(0, 'c', 'create'), flag(1, 'x', 'extract'), flag(2, 'z', 'gzip'), flag(3, 'f', 'file name'), flag(4, 'v', 'list files')),
        D.g('zipn', D.box('zbox', 8, 314, 384, 30, '', { cls: 'ghost' }), term(D, '', 16, 318, 200, 22, 'zip -r data.zip data', 12),
          D.text('', 230, 329, 'and', { size: 12, cls: 'muted' }), term(D, '', 246, 318, 138, 22, 'unzip data.zip', 12)));
    },
    steps: [
      { cap: 'A folder of many files is awkward to download, send or back up. **Archiving** turns it into one file; **compressing** makes a file smaller.', hi: ['fbox'] },
      { cap: '`tar -cf data.tar data` bundles the whole data folder into **one file**, data.tar. It is not smaller: tar only packs the files together.', show: ['cmd', 'tarf'], hi: ['tarf'] },
      { cap: '`gzip` compresses **one file**: `gzip data.tar` makes the smaller data.tar.gz and removes data.tar. gzip does not bundle files, which is why tar comes first.', set: { cmd: '$ gzip data.tar' }, show: ['gzf'], hi: ['gzf'] },
      { cap: '`tar -czf data.tar.gz data` does both in one step: tar bundles and gzip (`z`) compresses, without leaving a data.tar file in between.', set: { cmd: '$ tar -czf data.tar.gz data' }, hi: ['tarf', 'gzf'] },
      { cap: '`tar -xzf data.tar.gz` extracts the folder again. The flags: `c` create, `x` extract, `z` gzip, `f` the file name follows, `v` list the files as they are processed.', set: { cmd: '$ tar -xzf data.tar.gz' }, show: ['xback', 'flags'], hi: ['xback', 'flags', 'fbox'] },
      { cap: '`zip -r data.zip data` and `unzip data.zip` bundle and compress in one format, common on Windows. Sequencing reads are usually stored compressed, as `.fastq.gz` files.', set: { cmd: '$ zip -r data.zip data' }, show: ['zipn'], hi: ['zbox'] }
    ]
  });

  /* ---------- Module 3: a shell script ---------- */
  def('script-anatomy', {
    title: 'A shell script, line by line',
    summary: 'The practice script count_seqs.sh: the shebang #!/bin/bash, two comment lines, file=$1 stores the first argument, n=$(grep -c ">" "$file") keeps the output of a command, and echo prints the result; run it with bash, or make it executable with chmod +x and run ./scripts/count_seqs.sh.',
    build(D) {
      const SCRIPT = ['#!/bin/bash', '# Count the sequences in a FASTA file.', '# Usage: ./count_seqs.sh FILE', 'file=$1', 'n=$(grep -c ">" "$file")', 'echo "$file contains $n sequences"'];
      const TERM = [['run1', '$ bash scripts/count_seqs.sh data/sequences.fa'], ['out', 'data/sequences.fa contains 6 sequences'],
        ['run2', '$ chmod +x scripts/count_seqs.sh'], ['run3', '$ ./scripts/count_seqs.sh data/sequences.fa'], ['out2', 'data/sequences.fa contains 6 sequences']];
      const pill = (x, w, t) => D.box('', x, 188, w, 24, t, { cls: 'blue', mono: true, size: 12, r: 12 });
      return D.svg(400, 352,
        D.text('', 10, 11, 'scripts/count_seqs.sh', { mono: true, size: 12, anchor: 'start', weight: 700 }),
        D.box('', 8, 22, 384, 142, '', { cls: 'code', r: 10 }),
        SCRIPT.map((t, i) => term(D, 's' + (i + 1), 14, 27 + i * 22, 372, 20, t)),
        D.text('', 10, 180, 'variables', { size: 12, anchor: 'start', weight: 700, cls: 'muted' }),
        pill(8, 48, 'file'), D.arrow('', 58, 200, 76, 200), D.box('vfile', 78, 188, 152, 24, '(not set yet)', { mono: true, size: 12, r: 6 }),
        pill(250, 30, 'n'), D.arrow('', 282, 200, 300, 200), D.box('vn', 302, 188, 90, 24, '(not set)', { mono: true, size: 12, r: 6 }),
        D.text('', 10, 232, 'terminal, in ~/project', { size: 12, anchor: 'start', weight: 700, cls: 'muted' }),
        D.box('', 8, 240, 384, 110, '', { cls: 'code', r: 10 }),
        TERM.map(([k, t], i) => term(D, k, 14, 245 + i * 20, 372, 18, t)));
    },
    steps: [
      { cap: 'A **script** is a text file of commands that run from top to bottom. Line 1, the **shebang** `#!/bin/bash`, names the program that runs the script: bash.', hi: ['s1'] },
      { cap: 'Lines that start with `#` are **comments**: notes for people, which bash skips. Here the second comment says how to use the script.', hi: ['s2', 's3'] },
      { cap: 'Run it from `~/project` with a file name after it. Inside the script, `$1` is that **first argument**, so `file=$1` stores `data/sequences.fa`.', show: ['run1'], set: { vfile: 'data/sequences.fa' }, hi: ['run1', 's4', 'vfile'] },
      { cap: '`$(...)` is **command substitution**: bash runs `grep -c ">" "$file"`, which counts the header lines, and keeps its output. So `n` becomes 6.', set: { vn: '6' }, hi: ['s5', 'vn'] },
      { cap: '`echo` prints the message with both values filled in: `data/sequences.fa contains 6 sequences`.', show: ['out'], hi: ['s6', 'out'] },
      { cap: 'Or make the script executable once with `chmod +x`, then run it by its path: `./scripts/count_seqs.sh data/sequences.fa`. The shebang tells Linux to use bash.', show: ['run2', 'run3', 'out2'], hi: ['run2', 'run3', 's1'] }
    ]
  });

  /* ---------- Module 3: variables ---------- */
  def('shell-vars', {
    title: 'Shell variables and the environment',
    summary: 'sample=heat_1 stores a value (no spaces around the equals sign) and echo $sample prints heat_1. sample = heat_1 fails with command not found. export sample copies the variable into the environment that programs started from the shell receive, next to HOME and PATH.',
    build(D) {
      const L = (k, i, t) => term(D, k, 14, 16 + i * 22, 372, 20, t);
      const pill = (k, x, y, w, t) => D.box(k, x, y, w, 26, t, { cls: 'blue', mono: true, size: 12, r: 13 });
      return D.svg(400, 330,
        D.box('', 8, 8, 384, 100, '', { cls: 'code', r: 10 }),
        L('t1', 0, '$ sample=heat_1'), L('t2', 1, ' '), L('t3', 2, ' '), L('t4', 3, ' '),
        D.box('', 8, 120, 252, 202, '', { cls: 'ghost' }),
        D.text('', 20, 138, 'this shell', { size: 13, anchor: 'start', weight: 700 }),
        D.text('', 20, 158, 'its own variables', { size: 11, anchor: 'start', cls: 'muted' }),
        D.g('envB', D.line('', 16, 210, 252, 210, { cls: 'dash' }), D.text('', 20, 226, 'environment: copied to programs', { size: 11, anchor: 'start', cls: 'muted' }),
          pill('eHOME', 20, 236, 64, 'HOME'), pill('ePATH', 92, 236, 64, 'PATH')),
        D.g('vs', pill('', 20, 166, 72, 'sample'), D.arrow('', 94, 179, 112, 179), D.box('', 114, 166, 76, 26, 'heat_1', { mono: true, size: 12, r: 6 })),
        D.g('child', D.arrow('', 262, 268, 280, 268), D.box('', 282, 212, 110, 110, '', { cls: 'violet' }),
          D.text('', 337, 230, 'a program', { size: 12, weight: 700 }), D.text('', 337, 246, 'started here', { size: 11 }),
          D.text('', 337, 270, 'HOME  PATH', { mono: true, size: 12 }), D.text('csample', 337, 296, 'sample', { mono: true, size: 12, cls: 'gold' })));
    },
    steps: [
      { cap: '`sample=heat_1` creates a **variable** called sample that holds the text heat_1. There must be **no spaces** around the `=`.', hi: ['t1', 'vs'] },
      { cap: '`echo $sample` prints `heat_1`. The `$` tells the shell to replace the name with its value before the command runs.', set: { t2: '$ echo $sample', t3: 'heat_1' }, hi: ['t2', 't3'] },
      { cap: 'With spaces, `sample = heat_1` fails with `sample: command not found`: the shell reads `sample` as a command name, with `=` and `heat_1` as its arguments.', set: { t1: '$ sample = heat_1', t2: 'bash: sample: command not found', t3: ' ' }, hi: ['t1', 't2'] },
      { cap: 'A plain variable exists only in this shell. `export sample` makes it an **environment variable**: programs started from this shell, such as a script or python3, get a copy.', set: { t1: '$ export sample', t2: ' ', t3: ' ' }, show: ['envB', 'child'], move: { vs: [0, 106] }, hi: ['vs', 'csample'] },
      { cap: 'Some environment variables are set for you. `echo $HOME` prints your home folder. `echo $PATH` prints **PATH**: the folders, separated by `:`, where the shell looks for commands.', set: { t1: '$ echo $HOME', t2: '/home/student', t3: '$ echo $PATH', t4: '/usr/local/bin:/usr/bin:/bin' }, hi: ['eHOME', 'ePATH', 't2', 't4'] }
    ]
  });

  /* ---------- Module 3: redirection and wildcards ---------- */
  def('redirect', {
    title: 'Redirection: where input and output go',
    summary: 'A command with three streams: input from the keyboard, output and errors to the screen. > sends output to a file and overwrites it, >> appends, 2> sends only errors to a file, < feeds a file as input, and the shell expands *.tsv to annotation.tsv counts.tsv samples.tsv before the command runs.',
    build(D) {
      const line = (x, y, t, cls) => keep(D.box('', x, y, 96, 15, t, { mono: true, size: 11, anchor: 'start', r: 3, cls }));
      return D.svg(400, 282,
        term(D, 'cmd', 8, 6, 384, 30, '$ head -3 counts.tsv', 13),
        D.box('inbox', 8, 62, 96, 48, 'keyboard', { cls: 'muted', size: 13 }),
        D.arrow('a-in', 106, 86, 148, 86, { label: 'input' }),
        D.box('proc', 150, 58, 100, 56, 'command', { cls: 'navy', size: 14 }),
        D.arrow('a-out', 252, 86, 294, 86, { label: 'output' }),
        D.box('outbox', 296, 62, 96, 48, 'screen', { cls: 'blue', size: 13 }),
        D.arrow('a-err', 200, 116, 200, 156, { label: 'errors', lx: 26, ly: 1 }),
        D.box('errbox', 152, 158, 96, 40, 'screen', { cls: 'blue', size: 13 }),
        D.g('fov', line(296, 118, 'gene ...'), line(296, 135, 'HSPA1A ...'), line(296, 152, 'HSPA1B ...'), D.text('', 344, 180, 'old content gone', { size: 11, cls: 'muted' })),
        D.g('fap', line(296, 118, 'older line', 'muted'), line(296, 135, 'older line', 'muted'), line(296, 152, 'step 1 done', 'green'), D.text('', 344, 180, 'added at the end', { size: 11, cls: 'muted' })),
        D.g('wild', D.box('', 8, 214, 384, 60, '', { cls: 'ghost' }),
          D.text('', 20, 232, '$ ls *.tsv', { mono: true, size: 13, anchor: 'start' }), D.text('', 118, 232, 'is run by the shell as:', { size: 12, anchor: 'start', cls: 'muted' }),
          D.text('', 20, 256, 'ls annotation.tsv counts.tsv samples.tsv', { mono: true, size: 12, anchor: 'start', cls: 'gold' })));
    },
    steps: [
      { cap: 'Every command has an **input**, an **output** and an **error** stream. Normally output and errors go to the screen: `head -3 counts.tsv` prints its 3 lines there.', hi: ['a-out', 'outbox'] },
      { cap: '`head -3 counts.tsv > top.tsv` sends the output into a file instead. `>` creates top.tsv, or **overwrites** it if it exists: the old content is gone.', set: { cmd: '$ head -3 counts.tsv > top.tsv', outbox: 'top.tsv' }, show: ['fov'], hi: ['outbox', 'fov'] },
      { cap: '`>>` **appends**: `echo "step 1 done" >> log.txt` adds one line to the end of log.txt and keeps everything that was already there.', set: { cmd: '$ echo "step 1 done" >> log.txt', outbox: 'log.txt' }, hide: ['fov'], show: ['fap'], hi: ['outbox', 'fap'] },
      { cap: 'Error messages travel separately. `2>` redirects only them: `ls nosuchfile 2> errors.txt` saves the error message in errors.txt and keeps the screen clean.', set: { cmd: '$ ls nosuchfile 2> errors.txt', outbox: 'screen', errbox: 'errors.txt' }, hide: ['fap'], hi: ['a-err', 'errbox'] },
      { cap: '`<` feeds a file in as **input**: `wc -l < counts.tsv` reads counts.tsv through the input stream and prints just `13`, without the file name.', set: { cmd: '$ wc -l < counts.tsv', errbox: 'screen', inbox: 'counts.tsv' }, hi: ['a-in', 'inbox'] },
      { cap: 'The shell expands wildcards **before** the command runs. In ~/project/data, `*.tsv` becomes `annotation.tsv counts.tsv samples.tsv`, in alphabetical order.', set: { cmd: '$ ls *.tsv', inbox: 'keyboard' }, show: ['wild'], hi: ['wild'] }
    ]
  });

  /* ---------- Module 3: loops and conditions ---------- */
  def('bash-loop', {
    title: 'A for loop visits each file',
    summary: 'for f in *.tsv runs its body once per file in ~/project/data, printing annotation.tsv: 13 lines, counts.tsv: 13 lines and samples.tsv: 7 lines. An if [ -s "$f" ] test then decides inside the loop, and $1 is a script\'s first argument.',
    build(D) {
      const CODE1 = ['for f in *.tsv', 'do', '  echo "$f: $(wc -l < "$f") lines"', 'done'];
      const CODE2 = ['for f in *.tsv', 'do', '  if [ -s "$f" ]', '  then', '    echo "$f: $(wc -l < "$f") lines"', '  fi', 'done'];
      const CODE3 = ['for f in "$1"/*.tsv', 'do', '  echo "$f: $(wc -l < "$f") lines"', 'done'];
      const cl = (p) => (t, i) => term(D, p + (i + 1), 14, 92 + i * 19, 372, 17, t);
      const ol = (k, i, t) => term(D, k, 14, 258 + i * 19, 372, 17, t);
      return D.svg(400, 344,
        D.g('ptr', D.text('', 82, 10, 'f', { mono: true, size: 15, cls: 'gold' }), D.arrow('', 82, 18, 82, 34, { cls: 'gold' })),
        D.box('x1', 20, 36, 124, 26, 'annotation.tsv', { mono: true, size: 12 }),
        D.box('x2', 156, 36, 104, 26, 'counts.tsv', { mono: true, size: 12 }),
        D.box('x3', 272, 36, 108, 26, 'samples.tsv', { mono: true, size: 12 }),
        D.text('flab', 200, 76, '*.tsv in ~/project/data', { size: 11, cls: 'muted' }),
        D.box('', 8, 86, 384, 143, '', { cls: 'code', r: 10 }),
        D.g('code1', CODE1.map(cl('p'))), D.g('code2', CODE2.map(cl('q'))), D.g('code3', CODE3.map(cl('s'))),
        D.text('olab', 10, 244, 'output', { size: 12, anchor: 'start', weight: 700, cls: 'muted' }),
        D.box('', 8, 252, 384, 86, '', { cls: 'code', r: 10 }),
        ol('o1', 0, 'annotation.tsv: 13 lines'), ol('o2', 1, 'counts.tsv: 13 lines'), ol('o3', 2, 'samples.tsv: 7 lines'), ol('o4', 3, ' '));
    },
    steps: [
      { cap: 'In ~/project/data the shell first expands `*.tsv` into three names. The loop body, between `do` and `done`, will run once for each name.', hi: ['x1', 'x2', 'x3', 'p1'] },
      { cap: 'Pass 1: the loop variable `f` is annotation.tsv. The body counts its lines with `wc -l < "$f"` and prints `annotation.tsv: 13 lines`.', show: ['ptr', 'o1'], hi: ['x1', 'p3', 'o1'] },
      { cap: 'Pass 2: `f` is counts.tsv, and the same body prints `counts.tsv: 13 lines`.', show: ['o2'], move: { ptr: [126, 0] }, hi: ['x2', 'p3', 'o2'] },
      { cap: 'Pass 3: `f` is samples.tsv, which prints `samples.tsv: 7 lines`. No names are left, so the loop ends at `done`.', show: ['o3'], move: { ptr: [244, 0] }, hi: ['x3', 'p4', 'o3'] },
      { cap: '`if [ -s "$f" ]` is true when the file exists and is **not empty**; only then do the lines between `then` and `fi` run. All three files here have lines, so the output stays the same.', hide: ['code1', 'ptr'], show: ['code2'], hi: ['q3', 'q4', 'q6'] },
      { cap: 'In a script, `$1` is the **first argument**. The loop in scripts/line_report.sh visits `"$1"/*.tsv`, so `bash scripts/line_report.sh data`, run in ~/project, reports every .tsv file in data.', hide: ['code2'], show: ['code3', 'o4'],
        set: { flab: 'the loop inside scripts/line_report.sh', olab: 'terminal, in ~/project', o1: '$ bash scripts/line_report.sh data', o2: 'data/annotation.tsv: 13 lines', o3: 'data/counts.tsv: 13 lines', o4: 'data/samples.tsv: 7 lines' }, hi: ['s1', 'o1'] }
    ]
  });

  /* ---------- Module 3: cron ---------- */
  def('cron-fields', {
    title: 'Reading a cron line',
    summary: 'The crontab line 30 2 * * 1 /home/student/backup.sh split into minute 30, hour 2, day of month (any), month (any), day of week 1 (Monday) and the command: it runs at 02:30 every Monday. */15 in the minute field means every 15 minutes; crontab -e, -l and -r edit, list and remove jobs.',
    build(D) {
      const X = [25, 97, 169, 241, 313];
      const f = (i, t) => D.box('f' + (i + 1), X[i], 56, 62, 44, t, { cls: 'blue', mono: true, size: 18, r: 8 });
      const lab = (i, t, sub) => D.g('', D.text('', X[i] + 31, 120, t, { size: 12, weight: 700 }), D.text('', X[i] + 31, 148, sub, { size: 11, cls: 'muted' }));
      const ct = (x, c, t) => D.g('', term(D, '', x, 272, 110, 26, c, 12), D.text('', x + 55, 312, t, { size: 12 }));
      return D.svg(400, 322,
        term(D, 'line', 8, 8, 384, 32, '30 2 * * 1 /home/student/backup.sh', 14),
        f(0, '30'), f(1, '2'), f(2, '*'), f(3, '*'), f(4, '1'),
        D.g('labs', lab(0, 'minute', '0 to 59'), lab(1, 'hour', '0 to 23'), lab(2, 'day of\nmonth', '1 to 31'), lab(3, 'month', '1 to 12'), lab(4, 'day of\nweek', '1 = Mon')),
        D.box('cmdf', 25, 166, 350, 32, '/home/student/backup.sh', { cls: 'code', size: 14 }),
        D.text('l-cmd', 200, 212, 'the command to run', { size: 12, weight: 700 }),
        D.box('mean', 25, 224, 350, 34, 'runs at 02:30 every Monday', { cls: 'green', size: 14, weight: 700 }),
        D.g('ct', ct(25, 'crontab -e', 'edit'), ct(145, 'crontab -l', 'list'), ct(265, 'crontab -r', 'remove all')));
    },
    steps: [
      { cap: 'Each line of a crontab describes one scheduled job: **five time fields**, then the **command** to run. Spaces separate the fields.', show: ['l-cmd'], hi: ['line', 'cmdf'] },
      { cap: 'Read the fields from the left: **minute** 30, **hour** 2 (on a 24-hour clock), **day of month**, **month**, and **day of week** 1, which means Monday.', show: ['labs'], hi: ['f1', 'f2', 'f5'] },
      { cap: '`*` means **every** value: any day of the month, any month. Together: run `/home/student/backup.sh` at **02:30 every Monday**.', show: ['mean'], hi: ['f3', 'f4', 'mean'] },
      { cap: '`*/15` in the minute field means **every 15 minutes**. With `*` everywhere else, `*/15 * * * *` runs at :00, :15, :30 and :45 of every hour, every day.', set: { line: '*/15 * * * * /home/student/backup.sh', f1: '*/15', f2: '*', f5: '*', mean: 'runs every 15 minutes' }, hi: ['f1', 'mean'] },
      { cap: 'Manage your jobs with `crontab -e` (edit them in an editor), `crontab -l` (list them) and `crontab -r`, which removes **all** your jobs at once, with no undo.', set: { line: '*/15 * * * * /home/student/backup.sh', f1: '*/15', f2: '*', f5: '*', mean: 'runs every 15 minutes' }, show: ['ct'], hi: ['ct'] }
    ]
  });

  /* ---------- Final module: review map ---------- */
  def('ibm-review-map', {
    title: 'The whole IBM course on one page',
    summary: 'Three columns: Module 1 (Linux and Unix, distributions, architecture, terminal and prompt, paths, editors, installing software), Module 2 (help, informational commands, navigation, file management, permissions, viewing files, text wrangling and grep, networking, archiving) and Module 3 (scripts and shebang, pipes and filters, variables, redirection and Bash features, loops and conditions, cron).',
    build(D) {
      const col = (k, n, title, items) => h('div.dg-col.dg-folder', { 'data-k': k, style: { flex: '1 1 170px' } },
        h('div.dg-label', 'Module ' + n),
        h('div', { style: { fontWeight: '700', color: 'var(--heading)', fontSize: '.92rem', marginBottom: '8px' } }, title),
        h('ul.dg-chips', { style: { flexDirection: 'row', flexWrap: 'wrap' } }, items.map((t) => h('li.dg-chip', { style: { fontFamily: 'var(--font)' } }, t))));
      return h('div',
        h('div.dg-row',
          col('m1', 1, 'Introduction to Linux', ['Linux and Unix', 'distributions', 'architecture', 'terminal and prompt', 'paths', 'editors', 'installing software']),
          col('m2', 2, 'Introduction to Linux Commands', ['help', 'informational commands', 'navigation', 'file management', 'permissions', 'viewing files', 'text wrangling and grep', 'networking', 'archiving']),
          col('m3', 3, 'Introduction to Shell Scripting', ['scripts and shebang', 'pipes and filters', 'variables', 'redirection and Bash features', 'loops and conditions', 'cron'])),
        D.note('proj', 'Module 4, the projects and the final exam, uses skills from all three modules together.', { cls: 'gold' }));
    },
    steps: [
      { cap: 'The IBM course teaches in three modules, then tests everything in Module 4: a practice project, a final project and a final exam. Here is what each teaching module covers.', hi: [] },
      { cap: '**Module 1, Introduction to Linux**: where Linux comes from, distributions, the layers of the system, the terminal and its prompt, paths, text editors and installing software.', hi: ['m1'] },
      { cap: '**Module 2, Introduction to Linux Commands**: getting help, informational commands, moving around, managing files, permissions, viewing files, wrangling text with grep, networking and archiving.', hi: ['m2'] },
      { cap: '**Module 3, Introduction to Shell Scripting**: scripts and the shebang, pipes and filters, variables, redirection and other Bash features, loops and conditions, and scheduling with cron.', hi: ['m3'] },
      { cap: 'Projects combine skills from several modules at once, so revise how they fit together, not only each command on its own. For every skill, ask which earlier ones it builds on.', show: ['proj'], hi: ['proj'] }
    ]
  });
})();
