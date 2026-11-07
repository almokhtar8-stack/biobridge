/* Checks BioBridge's in-browser statistics (Welch t-test p-values, BH, Pearson) against SciPy reference values. */
import fs from 'node:fs'; import vm from 'node:vm'; import { execFileSync } from 'node:child_process';
const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext('window.BB = window.BB || {}; BB.widgets = {};', ctx);
for (const f of ['js/core.js', 'js/widgets/stats.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
const S = ctx.BB.stats;
const cases = [[[1, 2, 3], [4, 5, 7]], [[10.1, 9.8, 10.4], [10.0, 10.3, 9.9]], [[1, 1.1, 0.9, 1.2], [3, 2.5, 2.8, 3.3, 2.9]], [[5, 6, 7], [50, 60, 75]], [[0.1, 0.2, 0.15], [0.12, 0.25, 0.18]]];
const ref = JSON.parse(execFileSync('python3', ['-c', `
import json
from scipy import stats
cases=${JSON.stringify(cases)}
out=[float(stats.ttest_ind(b,a,equal_var=False).pvalue) for a,b in cases]
import numpy as np
from scipy.stats import false_discovery_control
ps=[0.01,0.04,0.03,0.2,0.5,0.001]
out.append([float(x) for x in false_discovery_control(ps)])
x=[1,2,3,4,5,6];y=[2,4.1,5.9,8.2,9.8,12.5]
out.append([float(np.corrcoef(x,y)[0,1])])
print(json.dumps(out))`], { encoding: 'utf8' }));
let bad = 0;
cases.forEach((c, i) => { const p = S.welch(c[0], c[1]).p; const ok = Math.abs(p - ref[i]) < 1e-9 * Math.max(1, ref[i]) || Math.abs(p - ref[i]) / ref[i] < 1e-6; if (!ok) bad++; console.log(ok ? 'ok ' : 'BAD', 'welch', p, ref[i]); });
const bhJs = S.bh([0.01, 0.04, 0.03, 0.2, 0.5, 0.001]);
bhJs.forEach((v, i) => { const ok = Math.abs(v - ref[cases.length][i]) < 1e-12; if (!ok) bad++; });
console.log('BH', bhJs.map((v) => v.toFixed(4)).join(','), 'vs', ref[cases.length].map((v) => v.toFixed(4)).join(','));
const r = S.pearson([1, 2, 3, 4, 5, 6], [2, 4.1, 5.9, 8.2, 9.8, 12.5]).r;
if (Math.abs(r - ref[cases.length + 1][0]) > 1e-12) bad++;
console.log('pearson', r, ref[cases.length + 1][0]);
console.log(bad ? `${bad} mismatches` : 'all statistics match SciPy');
process.exit(bad ? 1 : 0);
