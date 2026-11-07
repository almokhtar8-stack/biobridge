/* BioBridge teaching shell.
   A safe, in-browser imitation of Bash running on a virtual file system (BB.vfs). It never touches the learner's computer.
   Supports the commands and syntax listed in tools/CONTENT_GUIDE.md. Output formats follow GNU coreutils (C locale). */
(function () {
  'use strict';
  const BB = window.BB = window.BB || {};

  class ShellError extends Error { constructor(msg, status) { super(msg); this.status = status == null ? 2 : status; } }
  class ExitSignal { constructor(status) { this.status = status; } }

  const MAX_STEPS = 20000, MAX_OUT = 200000;
  const SYSTEM_DIRS = ['/', '/bin', '/etc', '/home', '/usr', '/usr/bin', '/var'];

  /* ---------------- Virtual file system ---------------- */
  function mkdirNode(mode, owner) { return { type: 'dir', children: new Map(), mode: mode || 0o755, mtime: Date.now(), owner: owner || 'student' }; }
  function mkfileNode(content, mode, owner) { return { type: 'file', content: content || '', mode: mode || 0o644, mtime: Date.now(), owner: owner || 'student' }; }

  function buildFS(spec) {
    const root = mkdirNode(0o755, 'root');
    const fs = { root };
    const ensureDir = (p) => {
      let node = root;
      for (const part of p.split('/').filter(Boolean)) {
        if (!node.children.has(part)) node.children.set(part, mkdirNode(0o755, 'student'));
        node = node.children.get(part);
      }
      return node;
    };
    for (const d of spec.dirs) ensureDir(d);
    for (const [p, f] of Object.entries(spec.files)) {
      const dir = ensureDir(p.slice(0, p.lastIndexOf('/')) || '/');
      dir.children.set(p.slice(p.lastIndexOf('/') + 1), mkfileNode(f.c, parseInt(f.mode || '644', 8), p.startsWith('/home/student') ? 'student' : 'root'));
    }
    const setOwner = (p, o) => { const n = lookupIn(root, p); if (n) n.owner = o; };
    for (const d of SYSTEM_DIRS) setOwner(d, 'root');
    return fs;
  }
  function lookupIn(root, abs) {
    let node = root;
    for (const part of abs.split('/').filter(Boolean)) {
      if (!node || node.type !== 'dir') return null;
      node = node.children.get(part);
    }
    return node || null;
  }
  function normalize(path) {
    const out = [];
    for (const part of path.split('/')) {
      if (!part || part === '.') continue;
      if (part === '..') out.pop(); else out.push(part);
    }
    return '/' + out.join('/');
  }
  const baseName = (p) => { const s = p.replace(/\/+$/, ''); return s.slice(s.lastIndexOf('/') + 1) || '/'; };
  const dirName = (p) => { const s = p.replace(/\/+$/, ''); const i = s.lastIndexOf('/'); return i <= 0 ? (s.startsWith('/') ? '/' : '.') : s.slice(0, i); };
  const byteLen = (s) => (window.TextEncoder ? new TextEncoder().encode(s).length : s.length);
  const cCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

  /* ---------------- Tokenizer ---------------- */
  function scanBalanced(src, i, open, close) {
    // src[i] is just after the opening token; returns index of the matching close (exclusive start)
    let depth = 1, q = null;
    for (let j = i; j < src.length; j++) {
      const c = src[j];
      if (q) { if (c === '\\' && q === '"') { j++; continue; } if (c === q) q = null; continue; }
      if (c === '\\') { j++; continue; }
      if (c === "'" || c === '"') { q = c; continue; }
      if (src.startsWith(open, j)) { depth++; j += open.length - 1; continue; }
      if (src.startsWith(close, j)) { depth--; if (depth === 0) return j; j += close.length - 1; }
    }
    return -1;
  }
  function readDollar(src, i, q) {
    // src[i] === '$'; returns [part, nextIndex]
    const n = src[i + 1];
    if (src.startsWith('$((', i)) {
      const end = scanBalanced(src, i + 3, '(', ')');
      if (end < 0 || src[end + 1] !== ')') throw new ShellError("syntax error: unmatched '$(('");
      return [{ t: 'arith', expr: src.slice(i + 3, end), q }, end + 2];
    }
    if (n === '(') {
      const end = scanBalanced(src, i + 2, '(', ')');
      if (end < 0) throw new ShellError("syntax error: unexpected end of input while looking for matching ')'");
      return [{ t: 'cmd', src: src.slice(i + 2, end), q }, end + 1];
    }
    if (n === '{') {
      const end = src.indexOf('}', i + 2);
      if (end < 0) throw new ShellError("bad substitution: missing '}'");
      const inner = src.slice(i + 2, end);
      if (inner.startsWith('#')) return [{ t: 'len', name: inner.slice(1), q }, end + 1];
      const m = /^([A-Za-z_][A-Za-z0-9_]*|[0-9]+|[#@*?$])(?::?-(.*))?$/.exec(inner);
      if (!m) throw new ShellError(`\${${inner}}: bad substitution`, 1);
      return [{ t: 'var', name: m[1], dflt: m[2], q }, end + 1];
    }
    const m = /^([A-Za-z_][A-Za-z0-9_]*|[0-9]|[#@*?$])/.exec(src.slice(i + 1));
    if (m) return [{ t: 'var', name: m[1], q }, i + 1 + m[1].length];
    return [{ t: 'lit', v: '$', q }, i + 1];
  }
  function tokenize(src) {
    const toks = [];
    let i = 0, word = null;
    const start = () => (word = word || { type: 'word', parts: [], raw: '', quoted: false });
    const lit = (v, q) => { start(); const last = word.parts[word.parts.length - 1]; if (last && last.t === 'lit' && last.q === q) last.v += v; else word.parts.push({ t: 'lit', v, q }); word.raw += v; };
    const end = () => { if (word) toks.push(word); word = null; };
    while (i < src.length) {
      const c = src[i];
      if (c === ' ' || c === '\t' || c === '\r') { end(); i++; continue; }
      if (c === '\n') { end(); toks.push({ type: 'op', v: '\n' }); i++; continue; }
      if (c === '#' && !word) { while (i < src.length && src[i] !== '\n') i++; continue; }
      if (c === '\\') { if (src[i + 1] === '\n') { i += 2; continue; } if (i + 1 < src.length) lit(src[i + 1], 'single'); start(); word.quoted = true; i += 2; continue; }
      if (c === "'") {
        const j = src.indexOf("'", i + 1);
        if (j < 0) throw new ShellError("unexpected EOF while looking for matching `''");
        start(); word.quoted = true; lit(src.slice(i + 1, j), 'single'); i = j + 1; continue;
      }
      if (c === '"') {
        start(); word.quoted = true; i++;
        let closed = false;
        while (i < src.length) {
          const d = src[i];
          if (d === '"') { closed = true; i++; break; }
          if (d === '\\' && '$`"\\\n'.includes(src[i + 1])) { if (src[i + 1] !== '\n') lit(src[i + 1], 'double'); i += 2; continue; }
          if (d === '$') { const [p, ni] = readDollar(src, i, 'double'); if (p.t === 'lit') lit(p.v, 'double'); else { word.parts.push(p); word.raw += src.slice(i, ni); } i = ni; continue; }
          if (d === '`') { const j = src.indexOf('`', i + 1); if (j < 0) throw new ShellError('unexpected EOF while looking for matching ``\''); word.parts.push({ t: 'cmd', src: src.slice(i + 1, j), q: 'double' }); i = j + 1; continue; }
          lit(d, 'double'); i++;
        }
        if (!closed) throw new ShellError('unexpected EOF while looking for matching `"\'');
        continue;
      }
      if (c === '$' && src[i + 1] === "'") {
        let j = i + 2, v = '';
        for (; j < src.length && src[j] !== "'"; j++) { if (src[j] === '\\' && j + 1 < src.length) { const e = src[++j]; v += { n: '\n', t: '\t', '\\': '\\', "'": "'", r: '\r', '0': '\0' }[e] != null ? { n: '\n', t: '\t', '\\': '\\', "'": "'", r: '\r', '0': '' }[e] : '\\' + e; } else v += src[j]; }
        if (j >= src.length) throw new ShellError("unexpected EOF while looking for matching `''");
        start(); word.quoted = true; lit(v, 'single'); i = j + 1; continue;
      }
      if (c === '$') { const [p, ni] = readDollar(src, i, 'none'); start(); if (p.t === 'lit') lit(p.v, 'none'); else { word.parts.push(p); word.raw += src.slice(i, ni); } i = ni; continue; }
      if (c === '`') { const j = src.indexOf('`', i + 1); if (j < 0) throw new ShellError('unexpected EOF while looking for matching ``\''); start(); word.parts.push({ t: 'cmd', src: src.slice(i + 1, j), q: 'none' }); i = j + 1; continue; }
      if ('|&;<>()'.includes(c)) {
        if (c === '>' && word && word.raw === '2' && !word.quoted && word.parts.length === 1) {
          word = null;
          if (src.startsWith('>&1', i)) { toks.push({ type: 'op', v: '2>&1' }); i += 3; }
          else if (src[i + 1] === '>') { toks.push({ type: 'op', v: '2>>' }); i += 2; }
          else { toks.push({ type: 'op', v: '2>' }); i++; }
          continue;
        }
        end();
        const two = src.substr(i, 2);
        if (['&&', '||', '>>', '&>', ';;'].includes(two)) { toks.push({ type: 'op', v: two }); i += 2; continue; }
        if (two === '>&' && src[i + 2] === '2') { toks.push({ type: 'op', v: '>&2' }); i += 3; continue; }
        toks.push({ type: 'op', v: c }); i++; continue;
      }
      lit(c, 'none'); i++;
    }
    end();
    return toks;
  }

  /* ---------------- Parser ---------------- */
  const REDIR_OPS = ['>', '>>', '<', '2>', '2>>', '&>'];
  function plainWord(t) { return t && t.type === 'word' && t.parts.length === 1 && t.parts[0].t === 'lit' && t.parts[0].q === 'none' ? t.parts[0].v : null; }
  function parse(tokens) {
    let i = 0;
    const peek = () => tokens[i];
    const next = () => tokens[i++];
    const isOp = (t, v) => t && t.type === 'op' && (v === undefined || t.v === v);
    const isKw = (t, v) => plainWord(t) === v;
    const unexpected = (t) => new ShellError(`syntax error near unexpected token \`${t ? (t.type === 'op' ? (t.v === '\n' ? 'newline' : t.v) : t.raw) : 'newline'}'`);
    const expectKw = (v) => { const t = next(); if (!isKw(t, v)) throw unexpected(t); };
    function parseList(terms) {
      const items = [];
      for (;;) {
        while (isOp(peek(), '\n') || isOp(peek(), ';')) next();
        const t = peek();
        if (!t) break;
        if (t.type === 'word' && terms.some((k) => isKw(t, k))) break;
        if (isOp(t, ')')) break;
        items.push(parseAndOr());
        const after = peek();
        if (after && !(isOp(after, '\n') || isOp(after, ';') || isOp(after, ')') || (after.type === 'word' && terms.some((k) => isKw(after, k))))) throw unexpected(after);
      }
      return { type: 'list', items };
    }
    function parseAndOr() {
      const first = parsePipeline();
      const rest = [];
      while (isOp(peek(), '&&') || isOp(peek(), '||')) {
        const op = next().v;
        while (isOp(peek(), '\n')) next();
        rest.push({ op, p: parsePipeline() });
      }
      if (isOp(peek(), '&')) { next(); throw new ShellError('running commands in the background with & is not supported in this practice terminal', 1); }
      return { type: 'andor', first, rest };
    }
    function parsePipeline() {
      let neg = false;
      if (isKw(peek(), '!')) { next(); neg = true; }
      const cmds = [parseCommand()];
      while (isOp(peek(), '|')) { next(); while (isOp(peek(), '\n')) next(); cmds.push(parseCommand()); }
      return { type: 'pipeline', cmds, neg };
    }
    function parseCommand() {
      const t = peek();
      if (!t) throw unexpected(t);
      if (isKw(t, 'for')) return withRedirs(parseFor());
      if (isKw(t, 'if')) return withRedirs(parseIf());
      if (isKw(t, 'while') || isKw(t, 'until')) return withRedirs(parseWhile());
      for (const k of ['do', 'done', 'then', 'fi', 'elif', 'else', 'in']) if (isKw(t, k)) throw unexpected(t);
      return parseSimple();
    }
    function withRedirs(node) {
      node.redirs = [];
      for (;;) {
        const t = peek();
        if (t && t.type === 'op' && REDIR_OPS.includes(t.v)) { next(); const target = next(); if (!target || target.type !== 'word') throw unexpected(target); node.redirs.push({ op: t.v, target }); }
        else if (isOp(t, '2>&1') || isOp(t, '>&2')) { next(); node.redirs.push({ op: t.v }); }
        else break;
      }
      return node;
    }
    function parseSimple() {
      const words = [], redirs = [], assigns = [];
      for (;;) {
        const t = peek();
        if (!t) break;
        if (t.type === 'op') {
          if (REDIR_OPS.includes(t.v)) { next(); const target = next(); if (!target || target.type !== 'word') throw unexpected(target); redirs.push({ op: t.v, target }); continue; }
          if (t.v === '2>&1' || t.v === '>&2') { next(); redirs.push({ op: t.v }); continue; }
          break;
        }
        if (!words.length && t.parts[0] && t.parts[0].t === 'lit' && t.parts[0].q === 'none' && /^[A-Za-z_][A-Za-z0-9_]*=/.test(t.parts[0].v)) {
          const first = t.parts[0].v, eq = first.indexOf('=');
          assigns.push({ name: first.slice(0, eq), value: { type: 'word', parts: [{ t: 'lit', v: first.slice(eq + 1), q: 'none' }].concat(t.parts.slice(1)), raw: '' } });
          next(); continue;
        }
        words.push(next());
      }
      if (!words.length && !assigns.length && !redirs.length) throw unexpected(peek());
      return { type: 'simple', words, redirs, assigns };
    }
    function parseFor() {
      next();
      const nameTok = next();
      const name = plainWord(nameTok);
      if (!name || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new ShellError(`\`${nameTok ? nameTok.raw : ''}': not a valid identifier`);
      let items = null;
      while (isOp(peek(), '\n')) next();
      if (isKw(peek(), 'in')) { next(); items = []; while (peek() && peek().type === 'word') items.push(next()); }
      while (isOp(peek(), ';') || isOp(peek(), '\n')) next();
      expectKw('do');
      const body = parseList(['done']);
      expectKw('done');
      return { type: 'for', name, items, body };
    }
    function parseIf() {
      next();
      const cond = parseList(['then']); expectKw('then');
      const body = parseList(['elif', 'else', 'fi']);
      const elifs = [];
      let elseBody = null;
      while (isKw(peek(), 'elif')) { next(); const c = parseList(['then']); expectKw('then'); elifs.push({ cond: c, body: parseList(['elif', 'else', 'fi']) }); }
      if (isKw(peek(), 'else')) { next(); elseBody = parseList(['fi']); }
      expectKw('fi');
      return { type: 'if', cond, body, elifs, elseBody };
    }
    function parseWhile() {
      const until = plainWord(next()) === 'until';
      const cond = parseList(['do']); expectKw('do');
      const body = parseList(['done']); expectKw('done');
      return { type: 'while', until, cond, body };
    }
    const list = parseList([]);
    if (i < tokens.length) throw unexpected(tokens[i]);
    return list;
  }

  /* ---------------- Arithmetic ---------------- */
  function expandSubst(expr, sh, ctx) {
    let out = '', i = 0;
    while (i < expr.length) {
      if (expr.startsWith('$(', i) && !expr.startsWith('$((', i)) {
        const end = scanBalanced(expr, i + 2, '(', ')');
        if (end < 0) throw new ShellError('syntax error: unmatched $(', 1);
        out += sh.substitute(expr.slice(i + 2, end), ctx).trim();
        i = end + 1;
      } else if (expr[i] === '`') {
        const end = expr.indexOf('`', i + 1);
        if (end < 0) throw new ShellError('syntax error: unmatched `', 1);
        out += sh.substitute(expr.slice(i + 1, end), ctx).trim();
        i = end + 1;
      } else out += expr[i++];
    }
    return out;
  }
  function arith(expr, sh, ctx) {
    expr = expandSubst(expr, sh, ctx);
    const src = expr.replace(/\$\{?([A-Za-z_][A-Za-z0-9_]*|[0-9#?])\}?/g, (_, n) => String(sh.getVar(n, ctx)));
    const toks = src.match(/\s*(\d+|[A-Za-z_][A-Za-z0-9_]*|\*\*|<=|>=|==|!=|&&|\|\||[-+*/%()<>!])\s*/g);
    if (!toks || toks.join('').replace(/\s/g, '') !== src.replace(/\s/g, '')) throw new ShellError(`${expr.trim()}: syntax error in expression`, 1);
    const t = toks.map((x) => x.trim());
    let p = 0;
    const val = (x) => { if (/^\d+$/.test(x)) return parseInt(x, 10); const v = parseInt(sh.getVar(x, ctx), 10); return isNaN(v) ? 0 : v; };
    const prec = { '||': 1, '&&': 2, '==': 3, '!=': 3, '<': 4, '>': 4, '<=': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6, '**': 7 };
    function unary() {
      const x = t[p++];
      if (x === '(') { const v = binary(0); if (t[p++] !== ')') throw new ShellError('syntax error: missing )', 1); return v; }
      if (x === '-') return -unary();
      if (x === '+') return unary();
      if (x === '!') return unary() ? 0 : 1;
      if (x == null) throw new ShellError('syntax error: operand expected', 1);
      return val(x);
    }
    function binary(minP) {
      let left = unary();
      while (p < t.length && prec[t[p]] && prec[t[p]] > minP) {
        const op = t[p++];
        const right = binary(op === '**' ? prec[op] - 1 : prec[op]);
        switch (op) {
          case '+': left = left + right; break; case '-': left = left - right; break; case '*': left = left * right; break;
          case '/': if (right === 0) throw new ShellError('division by 0 (error token is "' + right + '")', 1); left = Math.trunc(left / right); break;
          case '%': if (right === 0) throw new ShellError('division by 0', 1); left = left % right; break;
          case '**': left = Math.pow(left, right); break;
          case '<': left = +(left < right); break; case '>': left = +(left > right); break; case '<=': left = +(left <= right); break; case '>=': left = +(left >= right); break;
          case '==': left = +(left === right); break; case '!=': left = +(left !== right); break;
          case '&&': left = +(left && right); break; case '||': left = +(left || right); break;
        }
      }
      return left;
    }
    const r = binary(0);
    if (p < t.length) throw new ShellError(`${expr.trim()}: syntax error in expression`, 1);
    return r;
  }

  /* ---------------- Glob ---------------- */
  function globToRe(pat) {
    let re = '', i = 0;
    while (i < pat.length) {
      const c = pat[i];
      if (c === '\\') { re += '\\' + (pat[i + 1] || ''); i += 2; continue; }
      if (c === '*') re += '[^/]*';
      else if (c === '?') re += '[^/]';
      else if (c === '[') {
        const j = pat.indexOf(']', i + 2);
        if (j < 0) re += '\\[';
        else { let cls = pat.slice(i + 1, j); if (cls[0] === '!') cls = '^' + cls.slice(1); re += '[' + cls.replace(/\\/g, '\\\\') + ']'; i = j; }
      } else re += c.replace(/[.+^${}()|\]\\]/g, '\\$&');
      i++;
    }
    return new RegExp('^' + re + '$');
  }
  const hasGlob = (pat) => /(^|[^\\])[*?[]/.test(pat);

  /* ---------------- Option parsing ---------------- */
  function getopt(args, flags, withValue, cmd) {
    const opts = {}, rest = [];
    let i = 0;
    for (; i < args.length; i++) {
      const a = args[i];
      if (a === '--') { i++; break; }
      if (a === '--help') { opts.help = true; continue; }
      if (a.startsWith('--')) throw new ShellError(`${cmd}: unrecognized option '${a}'\nTry '${cmd} --help' for more information.`, cmd === 'ls' ? 2 : 1);
      if (a.length > 1 && a[0] === '-') {
        for (let k = 1; k < a.length; k++) {
          const f = a[k];
          if (withValue.includes(f)) {
            const v = a.slice(k + 1) || args[++i];
            if (v == null) throw new ShellError(`${cmd}: option requires an argument -- '${f}'\nTry '${cmd} --help' for more information.`, 1);
            (opts[f] = opts[f] || []).push(v);
            break;
          } else if (flags.includes(f)) opts[f] = (opts[f] || 0) + 1;
          else throw new ShellError(`${cmd}: invalid option -- '${f}'\nTry '${cmd} --help' for more information.`, cmd === 'ls' ? 2 : 1);
        }
      } else rest.push(a);
    }
    return { opts, args: rest.concat(args.slice(i)) };
  }
  const last = (arr) => (arr ? arr[arr.length - 1] : undefined);
  const splitLines = (text) => { if (!text) return []; const lines = text.split('\n'); if (lines[lines.length - 1] === '') lines.pop(); return lines; };
  const joinLines = (lines) => (lines.length ? lines.join('\n') + '\n' : '');
  function humanSize(n) {
    if (n < 1024) return String(n);
    const units = ['K', 'M', 'G', 'T'];
    let v = n / 1024, u = 0;
    while (v >= 1024 && u < units.length - 1) { v /= 1024; u++; }
    return v < 10 ? (Math.ceil(v * 10) / 10).toFixed(1) + units[u] : Math.ceil(v) + units[u];
  }
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const pad2 = (n) => String(n).padStart(2, '0');
  function lsDate(ms) { const d = new Date(ms); return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }
  function modeString(node) {
    const m = node.mode, s = node.type === 'dir' ? 'd' : '-';
    const bits = 'rwxrwxrwx';
    let out = s;
    for (let k = 0; k < 9; k++) out += (m & (1 << (8 - k))) ? bits[k] : '-';
    return out;
  }
  function nodeSize(node) {
    if (node.type === 'dir') return 4096;
    if (node.gz || node.archive) return Math.max(20, Math.round(byteLen(node.content) * 0.38) + 20);
    return byteLen(node.content);
  }

  /* ---------------- Manual pages (short) ---------------- */
  const MAN = {
    pwd: ['print name of current/working directory', 'pwd', 'Prints the absolute path of the directory you are in.'],
    ls: ['list directory contents', 'ls [OPTION]... [FILE]...', 'Lists files and folders. -l long format (permissions, owner, size, date); -a include hidden files that start with a dot; -h human-readable sizes with -l; -1 one name per line; -R recursive; -t sort by time; -S sort by size; -r reverse order; -d list a directory itself, not its contents.'],
    cd: ['change the working directory (shell builtin)', 'cd [DIR]', 'cd with no argument goes to your home directory. `cd ..` goes up one level, `cd -` returns to the previous directory, `cd ~` goes home.'],
    mkdir: ['make directories', 'mkdir [-p] DIRECTORY...', 'Creates folders. -p creates parent folders as needed and does not complain if the folder exists.'],
    rmdir: ['remove empty directories', 'rmdir DIRECTORY...', 'Removes folders only if they are empty.'],
    touch: ['change file timestamps', 'touch FILE...', 'Updates the modification time of a file, creating an empty file if it does not exist.'],
    cp: ['copy files and directories', 'cp [-r] SOURCE... DEST', 'Copies files. -r copies folders and everything inside them. If DEST is a folder, the copies go inside it.'],
    mv: ['move (rename) files', 'mv SOURCE... DEST', 'Moves or renames files and folders. Moving onto an existing file name replaces that file without asking.'],
    rm: ['remove files or directories', 'rm [-r] [-f] FILE...', 'Deletes files permanently (there is no recycle bin). -r deletes folders and their contents; -f ignores missing files and never asks.'],
    cat: ['concatenate files and print on the standard output', 'cat [-n] [FILE]...', 'Prints files one after another. -n numbers the lines. With no FILE, reads standard input.'],
    less: ['view a file one screen at a time', 'less FILE', 'On a real system less is interactive (Space for next page, q to quit). This practice terminal prints the whole file.'],
    more: ['view a file one screen at a time', 'more FILE', 'An older pager, similar to less. This practice terminal prints the whole file.'],
    head: ['output the first part of files', 'head [-n N] [FILE]...', 'Prints the first 10 lines, or the first N lines with -n N.'],
    tail: ['output the last part of files', 'tail [-n N] [FILE]...', 'Prints the last 10 lines, or the last N lines with -n N. `tail -n +K` prints from line K to the end (handy for skipping a header).'],
    wc: ['print newline, word, and byte counts', 'wc [-l] [-w] [-c] [FILE]...', 'Counts lines (-l), words (-w) and bytes (-c). With no option prints all three.'],
    grep: ['print lines that match patterns', 'grep [OPTION]... PATTERN [FILE]...', 'Prints lines containing PATTERN. -i ignore case; -v invert (non-matching lines); -c count matching lines; -n show line numbers; -w whole words only; -o print only the matching part; -E extended regular expressions; -F fixed string (no special characters). Exit status 0 if something matched, 1 if nothing matched, 2 on error.'],
    sort: ['sort lines of text files', 'sort [OPTION]... [FILE]...', 'Sorts lines. -n numeric; -r reverse; -u unique; -k POS1[,POS2] sort by fields (columns), e.g. -k2,2n; -t SEP field separator.'],
    uniq: ['report or omit repeated lines', 'uniq [-c] [-d] [-u] [INPUT]', 'Removes ADJACENT duplicate lines, so sort first. -c prefixes counts; -d prints only duplicated lines; -u only unique ones.'],
    cut: ['remove sections from each line of files', 'cut -f LIST [-d DELIM] [FILE]...', 'Prints selected fields (columns). -f 1,3 or -f 2-4 selects fields; -d sets the delimiter (default TAB); -c selects characters.'],
    paste: ['merge lines of files', 'paste [-d DELIM] [-s] FILE...', 'Joins lines from files side by side, separated by TAB.'],
    tr: ['translate or delete characters', 'tr [-d] [-s] SET1 [SET2]', 'Replaces characters in SET1 with SET2 (e.g. tr a-z A-Z). -d deletes characters; -s squeezes repeats. Reads standard input only.'],
    echo: ['display a line of text', 'echo [-n] [-e] [STRING]...', 'Prints its arguments. -n no trailing newline; -e interpret \\n and \\t.'],
    printf: ['format and print data', 'printf FORMAT [ARGUMENT]...', 'Prints formatted text, e.g. printf "%s has %d reads\\n" ctrl_1 18400000.'],
    chmod: ['change file mode bits', 'chmod MODE FILE...', 'Changes permissions. Symbolic: u+x, g-w, o=r, a+r, +x. Numeric: 755 (rwxr-xr-x), 644 (rw-r--r--).'],
    find: ['search for files in a directory hierarchy', 'find [PATH...] [-name PATTERN] [-type f|d]', 'Lists files and folders below PATH. -name "*.tsv" matches names (quote the pattern); -type f files only, -type d folders only.'],
    basename: ['strip directory and suffix from filenames', 'basename NAME [SUFFIX]', 'basename /a/b/counts.tsv .tsv prints counts.'],
    dirname: ['strip last component from file name', 'dirname NAME', 'dirname /a/b/counts.tsv prints /a/b.'],
    seq: ['print a sequence of numbers', 'seq [FIRST [INCREMENT]] LAST', 'seq 3 prints 1 2 3 on separate lines.'],
    which: ['locate a command', 'which COMMAND', 'Shows the full path of an external command.'],
    man: ['an interface to the system reference manuals', 'man COMMAND', 'Shows the manual page for a command. Press q to quit on a real system.'],
    history: ['show command history (shell builtin)', 'history', 'Lists commands you typed. Use the Up arrow to recall them.'],
    clear: ['clear the terminal screen', 'clear', 'Clears the screen.'],
    whoami: ['print effective user name', 'whoami', 'Prints your user name.'],
    id: ['print user and group ids', 'id', 'Prints your user id, group id and groups.'],
    hostname: ['show the system host name', 'hostname', 'Prints the name of this computer.'],
    uname: ['print system information', 'uname [-a] [-r] [-s] [-n] [-m]', 'Prints the kernel name; -a prints everything.'],
    date: ['print the system date and time', 'date [+FORMAT]', 'Prints the date and time. date +%Y-%m-%d prints e.g. 2026-11-07.'],
    df: ['report file system disk space usage', 'df [-h]', 'Shows disk usage of mounted file systems; -h human-readable.'],
    du: ['estimate file space usage', 'du [-s] [-h] [FILE]...', 'Shows how much space files and folders use; -s summary; -h human-readable.'],
    ps: ['report a snapshot of the current processes', 'ps', 'Lists running processes.'],
    top: ['display Linux processes', 'top', 'Interactive, live view of processes on a real system. This terminal shows one snapshot.'],
    gzip: ['compress files', 'gzip [-k] [-d] FILE...', 'Compresses FILE into FILE.gz (and removes the original unless -k). -d decompresses.'],
    gunzip: ['decompress files', 'gunzip FILE.gz', 'Restores FILE from FILE.gz.'],
    zcat: ['print compressed files', 'zcat FILE.gz', 'Prints the decompressed content without changing the file.'],
    tar: ['an archiving utility', 'tar -c|-x|-t [-z] [-v] -f ARCHIVE [FILE]...', 'Bundles files into one archive. -c create, -x extract, -t list, -z gzip compression, -v verbose, -f archive file name. Example: tar -czvf data.tar.gz data'],
    zip: ['package and compress files', 'zip [-r] ARCHIVE.zip FILE...', 'Creates a .zip archive; -r includes folders recursively.'],
    unzip: ['extract files from a zip archive', 'unzip [-l] ARCHIVE.zip', 'Extracts the archive; -l lists its contents.'],
    nano: ['a simple text editor', 'nano FILE', 'Opens FILE for editing. In this practice terminal, a simple editor window opens; Save writes the file.'],
    crontab: ['maintain crontab files', 'crontab [-l] [-e] [-r]', '-l lists your scheduled jobs; -e edits them; -r removes them. Each line: minute hour day-of-month month day-of-week command.'],
    bash: ['the GNU Bourne-Again SHell', 'bash SCRIPT [ARGUMENT]...', 'Runs the commands in SCRIPT. Arguments are available inside the script as $1, $2 and so on.'],
    source: ['run a script in the current shell', 'source FILE', 'Runs FILE without starting a new shell, so variables and cd changes stay.'],
    export: ['set environment variables', 'export NAME=VALUE', 'Makes a variable available to programs and scripts started from this shell.'],
    file: ['determine file type', 'file FILE...', 'Guesses what kind of data a file contains.'],
    test: ['check file types and compare values', 'test EXPRESSION  or  [ EXPRESSION ]', '-f FILE exists and is a file; -d folder; -e exists; -s not empty; -x executable; -z empty string; -n non-empty; = and != compare text; -eq -ne -lt -le -gt -ge compare numbers.'],
    read: ['read a line from standard input', 'read NAME...', 'Reads one line into variables. Often used as: while read line; do ...; done < file'],
    curl: ['transfer data from or to a server', 'curl [-o FILE] URL', 'Downloads data from a URL. Not available here: this practice terminal has no network.'],
    wget: ['the non-interactive network downloader', 'wget URL', 'Downloads files from the web. Not available here: no network.'],
    ping: ['send ICMP ECHO_REQUEST to network hosts', 'ping HOST', 'Checks whether another computer answers over the network. Not available here: no network.']
  };
  const manPage = (c) => { const m = MAN[c]; if (!m) return null; return `${c.toUpperCase()}(1)\n\nNAME\n       ${c} - ${m[0]}\n\nSYNOPSIS\n       ${m[1]}\n\nDESCRIPTION\n       ${m[2].replace(/`/g, '')}\n\n(BioBridge short manual. Real manual pages are longer: on a Linux system type man ${c}.)\n`; };

  const NO_NET = (c) => `${c}: this practice terminal has no network connection.\n(BioBridge: on a real Linux server, ${c} ${({ curl: 'downloads data from a URL, e.g. curl -O https://example.org/genome.fa.gz', wget: 'downloads files from the web, e.g. wget https://example.org/reads.fastq.gz', ping: 'checks whether another computer answers over the network', ifconfig: 'shows network interfaces and IP addresses (newer systems use ip addr)', ip: 'shows and configures network interfaces', ssh: 'opens a secure terminal on a remote server', scp: 'copies files to or from a remote server', rsync: 'synchronizes files between computers' })[c] || 'needs a network connection'}.)\n`;

  /* ---------------- The shell ---------------- */
  class Shell {
    constructor(spec) {
      spec = spec || BB.vfs;
      this.spec = spec;
      this.fs = buildFS(spec);
      this.home = spec.home;
      this.user = spec.user;
      this.host = spec.host;
      this.cwd = spec.home;
      this.vars = { HOME: spec.home, USER: spec.user, LOGNAME: spec.user, PWD: spec.home, OLDPWD: spec.home, SHELL: '/bin/bash', PATH: '/usr/local/bin:/usr/bin:/bin', HOSTNAME: spec.host, LANG: 'C.UTF-8' };
      this.exported = new Set(['HOME', 'USER', 'LOGNAME', 'PWD', 'OLDPWD', 'SHELL', 'PATH', 'LANG']);
      this.aliases = { ll: 'ls -l' };
      this.history = [];
      this.status = 0;
      this.columns = 80;
      this.crontab = null;
      this.ran = [];
      this.steps = 0;
      this.outLen = 0;
      this.editRequest = null;
      this.clearRequest = false;
    }
    /* ---- paths ---- */
    getCwd(ctx) { return ctx && ctx.cwdBox ? ctx.cwdBox.v : this.cwd; }
    abs(p, ctx) {
      const cwd = this.getCwd(ctx);
      if (p === '~' || p.startsWith('~/')) p = this.home + p.slice(1);
      return normalize(p.startsWith('/') ? p : cwd + '/' + p);
    }
    node(p, ctx) { return lookupIn(this.fs.root, this.abs(p, ctx)); }
    writable(abs) { return abs === this.home || abs.startsWith(this.home + '/') || abs === '/tmp' || abs.startsWith('/tmp/'); }
    parentDir(abs) { return lookupIn(this.fs.root, dirName(abs)); }
    displayPath(abs) { return abs === this.home ? '~' : abs.startsWith(this.home + '/') ? '~' + abs.slice(this.home.length) : abs; }
    prompt() { return `${this.user}@${this.host}:${this.displayPath(this.cwd)}$`; }
    readFile(p, ctx, cmd) {
      const n = this.node(p, ctx);
      if (!n) throw new ShellError(`${cmd}: ${p}: No such file or directory`, 1);
      if (n.type === 'dir') throw new ShellError(`${cmd}: ${p}: Is a directory`, 1);
      if (n.gz || n.archive) return n.binaryView || '\u001f\u008b\b\u0000\u0000\u0000\u0000\u0000\u0000\u0003í½Û\u0092äÆ\n';
      return n.content;
    }
    writeFile(abs, content, append, cmd) {
      const parent = this.parentDir(abs);
      if (!parent || parent.type !== 'dir') throw new ShellError(`${cmd || 'bash'}: ${abs}: No such file or directory`, 1);
      if (!this.writable(abs)) throw new ShellError(`${cmd || 'bash'}: ${abs}: Permission denied`, 1);
      const name = baseName(abs);
      const existing = parent.children.get(name);
      if (existing && existing.type === 'dir') throw new ShellError(`${cmd || 'bash'}: ${abs}: Is a directory`, 1);
      if (existing) { existing.content = append ? existing.content + content : content; existing.mtime = Date.now(); existing.gz = false; existing.archive = null; }
      else parent.children.set(name, mkfileNode(content, 0o644));
    }
    getVar(name, ctx) {
      const args = (ctx && ctx.args) || [];
      if (/^\d+$/.test(name)) return name === '0' ? ((ctx && ctx.scriptName) || 'bash') : (args[+name - 1] || '');
      if (name === '#') return String(args.length);
      if (name === '@' || name === '*') return args.join(' ');
      if (name === '?') return String(this.status);
      if (name === '$') return '4242';
      if (name === 'PWD') return this.getCwd(ctx);
      const scope = (ctx && ctx.vars) || this.vars;
      return scope[name] != null ? String(scope[name]) : '';
    }
    setVar(name, value, ctx) { const scope = (ctx && ctx.vars) || this.vars; scope[name] = value; }

    /* ---- public entry point ---- */
    run(line, opts = {}) {
      const chunks = [];
      this.ran = [];
      this.steps = 0;
      this.outLen = 0;
      this.editRequest = null;
      this.clearRequest = false;
      this.outLimitHit = false;
      const push = (s, cls) => {
        if (!s || this.outLimitHit) return;
        this.outLen += s.length;
        if (this.outLen > MAX_OUT) { this.outLimitHit = true; chunks.push({ s: '\n(BioBridge: output stopped because this command printed more than the practice terminal shows at once.)\n', cls: 'sys' }); throw new ShellError('output limit reached', 1); }
        chunks.push({ s, cls });
      };
      const ctx = { cwdBox: null, vars: this.vars, args: [], stdin: null, out: (s) => push(s, 'out'), err: (s) => push(s, 'err'), tty: true, interactive: true, depth: 0 };
      let status = 0;
      if (line.trim()) this.history.push(line);
      try {
        const ast = parse(tokenize(line));
        status = this.execList(ast, ctx);
      } catch (e) {
        if (e instanceof ExitSignal) { status = e.status; push('exit\n(BioBridge: the practice terminal stays open. Use Reset to start again from the original files.)\n', 'sys'); }
        else if (e instanceof ShellError) { push('bash: ' + e.message.replace(/^bash: /, '') + '\n', 'err'); status = e.status; }
        else { push('bash: internal simulator error: ' + e.message + '\n', 'err'); status = 1; console.error(e); }
      }
      this.status = status;
      return { chunks, status, ran: this.ran.slice(), cwd: this.cwd, edit: this.editRequest, clear: this.clearRequest };
    }

    /* ---- execution ---- */
    execList(list, ctx) {
      let st = 0;
      for (const item of list.items) st = this.execAndOr(item, ctx);
      return st;
    }
    execAndOr(node, ctx) {
      let st = this.execPipeline(node.first, ctx);
      for (const r of node.rest) if ((r.op === '&&' && st === 0) || (r.op === '||' && st !== 0)) st = this.execPipeline(r.p, ctx);
      this.status = st;
      return st;
    }
    execPipeline(node, ctx) {
      let st;
      if (node.cmds.length === 1) st = this.execCommand(node.cmds[0], ctx);
      else {
        let data = ctx.stdin;
        node.cmds.forEach((cmd, i) => {
          const isLast = i === node.cmds.length - 1;
          const buf = [];
          const sub = Object.assign({}, ctx, { stdin: data, out: isLast ? ctx.out : (s) => buf.push(s), tty: isLast ? ctx.tty : false, piped: !isLast });
          st = this.execCommand(cmd, sub);
          if (!isLast) data = { text: buf.join(''), pos: 0 };
        });
        this.ran.push({ pipeline: node.cmds.map((c) => (c.type === 'simple' && c.words[0] ? plainWord(c.words[0]) || c.words[0].raw : c.type)) });
      }
      if (node.neg) st = st === 0 ? 1 : 0;
      this.status = st;
      return st;
    }
    tick() { if (++this.steps > MAX_STEPS) throw new ShellError('the practice terminal stopped a loop that ran more than 20,000 steps (is the loop condition ever false?)', 1); }
    withRedirections(redirs, ctx, fn) {
      let io = Object.assign({}, ctx);
      const pending = [];
      for (const r of redirs || []) {
        if (r.op === '2>&1') { io.err = io.out; continue; }
        if (r.op === '>&2') { io.out = io.err; continue; }
        const fields = this.expandWord(r.target, ctx);
        if (fields.length !== 1) throw new ShellError(`${r.target.raw}: ambiguous redirect`, 1);
        const target = fields[0];
        if (r.op === '<') {
          const n = this.node(target, ctx);
          if (!n) throw new ShellError(`${target}: No such file or directory`, 1);
          if (n.type === 'dir') throw new ShellError(`${target}: Is a directory`, 1);
          io.stdin = { text: n.content, pos: 0, regular: true, size: byteLen(n.content) };
          continue;
        }
        if (target === '/dev/null') { if (r.op === '2>' || r.op === '2>>') io.err = () => {}; else if (r.op === '&>') { io.out = () => {}; io.err = () => {}; } else io.out = () => {}; continue; }
        const abs = this.abs(target, ctx);
        const append = r.op === '>>' || r.op === '2>>';
        const parent = this.parentDir(abs);
        if (!parent || parent.type !== 'dir') throw new ShellError(`${target}: No such file or directory`, 1);
        const existing = lookupIn(this.fs.root, abs);
        if (existing && existing.type === 'dir') throw new ShellError(`${target}: Is a directory`, 1);
        if (!this.writable(abs)) throw new ShellError(`${target}: Permission denied`, 1);
        this.writeFile(abs, '', true); // create if missing
        if (!append) this.writeFile(abs, '', false); // truncate BEFORE the command runs, exactly like bash
        const buf = [];
        pending.push(() => this.writeFile(abs, buf.join(''), true));
        if (r.op === '2>' || r.op === '2>>') io.err = (s) => buf.push(s);
        else if (r.op === '&>') { io.out = (s) => buf.push(s); io.err = (s) => buf.push(s); }
        else { io.out = (s) => buf.push(s); io.tty = false; }
      }
      try { return fn(io); }
      finally { for (const p of pending) p(); }
    }
    execCommand(node, ctx) {
      this.tick();
      if (node.type === 'simple') return this.execSimple(node, ctx);
      try { return this.execCompound(node, ctx); }
      catch (e) { if (e instanceof ShellError) { ctx.err('bash: ' + e.message.replace(/^bash: /, '').replace(/\n?$/, '\n')); return e.status; } throw e; }
    }
    execCompound(node, ctx) {
      return this.withRedirections(node.redirs, ctx, (io) => {
        if (node.type === 'for') {
          const items = node.items ? node.items.flatMap((w) => this.expandWord(w, io)) : ((io.args) || []);
          let st = 0;
          for (const it of items) { this.tick(); this.setVar(node.name, it, io); st = this.execList(node.body, io); }
          return st;
        }
        if (node.type === 'if') {
          if (this.execList(node.cond, io) === 0) return this.execList(node.body, io);
          for (const e of node.elifs) if (this.execList(e.cond, io) === 0) return this.execList(e.body, io);
          return node.elseBody ? this.execList(node.elseBody, io) : 0;
        }
        if (node.type === 'while') {
          let st = 0;
          for (;;) {
            this.tick();
            const c = this.execList(node.cond, io);
            if (node.until ? c === 0 : c !== 0) break;
            st = this.execList(node.body, io);
          }
          return st;
        }
        throw new ShellError('unsupported command structure');
      });
    }
    execSimple(node, ctx) {
      let argv = node.words.flatMap((w) => this.expandWord(w, ctx));
      if (ctx.interactive && argv.length && this.aliases[argv[0]] && node.words[0] && !node.words[0].quoted) {
        argv = this.aliases[argv[0]].split(' ').concat(argv.slice(1));
      }
      if (!argv.length) {
        for (const a of node.assigns) this.setVar(a.name, this.expandWord(a.value, ctx, true).join(' '), ctx);
        if (node.redirs.length) return this.withRedirections(node.redirs, ctx, () => 0);
        return 0;
      }
      const envOverride = node.assigns.length ? Object.fromEntries(node.assigns.map((a) => [a.name, this.expandWord(a.value, ctx, true).join(' ')])) : null;
      const name = argv[0];
      this.ran.push({ name, args: argv.slice(1), line: argv.join(' ') });
      try {
        return this.withRedirections(node.redirs, ctx, (io) => {
          const sub = envOverride ? Object.assign({}, io, { vars: Object.assign(Object.create(null), io.vars || this.vars, envOverride) }) : io;
          try { return this.invoke(name, argv.slice(1), sub); }
          catch (e) {
            if (e instanceof ShellError) { sub.err(e.message.replace(/\n?$/, '\n')); return e.status; }
            throw e;
          }
        });
      } catch (e) {
        if (e instanceof ShellError) { ctx.err('bash: ' + e.message.replace(/^bash: /, '').replace(/\n?$/, '\n')); return e.status; }
        throw e;
      }
    }

    /* ---- expansion ---- */
    expandWord(word, ctx, noSplit) {
      // Special case: "$@" alone expands to separate fields
      if (word.parts.length === 1 && word.parts[0].t === 'var' && word.parts[0].name === '@' && word.parts[0].q === 'double') return ((ctx && ctx.args) || []).slice();
      const segs = [];
      word.parts.forEach((p, idx) => {
        if (p.t === 'lit') {
          let v = p.v;
          if (idx === 0 && p.q === 'none' && (v === '~' || v.startsWith('~/'))) v = this.home + v.slice(1);
          segs.push({ s: v, quoted: p.q !== 'none', exp: false });
        } else if (p.t === 'var') {
          let v = this.getVar(p.name, ctx);
          if (v === '' && p.dflt != null) v = p.dflt;
          segs.push({ s: v, quoted: p.q === 'double', exp: true });
        } else if (p.t === 'len') segs.push({ s: String(this.getVar(p.name, ctx).length), quoted: true, exp: true });
        else if (p.t === 'cmd') segs.push({ s: this.substitute(p.src, ctx).replace(/\n+$/, ''), quoted: p.q === 'double', exp: true });
        else if (p.t === 'arith') segs.push({ s: String(arith(p.expr, this, ctx)), quoted: p.q === 'double', exp: true });
      });
      // field splitting on unquoted expansion results
      const fields = [];
      let cur = null; // { text, pat, globbable }
      const add = (text, pat, glob) => { cur = cur || { text: '', pat: '', glob: false }; cur.text += text; cur.pat += pat; cur.glob = cur.glob || glob; };
      const escPat = (s) => s.replace(/[*?[\]\\]/g, '\\$&');
      for (const sg of segs) {
        if (sg.exp && !sg.quoted && !noSplit) {
          const pieces = sg.s.split(/[ \t\n]+/);
          pieces.forEach((pc, k) => {
            if (k > 0) { if (cur) fields.push(cur); cur = null; }
            if (pc !== '') add(pc, pc, hasGlob(pc));
          });
        } else if (sg.quoted) add(sg.s, escPat(sg.s), false);
        else add(sg.s, sg.s, hasGlob(sg.s));
      }
      if (cur) fields.push(cur);
      if (!fields.length && word.quoted) return [''];
      const out = [];
      for (const f of fields) {
        if (f.glob && !noSplit) { const m = this.glob(f.pat, ctx); if (m.length) { out.push(...m); continue; } }
        out.push(f.text);
      }
      return out;
    }
    substitute(src, ctx) {
      const buf = [];
      const sub = Object.assign({}, ctx, { out: (s) => buf.push(s), tty: false, cwdBox: { v: this.getCwd(ctx) }, stdin: null, interactive: false, depth: (ctx.depth || 0) + 1 });
      if (sub.depth > 40) throw new ShellError('maximum nesting level exceeded', 1);
      this.execList(parse(tokenize(src)), sub);
      return buf.join('');
    }
    glob(pattern, ctx) {
      const absolute = pattern.startsWith('/');
      const parts = pattern.split('/').filter((p, i) => p !== '' || i === 0);
      let bases = [absolute ? '/' : ''];
      const cwd = this.getCwd(ctx);
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === '' && i === 0) continue;
        const nextBases = [];
        for (const b of bases) {
          const dirAbs = normalize(absolute ? (b || '/') : cwd + '/' + b);
          if (!hasGlob(part)) { const lit = part.replace(/\\(.)/g, '$1'); const candidate = b === '' ? lit : (b.endsWith('/') ? b + lit : b + '/' + lit); if (lookupIn(this.fs.root, normalize(absolute ? candidate : cwd + '/' + candidate))) nextBases.push(candidate); continue; }
          const dir = lookupIn(this.fs.root, dirAbs);
          if (!dir || dir.type !== 'dir') continue;
          const re = globToRe(part);
          const names = Array.from(dir.children.keys()).filter((n) => (n.startsWith('.') ? part.startsWith('.') : true) && re.test(n)).sort(cCompare);
          for (const n of names) nextBases.push(b === '' ? n : (b.endsWith('/') ? b + n : b + '/' + n));
        }
        bases = nextBases;
        if (!bases.length) break;
      }
      return bases.filter((b) => b !== '' && b !== '/').sort(cCompare);
    }

    /* ---- command dispatch ---- */
    invoke(name, args, io) {
      if (name.includes('/')) return this.runScriptPath(name, args, io);
      const fn = COMMANDS[name];
      if (fn) {
        if (args.includes('--help') && MAN[name]) { io.out(manPage(name)); return 0; }
        return fn.call(this, args, io, name);
      }
      if (NET.includes(name)) { io.err(NO_NET(name)); return name === 'ping' ? 2 : 1; }
      if (NOT_SIM[name]) { io.err(`bash: ${name}: not available in this practice terminal\n(BioBridge: ${NOT_SIM[name]})\n`); return 127; }
      const suggestion = Object.keys(COMMANDS).find((c) => lev(c, name) === 1 && c.length > 1);
      io.err(`bash: ${name}: command not found\n` + (suggestion ? `(BioBridge: did you mean ${suggestion}? Type help to list the supported commands.)\n` : '(BioBridge: type help to list the commands this practice terminal supports.)\n'));
      return 127;
    }
    runScriptPath(path, args, io) {
      const abs = this.abs(path, io);
      const n = lookupIn(this.fs.root, abs);
      if (!n) { io.err(`bash: ${path}: No such file or directory\n`); return 127; }
      if (n.type === 'dir') { io.err(`bash: ${path}: Is a directory\n`); return 126; }
      if (!(n.mode & 0o100)) { io.err(`bash: ${path}: Permission denied\n(BioBridge: the file is not executable. Check with ls -l and add permission with chmod +x ${path}, or run it with bash ${path}.)\n`); return 126; }
      return this.runScript(abs, path, args, io, false);
    }
    runScript(abs, shown, args, io, inCurrent) {
      const n = lookupIn(this.fs.root, abs);
      const text = n.content;
      const first = text.split('\n')[0];
      if (first.startsWith('#!') && !/\b(ba)?sh\b/.test(first)) { io.err(`${shown}: this practice terminal can only run shell scripts (the first line asks for ${first.slice(2).trim()}).\n`); return 126; }
      const childVars = inCurrent ? io.vars || this.vars : Object.assign(Object.create(null), Object.fromEntries([...this.exported].map((k) => [k, this.vars[k]])));
      const depth = (io.depth || 0) + 1;
      if (depth > 40) throw new ShellError(`${shown}: maximum script nesting level exceeded (does the script run itself?)`, 1);
      const ctx = Object.assign({}, io, { vars: childVars, args: inCurrent ? io.args : args, scriptName: shown, interactive: false, depth, cwdBox: inCurrent ? io.cwdBox : { v: this.getCwd(io) } });
      let st = 0;
      try { st = this.execList(parse(tokenize(text)), ctx); }
      catch (e) {
        if (e instanceof ExitSignal) st = e.status;
        else if (e instanceof ShellError) { io.err(`${shown}: ${e.message}\n`); st = e.status; }
        else throw e;
      }
      return st;
    }
  }

  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  const NET = ['curl', 'wget', 'ping', 'ifconfig', 'ip', 'ssh', 'scp', 'rsync'];
  const NOT_SIM = {
    awk: 'awk is a small text-processing language used in many bioinformatics one-liners. It is real and worth learning later, but it is not simulated here.',
    sed: 'sed edits text streams (for example find-and-replace). It is not simulated here.',
    python: 'use the Python labs, which run real Python in your browser.', python3: 'use the Python labs, which run real Python in your browser.',
    R: 'R is not available in this terminal. The R lessons show verified R output.', Rscript: 'R is not available in this terminal.',
    apt: 'installing software is not simulated. On Ubuntu, sudo apt install PACKAGE downloads and installs software (administrator rights needed).',
    'apt-get': 'installing software is not simulated. On Ubuntu, sudo apt-get install PACKAGE installs software.',
    yum: 'installing software is not simulated. Red Hat style systems use yum or dnf install PACKAGE.', dnf: 'installing software is not simulated.',
    sudo: 'student is not allowed to use sudo on this practice server. On your own machine, sudo runs one command as the administrator (root), so use it carefully.',
    su: 'switching users is not simulated.', kill: 'process control is not simulated here.', jobs: 'background jobs are not simulated here.', set: 'the set builtin is not simulated here.'
  };

  /* ---------------- Commands ---------------- */
  const COMMANDS = {};
  const def = (names, fn) => names.split(' ').forEach((n) => (COMMANDS[n] = fn));
  function readInputs(sh, files, io, cmd) {
    // returns array of {name, text, ok}
    if (!files.length || (files.length === 1 && files[0] === '-')) {
      const s = io.stdin;
      if (!s) return [{ name: '-', text: '', ok: true, stdin: true }];
      const text = s.text.slice(s.pos); s.pos = s.text.length;
      return [{ name: '-', text, ok: true, stdin: true, regular: s.regular, size: s.size }];
    }
    return files.map((f) => {
      try { return { name: f, text: sh.readFile(f, io, cmd), ok: true, size: byteLen(sh.node(f, io).content), regular: true }; }
      catch (e) { io.err(e.message + '\n'); return { name: f, ok: false }; }
    });
  }
  const ensureNL = (t) => (t && !t.endsWith('\n') ? t + '\n' : t);

  def('pwd', function (args, io) { io.out(this.getCwd(io) + '\n'); return 0; });
  def('cd', function (args, io) {
    let target = args[0];
    if (args.length > 1) throw new ShellError('bash: cd: too many arguments', 1);
    if (!target || target === '~') target = this.home;
    if (target === '-') { target = this.vars.OLDPWD || this.home; io.out(target + '\n'); }
    const abs = this.abs(target, io);
    const n = lookupIn(this.fs.root, abs);
    if (!n) throw new ShellError(`bash: cd: ${args[0]}: No such file or directory`, 1);
    if (n.type !== 'dir') throw new ShellError(`bash: cd: ${args[0]}: Not a directory`, 1);
    if (io.cwdBox) { io.cwdBox.v = abs; return 0; }
    this.vars.OLDPWD = this.cwd; this.cwd = abs; this.vars.PWD = abs;
    return 0;
  });

  function lsColumns(names, width) {
    const n = names.length;
    if (!n) return '';
    const MIN = 3;
    const maxCols = Math.min(Math.max(1, Math.floor(width / MIN)), n);
    const info = [];
    for (let j = 0; j < maxCols; j++) info.push({ valid: true, lineLen: (j + 1) * MIN, cols: Array(j + 1).fill(MIN) });
    names.forEach((name, i) => {
      const len = name.length;
      for (let j = 0; j < maxCols; j++) {
        const ci = info[j];
        if (!ci.valid) continue;
        const rows = Math.floor((n + j) / (j + 1));
        const idx = Math.floor(i / rows);
        const real = len + (idx === j ? 0 : 2);
        if (ci.cols[idx] < real) { ci.lineLen += real - ci.cols[idx]; ci.cols[idx] = real; ci.valid = ci.lineLen < width; }
      }
    });
    let cols = maxCols;
    for (; cols > 1; cols--) if (info[cols - 1].valid) break;
    const fmt = info[cols - 1];
    const rows = Math.floor(n / cols) + (n % cols ? 1 : 0);
    let out = '';
    for (let r = 0; r < rows; r++) {
      let col = 0, idx = r, line = '';
      for (;;) {
        const name = names[idx];
        const w = fmt.cols[col++];
        line += name;
        idx += rows;
        if (idx >= n) break;
        line += ' '.repeat(Math.max(0, w - name.length));
      }
      out += line + '\n';
    }
    return out;
  }
  def('ls', function (args, io) {
    const { opts, args: paths } = getopt(args, 'laAh1RdtSrF', '', 'ls');
    const showAll = opts.a, almost = opts.A;
    const sortEntries = (entries) => {
      let e = entries.slice().sort((a, b) => cCompare(a.name, b.name));
      if (opts.t) e.sort((a, b) => b.node.mtime - a.node.mtime || cCompare(a.name, b.name));
      if (opts.S) e.sort((a, b) => nodeSize(b.node) - nodeSize(a.node) || cCompare(a.name, b.name));
      if (opts.r) e.reverse();
      return e;
    };
    const fmtName = (e) => e.name + (opts.F ? (e.node.type === 'dir' ? '/' : (e.node.mode & 0o100) ? '*' : '') : '');
    const render = (entries) => {
      if (opts.l) {
        const rows = entries.map((e) => {
          const nd = e.node;
          const links = nd.type === 'dir' ? 2 + Array.from(nd.children.values()).filter((c) => c.type === 'dir').length : 1;
          const size = opts.h ? humanSize(nodeSize(nd)) : String(nodeSize(nd));
          return [modeString(nd), String(links), nd.owner || 'student', nd.owner || 'student', size, lsDate(nd.mtime), fmtName(e)];
        });
        const w = [0, 1, 2, 3, 4].map((k) => Math.max(...rows.map((r) => r[k].length), 0));
        return rows.map((r) => `${r[0]} ${r[1].padStart(w[1])} ${r[2].padEnd(w[2])} ${r[3].padEnd(w[3])} ${r[4].padStart(w[4])} ${r[5]} ${r[6]}`).join('\n') + (rows.length ? '\n' : '');
      }
      const names = entries.map(fmtName);
      if (opts['1'] || !io.tty) return names.length ? names.join('\n') + '\n' : '';
      return lsColumns(names, this.columns || 80);
    };
    const total = (entries) => entries.reduce((s, e) => s + (e.node.type === 'dir' ? 4 : Math.ceil(byteLen(e.node.content || '') / 4096) * 4), 0);
    const dirEntries = (abs, node) => {
      let entries = Array.from(node.children.entries()).map(([name, nd]) => ({ name, node: nd, abs: normalize(abs + '/' + name) }));
      if (!showAll && !almost) entries = entries.filter((e) => !e.name.startsWith('.'));
      entries = sortEntries(entries);
      if (showAll) entries = [{ name: '.', node }, { name: '..', node: lookupIn(this.fs.root, dirName(abs) || '/') || node }].concat(entries);
      return entries;
    };
    const targets = paths.length ? paths : ['.'];
    let status = 0;
    const files = [], dirs = [];
    for (const p of targets) {
      const abs = this.abs(p, io);
      const nd = lookupIn(this.fs.root, abs);
      if (!nd) { io.err(`ls: cannot access '${p}': No such file or directory\n`); status = 2; continue; }
      if (nd.type === 'dir' && !opts.d) dirs.push({ name: p, node: nd, abs }); else files.push({ name: p, node: nd, abs });
    }
    let out = '';
    const sortedFiles = sortEntries(files);
    if (sortedFiles.length) out += render(sortedFiles);
    const sortedDirs = sortEntries(dirs);
    const multi = targets.length > 1 || opts.R;
    const walk = (d, first) => {
      const entries = dirEntries(d.abs, d.node);
      let block = '';
      if (multi) block += `${first && !sortedFiles.length ? '' : '\n'}${d.name}:\n`;
      if (opts.l) block += `total ${total(entries.filter((e) => e.name !== '.' && e.name !== '..'))}\n`;
      block += render(entries);
      out += block;
      if (opts.R) for (const e of entries) if (e.node.type === 'dir' && e.name !== '.' && e.name !== '..') walk({ name: (d.name.endsWith('/') ? d.name : d.name + '/') + e.name, node: e.node, abs: e.abs }, false);
    };
    sortedDirs.forEach((d, i) => walk(d, i === 0));
    io.out(out);
    return status;
  });
  def('mkdir', function (args, io) {
    const { opts, args: paths } = getopt(args, 'pv', 'm', 'mkdir');
    if (!paths.length) throw new ShellError("mkdir: missing operand\nTry 'mkdir --help' for more information.", 1);
    let st = 0;
    for (const p of paths) {
      const abs = this.abs(p, io);
      if (!this.writable(abs)) { io.err(`mkdir: cannot create directory '${p}': Permission denied\n`); st = 1; continue; }
      if (opts.p) {
        let cur = this.fs.root;
        for (const part of abs.split('/').filter(Boolean)) {
          if (!cur.children.has(part)) cur.children.set(part, mkdirNode());
          cur = cur.children.get(part);
          if (cur.type !== 'dir') { io.err(`mkdir: cannot create directory '${p}': Not a directory\n`); st = 1; break; }
        }
        continue;
      }
      const parent = this.parentDir(abs);
      if (!parent) { io.err(`mkdir: cannot create directory '${p}': No such file or directory\n`); st = 1; continue; }
      if (parent.children.has(baseName(abs))) { io.err(`mkdir: cannot create directory '${p}': File exists\n`); st = 1; continue; }
      parent.children.set(baseName(abs), mkdirNode());
    }
    return st;
  });
  def('rmdir', function (args, io) {
    if (!args.length) throw new ShellError("rmdir: missing operand\nTry 'rmdir --help' for more information.", 1);
    let st = 0;
    for (const p of args) {
      const abs = this.abs(p, io), nd = lookupIn(this.fs.root, abs);
      if (!nd) { io.err(`rmdir: failed to remove '${p}': No such file or directory\n`); st = 1; continue; }
      if (nd.type !== 'dir') { io.err(`rmdir: failed to remove '${p}': Not a directory\n`); st = 1; continue; }
      if (nd.children.size) { io.err(`rmdir: failed to remove '${p}': Directory not empty\n`); st = 1; continue; }
      if (!this.writable(abs) || abs === this.home) { io.err(`rmdir: failed to remove '${p}': Permission denied\n`); st = 1; continue; }
      this.parentDir(abs).children.delete(baseName(abs));
    }
    return st;
  });
  def('touch', function (args, io) {
    if (!args.length) throw new ShellError("touch: missing file operand\nTry 'touch --help' for more information.", 1);
    let st = 0;
    for (const p of args) {
      const abs = this.abs(p, io), nd = lookupIn(this.fs.root, abs);
      if (nd) { nd.mtime = Date.now(); continue; }
      if (!this.writable(abs)) { io.err(`touch: cannot touch '${p}': Permission denied\n`); st = 1; continue; }
      const parent = this.parentDir(abs);
      if (!parent || parent.type !== 'dir') { io.err(`touch: cannot touch '${p}': No such file or directory\n`); st = 1; continue; }
      parent.children.set(baseName(abs), mkfileNode(''));
    }
    return st;
  });
  const cloneNode = (nd) => nd.type === 'dir' ? Object.assign(mkdirNode(nd.mode), { children: new Map(Array.from(nd.children.entries()).map(([k, v]) => [k, cloneNode(v)])) }) : Object.assign(mkfileNode(nd.content, nd.mode), { gz: nd.gz, archive: nd.archive });
  function copyOrMove(sh, args, io, move) {
    const cmd = move ? 'mv' : 'cp';
    const { opts, args: ops } = getopt(args, move ? 'fiv' : 'rRfiv', '', cmd);
    if (ops.length < 2) throw new ShellError(ops.length ? `${cmd}: missing destination file operand after '${ops[0]}'\nTry '${cmd} --help' for more information.` : `${cmd}: missing file operand\nTry '${cmd} --help' for more information.`, 1);
    const dest = ops[ops.length - 1], sources = ops.slice(0, -1);
    const destAbs = sh.abs(dest, io), destNode = lookupIn(sh.fs.root, destAbs);
    if (sources.length > 1 && (!destNode || destNode.type !== 'dir')) throw new ShellError(`${cmd}: target '${dest}': Not a directory`, 1);
    let st = 0;
    for (const s of sources) {
      const sAbs = sh.abs(s, io), sNode = lookupIn(sh.fs.root, sAbs);
      if (!sNode) { io.err(move ? `mv: cannot stat '${s}': No such file or directory\n` : `cp: cannot stat '${s}': No such file or directory\n`); st = 1; continue; }
      if (!move && sNode.type === 'dir' && !opts.r && !opts.R) { io.err(`cp: -r not specified; omitting directory '${s}'\n`); st = 1; continue; }
      let targetAbs = destNode && destNode.type === 'dir' ? normalize(destAbs + '/' + baseName(sAbs)) : destAbs;
      if (targetAbs === sAbs) { io.err(`${cmd}: '${s}' and '${dest}' are the same file\n`); st = 1; continue; }
      if (sNode.type === 'dir' && (targetAbs + '/').startsWith(sAbs + '/')) { io.err(`${cmd}: cannot ${move ? 'move' : 'copy'} a directory, '${s}', into itself, '${dest}'\n`); st = 1; continue; }
      if (!sh.writable(targetAbs) || (move && !sh.writable(sAbs))) { io.err(`${cmd}: cannot ${move ? 'move' : 'create regular file'} '${dest}': Permission denied\n`); st = 1; continue; }
      const parent = sh.parentDir(targetAbs);
      if (!parent || parent.type !== 'dir') { io.err(`${cmd}: cannot ${move ? 'move' : 'create regular file'} '${dest}': No such file or directory\n`); st = 1; continue; }
      const existing = parent.children.get(baseName(targetAbs));
      if (existing && existing.type === 'dir' && sNode.type !== 'dir') { io.err(`${cmd}: cannot overwrite directory '${dest}' with non-directory\n`); st = 1; continue; }
      parent.children.set(baseName(targetAbs), move ? sNode : cloneNode(sNode));
      if (move) sh.parentDir(sAbs).children.delete(baseName(sAbs));
      if (opts.v) io.out(`'${s}' -> '${dest}'\n`);
    }
    return st;
  }
  def('cp', function (args, io) { return copyOrMove(this, args, io, false); });
  def('mv', function (args, io) { return copyOrMove(this, args, io, true); });
  def('rm', function (args, io) {
    const { opts, args: paths } = getopt(args, 'rRfiv', '', 'rm');
    if (!paths.length) { if (opts.f) return 0; throw new ShellError("rm: missing operand\nTry 'rm --help' for more information.", 1); }
    let st = 0;
    for (const p of paths) {
      const abs = this.abs(p, io), nd = lookupIn(this.fs.root, abs);
      if (abs === '/') { io.err("rm: it is dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override this failsafe\n"); st = 1; continue; }
      if (!nd) { if (!opts.f) { io.err(`rm: cannot remove '${p}': No such file or directory\n`); st = 1; } continue; }
      if (nd.type === 'dir' && !opts.r && !opts.R) { io.err(`rm: cannot remove '${p}': Is a directory\n`); st = 1; continue; }
      if (!this.writable(abs) || abs === this.home) { io.err(`rm: cannot remove '${p}': Permission denied\n`); st = 1; continue; }
      this.parentDir(abs).children.delete(baseName(abs));
      if (opts.v) io.out(`removed '${p}'\n`);
    }
    return st;
  });
  def('cat', function (args, io) {
    const { opts, args: files } = getopt(args, 'nAE', '', 'cat');
    let st = 0, n = 0, out = '';
    for (const inp of readInputs(this, files, io, 'cat')) {
      if (!inp.ok) { st = 1; continue; }
      if (opts.n) { for (const line of splitLines(inp.text)) out += String(++n).padStart(6) + '\t' + line + '\n'; if (inp.text && !inp.text.endsWith('\n')) out = out.slice(0, -1); }
      else out += inp.text;
    }
    io.out(out);
    return st;
  });
  def('less more', function (args, io) {
    const files = args.filter((a) => !a.startsWith('-'));
    if (!files.length && !io.stdin) throw new ShellError('Missing filename ("less --help" for help)', 1);
    let st = 0;
    for (const inp of readInputs(this, files, io, 'less')) { if (!inp.ok) { st = 1; continue; } io.out(ensureNL(inp.text)); }
    if (io.tty) io.err('(BioBridge: on a real system this opens a scrollable view; press q to quit. Here the whole file is printed.)\n');
    return st;
  });
  function headTail(sh, args, io, isHead) {
    const cmd = isHead ? 'head' : 'tail';
    const norm = args.map((a, i) => (/^-\d+$/.test(a) && !/^-[nc]$/.test(args[i - 1] || '') ? '-n' + a.slice(1) : a));
    const { opts, args: files } = getopt(norm, 'qv', 'nc', cmd);
    let spec = last(opts.n) || '10';
    if (opts.c && isNaN(parseInt(last(opts.c), 10))) throw new ShellError(`${cmd}: invalid number of bytes: '${last(opts.c)}'`, 1);
    let fromStart = false;
    if (!isHead && spec.startsWith('+')) { fromStart = true; spec = spec.slice(1); }
    const k = parseInt(spec, 10);
    if (isNaN(k)) throw new ShellError(`${cmd}: invalid number of lines: '${last(opts.n)}'`, 1);
    let st = 0, out = '', first = true;
    const inputs = readInputs(sh, files, io, cmd);
    for (const inp of inputs) {
      if (!inp.ok) { st = 1; continue; }
      if (opts.c) { const kb = parseInt(last(opts.c), 10); if (inputs.length > 1 && !opts.q) out += (first ? '' : '\n') + `==> ${inp.name} <==\n`; first = false; out += isHead ? inp.text.slice(0, kb) : inp.text.slice(-kb); continue; }
      const lines = splitLines(inp.text);
      let sel;
      if (isHead) sel = k >= 0 ? lines.slice(0, k) : lines.slice(0, Math.max(0, lines.length + k));
      else sel = fromStart ? lines.slice(Math.max(0, k - 1)) : (k === 0 ? [] : lines.slice(-k));
      if (inputs.length > 1 && !opts.q) { out += (first ? '' : '\n') + `==> ${inp.name} <==\n`; }
      first = false;
      let text = joinLines(sel);
      const lastIncluded = isHead ? sel.length === lines.length : true;
      if (lastIncluded && inp.text && !inp.text.endsWith('\n') && text) text = text.slice(0, -1);
      out += text;
    }
    io.out(out);
    return st;
  }
  def('head', function (args, io) { return headTail(this, args, io, true); });
  def('tail', function (args, io) { return headTail(this, args, io, false); });
  def('wc', function (args, io) {
    const { opts, args: files } = getopt(args, 'lwcm', '', 'wc');
    const show = { l: !!opts.l, w: !!opts.w, c: !!(opts.c || opts.m) };
    if (!show.l && !show.w && !show.c) show.l = show.w = show.c = true;
    const nShown = +show.l + +show.w + +show.c;
    const inputs = readInputs(this, files, io, 'wc');
    const rows = [], tot = [0, 0, 0];
    let st = 0, regTotal = 0, nonRegular = false;
    for (const inp of inputs) {
      if (!inp.ok) { st = 1; continue; }
      const t = inp.text;
      const c = [(t.match(/\n/g) || []).length, (t.match(/\S+/g) || []).length, byteLen(t)];
      c.forEach((v, i) => (tot[i] += v));
      if (inp.stdin && !inp.regular) nonRegular = true; else regTotal += inp.size != null ? inp.size : c[2];
      rows.push([c, inp.stdin ? '' : inp.name]);
    }
    let width = 1;
    if (!(nShown === 1 && inputs.length === 1)) { width = String(regTotal).length; if (nonRegular) width = Math.max(width, 7); }
    if (inputs.length > 1) rows.push([tot, 'total']);
    const fmtRow = ([c, name]) => [show.l && c[0], show.w && c[1], show.c && c[2]].filter((x) => x !== false).map((v) => String(v).padStart(width)).join(' ') + (name ? ' ' + name : '');
    io.out(rows.map(fmtRow).join('\n') + (rows.length ? '\n' : ''));
    return st;
  });
  function posixClasses(s) { return s.replace(/\[:alpha:\]/g, 'A-Za-z').replace(/\[:digit:\]/g, '0-9').replace(/\[:alnum:\]/g, 'A-Za-z0-9').replace(/\[:upper:\]/g, 'A-Z').replace(/\[:lower:\]/g, 'a-z').replace(/\[:space:\]/g, ' \\t\\n\\r\\f\\v').replace(/\[:punct:\]/g, '!-\\/:-@\\[-`{-~'); }
  function grepRegex(pat, opts) {
    let src;
    if (opts.F) src = pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    else if (opts.E) src = posixClasses(pat).replace(/\\</g, '\\b').replace(/\\>/g, '\\b');
    else {
      src = '';
      for (let i = 0; i < pat.length; i++) {
        const c = pat[i];
        if (c === '\\') { const d = pat[i + 1]; i++; if (d === undefined) src += '\\\\'; else if ('+?|(){}'.includes(d)) src += d; else if (d === '<' || d === '>') src += '\\b'; else src += '\\' + d; continue; }
        if (c === '[') { const j = pat.indexOf(']', i + (pat[i + 1] === ']' ? 2 : 1) + (pat[i + 1] === '^' ? 1 : 0)); if (j > 0) { src += posixClasses(pat.slice(i, j + 1)); i = j; continue; } src += '\\['; continue; }
        if ('+?|(){}'.includes(c)) { src += '\\' + c; continue; }
        if (c === '*' && (i === 0 || pat[i - 1] === '^' && i === 1)) { src += '\\*'; continue; }
        src += c;
      }
    }
    if (opts.w) src = '(?<![A-Za-z0-9_])(?:' + src + ')(?![A-Za-z0-9_])';
    if (opts.x) src = '^(?:' + src + ')$';
    try { return new RegExp(src, opts.i ? 'gi' : 'g'); }
    catch (e) { throw new ShellError(`grep: Invalid regular expression`, 2); }
  }
  def('grep egrep fgrep', function (args, io) {
    const { opts, args: rest } = getopt(args, 'ivcnwoEFlLhHqsxr', 'e', 'grep');
    let pattern = opts.e ? last(opts.e) : rest.shift();
    if (pattern == null) throw new ShellError("Usage: grep [OPTION]... PATTERNS [FILE]...\nTry 'grep --help' for more information.", 2);
    const re = grepRegex(pattern, opts);
    const inputs = readInputs(this, rest, io, 'grep');
    const multi = rest.length > 1 && !opts.h || opts.H;
    let any = false, st = 0, out = '';
    for (const inp of inputs) {
      if (!inp.ok) { st = 2; continue; }
      const lines = splitLines(inp.text);
      let count = 0;
      lines.forEach((line, idx) => {
        re.lastIndex = 0;
        const hit = re.test(line);
        if (hit === !opts.v) {
          count++;
          if (opts.c || opts.l || opts.L || opts.q) return;
          const prefix = (multi ? inp.name + ':' : '') + (opts.n ? (idx + 1) + ':' : '');
          if (opts.o && !opts.v) { re.lastIndex = 0; let m; while ((m = re.exec(line))) { if (m[0] === '') { re.lastIndex++; continue; } out += prefix + m[0] + '\n'; } }
          else out += prefix + line + '\n';
        }
      });
      if (count) any = true;
      if (opts.c) out += (multi ? inp.name + ':' : '') + count + '\n';
      if (opts.l && count) out += inp.name + '\n';
      if (opts.L && !count) out += inp.name + '\n';
    }
    if (!opts.q) io.out(out);
    if (st === 2 && !(opts.q && any)) return 2;
    return any ? 0 : 1;
  });
  function parseKey(spec) {
    const m = /^(\d+)(?:\.(\d+))?([bdfgnrhM]*)(?:,(\d+)(?:\.(\d+))?([bdfgnrhM]*))?$/.exec(spec);
    if (!m) throw new ShellError(`sort: invalid field specification '${spec}'`, 2);
    return { f1: +m[1], f2: m[4] ? +m[4] : null, flags: (m[3] || '') + (m[6] || '') };
  }
  function sortFields(line, sep) {
    if (sep != null) return line.split(sep);
    const out = [];
    let i = 0;
    while (i < line.length) { let j = i; while (j < line.length && (line[j] === ' ' || line[j] === '\t')) j++; while (j < line.length && line[j] !== ' ' && line[j] !== '\t') j++; out.push(line.slice(i, j)); i = j; }
    return out;
  }
  function numVal(s) { const m = /^\s*(-?\d*\.?\d+)/.exec(s); return m ? parseFloat(m[1]) : 0; }
  def('sort', function (args, io) {
    const { opts, args: files } = getopt(args, 'nrufbsgV', 'kto', 'sort');
    const sep = opts.t ? last(opts.t) : null;
    const keys = (opts.k || []).map(parseKey);
    let st = 0, text = '';
    for (const inp of readInputs(this, files, io, 'sort')) { if (!inp.ok) { st = 2; continue; } text += ensureNL(inp.text); }
    if (st) return st;
    const lines = splitLines(text);
    const globalNum = !!(opts.n || opts.g), globalRev = !!opts.r;
    const keyText = (line, k) => {
      const f = sortFields(line, sep);
      const from = k.f1 - 1, to = k.f2 == null ? f.length - 1 : k.f2 - 1;
      if (from >= f.length) return '';
      return sep != null ? f.slice(from, to + 1).join(sep) : f.slice(from, to + 1).join('');
    };
    const cmpVal = (a, b, num, fold, blanks) => {
      if (num) return numVal(a) - numVal(b);
      if (blanks) { a = a.replace(/^\s+/, ''); b = b.replace(/^\s+/, ''); }
      if (fold) { a = a.toUpperCase(); b = b.toUpperCase(); }
      return cCompare(a, b);
    };
    const cmp = (a, b) => {
      for (const k of keys) {
        const num = k.flags.includes('n') || k.flags.includes('g') || (!k.flags.replace(/[b]/g, '') && globalNum);
        const rev = k.flags.includes('r') || (!k.flags.replace(/[b]/g, '') && globalRev);
        let c = cmpVal(keyText(a, k), keyText(b, k), num, k.flags.includes('f') || opts.f, k.flags.includes('b') || opts.b);
        if (c) return rev ? -c : c;
      }
      if (!keys.length) { const c = cmpVal(a, b, globalNum, opts.f, opts.b); if (c) return globalRev ? -c : c; }
      if (opts.s || opts.u) return 0;
      const c = cCompare(a, b);
      return globalRev ? -c : c;
    };
    let sorted = lines.slice().sort(cmp);
    if (opts.u) sorted = sorted.filter((l, i) => i === 0 || cmp(sorted[i - 1], l) !== 0);
    const out = joinLines(sorted);
    if (opts.o) { this.writeFile(this.abs(last(opts.o), io), out, false, 'sort'); return 0; }
    io.out(out);
    return 0;
  });
  def('uniq', function (args, io) {
    const { opts, args: files } = getopt(args, 'cdui', '', 'uniq');
    const inputs = readInputs(this, files.slice(0, 1), io, 'uniq');
    if (!inputs[0].ok) return 1;
    const lines = splitLines(inputs[0].text);
    const groups = [];
    for (const l of lines) { const g = groups[groups.length - 1]; if (g && (opts.i ? g.l.toLowerCase() === l.toLowerCase() : g.l === l)) g.n++; else groups.push({ l, n: 1 }); }
    const sel = groups.filter((g) => (opts.d ? g.n > 1 : true) && (opts.u ? g.n === 1 : true));
    const out = sel.map((g) => (opts.c ? String(g.n).padStart(7) + ' ' : '') + g.l).join('\n');
    if (files[1]) { this.writeFile(this.abs(files[1], io), out ? out + '\n' : '', false, 'uniq'); return 0; }
    io.out(out ? out + '\n' : '');
    return 0;
  });
  function parseList(spec, cmd) {
    const ranges = spec.split(',').map((p) => {
      const m = /^(\d*)(-?)(\d*)$/.exec(p);
      if (!m || (!m[1] && !m[3])) throw new ShellError(`${cmd}: invalid field value '${p}'\nTry '${cmd} --help' for more information.`, 1);
      const a = m[1] ? +m[1] : 1, b = m[2] ? (m[3] ? +m[3] : Infinity) : a;
      if (a === 0) throw new ShellError(`${cmd}: fields are numbered from 1\nTry '${cmd} --help' for more information.`, 1);
      return [a, b];
    });
    return (i) => ranges.some(([a, b]) => i >= a && i <= b);
  }
  def('cut', function (args, io) {
    const { opts, args: files } = getopt(args, 's', 'fdcb', 'cut');
    if (!opts.f && !opts.c && !opts.b) throw new ShellError("cut: you must specify a list of bytes, characters, or fields\nTry 'cut --help' for more information.", 1);
    const d = opts.d ? last(opts.d) : '\t';
    if (d.length !== 1) throw new ShellError('cut: the delimiter must be a single character', 1);
    let st = 0, out = '';
    for (const inp of readInputs(this, files, io, 'cut')) {
      if (!inp.ok) { st = 1; continue; }
      for (const line of splitLines(inp.text)) {
        if (opts.f) {
          if (!line.includes(d)) { if (!opts.s) out += line + '\n'; continue; }
          const want = parseList(last(opts.f), 'cut');
          out += line.split(d).filter((_, i) => want(i + 1)).join(d) + '\n';
        } else {
          const want = parseList(last(opts.c || opts.b), 'cut');
          out += Array.from(line).filter((_, i) => want(i + 1)).join('') + '\n';
        }
      }
    }
    io.out(out);
    return st;
  });
  def('paste', function (args, io) {
    const { opts, args: files } = getopt(args, 's', 'd', 'paste');
    const d = opts.d ? last(opts.d).replace(/\\t/g, '\t') : '\t';
    const inputs = readInputs(this, files, io, 'paste');
    if (inputs.some((x) => !x.ok)) return 1;
    const cols = inputs.map((x) => splitLines(x.text));
    let out = '';
    if (opts.s) out = cols.map((c) => c.join(d)).join('\n') + '\n';
    else { const n = Math.max(...cols.map((c) => c.length)); for (let i = 0; i < n; i++) out += cols.map((c) => c[i] || '').join(d) + '\n'; }
    io.out(out);
    return 0;
  });
  function trSet(s) {
    s = s.replace(/\[:upper:\]/g, 'A-Z').replace(/\[:lower:\]/g, 'a-z').replace(/\[:digit:\]/g, '0-9').replace(/\[:alpha:\]/g, 'A-Za-z').replace(/\[:space:\]/g, ' \t\n\r\f\v').replace(/\[:alnum:\]/g, 'A-Za-z0-9');
    const chars = [];
    for (let i = 0; i < s.length; i++) {
      let c = s[i];
      if (c === '\\' && i + 1 < s.length) { const e = s[++i]; c = { n: '\n', t: '\t', r: '\r', '\\': '\\' }[e] || e; }
      if (s[i + 1] === '-' && i + 2 < s.length) {
        let e = s[i + 2]; let skip = 2;
        if (e === '\\' && i + 3 < s.length) { e = { n: '\n', t: '\t' }[s[i + 3]] || s[i + 3]; skip = 3; }
        for (let k = c.charCodeAt(0); k <= e.charCodeAt(0); k++) chars.push(String.fromCharCode(k));
        i += skip;
      } else chars.push(c);
    }
    return chars;
  }
  def('tr', function (args, io) {
    const { opts, args: sets } = getopt(args, 'dsc', '', 'tr');
    if (!sets.length) throw new ShellError("tr: missing operand\nTry 'tr --help' for more information.", 1);
    const files = [];
    if (sets.length > (opts.d && !opts.s ? 1 : 2)) throw new ShellError(`tr: extra operand '${sets[opts.d && !opts.s ? 1 : 2]}'\nOnly one string may be given when deleting without squeezing repeats.\n(BioBridge: tr only reads standard input. Use: tr ... < file  or  cat file | tr ...)`, 1);
    const input = readInputs(this, files, io, 'tr')[0].text;
    const s1 = trSet(sets[0]);
    let out = '';
    if (opts.d) {
      const del = new Set(s1);
      out = Array.from(input).filter((c) => !del.has(c)).join('');
      if (opts.s && sets[1]) { const sq = new Set(trSet(sets[1])); out = out.replace(/(.)\1+/gs, (m, c) => (sq.has(c) ? c : m)); }
    } else if (sets.length > 1) {
      const s2 = trSet(sets[1]);
      const map = new Map();
      s1.forEach((c, i) => map.set(c, s2[Math.min(i, s2.length - 1)]));
      out = Array.from(input).map((c) => (map.has(c) ? map.get(c) : c)).join('');
      if (opts.s) { const sq = new Set(s2); out = out.replace(/(.)\1+/gs, (m, c) => (sq.has(c) ? c : m)); }
    } else if (opts.s) { const sq = new Set(s1); out = input.replace(/(.)\1+/gs, (m, c) => (sq.has(c) ? c : m)); }
    else throw new ShellError(`tr: missing operand after '${sets[0]}'\nTwo strings must be given when translating.`, 1);
    io.out(out);
    return 0;
  });
  const unescape = (s) => s.replace(/\\(n|t|\\|r|a|b|e|0)/g, (_, c) => ({ n: '\n', t: '\t', '\\': '\\', r: '\r', a: '', b: '', e: '', 0: '' })[c]);
  def('echo', function (args, io) {
    let n = false, e = false, i = 0;
    for (; i < args.length && /^-[neE]+$/.test(args[i]); i++) { if (args[i].includes('n')) n = true; if (args[i].includes('e')) e = true; if (args[i].includes('E')) e = false; }
    let text = args.slice(i).join(' ');
    if (e) text = unescape(text);
    io.out(text + (n ? '' : '\n'));
    return 0;
  });
  def('printf', function (args, io) {
    if (!args.length) throw new ShellError('printf: usage: printf format [arguments]', 2);
    const fmtStr = unescape(args[0]);
    const vals = args.slice(1);
    let out = '', k = 0, guard = 0;
    do {
      out += fmtStr.replace(/%([-0]?)(\d*)(?:\.(\d+))?([sdif%])/g, (m, flag, w, p, t) => {
        if (t === '%') return '%';
        let v = vals[k++];
        if (v == null) v = t === 's' ? '' : '0';
        let s;
        if (t === 's') s = p ? String(v).slice(0, +p) : String(v);
        else if (t === 'd' || t === 'i') s = String(Math.trunc(Number(v)) || 0);
        else s = (Number(v) || 0).toFixed(p ? +p : 6);
        if (w) s = flag === '-' ? s.padEnd(+w) : s.padStart(+w, flag === '0' ? '0' : ' ');
        return s;
      });
    } while (k < vals.length && k > 0 && ++guard < 100);
    io.out(out);
    return 0;
  });
  def('chmod', function (args, io) {
    const rest = args.filter((a) => a !== '-R' && a !== '-v');
    if (rest.length < 2) throw new ShellError(rest.length ? `chmod: missing operand after '${rest[0]}'\nTry 'chmod --help' for more information.` : "chmod: missing operand\nTry 'chmod --help' for more information.", 1);
    const mode = rest[0];
    let st = 0;
    for (const p of rest.slice(1)) {
      const abs = this.abs(p, io), nd = lookupIn(this.fs.root, abs);
      if (!nd) { io.err(`chmod: cannot access '${p}': No such file or directory\n`); st = 1; continue; }
      if (!this.writable(abs)) { io.err(`chmod: changing permissions of '${p}': Operation not permitted\n`); st = 1; continue; }
      if (/^[0-7]{3,4}$/.test(mode)) { nd.mode = parseInt(mode, 8) & 0o777; continue; }
      for (const clause of mode.split(',')) {
        const m = /^([ugoa]*)([-+=])([rwxX]*)$/.exec(clause);
        if (!m) throw new ShellError(`chmod: invalid mode: '${mode}'\nTry 'chmod --help' for more information.`, 1);
        const who = m[1] || 'a';
        const umask = m[1] ? 0 : 0o022;
        let bits = 0;
        for (const w of who === 'a' ? 'ugo' : who) for (const pch of m[3]) { const shift = { u: 6, g: 3, o: 0 }[w]; const b = { r: 4, w: 2, x: 1, X: 1 }[pch]; bits |= b << shift; }
        bits &= ~umask;
        if (m[2] === '+') nd.mode |= bits;
        else if (m[2] === '-') nd.mode &= ~bits;
        else { let mask = 0; for (const w of who === 'a' ? 'ugo' : who) mask |= 7 << { u: 6, g: 3, o: 0 }[w]; nd.mode = (nd.mode & ~mask) | bits; }
      }
    }
    return st;
  });
  def('find', function (args, io) {
    const starts = [];
    let i = 0;
    while (i < args.length && !args[i].startsWith('-')) starts.push(args[i++]);
    if (!starts.length) starts.push('.');
    let name = null, iname = null, type = null, maxdepth = Infinity;
    for (; i < args.length; i++) {
      const a = args[i];
      if (a === '-name') name = args[++i];
      else if (a === '-iname') iname = args[++i];
      else if (a === '-type') type = args[++i];
      else if (a === '-maxdepth') maxdepth = +args[++i];
      else throw new ShellError(`find: unknown predicate '${a}'\n(BioBridge supports -name, -iname, -type f|d and -maxdepth.)`, 1);
    }
    const reName = name ? globToRe(name) : null, reIname = iname ? new RegExp(globToRe(iname).source, 'i') : null;
    let st = 0, out = '';
    const visit = (shown, nd, depth) => {
      const base = depth === 0 ? baseName(shown) : shown.slice(shown.lastIndexOf('/') + 1);
      const ok = (!reName || reName.test(base)) && (!reIname || reIname.test(base)) && (!type || (type === 'd' ? nd.type === 'dir' : nd.type === 'file'));
      if (ok) out += shown + '\n';
      if (nd.type === 'dir' && depth < maxdepth) for (const k of Array.from(nd.children.keys()).sort(cCompare)) visit((shown.endsWith('/') ? shown : shown + '/') + k, nd.children.get(k), depth + 1);
    };
    for (const s of starts) {
      const nd = this.node(s, io);
      if (!nd) { io.err(`find: '${s}': No such file or directory\n`); st = 1; continue; }
      visit(s, nd, 0);
    }
    io.out(out);
    return st;
  });
  def('basename', function (args, io) { if (!args.length) throw new ShellError("basename: missing operand\nTry 'basename --help' for more information.", 1); let b = baseName(args[0]); if (args[1] && b.endsWith(args[1]) && b !== args[1]) b = b.slice(0, -args[1].length); io.out(b + '\n'); return 0; });
  def('dirname', function (args, io) { if (!args.length) throw new ShellError("dirname: missing operand\nTry 'dirname --help' for more information.", 1); io.out(dirName(args[0]) + '\n'); return 0; });
  def('seq', function (args, io) {
    const nums = args.map(Number);
    if (!args.length || nums.some(isNaN)) throw new ShellError(args.length ? `seq: invalid floating point argument: '${args.find((a) => isNaN(Number(a)))}'` : "seq: missing operand\nTry 'seq --help' for more information.", 1);
    let [a, inc, b] = nums.length === 1 ? [1, 1, nums[0]] : nums.length === 2 ? [nums[0], 1, nums[1]] : nums;
    if (inc === 0) throw new ShellError("seq: invalid Zero increment value: '0'", 1);
    let out = '', n = 0;
    for (let x = a; inc > 0 ? x <= b : x >= b; x += inc) { out += x + '\n'; if (++n > 100000) break; }
    io.out(out);
    return 0;
  });
  def('which', function (args, io) {
    let st = 0;
    for (const a of args) { if (COMMANDS[a] && !BUILTINS.has(a)) io.out('/usr/bin/' + a + '\n'); else st = 1; }
    return st;
  });
  def('type', function (args, io) {
    let st = 0;
    for (const a of args) {
      if (this.aliases[a]) io.out(`${a} is aliased to \`${this.aliases[a]}'\n`);
      else if (KEYWORDS.has(a)) io.out(`${a} is a shell keyword\n`);
      else if (BUILTINS.has(a)) io.out(`${a} is a shell builtin\n`);
      else if (COMMANDS[a]) io.out(`${a} is /usr/bin/${a}\n`);
      else { io.err(`bash: type: ${a}: not found\n`); st = 1; }
    }
    return st;
  });
  def('man', function (args, io) {
    if (!args.length) { io.err('What manual page do you want?\nFor example, try \'man ls\'.\n'); return 1; }
    const page = manPage(args[0]);
    if (!page) { io.err(`No manual entry for ${args[0]}\n(BioBridge has short manual pages for the commands listed by help.)\n`); return 16; }
    io.out(page);
    return 0;
  });
  def('help', function (args, io) {
    io.out(['BioBridge practice terminal: a safe simulation of Bash. Nothing runs on your device.', '',
      'Navigate:    pwd  ls  cd  find', 'Files:       mkdir  rmdir  touch  cp  mv  rm  chmod  file', 'View:        cat  less  more  head  tail  wc', 'Text:        grep  sort  uniq  cut  paste  tr  echo  printf',
      'System:      whoami  id  hostname  uname  date  df  du  ps  top  which  type  history  clear  man',
      'Archives:    gzip  gunzip  zcat  tar  zip  unzip', 'Scripts:     nano  bash  sh  source  ./script  export  read  test  [ ]  seq  basename  dirname  crontab',
      'Syntax:      |  >  >>  <  2>  &&  ||  ;  $VAR  $(cmd)  $((1+2))  *.tsv  for/if/while', '', 'Not simulated: awk, sed, network commands (curl, wget, ping), installing software (apt, sudo).', 'Tips: Tab completes names, Up and Down recall commands. Type man COMMAND for a short manual.', ''].join('\n'));
    return 0;
  });
  def('history', function (args, io) { io.out(this.history.map((l, i) => String(i + 1).padStart(5) + '  ' + l).join('\n') + (this.history.length ? '\n' : '')); return 0; });
  def('clear', function () { this.clearRequest = true; return 0; });
  def('whoami', function (args, io) { io.out(this.user + '\n'); return 0; });
  def('id', function (args, io) { io.out(`uid=1000(${this.user}) gid=1000(${this.user}) groups=1000(${this.user})\n`); return 0; });
  def('hostname', function (args, io) { io.out((args.includes('-I') ? '10.0.0.15' : this.host) + '\n'); return 0; });
  def('uname', function (args, io) {
    const { opts } = getopt(args, 'asnrvmo', '', 'uname');
    const parts = { s: 'Linux', n: this.host, r: '6.8.0-biobridge', v: '#1 SMP PREEMPT_DYNAMIC', m: 'x86_64', o: 'GNU/Linux' };
    let keys = opts.a ? ['s', 'n', 'r', 'v', 'm', 'o'] : ['s', 'n', 'r', 'v', 'm', 'o'].filter((k) => opts[k]);
    if (!keys.length) keys = ['s'];
    io.out(keys.map((k) => parts[k]).join(' ') + '\n');
    return 0;
  });
  def('date', function (args, io) {
    const d = new Date();
    const tz = (() => { try { return new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(d).find((p) => p.type === 'timeZoneName').value; } catch (e) { return 'UTC'; } })();
    const fmtArg = args.find((a) => a.startsWith('+'));
    const map = { Y: d.getFullYear(), m: pad2(d.getMonth() + 1), d: pad2(d.getDate()), H: pad2(d.getHours()), M: pad2(d.getMinutes()), S: pad2(d.getSeconds()), s: Math.floor(d / 1000), a: DAYS[d.getDay()], A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()], b: MONTHS[d.getMonth()], B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()], e: String(d.getDate()).padStart(2), Z: tz, j: String(Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000)).padStart(3, '0'), '%': '%' };
    map.F = `${map.Y}-${map.m}-${map.d}`; map.T = `${map.H}:${map.M}:${map.S}`; map.D = `${map.m}/${map.d}/${String(map.Y).slice(2)}`;
    const f = fmtArg ? fmtArg.slice(1) : '%a %b %e %H:%M:%S %Z %Y';
    io.out(f.replace(/%(.)/g, (m, c) => (map[c] != null ? map[c] : m)) + '\n');
    return 0;
  });
  def('df', function (args, io) {
    const hFlag = args.includes('-h');
    io.out(hFlag ? 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   18G   30G  38% /\ntmpfs           2.0G     0  2.0G   0% /dev/shm\n' : 'Filesystem     1K-blocks     Used Available Use% Mounted on\n/dev/sda1       52428800 18874368  31457280  38% /\ntmpfs            2097152        0   2097152   0% /dev/shm\n');
    return 0;
  });
  def('du', function (args, io) {
    const { opts, args: paths } = getopt(args, 'shac', 'd', 'du');
    const sizeOf = (nd) => nd.type === 'dir' ? 4 + Array.from(nd.children.values()).reduce((s, c) => s + sizeOf(c), 0) : Math.ceil(nodeSize(nd) / 4096) * 4;
    const fmtSize = (k) => opts.h ? (k < 1024 ? (k === 0 ? '0' : k.toFixed(0) + '.0K').replace(/^(\d{2,})\.0K$/, '$1K') : humanSize(k * 1024)) : String(k);
    let out = '', st = 0;
    for (const p of paths.length ? paths : ['.']) {
      const nd = this.node(p, io);
      if (!nd) { io.err(`du: cannot access '${p}': No such file or directory\n`); st = 1; continue; }
      const walk = (shown, n) => { if (n.type === 'dir') for (const k of Array.from(n.children.keys()).sort(cCompare)) { const c = n.children.get(k); if (c.type === 'dir' && !opts.s) walk(shown + '/' + k, c); } if (!opts.s || shown === p) out += fmtSize(sizeOf(n)) + '\t' + shown + '\n'; };
      if (opts.s) out += fmtSize(sizeOf(nd)) + '\t' + p + '\n'; else walk(p, nd);
    }
    io.out(out);
    return st;
  });
  def('ps', function (args, io) { io.out('    PID TTY          TIME CMD\n    101 pts/0    00:00:00 bash\n    187 pts/0    00:00:00 ps\n'); return 0; });
  def('top', function (args, io) {
    io.out('top - one snapshot (BioBridge: the real top updates live; press q to quit)\nTasks:   2 total,   1 running,   1 sleeping\n%Cpu(s):  1.3 us,  0.7 sy, 98.0 id\nMiB Mem :   3900.0 total,   2900.4 free,    512.8 used\n\n    PID USER      PR  NI    VIRT    RES  %CPU  %MEM     TIME+ COMMAND\n    101 student   20   0    8536   5120   0.0   0.1   0:00.02 bash\n    188 student   20   0   10244   4100   0.3   0.1   0:00.00 top\n');
    return 0;
  });
  def('sleep', function (args, io) { if (!args.length) throw new ShellError("sleep: missing operand\nTry 'sleep --help' for more information.", 1); return 0; });
  def('true', function () { return 0; });
  def('false', function () { return 1; });
  def('exit', function (args) { throw new ExitSignal(args.length ? parseInt(args[0], 10) || 0 : this.status); });
  def('export', function (args, io) {
    const scope = io.vars || this.vars;
    if (!args.length) { io.out([...this.exported].sort().map((k) => `declare -x ${k}="${scope[k] != null ? scope[k] : ''}"`).join('\n') + '\n'); return 0; }
    for (const a of args) { const eq = a.indexOf('='); if (eq > 0) { scope[a.slice(0, eq)] = a.slice(eq + 1); this.exported.add(a.slice(0, eq)); } else this.exported.add(a); }
    return 0;
  });
  def('unset', function (args, io) { const scope = io.vars || this.vars; for (const a of args) { delete scope[a]; this.exported.delete(a); } return 0; });
  def('env printenv', function (args, io) {
    const scope = io.vars || this.vars;
    if (args.length) { const v = scope[args[0]]; if (v == null) return 1; io.out(v + '\n'); return 0; }
    io.out([...this.exported].sort().map((k) => `${k}=${scope[k] != null ? scope[k] : ''}`).join('\n') + '\n');
    return 0;
  });
  def('alias', function (args, io) {
    if (!args.length) { io.out(Object.entries(this.aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n') + '\n'); return 0; }
    for (const a of args) { const eq = a.indexOf('='); if (eq > 0) this.aliases[a.slice(0, eq)] = a.slice(eq + 1); else if (this.aliases[a]) io.out(`alias ${a}='${this.aliases[a]}'\n`); else { io.err(`bash: alias: ${a}: not found\n`); return 1; } }
    return 0;
  });
  def('read', function (args, io) {
    const { opts, args: names } = getopt(args, 'r', 'p', 'read');
    if (!io.stdin) { io.err('bash: read: interactive typing is not supported in this practice terminal.\n(BioBridge: give read its input with a pipe or redirection, e.g. while read line; do echo "$line"; done < samples.tsv)\n'); return 1; }
    const s = io.stdin;
    if (s.pos >= s.text.length) return 1;
    let nl = s.text.indexOf('\n', s.pos);
    if (nl < 0) nl = s.text.length;
    const line = s.text.slice(s.pos, nl);
    s.pos = nl + 1;
    const vars = names.length ? names : ['REPLY'];
    const parts = line.trim().split(/[ \t]+/);
    vars.forEach((v, i) => this.setVar(v, i === vars.length - 1 ? parts.slice(i).join(' ') : (parts[i] || ''), io));
    return 0;
  });
  function testExpr(sh, a, io) {
    if (!a.length) return false;
    if (a[0] === '!') return !testExpr(sh, a.slice(1), io);
    const oIdx = a.indexOf('-o'); if (oIdx > 0) return testExpr(sh, a.slice(0, oIdx), io) || testExpr(sh, a.slice(oIdx + 1), io);
    const aIdx = a.indexOf('-a'); if (aIdx > 0 && a.length > 3) return testExpr(sh, a.slice(0, aIdx), io) && testExpr(sh, a.slice(aIdx + 1), io);
    if (a.length === 1) return a[0] !== '';
    if (a.length === 2) {
      const [op, v] = a;
      const nd = () => sh.node(v, io);
      switch (op) {
        case '-f': return !!nd() && nd().type === 'file';
        case '-d': return !!nd() && nd().type === 'dir';
        case '-e': return !!nd();
        case '-s': return !!nd() && nd().type === 'file' && nd().content.length > 0;
        case '-x': return !!nd() && !!(nd().mode & 0o100);
        case '-r': return !!nd();
        case '-w': return !!nd() && sh.writable(sh.abs(v, io));
        case '-z': return v === '';
        case '-n': return v !== '';
        default: throw new ShellError(`test: ${op}: unary operator expected`, 2);
      }
    }
    if (a.length === 3) {
      const [x, op, y] = a;
      const num = (s) => { if (!/^\s*-?\d+\s*$/.test(s)) throw new ShellError(`test: ${s}: integer expression expected`, 2); return parseInt(s, 10); };
      switch (op) {
        case '=': case '==': return x === y;
        case '!=': return x !== y;
        case '-eq': return num(x) === num(y); case '-ne': return num(x) !== num(y);
        case '-lt': return num(x) < num(y); case '-le': return num(x) <= num(y);
        case '-gt': return num(x) > num(y); case '-ge': return num(x) >= num(y);
        case '<': return x < y; case '>': return x > y;
        default: throw new ShellError(`test: ${op}: binary operator expected`, 2);
      }
    }
    throw new ShellError('test: too many arguments', 2);
  }
  def('test', function (args, io) { return testExpr(this, args, io) ? 0 : 1; });
  def('[', function (args, io) {
    if (args[args.length - 1] !== ']') throw new ShellError("[: missing `]'\n(BioBridge: a test needs spaces inside the brackets, e.g. [ -f counts.tsv ])", 2);
    return testExpr(this, args.slice(0, -1), io) ? 0 : 1;
  });
  def('[[', function (args, io) {
    if (args[args.length - 1] !== ']]') throw new ShellError("syntax error in conditional expression: missing `]]'", 2);
    const inner = args.slice(0, -1);
    const orIdx = inner.indexOf('||'), andIdx = inner.indexOf('&&');
    if (orIdx > 0) return testExpr(this, inner.slice(0, orIdx), io) || testExpr(this, inner.slice(orIdx + 1), io) ? 0 : 1;
    if (andIdx > 0) return testExpr(this, inner.slice(0, andIdx), io) && testExpr(this, inner.slice(andIdx + 1), io) ? 0 : 1;
    return testExpr(this, inner, io) ? 0 : 1;
  });
  def('file', function (args, io) {
    let st = 0;
    const width = Math.max(0, ...args.map((a) => a.length)) + 2;
    for (const a of args) {
      const nd = this.node(a, io);
      if (!nd) { io.out(`${a}: cannot open \`${a}' (No such file or directory)\n`); st = 1; continue; }
      let kind = 'ASCII text';
      if (nd.type === 'dir') kind = 'directory';
      else if (nd.gz) kind = 'gzip compressed data';
      else if (nd.archive && nd.archive.kind === 'zip') kind = 'Zip archive data';
      else if (nd.archive) kind = nd.archive.gz ? 'gzip compressed data' : 'POSIX tar archive';
      else if (!nd.content) kind = 'empty';
      else if (nd.content.startsWith('#!')) kind = 'Bourne-Again shell script, ASCII text executable';
      io.out(`${(a + ':').padEnd(width)}${kind}\n`);
    }
    return st;
  });
  def('source .', function (args, io) {
    if (!args.length) throw new ShellError('bash: source: filename argument required', 2);
    const abs = this.abs(args[0], io), nd = lookupIn(this.fs.root, abs);
    if (!nd || nd.type !== 'file') throw new ShellError(`${args[0]}: No such file or directory`, 1);
    return this.runScript(abs, args[0], args.slice(1), Object.assign({}, io, { vars: io.vars || this.vars }), true);
  });
  def('bash sh', function (args, io) {
    if (!args.length) { io.err('(BioBridge: you are already in a Bash shell. To run a script: bash script.sh)\n'); return 0; }
    if (args[0] === '-c') { const buf = this.substitute(args[1] || '', io); io.out(buf); return this.status; }
    const abs = this.abs(args[0], io), nd = lookupIn(this.fs.root, abs);
    if (!nd) { io.err(`bash: ${args[0]}: No such file or directory\n`); return 127; }
    if (nd.type === 'dir') { io.err(`bash: ${args[0]}: Is a directory\n`); return 126; }
    return this.runScript(abs, args[0], args.slice(1), io, false);
  });
  const openEditor = function (args, io, label) {
    if (!args.length) { io.err(`(BioBridge: give a file name, e.g. ${label} notes.txt)\n`); return 1; }
    const abs = this.abs(args[0], io), nd = lookupIn(this.fs.root, abs);
    if (nd && nd.type === 'dir') { io.err(`${label}: ${args[0]}: Is a directory\n`); return 1; }
    if (!this.writable(abs)) { io.err(`${label}: ${args[0]}: Permission denied (you can only edit files in your home folder)\n`); return 1; }
    if (!this.parentDir(abs)) { io.err(`${label}: ${args[0]}: No such file or directory\n`); return 1; }
    this.editRequest = { path: abs, shown: args[0], content: nd ? nd.content : '', editor: label };
    if (label !== 'nano') io.err('(BioBridge: real Vim has modes: press i to insert text, Esc then :wq to save and quit. This practice terminal opens a simple editor instead.)\n');
    return 0;
  };
  def('nano', function (args, io) { return openEditor.call(this, args, io, 'nano'); });
  def('vim vi', function (args, io) { return openEditor.call(this, args, io, 'vim'); });
  def('crontab', function (args, io) {
    if (args.includes('-l')) { if (this.crontab == null) { io.err(`no crontab for ${this.user}\n`); return 1; } io.out(this.crontab); return 0; }
    if (args.includes('-r')) { this.crontab = null; return 0; }
    if (args.includes('-e')) { this.editRequest = { crontab: true, content: this.crontab || '# m h  dom mon dow   command\n', editor: 'crontab' }; return 0; }
    throw new ShellError('crontab: usage: crontab [-l | -e | -r]\n(BioBridge: -l lists jobs, -e edits them, -r removes them.)', 1);
  });
  /* compression and archives (content kept inside the node; marked as binary) */
  def('gzip gunzip zcat', function (args, io, cmd) {
    const { opts, args: files } = getopt(args, 'dkcfv', '', cmd);
    const decompress = cmd === 'gunzip' || opts.d;
    if (cmd === 'zcat' || opts.c) {
      let st = 0;
      for (const f of files) { const nd = this.node(f, io); if (!nd) { io.err(`${cmd}: ${f}: No such file or directory\n`); st = 1; continue; } if (!nd.gz) { io.err(`${cmd}: ${f}: not in gzip format\n`); st = 1; continue; } io.out(nd.content); }
      return st;
    }
    if (!files.length) throw new ShellError(`${cmd}: compressed data not written to a terminal. Use -f to force compression.`, 1);
    let st = 0;
    for (const f of files) {
      const abs = this.abs(f, io), nd = lookupIn(this.fs.root, abs);
      if (!nd) { io.err(`${cmd}: ${f}: No such file or directory\n`); st = 1; continue; }
      if (nd.type === 'dir') { io.err(`${cmd}: ${f} is a directory -- ignored\n`); st = 2; continue; }
      const parent = this.parentDir(abs);
      if (decompress) {
        if (!f.endsWith('.gz')) { io.err(`${cmd}: ${f}: unknown suffix -- ignored\n`); st = 2; continue; }
        if (!nd.gz) { io.err(`${cmd}: ${f}: not in gzip format\n`); st = 1; continue; }
        const plain = Object.assign(mkfileNode(nd.content, nd.mode), nd.archiveInside ? { archive: nd.archiveInside } : {});
        parent.children.set(baseName(abs).slice(0, -3), plain);
        if (!opts.k) parent.children.delete(baseName(abs));
      } else {
        if (f.endsWith('.gz')) { io.err(`${cmd}: ${f} already has .gz suffix -- unchanged\n`); st = 2; continue; }
        const gz = Object.assign(mkfileNode(nd.content, nd.mode), { gz: true, archiveInside: nd.archive || null });
        parent.children.set(baseName(abs) + '.gz', gz);
        if (!opts.k) parent.children.delete(baseName(abs));
      }
      if (opts.v) io.err(`${f}:\t 62.0% -- replaced with ${decompress ? f.slice(0, -3) : f + '.gz'}\n`);
    }
    return st;
  });
  const snapshot = (sh, base, nd, shown, list) => {
    if (nd.type === 'dir') { list.push({ p: shown + '/', dir: true, mode: nd.mode }); for (const k of Array.from(nd.children.keys()).sort(cCompare)) snapshot(sh, base, nd.children.get(k), shown + '/' + k, list); }
    else list.push({ p: shown, c: nd.content, mode: nd.mode, gz: !!nd.gz });
    return list;
  };
  const restore = (sh, entries, io) => {
    for (const e of entries) {
      const abs = sh.abs(e.p.replace(/\/$/, ''), io);
      if (!sh.writable(abs)) throw new ShellError(`Cannot open: ${e.p}: Permission denied`, 2);
      if (e.dir) { let cur = sh.fs.root; for (const part of abs.split('/').filter(Boolean)) { if (!cur.children.has(part)) cur.children.set(part, mkdirNode(e.mode)); cur = cur.children.get(part); } }
      else { const parent = sh.parentDir(abs); if (parent) parent.children.set(baseName(abs), Object.assign(mkfileNode(e.c, e.mode), { gz: e.gz })); }
    }
  };
  def('tar', function (args, io) {
    let a = args.slice();
    if (a[0] && !a[0].startsWith('-') && /^[cxtzvf]+$/.test(a[0])) a[0] = '-' + a[0];
    const { opts, args: files } = getopt(a, 'cxtzvj', 'fC', 'tar');
    const archive = last(opts.f);
    if (!archive) throw new ShellError('tar: Refusing to read archive contents from terminal (missing -f option?)\nTry \'tar --help\' for more information.', 2);
    const modes = ['c', 'x', 't'].filter((k) => opts[k]);
    if (modes.length !== 1) throw new ShellError("tar: You must specify one of the '-Acdtrux', '--delete' or '--test-label' options\nTry 'tar --help' for more information.", 2);
    if (opts.c) {
      if (!files.length) throw new ShellError('tar: Cowardly refusing to create an empty archive', 2);
      const entries = [];
      for (const f of files) {
        const nd = this.node(f, io);
        if (!nd) { io.err(`tar: ${f}: Cannot stat: No such file or directory\n`); continue; }
        let member = f.replace(/\/$/, '');
        const lead = /^(\.\.\/|\/)+/.exec(member);
        if (lead) { io.err(`tar: Removing leading \`${lead[0]}' from member names\n`); member = member.slice(lead[0].length); }
        snapshot(this, f, nd, member, entries);
      }
      if (opts.v) io.out(entries.map((e) => e.p).join('\n') + '\n');
      const abs = this.abs(archive, io);
      this.writeFile(abs, '', false, 'tar');
      const nd = lookupIn(this.fs.root, abs);
      nd.archive = { kind: 'tar', gz: !!opts.z, entries };
      nd.content = entries.map((e) => e.p).join('\n');
      return 0;
    }
    const nd = this.node(archive, io);
    if (!nd) throw new ShellError(`tar: ${archive}: Cannot open: No such file or directory\ntar: Error is not recoverable: exiting now`, 2);
    const arc = nd.archive || (nd.gz && nd.archiveInside);
    if (!arc) throw new ShellError('tar: This does not look like a tar archive', 2);
    if (opts.t) { io.out(arc.entries.map((e) => e.p).join('\n') + '\n'); return 0; }
    restore(this, arc.entries, io);
    if (opts.v) io.out(arc.entries.map((e) => e.p).join('\n') + '\n');
    return 0;
  });
  def('zip', function (args, io) {
    const { opts, args: rest } = getopt(args, 'rq', '', 'zip');
    if (rest.length < 2) throw new ShellError('zip error: Nothing to do!', 12);
    let name = rest[0]; if (!name.endsWith('.zip')) name += '.zip';
    const entries = [];
    for (const f of rest.slice(1)) {
      const nd = this.node(f, io);
      if (!nd) { io.err(`\tzip warning: name not matched: ${f}\n`); continue; }
      if (nd.type === 'dir' && !opts.r) { entries.push({ p: f.replace(/\/$/, '') + '/', dir: true, mode: nd.mode }); continue; }
      snapshot(this, f, nd, f.replace(/\/$/, ''), entries);
    }
    if (!opts.q) io.out(entries.map((e) => `  adding: ${e.p} (${e.dir ? 'stored 0%' : 'deflated 58%'})`).join('\n') + '\n');
    const abs = this.abs(name, io);
    this.writeFile(abs, '', false, 'zip');
    const nd = lookupIn(this.fs.root, abs);
    nd.archive = { kind: 'zip', entries };
    nd.content = entries.map((e) => e.p).join('\n');
    return 0;
  });
  def('unzip', function (args, io) {
    const { opts, args: rest } = getopt(args, 'lqo', 'd', 'unzip');
    const name = rest[0];
    if (!name) throw new ShellError('UnZip: usage: unzip [-l] file[.zip]', 10);
    const nd = this.node(name, io);
    if (!nd || !nd.archive || nd.archive.kind !== 'zip') throw new ShellError(`unzip:  cannot find or open ${name}, ${name}.zip or ${name}.ZIP.`, 9);
    const entries = nd.archive.entries;
    if (opts.l) {
      const sz = (e) => (e.dir ? 0 : byteLen(e.c));
      const total = entries.reduce((s, e) => s + sz(e), 0);
      io.out(`Archive:  ${name}\n  Length      Date    Time    Name\n---------  ---------- -----   ----\n` + entries.map((e) => `${String(sz(e)).padStart(9)}  2026-11-07 12:00   ${e.p}`).join('\n') + `\n---------                     -------\n${String(total).padStart(9)}                     ${entries.length} file${entries.length === 1 ? '' : 's'}\n`);
      return 0;
    }
    io.out(`Archive:  ${name}\n` + entries.map((e) => (e.dir ? `   creating: ${e.p}` : `  inflating: ${e.p}`)).join('\n') + '\n');
    restore(this, entries, io);
    return 0;
  });

  const BUILTINS = new Set(['cd', 'echo', 'printf', 'pwd', 'history', 'exit', 'export', 'unset', 'alias', 'read', 'test', '[', 'source', '.', 'type', 'help', 'true', 'false']);
  const KEYWORDS = new Set(['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'until', 'do', 'done', 'in', '[[', '!']);


  BB.Shell = Shell;
  BB.shellInternals = { tokenize, parse, lsColumns, normalize, MAN, COMMANDS };
})();
