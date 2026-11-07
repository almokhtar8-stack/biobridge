/* Companion topics for KAUST: Fundamental Skills in Bioinformatics, modules 1 and 2 (R).
   Item titles checked against the public course page on 8 November 2026. */
window.BB = window.BB || {};
BB.companion = BB.companion || [];
BB.companion.push(
  {
    id: 'kaust-r-intro',
    course: 'kaust',
    module: 'kaust-m1',
    title: 'Programming and R: what and why',
    lectures: ['Brief introduction to the course', 'Lecture: Programming and R'],
    minutes: 3,
    keywords: ['R', 'programming', 'programming language', 'code', 'script', 'why R', 'CRAN', 'Bioconductor', 'reproducible'],
    explain: 'A **program** is a list of instructions that a computer follows exactly. **R** is a free programming language built for statistics, data analysis and plots. You write instructions (code), R runs them on your data, and you get results back: numbers, tables or figures. Code saved in a file is a **script**, so the same steps can run again tomorrow, or on new data. Free add-ons called **packages** extend R: CRAN is R\'s main package collection, and Bioconductor specializes in genomics.',
    why: 'Biological datasets are too large to handle by hand: an RNA-seq experiment measures about 20,000 human genes in every sample. Code applies the same steps to every gene without tiring or skipping a row, and anyone can rerun it to check your work.',
    visual: { diagram: 'r-role' },
    example: {
      lang: 'r',
      code: 'counts <- c(212, 282, 203)\nmean(counts)\nmax(counts) - min(counts)',
      output: '[1] 232.3333\n[1] 79',
      note: '`<-` stores three counts under the name `counts`. Each later line is one instruction, and R prints its result. `[1]` only marks the first value on a line; it is not part of the answer.'
    },
    mistake: {
      wrong: 'Thinking that clicking through a spreadsheet is just as good as writing a script.',
      fix: 'Clicks leave no record, so nobody (including you, next month) can see or repeat exactly what was done. A script records every step, so it can be checked, corrected and rerun on new data.'
    },
    check: {
      q: 'Why do biologists analyze data with R scripts rather than by hand in a spreadsheet?',
      options: [
        { t: 'A script records every step, so the analysis can be checked and rerun exactly, even on new data', why: 'Code applies the same instructions to every row and leaves a written record. Anyone can read it, find mistakes and get the same result again.' },
        { t: 'R does arithmetic more accurately than a spreadsheet', why: 'Simple arithmetic gives the same answer in both. R\'s advantage is that the steps are written down and repeatable.' },
        { t: 'R decides which biological question to ask', why: 'R only follows your instructions. Choosing the question, the experiment and the interpretation is still the scientist\'s job.' },
        { t: 'Spreadsheets cannot store numbers from sequencing', why: 'Spreadsheets can store such numbers. The problem is that clicked steps are hidden, so they are hard to check and repeat.' }
      ],
      answer: 0
    },
    deeper: ['f0-why-code', 'f3-r-basics']
  },
  {
    id: 'kaust-rstudio',
    course: 'kaust',
    module: 'kaust-m1',
    title: 'RStudio: a tour of the four panes',
    lectures: ['Lecture: Introduction to RStudio', 'Coding Lecture: First contact with RStudio', 'Setting up R'],
    minutes: 3,
    keywords: ['RStudio', 'install R', 'console', 'script', 'source pane', 'environment pane', 'plots pane', 'working directory', 'Ctrl+Enter'],
    explain: '**R** is the language that runs your code; **RStudio** is a separate program that gives R a comfortable workspace. Install R first, then RStudio. With a script open, RStudio shows four panes. **Source** (top left) is an editor for scripts: files of code you save and rerun. **Console** (bottom left) is where R runs code and prints results. **Environment** (top right) lists the objects you have created, and its History tab lists past commands. The bottom-right pane has tabs for Files, Plots, Packages and Help.',
    why: 'Knowing where things appear removes most first-day confusion. Code typed only in the Console is not saved as a script, so write your work in the Source pane and run lines from there. When a result surprises you, the Environment pane shows which objects really exist and what they hold.',
    visual: { diagram: 'rstudio-panes' },
    example: {
      lang: 'r',
      code: 'counts <- read.delim("counts.tsv", row.names = 1)\nls()\ndim(counts)',
      output: '[1] "counts"\n[1] 12  6',
      note: '`ls()` lists the objects in your session, the same list the Environment pane shows. In RStudio, `counts` would appear there as 12 obs. of 6 variables: 12 genes (rows) and 6 samples (columns).'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Make the `biobridge-practice` folder your working directory (Session, Set Working Directory, Choose Directory), open a new script (File, New File, R Script), type these lines and run each with Ctrl+Enter (Cmd+Enter on a Mac). If the first line prints FALSE, R is looking in another folder.',
      code: 'file.exists("data/counts.tsv")\ncounts <- read.delim("data/counts.tsv", row.names = 1)\nhead(counts, 3)',
      output: '[1] TRUE\n       ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\nHSPA1A    212    282    203  11018   8441  10838\nHSPA1B    172    202    155  10345   7330   7541\nHSPA6       2      0      3    999    725   1133'
    },
    mistake: {
      wrong: 'Typing all the code straight into the Console, then closing RStudio.',
      fix: 'The Console keeps no tidy record of your work, so the analysis is hard to repeat. Write code in a script in the Source pane, save it, and run lines from there with Ctrl+Enter.'
    },
    check: {
      q: 'You ran `x <- 5` in RStudio. Which pane confirms that the object `x` now exists in your R session?',
      options: [
        { t: 'Environment', why: 'The Environment pane lists every object in your current session with a short preview of its value, so `x` appears there with the value 5.' },
        { t: 'Files', why: 'The Files pane shows files and folders on your disk. `x` lives in R\'s memory and is not a file unless you save it.' },
        { t: 'Help', why: 'The Help pane shows documentation pages, such as the one `?mean` opens. It never lists the objects you create.' },
        { t: 'Source', why: 'The Source pane shows the text of your script. It shows the code that creates `x`, but not whether that code has actually run.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-basics']
  },
  {
    id: 'kaust-r-vectors',
    course: 'kaust',
    module: 'kaust-m1',
    title: 'Data types and vectors in R',
    lectures: ['Lecture: Data types in R', 'Coding Lecture: Data types in R - atomic and vectors'],
    minutes: 3,
    keywords: ['vector', 'data type', 'atomic', 'numeric', 'integer', 'character', 'logical', 'c()', 'class', 'indexing', 'coercion'],
    explain: 'R\'s most basic data structure is the **vector**: an ordered set of values that all have one type. The four basic (atomic) types you will use most are **numeric** (`12`, `3.5`), **integer** (whole numbers such as `5L`, or counts read from a file), **character** (text in quotes, `"HSPA1A"`) and **logical** (`TRUE`, `FALSE`). `c()` combines values into a vector and `<-` gives it a name. Positions start at 1, so `x[2]` is the second value. Arithmetic and comparisons act on every element at once. Mix types and R converts all values to the most flexible type among them: with any text, everything becomes character.',
    why: 'Every column of a data table is a vector, so these rules apply everywhere. If counts are read as text, R cannot do math on them: `mean()` returns `NA` with a warning. `class()` shows the type, so you can catch this early.',
    visual: { diagram: 'r-vector' },
    example: {
      lang: 'r',
      code: 'x <- c(12, 0, 7, 30)\nx[2]\nx * 2\nx > 5\nclass(x)\nclass(c(12, "HSPA1A"))',
      output: '[1] 0\n[1] 24  0 14 60\n[1]  TRUE FALSE  TRUE  TRUE\n[1] "numeric"\n[1] "character"',
      note: '`x[2]` is the second value, 0, because R counts from 1. `x * 2` and `x > 5` act on all four values at once. Adding one piece of text turns the whole vector into character.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Type these lines into a new script and run them one at a time. Before each line runs, predict what R will print.',
      code: 'genes <- c("HSPA1A", "ACTB", "FOS")\nctrl <- c(212, 44289, 220)\nheat <- c(11018, 55945, 311)\nheat - ctrl\ngenes[3]\nclass(genes)\nclass(heat > ctrl)\nas.numeric("203") + 1',
      output: '[1] 10806 11656    91\n[1] "FOS"\n[1] "character"\n[1] "logical"\n[1] 204'
    },
    mistake: {
      wrong: 'Using `x[0]` to get the first value, as in Python.',
      fix: 'R counts from 1, so the first value is `x[1]`. `x[0]` gives no error: it returns an empty vector, printed as `numeric(0)`, which can hide a bug.'
    },
    check: {
      q: 'You type `x <- c(212, 282, "203")`. What happens when you then run `mean(x)`?',
      options: [
        { t: 'R returns `NA` with a warning, because the quotes made every value text', why: 'One quoted value turns the whole vector into character, and `mean()` needs numbers. `as.numeric(x)` would convert the text back to numbers.' },
        { t: 'R returns 232.3333, because "203" looks like a number', why: 'R does not guess from how text looks. Anything in quotes is character, and it makes the whole vector character.' },
        { t: 'R ignores "203" and returns 247, the mean of 212 and 282', why: 'R never silently drops a value. Because a vector holds one type, 212 and 282 were converted to text too.' },
        { t: 'R stops with an error saying a vector cannot mix types', why: 'R accepts mixed values without complaint and silently converts them all to character, which is why this problem is easy to miss.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-basics']
  },
  {
    id: 'kaust-r-structures',
    course: 'kaust',
    module: 'kaust-m1',
    title: 'Vectors, matrices, lists and data frames',
    lectures: ['Lecture: Data structures in R', 'Coding Lecture: Data types in R - lists and matrices', 'Coding Lecture: Data types in R - data frames'],
    minutes: 3,
    keywords: ['data structure', 'vector', 'matrix', 'list', 'data frame', '$', 'str', 'dim', 'square brackets', 'rows and columns'],
    explain: 'R has four structures you will use constantly. A **vector** is a sequence of values of one type. A **matrix** is a grid of rows and columns, also of one type, such as a table of counts. A **list** is a container whose elements can be anything: a number, text, a vector, even a table. A **data frame** is a table whose columns can have different types: each column is a vector, and all columns have the same length. Select with square brackets, `m[row, column]`, and use `$name` for a list element or a data frame column.',
    why: 'Biological data come in all four shapes. A count matrix holds only numbers, a sample table mixes text and numbers, and many R functions, such as `t.test()`, return their results as lists. Knowing which structure you have tells you how to select from it.',
    visual: { diagram: 'r-structures' },
    example: {
      lang: 'r',
      code: 'samples <- read.delim("samples.tsv")\nclass(samples)\nsamples$temperature_C\nm <- as.matrix(read.delim("counts.tsv", row.names = 1))\nm["HSPA1A", 4:6]\nres <- list(gene = "HSPA1A", heat = m["HSPA1A", 4:6])\nres$gene',
      output: '[1] "data.frame"\n[1] 37 37 37 42 42 42\nheat_1 heat_2 heat_3\n 11018   8441  10838\n[1] "HSPA1A"',
      note: '`$` pulls one column out of the data frame as a vector. `m["HSPA1A", 4:6]` picks one row and three columns of the matrix. The list `res` keeps text and numbers together, and `$` works on it too.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Load both practice tables, look at the structure of the sample table with `str()`, then pick two genes and two samples from the count table by name.',
      code: 'counts <- read.delim("data/counts.tsv", row.names = 1)\nsamples <- read.delim("data/samples.tsv")\nstr(samples)\ndim(counts)\ncounts[c("ACTB", "FOS"), c("ctrl_1", "heat_2")]',
      output: '\'data.frame\':\t6 obs. of  4 variables:\n $ sample       : chr  "ctrl_1" "ctrl_2" "ctrl_3" "heat_1" ...\n $ condition    : chr  "control" "control" "control" "heat_shock" ...\n $ replicate    : int  1 2 3 1 2 3\n $ temperature_C: int  37 37 37 42 42 42\n[1] 12  6\n     ctrl_1 heat_2\nACTB  44289  39466\nFOS     220   1906'
    },
    mistake: {
      wrong: 'Putting gene names (text) and counts (numbers) together in one matrix.',
      fix: 'A matrix holds one type, so every count would become text and arithmetic would fail. Keep the names as row names (`row.names = 1`) or use a data frame, where each column keeps its own type.'
    },
    check: {
      q: 'You want one object holding a gene\'s name (text), its six counts (numbers) and one TRUE or FALSE flag, each kept separate. Which structure fits?',
      options: [
        { t: 'A list', why: 'Each list element can have its own type and length, so a name, six counts and a flag fit side by side in one object.' },
        { t: 'A vector', why: 'A vector holds one type, so R would turn the counts and the flag into text, and the three parts would run together.' },
        { t: 'A matrix', why: 'A matrix is a grid of a single type. Parts of different types and different lengths do not fit into one grid.' },
        { t: 'A data frame', why: 'A data frame needs one value per row in every column, so R would repeat the name and the flag on all six rows.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-dataframes', 'f3-r-basics']
  },
  {
    id: 'kaust-r-if',
    course: 'kaust',
    module: 'kaust-m1',
    title: 'if statements in R',
    lectures: ['Lecture: Introduction to Control Flow', 'Coding Lecture: If statements'],
    minutes: 3,
    keywords: ['if', 'else', 'else if', 'control flow', 'condition', 'TRUE', 'FALSE', 'unexpected else', 'condition has length > 1'],
    explain: '**Control flow** decides which lines of code run. An `if` statement runs a block of code only when its condition is TRUE: `if (condition) { ... }`. Add `else { ... }` for what to do otherwise, and `else if (condition) { ... }` to test more cases in order (Python calls this `elif`). R checks the conditions from top to bottom and runs only the first block whose condition is TRUE. The condition must be a single TRUE or FALSE value.',
    why: 'Analyses are full of decisions: flag a sample with too few reads, skip a gene with no counts, label a change as up or down. An `if` statement applies such a rule the same way every time the code runs.',
    visual: { diagram: 'if-flow' },
    example: {
      lang: 'r',
      code: 'lib <- 17.9\nif (lib < 20) {\n  status <- "low depth"\n} else if (lib < 30) {\n  status <- "ok"\n} else {\n  status <- "deep"\n}\nstatus',
      output: '[1] "low depth"',
      note: '`lib` is the library size of heat_2, in millions of reads. The first condition is TRUE, so R runs that block and skips the rest. With `lib <- 22.1`, the result would be "ok".'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Run this toy check, which flags a gene when its highest count is more than 5 times its median count. Then change "FOS" to "ACTB" or "HSPA1A" and run it again.',
      code: 'counts <- read.delim("data/counts.tsv", row.names = 1)\ngene <- "FOS"\nx <- unlist(counts[gene, ])\nif (max(x) > 5 * median(x)) {\n  print(paste(gene, "has an unusually high sample"))\n} else {\n  print(paste(gene, "has no extreme sample"))\n}',
      output: '[1] "FOS has an unusually high sample"'
    },
    mistake: {
      wrong: 'Starting a new line with `else`, below the closing brace of the `if` block.',
      fix: 'At the top level of a script, R treats a finished `if` block as complete, so a new line starting with `else` gives `unexpected \'else\'`. Keep `} else {` on one line.'
    },
    check: {
      q: 'With `lib <- c(18.4, 22.1, 20.3)`, what happens when R runs `if (lib < 20) print("low")`?',
      options: [
        { t: 'R stops with an error: `if` needs exactly one TRUE or FALSE, not three', why: 'Since R 4.2, `if` refuses a condition with several values. Use `any(lib < 20)` for one overall answer, or a loop to check each sample.' },
        { t: 'R prints "low" once, because one of the values is below 20', why: 'That is what `if (any(lib < 20))` would do. `if` never combines several values by itself; `any()` and `all()` say how to combine them.' },
        { t: 'R prints "low" once for each value below 20', why: '`if` does not loop over a vector. To act on each value separately, use a `for` loop or the vectorized `ifelse()`.' },
        { t: 'R checks only the first value, 18.4, and prints "low"', why: 'R versions before 4.2 did this, with a warning. It is now an error, because silently using only the first value hid many bugs.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-control']
  },
  {
    id: 'kaust-r-loops',
    course: 'kaust',
    module: 'kaust-m1',
    title: 'Loops in R',
    lectures: ['Lecture: Loops', 'Coding Lecture: loop statements'],
    minutes: 3,
    keywords: ['loop', 'for', 'while', 'iteration', 'running total', 'print', 'colnames', 'colSums', 'vectorized'],
    explain: 'A **loop** repeats a block of code. A `for` loop visits each element of a vector in turn: `for (v in c(12, 0, 7, 30)) { ... }` runs the block four times, with `v` set to 12, then 0, then 7, then 30. A `while` loop repeats as long as its condition stays TRUE, so the code inside must eventually make the condition FALSE, or the loop never ends. A common pattern keeps a running result: set `total <- 0` before the loop, then add each value inside it.',
    why: 'Some jobs need one step per item: reading each of 20 sample files, making one plot per gene, checking each sample against a rule. A loop writes that step once. Tracing a loop by hand, value by value, is the surest way to understand an unexpected result.',
    visual: { diagram: 'loop-trace' },
    example: {
      lang: 'r',
      code: 'x <- c(12, 0, 7, 30)\ntotal <- 0\nfor (v in x) {\n  total <- total + v\n  print(total)\n}\nsum(x)',
      output: '[1] 12\n[1] 12\n[1] 19\n[1] 49\n[1] 49',
      note: 'Each pass adds one value to `total`: 12, then 12 + 0, then 19, then 49. The last line, `sum(x)`, gets the same 49 in one step: in R, many loops can be replaced by one vectorized function.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Loop over the six samples and print each sample\'s total reads across the 12 practice genes (far fewer than a real library). Then compare with `colSums()`, which does the same job in one line.',
      code: 'counts <- read.delim("data/counts.tsv", row.names = 1)\nfor (s in colnames(counts)) {\n  total <- sum(counts[[s]])\n  print(paste(s, total))\n}\ncolSums(counts)',
      output: '[1] "ctrl_1 184692"\n[1] "ctrl_2 204986"\n[1] "ctrl_3 205182"\n[1] "heat_1 277904"\n[1] "heat_2 191297"\n[1] "heat_3 234927"\nctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\n184692 204986 205182 277904 191297 234927'
    },
    mistake: {
      wrong: 'Expecting a bare `total` inside a loop to show its value on every pass, as it does in the Console.',
      fix: 'R prints automatically only for commands run at the top level. Inside a loop or a function, nothing appears unless you call `print(total)` or `cat()` yourself.'
    },
    check: {
      q: 'What is `total` after this code runs? `total <- 0` then `for (v in c(2, 5, 1)) { total <- total + v }`',
      options: [
        { t: '8', why: 'The block runs once per value: 0 + 2 = 2, then 2 + 5 = 7, then 7 + 1 = 8. Each pass updates the same variable.' },
        { t: '1', why: 'Only the last value would remain if each pass replaced the total (`total <- v`). Here each pass adds to the running total.' },
        { t: '0', why: 'The loop body runs three times, once per value, and each pass changes `total`. It would stay 0 only if the loop never ran.' },
        { t: '2 7 8', why: 'Those are the values after each pass. The loop keeps one number and overwrites it, so only the final value, 8, remains.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-control']
  },
  {
    id: 'kaust-r-files',
    course: 'kaust',
    module: 'kaust-m1',
    title: 'Loading and writing data files',
    lectures: ['Lecture: Loading and Writing', 'Coding Lecture: Loading and Writing', 'Available data sets to be used in the course.'],
    minutes: 3,
    keywords: ['read.delim', 'read.csv', 'write.csv', 'write.table', 'working directory', 'getwd', 'TSV', 'CSV', 'row.names', 'cannot open file'],
    explain: 'Data usually arrive as plain text tables: values separated by tabs (TSV files) or by commas (CSV files), with a **header** line naming the columns. `read.delim()` reads a tab-separated file into a data frame, and `read.csv()` reads a comma-separated one. `row.names = 1` turns the first column, such as gene names, into row names. R finds a file such as `data/counts.tsv` by starting from the **working directory** (`getwd()` shows it). `write.csv()` and `write.table()` save a data frame back to a text file.',
    why: 'Every analysis starts by loading data and ends by saving results. Most "cannot open file" errors simply mean R looked in a different folder from the one holding the file. Saving results as plain text keeps them readable in any program, including a spreadsheet or the terminal.',
    visual: { diagram: 'read-table' },
    example: {
      lang: 'r',
      code: 'counts <- read.delim("counts.tsv", row.names = 1)\ndim(counts)\nhead(counts, 2)',
      output: '[1] 12  6\n       ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\nHSPA1A    212    282    203  11018   8441  10838\nHSPA1B    172    202    155  10345   7330   7541',
      note: 'The header line became the column names, and `row.names = 1` moved the gene names out of the columns, leaving 12 rows and 6 numeric sample columns. `head(counts, 2)` shows the first two rows.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Save the three heat-shock columns as a CSV file in the results folder (the first line creates it if it is missing), then read the file back in to check that nothing was lost.',
      code: 'dir.create("results", showWarnings = FALSE)\ncounts <- read.delim("data/counts.tsv", row.names = 1)\nheat <- counts[, c("heat_1", "heat_2", "heat_3")]\nwrite.csv(heat, "results/heat_counts.csv")\ncheck <- read.csv("results/heat_counts.csv", row.names = 1)\ndim(check)\nhead(check, 2)',
      output: '[1] 12  3\n       heat_1 heat_2 heat_3\nHSPA1A  11018   8441  10838\nHSPA1B  10345   7330   7541'
    },
    mistake: {
      wrong: 'Deciding the file is damaged because `read.delim("counts.tsv")` fails with `cannot open the connection`.',
      fix: 'Usually R is looking in another folder. Run `getwd()` to see where R is and `list.files()` to see what is there, then give the right relative path (such as `data/counts.tsv`) or change the working directory.'
    },
    check: {
      q: 'You read the practice file with `read.delim("counts.tsv")`, forgetting `row.names = 1`. What does `ncol()` report?',
      options: [
        { t: '7', why: 'Without `row.names = 1`, the gene names stay in an ordinary text column next to the six sample columns, so the data frame has 7 columns.' },
        { t: '6', why: 'Six is the answer with `row.names = 1`, which moves the gene names out of the columns and into the row names.' },
        { t: '12', why: '12 is the number of genes, which is the number of rows, reported by `nrow()`. `ncol()` counts columns.' },
        { t: '13', why: 'The file has 13 lines, but the header names the columns rather than becoming a row, and `ncol()` counts columns, not lines.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-dataframes']
  },
  {
    id: 'kaust-rmarkdown',
    course: 'kaust',
    module: 'kaust-m1',
    title: 'R Markdown: code, results and notes together',
    lectures: [],
    about: 'Introduced in the Module 1 description as the tool used to share code in the coding lectures.',
    minutes: 4,
    keywords: ['R Markdown', 'Rmd', 'knit', 'code chunk', 'report', 'HTML report', 'YAML header', 'reproducible', 'object not found'],
    explain: 'An **R Markdown** file (ending in `.Rmd`) mixes plain text with **code chunks**. A chunk starts with a line of three backticks followed by `{r}` and ends with a line of three backticks. While you work, you can run chunks one at a time. Pressing **Knit** in RStudio runs every chunk from top to bottom in a fresh R session and builds a report (HTML, PDF or Word) that contains your text, your code and its results. A short header between two `---` lines sets the title and the output format.',
    why: 'A knitted report shows exactly what the code produced, so readers can trust that every number and figure matches the code. Months later, your notes also remind you why you did each step. The course introduces R Markdown for sharing code, so knowing how chunks run helps you follow shared `.Rmd` files.',
    visual: { diagram: 'rmarkdown' },
    example: {
      lang: 'text',
      code: '---\ntitle: "Heat-shock counts"\noutput: html_document\n---\n\n## Load the data\nGene names become row names.\n\n```{r}\ncounts <- read.delim("counts.tsv", row.names = 1)\ndim(counts)\n```',
      output: 'counts <- read.delim("counts.tsv", row.names = 1)\ndim(counts)\n## [1] 12  6',
      note: 'The header between the `---` lines sets the title and asks for an HTML report. In the knitted report, the chunk\'s code is followed by its result, marked with `##`.'
    },
    mistake: {
      wrong: 'Assuming the document will knit because each line already worked in the Console.',
      fix: 'Knitting starts an empty R session and runs only the chunks. An object you made only in the Console does not exist there, so you get `object not found`. Create everything the report needs inside its chunks.'
    },
    check: {
      q: 'What does pressing Knit do with an R Markdown file?',
      options: [
        { t: 'Runs every chunk from top to bottom in a fresh R session and builds a report with the text, code and results', why: 'Because everything reruns from scratch, the report always matches the code. That is what makes knitted reports trustworthy and easy to share.' },
        { t: 'Runs only the chunk where your cursor is', why: 'That is what the green Run Current Chunk arrow on each chunk does. Knit runs every chunk, in order, and builds the whole report.' },
        { t: 'Copies the results already in your Console into a document', why: 'Knitting ignores your Console session and reruns the chunks itself. That is why objects made only in the Console are missing from the report.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-dataframes']
  },
  {
    id: 'kaust-logical',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'Logical values and logical vectors',
    lectures: ['Lecture: Logical values, logical vectors and operations with them.', 'Coding Lecture: Logical Vectors, part 1.', 'Coding Lecture: Logical Vectors, part 2.'],
    minutes: 3,
    keywords: ['logical', 'TRUE', 'FALSE', 'comparison', '==', '&', '|', '!', 'which', 'any', 'all', 'subsetting'],
    explain: 'A **logical value** is `TRUE` or `FALSE`. Comparing a vector with `<`, `>`, `<=`, `>=`, `==` (equal) or `!=` (not equal) gives a **logical vector**: one TRUE or FALSE per element. Combine rules with `&` (and), `|` (or) and `!` (not). Logical vectors do three jobs. Count: `sum()` treats TRUE as 1 and FALSE as 0. Select: `x[x > 5]` keeps the elements where the rule is TRUE. Locate: `which()` returns their positions. `any()` and `all()` turn a whole logical vector into one answer.',
    why: 'Almost every filtering step in data analysis is a logical vector underneath: genes with enough reads, samples from one condition, values that are missing. Once you can read `counts[counts$heat_1 > 1000, ]` as "keep the rows where this is TRUE", most data cleaning code becomes easy to follow.',
    visual: { diagram: 'logical-mask' },
    example: {
      lang: 'r',
      code: 'x <- c(12, 0, 7, 30)\nx > 5\nsum(x > 5)\nx[x > 5]\nwhich(x > 5)\nx > 5 & x < 20',
      output: '[1]  TRUE FALSE  TRUE  TRUE\n[1] 3\n[1] 12  7 30\n[1] 1 3 4\n[1]  TRUE FALSE  TRUE FALSE',
      note: 'One comparison gives four answers. `sum()` counts the TRUE values, the square brackets keep the matching values and `which()` reports their positions. With `&`, both rules must be TRUE, so 30 drops out.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Flag the genes whose raw count in heat_1 is more than 10 times their count in ctrl_1 (raw counts, so only a rough first look), then ask whether any gene has zero reads in ctrl_2.',
      code: 'counts <- read.delim("data/counts.tsv", row.names = 1)\nup <- counts$heat_1 > 10 * counts$ctrl_1\nup\nsum(up)\nrownames(counts)[up]\nany(counts$ctrl_2 == 0)',
      output: ' [1]  TRUE  TRUE  TRUE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE\n[1] 3\n[1] "HSPA1A" "HSPA1B" "HSPA6"\n[1] TRUE'
    },
    mistake: {
      wrong: 'Testing for missing values by writing `x == NA`, as you would for any other value.',
      fix: 'Any comparison with `NA` gives `NA`, because a missing value is unknown, so `x == NA` is never TRUE. Use `is.na(x)` to find missing values and `!is.na(x)` to keep the others.'
    },
    check: {
      q: 'With `x <- c(4, 15, 9, 22)`, what does `sum(x > 10)` return?',
      options: [
        { t: '2', why: '`x > 10` gives FALSE TRUE FALSE TRUE, and `sum()` counts each TRUE as 1, so the result is how many values are above 10.' },
        { t: '37', why: '37 is 15 + 22, which `sum(x[x > 10])` would give. Here `sum()` receives TRUE and FALSE values, not the numbers themselves.' },
        { t: 'FALSE TRUE FALSE TRUE', why: 'That is `x > 10` on its own. Wrapping it in `sum()` turns the four answers into a single count.' },
        { t: '2 4', why: 'Those are the positions of the TRUE values, which `which(x > 10)` returns. `sum()` returns how many there are.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-control']
  },
  {
    id: 'kaust-qc',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'Data quality control',
    lectures: ['Lecture: Data Quality Control.', 'Coding Lecture: Quality Control.'],
    minutes: 3,
    keywords: ['quality control', 'QC', 'missing values', 'NA', 'is.na', 'na.rm', 'duplicated', 'impossible values', 'outlier', 'low counts', 'filter'],
    explain: '**Quality control (QC)** means checking data for problems before analysis, then fixing or removing what is wrong by a written rule. Typical checks: **missing values** (`NA` in R; find them with `is.na()`), **duplicates** (the same row or ID twice; `duplicated()`), **impossible values** (a negative count, a culture at 420 C) and **low counts** (genes with too few reads to measure reliably). Each rule is a logical vector, so you can count what it flags before removing anything, and record how many rows each step removes.',
    why: 'Problems pass silently into every later result: a duplicated sample counts twice, one `NA` makes `mean()` return `NA`, and a typo creates a fake outlier. Written as code, the same QC rules are applied identically to every new dataset.',
    visual: { diagram: 'qc-filter' },
    example: {
      lang: 'r',
      code: 'temp <- c(37, 37, NA, 42, 420, 42)\nis.na(temp)\nmean(temp)\nmean(temp, na.rm = TRUE)\nok <- !is.na(temp) & temp >= 30 & temp <= 50\ntemp[ok]',
      output: '[1] FALSE FALSE  TRUE FALSE FALSE FALSE\n[1] NA\n[1] 115.6\n[1] 37 37 42 42',
      note: 'One missing value makes `mean()` return NA. `na.rm = TRUE` skips it, but the impossible 420 (probably a typo for 42) still pulls the mean up to 115.6. The last rule keeps only values that are present and possible.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Check the practice counts for missing values and duplicated gene names, then compare a strict low-count filter (at least 10 reads in all 6 samples) with a gentler one (at least 10 reads in at least 3 samples).',
      code: 'counts <- read.delim("data/counts.tsv", row.names = 1)\nsum(is.na(counts))\nsum(duplicated(rownames(counts)))\nstrict <- rowSums(counts >= 10) == 6\nrownames(counts)[!strict]\ngentle <- rowSums(counts >= 10) >= 3\nsum(gentle)',
      output: '[1] 0\n[1] 0\n[1] "HSPA6"\n[1] 12'
    },
    mistake: {
      wrong: 'Removing every gene that has a zero or a very low count in any sample.',
      fix: 'A gene can be off in one condition and on in the other: in the practice data, a strict filter removes HSPA6, which heat switches on. Require enough reads in at least as many samples as your smallest group.'
    },
    check: {
      q: 'A sample table accidentally lists ctrl_2 twice, with identical values. Why does this matter if you leave it in?',
      options: [
        { t: 'ctrl_2 would count as two independent replicates, so it gets double weight and the evidence looks stronger than it is', why: 'A duplicate adds no new information, yet counting it twice pulls the mean toward that sample and makes the group look larger and more consistent.' },
        { t: 'It does not matter, because identical rows cannot change any result', why: 'Identical rows still change results: the mean moves toward the repeated sample, and there seem to be more replicates than there really are.' },
        { t: 'R refuses to read a table with a repeated row', why: '`read.delim()` reads repeated rows without complaint (only `row.names = 1` refuses repeated names). That is why QC code has to look for them with `duplicated()`.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-control', 'f3-eda']
  },
  {
    id: 'kaust-eda',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'Exploratory data analysis',
    lectures: ['Lecture: Exploratory Data Analysis.', 'Coding Lecture: EDA part 1.', 'Coding Lecture: EDA part 2.'],
    minutes: 3,
    keywords: ['EDA', 'exploratory data analysis', 'summary', 'histogram', 'boxplot', 'scatter plot', 'hist', 'plot', 'outlier', 'log scale', 'median', 'mean'],
    explain: '**Exploratory data analysis (EDA)** means summarizing and plotting data before any formal test, to learn its shape and spot problems. Start with numbers: `summary()` prints the minimum, first quartile, median, mean, third quartile and maximum. Then plot, choosing the plot for the question. A **histogram** (`hist()`) shows how the values of one variable are spread. A **boxplot** (`boxplot()`) compares groups. A **scatter plot** (`plot(x, y)`) shows whether two variables move together. Counts are very skewed, so they are usually plotted on a log scale, such as `log2(count + 1)`.',
    why: 'A test squeezes data into one number, and it does so even when a sample failed or a value is a typo. Looking first catches such problems and suggests which questions and tests make sense. In the practice data, one FOS sample is far above the other five, which a plot shows at once.',
    visual: { diagram: 'eda-plots' },
    example: {
      lang: 'r',
      code: 'counts <- read.delim("counts.tsv", row.names = 1)\nfos <- unlist(counts["FOS", ])\nsummary(fos)',
      output: '   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.\n  220.0   232.2   268.5   532.8   302.5  1906.0',
      note: '`unlist()` turns the FOS row into a vector of six counts. The mean (532.8) is about twice the median (268.5) because one value, 1906 in heat_2, pulls it up. A gap like this says: plot the data.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Draw a histogram of all counts on the log scale and a scatter plot of two heat replicates with a diagonal line (they appear in the Plots pane). Then find the gene that sits furthest above the line.',
      code: 'counts <- read.delim("data/counts.tsv", row.names = 1)\nlogc <- log2(counts + 1)\nhist(unlist(logc), main = "All values", xlab = "log2(count + 1)")\nplot(logc$heat_1, logc$heat_2, xlab = "heat_1", ylab = "heat_2")\nabline(0, 1)\nd <- logc$heat_2 - logc$heat_1\nrownames(logc)[which.max(d)]\nround(max(d), 2)',
      output: '[1] "FOS"\n[1] 2.61'
    },
    mistake: {
      wrong: 'Skipping the plots because `summary()` already gives all the numbers.',
      fix: 'Very different datasets can share the same summary numbers. Plots show shape, separate groups and single odd points that summaries hide, so look at both.'
    },
    check: {
      q: 'You want to see whether two replicate samples agree, gene by gene. Which plot fits this question?',
      options: [
        { t: 'A scatter plot with one sample on each axis, one point per gene', why: 'Each gene gives one pair of values, so it becomes one point. If the replicates agree, the points lie close to a diagonal line.' },
        { t: 'A histogram of each sample', why: 'A histogram shows how values are spread within one sample. Two samples can have identical histograms even if their genes are completely shuffled.' },
        { t: 'A boxplot of the two samples', why: 'Boxplots compare overall distributions, such as medians and spread. They lose the gene-by-gene pairing, so they cannot show whether the same genes are high in both.' }
      ],
      answer: 0
    },
    deeper: ['f3-eda']
  },
  {
    id: 'kaust-correlation',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'Correlation',
    lectures: ['Lecture: Correlation', 'Coding Lecture: correlation in R'],
    minutes: 3,
    keywords: ['correlation', 'Pearson', 'Spearman', 'r value', 'cor', 'cor.test', 'scatter plot', 'outlier', 'causation'],
    explain: '**Correlation** measures how closely two numeric variables follow a straight line together. Pearson\'s coefficient, **r**, runs from -1 (a perfect falling line) through 0 (no straight-line pattern) to +1 (a perfect rising line). It has no units and says nothing about how steep the line is. In R, `cor(x, y)` computes it, and `cor.test(x, y)` adds a p-value for the null hypothesis that the true correlation is 0. **Spearman** correlation, `cor(x, y, method = "spearman")`, uses ranks instead of values, so it is less affected by outliers and catches any steadily rising or falling pattern.',
    why: 'Correlation is used to check that replicates agree, to find genes that rise and fall together, and to relate expression to traits such as age. It is also easy to over-read: one outlier can create a high r, and a correlation alone never shows that one variable causes the other.',
    visual: { diagram: 'correlation' },
    example: {
      lang: 'r',
      code: 'counts <- read.delim("counts.tsv", row.names = 1)\nlogc <- log2(counts + 1)\nround(cor(logc$ctrl_1, logc$ctrl_2), 3)\nround(cor(logc$ctrl_1, logc$heat_1), 3)\nround(cor(counts$ctrl_1, counts$heat_1), 3)',
      output: '[1] 0.993\n[1] 0.782\n[1] 0.995',
      note: 'Across the 12 genes, two controls agree almost perfectly. Control against heat is lower, because heat-shock genes jump off the line. On raw counts, three huge genes dominate and r looks near perfect again: check the scale before trusting r.'
    },
    try: { kind: 'widget', widget: 'correlation', props: {} },
    mistake: {
      wrong: 'Concluding that gene A controls gene B because their expression has r = 0.9.',
      fix: 'Correlation shows that two things vary together, not why. A third factor, such as heat stress switching on both genes, can drive them together. Testing cause needs an experiment that changes gene A directly.'
    },
    check: {
      q: 'Across 30 samples, two genes have r = 0.02. Which conclusion is justified?',
      options: [
        { t: 'There is no straight-line relationship, but a curved pattern is still possible, so look at the scatter plot', why: 'r only measures straight-line patterns. A U shape, or opposite trends in two groups, can give r near 0, so plot before concluding anything.' },
        { t: 'The two genes are completely unrelated', why: 'r near 0 rules out only a straight-line pattern. A strong curved relationship, such as a U shape, can still give r near 0.' },
        { t: 'The genes move in opposite directions', why: 'Opposite movement gives a negative r, close to -1 when the pattern is strong. A value near 0 means no consistent straight-line trend either way.' }
      ],
      answer: 0
    },
    deeper: ['f3-correlation']
  },
  {
    id: 'kaust-lm',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'Linear models',
    lectures: ['Lecture: Linear Models', 'Coding Lecture: example of a linear model', 'Coding Lecture: evaluation of a linear model in R'],
    minutes: 3,
    keywords: ['linear model', 'lm', 'regression', 'slope', 'intercept', 'residuals', 'R squared', 'fitted line', 'coef', 'summary'],
    explain: 'A **linear model** fits a straight line through data: `y = intercept + slope * x`. In R, `lm(y ~ x)` fits it; read `~` as "explained by". The **slope** is how much y changes, on average, for each 1-unit increase in x. The **intercept** is the predicted y when x is 0. The **residuals** are the vertical distances from each point to the line, and R picks the line with the smallest sum of squared residuals. `summary()` evaluates the fit: **R squared** is the fraction of the variation in y that the line explains, and each coefficient gets a p-value.',
    why: 'Linear models answer "how much" questions: how much does a count rise with sequencing depth, or expression with age or dose? They also sit underneath many tests: the equal-variance t-test and ANOVA are special cases, and RNA-seq tools such as limma fit one to every gene.',
    visual: { diagram: 'linear-model' },
    example: {
      lang: 'r',
      code: 'counts <- read.delim("counts.tsv", row.names = 1)\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\nactb <- unlist(counts["ACTB", ])\nfit <- lm(actb ~ lib)\nround(coef(fit), 1)\nround(summary(fit)$r.squared, 3)',
      output: '(Intercept)         lib\n     4948.1      2026.1\n[1] 0.846',
      note: '`lib` is library size in millions. Each extra million reads goes with about 2,026 more ACTB reads (the slope); depth explains 85 percent of ACTB\'s variation. The intercept predicts zero depth, far outside the data, so it means little.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Plot ACTB against library size with the fitted line and read the residuals. Then see how little of HSPA1A\'s variation depth explains (heat shock, not depth, drives it). Run `summary(fit)` afterwards for the full evaluation table.',
      code: 'counts <- read.delim("data/counts.tsv", row.names = 1)\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\nactb <- unlist(counts["ACTB", ])\nfit <- lm(actb ~ lib)\nplot(lib, actb)\nabline(fit)\nround(residuals(fit))\nhsp <- unlist(counts["HSPA1A", ])\nround(summary(lm(hsp ~ lib))$r.squared, 3)',
      output: 'ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\n  2061  -3501    864   1156  -1749   1169\n[1] 0.115'
    },
    mistake: {
      wrong: 'Taking a high R squared as proof that a straight line is the right model, or that x causes y.',
      fix: 'R squared only measures how much variation the line accounts for here. Curved data or one extreme point can still give a high value. Plot the residuals, and remember that a good fit does not show cause.'
    },
    check: {
      q: '`lm(expr ~ dose)` gives an intercept of 3.0 and a slope of 0.4, with dose in mg. Which reading is correct?',
      options: [
        { t: 'Each extra mg of dose goes with 0.4 more units of expression, on average', why: 'The slope is the change in y for each 1-unit increase in x: here 0.4 units of expression per extra mg.' },
        { t: 'Expression is 0.4 when the dose is 0', why: 'The prediction at dose 0 is the intercept, 3.0. The slope is a rate of change, not a predicted value.' },
        { t: 'Dose explains 40 percent of the variation in expression', why: 'That share is R squared, a separate number from `summary()`. The slope measures steepness, not how well the line fits.' }
      ],
      answer: 0
    },
    deeper: ['f3-correlation']
  },
  {
    id: 'kaust-ttest',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'The t-test: comparing two groups',
    lectures: ['Lecture: t-test & ANOVA', 'Coding Lecture: t-test.'],
    minutes: 4,
    keywords: ['t-test', 't.test', 'Welch', 'Student', 't statistic', 'standard error', 'two groups', 'paired', 'var.equal', 'degrees of freedom'],
    explain: 'A **t-test** asks whether two group means differ by more than the variation inside the groups would easily explain. The **t statistic** is the difference between the means divided by its **standard error**, a measure of noise that grows with the spread of the replicates and shrinks as you add replicates. For a given number of replicates, the further t is from 0, the smaller the p-value. In R, `t.test(a, b)` runs **Welch\'s** t-test by default, which does not assume equal spreads. `var.equal = TRUE` gives the classic Student\'s t-test, and `paired = TRUE` is for the same subjects measured twice.',
    why: 'Comparing two conditions, such as treated and untreated, is the most common question in biology. The t-test shows the logic behind almost every test: an effect divided by its uncertainty. RNA-seq tools test each gene with more elaborate versions of the same idea.',
    visual: { diagram: 'ttest' },
    example: {
      lang: 'r',
      code: 'counts <- read.delim("counts.tsv", row.names = 1)\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\nx <- log2(unlist(counts["HSPB1", ]) / lib + 1)\nt.test(x[4:6], x[1:3])',
      output: '\n\tWelch Two Sample t-test\n\ndata:  x[4:6] and x[1:3]\nt = 5.3665, df = 2.6057, p-value = 0.018\nalternative hypothesis: true difference in means is not equal to 0\n95 percent confidence interval:\n 0.257469 1.201937\nsample estimates:\nmean of x mean of y\n 7.783439  7.053736',
      note: '`x` is HSPB1 as log2(CPM + 1): positions 4 to 6 are heat, 1 to 3 control. The means differ by 0.73, about 5.4 standard errors (t), so p = 0.018: evidence for one gene in toy data, not proof.'
    },
    try: { kind: 'widget', widget: 'variability', props: {} },
    mistake: {
      wrong: 'Using an ordinary two-sample t-test when the same patients were measured before and after treatment.',
      fix: 'Two measurements on one person are linked, not independent. Use `t.test(after, before, paired = TRUE)`, which tests the within-person differences and removes the variation between people.'
    },
    check: {
      q: 'Gene X: control 10, 11, 9; heat 14, 15, 13. Gene Y: control 2, 18, 10; heat 6, 22, 14. Both means rise by 4. Which gene gets the larger t statistic?',
      options: [
        { t: 'Gene X', why: 'X\'s replicates vary by about 1 unit, Y\'s by about 8. The same difference of 4 is large compared with X\'s noise, so X\'s t is far larger.' },
        { t: 'Gene Y', why: 'Higher individual values do not matter. t compares the difference in means with the spread inside the groups, and gene Y\'s spread is large.' },
        { t: 'Both get the same t, because both means rise by 4', why: 'Equal differences can come with very different noise. t divides the difference by its standard error, which is much larger for gene Y.' }
      ],
      answer: 0
    },
    deeper: ['f3-tests', 'f3-variability']
  },
  {
    id: 'kaust-anova',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'ANOVA: comparing three or more groups',
    lectures: ['Lecture: t-test & ANOVA', 'Coding Lecture: ANOVA'],
    minutes: 3,
    keywords: ['ANOVA', 'analysis of variance', 'aov', 'F statistic', 'between groups', 'within groups', 'post hoc', 'TukeyHSD', 'three groups', 'factor'],
    explain: '**ANOVA** (analysis of variance) tests whether three or more group means are all equal. It compares two kinds of spread: how far the group means are from each other (**between** groups) and how much replicates vary inside each group (**within** groups). Their ratio is the **F statistic**, and a large F gives a small p-value. In R, `aov(y ~ group)` fits the model and `summary()` prints the table. A significant result says only that at least one mean differs. A **post hoc** test, such as `TukeyHSD()`, then compares each pair of groups.',
    why: 'Many experiments have more than two groups: several doses, time points or cell lines. A separate t-test for every pair adds a new chance of a false positive each time. ANOVA asks the overall question in one test, keeping the false positive rate at the level you chose, usually 5 percent.',
    visual: { diagram: 'anova' },
    example: {
      lang: 'r',
      code: '# made-up values: log2 expression of one gene in 3 cell lines, 3 cultures each\nexpr <- c(5.1, 5.4, 4.9, 5.3, 5.7, 5.2, 7.9, 8.2, 7.6)\ngroup <- factor(rep(c("A", "B", "C"), each = 3))\ntapply(expr, group, mean)\nsummary(aov(expr ~ group))',
      output: "       A        B        C\n5.133333 5.400000 7.900000\n            Df Sum Sq Mean Sq F value   Pr(>F)\ngroup        2 13.976   6.988   93.87 2.97e-05 ***\nResiduals    6  0.447   0.074\n---\nSignif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1",
      note: 'Made-up values for illustration. The means differ by up to 2.8 units while replicates vary by about 0.3, so F is large and p is tiny. ANOVA does not say which lines differ: A and B look alike.'
    },
    try: {
      kind: 'computer',
      lang: 'r',
      task: 'Fit the same ANOVA on your computer, then run Tukey\'s post hoc test to see which pairs of cell lines differ (read the p adj column).',
      code: 'expr <- c(5.1, 5.4, 4.9, 5.3, 5.7, 5.2, 7.9, 8.2, 7.6)\ngroup <- factor(rep(c("A", "B", "C"), each = 3))\nfit <- aov(expr ~ group)\nTukeyHSD(fit)',
      output: '  Tukey multiple comparisons of means\n    95% family-wise confidence level\n\nFit: aov(formula = expr ~ group)\n\n$group\n         diff        lwr       upr     p adj\nB-A 0.2666667 -0.4168746 0.9502079 0.4969435\nC-A 2.7666667  2.0831254 3.4502079 0.0000410\nC-B 2.5000000  1.8164588 3.1835412 0.0000738'
    },
    mistake: {
      wrong: 'Reading a significant ANOVA as "every group differs from every other group".',
      fix: 'It means only that the means are not all equal. Two groups can be alike while a third differs, like A and B in the example. A post hoc test such as `TukeyHSD()` shows which pairs differ.'
    },
    check: {
      q: 'In an ANOVA, what makes the F statistic large?',
      options: [
        { t: 'Group means far apart compared with the spread of replicates inside each group', why: 'F divides the between-group spread by the within-group spread. Distant means and tight replicates give a large F and a small p-value.' },
        { t: 'A large spread of replicates inside each group', why: 'Within-group spread is the denominator of F, so more of it makes F smaller. Noisy replicates hide differences between the means.' },
        { t: 'Having many groups, whatever their means', why: 'Adding groups does not raise F by itself: if the true means are equal, F stays around 1.' },
        { t: 'High values in every group', why: 'Adding the same amount to every value changes neither the distances between means nor the spread within groups, so F does not change.' }
      ],
      answer: 0
    },
    deeper: ['f3-tests']
  },
  {
    id: 'kaust-pvalue',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'What a p-value means (and does not mean)',
    lectures: ['Lecture: t-test & ANOVA'],
    minutes: 3,
    keywords: ['p-value', 'null hypothesis', 'null distribution', 'significance', 'statistically significant', 'alpha', '0.05', 'false positive'],
    explain: 'Every test starts from a **null hypothesis**: no real difference. Even when the null is true, the test statistic varies from experiment to experiment, following a known **null distribution**. The **p-value** is the probability, under that distribution, of a statistic at least as extreme as the one you observed: the tail area beyond your value (both tails, for the usual two-sided test). A small p-value means your data would be surprising if nothing were going on. A result is called **statistically significant** when p falls below a level chosen in advance, usually 0.05.',
    why: 'p-values appear in almost every biology paper and differential expression table, and misreading them is one of the most common errors in science. Knowing what p does and does not say stops you from claiming more than your data show.',
    visual: { diagram: 'null-pvalue' },
    example: {
      lang: 'r',
      code: 'set.seed(1)\np <- replicate(1000, t.test(rnorm(3), rnorm(3), var.equal = TRUE)$p.value)\nmean(p < 0.05)',
      output: '[1] 0.055',
      note: '`replicate()` runs 1,000 experiments in which both groups of 3 come from the same distribution, so the null is true. Still, 55 of them (about 5 percent) give p < 0.05, purely by chance.'
    },
    try: { kind: 'widget', widget: 'pvalues', props: {} },
    mistake: {
      wrong: 'Reading p = 0.03 as a 3 percent chance that the null hypothesis is true.',
      fix: 'The p-value is calculated by assuming the null is true, so it cannot be the chance that the null is true. It is the chance of data at least this extreme if there were no real difference.'
    },
    check: {
      q: 'A t-test on 3 versus 3 samples gives p = 0.40 for a gene whose mean doubled. Which conclusion is justified?',
      options: [
        { t: 'The data give no good evidence of a change; more replicates are needed to tell whether the gene responds', why: 'A large p-value means the difference is easily explained by replicate noise. That is a lack of evidence, not evidence that nothing changed.' },
        { t: 'The gene does not respond to the treatment', why: 'With only 3 replicates, real changes are often missed. p = 0.40 means weak evidence, not that the effect is zero.' },
        { t: 'There is a 40 percent chance that the gene really changed', why: 'A p-value is not the probability that any hypothesis is true. It describes how surprising the data would be if there were no difference.' }
      ],
      answer: 0
    },
    deeper: ['f3-tests', 'f3-multiple']
  },
  {
    id: 'kaust-guided',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'A first analysis, start to finish',
    lectures: ['Introduction to the dataset: Data set 4.', 'Guided analysis.'],
    minutes: 4,
    keywords: ['analysis workflow', 'guided analysis', 'load', 'check', 'explore', 'test', 'interpret', 'effect size', 'dataset'],
    explain: 'A complete analysis moves through five stages, whatever the dataset. **Load**: read the files and confirm their size and column types. **Check**: look for missing values, duplicates and impossible values, and confirm that tables match (same samples, same order). **Explore**: summarize and plot to see the shape of the data and anything odd. **Test**: choose a test that fits the question and the design, such as a t-test for two groups. **Interpret**: report the size of the effect, the p-value and the limits of the data, in plain words.',
    why: 'When you follow a long analysis, it is easy to run each command without seeing the plan behind it. Knowing which stage a line belongs to tells you why it is there, and gives you a checklist you can reuse on any new dataset.',
    visual: { diagram: 'analysis-flow' },
    example: {
      lang: 'r',
      code: 'counts <- read.delim("counts.tsv", row.names = 1)   # load\nsamples <- read.delim("samples.tsv")\nall(colnames(counts) == samples$sample)             # check\nsum(is.na(counts))\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)        # explore\nx <- log2(unlist(counts["HSPA1A", ]) / lib + 1)\nround(tapply(x, samples$condition, mean), 2)\nsignif(t.test(x ~ samples$condition)$p.value, 3)   # test',
      output: '[1] TRUE\n[1] 0\n   control heat_shock\n      3.63       8.90\n[1] 9.33e-06',
      note: 'Interpret: in this toy data, HSPA1A is about 5.3 log2 units (roughly 40-fold) higher after heat, and the replicates agree, so p is tiny. A real study would also correct for testing thousands of genes.'
    },
    mistake: {
      wrong: 'Reporting only "significant, p < 0.05" and nothing about the size of the change.',
      fix: 'Always report the effect size (such as the difference in means or the fold change) with the p-value and the number of replicates. With many replicates, a tiny, unimportant change can still give a very small p-value.'
    },
    check: {
      q: 'The count table\'s columns run from ctrl_1 to heat_3, but the sample table lists heat_1 first. What should you do before testing?',
      options: [
        { t: 'Reorder one table so both list the samples in the same order, then confirm it with code', why: 'Many R functions pair values by position, not by name. Aligning the tables and checking with `all(colnames(counts) == samples$sample)` prevents silently swapped conditions.' },
        { t: 'Nothing, because R matches samples by name automatically', why: 'Most functions match by position. If the orders differ, a heat sample can be treated as a control without any warning.' },
        { t: 'Delete the sample table and guess the groups from the column names', why: 'Column names can mislead, and the sample table holds information such as replicate and temperature. Keep it, and make the orders match.' }
      ],
      answer: 0
    },
    deeper: ['f3-eda', 'f3-tests', 'f3-r-dataframes']
  },
  {
    id: 'kaust-packages',
    course: 'kaust',
    module: 'kaust-m2',
    title: 'R packages: install once, load every session',
    lectures: ['Lecture: R packages'],
    minutes: 3,
    keywords: ['package', 'install.packages', 'library', 'CRAN', 'Bioconductor', 'BiocManager', 'there is no package called', 'could not find function', '::'],
    explain: 'A **package** is a bundle of functions, help pages and sometimes data, shared by other people. Most general packages come from **CRAN**, R\'s main package collection, and are installed with `install.packages("name")`. Many genomics packages come from **Bioconductor** and are installed with `BiocManager::install("name")`. Installing copies a package onto your computer, so you do it once (and again to update it). Loading with `library(name)` makes its functions available in the current R session, so you do it in every new session, usually at the top of a script.',
    why: 'Methods for RNA-seq, single-cell data and plotting live in packages such as DESeq2, edgeR and ggplot2, so most real scripts start with a few `library()` lines. Knowing the difference between installing and loading explains the two most common package errors and how to fix each.',
    visual: { diagram: 'r-packages' },
    example: {
      lang: 'r',
      code: 'exists("file_ext")\nlibrary(tools)\nexists("file_ext")\nfile_ext(c("counts.tsv", "reads.fastq"))',
      output: '[1] FALSE\n[1] TRUE\n[1] "tsv"   "fastq"',
      note: '`tools` comes installed with R but is not loaded when R starts, so R cannot see its function `file_ext()` until `library(tools)` runs. Packages from CRAN or Bioconductor work the same way once installed.'
    },
    mistake: {
      wrong: 'Putting `install.packages("ggplot2")` at the top of every script, before `library(ggplot2)`.',
      fix: 'That reinstalls the package on every run, which is slow and needs the internet. Install once from the Console and keep only `library(ggplot2)` in the script. If R says `could not find function`, the package is probably not loaded.'
    },
    check: {
      q: 'R says `there is no package called \'DESeq2\'` when you run `library(DESeq2)`. What is the fix?',
      options: [
        { t: 'Install it once from Bioconductor with `BiocManager::install("DESeq2")`, then run `library(DESeq2)`', why: 'The message means DESeq2 is not installed on this computer. It is a Bioconductor package, so install it with BiocManager (itself installed from CRAN), then load it.' },
        { t: 'Run `library(DESeq2)` again', why: 'Loading cannot work until the package is installed. Repeating `library()` gives the same error until you install it.' },
        { t: 'Run `install.packages("DESeq2")`', why: 'DESeq2 is not on CRAN, so `install.packages()` reports that it is not available. Bioconductor packages are installed with `BiocManager::install()`.' },
        { t: 'Restart RStudio', why: 'Restarting starts a fresh session but installs nothing. The package is still missing from the computer afterwards.' }
      ],
      answer: 0
    },
    deeper: ['f3-r-basics', 'f3-workflows']
  }
);
