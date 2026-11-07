/* Foundation 1 terminal missions (simulated shell). Written to tools/CONTENT_GUIDE.md, section 7.
   Mission ids match the lesson ids that use them. Each mission assumes the practice file system as defined in content/vfs.js.
   Expected outputs were checked with real Bash using tools/run_in_vfs.py. */
window.BB = window.BB || {};
BB.missions = BB.missions || {};

BB.missions['f1-terminal'] = {
  title: 'First commands on the server',
  start: '/home/student/project/data',
  intro: 'You have just logged in to the practice server. Before touching any data, find out who and where you are, then run your first counting command.',
  steps: [
    { goal: 'Print your user name.', hint: 'The command reads like a question: who am I?', solution: 'whoami',
      check: { cmd: 'whoami', outputIncludes: 'student' },
      explain: '`whoami` prints the name of the user you are logged in as. On a shared server, this confirms you are working under your own account.' },
    { goal: 'Print the name of this computer.', hint: 'A computer\'s name on a network is its host name.', solution: 'hostname',
      check: { cmd: 'hostname', outputIncludes: 'biobridge' },
      explain: 'The prompt also shows the host name after the `@`. When you work on several servers, checking it prevents running a job on the wrong one.' },
    { goal: 'Show the system information, including the kernel name and release.', hint: '`uname` on its own prints the kernel name; the option `-a` (all) prints everything.', solution: 'uname -a',
      check: { cmd: 'uname', outputIncludes: 'Linux' },
      explain: '`uname` prints Linux, the kernel name. `-a` adds the host name, kernel release and machine type, which is useful when you report a problem with a tool.' },
    { goal: 'Show how much disk space is free, in human-readable units.', hint: '`df` (disk free) with the option for human-readable sizes.', solution: 'df -h',
      check: { cmd: 'df' },
      explain: '`df -h` lists each storage area with its size, used and available space, in units such as K, M and G. Check it before writing large files.' },
    { goal: 'Count the lines in counts.tsv.', hint: '`wc` with the option for lines, then the file name.', solution: 'wc -l counts.tsv',
      check: { cmd: 'wc', outputIncludes: '13' },
      explain: '13 lines: one header line plus 12 genes. Name (`wc`), option (`-l`), argument (`counts.tsv`): every command you meet follows this pattern.' },
    { goal: 'Open the manual page for wc and find what -l means.', hint: '`man` followed by the name of the command you want help with.', solution: 'man wc',
      check: { cmd: 'man' },
      explain: 'Manual pages describe every option of a command. In a real terminal you scroll with the arrow keys, search with `/` and quit with `q`.' }
  ],
  done: 'You ran informational commands and read a command as name, options and arguments. These are the first checks to make on any new server.'
};

BB.missions['f1-navigate'] = {
  title: 'Find your way around the project',
  start: '/home/student',
  intro: 'You are in your home directory on the practice server. Explore it, find the hidden settings file, and walk through the project folders.',
  steps: [
    { goal: 'Print the path of the folder you are in.', hint: 'print working directory', solution: 'pwd',
      check: { cmd: 'pwd', outputIncludes: '/home/student' },
      explain: '`/home/student` is your home directory, where you start after logging in. The prompt shows it as `~`.' },
    { goal: 'List everything in your home directory, including hidden files.', hint: '`ls` with the option that shows all entries.', solution: 'ls -a',
      check: { cmd: 'ls', outputIncludes: '.bashrc' },
      explain: '`.bashrc` is a hidden settings file that Bash reads when an interactive shell starts. `.` and `..` stand for the current and the parent directory.' },
    { goal: 'Move into the project folder.', hint: '`cd` followed by the folder name. Try typing `cd pro` and pressing Tab.', solution: 'cd project',
      check: { cwd: '/home/student/project' },
      explain: 'You used a relative path: the folder project inside the current folder. Tab completion can finish names like this for you.' },
    { goal: 'Without leaving project, list the contents of the data folder.', hint: '`ls` accepts a folder name as an argument.', solution: 'ls data',
      check: { cmd: 'ls', outputIncludes: 'sequences.fa' },
      explain: '`ls data` looks into another folder without moving there. Your working directory is still project.' },
    { goal: 'Move into the data folder.', hint: '`cd` and the folder name.', solution: 'cd data',
      check: { cwd: '/home/student/project/data' },
      explain: 'You are now two levels below your home directory. `pwd` would print `/home/student/project/data`.' },
    { goal: 'Move to the results folder with one relative path that goes up one level first.', hint: '`..` is the parent directory, project. From there, go down into results.', solution: 'cd ../results',
      check: { cwd: '/home/student/project/results' },
      explain: '`..` took you up to project and `results` down again. `ls` here prints nothing, because the folder is still empty, and that is not an error.' }
  ],
  done: 'You used pwd, ls and cd with relative paths, including `..`. On a real server, this is how you reach your data before every analysis.'
};

