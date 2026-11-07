#!/usr/bin/env node
/* BioBridge content validator.
   Usage:  node tools/validate.mjs            (checks everything, writes tools/out/content.json and tools/out/verify_jobs.json)
           node tools/validate.mjs --quiet
   Exit code 1 if any error is found. Then run: python3 tools/verify_code.py  (executes code examples with real Python, R and Bash). */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quiet = process.argv.includes('--quiet');
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);

// Load content files in the same order as index.html
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const contentFiles = [...html.matchAll(/<script src="(content\/[^"]+\.js)"/g)].map((m) => m[1]);
const ctx = { window: {}, console };
ctx.window.window = ctx.window;
vm.createContext(ctx);
for (const f of contentFiles) {
  if (!fs.existsSync(path.join(ROOT, f))) { warn(`${f}: listed in index.html but missing`); continue; }
  const code = fs.readFileSync(path.join(ROOT, f), 'utf8');
  try { vm.runInContext(code.replace(/^window\.BB = window\.BB \|\| \{\};/m, 'var BB = window.BB = window.BB || {};'), ctx, { filename: f }); }
  catch (e) { err(`${f}: JavaScript error: ${e.message}`); }
}
// also allow files that use BB without var declaration
const BB = ctx.window.BB || ctx.BB;
if (!BB) { console.error('BB namespace not found'); process.exit(1); }

const lessonMeta = BB.lessonMeta || {};
const objectives = BB.objectives || {};
const allMods = new Set(Object.values(BB.courses || {}).flatMap((c) => c.modules.map((m) => m.id)));
const WIDGETS = new Set(['dogma', 'expression', 'filetree', 'journey', 'datatable', 'normalization', 'countmatrix', 'rnaseq', 'pvalues', 'singlecell', 'fastq', 'log2', 'variability', 'cron', 'methods', 'pyrun', 'scale', 'correlation', 'design']);
const BANNED = [/\bleverag(e|es|ed|ing)\b/i, /\brobust(ly|ness)?\b/i, /\bseamless(ly)?\b/i, /\belevat(e|es|ed|ing)\b/i, /lorem ipsum/i, /\bTODO\b/, /\bTBD\b/];

function lintText(where, s) {
  if (typeof s !== 'string') return;
  if (s.includes('—')) err(`${where}: contains an em dash`);
  if (s.includes('–')) err(`${where}: contains an en dash (use "to" or a hyphen)`);
  for (const re of BANNED) if (re.test(s)) err(`${where}: banned word/pattern ${re}`);
}
function lintDeep(where, obj) {
  if (typeof obj === 'string') return lintText(where, obj);
  if (Array.isArray(obj)) return obj.forEach((x, i) => lintDeep(`${where}[${i}]`, x));
  if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) lintDeep(`${where}.${k}`, v);
}
const isStr = (s, min = 1) => typeof s === 'string' && s.trim().length >= min;
const jobs = [];

function checkMcq(where, q, { requireLevel = false } = {}) {
  if (!isStr(q.q, 8)) err(`${where}: question text missing`);
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 5) err(`${where}: needs 2 to 5 options`);
  else {
    q.options.forEach((o, i) => {
      if (!o || !isStr(o.t)) err(`${where}: option ${i} missing text`);
      if (!o || !isStr(o.why, 12)) err(`${where}: option ${i} missing a "why" explanation`);
    });
    const texts = q.options.map((o) => (o.t || '').trim());
    if (new Set(texts).size !== texts.length) err(`${where}: duplicate option texts`);
  }
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options || []).length) err(`${where}: answer index invalid`);
  if (requireLevel && ![1, 2, 3].includes(q.level)) err(`${where}: level must be 1, 2 or 3`);
  if (q.code) {
    if (!['python', 'bash', 'r', 'text', 'fasta', 'fastq', 'tsv'].includes(q.code.lang)) err(`${where}: code.lang invalid`);
    if (!isStr(q.code.src)) err(`${where}: code.src empty`);
  }
  if (q.verify) {
    if (!q.code) err(`${where}: verify needs code`);
    else if (!['python', 'r', 'bash'].includes(q.code.lang)) err(`${where}: verify only for python, r, bash`);
    else jobs.push({ where, lang: q.code.lang, src: q.code.src, expect: q.options[q.answer] && q.options[q.answer].t, mode: q.verify.mode || 'stdout', cwd: q.verify.cwd || null, others: q.options.filter((_, i) => i !== q.answer).map((o) => o.t) });
  }
}

