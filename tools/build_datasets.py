#!/usr/bin/env python3
"""Generate BioBridge's teaching datasets (seeded, reproducible).

Writes:
  content/datasets.js  - heat-shock bulk RNA-seq toy data (+ simplified statistics), single-cell toy data, FASTQ/FASTA examples
  content/vfs.js       - the virtual file system used by the simulated terminal and by verified Linux questions

The numbers are simulated for teaching. Gene names and the direction of the heat-shock response are real
(heat shock strongly induces HSP70-family and related chaperone genes); the exact counts are invented.
Run:  python3 tools/build_datasets.py
"""
import json, math, os
import numpy as np
from scipy import stats

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(20261205)

# ---------------------------------------------------------------- bulk heat-shock experiment
samples = ["ctrl_1", "ctrl_2", "ctrl_3", "heat_1", "heat_2", "heat_3"]
condition = ["control"] * 3 + ["heat_shock"] * 3
libsize = [18_400_000, 22_100_000, 20_300_000, 24_600_000, 17_900_000, 21_200_000]  # total reads assigned to ALL genes

# CPM targets (control, heat). FOS gets one unusual heat replicate to teach variability.
named = [
    ("HSPA1A", 11.0, 480.0), ("HSPA1B", 9.0, 410.0), ("HSPA6", 0.08, 45.0), ("DNAJB1", 48.0, 320.0),
    ("HSPH1", 80.0, 270.0), ("HSPB1", 130.0, 220.0), ("BAG3", 21.0, 78.0), ("ACTB", 2200.0, 2150.0),
    ("GAPDH", 1900.0, 1880.0), ("EEF1A1", 5200.0, 5150.0), ("TP53", 35.0, 34.0), ("FOS", 12.0, 12.0),
]
annotation = {
    "HSPA1A": ("6", "heat_shock", "heat shock protein family A (Hsp70) member 1A"),
    "HSPA1B": ("6", "heat_shock", "heat shock protein family A (Hsp70) member 1B"),
    "HSPA6": ("1", "heat_shock", "heat shock protein family A (Hsp70) member 6"),
    "DNAJB1": ("19", "heat_shock", "DnaJ heat shock protein family (Hsp40) member B1"),
    "HSPH1": ("13", "heat_shock", "heat shock protein family H (Hsp110) member 1"),
    "HSPB1": ("7", "heat_shock", "heat shock protein family B (small) member 1"),
    "BAG3": ("10", "heat_shock", "BAG cochaperone 3"),
    "ACTB": ("7", "housekeeping", "actin beta"),
    "GAPDH": ("12", "housekeeping", "glyceraldehyde-3-phosphate dehydrogenase"),
    "EEF1A1": ("6", "housekeeping", "eukaryotic translation elongation factor 1 alpha 1"),
    "TP53": ("17", "transcription_factor", "tumor protein p53"),
    "FOS": ("14", "transcription_factor", "Fos proto-oncogene, AP-1 transcription factor subunit"),
}

def draw_counts(cpm_c, cpm_h, sd=0.09, fos=False):
    out = []
    for j in range(6):
        base = cpm_c if j < 3 else cpm_h
        if fos and j == 4:
            base = 95.0  # one heat replicate is unusually high (handling stress can spike FOS)
        mu = base * libsize[j] / 1e6 * math.exp(rng.normal(0, sd))
        out.append(int(rng.poisson(mu)))
    return out

named_counts = {}
for g, c, h in named:
    named_counts[g] = draw_counts(c, h, sd=0.05 if g in ("ACTB", "GAPDH", "EEF1A1") else 0.09, fos=(g == "FOS"))

# Background genes: anonymous simulated genes so the volcano plot looks like a real experiment.
n_bg = 1500
bg = []
for i in range(n_bg):
    cpm = float(np.exp(rng.normal(2.2, 1.6)))  # median around 9 CPM
    u = rng.random()
    if u < 0.05:
        lfc = rng.normal(1.6, 0.6)
    elif u < 0.10:
        lfc = -abs(rng.normal(1.4, 0.5))
    else:
        lfc = 0.0
    cpm_h = cpm * 2 ** lfc
    bg.append((f"gene_{i+1:04d}", draw_counts(cpm, cpm_h, sd=0.22)))

