/* Foundation 1: Linux and the command line. Written to tools/CONTENT_GUIDE.md.
   Aligned with IBM "Hands-on Introduction to Linux Commands and Shell Scripting" (modules 1 to 3) using original examples.
   Every bash example with an output was run on the practice file system with tools/run_in_vfs.py. */
window.BB = window.BB || {};
BB.lessons = BB.lessons || [];

BB.lessons.push({
  id: "f1-linux",
  what: "Linux is an operating system: the core software that manages a computer's hardware and lets other programs run. It is free and open source, it belongs to the Unix family of systems, and it runs most of the servers and supercomputers where biological data is stored and analyzed.",
  problem: "Unix, created at Bell Labs from 1969, introduced a simple design: small programs, each doing one job well, that can be combined. But commercial Unix systems were expensive and closed. In 1991 Linus Torvalds, then a student in Finland, began writing the Linux kernel and shared it openly; combined with free tools from the GNU project, it gave everyone a complete Unix-like system to use, study and change.",
  care: "The machines that hold sequencing data, from university computing clusters to cloud servers, almost all run Linux, and most bioinformatics tools are written for it. Learning Linux lets you work where the data already is, instead of trying to copy hundreds of gigabytes to a laptop.",
  steps: [
    "Hardware is the physical machine: processor, memory, disks and network card.",
    "The kernel is the core of Linux and the only software that controls the hardware directly. It decides which program uses the processor, hands out memory, reads and writes files on disks, and talks to devices.",
    "Programs, from small tools such as `ls` and `grep` to large ones such as Python and R, never touch the hardware themselves. They ask the kernel for what they need, such as \"open this file\" or \"give me more memory\".",
    "The shell is the program you talk to. It reads the commands you type, starts the matching programs, and shows you their results.",
    "A Linux distribution (a distro) packages the Linux kernel with tools, a package manager for installing software, and default settings. Ubuntu, Debian, Fedora, Red Hat Enterprise Linux and Rocky Linux are common examples, and the everyday commands in this foundation work the same way on all of them."
  ],
  deeper: "Strictly, \"Linux\" names only the kernel; the complete system also contains many GNU tools, which is why some people write GNU/Linux. macOS is also built on Unix, so a Mac terminal accepts most of the same commands, and Windows can run Linux through the Windows Subsystem for Linux (WSL). Linux is multi-user: many people can be logged in to one server at once, each running many programs, and the kernel keeps them apart.",
  show: {
    intro: "What happens, layer by layer, when you type one command on a Linux server.",
    lang: "text",
    code: "you        type  grep HSPA1A counts.tsv  and press Enter\nshell      reads the line, finds the program grep, asks the kernel to start it\ngrep       asks the kernel to open counts.tsv and hand over its contents\nkernel     gives grep processor time and memory, reads the file from the disk\nhardware   processor, memory, disk",
    notes: [
      "You only ever talk to the shell. The shell and grep are both ordinary programs that depend on the kernel.",
      "Only the kernel touches the hardware. That is why programs do not need to know the details of each disk or processor model: the kernel handles them.",
      "The result, the matching line, travels back up the layers and appears in your terminal."
    ]
  },
  pitfall: {
    wrong: "Ubuntu, Fedora and Red Hat are completely different systems, so I need to learn different commands for each.",
    right: "They are Linux distributions built on the same kernel with the same core tools, so `ls`, `cd`, `grep` and Bash scripts work the same way on all of them. The main differences are the package manager (for example `apt` on Ubuntu and `dnf` on Fedora) and default settings."
  },
  try: {
    kind: "predict",
    q: "You type `grep HSPA1A counts.tsv` on a Linux server. Which part of the system actually reads counts.tsv from the disk?",
    options: [
      { t: "The kernel, when grep asks it to open and read the file", why: "Right. Programs request files through the kernel, and only the kernel controls the disk. grep receives the contents and searches them." },
      { t: "The shell, because that is where you typed the command", why: "The shell reads your command line and starts grep. It never opens counts.tsv; grep asks the kernel for the file." },
      { t: "The terminal window", why: "The terminal only displays text and passes your keystrokes to the shell. It never reads your data files." }
    ],
    answer: 0
  },
  check: [
    {
      q: "What is a Linux distribution?",
      options: [
        { t: "The Linux kernel bundled with tools, a package manager and default settings", why: "Correct. Ubuntu, Fedora and Rocky Linux all use the Linux kernel; they differ mainly in packaging, defaults and the package manager." },
        { t: "A version of Linux whose commands do not work on other versions", why: "Core commands such as `ls`, `grep` and `cd` behave the same across distributions. What differs is mostly how software is installed and configured." },
        { t: "A program that sends files from one server to another", why: "The everyday meaning of distributing things is misleading here. In Linux, a distribution is a packaged version of the whole operating system." }
      ],
      answer: 0
    },
    {
      q: "Which statement correctly describes the kernel and the shell?",
      options: [
        { t: "The shell controls the hardware; the kernel is the window you type into", why: "This swaps the roles. The window is the terminal, the shell runs inside it, and the kernel sits below everything, controlling the hardware." },
        { t: "The kernel controls the hardware; the shell reads your commands and asks the kernel to run programs", why: "Correct. You talk to the shell, the shell starts programs, and every program gets files, memory and processor time through the kernel." },
        { t: "They are two names for the same program", why: "They are separate programs. You can switch between shells such as Bash and zsh without changing the kernel, and the kernel keeps running when no shell is open." }
      ],
      answer: 1
    },
    {
      q: "Why do most bioinformaticians work on Linux?",
      options: [
        { t: "Only Linux can open FASTA and FASTQ files", why: "FASTA and FASTQ are plain text, so any operating system can open them. The reason is where the data and tools live, not the file format." },
        { t: "Linux has no graphical interface, which makes it faster", why: "Linux can run a full graphical desktop. Servers usually run without one, but that is a choice, not the reason Linux is used." },
        { t: "The servers and clusters that hold sequencing data run Linux, and most analysis tools are written for it", why: "Correct. Working on Linux means working where the data, the computing power and the tools already are." }
      ],
      answer: 2
    }
  ],
  real: "Sequencing facilities usually deliver data to Linux servers, and university clusters and cloud platforms provide Linux machines for analysis. Common RNA-seq tools, such as read aligners and read counters, are run from the Linux command line, often as jobs that run for hours on servers with many processors.",
  teach: {
    prompt: "Explain to a friend what Linux is, what the kernel and the shell each do, and why bioinformaticians use Linux.",
    points: ["Linux is a free, Unix-like operating system", "The kernel controls the hardware; programs ask it for files, memory and processor time", "The shell reads your commands and starts programs", "Distributions package the same kernel and core commands", "Sequencing data and tools live on Linux servers"]
  }
});

BB.lessons.push({
  id: "f1-terminal",
  what: "The terminal is a window where you type text commands. Inside it runs the shell, a program that reads each command, runs it and shows the result. Every command has a name, often options that change its behavior, and arguments that say what to work on.",
  problem: "Clicking through windows is slow to repeat and impossible to record exactly, and most remote servers have no graphical desktop at all. A typed command can be sent over a network, repeated exactly, combined with other commands and saved in a script.",
  care: "Every lesson from here on is made of commands. If you can split a command into name, options and arguments, and know how to look up the rest, you can read commands you have never seen before.",
  steps: [
    "The prompt, for example `student@biobridge:~$`, shows your user name, the computer's name and your current folder (`~` means your home folder). The `$` means the shell is waiting for you.",
    "You type a command and press Enter. The shell splits the line at spaces: the first word is the command name, and the other words are options and arguments.",
    "Options usually start with `-` (short, such as `-l`) or `--` (long, such as `--help`). Some take a value, as in `head -n 3`, and short options can often be combined, so `ls -l -a` is the same as `ls -la`.",
    "Arguments say what to act on, usually file or folder names. Linux is case-sensitive: `Counts.tsv` and `counts.tsv` are different names.",
    "Informational commands describe the system: `whoami` (your user name), `id` (your user and group numbers), `hostname` (the computer's name), `date`, `uname` (the operating system and kernel), `ps` and `top` (running programs), `df -h` (disk space) and `echo` (prints text).",
    "For help, run `man wc` to read the manual page (press `q` to quit) or `wc --help` for a short summary. Press Tab to complete names, and the Up arrow to recall earlier commands; `history` lists them."
  ],
  deeper: "Bash is the default shell on most Linux systems (recent macOS uses a similar shell, zsh). When you type a command name, the shell searches the folders listed in the `PATH` environment variable for a program with that name; `which grep` shows which one it found. A few commands, such as `cd` and `echo`, are built into the shell itself, and `help cd` documents them.",
  show: {
    intro: "The same command name with different options and arguments gives different results. `wc` (word count) counts what is inside files.",
    lang: "bash",
    code: "wc counts.tsv\nwc -l counts.tsv\nwc -l counts.tsv samples.tsv",
    output: " 13  91 471 counts.tsv\n13 counts.tsv\n 13 counts.tsv\n  7 samples.tsv\n 20 total",
    notes: [
      "With no options, `wc` prints three counts: lines (13), words (91) and bytes (471), then the file name.",
      "The option `-l` asks for lines only. The file name is the argument: it tells `wc` what to count.",
      "With two arguments, `wc` counts each file and adds a total line. The numbers are padded with spaces so the columns line up."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "An option such as `-n` means the same thing in every command.",
    right: "Each program defines its own options. `head -n 3` means \"show 3 lines\", but `grep -n` means \"show line numbers\"; `ls -l` means \"long listing\", but `wc -l` means \"count lines\". When in doubt, check `man` or `--help` for that command."
  },
  try: { kind: "terminal", mission: "f1-terminal" },
  check: [
    {
      q: "In the command `head -n 3 counts.tsv`, what is `counts.tsv`?",
      options: [
        { t: "An option that changes how `head` behaves", why: "Options normally begin with `-`. Here `-n 3` is the option, with its value 3; `counts.tsv` is what the command acts on." },
        { t: "An argument: the file that `head` should read", why: "Correct. The command name comes first, then the option `-n 3`, then the argument naming the file." },
        { t: "The name of the command", why: "The command name is always the first word, `head`. The shell runs the program with that name." }
      ],
      answer: 1
    },
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "wc -l samples.tsv" },
      options: [
        { t: "7 samples.tsv", why: "Correct. `-l` counts lines, and `wc` prints the file name after the count. The 7 lines are a header plus six samples." },
        { t: "6 samples.tsv", why: "`wc -l` counts every line, including the header. Six is the number of samples, which you get only after subtracting the header yourself." },
        { t: "7", why: "When it is given a file name as an argument, `wc` also prints that name. It prints a bare number only when it is given no file name, for example when it reads the output of another command." }
      ],
      answer: 0,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "You are about to download 200 GB of sequencing data to a shared server. Which command checks whether there is enough free space?",
      options: [
        { t: "`df -h`", why: "Correct. `df` reports the size, used and available space of each storage area, and `-h` shows them in human-readable units such as G for gigabytes." },
        { t: "`ps`", why: "`ps` lists running processes (programs). It says nothing about disk space." },
        { t: "`uname -a`", why: "`uname` describes the operating system and kernel, not storage." }
      ],
      answer: 0
    }
  ],
  real: "On a shared server, people run `hostname` and `whoami` to confirm they are on the right machine as the right user, `df -h` before large downloads, and `ps` or `top` to see whether a long alignment job is still running. Bioinformatics tools follow the same pattern of name, options and arguments, and most print their options when run with `--help`.",
  teach: {
    prompt: "Explain the difference between the terminal and the shell, then take apart `head -n 3 counts.tsv` into name, option and argument.",
    points: ["The terminal is the window; the shell interprets commands", "The first word is the command name", "Options start with - and change behavior; some take a value", "Arguments are what the command acts on", "man and --help explain any command's options"]
  }
});