BB.missions['f1-manage'] = {
  title: 'Organize the project folder',
  start: '/home/student/project',
  intro: 'The results folder is empty. Create a place for tables, make a safe copy of the count table, and practice finding and deleting files.',
  steps: [
    { goal: 'Create a folder called tables inside results.', hint: '`mkdir` followed by the path of the new folder.', solution: 'mkdir results/tables',
      check: { exists: '/home/student/project/results/tables' },
      explain: '`mkdir` prints nothing on success. `results/tables` is a relative path from project.' },
    { goal: 'Copy data/counts.tsv into results/tables.', hint: '`cp SOURCE DESTINATION`. The destination can be a folder.', solution: 'cp data/counts.tsv results/tables/',
      check: { exists: '/home/student/project/results/tables/counts.tsv' },
      explain: 'Copying into a folder keeps the file name. The original in data is untouched, which is exactly what you want for raw data.' },
    { goal: 'Rename the copy to counts_backup.tsv.', hint: 'Renaming is moving to a new name: `mv OLD NEW`.', solution: 'mv results/tables/counts.tsv results/tables/counts_backup.tsv',
      check: { cmd: 'mv', exists: '/home/student/project/results/tables/counts_backup.tsv', notExists: '/home/student/project/results/tables/counts.tsv' },
      explain: 'Linux has no separate rename command for single files: `mv` to a new name in the same folder renames it.' },
    { goal: 'Find every FASTA file (name ending in .fa) anywhere in the project.', hint: '`find` needs a starting folder (`.` means here) and `-name` with a quoted pattern.', solution: 'find . -name "*.fa"',
      check: { cmd: 'find', outputIncludes: 'sequences.fa' },
      explain: '`find` searched every folder below the current one. The quotes make sure that `find`, not the shell, receives the `*` pattern.' },
    { goal: 'Create an empty file called scratch.txt in results/tables.', hint: '`touch` creates empty files.', solution: 'touch results/tables/scratch.txt',
      check: { exists: '/home/student/project/results/tables/scratch.txt' },
      explain: '`touch` is handy for creating placeholder files, and for practicing on a file that does not matter.' },
    { goal: 'Delete scratch.txt.', hint: '`rm` followed by the path. There is no undo, so read the path before pressing Enter.', solution: 'rm results/tables/scratch.txt',
      check: { cmd: 'rm', notExists: '/home/student/project/results/tables/scratch.txt' },
      explain: 'The file is gone for good. Practicing on a scratch file is the right habit before deleting anything important.' }
  ],
  done: 'You created, copied, renamed, found and deleted files. Real projects use exactly these steps to keep raw data safe and results organized.'
};

