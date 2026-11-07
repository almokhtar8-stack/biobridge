# BioBridge 2.2 Companion: authoring guide

The Companion is the default BioBridge experience. A student who just watched a Coursera lecture and feels
lost opens BioBridge, picks the course and the topic, understands it in 2 to 4 minutes with a visual and a tiny
example, practices if they want, then returns to Coursera. Read `tools/CONTENT_GUIDE.md` section 1 (audience,
voice, forbidden characters and words) first: every rule there applies here too.

## 1. Hard rules

- No em dashes or en dashes anywhere. No "leverage", "robust", "seamless", "elevate". The validator rejects them.
  Write ranges as "2 to 4". Use commas, colons, full stops or parentheses instead of dashes.
- Plain English, short sentences, one idea per sentence, define every technical word. English may be the
  reader's second language. No hype, no emoji, no exclamation marks.
- **Never** fabricate lecture timestamps or lecture content. You only know each course item's public title (listed
  below). Do not claim "the lecture says X". Write "This topic helps with: <title>" style content: explain the
  idea itself, correctly and independently.
- **Never** reproduce Coursera slides, quiz questions, assignment text, or solutions to graded work (quizzes,
  programming assignments, projects, final exam). Examples must be original and use BioBridge's own practice
  files. For project topics, list the skills to revise, never the solution or the project's specific functions.
- Never claim BioBridge is official, and never describe the KAUST Academy placement test.
- Inline markup allowed in text fields: `` `code` `` and `**bold**`. Nothing else.
- US spelling.
- Scientifically precise. When you simplify, say so.

## 2. Topic schema

Each course file pushes topic objects in course order (module by module, in the order the items appear on the
course page):

```js
/* Companion topics for <course name>. Lecture titles checked against the public course page on 8 November 2026. */
window.BB = window.BB || {};
BB.companion = BB.companion || [];
BB.companion.push(
  {
    id: 'ibm-paths',                    // unique, lowercase, prefix = course key ('ibm-', 'rice-', 'kaust-')
    course: 'ibm',                      // 'ibm' | 'rice' | 'kaust'
    module: 'ibm-m1',                   // module id (section 4)
    title: 'Absolute and relative paths',        // at most 60 characters, plain words
    lectures: ['Browsing directories with the Linux terminal'],  // 1 to 4 exact public item titles from section 4
    background: false,                  // optional; true = background knowledge for the listed items, not their exact subject
    about: '',                          // only when lectures is []: one sentence on where the idea appears in the course
    minutes: 3,                         // 2, 3 or 4 (honest estimate: read, look at the visual, read the example)
    keywords: ['path', 'absolute path', 'relative path', '..', '~', 'cd'],  // 4 to 12 words a confused student might search
    explain: '...',                     // 45 to 110 words: what it is and how it works
    why: '...',                         // 20 to 60 words: why the student needs it, ideally tied to biology or data
    visual: { diagram: 'paths' },       // or { widget: 'filetree', props: {} }  (section 6 and 7)
    example: {
      lang: 'bash',                     // 'bash' | 'python' | 'r' | 'text'
      code: 'cd ~/project/scripts\nls ../data',
      output: 'annotation.tsv  counts.tsv  reads.fastq  samples.tsv  sequences.fa',   // EXACT output, verified (section 8)
      cwd: '~/project',                 // folder the code runs in (default '~/project/data')
      note: 'One or two sentences that read the output for the student (10 to 40 words).',
      run: false,                       // python only: true shows a "Run real Python" button (standard library only)
      noVerify: false                   // true only if output cannot be reproduced (network, installing software); then omit
                                        // output or give none, and the note must say why
    },
    try: { ... },                       // optional practical activity (section 5)
    mistake: { wrong: '...', fix: '...' },  // optional; each 10 to 50 words; wrong = what beginners do or believe
    check: {                            // exactly one quick question, not scored
      q: '...',                         // at most 40 words
      options: [ { t: '...', why: '...' }, { t: '...', why: '...' }, { t: '...', why: '...' } ],  // 3 or 4 options
      answer: 0                         // index of the correct option (the UI shuffles)
    },
    deeper: ['f1-paths', 'f1-navigate'] // 1 to 3 existing lesson ids (section 9) for students who want more
  },
  ...
);
```