BB.lessons.push({
  id: "f1-paths",
  what: "Linux keeps every file in one tree of folders that starts at the root directory, written `/`. A path is a file's address in that tree. An absolute path starts at `/`; a relative path starts from your working directory, the folder you are in right now.",
  problem: "A server holds hundreds of thousands of files, and the same name, such as `counts.tsv`, can exist in many folders. A path tells the computer exactly which one you mean.",
  care: "\"No such file or directory\" is the error beginners see most often, and it is almost always a path problem. Once you can read paths, you can fix it in seconds.",
  steps: [
    "The tree starts at the root directory, `/`. Every file has one absolute path that lists each folder from the root down, separated by `/`, for example `/home/student/project/data/counts.tsv`.",
    "Your home directory is your personal folder, here `/home/student`. The shell replaces `~` with its path, so `~/project` means `/home/student/project`.",
    "The shell always has a working directory. A relative path such as `data/counts.tsv` is read starting from there, so it only works from the right place.",
    "Two special names help with relative paths: `.` means the current directory and `..` means its parent directory, one level up. From `/home/student/project/data`, the path `../scripts` means `/home/student/project/scripts`.",
    "Rule of thumb: a path that begins with `/` (or `~`) points to the same place from anywhere. Any other path depends on where you are."
  ],
  deeper: "Standard top-level folders include `/home` (users' home directories), `/bin` and `/usr/bin` (programs), `/etc` (system settings) and `/tmp` (temporary files). Linux has no drive letters such as `C:`; extra disks are attached somewhere inside the single tree. Names are case-sensitive, and spaces in names must be quoted, which is why bioinformaticians name files like `heat_1_R1.fastq.gz` rather than `heat 1 R1.fastq.gz`.",
  show: {
    intro: "From `~/project/data`, three paths reach files in other folders.",
    lang: "bash",
    code: "ls ../scripts\nhead -n 1 ../README.txt\nhead -n 1 ~/project/README.txt",
    output: "count_seqs.sh  line_report.sh\nHeat-shock RNA-seq practice project\nHeat-shock RNA-seq practice project",
    notes: [
      "`../scripts` is relative: go up one level from data to project, then down into scripts.",
      "`../README.txt` and `~/project/README.txt` name the same file, so both commands print its first line. The first works only from a folder directly inside project; the second works from anywhere.",
      "`head -n 1` prints just the first line, a quick way to confirm you found the right file."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "`data/counts.tsv` should work from any folder, because the file exists.",
    right: "A relative path is read from the working directory. From `~/project` it works; from `~/project/scripts` the shell looks for `scripts/data/counts.tsv`, which does not exist. From there use `../data/counts.tsv`, or `~/project/data/counts.tsv`, which works from anywhere."
  },
  try: { kind: "widget", widget: "filetree" },
  check: [
    {
      q: "You are in `/home/student/project/scripts`. Which path points to counts.tsv?",
      options: [
        { t: "`data/counts.tsv`", why: "This is relative to the current folder, so it means `/home/student/project/scripts/data/counts.tsv`, which does not exist." },
        { t: "`/data/counts.tsv`", why: "A leading `/` makes the path start at the root directory, so this looks for a folder called data directly under `/`." },
        { t: "`../data/counts.tsv`", why: "Correct. `..` goes up from scripts to project, then `data/counts.tsv` goes down to the file." }
      ],
      answer: 2
    },
    {
      q: "Which of these is an absolute path?",
      options: [
        { t: "`/home/student/project/results`", why: "Correct. It starts with `/`, so it describes the location from the root and works from anywhere." },
        { t: "`project/results`", why: "There is no leading `/`, so this is read from the working directory. It works only from `/home/student`." },
        { t: "`../results`", why: "Paths that start with `..` are relative: they begin at the parent of the current directory." }
      ],
      answer: 0
    },
    {
      q: "You are in `/home/student/project/data`. Where does `../..` point?",
      options: [
        { t: "`/home/student/project`", why: "That is one `..`. The second `..` goes up one more level." },
        { t: "`/home/student`", why: "Correct. Each `..` climbs one level: data to project, then project to student." },
        { t: "`/`", why: "The root is several levels higher. `../..` climbs exactly two levels." }
      ],
      answer: 1
    }
  ],
  real: "Analysis pipelines read lists of input files, such as one FASTQ path per sample, and a single wrong path stops the whole run. A common convention is to use absolute paths for shared resources, such as a reference genome stored once on a server, and relative paths inside a project folder, so the whole project can be moved or shared without editing every script.",
  teach: {
    prompt: "Explain the difference between absolute and relative paths using the practice project, and what `~`, `.` and `..` mean.",
    points: ["All files hang from the root directory /", "An absolute path starts at / and works from anywhere", "A relative path starts from the working directory", "~ is the home directory, . is here, .. is one level up"]
  }
});

BB.lessons.push({
  id: "f1-navigate",
  what: "Three commands let you find your way around: `pwd` prints your working directory, `ls` lists what is in a folder, and `cd` changes your working directory.",
  problem: "A terminal has no window showing where you are or what files exist. You need commands that answer three questions: Where am I? What is here? How do I get there?",
  care: "Before any analysis command you need to be in the right folder, or to use the right path. These are the commands you will type most often, many times a day.",
  steps: [
    "`pwd` (print working directory) prints the absolute path of the folder you are in.",
    "`ls` lists the current folder, and `ls data` lists another folder without going there. `ls -l` gives a long listing with permissions, size and date, `-h` shows sizes in K, M and G, and `-a` also shows hidden files, whose names start with a dot.",
    "`cd data` moves into a folder using a relative path, `cd ..` moves up one level, and `cd` on its own (or `cd ~`) returns to your home directory. Absolute paths work too: `cd ~/project/results`.",
    "Use tab completion: type the first letters of a name and press Tab. The shell completes the name if only one matches, which also prevents typing mistakes.",
    "If `cd` reports \"No such file or directory\", run `pwd` and `ls` to see where you are and what is actually there, then check the spelling and capital letters."
  ],
  deeper: "The columns of `ls -l`, from left to right, are: permissions, number of links, owner, group, size in bytes, date of last change, and name. `ls -R` lists a folder and every folder below it. Hidden files are not secret, only unlisted by default; settings files such as `.bashrc` start with a dot so they do not clutter normal listings. An empty folder makes `ls` print nothing at all, which is a successful answer, not an error.",
  show: {
    intro: "A short walk through the practice server, starting in the home directory.",
    lang: "bash",
    code: "pwd\nls\ncd project/data\npwd\nls\ncd ..\npwd",
    output: "/home/student\nnotes.txt  project\n/home/student/project/data\nannotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa\n/home/student/project",
    notes: [
      "`pwd` always prints an absolute path, so it is the quickest answer to \"where am I?\"",
      "`cd project/data` moves two levels down in one step; `cd ..` moves one level up.",
      "`ls` lists names only, so folders and files look alike. `ls -l` shows the difference: lines for folders start with `d`."
    ],
    cwd: "~",
    noVerify: true
  },
  pitfall: {
    wrong: "`ls` printed nothing, so the command failed.",
    right: "An empty folder, such as results at the start, lists nothing, and that is a successful answer. A real failure prints an error, such as `ls: cannot access 'result': No such file or directory`. Remember also that plain `ls` hides names starting with a dot; `ls -a` shows them."
  },
  try: { kind: "terminal", mission: "f1-navigate" },
  check: [
    {
      q: "You are in `~/project/data`. What does this print?",
      code: { lang: "bash", src: "cd ../scripts\nls" },
      options: [
        { t: "annotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa", why: "Those are the files in data, where you started. After `cd ../scripts`, `ls` lists the scripts folder." },
        { t: "count_seqs.sh  line_report.sh", why: "Correct. `..` goes up to project and `scripts` goes down again, so `ls` lists the two scripts." },
        { t: "README.txt  data  results  scripts", why: "That is the content of project, which you would see after `cd ..` alone. `../scripts` goes up and then into scripts." }
      ],
      answer: 1,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "`ls ~` shows `notes.txt  project`, but `ls -a ~` also shows `.bashrc`. Why?",
      options: [
        { t: "Names starting with a dot are hidden files, which `ls` lists only with `-a`", why: "Correct. The file was always there; `-a` (all) asks `ls` to include hidden names too." },
        { t: "`.bashrc` was created by running `ls -a`", why: "`ls` only reads the contents of folders. It never creates files." },
        { t: "`-a` shows files from all users' home directories", why: "`-a` means all entries of this one folder, including hidden ones. It does not look into other users' folders." }
      ],
      answer: 0
    },
    {
      q: "You type `cd Data` and get \"No such file or directory\", but `ls` shows a folder called `data`. What is wrong?",
      options: [
        { t: "`cd` only works with absolute paths", why: "`cd data`, a relative path, works fine. The problem is the capital D." },
        { t: "You need to run `pwd` before `cd`", why: "`pwd` only reports your location. It is never required before `cd`." },
        { t: "Linux names are case-sensitive, so `Data` and `data` are different names", why: "Correct. Typing the first letters and pressing Tab avoids this kind of mistake." }
      ],
      answer: 2
    }
  ],
  real: "When you log in to a server you usually land in your home directory, then `cd` into a project folder. Running `ls -lh` on a folder of FASTQ files is a quick check that every sample is present and that no file has a suspicious size, such as 0 bytes after a failed download.",
  teach: {
    prompt: "Explain what `pwd`, `ls` and `cd` do, and how you would get from `~/project/data` to `~/project/results` and back.",
    points: ["pwd prints where you are as an absolute path", "ls lists a folder; -l, -a and -h change the listing", "cd changes folder; cd .. goes up, cd alone goes home", "cd ../results then cd ../data moves between sibling folders"]
  }
});

BB.lessons.push({
  id: "f1-manage",
  what: "`mkdir` creates folders, `touch` creates empty files, `cp` copies, `mv` moves or renames, `rm` deletes files and `rmdir` deletes empty folders. `find` searches a whole folder tree for files by name or type.",
  problem: "An analysis produces many files: raw data, intermediate files, results and figures. You need to organize them, keep copies before changing anything, and find files whose location you forgot, all without a graphical file manager.",
  care: "A tidy project with separate data, scripts and results folders protects raw data and makes your work easy to repeat. And because `rm` has no recycle bin, knowing exactly what it does protects your data.",
  steps: [
    "`mkdir results/tables` creates a folder. `mkdir -p results/tables/top` creates every missing folder along the path, and does not complain if they already exist.",
    "`touch notes.txt` creates an empty file, or updates the date of an existing one.",
    "`cp counts.tsv counts_backup.tsv` copies a file, and `cp -r data data_copy` copies a folder with everything inside it. `mv old.tsv new.tsv` renames, and `mv file.tsv ../results/` moves. Both `cp` and `mv` silently replace a file that already has the target name.",
    "`rm file` deletes a file permanently: there is no recycle bin. `rm -r folder` deletes a folder and everything in it, while `rmdir folder` deletes only an empty folder, which makes it the safer choice.",
    "`find . -name \"*.fastq\"` searches the current folder and every folder below it for names ending in `.fastq`; `find . -type d` lists only folders.",
    "Wildcards let one pattern match many names: `*` matches any run of characters (even none) and `?` exactly one, so `*.tsv` matches every name ending in `.tsv`. Hidden names, which start with a dot, are left out unless the pattern starts with a dot too. Run `ls` with a pattern before using it with `rm`, so you see exactly what would be deleted."
  ],
  deeper: "The shell expands wildcards before the command runs: `cp *.tsv ../results/` becomes `cp annotation.tsv counts.tsv samples.tsv ../results/`, and `cp` never sees the `*`. That is why the pattern given to `find -name` is quoted: `find` must receive `*.fastq` itself and apply it in every folder, rather than have the shell expand it in the current folder only. `[12]` matches one of the listed characters, so `heat_[12].fastq` matches `heat_1.fastq` and `heat_2.fastq`.",
  show: {
    intro: "Set up an output folder, copy a table into it, rename the copy and find the FASTA file, all from `~/project`.",
    lang: "bash",
    code: "mkdir -p results/tables\ncp data/counts.tsv results/tables/\nmv results/tables/counts.tsv results/tables/counts_copy.tsv\nls results/tables\nfind . -name \"*.fa\"",
    output: "counts_copy.tsv\n./data/sequences.fa",
    notes: [
      "`mkdir`, `cp` and `mv` print nothing when they succeed. Silence means success; `ls` confirms the result.",
      "Copying into a folder (`results/tables/`) keeps the original name. `mv` to a new name in the same folder is how you rename.",
      "`find .` starts in the current folder, searches every folder below it, and prints each match as a path from the starting point."
    ],
    cwd: "~/project"
  },
  pitfall: {
    wrong: "Linux will warn me before it deletes or overwrites a file, like a desktop does.",
    right: "`rm`, `cp` and `mv` act immediately and silently. A deleted file does not go to a recycle bin, and copying onto an existing name replaces it. Keep raw data in its own folder, copy before you edit, and check patterns with `ls` before `rm`."
  },
  try: { kind: "terminal", mission: "f1-manage" },
  check: [
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "cp counts.tsv backup.tsv\nls" },
      options: [
        { t: "annotation.tsv  backup.tsv  reads.fastq  samples.tsv  sequences.fa", why: "This is what `mv counts.tsv backup.tsv` would leave: a rename removes the old name. `cp` keeps the original." },
        { t: "annotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa", why: "`cp` succeeded silently, so the listing now includes the new file, backup.tsv." },
        { t: "annotation.tsv  backup.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa", why: "Correct. `cp` makes a second file and the original stays, so both names are listed." }
      ],
      answer: 2,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "You want to delete the folder `old_run`, which should be empty. Which command is safest?",
      options: [
        { t: "`rmdir old_run`", why: "Correct. `rmdir` refuses to delete a folder that still contains files, so a wrong guess cannot wipe out data." },
        { t: "`rm -r old_run`", why: "This deletes the folder and everything inside it without asking. If you were wrong about it being empty, the files are gone." },
        { t: "`rm old_run`", why: "Without `-r`, `rm` refuses to delete a folder and prints `Is a directory`. It is not a way to remove folders." }
      ],
      answer: 0
    },
    {
      q: "Which command lists every file ending in `.fastq.gz` anywhere inside the folder `runs`, including its subfolders?",
      options: [
        { t: "`ls runs/*.fastq.gz`", why: "The pattern is expanded only inside `runs` itself, so files in its subfolders are missed." },
        { t: "`find runs -name \"*.fastq.gz\"`", why: "Correct. `find` walks through `runs` and every folder below it, and the quoted pattern is applied in each one." },
        { t: "`find *.fastq.gz`", why: "Without a starting folder and `-name`, `find` treats the words as places to start from. It does not search for matching names." }
      ],
      answer: 1
    }
  ],
  real: "Sequencing runs often deliver hundreds of files spread over many folders, and `find` with `-name \"*.fastq.gz\"` lists them all. Keeping raw reads untouched in their own folder and writing every output into a results folder means you can delete and regenerate results at any time without risking the original data.",
  teach: {
    prompt: "Explain how you would set up a results folder, make a backup copy, rename a file and find all FASTA files in a project, and why `rm` needs care.",
    points: ["mkdir -p creates nested folders", "cp copies and keeps the original; mv moves or renames", "rm deletes permanently; rmdir only removes empty folders", "find searches all subfolders by name or type", "Wildcards are expanded by the shell; check them with ls first"]
  }
});

