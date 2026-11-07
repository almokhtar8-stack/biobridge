# BioBridge content authoring guide

This guide defines how lesson, question, glossary, terminal-mission and Python-trace content is written.
Content lives in `content/*.js` as plain JavaScript that pushes objects into the global `BB` namespace
(no modules, no fetch, so the site also works when `index.html` is opened directly from disk).

## 1. Audience and voice

- Learners may know **nothing** about biology, programming, statistics or bioinformatics. Many are university
  students preparing for the KAUST Academy Bioinformatics placement assessment by completing three Coursera
  courses (KAUST *Fundamental Skills in Bioinformatics*, Rice *Python Programming Essentials*, IBM *Hands-on
  Introduction to Linux Commands and Shell Scripting*). English may be their second language.
- Plain English, short sentences, active voice. Define every technical word the first time it appears.
  Prefer concrete examples over abstract statements. One idea per sentence.
- Scientifically serious and precise. Never oversimplify into something false. When you simplify, say so
  ("In this toy example...", "Real tools do more: ...").
- No hype, no filler, no motivational padding, no emoji, no exclamation marks in explanations.
- **Forbidden characters/words (the validator rejects them):** em dash, en dash, and the words
  "leverage", "robust", "seamless", "elevate". Use commas, colons, parentheses or full stops instead of dashes.
  Write number ranges as "60 to 80".
- US spelling (normalization, analyze, color).
- Inline markup allowed in any text field: `` `code` `` and `**bold**`. Nothing else (no HTML, no links).
- Never mention or imitate the official placement test. Never claim BioBridge is official.

## 2. The learning sequence every lesson follows

What is it? -> Why does it exist? -> How does it work? -> Show me -> Let me try -> Test my understanding -> Connect it to real science.
Each lesson must answer: What problem are we solving? Why should a beginner care? What happens step by step?
How do we perform it? What does the output mean? What misunderstanding should I avoid? Where is this useful in real bioinformatics?

## 3. Lesson schema

Lesson metadata (title, minutes, objectives, course modules, prerequisites) is already defined in
`content/curriculum.js` (`BB.lessonMeta`). **Use exactly those lesson ids.** Do not change curriculum.js.
A lesson body is pushed like this:

```js
BB.lessons.push({
  id: 'f1-grep',
  what: '1 to 2 sentences. Plain definition. Answers "What is it?"',
  problem: '1 to 3 sentences. The problem that made this tool or idea necessary.',
  care: '1 to 2 sentences. Why a complete beginner should care, concretely.',
  steps: ['3 to 6 steps. Each 1 to 2 sentences. What actually happens, in order.'],
  deeper: 'Optional. One short paragraph of deeper or more technical detail (shown collapsed).',
  show: {                       // "Show me": a worked example
    intro: 'One sentence that sets up the example.',
    lang: 'bash',               // 'bash' | 'python' | 'r' | 'text' | 'fasta' | 'fastq' | 'tsv'
    code: 'grep HSPA1A counts.tsv',
    output: 'HSPA1A\t212\t282\t203\t11018\t8441\t10838',   // exact output, or omit if none
    notes: ['What each part means.', 'What the output means and how to read it.'],
    cwd: '~/project/data',      // bash/python/r only: working directory for verification (default ~/project/data)
    run: true,                  // python only: show a "Run real Python" button
    noVerify: false             // set true only if the code cannot run as-is (e.g. needs internet or sudo)
  },
  pitfall: { wrong: 'The misunderstanding, phrased the way a learner might think it.', right: 'The correction, and why.' },
  try: { kind: 'terminal', mission: 'grep' },          // "Let me try": see section 5
  check: [ /* 2 to 3 questions, see section 4 */ ],
  real: '2 to 3 sentences connecting this to real bioinformatics, concretely (which data, which question).',
  teach: { prompt: 'Explain X to a friend who missed this lesson. Include ...', points: ['key idea 1', 'key idea 2', 'key idea 3'] }
});
```

Length target: the whole lesson body around 450 to 700 words. Short, focused, no walls of text.

## 4. Questions (lesson checks and practice bank)

Same shape for lesson `check` items and practice-bank questions:

```js
{
  q: 'What does `grep -c ">" sequences.fa` print?',
  code: { lang: 'bash', src: 'grep -c ">" sequences.fa' },          // optional
  options: [
    { t: '6', why: 'Correct: -c counts matching lines, and each FASTA record has exactly one header line starting with >.' },
    { t: '15', why: 'That is the total number of lines (wc -l). Sequence lines are wrapped, so lines are not records.' },
    { t: 'The six header lines', why: 'Without -c, grep would print the matching lines. -c replaces them with a count.' }
  ],
  answer: 0,
  level: 2,                                   // practice bank only (lesson checks may include it too)
  verify: { cwd: '~/project/data' }           // optional: the validator executes code.src and checks options[answer].t equals the real output
}
```

Practice-bank questions additionally need: `id` (prefix by area, e.g. `lx-031`), `obj` (array of objective ids from
`BB.objectives`), `lesson` (the lesson that teaches it), `level`, and `explain` (why the correct answer is correct).