Size budget per topic (this is what keeps the student's workload low): explain + why + mistake + check together
about 150 to 300 words. Example code at most 12 lines, output at most 15 lines. A topic that needs more is two
topics, or belongs in a deeper lesson (link it in `deeper`).

Each `why` (option explanation) is 12 to 35 words. Wrong options must be plausible beginner beliefs, and their
`why` explains what is wrong. The correct option's `why` explains why it is right. Do not start a `why` with
"Correct" or "Wrong".

## 3. Try-it kinds (all optional, all clearly optional in the UI)

| kind | fields | what the student gets |
|---|---|---|
| `terminal` | `start` (e.g. `'~/project'`), `task` (one sentence), `tries` (2 to 5 commands) | The simulated Bash terminal starting in `start`, with the commands as one-tap suggestions. Every command must succeed (exit status 0) in the simulator when run in order from `start`. |
| `mission` | `mission` (id, section 7) | An existing guided terminal mission. |
| `python` | `code`, `task` | An editor that runs real Python in the browser (Pyodide). Standard library only (no pandas, no NumPy). The working folder holds counts.tsv, samples.tsv, annotation.tsv, sequences.fa, reads.fastq. |
| `trace` | `program` (id, section 7) | A recorded step-through of a Python program ("be the computer"). |
| `widget` | `widget`, `props` | An existing interactive lab (section 7). |
| `computer` | `lang` ('r', 'python' or 'bash'), `task`, `code`, `output` | Practice on the student's own computer with the downloadable practice files (RStudio, Jupyter or a terminal). The code runs from inside the `biobridge-practice` folder, so paths start with `data/`. `output` is verified exactly like an example (cwd is the project root). Python here may use pandas and NumPy. |

Use `computer` for R, pandas and NumPy topics: the browser cannot run R, pandas or NumPy.

## 4. Courses, modules and public item titles (checked 8 November 2026)

Use these titles exactly (copy and paste). They are the only facts you have about the lectures.

### IBM: Hands-on Introduction to Linux Commands and Shell Scripting (`ibm`)

- `ibm-m1` Introduction to Linux. Videos: "Course Introduction", "Introducing Linux and Unix", "Linux Distributions",
  "Overview of Linux Architecture", "Linux Terminal Overview", "Creating and Editing Text Files", "Installing Software and Updates".
  Readings: "Browsing directories with the Linux terminal", "Linux Terminal Tips - Tab completion, command history",
  "Module 1 Cheat Sheet - Introduction to Linux". Labs: "Hands-on Lab: Getting Started with the Linux Terminal",
  "Hands-on Lab: Installing and working with text editors".
- `ibm-m2` Introduction to Linux Commands. Videos: "Overview of Common Linux Shell Commands", "Informational Commands",
  "File and Directory Navigation Commands", "File and Directory Management Commands", "Viewing File Content",
  "Useful Commands for Wrangling Text Files", "Networking Commands", "File Archiving and Compression Commands".
  Readings: "Getting Help for Linux Commands", "Security - Managing File Permissions and Ownership",
  "A Brief Introduction to Networking (Optional)". Labs: "Hands-on Lab: Informational Commands",
  "Hands-on Lab: Navigating and Managing Files and Directories", "Hands-on Lab: Access Control Commands",
  "Hands-on Lab: Wrangling Text Files at the Command Line", "Hands-on Lab: Working with Networking Commands",
  "Hands-on Lab: Archiving and Compressing Files".
- `ibm-m3` Introduction to Shell Scripting. Videos: "Shell Scripting Basics", "Filters, Pipes, and Variables",
  "Useful Features of the Bash Shell", "Scheduling Jobs using Cron". Readings: "A Brief Introduction to Shell Variables",
  "Examples of Pipes", "Examples of Bash Shell Features", "Introduction to Advanced Bash Scripting",
  "Cheat Sheet: Introduction to Shell Scripting". Labs: "Hands-on Lab: Getting Started with Shell Scripting",
  "Hands-on Lab: Advanced Bash Scripting", "Hands-on Lab: Scheduling Jobs using Crontab".
- `ibm-m4` Final Project and Final Exam. Readings: "Practice Project Overview", "Cheat Sheet: Linux Commands and Shell Scripting",
  "Final Project Overview". Labs: "Hands-on Lab: Historical Weather Forecast Comparison to Actuals", "Hands-On Lab: Final Project".
  Exam: "Final Exam".

### Rice: Python Programming Essentials (`rice`)

The course runs Python 3 in CodeSkulptor3, a browser-based environment.

- `rice-m1` Python as a Calculator. Videos: "Welcome!", "Course Overview", "Hello, world!", "Python Development Environments",
  "Numbers", "Simple Expressions", "Compound Expressions", "Variables and Assignment", "Handling Errors in Python".
  Readings: "Using CodeSkulptor3", "A Short Guide to Common Errors in Python", "Practice Exercise for Expressions",
  "Practice Exercises for Variables and Assignments".
- `rice-m2` Functions. Videos: "What is a Function?", "Calling Functions", "Defining Functions", "Local Variables",
  "Understanding Function Evaluation", "Using Print and Return in Functions". Readings: "Functions", "Practice Exercises for Functions".
- `rice-m3` Logic and Conditionals. Videos: "Boolean Logic", "Logical Expressions", "Comparisons", "Conditionals",
  "More Conditionals", "Using Python Documentation", "Following Coding Standards". Readings: "Conditionals in Python",
  "Coding Standards and Style", "Practice Exercises for Logic and Conditionals".
- `rice-m4` Python Modules. Videos: "Python Modules", "The Datetime Module", "Coding the Practice Project - Part 1",
  "Coding the Practice Project - Part 2", "RPSLS Video", "Project Video". Readings: "Python Modules",
  "Datetime Module Quick Reference", "Practice Project: Rock-Paper-Scissors-Lizard-Spock", "Tips for RPSLS",
  "Project Description: Working with Dates", "OwlTest: Automated Feedback and Assessment". Project: "Project: Working with Dates".

### KAUST: Fundamental Skills in Bioinformatics (`kaust`)

- `kaust-m1` Introduction to Programming (using R). The module description says it introduces R Markdown for sharing code.
  Videos: "Brief introduction to the course", "Lecture: Programming and R", "Lecture: Introduction to RStudio",
  "Coding Lecture: First contact with RStudio", "Lecture: Data types in R", "Lecture: Data structures in R",
  "Coding Lecture: Data types in R - atomic and vectors", "Coding Lecture: Data types in R - lists and matrices",
  "Coding Lecture: Data types in R - data frames", "Lecture: Introduction to Control Flow", "Lecture: Loops",
  "Coding Lecture: If statements", "Coding Lecture: loop statements", "Lecture: Loading and Writing",
  "Coding Lecture: Loading and Writing", "Basics + where to learn more". Readings: "Setting up R",
  "Available data sets to be used in the course."
- `kaust-m2` Introduction to Programming II (using R). Videos: "Introduction to Module 2",
  "Lecture: Logical values, logical vectors and operations with them.", "Coding Lecture: Logical Vectors, part 1.",
  "Coding Lecture: Logical Vectors, part 2.", "Lecture: Data Quality Control.", "Coding Lecture: Quality Control.",
  "Lecture: Exploratory Data Analysis.", "Coding Lecture: EDA part 1.", "Coding Lecture: EDA part 2.", "Lecture: Correlation",
  "Coding Lecture: correlation in R", "Lecture: Linear Models", "Coding Lecture: example of a linear model",
  "Coding Lecture: evaluation of a linear model in R", "Lecture: t-test & ANOVA", "Coding Lecture: t-test.", "Coding Lecture: ANOVA",
  "Introduction to the dataset: Data set 4.", "Guided analysis.", "Lecture: R packages". Reading: "How do R programming assignments work?"
- `kaust-m3` Programming in Python. Videos: "Introduction to the module", "Lecture: Python and R", "The Python ecosystem",
  "Python installation and environments", "Jupyter Lab", "Lecture: Python native data structures",
  "Coding Lecture: Fundamentals in data types", "Coding Lecture: Lists and Tuples", "Coding Lecture: Sets and Dictionaries",
  "Lecture: flow control and functions.", "Coding Lecture: if conditions, for and while loops.",
  "Coding Lecture: declare and using functions in Python", "Lecture: overview of modules in Python", "Lecture: numpy",
  "Coding Lecture: numpy", "Lecture: pandas", "Coding Lecture: pandas", "Coding lecture: pandas for data exploration",
  "Coding Lecture: Visualization". Reading: "Free online Python resources". Ungraded lab: "Visualization with the pandas package".
- `kaust-m4` Bioinformatics case study: RNA-seq bulk and single-cell data analysis. (Bulk RNA-seq in R, single-cell in Python.)
  Videos: "Overview of the week", "Lecture: Introduction to the case study", "Lecture: RNA-seq technology and data normalisation",
  "Coding Lecture: Loading and normalizing RNA-seq data", "Lecture: Principal Component Analysis",
  "Coding Lecture: PCA analysis in R for RNA-seq data", "Lecture: Finding differentially expressed genes",
  "Coding Lecture: Differential expression analysis in R", "Lecture: From RNA-seq to scRNA-seq",
  "Lecture: Representing scRNA-seq experiments in Python", "Coding Lecture: Loading a scRNA-seq experiment in Python",
  "Lecture: Preprocessing scRNA-seq data", "Coding Lecture: scRNA-seq preprocessing",
  "Lecture: UMAP and dimensionality reduction in single-cell studies", "Lecture: Cell type identification",
  "Coding Lecture: Clustering and cell type identification with Python", "Coding Lecture: scRNA-seq analysis in R", "Lecture: bioAI".
  Readings: "Relevant material for Week 4", "Reference resources for single-cell analysis in Python".

## 5. Topic plan (use these ids, modules, titles and visuals; adjust a title only if it reads better)

Format: `id | module | title | lectures | visual | try`.

### IBM (26 topics)

```
ibm-linux-unix   | ibm-m1 | Linux and Unix in one minute | Introducing Linux and Unix | diagram unix-family | none
ibm-distros      | ibm-m1 | Linux distributions | Linux Distributions | diagram distros | none
ibm-architecture | ibm-m1 | Linux architecture: from hardware to you | Overview of Linux Architecture | diagram linux-layers | none
ibm-terminal     | ibm-m1 | The terminal, the shell and the prompt | Linux Terminal Overview; Hands-on Lab: Getting Started with the Linux Terminal | diagram prompt-anatomy | terminal
ibm-tree         | ibm-m1 | The file system tree | Browsing directories with the Linux terminal | diagram fs-tree | terminal
ibm-paths        | ibm-m1 | Absolute and relative paths | Browsing directories with the Linux terminal | diagram paths | widget filetree
ibm-tips         | ibm-m1 | Tab completion and command history | Linux Terminal Tips - Tab completion, command history | diagram tab-history | terminal
ibm-editors      | ibm-m1 | Editing text files with nano and Vim | Creating and Editing Text Files; Hands-on Lab: Installing and working with text editors | diagram vim-modes | mission f1-editors
ibm-install      | ibm-m1 | Installing software and updates | Installing Software and Updates | diagram package-manager | none (example noVerify)
ibm-anatomy      | ibm-m2 | What a command looks like, and getting help | Overview of Common Linux Shell Commands; Getting Help for Linux Commands | diagram command-anatomy | terminal
ibm-info         | ibm-m2 | Informational commands | Informational Commands; Hands-on Lab: Informational Commands | diagram info-commands | terminal
ibm-navigate     | ibm-m2 | Moving around: pwd, ls and cd | File and Directory Navigation Commands; Hands-on Lab: Navigating and Managing Files and Directories | diagram cd-moves | mission f1-navigate
ibm-manage       | ibm-m2 | Creating, copying, moving and deleting | File and Directory Management Commands; Hands-on Lab: Navigating and Managing Files and Directories | diagram file-ops | mission f1-manage
ibm-permissions  | ibm-m2 | Permissions and ownership | Security - Managing File Permissions and Ownership; Hands-on Lab: Access Control Commands | diagram permissions | mission f1-permissions
ibm-view         | ibm-m2 | Looking inside files | Viewing File Content | diagram head-tail | mission f1-view
ibm-wrangle      | ibm-m2 | Wrangling text: sort, uniq, cut, paste, wc | Useful Commands for Wrangling Text Files; Hands-on Lab: Wrangling Text Files at the Command Line | diagram cut-columns | mission f1-wrangle
ibm-grep         | ibm-m2 | Searching text with grep | Useful Commands for Wrangling Text Files; Hands-on Lab: Wrangling Text Files at the Command Line | diagram grep-filter | mission f1-grep
ibm-network      | ibm-m2 | Networking commands | Networking Commands; A Brief Introduction to Networking (Optional); Hands-on Lab: Working with Networking Commands | diagram network | none (example noVerify)
ibm-archive      | ibm-m2 | Archiving and compressing files | File Archiving and Compression Commands; Hands-on Lab: Archiving and Compressing Files | diagram archive | mission f1-archive-net
ibm-scripts      | ibm-m3 | Shell scripts and the shebang | Shell Scripting Basics; Hands-on Lab: Getting Started with Shell Scripting | diagram script-anatomy | mission f1-scripts
ibm-pipes        | ibm-m3 | Filters and pipes | Filters, Pipes, and Variables; Examples of Pipes | diagram pipeline | mission f1-pipes
ibm-variables    | ibm-m3 | Shell and environment variables | Filters, Pipes, and Variables; A Brief Introduction to Shell Variables | diagram shell-vars | terminal
ibm-features     | ibm-m3 | Redirection, wildcards and other Bash features | Useful Features of the Bash Shell; Examples of Bash Shell Features | diagram redirect | terminal
ibm-advanced     | ibm-m3 | Loops, conditions and arguments in scripts | Introduction to Advanced Bash Scripting; Hands-on Lab: Advanced Bash Scripting | diagram bash-loop | mission f1-script-logic
ibm-cron         | ibm-m3 | Scheduling jobs with cron | Scheduling Jobs using Cron; Hands-on Lab: Scheduling Jobs using Crontab | diagram cron-fields | widget cron
ibm-final        | ibm-m4 | Before the final project and exam: what to revise | Practice Project Overview; Final Project Overview; Final Exam | diagram ibm-review-map | none
```

### Rice (17 topics)

```
rice-hello         | rice-m1 | Your first program: Hello, world! | Hello, world!; Python Development Environments; Using CodeSkulptor3 | diagram run-program | python
rice-numbers       | rice-m1 | Numbers: whole numbers and decimals | Numbers | diagram division | python
rice-expressions   | rice-m1 | Simple and compound expressions | Simple Expressions; Compound Expressions; Practice Exercise for Expressions | diagram precedence | trace calc-precedence
rice-variables     | rice-m1 | Variables and assignment | Variables and Assignment; Practice Exercises for Variables and Assignments | diagram py-variables | trace var-update
rice-errors        | rice-m1 | Reading Python error messages | Handling Errors in Python; A Short Guide to Common Errors in Python | diagram traceback | python
rice-calling       | rice-m2 | What a function is, and calling one | What is a Function?; Calling Functions | diagram py-function | python
rice-defining      | rice-m2 | Defining your own functions | Defining Functions; Functions | diagram def-anatomy | python
rice-local         | rice-m2 | Local variables and how a call runs | Local Variables; Understanding Function Evaluation | diagram call-frames | trace func-mean3
rice-print-return  | rice-m2 | print versus return | Using Print and Return in Functions | diagram print-return | trace func-return-print
rice-boolean       | rice-m3 | Boolean logic: and, or, not | Boolean Logic; Logical Expressions | diagram truth-table | trace logic-qc
rice-comparisons   | rice-m3 | Comparisons | Comparisons | diagram comparisons | python
rice-conditionals  | rice-m3 | if, elif and else | Conditionals; More Conditionals; Conditionals in Python | diagram if-flow | trace cond-depth
rice-style         | rice-m3 | Python documentation and coding style | Using Python Documentation; Following Coding Standards; Coding Standards and Style | diagram style-compare | python
rice-modules       | rice-m4 | Modules: import and use | Python Modules | diagram py-modules | python
rice-datetime      | rice-m4 | The datetime module | The Datetime Module; Datetime Module Quick Reference | diagram date-math | trace module-dates
rice-random-mod    | rice-m4 | Random choices and wrapping around with % | Python Modules; Tips for RPSLS | diagram modulo-wheel | python
rice-dates-project | rice-m4 | The dates project: how to work on it | Project Description: Working with Dates; Project: Working with Dates; OwlTest: Automated Feedback and Assessment | diagram dev-cycle | none
```

For `rice-random-mod`, do not describe how to decide the RPSLS winner. Teach `random` and `%` with unrelated
examples (days of the week, picking a random base). For `rice-dates-project`, describe a way of working (read the
specification, write one function at a time, test with your own examples, read automated feedback), never the
project's functions or solutions.

### KAUST (36 topics)

```
kaust-r-intro      | kaust-m1 | Programming and R: what and why | Brief introduction to the course; Lecture: Programming and R | diagram r-role | none
kaust-rstudio      | kaust-m1 | RStudio: a tour of the four panes | Lecture: Introduction to RStudio; Coding Lecture: First contact with RStudio; Setting up R | diagram rstudio-panes | computer r
kaust-r-vectors    | kaust-m1 | Data types and vectors in R | Lecture: Data types in R; Coding Lecture: Data types in R - atomic and vectors | diagram r-vector | computer r
kaust-r-structures | kaust-m1 | Vectors, matrices, lists and data frames | Lecture: Data structures in R; Coding Lecture: Data types in R - lists and matrices; Coding Lecture: Data types in R - data frames | diagram r-structures | computer r
kaust-r-if         | kaust-m1 | if statements in R | Lecture: Introduction to Control Flow; Coding Lecture: If statements | diagram if-flow | computer r
kaust-r-loops      | kaust-m1 | Loops in R | Lecture: Loops; Coding Lecture: loop statements | diagram loop-trace | computer r
kaust-r-files      | kaust-m1 | Loading and writing data files | Lecture: Loading and Writing; Coding Lecture: Loading and Writing; Available data sets to be used in the course. | diagram read-table | computer r
kaust-rmarkdown    | kaust-m1 | R Markdown: code, results and notes together | (lectures: [], about: 'Introduced in the Module 1 description as the tool used to share code in the coding lectures.') | diagram rmarkdown | none
kaust-logical      | kaust-m2 | Logical values and logical vectors | Lecture: Logical values, logical vectors and operations with them.; Coding Lecture: Logical Vectors, part 1.; Coding Lecture: Logical Vectors, part 2. | diagram logical-mask | computer r
kaust-qc           | kaust-m2 | Data quality control | Lecture: Data Quality Control.; Coding Lecture: Quality Control. | diagram qc-filter | computer r
kaust-eda          | kaust-m2 | Exploratory data analysis | Lecture: Exploratory Data Analysis.; Coding Lecture: EDA part 1.; Coding Lecture: EDA part 2. | diagram eda-plots | computer r
kaust-correlation  | kaust-m2 | Correlation | Lecture: Correlation; Coding Lecture: correlation in R | diagram correlation | widget correlation
kaust-lm           | kaust-m2 | Linear models | Lecture: Linear Models; Coding Lecture: example of a linear model; Coding Lecture: evaluation of a linear model in R | diagram linear-model | computer r
kaust-ttest        | kaust-m2 | The t-test: comparing two groups | Lecture: t-test & ANOVA; Coding Lecture: t-test. | diagram ttest | widget variability
kaust-anova        | kaust-m2 | ANOVA: comparing three or more groups | Lecture: t-test & ANOVA; Coding Lecture: ANOVA | diagram anova | computer r
kaust-pvalue       | kaust-m2 | What a p-value means (and does not mean) | Lecture: t-test & ANOVA | diagram null-pvalue | widget pvalues
kaust-guided       | kaust-m2 | A first analysis, start to finish | Introduction to the dataset: Data set 4.; Guided analysis. | diagram analysis-flow | none
kaust-packages     | kaust-m2 | R packages: install once, load every session | Lecture: R packages | diagram r-packages | none
kaust-python-r     | kaust-m3 | Python and R side by side | Lecture: Python and R; The Python ecosystem | diagram python-vs-r | none
kaust-py-setup     | kaust-m3 | Python installation, environments and Jupyter Lab | Python installation and environments; Jupyter Lab | diagram env-jupyter | none
kaust-py-structures| kaust-m3 | Lists, tuples, sets and dictionaries | Lecture: Python native data structures; Coding Lecture: Fundamentals in data types; Coding Lecture: Lists and Tuples; Coding Lecture: Sets and Dictionaries | diagram py-structures | python
kaust-py-flow      | kaust-m3 | if, for and while in Python | Lecture: flow control and functions.; Coding Lecture: if conditions, for and while loops. | diagram loop-trace | trace loop-filter
kaust-py-functions | kaust-m3 | Writing functions in Python | Coding Lecture: declare and using functions in Python | diagram py-function | python
kaust-numpy        | kaust-m3 | NumPy arrays | Lecture: overview of modules in Python; Lecture: numpy; Coding Lecture: numpy | diagram numpy-axes | computer python
kaust-pandas       | kaust-m3 | pandas DataFrames | Lecture: pandas; Coding Lecture: pandas; Coding lecture: pandas for data exploration | diagram dataframe | computer python
kaust-plots        | kaust-m3 | Choosing and drawing a plot | Coding Lecture: Visualization; Visualization with the pandas package | diagram plot-choice | none
kaust-dogma        | kaust-m4 | Genes, RNA and proteins: what RNA-seq measures | Lecture: Introduction to the case study (background: true) | diagram dogma | widget dogma
kaust-rnaseq       | kaust-m4 | RNA-seq: from cells to a count matrix | Overview of the week; Lecture: Introduction to the case study; Lecture: RNA-seq technology and data normalisation | diagram rnaseq-workflow | none
kaust-reads        | kaust-m4 | Sequencing reads: FASTA and FASTQ files | Lecture: RNA-seq technology and data normalisation (background: true) | diagram fasta-fastq | widget fastq
kaust-normalize    | kaust-m4 | Normalizing RNA-seq counts | Lecture: RNA-seq technology and data normalisation; Coding Lecture: Loading and normalizing RNA-seq data | diagram count-matrix | widget countmatrix
kaust-pca          | kaust-m4 | Principal component analysis (PCA) | Lecture: Principal Component Analysis; Coding Lecture: PCA analysis in R for RNA-seq data | diagram pca | computer r
kaust-de           | kaust-m4 | Finding differentially expressed genes | Lecture: Finding differentially expressed genes; Coding Lecture: Differential expression analysis in R | diagram volcano | widget rnaseq
kaust-scrna        | kaust-m4 | From bulk to single-cell RNA-seq | Lecture: From RNA-seq to scRNA-seq | diagram bulk-vs-single | none
kaust-anndata      | kaust-m4 | Single-cell data in Python: the AnnData object | Lecture: Representing scRNA-seq experiments in Python; Coding Lecture: Loading a scRNA-seq experiment in Python | diagram anndata | none
kaust-sc-preprocess| kaust-m4 | Preprocessing single-cell data | Lecture: Preprocessing scRNA-seq data; Coding Lecture: scRNA-seq preprocessing | diagram sc-workflow | widget singlecell {mode:'qc'}
kaust-celltypes    | kaust-m4 | UMAP, clusters and cell types | Lecture: UMAP and dimensionality reduction in single-cell studies; Lecture: Cell type identification; Coding Lecture: Clustering and cell type identification with Python | diagram marker-genes | widget singlecell {mode:'clusters'}
```

Single-cell examples (AnnData, scanpy) cannot be verified here; write them as `lang: 'text'` (a short
illustration of the structure or the order of steps) or as `python` with `noVerify: true` and a note, and keep the
code to standard, widely documented calls (`anndata`, `scanpy.pp.*`, `scanpy.tl.*`). Do not invent function names.

## 6. Diagram catalog (implemented in js/diagrams/*.js; reference by name only)

Every diagram is original, labeled and step-by-step. Names and what each shows:

Linux: `unix-family` (Unix 1969 to BSD, macOS; GNU and the Linux kernel 1991 to distributions), `distros` (one kernel,
many distributions; package manager per family), `linux-layers` (hardware, kernel, shell and system tools, applications,
you), `prompt-anatomy` (`student@biobridge:~/project$`), `fs-tree` (/ with bin, etc, home, tmp; /home/student/project
with data, scripts, results), `paths` (from ~/project/scripts to counts.tsv: absolute `/home/student/project/data/counts.tsv`
versus relative `../data/counts.tsv`; `.` `..` `~`), `tab-history` (Tab completes `cd pro` to `cd project/`; Up recalls
earlier commands; `history`), `vim-modes` (Normal, Insert with i and Esc, command line `:w` `:q` `:wq` `:q!`; nano shortcuts
for comparison), `package-manager` (repository, apt or dnf, dependencies, update versus upgrade versus install, sudo),
`command-anatomy` (`ls -l -h data`: command, options, argument; `man ls`, `ls --help`), `info-commands` (question to command
table: whoami, id, hostname, uname, date, df -h, du -sh, ps, top), `cd-moves` (a "you are here" marker moving with
`cd project`, `cd data`, `cd ..`, `cd`), `file-ops` (mkdir, touch, cp, mv to rename, mv to move, rm, shown on a results
folder), `permissions` (`-rwxr-xr--` split into type, owner, group, others; r=4 w=2 x=1; `chmod +x`, `chmod 755`), `head-tail`
(a 13-line counts.tsv: `head -3`, `tail -2`, `wc -l`, `less`), `cut-columns` (samples.tsv columns; `cut -f 1,2`; `sort`, `uniq -c`),
`grep-filter` (lines of counts.tsv in, lines matching HSP out; `-c`, `-v`, `-i`), `network` (your computer, the internet, a data
server; ping, curl, wget, hostname -I), `archive` (tar bundles a folder into one file, gzip shrinks one file, .tar.gz, zip;
create and extract flags), `script-anatomy` (count_seqs.sh line by line: shebang, comment, `$1`, `$(...)`, echo; run with
`bash script.sh` or `chmod +x` then `./script.sh`), `pipeline` (`cut -f 1 counts.tsv | grep HSP | sort | wc -l` with the data
after each stage), `shell-vars` (`sample=heat_1`, `echo $sample`, no spaces around =, `export`, child processes, PATH),
`redirect` (screen versus `>` overwrite versus `>>` append versus `2>` errors versus `<` input; wildcards `*.tsv`),
`bash-loop` (`for f in *.tsv` visiting each file; `if [ -s "$f" ]`), `cron-fields` (five fields and the command;
`30 2 * * 1`), `ibm-review-map` (the three teaching modules as columns with the skills each one tests).

Python: `run-program` (code, interpreter, output; where it runs: CodeSkulptor3, your computer, BioBridge),
`division` (7 / 2 = 3.5, 7 // 2 = 3, 7 % 2 = 1 shown as groups of dots), `precedence` (`2 + 3 * 4 ** 2` evaluated step by
step), `py-variables` (names are labels on values; `x = 5`, `y = x`, `x = x + 1`), `traceback` (anatomy of a NameError message,
read from the bottom), `py-function` (inputs, body, return value; the call is replaced by its value), `def-anatomy` (`def`
line, parameters, colon, indented body, `return`), `call-frames` (global frame and a function frame created and removed),
`print-return` (print shows text, return hands a value back; `x = f()` gets None when f only prints), `truth-table`
(and, or, not), `comparisons` (== != < > <= >=; `=` versus `==`), `if-flow` (if, elif, else; the first true branch wins),
`style-compare` (the same function written badly and well), `py-modules` (`import math`, `math.sqrt`, `from datetime import date`),
`date-math` (date minus date gives timedelta; date plus timedelta gives date), `modulo-wheel` (days of the week on a wheel,
`(day + n) % 7`), `dev-cycle` (read the spec, write one function, test it yourself, submit, read feedback, fix).

KAUST and biology: `r-role` (data in, R, results out; CRAN and Bioconductor), `rstudio-panes` (Source, Console,
Environment and History, Files Plots Packages Help), `r-vector` (`x <- c(12, 0, 7, 30)` with positions 1 to 4; `x[2]`;
`x * 2`; `x > 5`), `r-structures` (vector, matrix, list, data frame), `loop-trace` (visiting 12, 0, 7, 30 and updating a total;
language-neutral), `read-table` (tab-separated text to a data frame or DataFrame with header and row names), `rmarkdown`
(text and code chunks, Knit, report), `logical-mask` (comparison gives TRUE/FALSE; `sum()` counts; subsetting keeps TRUE),
`qc-filter` (missing values, duplicates, impossible values, low counts, removed step by step), `eda-plots` (histogram,
boxplot, scatter: which question each answers), `correlation` (r near +1, 0, -1; outlier warning; not causation),
`linear-model` (points, fitted line, slope, intercept, residuals, R squared), `ttest` (two groups: difference in means
divided by the noise), `anova` (three groups: spread between group means versus spread within groups), `null-pvalue`
(the null distribution, the observed value, the tail area is the p-value), `analysis-flow` (load, check, explore, test,
interpret), `r-packages` (CRAN and Bioconductor, `install.packages()` once, `library()` each session), `python-vs-r`
(side-by-side syntax), `env-jupyter` (separate environments with their own packages; notebook cells and run order),
`py-structures` (list, tuple, set, dict), `numpy-axes` (genes by samples array; `axis=0` versus `axis=1`), `dataframe`
(index, columns, values; selecting and filtering), `plot-choice` (question to plot type), `dogma` (DNA to mRNA to protein,
transcription and translation, codons), `rnaseq-workflow` (cells, RNA, cDNA library, sequencer, FASTQ, alignment and
counting, count matrix, normalization, statistics, biology), `fasta-fastq` (a FASTA record and a FASTQ record; quality
character to Phred score to error chance), `count-matrix` (genes by samples, library sizes, CPM, log2(CPM + 1), using the
practice counts), `pca` (many genes per sample compressed to PC1 and PC2; samples separate by condition), `volcano`
(log2 fold change against minus log10 adjusted p; up, down, not significant), `bulk-vs-single` (bulk averages many cells;
single-cell measures each cell), `anndata` (X cells by genes, obs, var), `sc-workflow` (QC, normalize, log, highly
variable genes, PCA, neighbors, UMAP and clusters, markers, cell types), `marker-genes` (clusters by marker genes; naming
clusters from markers).

## 7. Existing widgets, missions and trace programs

Widgets (`visual: { widget }` or `try: { kind: 'widget' }`): `dogma`, `expression`, `journey`, `filetree`, `datatable`,
`scale`, `cron`, `fastq`, `countmatrix`, `normalization`, `rnaseq`, `log2`, `variability`, `correlation`, `pvalues`,
`singlecell` (props `{ mode: 'qc' }` or `{ mode: 'clusters' }`), `methods`.

Missions: `f1-terminal` First commands on the server; `f1-navigate` Find your way around the project; `f1-manage` Organize
the project folder; `f1-view` Take a first look at the data; `f1-grep` Find the heat-shock genes; `f1-wrangle` Reshape the
count table; `f1-permissions` Make a script runnable; `f1-archive-net` Pack, compress and check; `f1-editors` Write a note
with nano; `f1-pipes` Chain commands and save results; `f1-scripts` Read, run and write a script; `f1-script-logic` Loop over
files and make decisions; `f1-bio-recipes` Quick checks on sequence files; `f3-fasta` Explore a FASTA file.

Trace programs: `calc-precedence`, `types-convert`, `var-update`, `func-mean3`, `func-return-print`, `logic-qc`,
`cond-depth`, `module-dates`, `str-methods`, `loop-filter`, `loop-codons`, `dict-count`, `dict-translate`, `parse-lines`,
`read-max`, `debug-reset`.

## 8. Verifying examples (required)

Every `example` with lang bash, python or r (unless `noVerify`), and every `try` of kind `computer`, is executed by
`tools/verify_code.py` and must match `output` exactly (trailing spaces ignored). Get the exact output with:

```
node tools/validate.mjs --quiet          # once, writes tools/out/content.json
python3 tools/run_in_vfs.py bash 'ls ../data' --cwd '~/project/scripts'
python3 tools/run_in_vfs.py python 'print(7 // 2)'
python3 tools/run_in_vfs.py r 'x <- c(12, 0, 7, 30); print(x[2])'
python3 tools/run_in_vfs.py r 'counts <- read.delim("data/counts.tsv", row.names = 1); print(dim(counts))' --cwd '~/project'
```

Paste the printed output verbatim. Bash runs in a terminal 80 columns wide (so `ls` prints columns). Bash examples
should also behave the same in BioBridge's simulated shell (it supports pwd ls cd find mkdir rmdir touch cp mv rm chmod
file cat less more head tail wc grep sort uniq cut paste tr echo printf whoami id hostname uname date df du ps top which
type history man gzip gunzip zcat tar zip unzip nano bash sh source export read test seq basename dirname crontab, pipes,
redirection, variables, `$(...)`, `$((...))`, globs, for/if/while; not awk, sed, curl, wget, ping, apt or sudo). Check a
command in the simulator with:

