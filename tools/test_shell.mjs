#!/usr/bin/env node
/* Differential test: run command lines in BioBridge's simulated shell and in real bash (inside a pty, in a copy of the
   same virtual file system) and report any difference in what the learner would see.
   Usage: node tools/test_shell.mjs [--verbose]   (needs python3 and the `script` utility) */
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { console, TextEncoder, Intl, Date, setTimeout }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['content/curriculum.js', 'content/vfs.js', 'js/shell.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const BB = ctx.BB;
const CASES = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/shell_cases.json'), 'utf8'));
const verbose = process.argv.includes('--verbose');
const strip = (s) => s.replace(/\r\n/g, '\n').split('\n').filter((l) => !l.startsWith('(BioBridge')).map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
let fails = 0;
for (const c of CASES) {
  const cmds = Array.isArray(c) ? c : [c];
  const sh = new BB.Shell(BB.vfs);
  sh.cwd = '/home/student/project/data';
  let sim = '';
  for (const line of cmds) { const r = sh.run(line); sim += r.chunks.filter((x) => x.cls !== 'sys').map((x) => x.s).join(''); }
  let real = '';
  try { real = execFileSync('python3', [path.join(ROOT, 'tools/run_in_vfs.py'), 'bash', cmds.join('\n')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { real = (e.stdout || '') + ''; }
  real = real.replace(/\/tmp\/bbvfs_[a-z0-9_]+/g, '').replace(/^\/tmp\/bbvfs_[^:]*\/job\.sh: line \d+: /gm, 'bash: ');
  const A = strip(sim), B = strip(real.replace(/^.*job\.sh: line \d+: /gm, 'bash: '));
  if (A !== B) { fails++; console.log(`\nMISMATCH: ${cmds.join(' ; ')}\n--- simulator ---\n${A}\n--- real bash ---\n${B}`); }
  else if (verbose) console.log('ok:', cmds.join(' ; '));
}
console.log(`\n${CASES.length - fails}/${CASES.length} command lines match real bash`);
process.exit(fails ? 1 : 0);
