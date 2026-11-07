/* BioBridge curriculum spine.
   Every lesson, question and progress metric refers to the ids defined here.
   Content (lesson bodies, questions, glossary) lives in the other content/*.js files.
   Course module titles and summaries were checked against the public course pages on 7 Nov 2026. */
window.BB = window.BB || {};

BB.config = {
  deadline: '2026-12-05T23:59:59+03:00',   // cohort deadline supplied by the program team; edit here if it changes
  deadlineLabel: '5 December 2026',
  storageKey: 'biobridge-v2',
  legacyStorageKey: 'biobridge-v1',
  version: '2.2.0', repoUrl: 'https://github.com/almokhtar8-stack/biobridge'
};

BB.courses = {
  kaust: {
    name: 'Fundamental Skills in Bioinformatics',
    org: 'KAUST (King Abdullah University of Science and Technology)',
    short: 'KAUST Fundamental Skills',
    tag: 'KAUST',
    url: 'https://www.coursera.org/learn/fundamental-skills-in-bioinformatics',
    about: 'A practical course for biology students with little or no programming background. It teaches R and Python together with basic statistics, then applies them to real RNA-seq data.',
    outcomes: ['Basics of R', 'Basics of Python', 'How to analyze bulk RNA-seq count data', 'How to analyze single-cell RNA-seq count data'],
    modules: [
      { id: 'kaust-m1', n: 1, title: 'Introduction to Programming (using R)', summary: 'Working in R and RStudio, data types, loops and if statements, and R Markdown for sharing code.' },
      { id: 'kaust-m2', n: 2, title: 'Introduction to Programming II (using R)', summary: 'Logical values and vectors (including their use in quality control), exploratory data analysis, correlation, linear models, t-tests and ANOVA, plus resources for learning more R.' },
      { id: 'kaust-m3', n: 3, title: 'Programming in Python', summary: 'How Python compares with R, Python syntax, and the pandas and NumPy modules.' },
      { id: 'kaust-m4', n: 4, title: 'Bioinformatics case study: RNA-seq bulk and single-cell data analysis', summary: 'R for bulk RNA-seq, Python for single-cell RNA-seq, and integrating the two analyses.' }
    ]
  },
  rice: {
    name: 'Python Programming Essentials',
    org: 'Rice University',
    short: 'Rice Python Essentials',
    tag: 'Rice',
    url: 'https://www.coursera.org/learn/python-programming',
    about: 'A first Python course covering expressions, variables, functions, logic, conditionals and modules. It runs in CodeSkulptor, a Python 3 environment inside the web browser.',
    outcomes: ['Write short Python programs for practical tasks', 'Use expressions, variables, functions, logic and conditionals', 'Use Python modules'],
    modules: [
      { id: 'rice-m1', n: 1, title: 'Python as a Calculator', summary: 'Running first programs and computing arithmetic expressions. The course overview also lists variables among the core topics.' },
      { id: 'rice-m2', n: 2, title: 'Functions', summary: 'Defining and calling functions so code can be written once and run with different inputs.' },
      { id: 'rice-m3', n: 3, title: 'Logic and Conditionals', summary: 'Using logic and conditionals so a program behaves differently depending on its values.' },
      { id: 'rice-m4', n: 4, title: 'Python Modules', summary: 'Splitting and reusing code with modules, using modules that ship with Python, and a project that processes dates.' }
    ]
  },
  ibm: {
    name: 'Hands-on Introduction to Linux Commands and Shell Scripting',
    org: 'IBM',
    short: 'IBM Linux & Shell',
    tag: 'IBM',
    url: 'https://www.coursera.org/learn/hands-on-introduction-to-linux-commands-and-shell-scripting',
    about: 'A beginner course on the Linux terminal, everyday commands and Bash scripting, with hands-on labs on a browser-based Linux server.',
    outcomes: ['Perform common informational, file, content, navigational, compression and networking commands in Bash', 'Develop shell scripts using Linux commands, environment variables, pipes and filters', 'Schedule cron jobs with crontab and explain cron syntax'],
    modules: [
      { id: 'ibm-m1', n: 1, title: 'Introduction to Linux', summary: 'Origins and uses of Linux, distributions, Linux architecture, the terminal, navigating directories, editing files with nano and Vim, and installing software with a package manager.' },
      { id: 'ibm-m2', n: 2, title: 'Introduction to Linux Commands', summary: 'Informational, navigation and file-management commands, viewing and customizing file content, access control, networking commands, and archiving and compression.' },
      { id: 'ibm-m3', n: 3, title: 'Introduction to Shell Scripting', summary: 'What scripts are, the shebang line, filters, pipes and variables, useful Bash features, and scheduling jobs with cron.' },
      { id: 'ibm-m4', n: 4, title: 'Final Project and Final Exam', summary: 'A practice data-processing project, a peer-graded scheduled backup script, and a final exam.' }
    ]
  }
};