Rules:
- **Every option has a `why`.** For wrong options, explain the specific reasoning error behind choosing it,
  not just "incorrect". For the right option, explain why it is right.
- 3 or 4 options (2 only for genuinely binary True/False items). Plausible distractors built from real
  misconceptions. Similar length and style. No "all of the above" / "none of the above".
- Levels: 1 = beginner (recognize meaning), 2 = intermediate (predict, trace, read output), 3 = application
  (transfer to a new biological situation, choose a method, debug, interpret a result).
- Test understanding and transfer, not trivia or memorized wording. Prefer "what will this print / which
  conclusion is justified / which command would you use for this new situation".
- For code-output questions, the correct option text must equal the program's exact stdout (multi-line output:
  use `\n` inside the string). Add `verify` so it is executed. For a question whose answer is an error, set
  `verify: { mode: 'error' }` and make the correct option text contain the exception name (e.g. `NameError: ...`).
- Vary the position of the right answer (the app shuffles options anyway, except when `noShuffle: true`).

## 5. "Let me try" activity kinds

- `{ kind: 'terminal', mission: 'id' }`: a mission in the simulated Linux terminal (section 7).
- `{ kind: 'trace', program: 'id' }`: step through a Python program line by line with live variables (section 8).
- `{ kind: 'widget', widget: 'name', props: {...} }`: a built-in interactive. Available widgets:
  `dogma` (DNA to RNA to protein, mutations), `expression` (same genome, different cell types), `filetree`
  (paths explorer), `journey` (discovery pipeline map), `datatable` (explore a small dataset), `scale`
  (how big is biological data), `normalization` (library-size slider), `countmatrix` (count-matrix explorer),
  `rnaseq` (guided heat-shock differential-expression experiment), `pvalues` (multiple-testing simulator),
  `singlecell` (props `{ mode: 'qc' }` or `{ mode: 'clusters' }`), `fastq` (FASTQ and Phred decoder),
  `log2` (fold-change explorer), `variability` (replicates and spread), `correlation` (scatter, r and a fitted
  line), `cron` (cron schedule explainer), `methods` (choose the right method for a biological question),
  `pyrun` (real Python in the browser, props `{ code: '...' }`).
- `{ kind: 'predict', q, code, options, answer }`: one prediction before the reveal (same option rules as checks).
- `{ kind: 'parsons', prompt, lang: 'python'|'bash'|'r', lines: ['correct', 'order', 'of lines'], output: 'expected stdout', verify: true, explain: '...' }`:
  learners reorder shuffled lines. Each line must be unique; keep indentation inside the strings.
