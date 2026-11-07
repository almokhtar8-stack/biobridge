/* Foundation 3, first half: sequence data, RNA-seq from sample to counts, and R. Written to tools/CONTENT_GUIDE.md. */
window.BB = window.BB || {};
BB.lessons = BB.lessons || [];

BB.lessons.push({
  id: "f3-fasta",
  what: "FASTA is a simple text format for storing sequences. Each record has a header line that starts with `>` and names the sequence, followed by one or more lines of sequence letters: A, C, G and T for DNA, or one-letter amino acid codes for protein.",
  problem: "Scientists need to store and exchange sequences of every size, from a short gene to a whole chromosome, in a form that any program can read. FASTA solves this with the simplest possible rule: a name line, then the letters. It began as the input format of a 1980s sequence-comparison program and became the standard for reference genomes and protein databases.",
  care: "Every reference genome, gene sequence and protein database you download will be FASTA. Reading one correctly, and knowing that lines are not the same as sequences, prevents some of the most common beginner errors.",
  steps: [
    "A header line starts with `>`. The first word after it is the identifier (for example `seq_01`); anything after the first space is a free-text description.",
    "The sequence follows on the next lines and continues until the next `>` or the end of the file. Long sequences are usually wrapped into lines of fixed width, for example 60 or 80 letters, so one sequence can span many lines.",
    "To get a complete sequence, a program joins all the sequence lines of a record. To count records, you count header lines, not all lines.",
    "The letters follow agreed codes: A, C, G and T for DNA, N for an unknown base, and 20 one-letter codes for the standard amino acids in protein files.",
    "FASTA stores no quality information, only names and sequences. Files usually end in `.fa` or `.fasta`, and large ones are often compressed (`.fa.gz`)."
  ],
  deeper: "The full letter code (the IUPAC code) also has letters for uncertain bases, such as Y for C or T, and W for A or T. Some genome files write repeated regions in lowercase (soft-masking); most tools treat lowercase like uppercase. A reference genome FASTA has one record per chromosome, so the record for human chromosome 1 is about 249 million letters long.",
  show: {
    intro: "Two records copied from the practice file `sequences.fa`, plus one protein record added here for comparison.",
    lang: "fasta",
    code: ">seq_02 toy sequence B\nATGAGCGCGCTTCAGGAGCTGCGCGGCCATGTGGCGAGCCTGTTCGCGGAGCTGGCGAAG\nTAA\n>seq_06 toy sequence F\nATGCCCTTTAAACCCGGGTTTAAATAG\n>seq_06_protein seq_06 translated\nMPFKPGFK",
    notes: [
      "Each record starts with a header beginning with `>`. In `>seq_02 toy sequence B`, the identifier is `seq_02` and `toy sequence B` is the description.",
      "seq_02 is 63 bases long but takes two lines, because the file wraps at 60 letters. Its last line, `TAA`, is a stop codon that belongs to the same sequence.",
      "seq_06 fits on one line (27 bases). Read in codons, it is ATG CCC TTT AAA CCC GGG TTT AAA TAG.",
      "The same format stores protein. The last record is seq_06 translated: M (methionine), P (proline), F (phenylalanine), K (lysine), P, G (glycine), F, K. The stop codon adds no letter."
    ]
  },
  pitfall: {
    wrong: "Each line of a FASTA file is one sequence, so `wc -l` tells me how many sequences I have.",
    right: "A record is a header plus all the sequence lines below it. `sequences.fa` has 15 lines but only 6 sequences, because three long sequences are wrapped onto two lines. Count the header lines (those starting with `>`) instead."
  },
  try: { kind: "terminal", mission: "f3-fasta" },
  check: [
    {
      q: "Which line could start a record in a FASTA file?",
      options: [
        { t: ">HSPA1A_mRNA human heat shock protein 70", why: "Correct. A header starts with `>`; `HSPA1A_mRNA` is the identifier and the rest is a description." },
        { t: "@HSPA1A_mRNA human heat shock protein 70", why: "`@` starts a record in FASTQ, the format for reads with quality scores. FASTA headers use `>`." },
        { t: "HSPA1A_mRNA > human heat shock protein 70", why: "The `>` must be the first character of the line. This line would be read as sequence letters, which it is not." }
      ],
      answer: 0
    },
    {
      q: "In `sequences.fa`, the record seq_02 is a header followed by a line of 60 letters and then a line containing `TAA`. What is seq_02?",
      options: [
        { t: "One sequence, 60 bases long; `TAA` is a separate note", why: "Everything until the next `>` is sequence. Dropping the wrapped line would cut off the stop codon at the end of the sequence." },
        { t: "Two sequences, of 60 and 3 bases", why: "A new sequence only starts at a new header line. Wrapping splits the text, not the sequence." },
        { t: "One sequence, 63 bases long", why: "Correct. All lines between one header and the next belong to the same record; the file wraps long sequences at 60 letters." }
      ],
      answer: 2
    },
    {
      q: "A FASTA record has the header `>P01` followed by the line `MKTAYIAKQRQISFVKSHFSRQ`. What does it contain?",
      options: [
        { t: "A DNA sequence with many sequencing errors", why: "A sequencer writes an unreadable base as N, not as other letters. Letters such as I, Q and F are never used for DNA at all; they are amino acid codes." },
        { t: "A protein sequence in one-letter amino acid codes", why: "Correct. FASTA also stores proteins. The M at the start is methionine, the amino acid encoded by the start codon." },
        { t: "An RNA sequence", why: "RNA uses only A, C, G and U. Most letters here are not RNA bases." }
      ],
      answer: 1
    }
  ],
  real: "Reference genomes from Ensembl, NCBI and UCSC are distributed as FASTA files with one record per chromosome, and protein databases such as UniProt use the same format. In an RNA-seq project, the genome or transcriptome FASTA is what reads are matched against, so a wrong or incomplete FASTA file affects every later step.",
  teach: {
    prompt: "Explain to a friend how a FASTA file is organized and how to count the sequences in it correctly.",
    points: ["A record is a header line starting with > followed by sequence lines", "The identifier is the first word of the header", "Long sequences wrap over several lines, so count headers, not lines", "FASTA holds DNA, RNA or protein sequences, but no quality scores"]
  }
});

