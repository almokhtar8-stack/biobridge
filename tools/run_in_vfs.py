#!/usr/bin/env python3
"""Run code inside a fresh copy of BioBridge's virtual file system and print exactly what verify_code.py would see.

Examples:
  python3 tools/run_in_vfs.py bash 'ls; wc -l counts.tsv'
  python3 tools/run_in_vfs.py bash 'cd ..; ls -R' --cwd '~/project'
  python3 tools/run_in_vfs.py python 'print(open("samples.tsv").readline())'
  python3 tools/run_in_vfs.py r 'x <- c(3, 7, 10); print(x[2])'
(Run `node tools/validate.mjs --quiet` first so tools/out/content.json exists.)
"""
import argparse, json, os, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("lang", choices=["bash", "python", "r"])
ap.add_argument("code")
ap.add_argument("--cwd", default="~/project/data")
a = ap.parse_args()
vfs = json.load(open(os.path.join(ROOT, "tools/out/content.json")))["vfs"]
base = tempfile.mkdtemp(prefix="bbvfs_")
try:
    for d in vfs["dirs"]:
        os.makedirs(base + d, exist_ok=True)
    for p, f in vfs["files"].items():
        with open(base + p, "w") as fh:
            fh.write(f["c"])
        os.chmod(base + p, int(f.get("mode", "644"), 8))
    home = base + vfs["home"]
    cwd = a.cwd.replace("~", home, 1) if a.cwd.startswith("~") else base + a.cwd
    env = dict(os.environ, HOME=home, USER="student", LOGNAME="student", LC_ALL="C", COLUMNS="80", TERM="dumb", TABSIZE="0")
    ext = {"bash": ".sh", "python": ".py", "r": ".R"}[a.lang]
    script = os.path.join(base, "job" + ext)
    open(script, "w").write(a.code + "\n")
    if a.lang == "python":
        p = subprocess.run([sys.executable, "-I", script], cwd=cwd, env=env, capture_output=True, text=True)
    elif a.lang == "r":
        p = subprocess.run(["Rscript", "--vanilla", script], cwd=cwd, env=env, capture_output=True, text=True)
    else:
        p = subprocess.run(["script", "-qec", f"cd '{cwd}' && stty cols 80 2>/dev/null; bash --norc --noprofile '{script}'", "/dev/null"], env=env, capture_output=True, text=True)
    out = p.stdout.replace("\r\n", "\n")
    sys.stdout.write(out)
    if p.stderr.strip():
        sys.stderr.write("[stderr]\n" + p.stderr)
finally:
    shutil.rmtree(base, ignore_errors=True)
