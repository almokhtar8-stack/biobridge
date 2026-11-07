# BioBridge testing and limitations report

## Version 2.1.1 (7 November 2026)

Every suite below was run on the `release/2.1.1` branch in this environment, served over http. Logs from these runs are kept outside the site; the numbers are copied from their last lines.

| Suite | Command | Result |
| --- | --- | --- |
| Content structure | `node tools/validate.mjs` | No errors (60 lessons, 310 questions, 273 glossary terms) |
| Code shown to learners, by execution | `python3 tools/verify_code.py` | 198 of 198 match (Python 3.13, R 4.3.3, Bash 5.2) |
| Simulated terminal against real Bash | `node tools/test_shell.mjs` | 190 of 190 identical |
| Terminal missions | `node tools/test_missions.mjs` | 78 of 78 steps pass |
| Question generators | `node tools/test_generators.mjs 30` | 750 variants, 390 executed checks, 0 problems |
| Statistics against SciPy | `node tools/test_stats.mjs` | All match |
| Browser: every route, main flows, accessibility | `python3 tools/test_e2e.py --axe ...` | 41 of 41; 97, 97 and 127 routes at phone, tablet and desktop sizes with no JavaScript errors; axe-core: 0 violations in light and dark themes |
| Browser: sessions, timers, storage, links (new) | `python3 tools/test_sessions.py` | 44 of 44 |
| Phone layout (25 pages at 320, 360, 390 px and landscape) | audit script used during development, not shipped | No horizontal overflow; no text field under 16 px |

New regression checks in `tools/test_sessions.py` and what they cover:

- **Duplicate scoring:** answering, redrawing three times, reloading and resuming leaves exactly one attempt per question and an unchanged review queue; a review item moves up exactly one box; a mock records exactly one attempt per question on submission and nothing when the results are viewed again.
- **Restoring answers:** a resumed topic question shows its saved answer and explanation and cannot be answered again; mock answers survive Previous, the question grid and a reload.
- **Timers (with a controlled clock):** a 20-question mock starts at 30:00 and counts down on screen; leaving for 40 minutes neither redirects nor submits; Resume continues from the same time; Pause stops the clock; a reload does not reset it; five redraws still give exactly one running clock; running out on screen submits once, shows the results and says that time ran out; a 2.1.0 session that ran out while away is submitted when opened.
- **Session replacement:** starting a new session asks before discarding an unfinished one with answers.
- **Storage:** damaged saved data is repaired and the app keeps working; unreadable data resets with a message and is kept as a backup; a non-BioBridge file is refused without changes; export then import returns the same progress; damaged fields in an imported file are repaired.
- **Diagnostic:** "I don't know yet" is always the last option.
- **Links:** every in-site link on every main page and lesson (100 links) opens a real page or section.

Not tested in 2.1.1: real phones and tablets, Safari, Firefox, screen readers, and the live GitHub Pages site (this environment cannot reach github.io). The release was then published to GitHub Pages; the live site itself was not tested from this environment.

## Earlier report (2.0.0 and 2.1.0)

## Results at a glance

| Area | What was checked | Result |
| --- | --- | --- |
| Content structure | 60 lessons, 310 questions, 273 glossary terms, 14 missions, 16 Python programs: required fields, ids and references, a "why" for every option, banned words and dashes | No errors |
| Code shown to learners | Every code example and coded question run with real Python, R or Bash in a fresh copy of the practice files: 198 programs (98 Python, 57 Bash, 43 R; 93 from lessons, 105 from questions), compared with the output or answer the site shows, plus a check that no wrong option would also match | 198 of 198 match |
| Question generators | 25 generators x 30 seeds = 750 variants: structure, unique options, explanations; 390 code-based variants executed with real interpreters | 0 problems, 390 of 390 match |
| Simulated terminal | 190 command lines run in the simulator and in real Bash 5.2 (inside a pseudo-terminal, same files, C locale, 80 columns), comparing everything the learner would see | 190 of 190 identical |
| Terminal missions | Every step of all 14 missions replayed with its model solution and checked with the step's own success rule | 78 of 78 steps pass |
| In-browser statistics | Welch t-test p-values (5 cases), Benjamini-Hochberg adjusted p-values and Pearson correlation against SciPy 1.18 | All match (Welch within one part in a million, observed agreement to about 15 digits; BH and Pearson within 1e-12) |
| Pages | Every route, including every lesson, at phone (390 x 844), tablet (820 x 1180) and desktop (1366 x 900) in Chrome; desktop also opens every mission and trace | 97, 97 and 127 routes with no JavaScript errors and no horizontal overflow |
| Learning flows | 34 scripted checks of the main flows (listed below), on desktop and phone | 34 of 34 pass |
| Accessibility | axe-core 4.14, WCAG 2 A and AA rules, 14 key pages in light and dark themes (28 audits) | 0 violations of any severity |
| Content review | Three independent reviewers (biology and RNA-seq; statistics and analysis; Linux and Python) read every lesson, question, glossary entry, mission, scenario and lab text | 36 corrections applied, then about 30 follow-up fixes; all suites rerun |
| Phone layout | 25 key pages at 320, 360 and 390 px wide and in phone landscape (844 x 390), with touch emulation: horizontal overflow, text-field font size (iOS zooms below 16 px), touch-target size | No overflow at any size; no field under 16 px; controls 40 to 44 px tall on touch screens (inline glossary links excepted) |
| Opened as a file | 18 routes, progress saving and the terminal when `index.html` is opened directly | All work; Python shows a clear message (see limitations) |