BB.missions['f1-view'] = {
  title: 'Take a first look at the data',
  start: '/home/student/project/data',
  intro: 'A collaborator sent you these files. Before any analysis, look inside them and count what they contain.',
  steps: [
    { goal: 'Show only the first FASTQ record of reads.fastq (its first 4 lines).', hint: '`head` with `-n` and a number of lines.', solution: 'head -n 4 reads.fastq',
      check: { cmd: 'head', outputEquals: '@READ_0001\nAACAATGACGGGAGAAGGAAAAAGTTGGAAACTCAA\n+\nIHHHAGGFEEBCCECB?@C@@@AA@@<6?<=*<,<=' },
      explain: 'One FASTQ record: a header starting with `@`, the bases, a `+` separator line, and one quality character per base.' },
    { goal: 'Count the lines in reads.fastq.', hint: '`wc` with the option for lines.', solution: 'wc -l reads.fastq',
      check: { cmd: 'wc', outputIncludes: '32' },
      explain: '32 lines divided by 4 lines per read gives 8 reads.' },
    { goal: 'Show the last 2 lines of counts.tsv.', hint: '`tail` works like `head`, from the end of the file.', solution: 'tail -n 2 counts.tsv',
      check: { cmd: 'tail', outputEquals: 'TP53\t613\t868\t714\t881\t603\t605\nFOS\t220\t223\t277\t311\t1906\t260' },
      explain: 'The file ends with complete rows for TP53 and FOS. Checking the end of a file is how you spot a truncated download.' },
    { goal: 'Print counts.tsv without its header line.', hint: '`tail -n +NUMBER` starts printing at that line number.', solution: 'tail -n +2 counts.tsv',
      check: { cmd: 'tail', outputEquals: 'HSPA1A\t212\t282\t203\t11018\t8441\t10838\nHSPA1B\t172\t202\t155\t10345\t7330\t7541\nHSPA6\t2\t0\t3\t999\t725\t1133\nDNAJB1\t813\t1035\t1100\t6820\t5530\t6641\nHSPH1\t1554\t2122\t1552\t6178\t4240\t6034\nHSPB1\t2541\t2722\t2736\t5990\t3295\t4989\nBAG3\t270\t511\t552\t2094\t1511\t1438\nACTB\t44289\t46223\t46941\t55945\t39466\t49070\nGAPDH\t35384\t42943\t41517\t48101\t32068\t37159\nEEF1A1\t98622\t107855\t109432\t129222\t86182\t109219\nTP53\t613\t868\t714\t881\t603\t605\nFOS\t220\t223\t277\t311\t1906\t260' },
      explain: '`-n +2` means "start at line 2". Skipping the header like this is needed before sorting or counting data rows.' },
    { goal: 'Count the lines in sequences.fa. Is that the number of sequences?', hint: 'The same command you used for reads.fastq.', solution: 'wc -l sequences.fa',
      check: { cmd: 'wc', outputIncludes: '15' },
      explain: '15 lines, but only 6 sequences: long sequences wrap onto a second line. To count FASTA records you count header lines, which is the next lesson.' },
    { goal: 'Open annotation.tsv in the pager.', hint: '`less FILE`; in a real terminal, `q` quits.', solution: 'less annotation.tsv',
      check: { cmd: 'less' },
      explain: '`less` shows one screen at a time and does not need to read the whole file first, so it opens even very large files quickly.' }
  ],
  done: 'You inspected records, headers and file endings, and saw that lines are not always records. These checks take seconds and prevent hours of confusion.'
};

BB.missions['f1-grep'] = {
  title: 'Find the heat-shock genes',
  start: '/home/student/project/data',
  intro: 'Use grep to answer questions about the heat-shock data without opening any file.',
  steps: [
    { goal: 'Show the line of counts.tsv for the gene HSPA6.', hint: 'grep PATTERN FILE', solution: 'grep HSPA6 counts.tsv',
      check: { cmd: 'grep', outputEquals: 'HSPA6\t2\t0\t3\t999\t725\t1133' },
      explain: 'HSPA6 is nearly silent at 37 C (0 to 3 reads) and jumps to about 1,000 reads after heat shock, one of the strongest responders.' },
    { goal: 'Count how many genes annotation.tsv labels as heat_shock.', hint: 'Add the option that counts matching lines.', solution: 'grep -c heat_shock annotation.tsv',
      check: { cmd: 'grep', outputEquals: '7' },
      explain: '`-c` prints the number of matching lines instead of the lines themselves.' },
    { goal: 'Count the sequences in sequences.fa by counting their header lines.', hint: 'FASTA headers start with `>`. Put the `>` in double quotes, otherwise the shell treats it as a redirection and empties the file.', solution: 'grep -c ">" sequences.fa',
      check: { cmd: 'grep', outputEquals: '6' },
      explain: 'Six header lines, six sequences. Without the quotes, the shell would read `>` as "send the output into a file" and empty sequences.fa before grep ran.' },
    { goal: 'Show every line of annotation.tsv that mentions hsp70, in any mix of upper and lower case.', hint: 'The option `-i` ignores case.', solution: 'grep -i hsp70 annotation.tsv',
      check: { cmd: 'grep', outputIncludes: 'HSPA6' },
      explain: 'The descriptions say Hsp70, with a capital H. `-i` matched it anyway: three genes belong to the Hsp70 family.' },
    { goal: 'Show the lines of samples.tsv that do not contain the word control.', hint: '`-v` inverts the match.', solution: 'grep -v control samples.tsv',
      check: { cmd: 'grep', outputIncludes: 'heat_3' },
      explain: 'You got the three heat-shock samples plus the header line, which does not contain control either. Inverting a match keeps everything else, headers included.' },
    { goal: 'Find which line of counts.tsv holds FOS.', hint: '`-n` adds line numbers.', solution: 'grep -n FOS counts.tsv',
      check: { cmd: 'grep', outputIncludes: '13:' },
      explain: 'FOS is on line 13, the last line. Line numbers help when you need to open a file in an editor and fix one line.' }
  ],
  done: 'You searched, counted, ignored case and inverted matches. In real projects, grep is the fastest way to ask a question of a large text file.'
};

