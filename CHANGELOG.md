# Changelog

## 2.1.0 (7 November 2026)

### Changed

- New look in a navy and gold course-site style: a navy top bar with uppercase links and a gold underline for the current page, a home hero with a highlighted title and confetti shapes, full-width navy title bands on every page, centered section titles with gold labels, white cards that lift on hover, pill buttons, navy table headers and a cream footer.
- BioBridge keeps its own name and bridge mark (now gold on navy). The independence notice appears in the hero and in a new footer on every page, so the site cannot be mistaken for an official KAUST Academy page.
- Desktop navigation moved from a sidebar to the top bar; phones keep the bottom tab bar, and the menu now opens from the right, next to its button.
- Gold is used for fills, underlines and icons; gold text uses a darker shade so it stays readable. The accessibility audit still reports no violations in light or dark theme.

## 2.0.0 (7 November 2026)

BioBridge 2.0 rebuilds version 1.0 from a single 90 KB HTML page into a static multi-file site with the teaching content stored as data, a real practice engine, real Python, a much deeper terminal simulation and a full test suite. Everything below was checked by the tests described in `docs/TESTING.md`.

### Kept from 1.0

- The name, the purpose (a beginner-first companion for the three prerequisite courses), the plain-English voice and the hero message, now worded "You do not need a background. You need the why."
- The four subject areas: biology and RNA-seq, Linux, Python, R and statistics.
- The normalization lab ("Is gene X really higher?"), extended with a sequencing-depth slider and a composition-bias case.
- A written teach-back at the end of every lesson.
- The glossary: all 30 version 1.0 terms are still there, rewritten and joined by 243 more.
- The study plan, the December 5, 2026 deadline (now set in one place, `content/curriculum.js`), links to the official course pages and the KAUST Academy program page, and the independence notice.
- Progress saved in the browser. Progress from 1.0 is migrated automatically: each completed 1.0 lesson marks its 2.0 successor as completed, and the 1.0 practice history is kept.
- Static hosting on GitHub Pages with no build step.

### Added

**Curriculum**
- Foundations 0 to 3 ordered by dependency: Foundation 0 (absolute zero: cells, DNA, genes, proteins, expression, programs, files, datasets, why biology needs code), Foundation 1 (Linux), Foundation 2 (Python), Foundation 3 (sequence files, RNA-seq, R, statistics, differential expression, single-cell data, interpretation).
- 60 lessons (1.0 had 24), each mapped to course modules and labelled "Taught in the course", "Background the courses assume" or "Beyond the prerequisites".
- Every lesson follows one sequence: what it is, the problem it solves, why you should care, how it works step by step (with optional deeper details), a worked example with real output and common mistakes, a hands-on activity, a check with explanations for every option, a real-science connection, and a teach-back with key-point self-check.
- 59 learning objectives written as "I can..." statements. All progress is tracked against them.

**Interactive learning**
- 22 labs, each also embedded in its lesson (1.0 had 3).
- DNA to RNA to protein editor that classifies silent, missense, nonsense, frameshift, in-frame, start-lost and stop-lost changes, as well as changes outside the protein-coding part.
- A simulated Bash terminal rebuilt from scratch: a real parser with pipes, redirection, quoting, variables, command substitution, arithmetic, `for`, `while`, `if`, scripts with arguments and permissions, and 73 commands, over a realistic heat-shock project folder. Output formatting matches GNU tools, and 190 command lines were compared with real Bash. 1.0 recognized about a dozen exact command strings.
- 14 terminal missions (78 steps) with progressive hints, a "show me" option and checks that look at the result rather than the exact text typed.
- Real Python in the browser through Pyodide (CPython compiled to WebAssembly), with the practice files available, a 10-second limit for runaway loops, and error messages trimmed to the learner's own code.
- 16 step-through Python traces recorded from real Python execution, with prediction prompts.
- Predict-the-output, arrange-the-code and find-the-bug activities.
- Guided RNA-seq experiment (heat shock versus control): raw counts, normalization, replicates, a volcano plot of 1,512 genes, and interpretation.
- Count-matrix explorer, FASTQ decoder, log2 lab, replicates and t-test lab, correlation lab, multiple-testing simulator, single-cell quality control, cluster labelling with marker genes, cron explainer, path explorer, dataset reader, data-size estimator, discovery journey, and 12 method-choice scenarios.