// ---------- lessons
const seenLessons = new Set();
for (const [i, L] of (BB.lessons || []).entries()) {
  const w = `lesson ${L && L.id ? L.id : '#' + i}`;
  if (!L || !L.id) { err(`${w}: missing id`); continue; }
  if (seenLessons.has(L.id)) err(`${w}: duplicate lesson id`);
  seenLessons.add(L.id);
  if (!lessonMeta[L.id]) err(`${w}: id not in curriculum lessonMeta`);
  for (const k of ['what', 'problem', 'care', 'real']) if (!isStr(L[k], 20)) err(`${w}: field "${k}" missing or too short`);
  if (!Array.isArray(L.steps) || L.steps.length < 3 || L.steps.length > 6) err(`${w}: steps must have 3 to 6 items`);
  if (!L.show || !isStr(L.show.code) || !Array.isArray(L.show.notes) || L.show.notes.length < 1) err(`${w}: show needs code and notes`);
  else {
    const lang = L.show.lang;
    if (!['python', 'bash', 'r', 'text', 'fasta', 'fastq', 'tsv'].includes(lang)) err(`${w}: show.lang invalid`);
    if (['python', 'r', 'bash'].includes(lang) && typeof L.show.output === 'string' && !L.show.noVerify)
      jobs.push({ where: `${w}.show`, lang, src: L.show.code, expect: L.show.output, mode: 'stdout', cwd: L.show.cwd || null, others: [] });
  }
  if (!L.pitfall || !isStr(L.pitfall.wrong) || !isStr(L.pitfall.right)) err(`${w}: pitfall needs wrong and right`);
  if (!Array.isArray(L.check) || L.check.length < 2 || L.check.length > 4) err(`${w}: check needs 2 to 4 questions`);
  else L.check.forEach((q, j) => checkMcq(`${w}.check[${j}]`, q));
  if (!L.teach || !isStr(L.teach.prompt) || !Array.isArray(L.teach.points) || L.teach.points.length < 2) err(`${w}: teach needs prompt and 2+ points`);
  if (L.try) {
    const t = L.try;
    if (t.kind === 'terminal') { if (!BB.missions[t.mission]) err(`${w}: unknown mission ${t.mission}`); }
    else if (t.kind === 'trace') { if (!BB.pyPrograms[t.program]) err(`${w}: unknown trace program ${t.program}`); }
    else if (t.kind === 'widget') { if (!WIDGETS.has(t.widget)) err(`${w}: unknown widget ${t.widget}`); }
    else if (t.kind === 'parsons') {
      if (!Array.isArray(t.lines) || t.lines.length < 3) err(`${w}: parsons needs 3+ lines`);
      else if (new Set(t.lines).size !== t.lines.length) err(`${w}: parsons lines must be unique`);
      if (!isStr(t.prompt)) err(`${w}: parsons needs a prompt`);
      if (t.verify && ['python', 'r', 'bash'].includes(t.lang) && typeof t.output === 'string') jobs.push({ where: `${w}.try(parsons)`, lang: t.lang, src: t.lines.join('\n'), expect: t.output, mode: 'stdout', cwd: t.cwd || null, others: [] });
    }
    else if (t.kind === 'debug') {
      if (!isStr(t.code) || !Array.isArray(t.options) || !isStr(t.error) || !isStr(t.fixed)) err(`${w}: debug needs code, error, options, fixed`);
      else {
        checkMcq(`${w}.try(debug)`, { q: t.prompt || 'Find the bug', options: t.options, answer: t.answer });
        if ((t.lang || 'python') === 'python') {
          jobs.push({ where: `${w}.try(debug).code`, lang: 'python', src: t.code, expect: t.error, mode: 'error', cwd: null, others: [] });
          if (typeof t.fixedOutput === 'string') jobs.push({ where: `${w}.try(debug).fixed`, lang: 'python', src: t.fixed, expect: t.fixedOutput, mode: 'stdout', cwd: null, others: [] });
        }
      }
    }
    else if (t.kind === 'predict') { checkMcq(`${w}.try(predict)`, t); }
    else err(`${w}: unknown try.kind ${t.kind}`);
  }
  lintDeep(w, L);
}
for (const id of Object.keys(lessonMeta)) if (!seenLessons.has(id)) warn(`lesson ${id}: in curriculum but no content yet`);
for (const [id, m] of Object.entries(lessonMeta)) {
  for (const o of m.obj) if (!objectives[o]) err(`lessonMeta ${id}: unknown objective ${o}`);
  for (const c of m.courses) if (!allMods.has(c)) err(`lessonMeta ${id}: unknown course module ${c}`);
  for (const p of m.pre) if (!lessonMeta[p]) err(`lessonMeta ${id}: unknown prerequisite ${p}`);
  lintText(`lessonMeta ${id}.title`, m.title);
}

