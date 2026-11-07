#!/usr/bin/env python3
"""End-to-end browser tests for BioBridge (Playwright + Chrome, headless).

Serve the site first, e.g.:  python3 -m http.server 8811   (from the project folder)
Then run:                    python3 tools/test_e2e.py [--base http://localhost:8811] [--axe path/to/axe.min.js] [--shots out_dir]

Checks every route and lesson at phone, tablet and desktop sizes for JavaScript errors, then exercises the main
learning flows: diagnostic, topic practice, mock assessment, lesson checkpoint + teach-back, persistence after reload,
migration of BioBridge 1.0 progress, glossary drawer, terminal mission, Python trace, real Python (Pyodide),
spaced review, export, and an axe-core accessibility audit.
"""
import argparse, asyncio, json, os, sys, time
from playwright.async_api import async_playwright

ap = argparse.ArgumentParser()
ap.add_argument("--base", default="http://localhost:8811")
ap.add_argument("--axe", default="")
ap.add_argument("--shots", default="")
ap.add_argument("--quick", action="store_true")
args = ap.parse_args()
BASE = args.base.rstrip("/") + "/index.html"
results, failures = [], []

def ok(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    if not cond:
        failures.append(f"{name}: {detail}")
    print(("PASS " if cond else "FAIL ") + name + (f"  [{detail}]" if detail and not cond else ""))

VIEWPORTS = {
    "phone": dict(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True, user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"),
    "tablet": dict(viewport={"width": 820, "height": 1180}, device_scale_factor=2, is_mobile=True, has_touch=True),
    "desktop": dict(viewport={"width": 1366, "height": 900}),
}

async def new_page(browser, kind, errors):
    ctx = await browser.new_context(**VIEWPORTS[kind])
    page = await ctx.new_page()
    page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    page.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}") if m.type == "error" and "favicon" not in m.text and "404" not in m.text else None)
    return ctx, page

async def go(page, route):
    await page.goto(BASE + "#" + route)
    await page.wait_for_function("document.querySelector('#main') && document.querySelector('#main').children.length > 0", timeout=15000)
    await page.wait_for_timeout(120)

async def no_overflow(page):
    return await page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")

async def routes_test(browser, kind):
    errors = []
    ctx, page = await new_page(browser, kind, errors)
    await page.goto(BASE)
    lessons = await page.evaluate("Object.keys(BB.lessonMeta)")
    labs = await page.evaluate("BB.pages.LABS.map(l => l[1])")
    missions = await page.evaluate("Object.keys(BB.missions)")
    traces = await page.evaluate("Object.keys(BB.pyPrograms)")
    routes = ["/", "/learn", "/learn/f0", "/learn/f1", "/learn/f2", "/learn/f3", "/courses", "/labs", "/practice", "/review", "/progress", "/glossary", "/notebook", "/plan", "/about"]
    routes += [f"/lesson/{l}" for l in (lessons if not args.quick or kind == "desktop" else lessons[::6])]
    routes += [f"/labs/{l}" for l in labs]
    if kind == "desktop":
        routes += [f"/labs/mission/{m}" for m in missions] + [f"/labs/trace/{t}" for t in traces]
    overflow = []
    for r in routes:
        n0 = len(errors)
        try:
            await go(page, r)
        except Exception as e:
            errors.append(f"{r}: did not render ({e})")
        if len(errors) > n0:
            errors[n0:] = [f"{r}: {x}" for x in errors[n0:]]
        if not await no_overflow(page):
            overflow.append(r)
        if "Something went wrong" in (await page.inner_text("#main")):
            errors.append(f"{r}: error page shown")
    ok(f"[{kind}] {len(routes)} routes render without JavaScript errors", not errors, "; ".join(errors[:8]))
    ok(f"[{kind}] no horizontal page overflow", not overflow, ", ".join(overflow[:12]))
    if args.shots:
        os.makedirs(args.shots, exist_ok=True)
        for r, name in [("/", "home"), ("/lesson/f0-dogma", "lesson-dogma"), ("/lesson/f1-grep", "lesson-grep"), ("/practice", "practice"), ("/labs/rnaseq", "lab-rnaseq"), ("/lesson/f2-variables", "lesson-variables"), ("/labs/singlecell-clusters", "lab-clusters"), ("/progress", "progress"), ("/courses", "courses")]:
            await go(page, r)
            await page.screenshot(path=f"{args.shots}/{kind}-{name}.png", full_page=False)
    await ctx.close()

async def flows(browser):
    errors = []
    ctx, page = await new_page(browser, "desktop", errors)
    # 1. migration from BioBridge 1.0 (fresh browser profile with only 1.0 data present)
    mctx = await browser.new_context(**VIEWPORTS["desktop"])
    await mctx.add_init_script("if (!sessionStorage.getItem('seeded')) { localStorage.setItem('biobridge-v1', JSON.stringify({done:['dna','linux-grep','py-loop'], practiceHistory:[{at:'2026-11-01T10:00:00Z', score:70}]})); sessionStorage.setItem('seeded','1'); }")
    mpage = await mctx.new_page()
    await mpage.goto(BASE + "#/progress")
    await mpage.wait_for_function("document.querySelector('#main') && document.querySelector('#main').children.length > 0")
    migrated = await mpage.evaluate("[BB.store.state.lessons['f0-dogma']?.completed, BB.store.state.lessons['f1-grep']?.completed, BB.store.state.lessons['f2-lists-loops']?.completed, BB.store.state.sessions.length]")
    ok("migrates BioBridge 1.0 completed lessons and history", bool(migrated[0] and migrated[1] and migrated[2]) and migrated[3] == 1, str(migrated))
    await mpage.evaluate("BB.store.reset()")
    await mpage.reload()
    await mpage.wait_for_function("document.querySelector('#main') && document.querySelector('#main').children.length > 0")
    ok("reset clears progress and does not re-import 1.0 data", await mpage.evaluate("Object.keys(BB.store.state.lessons).length === 0"))
    await mctx.close()
    await page.goto(BASE)
    await go(page, "/")

    # 2. diagnostic flow
    await page.evaluate("BB.practice.startDiagnostic(); BB.go('/practice/session')")
    await page.wait_for_selector(".option")
    n = await page.evaluate("BB.store.state.activeSession.items.length")
    for i in range(n):
        await page.click(".option >> nth=0")
        last = i == n - 1
        if last:
            page.once("dialog", lambda d: asyncio.ensure_future(d.accept()))
        await page.click("button.btn-primary:has-text('Submit'), button.btn-primary:has-text('Next')")
        await page.wait_for_timeout(60)
    await page.wait_for_selector(".score-hero", timeout=8000)
    diag = await page.evaluate("[!!BB.store.state.diagnostic, BB.store.state.diagnostic && BB.store.state.diagnostic.total, document.querySelectorAll('.lesson-row').length]")
    ok("diagnostic: completes, stores results and shows a recommended path", diag[0] and diag[1] >= 18 and diag[2] >= 5, str(diag))

    # 3. topic practice with immediate feedback
    await page.evaluate("BB.practice.startTopic({foundation:'f1', n:5}); BB.go('/practice/session')")
    await page.wait_for_selector(".option")
    await page.click(".option >> nth=1")
    fb = await page.wait_for_selector(".feedback", timeout=4000)
    txt = await fb.inner_text()
    ok("topic practice: answering shows an explanation", len(txt) > 30, txt[:80])
    before = await page.evaluate("BB.store.state.attempts.length")
    for i in range(4):
        await page.click("button.btn-primary:has-text('Next'), button.btn-primary:has-text('Finish')")
        await page.wait_for_selector(".option")
        await page.click(".option >> nth=0")
        await page.wait_for_selector(".feedback")
    await page.click("button.btn-primary:has-text('Finish')")
    await page.wait_for_selector(".score-hero")
    after = await page.evaluate("BB.store.state.attempts.length")
    ok("topic practice: attempts are recorded per question", after - before == 4, f"{before} -> {after}")

    # 4. mock assessment (untimed), deferred feedback, navigation and submit
    await page.evaluate("BB.practice.startMock({n:20, timed:true}); BB.go('/practice/session')")
    await page.wait_for_selector(".timer")
    ok("mock: timer is shown", await page.is_visible(".timer"))
    for i in range(20):
        await page.click(".option >> nth=0")
        if i == 19:
            page.once("dialog", lambda d: asyncio.ensure_future(d.accept()))
            await page.click("button:has-text('Submit')")
        else:
            await page.click("button.btn-primary:has-text('Next')")
    await page.wait_for_selector(".score-hero")
    mock = await page.evaluate("BB.store.state.sessions.slice(-1)[0]")
    ok("mock: 20 questions scored and saved", mock and mock["n"] == 20, json.dumps(mock)[:120])
    fdist = await page.evaluate("(() => { const s = BB.store.state.lastResult; const c = {}; s.items.forEach(q => { const f = BB.objectives[q.obj[0]].f; c[f] = (c[f]||0)+1; }); return c; })()")
    ok("mock: questions come from all four foundations", len(fdist) == 4, str(fdist))
    review_added = await page.evaluate("Object.keys(BB.store.state.review).length")
    ok("mistakes are added to the spaced review queue", review_added > 0, str(review_added))

    # 5. spaced review: make items due, run a review session
    await page.evaluate("Object.values(BB.store.state.review).forEach(v => v.due = Date.now() - 1000); BB.store.saveNow()")
    await go(page, "/review")
    due = await page.evaluate("BB.practice.dueCount()")
    await page.click("button:has-text('Start review')")
    await page.wait_for_selector(".option")
    ok("review: due items open as a session", due > 0 and await page.evaluate("BB.store.state.activeSession.mode") == "review", str(due))

    # 6. lesson: checkpoint, teach-back, completion, persistence
    await go(page, "/lesson/f0-dogma")
    nchecks = await page.evaluate("BB.lessons.find(l => l.id === 'f0-dogma').check.length")
    for i in range(nchecks):
        ans = await page.evaluate(f"BB.lessons.find(l => l.id === 'f0-dogma').check[{i}].answer")
        card = page.locator("#sec-check .q-card").nth(i)
        await card.locator(f".option[data-i='{ans}']").click()
    await page.fill("textarea[id^='teach-']", "Transcription copies a gene's DNA into mRNA, using U instead of T. Translation reads the mRNA three letters at a time; each codon adds an amino acid until a stop codon.")
    boxes = page.locator(".teach-points input[type=checkbox]")
    for i in range(await boxes.count()):
        await boxes.nth(i).check()
    disabled = await page.is_disabled("button:has-text('I can explain this now')")
    await page.click("button:has-text('I can explain this now')")
    done = await page.evaluate("!!BB.store.state.lessons['f0-dogma'].completed")
    ok("lesson: checkpoint + teach-back marks the lesson explained", (not disabled) and done)
    await page.reload()
    await go(page, "/notebook")
    persisted = await page.evaluate("[!!BB.store.state.lessons['f0-dogma'].completed, BB.store.state.attempts.length]")
    nb = await page.inner_text("#main")
    ok("progress persists after reload (localStorage) and appears in My explanations", persisted[0] and "Transcription copies" in nb, str(persisted))
    rv = await page.evaluate("Object.keys(BB.store.state.review).filter(k => k.startsWith('chk:f0-dogma')).length")
    ok("completed lesson's checkpoint questions enter the review queue", rv == nchecks, str(rv))

    # 7. glossary drawer from a lesson term
    await go(page, "/lesson/f3-fastq")
    links = await page.locator(".term-link").count()
    if links:
        await page.locator(".term-link").first.click()
        await page.wait_for_selector("#gloss-drawer.open .gloss-item.focus", timeout=3000)
    ok("lesson terms link to the glossary drawer", links > 0 and await page.is_visible("#gloss-drawer.open"), f"links={links}")
    await page.keyboard.press("Escape")
    ok("glossary drawer closes with Escape", not await page.is_visible("#gloss-drawer.open"))

    # 7b. skip link moves focus to the content without leaving the page
    await go(page, "/lesson/f1-grep")
    first = await page.evaluate("[...document.querySelectorAll('a[href], button, input, select, textarea')].find((e) => e.offsetParent !== null || e.classList.contains('skip-link'))?.className || ''")
    await page.focus(".skip-link")
    await page.keyboard.press("Enter")
    await page.wait_for_timeout(300)
    focused_main = await page.evaluate("document.activeElement && document.activeElement.id === 'main'")
    ok("skip link comes first and focuses the content without leaving the page", "skip-link" in first and focused_main and "/lesson/f1-grep" in page.url, f"first={first} main={focused_main} url={page.url}")

    # 8. terminal mission end to end
    await go(page, "/labs/mission/f1-grep")
    steps = await page.evaluate("BB.missions['f1-grep'].steps.map(s => s.solution)")
    for sol in steps:
        for line in sol.split("\n"):
            await page.fill(".term-input input", line)
            await page.press(".term-input input", "Enter")
            await page.wait_for_timeout(60)
    complete = await page.is_visible("text=Mission complete")
    ok("terminal: a full mission completes by typing commands", complete and await page.evaluate("!!BB.store.state.missions['f1-grep']"))
    await page.fill(".term-input input", "ls ../scr")
    await page.press(".term-input input", "Tab")
    ok("terminal: Tab completes file names", (await page.input_value(".term-input input")) == "ls ../scripts/")

    # 9. python trace: step to the end with prediction prompts
    await go(page, "/labs/trace/" + (await page.evaluate("Object.keys(BB.pyPrograms)[0]")))
    for _ in range(80):
        if await page.locator(".callout.accent .option").count() and await page.locator(".callout.accent .option:not([disabled])").count():
            idx = await page.evaluate("(() => { const id = location.hash.split('/').pop(); const t = BB.pyTraces[id]; const step = +document.querySelector('.trace-controls .pos').textContent.match(/Step (\\d+)/)[1] - 1; const a = t.asks.find(x => x.step === step); return a ? a.answer : 0; })()")
            await page.locator(f".callout.accent .option[data-i='{idx}']").click()
        nxt = page.locator("button:has-text('Next step')")
        if await nxt.is_disabled():
            break
        await nxt.click()
    finished = await page.is_visible("text=Finished.")
    ok("python trace: steps through to the end with prediction prompts", finished)

    # 10. real Python through Pyodide (local vendored copy)
    await go(page, "/labs/python")
    await page.select_option(".widget select", "2")
    await page.click("button:has-text('Run')")
    try:
        await page.wait_for_function("document.querySelector('.output-block') && /ctrl_1 is control/.test(document.querySelector('.output-block').textContent)", timeout=90000)
        out = await page.inner_text(".output-block")
        ok("real Python runs in the browser and reads the practice files", "heat_3 is heat_shock" in out, out[:120])
    except Exception as e:
        ok("real Python runs in the browser and reads the practice files", False, str(e)[:200])
    # error message path
    await page.fill(".widget textarea", "x = 5\nprint(y)")
    await page.click("button:has-text('Run')")
    await page.wait_for_function("/NameError/.test(document.querySelector('.output-block').textContent)", timeout=30000)
    out = await page.inner_text(".output-block")
    ok("real Python shows readable tracebacks", "NameError" in out and "/lib/python" not in out, out[:160])
    # infinite loop is stopped
    await page.fill(".widget textarea", "while True:\n    pass")
    await page.click("button:has-text('Run')")
    await page.wait_for_function("/Stopped/.test(document.querySelector('.output-block').textContent)", timeout=30000)
    ok("real Python: a runaway loop is stopped by the timeout", True)

    # 11. export produces a JSON download
    await go(page, "/about")
    async with page.expect_download() as dl:
        await page.click("button:has-text('Export my progress')")
    d = await dl.value
    path = await d.path()
    data = json.load(open(path))
    ok("export downloads a JSON copy of progress", data.get("app") == "BioBridge" and "lessons" in data.get("state", {}))

    # 12. widgets behave: rnaseq volcano, single-cell labels, dogma mutation
    await go(page, "/labs/rnaseq")
    await page.click("button[role=tab]:has-text('Test every gene')")
    await page.wait_for_timeout(200)
    circles = await page.locator("svg.plot circle").count()
    ok("RNA-seq lab: volcano plot draws all 1,512 genes", circles >= 1512, str(circles))
    await go(page, "/labs/singlecell-clusters")
    truth = {1: "B cells", 2: "CD14 monocytes", 3: "CD4 T cells", 4: "NK cells", 5: "Platelets", 6: "CD8 T cells", 7: "FCGR3A monocytes"}
    for k, v in truth.items():
        await page.select_option(f"select[aria-label='Cell type for cluster {k}']", v)
    await page.click("button:has-text('Check my labels')")
    ok("single-cell lab: correct labels are recognized", await page.is_visible("text=7 of 7 clusters labelled correctly"))
    await go(page, "/labs/dogma")
    await page.click("button:has-text('Nonsense')")
    ok("DNA lab: nonsense mutation is classified", await page.is_visible("text=Nonsense change"))

    ok("flows ran without JavaScript errors", not errors, "; ".join(errors[:6]))
    await ctx.close()

async def phone_flows(browser):
    errors = []
    ctx, page = await new_page(browser, "phone", errors)
    await go(page, "/labs/mission/f1-grep")
    w = await page.evaluate("document.querySelector('.term-input input').getBoundingClientRect().width")
    ok("[phone] terminal input is wide enough to type in", w >= 140, f"width={w}")
    await page.tap(".term-input input")
    await page.fill(".term-input input", "ls")
    await page.tap(".term-input button[type=submit]")
    await page.wait_for_timeout(150)
    ok("[phone] terminal runs a typed command", "counts.tsv" in await page.inner_text(".term-screen"))
    await page.tap(".term-keys button[data-k='Up']")
    ok("[phone] helper key recalls the previous command", (await page.input_value(".term-input input")) == "ls")
    await go(page, "/lesson/f2-variables")
    ans = await page.evaluate("BB.lessons.find(l => l.id === 'f2-variables').check[0].answer")
    await page.locator("#sec-check .q-card").first.locator(f".option[data-i='{ans}']").tap()
    ok("[phone] lesson checkpoint gives feedback on tap", await page.locator("#sec-check .feedback.good").count() >= 1)
    await page.tap(".tabbar button:has-text('More')")
    ok("[phone] More opens the navigation drawer", await page.is_visible("#nav-drawer.open"))
    await page.tap("#nav-drawer a[data-nav='glossary']")
    await page.wait_for_timeout(200)
    ok("[phone] drawer link navigates and closes the drawer", ("#/glossary" in page.url) and not await page.is_visible("#nav-drawer.open"))
    ok("[phone] flows ran without JavaScript errors", not errors, "; ".join(errors[:5]))
    await ctx.close()

async def axe_audit(browser):
    if not args.axe:
        return
    src = open(args.axe).read()
    errors = []
    ctx, page = await new_page(browser, "desktop", errors)
    totals = {}
    for r in ["/", "/learn", "/lesson/f0-dogma", "/lesson/f1-grep", "/lesson/f2-variables", "/lesson/f3-de", "/practice", "/labs/rnaseq", "/labs/terminal", "/progress", "/glossary", "/plan", "/about", "/courses"]:
        for theme in ["light", "dark"]:
            await go(page, r)
            await page.evaluate(f"document.documentElement.setAttribute('data-theme', '{theme}')")
            await page.add_script_tag(content=src)
            res = await page.evaluate("axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] }).then(r => r.violations.map(v => ({id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0,2).map(n => n.target.join(' '))})))")
            for v in res:
                key = (v["id"], v["impact"])
                totals.setdefault(key, []).append(f"{r}[{theme}] x{v['n']} {v['ex']}")
    serious = {k: v for k, v in totals.items() if k[1] in ("serious", "critical")}
    for k, v in totals.items():
        print(f"  axe {k[1]}: {k[0]} on {len(v)} page(s): {v[:2]}")
    ok("axe-core: no serious or critical WCAG 2 A/AA violations", not serious, "; ".join(f"{k[0]}" for k in serious))
    await ctx.close()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="chrome", headless=True)
        for kind in ["phone", "tablet", "desktop"]:
            await routes_test(browser, kind)
        await flows(browser)
        await phone_flows(browser)
        await axe_audit(browser)
        await browser.close()
    print(f"\n{sum(1 for r in results if r[1])}/{len(results)} checks passed")
    json.dump([{"check": n, "pass": p, "detail": d} for n, p, d in results], open(os.path.join(os.path.dirname(__file__), "out", "e2e_results.json"), "w"), indent=1)
    sys.exit(1 if failures else 0)

asyncio.run(main())
