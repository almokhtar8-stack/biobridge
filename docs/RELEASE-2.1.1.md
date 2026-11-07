# BioBridge 2.1.1 release report

Branch `release/2.1.1`, based on `main` at 2.1.0 (commit `5be43bf`). Every problem below was reproduced with an automated browser test before it was fixed, and the same test passes after the fix. The tests are in `tools/test_sessions.py`.

## Reported problems

### A. Duplicate question scoring (confirmed, fixed)

- **Reproduction.** Start topic practice, answer question 1, then redraw the page three times: the attempt count for that question went from 1 to 4, and to 5 after a reload and Resume. In a review session, each redraw moved the item up another box; after a few redraws the item left the review queue entirely.
- **Root cause.** `sessionView` in `js/practice.js` redisplayed a saved answer by programmatically clicking the saved option. The click ran the normal answer handler, which records an attempt and reschedules review every time the screen is drawn.
- **Fix.** The question component (`BB.ui.mcq` in `js/ui.js`) gained a `restore` option that shows a saved answer and its explanation without calling the answer handler. The handler also refuses to score a question that already has an answer or a first-try result in the session (`firstTry`), so a question can record at most one attempt per session.
- **Mocks and the diagnostic** were checked as well: they record attempts only once, on submission, guarded by `sess.finished`. Tests confirm exactly one attempt per question and none when results are viewed again.

### B. Timer lifecycle (confirmed, fixed)

- **Reproduction.** Start a timed mock, go to Learn, and let the time run out: the hidden timer submitted the mock and moved the student to the results page from wherever they were. The Pause button did not stop the clock, although its label said Pause.
- **Root cause.** The interval was cleared only when the session screen was drawn again or submitted. The session stored an absolute end time, so time kept passing while the student was away, and expiry called `finish()` and `BB.go('/practice/results')` from the background.
- **Fix.** Sessions now store the remaining time and when the clock last started. The rules are stated in the code and on the practice page: the clock runs only while the mock is on screen; Pause, leaving the screen, hiding the tab or closing the page stops it; Resume continues from the same time; a reload never resets it. A single module-level clock is stopped before every redraw, so two can never run. Expiry on screen submits once and the results page says that time ran out. Sessions saved by 2.1.0 are converted on first use, keeping the time they had left; one that already ran out is submitted when opened.

### C. Statistical and biological accuracy (confirmed, fixed)

- **st-034.** It asked how many of 200 genes "are expected to be false discoveries" and its explanation said the list "is expected to contain at most about 10". That reads as a promise about this one list. The question now asks which statement is correct. The answer separates the FDR, an average over repeated experiments, from the unknown number in this list. Distractors cover "exactly 10", "none" and "each gene has at least a 95 percent probability of being real", the last being the misreading of an adjusted p-value as a posterior probability.
- **st-021** said a change was "probably real" from a p-value. It now says "strong evidence of a change", uses an adjusted p-value as a genome-wide study would, and adds that statistical significance is not biological importance.
- **st-033** said FDR control tells you which genes are real. It now says raw p-values cannot show which genes changed, and adjusted p-values give a list in which false discoveries are kept rare on average.
- **Glossary:**
  - "multiple testing" no longer says false positives are "almost certain".
  - "false positive" no longer says they are "guaranteed".
  - "false discovery rate" now defines the expectation as an average over repeats and says it does not identify which genes are false.
  - "adjusted p-value" now gives the BH meaning (the lowest FDR cutoff at which the gene would be called) and says it is not the probability that the gene is a false positive.
- **Lessons and labs:**
  - The multiple-testing lesson now says that in any one list the true number of false discoveries is unknown.
  - The Foundation 0 discovery lesson no longer describes an adjusted p-value as a probability.
  - An interpretation check now calls significance a measure of evidence, not of importance.
  - The multiple-testing lab now notes that a single run can show more or fewer false discoveries than the 5 percent average.

## Other problems found and fixed

| Problem | How it was found | Fix |
| --- | --- | --- |
| Starting a new session silently discarded an unfinished one with answers | Test: start a mock, answer, start topic practice | `BB.practice.begin()` asks first; every start button uses it |
| Damaged saved data (wrong types) crashed pages; an imported file was trusted as is | Test with seeded damaged storage | `sanitize()` in `js/storage.js` repairs every field on load and import |
| Unreadable saved data was overwritten, and its warning could vanish before it was shown | Test with seeded invalid JSON | The text is kept under `biobridge-v2-unreadable-backup`, and the message is captured at start-up |
| A full storage area could show the same warning on every save | Code review | The warning is shown at most once a minute |
| Home page course cards (`#/courses#kaust` and similar) sent students back to the home page | New link crawler over 100 in-site links | The router now opens the page and scrolls to the named section |
| "I don't know yet" appeared in random positions in the diagnostic | Code review, then test | It is always the last option |
| Each lesson visit left an event listener behind | Code review | The listener removes itself |

## Test results (this run)

All suites were run on the release branch:

- **Content and code:** content validation, no errors. Code examples verified by execution, 198 of 198.
- **Terminal:** shell against real Bash, 190 of 190. Missions, 78 of 78.
- **Generators and statistics:** 750 generator variants with 390 executed checks and 0 problems. Statistics match SciPy.
- **Browser:** the main suite passed 41 of 41, with no JavaScript errors on any route at phone, tablet or desktop size. The axe-core audit found 0 violations in light and dark themes. The new session suite passed 44 of 44.
- **Phone layout:** no horizontal overflow at 320, 360, 390 px or landscape.

No suite failed in the final run. During the work, the new session suite failed 10 of 25 checks against the 2.1.0 code, which reproduced problems A and B and the replace-without-asking problem. Later runs failed on two checks of my own that were written wrongly (a reload saved over the seeded data, and the link check compared the wrong part of the address); both tests were corrected.

Not tested:

- real phones and tablets, Safari, Firefox, and screen readers;
- the live site, which this environment cannot reach;
- learners using the site.

## Student progress

Existing progress is preserved:

- **Storage:** the storage key (`biobridge-v2`) and the data format are unchanged.
- **Session fields:** the new fields (`remainingMs`, `runningSince`) are added only when a session needs them.
- **Older timed sessions:** a 2.1.0 timed session is converted on first use, keeping its remaining time.
- **Repair:** it changes only fields with the wrong type and never deletes valid lessons, attempts, review items, sessions or settings.
- **Version 1.0 migration:** still tested and still passes.

One limitation: attempts already recorded twice by 2.1.0 are not removed, because they cannot be told apart reliably from genuine repeats. 2.1.0 was live for only a few hours; anyone who practised with it may have some repeated attempts in their accuracy figures.

## Deploying

Nothing has been merged or published. The live site still runs 2.1.0.

1. Open the pull request from `release/2.1.1` into `main`, review it, and merge it.
2. Publish. GitHub Pages currently serves the `gh-pages` branch, so after merging run this from any clone:

   ```bash
   git fetch origin && git push origin origin/main:gh-pages
   ```

   Alternatively, set Settings, Pages, Branch to `main` and `/ (root)` once; after that, every merge into `main` publishes on its own.
3. Open the live site and check that the About page shows version 2.1.1.

## Before inviting students

- Try the site on a real iPhone and an Android phone: the terminal keyboard, the Python editor, a timed mock with Pause and Resume, and Export and Import.
- Have a statistics or genomics teacher read the debatable points listed in `HANDOVER.md`.
- Decide how Pages should publish (from `gh-pages` as now, or from `main`), so that merged fixes actually reach students.
- Tell students that progress lives in their browser and that Export on the About page is their backup.
