# BioBridge

Version 2.1.1. See `CHANGELOG.md` for what changed.

**Live site:** <https://almokhtar8-stack.github.io/biobridge/>

BioBridge is a free, beginner-first study companion for students in the KAUST Academy Bioinformatics Program who must finish three Coursera courses before the placement assessment:

- KAUST, *Fundamental Skills in Bioinformatics*
- Rice University, *Python Programming Essentials*
- IBM, *Hands-on Introduction to Linux Commands and Shell Scripting*

It assumes no background in biology, programming, Linux or statistics, and it explains the why behind every tool before the how.

**Independence notice.** BioBridge is an independently developed educational companion. It is not an official KAUST, KAUST Academy, Rice, IBM or Coursera service. Its practice questions are original and unofficial: they are not official KAUST Academy questions, they were not written from any real assessment, and no official placement-test blueprint was used or invented. Always follow the official course pages and your cohort's own instructions.

## Open it

The site is plain HTML, CSS and JavaScript. There is no build step, no account, no server code and no API key.

**Recommended: serve the folder locally.** Everything works offline this way, including real Python.

```bash
cd BioBridge && python3 -m http.server 8000
```

Then open <http://localhost:8000>. On Windows, use `py -m http.server 8000` in the same folder.

**Quick look: open `index.html` directly.** Lessons, labs, the terminal, practice and progress all work from the file. The only difference is real Python: from a file, the browser cannot read the bundled copy, so the first run downloads Python (about 13 MB) from the jsDelivr CDN and needs an internet connection.

**Publish on GitHub Pages.**

1. Create a repository and upload the contents of this folder (so `index.html` is at the top level).
2. In the repository, open Settings, then Pages, choose "Deploy from a branch", pick your main branch and the `/ (root)` folder, and save.
3. After a minute the site is live at `https://<your-user>.github.io/<repository>/`.

All paths are relative and routing uses `#/...` addresses, so it also works from a sub-folder or any other static host.

**On a phone.** Open the site in Safari or Chrome and choose Add to Home Screen (Safari: the Share button; Chrome: the menu) to get a BioBridge icon that opens full screen.

## What learners get

- **60 lessons in four foundations**, ordered by what depends on what: Foundation 0 (absolute zero: biology and computing), 1 (Linux), 2 (Python), 3 (bioinformatics, R and statistics). Every lesson follows the same path: what it is, why it exists, how it works, a worked example, a hands-on activity, a check, a real-science connection and a teach-back.
- **22 interactive labs**, each also embedded in its lesson: DNA to protein editor with mutation types, a simulated Bash terminal with realistic project files and 14 guided missions, step-through Python traces, real Python in the browser, FASTQ decoder, count-matrix explorer, the normalization lab from version 1.0 (extended), a guided heat-shock RNA-seq experiment with a volcano plot, replicates and t-test, correlation, multiple testing, single-cell quality control and cluster labelling, and method-choice scenarios.
- **Placement-style practice (unofficial)**: a 15-minute diagnostic, topic practice by foundation or objective, "weakest areas" practice, and timed or untimed mock assessments of 20 or 40 questions. 310 hand-written questions at three levels plus 25 generators that create fresh variations. Every option explains why it is right or wrong.
- **Review queue** with spaced repetition for every mistake and every completed lesson.
- **Progress by objective** (59 "I can..." statements), described as "Consistent in practice", "Developing" or "Needs work". Finishing a lesson or a quiz is never described as mastery.
- **Glossary** of 273 terms, linked from lesson text and available from every page.
- **Notebook** of teach-back explanations, downloadable as Markdown or printable.
- **Study plan** sequenced by stage and dependency, with a pace calculator for the deadline.
- Works on phones, tablets and desktops, with keyboard access, visible focus, labels for assistive technology, and light and dark themes.

## Where things live

