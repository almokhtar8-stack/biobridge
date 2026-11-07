#!/usr/bin/env python3
"""Run each Python teaching program under a tracer and save the exact step-by-step execution.

Input:  BB.pyPrograms in content/py-programs.js (read via tools/out/content.json, produced by tools/validate.mjs)
Output: content/py-traces.js  (BB.pyTraces)

Because the traces come from real Python execution, the variable values and printed output shown in
BioBridge's trace player are exactly what Python produces. Prediction prompts ("ask") are checked here too.
Run:  node tools/validate.mjs --quiet; python3 tools/build_traces.py
"""
import io, json, os, sys, types, contextlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
programs = json.load(open(os.path.join(ROOT, "tools/out/content.json")))["pyPrograms"] or {}
MAX_STEPS = 220

def show(v):
    if isinstance(v, types.FunctionType):
        return ["function", f"function {v.__name__}(...)"]
    if isinstance(v, types.ModuleType):
        return ["module", f"module {v.__name__}"]
    t = type(v).__name__
    r = repr(v)
    if len(r) > 90:
        r = r[:87] + "..."
    return [t, r]

def trace_program(pid, prog):
    code = prog["code"]
    compiled = compile(code, "<prog>", "exec")
    steps, out = [], io.StringIO()
    frames_of_interest = []

    def snapshot(frame):
        stack = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == "<prog>":
                name = f.f_code.co_name
                loc = {k: show(v) for k, v in f.f_locals.items() if not k.startswith("__")}
                stack.append({"n": "main program" if name == "<module>" else name + "()", "v": loc})
            f = f.f_back
        stack.reverse()
        return stack

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<prog>":
            return tracer
        if len(steps) >= MAX_STEPS:
            raise RuntimeError("too many steps")
        if event == "line":
            steps.append({"l": frame.f_lineno, "e": "line", "s": snapshot(frame), "o": out.getvalue()})
        elif event == "return" and frame.f_code.co_name != "<module>":
            steps.append({"l": frame.f_lineno, "e": "return", "r": show(arg)[1], "fn": frame.f_code.co_name, "s": snapshot(frame), "o": out.getvalue()})
        return tracer

    g = {"__name__": "__main__"}
    error = None
    with contextlib.redirect_stdout(out):
        sys.settrace(tracer)
        try:
            exec(compiled, g)
        except Exception as e:  # programs may intentionally raise (debugging lessons)
            error = f"{type(e).__name__}: {e}"
        finally:
            sys.settrace(None)
    final_vars = {k: show(v) for k, v in g.items() if not k.startswith("__")}
    steps.append({"l": None, "e": "end", "s": [{"n": "main program", "v": final_vars}], "o": out.getvalue(), "err": error})
    return {"code": code, "steps": steps, "error": error}

def check_asks(pid, prog, tr):
    problems = []
    for a in prog.get("ask", []):
        line, occ, var = a["line"], a.get("occurrence", 1), a["var"]
        seen = 0
        idx = None
        for i, s in enumerate(tr["steps"]):
            if s["e"] == "line" and s["l"] == line:
                seen += 1
                if seen == occ:
                    idx = i
                    break
        if idx is None:
            problems.append(f"{pid}: ask line {line} occurrence {occ} never executes")
            continue
        depth = len(tr["steps"][idx]["s"])
        # value after the line runs = first later step whose stack depth returns to the same depth (or the end step)
        after = None
        for s in tr["steps"][idx + 1:]:
            if s["e"] == "end":
                after = s["s"][0]["v"].get(var)
                break
            if len(s["s"]) == depth and s["e"] == "line":
                after = s["s"][-1]["v"].get(var)
                break
        if after is None:
            problems.append(f"{pid}: variable {var} not found after line {line}")
            continue
        want = a["options"][a["answer"]]
        if after[1] != want:
            problems.append(f"{pid}: ask on line {line} expects {want!r} but Python gives {after[1]!r}")
        for i, o in enumerate(a["options"]):
            if i != a["answer"] and o == after[1]:
                problems.append(f"{pid}: ask on line {line} has a wrong option equal to the real value")
        a["_step"] = idx
    return problems

traces, problems = {}, []
for pid, prog in programs.items():
    try:
        tr = trace_program(pid, prog)
    except Exception as e:
        problems.append(f"{pid}: failed to trace: {e}")
        continue
    if tr["error"] and not prog.get("expectError"):
        problems.append(f"{pid}: program raised {tr['error']}")
    problems += check_asks(pid, prog, tr)
    traces[pid] = {"steps": tr["steps"], "asks": [{"step": a.get("_step"), "q": a["q"], "options": a["options"], "answer": a["answer"], "why": a.get("why", "")} for a in prog.get("ask", []) if a.get("_step") is not None]}

path = os.path.join(ROOT, "content/py-traces.js")
with open(path, "w") as f:
    f.write("/* Generated by tools/build_traces.py from real Python execution. Do not edit by hand. */\n")
    f.write("window.BB = window.BB || {};\nBB.pyTraces = ")
    json.dump(traces, f, separators=(",", ":"))
    f.write(";\n")
print(f"traced {len(traces)} programs -> {path} ({os.path.getsize(path)} bytes)")
for p in problems:
    print("PROBLEM:", p)
sys.exit(1 if problems else 0)