**Placement-style practice (unofficial)**
- 310 original questions (1.0 had 30) at three levels: beginner, intermediate and application. Every option explains why it is right or wrong. Every question that contains code was executed with real Python, R or Bash to confirm the keyed answer.
- 25 generators that create fresh variations (arithmetic, strings, loops, GC content, reverse complement, translation, Phred scores, CPM, log2 fold change, grep counts, paths, permissions, cron, R indexing and more).
- A 15-minute diagnostic with an honest "I don't know yet" option, which produces a personal learning path.
- Topic practice by foundation or objective, a "weakest areas" mode, and mock assessments of 20 or 40 questions, timed or untimed, with flags and free navigation.
- Results by foundation, targeted revision for the weakest objectives, a review of every question with its reasoning, and a mistakes-only filter.
- A spaced review queue: every mistake and every completed lesson's checks come back at growing intervals.
- Clear "unofficial practice" labelling wherever practice appears. Mock assessments draw only on what the three courses teach; workflow-tool questions stay in topic practice.

**Support tools**
- Glossary drawer on every page and automatic links from lesson text to definitions.
- Progress page by objective, with the wording "Consistent in practice", "Developing", "Needs work", "Just started" and "Not practiced yet". Nothing is called mastered.
- Notebook of teach-back explanations, downloadable as Markdown and printable.
- Courses page mapping each course module to its lessons, with a status selector for each course.
- Study plan by stage and dependency, with a pace calculator for the deadline.
- Export, import and reset of progress on the About page.
- Light and dark themes, phone tab bar, tablet and desktop layouts, mobile helper keys for the terminal, keyboard access, skip link, visible focus, reduced-motion support and screen-reader labels.
- Phone-ready details: 44 px touch targets on touch screens, 16 px text fields so iPhones do not zoom while typing, no sticky hover highlights after a tap, autocorrect and auto-capitals switched off in code fields, a shorter terminal so the input and helper keys fit on screen, and home-screen icons for iPhone and Android.

**For maintainers**
- `tools/CONTENT_GUIDE.md`: schemas and writing rules for all content.
- `tools/validate.mjs`: structure, references, banned words and dashes.
- `tools/verify_code.py`: runs every code example and coded question with real Python, R and Bash.
- Shell, mission, generator, statistics and end-to-end browser test suites, and `tools/build_coverage.mjs` for the coverage matrix.
- Seeded generators for the toy datasets and the Python traces, so all numbers can be rebuilt.

### Changed

- Architecture: content in `content/`, logic in `js/`, styles in `css/`. Lessons, questions and glossary entries can be edited without touching code.
- Storage key `biobridge-v2`, with automatic migration from `biobridge-v1`.
- The 30 version 1.0 questions were retired. Every topic they covered (genes, reads, depth, log2 fold change, UMAP caution, variables, floor division, comparison, loops, print versus return, pandas, `ls`, `cd`, `head`, `grep`, pipes, scripts, R indexing, `mean`, `read.csv`, replicates, the p-value misconception, `na.rm`) has new questions with explanations for every option.
- Toy data: the 1.0 three-gene table was replaced by a seeded heat-shock dataset (6 samples, 1,512 genes, real gene names, simulated counts) and a 418-cell single-cell dataset, both labelled as simulations.

### Problems in 1.0 that 2.0 addresses

- The terminal only accepted fixed strings, so any real variation of a command failed. It is now a working shell simulation checked against real Bash.
- Python challenges could not run code. Python now runs for real, and traces come from real execution.
- Practice had 30 questions with one explanation each and no levels, diagnostics, review or objective tracking.
- Progress counted checked-off lessons. It is now reported per objective from practice evidence, and the site says plainly that completion is not mastery.
- Content and logic were mixed in one file, which made safe editing hard. Content now has a schema, a validator and execution checks.