BB.lessons.push({
  id: "f3-fastq",
  what: "A read is the sequence of one DNA fragment, or of one end of it, as reported by a sequencer. FASTQ is the text format that stores reads: four lines per read, including a quality score for every base that says how confident the instrument is in that base.",
  problem: "Sequencers make errors, and the chance of an error differs from base to base and from read to read. Later tools need to know which bases to trust. FASTQ keeps each base together with its own confidence, written compactly as one character per base.",
  care: "FASTQ files are the raw data of almost every sequencing experiment, including RNA-seq. Reading one record, decoding its quality line and spotting a poor read are the first quality checks in any project.",
  steps: [
    "Line 1 starts with `@` and gives the read's identifier. Line 2 is the sequence. Line 3 starts with `+` (sometimes followed by the identifier again). Line 4 is the quality string, exactly as long as the sequence.",
    "Each quality character encodes a Phred score: Q = -10 x log10(P), where P is the probability that the base is wrong. Q10 means 1 error in 10, Q20 means 1 in 100, Q30 means 1 in 1,000 and Q40 means 1 in 10,000.",
    "To store a score as a single character, the file uses the character whose ASCII code is Q + 33 (Phred+33). To decode, subtract 33 from the character's code: `I` is 73, so Q40; `?` is 63, so Q30; `5` is 53, so Q20; `#` is 35, so Q2.",
    "A base the instrument could not identify is written as `N`, usually with a very low score.",
    "Every read takes exactly four lines, so the number of reads is the number of lines divided by 4."
  ],
  deeper: "On Illumina instruments, quality usually falls toward the end of each read. That is why quality reports (for example from FastQC) plot quality by position, and why trimming tools cut poor ends and leftover adapter sequence. In paired-end sequencing, each fragment is read from both ends, giving two files (often named `_R1` and `_R2`) whose records are in the same order. Some very old files used Phred+64; decoding them as Phred+33 gives many scores far above 41, which is a clue to the encoding.",
  show: {
    intro: "One record from the practice file `reads.fastq`: the sixth read, chosen because it has problems.",
    lang: "bash",
    code: "head -n 24 reads.fastq | tail -n 4",
    output: "@READ_0006\nCACCAACCTCGAGTCGCTAATACGCTCAGCNGAAAT\n+\nHIGHGGBGGDBFEDACDB*CBAA>$&*$#(#(&$('",
    notes: [
      "`head -n 24` keeps the first 6 reads (6 x 4 lines), and `tail -n 4` keeps the last of those: READ_0006.",
      "Line 2 has 36 bases. Position 31 is `N`: the instrument could not tell which base was there.",
      "Decode line 4 by subtracting 33 from each character's ASCII code. The first character, `H` (72), is Q39: about 1 error in 8,000. The character under the N, `#` (35), is Q2.",
      "The last 12 characters, `$&*$#(#(&$('`, are all Q9 or lower. The end of this read is unreliable, and a trimming tool would remove it."
    ]
  },
  pitfall: {
    wrong: "A read is an exact copy of a piece of RNA, so every base can be trusted equally.",
    right: "Each base is a measurement with its own error probability, and quality usually drops toward the end of a read. Reads can also contain N bases or adapter sequence. That is why quality checks and trimming come before alignment."
  },
  try: { kind: "widget", widget: "fastq" },
  check: [
    {
      q: "A FASTQ file has 4,000,000 lines. How many reads does it hold?",
      options: [
        { t: "1,000,000", why: "Correct. Every read takes exactly four lines: header, sequence, + line and quality." },
        { t: "4,000,000", why: "That assumes one read per line, but each read uses four lines." },
        { t: "2,000,000", why: "That counts only the header and sequence lines. The + line and the quality line also belong to each read." }
      ],
      answer: 0
    },
    {
      q: "In a quality line, the character `5` has ASCII code 53. What does it tell you about its base?",
      options: [
        { t: "Q53: the base is almost certainly correct", why: "This forgets to subtract 33. In Phred+33, the score is the ASCII code minus 33." },
        { t: "Q20: about a 1 in 100 chance that the base is wrong", why: "Correct. 53 - 33 = 20, and Q20 means an error probability of 10 to the power of -2, or 1 in 100." },
        { t: "Q5: the base is probably wrong", why: "The character is not the score itself. `5` is simply the character whose code is 53." },
        { t: "The base was read 5 times", why: "Quality characters encode an error probability, not how many times a base was read." }
      ],
      answer: 1
    },
    {
      q: "Base A has quality Q30 and base B has quality Q20. Which statement is correct?",
      options: [
        { t: "Base A is 1.5 times more reliable, because 30 / 20 = 1.5", why: "The Phred scale is logarithmic. Ten extra points means ten times fewer errors, not a ratio of the two scores." },
        { t: "Base B is more reliable, because a lower score means fewer errors", why: "Higher Phred scores mean higher confidence. Q20 is less reliable than Q30." },
        { t: "Base B is about 10 times more likely to be wrong than base A", why: "Correct. Q20 means 1 error in 100 and Q30 means 1 in 1,000: every 10 extra points means 10 times fewer errors." }
      ],
      answer: 2
    }
  ],
  real: "A single run of a modern Illumina instrument can produce billions of reads, delivered as compressed FASTQ files (`.fastq.gz`) for each sample. Before alignment, pipelines run quality reports and trim adapters and poor read ends. In the heat-shock project, each of the six samples would start as FASTQ files holding tens of millions of reads.",
  teach: {
    prompt: "Explain the four lines of a FASTQ record and how to turn a quality character into an error probability.",
    points: ["Header with @, sequence, a + line, and a quality line of the same length", "Q = -10 log10(P): Q20 is 1 error in 100, Q30 is 1 in 1,000", "Phred+33: subtract 33 from the character's ASCII code", "Low-quality ends, N bases and adapters are trimmed or filtered before analysis"]
  }
});

BB.lessons.push({
  id: "f3-rnaseq",
  what: "RNA sequencing (RNA-seq) measures which RNA molecules are in a sample and in what proportions. The RNA is copied into DNA, millions of short fragments are sequenced, and each gene's expression is estimated by counting the reads that came from it.",
  problem: "Gene expression differs between cell types and changes with conditions, but a cell contains tens of thousands of different RNAs. Older methods measured one gene at a time, or only genes chosen in advance. RNA-seq measures thousands of genes at once, including genes nobody expected to change.",
  care: "The KAUST course's case study analyzes RNA-seq count data. Knowing how those counts were produced tells you what they can answer and what they cannot, so you do not over-interpret them.",
  steps: [
    "Extract RNA from each sample. Most of it is ribosomal RNA (often around 80 percent or more), so the protocol either captures mRNA by its poly-A tail (poly-A selection) or removes ribosomal RNA (rRNA depletion).",
    "Break the RNA into short fragments and copy them into complementary DNA (cDNA) by reverse transcription, because sequencers read DNA, not RNA.",
    "Attach adapters (short, known DNA sequences) to both ends of each fragment and amplify the fragments by PCR. The result is a sequencing library.",
    "Sequence the library. Each sequenced fragment gives one read, or two for paired-end sequencing; a typical bulk sample yields tens of millions of reads.",
    "Assign each read to the gene it came from and count. A gene's count reflects its share of the RNA in the library: a relative measure, not a number of molecules per cell."
  ],
  deeper: "RNA-seq has known limits. Bulk RNA-seq averages over all cells in the sample, so a change in one cell type can be diluted, and a change in the mix of cell types can look like a change in expression. Longer transcripts produce more fragments than shorter ones at the same number of molecules. Poly-A selection misses RNAs without poly-A tails, such as many histone mRNAs and bacterial mRNAs. And RNA levels are not protein levels.",
  show: {
    intro: "One sample's journey from a dish of cells to numbers, using ctrl_1 from the heat-shock experiment.",
    lang: "text",
    code: "ctrl_1: one dish of cells grown at 37 C\ntotal RNA      mostly ribosomal RNA; mRNA is only a few percent\nafter poly-A   mainly mRNA, from thousands of genes at once\nlibrary        short cDNA fragments with adapters on both ends\nsequencing     tens of millions of reads, typically 50 to 150 bases each\ncounting       18,400,000 reads assigned to genes, including:\n  HSPA1A           212 reads       11.5 per million\n  ACTB          44,289 reads    2,407.0 per million",
    notes: [
      "Every stage removes or changes something: ribosomal RNA is removed, molecules are broken and copied, and only a sample of the fragments is sequenced.",
      "The final numbers are shares of the library. HSPA1A got 212 of the 18,400,000 assigned reads, which is 11.5 reads per million; ACTB got about 2,407 per million.",
      "Both numbers are averages over all the cells in the dish. They cannot tell you whether every cell or only some cells made HSPA1A RNA."
    ]
  },
  pitfall: {
    wrong: "RNA-seq counts the RNA molecules in a cell, so a 40-fold rise in HSPA1A reads means each cell has 40 times more HSP70 protein.",
    right: "RNA-seq estimates each gene's share of the sequenced RNA, averaged over many cells. It does not give molecules per cell, and RNA changes do not translate one-to-one into protein changes, which also depend on translation and protein breakdown."
  },
  try: {
    kind: "parsons",
    lang: "text",
    prompt: "Put the steps of the heat-shock RNA-seq experiment in order, from cells to counts.",
    lines: [
      "Grow the cultures and apply each condition (37 C, or 42 C for one hour)",
      "Extract total RNA from each culture",
      "Keep mRNA by poly-A selection, or remove ribosomal RNA (rRNA depletion)",
      "Break the RNA into fragments and copy them into cDNA (reverse transcription)",
      "Attach adapters and amplify the library by PCR",
      "Sequence the library: millions of short reads per sample, saved as FASTQ",
      "Check read quality, then assign reads to genes and count them"
    ],
    explain: "The condition must be applied before RNA is extracted. mRNA is enriched before it is fragmented and copied into cDNA, adapters and PCR turn the fragments into a library, the sequencer reads the library, and only then can reads be checked and counted. (Some protocols fragment after making cDNA, but the overall order is the same.)"
  },
  check: [
    {
      q: "After poly-A selection, which RNA molecules make up most of the library?",
      options: [
        { t: "mRNAs, which carry a poly-A tail", why: "Correct. Poly-A selection captures molecules with a poly-A tail, which also removes most ribosomal RNA." },
        { t: "Ribosomal RNA, because it is the most abundant RNA", why: "Ribosomal RNA has no poly-A tail, so poly-A selection removes most of it. That is the purpose of the step." },
        { t: "Equal amounts of every RNA in the cell", why: "Library preparation enriches some RNAs and loses others; it never gives equal amounts of everything." }
      ],
      answer: 0
    },
    {
      q: "HSPA1A RNA rises about 40-fold after heat shock. Which conclusion does the RNA-seq data alone support?",
      options: [
        { t: "The amount of HSP70 protein rose exactly 40-fold", why: "Protein was not measured. Translation and protein breakdown are regulated separately, so protein can change by a different amount." },
        { t: "Every cell in the dish increased its HSPA1A RNA 40-fold", why: "Bulk RNA-seq averages over all cells. The same average could come from some cells responding strongly and others not at all." },
        { t: "HSPA1A RNA became a much larger share of the cells' RNA after heat shock", why: "Correct. That is what RNA-seq measures: RNA abundance relative to other RNAs, averaged over the cells." }
      ],
      answer: 2
    },
    {
      q: "A lab wants to measure gene expression in bacteria. Which change to the library preparation is needed?",
      options: [
        { t: "Nothing, because poly-A selection works the same in every organism", why: "Bacterial mRNAs lack stable poly-A tails, so poly-A selection would lose most of them." },
        { t: "Use rRNA depletion instead of poly-A selection", why: "Correct. Bacterial mRNA does not carry the stable poly-A tail that poly-A selection captures, so removing ribosomal RNA is the way to enrich for mRNA." },
        { t: "Skip reverse transcription, because bacterial RNA is already DNA", why: "Bacterial RNA is RNA like any other. It must be copied into cDNA before a DNA sequencer can read it." }
      ],
      answer: 1
    }
  ],
  real: "RNA-seq is used to find genes that change in disease, to classify tumors by their expression patterns and to map which genes each tissue uses; the GTEx project, for example, measured expression across dozens of human tissues. Knowing the laboratory steps helps you recognize problems, such as degraded RNA or leftover ribosomal RNA, when they show up in quality reports.",
  teach: {
    prompt: "Explain what RNA-seq measures, step by step, and give two things it does not measure.",
    points: ["RNA is enriched, fragmented, copied into cDNA, given adapters and sequenced", "Reads are assigned to genes and counted", "Counts are relative shares, averaged over many cells", "RNA-seq does not measure protein or molecules per cell"]
  }
});