BB.missions['f1-wrangle'] = {
  title: 'Reshape the count table',
  start: '/home/student/project/data',
  intro: 'Answer questions about the count and annotation tables with cut, sort, uniq and tr.',
  steps: [
    { goal: 'Show only the gene names and the heat_1 counts (columns 1 and 5) of counts.tsv.', hint: '`cut -f` takes a comma-separated list of column numbers.', solution: 'cut -f 1,5 counts.tsv',
      check: { cmd: 'cut', outputEquals: 'gene\theat_1\nHSPA1A\t11018\nHSPA1B\t10345\nHSPA6\t999\nDNAJB1\t6820\nHSPH1\t6178\nHSPB1\t5990\nBAG3\t2094\nACTB\t55945\nGAPDH\t48101\nEEF1A1\t129222\nTP53\t881\nFOS\t311' },
      explain: '`cut` split each line at the tabs and kept fields 1 and 5. The header came along, because cut does not know it is special.' },
    { goal: 'Count how many genes are in each category (column 3 of annotation.tsv), leaving out the header.', hint: 'Remove the header with `tail -n +2`, then use `cut -f 3`, `sort` and `uniq -c`, joined by pipes.', solution: 'tail -n +2 annotation.tsv | cut -f 3 | sort | uniq -c',
      check: { pipeline: ['sort', 'uniq'], outputIncludes: '7 heat_shock' },
      explain: 'Each command passes its output to the next. Sorting groups equal categories so `uniq -c` can count them: 7 heat_shock, 3 housekeeping and 2 transcription_factor. Without `tail -n +2`, the header word category would be counted too.' },
    { goal: 'List the three genes with the highest heat_1 counts (column 5).', hint: 'Skip the header, sort column 5 numerically from largest to smallest with `sort -k5,5nr`, then keep 3 lines with `head`.', solution: 'tail -n +2 counts.tsv | sort -k5,5nr | head -n 3',
      check: { pipeline: ['sort', 'head'], outputEquals: 'EEF1A1\t98622\t107855\t109432\t129222\t86182\t109219\nACTB\t44289\t46223\t46941\t55945\t39466\t49070\nGAPDH\t35384\t42943\t41517\t48101\t32068\t37159' },
      explain: 'EEF1A1, ACTB and GAPDH are housekeeping genes with huge counts in every sample. The highest count is not the biggest change: to find heat-responsive genes you compare heat with control.' },
    { goal: 'Print samples.tsv as comma-separated text.', hint: '`tr` reads from a pipe: `cat FILE | tr "\\t" ","`.', solution: 'cat samples.tsv | tr "\\t" ","',
      check: { cmd: 'tr', outputIncludes: 'ctrl_1,control,1,37' },
      explain: '`tr` replaced every tab with a comma, turning TSV into CSV. To keep the result you would redirect it into a file, as the pipes lesson shows.' },
    { goal: 'List the distinct conditions in column 2 of samples.tsv, without the header.', hint: '`tail -n +2`, then `cut -f 2`, then `sort -u`.', solution: 'tail -n +2 samples.tsv | cut -f 2 | sort -u',
      check: { cmd: 'sort', outputEquals: 'control\nheat_shock' },
      explain: '`sort -u` keeps one copy of each value. Two conditions, control and heat_shock, which matches the design of the experiment.' }
  ],
  done: 'You extracted columns, counted categories and sorted by one sample\'s counts. Bioinformaticians run one-liners like these to sanity-check tables before deeper analysis.'
};

BB.missions['f1-permissions'] = {
  title: 'Make a script runnable',
  start: '/home/student/project/scripts',
  intro: 'The scripts folder holds two small programs. One of them cannot be run directly yet. Find out why and fix it, then protect the raw count table.',
  steps: [
    { goal: 'Show the permissions of the files in this folder.', hint: '`ls` with the long-listing option.', solution: 'ls -l',
      check: { cmd: 'ls', outputIncludes: '-rw-r--r--' },
      explain: 'count_seqs.sh is `-rw-r--r--` (no x anywhere) and line_report.sh is `-rwxr-xr-x`, so only line_report.sh can be executed directly.' },
    { goal: 'Try to run count_seqs.sh directly on ../data/sequences.fa.', hint: 'Run a program in the current folder by putting `./` in front of its name.', solution: './count_seqs.sh ../data/sequences.fa',
      check: { outputIncludes: 'Permission denied', allowFail: true },
      explain: 'The system refused because the file has no execute permission. This is the most common first error with a new script.' },
    { goal: 'Give count_seqs.sh execute permission.', hint: '`chmod +x FILE`', solution: 'chmod +x count_seqs.sh',
      check: { executable: '/home/student/project/scripts/count_seqs.sh' },
      explain: '`+x` added execute permission. Run `ls -l` again and you will see `-rwxr-xr-x`.' },
    { goal: 'Run it again on ../data/sequences.fa.', hint: 'Same command as before; the Up arrow brings it back.', solution: './count_seqs.sh ../data/sequences.fa',
      check: { outputIncludes: 'contains 6 sequences' },
      explain: 'Now it runs. `./` tells the shell to look for the program in the current folder instead of the usual program folders.' },
    { goal: 'Protect the raw count table: remove write permission for everyone from ../data/counts.tsv, then check it with ls -l.', hint: '`chmod a-w FILE`, then `ls -l FILE`. You can join the two commands with `&&`.', solution: 'chmod a-w ../data/counts.tsv && ls -l ../data/counts.tsv',
      check: { cmd: 'ls', outputIncludes: '-r--r--r--' },
      explain: '`-r--r--r--` means nobody can change the file\'s contents by accident, including your own scripts. (Deleting a file depends on the folder\'s permissions, so keep backups too.) The owner can give write permission back with `chmod u+w` if an edit is ever really needed.' }
  ],
  done: 'You read permission strings, met Permission denied, fixed it with chmod and protected raw data. Every script you write from now on needs this.'
};