BB.lessons.push({
  id: "f1-view",
  what: "These commands show what is inside text files without opening an editor: `cat` prints a whole file, `less` and `more` let you scroll through it, `head` and `tail` show the first or last lines, and `wc` counts lines, words and bytes.",
  problem: "Biological files can have millions of lines. Opening them in an editor is slow or impossible, and usually you only need a quick look: what are the columns, is there a header, does the file end properly, how many records are there?",
  care: "Looking at the first lines of a file before analyzing it catches most format problems early: the wrong separator, a missing header, or a file that is not what its name says.",
  steps: [
    "`cat counts.tsv` prints the whole file. That is fine for small files but floods the screen for large ones. `cat -n` adds line numbers.",
    "`less counts.tsv` opens a scrollable view: the arrow keys and Space move, `/HSPA1A` searches, and `q` quits. `more` is an older, simpler pager.",
    "`head counts.tsv` shows the first 10 lines and `head -n 3` the first 3. `tail` shows the last 10 lines and `tail -n 2` the last 2. `tail -n +2` starts at line 2, which skips a header line.",
    "`wc counts.tsv` prints the number of lines, words and bytes; `wc -l` prints lines only.",
    "To count records, know the format. In counts.tsv each gene is one line after the header. In FASTQ each read takes exactly four lines, so reads = lines / 4. In FASTA a long sequence wraps over several lines, so lines are not records."
  ],
  deeper: "Byte counts from `wc -c` include the invisible newline character at the end of each line, so a 27-letter sequence on its own line counts as 28 bytes. Compressed files such as `reads.fastq.gz` are not plain text: `cat` prints unreadable symbols, so use `zcat reads.fastq.gz | head` instead, as the archives lesson explains. `less` does not need to read a whole file before showing the first screen, so it opens even very large files quickly.",
  show: {
    intro: "Three quick looks at the practice files from `~/project/data`.",
    lang: "bash",
    code: "head -n 3 counts.tsv\ntail -n 2 counts.tsv\nwc -l reads.fastq",
    output: "gene\tctrl_1\tctrl_2\tctrl_3\theat_1\theat_2\theat_3\nHSPA1A\t212\t282\t203\t11018\t8441\t10838\nHSPA1B\t172\t202\t155\t10345\t7330\t7541\nTP53\t613\t868\t714\t881\t603\t605\nFOS\t220\t223\t277\t311\t1906\t260\n32 reads.fastq",
    notes: [
      "The first line is a header naming the columns; the data starts on line 2. Columns are separated by tab characters.",
      "`tail -n 2` shows the last two genes, which confirms that the file ends with complete rows.",
      "32 lines in a FASTQ file means 8 reads, because every read uses exactly four lines."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "`wc -l sequences.fa` tells me how many sequences the FASTA file contains.",
    right: "It prints 15, but the file holds 6 sequences: long sequences are wrapped over several lines. Count the header lines, the ones starting with `>`, instead. That is a job for `grep`, in the next lesson."
  },
  try: { kind: "terminal", mission: "f1-view" },
  check: [
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "head -n 2 samples.tsv" },
      options: [
        { t: "ctrl_1\tcontrol\t1\t37\nctrl_2\tcontrol\t2\t37", why: "`head` does not skip the header. These are lines 2 and 3 of the file." },
        { t: "sample\tcondition\treplicate\ttemperature_C\nctrl_1\tcontrol\t1\t37", why: "Correct. `head -n 2` prints the first two lines, and the first one is the header." },
        { t: "heat_2\theat_shock\t2\t42\nheat_3\theat_shock\t3\t42", why: "These are the last two lines, which `tail -n 2` would print." }
      ],
      answer: 1,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "`wc -l annotation.tsv` prints `13 annotation.tsv`. How many genes does the file describe?",
      options: [
        { t: "12", why: "Correct. One of the 13 lines is the header with the column names." },
        { t: "13", why: "`wc -l` counts every line, including the header, which describes the columns rather than a gene." },
        { t: "52", why: "Four lines per record applies to FASTQ files. In this table each gene is a single line." }
      ],
      answer: 0
    },
    {
      q: "A FASTQ file has 4,000,000 lines. How many reads does it contain?",
      options: [
        { t: "4,000,000", why: "Each read takes four lines: a header, the sequence, a `+` separator and the quality string." },
        { t: "2,000,000", why: "FASTQ uses four lines per read, not two." },
        { t: "1,000,000", why: "Correct. 4,000,000 lines divided by 4 lines per read gives 1,000,000 reads." }
      ],
      answer: 2
    }
  ],
  real: "Before running an aligner on a new FASTQ file, people look at the first two records with `head -n 8` and count reads with `wc -l`. After a download, `tail` shows whether the last record is complete, and a line count that is not a multiple of 4 is a red flag for a truncated file.",
  teach: {
    prompt: "Explain how you would check a new count table and a new FASTQ file with cat, head, tail and wc, and why `wc -l` does not count FASTA sequences.",
    points: ["head and tail show the start and end of a file", "tail -n +2 skips a header line", "wc -l counts lines; FASTQ reads = lines / 4", "FASTA sequences wrap, so lines are not records", "less scrolls through large files and q quits"]
  }
});