## Environment

Chrome for Testing 153 (headless) through Playwright 1.63 for Python; Node 22.23; Python 3.13.18 with pandas 3.0.5, NumPy 2.5.3 and SciPy 1.18.1; R 4.3.3; GNU Bash 5.2.21; axe-core 4.14.0. The site's own Python is Pyodide 314.0.7, bundled in `vendor/pyodide/`.

## Learning flows tested in the browser

- Migration of BioBridge 1.0 progress (completed lessons and practice history), and reset without re-importing 1.0 data.
- Diagnostic: completes, stores results, shows a recommended path.
- Topic practice: explanation after answering; attempts recorded per question.
- Mock assessment: timer shown; 20 questions scored and saved; questions drawn from all four foundations.
- Mistakes added to the spaced review queue; due items open as a review session.
- Lesson: checkpoint and teach-back mark the lesson as explained; progress survives a reload and appears in the notebook; the lesson's checks enter the review queue.
- Glossary: lesson terms open the glossary drawer; Escape closes it.
- Skip link: it is the first focusable element and moves focus to the content without leaving the page.
- Terminal: a full mission completed by typing commands; Tab completion of file names.
- Python trace: steps to the end with prediction prompts.
- Real Python: runs and reads the practice files; shows a readable traceback; stops a runaway loop at the time limit.
- Export downloads a JSON copy of progress.
- RNA-seq lab draws all 1,512 genes on the volcano plot; single-cell lab accepts correct cluster labels; DNA lab classifies a nonsense mutation.
- Phone: terminal input usable, typed commands run, helper key recalls the previous command, lesson checkpoint responds to taps, "More" opens the navigation drawer and its links navigate and close it.
- No JavaScript errors during any flow.

## Content review

After the build, three reviewers who had not written the content each read one area in full: biology and RNA-seq (Foundation 0, sequence files, RNA-seq design, alignment, counts, normalization, R basics and the DNA and data labs), statistics and analysis (exploratory analysis to interpretation, scenarios, the statistics and single-cell labs), and Linux and Python (Foundations 1 and 2, missions and trace programs). They checked claims by running code in real Python, R and Bash where possible.

Examples of what was corrected: complementary strands written without their 5' and 3' ends, "each codon in between" (which implied the start codon adds no amino acid), the fold-change arithmetic quoted with and without the pseudocount, limma-voom described as a count model, the cell cycle listed as a technical effect, `2>&1` ordering, `**` associativity, permissions needed to delete a file, a Python list described as appending when a number is added (it raises an error), and an FDR described as a "known" share of false discoveries (it is a controlled average). The DNA lab also mislabelled three edge cases (scattered deletions, changes outside the coding part, one stop codon swapped for another); its classifier now reports each one correctly.

Points the reviewers judged debatable and left as they are, for a subject expert to settle: Foundation 0 describes an adjusted p-value only as "very unlikely from noise alone"; FOS is described as about 3.7-fold higher (ratio of average CPM) in lessons and about 3.5-fold (from the log2 fold change) in the guided experiment; a few explanations call significance "confidence that a change is real"; the shell is described as showing a program's results, although programs write to the terminal themselves.

## Visual and keyboard review

Screenshots of the home page, lessons, labs, practice and terminal were reviewed at phone, tablet and desktop sizes in both themes, and the interactive code was inspected for keyboard access. Problems found and fixed during this review: a hero illustration that read as a bone (replaced with a DNA double helix), too many glossary links in some paragraphs (now at most three per paragraph), volcano plot labels clipped at the edges, plots stretching too wide on large screens, a phone terminal input squeezed to zero width by a long prompt, table headers that pushed a three-column table off a phone screen (headers now wrap), tab rows that hid their last option off-screen on phones (they now wrap), a skip link that sent keyboard users to the home page (it now moves focus to the content), and a volcano plot that could only be inspected by tapping (it now has a gene picker that works from the keyboard).

## Quality assurance checklist from the brief

