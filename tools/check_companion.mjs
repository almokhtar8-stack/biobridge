#!/usr/bin/env node
/* Check Companion topic files: schema, course item titles, word budgets, banned characters, and real execution.
   Usage: node tools/check_companion.mjs content/companion-ibm.js [more files]   (no arguments = all three course files)
          node tools/check_companion.mjs --no-exec ...   (skip running examples)
   - Every bash, python and r example (unless noVerify) and every `computer` try is run with tools/run_in_vfs.py
     and compared with its output, exactly as tools/verify_code.py does.
   - Every bash example is also run in BioBridge's simulated shell, which must print the same thing.
   - Every `terminal` try command must succeed in the simulated shell.
   Writes nothing. Needs tools/out/content.json (run `node tools/validate.mjs --quiet` once). */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const noExec = args.includes('--no-exec');
let files = args.filter((a) => !a.startsWith('--'));
if (!files.length) files = ['content/companion-ibm.js', 'content/companion-rice.js', 'content/companion-kaust-a.js', 'content/companion-kaust-b.js'];

const ITEMS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course_items.json'), 'utf8'));
const ctx = { console, TextEncoder, Intl, Date, setTimeout };
ctx.window = ctx;
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.resolve(ROOT, f), 'utf8'), ctx, { filename: f });
for (const f of ['content/curriculum.js', 'content/vfs.js', 'content/missions-f1.js', 'content/missions-f3.js', 'content/py-programs.js', 'js/shell.js']) load(f);
const BB = ctx.BB;
let diagramNames = new Set(ITEMS.diagrams);
// Once the diagram files exist, check against what is really registered.
const dgFiles = fs.existsSync(path.join(ROOT, 'js/diagrams')) ? fs.readdirSync(path.join(ROOT, 'js/diagrams')).filter((f) => f.endsWith('.js')) : [];
if (dgFiles.length && fs.existsSync(path.join(ROOT, 'js/widgets/diagrams.js'))) {
  try {
    ctx.document = undefined;
    load('js/widgets/diagrams.js');
    for (const f of dgFiles) load('js/diagrams/' + f);
    if (BB.diagrams && Object.keys(BB.diagrams).length) for (const k of Object.keys(BB.diagrams)) diagramNames.add(k);
  } catch (e) { /* diagrams need a DOM to build; the catalog list is enough here */ }
}

