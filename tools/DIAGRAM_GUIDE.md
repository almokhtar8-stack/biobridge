# BioBridge 2.2 diagrams: how to write one

Diagrams are short, original, step-by-step visual explanations shown on Companion topic pages. A student should
understand the idea in about one minute by pressing Next through 4 to 7 steps. Every step has a caption; the
visual highlights what the caption talks about.

Read first: `js/widgets/diagrams.js` (the engine, about 200 lines) and `js/diagrams/core.js` (15 finished diagrams:
copy their style). The topic texts that use your diagrams are described in `tools/COMPANION_GUIDE.md` sections 5
and 6; the content of each diagram is specified in section 6 (repeated per agent brief).

## 1. File format

```js
/* <Group> diagrams. Original visuals for BioBridge; numbers come from the simulated practice data. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h } = BB;            // HTML builder: h('div.cls', { attr: v, 'data-k': 'key' }, children...)
  const def = BB.diagram.define;

  def('name', {
    title: 'Short title (at most 50 characters)',
    summary: 'One sentence describing the whole visual for screen readers.',
    build(D) { return /* SVG or HTML node */; },
    steps: [ { cap: '...', show: [], hide: [], hi: [], set: {}, move: {} }, ... ]
  });
})();
```

## 2. Steps

- 4 to 7 steps. Each `cap` is 1 or 2 short sentences (at most 40 words), plain English, may use `` `code` `` and
  `**bold**`. Teach one thing per step. The last step usually connects the idea to biology or warns about a common
  mistake.
- `show: [keys]` parts appear at this step (they are hidden before it, and stay visible after).
- `hide: [keys]` parts disappear from this step on.
- `hi: [keys]` parts are highlighted during this step only (thick gold outline plus tint, so color is not the only cue).
- `set: { key: 'text' }` replaces the text of a keyed element from this step on (great for "the value changes").
- `move: { key: [dx, dy] }` translates a keyed SVG group from this step on (positions are absolute offsets from where
  the group was drawn, not cumulative).
- Everything is recomputed from step 1 each time, so Back always works. A key can be on several elements; an element
  can carry several keys (space separated in `data-k`).

## 3. Builders (`D`)

SVG (design at **width 400**, height up to 360; text size 11 to 16; the SVG scales to the screen, so never go below 11):
- `D.svg(400, h, ...children)` root.
- `D.box(key, x, y, w, h, 'label\nsecond line', { cls, mono, size, anchor: 'start', r })` rounded box with centered
  text. `cls`: `dir` (folder, blue), `file`, `navy`, `gold`, `green`, `red`, `blue`, `violet`, `orange`, `muted`,
  `code` (dark code box, monospace), `ghost` (dashed outline).
- `D.text(key, x, y, 'text', { size, anchor, mono, weight, cls: 'muted' | 'gold' | 'blue' | 'red' | 'green' })`.
- `D.arrow(key, x1, y1, x2, y2, { cls: 'gold' | 'blue' | 'dash', bend, label, lx, ly, noHead, both })`.
- `D.route(key, 'M.. V.. H..', { cls: 'gold' | 'blue' })` thick colored path with an arrowhead (for routes).
- `D.line(key, x1, y1, x2, y2, { cls: 'axis' | 'dash' | 'thin' })`, `D.path(key, d, { cls: 'fill' | 'gold' | 'goldfill' })`,
  `D.dot(key, cx, cy, r, { cls: 'red' | 'green' | 'gold' | 'muted' | 'violet' | 'orange' })`, `D.g(key, ...children)`.
HTML (often better for text-heavy visuals, because it wraps on phones):
- `D.flow([{ k, t: 'title', d: 'detail', tag: 'small label', cls: 'navy' }], { compact: true })` vertical chain with arrows.
- `D.table(rows, { head: true, rowHead: true, mono: true })` cells get keys `r{i}c{j}`, row `r{i}`, column `c{j}`;
  a cell can be `{ t: 'text', k: 'extra-key', cls: 'num' }`.
- `D.cells([12, 0, 7, 30], { key: 'x', start: 1, label: (i) => ..., noIdx })` a row of value boxes with positions
  (`start: 1` for R, `0` for Python); keys `x1`, `x2`...
- `D.code(['$ [[cmd|ls -l]] data', 'line two'], { term: true })` code block; `[[key|text]]` makes a keyed span; each
  line is keyed `L1`, `L2`... No nesting of `[[...]]`.
- `D.note(key, 'text', { cls: 'gold' })` a small note box. `D.el('div.cls', key, children...)` any keyed element.
- Layout helpers (CSS): `h('div.dg-row', h('div.dg-col', ...), ...)` side-by-side columns that wrap on phones;
  `h('div.dg-label', 'small label')`; `h('div.dg-big', { 'data-k': 'k' }, 'value')` a big value box;
  `h('ul.dg-chips', h('li.dg-chip', 'file.txt'), h('li.dg-chip.dir', 'folder/'))` file chips.
- If you need a little extra CSS, append it to the end of `css/styles.css` under a comment
  `/* diagrams: <your group> */`, prefix every class with `dg-`, and use only the CSS variables already defined there
  (`--text`, `--muted`, `--heading`, `--surface`, `--surface-2`, `--border`, `--dg-line`, `--dg-fill`, `--dg-hi`,
  `--dg-hi-fill`, `--blue`, `--blue-soft`, `--red`, `--red-soft`, `--green`, `--green-soft`, `--violet`, `--violet-soft`,
  `--orange`, `--orange-soft`, `--navy`, `--code-bg`, `--code-text`, `--mono`). Both light and dark themes must work.

## 4. Rules

- Original drawings only. No logos, no copies of course slides, no screenshots of real software (an RStudio or
  Jupyter layout must be a simple schematic of labeled boxes).
- Correct and precise. Use BioBridge's practice data where numbers appear (counts.tsv genes HSPA1A, HSPA1B, HSPA6,
  DNAJB1, HSPH1, HSPB1, BAG3, ACTB, GAPDH, EEF1A1, TP53, FOS; samples ctrl_1..3, heat_1..3; files in
  ~/project/data). Compute any number you show; do not guess.
- No em dashes or en dashes anywhere, and never the words leverage, robust, seamless, elevate.
- Readable on a 390 pixel wide phone: few words inside the SVG, labels at least size 11, nothing overlapping.
  Put explanations in captions, not in the picture.
- Nothing may overflow horizontally at 360 pixels wide (wide tables are allowed only inside `D.table`, which scrolls).

## 5. Check your work (required)

Serve the site (once), from the project folder: `python3 -m http.server 8822`.

Then screenshot every step at phone width, and the last step in dark mode at desktop width:

```
python3 tools/shoot_diagrams.py NAME1 NAME2 --steps --phone --out /tmp/dg_<group>
python3 tools/shoot_diagrams.py NAME1 NAME2 --dark --out /tmp/dg_<group>
```

Open the PNG files and look at them. Fix overlaps, clipped text, unreadable sizes, wrong highlights and anything
that is not obviously clear. The tool prints `ERROR` lines for JavaScript errors and `OVERFLOW` when the page is
wider than the screen; both must be zero. `node --check js/diagrams/<file>.js` must pass.

Only edit your own diagram file (and append to css/styles.css if needed). Do not edit other files and do not run git.