// ---------- practice questions
const seenQ = new Set();
const perObj = {};
for (const [i, q] of (BB.questions || []).entries()) {
  const w = `question ${q && q.id ? q.id : '#' + i}`;
  if (!q || !q.id) { err(`${w}: missing id`); continue; }
  if (seenQ.has(q.id)) err(`${w}: duplicate id`);
  seenQ.add(q.id);
  if (!Array.isArray(q.obj) || !q.obj.length) err(`${w}: obj missing`);
  else for (const o of q.obj) { if (!objectives[o]) err(`${w}: unknown objective ${o}`); perObj[o] = (perObj[o] || 0) + 1; }
  if (q.lesson && !lessonMeta[q.lesson]) err(`${w}: unknown lesson ${q.lesson}`);
  if (!isStr(q.explain, 15)) err(`${w}: explain missing`);
  checkMcq(w, q, { requireLevel: true });
  lintDeep(w, q);
}

// ---------- glossary
const seenTerms = new Set();
for (const [i, g] of (BB.glossary || []).entries()) {
  const w = `glossary ${g && g.term ? g.term : '#' + i}`;
  if (!g || !isStr(g.term)) { err(`${w}: term missing`); continue; }
  const k = g.term.toLowerCase();
  if (seenTerms.has(k)) err(`${w}: duplicate term`);
  seenTerms.add(k);
  if (!isStr(g.def, 15)) err(`${w}: def missing`);
  if (!isStr(g.why, 10)) err(`${w}: why missing`);
  if (g.lesson && !lessonMeta[g.lesson]) err(`${w}: unknown lesson ${g.lesson}`);
  lintDeep(w, g);
}

// ---------- missions
const CHECK_KEYS = new Set(['cmd', 'pipeline', 'args', 'outputIncludes', 'outputEquals', 'outputRegex', 'cwd', 'exists', 'notExists', 'fileIncludes', 'executable', 'allowFail', 'any']);
for (const [id, m] of Object.entries(BB.missions || {})) {
  const w = `mission ${id}`;
  if (!isStr(m.title) || !isStr(m.intro) || !Array.isArray(m.steps) || !m.steps.length) err(`${w}: needs title, intro, steps`);
  (m.steps || []).forEach((s, j) => {
    if (!isStr(s.goal) || !isStr(s.hint) || !s.check) err(`${w}.steps[${j}]: needs goal, hint, check`);
    else for (const k of Object.keys(s.check)) if (!CHECK_KEYS.has(k)) err(`${w}.steps[${j}]: unknown check key ${k}`);
    if (!isStr(s.explain, 10)) err(`${w}.steps[${j}]: explain missing`);
    if (s.solution && typeof s.solution !== 'string') err(`${w}.steps[${j}]: solution must be a string`);
  });
  lintDeep(w, m);
}

// ---------- python trace programs
for (const [id, p] of Object.entries(BB.pyPrograms || {})) {
  if (!isStr(p.title) || !isStr(p.code)) err(`pyProgram ${id}: needs title and code`);
  lintDeep(`pyProgram ${id}`, p);
}
if (BB.pyTraces) for (const id of Object.keys(BB.pyPrograms || {})) if (!BB.pyTraces[id]) err(`pyProgram ${id}: no trace built (run python3 tools/build_traces.py)`);

// ---------- method scenarios, generators metadata, misc
for (const [i, s] of (BB.scenarios || []).entries()) { checkMcq(`scenario #${i}`, s); lintDeep(`scenario #${i}`, s); }

// ---------- coverage summary
const objWithLessons = new Set(Object.values(lessonMeta).flatMap((m) => m.obj));
for (const o of Object.keys(objectives)) {
  if (!objWithLessons.has(o)) warn(`objective ${o}: no lesson`);
  if (!perObj[o] && (BB.questions || []).length) warn(`objective ${o}: no practice questions`);
}

fs.mkdirSync(path.join(ROOT, 'tools/out'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'tools/out/verify_jobs.json'), JSON.stringify(jobs, null, 1));
fs.writeFileSync(path.join(ROOT, 'tools/out/content.json'), JSON.stringify({ vfs: BB.vfs, pyPrograms: BB.pyPrograms, lessonMeta, objectives }, null, 1));

if (!quiet) {
  console.log(`lessons: ${(BB.lessons || []).length}/${Object.keys(lessonMeta).length}  questions: ${(BB.questions || []).length}  glossary: ${(BB.glossary || []).length}  missions: ${Object.keys(BB.missions || {}).length}  programs: ${Object.keys(BB.pyPrograms || {}).length}  code jobs: ${jobs.length}`);
  const byF = {};
  for (const q of BB.questions || []) { const f = (objectives[q.obj?.[0]] || {}).f; byF[f] = (byF[f] || 0) + 1; }
  console.log('questions per foundation:', JSON.stringify(byF));
  for (const w of warnings) console.log('warn:', w);
}
for (const e of errors) console.log('ERROR:', e);
console.log(errors.length ? `${errors.length} error(s)` : 'OK: no errors');
process.exit(errors.length ? 1 : 0);
