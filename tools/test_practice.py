#!/usr/bin/env python3
"""Test the downloadable practice project and every command on the Practice files page.

1. The committed ZIP is up to date and reproducible (rebuilt bytes are identical).
2. The ZIP holds exactly the browser terminal's ~/project files, with the same contents and permissions.
3. Every command in content/practice-files.js, run in order from the project folder, prints exactly the
   documented output in real Bash on the extracted ZIP AND in BioBridge's simulated shell.
4. Every challenge (each in a fresh copy) does the same.
5. The R and pandas snippets print the documented output when run from the project folder.
Usage: python3 tools/test_practice.py
"""
import json, os, re, shutil, subprocess, sys, tempfile, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIP = os.path.join(ROOT, "assets", "downloads", "biobridge-practice.zip")
sys.path.insert(0, os.path.join(ROOT, "tools"))
results = []

def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    print(("PASS " if ok else "FAIL ") + name + ("" if ok or not detail else "\n" + detail))

def load_js_object(path, var):
    js = f"""
const fs=require('fs');const vm=require('vm');const ctx={{}};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync({json.dumps(path)},'utf8'),ctx);process.stdout.write(JSON.stringify(ctx.window.BB.{var}));"""
    return json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)

def expand(s):
    out = []
    for line in s.replace("\r\n", "\n").split("\n"):
        o = ""
        for ch in line:
            o += " " * (8 - len(o) % 8) if ch == "\t" else ch
        out.append(o.rstrip())
    while out and out[-1] == "":
        out.pop()
    return "\n".join(out)

def extract(dest):
    with zipfile.ZipFile(ZIP) as z:
        z.extractall(dest)
        for zi in z.infolist():
            mode = (zi.external_attr >> 16) & 0o777
            if mode:
                os.chmod(os.path.join(dest, zi.filename), mode)
    return os.path.join(dest, "biobridge-practice")

def run_real(cmds, locale="C"):
    base = tempfile.mkdtemp(prefix="bbzip_")
    proj = extract(base)
    env = dict(os.environ, LC_ALL=locale, LANG=locale, COLUMNS="80", TERM="dumb", TABSIZE="0", HOME=base)
    outs = []
    try:
        for c in cmds:
            p = subprocess.run(["script", "-qec", f"cd '{proj}' && stty cols 80 2>/dev/null; bash --norc --noprofile -c {json.dumps(c)}", "/dev/null"], env=env, capture_output=True, text=True, timeout=60)
            txt = p.stdout.replace("\r\n", "\n").replace(proj + "/", "")
            txt = re.sub(r"^bash: line \d+: ", "bash: ", txt, flags=re.M)
            outs.append(expand(txt))
    finally:
        shutil.rmtree(base, ignore_errors=True)
    return outs

def run_sim(cmds):
    js = """
global.window=global; window.BB={}; require(%s); require(%s);
const cmds=JSON.parse(process.argv[1]); const sh=new BB.Shell(BB.vfs); sh.cwd='/home/student/project';
const out=cmds.map(c=>{const r=sh.run(c);return r.chunks.filter(x=>x.cls!=='sys').map(x=>x.s).join('').split('\\n').filter(l=>!l.startsWith('(BioBridge')).join('\\n');});
process.stdout.write(JSON.stringify(out));""" % (json.dumps(os.path.join(ROOT, "content/vfs.js")), json.dumps(os.path.join(ROOT, "js/shell.js")))
    return [expand(x) for x in json.loads(subprocess.run(["node", "-e", js, json.dumps(cmds)], capture_output=True, text=True, check=True).stdout)]

# 1. up to date and reproducible
from build_practice_zip import build  # noqa: E402
tmp = tempfile.mkdtemp()
try:
    rebuilt = os.path.join(tmp, "x.zip")
    build(rebuilt)
    check("ZIP is up to date (rebuilding gives identical bytes)", open(rebuilt, "rb").read() == open(ZIP, "rb").read(), "run: python3 tools/build_practice_zip.py")