BB.lessons.push({
  id: "f3-design",
  what: "Experimental design is the plan for which samples to collect and how to process them so that a comparison is fair. Its key parts are the conditions (what you compare), the replicates (how many independent samples per condition) and the control of confounders (other differences that could explain the result).",
  problem: "Sequencing data is expensive and noisy, and a flaw in the design cannot be fixed later by any analysis. If the heat-shocked cultures were also the only ones processed on a different day, nobody could tell whether a change came from heat or from the day.",
  care: "Before you analyze any count table, you should be able to look at its sample sheet and say whether the comparison can be trusted. That judgment matters as much as any code.",
  steps: [
    "Define the conditions: the groups you want to compare, such as control (37 C) and heat shock (42 C for one hour). Keep everything else the same.",
    "Use biological replicates: independent samples per condition, such as separate cultures, animals or patients. They show how much results vary naturally. Three per condition is a common minimum, and more replicates detect smaller changes.",
    "Know the difference from technical replicates: the same RNA prepared or sequenced twice. They measure only the noise of the method, so they cannot replace biological replicates.",
    "Watch for confounding variables: other things that change together with the condition, such as processing day, person, reagent batch or sequencing run. Differences caused by such processing groups are called batch effects.",
    "Balance and randomize: spread each condition evenly across days, batches and runs, choose the order at random, and record every batch in the sample metadata."
  ],
  deeper: "When batches are balanced across conditions, a batch effect can be estimated and accounted for, for example by including batch as a term in the statistical model used for differential expression. When batch and condition are perfectly confounded, no method can separate them. Pooling RNA from several cultures into one sample also hides variation: it gives one average, not several replicates.",
  show: {
    intro: "Two ways the six heat-shock cultures could have been processed. The real `samples.tsv` does not record processing days; this is a thought experiment.",
    lang: "text",
    code: "Plan A: confounded\nsample   condition    RNA extracted on\nctrl_1   control      day 1\nctrl_2   control      day 1\nctrl_3   control      day 1\nheat_1   heat_shock   day 2\nheat_2   heat_shock   day 2\nheat_3   heat_shock   day 2\n\nPlan B: balanced\nsample   condition    RNA extracted on\nctrl_1   control      day 1\nheat_1   heat_shock   day 1\nctrl_2   control      day 2\nheat_2   heat_shock   day 2\nctrl_3   control      day 3\nheat_3   heat_shock   day 3",
    notes: [
      "In plan A, condition and extraction day change together. If the heated samples look different, the cause could be heat, the day, or both: the two are confounded.",
      "In plan B, every day has one control and one heated culture. A day effect hits both conditions equally, so the heat effect can still be estimated, and the day can be added to the analysis.",
      "Plan B takes one more day. Good design sometimes costs time, but it is far cheaper than an experiment whose result cannot be interpreted."
    ]
  },
  pitfall: {
    wrong: "Sequencing one culture per condition very deeply, or sequencing it three times, gives me three replicates.",
    right: "Extra depth and repeated sequencing reduce measurement noise for that one culture, but they say nothing about how much independent cultures differ. Only biological replicates let statistics separate a real effect from natural variation."
  },
  try: {
    kind: "predict",
    q: "You have 3 control and 3 heat-shocked cultures, but you can extract RNA from only 2 samples per day, over 3 days. Which plan is best?",
    options: [
      { t: "Day 1: ctrl_1 and ctrl_2; day 2: ctrl_3 and heat_1; day 3: heat_2 and heat_3", why: "Day 1 has only controls and day 3 only heated cultures, so day and condition are partly confounded." },
      { t: "Each day: one control and one heated culture, in an order chosen at random", why: "Right. Every day contains both conditions, so a day effect cannot look like a heat effect, and random order protects against other hidden influences." },
      { t: "Any order is fine, as long as the replicate numbers are written down", why: "Recording is important, but it does not remove confounding. The design itself must balance conditions across days." },
      { t: "Extract only ctrl_1 and heat_1, so that everything happens on one day", why: "This removes the day effect but leaves one culture per condition, so natural variation between cultures cannot be estimated." }
    ],
    answer: 1
  },
  check: [
    {
      q: "Which pair of samples are biological replicates?",
      options: [
        { t: "Two separate cultures of the same cell line, each heat-shocked with the same protocol", why: "Correct. Each culture is an independent biological sample, so together they show natural variation between cultures." },
        { t: "The same RNA sample sequenced on two lanes", why: "That repeats the measurement of one sample: a technical replicate." },
        { t: "One culture split into two tubes just before RNA extraction", why: "Both tubes share the same culture and history, so they mainly capture technical variation from extraction onward." },
        { t: "A control culture and a heat-shocked culture", why: "These are different conditions. Replicates are repeats within one condition." }
      ],
      answer: 0
    },
    {
      q: "A study sequences all tumor samples at one center and all healthy samples at another. What is the main problem?",
      options: [
        { t: "Too few genes are measured", why: "RNA-seq measures thousands of genes. The flaw is in how samples were assigned, not in the number of genes." },
        { t: "Sequencing center is confounded with disease status, so technical differences between centers could look like tumor biology", why: "Correct. Centers differ in protocols, reagents and handling, and here those differences line up perfectly with tumor versus healthy." },
        { t: "Nothing, as long as both centers use the same instrument model", why: "Identical instruments still differ in reagents, people, timing and sample handling." }
      ],
      answer: 1
    },
    {
      q: "In a balanced design, each extraction day had one control and one heated culture. Why should you still record the day in the sample table?",
      options: [
        { t: "Because analysis tools refuse sample tables without dates", why: "Tools accept any columns. Recording batch is good practice, not a file requirement." },
        { t: "Because writing the day down removes the day effect", why: "Writing it down removes nothing. It lets the analysis model the effect." },
        { t: "So the analysis can check for a day effect and account for it if there is one", why: "Correct. Balance makes a day effect separable from heat; recording the day makes it possible to estimate it and remove it." }
      ],
      answer: 2
    }
  ],
  real: "Careful studies balance batches across conditions and record them, because the cost of not doing so can be high. In a well-known case, a 2014 comparison of human and mouse tissues reported that samples grouped by species rather than by tissue. A 2015 reanalysis found that species was largely confounded with sequencing batch (the flow cells and lanes used); after correcting for batch, the samples grouped by tissue instead. Because the two were so entangled, the data could not settle the question either way.",
  teach: {
    prompt: "Explain to a friend why three independent cultures per condition are better than one culture sequenced three times, and how to avoid confounding with processing day.",
    points: ["Biological replicates capture natural variation; technical replicates capture only method noise", "A confounder changes together with the condition, so its effect cannot be separated", "Balance each batch across conditions and randomize the order", "Record batches in the metadata so they can be checked and modeled"]
  }
});

