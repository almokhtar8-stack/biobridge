# BioBridge 2.0 handover

Use this file to continue the project in a new chat: upload the BioBridge ZIP and say "Continue BioBridge from HANDOVER.md".

## Where the project stands

**Finished and tested**

- 60 lessons across Foundations 0 to 3, every one with all eight parts (what, why, how, show, try, check, connect, teach-back).
- 22 labs, 14 terminal missions, 16 Python traces, real Python through the bundled Pyodide.
- 310 bank questions, 25 generators, diagnostic, topic practice, weakest-areas practice, mocks (20 or 40, timed or untimed), review queue, objective-based progress, glossary (273 terms), notebook, study plan, courses page, export, import, reset, migration from 1.0.
- Docs: `README.md`, `CHANGELOG.md`, `docs/COVERAGE.md` (generated), `docs/TESTING.md`, `tools/CONTENT_GUIDE.md`.
- An independent content review (biology and RNA-seq; statistics and analysis; Linux and Python) read every lesson, question, glossary entry, mission, scenario and lab text. Its corrections are applied; open points are listed under "Questions for a subject expert" below.
- Test results are in `docs/TESTING.md`. In short: every code example and coded question verified by execution, shell output identical to real Bash on 190 command lines, every mission solvable, statistics identical to SciPy, every page free of JavaScript errors at three screen sizes, zero automated WCAG 2 A and AA violations.

**Not done**

- No testing on real phones, tablets, Safari or Firefox; only Chrome (headless) at phone, tablet and desktop sizes.
- No manual screen-reader pass.
- No pilot with real learners, so question difficulty and lesson length are untested with the audience.
- No review by an outside subject-matter expert.
- The Pyodide CDN fallback (used when `index.html` is opened as a file) could not be tested from the build sandbox, which blocks the CDN.
- pandas and NumPy are not loaded in the in-browser Python; pandas lesson code is shown with real, pre-computed output.
- R is never run live in the browser; R output shown in lessons was produced by real R during the build.

## Set up a working copy

```bash
unzip BioBridge-2.0.zip && cd BioBridge && python3 -m http.server 8811
```

Open <http://localhost:8811>. For the full test suite you also need Node 18 or later, R (`Rscript`), Python 3 with pandas, NumPy and SciPy, Playwright for Python with Chrome (`pip install playwright` then `playwright install chrome`), and axe-core (`npm install axe-core`). Versions used for the last run are listed in `docs/TESTING.md`.

## Map of the code

| To change | Edit |
| --- | --- |
| Deadline, course module list, objectives, lesson order, lesson metadata | `content/curriculum.js` |
| A lesson's text, example, activity, check or teach-back | `content/lessons-f0.js` to `lessons-f3b.js` |
| Practice questions | `content/questions-*.js` |
| Glossary | `content/glossary-*.js` |
| Terminal missions | `content/missions-f1.js`, `content/missions-f3.js` |
| Practice files in the terminal | `tools/build_datasets.py`, which writes `content/vfs.js` and `content/datasets.js` |
| Python trace programs | `content/py-programs.js`, then `python3 tools/build_traces.py` |
| Method-choice scenarios | `content/scenarios.js` |
| Question generators | `js/generators.js` |
| Selection, scoring, review intervals, objective status | `js/practice.js` |
| Lesson page layout | `js/lesson.js` |
| Other pages (home, learn, courses, labs, plan, about, notebook, glossary) | `js/pages.js` |
| Simulated shell | `js/shell.js`; terminal interface in `js/widgets/terminal.js` |
| Python runner | `js/widgets/pyrun.js` (Pyodide version and CDN address at the top) |
| Labs | `js/widgets/*.js` |
| Storage, migration, export and import | `js/storage.js` |
| Navigation, drawers, dialogs, multiple-choice component | `js/ui.js` |
| Routes | `js/app.js` |
| Look and feel | `css/styles.css` (colour variables at the top, dark theme under `[data-theme="dark"]`) |

## Rules the content follows

- Beginner first: define every term on first use, explain why before how, label simplifications and simulations.
- Every multiple-choice option has its own `why`. Wrong options target a real misconception.
- Any code with shown output must pass `python3 tools/verify_code.py`. Never type an output by hand.
- No em dashes or en dashes. Avoid "leverage", "robust", "seamless" and "elevate". The validator enforces these.
- Plans are sequenced by stage and dependency, never by calendar week.
- Never call anything official, never claim knowledge of the real placement assessment, and never describe completion as mastery.

## After any content change

```bash
node tools/validate.mjs && python3 tools/verify_code.py && node tools/build_coverage.mjs
```

After changing the shell or missions, also run `node tools/test_shell.mjs && node tools/test_missions.mjs`. Before a release, run the end-to-end suite with the site served on port 8811: `python3 tools/test_e2e.py --axe node_modules/axe-core/axe.min.js`.

## Questions for a subject expert

The reviewers left these as they are because they are debatable rather than wrong:

- Foundation 0 describes an adjusted p-value only as "very unlikely from noise alone" (a deliberate simplification at that stage).
- FOS is "about 3.7-fold" (ratio of average CPM) in lessons and "about 3.5 times" (from the log2 fold change) in the guided experiment.
- A few explanations (for example question st-021 and the f3-interpret check) describe significance loosely as confidence that a change is real.
- Question st-014 says a highly expressed gene's fold change is far more reliable because it rests on more reads, which leaves out variation between replicates.
- The f1-linux lesson and the "shell" glossary entry say the shell shows a program's results; programs write to the terminal themselves.
- Scenario 10 recommends Welch's test with 6 versus 6 samples; Student's test also copes reasonably there.

## Suggested next steps, in order

1. Open the site on a real iPhone, an Android phone and an iPad, and in Safari and Firefox on a laptop. Check the terminal keyboard, the Python editor and the volcano plot first, because they depend most on the browser.
2. Do a short screen-reader pass (VoiceOver on iOS or macOS, NVDA on Windows) on a lesson, a mission and a mock assessment.
3. Pilot with a few students. Note which questions most people miss and which lessons feel long, then revise those first.
4. Optional: bundle the Pyodide pandas and NumPy packages in `vendor/pyodide/` so the pandas lesson can run live (adds several megabytes).
5. Optional: add live R with webR, following the same pattern as `js/widgets/pyrun.js`.
6. Add questions where `docs/COVERAGE.md` shows the thinnest practice, and split the few lessons that run past 700 words.
