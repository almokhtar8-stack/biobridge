#!/usr/bin/env node
/* Replays every terminal mission's solution commands in BioBridge's simulated shell and checks each step passes.
   Editor steps (nano/vim) are simulated by saving the text the step's check expects. */
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { console, TextEncoder, Intl }; ctx.window = ctx; ctx.document = { createElement: () => ({}) }; vm.createContext(ctx);
const files = ['content/curriculum.js', 'content/vfs.js', 'content/missions-f1.js', 'content/missions-f3.js', 'js/core.js', 'js/text.js', 'js/shell.js'];
for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
// load only the checker from terminal.js (it needs BB.h at load time, which core.js provides)
vm.runInContext('BB.widgets = BB.widgets || {};', ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/widgets/terminal.js'), 'utf8'), ctx, { filename: 'terminal.js' });
const BB = ctx.BB;
let fails = 0, steps = 0;
for (const [id, m] of Object.entries(BB.missions)) {
  const sh = new BB.Shell(BB.vfs);
  if (m.start) sh.cwd = m.start;
  m.steps.forEach((s, i) => {
    steps++;
    if (!s.solution) { console.log(`NO SOLUTION ${id} step ${i + 1}`); fails++; return; }
    let ok = false, res, outs = '';
    for (const line of s.solution.split('\n')) {
      res = sh.run(line);
      outs += res.chunks.map((c) => c.s).join('');
      if (res.edit) {
        const want = s.editorAppend || (s.check.fileIncludes && s.check.fileIncludes.text);
        if (!s.editorAppend) console.log(`note: ${id} step ${i + 1} has no editorAppend; simulating with the checked text`);
        if (res.edit.crontab) sh.crontab = (want || '0 2 * * * /home/student/backup.sh') + '\n';
        else sh.writeFile(res.edit.path, (res.edit.content || '') + (want ? want + '\n' : ''), false, 'nano');
      }
      ok = BB.checkMissionStep(s.check, res, sh, line);
      if (ok) break;
    }
    if (!ok) { fails++; console.log(`FAIL ${id} step ${i + 1}: ${s.solution}\n  check: ${JSON.stringify(s.check)}\n  status: ${res.status} cwd: ${sh.cwd}\n  output: ${outs.slice(0, 600).replace(/\n/g, '\n          ')}`); }
  });
}
console.log(`\n${steps - fails}/${steps} mission steps pass with their solution in the simulator`);
process.exit(fails ? 1 : 0);