BB.lessons.push({
  id: "f3-align",
  what: "Alignment (also called mapping) finds where each read came from by matching it to a reference sequence. Quantification turns those matches into a number for each gene or transcript. Together they convert millions of reads into a count table.",
  problem: "A FASTQ file is a pile of short sequences with no labels: nothing in a read says which gene it came from. The only way to find out is to compare each read with a known reference, fast enough for tens of millions of reads per sample, while allowing for sequencing errors and for real differences between individuals.",
  care: "The KAUST course works with count data, so you may never run an aligner there, but every count you analyze was produced this way. Knowing the steps tells you what can go wrong in a count, for example with genes that look alike.",
  steps: [
    "Choose a reference: a reference genome (FASTA of all chromosomes) plus an annotation file (GTF) that lists where each gene and exon lies, or a reference transcriptome (FASTA of all known transcripts).",
    "Alignment route: a splice-aware aligner such as STAR or HISAT2 places each read on the genome. Introns are removed from mRNA, so a read can start in one exon and end in the next, and the aligner must split it across the intron.",
    "The aligner writes a SAM file (plain text) or a BAM file (its compressed binary form), with one record per aligned read: the chromosome, the position and how the read matched.",
    "Counting: a tool such as featureCounts compares each read's position with the annotation and adds one to the gene it overlaps. The result is a count for every gene in every sample.",
    "Pseudoalignment route: tools such as Salmon and kallisto skip the slow step of placing every base of every read on the genome. They quickly find which transcripts each read is compatible with and estimate how many reads came from each transcript, which can then be summed to genes."
  ],
  deeper: "Some reads match several places equally well (multi-mapping reads). HSPA1A and HSPA1B, two neighboring genes on chromosome 6 with nearly identical coding sequences, are an example. Many gene counters skip such reads by default, while Salmon and kallisto share them between candidates using a statistical model. Alignment to the genome is needed to view reads in a genome browser, find new splice junctions or detect variants; pseudoalignment is a common choice when the goal is the expression of known transcripts.",
  show: {
    intro: "A toy example of a read that crosses an exon junction, and how a splice-aware aligner places it.",
    lang: "text",
    code: "genome     ...GCCAAATTT[intron, 812 bases]GGGCTGAA...\nmRNA       ...GCCAAATTTGGGCTGAA...\nread           CCAAATTTGGGC\naligned        CCAAATTT[skipped 812 bases]GGGC\nCIGAR      8M812N4M",
    notes: [
      "The intron is in the genome but not in the mature mRNA, so the read's 12 letters sit together in the mRNA but are split in the genome.",
      "A splice-aware aligner places the first 8 bases at the end of exon 1 and the last 4 at the start of exon 2. An aligner built for DNA would fail to place the read, or align only part of it.",
      "In the SAM output, the CIGAR string `8M812N4M` records this: 8 bases aligned (M), 812 reference bases skipped (N), 4 bases aligned.",
      "This is a toy. Real reads are usually 50 to 150 bases long, and many introns are thousands of bases long."
    ]
  },
  pitfall: {
    wrong: "Alignment and counting are the same thing: once reads are aligned, I have gene expression.",
    right: "Alignment gives positions. You still need an annotation to decide which gene each position belongs to, and rules for reads that overlap two genes or match several places. Different choices give somewhat different counts, which is why methods sections name the tools and versions used."
  },
  try: {
    kind: "predict",
    q: "A 100-base read comes from an mRNA: its first 60 bases are the end of exon 3 and its last 40 bases are the start of exon 4. In the genome, exons 3 and 4 are separated by a 2,000-base intron. What happens if you align it with a tool that is not splice-aware?",
    options: [
      { t: "It aligns perfectly, because the genome contains the same sequence as the mRNA", why: "The genome contains both exons, but with the intron between them. The read's 100 bases only appear together in the spliced mRNA." },
      { t: "It is counted twice, once for each exon", why: "Aligners do not split a read into two separate reads. Without splice awareness, at best one part aligns." },
      { t: "It cannot be placed as one continuous match, so it is lost or only partly aligned", why: "Right. In the genome, the two parts of the read are 2,000 bases apart. Only a splice-aware aligner can split the read across that gap." },
      { t: "The aligner removes the intron from the genome first", why: "A standard aligner knows nothing about introns. Handling them is exactly what makes an aligner splice-aware." }
    ],
    answer: 2
  },
  check: [
    {
      q: "What does a GTF annotation file add that the genome FASTA alone does not provide?",
      options: [
        { t: "The quality score of each base", why: "Quality scores belong to reads, in FASTQ files." },
        { t: "The sequence of each chromosome", why: "That is exactly what the genome FASTA already contains." },
        { t: "The positions of genes and exons, so aligned reads can be assigned to genes", why: "Correct. The genome FASTA holds only letters; the annotation says which stretches of those letters belong to which genes." },
        { t: "The reads from your samples", why: "Your reads are in FASTQ files. The annotation describes the reference." }
      ],
      answer: 2
    },
    {
      q: "You need gene-level expression estimates for 40 samples on a laptop, and you do not need to see where reads fall on the genome. Which approach fits best?",
      options: [
        { t: "Pseudoalignment to the transcriptome with Salmon or kallisto, then summing transcripts to genes", why: "Correct. It is fast and needs little memory, and it estimates the expression of known transcripts, which is all this goal needs." },
        { t: "Splice-aware alignment of every sample to the genome with STAR", why: "This works, but STAR needs a lot of memory (around 30 GB for the human genome) and more time, and positions are not needed here." },
        { t: "Counting reads per gene with grep on the FASTQ files", why: "grep finds exact text only. It cannot tolerate sequencing errors, handle splicing or deal with reads that match several genes." }
      ],
      answer: 0
    },
    {
      q: "What does a pseudoaligner such as Salmon produce for each sample?",
      options: [
        { t: "A BAM file with the exact position of every read", why: "Base-by-base positions are what aligners such as STAR produce. Pseudoalignment skips that step to save time." },
        { t: "Estimated read counts (and TPM values) for each transcript", why: "Correct. It reports how many reads each transcript is estimated to have, and these can be summed to genes." },
        { t: "A cleaned FASTQ file", why: "Trimming tools produce cleaned FASTQ files. Salmon produces abundance estimates." }
      ],
      answer: 1
    }
  ],
  real: "Public pipelines such as nf-core/rnaseq chain these steps (quality control, alignment with STAR, quantification with Salmon and more) for hundreds of samples at once. The KAUST course's RNA-seq case study works with count data, which is the output of this stage.",
  teach: {
    prompt: "Explain the two routes from reads to counts and when you might choose each.",
    points: ["Alignment places reads on a genome; splice-aware aligners handle reads that cross introns", "An annotation (GTF) is needed to turn positions into gene counts", "Pseudoalignment estimates transcript counts quickly without base-by-base alignment", "Multi-mapping reads and overlapping genes make counts approximate"]
  }
});