| Brief item | How it was handled | Status |
| --- | --- | --- |
| 1. Scientific and technical correctness | Every runnable example and coded answer verified by execution; statistics verified against SciPy; terminal verified against real Bash; datasets generated by a seeded script with real gene names and the known direction of the heat-shock response; every text reviewed by three independent reviewers (see below). No subject-matter expert outside this project has reviewed it. | Done, with the caveat stated |
| 2. Beginners can follow the progression | Foundation 0 assumes nothing; each lesson links the lessons it builds on; terms are linked to the glossary on first use; the diagnostic routes learners to their starting point. Not yet tried with real beginners. | Designed for it; untested with learners |
| 3. Examples explain mechanisms | Each lesson has a worked example with real output and step notes, a hands-on activity, and a real-science connection. | Done |
| 4. Quiz answers and explanations validated | Structure validated for all items; all code-based items executed; every option carries its own explanation. | Done |
| 5. Navigation, saved progress, exercises, responsive layouts | Automated tests above at three sizes. | Done in Chrome; other browsers untested |
| 6. Remove repetition and decoration without value | 1.0 lessons merged into a single dependency-ordered sequence; no badges, points or streaks; the only illustration is the hero helix. | Done |
| 7. Content not aligned with the courses | Labelled on each lesson and listed in `docs/COVERAGE.md`; workflow-tool questions are kept out of mock assessments. | Done |
| 8. Useful before the deadline without lengthy setup | Opens from a file or any static host; no install, account or key. | Done |

## What was not tested

- **Real devices and other browsers.** Only Chrome was used, with phone and tablet screen sizes emulated. Safari on iPhone and iPad, Firefox and Samsung Internet were not tested. Touch keyboards, iOS zoom behaviour and the on-screen keyboard covering the terminal input are the most likely places for surprises.
- **Screen readers.** The automated audit passes, but no manual test with VoiceOver, TalkBack or NVDA was done.
- **Learners.** No pilot with students, so difficulty, pacing, lesson length and the diagnostic's recommendations are unvalidated.
- **Python from the CDN.** When `index.html` is opened as a file, the browser cannot load the bundled Python, so it fetches Pyodide from jsDelivr. The build environment blocks that CDN, so this path was not exercised. Without a connection, the site says so and suggests serving the folder instead. Served over http or https (including GitHub Pages), the bundled copy is used and no connection is needed.
- **Long-term storage behaviour.** Browsers may clear local storage (for example Safari after a long period without visits, or in private browsing). Export and import exist for this reason, but storage eviction itself was not tested.
- **Printing** the notebook was not tested.

## Scientific limitations

- **Toy data.** The heat-shock bulk dataset (6 samples, 1,512 genes) and the single-cell dataset (418 cells, 12 genes) are simulated. Gene names are real and the direction of change matches the biology (for example HSPA1A rises strongly after heat shock while ACTB stays flat), but the counts are not measurements. The site labels them as simulations.
- **Simplified statistics.** The guided RNA-seq experiment uses counts per million, log2 values, a Welch t-test and Benjamini-Hochberg correction. Real tools such as DESeq2 and edgeR use count models with shrunken variance estimates and give different p-values, especially with three replicates. The lab says this.
- **Single-cell clusters** are pre-assigned from marker expression rather than computed by a clustering algorithm, and the 2-D layout is generated rather than a real UMAP. The lab says this.
- **Alignment and quantification** are explained and illustrated, not run.
- **Placement preparation is unofficial.** No official blueprint exists in the public material reviewed, none was invented, and no real assessment questions were seen. The mock quotas (about 10% Foundation 0, 25% Linux, 30% Python, 35% Foundation 3) are a reasonable spread across the three courses, not a prediction of the real assessment.

## Technical limitations

- **The terminal is a simulation.** It implements 73 commands and the Bash features beginners meet, over in-memory files that reset on demand. It has no network, no package installer, no `awk` or `sed`, no job control and no real processes; those commands print an explanation instead. Directory listings from `find` and `tar` are sorted alphabetically, while real tools use on-disk order, and sorting follows the C locale.
- **Python** is real CPython 3.14 (Pyodide). The verification suite ran examples with CPython 3.13, so a traceback could differ slightly in wording or markers between the two versions. pandas and NumPy are not loaded in the browser, so the pandas lesson shows real output produced during the build rather than running live.
- **R** is not run in the browser. R examples show output produced by real R 4.3.3 during the build.
- **Progress is per browser.** There is no account or sync; moving devices needs export and import.
- **Objective status** is an estimate from recent answers weighted by recency (lesson checks count half). It describes practice performance only and is worded that way.

## Content size

Core reading per lesson (what, problem, why, steps, example notes, pitfalls and connection, excluding optional deeper details, activities and checks): median 470 words, range 334 to 583. Including every optional part, the median lesson has 879 words and the longest 1,294.
