/* Python trace programs (BB.pyPrograms) for Foundation 2. Written to tools/CONTENT_GUIDE.md section 8.
   `lesson` names the lesson each program belongs to. `ask` lines are 1-based line numbers of `code`.
   After editing, run: node tools/validate.mjs --quiet; python3 tools/build_traces.py  (regenerates content/py-traces.js) */
window.BB = window.BB || {};
BB.pyPrograms = BB.pyPrograms || {};

BB.pyPrograms["calc-precedence"] = {
  title: "Precedence: which operation runs first?",
  lesson: "f2-first-program",
  code: "mean_wrong = 212 + 282 + 203 / 3\nmean_right = (212 + 282 + 203) / 3\nwhole = 697 // 3\nleft = 697 % 3\nprint(mean_wrong)\nprint(mean_right)\nprint(whole, left)",
  ask: [
    {
      line: 1,
      var: "mean_wrong",
      q: "What value does `mean_wrong` get?",
      options: ["232.33333333333334", "561.6666666666666", "697"],
      answer: 1,
      why: "Division runs before addition, so only 203 is divided by 3: 212 + 282 + 67.67 is about 561.67. This is not the mean."
    },
    {
      line: 3,
      var: "whole",
      q: "`//` divides and drops the remainder. What is `whole`?",
      options: ["232", "232.33333333333334", "1"],
      answer: 0,
      why: "3 fits into 697 a whole 232 times. `//` keeps that whole number and drops what is left over."
    },
    {
      line: 4,
      var: "left",
      q: "What is `left`, the remainder of 697 divided by 3?",
      options: ["0", "232", "1"],
      answer: 2,
      why: "232 times 3 is 696, so 1 is left over. `%` gives the remainder, not the number of times 3 fits."
    }
  ]
};

BB.pyPrograms["types-convert"] = {
  title: "Text or number? Watching types change",
  lesson: "f2-types",
  code: "raw = \"203\"\ndoubled_text = raw * 2\ncount = int(raw)\ndoubled = count * 2\nmean = (212 + 282 + count) / 3\nlabel = \"ctrl_3: \" + str(count)\nprint(label)\nprint(doubled_text, doubled, mean)",
  ask: [
    {
      line: 2,
      var: "doubled_text",
      q: "`raw` is a string. What does `raw * 2` give?",
      options: ["406", "'203203'", "'406'"],
      answer: 1,
      why: "Multiplying a string repeats the text. The quotes in the answer show that the result is still a str."
    },
    {
      line: 4,
      var: "doubled",
      q: "After `count = int(raw)`, what is `count * 2`?",
      options: ["406", "'203203'", "'406'"],
      answer: 0,
      why: "`int()` turned the text into the number 203, so `* 2` is now arithmetic. No quotes: it is an int."
    },
    {
      line: 5,
      var: "mean",
      q: "All three values are ints. What value does `mean` hold after the division with `/`?",
      options: ["232", "697", "232.33333333333334"],
      answer: 2,
      why: "`/` always gives a float. The long tail of digits comes from storing decimal numbers with limited precision."
    }
  ]
};

BB.pyPrograms["var-update"] = {
  title: "Assigning and updating variables",
  lesson: "f2-variables",
  code: "reads = 18400000\ntotal = reads\nreads = 22100000\ntotal = total + reads\nsamples = 2\nmean = total / samples\nprint(total, mean)",
  ask: [
    {
      line: 3,
      var: "total",
      q: "`reads` has just been changed to 22100000. What is `total` now?",
      options: ["22100000", "18400000", "40500000"],
      answer: 1,
      why: "`total` was given the value 18400000 on line 2. Changing `reads` later does not reach back and change `total`."
    },
    {
      line: 4,
      var: "total",
      q: "What is `total` after `total = total + reads`?",
      options: ["40500000", "44200000", "22100000"],
      answer: 0,
      why: "Python reads the current values, 18400000 and 22100000, adds them and stores 40500000 back in `total`."
    },
    {
      line: 6,
      var: "mean",
      q: "What is `mean`?",
      options: ["20250000", "40500000", "20250000.0"],
      answer: 2,
      why: "40500000 / 2 is 20250000, and `/` always produces a float, so Python shows 20250000.0."
    }
  ]
};