- `{ kind: 'debug', prompt, lang: 'python', code: 'buggy code', error: 'NameError: name ... is not defined', options: [{t, why}...], answer, fixed: 'corrected code', fixedOutput: 'stdout of fixed code' }`:
  learners diagnose a real error. The validator runs `code` (must raise `error`'s exception) and `fixed`.

## 6. Shared teaching data (use it; do not invent other datasets)

One toy experiment runs through the whole site: **heat shock in cultured human cells**. Cells grown at 37 C
(control) or moved to 42 C for one hour (heat shock); three independent cultures (biological replicates) per
condition: `ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3`. Heat shock strongly induces chaperone genes
(HSPA1A, HSPA1B, HSPA6, DNAJB1, HSPH1; more modestly HSPB1, BAG3); ACTB, GAPDH, EEF1A1, TP53 stay flat;
FOS has one unusually high heat replicate (high mean change, not significant). Exact counts and files are in
`content/vfs.js` (generated by `tools/build_datasets.py`). Total assigned reads per sample (library sizes):
ctrl_1 18,400,000; ctrl_2 22,100,000; ctrl_3 20,300,000; heat_1 24,600,000; heat_2 17,900,000; heat_3 21,200,000.

Virtual file system (home is `/home/student`, prompt `student@biobridge`):

```
/home/student/notes.txt
/home/student/.bashrc
/home/student/project/README.txt
/home/student/project/data/counts.tsv        header + 12 genes x 6 samples, tab-separated (13 lines)
/home/student/project/data/samples.tsv       sample, condition, replicate, temperature_C (7 lines)
/home/student/project/data/annotation.tsv    symbol, chromosome, category, description (13 lines)
/home/student/project/data/sequences.fa      6 FASTA records, long ones wrapped at 60 characters (15 lines)
/home/student/project/data/reads.fastq       8 FASTQ reads of 36 bases (32 lines)
/home/student/project/scripts/count_seqs.sh  not executable yet (mode 644); counts > lines in a FASTA file
/home/student/project/scripts/line_report.sh executable (755); loops over *.tsv files in a folder
/home/student/project/results/               empty
```

Read `content/vfs.js` for exact file contents before writing outputs. To get real output, run
`python3 tools/run_in_vfs.py bash 'your commands' --cwd '~/project/data'` (also `python` and `r`). It runs real bash/Python/R in a
fresh copy of these files, exactly as the verifier does. `ls -l` shows owner/date details that differ from the simulator, so mark
examples that print `ls -l`, `date`, `ps`, `df` or similar machine-specific output with `noVerify: true` (lesson show) or leave out `verify` (questions). Categories in annotation.tsv:
heat_shock (7 genes), housekeeping (3), transcription_factor (2).
Single-cell toy data (immune cells from blood) uses markers CD3E, IL7R, CD8A (T cells), MS4A1, CD79A (B cells),
NKG7, GNLY (NK cells, also cytotoxic CD8 T cells), LYZ, CD14 (CD14 monocytes), FCGR3A (FCGR3A monocytes and NK cells),
PPBP (platelets), MT-CO1 (mitochondrial; high fraction flags damaged cells).

## 7. Terminal missions (simulated shell)

```js
BB.missions['grep'] = {
  title: 'Find the heat-shock genes',
  start: '/home/student/project/data',       // starting directory
  intro: 'Context in one or two sentences.',
  steps: [
    { goal: 'Show the line of counts.tsv for HSPA1A.', hint: 'grep PATTERN FILE', solution: 'grep HSPA1A counts.tsv',
      check: { cmd: 'grep', outputIncludes: 'HSPA1A' },
      explain: 'What happened and why (shown after success).' }
  ],
  done: 'One or two sentences connecting the mission to real work.'
};
```

Check keys (all listed keys must hold; a step is checked after every command):
`cmd` (a command name that must appear in the command line, e.g. 'grep'), `pipeline` (array of command names that
must appear in this order across a pipe), `args` (regex string the whole command line must match),
`outputIncludes` (string), `outputEquals` (exact trimmed output), `outputRegex`, `cwd` (absolute path the shell must
be in afterwards), `exists` / `notExists` (absolute path), `fileIncludes` (`{ path, text }`), `executable` (absolute path),
`allowFail` (true if a failing command may satisfy the step), `any` (array of alternative check objects).

Supported by the simulator (use nothing else in missions): `pwd ls(-l -a -h -1 -R) cd mkdir(-p) rmdir touch cp(-r)
mv rm(-r -f) cat(-n) less more head(-n N, -N) tail(-n N, -n +N) wc(-l -w -c) grep(-i -v -c -n -w -o -E -F) sort(-n -r -k -t -u)
uniq(-c -d -u) cut(-f -d -c) tr(-d) echo(-n -e) chmod(symbolic and numeric) find(-name -type) basename dirname seq
which man help history clear whoami id hostname uname(-a -r -s -n -m) date(+FORMAT) df(-h) du(-s -h) ps top sleep true false
gzip gunzip zcat tar(-c -x -t -z -v -f) zip(-r) unzip(-l) nano crontab(-l -e) bash sh ./script source exit export`.
Shell syntax: pipes, `> >> < 2> 2>&1`, `&& || ;`, comments, variables, `$1..$9 $# $@ $? $HOME $USER $PWD`,
`$(...)` and backticks, `$(( ))` integer arithmetic, quotes and backslash, globs `* ? [abc]`, `~`, `for ... do ... done`,
`if [ ... ]; then ... elif ... else ... fi`, `while [ ... ]; do ... done`, test operators `-f -d -e -s -x -z -n = != -eq -ne -lt -le -gt -ge`.
Not simulated (explain in text instead): awk, sed, networking that needs the internet (curl, wget, ping print a
clear "no network in this practice environment" message), package installation (apt), sudo.
Sorting uses simple character order (like `LC_ALL=C`).

## 8. Python trace programs

```js
BB.pyPrograms['loop-total'] = {
  title: 'Adding up read counts',
  code: 'counts = [12, 30, 7]\ntotal = 0\nfor c in counts:\n    total = total + c\nprint(total)',
  ask: [ { line: 4, occurrence: 2, var: 'total', q: 'What will total be after this line runs the second time?',
           options: ['30', '42', '49'], answer: 1, why: '12 + 30 = 42 after the second pass.' } ]
};
```

Programs must be self-contained (no files, no input(), no randomness), under about 40 executed steps. `tools/build_traces.py`
runs them with real Python, records every step, and checks each `ask` (option text must equal Python's `repr` of the
value, so strings need quotes: `"'ATG'"`).

## 9. Glossary

```js
BB.glossary.push({ term: 'grep', aka: ['global regular expression print'], def: 'Plain-English definition, 1 to 2 sentences.', why: 'Why it matters in bioinformatics, 1 sentence.', lesson: 'f1-grep' });
```
Terms are auto-linked inside lessons, so choose the form learners will actually read. Avoid duplicates with other files.

## 10. Checks before you finish

```
node tools/validate.mjs          # schema, style rules, references
python3 tools/build_traces.py    # Python traces and their prediction prompts
python3 tools/verify_code.py     # runs every verified Python, R and Bash example for real
```
All must pass with zero errors. Fix content, never the tools (tell the coordinator if a tool is wrong).