BB.lessons.push({
  id: "f1-grep",
  what: "`grep` prints the lines of a file that contain a pattern. Options change what counts as a match (`-i`, `-w`, `-v`) and what is printed (`-c`, `-n`, `-o`).",
  problem: "Finding one gene in a table with 60,000 rows, or counting the headers in a FASTA file with millions of lines, is impossible by scrolling. grep searches millions of lines in seconds.",
  care: "grep answers many everyday questions in one line: Is my gene in this table? How many sequences are in this file? Which samples were heat-shocked? Did my pipeline log report an error?",
  steps: [
    "`grep PATTERN FILE` reads the file line by line and prints every line that contains the pattern anywhere. Matching is case-sensitive.",
    "Matching options: `-i` ignores case, `-w` matches whole words only, and `-v` inverts the search to print lines that do not match.",
    "Output options: `-c` prints how many lines match, `-n` adds line numbers, and `-o` prints only the matching part of each line.",
    "Put the pattern in quotes when it contains spaces or characters the shell treats specially, such as `>`, `|` or `*`: `grep -c \">\" sequences.fa`.",
    "Patterns are regular expressions: `^` means the start of a line, `$` the end, and `.` any single character. `grep \"^>\" sequences.fa` matches only lines that begin with `>`.",
    "grep finishes with exit status 0 if it found at least one match and 1 if it found none. Scripts use this to make decisions."
  ],
  deeper: "`-E` turns on extended regular expressions, so `grep -E \"HSPA|DNAJ\" counts.tsv` matches either text. `-F` does the opposite and treats the pattern as plain text, which helps when it contains dots or brackets. A character class such as `[ACGT]` matches any one listed letter. Note that `-c` counts matching lines, not matches: a line containing the pattern twice counts once. To count every occurrence, use `grep -o PATTERN FILE | wc -l` (the pipe `|` comes two lessons later).",
  show: {
    intro: "Three searches in the practice data, from `~/project/data`.",
    lang: "bash",
    code: "grep HSPA1 counts.tsv\ngrep -c heat_shock annotation.tsv\ngrep -c \">\" sequences.fa",
    output: "HSPA1A\t212\t282\t203\t11018\t8441\t10838\nHSPA1B\t172\t202\t155\t10345\t7330\t7541\n7\n6",
    notes: [
      "`HSPA1` is found inside both HSPA1A and HSPA1B: grep matches text anywhere in a line, not whole gene names.",
      "`-c` replaces the matching lines with their number: 7 genes are labeled heat_shock in annotation.tsv.",
      "Every FASTA record has exactly one header line starting with `>`, so counting those lines counts the sequences: 6. The quotes around `>` are essential, as the pipes lesson shows."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "`grep HSPA1 counts.tsv` finds only the gene called HSPA1.",
    right: "grep matches text anywhere in the line, so it also finds HSPA1A and HSPA1B. Use `-w` to match whole words only: `grep -w HSPA1A counts.tsv`. (`grep -w HSPA1` finds nothing here, because no gene is named exactly HSPA1.)"
  },
  try: { kind: "terminal", mission: "f1-grep" },
  check: [
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "grep -c HSP annotation.tsv" },
      options: [
        { t: "6", why: "That is the answer with `-i`, which would also match the description \"Hsp40\" on the DNAJB1 line. Without `-i`, case matters." },
        { t: "5", why: "Correct. Five lines contain uppercase HSP: HSPA1A, HSPA1B, HSPA6, HSPH1 and HSPB1." },
        { t: "7", why: "Seven genes are in the heat_shock category, but the DNAJB1 and BAG3 lines do not contain the text HSP. grep matches text, not meaning." }
      ],
      answer: 1,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "Which command prints the lines of samples.tsv that do NOT contain `control`?",
      options: [
        { t: "`grep -v control samples.tsv`", why: "Correct. `-v` inverts the match. The header line is printed too, because it does not contain control either." },
        { t: "`grep -c control samples.tsv`", why: "`-c` counts the matching lines (3). It does not invert the search." },
        { t: "`grep -w control samples.tsv`", why: "`-w` still prints matching lines; it only requires the match to be a whole word." }
      ],
      answer: 0
    },
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "grep -w HSPA1 counts.tsv\necho $?" },
      options: [
        { t: "1", why: "Correct. No gene is named exactly HSPA1, so grep prints no lines, and `echo $?` shows its exit status: 1, meaning no match." },
        { t: "HSPA1A\t212\t282\t203\t11018\t8441\t10838\nHSPA1B\t172\t202\t155\t10345\t7330\t7541\n0", why: "That would be the result without `-w`. With `-w`, HSPA1 must stand alone as a word, and HSPA1A does not count." },
        { t: "0", why: "Exit status 0 means at least one line matched. Here nothing matched." }
      ],
      answer: 0,
      verify: { cwd: "~/project/data" }
    }
  ],
  real: "grep pulls one gene's row out of a count table with 60,000 rows, counts the records in FASTA files, finds sample names in metadata, and searches pipeline logs with `grep -i error`. Regular expressions extend this to biological patterns, such as finding the restriction site `GAATTC` in sequences.",
  teach: {
    prompt: "Explain what grep does and what -c, -i, -v, -w and -n change, using the heat-shock files as examples.",
    points: ["grep prints lines containing a pattern, case-sensitively", "-i ignores case, -w needs whole words, -v inverts", "-c counts matching lines, -n adds line numbers", "Quote special characters such as >", "^ anchors a pattern to the start of a line"]
  }
});

BB.lessons.push({
  id: "f1-wrangle",
  what: "`cut` extracts columns, `sort` puts lines in order, `uniq` collapses or counts repeated lines, and `tr` replaces or deletes characters. Joined with the pipe symbol `|`, they reshape tables without a spreadsheet.",
  problem: "Tables raise simple questions all the time: which genes have the highest counts in one sample? How many genes are in each category? Answering them by hand is slow and error-prone, and spreadsheets struggle with millions of rows.",
  care: "Many quick checks on count tables and annotation files take one line, and the same line works unchanged on a file with millions of rows.",
  steps: [
    "`cut -f 1,5 counts.tsv` keeps fields (columns) 1 and 5. `cut` splits lines at tabs by default; for a comma-separated file add `-d \",\"`.",
    "`sort` orders lines as text. `-n` sorts numerically, `-r` reverses the order, and `-k 5,5` sorts by the fifth column; `-k5,5nr` combines all three. `-u` keeps one copy of each distinct line.",
    "The pipe `|` sends the output of one command straight into the next: `tail -n +2 counts.tsv | sort -k5,5nr | head -n 3` skips the header, sorts by heat_1 from largest to smallest and keeps the top 3. A later lesson covers pipes in depth.",
    "`uniq` collapses repeated lines that are next to each other, and `uniq -c` counts them. Because it only compares neighbors, sort first: `sort | uniq -c`.",
    "`tr` translates characters: `tr \"\\t\" \",\"` turns tabs into commas and `tr -d \"N\"` deletes every N. It reads only its input stream, so feed it with a pipe, as in `cat samples.tsv | tr \"\\t\" \",\"`.",
    "Header lines are sorted and counted like any other line, so remove them first with `tail -n +2`."
  ],
  deeper: "With `-k5,5` the sort key starts and ends at field 5; `-k5` alone would use everything from field 5 to the end of the line. `cut` always prints fields in their original order, so `cut -f 3,1` gives column 1 and then column 3. The order of letters also depends on the system's language settings (locale); BioBridge uses plain character order, where capital letters come before lowercase ones, which you can get anywhere with `LC_ALL=C sort`.",
  show: {
    intro: "Three questions about the heat-shock tables, each answered in one line.",
    lang: "bash",
    code: "cut -f 1,3 annotation.tsv | head -n 4\ntail -n +2 annotation.tsv | cut -f 3 | sort | uniq -c\ntail -n +2 counts.tsv | sort -k5,5nr | head -n 3",
    output: "symbol\tcategory\nHSPA1A\theat_shock\nHSPA1B\theat_shock\nHSPA6\theat_shock\n      7 heat_shock\n      3 housekeeping\n      2 transcription_factor\nEEF1A1\t98622\t107855\t109432\t129222\t86182\t109219\nACTB\t44289\t46223\t46941\t55945\t39466\t49070\nGAPDH\t35384\t42943\t41517\t48101\t32068\t37159",
    notes: [
      "Line 1 keeps the symbol and category columns and shows the first 4 rows.",
      "Line 2 counts genes per category: 7 heat_shock, 3 housekeeping and 2 transcription_factor. `tail -n +2` removed the header first; otherwise \"category\" would be counted as a category.",
      "Line 3 lists the three highest heat_1 counts. They belong to housekeeping genes, not heat-shock genes: the highest count is not the biggest change. Comparing conditions needs both groups and fair normalization (Foundation 3)."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "`sort -r` puts the biggest numbers first.",
    right: "Without `-n`, sort compares text, character by character. Sorting the heat_1 column with `sort -r` puts 999 above 129222, because the character 9 comes after 1. Use `sort -nr` (or `-k5,5nr` for one column) whenever you sort numbers."
  },
  try: { kind: "terminal", mission: "f1-wrangle" },
  check: [
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "cut -f 5 counts.tsv | tail -n +2 | sort -r | head -n 1" },
      options: [
        { t: "129222", why: "That is the largest number, which `sort -nr` would put first. Plain `sort -r` compares characters, not values." },
        { t: "heat_1", why: "`tail -n +2` removed the header line before sorting, so heat_1 never reaches sort." },
        { t: "999", why: "Correct, and a classic trap. Without `-n`, sort compares text, and the character 9 sorts after 1, so 999 comes first in reverse order." }
      ],
      answer: 2,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "tail -n +2 samples.tsv | cut -f 2 | sort -u" },
      options: [
        { t: "control\nheat_shock", why: "Correct. Column 2 holds the condition, and `sort -u` sorts it and keeps one copy of each distinct value." },
        { t: "control\ncontrol\ncontrol\nheat_shock\nheat_shock\nheat_shock", why: "This is the sorted column with its duplicates. `-u` keeps only one copy of each line." },
        { t: "condition\ncontrol\nheat_shock", why: "`tail -n +2` removed the header line, so condition is not among the values." }
      ],
      answer: 0,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "You want the number of genes on each chromosome, from column 2 of annotation.tsv. Why must `sort` come before `uniq -c`?",
      options: [
        { t: "`sort` only makes `uniq` faster; the counts would be the same without it", why: "The counts would be wrong without sorting. Chromosome 6 appears in rows 1, 2 and 10, so unsorted `uniq -c` would report it twice, as 2 and then 1." },
        { t: "`uniq` only merges identical lines that are next to each other, so equal values must be brought together first", why: "Correct. Sorting places all copies of each value side by side, so each one is counted once, in full." },
        { t: "`sort` removes the header line", why: "`sort` keeps every line, including the header. Remove headers with `tail -n +2`." }
      ],
      answer: 1
    }
  ],
  real: "Bioinformaticians use these commands to summarize gene annotation files (for example, how many genes per chromosome), to pull one sample's column out of a large matrix, and to sort result tables by a column such as fold change. For complex tables R or Python is the better tool, but a one-line check often answers the question before you open either.",
  teach: {
    prompt: "Explain how you would find the top 3 genes in one sample and count genes per category, naming what cut, sort, uniq and tr each do.",
    points: ["cut -f keeps chosen columns of a tab-separated file", "sort -n sorts numbers; -r reverses; -k picks the column", "uniq -c counts neighboring duplicates, so sort first", "tail -n +2 removes the header before sorting or counting", "tr replaces or deletes characters"]
  }
});

