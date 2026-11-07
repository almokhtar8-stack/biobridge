/* Foundation 1 practice bank: Linux and the command line. Written to tools/CONTENT_GUIDE.md, section 4.
   Questions with `verify` are executed with real Bash in a fresh copy of the practice file system by tools/verify_code.py. */
window.BB = window.BB || {};
BB.questions = BB.questions || [];

BB.questions.push(
  /* ---------- f1-linux ---------- */
  {
    id: "lx-001", obj: ["LX.CONCEPTS"], lesson: "f1-linux", level: 1,
    q: "What does the kernel do?",
    options: [
      { t: "Reads the commands you type and starts programs", why: "That is the shell's job. The kernel sits below the shell and every other program." },
      { t: "Controls the hardware and shares the processor, memory and disks between running programs", why: "Correct. Every program, including the shell, asks the kernel for files, memory and processor time." },
      { t: "Displays text and passes your keystrokes on", why: "That describes the terminal. The terminal never touches the hardware directly; the kernel does." }
    ],
    answer: 1,
    explain: "The kernel is the core of the operating system and the only software that controls the hardware directly. The shell and all other programs request what they need from it."
  },
  {
    id: "lx-002", obj: ["LX.CONCEPTS"], lesson: "f1-linux", level: 1,
    q: "Which of these is a Linux distribution?",
    options: [
      { t: "Bash", why: "Bash is a shell, a program that runs on almost every distribution." },
      { t: "grep", why: "grep is a command-line tool included in every distribution, not a distribution itself." },
      { t: "Windows", why: "Windows is a different operating system. It can run Linux through WSL, but it is not a Linux distribution." },
      { t: "Ubuntu", why: "Correct. Ubuntu packages the Linux kernel with tools, the apt package manager and default settings." }
    ],
    answer: 3,
    explain: "A distribution bundles the Linux kernel with tools, a package manager and settings. Ubuntu, Debian, Fedora and Rocky Linux are distributions; Bash and grep are programs that run on them."
  },
  {
    id: "lx-003", obj: ["LX.CONCEPTS"], lesson: "f1-linux", level: 2,
    q: "Your laptop runs Ubuntu and the university cluster runs Rocky Linux. Which part of your work is most likely to differ between them?",
    options: [
      { t: "The command used to install software, such as `apt` on Ubuntu and `dnf` on Rocky Linux", why: "Correct. Distributions differ mainly in their package managers and default settings." },
      { t: "What `ls -l` and `grep -c` do", why: "Core commands behave the same on all distributions, because they are the same tools." },
      { t: "The way paths are written, with `/` between folders", why: "Every Linux distribution uses the same single tree that starts at `/`." }
    ],
    answer: 0,
    explain: "Distributions share the Linux kernel and the same core commands, so scripts and everyday commands move between them unchanged. Installing software is where they differ most."
  },
  {
    id: "lx-004", obj: ["LX.CONCEPTS"], lesson: "f1-linux", level: 3,
    q: "A lab keeps 2 TB of sequencing data on a Linux server. A student wants to analyze it on a laptop with 500 GB of free disk space. What is the best approach?",
    options: [
      { t: "Download the data in parts and analyze each part on the laptop", why: "Moving terabytes is slow, the laptop lacks the space and memory, and splitting an analysis by hand invites mistakes." },
      { t: "Convert the files to a Windows format first", why: "Sequencing files are plain text (often compressed) and are not tied to an operating system, so no conversion is needed." },
      { t: "Log in to the server and run the analysis there, where the data and the tools already are", why: "Correct. Bringing the analysis to the data is standard practice, and Linux servers are built for it." }
    ],
    answer: 2,
    explain: "Large datasets stay on servers. You connect to the server and run commands and scripts there, which is why the command line is a core bioinformatics skill."
  },

  /* ---------- f1-terminal ---------- */
  {
    id: "lx-005", obj: ["LX.CMD"], lesson: "f1-terminal", level: 1,
    q: "In `grep -i hsp70 annotation.tsv`, which words are arguments?",
    options: [
      { t: "`-i` only", why: "`-i` starts with a dash, so it is an option that changes how grep matches." },
      { t: "`grep` and `annotation.tsv`", why: "`grep` is the command name, which is always the first word." },
      { t: "`hsp70` and `annotation.tsv`", why: "Correct. grep's first argument is the pattern and the second is the file to search." }
    ],
    answer: 2,
    explain: "The first word is the command name, words starting with `-` are options, and the remaining words are arguments. For grep, the arguments are the pattern and then the files."
  },
  {
    id: "lx-006", obj: ["LX.CMD"], lesson: "f1-terminal", level: 1,
    q: "What is the best way to see the full list of options of the `sort` command?",
    options: [
      { t: "`man sort`", why: "Correct. The manual page lists every option; `sort --help` gives a shorter summary." },
      { t: "`help sort`", why: "`help` documents commands built into Bash, such as `cd`. sort is a separate program, so `help sort` finds nothing." },
      { t: "`sort --list`", why: "sort has no `--list` option. Instead of guessing options, look them up with `man` or `--help`." }
    ],
    answer: 0,
    explain: "`man COMMAND` opens the manual page (press q to quit), and most programs also print a summary with `--help`."
  },
  {
    id: "lx-007", obj: ["LX.CMD"], lesson: "f1-terminal", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "wc -w samples.tsv" },
    options: [
      { t: "7 samples.tsv", why: "7 is the number of lines, which `wc -l` gives. `-w` counts words: anything separated by spaces or tabs." },
      { t: "28 samples.tsv", why: "Correct. 7 lines of 4 tab-separated values each make 28 words." },
      { t: "4 samples.tsv", why: "4 is the number of columns. `wc -w` counts every word in the whole file." }
    ],
    answer: 1,
    verify: { cwd: "~/project/data" },
    explain: "`-w` asks wc for words only: 7 lines times 4 values per line gives 28. The file name follows the count because it was given as an argument."
  },
  {
    id: "lx-008", obj: ["LX.CMD"], lesson: "f1-terminal", level: 3,
    q: "A tool's help prints the usage line `fastqc [-o output_dir] seqfile1 .. seqfileN`, where square brackets mark optional parts. Which command analyzes two files and writes the reports into the folder qc?",
    options: [
      { t: "`fastqc heat_1.fastq.gz heat_2.fastq.gz qc -o`", why: "`-o` needs its value, the output folder, right after it, and here nothing follows it." },
      { t: "`fastqc -o qc heat_1.fastq.gz heat_2.fastq.gz`", why: "Correct. The option `-o` takes the next word, qc, as its value, and the remaining arguments are the files to analyze." },
      { t: "`fastqc -o heat_1.fastq.gz heat_2.fastq.gz qc`", why: "`-o` takes the next word as its value, so heat_1.fastq.gz would be treated as the output folder." }
    ],
    answer: 1,
    explain: "Usage lines show the pattern of a command: options (some with values), then arguments. An option that takes a value uses the word that follows it."
  },
  {
    id: "lx-009", obj: ["LX.INFO"], lesson: "f1-terminal", level: 1,
    q: "Which command prints the name of the user you are logged in as?",
    options: [
      { t: "`hostname`", why: "`hostname` prints the computer's name, not yours." },
      { t: "`pwd`", why: "`pwd` prints the folder you are in." },
      { t: "`whoami`", why: "Correct. It prints your user name, the same name shown before the `@` in the prompt." }
    ],
    answer: 2,
    explain: "`whoami` answers \"which account am I using?\". `id` gives more detail: your user number and the groups you belong to."
  },
  {
    id: "lx-010", obj: ["LX.INFO"], lesson: "f1-terminal", level: 2,
    q: "Your alignment job has been running for hours. Which command shows a live, updating view of running processes and how much processor time and memory each one uses?",
    options: [
      { t: "`top`", why: "Correct. top refreshes every few seconds; press q to quit." },
      { t: "`ps`", why: "`ps` prints a single snapshot, by default only of the processes started from your terminal. It does not keep updating." },
      { t: "`df -h`", why: "`df -h` reports disk space, not running programs." }
    ],
    answer: 0,
    explain: "`ps` is a one-time list of processes and `top` is a continuously updated view, which is useful for watching long jobs."
  },
  {
    id: "lx-011", obj: ["LX.INFO"], lesson: "f1-terminal", level: 2,
    q: "`df -h` prints the line `/dev/sda1  100G  95G  5.0G  95% /home`. Can you safely download 20 GB of FASTQ files into your home folder?",
    options: [
      { t: "Yes, because the disk is 100G", why: "100G is the total size, and most of it is already used." },
      { t: "No, because only 5.0G is available on the file system that holds /home", why: "Correct. The Avail column, 5.0G, is what you can still write." },
      { t: "Yes, because 95% means 95 GB is still free", why: "Use% shows how full the disk is: 95% is already used." }
    ],
    answer: 1,
    explain: "The df columns are: file system, size, used, available, percentage used, and where it is mounted. Check Avail before writing large files."
  },
  {
    id: "lx-012", obj: ["LX.INFO"], lesson: "f1-terminal", level: 3,
    q: "You are logged in to two servers in two terminal windows and are about to delete old intermediate files. Which commands should you run first to confirm the machine and the folder?",
    options: [
      { t: "`hostname` and `pwd`", why: "Correct. hostname names the machine, and pwd shows exactly which folder the deletion would affect." },
      { t: "`whoami` and `date`", why: "whoami confirms the user, which may be the same on both servers, and date only shows the time." },
      { t: "`uname -r` and `ls`", why: "The kernel release can be identical on many servers, and ls lists files without telling you the full path of where you are." }
    ],
    answer: 0,
    explain: "Before anything destructive, confirm where you are: the host name (which computer) and the working directory (which folder). The prompt usually shows both, but checking is a good habit."
  },

  /* ---------- f1-paths ---------- */
  {
    id: "lx-013", obj: ["LX.PATHS"], lesson: "f1-paths", level: 1,
    q: "What does `~` stand for in a path such as `~/project`?",
    options: [
      { t: "The root directory, `/`", why: "The root is written `/`. `~` is a shortcut for your own home folder." },
      { t: "Your home directory, here `/home/student`", why: "Correct. The shell replaces `~` with the path of your home directory." },
      { t: "The folder you are in right now", why: "The current folder is written `.`." }
    ],
    answer: 1,
    explain: "`~` expands to the home directory, so `~/project` means `/home/student/project` for the user student, from any working directory."
  },
  {
    id: "lx-014", obj: ["LX.PATHS"], lesson: "f1-paths", level: 2,
    q: "In `~/project/scripts`, what does this print?",
    code: { lang: "bash", src: "head -n 1 ../../notes.txt" },
    options: [
      { t: "Heat-shock RNA-seq practice project", why: "That is the first line of `../README.txt`, one level up. `../..` climbs two levels, to the home directory." },
      { t: "Welcome to the BioBridge practice server.", why: "Correct. scripts to project to student: `../../notes.txt` is `/home/student/notes.txt`." },
      { t: "head: cannot open '../../notes.txt' for reading: No such file or directory", why: "The path is valid: two levels up from scripts is the home directory, which contains notes.txt." }
    ],
    answer: 1,
    verify: { cwd: "~/project/scripts" },
    explain: "Each `..` moves up one level. From `/home/student/project/scripts`, `../..` is `/home/student`, where notes.txt lives."
  },
  {
    id: "lx-015", obj: ["LX.PATHS"], lesson: "f1-paths", level: 2,
    q: "In `~/project/scripts`, what does this print?",
    code: { lang: "bash", src: "ls ../data" },
    options: [
      { t: "count_seqs.sh  line_report.sh", why: "Those files are in scripts, the current folder. `../data` points to a neighboring folder." },
      { t: "ls: cannot access '../data': No such file or directory", why: "`..` from scripts is project, which does contain data, so the path is valid." },
      { t: "annotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa", why: "Correct. `..` goes up to project and `data` goes down into the data folder." }
    ],
    answer: 2,
    verify: { cwd: "~/project/scripts" },
    explain: "Relative paths can go up and then down: `../data` lists the data folder without leaving scripts."
  },
  {
    id: "lx-016", obj: ["LX.PATHS"], lesson: "f1-paths", level: 3,
    q: "A pipeline configuration file lists the input `reads/heat_1.fastq.gz`. The pipeline works when started in `/scratch/lab/run7` but fails when started from your home directory. What is the best fix?",
    options: [
      { t: "Write the absolute path `/scratch/lab/run7/reads/heat_1.fastq.gz` in the configuration", why: "Correct. An absolute path points to the same file wherever the pipeline is started." },
      { t: "Remove the `.gz` ending from the file name", why: "The name is fine; the problem is where the path is read from. Renaming a compressed file would also make its name misleading." },
      { t: "Copy the reads folder into every folder you might start from", why: "Copies waste space and drift out of sync. Fixing the path solves the actual problem." }
    ],
    answer: 0,
    explain: "Relative paths are read from the working directory, so they break when a program starts somewhere else. Absolute paths remove that dependency."
  },

  /* ---------- f1-navigate ---------- */
  {
    id: "lx-017", obj: ["LX.NAV"], lesson: "f1-navigate", level: 1,
    q: "Which command prints the absolute path of your current folder?",
    options: [
      { t: "`cd`", why: "`cd` changes folder. On its own it takes you home and prints nothing." },
      { t: "`pwd`", why: "Correct. pwd stands for print working directory." },
      { t: "`ls`", why: "`ls` lists what is inside the folder, not where the folder is." }
    ],
    answer: 1,
    explain: "`pwd` prints the full path of the working directory, for example `/home/student/project/data`."
  },
  {
    id: "lx-018", obj: ["LX.NAV"], lesson: "f1-navigate", level: 2,
    q: "In `~/project`, what does this print?",
    code: { lang: "bash", src: "cd data\ncd ../results\ncd ..\nls" },
    options: [
      { t: "README.txt  data  results  scripts", why: "Correct. Into data, across to results, then up to project, so ls lists project." },
      { t: "annotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa", why: "That is the listing of data. The later cd commands moved you away from it." },
      { t: "notes.txt  project", why: "That is the home directory. The last `cd ..` went up only one level from results, to project." }
    ],
    answer: 0,
    verify: { cwd: "~/project" },
    explain: "Trace each step: project to data, data to results (through `..`), then results up to project. ls then lists project."
  },
  {
    id: "lx-019", obj: ["LX.NAV"], lesson: "f1-navigate", level: 2,
    q: "You run `cd results` in `~/project/data` and get \"No such file or directory\". Why?",
    options: [
      { t: "The results folder is empty, so it cannot be entered", why: "Empty folders can be entered normally; ls there simply prints nothing." },
      { t: "`cd` needs the option `-d` for folders", why: "cd takes a folder path and needs no option." },
      { t: "results is inside project, not inside data, so the relative path is looked up in the wrong place", why: "Correct. From data, the right relative path is `../results`." }
    ],
    answer: 2,
    explain: "Relative paths start from the working directory. results is a sibling of data, so you reach it by going up first: `cd ../results`."
  },
  {
    id: "lx-020", obj: ["LX.NAV", "LX.PATHS"], lesson: "f1-navigate", level: 2,
    q: "On a server, your prompt reads `ana@hpc01:~/rnaseq/run3/fastq$`. Which command takes you to `~/rnaseq/run3/qc`?",
    options: [
      { t: "`cd qc`", why: "This looks for qc inside fastq, the current folder." },
      { t: "`cd ../qc`", why: "Correct. The prompt shows you are in `~/rnaseq/run3/fastq`; `..` is run3, which contains qc." },
      { t: "`cd /qc`", why: "A leading `/` starts at the root directory, far from your home folder." },
      { t: "`cd ~/qc`", why: "This means a folder qc directly inside your home directory, not inside rnaseq/run3." }
    ],
    answer: 1,
    explain: "The prompt shows the user, the host and the working directory. From fastq, `..` is run3, so `../qc` reaches the sibling folder. `cd ~/rnaseq/run3/qc` would also work."
  },

  /* ---------- f1-manage ---------- */
  {
    id: "lx-021", obj: ["LX.MANAGE"], lesson: "f1-manage", level: 1,
    q: "You delete `results_old.tsv` with `rm`. How can you get it back?",
    options: [
      { t: "From the recycle bin, as on a desktop", why: "rm does not use a recycle bin; the file is removed immediately." },
      { t: "With the command `undo rm`", why: "The shell has no undo command." },
      { t: "Only from a backup copy, if one exists, because rm deletes permanently", why: "Correct. This is why raw data is kept safe and backed up, and why rm commands deserve a second look before you press Enter." }
    ],
    answer: 2,
    explain: "rm removes files at once, with no recycle bin and no undo. Keep copies of anything important, and preview wildcards with ls before deleting."
  },
  {
    id: "lx-022", obj: ["LX.MANAGE"], lesson: "f1-manage", level: 1,
    q: "Which command creates the folders `results/qc/plots` in one step, even if `results` does not exist yet?",
    options: [
      { t: "`mkdir results/qc/plots`", why: "Without `-p`, mkdir fails when the parent folders are missing." },
      { t: "`touch results/qc/plots`", why: "touch creates empty files, not folders, and it also fails when the folders above it do not exist." },
      { t: "`mkdir -p results/qc/plots`", why: "Correct. `-p` creates every missing parent folder and does not complain if some already exist." }
    ],
    answer: 2,
    explain: "`mkdir -p` builds a whole path of folders at once, which is why scripts use it to prepare output folders."
  },
  {
    id: "lx-023", obj: ["LX.MANAGE"], lesson: "f1-manage", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "mv samples.tsv metadata.tsv\nls" },
    options: [
      { t: "annotation.tsv  counts.tsv  metadata.tsv  reads.fastq  sequences.fa", why: "Correct. mv renamed the file, so samples.tsv no longer exists." },
      { t: "annotation.tsv  counts.tsv  metadata.tsv  reads.fastq  samples.tsv  sequences.fa", why: "That is what `cp` would leave. `mv` renames, so the old name disappears." },
      { t: "annotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa", why: "mv succeeded silently, so the listing shows the new name, metadata.tsv." }
    ],
    answer: 0,
    verify: { cwd: "~/project/data" },
    explain: "`mv OLD NEW` in the same folder renames a file. If metadata.tsv had already existed, it would have been replaced without warning."
  },
  {
    id: "lx-024", obj: ["LX.MANAGE"], lesson: "f1-manage", level: 2,
    q: "What does the pattern `heat_?.fastq` match?",
    options: [
      { t: "heat_1.fastq and heat_2.fastq, but not heat_10.fastq", why: "Correct. `?` matches exactly one character, so the two characters of 10 do not fit." },
      { t: "Any name that starts with heat_", why: "That would be `heat_*`. `?` stands for exactly one character, and the name must also end in .fastq." },
      { t: "Only a file literally named heat_?.fastq", why: "The shell expands `?` into matching names before the command runs. Only if nothing matches is the pattern left as it is." }
    ],
    answer: 0,
    explain: "Wildcards: `*` matches any run of characters, `?` exactly one, and `[12]` one of the listed characters. The shell expands them into file names."
  },
  {
    id: "lx-025", obj: ["LX.MANAGE"], lesson: "f1-manage", level: 3,
    q: "You want to delete the temporary files ending in `.tmp` in the current folder, and nothing else. What is the safest approach?",
    options: [
      { t: "`rm * .tmp`", why: "The space splits this into two arguments: `*` (every file in the folder) and `.tmp`. It deletes every file in the folder, then complains that `.tmp` does not exist." },
      { t: "Run `ls *.tmp` to see exactly what matches, then `rm *.tmp`", why: "Correct. ls shows the expanded list first, so you know exactly what rm will receive." },
      { t: "`rm -r *.tmp`", why: "`-r` also deletes any folders whose names match, with all their contents. It does not make the command safer." }
    ],
    answer: 1,
    explain: "rm has no undo. Preview a pattern with ls, and watch for stray spaces, which turn one pattern into several arguments."
  },

  /* ---------- f1-view ---------- */
  {
    id: "lx-026", obj: ["LX.VIEW"], lesson: "f1-view", level: 1,
    q: "You opened a large FASTQ file with `less`. How do you leave?",
    options: [
      { t: "Press q", why: "Correct. q quits less and returns you to the prompt." },
      { t: "Press Ctrl+O", why: "Ctrl+O saves a file in nano. less only displays files." },
      { t: "Press Esc", why: "Esc does not quit less. It is the key that leaves insert mode in Vim." }
    ],
    answer: 0,
    explain: "In less, Space and the arrow keys scroll, `/` searches and q quits. The same keys work in man pages."
  },
  {
    id: "lx-027", obj: ["LX.VIEW"], lesson: "f1-view", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "head -n 8 reads.fastq | tail -n 4" },
    options: [
      { t: "@READ_0001\nAACAATGACGGGAGAAGGAAAAAGTTGGAAACTCAA\n+\nIHHHAGGFEEBCCECB?@C@@@AA@@<6?<=*<,<=", why: "These are lines 1 to 4. head passes 8 lines on, and tail keeps the last 4 of those." },
      { t: "@READ_0002\nAGAGTTTTAAGACCGCTTGTTGTAGTAATCGGGCTC\n+\nHIIF+EEAFBFBDD?BA@CB@B@@A;?>??<>===<", why: "Correct. Lines 5 to 8 are the second FASTQ record." },
      { t: "@READ_0008\nACATCTGTTGGGCTCATACATTGTCATTGGGATCCC\n+\nFIFHEEDEECFD@D>BD@&>A@@@>A??>8>?>>==", why: "That is the last record of the file. tail only sees the 8 lines that head passed to it." }
    ],
    answer: 1,
    verify: { cwd: "~/project/data" },
    explain: "`head -n 8 | tail -n 4` prints lines 5 to 8. With four lines per FASTQ record, that is exactly the second read."
  },
  {
    id: "lx-028", obj: ["LX.VIEW"], lesson: "f1-view", level: 2,
    q: "A student measures the length of seq_06, the last line of sequences.fa, like this. What does it print?",
    code: { lang: "bash", src: "tail -n 1 sequences.fa | wc -c" },
    options: [
      { t: "27", why: "The sequence has 27 letters, but `wc -c` also counts the newline character at the end of the line." },
      { t: "28", why: "Correct. 27 bases plus 1 newline character." },
      { t: "1", why: "That would be `wc -l`, the number of lines." }
    ],
    answer: 1,
    verify: { cwd: "~/project/data" },
    explain: "`wc -c` counts bytes, including the invisible newline that ends each line. Subtract 1 for the sequence length."
  },
  {
    id: "lx-029", obj: ["LX.VIEW"], lesson: "f1-view", level: 3,
    q: "`wc -l` reports that a freshly downloaded FASTQ file has 1,000,002 lines. What should you conclude?",
    options: [
      { t: "It contains 1,000,002 reads", why: "Each read takes four lines, so a complete file would hold only about a quarter as many reads as lines." },
      { t: "It contains 250,000 complete reads and one short read", why: "Reads always come as complete four-line records. Two extra lines mean a broken record, not a short read." },
      { t: "The file is probably damaged or truncated, because a complete FASTQ file has a multiple of 4 lines", why: "Correct. 1,000,002 is not divisible by 4; check the end of the file with tail and download it again." }
    ],
    answer: 2,
    explain: "A line count that is not a multiple of 4 is a red flag for FASTQ. `tail -n 4` shows whether the last record is incomplete."
  },

  /* ---------- f1-grep ---------- */
  {
    id: "lx-030", obj: ["LX.SEARCH"], lesson: "f1-grep", level: 1,
    q: "What does the `-v` option of grep do?",
    options: [
      { t: "Prints the lines that do NOT match the pattern", why: "Correct. `-v` inverts the selection." },
      { t: "Prints the version of grep", why: "Many programs print their version with `--version`. In grep, lowercase `-v` inverts the match." },
      { t: "Prints each match with extra detail", why: "`-v` is not a detail option. `-n` adds line numbers and `-c` counts matching lines." }
    ],
    answer: 0,
    explain: "`grep -v PATTERN` keeps every line that does not contain the pattern. For example, `grep -v \"^>\"` keeps only the sequence lines of a FASTA file."
  },
  {
    id: "lx-031", obj: ["LX.SEARCH"], lesson: "f1-grep", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "grep -ci hsp annotation.tsv" },
    options: [
      { t: "5", why: "That is the case-sensitive count of HSP. With `-i`, the description \"Hsp40\" on the DNAJB1 line matches too." },
      { t: "7", why: "BAG3 is a heat-shock gene, but its line contains no hsp in any case. grep matches text, not categories." },
      { t: "6", why: "Correct. Five gene symbols contain HSP, and the description of DNAJB1 mentions Hsp40." }
    ],
    answer: 2,
    verify: { cwd: "~/project/data" },
    explain: "`-c` counts matching lines and `-i` ignores case, so lines with HSP, Hsp or hsp all count: HSPA1A, HSPA1B, HSPA6, DNAJB1, HSPH1 and HSPB1."
  },
  {
    id: "lx-032", obj: ["LX.SEARCH", "LX.PIPES"], lesson: "f1-grep", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "grep -v \"^>\" sequences.fa | wc -l" },
    options: [
      { t: "6", why: "6 is the number of header lines, which `-v` removed." },
      { t: "9", why: "Correct. 15 lines minus 6 headers leaves 9 sequence lines, because some sequences wrap over two lines." },
      { t: "15", why: "That is every line in the file. `-v` removed the 6 header lines first." }
    ],
    answer: 1,
    verify: { cwd: "~/project/data" },
    explain: "`grep -v \"^>\"` keeps the lines that do not start with `>`, the sequence lines. There are 9 of them for 6 sequences, because long sequences wrap."
  },
  {
    id: "lx-033", obj: ["LX.SEARCH"], lesson: "f1-grep", level: 2,
    q: "A pipeline log has thousands of lines. You need every line that mentions an error, written as Error, ERROR or error, with line numbers so you can find them later. Which command?",
    options: [
      { t: "`grep -c error pipeline.log`", why: "`-c` only prints a count, and without `-i` it misses ERROR and Error." },
      { t: "`grep -in error pipeline.log`", why: "Correct. `-i` ignores case and `-n` adds the line number to each matching line." },
      { t: "`grep -w Error pipeline.log`", why: "This is case-sensitive, so it misses ERROR and error, and it shows no line numbers." }
    ],
    answer: 1,
    explain: "Combine options: `-i` for case-insensitive matching and `-n` for line numbers. Short options can be joined, so `-in` is the same as `-i -n`."
  },

  /* ---------- f1-wrangle ---------- */
  {
    id: "lx-034", obj: ["LX.TEXT"], lesson: "f1-wrangle", level: 1,
    q: "Which command keeps only columns 1 and 3 of a tab-separated file?",
    options: [
      { t: "`cut -c 1,3 file.tsv`", why: "`-c` selects characters: the 1st and 3rd character of each line." },
      { t: "`cut -f 1,3 file.tsv`", why: "Correct. `-f` selects fields, and cut splits lines at tabs by default." },
      { t: "`sort -k 1,3 file.tsv`", why: "sort reorders whole lines by a key; it never removes columns." }
    ],
    answer: 1,
    explain: "`cut -f` picks fields (columns), using the tab as the separator unless you set another one with `-d`."
  },
  {
    id: "lx-035", obj: ["LX.TEXT"], lesson: "f1-wrangle", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "cut -f 3,1 annotation.tsv | head -n 2" },
    options: [
      { t: "category\tsymbol\nheat_shock\tHSPA1A", why: "cut always prints fields in their original order, whatever order you list them in." },
      { t: "symbol\tchromosome\tcategory\nHSPA1A\t6\theat_shock", why: "`3,1` is a list of two fields, not a range. A range would be written 1-3." },
      { t: "symbol\tcategory\nHSPA1A\theat_shock", why: "Correct. Fields 1 and 3, printed in file order, for the first two lines." }
    ],
    answer: 2,
    verify: { cwd: "~/project/data" },
    explain: "cut cannot reorder columns: `-f 3,1` and `-f 1,3` give the same result. Reordering needs another tool, such as a few lines of Python or R."
  },
  {
    id: "lx-036", obj: ["LX.TEXT"], lesson: "f1-wrangle", level: 2,
    q: "What does this print?",
    code: { lang: "bash", src: "echo GATTACA | tr ACGT TGCA" },
    options: [
      { t: "CTAATGT", why: "Correct. tr swaps each letter for its partner: A to T, C to G, G to C and T to A." },
      { t: "TGTAATC", why: "That is the reverse complement. tr changes characters one by one but never reverses their order." },
      { t: "ACATTAG", why: "That is the sequence reversed. tr does not reorder characters." },
      { t: "GATTACA", why: "tr replaced every listed character, so the output differs from the input." }
    ],
    answer: 0,
    verify: { cwd: "~/project/data" },
    explain: "tr maps each character of the first set to the character at the same position in the second set, which gives the DNA complement. A reverse complement would also need the order reversed."
  },
  {
    id: "lx-037", obj: ["LX.TEXT"], lesson: "f1-wrangle", level: 3,
    q: "A student wants the number of different chromosomes in annotation.tsv and runs this. What does it print?",
    code: { lang: "bash", src: "tail -n +2 annotation.tsv | cut -f 2 | uniq | wc -l" },
    options: [
      { t: "9", why: "9 is the true number of distinct chromosomes, which you get only by sorting before uniq." },
      { t: "12", why: "uniq did merge the two adjacent 6 values at the top (HSPA1A and HSPA1B), so fewer than 12 lines remain." },
      { t: "11", why: "Correct, and wrong for the purpose. uniq only merges neighboring duplicates, so chromosomes 6 and 7, which appear again further down, are counted more than once." }
    ],
    answer: 2,
    verify: { cwd: "~/project/data" },
    explain: "Without sort, uniq only collapses runs of identical adjacent lines. The fix is `tail -n +2 annotation.tsv | cut -f 2 | sort | uniq | wc -l`, which prints 9."
  },
  {
    id: "lx-038", obj: ["LX.TEXT", "LX.PIPES"], lesson: "f1-wrangle", level: 3,
    q: "In counts.tsv, column 7 is heat_3. Which pipeline prints the name of the gene with the lowest heat_3 count?",
    options: [
      { t: "`sort -k7,7n counts.tsv | head -n 1 | cut -f 1`", why: "The header is not removed, and with `-n` its text value counts as 0, so the header sorts first and the answer is gene." },
      { t: "`tail -n +2 counts.tsv | sort -k7,7 | head -n 1 | cut -f 1`", why: "Without `n`, sort compares text, so 10838 (starting with 1) comes before 260, and you get HSPA1A." },
      { t: "`tail -n +2 counts.tsv | sort -k7,7n | head -n 1 | cut -f 1`", why: "Correct. It removes the header, sorts column 7 numerically from smallest to largest, keeps the first line and prints its gene name: FOS." }
    ],
    answer: 2,
    explain: "Three habits make column sorting reliable: remove the header, use `-n` for numbers, and limit the key to one column with `-k7,7`."
  },

  /* ---------- f1-pipes ---------- */
  {
    id: "lx-039", obj: ["LX.PIPES"], lesson: "f1-pipes", level: 1,
    q: "What does the pipe symbol `|` do in `grep heat_shock annotation.tsv | wc -l`?",
    options: [
      { t: "Saves grep's output in a file called wc", why: "Saving to a file is `>`. A pipe connects two commands." },
      { t: "Sends grep's output into wc as its input", why: "Correct. wc counts the lines that grep printed, so the result is the number of heat_shock genes." },
      { t: "Runs wc first and then grep", why: "Both commands run together, and data flows from left to right." }
    ],
    answer: 1,
    explain: "A pipe connects the standard output of the left command to the standard input of the right one. Nothing is written to disk in between."
  },
  {
    id: "lx-040", obj: ["LX.PIPES"], lesson: "f1-pipes", level: 1,
    q: "By default, where do a command's error messages go?",
    options: [
      { t: "To the screen, through standard error, separately from standard output", why: "Correct. That is why `> file` saves the results while errors still appear on the screen." },
      { t: "Into the same file as the output whenever you use `>`", why: "`>` redirects only standard output. Errors need `2>`, or `2>&1` to follow standard output." },
      { t: "Nowhere: errors are discarded unless you ask for them", why: "Errors are shown on the screen by default. You have to redirect them on purpose to hide or save them." }
    ],
    answer: 0,
    explain: "Commands have two output streams: standard output for results and standard error for messages. Redirect them separately with `>` and `2>`."
  },
  {
    id: "lx-041", obj: ["LX.PIPES"], lesson: "f1-pipes", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "ls missing.txt 2> err.txt\nwc -l < err.txt" },
    options: [
      { t: "1", why: "Correct. The error message from ls went into err.txt through `2>`, so the file has one line." },
      { t: "0", why: "`2>` captures standard error, so err.txt is not empty: it holds the message about missing.txt." },
      { t: "ls: cannot access 'missing.txt': No such file or directory\n1", why: "`2>` sent the message into the file, so it does not appear on the screen." }
    ],
    answer: 0,
    verify: { cwd: "~/project/data" },
    explain: "`2>` redirects standard error. The screen stays clean, and the one-line message is kept in err.txt."
  },
  {
    id: "lx-042", obj: ["LX.PIPES"], lesson: "f1-pipes", level: 2,
    q: "Trying to sort the table in place, a student runs this in `~/project/data`. What does it print?",
    code: { lang: "bash", src: "sort counts.tsv > counts.tsv\nwc -l < counts.tsv" },
    options: [
      { t: "13", why: "You would expect 13 if the file were sorted in place, but `>` empties counts.tsv before sort reads it." },
      { t: "0", why: "Correct. The shell prepares the redirection first, which empties counts.tsv; sort then reads an empty file and writes nothing." },
      { t: "12", why: "Sorting removes no lines. The whole file was emptied by the redirection." }
    ],
    answer: 1,
    verify: { cwd: "~/project/data" },
    explain: "Never redirect into a file that the same command is reading. Write to a new file, check it, then rename it: `sort counts.tsv > sorted.tsv`."
  },
  {
    id: "lx-043", obj: ["LX.PIPES", "LX.TEXT"], lesson: "f1-pipes", level: 3,
    q: "You want to save the 3 genes with the highest heat_2 counts (column 6), without the header, into `../results/top_heat2.txt`. Which line does it?",
    options: [
      { t: "`tail -n +2 counts.tsv | sort -k6,6nr | head -n 3 > ../results/top_heat2.txt`", why: "Correct. Each step feeds the next, and only the final 3 lines are written to the file." },
      { t: "`tail -n +2 counts.tsv | sort -k6,6nr > ../results/top_heat2.txt | head -n 3`", why: "`>` sends sort's full output into the file, so the file gets all 12 genes and head receives nothing." },
      { t: "`tail -n +2 counts.tsv > sort -k6,6nr | head -n 3`", why: "Here `>` writes tail's output into a file called sort, and `-k6,6nr` is handed to tail, which fails. Use `|` between commands and `>` only at the end." }
    ],
    answer: 0,
    explain: "Build pipelines from left to right with `|`, and put the redirection `>` at the very end, so the final result is what gets saved."
  },

  /* ---------- f1-permissions ---------- */
  {
    id: "lx-044", obj: ["LX.PERMS"], lesson: "f1-permissions", level: 1,
    q: "In `-rwxr-xr--`, what may users in the others class do?",
    options: [
      { t: "Read and execute", why: "`r-x` is the middle group, the file's group. Others are the last three characters." },
      { t: "Read only", why: "Correct. The last three characters, `r--`, belong to others." },
      { t: "Read, write and execute", why: "`rwx` belongs to the user (owner), the first group of three." }
    ],
    answer: 1,
    explain: "After the type character come three groups of three: user, group and others. Here the user has rwx, the group r-x and others r--."
  },
  {
    id: "lx-045", obj: ["LX.PERMS"], lesson: "f1-permissions", level: 1,
    q: "What does `chmod +x run_qc.sh` do?",
    options: [
      { t: "Runs the script", why: "chmod only changes permissions. You run the script afterwards, for example with `./run_qc.sh`." },
      { t: "Makes the file writable by everyone", why: "Write permission is `w`. `+x` adds execute permission." },
      { t: "Adds execute permission, so the script can be run with `./run_qc.sh`", why: "Correct. Without x, running it directly gives Permission denied." }
    ],
    answer: 2,
    explain: "`+x` adds execute permission (for everyone, with the usual default settings). `u+x` would add it for the owner only."
  },
  {
    id: "lx-046", obj: ["LX.PERMS"], lesson: "f1-permissions", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "chmod 640 counts.tsv\nls -l counts.tsv | cut -c 1-10" },
    options: [
      { t: "-rw-r-----", why: "Correct. 6 = rw- for the user, 4 = r-- for the group and 0 = --- for others." },
      { t: "-rw-r--r--", why: "That is 644. The final 0 removes all permissions for others." },
      { t: "-rwxr-----", why: "6 is 4 + 2, read and write. Execute as well would need 7." }
    ],
    answer: 0,
    verify: { cwd: "~/project/data" },
    explain: "Each digit is the sum of r = 4, w = 2 and x = 1, for user, group and others in turn. `cut -c 1-10` keeps just the type and permission characters."
  },
  {
    id: "lx-047", obj: ["LX.PERMS"], lesson: "f1-permissions", level: 3,
    q: "Your labmate cannot read `/data/lab/counts_all.tsv`, which you created. `ls -l` shows `-rw------- 1 you lab ...`, and you both belong to the group lab. Which command lets group members read the file without letting them change it?",
    options: [
      { t: "`chmod 777 counts_all.tsv`", why: "This gives every user on the server read, write and execute permission, far more than needed." },
      { t: "`chmod u+r counts_all.tsv`", why: "You, the user, can already read it. This changes nothing for the group." },
      { t: "`chmod g+r counts_all.tsv`", why: "Correct. The file belongs to the group lab, and `g+r` gives that group read access only." }
    ],
    answer: 2,
    explain: "Give the smallest permission that solves the problem: the group needs to read, so add `r` for `g`. The result is `-rw-r-----`."
  },

  /* ---------- f1-archive-net ---------- */
  {
    id: "lx-048", obj: ["LX.ARCHIVE"], lesson: "f1-archive-net", level: 1,
    q: "What is the difference between an archive and compression?",
    options: [
      { t: "An archive bundles many files into one; compression makes data take less space", why: "Correct. tar archives, gzip compresses, and `tar -z` does both." },
      { t: "They are the same thing", why: "`tar -cf` makes an archive without compressing it, and gzip compresses without bundling. They are separate steps." },
      { t: "Compression bundles folders; an archive shrinks single files", why: "This swaps the two ideas: archiving bundles, compression shrinks." }
    ],
    answer: 0,
    explain: "A .tar.gz file is both: a tar archive that has then been compressed with gzip."
  },
  {
    id: "lx-049", obj: ["LX.ARCHIVE"], lesson: "f1-archive-net", level: 1,
    q: "Which command extracts `genome.tar.gz` into the current folder?",
    options: [
      { t: "`tar -czf genome.tar.gz`", why: "`c` creates an archive. With no files listed, tar refuses to create an empty archive." },
      { t: "`tar -xzf genome.tar.gz`", why: "Correct. x extracts, z handles the gzip compression and f names the archive." },
      { t: "`gzip genome.tar.gz`", why: "gzip compresses, and it refuses this file because the name already ends in .gz." }
    ],
    answer: 1,
    explain: "The tar letters: c create, t list, x extract, z gzip, f file name. List with `-tzf` before extracting with `-xzf`."
  },
  {
    id: "lx-050", obj: ["LX.ARCHIVE"], lesson: "f1-archive-net", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "tar -czf tables.tar.gz *.tsv\ntar -tzf tables.tar.gz | wc -l" },
    options: [
      { t: "1", why: "The archive is one file, but `-t` lists each file stored inside it." },
      { t: "5", why: "`*.tsv` matches only the three tables, not the FASTA and FASTQ files." },
      { t: "3", why: "Correct. The archive holds annotation.tsv, counts.tsv and samples.tsv, and tar lists one per line." }
    ],
    answer: 2,
    verify: { cwd: "~/project/data" },
    explain: "The shell expanded `*.tsv` into three names before tar ran, so the archive holds three files."
  },
  {
    id: "lx-051", obj: ["LX.ARCHIVE"], lesson: "f1-archive-net", level: 3,
    q: "A public database provides reads as `sample.fastq.gz` (2 GB), and your tools can read .gz files directly. What is the best practice?",
    options: [
      { t: "Keep the file compressed and let your tools, or `zcat`, read it when needed", why: "Correct. It saves disk space, and decompression happens on the fly." },
      { t: "Decompress it with gunzip before every analysis", why: "The plain file would be several times larger, and decompressing again and again wastes time and space." },
      { t: "Compress it again with gzip to save more space", why: "Compressed data barely shrinks a second time, and gzip refuses a name that already ends in .gz." }
    ],
    answer: 0,
    explain: "Sequencing reads usually stay compressed for their whole life. `zcat sample.fastq.gz | head` lets you look inside."
  },
  {
    id: "lx-052", obj: ["LX.NET"], lesson: "f1-archive-net", level: 1,
    q: "What does `ping -c 4 server.example.org` tell you?",
    options: [
      { t: "How much data is stored on the server", why: "ping sends tiny test messages; it knows nothing about storage." },
      { t: "Whether that computer answers over the network, and how long each round trip takes", why: "Correct. `-c 4` sends four test messages and then stops." },
      { t: "It downloads four files from the server", why: "ping downloads nothing. Downloads use wget or curl." }
    ],
    answer: 1,
    explain: "ping is a quick reachability test. If a server does not answer, the cause may be the network, the server, or a firewall that blocks ping."
  },
  {
    id: "lx-053", obj: ["LX.NET"], lesson: "f1-archive-net", level: 1,
    q: "Which command prints the name of the computer you are logged in to?",
    options: [
      { t: "`hostname`", why: "Correct. It prints the computer's network name, such as biobridge." },
      { t: "`whoami`", why: "whoami prints your user name, not the computer's name." },
      { t: "`uname -r`", why: "`uname -r` prints the kernel release, a version number." }
    ],
    answer: 0,
    explain: "The host name identifies the machine. The prompt usually shows it after the `@`, as in student@biobridge."
  },
  {
    id: "lx-054", obj: ["LX.NET"], lesson: "f1-archive-net", level: 2,
    q: "You run `curl https://example.org/genes.txt`, and the gene list scrolls past on the screen, but no file appears. Why?",
    options: [
      { t: "The download failed", why: "You saw the content, so the transfer worked. It was shown rather than saved." },
      { t: "curl saved the file in your home directory", why: "Without `-o` or `-O`, curl saves nothing anywhere." },
      { t: "curl writes what it downloads to standard output unless you add `-o name` or `-O`", why: "Correct. `curl -O URL` saves under the remote name, and `curl -o genes.txt URL` lets you choose one." }
    ],
    answer: 2,
    explain: "curl prints what it receives, which is handy in pipes. wget saves to a file by default."
  },
  {
    id: "lx-055", obj: ["LX.NET"], lesson: "f1-archive-net", level: 3,
    q: "You need a 30 GB reference file for an analysis that will run on a Linux server. What is the best approach?",
    options: [
      { t: "Download it to your laptop, then copy it to the server", why: "That moves 30 GB twice and needs space on the laptop." },
      { t: "Log in to the server and download it there directly with `wget URL` or `curl -O URL`", why: "Correct. The file goes straight to where it will be used, usually over a much faster connection." },
      { t: "Use `ping` to check that the file is complete", why: "ping tests whether a computer answers; it cannot check files." }
    ],
    answer: 1,
    explain: "Downloading on the server avoids a double transfer. Afterwards, check the file size, or a checksum if the database publishes one, to confirm the download is complete."
  },

  /* ---------- f1-editors ---------- */
  {
    id: "lx-056", obj: ["LX.EDIT"], lesson: "f1-editors", level: 1,
    q: "nano's shortcut list shows `^X Exit`. What does `^X` mean?",
    options: [
      { t: "Press Ctrl and X together", why: "Correct. In nano's help lines, `^` stands for the Ctrl key." },
      { t: "Type the caret character ^ and then X", why: "That would insert those characters into your file. `^` is shorthand for Ctrl." },
      { t: "Press Shift and X together", why: "Shift+X types a capital X into the file." }
    ],
    answer: 0,
    explain: "nano lists its main shortcuts at the bottom of the screen, written with `^` for Ctrl: `^O` writes out (saves) and `^X` exits."
  },
  {
    id: "lx-057", obj: ["LX.EDIT"], lesson: "f1-editors", level: 1,
    q: "In Vim, you pressed `i` and typed some text. What must you press before typing `:wq`?",
    options: [
      { t: "Ctrl+O", why: "That is nano's save shortcut. In Vim, save and quit commands are typed in normal mode." },
      { t: "Esc, to return to normal mode", why: "Correct. In insert mode, `:wq` would simply be typed into the file." },
      { t: "Enter", why: "Enter in insert mode starts a new line of text; it does not leave insert mode." }
    ],
    answer: 1,
    explain: "Vim has modes. `i` enters insert mode for typing; Esc returns to normal mode, where `:w`, `:q`, `:wq` and `:q!` are commands."
  },
  {
    id: "lx-058", obj: ["LX.EDIT"], lesson: "f1-editors", level: 2,
    q: "On a Fedora or Rocky Linux server where you have superuser rights, which command installs the program tree?",
    options: [
      { t: "`sudo apt install tree`", why: "apt is the package manager of Debian and Ubuntu. Fedora and Rocky Linux use dnf." },
      { t: "`chmod +x tree`", why: "chmod changes the permissions of an existing file; it installs nothing." },
      { t: "`sudo dnf install tree`", why: "Correct. dnf is the package manager of the Fedora and Red Hat family, and sudo gives it the rights to install." }
    ],
    answer: 2,
    explain: "Each distribution family has its own package manager: apt for Debian and Ubuntu, dnf for Fedora, Red Hat and Rocky Linux."
  },
  {
    id: "lx-059", obj: ["LX.EDIT"], lesson: "f1-editors", level: 3,
    q: "You need samtools on a shared university cluster where you have no sudo rights. What is the usual approach?",
    options: [
      { t: "Use the cluster's software modules (`module load`) or install it into your own conda environment", why: "Correct. Both work without superuser rights and let you record the exact version you used." },
      { t: "Run `sudo apt install samtools` anyway", why: "Without superuser rights the command is refused. Ordinary users of shared clusters cannot install system packages." },
      { t: "Copy the samtools program from a friend's laptop", why: "A program built for another system or processor may not run, and its dependencies and version would be unknown." }
    ],
    answer: 0,
    explain: "On shared systems, software comes from modules provided by the administrators or from user-level tools such as conda, where many bioinformatics programs are available from the Bioconda channel."
  },

  /* ---------- f1-scripts ---------- */
  {
    id: "lx-060", obj: ["LX.SCRIPT"], lesson: "f1-scripts", level: 1,
    q: "Inside a script run as `./count_seqs.sh sequences.fa`, what does `$1` hold?",
    options: [
      { t: "./count_seqs.sh", why: "The script's own name is `$0`. The numbering of arguments starts after the name." },
      { t: "sequences.fa", why: "Correct. `$1` is the first command-line argument." },
      { t: "1", why: "`$1` is the value of the first argument, not the number one." }
    ],
    answer: 1,
    explain: "Arguments are numbered from 1: `$1`, `$2` and so on; `$#` counts them and `$@` holds them all."
  },
  {
    id: "lx-061", obj: ["LX.SCRIPT"], lesson: "f1-scripts", level: 1,
    q: "In a script, what does `$#` contain?",
    options: [
      { t: "The number of command-line arguments given to the script", why: "Correct. A script can check it to make sure it received a file name." },
      { t: "The number of lines in the script", why: "`$#` has nothing to do with the script's length; it counts the arguments passed in when the script was started." },
      { t: "The exit status of the last command", why: "That is `$?`." }
    ],
    answer: 0,
    explain: "`$#` is the number of arguments. A common safety check at the top of a script is `if [ $# -eq 0 ]; then echo \"Usage: ./count_seqs.sh FILE\"; exit 1; fi`."
  },
  {
    id: "lx-062", obj: ["LX.SCRIPT"], lesson: "f1-scripts", level: 2,
    q: "What does this print?",
    code: { lang: "bash", src: "name=heat_1\necho \"Sample: $name\"\necho 'Sample: $name'" },
    options: [
      { t: "Sample: heat_1\nSample: heat_1", why: "Single quotes keep text exactly as written, so `$name` is not replaced in the second line." },
      { t: "Sample: $name\nSample: $name", why: "Double quotes allow variables, so `$name` is replaced by heat_1 in the first line." },
      { t: "Sample: heat_1\nSample: $name", why: "Correct. Double quotes expand variables; single quotes do not." }
    ],
    answer: 2,
    verify: { cwd: "~/project/data" },
    explain: "Use double quotes around variables, as in `\"$file\"`, so their values are inserted and spaces are kept, and single quotes when you want literal text."
  },
  {
    id: "lx-063", obj: ["LX.SCRIPT"], lesson: "f1-scripts", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "echo \"Found $(grep -c heat_shock annotation.tsv) heat-shock genes\"" },
    options: [
      { t: "Found 7 heat-shock genes", why: "Correct. `$( )` runs grep and puts its output, 7, into the text." },
      { t: "Found $(grep -c heat_shock annotation.tsv) heat-shock genes", why: "Double quotes allow command substitution, so the command is run, not printed." },
      { t: "Found heat_shock heat-shock genes", why: "Command substitution inserts the command's output, not its pattern." }
    ],
    answer: 0,
    verify: { cwd: "~/project/data" },
    explain: "Command substitution, `$(command)`, is replaced by the command's output. It works inside double quotes but not inside single quotes."
  },
  {
    id: "lx-064", obj: ["LX.SCRIPT"], lesson: "f1-scripts", level: 3,
    q: "A script line reads `total = $(wc -l < counts.tsv)`, and Bash reports `total: command not found`. What is the fix?",
    options: [
      { t: "Put the command in single quotes: `total='wc -l < counts.tsv'`", why: "Single quotes store the text itself, so the command would never run." },
      { t: "Remove the spaces around `=`: `total=$(wc -l < counts.tsv)`", why: "Correct. With spaces, Bash reads total as a command name; without them, the line is an assignment." },
      { t: "Make counts.tsv executable with `chmod +x`", why: "Data files do not need execute permission. The error names total, the first word, as the unknown command." }
    ],
    answer: 1,
    explain: "Variable assignment in Bash is `name=value` with no spaces. The error message names the word Bash tried to run, which points straight to the problem."
  },
  {
    id: "lx-065", obj: ["LX.SCRIPT"], lesson: "f1-scripts", level: 3,
    q: "A script reports reads as `$((lines / 4))`. For a damaged FASTQ file with 30 lines it prints 7. Why is this dangerous, and what would catch it?",
    options: [
      { t: "Bash arithmetic drops the remainder, so the broken last record goes unnoticed; checking that `$((lines % 4))` is 0 would catch it", why: "Correct. 30 / 4 is 7 with remainder 2, and a non-zero remainder means the file does not consist of complete records." },
      { t: "Bash rounds 7.5 up or down at random, so the result changes between runs", why: "Bash integer division always drops the remainder; the result is the same every time." },
      { t: "Bash cannot divide, so the number 7 is meaningless", why: "Bash divides whole numbers correctly. The problem is that the input file is incomplete." }
    ],
    answer: 0,
    explain: "`$(( ))` works with whole numbers: `/` drops the remainder and `%` gives it. Testing the remainder turns a silent error into a visible one."
  },

  /* ---------- f1-script-logic ---------- */
  {
    id: "lx-066", obj: ["LX.LOGIC"], lesson: "f1-script-logic", level: 1,
    q: "What does this print?",
    code: { lang: "bash", src: "for s in ctrl_1 heat_1; do echo \"$s.fastq\"; done" },
    options: [
      { t: "ctrl_1.fastq\nheat_1.fastq", why: "Correct. The loop runs once for each word in the list, and echo prints one line each time." },
      { t: "ctrl_1 heat_1.fastq", why: "The loop does not join its items; it handles them one at a time." },
      { t: "$s.fastq\n$s.fastq", why: "Double quotes allow variables, so `$s` is replaced by the current item." }
    ],
    answer: 0,
    verify: { cwd: "~/project/data" },
    explain: "`for VAR in LIST` sets the variable to each item in turn. Loops like this build file names for every sample."
  },
  {
    id: "lx-067", obj: ["LX.LOGIC"], lesson: "f1-script-logic", level: 2,
    q: "In `~/project/data`, what does this print?",
    code: { lang: "bash", src: "n=$(grep -c \">\" sequences.fa)\nif [ $n -gt 5 ]; then echo \"many\"; else echo \"few\"; fi" },
    options: [
      { t: "few", why: "n is 6, and 6 is greater than 5, so the then branch runs." },
      { t: "6", why: "The assignment stores 6 silently; only the echo commands print anything." },
      { t: "many", why: "Correct. n is 6, and `-gt` means greater than, so the test is true." }
    ],
    answer: 2,
    verify: { cwd: "~/project/data" },
    explain: "`$( )` stored grep's count in n, and `[ $n -gt 5 ]` compared numbers. Inside `[ ]`, numbers are compared with `-gt`, `-lt` and similar tests."
  },
  {
    id: "lx-068", obj: ["LX.LOGIC"], lesson: "f1-script-logic", level: 2,
    q: "What does this print?",
    code: { lang: "bash", src: "n=0\nwhile [ $n -lt 3 ]; do n=$((n + 1)); done\necho $n" },
    options: [
      { t: "2", why: "The loop runs while n is less than 3: it adds 1 when n is 0, 1 and 2, so n ends at 3." },
      { t: "3", why: "Correct. The test fails once n reaches 3, the loop ends, and echo prints 3." },
      { t: "0", why: "The loop body changes n on every pass, so it does not stay 0." }
    ],
    answer: 1,
    verify: { cwd: "~/project/data" },
    explain: "A while loop repeats until its test is false. Here the body increases n, which eventually makes `$n -lt 3` false."
  },
  {
    id: "lx-069", obj: ["LX.LOGIC", "LX.SCRIPT"], lesson: "f1-script-logic", level: 3,
    q: "You have 200 FASTQ files named like heat_1.fastq.gz. Which loop runs a tool called qc_tool on each file and saves each report under the sample's name, such as heat_1.report.txt?",
    options: [
      { t: "`qc_tool *.fastq.gz > report.txt`", why: "This is one run on all the files, with every result mixed into a single file; nothing is named per sample." },
      { t: "`for f in *.fastq.gz; do qc_tool \"$f\" > \"$(basename \"$f\" .fastq.gz).report.txt\"; done`", why: "Correct. The loop handles each file, and basename turns heat_1.fastq.gz into heat_1 for the report name." },
      { t: "`for f in *.fastq.gz; do qc_tool \"$f\" > report.txt; done`", why: "`>` replaces report.txt on every pass, so only the last sample's report survives." }
    ],
    answer: 1,
    explain: "Loop over the files, and build each output name from the input name with basename. One output per sample keeps results traceable."
  },
  {
    id: "lx-070", obj: ["LX.LOGIC"], lesson: "f1-script-logic", level: 3,
    q: "A loop `for f in *.fastq; do ...; done` runs once, and the tool inside complains that it cannot open a file literally named `*.fastq`. What happened?",
    options: [
      { t: "Bash loops cannot use wildcards", why: "They can: the shell expands the pattern before the loop starts, as long as something matches." },
      { t: "No file matched the pattern, so Bash left `*.fastq` unchanged and passed it on as a name", why: "Correct. A common cause is that the files are actually named .fastq.gz, or that the loop runs in the wrong folder." },
      { t: "The loop must use `ls *.fastq` instead of `*.fastq`", why: "The shell expands patterns itself, and adding ls does not help when nothing matches." }
    ],
    answer: 1,
    explain: "An unmatched pattern stays as literal text. Check with `ls *.fastq` in the same folder, and guard the loop body with `[ -e \"$f\" ]`."
  },

  /* ---------- f1-cron ---------- */
  {
    id: "lx-071", obj: ["LX.CRON"], lesson: "f1-cron", level: 1,
    q: "What does the first field of a crontab line specify?",
    options: [
      { t: "The hour", why: "The hour is the second field. The order is minute, hour, day of month, month, day of week." },
      { t: "The day of the week", why: "Day of week is the fifth and last time field." },
      { t: "The minute", why: "Correct. Putting the hour first is a common mistake." }
    ],
    answer: 2,
    explain: "The five fields are minute (0 to 59), hour (0 to 23), day of month, month and day of week, followed by the command."
  },
  {
    id: "lx-072", obj: ["LX.CRON"], lesson: "f1-cron", level: 2,
    q: "What does the schedule `0 */6 * * *` mean?",
    options: [
      { t: "Every 6 minutes", why: "The minute field is 0. `*/6` is in the hour field." },
      { t: "At minute 0 of every sixth hour: 00:00, 06:00, 12:00 and 18:00", why: "Correct. `*/6` in the hour field means every 6th hour, starting from 0." },
      { t: "Once a day at 06:00", why: "That would be `0 6 * * *`. `*/6` repeats every 6 hours." }
    ],
    answer: 1,
    explain: "`*/N` means every Nth value of that field. In the hour field, `*/6` gives the hours 0, 6, 12 and 18."
  },
  {
    id: "lx-073", obj: ["LX.CRON"], lesson: "f1-cron", level: 2,
    q: "`crontab -l` shows three jobs, and you want to stop only one of them. What should you do?",
    options: [
      { t: "Run `crontab -r`", why: "`crontab -r` removes your entire crontab, all three jobs, without asking." },
      { t: "Delete the script that the job runs", why: "The job stays scheduled: cron keeps trying to run it and fails every time." },
      { t: "Run `crontab -e`, delete that job's line and save", why: "Correct. Editing the crontab removes just that job." }
    ],
    answer: 2,
    explain: "`crontab -e` edits, `crontab -l` lists and `crontab -r` removes everything. To remove one job, edit it out."
  },
  {
    id: "lx-074", obj: ["LX.CRON"], lesson: "f1-cron", level: 3,
    q: "You want a script to refresh a local copy of a reference database every Sunday at 03:00 and to keep a record of each run. Which crontab line is best?",
    options: [
      { t: "`0 3 * * 0 /home/ana/bin/update_db.sh >> /home/ana/logs/update_db.log 2>&1`", why: "Correct. Minute 0, hour 3, day of week 0 (Sunday), an absolute path, and output plus errors appended to a log." },
      { t: "`0 3 * * 0 update_db.sh`", why: "The schedule is right, but cron may not find a script given without its path, and without a log you cannot see what happened." },
      { t: "`3 0 * * 0 /home/ana/bin/update_db.sh >> /home/ana/logs/update_db.log 2>&1`", why: "Minute comes first, so this runs at 00:03, not 03:00." }
    ],
    answer: 0,
    explain: "A good cron line combines the right schedule, absolute paths and a log: `>> log 2>&1` appends both output and errors."
  },

  /* ---------- f1-bio-recipes ---------- */
  {
    id: "lx-075", obj: ["LX.SEARCH"], lesson: "f1-bio-recipes", level: 3,
    q: "Why is counting the lines that start with `@` an unsafe way to count reads in real FASTQ files?",
    options: [
      { t: "FASTQ headers start with `>`, not `@`", why: "That is FASTA. FASTQ headers do start with `@`; the trouble is that other lines can too." },
      { t: "`@` is also a valid quality character, so a quality line can start with `@` and be counted as an extra read", why: "Correct. Divide the number of lines by 4 instead." },
      { t: "grep cannot search for symbols such as `@`", why: "grep can search for any character; special ones only need quoting." }
    ],
    answer: 1,
    explain: "In FASTQ quality strings, `@` encodes a quality score, so `grep -c \"^@\"` can overcount. The number of lines divided by 4 is the reliable count."
  },
  {
    id: "lx-076", obj: ["LX.SEARCH"], lesson: "f1-bio-recipes", level: 2,
    q: "Starting in `~/project/data`, what does this print?",
    code: { lang: "bash", src: "cp sequences.fa a.fa\ncp sequences.fa b.fa\ngrep -c \"^>\" *.fa" },
    options: [
      { t: "18", why: "grep -c reports each file separately when it is given several files; it does not add the counts up." },
      { t: "a.fa:6\nb.fa:6\nsequences.fa:6", why: "Correct. With more than one file, grep -c prints each file name, a colon and that file's count." },
      { t: "6", why: "grep processes every file it is given, not only the first one." }
    ],
    answer: 1,
    verify: { cwd: "~/project/data" },
    explain: "`*.fa` expands to three files, and grep -c prints one count per file. This is a quick way to check many FASTA files at once."
  },
  {
    id: "lx-077", obj: ["LX.SEARCH", "LX.TEXT"], lesson: "f1-bio-recipes", level: 3,
    q: "A student wants the genes on chromosome 6 and runs this in `~/project/data`. What does it print?",
    code: { lang: "bash", src: "grep -w 6 annotation.tsv | cut -f 1" },
    options: [
      { t: "HSPA1A\nHSPA1B\nEEF1A1", why: "That is the right biological answer, but grep searched the whole line. The description of HSPA6 ends with \"member 6\", which is also the whole word 6." },
      { t: "HSPA1A\nHSPA1B\nHSPA6\nEEF1A1", why: "Correct, and biologically wrong for HSPA6: it is on chromosome 1, but its description contains the word 6." },
      { t: "HSPA6", why: "With `-w`, 6 must be a whole word. In the symbol HSPA6 it is part of a longer word, and three genes really are on chromosome 6." }
    ],
    answer: 1,
    verify: { cwd: "~/project/data" },
    explain: "grep matches anywhere on the line. Search only the column you mean: `cut -f 1,2 annotation.tsv | grep -w 6` gives HSPA1A, HSPA1B and EEF1A1."
  },
  {
    id: "lx-078", obj: ["LX.NAV", "LX.PATHS"], lesson: "f1-navigate", level: 3,
    q: "Starting in `~/project/data`, a student moves to the scripts folder and runs the sequence counter on the FASTA file. What is printed?",
    code: { lang: "bash", src: "cd ../scripts\nbash count_seqs.sh ../data/sequences.fa" },
    options: [
      { t: "../data/sequences.fa contains 6 sequences", why: "Correct. After `cd ../scripts` the script is in the current folder, and `../data/sequences.fa` climbs to project and goes down into data, where the file is." },
      { t: "sequences.fa contains 6 sequences", why: "The script prints `$file` exactly as it was given, and it was given `../data/sequences.fa`, path included." },
      { t: "grep: ../data/sequences.fa: No such file or directory", why: "From scripts, `..` is project, and project contains data. The path is valid from the new folder." },
      { t: "bash: count_seqs.sh: No such file or directory", why: "After `cd ../scripts` you are inside the folder that holds count_seqs.sh, so bash finds it. `bash FILE` also works without execute permission." }
    ],
    answer: 0,
    verify: { cwd: "~/project/data" },
    explain: "Every relative path is read from the folder you are in at that moment. After `cd`, file names that worked before need `../data/` in front, which is why scripts often take full paths as arguments."
  }
);
