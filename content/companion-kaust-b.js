/* Companion topics for KAUST: Fundamental Skills in Bioinformatics, modules 3 (Python) and 4 (RNA-seq case study).
   Item titles checked against the public course page on 8 November 2026. */
window.BB = window.BB || {};
BB.companion = BB.companion || [];
BB.companion.push(
  {
    id: "kaust-python-r",
    course: "kaust",
    module: "kaust-m3",
    title: "Python and R side by side",
    lectures: ["Lecture: Python and R", "The Python ecosystem"],
    minutes: 3,
    keywords: ["Python", "R", "differences", "index from 0", "index from 1", "indentation", "packages", "ecosystem", "pandas", "Bioconductor"],
    explain: "Python and R are both free languages used every day in bioinformatics. R was built by statisticians: vectors, data frames, statistical tests and plots come built in, and Bioconductor adds more than 2,000 packages for genomic data. Python is a general-purpose language that also runs pipelines, web tools and machine learning. For data work you add packages, together called its **ecosystem**: NumPy for arrays, pandas for tables, matplotlib for plots, scanpy for single-cell data. Small syntax differences matter: Python counts positions from 0 (R from 1), assigns with `=` (R usually with `<-`) and marks blocks by indentation (R uses braces `{ }`).",
    why: "Module 4 needs both: its item titles name R for PCA and differential expression, and Python for loading and clustering single-cell data. Knowing the differences in advance prevents off-by-one errors when you switch.",
    visual: { diagram: "python-vs-r" },
    example: {
      lang: "python",
      code: "counts = [212, 282, 203]                    # R: counts <- c(212, 282, 203)\nprint(counts[0])                            # R: counts[1]\nprint(len(counts))                          # R: length(counts)\nprint(round(sum(counts) / len(counts), 1))  # R: round(mean(counts), 1)\nfor c in counts:                            # R: for (c in counts) {\n    if c > 250:                             # R:   if (c > 250) print(c)\n        print(c)                            # R: }",
      output: "212\n3\n232.3\n282",
      note: "The same steps in both languages. The first item is `counts[0]` in Python but `counts[1]` in R. Python ends the loop body where the indentation stops; R ends it at the closing brace.",
      run: true
    },
    mistake: {
      wrong: "Positions work the same way in both languages, so `counts[1]` is the first value in Python too.",
      fix: "Python counts from 0, so `counts[1]` is the second value. Negative positions differ as well: in Python `x[-1]` is the last item, while in R `x[-1]` means everything except the first."
    },
    check: {
      q: "In R, `x <- c(12, 0, 7, 30)` and `x[2]` gives `0`. In Python, `x = [12, 0, 7, 30]`. Which expression gives `0`?",
      options: [
        { t: "`x[1]`", why: "Python numbers positions from 0, so the second item, 0, sits at position 1. For positive positions, R's number is always one higher." },
        { t: "`x[2]`", why: "This copies the R code, but in Python position 2 is the third item, so it gives 7." },
        { t: "`x[[2]]`", why: "Double brackets are R syntax for lists. Python reads the inner `[2]` as a list used as a position and stops with a TypeError." }
      ],
      answer: 0
    },
    deeper: ["f2-lists-loops", "f3-r-basics"]
  },
  {
    id: "kaust-py-setup",
    course: "kaust",
    module: "kaust-m3",
    title: "Python installation, environments and Jupyter Lab",
    lectures: ["Python installation and environments", "Jupyter Lab"],
    minutes: 3,
    keywords: ["install", "environment", "conda", "pip", "venv", "Jupyter Lab", "notebook", "kernel", "cell order", "ModuleNotFoundError"],
    explain: "The Python **interpreter** is the program that runs your code. Packages such as pandas are installed separately, with `pip` or `conda`. An **environment** is a separate folder with its own Python and packages, so two projects can use different pandas versions without conflict; conda and Python's `venv` both create them. **Jupyter Lab** is a browser workspace for **notebooks**: files of code cells and text cells. Running a cell sends it to the **kernel**, the Python process behind the notebook, which remembers every variable. Cells run in the order you run them, not the order on the page; the number in `[ ]` shows that order.",
    why: "Most \"it works on my computer but not on yours\" problems come from environments: a missing package or a different version. A notebook that works only in a special cell order cannot be trusted or shared.",
    visual: { diagram: "env-jupyter" },
    example: {
      lang: "text",
      code: "Cell 1:  n = 10\nCell 2:  n = n * 2\nCell 3:  print(n)\n\nRun 1, 2, 3                  prints 20\nRun 1, 2, 2, 3               prints 40 (cell 2 ran twice)\nRestart kernel, then run 3   NameError: name 'n' is not defined",
      note: "The kernel keeps every variable from every cell you ran, in the order you ran them. Before trusting results, use Kernel, then Restart Kernel and Run All Cells, so the notebook runs once from top to bottom."
    },
    mistake: {
      wrong: "`import pandas` fails with ModuleNotFoundError although I installed pandas, so the installation is broken.",
      fix: "Usually pandas went into another environment, not the one your notebook's kernel uses. Check the kernel name at the top right of the notebook, or run `%pip install pandas` in a cell: it installs into the kernel's environment."
    },
    check: {
      q: "A classmate's notebook runs fine on their laptop. On yours, the first cell, `import scanpy as sc`, gives ModuleNotFoundError. What is the most likely cause?",
      options: [
        { t: "scanpy is not installed in the environment your notebook's kernel uses", why: "ModuleNotFoundError means Python searched its current environment and did not find scanpy. Install it there, or switch to a kernel that has it." },
        { t: "The notebook file was damaged when it was copied", why: "A damaged file usually fails to open at all. This error names a missing module, which points to the environment." },
        { t: "scanpy works only on the computer where it was first installed", why: "A package works on any computer where it is installed. Each environment simply needs its own installation." },
        { t: "The cells must be run from the bottom up", why: "Run order matters for variables, but an import in the first cell needs no other cell. The package itself is missing." }
      ],
      answer: 0
    },
    deeper: ["f2-modules", "f2-first-program"]
  },
  {
    id: "kaust-py-structures",
    course: "kaust",
    module: "kaust-m3",
    title: "Lists, tuples, sets and dictionaries",
    lectures: ["Lecture: Python native data structures", "Coding Lecture: Fundamentals in data types", "Coding Lecture: Lists and Tuples", "Coding Lecture: Sets and Dictionaries"],
    minutes: 3,
    keywords: ["list", "tuple", "set", "dictionary", "dict", "append", "key", "value", "duplicates", "immutable", "empty set"],
    explain: "Python has four built-in containers. A **list**, `[\"ctrl_1\", \"heat_1\"]`, keeps items in order and can change: `append` adds an item and `x[0] = ...` replaces one. A **tuple**, `(37, 42)`, is also ordered but cannot change after it is made, which suits fixed records. A **set**, `{\"HSPA1A\", \"ACTB\"}`, keeps each item only once and has no order, so there is no first item; it answers \"is this in?\" quickly and finds shared items with `&`. A **dictionary**, `{\"ctrl_1\": 18.4}`, links unique keys to values, so you look values up by name instead of by position.",
    why: "The right container makes code short and correct: a list for samples in order, a set for unique gene names or for genes shared by two lists, a dictionary from sample to condition. pandas tables build on the same ideas.",
    visual: { diagram: "py-structures" },
    example: {
      lang: "python",
      code: "samples = [\"ctrl_1\", \"ctrl_2\", \"heat_1\"]   # list\nsamples.append(\"heat_2\")\ntemps = (37, 42)                           # tuple\ngenes = {\"HSPA1A\", \"ACTB\", \"HSPA1A\"}       # set\nlib = {\"ctrl_1\": 18.4, \"heat_1\": 24.6}     # dictionary\nprint(samples[0], len(samples), temps[1])\nprint(len(genes), \"ACTB\" in genes)\nprint(lib[\"heat_1\"])",
      output: "ctrl_1 4 42\n2 True\n24.6",
      note: "The list grew to 4 samples. The set silently dropped the second HSPA1A, so it holds 2 genes. The dictionary found heat_1's library size (in millions) by its name.",
      run: true
    },
    try: {
      kind: "python",
      task: "Run it, then add \"DNAJB1\" to the chaperones list and run it again. Which genes are shared now?",
      code: "induced = [\"HSPA1A\", \"HSPA1B\", \"DNAJB1\", \"HSPA1A\"]\nchaperones = [\"HSPA1A\", \"HSPA1B\", \"HSPH1\", \"BAG3\"]\nprint(len(induced), len(set(induced)))\nshared = set(induced) & set(chaperones)\nprint(sorted(shared))\ncondition = {\"ctrl_1\": \"control\", \"heat_1\": \"heat_shock\"}\ncondition[\"heat_2\"] = \"heat_shock\"\nprint(len(condition), condition[\"heat_2\"])"
    },
    mistake: {
      wrong: "Writing `x = {}` to start an empty set.",
      fix: "`{}` makes an empty dictionary. Use `set()` for an empty set. Braces holding single items, such as `{\"ACTB\"}`, make a set; braces holding `key: value` pairs make a dictionary."
    },
    check: {
      q: "You have the induced genes from two experiments and want the genes found in both, each listed once. Which container fits best?",
      options: [
        { t: "Two sets, combined with `&`", why: "Sets drop duplicates automatically, and `a & b` keeps only the items present in both. That is exactly this question." },
        { t: "Two tuples", why: "Tuples keep their order and their duplicates and cannot change. Finding the shared items would need loops that a set does for you." },
        { t: "Two lists, joined with `+`", why: "`+` puts one list after the other and keeps every item, duplicates included. It finds nothing shared." },
        { t: "A dictionary with gene names as keys", why: "A dictionary is for looking up a value by its key, and this task has no values to look up. Sets are built for comparing collections." }
      ],
      answer: 0
    },
    deeper: ["f2-lists-loops", "f2-dicts"]
  },
  {
    id: "kaust-py-flow",
    course: "kaust",
    module: "kaust-m3",
    title: "if, for and while in Python",
    lectures: ["Lecture: flow control and functions.", "Coding Lecture: if conditions, for and while loops."],
    minutes: 3,
    keywords: ["if", "elif", "else", "for loop", "while loop", "indentation", "colon", "break", "continue", "infinite loop"],
    explain: "`if` runs a block only when its condition is True; `elif` and `else` add other cases, and only the first true branch runs. `for` repeats a block once for each item of a collection: `for c in counts:`. `while` repeats a block as long as its condition stays True, which suits tasks where you cannot know the number of repeats in advance. A colon starts each block, and indentation (4 spaces) marks what is inside it; the first line without the indentation is outside. `break` leaves a loop early and `continue` skips to the next item.",
    why: "Loops and conditions are how a program decides, gene by gene or sample by sample: skip genes with zero counts, flag samples below a quality cutoff. pandas and NumPy hide many loops, but they follow the same logic.",
    visual: { diagram: "loop-trace" },
    example: {
      lang: "python",
      code: "counts = [12, 0, 7, 30]\ntotal = 0\nfor c in counts:\n    if c >= 10:\n        total = total + c\nprint(\"total of counts >= 10:\", total)\ncells = 1000\ndoublings = 0\nwhile cells < 1000000:\n    cells = cells * 2\n    doublings = doublings + 1\nprint(doublings, \"doublings give\", cells, \"cells\")",
      output: "total of counts >= 10: 42\n10 doublings give 1024000 cells",
      note: "In the for loop only 12 and 30 pass the test, so the total is 42. The while loop keeps doubling until `cells < 1000000` is False: 10 doublings give 1,024,000 cells.",
      run: true
    },
    try: {
      kind: "trace",
      program: "loop-filter"
    },
    mistake: {
      wrong: "A while loop stops by itself after enough repeats.",
      fix: "It stops only when its condition becomes False. If nothing inside the loop changes the condition, for example if you forget `cells = cells * 2`, it runs forever. In Jupyter, stop it with the square stop button (Interrupt the kernel)."
    },
    check: {
      q: "A loop starts with `cells = 1000` and runs `while cells < 5000:`, doubling `cells` on each pass. What is `cells` when the loop ends?",
      options: [
        { t: "8000", why: "The values go 1000, 2000, 4000, 8000. The condition is checked before each pass, and 8000 is the first value that fails it." },
        { t: "4000", why: "After 4000 the condition is checked again. 4000 < 5000 is still True, so the loop doubles once more." },
        { t: "5000", why: "Doubling 1000 never gives exactly 5000. A while loop stops at the first value that fails the test, not at the limit itself." },
        { t: "It never ends", why: "The body doubles `cells` on every pass, so the condition must become False. A loop runs forever only when nothing changes its condition." }
      ],
      answer: 0
    },
    deeper: ["f2-conditionals", "f2-lists-loops"]
  },
  {
    id: "kaust-py-functions",
    course: "kaust",
    module: "kaust-m3",
    title: "Writing functions in Python",
    lectures: ["Coding Lecture: declare and using functions in Python"],
    minutes: 3,
    keywords: ["function", "def", "return", "parameter", "argument", "call", "None", "print versus return", "default value", "docstring", "local variable"],
    explain: "A **function** is a named block of code you can reuse. `def` starts it, followed by the name, the **parameters** in parentheses and a colon; the indented body does the work, and `return` hands a value back. Calling `cpm(212, 18400000)` assigns the **arguments** 212 and 18,400,000 to the parameters, runs the body, and replaces the call with the returned value. Parameters can have default values, such as `pseudocount=1`. Variables created inside a function are **local**: they vanish when it returns. A function without `return` gives back `None`.",
    why: "You write a calculation once, test it, then use it for every gene and every sample; a fix in one place fixes every use. Libraries such as pandas and scanpy are large collections of functions, so reading calls like these is a daily skill.",
    visual: { diagram: "py-function" },
    example: {
      lang: "python",
      code: "def cpm(count, library_size):\n    \"\"\"Return counts per million.\"\"\"\n    return count / library_size * 1000000\n\nctrl = cpm(212, 18400000)\nheat = cpm(11018, 24600000)\nprint(round(ctrl, 1), round(heat, 1))\nprint(round(heat / ctrl, 1))",
      output: "11.5 447.9\n38.9",
      note: "One function gives the CPM of HSPA1A in ctrl_1 and in heat_1: per million reads, heat_1 has about 39 times more. The text in triple quotes is a docstring, which `help(cpm)` shows.",
      run: true
    },
    try: {
      kind: "python",
      task: "Run it, then add `print(log2fc(100, 100))`. Which value means no change? Then try a gene whose value halves.",
      code: "import math\n\ndef log2fc(heat, ctrl, pseudocount=1):\n    \"\"\"log2 fold change of heat over control.\"\"\"\n    return math.log2((heat + pseudocount) / (ctrl + pseudocount))\n\nprint(round(log2fc(447.9, 11.5), 2))\nprint(round(log2fc(447.9, 11.5, pseudocount=0), 2))"
    },
    mistake: {
      wrong: "I ran the cell with `def cpm(...)`, nothing appeared, so the function does not work.",
      fix: "A `def` block only creates the function. Nothing runs until you call it with parentheses and arguments, as in `cpm(212, 18400000)`, and you see a result only through `print` or as the last line of a notebook cell."
    },
    check: {
      q: "After `def total(a, b): print(a + b)`, you run `x = total(2, 3)`. What is stored in `x`?",
      options: [
        { t: "`None`", why: "The function prints 5 but has no `return`, so the call hands back `None`, and that is what `x` stores." },
        { t: "`5`", why: "5 appears on the screen, but printing is not returning. Without `return`, the value is shown and then lost." },
        { t: "`\"5\"`, the printed text", why: "`print` sends text to the screen only. It never hands that text back to the code that called the function." },
        { t: "Nothing, because Python stops with an error", why: "A function without `return` is allowed. Python quietly returns `None`, which often causes a confusing error a few lines later." }
      ],
      answer: 0
    },
    deeper: ["f2-functions"]
  },
  {
    id: "kaust-numpy",
    course: "kaust",
    module: "kaust-m3",
    title: "NumPy arrays",
    lectures: ["Lecture: overview of modules in Python", "Lecture: numpy", "Coding Lecture: numpy"],
    minutes: 3,
    keywords: ["NumPy", "np", "array", "shape", "axis", "axis=0", "axis=1", "vectorized", "import", "module", "loadtxt"],
    explain: "A **module** is a file of Python code that you load with `import`; NumPy is a package of modules, usually loaded as `import numpy as np`. Its **array** is a grid of values that all share one type. A count matrix of 12 genes by 6 samples is a 2-D array of **shape** `(12, 6)`: rows first, then columns. Arithmetic works on every element at once, with no loop (**vectorized**): `np.log2(counts + 1)`. Summaries take an **axis**: `axis=0` works down the rows and gives one result per column; `axis=1` works across and gives one result per row. Positions start at 0: `counts[0, 2]` is row 0, column 2.",
    why: "Expression data are large grids of numbers. NumPy computes on millions of values in one line, far faster than a Python loop, and pandas and scanpy keep their numbers in NumPy arrays or in sparse versions of them.",
    visual: { diagram: "numpy-axes" },
    example: {
      lang: "python",
      code: "import numpy as np\n# rows: HSPA1A, ACTB; columns: ctrl_1, ctrl_2, heat_1, heat_2\ncounts = np.array([[212, 282, 11018, 8441],\n                   [44289, 46223, 55945, 39466]])\nlib = np.array([18.4, 22.1, 24.6, 17.9])   # millions of reads\nprint(counts.shape)\nprint(counts.sum(axis=0))\nprint(counts.mean(axis=1))\nprint(counts[0, 2])\nprint((counts[0] / lib).round(1))",
      output: "(2, 4)\n[44501 46505 66963 47907]\n[ 4988.25 46480.75]\n11018\n[ 11.5  12.8 447.9 471.6]",
      note: "`axis=0` collapsed the rows: one total per sample. `axis=1` collapsed the columns: one mean per gene. `counts[0, 2]` is HSPA1A in heat_1. The last line divides four counts by four library sizes at once: CPM."
    },
    try: {
      kind: "computer",
      lang: "python",
      task: "Load the practice table into an array, then compare what `axis=0` and `axis=1` give. (These totals cover only the 12 practice genes, not whole libraries.)",
      code: "import numpy as np\ncounts = np.loadtxt(\"data/counts.tsv\", delimiter=\"\\t\", skiprows=1,\n                    usecols=range(1, 7), dtype=int)\nprint(counts.shape)\nprint(counts.sum(axis=0))\nprint(counts.mean(axis=1).shape)",
      output: "(12, 6)\n[184692 204986 205182 277904 191297 234927]\n(12,)"
    },
    mistake: {
      wrong: "`counts.mean(axis=0)` gives one mean per gene, because the genes are the rows.",
      fix: "`axis=0` collapses the rows, so you get one value per column, which here means one per sample. Use `axis=1` for one value per gene, and check the result: 6 values means per sample, 12 means per gene."
    },
    check: {
      q: "`counts` has shape `(12, 6)`: 12 genes in rows, 6 samples in columns. What is the shape of `counts.sum(axis=0)`?",
      options: [
        { t: "`(6,)`", why: "`axis=0` adds down the 12 rows, leaving one total for each of the 6 columns, so one per sample." },
        { t: "`(12,)`", why: "That is what `axis=1` gives: adding across the 6 columns leaves one total per gene." },
        { t: "`(12, 6)`", why: "Element-by-element operations such as `counts * 2` keep the shape. A sum along an axis removes that axis." },
        { t: "A single number", why: "That is `counts.sum()` with no axis, which adds up every value in the array." }
      ],
      answer: 0
    },
    deeper: ["f2-pandas", "f2-modules"]
  },
  {
    id: "kaust-pandas",
    course: "kaust",
    module: "kaust-m3",
    title: "pandas DataFrames",
    lectures: ["Lecture: pandas", "Coding Lecture: pandas", "Coding lecture: pandas for data exploration"],
    minutes: 3,
    keywords: ["pandas", "DataFrame", "Series", "read_csv", "index", "columns", "loc", "iloc", "filter rows", "head", "describe", "value_counts"],
    explain: "pandas is the Python package for tables. A **DataFrame** has labeled rows (the **index**), labeled **columns** and values; one column on its own is a **Series**. `pd.read_csv(\"counts.tsv\", sep=\"\\t\", index_col=0)` reads a tab-separated file and uses its first column, the gene names, as the index. Select a column with `counts[\"heat_1\"]`, rows and columns by label with `counts.loc[\"FOS\", \"heat_2\"]`, or by position with `counts.iloc[0, 3]`. Filter rows with a True/False condition: `counts[counts[\"ctrl_1\"] > 20000]`. For exploring, `head()`, `shape`, `describe()` and `value_counts()` give quick summaries.",
    why: "Sample sheets, count tables and single-cell cell information are all tables. pandas reads them in one line and lets you ask questions by name, such as which genes pass a filter, instead of tracking column numbers. AnnData keeps its cell and gene tables as DataFrames.",
    visual: { diagram: "dataframe" },
    example: {
      lang: "python",
      code: "import pandas as pd\ncounts = pd.read_csv(\"counts.tsv\", sep=\"\\t\", index_col=0)\nprint(counts.shape)\nprint(counts.loc[\"FOS\", [\"ctrl_1\", \"heat_2\"]])\nhigh = counts[counts[\"ctrl_1\"] > 20000]\nprint(high.index.tolist())",
      output: "(12, 6)\nctrl_1     220\nheat_2    1906\nName: FOS, dtype: int64\n['ACTB', 'GAPDH', 'EEF1A1']",
      note: "12 genes by 6 samples: the gene column became the index, not data. `loc` took one row and two columns. The filter kept the three housekeeping genes, the only ones above 20,000 reads in ctrl_1."
    },
    try: {
      kind: "computer",
      lang: "python",
      task: "Use the sample sheet to pick the heat-shock columns, then average them for each gene. Change `heat_shock` to `control` and compare.",
      code: "import pandas as pd\ncounts = pd.read_csv(\"data/counts.tsv\", sep=\"\\t\", index_col=0)\nsamples = pd.read_csv(\"data/samples.tsv\", sep=\"\\t\", index_col=0)\nheat = samples.index[samples[\"condition\"] == \"heat_shock\"]\nprint(heat.tolist())\nprint(counts[heat].mean(axis=1).round(1).head(3))",
      output: "['heat_1', 'heat_2', 'heat_3']\ngene\nHSPA1A    10099.0\nHSPA1B     8405.3\nHSPA6       952.3\ndtype: float64"
    },
    mistake: {
      wrong: "Reading a TSV file with `pd.read_csv(\"counts.tsv\")`, without `sep`.",
      fix: "pandas then splits at commas, finds none, and puts each whole line into a single column: shape `(12, 1)`. Give `sep=\"\\t\"` for tab-separated files, and `index_col=0` so gene names become row labels."
    },
    check: {
      q: "`counts` was read with `index_col=0`, so genes are the index. Which code gives the heat_1 count of HSPA1A?",
      options: [
        { t: "`counts.loc[\"HSPA1A\", \"heat_1\"]`", why: "`loc` takes labels, the row first and the column second, so this picks one value: HSPA1A in heat_1." },
        { t: "`counts[\"HSPA1A\"][\"heat_1\"]`", why: "One label in square brackets selects a column. There is no column called HSPA1A, so pandas raises a KeyError." },
        { t: "`counts.iloc[\"HSPA1A\", \"heat_1\"]`", why: "`iloc` takes positions, which are numbers, not names. The position version is `counts.iloc[0, 3]`." },
        { t: "`counts.loc[\"heat_1\", \"HSPA1A\"]`", why: "The order is swapped. `loc` wants the row label first, and heat_1 is a column, so this raises a KeyError." }
      ],
      answer: 0
    },
    deeper: ["f2-pandas", "f3-r-dataframes"]
  },
  {
    id: "kaust-plots",
    course: "kaust",
    module: "kaust-m3",
    title: "Choosing and drawing a plot",
    lectures: ["Coding Lecture: Visualization", "Visualization with the pandas package"],
    minutes: 3,
    keywords: ["plot", "visualization", "histogram", "boxplot", "scatter plot", "bar chart", "line plot", "matplotlib", "df.plot", "log scale", "axis label"],
    explain: "Start from the question, then pick the plot. How are one variable's values spread: a **histogram**. Do groups differ: a **boxplot**, ideally with the individual points shown. Do two variables or two replicates agree: a **scatter plot**. How does something change over time or along an order: a **line plot**. How large is each category: a **bar chart**. pandas draws all of these through matplotlib: `df.plot.hist()`, `df.plot.box()`, `df.plot.scatter(x=..., y=...)`, `df.plot.line()` and `df.plot.bar()`. Label both axes, with units, and keep one message per plot.",
    why: "A plot shows problems that a table hides: a failed sample, an outlier replicate, a skewed distribution. In RNA-seq, a scatter plot of two replicates on a log scale is a standard first check that they behave alike.",
    visual: { diagram: "plot-choice" },
    example: {
      lang: "python",
      code: "import numpy as np\nimport pandas as pd\ncounts = pd.read_csv(\"counts.tsv\", sep=\"\\t\", index_col=0)\nlogc = np.log2(counts + 1)\nax = logc.plot.scatter(x=\"ctrl_1\", y=\"ctrl_2\")\nax.set_xlabel(\"ctrl_1, log2(count + 1)\")\nax.set_ylabel(\"ctrl_2, log2(count + 1)\")\nax.figure.savefig(\"../results/ctrl_1_vs_ctrl_2.png\")\nprint(round(logc[\"ctrl_1\"].corr(logc[\"ctrl_2\"]), 3))",
      output: "0.993",
      note: "The plot is saved in the results folder; in Jupyter it also appears below the cell. Each point is one gene. The correlation, 0.993, puts a number on how closely the two control replicates agree."
    },
    mistake: {
      wrong: "Plotting raw counts on an ordinary axis.",
      fix: "Counts are very skewed: EEF1A1 has about 100,000 reads per sample while HSPA6 has a handful in the controls, so most points crowd into one corner. Plot log2(count + 1), as in the example, and say so in the axis label."
    },
    check: {
      q: "You want to see whether the distributions of log counts are similar in all six samples. Which plot fits best?",
      options: [
        { t: "Six boxplots, one per sample, side by side", why: "Each box shows a sample's median, spread and outliers, so six boxes side by side compare six distributions at a glance." },
        { t: "A scatter plot of ctrl_1 against heat_1", why: "A scatter plot compares two samples gene by gene. It shows agreement, not the shape of each distribution, and only for two samples at a time." },
        { t: "A line plot with the samples along the x-axis", why: "Lines suggest an order or a time course. The six samples have no such order, so a line would imply a trend that does not exist." },
        { t: "A pie chart for each sample", why: "A pie chart shows the shares of a whole. It cannot show the median or the spread of many values." }
      ],
      answer: 0
    },
    deeper: ["f3-eda", "f2-pandas"]
  },
  {
    id: "kaust-dogma",
    course: "kaust",
    module: "kaust-m4",
    title: "Genes, RNA and proteins: what RNA-seq measures",
    lectures: ["Lecture: Introduction to the case study"],
    background: true,
    minutes: 3,
    keywords: ["central dogma", "DNA", "RNA", "mRNA", "protein", "transcription", "translation", "codon", "gene expression", "uracil"],
    explain: "A **gene** is a stretch of DNA that carries instructions. **Transcription** copies a gene into RNA; for protein-coding genes this is **messenger RNA (mRNA)**, which has U (uracil) where DNA has T. **Translation** then reads the mRNA three letters at a time: each **codon** names one amino acid or a stop, and the amino acids are joined into a protein. Almost every cell in a body has the same DNA, but each cell type transcribes a different set of genes, and cells change transcription in response to conditions such as heat. RNA-seq measures the middle step: RNA.",
    why: "The case study analyzes RNA-seq data, so its numbers describe RNA, not DNA and not protein. \"HSPA1A RNA rose after heat\" is what the data can show; \"HSP70 protein rose\" is a hypothesis that needs a protein measurement.",
    visual: { diagram: "dogma" },
    example: {
      lang: "python",
      code: "dna = \"ATGCCCTTTAAACCCGGGTTTAAATAG\"      # seq_06 in sequences.fa\nmrna = dna.replace(\"T\", \"U\")              # transcription: T becomes U\ncode = {\"AUG\": \"M\", \"CCC\": \"P\", \"UUU\": \"F\", \"AAA\": \"K\",\n        \"GGG\": \"G\", \"UAG\": \"*\"}           # 6 of the 64 codons; * = stop\nprotein = \"\"\nfor i in range(0, len(mrna), 3):          # translation: 3 letters at a time\n    protein = protein + code[mrna[i:i + 3]]\nprint(mrna)\nprint(protein)",
      output: "AUGCCCUUUAAACCCGGGUUUAAAUAG\nMPFKPGFK*",
      note: "The mRNA matches the gene's coding strand, with U in place of T. Read in codons, AUG gives M (methionine), CCC gives P (proline), and UAG is a stop codon, shown here as `*`. Real cells use all 64 codons.",
      run: true
    },
    try: {
      kind: "widget",
      widget: "dogma",
      props: {}
    },
    mistake: {
      wrong: "Twice as much RNA of a gene always means twice as much of its protein.",
      fix: "Protein levels also depend on how fast the mRNA is translated and how fast the protein is broken down, so RNA and protein changes often differ in size and timing. RNA-seq measures RNA only."
    },
    check: {
      q: "After heat shock, cells have about 40 times more HSPA1A reads per million. What did RNA-seq measure directly?",
      options: [
        { t: "HSPA1A RNA, as a share of all the RNA that was sequenced", why: "The reads come from RNA molecules, so the change describes HSPA1A RNA relative to other RNAs, averaged over the cells." },
        { t: "The amount of HSP70 protein made from HSPA1A", why: "No protein was measured. Translation and protein breakdown are regulated separately, so the protein change may be smaller, larger or later." },
        { t: "The number of HSPA1A copies in the DNA", why: "Heat does not add gene copies; each cell keeps the same DNA. What changed is how much the gene is transcribed." }
      ],
      answer: 0
    },
    deeper: ["f0-dogma", "f0-expression"]
  },
  {
    id: "kaust-rnaseq",
    course: "kaust",
    module: "kaust-m4",
    title: "RNA-seq: from cells to a count matrix",
    lectures: ["Overview of the week", "Lecture: Introduction to the case study", "Lecture: RNA-seq technology and data normalisation"],
    minutes: 3,
    keywords: ["RNA-seq", "library", "cDNA", "reads", "FASTQ", "alignment", "count matrix", "counts", "sequencing depth", "bulk RNA-seq", "read.delim"],
    explain: "RNA-seq turns the RNA in a sample into numbers. The lab extracts RNA, enriches mRNA (by its poly-A tail, or by removing ribosomal RNA), breaks it into fragments and copies them into complementary DNA (cDNA). Adapters are added to make a **library**, and a sequencer reads millions of fragments, saving the **reads** in FASTQ files. Software then finds which gene each read came from (**alignment**) and counts the reads per gene. The result is a **count matrix**: one row per gene, one column per sample. Each count reflects the gene's share of the sequenced RNA, pooled over all the cells in the sample.",
    why: "Every later step of the case study, from normalization and PCA to differential expression, starts from this table. Knowing how it was made explains why raw counts depend on sequencing depth, and why only replicates can show natural variation.",
    visual: { diagram: "rnaseq-workflow" },
    example: {
      lang: "r",
      code: "counts <- read.delim(\"counts.tsv\", row.names = 1)\ndim(counts)\ncounts[c(\"HSPA1A\", \"HSPA6\", \"ACTB\"), ]",
      output: "[1] 12  6\n       ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\nHSPA1A    212    282    203  11018   8441  10838\nHSPA6       2      0      3    999    725   1133\nACTB    44289  46223  46941  55945  39466  49070",
      note: "12 genes by 6 samples, simulated for teaching. HSPA6 is nearly silent at 37 C and switched on by heat. ACTB is high in every sample: a high count alone does not mean a change."
    },
    mistake: {
      wrong: "A count is the number of RNA molecules of that gene in one cell.",
      fix: "It is the number of sequenced fragments assigned to the gene, pooled over many cells. It depends on expression, on how deeply the sample was sequenced and on transcript length, so it is a relative measure."
    },
    check: {
      q: "In the practice count matrix, the value in row HSPA1A, column heat_1, is 11018. What does it mean?",
      options: [
        { t: "11,018 reads from sample heat_1 were assigned to HSPA1A", why: "Each value counts the reads from one sample (the column) that were matched to one gene (the row)." },
        { t: "Each heat_1 cell holds 11,018 HSPA1A RNA molecules", why: "Reads are pooled from many cells and are only a sample of the fragments, so a count is not molecules per cell." },
        { t: "HSPA1A rose 11,018-fold after heat", why: "A single raw count is not a ratio. A fold change compares normalized values between conditions; for HSPA1A it is about 40." },
        { t: "The HSPA1A gene is 11,018 bases long", why: "Gene lengths are not stored in a count matrix. Every value in it is a number of reads." }
      ],
      answer: 0
    },
    deeper: ["f3-rnaseq", "f3-counts", "f3-align"]
  },
  {
    id: "kaust-reads",
    course: "kaust",
    module: "kaust-m4",
    title: "Sequencing reads: FASTA and FASTQ files",
    lectures: ["Lecture: RNA-seq technology and data normalisation"],
    background: true,
    minutes: 3,
    keywords: ["FASTA", "FASTQ", "read", "quality score", "Phred", "ASCII", "header", "reference genome", "sequencing", ".fastq"],
    explain: "A **read** is the sequence of one DNA fragment, or of one end of it, as reported by a sequencer. **FASTA** stores sequences only: a header line starting with `>`, then the letters, often wrapped over several lines. Reference genomes and transcript sequences are FASTA files. **FASTQ** stores reads with their quality, in exactly four lines per read: `@` and the read name, the sequence, a `+` line, and a quality line with one character per base. Each character encodes a Phred score, Q = ASCII code minus 33, and Q20 means a 1 in 100 chance that the base is wrong, Q30 1 in 1,000.",
    why: "RNA-seq starts from FASTQ files, tens of millions of reads per sample, which are checked, trimmed and matched against a FASTA reference. Counting records wrongly (FASTA wraps lines; FASTQ uses four lines per read) is a classic beginner error.",
    visual: { diagram: "fasta-fastq" },
    example: {
      lang: "bash",
      code: "tail -n 2 sequences.fa\nhead -n 4 reads.fastq",
      output: ">seq_06 toy sequence F\nATGCCCTTTAAACCCGGGTTTAAATAG\n@READ_0001\nAACAATGACGGGAGAAGGAAAAAGTTGGAAACTCAA\n+\nIHHHAGGFEEBCCECB?@C@@@AA@@<6?<=*<,<=",
      note: "First a FASTA record (header and sequence), then a FASTQ record (four lines). Its first quality character, `I`, has ASCII code 73, so Q = 73 - 33 = 40: about 1 error in 10,000."
    },
    try: {
      kind: "widget",
      widget: "fastq",
      props: {}
    },
    mistake: {
      wrong: "The number of lines in a FASTQ file is the number of reads.",
      fix: "Every read takes exactly four lines, so reads = lines / 4. In FASTA, count the header lines that start with `>`, because one sequence can wrap over several lines."
    },
    check: {
      q: "A FASTQ quality character is `?`, whose ASCII code is 63. About how likely is its base to be wrong?",
      options: [
        { t: "1 in 1,000", why: "63 - 33 = 30, and Q30 means an error chance of 10 to the power -3, which is 1 in 1,000." },
        { t: "1 in 30", why: "30 is the Phred score, not the odds. The scale is logarithmic: every 10 extra points means ten times fewer errors." },
        { t: "1 in 63", why: "63 is the character's code. Subtract 33 first to get the score, then turn the score into a probability." },
        { t: "1 in 100", why: "That is Q20, the character `5` (code 53). `?` is ten points higher, so its base is ten times less likely to be wrong." }
      ],
      answer: 0
    },
    deeper: ["f3-fasta", "f3-fastq"]
  },
  {
    id: "kaust-normalize",
    course: "kaust",
    module: "kaust-m4",
    title: "Normalizing RNA-seq counts",
    lectures: ["Lecture: RNA-seq technology and data normalisation", "Coding Lecture: Loading and normalizing RNA-seq data"],
    minutes: 3,
    keywords: ["normalization", "CPM", "counts per million", "library size", "sequencing depth", "log2", "pseudocount", "TPM", "size factors", "DESeq2", "edgeR"],
    explain: "Samples are sequenced to different depths: the **library size**, the total number of reads assigned to genes in a sample, varies, so raw counts rise with depth even for genes that did not change. Normalization puts samples on a common scale. **CPM** (counts per million) = count / library size x 1,000,000. Expression values are very skewed, so plots and PCA usually use **log2(CPM + 1)**: each step of 1 is a doubling, and the +1, a **pseudocount**, avoids the log of 0. TPM also corrects for transcript length. DESeq2 and edgeR estimate their own size factors, which are less distorted than CPM when a few genes change hugely.",
    why: "Without normalization, a deeply sequenced sample looks as if every gene went up. Every comparison between samples, including plots, PCA and fold changes, needs counts on a common scale.",
    visual: { diagram: "count-matrix" },
    example: {
      lang: "r",
      code: "counts <- read.delim(\"counts.tsv\", row.names = 1)\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)   # library sizes, millions\nhspa1a <- unlist(counts[\"HSPA1A\", ])\nhspa1a\ncpm <- hspa1a / lib\nround(cpm, 1)\nround(log2(cpm + 1), 2)",
      output: "ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\n   212    282    203  11018   8441  10838\nctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\n  11.5   12.8   10.0  447.9  471.6  511.2\nctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\n  3.65   3.78   3.46   8.81   8.88   9.00",
      note: "Raw, heat_1 (11,018) beats heat_2 (8,441); per million reads, heat_2 is higher (471.6 against 447.9). The library sizes are typed in because these 12 genes are only a small part of each library."
    },
    try: {
      kind: "widget",
      widget: "countmatrix",
      props: {}
    },
    mistake: {
      wrong: "Giving CPM or TPM values to DESeq2 or edgeR, because normalized data must be better.",
      fix: "These tools model raw counts and estimate their own size factors, so normalized input breaks their statistics. Give them raw counts, and use CPM or log-CPM for plots, PCA and exploring."
    },
    check: {
      q: "ACTB has 55,945 reads in heat_1 (library 24.6 million) and 39,466 in heat_2 (17.9 million). What does CPM show?",
      options: [
        { t: "About 2,274 and 2,205 CPM: nearly equal, so the raw gap came mostly from depth", why: "55,945 / 24.6 and 39,466 / 17.9 give almost the same value. heat_1 simply had about 37 percent more reads." },
        { t: "heat_1 expresses ACTB about 1.4 times more than heat_2", why: "1.4 is the raw ratio. It ignores that heat_1 was sequenced more deeply, which raises every one of its counts." },
        { t: "heat_2 expresses ACTB about 1.4 times more than heat_1", why: "Dividing by its smaller library does raise heat_2, but only to about the level of heat_1, not 1.4 times above it." },
        { t: "Nothing, because CPM values cannot be compared between samples", why: "Comparing samples is exactly what CPM is for: it removes the difference in sequencing depth." }
      ],
      answer: 0
    },
    deeper: ["f3-normalization", "f3-counts"]
  },
  {
    id: "kaust-pca",
    course: "kaust",
    module: "kaust-m4",
    title: "Principal component analysis (PCA)",
    lectures: ["Lecture: Principal Component Analysis", "Coding Lecture: PCA analysis in R for RNA-seq data"],
    minutes: 4,
    keywords: ["PCA", "principal component analysis", "PC1", "PC2", "variance explained", "prcomp", "loadings", "dimensionality reduction", "batch effect", "outlier sample"],
    explain: "Each sample is described by thousands of genes, too many to plot. **Principal component analysis (PCA)** finds new axes, the **principal components**, that capture as much of the variation between samples as possible: PC1 the most, PC2 the most of what is left, and so on. Each sample gets a score on every PC, so it becomes a point on a PC1 against PC2 plot. The **proportion of variance** says how much of the total variation a PC holds. PCA never sees the sample labels, so if samples still separate by condition, the condition is a major source of variation. Use log-transformed normalized values, samples in rows, for R's `prcomp()`.",
    why: "PCA is a standard first check of bulk RNA-seq data: replicates should group together and conditions should separate. A sample sitting with the wrong group suggests a swapped label, a failed sample or a batch effect, best found before testing genes.",
    visual: { diagram: "pca" },
    example: {
      lang: "r",
      code: "counts <- read.delim(\"counts.tsv\", row.names = 1)\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\nlogcpm <- log2(t(counts) / lib + 1)   # t() puts samples in rows\npca <- prcomp(logcpm)\nround(pca$x[, 1:2], 2)\nround(summary(pca)$importance[2, 1:3], 3)",
      output: "         PC1   PC2\nctrl_1 -5.04  0.01\nctrl_2 -4.93  0.17\nctrl_3 -5.02 -0.23\nheat_1  4.82  0.97\nheat_2  5.16 -2.01\nheat_3  5.01  1.08\n  PC1   PC2   PC3\n0.955 0.040 0.003",
      note: "PC1 holds 95.5 percent of the variation and splits the controls (about -5) from the heat samples (about +5). PC2 (4 percent) mainly sets heat_2 apart. Signs are arbitrary: another tool may flip left and right."
    },
    try: {
      kind: "computer",
      lang: "r",
      task: "Draw PC1 against PC2 colored by condition, then list the three genes with the largest weights (loadings) on PC2. Which gene, and which sample, create PC2?",
      code: "counts <- read.delim(\"data/counts.tsv\", row.names = 1)\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\npca <- prcomp(log2(t(counts) / lib + 1))\ngroup <- factor(rep(c(\"control\", \"heat\"), each = 3))\nplot(pca$x[, 1], pca$x[, 2], col = group, pch = 19, xlab = \"PC1\", ylab = \"PC2\")\npc2 <- pca$rotation[, \"PC2\"]\nhead(round(pc2[order(abs(pc2), decreasing = TRUE)], 2), 3)",
      output: "  FOS HSPB1 HSPA6\n-0.98  0.12  0.10"
    },
    mistake: {
      wrong: "PC1 always shows the treatment effect.",
      fix: "PC1 is simply the direction of largest variation. It may follow the condition, but it can also follow a batch, a failed sample or sequencing depth. Check which samples and genes drive it."
    },
    check: {
      q: "In a PCA of 6 samples, PC1 explains 85 percent of the variance and separates controls from heat samples. What does this tell you?",
      options: [
        { t: "The largest source of variation between these samples lines up with the condition", why: "PC1 is the direction of greatest variation, found without the labels. Its split by condition means heat dominates the differences between samples." },
        { t: "85 percent of the genes changed after heat", why: "Variance explained describes how much sample-to-sample variation one axis captures. A few strongly changed genes can produce a large share by themselves." },
        { t: "The heat effect is statistically significant", why: "PCA is exploratory and gives no p-values. Testing which genes changed is the job of differential expression analysis." },
        { t: "Heat raised expression by 85 percent", why: "A share of variance is not an effect size. How much each gene changed is a fold change, computed gene by gene." }
      ],
      answer: 0
    },
    deeper: ["f3-eda", "f3-design", "f3-clusters"]
  },
  {
    id: "kaust-de",
    course: "kaust",
    module: "kaust-m4",
    title: "Finding differentially expressed genes",
    lectures: ["Lecture: Finding differentially expressed genes", "Coding Lecture: Differential expression analysis in R"],
    minutes: 3,
    keywords: ["differential expression", "DE", "log2 fold change", "p-value", "adjusted p-value", "padj", "FDR", "Benjamini-Hochberg", "volcano plot", "DESeq2", "edgeR", "t-test"],
    explain: "**Differential expression (DE)** analysis asks, for every gene, whether its expression differs between conditions by more than replicate-to-replicate variation would explain. Each gene gets an effect size, the **log2 fold change** (log2FC: +1 means doubled, -1 halved), and a **p-value** for the evidence. Testing thousands of genes produces some small p-values by chance, so they are converted, usually with the Benjamini-Hochberg method, into **adjusted p-values** (padj) that control the false discovery rate. Genes are then called with cutoffs such as padj < 0.05 and |log2FC| > 1. A **volcano plot** shows log2FC against -log10(padj). Packages such as DESeq2, edgeR and limma use statistical models suited to count data.",
    why: "A DE table is the main result of most bulk RNA-seq studies. Reading its log2FC and padj columns correctly, and knowing what \"not significant\" means, decides which genes you report and how you describe them.",
    visual: { diagram: "volcano" },
    example: {
      lang: "r",
      code: "counts <- read.delim(\"counts.tsv\", row.names = 1)\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\nfor (g in c(\"HSPA1A\", \"BAG3\", \"FOS\", \"ACTB\")) {\n  cpm <- unlist(counts[g, ]) / lib\n  lfc <- log2((mean(cpm[4:6]) + 1) / (mean(cpm[1:3]) + 1))\n  p <- t.test(log2(cpm[4:6] + 1), log2(cpm[1:3] + 1))$p.value\n  cat(g, round(lfc, 2), signif(p, 2), \"\\n\")\n}",
      output: "HSPA1A 5.27 9.3e-06\nBAG3 1.82 0.0094\nFOS 1.8 0.4\nACTB 0 0.98",
      note: "Gene, log2FC and p, computed the simplified way this site uses. HSPA1A: large and convincing. FOS: large, but p = 0.4, because only heat_2 is high. Adjusted over all 1,512 toy genes, BAG3's padj is 0.149."
    },
    try: {
      kind: "widget",
      widget: "rnaseq",
      props: {}
    },
    mistake: {
      wrong: "Calling every gene with a raw p-value below 0.05 significant.",
      fix: "With 20,000 genes and no real changes, about 1,000 would pass p < 0.05 by chance. Use the adjusted p-value (padj), which keeps the expected share of false discoveries in your list small."
    },
    check: {
      q: "On a volcano plot (log2FC on the x-axis, -log10 padj on the y-axis), where are the genes that rose strongly with strong evidence?",
      options: [
        { t: "Top right", why: "The right side means a positive log2FC (higher after treatment), and the top means a small padj, so a large -log10(padj). Together they mark convincing increases." },
        { t: "Top left", why: "The evidence is strong up there, but left means a negative log2FC: those genes decreased." },
        { t: "Bottom right", why: "These genes rose on average, but the evidence is weak, often because replicates disagree. FOS sits here." },
        { t: "Bottom center", why: "Near log2FC 0 with weak evidence: genes with no detectable change, such as the housekeeping gene ACTB." }
      ],
      answer: 0
    },
    deeper: ["f3-de", "f3-multiple", "f3-foldchange"]
  },
  {
    id: "kaust-scrna",
    course: "kaust",
    module: "kaust-m4",
    title: "From bulk to single-cell RNA-seq",
    lectures: ["Lecture: From RNA-seq to scRNA-seq"],
    minutes: 3,
    keywords: ["single-cell", "scRNA-seq", "bulk RNA-seq", "cell barcode", "UMI", "droplet", "sparse matrix", "cell types", "heterogeneity", "average"],
    explain: "**Bulk RNA-seq** pools RNA from thousands to millions of cells, giving one average per gene per sample. Tissues are mixtures, and an average cannot tell whether every cell changed a little, a few cells changed a lot, or the mix of cell types shifted. **Single-cell RNA-seq (scRNA-seq)** keeps cells apart. In droplet methods, each cell's RNA gets a **cell barcode**, linking reads to their cell, and each molecule a **UMI** (unique molecular identifier), so PCR copies are counted once. The result is a matrix of UMI counts, one value per gene per cell, mostly zeros (**sparse**), because each cell holds little RNA and only part of it is captured.",
    why: "scRNA-seq finds cell types, rare cells and the cells that respond to a treatment, all hidden in an average. Bulk RNA-seq is cheaper per sample and more sensitive per gene, so it remains the usual choice for comparing conditions across many samples.",
    visual: { diagram: "bulk-vs-single" },
    example: {
      lang: "python",
      code: "# UMI counts of one gene in 10 cells, two toy samples\nsample_a = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8]\nsample_b = [0, 0, 0, 0, 0, 0, 0, 0, 40, 40]\nfor name, cells in [(\"A\", sample_a), (\"B\", sample_b)]:\n    average = sum(cells) / len(cells)\n    expressing = len([c for c in cells if c > 0])\n    print(name, \"average:\", average, \"cells expressing:\", expressing)",
      output: "A average: 8.0 cells expressing: 10\nB average: 8.0 cells expressing: 2",
      note: "Bulk RNA-seq would see only the averages, identical at 8.0. Single-cell data shows the difference: every cell expresses the gene in sample A, but only two cells do in sample B.",
      run: true
    },
    mistake: {
      wrong: "A zero in a single-cell matrix means the gene is switched off in that cell.",
      fix: "Often the gene's molecules were simply not captured: each cell holds little RNA and only part of it is detected. Trust patterns across many cells, not one cell's zero."
    },
    check: {
      q: "Bulk RNA-seq shows a gene rising 2-fold in tumor samples. What can single-cell RNA-seq add?",
      options: [
        { t: "Whether all cells rose, a few cells rose a lot, or a cell type became more common", why: "Measuring each cell separately shows which cells carry the change, something the bulk average cannot reveal." },
        { t: "A more precise 2-fold value, because it sequences each gene more deeply", why: "Single-cell data captures less RNA per cell and is noisier per gene. Its strength is resolution across cells, not precision." },
        { t: "The protein level of the gene in each cell", why: "scRNA-seq measures RNA, just like bulk RNA-seq. Protein needs other methods, such as antibody staining." },
        { t: "Proof that the gene causes the tumor", why: "No expression measurement proves a cause. Testing a cause needs experiments that change the gene and observe the result." }
      ],
      answer: 0
    },
    deeper: ["f3-single-cell"]
  },
  {
    id: "kaust-anndata",
    course: "kaust",
    module: "kaust-m4",
    title: "Single-cell data in Python: the AnnData object",
    lectures: ["Lecture: Representing scRNA-seq experiments in Python", "Coding Lecture: Loading a scRNA-seq experiment in Python"],
    minutes: 3,
    keywords: ["AnnData", "adata", "adata.X", "obs", "var", "obsm", "h5ad", "scanpy", "sparse matrix", "cells by genes", "read_h5ad"],
    explain: "**AnnData** is the Python object that holds a single-cell experiment; scanpy is built around it. Its matrix `adata.X` has one row per cell and one column per gene (the opposite of a bulk count table), and it is usually a **sparse matrix**, which stores only the non-zero values. `adata.obs` is a pandas DataFrame with one row per cell, named by its barcode, with columns such as sample, quality numbers and later the cluster; `adata.var` has one row per gene. Results go into named slots, such as `adata.obsm[\"X_umap\"]` for UMAP coordinates. You subset it like a table, cells first: `adata[:100, :]`, `adata[:, \"CD3E\"]`. Files usually end in `.h5ad`.",
    why: "Every scanpy step reads from and writes into this one object, so the counts, the information about each cell and the results always stay aligned. With separate tables, one wrong sort could silently attach labels to the wrong cells.",
    visual: { diagram: "anndata" },
    example: {
      lang: "python",
      code: "import scanpy as sc\nadata = sc.read_h5ad(\"experiment.h5ad\")   # or sc.read_10x_mtx(\"folder/\")\nprint(adata.shape)                        # (cells, genes)\nprint(adata.obs.head())                   # one row per cell\nprint(adata.var.head())                   # one row per gene\ncd3e = adata[:, \"CD3E\"]                   # all cells, one gene\nfirst_100 = adata[:100, :].copy()         # 100 cells, all genes",
      note: "This needs scanpy and a data file, so this site cannot run it and shows no output. `experiment.h5ad` stands for your own file. Indexing works like a table: cells first, genes second.",
      noVerify: true
    },
    mistake: {
      wrong: "AnnData stores genes in rows, like a bulk count table.",
      fix: "AnnData puts cells in rows and genes in columns. Bulk count tables and R's Seurat put genes in rows, so check `adata.shape`, which reads (cells, genes), before you index or transpose anything."
    },
    check: {
      q: "`adata.shape` is `(5000, 20000)`. Which statement is right?",
      options: [
        { t: "There are 5,000 cells and 20,000 genes, so `adata.obs` has 5,000 rows", why: "AnnData lists observations (cells) first and variables (genes) second, and `obs` holds one row per cell." },
        { t: "There are 5,000 genes and 20,000 cells", why: "That is the bulk layout, with genes in rows. AnnData reverses it: the first number counts cells." },
        { t: "`adata.var` has 5,000 rows, one per cell", why: "`var` describes the variables, which are the genes, so it has 20,000 rows. Cells are described in `obs`." },
        { t: "`adata.X` holds 5,000 numbers", why: "`X` has one value per cell per gene: 100 million entries, most of them zero, which is why it is stored as a sparse matrix." }
      ],
      answer: 0
    },
    deeper: ["f3-single-cell", "f2-pandas"]
  },
  {
    id: "kaust-sc-preprocess",
    course: "kaust",
    module: "kaust-m4",
    title: "Preprocessing single-cell data",
    lectures: ["Lecture: Preprocessing scRNA-seq data", "Coding Lecture: scRNA-seq preprocessing"],
    minutes: 3,
    keywords: ["preprocessing", "quality control", "QC", "mitochondrial", "doublets", "filter_cells", "normalize_total", "log1p", "highly variable genes", "scanpy"],
    explain: "Preprocessing turns raw UMI counts into values you can compare between cells. **Quality control (QC)** removes barcodes that are not good single cells: very few genes (empty droplets or damaged cells), a high share of mitochondrial reads (damaged cells that lost their cytoplasmic RNA) or unusually many genes (possible **doublets**: two cells under one barcode). Genes detected in very few cells are dropped too. Each cell is then scaled to the same total, because capture efficiency differs between cells, and log-transformed. Finally, about 2,000 **highly variable genes** are kept for PCA. In scanpy: `sc.pp.filter_cells`, `sc.pp.filter_genes`, `sc.pp.normalize_total`, `sc.pp.log1p`, `sc.pp.highly_variable_genes`.",
    why: "Damaged cells and doublets can form fake clusters that look like new cell types, and unscaled cells group by depth instead of biology. Every later step inherits these choices, so choose thresholds from plots of your own data and report them.",
    visual: { diagram: "sc-workflow" },
    example: {
      lang: "python",
      code: "import numpy as np\nX = np.array([[1, 4, 5],       # cell 1: 10 UMIs in total\n              [4, 16, 20]])    # cell 2: 40 UMIs, same proportions\ntotals = X.sum(axis=1, keepdims=True)\nnorm = X / totals * 10000      # what sc.pp.normalize_total(target_sum=1e4) does\nprint(norm)\nprint(np.log1p(norm).round(2)) # what sc.pp.log1p does",
      output: "[[1000. 4000. 5000.]\n [1000. 4000. 5000.]]\n[[6.91 8.29 8.52]\n [6.91 8.29 8.52]]",
      note: "Toy numbers, with cells in rows as in AnnData. Cell 2 was captured 4 times more deeply, yet after scaling to 10,000 the two cells are identical. `log1p` takes the natural log of 1 + x."
    },
    try: {
      kind: "widget",
      widget: "singlecell",
      props: { mode: "qc" }
    },
    mistake: {
      wrong: "Copying QC cutoffs, such as \"under 5 percent mitochondrial reads\", from a tutorial.",
      fix: "Good thresholds depend on the tissue and the technology; heart muscle cells, for example, naturally have many mitochondrial reads. Plot genes per cell and mitochondrial percentage first, then choose cutoffs that remove clear outliers."
    },
    check: {
      q: "Cell 1 has 2,000 UMIs and cell 2 has 8,000, with the same proportions of every gene. After `sc.pp.normalize_total`, how do they compare?",
      options: [
        { t: "Their values are identical, because each cell is scaled to the same total", why: "Normalization divides each cell by its own total, so a pure depth difference disappears and only the proportions remain." },
        { t: "Cell 2 still has values 4 times higher", why: "That describes the raw counts. Removing exactly this kind of depth difference is the purpose of normalization." },
        { t: "Cell 1 is removed for having too few UMIs", why: "`normalize_total` never removes cells. Filtering happens earlier, in quality control, with functions such as `sc.pp.filter_cells`." },
        { t: "Both cells are now on a log scale", why: "Normalization only rescales each cell. The log transform is a separate step, `sc.pp.log1p`, usually run right after it." }
      ],
      answer: 0
    },
    deeper: ["f3-single-cell", "f3-normalization"]
  },
  {
    id: "kaust-celltypes",
    course: "kaust",
    module: "kaust-m4",
    title: "UMAP, clusters and cell types",
    lectures: ["Lecture: UMAP and dimensionality reduction in single-cell studies", "Lecture: Cell type identification", "Coding Lecture: Clustering and cell type identification with Python"],
    minutes: 3,
    keywords: ["UMAP", "clustering", "Leiden", "resolution", "neighbors", "marker genes", "cell type", "annotation", "rank_genes_groups", "PCA", "t-SNE"],
    explain: "After preprocessing, **PCA** compresses the highly variable genes into a few dozen components, and `sc.pp.neighbors` links each cell to its most similar cells, its **neighbors** in PCA space. **Clustering** with `sc.tl.leiden` splits this neighbor network into groups of similar cells; its `resolution` setting decides how many groups you get. **UMAP** (`sc.tl.umap`) draws the network in two dimensions for viewing. Finally, `sc.tl.rank_genes_groups` finds **marker genes**, much higher in one cluster than in the others, and you name each cluster by matching its markers to known biology: CD3E for T cells, MS4A1 for B cells, LYZ for monocytes.",
    why: "Cell-type maps are the central result of many single-cell studies, for example showing which immune cells respond to a treatment. Knowing that clusters depend on settings and that UMAP is a picture, not a measurement, keeps you from over-reading them.",
    visual: { diagram: "marker-genes" },
    example: {
      lang: "python",
      code: "import scanpy as sc\nsc.tl.pca(adata, n_comps=50)\nsc.pp.neighbors(adata, n_neighbors=15, n_pcs=30)\nsc.tl.umap(adata)\nsc.tl.leiden(adata, resolution=1.0)\nsc.tl.rank_genes_groups(adata, groupby=\"leiden\", method=\"wilcoxon\")\nsc.pl.umap(adata, color=[\"leiden\", \"CD3E\", \"MS4A1\", \"LYZ\"])",
      note: "This needs scanpy and a preprocessed `adata`, so no output is shown. Each call stores its results in `adata`: coordinates in `adata.obsm`, each cell's cluster in `adata.obs[\"leiden\"]`, marker tables in `adata.uns`.",
      noVerify: true
    },
    try: {
      kind: "widget",
      widget: "singlecell",
      props: { mode: "clusters" }
    },
    mistake: {
      wrong: "Clusters far apart on a UMAP are more different, and a bigger blob is a more variable cell type.",
      fix: "UMAP keeps close neighbors together but distorts the distances between clusters and their sizes, and the picture changes with its settings. Compare clusters with the expression data instead: markers, PCA and cell counts."
    },
    check: {
      q: "A cluster has high CD3E and NKG7, but almost no MS4A1 or LYZ. Which label fits best?",
      options: [
        { t: "Cytotoxic T cells, such as CD8 T cells", why: "CD3E marks T cells and NKG7 marks cytotoxic (killer) cells. Together, without B cell or monocyte markers, they point to cytotoxic T cells." },
        { t: "NK cells", why: "NK cells share NKG7, but they lack CD3E, a T cell gene. A shared marker needs a second, distinguishing gene before you can name the cluster." },
        { t: "B cells", why: "B cells are marked by MS4A1 and CD79A. This cluster has almost no MS4A1 and carries the T cell gene CD3E instead." },
        { t: "Monocytes", why: "Monocytes are marked by LYZ, which this cluster lacks, and they do not express the T cell gene CD3E." }
      ],
      answer: 0
    },
    deeper: ["f3-clusters", "f3-single-cell"]
  }
);