BB.academyUrl = 'https://academy.kaust.edu.sa/program/university-students/bioinformatics-specialization/';

/* Learning objectives. "I can..." statements are what progress is tracked against. */
BB.objectives = {
  'F0.BIOINF':  { f: 'f0', label: 'Explain what bioinformatics is and the problems it solves' },
  'F0.DOGMA':   { f: 'f0', label: 'Describe how information flows from DNA to RNA to protein' },
  'F0.EXPR':    { f: 'f0', label: 'Explain gene expression and why cells with the same DNA differ' },
  'F0.COMP':    { f: 'f0', label: 'Describe programs, files, folders and datasets' },
  'F0.WHYCOMP': { f: 'f0', label: 'Explain why biology needs computation and reproducible code' },

  'LX.CONCEPTS': { f: 'f1', label: 'Describe Linux, distributions, the kernel and the shell' },
  'LX.CMD':      { f: 'f1', label: 'Read a command as name, options and arguments, and get help' },
  'LX.INFO':     { f: 'f1', label: 'Use informational commands (whoami, date, uname, ps, df, echo)' },
  'LX.PATHS':    { f: 'f1', label: 'Use absolute and relative paths, ~, . and ..' },
  'LX.NAV':      { f: 'f1', label: 'Navigate with pwd, ls and cd' },
  'LX.MANAGE':   { f: 'f1', label: 'Create, copy, move, find and delete files and folders' },
  'LX.VIEW':     { f: 'f1', label: 'Inspect files with cat, less, head, tail and wc' },
  'LX.SEARCH':   { f: 'f1', label: 'Search text with grep and its options' },
  'LX.TEXT':     { f: 'f1', label: 'Sort, count and extract columns with sort, uniq, cut and tr' },
  'LX.PIPES':    { f: 'f1', label: 'Combine commands with pipes and redirect output to files' },
  'LX.PERMS':    { f: 'f1', label: 'Read permissions and change them with chmod' },
  'LX.ARCHIVE':  { f: 'f1', label: 'Archive and compress files with tar, gzip and zip' },
  'LX.NET':      { f: 'f1', label: 'Explain networking commands (hostname, ping, curl, wget)' },
  'LX.EDIT':     { f: 'f1', label: 'Edit text files and understand package managers' },
  'LX.SCRIPT':   { f: 'f1', label: 'Write and run a shell script with variables and arguments' },
  'LX.LOGIC':    { f: 'f1', label: 'Use loops and conditions in Bash scripts' },
  'LX.CRON':     { f: 'f1', label: 'Read and write cron schedules' },

  'PY.EXPR':    { f: 'f2', label: 'Evaluate arithmetic expressions and operator precedence' },
  'PY.TYPES':   { f: 'f2', label: 'Tell int, float, str and bool apart and convert between them' },
  'PY.VARS':    { f: 'f2', label: 'Trace how variables are assigned and updated' },
  'PY.FUNC':    { f: 'f2', label: 'Define and call functions; explain return versus print' },
  'PY.LOGIC':   { f: 'f2', label: 'Evaluate comparisons and Boolean logic' },
  'PY.COND':    { f: 'f2', label: 'Predict which branch of if, elif and else runs' },
  'PY.MODULES': { f: 'f2', label: 'Import and use modules such as math and datetime' },
  'PY.STR':     { f: 'f2', label: 'Index, slice and transform strings' },
  'PY.LISTS':   { f: 'f2', label: 'Create, index and change lists' },
  'PY.LOOPS':   { f: 'f2', label: 'Trace for loops and accumulator patterns' },
  'PY.DICTS':   { f: 'f2', label: 'Use dictionaries for counting and lookup' },
  'PY.FILES':   { f: 'f2', label: 'Read a text file line by line and parse it' },
  'PY.PANDAS':  { f: 'f2', label: 'Explain pandas DataFrames and NumPy arrays' },
  'PY.DEBUG':   { f: 'f2', label: 'Read error messages and find bugs methodically' },
  'PY.READ':    { f: 'f2', label: 'Read and trace unfamiliar code before changing it' },
  'PY.BIO':     { f: 'f2', label: 'Apply Python to small biological sequence problems' },

  'BI.SEQ':      { f: 'f3', label: 'Read sequences and the FASTA format' },
  'BI.FASTQ':    { f: 'f3', label: 'Read FASTQ records and Phred quality scores' },
  'BI.RNASEQ':   { f: 'f3', label: 'Explain what RNA-seq measures and its limits' },
  'BI.DESIGN':   { f: 'f3', label: 'Recognize good design: conditions, replicates, confounders' },
  'BI.ALIGN':    { f: 'f3', label: 'Distinguish alignment from quantification' },
  'BI.COUNTS':   { f: 'f3', label: 'Read and reason about a count matrix' },
  'BI.NORM':     { f: 'f3', label: 'Explain why and how counts are normalized' },
  'R.BASICS':    { f: 'f3', label: 'Use R vectors, types, functions and 1-based indexing' },
  'R.LOGIC':     { f: 'f3', label: 'Use logical vectors, conditions and loops in R for quality control' },
  'R.DF':        { f: 'f3', label: 'Work with data frames, CSV files and R Markdown' },
  'ST.EDA':      { f: 'f3', label: 'Summarize and plot data before testing' },
  'ST.VAR':      { f: 'f3', label: 'Explain variability and why replicates matter' },
  'ST.FC':       { f: 'f3', label: 'Compute and interpret fold change and log2 fold change' },
  'ST.TEST':     { f: 'f3', label: 'Interpret hypothesis tests, p-values, t-tests and ANOVA' },
  'ST.CORR':     { f: 'f3', label: 'Interpret correlation and simple linear models' },
  'ST.MULTI':    { f: 'f3', label: 'Explain multiple testing and the false discovery rate' },
  'BI.DE':       { f: 'f3', label: 'Follow a differential expression analysis and read a volcano plot' },
  'BI.SC':       { f: 'f3', label: 'Explain single-cell RNA-seq data and its quality control' },
  'BI.CLUST':    { f: 'f3', label: 'Interpret PCA, UMAP, clusters and marker genes cautiously' },
  'BI.INTERP':   { f: 'f3', label: 'Turn results into careful biological interpretation' },
  'BI.WORKFLOW': { f: 'f3', label: 'Describe what real analysis workflows and tools do', beyond: true }   // beyond the courses: left out of mock assessments
};