BB.missions['f1-archive-net'] = {
  title: 'Pack, compress and check',
  start: '/home/student/project',
  intro: 'You want to send the data folder to a collaborator and keep a reads file compressed. Practice with tar, gzip and zcat, then see what the network commands do here.',
  steps: [
    { goal: 'Create a gzip-compressed archive called data.tar.gz from the data folder.', hint: '`tar -czf ARCHIVE FOLDER`: create, gzip, file name.', solution: 'tar -czf data.tar.gz data',
      check: { cmd: 'tar', exists: '/home/student/project/data.tar.gz' },
      explain: 'One file now holds the whole folder, compressed. The original data folder is unchanged.' },
    { goal: 'List the contents of data.tar.gz without extracting it.', hint: 'Replace `c` (create) with `t` (list).', solution: 'tar -tzf data.tar.gz',
      check: { cmd: 'tar', outputIncludes: 'data/counts.tsv' },
      explain: 'Listing an archive before extracting it shows what will be created, and where.' },
    { goal: 'Copy data/reads.fastq into results, then compress the copy with gzip.', hint: '`cp data/reads.fastq results/`, then `gzip results/reads.fastq`. You can join them with `&&`.', solution: 'cp data/reads.fastq results/ && gzip results/reads.fastq',
      check: { exists: '/home/student/project/results/reads.fastq.gz', notExists: '/home/student/project/results/reads.fastq' },
      explain: 'gzip replaced the copy with reads.fastq.gz. You compressed a copy so that the original stays readable for the other lessons.' },
    { goal: 'Show the first 4 lines of the compressed file without decompressing it on disk.', hint: '`zcat FILE | head -n 4`', solution: 'zcat results/reads.fastq.gz | head -n 4',
      check: { pipeline: ['zcat', 'head'], outputIncludes: '@READ_0001' },
      explain: '`zcat` decompresses on the fly and passes plain text to `head`. The .gz file on disk is unchanged.' },
    { goal: 'Print the network name of this computer.', hint: 'host name', solution: 'hostname',
      check: { cmd: 'hostname', outputIncludes: 'biobridge' },
      explain: 'Servers are identified by host names like this one, plus network addresses that `ifconfig` or `ip addr` would show.' },
    { goal: 'Try to download the file at `https://example.org/genes.txt` with wget.', hint: '`wget URL`', solution: 'wget https://example.org/genes.txt',
      check: { cmd: 'wget', allowFail: true },
      explain: 'This practice server has no internet connection, so wget cannot connect. On a real server, wget would contact the address, show a progress bar and save the file it received in the current folder.' }
  ],
  done: 'You archived, listed, compressed and read compressed data, and met the command that downloads data on real servers.'
};