BB.lessons.push({
  id: "f1-permissions",
  what: "Every file and folder has permissions that say who may read (r), write (w) or execute (x) it. They are set separately for the file's owner (user), its group and everyone else (others), and `chmod` changes them.",
  problem: "Linux servers are shared by many people. Permissions stop others from reading private data or deleting your files, and they decide which files may be run as programs.",
  care: "The first time you write a script and try to run it, you will probably see \"Permission denied\". Reading `-rw-r--r--` and knowing `chmod +x` fixes that in seconds, and making raw data read-only protects it from accidents.",
  steps: [
    "`ls -l` starts each line with 10 characters, such as `-rwxr-xr-x`. The first is the type (`-` for a file, `d` for a directory); the next nine are three groups of three: user, group and others.",
    "In each group, `r` means read, `w` write and `x` execute, and `-` means that permission is missing. For a folder, `r` lets you list it and `x` lets you enter it with `cd`.",
    "Symbolic `chmod` adds (`+`) or removes (`-`) permissions for the user (`u`), group (`g`), others (`o`) or all (`a`): `chmod u+x run.sh`, `chmod go-w notes.txt`, `chmod a-w raw.fastq`. Plain `chmod +x file` adds execute permission, normally for everyone.",
    "Numeric `chmod` adds up r = 4, w = 2 and x = 1 for each group: `chmod 755` gives `rwxr-xr-x` (typical for scripts), `chmod 644` gives `rw-r--r--` (typical for data) and `chmod 600` gives `rw-------` (private).",
    "Only a file's owner, or the superuser (root), can change its permissions. `sudo` runs a single command as root, and on shared servers ordinary users usually are not allowed to use it."
  ],
  deeper: "To delete or rename a file you need write permission on the folder that contains it, not on the file itself. `bash script.sh` works even without x, because Bash only reads the file; `./script.sh` asks the system to execute the file, which needs x. Groups let a lab share data: if a project folder belongs to the lab's group and has group read permission, labmates can read it. The `id` command shows which groups you belong to.",
  show: {
    intro: "In `~/project/scripts`, one script cannot be run directly until it gets execute permission.",
    lang: "bash",
    code: "ls -l\n./count_seqs.sh ../data/sequences.fa\nchmod +x count_seqs.sh\nls -l count_seqs.sh\n./count_seqs.sh ../data/sequences.fa",
    output: "total 8\n-rw-r--r-- 1 student student 149 Nov  7 10:00 count_seqs.sh\n-rwxr-xr-x 1 student student 167 Nov  7 10:00 line_report.sh\nbash: ./count_seqs.sh: Permission denied\n-rwxr-xr-x 1 student student 149 Nov  7 10:00 count_seqs.sh\n../data/sequences.fa contains 6 sequences",
    notes: [
      "count_seqs.sh starts as `-rw-r--r--`: the owner may read and write, everyone else may only read, and nobody may execute it.",
      "Running it with `./` fails with Permission denied. After `chmod +x` it is `-rwxr-xr-x` and runs.",
      "After the permissions come the link count, owner, group, size in bytes, date and name. Your owner and dates will differ."
    ],
    cwd: "~/project/scripts",
    noVerify: true
  },
  pitfall: {
    wrong: "When something says Permission denied, `chmod 777` is the easy fix.",
    right: "777 (`rwxrwxrwx`) lets every user on the server change or run the file, and on a folder it lets anyone delete the files inside. Give only what is needed: `chmod u+x` or `chmod 755` for a script, `chmod 600` for a private file, `chmod a-w` to protect raw data."
  },
  try: { kind: "terminal", mission: "f1-permissions" },
  check: [
    {
      q: "`ls -l` shows `-rw-r-----` for counts.tsv. Who may read it?",
      options: [
        { t: "Only the owner", why: "The second group of three, `r--`, gives members of the file's group read access too." },
        { t: "The owner and members of the file's group", why: "Correct. User `rw-`, group `r--`, others `---`." },
        { t: "Everyone on the server", why: "The last group of three, `---`, gives others no permissions at all." }
      ],
      answer: 1
    },
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "chmod u+x ../scripts/count_seqs.sh\nls -l ../scripts/count_seqs.sh | cut -c 1-10" },
      options: [
        { t: "-rwxr-xr-x", why: "That is what `chmod +x` or `chmod 755` usually gives. `u+x` changes the owner's permissions only." },
        { t: "-rw-r--r--", why: "That was the mode before. `chmod` changes permissions immediately, and `ls -l` shows the new mode." },
        { t: "-rwxr--r--", why: "Correct. `u+x` adds execute for the user (owner) only; the group and others keep `r--`. `cut -c 1-10` keeps just the permission characters." }
      ],
      answer: 2,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "Which numeric mode gives `rwxr-x---`?",
      options: [
        { t: "750", why: "Correct. 7 = 4 + 2 + 1 (rwx), 5 = 4 + 1 (r-x) and 0 means no permissions." },
        { t: "570", why: "The digits are in the order user, group, others, so the user's rwx (7) comes first." },
        { t: "755", why: "755 would give others `r-x` too. The last group here is `---`, which is 0." }
      ],
      answer: 0
    }
  ],
  real: "On a shared server, raw sequencing data is often made read-only (`chmod a-w`) so that no script can overwrite it, and project folders are shared with a lab group. Pipeline scripts need execute permission, and \"Permission denied\" when saving a file usually means you are trying to write into a folder you do not own.",
  teach: {
    prompt: "Explain how to read `-rwxr-xr--`, and how you would make a script runnable and a data file read-only.",
    points: ["Three groups: user, group, others", "r read, w write, x execute", "chmod u+x or chmod 755 makes a script runnable", "chmod a-w protects raw data", "Avoid 777 on shared servers"]
  }
});

BB.lessons.push({
  id: "f1-archive-net",
  what: "An archive bundles many files into one file, and compression makes a file smaller. `tar` creates and unpacks archives, `gzip` compresses single files, and `zip` does both in a format common on Windows. Networking commands such as `hostname`, `ping`, `curl` and `wget` identify computers, test connections and download data.",
  problem: "Sequencing data is huge and spread over many files. To store it cheaply and move it between computers you need to bundle and compress it, and to fetch reference files and public data straight from online databases onto the server where you work.",
  care: "Almost every public sequencing or genome file you download ends in `.gz` or `.tar.gz`. Knowing how to list, unpack and read these files, and how to download them directly to a server, saves hours.",
  steps: [
    "`tar -czf data.tar.gz data` creates (`c`) a gzip-compressed (`z`) archive, written to the file (`f`) data.tar.gz, from the folder data. `tar -tzf data.tar.gz` lists (`t`) the contents, and `tar -xzf data.tar.gz` extracts (`x`) them. Add `-v` to see each name as it is processed.",
    "`gzip reads.fastq` compresses one file and replaces it with `reads.fastq.gz`; `gunzip reads.fastq.gz` reverses it. `zcat reads.fastq.gz` prints the uncompressed text without changing the file.",
    "`zip -r data.zip data` creates a zip archive of a folder; `unzip data.zip` extracts it and `unzip -l data.zip` lists it.",
    "`hostname` prints the computer's name, and `ifconfig` (or the newer `ip addr`) shows its network connections and addresses. `ping -c 4 example.org` sends four small test messages and reports whether, and how fast, the other computer answers.",
    "`wget URL` downloads a file and saves it under its own name. `curl URL` prints what it downloads to the screen; add `-O` to save it under its own name or `-o name` to choose one."
  ],
  deeper: "In `tar`, the letter `f` must come last in a group like `-czf`, because the next word is taken as the archive's name. gzip shrinks text such as FASTQ well, often to between a quarter and a third of the original size, but files that are already compressed barely shrink. Many tools read `.gz` files directly, so sequencing reads usually stay compressed for their whole life. This practice server has no internet connection, so `ping`, `curl` and `wget` only print a message here; on a real server they contact the remote computer.",
  show: {
    intro: "Archive the data folder, then list what the archive contains, from `~/project`.",
    lang: "bash",
    code: "tar -czf data.tar.gz data\ntar -tzf data.tar.gz | sort",
    output: "data/\ndata/annotation.tsv\ndata/counts.tsv\ndata/reads.fastq\ndata/samples.tsv\ndata/sequences.fa",
    notes: [
      "The first command prints nothing; it wrote one compressed file, data.tar.gz, that holds the whole folder.",
      "Listing with `-t` shows the paths stored inside, including the folder itself (`data/`). Extracting recreates exactly this structure.",
      "`| sort` only puts the list in alphabetical order; tar stores files in the order it found them."
    ],
    cwd: "~/project"
  },
  pitfall: {
    wrong: "`tar -cf data.tar data` makes my data smaller.",
    right: "Without `-z`, tar only bundles files into one; the archive is about as big as the files together. Add `-z` for gzip compression (`.tar.gz`). `gzip` on its own compresses one file at a time, which is why folders are usually archived with tar first."
  },
  try: { kind: "terminal", mission: "f1-archive-net" },
  check: [
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "gzip reads.fastq\nls reads*" },
      options: [
        { t: "reads.fastq  reads.fastq.gz", why: "gzip does not keep the original by default: reads.fastq is removed once the compressed file is written." },
        { t: "reads.fastq.gz", why: "Correct. gzip replaces the original file with the compressed one and adds `.gz` to its name." },
        { t: "reads.fastq", why: "gzip changed the folder: reads.fastq became reads.fastq.gz." }
      ],
      answer: 1,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "A collaborator sends `run42.tar.gz`. Which command shows what is inside without unpacking it?",
      options: [
        { t: "`tar -xzf run42.tar.gz`", why: "`x` extracts the files and writes them all to disk, which is what you wanted to check first." },
        { t: "`gunzip run42.tar.gz`", why: "This removes the gzip compression and leaves `run42.tar`. It still does not show you the list of files." },
        { t: "`tar -tzf run42.tar.gz`", why: "Correct. `t` lists the contents, `z` handles the gzip compression and `f` names the archive." }
      ],
      answer: 2
    },
    {
      q: "Which command downloads a file from a web address and, by default, saves it to disk under its own name?",
      options: [
        { t: "`wget URL`", why: "Correct. wget saves the file in the current folder and shows its progress." },
        { t: "`curl URL`", why: "Without `-O` or `-o`, curl prints the downloaded data to the screen instead of saving it." },
        { t: "`ping URL`", why: "ping only tests whether a computer answers. It takes a host name, not a web address, and downloads nothing." }
      ],
      answer: 0
    }
  ],
  real: "Reference genomes, annotation files and public sequencing reads are distributed as `.gz` or `.tar.gz` files and downloaded straight onto servers with `wget` or `curl`, which avoids passing gigabytes through a laptop. Results are often sent to collaborators as a single `.tar.gz` or `.zip` file, and `ssh`, a secure remote login, is how you reach those servers in the first place.",
  teach: {
    prompt: "Explain the difference between archiving and compressing, how you would pack, list and unpack a folder, and which commands download data or test a connection.",
    points: ["tar bundles; -z adds gzip compression", "-c creates, -t lists, -x extracts, -f names the archive", "gzip replaces a file with a .gz version; zcat reads it", "wget saves downloads; curl prints them unless -o or -O", "ping tests whether a host answers"]
  }
});

