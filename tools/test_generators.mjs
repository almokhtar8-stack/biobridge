#!/usr/bin/env node
/* Generates many variants of every question generator and checks:
   - structure (3+ unique options, answer present, every option explained, no em/en dashes)
   - for Python/R/Bash generators, the keyed answer equals the real interpreter's output (via tools/verify_code.py).
   Usage: node tools/test_generators.mjs [variantsPerGenerator=40] */
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const N = +(process.argv[2] || 40);
const ctx = { console, TextEncoder, Intl }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['content/curriculum.js', 'js/core.js', 'js/text.js', 'js/widgets/biology.js', 'js/generators.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const BB = ctx.BB;
let problems = 0; const jobs = []; const counts = {};
for (const g of BB.generators) {
  counts[g.key] = 0;
  for (let i = 0; i < N; i++) {
    const q = BB.generate(g.key, 1000 + i * 31);
    if (!q) { problems++; console.log('NULL', g.key, i); continue; }
    counts[g.key]++;
    const texts = q.options.map((o) => o.t);
    if (new Set(texts).size !== texts.length) { problems++; console.log('DUP', g.key, texts); }
    if (q.options.length < 3) { problems++; console.log('FEW', g.key); }
    if (q.options.some((o) => !o.why || o.why.length < 10)) { problems++; console.log('WHY', g.key); }
    if (/[–—]/.test(JSON.stringify(q))) { problems++; console.log('DASH', g.key); }
    if (g.verify) {
      const src = q.verifySrc || q.code.src;
      jobs.push({ where: `${g.key}#${i}`, lang: g.verify, src, expect: q.options[0].t, mode: 'stdout', cwd: q.verifyCwd || null, others: q.options.slice(1).map((o) => o.t) });
    }
  }
}
fs.mkdirSync(path.join(ROOT, 'tools/out'), { recursive: true });
const jobFile = path.join(ROOT, 'tools/out/verify_jobs.json');
const backup = fs.existsSync(jobFile) ? fs.readFileSync(jobFile, 'utf8') : null;
fs.writeFileSync(jobFile, JSON.stringify(jobs));
let execOk = true;
try { const out = execFileSync('python3', [path.join(ROOT, 'tools/verify_code.py')], { encoding: 'utf8' }); console.log(out.trim().split('\n').slice(-1)[0]); }
catch (e) { execOk = false; console.log((e.stdout || '').split('\n').slice(0, 60).join('\n')); }
finally { if (backup != null) fs.writeFileSync(jobFile, backup); }
console.log(`generators: ${BB.generators.length}, variants: ${Object.values(counts).reduce((a, b) => a + b, 0)}, executed checks: ${jobs.length}, structural problems: ${problems}`);
process.exit(problems || !execOk ? 1 : 0);