all_genes = [(g, named_counts[g]) for g, _, _ in named] + bg

def analyse(counts):
    cpm = [counts[j] / libsize[j] * 1e6 for j in range(6)]
    c, h = cpm[:3], cpm[3:]
    mc, mh = float(np.mean(c)), float(np.mean(h))
    lfc = math.log2((mh + 1) / (mc + 1))
    lc = np.log2(np.array(c) + 1); lh = np.log2(np.array(h) + 1)
    if np.allclose(lc.std(), 0) and np.allclose(lh.std(), 0):
        p = 1.0
    else:
        p = float(stats.ttest_ind(lh, lc, equal_var=False).pvalue)
        if not np.isfinite(p):
            p = 1.0
    return cpm, mc, mh, lfc, p

rows = []
for g, cts in all_genes:
    cpm, mc, mh, lfc, p = analyse(cts)
    rows.append([g, cts, [round(x, 2) for x in cpm], round(mc, 2), round(mh, 2), round(lfc, 3), p])

# Benjamini-Hochberg
ps = np.array([r[6] for r in rows]); m = len(ps)
order = np.argsort(ps); ranked = ps[order] * m / (np.arange(m) + 1)
adj = np.minimum.accumulate(ranked[::-1])[::-1]; adj = np.minimum(adj, 1)
padj = np.empty(m); padj[order] = adj
for r, q in zip(rows, padj):
    r.append(float(q))

def sig(x):
    return float(f"{x:.3g}")

bulk = {
    "title": "Heat shock in cultured human cells (toy data)",
    "story": "Cells were grown at 37 C (control) or moved to 42 C for one hour (heat shock). RNA from three independent cultures per condition was sequenced.",
    "samples": samples, "condition": condition, "libsize": libsize,
    "named": [g for g, _, _ in named],
    "annotation": {g: list(v) for g, v in annotation.items()},
    "genes": [{"g": r[0], "c": r[1], "lfc": r[5], "p": sig(r[6]), "padj": sig(r[7]), "mc": r[3], "mh": r[4]} for r in rows],
    "method": "log2FC = log2((mean heat CPM + 1) / (mean control CPM + 1)); p-value from a Welch t-test on log2(CPM + 1); BH-adjusted p-values across all genes. This simplified approach is for teaching only.",
}

# ---------------------------------------------------------------- single-cell toy (PBMC-like)
genes_sc = ["CD3E", "IL7R", "CD8A", "MS4A1", "CD79A", "NKG7", "GNLY", "FCGR3A", "LYZ", "CD14", "PPBP", "MT-CO1"]
types = {
    # name: (n cells, centre x, centre y, spread, mean UMI per gene)
    "CD4 T cells": (110, -4.0, 2.5, 0.9, {"CD3E": 3, "IL7R": 3, "CD8A": 0.05, "MT-CO1": 4}),
    "CD8 T cells": (55, -2.2, 4.4, 0.7, {"CD3E": 3, "CD8A": 2.5, "NKG7": 1.5, "GNLY": 0.6, "MT-CO1": 4}),
    "NK cells": (40, 0.4, 5.2, 0.7, {"NKG7": 6, "GNLY": 7, "FCGR3A": 1.5, "MT-CO1": 4}),
    "B cells": (60, -5.0, -3.5, 0.8, {"MS4A1": 3, "CD79A": 4, "MT-CO1": 4}),
    "CD14 monocytes": (85, 4.4, -1.0, 0.9, {"LYZ": 12, "CD14": 3, "MT-CO1": 5}),
    "FCGR3A monocytes": (30, 5.6, 2.2, 0.6, {"LYZ": 5, "FCGR3A": 4, "MT-CO1": 5}),
    "Platelets": (12, 1.2, -5.3, 0.4, {"PPBP": 9, "MT-CO1": 2}),
}
cells = []
for t, (n, cx, cy, sp, means) in types.items():
    for _ in range(n):
        x = cx + rng.normal(0, sp); y = cy + rng.normal(0, sp)
        expr = [int(rng.poisson(means.get(g, 0.03))) for g in genes_sc]
        total = int(rng.normal(2400, 500)); total = max(total, 900)
        mito = round(float(np.clip(rng.normal(4.0, 1.5), 0.5, 9.0)), 1)
        genes_detected = int(np.clip(rng.normal(900, 180), 350, 1600))
        cells.append({"t": t, "x": round(float(x), 2), "y": round(float(y), 2), "e": expr, "umi": total, "mito": mito, "ng": genes_detected})