/* Foundations and units. Order here is the recommended order (conceptual dependency). */
BB.foundations = [
  { id: 'f0', n: 0, title: 'Starting from absolute zero', short: 'Foundation 0',
    blurb: 'What bioinformatics is, the biology you need (DNA, RNA, genes, proteins) and the computing you need (programs, files, datasets).',
    units: [
      { id: 'u0a', title: 'Biology from zero', lessons: ['f0-bioinformatics', 'f0-cells-dna', 'f0-dogma', 'f0-expression'] },
      { id: 'u0b', title: 'Computing from zero', lessons: ['f0-computers', 'f0-data', 'f0-why-code', 'f0-discovery'] }
    ] },
  { id: 'f1', n: 1, title: 'Linux and the command line', short: 'Foundation 1',
    blurb: 'Files, folders, paths and commands. Search and reshape text, chain tools with pipes, and automate work with scripts.',
    units: [
      { id: 'u1a', title: 'Meet Linux', lessons: ['f1-linux', 'f1-terminal', 'f1-paths'] },
      { id: 'u1b', title: 'Everyday commands', lessons: ['f1-navigate', 'f1-manage', 'f1-view', 'f1-grep', 'f1-wrangle', 'f1-permissions', 'f1-archive-net', 'f1-editors'] },
      { id: 'u1c', title: 'Automation', lessons: ['f1-pipes', 'f1-scripts', 'f1-script-logic', 'f1-cron', 'f1-bio-recipes'] }
    ] },
  { id: 'f2', n: 2, title: 'Python', short: 'Foundation 2',
    blurb: 'Read code before writing it. Variables, types, functions, decisions and modules, then strings, lists, loops, dictionaries, files and tables.',
    units: [
      { id: 'u2a', title: 'Python essentials', lessons: ['f2-first-program', 'f2-types', 'f2-variables', 'f2-functions', 'f2-logic', 'f2-conditionals', 'f2-modules'] },
      { id: 'u2b', title: 'Working with data', lessons: ['f2-strings', 'f2-lists-loops', 'f2-dicts', 'f2-files', 'f2-pandas'] },
      { id: 'u2c', title: 'Becoming independent', lessons: ['f2-read-code', 'f2-debug', 'f2-bio-project'] }
    ] },
  { id: 'f3', n: 3, title: 'Bioinformatics and statistical reasoning', short: 'Foundation 3',
    blurb: 'Sequence files, RNA-seq from sample to count matrix, R, statistics, differential expression, single-cell data and careful interpretation.',
    units: [
      { id: 'u3a', title: 'Sequence data', lessons: ['f3-fasta', 'f3-fastq'] },
      { id: 'u3b', title: 'RNA-seq: from sample to counts', lessons: ['f3-rnaseq', 'f3-design', 'f3-align', 'f3-counts', 'f3-normalization'] },
      { id: 'u3c', title: 'R for data analysis', lessons: ['f3-r-basics', 'f3-r-control', 'f3-r-dataframes'] },
      { id: 'u3d', title: 'Statistical reasoning', lessons: ['f3-eda', 'f3-variability', 'f3-foldchange', 'f3-tests', 'f3-correlation', 'f3-multiple'] },
      { id: 'u3e', title: 'Finding and interpreting changes', lessons: ['f3-de', 'f3-single-cell', 'f3-clusters', 'f3-interpret', 'f3-workflows'] }
    ] }
];