BB.pyPrograms["func-mean3"] = {
  title: "A function called twice",
  lesson: "f2-functions",
  code: "def mean3(a, b, c):\n    total = a + b + c\n    return total / 3\n\nctrl = mean3(212, 282, 203)\nheat = mean3(11018, 8441, 10838)\nfold = heat / ctrl\nprint(round(fold, 1))",
  ask: [
    {
      line: 2,
      occurrence: 1,
      var: "total",
      q: "First call: what is `total` inside the function?",
      options: ["232.33333333333334", "697", "212"],
      answer: 1,
      why: "The arguments 212, 282 and 203 went into a, b and c, and 212 + 282 + 203 is 697. The division happens on the next line."
    },
    {
      line: 2,
      occurrence: 2,
      var: "total",
      q: "Second call: what is `total` now?",
      options: ["30297", "697", "10099.0"],
      answer: 0,
      why: "Each call starts fresh with new arguments. The old total from the first call no longer exists."
    },
    {
      line: 6,
      var: "heat",
      q: "What value is stored in `heat`?",
      options: ["30297", "None", "10099.0"],
      answer: 2,
      why: "`return total / 3` sends back 30297 / 3, which is 10099.0. Without `return`, `heat` would be None."
    }
  ]
};

BB.pyPrograms["func-return-print"] = {
  title: "print versus return",
  lesson: "f2-functions",
  code: "def show_mean(a, b, c):\n    print((a + b + c) / 3)\n\ndef get_mean(a, b, c):\n    return (a + b + c) / 3\n\nx = show_mean(270, 511, 552)\ny = get_mean(270, 511, 552)\nprint(x, y)",
  ask: [
    {
      line: 7,
      var: "x",
      q: "`show_mean` prints the mean. What is stored in `x`?",
      options: ["444.3333333333333", "None", "'444.3333333333333'"],
      answer: 1,
      why: "The function displays the mean but has no `return`, so the call gives back None."
    },
    {
      line: 8,
      var: "y",
      q: "What is stored in `y`?",
      options: ["444.3333333333333", "None", "1333"],
      answer: 0,
      why: "`get_mean` returns the mean, so the value is handed back and stored. Nothing is printed by this call."
    }
  ]
};

BB.pyPrograms["logic-qc"] = {
  title: "A quality check with and, or and not",
  lesson: "f2-logic",
  code: "reads = 17900000\nmapped = 0.65\ndeep_enough = reads >= 15000000\nwell_mapped = mapped >= 0.7\npassed = deep_enough and well_mapped\nneeds_check = not passed\nprint(passed, needs_check)",
  ask: [
    {
      line: 3,
      var: "deep_enough",
      q: "What is `deep_enough`?",
      options: ["False", "17900000", "True"],
      answer: 2,
      why: "17,900,000 is at least 15,000,000, so the comparison gives True. A comparison produces a Boolean, not a number."
    },
    {
      line: 5,
      var: "passed",
      q: "`well_mapped` is False because 0.65 is below 0.7. What is `passed`?",
      options: ["True", "False", "0.65"],
      answer: 1,
      why: "`and` is True only when both sides are True. One failed check makes the whole test fail."
    },
    {
      line: 6,
      var: "needs_check",
      q: "What is `needs_check`?",
      options: ["True", "False", "None"],
      answer: 0,
      why: "`not` flips False to True: the sample failed, so it needs checking."
    }
  ]
};