# low-quality cells: few genes, high mitochondrial fraction (typical of damaged cells)
for _ in range(26):
    x = rng.normal(-0.6, 1.4); y = rng.normal(-1.2, 1.2)
    expr = [int(rng.poisson(0.2)) for _ in genes_sc]
    expr[genes_sc.index("MT-CO1")] = int(rng.poisson(18))
    cells.append({"t": "Low-quality", "x": round(float(x), 2), "y": round(float(y), 2), "e": expr,
                  "umi": int(rng.normal(700, 150)), "mito": round(float(rng.uniform(22, 48)), 1), "ng": int(rng.normal(260, 60))})
perm = rng.permutation(len(cells))
cells = [cells[i] for i in perm]
single = {
    "title": "Blood immune cells (toy single-cell data)",
    "genes": genes_sc, "cells": cells,
    "markers": {"CD4 T cells": ["CD3E", "IL7R"], "CD8 T cells": ["CD3E", "CD8A"], "NK cells": ["NKG7", "GNLY"],
                "B cells": ["MS4A1", "CD79A"], "CD14 monocytes": ["LYZ", "CD14"], "FCGR3A monocytes": ["FCGR3A", "LYZ"],
                "Platelets": ["PPBP"]},
    "note": "Simulated counts and a hand-placed 2D layout that imitates a UMAP plot. Real data has thousands of genes per cell.",
}

# ---------------------------------------------------------------- FASTQ and FASTA examples
def rand_seq(n, gc=0.5):
    p = [(1 - gc) / 2, gc / 2, gc / 2, (1 - gc) / 2]
    return "".join(rng.choice(list("ACGT"), size=n, p=p))

qual_scale = "IIIIHHHGGGFFFEEEDDCCBA@?>=<;:98765"
fastq = []
for i in range(8):
    s = rand_seq(36, 0.48)
    q = []
    for k in range(36):
        base = 40 - int(k * 0.35) - int(abs(rng.normal(0, 2.5)))
        if rng.random() < 0.04:
            base = rng.integers(2, 12)
        q.append(chr(33 + int(np.clip(base, 2, 41))))
    if i == 5:  # one read with a low-quality tail and an N base
        q = q[:24] + [chr(33 + int(rng.integers(2, 10))) for _ in range(12)]
        s = s[:30] + "N" + s[31:]
        q[30] = "#"
    fastq.append((f"@READ_{i+1:04d}", s, "+", "".join(q)))
fastq_text = "\n".join("\n".join(r) for r in fastq) + "\n"

fasta_records = [
    ("seq_01", "toy sequence A", "ATGGCCAAATTTGGGCTGAAGAATTCCGATCGTTAGCATGCCGTAACGGTTAAGCTGATCCGAATGCAGTTGCA"),
    ("seq_02", "toy sequence B", "ATGAGCGCGCTTCAGGAGCTGCGCGGCCATGTGGCGAGCCTGTTCGCGGAGCTGGCGAAGTAA"),
    ("seq_03", "toy sequence C", "TTAATATTAAATAATTTAAATATTACATTAATATAATATTTAATAAATA"),
    ("seq_04", "toy sequence D", "ATGGAATTCGGTACCAAGCTTGCATGCCTGCAGGTCGACTCTAGAGGATCCCCGGGTAAATGA"),
    ("seq_05", "toy sequence E", "GCGCGCGCATATATGCGCATTTAAAGGGCCCGGGAAATTTCCCGGGTTTAAACCCGGG"),
    ("seq_06", "toy sequence F", "ATGCCCTTTAAACCCGGGTTTAAATAG"),
]
def wrap(s, w=60):
    return "\n".join(s[i:i + w] for i in range(0, len(s), w))
fasta_text = "".join(f">{i} {d}\n{wrap(s)}\n" for i, d, s in fasta_records)

# ---------------------------------------------------------------- virtual file system
counts_tsv = "gene\t" + "\t".join(samples) + "\n" + "".join(
    g + "\t" + "\t".join(str(x) for x in named_counts[g]) + "\n" for g, _, _ in named)
