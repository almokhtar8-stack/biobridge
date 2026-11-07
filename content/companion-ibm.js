/* Companion topics for IBM: Hands-on Introduction to Linux Commands and Shell Scripting.
   Item titles checked against the public course page on 8 November 2026. */
window.BB = window.BB || {};
BB.companion = BB.companion || [];
BB.companion.push(
  {
    id: 'ibm-linux-unix',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'Linux and Unix in one minute',
    lectures: ['Introducing Linux and Unix'],
    minutes: 3,
    keywords: ['Unix', 'Linux', 'GNU', 'GNU/Linux', 'kernel', 'operating system', 'Unix-like', 'open source', 'Linus Torvalds', 'Bell Labs', 'macOS'],
    explain: 'An **operating system** is the core software that runs a computer and its programs. **Unix**, created at Bell Labs from 1969, made a simple design popular: many small programs, each doing one job well, combined to do bigger tasks. Unix spread in many versions; BSD is one branch, and macOS grew partly from it. In 1991 Linus Torvalds, a student in Finland, wrote a new **kernel**, the central part of an operating system, called it **Linux** and shared it freely. Together with free tools from the GNU project, it made a complete **Unix-like** system: new code, same design.',
    why: 'Most servers, computing clusters and cloud machines that store and analyze sequencing data run Linux, and most bioinformatics tools are written for it. Because Linux and macOS share the Unix design, most commands in this course also work in a Mac terminal.',
    visual: { diagram: 'unix-family' },
    example: {
      lang: 'bash',
      code: 'uname -o',
      output: 'GNU/Linux',
      cwd: '~/project',
      note: 'This prints the name of the operating system: GNU/Linux, the GNU tools around the Linux kernel. On a Mac, `uname` prints Darwin instead, the Unix-based core of macOS.'
    },
    mistake: { wrong: 'Linux is the newest version of Unix, built from the original Unix code.', fix: 'Linux was written from scratch and contains none of the original Unix code. It is Unix-like: it follows the same design, so commands and habits carry over between Linux, macOS and other Unix systems.' },
    check: {
      q: 'A tutorial was written for macOS, a Unix system. You work on a Linux server. What should you expect?',
      options: [
        { t: 'Most commands work the same, but a few options may differ', why: 'Linux and macOS both follow the Unix design, so `ls`, `cd`, `grep` and pipes work alike. macOS uses BSD versions of some tools, so a few options differ.' },
        { t: 'Nothing will work, because Linux and macOS are unrelated', why: 'They are related: both belong to the Unix family of designs, and the same everyday commands exist on both, usually with the same options.' },
        { t: 'Everything works identically, because Linux is built from macOS code', why: 'Linux was not built from macOS; its kernel was written independently. The commands are similar because both follow Unix, but small differences remain.' }
      ],
      answer: 0
    },
    deeper: ['f1-linux']
  },
  {
    id: 'ibm-distros',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'Linux distributions',
    lectures: ['Linux Distributions'],
    minutes: 3,
    keywords: ['distribution', 'distro', 'Ubuntu', 'Debian', 'Fedora', 'Red Hat', 'Rocky Linux', 'package manager', 'apt', 'dnf', 'os-release'],
    explain: 'A **distribution** (distro) is a complete operating system built around the Linux kernel. Each one adds a selection of tools, a shell, default settings, often a desktop, and a **package manager**: the program that installs and updates software. Distributions form families. Debian and Ubuntu use `apt`; Fedora, Red Hat Enterprise Linux and Rocky Linux use `dnf`. Some aim at desktops and change often; others aim at servers and keep each release stable for years. Because they share the kernel and the core commands, `ls`, `grep` and Bash scripts behave the same on all of them.',
    why: 'Installation instructions depend on the distribution: `apt` commands work on Ubuntu but not on Rocky Linux, which many computing clusters run. Knowing your distribution tells you which instructions to follow, and the shared core commands mean your skills carry over.',
    visual: { diagram: 'distros' },
    example: {
      lang: 'bash',
      code: 'cat /etc/os-release',
      cwd: '~',
      noVerify: true,
      note: 'Prints the name and version of your distribution; on one Ubuntu server the first line was `PRETTY_NAME="Ubuntu 24.04.5 LTS"`. Not run here: the answer depends on the machine.'
    },
    mistake: { wrong: 'Install instructions written for Ubuntu, such as `sudo apt install tree`, work on every Linux system.', fix: '`apt` belongs to the Debian family. On Fedora, Red Hat or Rocky Linux the command is `sudo dnf install tree`, and some package names differ. Check your distribution first.' },
    check: {
      q: 'Your laptop runs Ubuntu and the lab server runs Rocky Linux. Which statement is true?',
      options: [
        { t: 'Everyday commands such as `ls` and `grep` work the same; software is installed differently', why: 'Both distributions use the Linux kernel and the same core tools. Ubuntu installs software with apt, and Rocky Linux with dnf.' },
        { t: 'They need completely different commands, because they are different operating systems', why: 'Distributions package the same kernel and core commands, so `ls`, `cd`, `grep` and Bash scripts behave the same on both.' },
        { t: 'Rocky Linux is not really Linux, because only Ubuntu uses the Linux kernel', why: 'Every Linux distribution, including Rocky Linux, Fedora and Ubuntu, is built on the Linux kernel. That shared kernel is what makes them Linux.' }
      ],
      answer: 0
    },
    deeper: ['f1-linux', 'f1-editors']
  },
  {
    id: 'ibm-architecture',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'Linux architecture: from hardware to you',
    lectures: ['Overview of Linux Architecture'],
    minutes: 3,
    keywords: ['architecture', 'kernel', 'hardware', 'shell', 'system tools', 'applications', 'layers', 'memory', 'processor', 'out of memory'],
    explain: 'Linux works in layers. At the bottom is the **hardware**: processor, memory, disks and network. Above it, the **kernel**, the core of Linux, is the only software that controls the hardware directly. It decides which program runs on the processor, hands out memory, reads and writes files and talks to devices. Above the kernel run ordinary programs: the **shell**, which reads your commands, **system tools** such as `ls` and `grep`, and **applications** such as Python, R or a web browser. Every program asks the kernel for what it needs. At the top are **you**, the user.',
    why: 'The layers explain where problems come from. `command not found` comes from the shell, which found no such program. When a large alignment job runs out of memory, it is the kernel that stops it, to protect the machine. And because programs never touch the hardware, the same tools run on very different computers.',
    visual: { diagram: 'linux-layers' },
    example: {
      lang: 'text',
      code: 'you       type  wc -l reads.fastq  and press Enter\nshell     reads the line and asks the kernel to start wc\nwc        asks the kernel to open reads.fastq and read it\nkernel    reads the disk, gives wc memory and processor time\nhardware  disk, memory and processor do the physical work\nyou       see the result: 32 reads.fastq',
      note: 'You only talk to the shell, and only the kernel touches the hardware. The shell and wc are ordinary programs that ask the kernel for everything they need.'
    },
    mistake: { wrong: 'The terminal, the shell and the kernel are three names for the same thing.', fix: 'The terminal is the window, the shell is the program inside it that reads your commands, and the kernel runs below every program. You can switch shells, for example from Bash to zsh, without changing the kernel.' },
    check: {
      q: 'Which part of Linux decides how much memory each running program gets?',
      options: [
        { t: 'The kernel', why: 'The kernel manages the hardware for every program: it hands out memory, shares processor time and reads files. Programs must ask it for memory.' },
        { t: 'The shell', why: 'The shell reads your commands and starts programs. Once a program runs, its memory comes from the kernel, as for any other program.' },
        { t: 'Each program decides for itself', why: 'A program can ask for memory, but the kernel decides whether to grant it, and it may stop programs when memory runs out.' }
      ],
      answer: 0
    },
    deeper: ['f1-linux']
  },
  {
    id: 'ibm-terminal',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'The terminal, the shell and the prompt',
    lectures: ['Linux Terminal Overview', 'Hands-on Lab: Getting Started with the Linux Terminal'],
    minutes: 3,
    keywords: ['terminal', 'shell', 'Bash', 'prompt', 'command line', 'host name', 'user name', '$', 'home folder', '~'],
    explain: 'The **terminal** is the window that shows text and passes on your keystrokes. Inside it runs the **shell**, the program that reads each line you type, runs it and waits for the next; on most Linux systems the shell is **Bash**. The **prompt** is the shell saying it is ready. In `student@biobridge:~/project$`, student is your user name, biobridge is the name of the computer (its host name), `~/project` is the folder you are in (`~` means your home folder) and `$` ends the prompt. The administrator account, root, sees `#` instead of `$`.',
    why: 'The prompt answers two questions before you type anything: which computer am I on, and in which folder? On a shared server, a glance at it prevents running a command on the wrong machine or saving results in the wrong folder.',
    visual: { diagram: 'prompt-anatomy' },
    example: {
      lang: 'bash',
      code: 'ls\ncd data\nls',
      output: 'README.txt  data  results  scripts\nannotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa',
      cwd: '~/project',
      note: 'Each command prints its result, then the prompt returns. After `cd data`, the prompt changes to `student@biobridge:~/project/data$`, so it always shows where you are.'
    },
    try: { kind: 'terminal', start: '~/project', task: 'Check two parts of the prompt with commands, then move into data and watch the prompt change.', tries: ['whoami', 'hostname', 'cd data', 'pwd'] },
    mistake: { wrong: 'Copying the `$` from a tutorial, as in `$ ls`.', fix: 'The `$` is part of the prompt, printed by the shell. If you type it, it becomes part of the command and Bash reports `$: command not found`. Type only `ls`.' },
    check: {
      q: 'Your prompt reads `student@biobridge:~/project/data$`. What does `~/project/data` tell you?',
      options: [
        { t: 'The folder you are in now, inside your home folder', why: 'The part after the colon is your working directory. `~` stands for your home folder, so you are in its project/data folder.' },
        { t: 'The folder where the shell program is installed', why: 'Programs are stored in folders such as /usr/bin. The prompt shows where you are working, not where Bash is stored.' },
        { t: 'The last file you opened', why: 'The prompt never records files. It shows the folder you are in, and it changes when you move with `cd`.' },
        { t: 'Your user name on the server', why: 'Your user name is the part before the `@`, here student. The part after the colon is a folder.' }
      ],
      answer: 0
    },
    deeper: ['f1-terminal']
  },
  {
    id: 'ibm-tree',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'The file system tree',
    lectures: ['Browsing directories with the Linux terminal'],
    minutes: 3,
    keywords: ['file system', 'directory', 'folder', 'root', '/', 'home', '/home', '/etc', '/bin', 'tree', 'case-sensitive'],
    explain: 'Linux keeps all files in one tree of folders, also called **directories**. The tree starts at the **root**, written `/`. Below it sit standard folders: `/bin` and `/usr/bin` hold programs, `/etc` holds system settings, `/tmp` holds temporary files and `/home` holds one personal folder per user. Your **home folder** here is `/home/student`, written `~` for short, and your project lives inside it. Linux has no drive letters such as `C:`: extra disks appear as folders somewhere in the same tree. Names are case-sensitive, so `Data` and `data` are different.',
    why: 'On a server, your data may sit several levels deep, as in `/home/student/project/data/reads.fastq`. Picturing the tree lets you read such paths, know where you are and reach any file, and every later command depends on that.',
    visual: { diagram: 'fs-tree' },
    example: {
      lang: 'bash',
      code: 'ls\nls project\nls project/data',
      output: 'notes.txt  project\nREADME.txt  data  results  scripts\nannotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa',
      cwd: '~',
      note: 'Each command looks one level deeper: your home folder, then project, then data. Folders are the branches of the tree; the files at the ends are its leaves.'
    },
    try: { kind: 'terminal', start: '~', task: 'Walk down the tree from the root to your project folder.', tries: ['ls /', 'ls /home', 'cd /home/student/project', 'ls'] },
    mistake: { wrong: 'Separating folders with a backslash, as on Windows: `ls data\\counts.tsv`.', fix: 'Linux uses the forward slash `/`. To the shell, a backslash only protects the next character, so this asks for a file called datacounts.tsv, which does not exist. Write `ls data/counts.tsv`.' },
    check: {
      q: 'Which of these is the root of the Linux file system tree?',
      options: [
        { t: '`/`', why: 'Every absolute path starts at this single folder, written as one forward slash. All files, folders and extra disks hang somewhere below it.' },
        { t: '`~`', why: '`~` is a shortcut for your home folder, such as /home/student. It is one branch of the tree, two levels below the root.' },
        { t: '`/root`', why: 'This is the home folder of the administrator account, which is called root. Despite its name, it is just a folder inside `/`.' },
        { t: '`C:\\`', why: 'Linux has no drive letters. Every disk is attached as a folder somewhere inside the one tree that starts at `/`.' }
      ],
      answer: 0
    },
    deeper: ['f1-paths', 'f1-navigate']
  },
  {
    id: 'ibm-paths',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'Absolute and relative paths',
    lectures: ['Browsing directories with the Linux terminal'],
    minutes: 3,
    keywords: ['path', 'absolute path', 'relative path', '..', '~', 'cd', 'No such file or directory'],
    explain: 'A **path** is the address of a file or folder. An **absolute path** starts at the root `/` and always works, wherever you are: `/home/student/project/data/counts.tsv`. A **relative path** starts from the folder you are in now. Two shortcuts make relative paths short: `..` means "one folder up" and `.` means "this folder". `~` is a shortcut for your home folder, so `~/project` works from anywhere.',
    why: 'Almost every "No such file or directory" error is a path that is relative to the wrong folder. Knowing which kind of path you typed tells you where the shell looked.',
    visual: { diagram: 'paths' },
    example: {
      lang: 'bash',
      code: 'cd ~/project/scripts\nls ../data',
      output: 'annotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa',
      cwd: '~/project',
      note: 'From scripts, `..` goes up to project, then `data` goes down into data. You listed a folder without moving into it.'
    },
    try: { kind: 'widget', widget: 'filetree', props: {} },
    mistake: { wrong: 'Typing `cd /data` to reach the data folder of your project.', fix: 'The leading `/` means "start at the root", and there is no `/data` there. Use `cd data` from inside project, or the full path `cd ~/project/data`.' },
    check: {
      q: 'You are in `~/project/scripts`. Which path names the same file as `/home/student/project/data/counts.tsv`?',
      options: [
        { t: '`../data/counts.tsv`', why: 'From scripts, `..` climbs to project and `data/counts.tsv` goes down to the file, so this relative path reaches the same place.' },
        { t: '`data/counts.tsv`', why: 'This looks for a data folder inside scripts, the folder you are in. There is none, so the shell reports No such file or directory.' },
        { t: '`/data/counts.tsv`', why: 'The leading slash makes it absolute, starting at the root. The root has no data folder, so this path does not exist.' }
      ],
      answer: 0
    },
    deeper: ['f1-paths', 'f1-navigate']
  },
  {
    id: 'ibm-tips',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'Tab completion and command history',
    lectures: ['Linux Terminal Tips - Tab completion, command history'],
    minutes: 3,
    keywords: ['Tab', 'tab completion', 'autocomplete', 'history', 'command history', 'Up arrow', 'Ctrl+R', 'typo', 'repeat command'],
    explain: 'Two habits save most of your typing. **Tab completion**: type the first letters of a command, file or folder name and press Tab. If exactly one name fits, the shell finishes it, so `cd pro` becomes `cd project/`. If several fit, it completes only the part they share; press Tab again to list them, then type a few more letters. **Command history**: the shell remembers what you typed. The Up arrow brings back earlier commands one by one, ready to edit and run again. `history` prints a numbered list, and Ctrl+R searches it as you type.',
    why: 'Bioinformatics file names are long, such as `heat_1_S3_L001_R1_001.fastq.gz`, and one typo gives No such file or directory. Tab only offers names that really exist, so it prevents typos, and history lets you rerun a long command without typing it again.',
    visual: { diagram: 'tab-history' },
    example: {
      lang: 'text',
      code: 'cd pro      then Tab        becomes  cd project/\nls data/co  then Tab        becomes  ls data/counts.tsv\nls data/s   then Tab twice  lists    samples.tsv  sequences.fa\nUp arrow                    brings back the previous command\nhistory                     prints earlier commands, numbered',
      note: 'Tab finished the first two names because only one name fit. Two names start with s, so the second Tab listed both; typing `sa` or `se` would settle it.'
    },
    try: { kind: 'terminal', start: '~', task: 'Run three commands, then list them with history. Try Tab and the Up arrow as you go.', tries: ['cd project', 'ls data', 'wc -l data/counts.tsv', 'history'] },
    mistake: { wrong: 'Tab did nothing, so tab completion does not work here.', fix: 'Silence means that several names fit, or none does. Press Tab a second time to list the choices. If none appear, check the spelling and capital letters, and look at the folder with `ls`.' },
    check: {
      q: 'In `~/project/data` you type `ls s` and press Tab once. Nothing is completed. Why?',
      options: [
        { t: 'Two names start with s, so the shell cannot choose', why: 'samples.tsv and sequences.fa both fit. A second Tab lists them, and typing one more letter, such as `a`, makes the choice unique.' },
        { t: 'Tab completion works only for command names', why: 'The shell completes file and folder names too. That is how `cd pro` becomes `cd project/`.' },
        { t: 'No file in this folder starts with s', why: 'Two files start with s. When nothing fits, Tab also does nothing, but here the reason is a tie between two names.' }
      ],
      answer: 0
    },
    deeper: ['f1-navigate', 'f1-terminal']
  },
  {
    id: 'ibm-editors',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'Editing text files with nano and Vim',
    lectures: ['Creating and Editing Text Files', 'Hands-on Lab: Installing and working with text editors'],
    minutes: 3,
    keywords: ['nano', 'vim', 'vi', 'text editor', 'save file', 'exit vim', ':wq', ':q!', 'insert mode', 'Ctrl+O', 'Ctrl+X'],
    explain: 'A **text editor** changes plain-text files such as scripts, notes and settings. **nano** is the simple one: `nano notes.txt` opens the file, or starts a new one, and you can type at once. The bottom lines list shortcuts, where `^` means Ctrl: Ctrl+O writes (saves) the file, Enter confirms the name and Ctrl+X exits. **Vim** works in **modes**. It opens in normal mode, where keys are commands. Press `i` for insert mode and type; press Esc to return to normal mode, where `:w` saves, `:q` quits, `:wq` does both and `:q!` quits without saving.',
    why: 'Servers have no word processor, and word processors add hidden formatting that breaks scripts. You will edit scripts, sample sheets and settings files in a terminal editor. nano is enough to start, and knowing how to leave Vim means you are never stuck inside it.',
    visual: { diagram: 'vim-modes' },
    example: {
      lang: 'text',
      code: 'vim notes.txt     opens Vim in normal mode\ni                 switches to insert mode\n                  type: HSPA1A rises after heat shock\nEsc               returns to normal mode\n:wq then Enter    writes the file and quits Vim\ncat notes.txt     prints: HSPA1A rises after heat shock',
      note: 'In normal mode, letters are commands, not text. If Vim seems to behave strangely, press Esc, then type `:q!` and Enter to leave without saving.'
    },
    try: { kind: 'mission', mission: 'f1-editors' },
    mistake: { wrong: 'Starting to type text as soon as Vim opens, as you would in nano.', fix: 'Vim opens in normal mode, where many letters are commands: `x` deletes a character and `dd` deletes a whole line. Press `i` first to insert text, and Esc when you have finished typing.' },
    check: {
      q: 'In Vim you have typed a line in insert mode and want to save and quit. What do you press?',
      options: [
        { t: 'Esc, then `:wq` and Enter', why: 'Esc returns to normal mode, where a colon starts a command, and `:wq` writes the file and then quits.' },
        { t: '`:wq` and Enter straight away', why: 'In insert mode, these characters are typed into the file as text. Press Esc first to get back to normal mode.' },
        { t: 'Ctrl+O, Enter, then Ctrl+X', why: 'Those are nano shortcuts. In Vim, saving and quitting are commands typed after a colon in normal mode.' },
        { t: 'Esc, then `:q!` and Enter', why: '`:q!` quits but throws away your changes. To keep the new line, write the file with `:w` or `:wq`.' }
      ],
      answer: 0
    },
    deeper: ['f1-editors']
  },
  {
    id: 'ibm-install',
    course: 'ibm',
    module: 'ibm-m1',
    title: 'Installing software and updates',
    lectures: ['Installing Software and Updates'],
    minutes: 3,
    keywords: ['install', 'package manager', 'apt', 'dnf', 'sudo', 'update', 'upgrade', 'repository', 'dependencies', 'package', 'root'],
    explain: 'Linux installs software through a **package manager**. It downloads **packages** (software in a ready-to-install form) from trusted online stores called **repositories**, installs their **dependencies** (other software they need) and keeps everything up to date. On Ubuntu and Debian the tool is `apt`: `apt update` refreshes the list of available versions, `apt upgrade` installs newer versions of what you have, and `apt install tree` adds a new program. Fedora and Red Hat systems use `dnf`, with `.rpm` packages instead of `.deb`. Changing system software needs administrator rights, so these commands start with `sudo`, which runs one command as root.',
    why: 'Every analysis tool must be installed first, and versions matter, because results can change between them. On shared servers you usually cannot use `sudo`, so tools come from conda (a package manager that needs no administrator rights) or from modules prepared by the administrators. The ideas of packages and dependencies stay the same.',
    visual: { diagram: 'package-manager' },
    example: {
      lang: 'bash',
      code: 'sudo apt update\nsudo apt upgrade\nsudo apt install tree',
      cwd: '~',
      noVerify: true,
      note: 'Not run here: these commands need the internet and administrator rights. On Ubuntu they refresh the package list, upgrade installed software, then install tree, a program that draws folder trees.'
    },
    mistake: { wrong: '`sudo apt update` installs the newest versions of my software.', fix: '`update` only downloads the latest list of available versions. `sudo apt upgrade` then installs the newer versions. Run update first, so that upgrade knows what is new.' },
    check: {
      q: 'On your Ubuntu laptop you want to install samtools, a common tool for sequencing data. Which command does it?',
      options: [
        { t: '`sudo apt install samtools`', why: 'apt is the package manager of Ubuntu, `install` adds a package with its dependencies, and sudo gives the administrator rights needed to change system software.' },
        { t: '`sudo apt update samtools`', why: '`update` only refreshes the list of available packages and takes no package name. Adding new software is the job of `install`.' },
        { t: '`sudo dnf install samtools`', why: 'dnf belongs to Fedora and Red Hat systems. Ubuntu is in the Debian family, whose package manager is apt.' },
        { t: '`apt install samtools`', why: 'Without sudo, apt stops with a permission error, because installing system software needs administrator (root) rights.' }
      ],
      answer: 0
    },
    deeper: ['f1-editors', 'f1-linux']
  },
  {
    id: 'ibm-anatomy',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'What a command looks like, and getting help',
    lectures: ['Overview of Common Linux Shell Commands', 'Getting Help for Linux Commands'],
    minutes: 3,
    keywords: ['command', 'option', 'argument', 'flag', 'syntax', 'man', 'manual page', '--help', 'help', 'command not found'],
    explain: 'Most commands follow one pattern: the **command name**, then **options**, then **arguments**, separated by spaces. In `ls -l -h data`, `ls` is the command, `-l` and `-h` are options that change how it works (long listing, human-readable sizes), and `data` is the argument: what it acts on. Short options can be joined, so `ls -lh data` means the same. Long options start with two hyphens, such as `--help`. To learn a command, `man ls` opens its manual page (Space scrolls, `q` quits) and `ls --help` prints a shorter summary. For commands built into Bash, such as `cd`, use `help cd`.',
    why: 'Bioinformatics tools follow the same pattern and usually print their options with `--help`. Once you can split a command into name, options and arguments, you can read commands you have never seen and look up the parts you do not know.',
    visual: { diagram: 'command-anatomy' },
    example: {
      lang: 'bash',
      code: 'ls\nls -a\nls project',
      output: 'notes.txt  project\n.  ..  .bashrc  notes.txt  project\nREADME.txt  data  results  scripts',
      cwd: '~',
      note: 'One command, three results. The option `-a` (all) adds hidden names, which start with a dot; the argument `project` lists that folder instead of the current one.'
    },
    try: { kind: 'terminal', start: '~/project/data', task: 'Change what wc reports by changing its options, then open its manual.', tries: ['wc counts.tsv', 'wc -l counts.tsv', 'wc -w counts.tsv', 'man wc'] },
    mistake: { wrong: 'Typing options without a space, as in `ls-l` or `head-n 3 counts.tsv`.', fix: 'The shell splits a line at spaces, so `ls-l` is read as one unknown command name and fails with command not found. Put a space before every option: `ls -l`.' },
    check: {
      q: 'Which command shows the full manual for `sort`, with every option explained?',
      options: [
        { t: '`man sort`', why: 'man opens the manual page of a program, which lists every option. Space scrolls, `/` searches and `q` quits.' },
        { t: '`sort -h`', why: 'For sort, `-h` does not mean help: it sorts human-readable sizes such as 2K and 1G. Each command defines its own options.' },
        { t: '`help sort`', why: '`help` documents only commands built into Bash, such as `cd`. sort is a separate program, so `help` has no topic for it.' },
        { t: '`sort man`', why: 'Here man is an argument, so sort tries to sort a file called man and fails because no such file exists.' }
      ],
      answer: 0
    },
    deeper: ['f1-terminal']
  },
  {
    id: 'ibm-info',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Informational commands',
    lectures: ['Informational Commands', 'Hands-on Lab: Informational Commands'],
    minutes: 3,
    keywords: ['whoami', 'id', 'hostname', 'uname', 'date', 'df', 'du', 'ps', 'top', 'disk space', 'processes', 'system information'],
    explain: 'Informational commands answer questions about the system without changing anything. Who am I? `whoami` prints your user name, and `id` also lists your user ID, group ID and groups. Which computer? `hostname`. Which system? `uname` names the kernel; `uname -a` adds the host name, the kernel version and the machine type. When? `date`. How much space? `df -h` shows the free space on each disk, and `du -sh folder` shows how much one folder uses. What is running? `ps` lists the processes (running programs) of your terminal, and `top` shows all of them live; press `q` to leave it.',
    why: 'Before a large job on a shared server, these give quick answers: am I on the right machine as the right user, is there room on the disk for 150 GB of reads, and is my alignment still running? A few seconds of checking can save hours of lost work.',
    visual: { diagram: 'info-commands' },
    example: {
      lang: 'bash',
      code: 'echo $USER\nuname',
      output: 'student\nLinux',
      cwd: '~/project',
      note: 'The variable `USER` holds your user name, usually the same answer `whoami` gives, and `uname` names the kernel. On your own computer the user name will differ.'
    },
    try: { kind: 'terminal', start: '~/project', task: 'Ask the practice server who you are, which machine this is and how much space there is.', tries: ['whoami', 'hostname', 'uname -a', 'df -h', 'du -sh data'] },
    mistake: { wrong: '`df -h` tells me how much space my data folder uses.', fix: '`df` reports free and used space on whole disks (file systems). For the size of one folder, use `du -sh data`: `-s` gives one total and `-h` human-readable units.' },
    check: {
      q: 'Your analysis seems frozen. Which command shows, live, which programs are using the processor right now?',
      options: [
        { t: '`top`', why: 'top shows running processes live, refreshed every few seconds and sorted by processor use. Press q to leave it.' },
        { t: '`ps`', why: 'ps prints one snapshot that does not update, and on its own it lists only the processes of your current terminal.' },
        { t: '`df -h`', why: 'df reports the free disk space on each file system. It says nothing about which programs are running.' },
        { t: '`uname -a`', why: 'uname describes the kernel and the machine. It does not list any running programs.' }
      ],
      answer: 0
    },
    deeper: ['f1-terminal']
  },
  {
    id: 'ibm-navigate',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Moving around: pwd, ls and cd',
    lectures: ['File and Directory Navigation Commands', 'Hands-on Lab: Navigating and Managing Files and Directories'],
    minutes: 3,
    keywords: ['pwd', 'ls', 'cd', 'cd ..', 'cd -', 'working directory', 'hidden files', 'ls -l', 'ls -a', 'navigate'],
    explain: 'Three commands answer three questions. Where am I? `pwd` (print working directory) prints the full path of your **working directory**, the folder you are in. What is here? `ls` lists it; `ls data` lists another folder without moving, `ls -l` adds details such as size and date, and `ls -a` also shows hidden names, which start with a dot. How do I get there? `cd data` moves into a folder, `cd ..` moves up one level, `cd` on its own returns to your home folder, and `cd -` jumps back to the previous folder.',
    why: 'Commands read and write files relative to where you are. Running one in the wrong folder is the most common cause of No such file or directory, and of results saved in the wrong place. `pwd` and `ls` settle the question in a second.',
    visual: { diagram: 'cd-moves' },
    example: {
      lang: 'bash',
      code: 'cd project/data\nls\ncd ..\nls',
      output: 'annotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa\nREADME.txt  data  results  scripts',
      cwd: '~',
      note: '`cd project/data` went two levels down in one step, and `cd ..` came back up one level, to project. `pwd` at any point would print the full path.'
    },
    try: { kind: 'mission', mission: 'f1-navigate' },
    mistake: { wrong: '`cd ..` takes me back to the folder I was in before.', fix: '`..` always means the parent folder, one level up, wherever you came from. To jump back to the previous folder, use `cd -`, which also prints where it took you.' },
    check: {
      q: 'You type `cd`, then `cd project`, then `cd data`, then `cd ..`. Where are you now?',
      options: [
        { t: '`~/project`', why: '`cd` alone went home, `cd project` and `cd data` went down two levels, and `cd ..` came back up one level, to project.' },
        { t: '`~`', why: '`cd ..` climbs only one level. Getting home again would need a second `cd ..`, or `cd` on its own.' },
        { t: '`~/project/data`', why: 'That is where you were before the last command. `cd ..` then moved you up to the parent folder, project.' },
        { t: '`/`', why: 'The root is several levels above your home folder. Each `cd ..` climbs exactly one level, never straight to the root.' }
      ],
      answer: 0
    },
    deeper: ['f1-navigate', 'f1-paths']
  },
  {
    id: 'ibm-manage',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Creating, copying, moving and deleting',
    lectures: ['File and Directory Management Commands', 'Hands-on Lab: Navigating and Managing Files and Directories'],
    minutes: 3,
    keywords: ['mkdir', 'touch', 'cp', 'mv', 'rm', 'rmdir', 'rename', 'copy', 'delete', 'move', 'find'],
    explain: '`mkdir tables` creates a folder; `mkdir -p a/b` also creates missing parent folders. `touch notes.txt` creates an empty file. `cp counts.tsv backup.tsv` copies a file and keeps the original, and `cp -r data data_copy` copies a whole folder. `mv` moves a file into another folder, or renames it when you give a new name in the same folder. `rm file` deletes a file, `rm -r folder` deletes a folder with everything in it, and `rmdir folder` deletes only an empty folder. `find . -name "*.fa"` searches this folder and every folder below it for names ending in .fa.',
    why: 'Keep raw data, scripts and results in separate folders, and never edit raw files in place. Linux has no recycle bin: a file removed by `rm`, or overwritten by `cp` or `mv`, is gone, so make a copy before you change anything.',
    visual: { diagram: 'file-ops' },
    example: {
      lang: 'bash',
      code: 'mkdir results/tables\ncp data/samples.tsv results/tables/\nmv results/tables/samples.tsv results/tables/design.tsv\nls results/tables\nls data',
      output: 'design.tsv\nannotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa',
      cwd: '~/project',
      note: 'Nothing printed until `ls`, because these commands are silent when they succeed. The copy was renamed to design.tsv, and the original samples.tsv is still in data.'
    },
    try: { kind: 'mission', mission: 'f1-manage' },
    mistake: { wrong: 'If a file with that name already exists, `cp` or `mv` will ask before replacing it.', fix: 'By default, both replace the existing file silently. Add `-i` (interactive) to be asked first, or check the destination with `ls` before you copy or move.' },
    check: {
      q: 'In `~/project/data` you run `mv samples.tsv design.tsv`. What happens?',
      options: [
        { t: 'samples.tsv is renamed to design.tsv; only one file remains', why: 'mv to a new name in the same folder renames the file. The content stays the same and the old name disappears.' },
        { t: 'A copy called design.tsv is made, and samples.tsv stays', why: 'That is what `cp` does. mv never leaves the original behind: it moves or renames it.' },
        { t: 'samples.tsv is moved into a folder called design.tsv', why: 'That happens only when a folder called design.tsv already exists. Here none does, so mv uses it as the new file name.' },
        { t: 'An error, because design.tsv does not exist yet', why: 'The destination does not need to exist. mv creates the new name, which is exactly how renaming works.' }
      ],
      answer: 0
    },
    deeper: ['f1-manage']
  },
  {
    id: 'ibm-permissions',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Permissions and ownership',
    lectures: ['Security - Managing File Permissions and Ownership', 'Hands-on Lab: Access Control Commands'],
    minutes: 3,
    keywords: ['permissions', 'chmod', 'chown', 'owner', 'group', 'rwx', 'Permission denied', 'execute', '755', 'ls -l', 'read-only'],
    explain: 'Every file has an **owner**, a **group**, and permissions for three classes: the owner, the group and everyone else (others). `ls -l` shows them as ten characters, such as `-rwxr-xr--`. The first is the type (`-` file, `d` directory); then come three sets of `r` (read), `w` (write) and `x` (execute), for owner, group and others, with `-` where a permission is missing. `chmod +x run.sh` adds execute permission; `chmod go-w notes.txt` removes write from group and others. In numbers, each digit adds r = 4, w = 2 and x = 1 for one class, so `chmod 755` gives `rwxr-xr-x`. `chown` changes the owner and needs administrator rights.',
    why: 'Shared servers hold many people\'s data, and permissions keep it private and safe. You will meet them first as Permission denied when you run a new script, which `chmod +x` fixes. Making raw data read-only with `chmod a-w` protects it from accidents.',
    visual: { diagram: 'permissions' },
    example: {
      lang: 'bash',
      code: 'ls -l count_seqs.sh | cut -c 1-10\nchmod +x count_seqs.sh\nls -l count_seqs.sh | cut -c 1-10',
      output: '-rw-r--r--\n-rwxr-xr-x',
      cwd: '~/project/scripts',
      note: '`cut -c 1-10` keeps only the permission characters. `+x` added execute for owner, group and others, so the script can now be run as `./count_seqs.sh`.'
    },
    try: { kind: 'mission', mission: 'f1-permissions' },
    mistake: { wrong: '`./script.sh` says Permission denied, so I must run it with `sudo`.', fix: 'The file only lacks execute permission. `chmod u+x script.sh` fixes it, or run `bash script.sh`. sudo would run it as root, which is risky and usually not allowed on shared servers.' },
    check: {
      q: 'Which numeric mode gives `rw-r-----`, where the owner reads and writes, the group reads and others get nothing?',
      options: [
        { t: '640', why: '6 = 4 + 2 gives `rw-`, 4 gives `r--` and 0 gives `---`. The digits always go owner, group, others.' },
        { t: '644', why: '644 also gives others `r--`. Here others have no permissions at all, so the last digit must be 0.' },
        { t: '460', why: 'The digits are in the order owner, group, others, so the owner\'s `rw-` (6) must come first.' },
        { t: '750', why: '7 means `rwx` and 5 means `r-x`, which would add execute permission. `rw-` is 6 and `r--` is 4.' }
      ],
      answer: 0
    },
    deeper: ['f1-permissions']
  },
  {
    id: 'ibm-view',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Looking inside files',
    lectures: ['Viewing File Content'],
    minutes: 3,
    keywords: ['cat', 'less', 'more', 'head', 'tail', 'wc', 'view file', 'first lines', 'last lines', 'count lines', 'header'],
    explain: 'To look inside a text file, you rarely need an editor. `cat file` prints all of it, which suits short files; `cat -n` numbers the lines. `less file` shows one screen at a time: Space or the arrow keys move, `/word` searches and `q` quits (`more` is an older, simpler pager). `head` shows the first 10 lines and `tail` the last 10; `head -n 3`, or its short form `head -3`, shows 3. `tail -n +2` starts at line 2, which skips a header. `wc` counts lines, words and bytes; `wc -l` counts lines only.',
    why: 'A quick look catches most problems before any analysis: a missing header, the wrong separator, or a download that stopped halfway. Counting lines also counts records when you know the format: in a FASTQ file, every read takes exactly 4 lines.',
    visual: { diagram: 'head-tail' },
    example: {
      lang: 'bash',
      code: 'head -3 counts.tsv\nwc -l counts.tsv',
      output: 'gene\tctrl_1\tctrl_2\tctrl_3\theat_1\theat_2\theat_3\nHSPA1A\t212\t282\t203\t11018\t8441\t10838\nHSPA1B\t172\t202\t155\t10345\t7330\t7541\n13 counts.tsv',
      cwd: '~/project/data',
      note: 'Line 1 is a header naming the columns, so 13 lines mean 12 genes. The columns are separated by tab characters.'
    },
    try: { kind: 'mission', mission: 'f1-view' },
    mistake: { wrong: '`tail -n 2 counts.tsv` removes the first two lines and prints the rest.', fix: '`tail -n 2` prints only the last 2 lines. The plus sign changes the meaning: `tail -n +2` starts at line 2, so it prints everything except the header.' },
    check: {
      q: 'You downloaded a large table and want to check that its last rows arrived complete. Which command fits best?',
      options: [
        { t: '`tail counts.tsv`', why: 'tail prints the last 10 lines straight away, which is exactly where a download that stopped early would leave a broken row.' },
        { t: '`head counts.tsv`', why: 'head shows the first 10 lines. A download that stopped early still looks fine at the start; the damage is at the end.' },
        { t: '`cat counts.tsv`', why: 'cat prints every line, which takes a long time on a large file. tail goes straight to the end.' },
        { t: '`wc -l counts.tsv`', why: 'wc counts lines but does not show them, so you cannot see whether the last row is complete.' }
      ],
      answer: 0
    },
    deeper: ['f1-view']
  },
  {
    id: 'ibm-wrangle',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Wrangling text: sort, uniq, cut, paste, wc',
    lectures: ['Useful Commands for Wrangling Text Files', 'Hands-on Lab: Wrangling Text Files at the Command Line'],
    minutes: 3,
    keywords: ['cut', 'sort', 'uniq', 'paste', 'wc', 'columns', 'fields', 'tab-separated', 'sort -n', 'uniq -c', 'count values'],
    explain: 'Small tools reshape text tables without a spreadsheet. `cut -f 1,2 samples.tsv` keeps columns (fields) 1 and 2 of a tab-separated file; add `-d ","` for a comma-separated one. `sort` puts lines in order: `-n` sorts numbers by value and `-r` reverses. `uniq` collapses repeated lines that are next to each other, and `uniq -c` counts them, so sort first. `paste a.txt b.txt` joins two files side by side, line by line, with a tab between. `wc` counts lines (`-l`), words (`-w`) and bytes (`-c`). The pipe `|` passes one command\'s output to the next.',
    why: 'Gene tables, sample sheets and count matrices are text, so these tools answer quick questions on files of any size: which conditions exist, how many genes are in each category, which values are largest. The same one line works on 12 rows or 12 million.',
    visual: { diagram: 'cut-columns' },
    example: {
      lang: 'bash',
      code: 'cut -f 2 samples.tsv | tail -n +2 | sort | uniq -c',
      output: '      3 control\n      3 heat_shock',
      cwd: '~/project/data',
      note: '`cut` kept column 2, `tail -n +2` dropped the header, `sort` grouped equal values and `uniq -c` counted them: 3 samples per condition.'
    },
    try: { kind: 'mission', mission: 'f1-wrangle' },
    mistake: { wrong: '`uniq` removes every duplicate line in a file, wherever the copies are.', fix: '`uniq` only compares each line with the one just before it, so copies far apart survive. Sort first: `sort | uniq -c` counts each value exactly once.' },
    check: {
      q: 'Which command prints only the sample names and conditions (columns 1 and 2) of the tab-separated samples.tsv?',
      options: [
        { t: '`cut -f 1,2 samples.tsv`', why: 'cut splits each line at tabs, its default separator, and keeps fields 1 and 2: the sample name and the condition, header included.' },
        { t: '`head -n 2 samples.tsv`', why: 'head selects lines, not columns. This prints the first two rows with all four of their columns.' },
        { t: '`cut -f 1,2 -d "," samples.tsv`', why: 'The file is separated by tabs. With a comma as the separator, cut finds no field breaks and prints every line whole.' },
        { t: '`sort -k 1,2 samples.tsv`', why: 'sort reorders whole lines, using those fields as the sort key. It never removes columns.' }
      ],
      answer: 0
    },
    deeper: ['f1-wrangle', 'f1-pipes']
  },
  {
    id: 'ibm-grep',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Searching text with grep',
    lectures: ['Useful Commands for Wrangling Text Files', 'Hands-on Lab: Wrangling Text Files at the Command Line'],
    minutes: 3,
    keywords: ['grep', 'search', 'pattern', 'match', 'grep -c', 'grep -v', 'grep -i', 'grep -n', 'grep -w', 'regular expression', 'find text'],
    explain: '`grep PATTERN FILE` prints every line of the file that contains the pattern anywhere in it, and matching is case-sensitive. Some options change what matches: `-i` ignores case, `-w` matches whole words only and `-v` keeps the lines that do **not** match. Others change what is printed: `-c` prints how many lines match, and `-n` adds line numbers. Put the pattern in quotes when it holds spaces or characters the shell treats specially, such as `>` or `*`. Patterns are regular expressions, so `^>` means a line that starts with `>`.',
    why: 'grep finds one gene among 60,000 rows in an instant, counts the sequences in a FASTA file by counting its `>` header lines, and finds error messages in long pipeline logs. It reads a file once, from start to end, so it stays fast on very large files.',
    visual: { diagram: 'grep-filter' },
    example: {
      lang: 'bash',
      code: 'grep HSP counts.tsv\ngrep -c HSP counts.tsv',
      output: 'HSPA1A\t212\t282\t203\t11018\t8441\t10838\nHSPA1B\t172\t202\t155\t10345\t7330\t7541\nHSPA6\t2\t0\t3\t999\t725\t1133\nHSPH1\t1554\t2122\t1552\t6178\t4240\t6034\nHSPB1\t2541\t2722\t2736\t5990\t3295\t4989\n5',
      cwd: '~/project/data',
      note: 'Five gene names contain HSP. DNAJB1 and BAG3 are heat-shock genes too, but their names lack those letters: grep matches text, not meaning.'
    },
    try: { kind: 'mission', mission: 'f1-grep' },
    mistake: { wrong: '`grep -c A sequences.fa` counts the A bases in the file.', fix: '`-c` counts matching lines, not matches: a sequence line with 20 A bases counts once. `grep -o` prints each match on its own line, so `grep -o PATTERN FILE | wc -l` counts every occurrence.' },
    check: {
      q: 'In `~/project/data`, how many lines does `grep -v control samples.tsv` print?',
      options: [
        { t: '4', why: '`-v` keeps the lines without control: the three heat_shock samples plus the header line, which does not contain the word either.' },
        { t: '3', why: 'Three lines contain control and three heat_shock lines do not, but the header lacks control too. `-v` keeps every line that does not match.' },
        { t: '7', why: 'Seven is every line of the file. `-v` removes the 3 lines that contain control and keeps the other 4.' }
      ],
      answer: 0
    },
    deeper: ['f1-grep', 'f1-bio-recipes']
  },
  {
    id: 'ibm-network',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Networking commands',
    lectures: ['Networking Commands', 'A Brief Introduction to Networking (Optional)', 'Hands-on Lab: Working with Networking Commands'],
    minutes: 3,
    keywords: ['network', 'IP address', 'hostname', 'ping', 'curl', 'wget', 'download', 'ip addr', 'ifconfig', 'URL', 'internet'],
    explain: 'Computers on a network have names, such as `biobridge`, and numeric **IP addresses**, such as `10.0.0.15`; a name like `example.org` is looked up and turned into an address automatically. `hostname` prints this computer\'s name and `hostname -I` its addresses. `ip addr`, or the older `ifconfig`, lists its network connections. `ping -c 4 example.org` sends four small test messages and reports whether, and how fast, the other computer answers (without `-c` it runs until you press Ctrl+C). `curl URL` fetches a web address and prints what it receives; add `-O` to save it as a file. `wget URL` downloads a file into the current folder.',
    why: 'Reference genomes and public sequencing data live on servers such as Ensembl and NCBI. `wget` and `curl` download them straight onto the server where you work, instead of through your laptop, and `ping` quickly shows whether a server can be reached at all.',
    visual: { diagram: 'network' },
    example: {
      lang: 'bash',
      code: 'hostname -I\nping -c 3 example.org\nwget https://example.org/index.html',
      cwd: '~',
      noVerify: true,
      note: 'Not run here: the output depends on your network, and the practice terminal has no internet. On a connected machine, ping reports whether replies come back, and wget saves index.html in the current folder.'
    },
    mistake: { wrong: '`ping` got no reply, so the website must be down.', fix: 'Many servers ignore ping messages for security, yet still serve web pages and files. Try the download itself with `curl` or `wget` before deciding that a server cannot be reached.' },
    check: {
      q: 'You need the file at `https://example.org/genes.txt` saved on the server under its own name. Which command does that?',
      options: [
        { t: '`wget https://example.org/genes.txt`', why: 'wget downloads the file and saves it in the current folder as genes.txt, showing its progress while it works.' },
        { t: '`curl https://example.org/genes.txt`', why: 'Without `-O` or `-o`, curl prints what it downloads to the screen instead of saving it. `curl -O` would save it.' },
        { t: '`ping example.org`', why: 'ping only checks whether a computer answers. It transfers no files, and it takes a host name, not a web address.' },
        { t: '`hostname -I`', why: 'This prints the IP addresses of your own computer. It does not contact any other computer or download anything.' }
      ],
      answer: 0
    },
    deeper: ['f1-archive-net']
  },
  {
    id: 'ibm-archive',
    course: 'ibm',
    module: 'ibm-m2',
    title: 'Archiving and compressing files',
    lectures: ['File Archiving and Compression Commands', 'Hands-on Lab: Archiving and Compressing Files'],
    minutes: 3,
    keywords: ['tar', 'gzip', 'gunzip', 'zcat', 'zip', 'unzip', '.tar.gz', '.gz', 'archive', 'compress', 'extract'],
    explain: '**Archiving** bundles many files into one file; **compressing** makes a file smaller. `tar -cf data.tar data` creates (`c`) an archive file (`f`) from a folder, `tar -tf data.tar` lists (`t`) what is inside and `tar -xf data.tar` extracts (`x`) it. Add `z` to compress or decompress with gzip at the same time: `tar -czf data.tar.gz data`. `gzip file` compresses one file and replaces it with `file.gz`; `gunzip` reverses that, and `zcat` prints the contents without unpacking. `zip -r data.zip data` and `unzip data.zip` do both jobs in one format, common on Windows.',
    why: 'Sequencing reads, genomes and annotation files are large, so they are shared as `.gz` or `.tar.gz` files. You will list, unpack and read them before analysis, and pack your results into one file to send to a collaborator.',
    visual: { diagram: 'archive' },
    example: {
      lang: 'bash',
      code: 'cp data/samples.tsv results/\ngzip results/samples.tsv\nls results\nzcat results/samples.tsv.gz | head -n 2',
      output: 'samples.tsv.gz\nsample\tcondition\treplicate\ttemperature_C\nctrl_1\tcontrol\t1\t37',
      cwd: '~/project',
      note: 'gzip replaced the copy with samples.tsv.gz, and `zcat` read the compressed file without unpacking it on disk. The original in data is untouched.'
    },
    try: { kind: 'mission', mission: 'f1-archive-net' },
    mistake: { wrong: 'Running `gzip data` will compress the whole data folder into one file.', fix: 'gzip works on single files only: given a folder, it prints `data is a directory -- ignored`. Bundle and compress the folder in one step with tar: `tar -czf data.tar.gz data`.' },
    check: {
      q: 'A collaborator sends `run42.tar.gz`. Which command unpacks its files into the current folder?',
      options: [
        { t: '`tar -xzf run42.tar.gz`', why: '`x` extracts, `z` removes the gzip compression and `f` names the archive. The folders and files inside are recreated here.' },
        { t: '`tar -tzf run42.tar.gz`', why: '`t` only lists what is inside. That is a good first check, but it writes nothing to disk.' },
        { t: '`gunzip run42.tar.gz`', why: 'This removes only the gzip layer and leaves run42.tar, still one bundled file. tar is still needed to extract it.' },
        { t: '`zcat run42.tar.gz`', why: 'zcat prints the decompressed archive to the screen as raw bytes. It creates no files.' }
      ],
      answer: 0
    },
    deeper: ['f1-archive-net']
  },
  {
    id: 'ibm-scripts',
    course: 'ibm',
    module: 'ibm-m3',
    title: 'Shell scripts and the shebang',
    lectures: ['Shell Scripting Basics', 'Hands-on Lab: Getting Started with Shell Scripting'],
    minutes: 3,
    keywords: ['shell script', 'script', 'shebang', '#!/bin/bash', 'bash script.sh', './script.sh', '$1', 'argument', 'comment', 'echo', 'chmod +x'],
    explain: 'A **shell script** is a text file of commands that Bash runs from top to bottom. Its first line, `#!/bin/bash`, is the **shebang**: it tells the system which program should run the file. Other lines that start with `#` are comments for human readers. Inside the script, `$1` holds the first argument you give it and `$2` the second; `$(command)` runs a command and inserts its output, and `echo` prints text. Run a script with `bash count_seqs.sh FILE`, or make it executable once with `chmod +x count_seqs.sh` and then run `./count_seqs.sh FILE`.',
    why: 'A script records an analysis step once and runs it the same way every time, on any file you name. That makes your work quick to repeat on many samples, and easy to check, share and reproduce.',
    visual: { diagram: 'script-anatomy' },
    example: {
      lang: 'bash',
      code: 'head -n 1 count_seqs.sh\nbash count_seqs.sh ../data/sequences.fa',
      output: '#!/bin/bash\n../data/sequences.fa contains 6 sequences',
      cwd: '~/project/scripts',
      note: 'Line 1 of the script is the shebang. bash only reads the file, so no execute permission was needed, and inside the script `$1` became ../data/sequences.fa.'
    },
    try: { kind: 'mission', mission: 'f1-scripts' },
    mistake: { wrong: 'Adding the shebang line `#!/bin/bash` is what makes a script executable.', fix: 'The shebang only names the program that runs the file. Execute permission comes from `chmod +x`; without it, `./script.sh` still fails with Permission denied.' },
    check: {
      q: 'In `~/project/scripts`, count_seqs.sh has permissions `-rw-r--r--`. Which command runs it without changing anything first?',
      options: [
        { t: '`bash count_seqs.sh ../data/sequences.fa`', why: 'Bash reads the file and runs its lines, so read permission is enough, and `-rw-r--r--` gives everyone read permission.' },
        { t: '`./count_seqs.sh ../data/sequences.fa`', why: '`./` asks the system to execute the file itself, which needs x permission. With `-rw-r--r--` you get Permission denied.' },
        { t: '`count_seqs.sh ../data/sequences.fa`', why: 'Without a path, the shell searches only the folders listed in PATH, which normally exclude the current folder, so it reports command not found.' }
      ],
      answer: 0
    },
    deeper: ['f1-scripts', 'f1-permissions']
  },
  {
    id: 'ibm-pipes',
    course: 'ibm',
    module: 'ibm-m3',
    title: 'Filters and pipes',
    lectures: ['Filters, Pipes, and Variables', 'Examples of Pipes'],
    minutes: 3,
    keywords: ['pipe', '|', 'filter', 'pipeline', 'standard input', 'standard output', 'stdin', 'stdout', 'chain commands', 'combine commands'],
    explain: 'Most commands read text from **standard input** and write their results to **standard output**, which is normally the screen. A **filter** reads text, selects or changes it and writes text out: `grep`, `cut`, `sort`, `uniq`, `head`, `tr` and `wc` are filters. A **pipe**, the `|` symbol, connects the standard output of the command on its left to the standard input of the command on its right. Chaining filters builds a **pipeline**: in `cut -f 1 counts.tsv | grep HSP | sort | wc -l`, each command works on what the previous one produced.',
    why: 'Each Linux tool does one small job, and pipes combine them to answer real questions in one line, such as how many genes belong to one family. Data streams through a pipeline in small pieces, with no intermediate files to manage, so pipelines can handle files far larger than the memory of the computer.',
    visual: { diagram: 'pipeline' },
    example: {
      lang: 'bash',
      code: 'cut -f 1 counts.tsv | grep HSP | sort\ncut -f 1 counts.tsv | grep HSP | sort | wc -l',
      output: 'HSPA1A\nHSPA1B\nHSPA6\nHSPB1\nHSPH1\n5',
      cwd: '~/project/data',
      note: 'cut kept the gene names, grep kept those containing HSP and sort put them in order. Adding `| wc -l` turned the list into a count: 5.'
    },
    try: { kind: 'mission', mission: 'f1-pipes' },
    mistake: { wrong: 'Using a pipe to save output into a file: `grep HSP counts.tsv | hsp.txt`.', fix: 'A pipe connects two commands, so the shell looks for a program called hsp.txt and reports command not found. Save output with redirection instead: `grep HSP counts.tsv > hsp.txt`.' },
    check: {
      q: 'In `~/project/data`, what does `grep heat_shock annotation.tsv | wc -l` print?',
      options: [
        { t: '7', why: 'grep sends the 7 heat_shock lines into the pipe instead of to the screen, and `wc -l` counts the lines it receives.' },
        { t: '7 annotation.tsv', why: 'wc prints a file name only when it opens the file itself. Reading from a pipe, it has no name to print, just the number.' },
        { t: '13', why: '13 is the number of lines in the whole file. wc never sees the file, only the 7 lines that grep let through.' },
        { t: 'The 7 matching lines, then 7', why: 'The lines from grep went into the pipe, not to the screen. Only the standard output of the last command reaches the screen.' }
      ],
      answer: 0
    },
    deeper: ['f1-pipes', 'f1-wrangle']
  },
  {
    id: 'ibm-variables',
    course: 'ibm',
    module: 'ibm-m3',
    title: 'Shell and environment variables',
    lectures: ['Filters, Pipes, and Variables', 'A Brief Introduction to Shell Variables'],
    minutes: 3,
    keywords: ['variable', 'shell variable', 'environment variable', 'export', '$', 'PATH', 'HOME', 'USER', 'env', 'echo $'],
    explain: 'A **variable** is a name that stores text. `sample=heat_1` creates one, with no spaces around `=`, and `$sample` gives its value back: `echo $sample` prints heat_1. A plain variable is a **shell variable**: it exists only in the current shell. `export sample` turns it into an **environment variable**, which is copied into every program and script the shell starts (its child processes). Some environment variables are set for you: `HOME` (your home folder), `USER` (your user name) and `PATH`, the list of folders the shell searches for commands. `env` lists them all.',
    why: 'Variables make scripts readable and reusable: set a sample name or a folder once, then use it in every command that follows. And when a newly installed tool gives command not found, the usual cause is that its folder is not in `PATH`.',
    visual: { diagram: 'shell-vars' },
    example: {
      lang: 'bash',
      code: 'sample=heat_1\necho "In this shell: $sample"\necho \'echo "In a script: $sample"\' > show.sh\nbash show.sh\nexport sample\nbash show.sh',
      output: 'In this shell: heat_1\nIn a script:\nIn a script: heat_1',
      cwd: '~/project/results',
      note: 'show.sh is a one-line script, and bash runs it in a new shell. That shell saw the variable only after `export` copied it into the environment.'
    },
    try: { kind: 'terminal', start: '~/project/data', task: 'Store a gene name in a variable and use it, then look at two environment variables.', tries: ['gene=HSPA1A', 'echo $gene', 'grep $gene counts.tsv', 'echo $HOME', 'echo $PATH'] },
    mistake: { wrong: 'Writing `sample = heat_1` with spaces around the equals sign, as in Python.', fix: 'Bash then runs a command called sample with the arguments `=` and heat_1, and fails with command not found. Write `sample=heat_1`, with no spaces around `=`.' },
    check: {
      q: 'You run `name=ctrl_1`, then a script that prints `$name`. The script prints an empty line. Why?',
      options: [
        { t: 'It was not exported, so the script never received it', why: 'Only environment variables are copied into programs the shell starts. Run `export name` first, and the script will print ctrl_1.' },
        { t: 'Variables work only inside scripts, not at the prompt', why: 'Variables work at the prompt too: `echo $name` there prints ctrl_1. The problem is passing the value on to another program.' },
        { t: 'The script should write `name` without the `$`', why: 'Without `$`, the script would print the word name itself. `$` is how you ask for the value, in scripts and at the prompt.' },
        { t: 'Variable names must be written in capital letters', why: 'Lowercase names work fine. Capitals are only a convention, used for environment variables such as PATH and HOME.' }
      ],
      answer: 0
    },
    deeper: ['f1-scripts']
  },
  {
    id: 'ibm-features',
    course: 'ibm',
    module: 'ibm-m3',
    title: 'Redirection, wildcards and other Bash features',
    lectures: ['Useful Features of the Bash Shell', 'Examples of Bash Shell Features'],
    minutes: 3,
    keywords: ['redirection', '>', '>>', '2>', '<', 'wildcard', 'glob', '*', 'overwrite', 'append', '&&', 'quotes'],
    explain: '**Redirection** connects commands to files: `>` writes a command\'s output into a file, replacing what was there; `>>` adds to the end instead; `2>` saves error messages, which travel on a separate stream; and `<` feeds a file in as input. **Wildcards** match file names: `*` matches any run of characters, even none, and `?` exactly one, so `*.tsv` means every name ending in .tsv. The shell replaces the pattern with the matching names before the command runs. Also useful: quotes stop the shell from treating characters such as `*` and `>` as special, and `&&` runs the next command only if the previous one succeeded.',
    why: 'Redirection turns screen output into result files you can keep and share, and `2>` keeps a log of what went wrong in long jobs. Wildcards let one command handle every sample at once, such as `wc -l *.fastq` for all the FASTQ files in a folder.',
    visual: { diagram: 'redirect' },
    example: {
      lang: 'bash',
      code: 'wc -l *.tsv > ../results/lines.txt\necho "done" >> ../results/lines.txt\ncat ../results/lines.txt',
      output: '  13 annotation.tsv\n  13 counts.tsv\n   7 samples.tsv\n  33 total\ndone',
      cwd: '~/project/data',
      note: '`*.tsv` became three file names before wc ran. `>` created lines.txt, `>>` added a line at its end, and `cat` shows both.'
    },
    try: { kind: 'terminal', start: '~/project/data', task: 'Match names with a wildcard, then write, append to and read back a small file.', tries: ['ls s*', 'echo "first line" > ../results/notes.txt', 'echo "second line" >> ../results/notes.txt', 'cat ../results/notes.txt', 'wc -l < ../results/notes.txt'] },
    mistake: { wrong: '`sort counts.tsv > counts.tsv` sorts the file in place and keeps the result.', fix: 'The shell empties counts.tsv before sort starts, so sort reads an empty file and the data is lost. Write to a new file, such as sorted.tsv, and rename it afterwards if needed.' },
    check: {
      q: 'In `~/project/data`, which files does the pattern `s*` match?',
      options: [
        { t: 'samples.tsv and sequences.fa', why: '`s*` means s followed by anything, including nothing. Both names start with s, so the shell puts both in place of the pattern.' },
        { t: 'Every file in the folder', why: 'The star matches the rest of the name, but the name must still start with s. counts.tsv and reads.fastq do not.' },
        { t: 'Every name that contains an s anywhere', why: 'That would be `*s*`. Without a star in front, the match must begin at the first character of the name.' },
        { t: 'Only a file literally named s*', why: 'The shell expands the pattern into matching names before the command runs. It keeps `s*` unchanged only when nothing matches.' }
      ],
      answer: 0
    },
    deeper: ['f1-pipes', 'f1-manage']
  },
  {
    id: 'ibm-advanced',
    course: 'ibm',
    module: 'ibm-m3',
    title: 'Loops, conditions and arguments in scripts',
    lectures: ['Introduction to Advanced Bash Scripting', 'Hands-on Lab: Advanced Bash Scripting'],
    minutes: 3,
    keywords: ['for loop', 'if', 'while', 'condition', 'test', '[ ]', 'arguments', '$1', '$#', '$@', 'loop over files'],
    explain: 'A **for loop** repeats commands for each item in a list: `for f in *.tsv; do wc -l "$f"; done` sets `f` to each file name in turn and runs the body once per name. An **if statement** chooses: `if [ -s "$f" ]; then ... else ... fi` runs the first block only when the test is true. Tests go inside `[ ]`, with spaces inside the brackets: `-f` is a file, `-d` is a folder, `-s` exists and is not empty, and `-lt` or `-gt` compare numbers. In a script, `$1` and `$2` are its arguments, `$#` counts them and `$@` lists them all.',
    why: 'Experiments have many samples. A loop runs the same steps on 6 files or 600 in exactly the same way, and an `if` test stops a script at a missing or empty input before it silently produces wrong results.',
    visual: { diagram: 'bash-loop' },
    example: {
      lang: 'bash',
      code: 'for f in *.tsv\ndo\n  if [ -s "$f" ]; then\n    echo "$f has $(wc -l < "$f") lines"\n  fi\ndone',
      output: 'annotation.tsv has 13 lines\ncounts.tsv has 13 lines\nsamples.tsv has 7 lines',
      cwd: '~/project/data',
      note: '`*.tsv` gave three names and the body ran once for each, with `f` holding the current name. `-s` was true every time; an empty file would have been skipped.'
    },
    try: { kind: 'mission', mission: 'f1-script-logic' },
    mistake: { wrong: 'Comparing numbers with `>`, as in `if [ $n > 5 ]`.', fix: 'Inside `[ ]`, `>` is a redirection: Bash creates a file named 5, and the test only checks that `$n` is not empty. Compare numbers with `-gt`: `if [ "$n" -gt 5 ]`.' },
    check: {
      q: 'A script is run as `bash report.sh counts.tsv samples.tsv`. Inside it, what is `$#`?',
      options: [
        { t: '2', why: '`$#` is the number of arguments given to the script: counts.tsv and samples.tsv. The name of the script itself is not counted.' },
        { t: '3', why: 'The script name is not an argument. It is available as `$0`, but `$#` counts only the words that follow it.' },
        { t: 'counts.tsv', why: 'That is `$1`, the first argument. `$#` holds how many arguments there are, not their values.' },
        { t: 'counts.tsv samples.tsv', why: 'That is `$@`, the list of all the arguments. `$#` turns that list into a number.' }
      ],
      answer: 0
    },
    deeper: ['f1-script-logic']
  },
  {
    id: 'ibm-cron',
    course: 'ibm',
    module: 'ibm-m3',
    title: 'Scheduling jobs with cron',
    lectures: ['Scheduling Jobs using Cron', 'Hands-on Lab: Scheduling Jobs using Crontab'],
    minutes: 3,
    keywords: ['cron', 'crontab', 'schedule', 'crontab -e', 'crontab -l', 'cron job', 'automate', 'every day', 'scheduled task', 'absolute path'],
    explain: '**cron** is a background service that runs commands on a schedule, even when nobody is logged in. Each user keeps a **crontab** (cron table): `crontab -e` edits it and `crontab -l` lists it. Each line holds five time fields and then the command: minute (0 to 59), hour (0 to 23), day of the month (1 to 31), month (1 to 12) and day of the week (0 to 6, where 0 is Sunday; 7 also means Sunday). `*` means every value, so `30 2 * * 1` runs at 02:30 every Monday, and `*/15` in the minute field means every 15 minutes.',
    why: 'Some tasks must happen regularly, such as refreshing a local copy of a database every night or checking free disk space every hour. cron runs them on time without anyone remembering, and a log file shows later what happened.',
    visual: { diagram: 'cron-fields' },
    example: {
      lang: 'text',
      code: 'crontab -l\n# min hour day-of-month month day-of-week  command\n30 2 * * 1    /home/student/project/scripts/line_report.sh /home/student/project/data >> /home/student/project/results/weekly.log\n*/15 * * * *  df -h >> /home/student/project/results/disk.log',
      note: 'The first job runs line_report.sh at 02:30 every Monday; the second records disk space every 15 minutes. `>>` appends each run to a log, and every path is absolute.'
    },
    try: { kind: 'widget', widget: 'cron', props: {} },
    mistake: { wrong: 'Writing relative paths in a cron job, such as `scripts/line_report.sh data`.', fix: 'cron starts jobs in your home folder with very few settings, not in your project folder, so relative paths point to the wrong place. Use absolute paths such as `/home/student/project/scripts/line_report.sh`.' },
    check: {
      q: 'Which schedule runs a job at 23:45 every Friday?',
      options: [
        { t: '`45 23 * * 5`', why: 'Minute 45, hour 23, any day of the month, any month, and day of the week 5, which is Friday when Sunday counts as 0.' },
        { t: '`23 45 * * 5`', why: 'The minute comes first and the hour second. Hour 45 does not exist, so crontab rejects this line.' },
        { t: '`45 23 5 * *`', why: 'The 5 sits in the third field, the day of the month, so this runs on the 5th of every month instead of on Fridays.' },
        { t: '`45 11 * * 5`', why: 'cron uses a 24-hour clock, so hour 11 means 11:45 in the morning. 11:45 at night is hour 23.' }
      ],
      answer: 0
    },
    deeper: ['f1-cron']
  },
  {
    id: 'ibm-final',
    course: 'ibm',
    module: 'ibm-m4',
    title: 'Before the final project and exam: what to revise',
    lectures: ['Practice Project Overview', 'Final Project Overview', 'Final Exam'],
    minutes: 3,
    keywords: ['final project', 'final exam', 'practice project', 'revision', 'review', 'what to study', 'shell script', 'test a script'],
    explain: 'The final project and exam come after the three teaching modules, so revise by skill rather than by video. Module 1: the file system tree, paths and a terminal editor. Module 2: moving, managing and viewing files, permissions with `chmod`, text tools such as `grep`, `cut` and `sort`, downloads with `curl` or `wget`, and archives with `tar`. Module 3: scripts with a shebang, variables and `$(...)`, pipes and redirection, `if` tests, `for` loops, arguments such as `$1`, and cron schedules. For the project, read the official project description first: it says exactly what to build and what to submit.',
    why: 'A project asks you to combine commands, not only to recall them. Knowing which skill each step needs, and where you met it, turns a large task into small, familiar ones that you can test one at a time.',
    visual: { diagram: 'ibm-review-map' },
    example: {
      lang: 'bash',
      code: 'grep -c "^>" sequences.fa\nbash ../scripts/count_seqs.sh sequences.fa',
      output: '6\nsequences.fa contains 6 sequences',
      cwd: '~/project/data',
      note: 'Test a script against an answer you already know: grep counted 6 header lines, so the 6 from the script is right. Check every piece of your own work the same way.'
    },
    mistake: { wrong: 'Writing the whole script in one go and running it for the first time at the end.', fix: 'When a long script fails, the error could be anywhere. Add one step at a time, run it, and check its output before you add the next.' },
    check: {
      q: 'Which line saves the number of FASTA headers in sequences.fa into a variable called n?',
      options: [
        { t: '`n=$(grep -c ">" sequences.fa)`', why: '`$( )` runs grep and stores what it prints, 6, in n. The quotes make `>` the search pattern instead of a redirection.' },
        { t: '`n = $(grep -c ">" sequences.fa)`', why: 'Spaces around `=` make Bash run a command called n, which fails with command not found. Assignments take no spaces.' },
        { t: '`n=grep -c ">" sequences.fa`', why: 'Without `$( )`, grep never runs for the variable: Bash sets n to the word grep for a command called `-c`, which fails.' },
        { t: '`n=$(grep -c > sequences.fa)`', why: 'Unquoted, `>` is a redirection: the shell empties sequences.fa before grep runs, and grep, left without a pattern, stops with an error.' }
      ],
      answer: 0
    },
    deeper: ['f1-scripts', 'f1-script-logic', 'f1-cron']
  }
);