BB.missions['f1-editors'] = {
  title: 'Write a note with nano',
  start: '/home/student/project/results',
  intro: 'Record a short finding in a text file with the nano editor, then check from the shell that it was saved.',
  steps: [
    { goal: 'Open a new file called summary.txt in nano, type the line HSPA1A rises strongly after heat shock, then save and exit.', hint: 'Run `nano summary.txt`. Inside nano, type the line, press Ctrl+O and then Enter to save, and Ctrl+X to exit.', solution: 'nano summary.txt', editorAppend: 'HSPA1A rises strongly after heat shock',
      check: { fileIncludes: { path: '/home/student/project/results/summary.txt', text: 'HSPA1A' } },
      explain: 'nano created summary.txt when you saved. Ctrl+O (write out) and Ctrl+X (exit) are the two shortcuts you need most.' },
    { goal: 'Print the file to check that your text was saved.', hint: '`cat FILE`', solution: 'cat summary.txt',
      check: { cmd: 'cat', outputIncludes: 'HSPA1A' },
      explain: 'Always check a saved file. If the text is missing, the save was probably not confirmed with Enter.' },
    { goal: 'Open summary.txt again and add a second line: ACTB stays flat. Save and exit.', hint: 'Run `nano summary.txt` again, move to the end with the arrow keys, type the line, then Ctrl+O, Enter and Ctrl+X.', solution: 'nano summary.txt', editorAppend: 'ACTB stays flat',
      check: { fileIncludes: { path: '/home/student/project/results/summary.txt', text: 'ACTB' } },
      explain: 'Editing an existing file works the same way. nano saves plain text, which the shell and other programs read directly.' },
    { goal: 'Count the lines in your note.', hint: '`wc -l FILE`', solution: 'wc -l summary.txt',
      check: { cmd: 'wc', outputIncludes: 'summary.txt' },
      explain: 'A file written in an editor is an ordinary text file, so every command you have learned works on it.' },
    { goal: 'Find out where the nano program is installed.', hint: '`which` followed by a command name.', solution: 'which nano',
      check: { cmd: 'which', outputIncludes: 'nano' },
      explain: 'Programs live in folders such as `/usr/bin`. A package manager put nano there; on a real Ubuntu system, `sudo apt install nano` installs or updates it.' }
  ],
  done: 'You created and edited a plain-text file in nano and checked it from the shell. Scripts are written in exactly the same way.'
};

BB.missions['f1-pipes'] = {
  title: 'Chain commands and save results',
  start: '/home/student/project/data',
  intro: 'Combine commands with pipes, and save a small report and an error log into the results folder.',
  steps: [
    { goal: 'Count the heat_shock genes in annotation.tsv by piping grep into wc.', hint: '`grep PATTERN FILE | wc -l`', solution: 'grep heat_shock annotation.tsv | wc -l',
      check: { pipeline: ['grep', 'wc'], outputEquals: '7' },
      explain: 'grep printed 7 lines into the pipe instead of onto the screen, and `wc -l` counted them. `grep -c` gives the same number in one command.' },
    { goal: 'Save the names of the heat-shock genes (column 1) into ../results/heat_genes.txt.', hint: 'grep, then `cut -f 1`, then `>` and the file path.', solution: 'grep heat_shock annotation.tsv | cut -f 1 > ../results/heat_genes.txt',
      check: { fileIncludes: { path: '/home/student/project/results/heat_genes.txt', text: 'DNAJB1' } },
      explain: 'Nothing appeared on the screen because `>` sent the output into the file. `cat ../results/heat_genes.txt` shows the 7 names.' },
    { goal: 'Start a report: write the line Sequences in sequences.fa: into ../results/report.txt.', hint: '`echo "TEXT" > FILE`', solution: 'echo "Sequences in sequences.fa:" > ../results/report.txt',
      check: { fileIncludes: { path: '/home/student/project/results/report.txt', text: 'Sequences in' } },
      explain: '`>` created report.txt. If it had already existed, its old content would have been replaced.' },
    { goal: 'Append the number of sequences to the report without overwriting it.', hint: 'Use `grep -c ">" sequences.fa` with `>>` and the report path. Keep the quotes around the first `>`.', solution: 'grep -c ">" sequences.fa >> ../results/report.txt',
      check: { cmd: 'grep', fileIncludes: { path: '/home/student/project/results/report.txt', text: '6' } },
      explain: 'The quoted `">"` is grep\'s pattern; the unquoted `>>` appends grep\'s output to the end of the file.' },
    { goal: 'Print the report and check that it has both lines.', hint: '`cat FILE`. If the first line is missing, you used `>` instead of `>>` in the last step: write both lines again.', solution: 'cat ../results/report.txt',
      check: { cmd: 'cat', outputEquals: 'Sequences in sequences.fa:\n6' },
      explain: '`>` starts a file and `>>` adds to it. Mixing them up is one of the most common ways to lose results.' },
    { goal: 'List a file that does not exist and send the error message into ../results/errors.txt.', hint: '`2>` redirects standard error: `ls missing.txt 2> FILE`.', solution: 'ls missing.txt 2> ../results/errors.txt',
      check: { allowFail: true, fileIncludes: { path: '/home/student/project/results/errors.txt', text: 'missing.txt' } },
      explain: 'The screen stayed empty: the message went to standard error, and `2>` sent it into the file. Pipelines keep logs of what went wrong in exactly this way.' }
  ],
  done: 'You chained filters with pipes and used `>`, `>>` and `2>` to save results and errors. That is the core of every command-line pipeline.'
};

