/* Text rendering: tiny inline markup (`code`, **bold**) and glossary auto-linking. */
(function () {
  'use strict';
  const BB = window.BB;
  const { esc } = BB;

  // Words that are glossary terms but also common English (or ambiguous), so they are not auto-linked.
  const STOP = new Set(['read', 'reads', 'print', 'import', 'filter', 'pipe', 'range', 'type', 'key', 'value', 'mean', 'factor', 'library',
    'package', 'prompt', 'condition', 'command', 'option', 'index', 'slice', 'list', 'string', 'method', 'statement', 'expression', 'operator',
    'argument', 'parameter', 'path', 'server', 'cell', 'header', 'archive', 'function', 'loop', 'vector', 'array', 'distribution', 'workflow',
    'pipeline', 'annotation', 'mapping', 'assignment', 'float', 'variable', 'module', 'shell', 'program', 'file', 'folder', 'directory', 'script',
    'terminal', 'code', 'base', 'error', 'exception', 'iteration', 'flag', 'root', 'alpha', 'newline', 'quality control', 'qc', 'pathway', 'expression',
    'true', 'false', 'and', 'or', 'not', 'int', 'str', 'bool', 'dict', 'tar', 'ping', 'sorting', 'condition']);

  let index = null; // { re, map }
  function buildIndex() {
    const map = new Map();
    for (const g of BB.glossary || []) {
      const names = [g.term].concat(g.aka || []);
      for (const n of names) {
        const k = String(n).toLowerCase().trim();
        if (!k || STOP.has(k) || k.length < 2 || map.has(k)) continue;
        map.set(k, { entry: g, exact: n });
      }
    }
    const keys = Array.from(map.keys()).sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const re = keys.length ? new RegExp('(?<![\\w-])(' + keys.join('|') + ')(?![\\w-])', 'gi') : null;
    index = { re, map };
    return index;
  }
  BB.glossaryKey = (g) => g.term.toLowerCase();

  const MAX_LINKS_PER_PARAGRAPH = 3;
  function linkTerms(plainEscaped, used, budget) {
    if (!used) return plainEscaped;
    const idx = index || buildIndex();
    if (!idx.re) return plainEscaped;
    // operate on escaped text; terms contain no characters that escaping changes except '&' (rare)
    return plainEscaped.replace(idx.re, (m) => {
      if (budget.left <= 0) return m;
      const hit = idx.map.get(m.toLowerCase());
      if (!hit) return m;
      if (m.length <= 3 && m !== hit.exact) return m; // short terms (R, QC, FDR) must match case exactly
      const key = BB.glossaryKey(hit.entry);
      if (used.has(key)) return m;
      used.add(key);
      budget.left--;
      return `<button type="button" class="term-link" data-term="${esc(key)}" aria-label="${esc(m)}: open glossary definition">${m}</button>`;
    });
  }

  /* md(text, used?) -> HTML. `used` is a Set shared across a lesson so each term links once. */
  function md(text, used) {
    if (text == null) return '';
    const parts = String(text).split(/(`[^`]+`)/g);
    const budget = { left: MAX_LINKS_PER_PARAGRAPH };
    return parts.map((part) => {
      if (/^`[^`]+`$/.test(part)) return `<code class="inline">${esc(part.slice(1, -1))}</code>`;
      let s = esc(part);
      s = s.replace(/\*\*([^*]+)\*\*/g, (_, b) => `<strong>${b}</strong>`);
      s = linkTerms(s, used, budget);
      return s.replace(/\n/g, '<br>');
    }).join('');
  }

  /* Expand tabs to 8-column stops so TSV and terminal output line up like a real terminal. */
  function expandTabs(s, size = 8) {
    return String(s).split('\n').map((line) => {
      let out = '';
      for (const ch of line) { if (ch === '\t') { const n = size - (out.length % size); out += ' '.repeat(n); } else out += ch; }
      return out;
    }).join('\n');
  }

  BB.md = md;
  BB.expandTabs = expandTabs;
  BB.rebuildGlossaryIndex = buildIndex;
})();