BB.pyPrograms["cond-depth"] = {
  title: "Which branch runs? Labeling sequencing depth",
  lesson: "f2-conditionals",
  code: "def depth_label(reads):\n    if reads < 15000000:\n        label = \"low\"\n    elif reads < 20000000:\n        label = \"ok\"\n    else:\n        label = \"good\"\n    return label\n\na = depth_label(18400000)\nb = depth_label(24600000)\nc = depth_label(9000000)\nprint(a, b, c)",
  ask: [
    {
      line: 10,
      var: "a",
      q: "ctrl_1 has 18,400,000 reads. What label does it get?",
      options: ["'good'", "'low'", "'ok'"],
      answer: 2,
      why: "The first condition is False (18.4 million is not below 15 million), the `elif` is True, so the chain stops at \"ok\"."
    },
    {
      line: 11,
      var: "b",
      q: "heat_1 has 24,600,000 reads. What label does it get?",
      options: ["'ok'", "'good'", "'low'"],
      answer: 1,
      why: "Both conditions are False, so the `else` block runs. `else` catches every value the earlier tests did not."
    }
  ]
};

BB.pyPrograms["module-dates"] = {
  title: "Borrowing math and datetime",
  lesson: "f2-modules",
  code: "import math\nimport datetime\n\nfc = 10099.0 / 232.3\nlog2_fc = round(math.log2(fc), 2)\ncollected = datetime.date(2026, 2, 20)\nsequenced = datetime.date(2026, 3, 6)\nwaited = (sequenced - collected).days\nprint(log2_fc, waited)",
  ask: [
    {
      line: 5,
      var: "log2_fc",
      q: "`fc` is about 43.5. What is `log2_fc`?",
      options: ["5.44", "43.47", "6.44"],
      answer: 0,
      why: "2 to the power 5.44 is about 43.5. `math.log2` answers: 2 to what power gives this number?"
    },
    {
      line: 8,
      var: "waited",
      q: "How many days passed between collection and sequencing?",
      options: ["16", "15", "14"],
      answer: 2,
      why: "February 2026 has 28 days: 8 days to the end of February plus 6 in March. datetime knows month lengths; 16 assumes a 30-day February, and 15 counts both end days."
    }
  ]
};

BB.pyPrograms["str-methods"] = {
  title: "Slicing and string methods",
  lesson: "f2-strings",
  code: "seq = \"ATGGCCAAATTTGGGTAA\"\nfirst_codon = seq[0:3]\nlast_codon = seq[-3:]\ngc = seq.count(\"G\") + seq.count(\"C\")\nrna = seq.replace(\"T\", \"U\")\nseq.lower()\nprint(first_codon, last_codon, gc)\nprint(rna)\nprint(seq)",
  ask: [
    {
      line: 3,
      var: "last_codon",
      q: "What is `seq[-3:]`?",
      options: ["'AAT'", "'TAA'", "'GTA'"],
      answer: 1,
      why: "A negative start counts from the end: the slice takes the last three characters, in their original order."
    },
    {
      line: 4,
      var: "gc",
      q: "How many G and C bases are there?",
      options: ["7", "5", "'GC'"],
      answer: 0,
      why: "There are 5 G and 2 C. `count` returns a number for each letter, and `+` adds the two numbers."
    },
    {
      line: 6,
      var: "seq",
      q: "`seq.lower()` has just run. What is `seq` now?",
      options: ["'atggccaaatttgggtaa'", "None", "'ATGGCCAAATTTGGGTAA'"],
      answer: 2,
      why: "Strings cannot be changed in place. `lower()` made a new lowercase string, but it was not stored, so `seq` is unchanged."
    }
  ]
};