BB.lessons.push({
  id: "f3-counts",
  what: "A count matrix is a table with one row per gene and one column per sample. Each value is the number of reads from that sample that were assigned to that gene.",
  problem: "After counting, every sample has tens of millions of reads spread over tens of thousands of genes. To compare samples, all of this has to sit in one table in which every row and every column means exactly one thing.",
  care: "Count data is what the KAUST course's RNA-seq case study analyzes. Reading a count matrix correctly, and knowing what a raw count can and cannot tell you, is the base for the rest of this foundation.",
  steps: [
    "Rows are genes, named by a gene symbol (such as HSPA1A) or a database ID. Columns are samples.",
    "Each value is a raw count: a whole number of reads. (Tools such as Salmon report estimated counts, which can have decimals.)",
    "Column totals differ because samples were sequenced to different depths. The total number of reads assigned to genes in a sample is its library size.",
    "Values span a huge range: a few genes have tens of thousands of reads, many have only a handful, and many are zero.",
    "A separate sample table (the metadata) says which condition each column belongs to. Its sample names must match the column names exactly."
  ],
  deeper: "A raw count depends on three things at once: how much RNA the gene has, how deeply the sample was sequenced and how long the gene's transcripts are, since longer transcripts give more fragments. Differential expression tools model raw counts directly and handle depth themselves, so you give them raw counts, not normalized values. Single-cell tools in Python usually store the table the other way round, with cells as rows and genes as columns (the AnnData layout).",
  show: {
    intro: "The first lines of the practice count matrix.",
    lang: "bash",
    code: "head -n 5 counts.tsv",
    output: "gene\tctrl_1\tctrl_2\tctrl_3\theat_1\theat_2\theat_3\nHSPA1A\t212\t282\t203\t11018\t8441\t10838\nHSPA1B\t172\t202\t155\t10345\t7330\t7541\nHSPA6\t2\t0\t3\t999\t725\t1133\nDNAJB1\t813\t1035\t1100\t6820\t5530\t6641",
    notes: [
      "The header line names the columns: `gene`, then the six samples. Every later line is one gene.",
      "HSPA6 has 2, 0 and 3 reads in the controls and about 700 to 1,100 in each heated sample: almost silent at 37 C and strongly switched on at 42 C.",
      "These are raw counts, so they mix biology with sequencing depth. heat_1 was sequenced most deeply (24.6 million reads), which raises all of its counts a little.",
      "These 12 genes are a teaching subset. The ctrl_1 column adds up to 184,692 here, far below its library size of 18,400,000 reads assigned to all genes, so never use these column totals as library sizes."
    ]
  },
  pitfall: {
    wrong: "heat_1 has 11,018 HSPA1A reads and heat_2 has 8,441, so HSPA1A is more strongly expressed in heat_1.",
    right: "heat_1 was sequenced more deeply (24.6 million reads against 17.9 million). Per million reads, heat_2 actually has slightly more HSPA1A (471.6 against 447.9). Raw counts can only be compared between samples after accounting for library size."
  },
  try: { kind: "widget", widget: "countmatrix" },
  check: [
    {
      q: "HSPA6 has 0 reads in ctrl_2 but 2 and 3 reads in the other two controls. What is the most careful interpretation?",
      options: [
        { t: "HSPA6 has been deleted from the genome of the ctrl_2 cells", why: "A gene deletion in one culture is very unlikely, and nothing else points to it. Small counts go up and down by chance." },
        { t: "The count matrix contains an error, because counts cannot be zero", why: "Zeros are common and valid in count matrices, especially for genes that are barely expressed." },
        { t: "HSPA6 RNA is very rare at 37 C; with so few expected reads, getting 0 in one sample can happen by chance", why: "Correct. At about 0.1 reads per million, a library of 22.1 million reads expects only about 2 reads, so 0 is a plausible result." }
      ],
      answer: 2
    },
    {
      q: "Why do the column totals of a count matrix differ between samples, even for samples from the same condition?",
      options: [
        { t: "Each sample contains a different number of genes", why: "All samples are counted against the same list of genes, so every column has the same rows." },
        { t: "Each sample was sequenced to a different depth, so it had a different number of reads to share among the genes", why: "Correct. The total reads per sample (the library size) is a technical property that varies from sample to sample." },
        { t: "Column totals show how strongly each sample responded to the treatment", why: "Totals mostly reflect sequencing depth. Biological responses show up as changes in particular genes." }
      ],
      answer: 1
    },
    {
      q: "Which statement about a raw count in a count matrix is correct?",
      options: [
        { t: "It is the number of RNA molecules of that gene in one cell", why: "Counts are reads pooled from many cells, and they depend on depth and transcript length." },
        { t: "It has already been corrected for sequencing depth", why: "Raw counts are uncorrected. Normalization is a separate step." },
        { t: "It depends on the gene's RNA level, the sample's sequencing depth and the length of the gene's transcripts", why: "Correct. That is why raw counts need normalization before most comparisons." }
      ],
      answer: 2
    }
  ],
  real: "Public repositories such as GEO store count matrices next to sample metadata for thousands of studies, and widely used differential expression packages such as DESeq2 and edgeR take exactly this kind of table as input. The KAUST course's case study likewise analyzes bulk RNA-seq count data in R.",
  teach: {
    prompt: "Explain what a count matrix is, what one number in it means, and why raw counts cannot be compared directly between samples.",
    points: ["Rows are genes, columns are samples, values are read counts", "Sample metadata says which condition each column belongs to", "Raw counts depend on expression, depth and transcript length", "Zeros and very large values are both normal"]
  }
});

