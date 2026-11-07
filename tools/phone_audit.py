#!/usr/bin/env python3
"""Phone usability audit: horizontal overflow at 320, 360 and 390 pixels and in landscape, text inputs that would make
iOS zoom (under 16px), text inputs without autocapitalize=off, and small tap targets.
Usage: python3 tools/phone_audit.py [--base http://localhost:8822/]   (needs Playwright with Chrome and the site served)
Exit code 1 if any page overflows or any input is under 16px."""
import asyncio, json, sys
from playwright.async_api import async_playwright
BASE = sys.argv[sys.argv.index("--base") + 1] if "--base" in sys.argv else "http://localhost:8822/"
if not BASE.endswith("/"): BASE += "/"
ROUTES = ["/", "/c/ibm", "/c/rice", "/c/kaust", "/c/ibm/ibm-paths", "/c/ibm/ibm-terminal", "/c/rice/rice-variables", "/c/kaust/kaust-normalize", "/c/kaust/kaust-pandas", "/files", "/visuals", "/visuals/fs-tree", "/visuals/count-matrix", "/explore", "/learn", "/lesson/f1-grep", "/lesson/f2-functions", "/lesson/f3-de", "/labs/terminal", "/labs/mission/f1-grep", "/labs/python",
          "/labs/dogma", "/labs/rnaseq", "/labs/countmatrix", "/labs/singlecell-clusters", "/labs/trace/var-update", "/practice", "/review",
          "/progress", "/glossary", "/plan", "/about", "/courses", "/notebook", "/labs/normalization", "/labs/cron", "/labs/filetree", "/lesson/f0-dogma"]
JS = r"""
() => {
  const out = { small: [], zoom: [], noauto: [], overflow: document.documentElement.scrollWidth - window.innerWidth };
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  for (const e of document.querySelectorAll('button, a[href], input, select, textarea, [role=tab], summary')) {
    if (!vis(e) || e.closest('.skip-link') || e.classList.contains('skip-link')) continue;
    const r = e.getBoundingClientRect();
    const inline = e.tagName === 'A' && getComputedStyle(e).display === 'inline';
    if (!inline && (r.height < 36 || r.width < 36)) out.small.push(`${e.tagName.toLowerCase()}.${[...e.classList].join('.')} "${(e.innerText||e.value||e.getAttribute('aria-label')||'').trim().slice(0,30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
    if (['INPUT','SELECT','TEXTAREA'].includes(e.tagName) && !['range','checkbox','radio','file','button','submit'].includes(e.type)) {
      const fs = parseFloat(getComputedStyle(e).fontSize);
      if (fs < 16) out.zoom.push(`${e.tagName.toLowerCase()}[${e.type||''}].${[...e.classList].join('.')} ${fs}px`);
      if ((e.tagName === 'TEXTAREA' || (e.tagName === 'INPUT' && (e.type === 'text' || e.type === 'search'))) && e.getAttribute('autocapitalize') !== 'off')
        out.noauto.push(`${e.tagName.toLowerCase()}.${[...e.classList].join('.')} autocap=${e.getAttribute('autocapitalize')} autocorrect=${e.getAttribute('autocorrect')} spell=${e.getAttribute('spellcheck')}`);
    }
  }
  return out;
}
"""
FAIL = []
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", headless=True)
        for name, vp in [("phone390", {'width':390,'height':844}), ("phone320", {'width':320,'height':640}), ("phone360", {'width':360,'height':780}), ("landscape", {'width':844,'height':390})]:
            ctx = await b.new_context(viewport=vp, device_scale_factor=2, is_mobile=True, has_touch=True)
            pg = await ctx.new_page()
            agg = {"small": {}, "zoom": set(), "noauto": set(), "overflow": []}
            for r in ROUTES:
                await pg.goto(BASE + "#" + r); await pg.wait_for_timeout(450)
                res = await pg.evaluate(JS)
                if res["overflow"] > 0: agg["overflow"].append((r, res["overflow"]))
                for s in res["small"]: agg["small"].setdefault(s.split(' ')[0] + ' ' + s.split('"')[1][:18] if '"' in s else s, s)
                agg["zoom"].update(res["zoom"]); agg["noauto"].update(res["noauto"])
            print(f"== {name}: overflow on {agg['overflow'] or 'none'}")
            if agg["overflow"]: FAIL.append(name + " overflow")
            if agg["zoom"]: FAIL.append(name + " inputs under 16px")
            if name == "phone390":
                print("  inputs under 16px (iOS zooms on focus):", sorted(agg["zoom"]))
                print("  text inputs without autocapitalize=off:", sorted(agg["noauto"]))
                print("  small targets (<36px):", len(agg["small"]))
                for v in list(agg["small"].values())[:40]: print("   ", v)
            await ctx.close()
        await b.close()
asyncio.run(main())
print("phone audit:", "FAIL " + ", ".join(FAIL) if FAIL else "OK")
sys.exit(1 if FAIL else 0)