BB.pyPrograms["loop-filter"] = {
  title: "A loop with an accumulator and a filter",
  lesson: "f2-lists-loops",
  code: "counts = [212, 282, 203, 11018, 8441, 10838]\ntotal = 0\nhigh = []\nfor c in counts:\n    total = total + c\n    if c > 1000:\n        high.append(c)\nprint(total)\nprint(high)",
  ask: [
    {
      line: 5,
      occurrence: 2,
      var: "total",
      q: "Second pass through the loop: what is `total` now?",
      options: ["282", "494", "212"],
      answer: 1,
      why: "`total` keeps its value between passes: 212 from the first pass plus 282 from the second."
    },
    {
      line: 5,
      occurrence: 4,
      var: "total",
      q: "Fourth pass: what is `total` now?",
      options: ["11715", "11018", "697"],
      answer: 0,
      why: "The three control counts add up to 697, and the fourth count, 11018, brings the total to 11715."
    },
    {
      line: 7,
      occurrence: 2,
      var: "high",
      q: "What does `high` contain after its second append?",
      options: ["[8441]", "[11018, 8441, 10838]", "[11018, 8441]"],
      answer: 2,
      why: "`append` adds to the end and keeps what was already there. The third high count has not been reached yet."
    }
  ]
};

BB.pyPrograms["loop-codons"] = {
  title: "Cutting a gene into codons with range",
  lesson: "f2-lists-loops",
  code: "seq = \"ATGGCCAAATTTGGGTAA\"\ncodons = []\nfor i in range(0, len(seq), 3):\n    codons.append(seq[i:i + 3])\nprint(codons)\nprint(len(codons))",
  ask: [
    {
      line: 4,
      occurrence: 2,
      var: "codons",
      q: "What is `codons` after the second pass?",
      options: ["['ATG', 'TGG']", "['ATG', 'GCC']", "['GCC']"],
      answer: 1,
      why: "`range(0, len(seq), 3)` gives 0, 3, 6 and so on, so the second slice is `seq[3:6]`, the codon GCC."
    },
    {
      line: 4,
      occurrence: 3,
      var: "i",
      q: "On the third pass, what is `i`?",
      options: ["6", "3", "2"],
      answer: 0,
      why: "The third argument of `range` is the step. Starting at 0 and stepping by 3 gives 0, 3, 6."
    }
  ]
};

BB.pyPrograms["dict-count"] = {
  title: "Counting bases with a dictionary",
  lesson: "f2-dicts",
  code: "seq = \"GATTACA\"\ncounts = {}\nfor base in seq:\n    if base in counts:\n        counts[base] = counts[base] + 1\n    else:\n        counts[base] = 1\nprint(counts)",
  ask: [
    {
      line: 5,
      occurrence: 1,
      var: "counts",
      q: "A base is seen for the second time. What is `counts` now?",
      options: ["{'G': 1, 'A': 1, 'T': 1}", "{'G': 1, 'A': 2, 'T': 2}", "{'G': 1, 'A': 1, 'T': 2}"],
      answer: 2,
      why: "G, A and T were each new and set to 1. The second T is already a key, so its value goes up to 2."
    },
    {
      line: 5,
      occurrence: 3,
      var: "counts",
      q: "After the last base, what is `counts`?",
      options: ["{'G': 1, 'A': 2, 'T': 2, 'C': 1}", "{'G': 1, 'A': 3, 'T': 2, 'C': 1}", "{'G': 1, 'A': 1, 'T': 1, 'C': 1}"],
      answer: 1,
      why: "GATTACA has three A. Each repeat adds 1, and keys stay in the order they were first seen."
    }
  ]
};