BB.missions['f1-scripts'] = {
  title: 'Read, run and write a script',
  start: '/home/student/project/scripts',
  intro: 'Read the FASTA-counting script, see what happens when it meets the wrong kind of file, then write your own script that counts FASTQ reads correctly.',
  steps: [
    { goal: 'Print the contents of count_seqs.sh.', hint: '`cat FILE`', solution: 'cat count_seqs.sh',
      check: { cmd: 'cat', outputIncludes: '#!/bin/bash' },
      explain: 'A shebang, two comments, then three commands. `$1` will be replaced by whatever file name you pass in.' },
    { goal: 'Run it with bash on ../data/sequences.fa.', hint: '`bash SCRIPT ARGUMENT`', solution: 'bash count_seqs.sh ../data/sequences.fa',
      check: { cmd: 'bash', outputIncludes: 'contains 6 sequences' },
      explain: '`bash count_seqs.sh` works even without execute permission, because Bash only reads the file. Here `$1` was ../data/sequences.fa.' },
    { goal: 'Now run it on ../data/reads.fastq and read the answer carefully.', hint: 'Same command, different argument.', solution: 'bash count_seqs.sh ../data/reads.fastq',
      check: { cmd: 'bash', outputIncludes: 'contains 7' },
      explain: '7 is wrong: the file has 8 reads. The script counts lines that contain `>`, and in FASTQ files `>` is also a quality character. The script did exactly what it says, on the wrong kind of file.' },
    { goal: 'Create a new script, count_reads.sh, that prints the number of reads in a FASTQ file. Write it in nano.', hint: 'Run `nano count_reads.sh` and type three lines: `#!/bin/bash`, then `lines=$(wc -l < "$1")`, then `echo "$1 contains $((lines / 4)) reads"`. Save with Ctrl+O and Enter, exit with Ctrl+X.', solution: 'nano count_reads.sh', editorAppend: '#!/bin/bash\nlines=$(wc -l < "$1")\necho "$1 contains $((lines / 4)) reads"',
      check: { fileIncludes: { path: '/home/student/project/scripts/count_reads.sh', text: 'wc -l' } },
      explain: 'FASTQ uses exactly four lines per read, so dividing the line count by 4 counts reads reliably, whatever characters the quality strings contain.' },
    { goal: 'Make count_reads.sh executable and run it on ../data/reads.fastq.', hint: '`chmod +x count_reads.sh`, then `./count_reads.sh ../data/reads.fastq`. You can join them with `&&`.', solution: 'chmod +x count_reads.sh && ./count_reads.sh ../data/reads.fastq',
      check: { executable: '/home/student/project/scripts/count_reads.sh', outputIncludes: '8 reads' },
      explain: '8 reads, the right answer. You wrote, saved, permitted and ran your own tool, and it works on any FASTQ file you name.' }
  ],
  done: 'You read a script, caught it giving a wrong answer on the wrong file type, and wrote a correct one. Testing on small files with a known answer is how real pipelines are checked.'
};