const WIDGETS = new Set(['dogma', 'expression', 'journey', 'filetree', 'datatable', 'scale', 'cron', 'fastq', 'countmatrix', 'normalization', 'rnaseq', 'log2', 'variability', 'correlation', 'pvalues', 'singlecell', 'methods']);
const BANNED = [/\bleverag(e|es|ed|ing)\b/i, /\brobust(ly|ness)?\b/i, /\bseamless(ly)?\b/i, /\belevat(e|es|ed|ing)\b/i, /lorem ipsum/i, /\bTODO\b/, /\bTBD\b/];
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const isStr = (s, min = 1) => typeof s === 'string' && s.trim().length >= min;
const words = (s) => (typeof s === 'string' ? s.trim().split(/\s+/).filter(Boolean).length : 0);
function lint(where, v) {
  if (typeof v === 'string') {
    if (v.includes('—')) err(`${where}: em dash`);
    if (v.includes('–')) err(`${where}: en dash`);
    for (const re of BANNED) if (re.test(v)) err(`${where}: banned word ${re}`);
  } else if (Array.isArray(v)) v.forEach((x, i) => lint(`${where}[${i}]`, x));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) lint(`${where}.${k}`, x);
}
const norm = (s, tabs) => {
  s = String(s).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let lines = s.split('\n');
  if (tabs) lines = lines.map((ln) => { let o = ''; for (const ch of ln) { if (ch === '\t') o += ' '.repeat(8 - (o.length % 8)); else o += ch; } return o; });
  lines = lines.map((l) => l.replace(/\s+$/, ''));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
};
function runReal(lang, code, cwd) {
  // run_in_vfs.py prints the program's stdout, and its stderr after a "[stderr]" marker on stderr.
  const p = spawnSync('python3', [path.join(ROOT, 'tools/run_in_vfs.py'), lang, code, '--cwd', cwd], { encoding: 'utf8', timeout: 90000 });
  if (p.error) return { failed: true, out: '', err: String(p.error.message) };
  return { failed: p.status !== 0, out: p.stdout || '', err: (p.stderr || '').replace(/^\[stderr\]\n?/, '') };
}
const home = (p) => (p || '~/project/data').replace(/^~/, '/home/student');
function runSim(lines, cwd) {
  const sh = new BB.Shell(BB.vfs);
  sh.cwd = home(cwd);
  const res = [];
  for (const line of lines) { const r = sh.run(line); res.push({ line, status: r.status, out: r.chunks.filter((c) => c.cls !== 'sys').map((c) => c.s).join(''), all: r.chunks.map((c) => c.s).join('') }); }
  return res;
}
function verifyCode(where, lang, code, output, cwd) {
  if (noExec) return;
  const res = runReal(lang, code, cwd);
  if (res.failed) { err(`${where}: ${lang} code failed to run: ${res.err.slice(-300)}`); return; }
  const got = res.out;
  const tabs = lang === 'bash';
  if (norm(got, tabs) !== norm(output, tabs)) err(`${where}: output differs from real ${lang}.\n--- real ---\n${norm(got, tabs)}\n--- written ---\n${norm(output, tabs)}` + (res.err.trim() ? `\n--- stderr ---\n${res.err.trim().slice(-300)}` : ''));
  if (lang === 'python' && res.err.trim()) err(`${where}: python wrote to stderr (an error or warning): ${res.err.trim().slice(-200)}`);
  if (lang === 'bash') {
    const sim = runSim([code.split('\n').join('\n')], cwd)[0];
    const simOut = norm(sim.out.split('\n').filter((l) => !l.startsWith('(BioBridge')).join('\n'), true);
    if (simOut !== norm(output, true)) err(`${where}: BioBridge's simulated shell prints something different, so the browser terminal would disagree.\n--- simulator ---\n${simOut}\n--- written ---\n${norm(output, true)}`);
  }
}

