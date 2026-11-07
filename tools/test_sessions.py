#!/usr/bin/env python3
"""Regression tests for practice sessions: duplicate scoring, resuming, timers.

Usage: python3 tools/test_sessions.py [--base http://localhost:8811]
Needs Playwright for Python with Chrome, and the site served at --base.
Each check prints PASS or FAIL; the exit code is the number of failures.
"""
import asyncio, json, sys
from playwright.async_api import async_playwright

BASE = "http://localhost:8811"
if "--base" in sys.argv:
    BASE = sys.argv[sys.argv.index("--base") + 1].rstrip("/")
results = []


def ok(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    print(("PASS " if cond else "FAIL ") + name + ("" if cond else f"  [{detail}]"), flush=True)


async def go(page, route):
    await page.evaluate(f"location.hash = '#{route}'")
    await page.wait_for_timeout(350)


async def fresh(browser, clock=False, dialogs=None):
    ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
    page = await ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    # dialogs=None accepts every confirm(); a list collects the messages and dismisses them
    if dialogs is None:
        page.on("dialog", lambda d: asyncio.ensure_future(d.accept()))
    else:
        page.on("dialog", lambda d: (dialogs.append(d.message), asyncio.ensure_future(d.dismiss())))
    if clock:
        await page.clock.install()
    await page.goto(BASE + "/#/")
    await page.wait_for_selector("#main")
    await page.evaluate("BB.store.reset()")
    await page.reload()
    await page.wait_for_selector("#main")
    return ctx, page, errors


ATT = "(id) => BB.store.state.attempts.filter((a) => a.q === id).length"


async def instant_mode(browser):
    ctx, page, errors = await fresh(browser)
    await page.evaluate("BB.practice.startTopic({ foundation: 'f1', n: 5 }); BB.go('/practice/session')")
    await page.wait_for_selector(".option")
    qid = await page.evaluate("BB.store.state.activeSession.items[0].id")
    await page.locator(".option").first.click()
    await page.wait_for_timeout(200)
    review_before = await page.evaluate("JSON.stringify(BB.store.state.review)")
    ok("instant: answering records one attempt", await page.evaluate(ATT, qid) == 1)
    for _ in range(3):
        await page.evaluate("BB.dispatch()")
        await page.wait_for_timeout(150)
    ok("instant: re-rendering an answered question records nothing new", await page.evaluate(ATT, qid) == 1, await page.evaluate(ATT, qid))
    ok("instant: re-rendering does not change review scheduling", await page.evaluate("JSON.stringify(BB.store.state.review)") == review_before)
    await page.evaluate("BB.store.saveNow()")
    await page.reload()
    await page.wait_for_selector("#main")
    await go(page, "/practice/session")
    await page.wait_for_selector(".option")
    ok("instant: reload and resume records nothing new", await page.evaluate(ATT, qid) == 1, await page.evaluate(ATT, qid))
    shown = await page.evaluate("[...document.querySelectorAll('.option')].some((b) => b.getAttribute('aria-pressed') === 'true') && !!document.querySelector('.feedback')")
    ok("instant: the saved answer and its explanation are shown again", shown)
    disabled = await page.evaluate("[...document.querySelectorAll('.option')].every((b) => b.disabled)")
    ok("instant: a restored question cannot be answered a second time", disabled)
    await page.get_by_role("button", name="Next").click()
    await page.wait_for_timeout(200)
    q2 = await page.evaluate("BB.store.state.activeSession.items[1].id")
    await page.locator(".option").first.click()
    await page.wait_for_timeout(150)
    total = await page.evaluate("BB.store.state.attempts.length")
    ok("instant: two answered questions give exactly two attempts", total == 2, total)
    ok("instant: no JavaScript errors", not errors, errors[:2])
    await ctx.close()


async def review_mode(browser):
    ctx, page, errors = await fresh(browser)
    # Put one bank question in the review queue, due now, in box 2.
    qid = await page.evaluate("""() => { const q = BB.questions[0]; BB.store.state.review['q:' + q.id] = { box: 2, due: Date.now() - 1000, obj: q.obj, last: Date.now() - 86400000, lapses: 1 }; BB.store.saveNow(); return q.id; }""")
    await page.evaluate("BB.practice.startReview(); BB.go('/practice/session')")
    await page.wait_for_selector(".option")
    await page.evaluate("(id) => { const q = BB.questions.find((x) => x.id === id); document.querySelector(`.option[data-i='${q.answer}']`).click(); }", qid)
    await page.wait_for_timeout(150)
    box1 = await page.evaluate("(id) => (BB.store.state.review['q:' + id] || {}).box", qid)
    for _ in range(3):
        await page.evaluate("BB.dispatch()")
        await page.wait_for_timeout(120)
    await page.evaluate("BB.store.saveNow()")
    await page.reload()
    await page.wait_for_selector("#main")
    await go(page, "/practice/session")
    await page.wait_for_timeout(300)
    box2 = await page.evaluate("(id) => (BB.store.state.review['q:' + id] || {}).box", qid)
    ok("review: a correct answer moves the item up exactly one box", box1 == 3 and box2 == 3, f"after answer {box1}, after re-render and reload {box2}")
    ok("review: one attempt recorded", await page.evaluate(ATT, qid) == 1, await page.evaluate(ATT, qid))
    ok("review: no JavaScript errors", not errors, errors[:2])
    await ctx.close()


async def mock_mode(browser):
    ctx, page, errors = await fresh(browser)
    await page.evaluate("BB.practice.startMock({ n: 20, timed: false }); BB.go('/practice/session')")
    await page.wait_for_selector(".option")
    picks = []
    for k in range(3):
        btn = page.locator(".option").nth(1)
        picks.append(int(await btn.get_attribute("data-i")))
        await btn.click()
        await page.get_by_role("button", name="Next").click()
        await page.wait_for_timeout(150)
    ok("mock: no attempts are recorded before submitting", await page.evaluate("BB.store.state.attempts.length") == 0)
    await page.get_by_role("button", name="Previous").click()
    await page.wait_for_timeout(150)
    await page.get_by_role("button", name="Question 1, answered").click()
    await page.wait_for_timeout(150)
    pressed = await page.evaluate("document.querySelector('.option[aria-pressed=true]') && +document.querySelector('.option[aria-pressed=true]').dataset.i")
    ok("mock: jumping back shows the saved answer", pressed == picks[0], f"{pressed} vs {picks[0]}")
    await page.evaluate("BB.store.saveNow()")
    await page.reload()
    await page.wait_for_selector("#main")
    await go(page, "/practice/session")
    await page.wait_for_selector(".option")
    saved = await page.evaluate("BB.store.state.activeSession.answers.slice(0, 3)")
    ok("mock: answers survive a reload", saved == picks, f"{saved} vs {picks}")
    await page.evaluate("BB.store.state.activeSession.at = 19; BB.dispatch()")
    await page.wait_for_timeout(200)
    await page.get_by_role("button", name="Submit and see results").click()
    await page.wait_for_selector(".score-hero")
    n = await page.evaluate("BB.store.state.attempts.length")
    ok("mock: submitting records exactly one attempt per question", n == 20, n)
    await page.evaluate("BB.dispatch()")
    await page.reload()
    await page.wait_for_selector("#main")
    await go(page, "/practice/results")
    await page.wait_for_timeout(300)
    n2 = await page.evaluate("BB.store.state.attempts.length")
    s2 = await page.evaluate("BB.store.state.sessions.length")
    ok("mock: viewing results again records nothing new", n2 == 20 and s2 == 1, f"attempts {n2}, sessions {s2}")
    ok("mock: no JavaScript errors", not errors, errors[:2])
    await ctx.close()


async def timer_rules(browser):
    ctx, page, errors = await fresh(browser, clock=True)
    await page.evaluate("BB.practice.startMock({ n: 20, timed: true }); BB.go('/practice/session')")
    await page.wait_for_selector(".timer")
    t0 = await page.locator(".timer").inner_text()
    ok("timer: a 20-question mock starts at 30:00", t0.startswith("30:00"), t0)
    await page.clock.run_for(60_000)
    t1 = await page.locator(".timer").inner_text()
    ok("timer: counts down while the mock is on screen", t1.startswith("29:00"), t1)
    # Leave by navigating elsewhere, let a long time pass, check there is no redirect and the clock is not running.
    await go(page, "/learn")
    await page.clock.run_for(40 * 60_000)
    route = await page.evaluate("location.hash")
    active = await page.evaluate("!!BB.store.state.activeSession && !BB.store.state.activeSession.finished")
    ok("timer: leaving the mock never redirects you to results", route == "#/learn", route)
    ok("timer: leaving the mock pauses it instead of submitting it", active)
    await go(page, "/practice/session")
    await page.wait_for_selector(".timer")
    t2 = await page.locator(".timer").inner_text()
    ok("timer: resuming continues from the time you left", t2.startswith("29:00"), t2)
    # Pause button
    await page.get_by_role("button", name="Pause").click()
    await page.wait_for_timeout(100)
    await page.clock.run_for(10 * 60_000)
    await go(page, "/practice/session")
    await page.wait_for_selector(".timer")
    t3 = await page.locator(".timer").inner_text()
    ok("timer: Pause stops the clock", t3.startswith("29:00"), t3)
    # Reload keeps the remaining time
    await page.clock.run_for(30_000)
    await page.evaluate("BB.store.saveNow()")
    await page.reload()
    await page.wait_for_selector("#main")
    await go(page, "/practice/session")
    await page.wait_for_selector(".timer")
    t4 = await page.locator(".timer").inner_text()
    ok("timer: a reload does not reset the clock", t4.startswith("28:3") or t4.startswith("28:2"), t4)
    # Only one interval may run, however often the view is redrawn.
    for _ in range(5):
        await page.evaluate("BB.dispatch()")
    before = await page.locator(".timer").inner_text()
    await page.clock.run_for(10_000)
    after = await page.locator(".timer").inner_text()
    def secs(t):
        m, s = t.split(" ")[0].split(":")
        return int(m) * 60 + int(s)
    ok("timer: redrawing never starts a second clock", secs(before) - secs(after) == 10, f"{before} -> {after}")
    # Expiry while on screen submits once and shows results.
    await page.evaluate("const s = BB.store.state.activeSession; s.remainingMs = 3000; s.runningSince = Date.now(); BB.dispatch()")
    await page.clock.run_for(5_000)
    await page.wait_for_timeout(300)
    route = await page.evaluate("location.hash")
    sessions = await page.evaluate("BB.store.state.sessions.length")
    attempts = await page.evaluate("BB.store.state.attempts.length")
    ok("timer: time running out submits the mock once and shows results", route == "#/practice/results" and sessions == 1 and attempts == 20, f"{route}, sessions {sessions}, attempts {attempts}")
    note = await page.evaluate("document.querySelector('#main').innerText.includes('Time ran out')")
    ok("timer: the results say that time ran out", note)
    ok("timer: no JavaScript errors", not errors, errors[:2])
    await ctx.close()


async def expired_while_away(browser):
    # A session saved by 2.1.0 (absolute end time) that expired while the student was away.
    ctx, page, errors = await fresh(browser, clock=True)
    await page.evaluate("BB.practice.startMock({ n: 20, timed: true })")
    await page.evaluate("const s = BB.store.state.activeSession; delete s.remainingMs; delete s.runningSince; s.endsAt = Date.now() - 1000; BB.store.saveNow()")
    await go(page, "/practice")
    await page.wait_for_timeout(200)
    await go(page, "/practice/session")
    await page.wait_for_timeout(500)
    route = await page.evaluate("location.hash")
    ok("legacy: an old timed session that already ran out is submitted when opened", route == "#/practice/results", route)
    ok("legacy: no JavaScript errors", not errors, errors[:2])
    await ctx.close()


async def new_session_guard(browser):
    dialogs = []
    ctx, page, errors = await fresh(browser, dialogs=dialogs)
    await page.evaluate("BB.practice.startMock({ n: 20, timed: false }); BB.go('/practice/session')")
    await page.wait_for_selector(".option")
    await page.locator(".option").first.click()
    await go(page, "/practice")
    await page.get_by_role("button", name="Start practice").click()
    await page.wait_for_timeout(300)
    kept = await page.evaluate("BB.store.state.activeSession && BB.store.state.activeSession.mode")
    ok("guard: starting a new session asks before replacing an unfinished one", dialogs and kept == "mock", f"dialogs {dialogs}, active {kept}")
    await ctx.close()


async def seeded(browser, raw):
    """A new browser whose saved progress is exactly `raw` when the app first loads (no pagehide save can overwrite it)."""
    ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
    script = "if (!sessionStorage.getItem('bb-seeded')) { localStorage.setItem('biobridge-v2', " + json.dumps(raw) + "); sessionStorage.setItem('bb-seeded', '1'); }"
    await ctx.add_init_script(script)
    page = await ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    await page.goto(BASE + "/#/")
    await page.wait_for_selector("#main")
    return ctx, page, errors


async def storage_robustness(browser):
    # 1. Damaged but parseable data: wrong types everywhere and a broken unfinished session.
    damaged = {"v": 2, "lessons": [], "attempts": {"x": 1}, "sessions": "oops", "review": {"q:x": "bad"}, "settings": None,
               "diagnostic": {"t": 1}, "activeSession": {"items": 3, "answers": []}, "lastResult": {"items": "no"}}
    ctx, page, errors = await seeded(browser, json.dumps(damaged))
    key = await page.evaluate("BB.config.storageKey")
    ok("storage: test uses the real storage key", key == "biobridge-v2", key)
    for r in ["/", "/practice", "/progress", "/review", "/practice/session", "/plan", "/learn"]:
        await go(page, r)
    shape = await page.evaluate("(() => { const s = BB.store.state; return [Array.isArray(s.attempts), Array.isArray(s.sessions), !Array.isArray(s.lessons), s.activeSession, s.diagnostic, s.lastResult, Object.keys(s.review).length]; })()")
    ok("storage: damaged saved data is repaired on load", shape == [True, True, True, None, None, None, 0], shape)
    await page.evaluate("BB.practice.startTopic({ n: 5 }); BB.go('/practice/session')")
    await page.wait_for_selector(".option")
    await page.locator(".option").first.click()
    ok("storage: practice works after repair", await page.evaluate("BB.store.state.attempts.length") == 1)
    ok("storage: no JavaScript errors with damaged data", not errors, errors[:2])
    await ctx.close()
    # 2. Unreadable JSON: reset with a visible message, and the unreadable text is kept as a backup.
    ctx, page, errors = await seeded(browser, "{not json")
    await page.wait_for_timeout(700)
    msg = await page.evaluate("BB.store.loadError")
    toast = await page.evaluate("document.querySelector('#toasts').innerText")
    backup = await page.evaluate("localStorage.getItem('biobridge-v2-unreadable-backup')")
    ok("storage: unreadable saved data resets and the student is told", bool(msg) and "could not be read" in toast and not errors, f"{msg} | {toast[:60]} | {errors[:1]}")
    ok("storage: the unreadable data is kept as a backup", backup == "{not json", backup)
    # 3. Import: a file that is not a BioBridge export is refused and changes nothing.
    await page.evaluate("BB.practice.startTopic({ n: 5 })")
    before = await page.evaluate("JSON.stringify(BB.store.state.activeSession.items.map((q) => q.id))")
    refused = await page.evaluate("(() => { try { BB.store.importJSON('{\"hello\": 1}'); return false; } catch (e) { return true; } })()")
    after = await page.evaluate("JSON.stringify(BB.store.state.activeSession.items.map((q) => q.id))")
    ok("import: a file that is not a BioBridge export is refused without changes", refused and before == after)
    # 4. Export then import gives back the same progress.
    await page.evaluate("BB.store.lesson('f0-dogma').completed = 123; BB.store.state.attempts.push({ q: 'x', o: [], c: 1, t: 1, m: 'topic', l: 1 }); BB.store.saveNow()")
    exported = await page.evaluate("JSON.stringify({ app: 'BioBridge', version: BB.config.version, state: BB.store.state })")
    expected = await page.evaluate("BB.store.state.attempts.length")
    await page.evaluate("BB.store.reset()")
    await page.evaluate("(t) => BB.store.importJSON(t)", exported)
    back = await page.evaluate("[BB.store.state.lessons['f0-dogma'] && BB.store.state.lessons['f0-dogma'].completed, BB.store.state.attempts.length]")
    ok("import: exported progress comes back unchanged", back == [123, expected], f"{back} vs [123, {expected}]")
    # 5. An import with damaged fields is repaired, not trusted.
    await page.evaluate("BB.store.importJSON(JSON.stringify({ state: { lessons: {}, attempts: 'x', activeSession: { items: [] } } }))")
    shape = await page.evaluate("[Array.isArray(BB.store.state.attempts), BB.store.state.activeSession]")
    ok("import: damaged fields in an imported file are repaired", shape == [True, None], shape)
    ok("storage: no JavaScript errors in import checks", not errors, errors[:2])
    await ctx.close()


async def diagnostic_idk_last(browser):
    ctx, page, errors = await fresh(browser)
    await page.evaluate("BB.practice.startDiagnostic(); BB.go('/practice/session')")
    last_ok = True
    for k in range(5):
        await page.wait_for_selector(".option")
        last = await page.evaluate("[...document.querySelectorAll('.option')].pop().innerText")
        last_ok = last_ok and "know yet" in last
        await page.get_by_role("button", name="Next").click()
        await page.wait_for_timeout(120)
    ok("diagnostic: 'I don't know yet' is always the last option", last_ok)
    await ctx.close()


async def link_check(browser):
    """Follow every in-site link on every page; a link that the router sends back home is broken."""
    ctx, page, errors = await fresh(browser)
    start = ["/", "/learn", "/courses", "/labs", "/practice", "/review", "/progress", "/glossary", "/notebook", "/plan", "/about"]
    lessons = await page.evaluate("Object.keys(BB.lessonMeta)")
    pages = start + ["/lesson/" + x for x in lessons] + ["/learn/f0", "/learn/f1", "/learn/f2", "/learn/f3"]
    hrefs = set()
    for r in pages:
        await page.evaluate(f"location.hash = '#{r}'")
        await page.wait_for_timeout(120)
        for href in await page.evaluate("[...document.querySelectorAll('a[href^=\"#/\"]')].map((a) => a.getAttribute('href'))"):
            hrefs.add(href)
    broken = []
    for href in sorted(hrefs):
        await page.evaluate("(h) => { location.hash = h; }", href)
        await page.wait_for_timeout(90)
        now = await page.evaluate("location.hash")
        anchor = href.split("#")[2] if href.count("#") > 1 else ""
        missing = anchor and not await page.evaluate("(id) => !!document.getElementById(id)", anchor)
        if (now != href and href != "#/") or missing:
            broken.append(f"{href} -> {now}" + (" (section missing)" if missing else ""))
    ok(f"links: all {len(hrefs)} in-site links open a real page", not broken, broken[:5])
    ok("links: no JavaScript errors while crawling", not errors, errors[:2])
    await ctx.close()


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="chrome", headless=True)
        for t in (instant_mode, review_mode, mock_mode, timer_rules, expired_while_away, new_session_guard, storage_robustness, diagnostic_idk_last, link_check):
            try:
                await t(browser)
            except Exception as e:
                ok(t.__name__ + " ran to the end", False, str(e).splitlines()[0][:200])
        await browser.close()
    failed = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(failed)}/{len(results)} session checks passed")
    sys.exit(len(failed))


asyncio.run(main())
