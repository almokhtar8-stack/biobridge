/* Biology widgets: dogma (DNA -> RNA -> protein with mutations), expression (same genome, different cells), journey (discovery map). */
(function () {
  'use strict';
  const BB = window.BB;
  const { h, md } = BB;
  BB.widgets = BB.widgets || {};

  /* Standard genetic code (NCBI table 1), codons in TCAG order */
  const B = 'TCAG', AAS = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const CODE = {};
  let k = 0;
  for (const a of B) for (const b of B) for (const c of B) CODE[a + b + c] = AAS[k++];
  const AA = { A: ['Ala', 'alanine'], R: ['Arg', 'arginine'], N: ['Asn', 'asparagine'], D: ['Asp', 'aspartic acid'], C: ['Cys', 'cysteine'], E: ['Glu', 'glutamic acid'], Q: ['Gln', 'glutamine'], G: ['Gly', 'glycine'], H: ['His', 'histidine'], I: ['Ile', 'isoleucine'], L: ['Leu', 'leucine'], K: ['Lys', 'lysine'], M: ['Met', 'methionine'], F: ['Phe', 'phenylalanine'], P: ['Pro', 'proline'], S: ['Ser', 'serine'], T: ['Thr', 'threonine'], W: ['Trp', 'tryptophan'], Y: ['Tyr', 'tyrosine'], V: ['Val', 'valine'], '*': ['Stop', 'stop codon'] };
  const COMP = { A: 'T', T: 'A', G: 'C', C: 'G', N: 'N' };
  BB.bio = { CODE, AA, COMP, translate: (dna) => { const out = []; for (let i = 0; i + 3 <= dna.length; i += 3) out.push(CODE[dna.slice(i, i + 3)] || 'X'); return out.join(''); } };

  function orf(dna) {
    const start = dna.indexOf('ATG');
    if (start < 0) return { start: -1, codons: [], stopAt: -1 };
    const codons = [];
    let stopAt = -1;
    for (let i = start; i + 3 <= dna.length; i += 3) {
      const c = dna.slice(i, i + 3);
      codons.push({ c, i, aa: CODE[c] });
      if (CODE[c] === '*') { stopAt = i; break; }
    }
    return { start, codons, stopAt };
  }
  function classify(orig, mut) {
    if (orig === mut) return null;
    const a = orf(orig), b = orf(mut);
    if (mut.length !== orig.length) {
      const diff = Math.abs(mut.length - orig.length);
      const verb = mut.length > orig.length ? 'inserted' : 'deleted';
      if (diff % 3) return { kind: 'Frameshift', text: `${diff} letter${diff > 1 ? 's were' : ' was'} ${verb}, which is not a multiple of three, so every codon after the change is read in a different frame. The protein is usually garbled and often stops early.` };
      // Is the change one block? Strip the shared start and end; if one side is left empty, it was a single insertion or deletion.
      let p = 0; while (p < orig.length && p < mut.length && orig[p] === mut[p]) p++;
      let q = 0; while (q < orig.length - p && q < mut.length - p && orig[orig.length - 1 - q] === mut[mut.length - 1 - q]) q++;
      const oneBlock = orig.length - p - q === 0 || mut.length - p - q === 0;
      if (!oneBlock) return { kind: 'In-frame overall, shifted in between', text: `The total length changed by ${diff} letters, a multiple of three, but the changes are in more than one place. Codons between the first and last change are read in a shifted frame; only after the last change is the original frame restored.` };
      return { kind: 'In-frame insertion or deletion', text: `${diff} letters (a multiple of three) were ${verb} in one place, so the reading frame after the change is kept: amino acids are added or removed (the codon at the change may also differ), and the rest of the protein is unchanged.` };
    }
    if (a.start !== b.start) return { kind: b.start < 0 ? 'Start codon lost' : 'Start codon changed', text: 'The first ATG has changed, so translation would start somewhere else or not at all. The whole protein is affected.' };
    const pa = a.codons.map((c) => c.aa).join(''), pb = b.codons.map((c) => c.aa).join('');
    if (pa === pb) {
      const changed = [...orig].map((x, i) => (x !== mut[i] ? i : -1)).filter((i) => i >= 0);
      const end = a.stopAt >= 0 ? a.stopAt + 3 : a.start + a.codons.length * 3;
      const inStop = a.stopAt >= 0 && changed.every((i) => i >= a.stopAt && i < a.stopAt + 3);
      if (changed.every((i) => i < a.start || i >= end)) return { kind: 'Outside the protein-coding part', text: 'The change is before the start codon or after the stop codon, so it is not translated and the protein is identical. In a real gene this region can still matter, for example for how much protein is made.' };
      if (inStop) return { kind: 'Stop codon replaced by another stop', text: 'One stop codon (TAA, TAG or TGA) became another, so translation still ends at the same place and the protein is identical.' };
      return { kind: 'Silent change', text: 'The DNA changed but each codon still codes for the same amino acid, because the genetic code is redundant. The protein sequence is identical.' };
    }
    const idx = [...pb].findIndex((x, i) => x !== pa[i]);
    if (pb[idx] === '*') return { kind: 'Nonsense change', text: `Codon ${idx + 1} became a stop codon, so the protein is cut short after ${idx} amino acid${idx === 1 ? '' : 's'}. Short proteins often lose their function.` };
    if (pa[idx] === '*') return { kind: 'Stop codon lost', text: 'The stop codon was changed into an amino acid codon, so the ribosome keeps going and the protein becomes longer than normal.' };
    return { kind: 'Missense change', text: `Codon ${idx + 1} now codes for ${AA[pb[idx]][1]} instead of ${AA[pa[idx]][1]}. One amino acid changes. Depending on where it is, the protein may work normally, work less well or fail.` };
  }

  BB.widgets.dogma = function () {
    const DEFAULT = 'ATGGCCAAATTTGGGTAA';
    let original = DEFAULT, seq = DEFAULT, selected = null;
    const input = h('input', { type: 'text', value: DEFAULT, 'aria-label': 'DNA coding strand, letters A C G T', maxlength: '60', autocapitalize: 'characters', autocorrect: 'off', autocomplete: 'off', spellcheck: 'false', style: { fontFamily: 'var(--mono)', letterSpacing: '.08em' } });
    const view = h('div', { 'aria-live': 'polite' });
    const verdict = h('div', { 'aria-live': 'polite' });
    const nt = (b, extra = '', attrs = {}) => h('span.nt.nt-' + (b === 'U' ? 'U' : b) + extra, attrs, b);

    function draw() {
      view.innerHTML = '';
      const o = orf(seq);
      const coding = h('div.strand', { 'aria-label': 'Coding strand: ' + seq });
      [...seq].forEach((b, i) => {
        const btn = h('button.nt.nt-' + b, { type: 'button', title: 'Change this letter', 'aria-label': `Position ${i + 1}, ${b}. Press to choose a different letter`, style: { border: selected === i ? '2px solid var(--text)' : '0', cursor: 'pointer' }, onclick: () => { selected = i; draw(); } }, b);
        coding.append(btn);
      });
      const template = h('div.strand', { 'aria-label': 'Template strand: ' + [...seq].map((b) => COMP[b]).join('') }, [...seq].map((b) => nt(COMP[b])));
      const rna = seq.replace(/T/g, 'U');
      const mrna = h('div.strand', { 'aria-label': 'mRNA: ' + rna });
      if (o.start > 0) mrna.append(h('span.codon-group', { title: "5' untranslated region" }, [...rna.slice(0, o.start)].map((b) => nt(b))));
      const groups = [];
      if (o.start >= 0) {
        for (let i = o.start; i < seq.length; i += 3) {
          const c = rna.slice(i, i + 3);
          const inOrf = o.stopAt < 0 ? true : i <= o.stopAt;
          const origC = original.length === seq.length ? original.replace(/T/g, 'U').slice(i, i + 3) : null;
          groups.push(h('span.codon-group' + (origC && origC !== c ? '.mut' : ''), { style: { opacity: inOrf && c.length === 3 ? 1 : 0.45 } }, [...c].map((b) => nt(b))));
        }
      } else groups.push(...[...rna].map((b) => nt(b)));
      mrna.append(...groups);
      const protein = h('div.strand', { style: { gap: '6px' } });
      const origOrf = orf(original);
      if (o.start < 0) protein.append(h('span.muted', 'No start codon (ATG in DNA, AUG in RNA) found, so translation cannot begin.'));
      else o.codons.forEach((c, i) => {
        const before = original.length === seq.length && origOrf.codons[i] ? origOrf.codons[i].aa : null;
        protein.append(h('span.aa' + (c.aa === '*' ? '.stop' : '') + (before && before !== c.aa ? '.changed' : ''), c.aa === '*' ? 'STOP' : AA[c.aa][0], h('small', c.c.replace(/T/g, 'U'))));
      });
      if (o.start >= 0 && o.stopAt < 0) protein.append(h('span.small.muted', '(no stop codon yet: the ribosome would keep reading)'));
      view.append(
        h('div.strand-label', "DNA coding strand (5' to 3'). Tap a letter to change it."), coding,
        h('div.strand-label', "DNA template strand (3' to 5'), the strand RNA polymerase reads"), template,
        h('div.flow-arrow', BB.ui.icon('down'), 'Transcription: RNA is built as the complement of the template, so it matches the coding strand with U in place of T'),
        h('div.strand-label', "mRNA (5' to 3'), grouped into codons from the first AUG"), mrna,
        h('div.flow-arrow', BB.ui.icon('down'), 'Translation: each codon adds one amino acid'),
        h('div.strand-label', 'Protein'), protein);
      if (selected != null && selected < seq.length) {
        view.append(h('div.btn-row', { style: { marginTop: '10px' }, role: 'group', 'aria-label': 'Choose a new letter for position ' + (selected + 1) },
          h('span.small', `Position ${selected + 1}: change to`),
          'ACGT'.split('').filter((b) => b !== seq[selected]).map((b) => h('button.btn.btn-sm', { type: 'button', onclick: () => { seq = seq.slice(0, selected) + b + seq.slice(selected + 1); input.value = seq; selected = null; draw(); } }, b)),
          h('button.btn.btn-sm', { type: 'button', onclick: () => { seq = seq.slice(0, selected) + seq.slice(selected + 1); input.value = seq; selected = null; draw(); } }, 'Delete it'),
          h('button.btn.btn-sm.btn-quiet', { type: 'button', onclick: () => { selected = null; draw(); } }, 'Cancel')));
      }
      verdict.innerHTML = '';
      const c = classify(original, seq);
      if (c) {
        verdict.append(h('div.callout.pitfall', { style: { marginTop: '12px' } }, h('strong', c.kind), h('span', c.text)));
        const st = BB.store.state; if (!st.labs.dogma) { st.labs.dogma = { done: Date.now() }; BB.store.saveSoon(); }
      }
    }
    input.addEventListener('input', () => {
      const clean = input.value.toUpperCase().replace(/U/g, 'T').replace(/[^ACGT]/g, '');
      if (clean !== input.value) input.value = clean;
      seq = clean; original = clean; selected = null; draw();
    });
    const preset = (label, fn) => h('button.btn.btn-sm', { type: 'button', onclick: () => { seq = fn(DEFAULT); original = DEFAULT; input.value = seq; selected = null; draw(); } }, label);
    draw();
    return h('div.widget', { 'data-widget': 'dogma' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'From DNA to RNA to protein')), h('span.chip.violet', 'Standard genetic code')),
      h('div.field', h('label', { for: 'dogma-in' }, 'Type or edit a DNA coding strand'), Object.assign(input, { id: 'dogma-in' })),
      h('div.btn-row', { style: { margin: '10px 0' } }, h('span.small.muted', 'Try a change:'),
        preset('Silent', (s) => s.slice(0, 5) + 'A' + s.slice(6)),
        preset('Missense', (s) => s.slice(0, 10) + 'C' + s.slice(11)),
        preset('Nonsense', (s) => s.slice(0, 6) + 'T' + s.slice(7)),
        preset('Frameshift', (s) => s.slice(0, 7) + s.slice(8)),
        h('button.btn.btn-sm.btn-quiet', { type: 'button', onclick: () => { seq = original = DEFAULT; input.value = DEFAULT; selected = null; draw(); } }, 'Reset')),
      view, verdict,
      h('p.widget-note', 'Simplifications: real human genes contain introns that are removed before translation, and the ribosome finds the start codon using surrounding sequence too. This tool starts at the first ATG and uses the standard genetic code.'));
  };

  /* Same genome, different cells */
  BB.widgets.expression = function () {
    const cells = ['Liver cell', 'Nerve cell', 'Muscle cell', 'Pancreatic beta cell', 'Red blood cell precursor'];
    const genes = [
      ['ACTB', 'actin, part of the cell skeleton', [3, 3, 2, 3, 3]],
      ['GAPDH', 'an enzyme of energy metabolism (glycolysis)', [3, 3, 4, 3, 3]],
      ['ALB', 'albumin, the main protein in blood plasma', [4, 0, 0, 0, 0]],
      ['APOA1', 'a protein that carries fats in the blood', [3, 0, 0, 0, 0]],
      ['RBFOX3', 'a nerve-cell protein (NeuN) used to identify neurons', [0, 3, 0, 0, 0]],
      ['SNAP25', 'machinery for releasing signal molecules', [0, 4, 0, 2, 0]],
      ['ACTA1', 'skeletal-muscle actin for contraction', [0, 0, 4, 0, 0]],
      ['DES', 'desmin, which holds muscle fibers in place', [0, 0, 3, 0, 0]],
      ['INS', 'insulin, the hormone that lowers blood sugar', [0, 0, 0, 4, 0]],
      ['HBB', 'part of hemoglobin, which carries oxygen', [0, 0, 0, 0, 4]],
      ['HSPA1A', 'a heat-shock chaperone that helps proteins fold', [1, 1, 1, 1, 1]]
    ];
    const LV = ['off', 'low', 'medium', 'high', 'very high'];
    let heat = false, sel = null;
    const table = h('div.table-wrap');
    const info = h('div', { 'aria-live': 'polite', style: { marginTop: '10px' } });
    const color = (v) => (v === 0 ? 'var(--surface-3)' : `color-mix(in srgb, var(--accent) ${18 + v * 20}%, var(--surface))`);
    function draw() {
      table.innerHTML = '';
      const t = h('table.data', h('thead', h('tr', h('th', 'Gene'), cells.map((c) => h('th', c)))));
      const tb = h('tbody');
      genes.forEach(([g, role, lv], gi) => {
        const vals = lv.map((v) => (heat && g === 'HSPA1A' ? 4 : v));
        tb.append(h('tr' + (sel === gi ? '.hl' : ''), { tabindex: '0', style: { cursor: 'pointer' }, onclick: () => { sel = gi; draw(); }, onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel = gi; draw(); } } },
          h('td', h('strong', g)), vals.map((v) => h('td', { style: { background: color(v), fontWeight: v >= 3 ? 700 : 500 } }, LV[v]))));
      });
      t.append(tb);
      table.append(t);
      info.innerHTML = '';
      if (sel != null) {
        const [g, role, lv] = genes[sel];
        const on = cells.filter((c, i) => (heat && g === 'HSPA1A') || lv[i] > 0);
        info.append(h('div.callout.accent', h('strong', `${g}: ${role}`),
          g === 'HSPA1A' ? h('span', heat ? 'After heat shock it is switched on strongly in every cell type: a shared stress response, not a cell identity.' : 'At 37 C it is low everywhere. Turn on heat shock to see what happens.')
            : h('span', on.length === cells.length ? 'Used by every cell type here: a "housekeeping" gene.' : `Switched on in: ${on.join(', ')}. Every one of these cells still carries the ${g} gene in its DNA.`)));
      }
    }
    const heatBtn = h('button.btn.btn-sm', { type: 'button', 'aria-pressed': 'false', onclick: () => { heat = !heat; heatBtn.setAttribute('aria-pressed', String(heat)); heatBtn.textContent = heat ? 'Heat shock: ON (42 C)' : 'Heat shock: OFF (37 C)'; draw(); const st = BB.store.state; if (!st.labs.expression) { st.labs.expression = { done: Date.now() }; BB.store.saveSoon(); } } }, 'Heat shock: OFF (37 C)');
    draw();
    return h('div.widget', { 'data-widget': 'expression' },
      h('div.widget-head', h('div', h('div.eyebrow', 'Interactive'), h('h3', 'Same genome, different cells')), heatBtn),
      h('p.small', 'Every cell below has the same 11 genes in its DNA. Select a gene to see where it is used.'),
      table, info,
      h('p.widget-note', 'Illustrative levels based on well-known tissue-specific genes, not measured values. Real cells express thousands of genes at many levels.'));
  };

  /* The discovery journey */
  BB.widgets.journey = function () {
    const steps = [
      { t: 'Question', skill: 'Biology', what: 'Which genes do human cells switch on when they overheat? Prediction: chaperone genes, which help damaged proteins refold.', out: 'A testable question and a prediction.', lessons: ['f0-expression', 'f3-design'] },
      { t: 'Experiment', skill: 'Lab work and design', what: 'Grow six independent cultures: three at 37 C, three moved to 42 C for one hour. Extract RNA from each.', out: 'Six RNA samples with clear labels (metadata).', lessons: ['f3-design', 'f0-data'] },
      { t: 'Sequencing', skill: 'Instrument', what: 'Convert RNA to cDNA, prepare a library and sequence it. The machine reads millions of short fragments per sample.', out: 'FASTQ files: reads plus a quality score for every base.', lessons: ['f3-rnaseq', 'f3-fastq'] },
      { t: 'Processing', skill: 'Linux and scripts', what: 'On a Linux server, check read quality, match reads to genes (alignment or pseudoalignment) and count them.', out: 'A count matrix: genes in rows, samples in columns.', lessons: ['f1-navigate', 'f1-pipes', 'f3-align', 'f3-counts'] },
      { t: 'Analysis', skill: 'R or Python and statistics', what: 'Adjust for sequencing depth, compute fold changes, compare replicates, test every gene and correct for testing thousands of genes.', out: 'For each gene: log2 fold change and adjusted p-value.', lessons: ['f3-normalization', 'f3-foldchange', 'f3-tests', 'f3-multiple', 'f3-de'] },
      { t: 'Interpretation', skill: 'Biology and critical thinking', what: 'HSPA1A, HSPA1B, DNAJB1 and HSPH1 rise strongly; ACTB and GAPDH stay flat. This fits the known heat-shock response.', out: 'Careful conclusions and new hypotheses.', lessons: ['f3-interpret'] },
      { t: 'Validation', skill: 'Lab work', what: 'Confirm key genes with an independent method (for example qPCR), check protein levels, repeat in another cell type.', out: 'Evidence strong enough to call a finding.', lessons: ['f3-interpret', 'f3-workflows'] }
    ];
    const seen = new Set([0]);
    let cur = 0;
    const tabs = h('div.step-tabs', { role: 'tablist', 'aria-label': 'Steps of the project' });
    const panel = h('div', { role: 'tabpanel', 'aria-live': 'polite' });
    function draw() {
      tabs.innerHTML = '';
      steps.forEach((s, i) => tabs.append(h('button' + (seen.has(i) && i !== cur ? '.done' : ''), { type: 'button', role: 'tab', 'aria-selected': String(i === cur), 'aria-current': i === cur ? 'step' : null, onclick: () => { cur = i; seen.add(i); draw(); } }, `${i + 1}. ${s.t}`)));
      const s = steps[cur];
      panel.innerHTML = '';
      panel.append(h('div.card.soft',
        h('div.chips', h('span.chip.accent', s.skill)),
        h('h3', { style: { marginTop: '8px' } }, s.t),
        h('p', s.what),
        h('p.small', h('strong', 'Output: '), s.out),
        h('div.btn-row', h('span.small.muted', 'Learn it in:'), s.lessons.map((id) => h('a.btn.btn-sm.btn-ghost', { href: '#/lesson/' + id }, BB.lessonMeta[id].title))),
        h('div.btn-row', { style: { marginTop: '12px' } },
          cur > 0 ? h('button.btn.btn-sm', { type: 'button', onclick: () => { cur--; draw(); } }, BB.ui.icon('left'), 'Previous') : null,
          cur < steps.length - 1 ? h('button.btn.btn-sm.btn-primary', { type: 'button', onclick: () => { cur++; seen.add(cur); draw(); } }, 'Next step', BB.ui.icon('right')) : h('span.chip.green', 'You have seen the whole journey'))));
      if (seen.size === steps.length) { const st = BB.store.state; if (!st.labs.journey) { st.labs.journey = { done: Date.now() }; BB.store.saveSoon(); } }
    }
    draw();
    return h('div.widget', { 'data-widget': 'journey' }, h('div.widget-head', h('div', h('div.eyebrow', 'Interactive map'), h('h3', 'From question to discovery'))), tabs, panel);
  };
})();
