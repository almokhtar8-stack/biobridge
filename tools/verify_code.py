#!/usr/bin/env python3
"""Execute every verifiable code example and compare it with the answer BioBridge shows.

Run after:  node tools/validate.mjs
Then:       python3 tools/verify_code.py

- Python examples run with the local python3 (isolated mode).
- R examples run with Rscript.
- Bash examples run with real bash inside a pseudo-terminal, in a temporary copy of the
  BioBridge virtual file system (so `ls` prints columns exactly as in a terminal).
Each job's working directory defaults to ~/project/data unless the item sets verify.cwd / show.cwd.
"""
import json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
jobs = json.load(open(os.path.join(ROOT, "tools/out/verify_jobs.json")))
content = json.load(open(os.path.join(ROOT, "tools/out/content.json")))
vfs = content["vfs"]

def materialise(base):
    for d in vfs["dirs"]:
        os.makedirs(base + d, exist_ok=True)
    for p, f in vfs["files"].items():
        os.makedirs(os.path.dirname(base + p), exist_ok=True)
        with open(base + p, "w") as fh:
            fh.write(f["c"])
        os.chmod(base + p, int(f.get("mode", "644"), 8))

def norm(s, tabs=False):
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    if tabs:
        s = "\n".join(ln.expandtabs(8) for ln in s.split("\n"))
    lines = [ln.rstrip() for ln in s.split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines)

def run(job, base):
    home = base + vfs["home"]
    cwd = job.get("cwd") or "~/project/data"
    cwd = cwd.replace("~", home, 1) if cwd.startswith("~") else base + cwd
    env = dict(os.environ, HOME=home, USER="student", LOGNAME="student", LC_ALL="C", COLUMNS="80", LINES="40", TERM="dumb", TABSIZE="0", PYTHONHASHSEED="0")
    lang = job["lang"]
    with tempfile.NamedTemporaryFile("w", suffix={"python": ".py", "r": ".R", "bash": ".sh"}[lang], delete=False, dir=base) as fh:
        fh.write(job["src"] + "\n")
        script = fh.name
    try:
        if lang == "python":
            p = subprocess.run([sys.executable, "-I", script], cwd=cwd, env=env, capture_output=True, text=True, timeout=20)
            return p.returncode, p.stdout, p.stderr
        if lang == "r":
            p = subprocess.run(["Rscript", "--vanilla", script], cwd=cwd, env=env, capture_output=True, text=True, timeout=60)
            return p.returncode, p.stdout, p.stderr
        # bash inside a pty so ls/columns behave like an interactive terminal
        inner = f"cd '{cwd}' && stty cols 80 2>/dev/null; bash --norc --noprofile '{script}'"
        p = subprocess.run(["script", "-qec", inner, "/dev/null"], env=env, capture_output=True, text=True, timeout=30)
        return p.returncode, p.stdout, p.stderr
    finally:
        os.unlink(script)

failures = 0
results = []
for job in jobs:
    base = tempfile.mkdtemp(prefix="bbvfs_")
    try:
        materialise(base)
        code, out, errtxt = run(job, base)
    except subprocess.TimeoutExpired:
        code, out, errtxt = -1, "", "TIMEOUT"
    finally:
        shutil.rmtree(base, ignore_errors=True)
    expect = job["expect"] or ""
    ok = False
    detail = ""
    if job.get("mode") == "error":
        last = (errtxt.strip().splitlines() or [""])[-1]
        exc = last.split(":")[0].strip()
        ok = code != 0 and exc and exc in expect
        detail = f"stderr last line: {last!r}"
    else:
        tabs = job["lang"] == "bash"
        ok = norm(out, tabs) == norm(expect, tabs)
        detail = f"got:\n{norm(out, tabs)}\n--- expected:\n{norm(expect, tabs)}" + (f"\n--- stderr:\n{errtxt.strip()[-400:]}" if errtxt.strip() else "")
        if ok:
            for o in job.get("others", []):
                if norm(o, tabs) == norm(out, tabs):
                    ok = False
                    detail = f"ambiguous: a wrong option equals the real output {o!r}"
    results.append({"where": job["where"], "ok": bool(ok)})
    if not ok:
        failures += 1
        print(f"FAIL {job['where']} [{job['lang']}]\n{detail}\n")

print(f"{len(jobs) - failures}/{len(jobs)} code examples verified by execution")
os.makedirs(os.path.join(ROOT, "tools/out"), exist_ok=True)
json.dump(results, open(os.path.join(ROOT, "tools/out/verify_results.json"), "w"), indent=1)
sys.exit(1 if failures else 0)