```
node -e "global.window=global;window.BB={};require('./content/vfs.js');require('./js/shell.js');const sh=new BB.Shell(BB.vfs);sh.cwd='/home/student/project';const r=sh.run('ls data');console.log(r.status, r.chunks.map(c=>c.s).join(''))"
```

Avoid commands whose output changes with time or machine (date, uname, df, ps, du on real files) in verified
examples; if you must show one, set `noVerify: true` and say in the note that the output depends on the machine.

The practice files (same in the browser terminal and in the downloadable ZIP):

```
~/project/README.txt
~/project/data/counts.tsv       gene, ctrl_1, ctrl_2, ctrl_3, heat_1, heat_2, heat_3 (12 genes: HSPA1A HSPA1B HSPA6 DNAJB1 HSPH1 HSPB1 BAG3 ACTB GAPDH EEF1A1 TP53 FOS)
~/project/data/samples.tsv      sample, condition (control or heat_shock), replicate, temperature_C (37 or 42)
~/project/data/annotation.tsv   symbol, chromosome, category (heat_shock, housekeeping, transcription_factor), description
~/project/data/sequences.fa     6 toy DNA sequences seq_01 to seq_06
~/project/data/reads.fastq      8 toy reads READ_0001 to READ_0008
~/project/scripts/count_seqs.sh (not executable: mode 644)   ~/project/scripts/line_report.sh (executable)
~/project/results/              empty
```

All numbers are simulated for teaching; say so when it matters.

## 9. Lesson ids for `deeper`

f0-bioinformatics, f0-cells-dna, f0-dogma, f0-expression, f0-computers, f0-data, f0-why-code, f0-discovery,
f1-linux, f1-terminal, f1-paths, f1-navigate, f1-manage, f1-view, f1-grep, f1-wrangle, f1-permissions, f1-archive-net,
f1-editors, f1-pipes, f1-scripts, f1-script-logic, f1-cron, f1-bio-recipes,
f2-first-program, f2-types, f2-variables, f2-functions, f2-logic, f2-conditionals, f2-modules, f2-strings, f2-lists-loops,
f2-dicts, f2-files, f2-pandas, f2-read-code, f2-debug, f2-bio-project,
f3-fasta, f3-fastq, f3-rnaseq, f3-design, f3-align, f3-counts, f3-normalization, f3-r-basics, f3-r-control,
f3-r-dataframes, f3-eda, f3-variability, f3-foldchange, f3-tests, f3-correlation, f3-multiple, f3-de, f3-single-cell,
f3-clusters, f3-interpret, f3-workflows.