BB.lessons.push({
  id: "f1-editors",
  what: "A text editor changes the contents of plain-text files such as scripts, notes and settings. In the terminal the two most common editors are nano, which is simple, and Vim, which is powerful but works in modes. A package manager installs and updates software.",
  problem: "On a server you cannot open files in a graphical word processor, and word processors add hidden formatting that breaks scripts. You also need a reliable way to install the tools an analysis needs, together with everything they depend on.",
  care: "You will edit scripts and small settings files constantly. Knowing how to save and quit in nano and Vim, including how to get out of Vim, prevents a classic beginner panic.",
  steps: [
    "`nano notes.txt` opens the file, or starts a new one that is created when you save. You can type straight away. The bottom lines list shortcuts, where `^` means the Ctrl key.",
    "In nano, Ctrl+O writes out (saves) the file, Enter confirms the name, and Ctrl+X exits. Ctrl+W searches and Ctrl+K cuts the current line.",
    "`vim notes.txt` opens Vim in normal mode, where keys are commands, not text. Press `i` to enter insert mode and type; press Esc to return to normal mode.",
    "In normal mode, type `:w` and Enter to save, `:q` to quit, `:wq` to save and quit, and `:q!` to quit without saving.",
    "Package managers download software, plus everything it depends on, from trusted repositories: `sudo apt install nano` on Ubuntu and Debian, `sudo dnf install nano` on Fedora and Red Hat systems. `sudo apt update` refreshes apt's list of available versions."
  ],
  deeper: "Installing system packages needs superuser rights, which you normally do not have on a shared server. Bioinformaticians therefore often install tools in their own space with conda (many tools come from the Bioconda channel), use `module load` on clusters that provide software modules, or run tools inside containers. Whatever the method, record the version of each tool you used, because results can change between versions.",
  show: {
    intro: "The keys you need to create, save and leave a file in each editor.",
    lang: "text",
    code: "nano summary.txt        open (or start) summary.txt in nano\n  type your text        nano is ready for typing immediately\n  Ctrl+O, then Enter    write out (save) the file\n  Ctrl+X                exit back to the shell\n\nvim summary.txt         open summary.txt in Vim, in normal mode\n  i                     switch to insert mode, then type\n  Esc                   go back to normal mode\n  :wq, then Enter       write (save) and quit\n  :q!, then Enter       quit without saving",
    notes: [
      "nano always shows its shortcuts at the bottom of the screen, which is why it is the usual choice for beginners.",
      "In Vim, typing in normal mode runs commands instead of inserting text. If the screen behaves strangely, press Esc and type `:q!` to leave without saving.",
      "Both editors save plain text with no hidden formatting, which is exactly what scripts and data files need."
    ]
  },
  pitfall: {
    wrong: "I can write my script in a word processor and copy it to the server.",
    right: "Word processors may insert curly quotes, special dash characters or Windows line endings that the shell cannot read, and their own file formats are not plain text. Write scripts in a plain-text editor such as nano or Vim, or in a code editor."
  },
  try: { kind: "terminal", mission: "f1-editors" },
  check: [
    {
      q: "You opened a file in nano and typed two lines. How do you save and leave?",
      options: [
        { t: "Type `:wq` and press Enter", why: "That is the Vim command. In nano, `:wq` would simply be typed into your file as text." },
        { t: "Ctrl+O, Enter to confirm the name, then Ctrl+X", why: "Correct. Ctrl+O writes the file out, and Ctrl+X exits nano." },
        { t: "Close the terminal window", why: "Closing the window ends nano without saving your changes to the file." }
      ],
      answer: 1
    },
    {
      q: "You are in Vim and typing letters does strange things. Which keys let you leave without saving?",
      options: [
        { t: "Esc, then `:q!` and Enter", why: "Correct. Esc returns to normal mode, and `:q!` quits while discarding changes." },
        { t: "Ctrl+X", why: "Ctrl+X exits nano, not Vim. In Vim, quitting is a command typed after `:` in normal mode." },
        { t: "`q` on its own", why: "In normal mode, `q` begins recording a macro (Vim waits for a letter to store it under) rather than quitting. Quit commands begin with a colon." }
      ],
      answer: 0
    },
    {
      q: "Why do package managers such as apt and dnf exist?",
      options: [
        { t: "They compress files for storage", why: "That is the job of tools such as gzip and tar." },
        { t: "They are the only way to run software on Linux", why: "Programs installed in other ways, for example with conda or in your own folder, run fine. Package managers make installation and updates reliable." },
        { t: "They install software together with everything it depends on, from trusted repositories, and keep it updated", why: "Correct. Resolving dependencies and versions by hand is slow and error-prone; the package manager does it for you." }
      ],
      answer: 2
    }
  ],
  real: "Bioinformaticians edit small scripts, pipeline configuration files and sample sheets directly on servers with nano or Vim. Analysis tools such as aligners are installed through package managers or conda environments, and recording their versions is part of a reproducible methods section.",
  teach: {
    prompt: "Explain how to create, save and exit a file in nano and in Vim, and what a package manager does.",
    points: ["nano: type, Ctrl+O and Enter to save, Ctrl+X to exit", "Vim has modes: i to insert, Esc for normal mode", ":wq saves and quits Vim; :q! quits without saving", "Package managers install software with its dependencies", "Shared servers usually need conda or modules instead of sudo"]
  }
});

BB.lessons.push({
  id: "f1-pipes",
  what: "Every command reads from standard input and writes results to standard output, while error messages go to a separate stream, standard error. A pipe (`|`) connects one command's output to the next command's input, and redirection (`>`, `>>`, `<`, `2>`) connects these streams to files.",
  problem: "Each Linux tool does one small job, but real questions need several steps, and saving an intermediate file after every step is slow and messy. Pipes chain tools into one line, and redirection saves the final answer.",
  care: "Pipes turn a handful of simple commands into answers to real questions, such as how many genes are in each category, and redirection gives you result files you can keep, share and regenerate.",
  steps: [
    "Standard output (stdout) is where a command writes its results, normally the screen. Standard error (stderr) carries error messages, also to the screen by default. Standard input (stdin) is where a command reads when you give it no file name.",
    "`A | B` runs both commands and sends A's standard output into B's standard input. Commands that read input, change or select it, and write output, such as `grep`, `cut`, `sort`, `uniq`, `head` and `wc`, are called filters; they are the natural pieces of pipelines.",
    "`>` sends standard output into a file, creating it or replacing everything in it. `>>` appends to the end of the file instead.",
    "`<` makes a file the standard input of a command: `wc -l < reads.fastq` prints only the number, because `wc` never sees the file's name.",
    "`2>` redirects standard error, so `command > out.txt 2> errors.txt` separates results from errors. `2>&1` sends errors to wherever standard output is going at that point, so it must come after the file: `command > all.txt 2>&1` saves both in one file.",
    "`;` runs commands one after another, `&&` runs the second only if the first succeeded, and `||` runs it only if the first failed."
  ],
  deeper: "The shell sets up every redirection before the command starts. That is why `sort counts.tsv > counts.tsv` destroys the table: the shell empties counts.tsv first, and sort then reads an empty file. Write to a new file instead, then rename it. In a pipeline all the commands run at the same time and data streams through them in small pieces, so a pipeline of filters such as `grep` and `cut` can process a file far larger than the computer's memory.",
  show: {
    intro: "Save the names of the heat-shock genes to a file in results, then check it, from `~/project/data`.",
    lang: "bash",
    code: "grep heat_shock annotation.tsv | cut -f 1 | sort > ../results/heat_genes.txt\nwc -l ../results/heat_genes.txt\nhead -n 3 ../results/heat_genes.txt",
    output: "7 ../results/heat_genes.txt\nBAG3\nDNAJB1\nHSPA1A",
    notes: [
      "The first line prints nothing on the screen: grep finds the 7 heat_shock rows, cut keeps the gene names, sort orders them, and `>` writes the result into a new file.",
      "`wc -l` confirms that the file has 7 lines, one per gene.",
      "`head -n 3` shows the first three names in alphabetical order. Running the first line again would replace the file with the same content; `>>` would add a second copy."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "`grep -c > sequences.fa` and `grep -c \">\" sequences.fa` do the same thing; the quotes are just decoration.",
    right: "Without quotes, the shell treats `>` as redirection before grep even starts: it empties sequences.fa to receive the output, and grep, now with no pattern, prints a usage error. All six sequences are gone. The quotes make `>` an ordinary character that is passed to grep as the pattern, so `grep -c \">\" sequences.fa` safely prints 6."
  },
  try: { kind: "terminal", mission: "f1-pipes" },
  check: [
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "echo \"gene\" > list.txt\necho \"HSPA1A\" > list.txt\necho \"HSPA1B\" >> list.txt\ncat list.txt" },
      options: [
        { t: "gene\nHSPA1A\nHSPA1B", why: "`>` does not append: each `>` empties the file first, so \"gene\" was overwritten by the second line." },
        { t: "HSPA1A\nHSPA1B", why: "Correct. The second `>` replaced the file's content, and `>>` then added a line at the end." },
        { t: "HSPA1B", why: "`>>` appends instead of replacing, so HSPA1A stays in the file." }
      ],
      answer: 1,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "ls counts.tsv missing.txt > out.txt 2> err.txt\ncat out.txt" },
      options: [
        { t: "counts.tsv", why: "Correct. The listing of the existing file goes to standard output, so into out.txt; the complaint about missing.txt goes to standard error, so into err.txt." },
        { t: "ls: cannot access 'missing.txt': No such file or directory", why: "That message travels on standard error, which `2>` sent to err.txt, not to out.txt." },
        { t: "counts.tsv\nls: cannot access 'missing.txt': No such file or directory", why: "Only `2>&1` would merge both streams into one file. Here they were sent to different files." }
      ],
      answer: 0,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "Which line counts the heat_shock genes and saves only the number in n_heat.txt?",
      options: [
        { t: "`grep -c heat_shock annotation.tsv | n_heat.txt`", why: "A pipe sends output to another command, not to a file. The shell would look for a program called n_heat.txt." },
        { t: "`grep -c heat_shock annotation.tsv < n_heat.txt`", why: "`<` feeds a file into a command's input; it never saves output. If n_heat.txt does not exist yet, the shell stops with an error before grep runs." },
        { t: "`grep -c heat_shock annotation.tsv > n_heat.txt`", why: "Correct. grep prints the count on standard output, and `>` writes it into the file." }
      ],
      answer: 2
    }
  ],
  real: "Bioinformatics pipelines are built from exactly these parts: tools read standard input and write standard output, so reads can be decompressed, filtered and counted in one line without temporary files. Logs are kept by redirecting standard error, so when a long job fails overnight you can read what went wrong.",
  teach: {
    prompt: "Explain standard input, output and error, then describe what `|`, `>`, `>>`, `<` and `2>` do, including why `>` must be quoted in `grep -c \">\" sequences.fa`.",
    points: ["Commands read stdin and write stdout; errors go to stderr", "A pipe sends one command's output into the next", "> replaces a file, >> appends to it", "2> captures error messages", "Unquoted > is redirection and can empty a file"]
  }
});