/* Lesson metadata.
   align: 'core'    = taught in the linked course module(s)
          'support' = background the courses assume or touch briefly
          'beyond'  = goes past the three prerequisite courses (clearly labelled for learners) */
BB.lessonMeta = {
  'f0-bioinformatics': { title: 'What is bioinformatics?', min: 6, obj: ['F0.BIOINF'], courses: [], align: 'support', pre: [] },
  'f0-cells-dna':      { title: 'Cells, DNA and genes', min: 7, obj: ['F0.DOGMA'], courses: ['kaust-m4'], align: 'support', pre: ['f0-bioinformatics'] },
  'f0-dogma':          { title: 'From DNA to RNA to protein', min: 10, obj: ['F0.DOGMA'], courses: ['kaust-m4'], align: 'support', pre: ['f0-cells-dna'] },
  'f0-expression':     { title: 'Gene expression: same DNA, different cells', min: 7, obj: ['F0.EXPR'], courses: ['kaust-m4'], align: 'support', pre: ['f0-dogma'] },
  'f0-computers':      { title: 'Computers, programs and files', min: 7, obj: ['F0.COMP'], courses: ['ibm-m1'], align: 'support', pre: [] },
  'f0-data':           { title: 'What is a dataset?', min: 7, obj: ['F0.COMP'], courses: ['kaust-m1'], align: 'support', pre: ['f0-computers'] },
  'f0-why-code':       { title: 'Why biologists write code', min: 6, obj: ['F0.WHYCOMP'], courses: [], align: 'support', pre: ['f0-data'] },
  'f0-discovery':      { title: 'From a question to a discovery: the whole journey', min: 9, obj: ['F0.WHYCOMP', 'F0.EXPR'], courses: ['kaust-m4'], align: 'support', pre: ['f0-expression', 'f0-why-code'] },

  'f1-linux':        { title: 'What Linux is and why science runs on it', min: 7, obj: ['LX.CONCEPTS'], courses: ['ibm-m1'], align: 'core', pre: ['f0-computers'] },
  'f1-terminal':     { title: 'The terminal, the shell and the anatomy of a command', min: 9, obj: ['LX.CMD', 'LX.INFO'], courses: ['ibm-m1', 'ibm-m2'], align: 'core', pre: ['f1-linux'] },
  'f1-paths':        { title: 'The file system tree and paths', min: 8, obj: ['LX.PATHS'], courses: ['ibm-m1'], align: 'core', pre: ['f1-terminal'] },
  'f1-navigate':     { title: 'Moving around: pwd, ls and cd', min: 8, obj: ['LX.NAV', 'LX.PATHS'], courses: ['ibm-m2'], align: 'core', pre: ['f1-paths'] },
  'f1-manage':       { title: 'Creating, copying, moving, finding and deleting', min: 10, obj: ['LX.MANAGE'], courses: ['ibm-m2'], align: 'core', pre: ['f1-navigate'] },
  'f1-view':         { title: 'Looking inside files: cat, less, head, tail and wc', min: 8, obj: ['LX.VIEW'], courses: ['ibm-m2'], align: 'core', pre: ['f1-navigate'] },
  'f1-grep':         { title: 'Searching text with grep', min: 9, obj: ['LX.SEARCH'], courses: ['ibm-m2'], align: 'core', pre: ['f1-view'] },
  'f1-wrangle':      { title: 'Sorting, counting and extracting columns', min: 10, obj: ['LX.TEXT'], courses: ['ibm-m2'], align: 'core', pre: ['f1-grep'] },
  'f1-permissions':  { title: 'Permissions and chmod', min: 8, obj: ['LX.PERMS'], courses: ['ibm-m2'], align: 'core', pre: ['f1-manage'] },
  'f1-archive-net':  { title: 'Archives, compression and the network', min: 8, obj: ['LX.ARCHIVE', 'LX.NET'], courses: ['ibm-m2'], align: 'core', pre: ['f1-manage'] },
  'f1-editors':      { title: 'Editing files and installing software', min: 6, obj: ['LX.EDIT'], courses: ['ibm-m1'], align: 'core', pre: ['f1-manage'] },
  'f1-pipes':        { title: 'Pipes, filters and redirection', min: 10, obj: ['LX.PIPES'], courses: ['ibm-m3'], align: 'core', pre: ['f1-wrangle'] },
  'f1-scripts':      { title: 'Your first shell script', min: 10, obj: ['LX.SCRIPT'], courses: ['ibm-m3'], align: 'core', pre: ['f1-pipes', 'f1-permissions'] },
  'f1-script-logic': { title: 'Variables, loops and decisions in Bash', min: 11, obj: ['LX.SCRIPT', 'LX.LOGIC'], courses: ['ibm-m3', 'ibm-m4'], align: 'core', pre: ['f1-scripts'] },
  'f1-cron':         { title: 'Scheduling jobs with cron', min: 6, obj: ['LX.CRON'], courses: ['ibm-m3', 'ibm-m4'], align: 'core', pre: ['f1-scripts'] },
  'f1-bio-recipes':  { title: 'Command-line recipes for biological files', min: 10, obj: ['LX.SEARCH', 'LX.PIPES', 'LX.TEXT'], courses: [], align: 'beyond', pre: ['f1-pipes', 'f3-fasta'] },

  'f2-first-program': { title: 'Python as a calculator', min: 8, obj: ['PY.EXPR'], courses: ['rice-m1'], align: 'core', pre: ['f0-computers'] },
  'f2-types':         { title: 'Values and types', min: 8, obj: ['PY.TYPES'], courses: ['rice-m1'], align: 'core', pre: ['f2-first-program'] },
  'f2-variables':     { title: 'Variables: naming and updating values', min: 8, obj: ['PY.VARS'], courses: ['rice-m1'], align: 'core', pre: ['f2-types'] },
  'f2-functions':     { title: 'Functions: write once, use many times', min: 11, obj: ['PY.FUNC'], courses: ['rice-m2'], align: 'core', pre: ['f2-variables'] },
  'f2-logic':         { title: 'True, False and comparisons', min: 7, obj: ['PY.LOGIC'], courses: ['rice-m3'], align: 'core', pre: ['f2-variables'] },
  'f2-conditionals':  { title: 'Decisions with if, elif and else', min: 9, obj: ['PY.COND'], courses: ['rice-m3'], align: 'core', pre: ['f2-logic'] },
  'f2-modules':       { title: 'Modules: borrowing tested tools', min: 9, obj: ['PY.MODULES'], courses: ['rice-m4'], align: 'core', pre: ['f2-functions'] },
  'f2-strings':       { title: 'Strings: DNA as text', min: 9, obj: ['PY.STR'], courses: ['kaust-m3'], align: 'core', pre: ['f2-variables'] },
  'f2-lists-loops':   { title: 'Lists and for loops', min: 11, obj: ['PY.LISTS', 'PY.LOOPS'], courses: ['kaust-m3'], align: 'core', pre: ['f2-strings', 'f2-conditionals'] },
  'f2-dicts':         { title: 'Dictionaries: counting and lookup', min: 9, obj: ['PY.DICTS'], courses: ['kaust-m3'], align: 'core', pre: ['f2-lists-loops'] },
  'f2-files':         { title: 'Reading files line by line', min: 9, obj: ['PY.FILES'], courses: ['kaust-m3'], align: 'support', pre: ['f2-lists-loops'] },
  'f2-pandas':        { title: 'Tables with pandas, numbers with NumPy', min: 11, obj: ['PY.PANDAS'], courses: ['kaust-m3', 'kaust-m4'], align: 'core', pre: ['f2-lists-loops', 'f0-data'] },
  'f2-read-code':     { title: 'Read, trace, predict: understanding code first', min: 9, obj: ['PY.READ'], courses: ['rice-m2', 'rice-m3'], align: 'support', pre: ['f2-lists-loops'] },
  'f2-debug':         { title: 'Reading error messages and debugging', min: 9, obj: ['PY.DEBUG'], courses: ['rice-m1', 'rice-m2', 'rice-m3', 'rice-m4'], align: 'support', pre: ['f2-functions'] },
  'f2-bio-project':   { title: 'Mini-project: a small sequence toolkit', min: 12, obj: ['PY.BIO'], courses: ['kaust-m3'], align: 'beyond', pre: ['f2-dicts', 'f0-dogma'] },

  'f3-fasta':         { title: 'Sequences and the FASTA format', min: 8, obj: ['BI.SEQ'], courses: ['kaust-m4'], align: 'support', pre: ['f0-dogma'] },
  'f3-fastq':         { title: 'Sequencing reads and FASTQ quality scores', min: 10, obj: ['BI.FASTQ'], courses: ['kaust-m4'], align: 'support', pre: ['f3-fasta'] },
  'f3-rnaseq':        { title: 'What RNA-seq measures, and what it does not', min: 9, obj: ['BI.RNASEQ'], courses: ['kaust-m4'], align: 'core', pre: ['f0-expression', 'f3-fastq'] },
  'f3-design':        { title: 'Experimental design: conditions, replicates and confounders', min: 8, obj: ['BI.DESIGN'], courses: ['kaust-m4'], align: 'core', pre: ['f3-rnaseq'] },
  'f3-align':         { title: 'Alignment and quantification', min: 9, obj: ['BI.ALIGN'], courses: ['kaust-m4'], align: 'support', pre: ['f3-rnaseq'] },
  'f3-counts':        { title: 'The count matrix', min: 8, obj: ['BI.COUNTS'], courses: ['kaust-m4'], align: 'core', pre: ['f3-align'] },
  'f3-normalization': { title: 'Normalization: comparing samples fairly', min: 10, obj: ['BI.NORM'], courses: ['kaust-m4'], align: 'core', pre: ['f3-counts'] },
  'f3-r-basics':      { title: 'R basics: vectors, types and indexing', min: 10, obj: ['R.BASICS'], courses: ['kaust-m1'], align: 'core', pre: ['f0-data'] },
  'f3-r-control':     { title: 'Logical vectors, conditions and loops in R', min: 10, obj: ['R.LOGIC'], courses: ['kaust-m1', 'kaust-m2'], align: 'core', pre: ['f3-r-basics'] },
  'f3-r-dataframes':  { title: 'Data frames, CSV files and R Markdown', min: 9, obj: ['R.DF'], courses: ['kaust-m1', 'kaust-m2'], align: 'core', pre: ['f3-r-control'] },
  'f3-eda':           { title: 'Look before you test: exploratory data analysis', min: 8, obj: ['ST.EDA'], courses: ['kaust-m2'], align: 'core', pre: ['f3-r-dataframes'] },
  'f3-variability':   { title: 'Variability and replicates', min: 9, obj: ['ST.VAR'], courses: ['kaust-m2', 'kaust-m4'], align: 'core', pre: ['f3-eda'] },
  'f3-foldchange':    { title: 'Fold change and the log2 scale', min: 8, obj: ['ST.FC'], courses: ['kaust-m4'], align: 'core', pre: ['f3-normalization'] },
  'f3-tests':         { title: 'Hypothesis tests and p-values: t-test and ANOVA', min: 11, obj: ['ST.TEST'], courses: ['kaust-m2'], align: 'core', pre: ['f3-variability'] },
  'f3-correlation':   { title: 'Correlation and linear models', min: 9, obj: ['ST.CORR'], courses: ['kaust-m2'], align: 'core', pre: ['f3-eda'] },
  'f3-multiple':      { title: 'Testing 20,000 genes: multiple testing and FDR', min: 9, obj: ['ST.MULTI'], courses: ['kaust-m4'], align: 'core', pre: ['f3-tests'] },
  'f3-de':            { title: 'Differential expression, start to finish', min: 13, obj: ['BI.DE'], courses: ['kaust-m4'], align: 'core', pre: ['f3-foldchange', 'f3-multiple', 'f3-design'] },
  'f3-single-cell':   { title: 'Single-cell RNA-seq: one cell at a time', min: 10, obj: ['BI.SC'], courses: ['kaust-m4'], align: 'core', pre: ['f3-counts'] },
  'f3-clusters':      { title: 'Clusters, UMAP and marker genes', min: 10, obj: ['BI.CLUST'], courses: ['kaust-m4'], align: 'core', pre: ['f3-single-cell'] },
  'f3-interpret':     { title: 'From gene lists to biology', min: 9, obj: ['BI.INTERP'], courses: ['kaust-m4'], align: 'core', pre: ['f3-de'] },
  'f3-workflows':     { title: 'What real analysis workflows look like', min: 9, obj: ['BI.WORKFLOW'], courses: [], align: 'beyond', pre: ['f3-de', 'f3-clusters'] }
};