samples_tsv = "sample\tcondition\treplicate\ttemperature_C\n" + "".join(
    f"{s}\t{c}\t{(i % 3) + 1}\t{37 if c == 'control' else 42}\n" for i, (s, c) in enumerate(zip(samples, condition)))
annotation_tsv = "symbol\tchromosome\tcategory\tdescription\n" + "".join(
    f"{g}\t{a[0]}\t{a[1]}\t{a[2]}\n" for g, a in annotation.items())

readme = """Heat-shock RNA-seq practice project
===================================
Question: which genes change when human cells are heated from 37 C to 42 C for one hour?

data/counts.tsv      reads assigned to 12 genes in 6 samples (tab-separated)
data/samples.tsv     which condition each sample belongs to
data/annotation.tsv  chromosome and category for each gene
data/sequences.fa    six short toy DNA sequences (FASTA)
data/reads.fastq     eight short toy sequencing reads (FASTQ)
scripts/             small shell scripts
results/             put your output files here

All numbers are simulated for teaching.
"""
notes = """Welcome to the BioBridge practice server.
Your project files are in the folder called project.
Try:  cd project   then   ls
"""
count_seqs = """#!/bin/bash
# Count the sequences in a FASTA file.
# Usage: ./count_seqs.sh FILE
file=$1
n=$(grep -c ">" "$file")
echo "$file contains $n sequences"
"""
line_report = """#!/bin/bash
# Report how many lines each .tsv file in a folder has.
# Usage: bash line_report.sh FOLDER
for f in "$1"/*.tsv
do
  echo "$f: $(wc -l < "$f") lines"
done
"""
bashrc = """# ~/.bashrc: settings read when an interactive shell starts
export PS1='\\u@\\h:\\w$ '
alias ll='ls -l'
"""
vfs = {
    "home": "/home/student", "user": "student", "host": "biobridge",
    "dirs": ["/", "/bin", "/etc", "/home", "/home/student", "/home/student/project", "/home/student/project/data",
             "/home/student/project/scripts", "/home/student/project/results", "/tmp", "/usr", "/usr/bin", "/var"],
    "files": {
        "/etc/hostname": {"c": "biobridge\n"},
        "/home/student/.bashrc": {"c": bashrc},
        "/home/student/notes.txt": {"c": notes},
        "/home/student/project/README.txt": {"c": readme},
        "/home/student/project/data/counts.tsv": {"c": counts_tsv},
        "/home/student/project/data/samples.tsv": {"c": samples_tsv},
        "/home/student/project/data/annotation.tsv": {"c": annotation_tsv},
        "/home/student/project/data/sequences.fa": {"c": fasta_text},
        "/home/student/project/data/reads.fastq": {"c": fastq_text},
        "/home/student/project/scripts/count_seqs.sh": {"c": count_seqs, "mode": "644"},
        "/home/student/project/scripts/line_report.sh": {"c": line_report, "mode": "755"},
    },
}

examples = {
    "fastq": [{"id": r[0], "seq": r[1], "qual": r[3]} for r in fastq],
    "fasta": [{"id": i, "desc": d, "seq": s} for i, d, s in fasta_records],
}

def dump(name, var, obj, header):
    path = os.path.join(ROOT, "content", name)
    with open(path, "w") as f:
        f.write(header)
        f.write("window.BB = window.BB || {};\n")
        f.write(f"BB.{var} = ")
        json.dump(obj, f, separators=(",", ":"), ensure_ascii=False)
        f.write(";\n")
    print("wrote", path, os.path.getsize(path), "bytes")

hdr = "/* Generated by tools/build_datasets.py (seeded). Do not edit by hand; edit the script and re-run. */\n"
dump("datasets.js", "data", {"bulk": bulk, "single": single, "examples": examples}, hdr)
dump("vfs.js", "vfs", vfs, hdr)

# quick human-readable summary
print("\nlibrary sizes:", libsize)
print(counts_tsv)
for r in rows[:12]:
    print(f"{r[0]:8s} lfc={r[5]:7.3f} p={r[6]:.3g} padj={r[7]:.3g} meanCPM c={r[3]} h={r[4]}")
print("n padj<0.05:", sum(1 for r in rows if r[7] < 0.05), "of", len(rows))
print("cells:", len(cells))
print(fasta_text)
print(fastq_text)