BB.lessons.push({
  id: "f1-scripts",
  what: "A shell script is a text file of commands that Bash runs in order, from top to bottom. Scripts turn a series of commands into one reusable tool that takes its inputs as command-line arguments.",
  problem: "Typing the same five commands for each of 20 samples is slow and invites mistakes, and a week later nobody remembers exactly what was typed. A script records the steps once, runs them identically every time, and documents what was done.",
  care: "Your first script is the bridge from typing commands to automating analyses. Every pipeline, from a three-line helper to a full RNA-seq workflow, is built from the ideas in this lesson.",
  steps: [
    "The first line, `#!/bin/bash`, is the shebang: it tells the system which program should run the file when you execute it directly. Lines that start with `#` after that are comments for humans.",
    "Run a script with `bash count_seqs.sh FILE`, which needs only read permission, or make it executable once with `chmod +x count_seqs.sh` and run `./count_seqs.sh FILE`.",
    "Inside the script, `$1` is the first command-line argument, `$2` the second, and so on; `$#` is the number of arguments and `$@` is all of them.",
    "A shell variable stores text: `file=$1`, with no spaces around `=`. Use its value with `$file`, and put it in double quotes, `\"$file\"`, so that names containing spaces stay in one piece.",
    "Command substitution, `$(command)`, runs a command and inserts its output: `n=$(grep -c \">\" \"$file\")` stores the count in `n`. Whole-number arithmetic uses `$(( ))`, as in `$((n * 2))`.",
    "Environment variables are shell variables passed on to every program you start, such as `HOME`, `USER` and `PATH`. `export NAME=value` creates one."
  ],
  deeper: "Single quotes keep text exactly as written, so `echo '$HOME'` prints `$HOME`, while double quotes allow variables and command substitution inside them. Spaces around `=` are an error: `n = 5` makes Bash run a command called `n`. A script started with `./script.sh` or `bash script.sh` runs in a new shell, so the variables it sets disappear when it ends; `source script.sh` runs it in your current shell instead, which is how you reload settings after editing `~/.bashrc`.",
  show: {
    intro: "The practice project already contains a small script. Read it, then run it, from `~/project/data`.",
    lang: "bash",
    code: "cat ../scripts/count_seqs.sh\nbash ../scripts/count_seqs.sh sequences.fa",
    output: "#!/bin/bash\n# Count the sequences in a FASTA file.\n# Usage: ./count_seqs.sh FILE\nfile=$1\nn=$(grep -c \">\" \"$file\")\necho \"$file contains $n sequences\"\nsequences.fa contains 6 sequences",
    notes: [
      "Line 1 is the shebang, and lines 2 and 3 are comments explaining what the script does and how to use it.",
      "`file=$1` stores the first argument, here sequences.fa. `n=$(grep -c \">\" \"$file\")` runs grep and stores its output, 6, in the variable `n`.",
      "The last line prints a sentence built from both variables. The same script works on any FASTA file you name, which is the point of using arguments."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "If my script runs without errors, its answer must be right.",
    right: "A script does exactly what it says, not what you meant. Run on reads.fastq, count_seqs.sh reports 7 sequences, because `>` also appears in FASTQ quality strings; the file really holds 8 reads. Test scripts on small files where you know the answer, and use them only on the file type they were written for."
  },
  try: { kind: "terminal", mission: "f1-scripts" },
  check: [
    {
      q: "What does the line `#!/bin/bash` at the top of a script do?",
      options: [
        { t: "It makes the file executable", why: "Only the permissions do that, set with `chmod +x`. A script with a shebang but no x permission still gets Permission denied." },
        { t: "It is a comment, so the system ignores it completely", why: "It looks like a comment, and Bash itself skips it, but when you run `./script.sh` the system reads it to choose the program that runs the file." },
        { t: "It tells the system to run the file with /bin/bash when the script is executed directly", why: "Correct. The shebang names the interpreter, so `./count_seqs.sh` is run by Bash." }
      ],
      answer: 2
    },
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "bash ../scripts/count_seqs.sh sequences.fa reads.fastq" },
      options: [
        { t: "sequences.fa contains 6 sequences", why: "Correct. The script only uses `$1`, so the second argument is accepted but ignored. Handling many files needs a loop, the subject of the next lesson." },
        { t: "sequences.fa contains 6 sequences\nreads.fastq contains 7 sequences", why: "The script never mentions `$2` or `$@`, so it never processes the second file." },
        { t: "sequences.fa reads.fastq contains 13 sequences", why: "`$1` is only the first word after the script name. The arguments are not combined or added up." }
      ],
      answer: 0,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "Which line correctly stores the number of lines of counts.tsv in a variable called `n`?",
      options: [
        { t: "`n = $(wc -l < counts.tsv)`", why: "Spaces around `=` make Bash treat `n` as a command name, which fails with \"n: command not found\"." },
        { t: "`n=$(wc -l < counts.tsv)`", why: "Correct. `$( )` captures the output, and `<` makes wc print only the number, without the file name." },
        { t: "`n=wc -l < counts.tsv`", why: "Without `$( )`, nothing fills the variable with a count. Bash sets `n` to the text wc for a command called `-l`, which fails with \"-l: command not found\"." }
      ],
      answer: 1
    }
  ],
  real: "Bioinformatics scripts wrap tools in the same way: a script takes a sample name or file as `$1`, runs quality control, alignment and counting on it, and writes outputs named after the sample. Sharing that script alongside a paper lets others repeat the analysis exactly.",
  teach: {
    prompt: "Walk a friend through count_seqs.sh line by line, and explain how to run it in two different ways.",
    points: ["The shebang names the interpreter", "$1 holds the first command-line argument", "Variables are set with name=value, no spaces", "$( ) inserts a command's output", "Run with bash script.sh, or chmod +x then ./script.sh"]
  }
});

BB.lessons.push({
  id: "f1-script-logic",
  what: "Loops repeat commands for every item in a list, such as every FASTQ file, and conditions (`if`) choose what to do based on a test, such as whether a file exists. Together they let a script handle many files and react to problems.",
  problem: "Real projects have dozens or hundreds of samples. Copying the same command for each one invites mistakes, and a script that blindly continues after a missing or empty file produces wrong results without warning.",
  care: "A five-line loop processes 6 samples or 600 in exactly the same way, and a simple `if` check catches a missing file before it silently spoils an analysis.",
  steps: [
    "`for f in *.fastq; do ... done` sets the variable `f` to each matching file name in turn and runs the commands between `do` and `done` once per name. The list can also be written out: `for s in ctrl_1 ctrl_2 heat_1`.",
    "`if [ test ]; then ... elif [ test ]; then ... else ... fi` runs the first block whose test is true. The spaces inside the square brackets are required.",
    "File tests: `-e` exists, `-f` is a regular file, `-d` is a directory, `-s` exists and is not empty, `-x` is executable. Text tests: `=`, `!=`, `-z` (empty) and `-n` (not empty). Number tests: `-eq`, `-ne`, `-lt`, `-le`, `-gt` and `-ge`.",
    "Every command finishes with an exit status, stored in `$?`: 0 means success and any other number means failure. `if` really tests exit statuses, and `[ ... ]` is itself a command that exits with 0 when its test is true.",
    "`while [ test ]; do ... done` repeats as long as the test is true, so something inside the loop must eventually make it false.",
    "Helpful extras: `basename heat_1.fastq .fastq` prints `heat_1`, which is handy for naming outputs after each sample, and `seq 1 5` prints the numbers 1 to 5."
  ],
  deeper: "Inside `[ ]`, the symbols `<` and `>` are redirections, not comparisons: `[ $n > 3 ]` creates a file called 3, which is why numbers are compared with `-lt` and `-gt`. Quote variables in tests, `[ -f \"$f\" ]`, so that an empty value cannot break the test. If a pattern such as `*.fastq` matches nothing, Bash leaves it unchanged, and the loop runs once with the literal text `*.fastq`; a `-e` test inside the loop catches this.",
  show: {
    intro: "A loop with a decision: check every table in `~/project/data` and flag any with fewer than 10 data rows.",
    lang: "bash",
    code: "for f in *.tsv\ndo\n  rows=$(tail -n +2 \"$f\" | wc -l)\n  if [ \"$rows\" -ge 10 ]; then\n    echo \"$f: $rows rows\"\n  else\n    echo \"$f: only $rows rows, check this file\"\n  fi\ndone",
    output: "annotation.tsv: 12 rows\ncounts.tsv: 12 rows\nsamples.tsv: only 6 rows, check this file",
    notes: [
      "`*.tsv` expands to the three table names, and the loop body runs once for each, with `f` holding the current name.",
      "`$(tail -n +2 \"$f\" | wc -l)` counts the lines without the header and stores the number in `rows`.",
      "`-ge` means greater than or equal. samples.tsv has only 6 rows, so the `else` branch runs. Here that is expected, since there are six samples, but the same pattern catches truncated files in real projects."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "`if [$n -gt 5]` and `if [ $n -gt 5 ]` are the same; the spaces do not matter.",
    right: "`[` is a command, so like any command it must be separated from its arguments by spaces. Without them, Bash looks for a command called `[6` (when n is 6) and fails with \"command not found\". Write `if [ \"$n\" -gt 5 ]; then`."
  },
  try: { kind: "terminal", mission: "f1-script-logic" },
  check: [
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "for f in *.tsv; do basename \"$f\" .tsv; done" },
      options: [
        { t: "annotation.tsv\ncounts.tsv\nsamples.tsv", why: "That is what `echo \"$f\"` would print. The second argument of basename, `.tsv`, removes that ending." },
        { t: "annotation\ncounts\nsamples", why: "Correct. The loop runs once per .tsv file, and basename strips the `.tsv` ending, which is how scripts name output files after each input." },
        { t: "annotation counts samples", why: "Each pass of the loop runs basename separately, and each run prints its own line." }
      ],
      answer: 1,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "if [ -f ../results ]; then echo file; elif [ -d ../results ]; then echo folder; else echo missing; fi" },
      options: [
        { t: "file", why: "`-f` is true only for regular files. A directory is not a regular file." },
        { t: "missing", why: "The `else` branch runs only if both tests fail, but results exists, as a directory." },
        { t: "folder", why: "Correct. results is a directory, so `-f` is false and the `elif` test `-d` is true." }
      ],
      answer: 2,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "After `grep -c FOS counts.tsv`, the command `echo $?` prints `0`. What does that tell you?",
      options: [
        { t: "grep succeeded: it found at least one matching line", why: "Correct. For grep, exit status 0 means at least one match; the count itself (1) was printed by grep." },
        { t: "grep found zero matches", why: "`$?` is the exit status, not the count. 0 means success, which for grep means at least one match." },
        { t: "The previous command printed nothing", why: "The exit status says nothing about how much was printed. It reports success (0) or failure (any other number)." }
      ],
      answer: 0
    }
  ],
  real: "Processing every sample of an experiment is a loop: for each FASTQ file, run quality control, align, count, and write outputs named with `basename`. Conditions guard each step, skipping samples whose input is missing or empty and stopping when a tool exits with a non-zero status, so problems are caught early instead of leaving silent gaps.",
  teach: {
    prompt: "Explain how a for loop and an if test work together to process every sample file, and what an exit status is.",
    points: ["for runs the same commands once per item", "if [ test ] chooses a branch; spaces inside [ ] matter", "File tests such as -f, -d and -s check inputs", "Exit status 0 means success; $? holds the last one", "basename turns file names into sample names"]
  }
});