| Path | What it holds |
| --- | --- |
| `index.html` | Page shell and the ordered list of scripts |
| `css/styles.css` | All styling, light and dark themes |
| `content/` | All teaching content as data: curriculum, lessons, questions, glossary, missions, Python programs and traces, scenarios, datasets, the virtual file system |
| `js/` | Logic: routing, storage, interface, the simulated shell, practice engine, generators, lesson and page views |
| `js/widgets/` | Interactive labs |
| `vendor/pyodide/` | Pyodide 314.0.7 (CPython for the browser), MPL-2.0 licence, used for real Python |
| `assets/`, `manifest.webmanifest` | Icon and web app manifest |
| `tools/` | Content validator, generators for datasets, traces and the coverage matrix, and the test suites |
| `docs/` | Coverage matrix and testing report |

Content and logic are separate: changing a lesson, question or glossary entry never needs a JavaScript change.

## Common changes

**Change the deadline.** Edit `deadline` and `deadlineLabel` in `content/curriculum.js`.

**Edit or add content.** Follow `tools/CONTENT_GUIDE.md` (schemas, writing rules and examples). Then validate and re-check:

```bash
node tools/validate.mjs && python3 tools/verify_code.py && node tools/build_coverage.mjs
```

The validator checks structure, links between ids, banned words and dashes, and writes the code jobs. `verify_code.py` runs every code example and coded question with real Python, R and Bash in a fresh copy of the practice files and fails if any shown output differs.

**Rebuild generated data** after changing the toy datasets or Python trace programs:

```bash
python3 tools/build_datasets.py && node tools/validate.mjs && python3 tools/build_traces.py
```

## Tests

| Command | What it checks | Needs |
| --- | --- | --- |
| `node tools/validate.mjs` | Content structure, references, writing rules | Node 18+ |
| `python3 tools/verify_code.py` | Every code example and coded question, by execution | Python 3 with pandas and NumPy, R (`Rscript`), Bash |
| `node tools/test_shell.mjs` | Simulated shell against real Bash, 190 command lines | Bash, Python 3, `script` |
| `node tools/test_missions.mjs` | Every terminal mission solution passes its checks | Node |
| `node tools/test_generators.mjs 40` | Question generators: structure, and answers by execution | Node, Python 3, R |
| `node tools/test_stats.mjs` | In-browser statistics against SciPy values | Node |
| `python3 tools/test_sessions.py --base http://localhost:8811` | Practice sessions: no duplicate scoring, resuming, timer rules, storage repair, import, in-site links | Playwright for Python with Chrome, the site served |
| `python3 tools/test_e2e.py --base http://localhost:8811` | Every page at phone, tablet and desktop sizes, plus the main learning flows | Playwright for Python with Chrome, the site served on port 8811 |

Add `--axe path/to/axe.min.js` to the end-to-end run for an automated WCAG 2 A and AA audit. Results of the last full run are in `docs/TESTING.md`.

## Data and privacy

Progress is stored only in the browser's local storage on the learner's device, under the key `biobridge-v2`. Nothing is sent anywhere. Progress from BioBridge 1.0 (`biobridge-v1`) is migrated automatically on first visit. The About page exports progress as a JSON file, imports it on another device, and resets everything. Clearing browser data deletes progress, so learners should export a copy now and then. On iPhone and iPad, a BioBridge icon added to the home screen keeps its own storage, separate from Safari, so use Export and Import to move progress between the two.

## Data and scientific honesty

The heat-shock RNA-seq and single-cell datasets are small simulations made for teaching. Gene names are real and the direction of the heat-shock response (heat-shock proteins rise strongly, housekeeping genes stay flat) matches the biology, but the numbers are simulated and labelled as such in the site. The statistics shown in labs are simplified (for example a Welch t-test on log values with Benjamini-Hochberg correction) and each lab says how real tools differ.

## Credits and licences

- Python in the browser: [Pyodide](https://pyodide.org) 314.0.7, Mozilla Public License 2.0 (`vendor/pyodide/`).
- Course titles and module summaries are taken from the public Coursera course pages and the KAUST Academy program page, for orientation only.
- BioBridge content and code: written for this project.

See `CHANGELOG.md` for what changed from version 1.0, `docs/COVERAGE.md` for the course-by-course coverage matrix and `docs/TESTING.md` for test results and known limitations.
