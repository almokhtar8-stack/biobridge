/* Parameterized question generators. Each returns a fresh variant built from one template; distractors come from
   specific misconceptions and each carries its own explanation. tools/test_generators.mjs runs hundreds of variants
   through real Python, R and Bash to confirm the keyed answer is exactly what the interpreter prints. */
(function () {
  'use strict';
  const BB = window.BB = window.BB || {};
  const G = [];
  const add = (key, meta, fn) => G.push(Object.assign({ key, make: fn }, meta));

  /* helpers */
  const pyFloat = (x) => (Number.isInteger(x) ? x.toFixed(1) : String(x));
  const rNum = (x) => String(Number(x.toPrecision(7)));
  function rVec(vals) {
    if (typeof vals[0] === 'boolean') { const s = vals.map((v) => (v ? 'TRUE' : 'FALSE')); const w = Math.max(...s.map((x) => x.length)); return '[1] ' + s.map((x) => x.padStart(w)).join(' '); }
    const decs = Math.max(0, ...vals.map((v) => { const s = rNum(v); return s.includes('.') ? s.split('.')[1].length : 0; }));
    const s = vals.map((v) => v.toFixed(decs));
    const w = Math.max(...s.map((x) => x.length));
    return '[1] ' + s.map((x) => x.padStart(w)).join(' ');
  }
  const BASES = 'ACGT';
  const randSeq = (r, n) => Array.from({ length: n }, () => r.pick(BASES)).join('');
  const comp = { A: 'T', T: 'A', G: 'C', C: 'G' };
  const revcomp = (s) => [...s].reverse().map((b) => comp[b]).join('');
  /* build options: correct first, then unique distractors (each {t, why}) */
  function opts(correct, distractors) {
    const seen = new Set([correct.t]);
    const out = [correct];
    for (const d of distractors) if (d && !seen.has(d.t)) { seen.add(d.t); out.push(d); }
    return out.length >= 3 ? out.slice(0, 4) : null;
  }

  /* ---------------- Python ---------------- */
  add('py-arith', { obj: ['PY.EXPR'], level: 1, lesson: 'f2-first-program', verify: 'python', label: 'Arithmetic operators' }, (r) => {
    const kind = r.pick(['floordiv', 'mod', 'div', 'prec', 'paren', 'pow']);
    const a = r.int(11, 47), b = r.int(2, 9), c = r.int(3, 9);
    let expr, val, ds;
    if (kind === 'floordiv') { expr = `${a} // ${b}`; val = Math.floor(a / b); ds = [{ t: pyFloat(a / b), why: '`//` is floor division: it keeps only the whole-number part and gives an integer for integer inputs. `/` would give the decimal result.' }, { t: String(a % b), why: 'That is the remainder (what `%` gives). `//` gives how many whole times it fits.' }, { t: String(Math.round(a / b) === val ? val + 1 : Math.round(a / b)), why: '`//` does not round to the nearest whole number; it always rounds down (toward minus infinity).' }]; }
    else if (kind === 'mod') { expr = `${a} % ${b}`; val = a % b; ds = [{ t: String(Math.floor(a / b)), why: 'That is the result of `//` (how many whole times). `%` gives what is left over.' }, { t: pyFloat(a / b), why: '`%` is not division; it is the remainder after dividing.' }, { t: String(b - (a % b) === val ? val + 1 : b - (a % b)), why: 'The remainder is what is left after taking out as many whole groups as possible, not how far you are from the next group.' }]; }
    else if (kind === 'div') { const bb = r.pick([2, 4, 5, 8]); expr = `${a} / ${bb}`; val = a / bb; ds = [{ t: String(Math.floor(a / bb)), why: 'In Python 3, `/` always gives a float with the decimal part. Only `//` drops it.' }, { t: String(a % bb), why: 'That is the remainder (`%`), not the result of division.' }, { t: pyFloat(Math.round(a / bb)), why: '`/` does not round; it gives the exact decimal result (as a float).' }]; val = pyFloat(val); }
    else if (kind === 'prec') { expr = `${a} + ${b} * ${c}`; val = a + b * c; ds = [{ t: String((a + b) * c), why: 'Python does multiplication before addition (operator precedence), just as in mathematics. Left to right is not the rule.' }, { t: String(a * b + c), why: 'Each operator works on the numbers next to it: here `b * c` happens first, then the addition.' }, { t: `${a}${b * c}`, why: 'The numbers are integers, not text, so `+` adds them rather than joining them.' }]; }
    else if (kind === 'paren') { expr = `(${a} + ${b}) * ${c}`; val = (a + b) * c; ds = [{ t: String(a + b * c), why: 'Parentheses force the addition to happen first, overriding the usual precedence.' }, { t: String(a * c + b), why: 'The whole sum inside the parentheses is multiplied by the last number.' }, { t: String(a + b + c), why: '`*` is multiplication, not addition.' }]; }
    else { const p = r.int(2, 3); expr = `${b} ** ${p}`; val = Math.pow(b, p); ds = [{ t: String(b * p), why: '`**` is "to the power of", not multiplication: it multiplies the number by itself.' }, { t: String(b + p), why: '`**` raises to a power; it does not add.' }, { t: String(Math.pow(p, b)), why: 'The left number is the base and the right number is the exponent.' }]; }
    const o = opts({ t: String(val), why: 'This is exactly what Python prints for this expression.' }, ds);
    return o && { q: 'What does this line print?', code: { lang: 'python', src: `print(${expr})` }, options: o, explain: '`/` true division (float), `//` floor division, `%` remainder, `**` power; `*` and `/` happen before `+` and `-`.' };
  });

  add('py-vars', { obj: ['PY.VARS'], level: 2, lesson: 'f2-variables', verify: 'python', label: 'Tracing assignments' }, (r) => {
    const A = r.int(3, 20), B = r.int(2, 15);
    const kind = r.pick(['copy', 'update', 'notsaved']);
    if (kind === 'copy') {
      const src = `x = ${A}\ny = x\nx = ${B}\nprint(y)`;
      return { q: 'What does this program print?', code: { lang: 'python', src }, options: opts({ t: String(A), why: '`y = x` copies the current value of x (an integer) into y. Changing x afterwards does not change y.' }, [{ t: String(B), why: 'Assignment is not a permanent link. y received the value x had at that moment; the later `x = ...` only changes x.' }, { t: String(A + B), why: 'Nothing adds the values. Each `=` replaces what the name on the left refers to.' }, { t: 'x', why: '`print(y)` prints the value stored in y, not the name of another variable.' }]), explain: 'Trace line by line and keep a small table of each variable\'s current value.' };
    }
    if (kind === 'update') {
      const src = `count = ${A}\ncount = count + ${B}\ncount = count * 2\nprint(count)`;
      return { q: 'What does this program print?', code: { lang: 'python', src }, options: opts({ t: String((A + B) * 2), why: `count starts at ${A}, becomes ${A + B}, then doubles to ${(A + B) * 2}.` }, [{ t: String(A * 2 + B), why: 'The lines run in order from top to bottom: the addition happens before the doubling.' }, { t: String(A + B), why: 'The third line also changes count. Every assignment updates the stored value.' }, { t: String(A), why: '`count = count + ...` replaces the old value with the new one; count does not keep its first value.' }]), explain: '`count = count + 1` means: compute the right side with the current value, then store the result back in count.' };
    }
    const src = `reads = ${A}\nreads + ${B}\nprint(reads)`;
    return { q: 'What does this program print?', code: { lang: 'python', src }, options: opts({ t: String(A), why: `Line 2 computes ${A + B} but never stores it, so reads is still ${A}.` }, [{ t: String(A + B), why: 'An expression on its own line is calculated and then thrown away. To keep it you need `reads = reads + ...`.' }, { t: 'Error', why: 'A bare expression is legal Python; it just has no lasting effect in a script.' }]), explain: 'Only assignment (`=`) changes what a variable holds.' };
  });

  add('py-cond', { obj: ['PY.COND'], level: 2, lesson: 'f2-conditionals', verify: 'python', label: 'if / elif / else' }, (r) => {
    const q = r.pick([r.int(31, 40), 30, r.int(21, 29), 20, r.int(5, 19)]);
    const src = `quality = ${q}\nif quality >= 30:\n    print("high")\nelif quality >= 20:\n    print("medium")\nelse:\n    print("low")`;
    const right = q >= 30 ? 'high' : q >= 20 ? 'medium' : 'low';
    const ds = ['high', 'medium', 'low'].filter((x) => x !== right).map((x) => ({ t: x, why: x === 'high' ? `${q} >= 30 is False, so the first block is skipped.` : x === 'medium' ? (q >= 30 ? 'Python stops at the first condition that is True. Once "high" runs, the elif is never checked.' : `${q} >= 20 is False, so this block is skipped too.`) : `The else block only runs when every condition above it was False, but ${q} satisfies an earlier condition.` }));
    if (q >= 30) ds.push({ t: 'high\nmedium', why: 'Only one branch of an if/elif/else chain runs: the first one whose condition is True.' });
    if (q === 30 || q === 20) ds.unshift({ t: q === 30 ? 'medium' : 'low', why: '`>=` means greater than OR equal to, so a value exactly on the boundary passes the test.' });
    return { q: 'What does this program print?', code: { lang: 'python', src }, options: opts({ t: right, why: `${q} is checked from the top; the first True condition decides the output.` }, ds), explain: 'In an if/elif/else chain, Python tests conditions in order and runs only the first block whose condition is True.' };
  });

  add('py-loop', { obj: ['PY.LOOPS', 'PY.LISTS'], level: 2, lesson: 'f2-lists-loops', verify: 'python', label: 'Accumulator loops' }, (r) => {
    for (let tries = 0; tries < 20; tries++) {
      const k = r.int(8, 15);
      const vals = BB.rng(r.int(1, 1e6)).shuffle([k, r.int(1, k - 1), r.int(k + 1, 30), r.int(1, 30), r.int(k + 1, 40)]);
      const src = `counts = [${vals.join(', ')}]\ntotal = 0\nfor c in counts:\n    if c > ${k}:\n        total = total + c\nprint(total)`;
      const right = vals.filter((v) => v > k).reduce((a, b) => a + b, 0);
      const o = opts({ t: String(right), why: `Only values greater than ${k} are added: ${vals.filter((v) => v > k).join(' + ')}.` }, [
        { t: String(vals.filter((v) => v >= k).reduce((a, b) => a + b, 0)), why: `\`>\` means strictly greater. ${k} itself is not greater than ${k}, so it is not added.` },
        { t: String(vals.reduce((a, b) => a + b, 0)), why: 'The if statement inside the loop filters values; not every value is added.' },
        { t: String(vals.filter((v) => v > k).length), why: 'The loop adds the values themselves (`total + c`), not 1 for each match.' }]);
      if (o) return { q: 'What does this program print?', code: { lang: 'python', src }, options: o, explain: 'This is the accumulator pattern: start a total at 0, visit each item, update the total when a condition holds.' };
    }
    return null;
  });

  add('py-str', { obj: ['PY.STR'], level: 2, lesson: 'f2-strings', verify: 'python', label: 'String indexing and slicing' }, (r) => {
    for (let tries = 0; tries < 30; tries++) {
      const s = randSeq(r, r.int(8, 10));
      const kind = r.pick(['idx', 'neg', 'slice', 'len', 'head']);
      let expr, right, ds;
      if (kind === 'idx') { const i = r.int(1, s.length - 2); expr = `seq[${i}]`; right = s[i]; ds = [{ t: s[i - 1], why: `Python counts from 0, so seq[${i}] is the ${i + 1}th letter, not the ${i}th.` }, { t: s[i + 1], why: 'Indexing starts at 0: seq[0] is the first letter.' }]; }
      else if (kind === 'neg') { expr = 'seq[-1]'; right = s[s.length - 1]; ds = [{ t: s[0], why: 'Negative indexes count from the end: -1 is the last letter.' }, { t: s[s.length - 2], why: '-1 is the very last letter; -2 would be the one before it.' }]; }
      else if (kind === 'slice') { const i = r.int(1, 3), j = i + r.int(2, 4); expr = `seq[${i}:${j}]`; right = s.slice(i, j); ds = [{ t: s.slice(i, j + 1), why: `A slice stops BEFORE the end index, so seq[${i}:${j}] has ${j - i} letters.` }, { t: s.slice(i - 1, j - 1), why: 'Slices also count from 0, so the start index is the position after skipping that many letters.' }, { t: s.slice(i - 1, j), why: 'Start index included, end index excluded, both counted from 0.' }]; }
      else if (kind === 'len') { expr = 'len(seq)'; right = String(s.length); ds = [{ t: String(s.length - 1), why: 'len counts every character. The LAST INDEX is one less than the length, because indexes start at 0.' }, { t: String(s.length + 1), why: 'len counts the characters exactly; the quotes are not part of the string.' }]; }
      else { expr = 'seq[:3]'; right = s.slice(0, 3); ds = [{ t: s.slice(0, 4), why: 'seq[:3] takes positions 0, 1 and 2: three letters, stopping before index 3.' }, { t: s.slice(1, 4), why: 'An empty start means "from the beginning", which is index 0.' }]; }
      const o = opts({ t: right, why: 'This is what Python prints.' }, ds);
      if (o) return { q: 'What does this program print?', code: { lang: 'python', src: `seq = "${s}"\nprint(${expr})` }, options: o, explain: 'Python indexes start at 0, negative indexes count from the end, and a slice [a:b] includes a but stops before b.' };
    }
    return null;
  });

  add('py-func', { obj: ['PY.FUNC'], level: 2, lesson: 'f2-functions', verify: 'python', label: 'Function calls and return' }, (r) => {
    const kind = r.pick(['ret', 'printret', 'gc']);
    if (kind === 'ret') {
      const A = r.int(2, 12), B = r.int(2, 5);
      const src = `def scale(count, factor):\n    return count * factor + 1\n\nresult = scale(${A}, ${B})\nprint(result)`;
      return { q: 'What does this program print?', code: { lang: 'python', src }, options: opts({ t: String(A * B + 1), why: `count is ${A}, factor is ${B}; ${A} * ${B} + 1 = ${A * B + 1}.` }, [{ t: String(A * (B + 1)), why: 'Multiplication happens before addition inside the return expression.' }, { t: String(B * A), why: 'The `+ 1` is part of the returned value.' }, { t: 'None', why: 'The function uses `return`, so the call produces a value that is stored in result.' }]), explain: 'Arguments are matched to parameters by position: the first argument becomes count, the second becomes factor.' };
    }
    if (kind === 'printret') {
      const A = r.int(3, 30);
      const src = `def double(n):\n    print(n * 2)\n\nresult = double(${A})\nprint(result)`;
      return { q: 'What does this program print?', code: { lang: 'python', src }, options: opts({ t: `${A * 2}\nNone`, why: 'The function PRINTS the doubled number but returns nothing, so result is None, which the last line prints.' }, [{ t: String(A * 2), why: 'Printing inside a function is not the same as returning. With no return statement, the function returns None.' }, { t: `${A * 2}\n${A * 2}`, why: 'result gets the function\'s return value, and there is no return statement, so it is None.' }, { t: 'None', why: 'The print inside the function still runs when double is called, before the last line.' }]), explain: '`print` shows a value on screen; `return` hands a value back to the caller. A function without return gives back None.' };
    }
    const gc = r.pick([0.45, 0.52, 0.61, 0.7, 0.6]);
    const src = `def label(gc):\n    if gc > 0.6:\n        return "GC-rich"\n    return "normal"\n\nprint(label(${gc}))`;
    const right = gc > 0.6 ? 'GC-rich' : 'normal';
    return { q: 'What does this program print?', code: { lang: 'python', src }, options: opts({ t: right, why: gc > 0.6 ? `${gc} > 0.6 is True, so the function returns immediately with "GC-rich".` : `${gc} > 0.6 is False, so Python skips that return and reaches the last line.` }, [{ t: right === 'GC-rich' ? 'normal' : 'GC-rich', why: gc === 0.6 ? '`>` is strictly greater: 0.6 > 0.6 is False.' : 'Check the comparison: the first return only runs when the condition is True.' }, { t: 'GC-rich\nnormal', why: '`return` ends the function immediately; nothing after it runs in that call.' }, { t: 'None', why: 'Every path through this function reaches a return statement with a string.' }]), explain: 'A function stops at the first `return` it reaches.' };
  });

  add('py-list', { obj: ['PY.LISTS'], level: 1, lesson: 'f2-lists-loops', verify: 'python', label: 'List indexing' }, (r) => {
    const vals = Array.from({ length: 5 }, () => r.int(1, 99));
    if (new Set(vals).size < 5) return null;
    const kind = r.pick(['idx', 'neg', 'len', 'append', 'slice']);
    let code, right, ds;
    if (kind === 'idx') { code = `print(counts[1])`; right = String(vals[1]); ds = [{ t: String(vals[0]), why: 'counts[0] is the first item; counts[1] is the second.' }, { t: String(vals[2]), why: 'Indexes start at 0, so 1 refers to the second item, not the third.' }]; }
    else if (kind === 'neg') { code = `print(counts[-2])`; right = String(vals[3]); ds = [{ t: String(vals[4]), why: '-1 is the last item; -2 is the one before it.' }, { t: String(vals[1]), why: 'Negative indexes count backwards from the end of the list.' }]; }
    else if (kind === 'len') { code = `print(len(counts))`; right = '5'; ds = [{ t: '4', why: 'The last index is 4, but there are 5 items. len counts items.' }, { t: String(vals.reduce((a, b) => a + b, 0)), why: 'len counts how many items there are; sum would add them.' }]; }
    else if (kind === 'append') { code = `counts.append(${r.int(1, 9)})\nprint(len(counts))`; right = '6'; ds = [{ t: '5', why: '.append adds one item to the end of the list, so the list grows.' }, { t: 'None', why: '.append changes the list and returns None, but here we print len(counts), which is the new length.' }]; }
    else { code = `print(counts[1:3])`; right = `[${vals[1]}, ${vals[2]}]`; ds = [{ t: `[${vals[1]}, ${vals[2]}, ${vals[3]}]`, why: 'A slice stops before the end index, so [1:3] gives the items at indexes 1 and 2.' }, { t: `[${vals[0]}, ${vals[1]}]`, why: 'Indexes start at 0, so 1 is the second item.' }]; }
    const o = opts({ t: right, why: 'This is what Python prints.' }, ds);
    return o && { q: 'What does this program print?', code: { lang: 'python', src: `counts = [${vals.join(', ')}]\n${code}` }, options: o, explain: 'Lists use the same indexing rules as strings: start at 0, negative from the end, slices exclude the end index.' };
  });

  add('py-dict', { obj: ['PY.DICTS'], level: 2, lesson: 'f2-dicts', verify: 'python', label: 'Counting with a dictionary' }, (r) => {
    const s = randSeq(r, 9);
    const base = r.pick(BASES.split(''));
    const n = [...s].filter((b) => b === base).length;
    const src = `seq = "${s}"\ncounts = {}\nfor base in seq:\n    counts[base] = counts.get(base, 0) + 1\nprint(counts.get("${base}", 0))`;
    const o = opts({ t: String(n), why: `"${base}" appears ${n} time${n === 1 ? '' : 's'} in ${s}.` }, [{ t: String(s.length), why: 'Each letter only increases its own key; the value for one key is that letter\'s count, not the length.' }, { t: String(n + 1), why: 'counts.get(base, 0) starts each new letter at 0, then adds 1 per occurrence: no extra 1 is added.' }, { t: String(Math.max(0, n - 1)), why: 'The first time a letter is seen, get returns 0 and the count becomes 1, so the first occurrence is counted.' }, { t: 'KeyError', why: '.get with a default of 0 never raises KeyError; it returns 0 for missing keys.' }]);
    return o && { q: 'What does this program print?', code: { lang: 'python', src }, options: o, explain: '`counts.get(key, 0)` returns the current count or 0 if the key is new; adding 1 and storing it back counts occurrences.' };
  });

  /* ---------------- Biology and sequences ---------------- */
  add('bio-gc', { obj: ['BI.SEQ', 'PY.BIO'], level: 2, lesson: 'f2-bio-project', label: 'GC content' }, (r) => {
    const s = randSeq(r, r.pick([10, 20]));
    const gc = [...s].filter((b) => b === 'G' || b === 'C').length;
    const pc = (x) => (x / s.length * 100).toFixed(0) + '%';
    const o = opts({ t: pc(gc), why: `${gc} of the ${s.length} bases are G or C: ${gc} / ${s.length} = ${pc(gc)}.` }, [
      { t: pc(s.length - gc), why: 'That is the AT content. GC content counts only G and C.' },
      { t: pc([...s].filter((b) => b === 'G').length), why: 'GC content counts both G and C, not only G.' },
      { t: String(gc), why: 'That is the number of G and C bases. GC content is a fraction or percentage of the total length.' }]);
    return o && { q: `What is the GC content of \`${s}\`?`, options: o, explain: 'GC content = (number of G + number of C) / length. It matters because GC-rich DNA is more stable and can sequence less evenly.' };
  });

  add('bio-revcomp', { obj: ['BI.SEQ'], level: 2, lesson: 'f3-fasta', label: 'Reverse complement' }, (r) => {
    for (let t = 0; t < 30; t++) {
      const s = randSeq(r, r.int(6, 8));
      const rc = revcomp(s), cm = [...s].map((b) => comp[b]).join(''), rv = [...s].reverse().join('');
      const o = opts({ t: rc, why: 'Complement every base (A-T, C-G), then reverse so the result is written 5\' to 3\' like every sequence file.' }, [
        { t: cm, why: 'This is the complement written underneath in the opposite direction. Read 5\' to 3\', it must also be reversed.' },
        { t: rv, why: 'Reversing alone does not give the other strand; the bases must also be complemented.' },
        { t: s.replace(/T/g, 'U'), why: 'Replacing T with U turns DNA into the matching RNA sequence. It does not give the opposite strand.' }]);
      if (o && o.length === 4) return { q: `What is the reverse complement of \`5'-${s}-3'\` (written 5' to 3')?`, options: o, explain: 'Many tools need the reverse complement because a read can come from either DNA strand.' };
    }
    return null;
  });

  add('bio-transcribe', { obj: ['F0.DOGMA'], level: 1, lesson: 'f0-dogma', label: 'Transcription' }, (r) => {
    const s = 'ATG' + randSeq(r, 6);
    const m = s.replace(/T/g, 'U'), c = [...s].map((b) => comp[b]).join('');
    const o = opts({ t: m, why: 'The mRNA has the same sequence as the coding strand, with U in place of T.' }, [
      { t: c.replace(/T/g, 'U'), why: 'This is the complement. The RNA is built against the template strand, so it ends up matching the coding strand.' },
      { t: c, why: 'This is the template strand (DNA), not the RNA.' },
      { t: s, why: 'RNA uses U instead of T.' }]);
    return o && { q: `A DNA coding strand reads \`5'-${s}-3'\`. What is the mRNA?`, options: o, explain: 'Transcription copies the gene into RNA; the mRNA matches the coding strand with U for T.' };
  });

  add('bio-translate', { obj: ['F0.DOGMA'], level: 2, lesson: 'f0-dogma', label: 'Translation with the codon table' }, (r) => {
    const pool = ['GCC', 'AAA', 'UUU', 'GGG', 'CCA', 'GAU', 'UGG', 'CAU', 'ACU', 'UAC'];
    const cods = ['AUG', r.pick(pool), r.pick(pool), r.pick(pool)];
    const AA = BB.bio ? BB.bio.AA : null, CODE = BB.bio ? BB.bio.CODE : null;
    if (!CODE) return null;
    const three = (c) => AA[CODE[c.replace(/U/g, 'T')]][0];
    const right = cods.map(three).join('-');
    const rna = cods.join('');
    const shifted = [];
    for (let i = 1; i + 3 <= rna.length; i += 3) shifted.push(rna.slice(i, i + 3));
    const shiftTxt = shifted.map(three).join('-');
    const o = opts({ t: right, why: 'Read from AUG in groups of three letters and look each codon up in the genetic code.' }, [
      { t: shiftTxt, why: 'This reads the codons starting one letter too late. The reading frame is set by the start codon AUG.' },
      { t: cods.slice().reverse().map(three).join('-'), why: 'Ribosomes read mRNA from 5\' to 3\', starting at AUG, not backwards.' },
      { t: cods.slice(1).map(three).join('-'), why: 'AUG is not only the start signal; it also codes for methionine (Met), the first amino acid.' }]);
    return o && { q: `Translate the mRNA \`5'-${rna}-3'\` (use the standard genetic code).`, options: o, explain: 'Codons are read three letters at a time from the start codon AUG, which codes for methionine.' };
  });

  add('bio-phred', { obj: ['BI.FASTQ'], level: 2, lesson: 'f3-fastq', label: 'Phred quality scores' }, (r) => {
    const ch = r.pick(['I', '?', '5', '+', '#', '(', 'F', ':', 'A']);
    const code = ch.charCodeAt(0), q = code - 33;
    if (r.chance(0.5)) {
      const o = opts({ t: `Q${q}`, why: `The character code of ${ch} is ${code}; in Phred+33 encoding subtract 33: Q${q}.` }, [
        { t: `Q${code}`, why: 'The quality character is encoded: you must subtract 33 from its character code first.' },
        { t: `Q${code - 64}`, why: 'Subtracting 64 is the old Phred+64 encoding used by very early Illumina files. Modern FASTQ uses Phred+33.' },
        { t: `Q${q + 33 - 48 > 0 ? code - 48 : q + 10}`, why: 'Quality characters are not digits to read directly; use character code minus 33.' }]);
      return o && { q: `In a modern FASTQ file (Phred+33), what quality score does the character \`${ch}\` represent? (Its character code is ${code}.)`, options: o, explain: 'Phred+33: Q = character code - 33. Q20 means a 1 in 100 chance the base call is wrong; Q30 means 1 in 1,000.' };
    }
    const Q = r.pick([10, 20, 30, 40]);
    const p = Math.pow(10, -Q / 10);
    const fmt = (x) => '1 in ' + BB.fmt(Math.round(1 / x));
    const o = opts({ t: fmt(p), why: `Error probability = 10^(-Q/10) = 10^(-${Q / 10}) = ${fmt(p)}.` }, [
      { t: fmt(Math.pow(10, -Q / 10 - 1)), why: 'Divide Q by 10 to get the power of ten: each +10 in Q makes errors 10 times rarer.' },
      { t: `${Q}%`, why: 'The Phred score is not a percentage; it is a logarithmic scale.' },
      { t: fmt(Math.pow(10, -Q / 10 + 1)), why: 'Q10 is 1 error in 10, Q20 is 1 in 100, Q30 is 1 in 1,000: count the tens.' }]);
    return o && { q: `A base has Phred quality Q${Q}. What is the chance that the base call is wrong?`, options: o, explain: 'Phred Q = -10 log10(P). Higher Q means a lower error probability.' };
  });

  add('bio-fastq-reads', { obj: ['BI.FASTQ', 'LX.VIEW'], level: 1, lesson: 'f3-fastq', label: 'Counting reads from lines' }, (r) => {
    const reads = r.pick([2500, 12000, 250000, 1800000, 7500]);
    const lines = reads * 4;
    const o = opts({ t: BB.fmt(reads), why: `Every FASTQ record is exactly 4 lines, so ${BB.fmt(lines)} / 4 = ${BB.fmt(reads)} reads.` }, [
      { t: BB.fmt(lines), why: 'Lines are not reads: each read takes 4 lines (header, sequence, +, quality).' },
      { t: BB.fmt(lines / 2), why: 'A FASTQ record has 4 lines, not 2. (A FASTA record without line wrapping has 2.)' },
      { t: BB.fmt(lines * 4), why: 'Divide the line count by 4 rather than multiplying.' }]);
    return o && { q: `\`wc -l sample.fastq\` reports ${BB.fmt(lines)} lines. How many reads does the file contain?`, options: o, explain: 'FASTQ: 4 lines per read. Counting lines that start with @ is unreliable, because quality lines can also begin with @.' };
  });

  /* ---------------- Statistics and RNA-seq numbers ---------------- */
  add('st-log2fc', { obj: ['ST.FC'], level: 2, lesson: 'f3-foldchange', label: 'log2 fold change' }, (r) => {
    const c = r.pick([20, 40, 50, 80, 100, 250]);
    const k = r.pick([-3, -2, -1, 1, 2, 3]);
    const t = c * Math.pow(2, k);
    const ratio = t / c;
    const o = opts({ t: (k > 0 ? '+' : '') + k, why: `Ratio = ${t} / ${c} = ${ratio}; log2(${ratio}) = ${k}${k < 0 ? ' (negative because the treated value is smaller)' : ''}.` }, [
      { t: String(ratio), why: 'That is the plain fold change (ratio). The question asks for its log2.' },
      { t: (k > 0 ? '' : '+') + String(-k), why: 'The sign shows direction: treated divided by control. Less in treated gives a negative log2 fold change.' },
      { t: String(t - c), why: 'Fold change compares by division, not subtraction.' }]);
    return o && { q: `Mean normalized expression is ${c} in controls and ${t} in treated samples. What is the log2 fold change (treated vs control)?`, options: o, explain: 'log2 fold change = log2(treated / control). +1 = doubled, -1 = halved, 0 = no change.' };
  });

  add('st-cpm', { obj: ['BI.NORM'], level: 2, lesson: 'f3-normalization', label: 'Counts per million' }, (r) => {
    const L = r.pick([10, 20, 25, 40]) * 1e6;
    const cpm = r.pick([5, 12, 30, 45, 150]);
    const k = cpm * L / 1e6;
    const o = opts({ t: String(cpm), why: `CPM = ${BB.fmt(k)} / ${BB.fmt(L)} x 1,000,000 = ${cpm}.` }, [
      { t: (k / L).toExponential(1), why: 'That is the fraction of reads. CPM multiplies it by one million.' },
      { t: BB.fmt(k * L / 1e6), why: 'CPM divides by the library size; it does not multiply by it.' },
      { t: String(k), why: 'That is the raw count. CPM rescales it to "per million reads".' }]);
    return o && { q: `A gene has ${BB.fmt(k)} reads in a sample with ${BB.fmt(L)} reads in total. What is its CPM?`, options: o, explain: 'CPM = count / library size x 1,000,000. It removes the effect of sequencing depth (but not gene length or composition bias).' };
  });

  add('st-depth', { obj: ['BI.NORM'], level: 3, lesson: 'f3-normalization', label: 'Comparing samples of different depth' }, (r) => {
    const L1 = r.pick([10, 15, 20]) * 1e6, f = r.pick([2, 3]), L2 = L1 * f;
    const cpm1 = r.pick([20, 40, 60]);
    const kind = r.pick(['same', 'A', 'B']);
    const cpm2 = kind === 'same' ? cpm1 : kind === 'A' ? cpm1 / 2 : cpm1 * 2;
    const k1 = cpm1 * L1 / 1e6, k2 = cpm2 * L2 / 1e6;
    const right = kind === 'same' ? 'The same in both samples' : kind === 'A' ? 'Higher in sample A' : 'Higher in sample B';
    const ds = ['The same in both samples', 'Higher in sample A', 'Higher in sample B'].filter((x) => x !== right).map((x) => ({ t: x, why: x === 'Higher in sample B' && k2 > k1 ? `B has more reads for the gene (${BB.fmt(k2)}), but B was also sequenced ${f} times as deeply. Compare counts per million: A ${cpm1}, B ${cpm2}.` : `Convert both to counts per million: A = ${BB.fmt(k1)} / ${L1 / 1e6} million = ${cpm1}; B = ${BB.fmt(k2)} / ${L2 / 1e6} million = ${cpm2}.` }));
    return { q: `Gene X has ${BB.fmt(k1)} reads in sample A (${L1 / 1e6} million reads in total) and ${BB.fmt(k2)} reads in sample B (${L2 / 1e6} million in total). Relative to sequencing depth, where is gene X expressed more?`, options: opts({ t: right, why: `Per million reads: A ${cpm1}, B ${cpm2}.` }, ds), explain: 'Raw counts grow with sequencing depth; dividing by library size makes samples comparable.' };
  });

  add('st-multi', { obj: ['ST.MULTI'], level: 2, lesson: 'f3-multiple', label: 'Expected false positives' }, (r) => {
    const m = r.pick([1000, 5000, 10000, 20000]);
    const a = r.pick([0.05, 0.01]);
    const e = m * a;
    const o = opts({ t: BB.fmt(e), why: `If no gene truly changes, each test still has a ${a * 100}% chance of p < ${a}: ${BB.fmt(m)} x ${a} = ${BB.fmt(e)}.` }, [
      { t: '0', why: 'A p-value cutoff controls the false-positive rate per test; across many tests some false positives are expected.' },
      { t: String(a), why: 'The cutoff is a probability per test. Multiply by the number of tests to get the expected count.' },
      { t: BB.fmt(Math.round(m * a * a)), why: 'The expected number is simply (number of tests) x (cutoff) when nothing truly changes.' }]);
    return o && { q: `You test ${BB.fmt(m)} genes that, in truth, do not change. About how many will have p < ${a} by chance?`, options: o, explain: 'This is why RNA-seq analyses report adjusted p-values (for example Benjamini-Hochberg) instead of raw p-values.' };
  });

  /* ---------------- Linux ---------------- */
  add('lx-grep-c', { obj: ['LX.SEARCH'], level: 2, lesson: 'f1-grep', verify: 'bash', label: 'grep -c counts lines' }, (r) => {
    const genes = ['HSPA1A', 'DNAJB1', 'ACTB', 'GAPDH', 'HSPH1', 'TP53', 'BAG3', 'FOS'];
    const pick = r.shuffle(genes).slice(0, 6);
    const lines = pick.map((g) => { const hs = ['HSPA1A', 'DNAJB1', 'HSPH1', 'BAG3'].includes(g); const twice = hs && r.chance(0.5); return `${g}\t${hs ? 'heat_shock' : 'other'}\t${twice ? 'heat_shock_response' : 'note'}`; });
    const content = lines.join('\n') + '\n';
    const lineHits = lines.filter((l) => l.includes('heat_shock')).length;
    const occ = lines.reduce((s, l) => s + (l.match(/heat_shock/g) || []).length, 0);
    if (lineHits === 0 || occ === lineHits) return null;
    const src = `printf '${content.replace(/\t/g, '\\t').replace(/\n/g, '\\n')}' > genes.tsv\ngrep -c heat_shock genes.tsv`;
    return { q: 'genes.tsv contains the lines below. What does `grep -c heat_shock genes.tsv` print?', code: { lang: 'bash', src: `$ cat genes.tsv\n${content}$ grep -c heat_shock genes.tsv` }, verifySrc: src, options: opts({ t: String(lineHits), why: `${lineHits} lines contain heat_shock at least once. -c counts matching LINES.` }, [
      { t: String(occ), why: 'grep -c counts lines that match, not how many times the pattern appears. A line with two matches still counts once.' },
      { t: String(lines.length), why: 'Only lines containing the pattern are counted, not every line.' },
      { t: String(lines.length - lineHits), why: 'That would be the number of lines that do NOT match (grep -v -c).' }]), explain: 'grep prints (or with -c counts) whole lines that contain the pattern.' };
  });

  add('lx-path', { obj: ['LX.PATHS', 'LX.NAV'], level: 2, lesson: 'f1-paths', verify: 'bash', label: 'Where does cd take you?' }, (r) => {
    const cases = [
      ['~/project/data', '../scripts', '/home/student/project/scripts'], ['~/project/data', '..', '/home/student/project'], ['~/project/data', '../..', '/home/student'],
      ['~/project', 'data/../results', '/home/student/project/results'], ['~/project/scripts', '../../project/data', '/home/student/project/data'], ['~', 'project/./data', '/home/student/project/data'],
      ['~/project/results', '~', '/home/student'], ['~/project/data', '../results/..', '/home/student/project']];
    const [from, rel, to] = r.pick(cases);
    const fromAbs = from.replace('~', '/home/student');
    const parentOf = (p) => p.slice(0, p.lastIndexOf('/')) || '/';
    const ds = [
      { t: fromAbs + '/' + rel.replace(/^\.\.\//, ''), why: '`..` means the parent folder; it moves you up a level instead of being part of a folder name.' },
      { t: parentOf(to) === to ? '/' : parentOf(to), why: 'Count the `..` steps carefully: each one goes up exactly one level.' },
      { t: '/' + rel.replace(/^~\/?/, '').replace(/(\.\.\/?)+/, ''), why: 'A relative path starts from the current folder, not from the root `/`.' },
      { t: fromAbs, why: 'cd changes the current folder, so pwd prints the new location.' }];
    const o = opts({ t: to, why: `Start in ${from} and follow each part of ${rel}.` }, ds);
    return o && { q: `You are in \`${from}\`. You run \`cd ${rel}\` and then \`pwd\`. What is printed?`, verifySrc: `cd ${from.replace('~', '"$HOME"')}\ncd ${rel}\npwd | sed "s|$(dirname "$(dirname "$HOME")")||"`, verifyCwd: '~', options: o, explain: '`.` is the current folder, `..` the parent, `~` your home folder. pwd always prints an absolute path.' };
  });

  add('lx-chmod', { obj: ['LX.PERMS'], level: 2, lesson: 'f1-permissions', label: 'Numeric permissions' }, (r) => {
    const modes = ['755', '644', '700', '750', '640', '600', '754', '711'];
    const m = r.pick(modes);
    const sym = (d) => ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'][+d];
    const right = [...m].map(sym).join('');
    const o = opts({ t: right, why: `Each digit is one group (owner, group, others) and is the sum r=4, w=2, x=1: ${[...m].map((d) => `${d} = ${sym(d)}`).join(', ')}.` }, [
      { t: [...m].reverse().map(sym).join(''), why: 'The order is always owner, then group, then others: the first digit is the owner.' },
      { t: [...m].map((d) => sym(String(7 - +d))).join(''), why: 'Each digit lists the permissions that ARE granted (r=4, w=2, x=1), not the ones removed.' },
      { t: [...m].map((d) => ['---', 'r--', '-w-', 'rw-', '--x', 'r-x', '-wx', 'rwx'][+d]).join(''), why: 'r is worth 4, w is 2 and x is 1 (not the other way round).' }]);
    return o && { q: `After \`chmod ${m} script.sh\`, which permission string does \`ls -l\` show (ignore the first character)?`, options: o, explain: 'Permissions: owner, group, others; each a sum of read 4, write 2, execute 1. 755 = rwxr-xr-x, 644 = rw-r--r--.' };
  });

  add('lx-cron', { obj: ['LX.CRON'], level: 2, lesson: 'f1-cron', label: 'Reading cron schedules' }, (r) => {
    const hh = r.int(1, 11), mm = r.pick([0, 15, 30, 45]);
    const T = (x) => String(x).padStart(2, '0');
    const kinds = [
      [`${mm} ${hh} * * *`, `Every day at ${T(hh)}:${T(mm)}`],
      [`*/${r.pick([5, 10, 15, 30])} * * * *`, null],
      [`${mm} ${hh} * * 1-5`, `At ${T(hh)}:${T(mm)} on weekdays (Monday to Friday)`],
      [`${mm} ${hh} 1 * *`, `At ${T(hh)}:${T(mm)} on the 1st day of every month`],
      [`${mm} ${hh} * * 0`, `At ${T(hh)}:${T(mm)} every Sunday`]];
    const [expr, text0] = r.pick(kinds);
    const step = expr.startsWith('*/') ? +expr.split(' ')[0].slice(2) : null;
    const right = text0 || `Every ${step} minutes`;
    const ds = step ? [{ t: `At minute ${step} of every hour`, why: '`*/N` means "every N units", not "at N". A plain number would mean that exact minute.' }, { t: `Every ${step} hours`, why: 'The first field is minutes; hours are the second field.' }, { t: 'Once a day', why: 'With `*` in the hour field, the job runs during every hour.' }]
      : [{ t: `Every day at ${T(mm)}:${T(hh)}`, why: 'The first field is the minute and the second is the hour.' }, { t: right.replace(/weekdays \(Monday to Friday\)/, 'weekends').replace('every Sunday', 'every Monday').replace(/the 1st day of every month/, 'every day in January').replace('Every day', 'Every hour'), why: 'Check the last three fields: day of month, month, day of week (0 and 7 are Sunday, 1 is Monday).' }, { t: `Every ${hh} hours`, why: 'A single number is an exact time; steps need the `*/N` form.' }];
    const o = opts({ t: right, why: `Fields: minute ${expr.split(' ')[0]}, hour ${expr.split(' ')[1]}, day of month ${expr.split(' ')[2]}, month ${expr.split(' ')[3]}, day of week ${expr.split(' ')[4]}.` }, ds);
    return o && { q: `When does this crontab line run? \`${expr} /home/student/backup.sh\``, options: o, explain: 'Cron fields in order: minute, hour, day of month, month, day of week.' };
  });

  /* ---------------- R ---------------- */
  add('r-index', { obj: ['R.BASICS'], level: 2, lesson: 'f3-r-basics', verify: 'r', label: 'R indexing starts at 1' }, (r) => {
    const v = Array.from({ length: 5 }, () => r.int(2, 60));
    if (new Set(v).size < 5) return null;
    const kind = r.pick(['one', 'two', 'neg', 'len']);
    let expr, right, ds;
    if (kind === 'one') { expr = 'x[2]'; right = rVec([v[1]]); ds = [{ t: rVec([v[2]]), why: 'R counts positions from 1 (unlike Python), so x[2] is the second element.' }, { t: rVec([v[0]]), why: 'x[1] is the first element; x[2] is the second.' }]; }
    else if (kind === 'two') { expr = 'x[c(1, 3)]'; right = rVec([v[0], v[2]]); ds = [{ t: rVec([v[1], v[3]]), why: 'R positions start at 1, so c(1, 3) picks the first and third elements.' }, { t: rVec([v[0], v[1], v[2]]), why: 'c(1, 3) lists exactly positions 1 and 3; it is not a range (that would be 1:3).' }]; }
    else if (kind === 'neg') { expr = 'x[-1]'; right = rVec(v.slice(1)); ds = [{ t: rVec([v[4]]), why: 'In R a negative index REMOVES that position (unlike Python, where -1 means the last item).' }, { t: rVec(v.slice(0, 4)), why: 'x[-1] drops the first element, not the last.' }]; }
    else { expr = 'length(x)'; right = '[1] 5'; ds = [{ t: '[1] 4', why: 'length counts all elements; there are 5.' }, { t: rVec([v.reduce((a, b) => a + b, 0)]), why: 'length counts elements; sum(x) would add them.' }]; }
    const o = opts({ t: right, why: 'This is what R prints. The [1] at the start means "this line starts with element 1".' }, ds);
    return o && { q: 'What does R print?', code: { lang: 'r', src: `x <- c(${v.join(', ')})\nprint(${expr})` }, options: o, explain: 'R vectors are indexed from 1; negative indexes drop elements; c() combines values.' };
  });

  add('r-logical', { obj: ['R.LOGIC'], level: 2, lesson: 'f3-r-control', verify: 'r', label: 'Logical vectors and filtering' }, (r) => {
    for (let t = 0; t < 20; t++) {
      const k = r.int(10, 30);
      const v = [r.int(1, k - 1), k, r.int(k + 1, 60), r.int(1, 60), r.int(k + 1, 70)];
      const kind = r.pick(['sum', 'filter', 'which', 'lgl']);
      let expr, right, ds;
      const gt = v.map((x) => x > k);
      if (!gt.some(Boolean)) continue;
      if (kind === 'sum') { expr = `sum(x > ${k})`; right = rVec([gt.filter(Boolean).length]); ds = [{ t: rVec([v.filter((x) => x > k).reduce((a, b) => a + b, 0)]), why: '`x > k` is a vector of TRUE/FALSE; sum counts the TRUEs (TRUE counts as 1). It does not add the original values.' }, { t: rVec([v.filter((x) => x >= k).length]), why: `\`>\` is strictly greater, so the value equal to ${k} does not count.` }]; }
      else if (kind === 'filter') { expr = `x[x > ${k}]`; right = rVec(v.filter((x) => x > k)); ds = [{ t: rVec(gt), why: 'Putting the logical vector INSIDE the brackets selects the values where it is TRUE; `x > k` on its own would print TRUE/FALSE.' }, { t: rVec(v.filter((x) => x >= k)), why: `\`>\` excludes the value equal to ${k}.` }]; }
      else if (kind === 'which') { expr = `which(x > ${k})`; right = rVec(v.map((x, i) => (x > k ? i + 1 : null)).filter((x) => x != null)); ds = [{ t: rVec(v.filter((x) => x > k)), why: 'which() returns POSITIONS of the TRUE values, not the values themselves.' }, { t: rVec(v.map((x, i) => (x > k ? i : null)).filter((x) => x != null)), why: 'R positions start at 1, not 0.' }]; }
      else { expr = `x > ${k}`; right = rVec(gt); ds = [{ t: rVec(v.filter((x) => x > k)), why: 'A comparison on a vector returns one TRUE or FALSE per element; it does not filter.' }, { t: rVec([gt.filter(Boolean).length]), why: 'Without sum(), R prints the whole logical vector.' }]; }
      const o = opts({ t: right, why: 'This is what R prints.' }, ds);
      if (o) return { q: 'What does R print?', code: { lang: 'r', src: `x <- c(${v.join(', ')})\nprint(${expr})` }, options: o, explain: 'Comparisons produce logical vectors (TRUE/FALSE). Use them inside [ ] to filter, with sum() to count, with which() to get positions. This is how quality-control filters work.' };
    }
    return null;
  });

  add('r-arith', { obj: ['R.BASICS'], level: 2, lesson: 'f3-r-basics', verify: 'r', label: 'Vectorized arithmetic and recycling' }, (r) => {
    const v = [r.int(1, 9), r.int(1, 9), r.int(1, 9), r.int(1, 9)];
    const kind = r.pick(['times', 'recycle', 'mean']);
    if (kind === 'times') { const m = r.int(2, 5); return { q: 'What does R print?', code: { lang: 'r', src: `x <- c(${v.join(', ')})\nprint(x * ${m})` }, options: opts({ t: rVec(v.map((x) => x * m)), why: 'Arithmetic on a vector applies to every element at once (vectorization).' }, [{ t: rVec([v.reduce((a, b) => a + b, 0) * m]), why: 'R does not add the elements first; it multiplies each element.' }, { t: rVec([v[0] * m, ...v.slice(1)]), why: 'The operation applies to all elements, not only the first.' }, { t: 'Error', why: 'Multiplying a vector by a number is normal R; no loop is needed.' }]), explain: 'Most R operations are vectorized: they work element by element.' }; }
    if (kind === 'recycle') { const a = r.int(10, 30), b = r.int(40, 90); const res = v.map((x, i) => x + (i % 2 ? b : a)); return { q: 'What does R print?', code: { lang: 'r', src: `x <- c(${v.join(', ')})\nprint(x + c(${a}, ${b}))` }, options: opts({ t: rVec(res), why: `The shorter vector is recycled: ${a}, ${b}, ${a}, ${b} is added element by element.` }, [{ t: rVec([v[0] + a, v[1] + b]), why: 'R does not stop at the shorter length; it repeats the shorter vector to match.' }, { t: 'Error', why: 'Recycling works silently when the longer length is a multiple of the shorter one (4 is a multiple of 2).' }, { t: rVec(v.map((x) => x + a + b)), why: 'The two numbers are used in turn, not both added to every element.' }]), explain: 'R recycles shorter vectors. It warns only when the longer length is not a multiple of the shorter.' }; }
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    const sorted = v.slice().sort((a, b) => a - b), med = (sorted[1] + sorted[2]) / 2;
    return { q: 'What does R print?', code: { lang: 'r', src: `x <- c(${v.join(', ')})\nprint(mean(x))` }, options: opts({ t: rVec([m]), why: `Sum ${v.reduce((a, b) => a + b, 0)} divided by ${v.length} values.` }, [{ t: rVec([v.reduce((a, b) => a + b, 0)]), why: 'mean divides the sum by the number of values.' }, { t: rVec([med]), why: 'That is the median (the middle of the sorted values). mean is the average.' }, { t: rVec([m * v.length / (v.length - 1)]), why: 'Divide by the number of values (4), not by one less.' }]), explain: 'mean() is the arithmetic average; median() the middle value.' };
  });

  BB.generators = G;
  BB.generate = function (key, seed) {
    const g = G.find((x) => x.key === key);
    if (!g) return null;
    for (let k = 0; k < 40; k++) {
      const s = (seed + k * 7919) >>> 0;
      const q = g.make(BB.rng(s));
      if (q && q.options && q.options.length >= 3) {
        q.options.forEach((o, i) => { if (!o.why) o.why = i === 0 ? 'This is correct.' : 'This does not match.'; });
        return Object.assign({ id: `gen:${key}:${s}`, gen: key, obj: g.obj, level: g.level, lesson: g.lesson, answer: 0, verify: g.verify ? { lang: g.verify } : null }, q);
      }
    }
    return null;
  };
})();