BB.lessons.push({
  id: "f1-cron",
  what: "cron is a Linux service that runs commands automatically on a schedule. Each user lists their scheduled jobs in a crontab, one line per job: five time fields followed by the command to run.",
  problem: "Some tasks must run regularly whether or not anyone is logged in: refreshing a copy of a database every night, checking free disk space every hour, or producing a daily summary of newly arrived data. Doing them by hand is easy to forget.",
  care: "Once a script works, cron turns it into a routine: it runs at the same time every day and writes a log you can check later. Reading cron lines also tells you when automated jobs on a shared server will run.",
  steps: [
    "`crontab -e` opens your crontab in an editor and `crontab -l` lists your scheduled jobs. `crontab -r` removes your whole crontab at once, so to delete one job, edit the file and delete that line instead.",
    "Each line has five fields and then the command: minute (0 to 59), hour (0 to 23), day of month (1 to 31), month (1 to 12) and day of week (0 to 7, where both 0 and 7 mean Sunday).",
    "`*` means every value, `1-5` a range, `1,15` a list and `*/15` every 15th value. So `30 2 * * *` means 02:30 every day, and `0 */6 * * *` means on the hour every 6 hours.",
    "cron runs jobs with a minimal environment and without your terminal: use absolute paths for scripts and files, and redirect output to a log file, for example `>> /home/student/project/results/report.log 2>&1`.",
    "The background service that reads all crontabs is called cron (crond on some systems). It checks every minute whether any line matches the current time."
  ],
  deeper: "If both day of month and day of week are restricted (neither is `*`), the job runs when either one matches, so `0 9 1 * 1` runs on the 1st of each month and also every Monday. Times follow the server's clock and time zone. On shared computing clusters, heavy analyses go through the cluster's own job scheduler (such as Slurm) rather than cron, but the idea of an unattended, scheduled job is the same.",
  show: {
    intro: "A crontab with two jobs, as `crontab -l` would list it. Lines starting with `#` are comments.",
    lang: "text",
    code: "# minute hour day-of-month month day-of-week command\n0 6 * * 1-5 /home/student/project/scripts/line_report.sh /home/student/project/data >> /home/student/project/results/line_report.log 2>&1\n*/30 * * * * df -h /home >> /home/student/project/results/disk.log 2>&1",
    notes: [
      "Job 1: minute 0, hour 6, any day of the month, any month, days 1 to 5 (Monday to Friday). It runs line_report.sh at 06:00 every weekday.",
      "Every path is absolute, because cron does not start in your project folder. `>>` appends each run's output to a log, and `2>&1` sends error messages there too.",
      "Job 2 runs every 30 minutes (at :00 and :30 of every hour) and records free disk space, a simple way to notice a disk filling up."
    ]
  },
  pitfall: {
    wrong: "`* 2 * * *` runs my job once a day at 2 AM.",
    right: "The first field is the minute, and `*` means every minute, so this runs 60 times, from 02:00 to 02:59. For once a day at 02:00, write `0 2 * * *`."
  },
  try: { kind: "widget", widget: "cron" },
  check: [
    {
      q: "What does the schedule `30 2 * * *` mean?",
      options: [
        { t: "Every 30 minutes, for 2 hours", why: "The fields are fixed positions: minute 30 and hour 2. Every 30 minutes would be `*/30` in the minute field." },
        { t: "Every day at 02:30", why: "Correct. Minute 30, hour 2, and `*` for day of month, month and day of week." },
        { t: "On the 30th of February", why: "Day of month and month are the third and fourth fields, both `*` here. The first two fields are the minute and the hour." }
      ],
      answer: 1
    },
    {
      q: "Which line runs a script at 18:15 every Friday?",
      options: [
        { t: "`15 18 * * 5`", why: "Correct. Minute 15, hour 18, any day of month, any month, day of week 5 (Friday, counting Sunday as 0)." },
        { t: "`18 15 * * 5`", why: "Minute comes first, so this runs at 15:18." },
        { t: "`15 18 5 * *`", why: "The 5 sits in the day-of-month field, so this runs on the 5th of every month. Day of week is the fifth field." }
      ],
      answer: 0
    },
    {
      q: "A script runs perfectly from your terminal but fails under cron with \"No such file or directory\". What is the most likely cause?",
      options: [
        { t: "cron cannot run Bash scripts", why: "cron runs any command, including scripts, as long as they can be found and executed." },
        { t: "The schedule fields are in the wrong order", why: "A wrong schedule changes when the job runs, not whether its files are found." },
        { t: "The crontab line or the script uses relative paths, but cron does not start in your project folder", why: "Correct. Use absolute paths everywhere in cron jobs, and log their output to see such errors." }
      ],
      answer: 2
    }
  ],
  real: "Bioinformatics groups use cron to refresh local copies of reference databases overnight, to watch disk usage on shared servers, and to run small reports on newly arrived sequencing data. For heavy analyses on clusters a job scheduler takes this role, but reading and writing schedules works the same way.",
  teach: {
    prompt: "Explain what cron is, read the five fields of `0 6 * * 1-5` aloud, and say why cron jobs need absolute paths and log files.",
    points: ["cron runs commands on a schedule without anyone logged in", "Fields: minute, hour, day of month, month, day of week", "* means every value; */N every Nth; a-b a range", "crontab -e edits, -l lists, -r removes everything", "Use absolute paths and redirect output to a log"]
  }
});

BB.lessons.push({
  id: "f1-bio-recipes",
  what: "A few one-line commands answer the questions asked most often about sequence files and tables: how many sequences or reads, which IDs, which genes, which samples. Each recipe is a pipeline of commands you already know.",
  problem: "Loading a 10 GB FASTQ file into Python or R just to count its reads is slow and heavy. Command-line recipes stream through the file once and answer in seconds, directly on the server where the data lives.",
  care: "These checks catch common problems early: a FASTQ file with a missing piece, a FASTA file with the wrong number of sequences, or a sample sheet that does not match the data.",
  steps: [
    "Count FASTA sequences by counting header lines: `grep -c \"^>\" sequences.fa`. The `^` anchors the match to the start of the line, and the quotes protect `>` from the shell.",
    "Count FASTQ reads by dividing the number of lines by four: `echo $(( $(wc -l < reads.fastq) / 4 ))`. Do not count lines starting with `@`, because `@` is also a valid quality character and can start a quality line.",
    "List FASTA IDs: `grep \"^>\" sequences.fa | cut -d \" \" -f 1 | tr -d \">\"` keeps the first word of each header and deletes the `>`.",
    "Summarize tables: `tail -n +2 annotation.tsv | cut -f 3 | sort | uniq -c` counts genes per category, and `tail -n +2 counts.tsv | sort -k5,5nr | head -n 3` lists the top genes in one sample.",
    "Repeat a recipe for many files with a loop, for example `for f in *.fastq; do echo $f $(( $(wc -l < $f) / 4 )); done`, and save any answer with `> ../results/name.txt`."
  ],
  deeper: "Counting FASTQ reads by lines works for standard four-line records, which current sequencers produce. For compressed files, put `zcat` at the start: `echo $(( $(zcat reads.fastq.gz | wc -l) / 4 ))`. grep works line by line, so a motif that is split across two wrapped FASTA lines is missed, and quality lines can contain letters too, so restrict base searches to sequence lines in real files. Dedicated tools such as seqkit and samtools handle these cases and are the next step when one-liners get complicated.",
  show: {
    intro: "Four recipes on the practice files, run from `~/project/data`.",
    lang: "bash",
    code: "grep -c \"^>\" sequences.fa\necho $(( $(wc -l < reads.fastq) / 4 ))\ngrep \"^>\" sequences.fa | cut -d \" \" -f 1 | tr -d \">\"\ngrep -c GAATTC sequences.fa",
    output: "6\n8\nseq_01\nseq_02\nseq_03\nseq_04\nseq_05\nseq_06\n2",
    notes: [
      "6 sequences and 8 reads: the two most common sanity checks.",
      "The IDs are the first word of each header. Comparing such a list with your sample sheet catches missing or extra records.",
      "`GAATTC` is the recognition site of the restriction enzyme EcoRI, and 2 lines contain it. Because grep searches line by line, a site split across two wrapped lines would be missed."
    ],
    cwd: "~/project/data"
  },
  pitfall: {
    wrong: "`grep -c \">\"` counts records, so it will count the reads in a FASTQ file too.",
    right: "On reads.fastq it prints 7, but the file has 8 reads: `>` is a valid quality character and appears inside 7 of the quality lines, while FASTQ headers start with `@`. Use the recipe that matches the format: header lines for FASTA (`grep -c \"^>\"`), lines divided by 4 for FASTQ."
  },
  try: { kind: "terminal", mission: "f1-bio-recipes" },
  check: [
    {
      q: "In `~/project/data`, what does this print?",
      code: { lang: "bash", src: "grep -c \">\" reads.fastq" },
      options: [
        { t: "8", why: "8 is the number of reads, but FASTQ headers start with `@`, not `>`. grep counts any line containing `>`, which here means quality lines." },
        { t: "7", why: "Correct, and misleading: seven quality lines happen to contain the character `>`. The number has nothing to do with the 8 reads in the file." },
        { t: "0", why: "That would be right for `grep -c \"^>\"`, which only matches lines that start with `>`. Without `^`, a `>` anywhere in a line counts." }
      ],
      answer: 1,
      verify: { cwd: "~/project/data" }
    },
    {
      q: "You have 200 compressed FASTQ files (`*.fastq.gz`) in one folder and need the read count of each. Which command fits best?",
      options: [
        { t: "`for f in *.fastq.gz; do echo $f $(( $(zcat $f | wc -l) / 4 )); done`", why: "Correct. The loop handles every file, zcat decompresses on the fly, and dividing lines by 4 gives reads." },
        { t: "`grep -c \"^@\" *.fastq.gz`", why: "grep reads the compressed bytes, not the text, and counting `@` lines can overcount even in plain files, because `@` is also a quality character." },
        { t: "`wc -l *.fastq.gz`", why: "wc counts line breaks in the compressed bytes, which is meaningless, and even for plain files you would still need to divide by 4." }
      ],
      answer: 0
    },
    {
      q: "Which pipeline counts how many genes in annotation.tsv belong to the heat_shock category?",
      options: [
        { t: "`grep -c heat_shock counts.tsv`", why: "counts.tsv has no category column; the categories are in annotation.tsv, so this prints 0." },
        { t: "`cut -f 3 annotation.tsv | wc -l`", why: "This counts every line of the category column, 13 including the header, not only the heat_shock ones." },
        { t: "`cut -f 3 annotation.tsv | grep -c heat_shock`", why: "Correct. Looking only at the category column avoids matching the text elsewhere on a line, and `-c` counts the matches: 7." }
      ],
      answer: 2
    }
  ],
  real: "Sequencing facilities and pipelines run checks like these on every file: read counts per sample to spot failed libraries, sequence counts in reference files, and ID lists to confirm that sample sheets match the data. When a question needs more than a one-liner, the same logic moves into Python, R or a dedicated tool.",
  teach: {
    prompt: "Show a friend how to count sequences in a FASTA file and reads in a FASTQ file, and explain why the FASTA recipe gives a wrong answer on FASTQ.",
    points: ["FASTA: count header lines with grep -c \"^>\"", "FASTQ: lines divided by 4", "> and @ can appear inside FASTQ quality strings", "Quote special characters such as >", "Loop over files and save answers with >"]
  }
});
