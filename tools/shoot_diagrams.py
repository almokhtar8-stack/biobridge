#!/usr/bin/env python3
"""Screenshot diagrams for visual checking (development tool).
Serve the project first, from its folder:  python3 -m http.server 8822
Usage: python3 tools/shoot_diagrams.py NAME [NAME...] [--steps] [--dark] [--phone] [--out DIR] [--base URL]
  --steps  one image per step (default: first and last step only)
Writes PNG files to the out directory (default /tmp/dg_shots) and prints their paths and any console errors."""
import argparse, asyncio, os
from playwright.async_api import async_playwright
ap = argparse.ArgumentParser()
ap.add_argument('names', nargs='+')
ap.add_argument('--steps', action='store_true')
ap.add_argument('--dark', action='store_true')
ap.add_argument('--phone', action='store_true')
ap.add_argument('--out', default='/tmp/dg_shots')
ap.add_argument('--base', default='http://localhost:8822')
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        vp = dict(viewport={'width': 390, 'height': 900}, device_scale_factor=2) if a.phone else dict(viewport={'width': 1100, 'height': 900})
        ctx = await b.new_context(**vp)
        page = await ctx.new_page()
        errs = []
        page.on('pageerror', lambda e: errs.append(str(e)))
        page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        for name in a.names:
            url = f"{a.base}/tools/diagram_preview.html?only={name}&theme={'dark' if a.dark else 'light'}"
            await page.goto(url)
            await page.wait_for_function('window.__ready === true')
            n = await page.evaluate(f"(BB.diagrams['{name}'] || {{steps: []}}).steps.length")
            if not n:
                print('MISSING', name); continue
            steps = range(n) if a.steps else sorted({0, n - 1})
            for s in steps:
                await page.goto(url + f'&step={s}')
                await page.wait_for_function('window.__ready === true')
                await page.wait_for_timeout(350)
                el = await page.query_selector(f'#pv-{name}')
                path = os.path.join(a.out, f"{name}-{'dark' if a.dark else 'light'}-{'phone' if a.phone else 'desk'}-s{s}.png")
                await el.screenshot(path=path)
                print(path)
            ov = await page.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
            if ov: print('OVERFLOW', name)
        for e in errs: print('ERROR', e)
        await b.close()
asyncio.run(main())