const seen = new Set();
let total = 0;
for (const f of files) {
  if (!fs.existsSync(path.resolve(ROOT, f))) { err(`${f}: file not found`); continue; }
  ctx.BB.companion = [];
  try { load(f); } catch (e) { err(`${f}: JavaScript error: ${e.message}`); continue; }
  const topics = ctx.BB.companion || [];
  if (!topics.length) err(`${f}: no topics pushed to BB.companion`);
  for (const [i, t] of topics.entries()) {
    total++;
    const w = `${path.basename(f)} ${t && t.id ? t.id : '#' + i}`;
    if (!t || !isStr(t.id)) { err(`${w}: missing id`); continue; }
    if (seen.has(t.id)) err(`${w}: duplicate id`);
    seen.add(t.id);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.id)) err(`${w}: id must be lowercase words joined by hyphens`);
    if (!['ibm', 'rice', 'kaust'].includes(t.course)) err(`${w}: course must be ibm, rice or kaust`);
    else if (!t.id.startsWith(t.course + '-')) err(`${w}: id must start with "${t.course}-"`);
    if (!ITEMS.items[t.module] || !String(t.module).startsWith(t.course + '-m')) err(`${w}: unknown module ${t.module}`);
    if (!isStr(t.title) || t.title.length > 60) err(`${w}: title missing or longer than 60 characters`);
    if (!Array.isArray(t.lectures) || t.lectures.length > 4) err(`${w}: lectures must be an array of 0 to 4 titles`);
    else {
      for (const l of t.lectures) if (!(ITEMS.items[t.module] || []).includes(l)) err(`${w}: "${l}" is not a public item title in ${t.module}`);
      if (!t.lectures.length && !isStr(t.about, 15)) err(`${w}: with no lectures, "about" must say where the idea appears`);
    }
    if (![2, 3, 4].includes(t.minutes)) err(`${w}: minutes must be 2, 3 or 4`);
    if (!Array.isArray(t.keywords) || t.keywords.length < 4 || t.keywords.length > 12) err(`${w}: keywords must have 4 to 12 entries`);
    const we = words(t.explain), wy = words(t.why);
    if (we < 40 || we > 120) err(`${w}: explain has ${we} words (45 to 110 wanted)`);
    if (wy < 18 || wy > 65) err(`${w}: why has ${wy} words (20 to 60 wanted)`);
    // visual
    const v = t.visual || {};
    if (v.diagram) { if (!diagramNames.has(v.diagram)) err(`${w}: unknown diagram ${v.diagram}`); }
    else if (v.widget) { if (!WIDGETS.has(v.widget)) err(`${w}: unknown widget ${v.widget}`); }
    else err(`${w}: visual needs a diagram or a widget`);
    // example
    const ex = t.example;
    if (!ex || !['bash', 'python', 'r', 'text'].includes(ex.lang) || !isStr(ex.code)) err(`${w}: example needs lang and code`);
    else {
      const codeLines = ex.code.split('\n').length, outLines = typeof ex.output === 'string' ? ex.output.split('\n').length : 0;
      if (codeLines > 12) err(`${w}: example code has ${codeLines} lines (at most 12)`);
      if (outLines > 15) err(`${w}: example output has ${outLines} lines (at most 15)`);
      if (!isStr(ex.note, 10) || words(ex.note) > 45) err(`${w}: example note missing or longer than 45 words`);
      if (ex.run && ex.lang !== 'python') err(`${w}: run is only for python`);
      if (ex.run && /\bimport\s+(pandas|numpy)|from\s+(pandas|numpy)/.test(ex.code)) err(`${w}: run cannot be used with pandas or NumPy (not loaded in the browser)`);
      if (['bash', 'python', 'r'].includes(ex.lang) && !ex.noVerify) {
        if (typeof ex.output !== 'string') err(`${w}: example output missing (or set noVerify with a note)`);
        else verifyCode(`${w}.example`, ex.lang, ex.code, ex.output, ex.cwd || '~/project/data');
      }
    }
    // try
    if (t.try) {
      const k = t.try.kind;
      if (k === 'terminal') {
        if (!isStr(t.try.start) || !isStr(t.try.task) || !Array.isArray(t.try.tries) || t.try.tries.length < 2 || t.try.tries.length > 5) err(`${w}: terminal try needs start, task and 2 to 5 tries`);
        else {
          const res = runSim(t.try.tries, t.try.start);
          for (const r of res) if (r.status !== 0 || /command not found|No such file|not simulated/i.test(r.all)) err(`${w}: terminal try "${r.line}" fails in the simulator (status ${r.status}): ${r.all.trim().slice(0, 160)}`);
        }
      } else if (k === 'mission') { if (!BB.missions[t.try.mission]) err(`${w}: unknown mission ${t.try.mission}`); }
      else if (k === 'trace') { if (!BB.pyPrograms[t.try.program]) err(`${w}: unknown trace program ${t.try.program}`); }
      else if (k === 'widget') { if (!WIDGETS.has(t.try.widget)) err(`${w}: unknown widget ${t.try.widget}`); }
      else if (k === 'python') {
        if (!isStr(t.try.code) || !isStr(t.try.task)) err(`${w}: python try needs code and task`);
        else if (/\bimport\s+(pandas|numpy)|from\s+(pandas|numpy)/.test(t.try.code)) err(`${w}: python try cannot use pandas or NumPy`);
        else if (!noExec) {
          const res = runReal('python', t.try.code, '~/project/data');
          const raised = res.failed || /Traceback|Error/.test(res.err);
          if (raised && !t.try.expectError) err(`${w}: python try raises an error (set expectError: true if that is the point): ${res.err.trim().slice(-160)}`);
          if (!raised && t.try.expectError) err(`${w}: expectError is set but the code runs without an error`);
        }
      } else if (k === 'computer') {
        if (!['r', 'python', 'bash'].includes(t.try.lang) || !isStr(t.try.task) || !isStr(t.try.code) || typeof t.try.output !== 'string') err(`${w}: computer try needs lang, task, code and output`);
        else verifyCode(`${w}.try`, t.try.lang, t.try.code, t.try.output, '~/project');
      } else err(`${w}: unknown try kind ${k}`);
    }
    if (t.mistake && (!isStr(t.mistake.wrong, 10) || !isStr(t.mistake.fix, 10) || words(t.mistake.wrong) > 55 || words(t.mistake.fix) > 55)) err(`${w}: mistake needs wrong and fix, each at most 50 words`);
    // check
    const c = t.check;
    if (!c || !isStr(c.q, 8) || words(c.q) > 45) err(`${w}: check question missing or over 40 words`);
    if (!c || !Array.isArray(c.options) || c.options.length < 3 || c.options.length > 4) err(`${w}: check needs 3 or 4 options`);
    else {
      c.options.forEach((o, j) => { if (!isStr(o.t) || !isStr(o.why, 12) || words(o.why) > 40) err(`${w}: check option ${j} needs t and a why of 12 to 35 words`); if (/^(correct|wrong|right|incorrect)\b/i.test(o.why || '')) err(`${w}: check option ${j} why must not start with Correct/Wrong`); });
      if (new Set(c.options.map((o) => o.t)).size !== c.options.length) err(`${w}: duplicate options`);
      if (!Number.isInteger(c.answer) || c.answer < 0 || c.answer >= c.options.length) err(`${w}: check answer index invalid`);
    }
    if (!Array.isArray(t.deeper) || t.deeper.length < 1 || t.deeper.length > 3) err(`${w}: deeper needs 1 to 3 lesson ids`);
    else for (const d of t.deeper) if (!BB.lessonMeta[d]) err(`${w}: unknown lesson ${d}`);
    // workload: read explain, why, mistake, question and options, glance at the example, look at the visual.
    const readWords = we + wy + words(t.mistake && t.mistake.wrong) + words(t.mistake && t.mistake.fix) + words(c && c.q) + (c && c.options ? c.options.reduce((s, o) => s + words(o.t), 0) + words(c.options[c.answer] && c.options[c.answer].why) : 0) + words(ex && ex.note);
    const exLines = ex ? ex.code.split('\n').length + (typeof ex.output === 'string' ? ex.output.split('\n').length : 0) : 0;
    const est = readWords / 160 + exLines * 4 / 60 + 0.75;
    t._est = est;
    if (est > 4.6) err(`${w}: estimated ${est.toFixed(1)} minutes (too long for a 2 to 4 minute topic)`);
    if (Math.abs(est - t.minutes) > 1.6) warn(`${w}: minutes says ${t.minutes} but the estimate is ${est.toFixed(1)}`);
    lint(w, t);
  }
  // course order: modules must not go backwards
  const mods = topics.map((t) => t.module);
  for (let i = 1; i < mods.length; i++) if (mods[i] < mods[i - 1]) err(`${f}: topic ${topics[i].id} is out of module order`);
  console.log(`${f}: ${topics.length} topics, estimated minutes ${topics.map((t) => (t._est || 0).toFixed(1)).join(' ')}`);
}
for (const m of warnings) console.log('warn:', m);
for (const m of errors) console.log('ERROR:', m);
console.log(errors.length ? `${errors.length} error(s) in ${total} topics` : `OK: ${total} topics, no errors`);
process.exit(errors.length ? 1 : 0);