BB.pyPrograms["dict-translate"] = {
  title: "Translating codons with a dictionary",
  lesson: "f2-dicts",
  code: "codon_table = {\"ATG\": \"M\", \"GCC\": \"A\", \"AAA\": \"K\", \"TAA\": \"*\"}\nseq = \"ATGGCCAAATAA\"\nprotein = \"\"\nfor i in range(0, len(seq), 3):\n    codon = seq[i:i + 3]\n    aa = codon_table[codon]\n    if aa == \"*\":\n        break\n    protein = protein + aa\nprint(protein)",
  ask: [
    {
      line: 9,
      occurrence: 2,
      var: "protein",
      q: "What is `protein` after the second codon?",
      options: ["'MA'", "'M'", "'AM'"],
      answer: 0,
      why: "ATG gives M and GCC gives A. Each amino acid is added to the end, so the order matches the codons."
    },
    {
      line: 6,
      occurrence: 4,
      var: "aa",
      q: "The fourth codon is TAA. What does the lookup give?",
      options: ["'K'", "'TAA'", "'*'"],
      answer: 2,
      why: "The dictionary maps the key TAA to the value \"*\", which marks a stop codon. The next line then breaks out of the loop."
    }
  ]
};

BB.pyPrograms["parse-lines"] = {
  title: "Parsing tab-separated lines",
  lesson: "f2-files",
  code: "lines = [\"sample\\tcondition\\ttemperature_C\\n\", \"ctrl_1\\tcontrol\\t37\\n\", \"heat_1\\theat_shock\\t42\\n\"]\nheated = []\nfor line in lines[1:]:\n    fields = line.rstrip(\"\\n\").split(\"\\t\")\n    if int(fields[2]) > 37:\n        heated.append(fields[0])\nprint(heated)",
  ask: [
    {
      line: 4,
      occurrence: 1,
      var: "fields",
      q: "What is `fields` for the first data line?",
      options: ["['ctrl_1', 'control', 37]", "['ctrl_1', 'control', '37']", "'ctrl_1 control 37'"],
      answer: 1,
      why: "`split` cuts the line at each tab and returns a list of strings. Nothing is converted to a number yet."
    },
    {
      line: 6,
      occurrence: 1,
      var: "heated",
      q: "What is `heated` after the append?",
      options: ["['heat_1']", "['heat_1', 'heat_shock', '42']", "['ctrl_1', 'heat_1']"],
      answer: 0,
      why: "Only `fields[0]`, the sample name, is appended, and only for the line whose temperature is above 37."
    }
  ]
};

BB.pyPrograms["read-max"] = {
  title: "Read it first: what does this loop find?",
  lesson: "f2-read-code",
  code: "counts = [813, 1035, 1100, 6820, 5530, 6641]\nbest = counts[0]\nbest_i = 0\nfor i in range(1, len(counts)):\n    if counts[i] > best:\n        best = counts[i]\n        best_i = i\nprint(best_i, best)",
  ask: [
    {
      line: 6,
      occurrence: 2,
      var: "best",
      q: "What is `best` after it is updated for the second time?",
      options: ["1035", "6820", "1100"],
      answer: 2,
      why: "1035 beat 813 on the first update, and 1100 beat 1035 on the second. The loop keeps the largest value seen so far."
    },
    {
      line: 7,
      occurrence: 3,
      var: "best_i",
      q: "What is `best_i` after the third update?",
      options: ["4", "3", "5"],
      answer: 1,
      why: "6820 sits at index 3 (counting from 0). The later counts, 5530 and 6641, are smaller, so `best_i` stays 3."
    }
  ]
};

BB.pyPrograms["debug-reset"] = {
  title: "A bug with no error message",
  lesson: "f2-debug",
  code: "counts = [212, 282, 203]\nfor c in counts:\n    total = 0\n    total = total + c\nmean = total / len(counts)\nprint(mean)",
  ask: [
    {
      line: 4,
      occurrence: 2,
      var: "total",
      q: "Second pass: what is `total`?",
      options: ["282", "494", "0"],
      answer: 0,
      why: "`total = 0` is inside the loop, so it is reset on every pass and then holds only the current count."
    },
    {
      line: 5,
      var: "mean",
      q: "What is `mean`?",
      options: ["232.33333333333334", "0.0", "67.66666666666667"],
      answer: 2,
      why: "Only the last count, 203, survives the resets, and 203 / 3 is about 67.67. No error appears; the answer is simply wrong."
    }
  ]
};