BB.lessons.push({
  id: "f3-normalization",
  what: "Normalization adjusts raw counts so that samples can be compared fairly. The simplest method, counts per million (CPM), divides each count by the sample's library size and multiplies by 1,000,000.",
  problem: "Sequencers do not give every sample the same number of reads. In the heat-shock data, heat_1 has 24.6 million assigned reads and heat_2 has 17.9 million, so heat_1 gets about 37 percent more reads for every gene, even for genes that did not change. Without normalization, depth differences look like biology.",
  care: "Every comparison of expression between samples depends on normalization. Knowing what it corrects, and what it cannot correct, protects you from two opposite mistakes: trusting raw counts, and over-trusting normalized ones.",
  steps: [
    "Find each sample's library size: the total number of reads assigned to genes (ctrl_1: 18,400,000).",
    "CPM: divide each count by the library size and multiply by 1,000,000. HSPA1A in ctrl_1: 212 / 18,400,000 x 1,000,000 = 11.5 CPM.",
    "Compare across samples on this common scale: per million reads, HSPA1A is about 10 to 13 in the controls and about 448 to 511 in the heated samples.",
    "TPM (transcripts per million) also divides by transcript length, so that different genes can be compared within one sample.",
    "Differential expression tools use more careful size factors: DESeq2's median-of-ratios and edgeR's TMM assume most genes do not change, so a few hugely changed genes cannot distort the scaling of all the others (composition bias)."
  ],
  deeper: "Composition bias in a toy example: imagine a treatment that makes one gene so active that, afterwards, it makes up half of all the RNA, while every other gene is unchanged per cell. With the same number of reads, every other gene now receives about half as many reads, so its CPM halves even though nothing changed for it. Library-size scaling cannot see this. Median-of-ratios and TMM can, because they compare samples using the many genes that did not change. These methods expect thousands of genes; a 12-gene teaching table, mostly heat-shock genes, would break their assumption.",
  show: {
    intro: "Python computes the CPM of ACTB, a gene that should stay roughly constant, in all six samples.",
    lang: "python",
    code: "actb = [44289, 46223, 46941, 55945, 39466, 49070]\nlib = [18400000, 22100000, 20300000, 24600000, 17900000, 21200000]\nfor i in range(6):\n    cpm = actb[i] / lib[i] * 1000000\n    print(actb[i], round(cpm, 1))",
    output: "44289 2407.0\n46223 2091.5\n46941 2312.4\n55945 2274.2\n39466 2204.8\n49070 2314.6",
    notes: [
      "Each line shows the raw count and then the CPM, for ctrl_1, ctrl_2, ctrl_3, heat_1, heat_2 and heat_3.",
      "Raw ACTB counts range from 39,466 to 55,945, a 1.42-fold spread that mostly follows library size.",
      "After CPM, the range is 2,091.5 to 2,407.0 (1.15-fold). heat_1 and heat_2, which looked very different raw, are nearly equal (2,274.2 and 2,204.8).",
      "The remaining spread is real variation between cultures plus counting noise. Normalization does not remove it; replicates and statistics deal with it."
    ],
    run: true
  },
  pitfall: {
    wrong: "After normalization, all differences between replicates are gone, so any remaining difference must be caused by the treatment.",
    right: "Normalization only removes differences of scale, such as depth. FOS in heat_2 is still about 106 CPM after normalization, while the other five samples are between 10 and 14. Normalization cannot remove biological variability; replicates and a proper statistical test are needed to judge it."
  },
  try: { kind: "widget", widget: "normalization" },
  check: [
    {
      q: "DNAJB1 has 6,820 reads in heat_1, whose library size is 24,600,000. What is its CPM?",
      options: [
        { t: "About 381.0", why: "That divides by 17,900,000, heat_2's library size. Use the library size of the sample the count came from." },
        { t: "About 0.000277", why: "That forgets to multiply by 1,000,000." },
        { t: "About 277.2", why: "Correct: 6,820 / 24,600,000 x 1,000,000 = 277.2. Equivalently, 6,820 / 24.6 = 277.2." },
        { t: "6,820", why: "That is the raw count. CPM rescales it to reads per million." }
      ],
      answer: 2
    },
    {
      q: "After CPM normalization, FOS is between 10 and 14 CPM in five samples but 106.5 CPM in heat_2. What is the right interpretation?",
      options: [
        { t: "Normalization corrected depth, so the high value is a real difference in that one culture, which normalization cannot remove", why: "Correct. Library sizes differ by at most about 37 percent here, nothing like a 9-fold jump. Only replicates and statistics can judge such a value." },
        { t: "Normalization failed for heat_2, and a different method would bring it into line", why: "Sensible normalization methods scale whole samples. None of them can pull one gene in one sample back into line." },
        { t: "FOS is strongly induced by heat", why: "Only one of the three heated replicates is high. A consistent heat effect would raise all three." }
      ],
      answer: 0
    },
    {
      q: "A gene has 50 CPM in every control sample and 50 CPM in every heated sample, but its raw counts are higher in the heated samples. What is the right conclusion?",
      options: [
        { t: "It went up after heat shock, because the raw counts rose", why: "Raw counts rise with depth. Per million reads, nothing changed." },
        { t: "Its expression did not change; the heated samples simply had more reads", why: "Correct. Equal CPM means an equal share of the reads. Higher raw counts come from deeper sequencing." },
        { t: "It went down after heat shock, because CPM hides the increase", why: "CPM does not hide changes; it removes depth effects. Equal CPM means no change in share." }
      ],
      answer: 1
    }
  ],
  real: "In published RNA-seq studies, CPM or TPM values appear in heatmaps and expression plots, while statistical testing uses raw counts together with size factors estimated inside tools such as DESeq2 and edgeR. Giving CPM or TPM values to a tool that expects raw counts breaks its statistical model, so always check what input a tool expects.",
  teach: {
    prompt: "Explain why raw counts cannot be compared between samples, how CPM fixes this, and one thing normalization cannot fix.",
    points: ["Library sizes differ, so raw counts scale with depth", "CPM = count / library size x 1,000,000", "TPM also corrects for transcript length; DESeq2 and edgeR use size factors that resist composition bias", "Normalization does not remove biological variability between replicates"]
  }
});