BB.missions['f1-script-logic'] = {
  title: 'Loop over files and make decisions',
  start: '/home/student/project/data',
  intro: 'Write loops and conditions directly at the prompt to process every file in the data folder.',
  steps: [
    { goal: 'Print the name of every .tsv file, one per line, with a for loop.', hint: '`for f in *.tsv; do echo $f; done`', solution: 'for f in *.tsv; do echo $f; done',
      check: { outputEquals: 'annotation.tsv\ncounts.tsv\nsamples.tsv' },
      explain: 'The shell expanded `*.tsv` into three names and ran `echo` once for each, with `f` set to the current name.' },
    { goal: 'Loop over the .tsv files again, printing each name followed by its number of lines.', hint: 'Inside the loop, put `wc -l < $f` inside `$( )`: `echo "$f $(wc -l < $f)"`.', solution: 'for f in *.tsv; do echo "$f $(wc -l < $f)"; done',
      check: { outputIncludes: 'samples.tsv 7' },
      explain: 'Command substitution put each count into the message. The script line_report.sh in the scripts folder does the same thing for any folder.' },
    { goal: 'Store the number of reads in reads.fastq in a variable called n, then print it.', hint: '`n=$(( $(wc -l < reads.fastq) / 4 ))`, then `echo $n`. Join them with `;`.', solution: 'n=$(( $(wc -l < reads.fastq) / 4 )); echo $n',
      check: { outputEquals: '8' },
      explain: '`$( )` captured the 32 lines and `$(( ))` divided by 4. Bash arithmetic works with whole numbers only, which suits counting.' },
    { goal: 'Use if to print found when counts.tsv exists as a regular file, and missing otherwise.', hint: '`if [ -f counts.tsv ]; then echo found; else echo missing; fi`', solution: 'if [ -f counts.tsv ]; then echo found; else echo missing; fi',
      check: { outputEquals: 'found' },
      explain: '`-f` tests for a regular file. Checking inputs before using them lets a script stop with a clear message instead of failing later in a confusing way.' },
    { goal: 'Combine both: loop over every file in the folder and print the name and line count only of files with more than 10 lines.', hint: '`for f in *; do n=$(wc -l < $f); if [ $n -gt 10 ]; then echo "$f $n"; fi; done`', solution: 'for f in *; do n=$(wc -l < $f); if [ $n -gt 10 ]; then echo "$f $n"; fi; done',
      check: { any: [ { outputEquals: 'annotation.tsv 13\ncounts.tsv 13\nreads.fastq 32\nsequences.fa 15' }, { outputEquals: 'annotation.tsv: 13\ncounts.tsv: 13\nreads.fastq: 32\nsequences.fa: 15' } ] },
      explain: 'The `if` inside the loop filtered the output: samples.tsv has only 7 lines, so it was skipped. Loops plus conditions are how scripts apply the same rule to every sample.' }
  ],
  done: 'You looped over files, captured command output in variables, did arithmetic and made decisions. These are the building blocks of every automated analysis.'
};

BB.missions['f1-bio-recipes'] = {
  title: 'Quick checks on sequence files',
  start: '/home/student/project/data',
  intro: 'A sequencing run just delivered a FASTA file and a FASTQ file. Use one-line recipes to check them before any analysis.',
  steps: [
    { goal: 'Count the sequences in sequences.fa with an anchored pattern.', hint: '`grep -c "^>" FILE`', solution: 'grep -c "^>" sequences.fa',
      check: { cmd: 'grep', outputEquals: '6' },
      explain: '`^>` matches only lines that start with `>`, which in FASTA files are exactly the header lines.' },
    { goal: 'Count the reads in reads.fastq by dividing its line count by 4.', hint: '`echo $(( $(wc -l < reads.fastq) / 4 ))`', solution: 'echo $(( $(wc -l < reads.fastq) / 4 ))',
      check: { outputEquals: '8' },
      explain: 'Each FASTQ record has exactly four lines, so 32 lines mean 8 reads, whatever characters appear in the quality strings.' },
    { goal: 'See why the FASTA recipe fails on FASTQ: count the lines of reads.fastq that contain >.', hint: '`grep -c ">" reads.fastq`', solution: 'grep -c ">" reads.fastq',
      check: { cmd: 'grep', outputEquals: '7' },
      explain: '7, not 8: those `>` characters sit inside quality strings. A command that prints a number is not automatically printing the right number.' },
    { goal: 'List just the sequence IDs: the first word of each header, without the >.', hint: '`grep "^>" FILE | cut -d " " -f 1 | tr -d ">"`', solution: 'grep "^>" sequences.fa | cut -d " " -f 1 | tr -d ">"',
      check: { cmd: 'grep', outputEquals: 'seq_01\nseq_02\nseq_03\nseq_04\nseq_05\nseq_06' },
      explain: '`cut -d " "` splits each header at spaces and keeps field 1, and `tr -d` deletes the `>`. Lists like this are compared with sample sheets to catch missing records.' },
    { goal: 'Find the read that contains an ambiguous base, N, and show its line number.', hint: '`grep -n N FILE`', solution: 'grep -n N reads.fastq',
      check: { cmd: 'grep', outputIncludes: '22:' },
      explain: 'Line 22 is the sequence line of the sixth record (lines 21 to 24), READ_0006. N means the sequencer could not call that base. Here no header or quality line contains N; in real files, restrict such searches to sequence lines.' },
    { goal: 'Save the read count into ../results/read_count.txt.', hint: 'Add `> ../results/read_count.txt` after the counting command from step 2.', solution: 'echo $(( $(wc -l < reads.fastq) / 4 )) > ../results/read_count.txt',
      check: { fileIncludes: { path: '/home/student/project/results/read_count.txt', text: '8' } },
      explain: 'Saved counts from every sample can be collected into one table of reads per sample, a standard quality report.' }
  ],
  done: 'You counted sequences and reads correctly, met a plausible but wrong count, and extracted IDs. These checks are routine at the start of every sequencing analysis.'
};