finally:
    shutil.rmtree(tmp)

# 2. same files as the browser terminal
vfs = load_js_object(os.path.join(ROOT, "content/vfs.js"), "vfs")
basep = vfs["home"] + "/project/"
want = {p[len(basep):]: f for p, f in vfs["files"].items() if p.startswith(basep)}
with zipfile.ZipFile(ZIP) as z:
    names = [n for n in z.namelist() if not n.endswith("/")]
    got = {n[len("biobridge-practice/"):]: (z.read(n).decode(), (z.getinfo(n).external_attr >> 16) & 0o777) for n in names}
    dirs = sorted(n for n in z.namelist() if n.endswith("/"))
check("ZIP has exactly the simulator's project files", sorted(got) == sorted(want), f"zip: {sorted(got)}\nvfs: {sorted(want)}")
check("file contents match byte for byte", all(got[k][0] == want[k]["c"] for k in want if k in got))
check("permissions match (count_seqs.sh 644, line_report.sh 755)", all(got[k][1] == int(want[k].get("mode", "644"), 8) for k in want if k in got))
check("folders data/, scripts/ and an empty results/ exist", {"biobridge-practice/data/", "biobridge-practice/scripts/", "biobridge-practice/results/"} <= set(dirs))
check("README starts with the project title", got.get("README.txt", ("",))[0].startswith("Heat-shock RNA-seq practice project"))
check("only LF line endings", all("\r" not in c for c, _ in got.values()))
check("ZIP is small (under 20 KB)", os.path.getsize(ZIP) < 20000, str(os.path.getsize(ZIP)))

# 3. commands in order
pf = load_js_object(os.path.join(ROOT, "content/practice-files.js"), "practiceFiles")
cmds = [c["cmd"] for c in pf["commands"]]
real, sim = run_real(cmds), run_sim(cmds)
for c, r, s in zip(pf["commands"], real, sim):
    exp = expand(c["out"])
    check(f"real bash: {c['cmd']}", r == exp, f"--- real ---\n{r}\n--- documented ---\n{exp}")
    check(f"simulator: {c['cmd']}", s == exp, f"--- simulator ---\n{s}\n--- documented ---\n{exp}")

# 4. challenges, each in a fresh copy
for ch in pf["challenges"]:
    r, s, exp = run_real([ch["cmd"]])[0], run_sim([ch["cmd"]])[0], expand(ch["out"])
    check(f"challenge real bash: {ch['cmd']}", r == exp, f"--- real ---\n{r}\n--- documented ---\n{exp}")
    check(f"challenge simulator: {ch['cmd']}", s == exp, f"--- simulator ---\n{s}\n--- documented ---\n{exp}")

# 5. R and pandas snippets
base = tempfile.mkdtemp(prefix="bbzip_")
try:
    proj = extract(base)
    p = subprocess.run(["Rscript", "--vanilla", "-e", pf["rCode"]["code"]], cwd=proj, capture_output=True, text=True, timeout=60)
    check("R snippet output", expand(p.stdout) == expand(pf["rCode"]["out"]), p.stdout + p.stderr)
    p = subprocess.run([sys.executable, "-I", "-c", pf["pyCode"]["code"]], cwd=proj, capture_output=True, text=True, timeout=60)
    check("pandas snippet output", expand(p.stdout) == expand(pf["pyCode"]["out"]), p.stdout + p.stderr)
finally:
    shutil.rmtree(base, ignore_errors=True)

# locale robustness (most students do not use the C locale)
loc = "C.UTF-8"
real_utf = run_real(cmds, loc)
check(f"outputs are the same under {loc}", real_utf == real, "\n".join(f"{c}: {a!r} vs {b!r}" for c, a, b in zip(cmds, real_utf, real) if a != b))

passed = sum(ok for _, ok in results)
print(f"\n{passed}/{len(results)} practice-file checks passed")
sys.exit(0 if passed == len(results) else 1)