BB.lessons.push({
  id: "f3-r-basics",
  what: "R is a free programming language built for statistics and data analysis. Its basic data structure is the vector: an ordered set of values of one type, such as six read counts. Most R code applies a function to a whole vector at once.",
  problem: "Analyzing expression data means doing the same arithmetic on thousands of numbers, and being able to repeat it exactly. R was designed by statisticians for this: one line can divide every count by its library size, and thousands of free packages, including the Bioconductor project for genomics, add ready-made methods.",
  care: "The KAUST course teaches R first and uses it for bulk RNA-seq analysis. A few core ideas (vectors, types, indexing from 1 and functions) are the base for everything else you will do in R.",
  steps: [
    "You usually write R in RStudio, a program with a script editor, a console where code runs, a pane listing your objects and a pane for plots and help. R does the computing; RStudio is the workspace around it.",
    "Store a value under a name with `<-`, as in `counts <- c(212, 282, 203)`. The function `c()` combines values into a vector.",
    "A vector holds one type: numeric (`212`), character (text in quotes, such as the gene name HSPA1A) or logical (`TRUE` and `FALSE`). If you mix types, R converts everything to the most flexible type, usually character.",
    "Arithmetic works element by element: `counts / lib` divides the first count by the first library size, the second by the second, and so on. A single number is reused for every element, as in `counts * 2`.",
    "Indexing starts at 1: `counts[1]` is the first value, `counts[2:3]` the second and third, and `counts[-1]` everything except the first. A missing value is written `NA`, and many functions need `na.rm = TRUE` to skip it."
  ],
  deeper: "R grows through packages: bundles of functions that other people wrote and tested. General packages come from CRAN with `install.packages()`; many genomics packages, such as DESeq2 and edgeR, come from Bioconductor with `BiocManager::install()` (some, such as Seurat, are on CRAN). You install a package once, then load it with `library()` in every session that uses it. Help for any function opens with a question mark, as in `?mean`.",
  show: {
    intro: "HSPA1A's six counts divided by the six library sizes, in one line of R.",
    lang: "r",
    code: "counts <- c(212, 282, 203, 11018, 8441, 10838)\nlib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\ncpm <- round(counts / lib, 1)\ncpm\ncpm[4]\ncpm[1:3]\nlength(cpm)",
    output: "[1]  11.5  12.8  10.0 447.9 471.6 511.2\n[1] 447.9\n[1] 11.5 12.8 10.0\n[1] 6",
    notes: [
      "`lib` holds the library sizes in millions, so `counts / lib` is already counts per million.",
      "The division happens element by element, with no loop. `round(..., 1)` keeps one decimal place.",
      "Each printed line starts with `[1]`: the position of the first value on that line, not part of the data.",
      "`cpm[4]` is the fourth value (heat_1), because R counts from 1. In Python, index 4 would be the fifth value."
    ]
  },
  pitfall: {
    wrong: "R vectors behave like Python lists: `counts + 100` adds a new element, and `counts[-1]` gives the last value.",
    right: "In R, `counts + 100` adds 100 to every element, and `counts[-1]` removes the first element. (In Python, adding a number to a list is an error.) When you move between Python and R, check indexing and arithmetic every time."
  },
  try: {
    kind: "predict",
    q: "What does R print?",
    code: { lang: "r", src: "counts <- c(212, 282, 203)\ncounts + 100" },
    options: [
      { t: "[1] 212 282 203 100", why: "That is what appending 100 to a Python list would give. In R, arithmetic applies to every element instead of appending." },
      { t: "[1] 312 382 303", why: "Right. The single number 100 is reused for every element, so each count increases by 100." },
      { t: "[1] 797", why: "That adds 100 to the sum of the counts. R does not sum the vector unless you call `sum()`." }
    ],
    answer: 1,
    verify: {}
  },
  check: [
    {
      q: "What does R print?",
      code: { lang: "r", src: 'x <- c("ctrl_1", "ctrl_2", "ctrl_3")\nx[2]' },
      options: [
        { t: '[1] "ctrl_2"', why: "Correct. R counts from 1, so position 2 is the second element." },
        { t: '[1] "ctrl_3"', why: "That is the Python habit of counting from 0. In R, `x[2]` is the second element." },
        { t: '[1] "ctrl_1" "ctrl_2"', why: "A single number in the brackets selects one element. `x[1:2]` would select the first two." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "What does R print?",
      code: { lang: "r", src: 'v <- c(1, TRUE, "A")\nclass(v)' },
      options: [
        { t: '[1] "numeric"', why: "R cannot turn \"A\" into a number, so it converts in the other direction: everything becomes text." },
        { t: '[1] "logical"', why: "Logical is the least flexible of the three types. R converts toward the most flexible one, character." },
        { t: '[1] "character"', why: "Correct. A vector holds one type, so R converts 1 and TRUE into the text \"1\" and \"TRUE\"." }
      ],
      answer: 2,
      verify: {}
    },
    {
      q: "Which statement about R and RStudio is correct?",
      options: [
        { t: "RStudio is a newer version of R", why: "They are separate programs. RStudio cannot run any code without R installed." },
        { t: "R code can only run inside RStudio", why: "R runs on its own too, for example with `Rscript` in a terminal. RStudio is a convenient workspace, not a requirement." },
        { t: "R is the language that runs the code; RStudio is a program that gives you an editor, a console and other panes for working with R", why: "Correct. RStudio needs R installed, and R can also run without RStudio." }
      ],
      answer: 2
    }
  ],
  real: "Bioconductor hosts more than 2,000 R packages for genomic data, including widely used tools for bulk RNA-seq such as DESeq2, edgeR and limma. All of them take vectors and tables of counts as input, so the basics in this lesson are the same ones professional analyses rely on.",
  teach: {
    prompt: "Explain to a friend how R vectors work, including types, element-wise arithmetic and indexing from 1.",
    points: ["`<-` stores a value; `c()` builds a vector", "A vector holds one type, and mixing in text converts everything to character", "Arithmetic applies to every element at once", "Indexing starts at 1, and a negative index removes an element"]
  }
});

BB.lessons.push({
  id: "f3-r-control",
  what: "A logical vector holds TRUE and FALSE values, usually produced by a comparison such as `lib < 20`. R uses logical vectors to count, select and flag data, and uses `if` and `for` to make decisions and repeat steps.",
  problem: "Quality control means checking every sample and every gene against rules, such as at least 20 million reads, or at least 10 reads in several samples. With thousands of genes, you need a way to apply a rule to everything at once and then act on the result.",
  care: "The KAUST course introduces logical values and vectors, including their use in quality control, together with loops and if statements. The same few patterns appear in almost every real analysis script: compare, count, select, flag.",
  steps: [
    "Comparisons work element by element and return a logical vector: `lib < 20` gives one TRUE or FALSE per sample. The operators are `<`, `>`, `<=`, `>=`, `==` (equal) and `!=` (not equal).",
    "Combine comparisons with `&` (and), `|` (or) and `!` (not).",
    "TRUE counts as 1 and FALSE as 0, so `sum()` counts how many values are TRUE and `mean()` gives the proportion.",
    "A logical vector inside square brackets keeps only the TRUE elements: `lib[lib < 20]`. `which()` returns their positions.",
    "`if (condition) { ... } else { ... }` needs a single TRUE or FALSE. `for (s in names(lib)) { ... }` repeats code for each element. For whole vectors, `ifelse()` is often simpler than a loop."
  ],
  deeper: "Since R 4.2, `if` stops with an error when the test inside it has more than one value (R reports `the condition has length > 1`). If you mean \"is any sample low?\", write `if (any(lib < 20))`; for \"are all samples fine?\", use `all()`. A comparison with `NA` gives `NA`, so test for missing values with `is.na()` rather than `== NA`.",
  show: {
    intro: "A first quality check: which samples have fewer than 20 million assigned reads?",
    lang: "r",
    code: 'lib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\nnames(lib) <- c("ctrl_1", "ctrl_2", "ctrl_3", "heat_1", "heat_2", "heat_3")\nlow <- lib < 20\nlow\nsum(low)\nnames(lib)[low]',
    output: 'ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\n  TRUE  FALSE  FALSE  FALSE   TRUE  FALSE\n[1] 2\n[1] "ctrl_1" "heat_2"',
    notes: [
      "`names()` labels each element, so the printed logical vector shows which sample each TRUE or FALSE belongs to.",
      "`lib < 20` compares all six library sizes (in millions) with 20 at once.",
      "`sum(low)` counts the TRUE values: two samples have fewer than 20 million reads.",
      "`names(lib)[low]` keeps only the names where `low` is TRUE. This is the core pattern of quality control: write a rule, apply it to everything, inspect what it flags."
    ]
  },
  pitfall: {
    wrong: "I can write `if (lib < 20)` to check all six samples at once.",
    right: "`if` needs exactly one TRUE or FALSE, so a test with six values stops with an error. Use `any(lib < 20)` or `all(lib >= 20)` for one overall answer, logical indexing to select samples, or a `for` loop to act on each sample in turn."
  },
  try: {
    kind: "parsons",
    lang: "r",
    prompt: "Arrange the lines so the script checks every sample and prints \"low depth\" for those with fewer than 20 million reads and \"ok\" for the rest.",
    lines: [
      "lib <- c(ctrl_1 = 18.4, ctrl_2 = 22.1, ctrl_3 = 20.3, heat_1 = 24.6, heat_2 = 17.9, heat_3 = 21.2)",
      "for (s in names(lib)) {",
      "  if (lib[s] < 20) {",
      '    print(paste(s, "low depth"))',
      "  } else {",
      '    print(paste(s, "ok"))',
      "  }",
      "}"
    ],
    output: '[1] "ctrl_1 low depth"\n[1] "ctrl_2 ok"\n[1] "ctrl_3 ok"\n[1] "heat_1 ok"\n[1] "heat_2 low depth"\n[1] "heat_3 ok"',
    verify: true,
    explain: "The vector must exist before the loop uses it. The `for` line opens the loop over the sample names; inside it, `if` and `else` choose a message; the first closing brace ends the `if`/`else`, and the last one ends the loop. `paste()` joins the name and the message into one piece of text."
  },
  check: [
    {
      q: "What does R print?",
      code: { lang: "r", src: "x <- c(5, 12, 8, 20)\nx[x > 10]" },
      options: [
        { t: "[1] FALSE  TRUE FALSE  TRUE", why: "That is `x > 10` on its own. Inside the square brackets, the logical vector selects values." },
        { t: "[1] 12 20", why: "Correct. `x > 10` gives FALSE TRUE FALSE TRUE, and indexing keeps the elements at the TRUE positions." },
        { t: "[1] 2 4", why: "Those are the positions of the TRUE values, which `which(x > 10)` would return." },
        { t: "[1] 2", why: "That is the number of TRUE values, which `sum(x > 10)` would return." }
      ],
      answer: 1,
      verify: {}
    },
    {
      q: "`lib` is a named vector of library sizes in millions. Which line returns the names of the samples with fewer than 20 million reads?",
      options: [
        { t: "`sum(lib < 20)`", why: "This counts the low samples but does not say which ones they are." },
        { t: "`lib < 20`", why: "This gives TRUE or FALSE for every sample, not the names of the low ones." },
        { t: "`if (lib < 20) names(lib)`", why: "`if` needs a single TRUE or FALSE, so with six samples this stops with an error." },
        { t: "`names(lib)[lib < 20]`", why: "Correct. The comparison gives a logical vector, and indexing the names with it keeps the matching names." }
      ],
      answer: 3
    }
  ],
  real: "Real pipelines apply exactly these rules: flagging samples with too few reads or a low alignment rate, removing genes with very low counts before testing, and, in single-cell data, removing cells with a high fraction of mitochondrial reads. Written as code, a rule is applied identically to every sample and is visible to anyone reviewing the analysis.",
  teach: {
    prompt: "Explain how logical vectors help with quality control in R, using the library sizes of the heat-shock samples as your example.",
    points: ["A comparison gives one TRUE or FALSE per element", "`sum()` counts TRUE values and indexing selects them", "`&`, `|` and `!` combine rules", "`if` needs a single value; use `any()`, `all()`, `ifelse()` or a loop for vectors"]
  }
});

BB.lessons.push({
  id: "f3-r-dataframes",
  what: "A data frame is R's table: columns of equal length, where each column is a vector with its own type and each row is one observation. You usually create one by reading a CSV or TSV file. R Markdown is a document format that mixes text, R code and the code's results in one reproducible report.",
  problem: "Real data comes as tables that mix kinds of information: sample names (text), replicate numbers (integers), temperatures (numbers). You need to read such tables from files, select rows and columns by name, connect tables to each other and share what you did in a form that others can rerun.",
  care: "The KAUST course uses R Markdown for sharing code, and its bulk RNA-seq case study analyzes count data in R. Selecting the right rows and columns, and checking that two tables line up, is daily work in any RNA-seq analysis.",
  steps: [
    "Read a file: `read.csv()` for comma-separated files and `read.delim()` for tab-separated ones. The option `row.names = 1` turns the first column (for example, gene names) into row names.",
    "Inspect it: `dim()` gives the numbers of rows and columns, `head()` the first rows, `str()` the type of each column and `summary()` quick statistics.",
    "Select with `df[rows, columns]`: `counts[\"HSPA1A\", ]` is one row, `counts[, 4:6]` is three columns, and `samples$condition` is one column as a vector. Leaving one side of the comma empty keeps everything on that side.",
    "Filter rows with a logical vector, as in `samples[samples$condition == \"heat_shock\", ]`. Categorical columns can become factors with `factor()`; the factor's levels define the groups and their order.",
    "An R Markdown file (`.Rmd`) mixes text with code chunks, which start with a line of three backticks followed by `{r}` and end with three backticks. Knitting runs every chunk from top to bottom in a new R session and builds an HTML, PDF or Word report containing the text, the code and its results."
  ],
  deeper: "Before any analysis, check that the columns of the count matrix and the rows of the sample table are the same samples in the same order: a silent mismatch swaps conditions and corrupts every result. Factor levels are sorted alphabetically by default, and many tools treat the first level as the reference group, so set it explicitly with `factor(x, levels = c(\"control\", \"heat_shock\"))`. Because knitting starts from an empty session, objects that you created only in the console are not available to the document, a common cause of \"object not found\" errors.",
  show: {
    intro: "Read the count matrix and the sample table, then check that they describe the same samples in the same order.",
    lang: "r",
    code: 'counts <- read.delim("counts.tsv", row.names = 1)\nsamples <- read.delim("samples.tsv")\ndim(counts)\ncounts["HSPA1A", ]\nsamples$condition\nall(colnames(counts) == samples$sample)',
    output: '[1] 12  6\n       ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\nHSPA1A    212    282    203  11018   8441  10838\n[1] "control"    "control"    "control"    "heat_shock" "heat_shock"\n[6] "heat_shock"\n[1] TRUE',
    notes: [
      "`row.names = 1` moved the gene names out of the columns, so `counts` has 12 rows and 6 numeric columns, one per sample.",
      "`counts[\"HSPA1A\", ]` selects a row by its name and keeps every column (the empty space after the comma).",
      "`samples$condition` is a character vector. The output wraps onto a second line, which starts with `[6]` because the sixth value begins there.",
      "The last line checks that the count columns and the rows of the sample table list the same samples in the same order. TRUE means the two tables can safely be used together."
    ]
  },
  pitfall: {
    wrong: "R Markdown is just a way to make code look nice in a report.",
    right: "Its real value is reproducibility: knitting reruns all the code from scratch, so every number and figure in the report matches the code that made it. If a document does not knit, the analysis depends on something that is not written down."
  },
  try: {
    kind: "predict",
    q: "`counts.tsv` has the columns gene, ctrl_1, ctrl_2, ctrl_3, heat_1, heat_2 and heat_3. What does R print?",
    code: { lang: "r", src: 'counts <- read.delim("counts.tsv", row.names = 1)\ncounts["FOS", 5]' },
    options: [
      { t: "[1] 311", why: "311 is FOS in heat_1. That answer counts the gene column as column 1, but `row.names = 1` turned the gene names into row names." },
      { t: "[1] 1906", why: "Right. With the gene names as row names, the columns are the six samples, so column 5 is heat_2, where FOS is unusually high." },
      { t: "[1] 260", why: "260 is FOS in heat_3, the sixth sample column. Column 5 is one before it." },
      { t: "Error: undefined columns selected", why: "There are six columns, so column 5 exists. That error appears only when you ask for a column that does not exist." }
    ],
    answer: 1,
    verify: {}
  },
  check: [
    {
      q: "A collaborator sends `counts.csv`, with commas between the columns. Which line reads it correctly, with the gene names as row names?",
      options: [
        { t: '`read.delim("counts.csv", row.names = 1)`', why: "`read.delim()` expects tabs. With a comma file, each whole line would end up in a single column." },
        { t: '`read.csv("counts.csv", row.names = 1)`', why: "Correct. `read.csv()` expects commas, and `row.names = 1` turns the first column into row names." },
        { t: '`source("counts.csv")`', why: "`source()` runs a file of R code. A CSV file is data, not code." }
      ],
      answer: 1
    },
    {
      q: "Your R Markdown document fails to knit with the error `object 'counts' not found`, although the same code works in the console. Why?",
      options: [
        { t: "Knitting runs the document in a new R session, and `counts` was created only in the console, not in a chunk of the document", why: "Correct. Put the line that reads the file into a chunk near the top, so the document creates everything it uses." },
        { t: "R Markdown cannot read TSV files", why: "R Markdown runs ordinary R code, including `read.delim()`." },
        { t: "The object name is too long for R Markdown", why: "Object names work the same way in R Markdown as anywhere else in R." }
      ],
      answer: 0
    },
    {
      q: "Which line keeps only the heat-shock rows of the data frame `samples`?",
      options: [
        { t: '`samples[, samples$condition == "heat_shock"]`', why: "A logical vector after the comma selects columns, not rows." },
        { t: '`samples$condition == "heat_shock"`', why: "This returns only TRUE and FALSE values. It does not select anything from the table." },
        { t: '`samples[samples$condition = "heat_shock", ]`', why: "A single `=` is not a comparison. Use `==` to test whether two values are equal." },
        { t: '`samples[samples$condition == "heat_shock", ]`', why: "Correct. The logical vector before the comma picks rows, and the empty space after the comma keeps all columns." }
      ],
      answer: 3
    }
  ],
  real: "In a typical bulk RNA-seq analysis in R, the first lines read the count matrix and the sample table, check that they match, set the condition as a factor with the control as the reference level, and then pass both to a package such as DESeq2. Many labs share such analyses as knitted R Markdown reports, so that colleagues and reviewers can see every step.",
  teach: {
    prompt: "Explain how to read a table into R, select rows and columns, and why R Markdown helps others trust your analysis.",
    points: ["`read.csv()` for commas, `read.delim()` for tabs; `row.names = 1` uses the first column as row names", "`df[rows, columns]` selects by name, number or logical vector", "Check that the count columns match the sample table before analysis", "R Markdown reruns the code when knitting, so results match the code"]
  }
});