/* Lessons from BioBridge 1.0 mapped to their 2.0 successors, so earlier progress carries over. */
BB.legacyLessonMap = {
  'dna': 'f0-dogma', 'expression': 'f0-expression', 'sequencing': 'f3-fastq', 'bulk-single': 'f3-single-cell',
  'counts': 'f3-counts', 'normalization': 'f3-normalization', 'de': 'f3-de', 'umap': 'f3-clusters',
  'py-values': 'f2-variables', 'py-logic': 'f2-conditionals', 'py-loop': 'f2-lists-loops', 'py-function': 'f2-functions',
  'py-table': 'f2-pandas', 'py-debug': 'f2-debug', 'linux-terminal': 'f1-navigate', 'linux-files': 'f1-view',
  'linux-grep': 'f1-grep', 'linux-pipe': 'f1-pipes', 'linux-script': 'f1-scripts', 'r-vectors': 'f3-r-basics',
  'r-tables': 'f3-r-dataframes', 'r-if': 'f3-r-control', 'r-statistics': 'f3-tests', 'r-plot': 'f3-eda'
};

BB.lessons = BB.lessons || [];
BB.questions = BB.questions || [];
BB.glossary = BB.glossary || [];
BB.missions = BB.missions || {};
BB.pyPrograms = BB.pyPrograms || {};
