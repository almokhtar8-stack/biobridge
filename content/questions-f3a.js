/* Foundation 3 practice bank, first half: sequence data, RNA-seq from sample to counts, and R.
   Written to tools/CONTENT_GUIDE.md (section 4). Code questions with `verify` are executed by tools/verify_code.py. */
window.BB = window.BB || {};
BB.questions = BB.questions || [];

BB.questions.push(
  /* ---------------------------------------------------------------- BI.SEQ: sequences and FASTA */
  {
    id: "bi-001", obj: ["BI.SEQ"], lesson: "f3-fasta", level: 1,
    q: "What is the main difference between the FASTA and FASTQ formats?",
    options: [
      { t: "FASTQ stores a quality score for every base; FASTA stores only names and sequences", why: "Correct. FASTQ adds a `+` line and a quality line to every record, which is why raw reads from sequencers come as FASTQ." },
      { t: "FASTA is for DNA and FASTQ is for RNA", why: "Both formats can hold DNA or RNA sequences. The difference is the per-base quality information, not the kind of molecule." },
      { t: "FASTA files are always compressed and FASTQ files never are", why: "Either format can be compressed (for example `.fa.gz` or `.fastq.gz`). Compression is not part of the format." },
      { t: "FASTQ can hold only one sequence per file", why: "A FASTQ file usually holds millions of reads, one four-line record each." }
    ],
    answer: 0,
    explain: "FASTA records are a `>` header plus sequence. FASTQ records add a quality score for every base, so sequencing reads are stored as FASTQ and reference sequences as FASTA."
  },
  {
    id: "bi-002", obj: ["BI.SEQ"], lesson: "f3-fasta", level: 2,
    q: "`sequences.fa` has 15 lines and 6 records. What does this command print?",
    code: { lang: "bash", src: 'grep -v ">" sequences.fa | wc -l' },
    options: [
      { t: "6", why: "Six is the number of records. Here grep keeps the sequence lines, and wrapped records have more than one." },
      { t: "9", why: "Correct. `-v` keeps the lines that do not contain `>`: the 9 sequence lines. Three records take two lines each and three take one." },
      { t: "15", why: "`-v` removes the 6 header lines, so fewer than 15 lines reach `wc -l`." },
      { t: "334", why: "334 is the total number of bases. `wc -l` counts lines, not letters." }
    ],
    answer: 1,
    verify: {},
    explain: "Lines are not records. After the 6 headers are removed, 9 sequence lines remain, because seq_01, seq_02 and seq_04 are each wrapped onto two lines."
  },
  {
    id: "bi-003", obj: ["BI.SEQ"], lesson: "f3-fasta", level: 1,
    q: "In the header line `>seq_04 toy sequence D`, which part do most tools use as the sequence identifier?",
    options: [
      { t: "`toy sequence D`", why: "That is the free-text description. It can contain spaces and is often ignored by tools." },
      { t: "The whole line, including `>`", why: "The `>` only marks the start of a record, and most tools end the identifier at the first space." },
      { t: "`seq_04`, the first word after `>`", why: "Correct. The identifier ends at the first space, and many tools keep only this part." },
      { t: "`D`, the last word", why: "The last word belongs to the description, not to the identifier." }
    ],
    answer: 2,
    explain: "A FASTA identifier is the text between `>` and the first space. Short, unique identifiers avoid problems when tools drop the description."
  },
  {
    id: "bi-004", obj: ["BI.SEQ"], lesson: "f3-fasta", level: 3,
    q: "seq_01 in `sequences.fa` contains the 8-letter sequence GATCCGAA. What does this command print?",
    code: { lang: "bash", src: 'grep -c "GATCCGAA" sequences.fa' },
    options: [
      { t: "1", why: "The motif is in seq_01, but not on any single line of the file, and grep never looks across line breaks." },
      { t: "6", why: "`-c` counts matching lines, not records, and here no line matches at all." },
      { t: "0", why: "Correct. grep searches one line at a time, and a line wrap splits the motif: line 2 ends with GATC and line 3 starts with CGAA." }
    ],
    answer: 2,
    verify: {},
    explain: "Wrapped FASTA lines can split a motif. To search sequences safely, first join each record's lines into one string, for example in Python, or use a tool that understands FASTA records."
  },
  {
    id: "bi-005", obj: ["BI.SEQ"], lesson: "f3-fasta", level: 2,
    q: "You download the human reference genome as a single FASTA file. What should its records look like?",
    options: [
      { t: "One record per gene, about 20,000 records", why: "A gene-by-gene file would be a set of gene or transcript sequences. The genome FASTA stores whole chromosomes, including the DNA between genes." },
      { t: "About one record per chromosome, each millions of letters long, plus some pieces not yet placed on a chromosome", why: "Correct. The record for chromosome 1 alone is about 249 million letters, wrapped over millions of lines." },
      { t: "One record per sequencing read", why: "Reads from your experiment are stored in FASTQ files. A reference genome is assembled sequence, not raw reads." },
      { t: "A single record holding the whole genome on one line", why: "Genome files are split by chromosome and wrapped into lines of fixed width." }
    ],
    answer: 1,
    explain: "A reference genome FASTA has one record per chromosome, plus unplaced or alternative pieces in some versions. Its letters cover genes and everything between them."
  },

  /* ---------------------------------------------------------------- BI.FASTQ: reads and quality scores */
  {
    id: "bi-006", obj: ["BI.FASTQ"], lesson: "f3-fastq", level: 1,
    q: "What does an `N` in the sequence line of a read mean?",
    options: [
      { t: "The sequencer could not determine which base was at that position", why: "Correct. N is a no-call, and its quality character is usually very low, such as `#` for Q2." },
      { t: "There is a mutation at that position", why: "A mutation would appear as a different letter (A, C, G or T) compared with the reference. N means the base could not be read at all." },
      { t: "The read continues on the next line", why: "In FASTQ, each read's sequence sits on one line. N is a letter inside the sequence." },
      { t: "An adapter starts at that position", why: "Adapters are made of ordinary bases with a known sequence. They are found by matching that sequence, not by an N." }
    ],
    answer: 0,
    explain: "N marks a base the instrument could not identify. Reads with many Ns are usually removed during quality control."
  },
  {
    id: "bi-007", obj: ["BI.FASTQ"], lesson: "f3-fastq", level: 2,
    q: "In a FASTQ quality line, the character `I` has ASCII code 73. What does it tell you about its base?",
    options: [
      { t: "Q73: the base cannot be wrong", why: "This forgets to subtract 33. And no base is ever certain: a higher Q only means a lower error probability." },
      { t: "Q40: about a 40 percent chance that the base is wrong", why: "Q is not a percentage. Q40 means P = 10 to the power of -4, or 0.0001." },
      { t: "Q40: about a 1 in 10,000 chance that the base is wrong", why: "Correct. 73 - 33 = 40, and 10 to the power of -4 is 1 in 10,000." },
      { t: "Q4: the base is probably wrong", why: "The score is the code minus 33, which gives 40, not 4." }
    ],
    answer: 2,
    explain: "Phred+33 decoding: Q = 73 - 33 = 40. Then P = 10 to the power of (-Q / 10) = 10 to the power of -4, so about 1 error in 10,000 such bases."
  },
  {
    id: "bi-008", obj: ["BI.FASTQ"], lesson: "f3-fastq", level: 2,
    q: "The quality line of READ_0006 ends with `$&*$#(#(&$('`, which decodes to Phred scores between 2 and 9. What is the best action before alignment?",
    options: [
      { t: "Keep the read unchanged, because the aligner can always tell which bases are wrong", why: "Many errors in a row make the read mismatch the reference, so it may be placed wrongly or not at all. Removing poor bases first is safer." },
      { t: "Trim the low-quality end and keep the reliable first part of the read", why: "Correct. The first 24 bases are mostly Q29 or higher, so cutting the tail keeps useful data and removes likely errors." },
      { t: "Delete the whole FASTQ file, because it contains a bad read", why: "A few poor reads are normal in every file. Quality control trims or removes individual reads, not whole samples." },
      { t: "Replace the low-quality bases with A", why: "That would invent data. Unreliable bases are removed or masked as N, never guessed." }
    ],
    answer: 1,
    explain: "Quality trimming removes poor read ends so that alignment uses reliable bases. Tools such as fastp, Trimmomatic or cutadapt do this automatically for millions of reads."
  },
  {
    id: "bi-009", obj: ["BI.FASTQ"], lesson: "f3-fastq", level: 3,
    q: "`reads.fastq` holds 8 reads, and each header line starts with `@`. What does this command print?",
    code: { lang: "bash", src: 'grep -c "@" reads.fastq' },
    options: [
      { t: "8", why: "That would be true only if `@` appeared in header lines alone. In quality lines, `@` is an ordinary character meaning Q31." },
      { t: "32", why: "32 is the total number of lines. `grep -c` counts only the lines that contain `@`." },
      { t: "15", why: "Correct. `@` (ASCII 64) is also the quality character for Q31, and 7 of the 8 quality lines contain at least one. 8 header lines plus 7 quality lines makes 15." }
    ],
    answer: 2,
    verify: {},
    explain: "Never count reads by searching for `@`. Count the lines and divide by 4: 32 / 4 = 8 reads."
  },
  {
    id: "bi-010", obj: ["BI.FASTQ"], lesson: "f3-fastq", level: 3,
    q: "In a new FASTQ file, many reads end with the same sequence, `AGATCGGAAGAGC`, followed by more bases. What is the most likely explanation?",
    options: [
      { t: "One extremely active gene ends with this sequence", why: "A gene's sequence would appear only in reads from that gene. A shared sequence at the ends of many unrelated reads points to library construction, not to biology." },
      { t: "The sequencer is broken and the run must be repeated", why: "Reading into the adapter is an expected, common artifact that trimming handles. It does not mean the instrument failed." },
      { t: "It is the poly-A tail of the mRNA", why: "A poly-A tail would read as a run of A letters, not as this mixed sequence." },
      { t: "The DNA fragments were shorter than the read length, so the sequencer read on into the adapter, which should be trimmed", why: "Correct. AGATCGGAAGAGC is the start of the common Illumina adapter. It appears at different positions in different reads, wherever each short fragment ends." }
    ],
    answer: 3,
    explain: "When a fragment is shorter than the read length, the read continues into the adapter. Adapter trimming removes it so that reads align correctly."
  },
  {
    id: "bi-011", obj: ["BI.FASTQ"], lesson: "f3-fastq", level: 1,
    q: "A sample arrives as two files, `heat_1_R1.fastq.gz` and `heat_1_R2.fastq.gz`, each with 20 million reads. What are they?",
    options: [
      { t: "Two technical replicates of heat_1", why: "Both files come from a single sequencing of one library: they hold the two ends of the same fragments, not repeated measurements." },
      { t: "Paired-end reads: each fragment was read from both ends, and the two files list the partner reads in the same order", why: "Correct. R1 holds the first read of each pair and R2 the second, and tools read the two files together." },
      { t: "40 million independent fragments", why: "There are 20 million fragments, each read twice, once from each end." },
      { t: "A file and its backup copy", why: "The R2 reads are different sequences, from the other end of each fragment." }
    ],
    answer: 1,
    explain: "Paired-end sequencing reads both ends of each fragment. The pair helps place reads accurately, so R1 and R2 are always aligned or quantified together."
  },
  {
    id: "bi-012", obj: ["BI.FASTQ"], lesson: "f3-fastq", level: 2,
    q: "A base has an estimated 1 in 1,000 chance of being wrong. Which character stores its quality in Phred+33?",
    options: [
      { t: "`?` (ASCII 63), because Q30 + 33 = 63", why: "Correct. P = 0.001 gives Q = -10 x log10(0.001) = 30, stored as the character with code 63." },
      { t: "`$` (ASCII 36), because Q is 3", why: "-10 x log10(0.001) is 30, not 3. The multiplication by 10 in the formula is easy to forget." },
      { t: "`I` (ASCII 73), because Q40 is the best score", why: "Q40 would mean 1 error in 10,000. This base is ten times less reliable than that." },
      { t: "`+` (ASCII 43), because the score is 10", why: "Q10 means 1 error in 10, a far worse base than this one." }
    ],
    answer: 0,
    explain: "Q = -10 x log10(P) = -10 x log10(0.001) = 30. Adding 33 gives ASCII code 63, the character `?`."
  },

  /* ---------------------------------------------------------------- BI.RNASEQ: what RNA-seq measures */
  {
    id: "bi-013", obj: ["BI.RNASEQ"], lesson: "f3-rnaseq", level: 1,
    q: "In bulk RNA-seq, what does a gene's count mainly reflect?",
    options: [
      { t: "How many copies of the gene are in the genome", why: "Copy number is a property of DNA. RNA-seq counts RNA fragments, which depend on how actively the gene is transcribed." },
      { t: "How much protein the gene produced", why: "RNA-seq does not measure protein. Protein levels also depend on translation and protein breakdown." },
      { t: "How many cells in the sample carry the gene", why: "Almost every cell carries every gene in its DNA. The count reflects RNA, pooled from all the cells." },
      { t: "How much of that gene's RNA was in the sample compared with other RNAs, averaged over all its cells", why: "Correct. A count is a relative measure of RNA, pooled across every cell in the sample." }
    ],
    answer: 3,
    explain: "Bulk RNA-seq counts reads from the RNA of many cells together. The counts say how much of each gene's RNA there was relative to the rest: not per cell, and not as protein."
  },
  {
    id: "bi-014", obj: ["BI.RNASEQ"], lesson: "f3-rnaseq", level: 1,
    q: "Why is RNA copied into cDNA before sequencing?",
    options: [
      { t: "Standard sequencers read DNA, so RNA is first reverse transcribed into complementary DNA", why: "Correct. Reverse transcriptase builds a DNA copy of each RNA fragment." },
      { t: "Reverse transcription removes the introns", why: "Introns are removed by splicing inside the cell, before the RNA is extracted. Reverse transcription copies whatever RNA is present." },
      { t: "cDNA is longer than RNA, so it gives longer reads", why: "The copy has the same length as its template, and read length is set by the sequencer." },
      { t: "It adds quality scores to each base", why: "Quality scores are produced by the sequencer while it reads, not by library preparation." }
    ],
    answer: 0,
    explain: "RNA-seq libraries are DNA libraries: reverse transcription turns each RNA fragment into cDNA that the sequencer can read."
  },
  {
    id: "bi-015", obj: ["BI.RNASEQ"], lesson: "f3-rnaseq", level: 2,
    q: "You sequence the same library a second time, twice as deeply. What happens to HSPA1A's raw count and to its counts per million (CPM)?",
    options: [
      { t: "Both double", why: "CPM divides by the library size, which also doubles, so the ratio stays about the same." },
      { t: "The raw count roughly doubles, and the CPM stays about the same", why: "Correct. Twice as many reads are drawn from the same mix of fragments, so every gene's count roughly doubles, but its share of the reads does not change." },
      { t: "Both stay the same", why: "More reads means more reads for every gene, so the raw counts increase." },
      { t: "The raw count stays the same, and the CPM halves", why: "The count rises with depth; it does not stay fixed while the library grows." }
    ],
    answer: 1,
    explain: "Depth changes counts, not proportions. That is exactly why counts are normalized by library size before samples are compared."
  },
  {
    id: "bi-016", obj: ["BI.RNASEQ"], lesson: "f3-rnaseq", level: 2,
    q: "Why do bulk RNA-seq experiments usually sequence tens of millions of reads per sample, not just a few thousand?",
    options: [
      { t: "Every gene needs at least one million reads", why: "Most genes get far fewer than a million reads even in a deep experiment. HSPA1A has only a few hundred reads in the control samples." },
      { t: "Reads must cover every base of the genome", why: "That is a goal of genome sequencing. RNA-seq reads come only from RNA, mostly from exons." },
      { t: "A few very active genes take most of the reads, so many reads are needed to sample less active genes reliably", why: "Correct. In ctrl_1, EEF1A1 alone has 98,622 reads while HSPA1A has 212. Less abundant RNAs need deep sampling to be counted with any precision." },
      { t: "More reads remove the differences between biological replicates", why: "Depth reduces counting noise, but it cannot remove real biological differences between cultures." }
    ],
    answer: 2,
    explain: "Expression levels span many orders of magnitude. Deep sequencing gives moderately and weakly expressed genes enough reads to be compared."
  },
  {
    id: "bi-017", obj: ["BI.RNASEQ"], lesson: "f3-rnaseq", level: 3,
    q: "In a bulk RNA-seq comparison of inflamed and healthy tissue, CD3E, a gene expressed by T cells, is 4 times higher in inflamed tissue. What must you consider before concluding that T cells increased their CD3E expression?",
    options: [
      { t: "Inflamed tissue may simply contain more T cells; bulk RNA-seq averages over all cells, so a change in the cell mix looks like a change in expression", why: "Correct. Immune cells move into inflamed tissue, so more T cells could explain the rise even if each T cell's CD3E level is unchanged." },
      { t: "Inflamed tissue may have gained extra copies of the CD3E gene in its DNA", why: "Gene copy changes are rare and would not explain a typical inflammation result. A change in the cell mix is the usual explanation." },
      { t: "Nothing: a 4-fold rise proves that each T cell makes 4 times more CD3E", why: "Bulk data cannot tell a per-cell change from a change in how many cells of each type are present." },
      { t: "The inflamed samples were probably sequenced more deeply", why: "Depth is corrected by normalization. The cell-mix problem remains even after normalization." }
    ],
    answer: 0,
    explain: "Bulk RNA-seq measures an average weighted by the cell types present. Single-cell RNA-seq, or methods that estimate cell-type proportions, can separate a change in composition from a change within cells."
  },

  /* ---------------------------------------------------------------- BI.DESIGN: replicates, confounders */
  {
    id: "bi-018", obj: ["BI.DESIGN"], lesson: "f3-design", level: 1,
    q: "Which of these is a technical replicate?",
    options: [
      { t: "A second culture of the same cells, grown and heat-shocked separately", why: "That is an independent biological sample: a biological replicate." },
      { t: "Cells from a second patient with the same disease", why: "A different individual is a biological replicate, and an important one." },
      { t: "The same RNA sample sequenced in two different runs", why: "Correct. It measures the same biological material twice, so it shows only the noise of the measurement." },
      { t: "A control culture grown at 37 C", why: "That is a different condition, not a replicate of anything." }
    ],
    answer: 2,
    explain: "Technical replicates repeat the measurement on the same material; biological replicates repeat the whole experiment on independent material. Tests of biological differences need biological replicates."
  },
  {
    id: "bi-019", obj: ["BI.DESIGN"], lesson: "f3-design", level: 2,
    q: "All 3 control cultures had their RNA extracted on Monday and all 3 heat-shocked cultures on Thursday. The analysis finds 500 changed genes. What is the main problem?",
    options: [
      { t: "Extraction day is confounded with condition, so the changes could come from the day rather than from heat", why: "Correct. Anything that differed between Monday and Thursday, such as reagents, timing or handling, changes together with the condition." },
      { t: "500 genes is too many to be real", why: "Strong treatments can change hundreds of genes. The number alone is not the issue." },
      { t: "Three replicates are never enough", why: "Three biological replicates is a common minimum. The flaw here is the design, not the number of replicates." },
      { t: "There is no problem if the same kit was used on both days", why: "Even with the same kit, timing, handling and reagent age differ between days. Confounding concerns any difference, not only the kit." }
    ],
    answer: 0,
    explain: "When a technical difference lines up perfectly with the condition, no analysis can separate their effects. Balance each processing day across conditions instead."
  },
  {
    id: "bi-020", obj: ["BI.DESIGN"], lesson: "f3-design", level: 2,
    q: "A student compares one control culture with one heat-shocked culture, each sequenced very deeply. Why can a statistical test not decide which genes truly changed?",
    options: [
      { t: "Deep sequencing produces too many reads to test", why: "The number of reads does not prevent testing; the missing replicates do." },
      { t: "With one culture per condition, there is no way to estimate how much independent cultures differ naturally", why: "Correct. A test compares the difference between conditions with the variation between replicates, and here that variation is unknown." },
      { t: "Statistical tests need at least 100 samples", why: "Useful tests are routinely done with three or more replicates per condition." },
      { t: "Deep sequencing removes all noise, so no test is needed", why: "Depth reduces counting noise in each sample, but not the natural differences between independent cultures." }
    ],
    answer: 1,
    explain: "Biological replicates are what let a test separate a consistent effect from natural variation. Depth cannot replace them."
  },
  {
    id: "bi-021", obj: ["BI.DESIGN"], lesson: "f3-design", level: 3,
    q: "You must sequence 8 samples (4 control and 4 treated) in two sequencing runs of 4 samples each. Which assignment is best?",
    options: [
      { t: "Run 1: all 4 controls; run 2: all 4 treated", why: "This confounds run with condition: any difference between the runs would look like a treatment effect." },
      { t: "Run 1: 3 controls and 1 treated; run 2: 1 control and 3 treated", why: "This is partly confounded, because each run is dominated by one condition. Equal numbers per run are better." },
      { t: "Each run gets 2 control and 2 treated samples, chosen at random", why: "Correct. Each run contains both conditions equally, so a run effect cannot look like a treatment effect, and it can be accounted for in the analysis." },
      { t: "It does not matter, because sequencing runs never differ", why: "Runs do differ, for example in reagent lots and instrument state, which is why balancing matters." }
    ],
    answer: 2,
    explain: "Balance every batch across conditions and randomize within that constraint. Then record the run in the metadata so that its effect can be checked."
  },
  {
    id: "bi-022", obj: ["BI.DESIGN"], lesson: "f3-design", level: 3,
    q: "A study took tumor tissue from 3 patients and, from each tumor's RNA, prepared and sequenced 4 libraries. The authors analyze the data as 12 independent samples. What is the problem?",
    options: [
      { t: "Nothing: each library was sequenced separately, so 12 is the right number of samples", why: "Sequencing separately measures the same RNA again. It adds technical information, not biological information." },
      { t: "Four libraries per tumor is too many", why: "Extra technical replicates do no harm. The error is counting them as independent samples." },
      { t: "Patients cannot be used as replicates", why: "Patients are exactly the biological replicates in a clinical study. The error is counting libraries as if they were patients." },
      { t: "The 4 libraries per patient are technical replicates; there are only 3 independent biological samples, so treating them as 12 overstates the evidence", why: "Correct. Libraries from one tumor share that patient's biology, and the variation between patients, which matters most, is seen only 3 times." }
    ],
    answer: 3,
    explain: "The number of independent biological units sets the real sample size. Counting technical repeats as replicates (called pseudoreplication) makes results look more certain than they are."
  },
  {
    id: "bi-023", obj: ["BI.DESIGN"], lesson: "f3-design", level: 1,
    q: "Why are samples assigned to a processing order or to positions at random?",
    options: [
      { t: "So that hidden influences, such as time of day or position in a machine, do not line up with one condition", why: "Correct. Randomization spreads unknown influences evenly across conditions, on average." },
      { t: "To make the experiment faster", why: "Randomization does not save time; it protects the comparison." },
      { t: "Because statistical software only accepts random data", why: "Software accepts any data. Randomization is about fair design, not about file requirements." },
      { t: "So that nobody knows which samples are controls", why: "That idea is called blinding, which is related but different. Randomization concerns the order and placement of samples." }
    ],
    answer: 0,
    explain: "Even with careful balancing, some influences are unknown. Random assignment keeps them from favoring one condition."
  },

  /* ---------------------------------------------------------------- BI.ALIGN: alignment and quantification */
  {
    id: "bi-024", obj: ["BI.ALIGN"], lesson: "f3-align", level: 1,
    q: "What does an aligner do in an RNA-seq pipeline?",
    options: [
      { t: "Counts how many genes the genome contains", why: "Gene positions come from the annotation. The aligner works read by read." },
      { t: "Finds where in a reference sequence each read most likely came from", why: "Correct. The aligner compares reads with the reference genome or transcriptome and reports the best-matching position." },
      { t: "Removes low-quality reads", why: "That is quality control and trimming, which happen before alignment." },
      { t: "Normalizes counts between samples", why: "Normalization happens after counting, on the count matrix." }
    ],
    answer: 1,
    explain: "Alignment turns anonymous reads into positions on a reference, which an annotation then links to genes."
  },
  {
    id: "bi-025", obj: ["BI.ALIGN"], lesson: "f3-align", level: 1,
    q: "Which inputs does an RNA-seq aligner such as STAR or HISAT2 need?",
    options: [
      { t: "A count matrix and a sample table", why: "Those are produced later, after alignment and counting." },
      { t: "BAM files and CPM values", why: "BAM files are the aligner's output, and CPM values are calculated from counts much later." },
      { t: "Only the FASTQ files", why: "Without a reference, there is nothing to match the reads against." },
      { t: "The reads (FASTQ) and a reference genome (FASTA), which is first prepared as an index for fast searching", why: "Correct. The aligner builds an index of the reference once and then searches it for every read." }
    ],
    answer: 3,
    explain: "Reads plus a reference are the minimum. An annotation file (GTF) is also commonly supplied to help with splice junctions, and it is required for counting reads per gene."
  },
  {
    id: "bi-026", obj: ["BI.ALIGN"], lesson: "f3-align", level: 2,
    q: "In a SAM file, a read's CIGAR string is `30M1500N70M`. What does it say?",
    options: [
      { t: "30 bases align, then 1,500 reference bases are skipped (most likely an intron), then 70 bases align", why: "Correct. M marks aligned bases and N a skipped stretch of reference, which in RNA-seq is usually an intron." },
      { t: "The read has 1,500 errors", why: "Mismatches are not written as N. N means the read jumps over part of the reference." },
      { t: "The read is 1,600 bases long", why: "Only the M bases come from the read: 30 + 70 = 100 bases. The 1,500 skipped bases are in the reference, not in the read." },
      { t: "The read failed to align", why: "Unaligned reads have no CIGAR string (it is written as `*`). This read aligned in two parts." }
    ],
    answer: 0,
    explain: "CIGAR strings describe how a read lines up with the reference. N operations are the signature of spliced RNA reads."
  },
  {
    id: "bi-027", obj: ["BI.ALIGN"], lesson: "f3-align", level: 2,
    q: "You run `head` on a file called `ctrl_1.bam` and see unreadable symbols. Why?",
    options: [
      { t: "The file is damaged and must be made again", why: "Unreadable symbols are expected for BAM. A damaged file would fail when read with samtools." },
      { t: "BAM files are encrypted for privacy", why: "BAM is compressed, not encrypted. Anyone with samtools can read it." },
      { t: "BAM is a compressed binary format; a tool such as samtools turns it back into readable SAM text", why: "Correct. For example, `samtools view ctrl_1.bam | head` shows the first alignments as text." },
      { t: "`head` only works on FASTQ files", why: "`head` works on any text file. The problem is that BAM is not text." }
    ],
    answer: 2,
    explain: "SAM is text and BAM is its compressed binary form. Alignment files are stored as BAM to save space and are viewed through tools that decompress them."
  },
  {
    id: "bi-028", obj: ["BI.ALIGN"], lesson: "f3-align", level: 3,
    q: "You study a new disease model and want to find splice junctions that are not in any existing annotation. Which approach fits?",
    options: [
      { t: "Pseudoalignment to the known transcriptome, because it is faster", why: "Pseudoalignment can only assign reads to transcripts already in the reference, so new junctions are invisible to it." },
      { t: "Splice-aware alignment to the genome, for example with STAR or HISAT2, because it shows where reads really fall, including at new junctions", why: "Correct. Genome alignment does not depend on a list of known transcripts, so reads across unannotated junctions are still placed and reported." },
      { t: "Searching the FASTQ files for exon sequences with grep", why: "grep finds exact matches only. It cannot tolerate sequencing errors or work out where a read is split across exons." },
      { t: "Calculating TPM values", why: "TPM is a normalization of counts. It cannot reveal junctions." }
    ],
    answer: 1,
    explain: "Choose the method by the question: pseudoalignment for fast expression estimates of known transcripts, and genome alignment when you need positions, new junctions, variants or a genome-browser view."
  },
  {
    id: "bi-029", obj: ["BI.ALIGN"], lesson: "f3-align", level: 3,
    q: "HSPA1A and HSPA1B lie next to each other on chromosome 6 and have nearly identical coding sequences. A read from that region matches both genes equally well. What happens to it?",
    options: [
      { t: "It is always counted once for each gene, so both genes gain a read", why: "Counting one read twice would inflate the totals. Some tools offer it as an option, but it is not standard." },
      { t: "It goes to HSPA1A, because that name comes first alphabetically", why: "Tools do not decide by gene name. They mark the read as ambiguous, skip it or share it statistically." },
      { t: "It is assigned to whichever gene is more highly expressed, every time", why: "Salmon and kallisto use expression estimates to share ambiguous reads in proportion, not to give all of them to one gene." },
      { t: "It depends on the tool: many gene counters skip such multi-mapping reads by default, while Salmon and kallisto share them between the genes with a statistical model", why: "Correct. Both choices are reasonable, but they give somewhat different counts, which is why methods sections name their tools." }
    ],
    answer: 3,
    explain: "Multi-mapping reads are a real source of uncertainty for similar genes. Counts for near-identical genes such as HSPA1A and HSPA1B should be interpreted with care."
  },

  /* ---------------------------------------------------------------- BI.COUNTS: the count matrix */
  {
    id: "bi-030", obj: ["BI.COUNTS"], lesson: "f3-counts", level: 1,
    q: "In a count matrix for bulk RNA-seq, what does one row represent?",
    options: [
      { t: "One sample", why: "Samples are the columns. Each column holds one sample's counts for every gene." },
      { t: "One read", why: "The reads have already been counted; the matrix holds the totals per gene." },
      { t: "One gene, with its read counts in every sample", why: "Correct. Rows are genes and columns are samples, so a row shows how one gene's count varies across samples." },
      { t: "One condition", why: "Conditions are groups of samples. They are described in the sample metadata, not as rows." }
    ],
    answer: 2,
    explain: "Genes in rows, samples in columns: each value is the number of reads assigned to one gene in one sample."
  },
  {
    id: "bi-031", obj: ["BI.COUNTS"], lesson: "f3-counts", level: 2,
    q: "The columns of `counts.tsv` are gene, ctrl_1, ctrl_2, ctrl_3, heat_1, heat_2 and heat_3. What does this command print?",
    code: { lang: "bash", src: "grep FOS counts.tsv | cut -f 6" },
    options: [
      { t: "260", why: "260 is FOS in heat_3, the sixth sample. But `cut` counts fields from the gene column, so field 6 is the fifth sample." },
      { t: "1906", why: "Correct. Field 1 is the gene name, so field 6 is heat_2, where FOS is unusually high." },
      { t: "311", why: "311 is FOS in heat_1, which is field 5." }
    ],
    answer: 1,
    verify: {},
    explain: "`cut -f` counts every tab-separated field, including the gene name. FOS in heat_2 (1,906 reads) is far above the other five samples (220 to 311)."
  },
  {
    id: "bi-032", obj: ["BI.COUNTS"], lesson: "f3-counts", level: 2,
    q: "You add up the ctrl_1 column of `counts.tsv` and get 184,692, but ctrl_1's library size is 18,400,000. Why the difference?",
    options: [
      { t: "The practice table shows only 12 of the tens of thousands of genes, while the library size counts the reads assigned to all genes", why: "Correct. The 12 teaching genes hold only about 1 percent of ctrl_1's reads." },
      { t: "Most reads were lost when the table was saved", why: "Nothing was lost. The table is simply a small part of a full count matrix." },
      { t: "The library size also counts the header line", why: "A single header line could not explain a difference of millions." },
      { t: "The counts were already divided by 100", why: "They are raw whole-number counts. The gap comes from the genes that are not in the table." }
    ],
    answer: 0,
    explain: "Library size is the total over all genes. Always take it from the full data (for the practice data, from the lesson text), never from a subset table."
  },
  {
    id: "bi-033", obj: ["BI.COUNTS"], lesson: "f3-counts", level: 3,
    q: "In ctrl_1, EEF1A1 has 98,622 reads and TP53 has 613. Can you conclude that the cells hold about 160 times more EEF1A1 RNA molecules than TP53 molecules?",
    options: [
      { t: "Yes: raw counts are exact numbers of molecules", why: "Counts are reads from fragments, and the number of fragments per molecule depends on transcript length and on library preparation." },
      { t: "No: counts of different genes can never be compared in any way", why: "They can be compared approximately, after accounting for transcript length, for example with TPM." },
      { t: "Yes, but only after dividing both counts by the library size", why: "Both counts come from the same sample, so dividing by the same library size does not change their ratio. Length is the missing correction." },
      { t: "Only roughly: counts also depend on transcript length, so comparing two genes needs length-aware values such as TPM, and even then it is an estimate", why: "Correct. A longer transcript gives more fragments per molecule, so raw counts favor long genes." }
    ],
    answer: 3,
    explain: "Within one sample, gene-to-gene comparisons need a length correction. Between samples for the same gene, length cancels out and library size is the main correction."
  },
  {
    id: "bi-034", obj: ["BI.COUNTS"], lesson: "f3-counts", level: 3,
    q: "In a new experiment, one sample has only 0.5 million reads assigned to genes, while the others have about 20 million each. What should you do?",
    options: [
      { t: "Flag it in quality control: with so few reads its counts are very noisy, so investigate it and consider excluding or resequencing it", why: "Correct. Normalization fixes the scale, but a gene with 5 reads in a small library is far less certain than the same gene with 200 reads in a library 40 times larger." },
      { t: "Nothing, because CPM corrects any difference in depth", why: "CPM corrects the average scale, not the extra uncertainty of small counts." },
      { t: "Multiply its counts by 40 so that they match the other samples", why: "Scaling makes the numbers look similar but adds no information; it scales up the noise too." },
      { t: "Delete every gene that has low counts in this sample", why: "That would throw away genes for all samples because of one poor sample. Deal with the sample itself." }
    ],
    answer: 0,
    explain: "Very low depth is a quality problem, not just a scaling problem. Sample-level quality control checks depth before any comparison."
  },

  /* ---------------------------------------------------------------- BI.NORM: normalization */
  {
    id: "bi-035", obj: ["BI.NORM"], lesson: "f3-normalization", level: 1,
    q: "Why are raw counts normalized before samples are compared?",
    options: [
      { t: "To remove the differences between conditions", why: "The differences between conditions are what you want to measure. Normalization removes technical differences of scale, not biology." },
      { t: "Samples get different numbers of reads, so raw counts partly reflect how deeply each sample was sequenced", why: "Correct. Normalization puts every sample on the same scale, such as reads per million." },
      { t: "To turn reads into amounts of protein", why: "No normalization can turn RNA reads into protein measurements." },
      { t: "To give every gene the same expression level", why: "Genes keep their very different levels. Normalization changes the scale of samples, not the ranking of genes." }
    ],
    answer: 1,
    explain: "Library sizes in the heat-shock data range from 17.9 to 24.6 million reads. Without normalization, deeper samples would look as if every gene were more expressed."
  },
  {
    id: "bi-036", obj: ["BI.NORM"], lesson: "f3-normalization", level: 2,
    q: "HSPA1A has 8,441 reads in heat_2, whose library size is 17,900,000. What is its CPM?",
    options: [
      { t: "About 343.1", why: "That divides by 24,600,000, heat_1's library size. Each sample must use its own library size." },
      { t: "About 0.00047", why: "That is 8,441 / 17,900,000 without the multiplication by 1,000,000." },
      { t: "8,441", why: "That is the raw count. CPM rescales it to reads per million." },
      { t: "About 471.6", why: "Correct: 8,441 / 17,900,000 x 1,000,000 = 471.6." }
    ],
    answer: 3,
    explain: "CPM = count / library size x 1,000,000. Dividing by the library size in millions gives the same answer: 8,441 / 17.9 = 471.6."
  },
  {
    id: "bi-037", obj: ["BI.NORM"], lesson: "f3-normalization", level: 2,
    q: "HSPA1A has 11,018 reads in heat_1 (library size 24,600,000), 8,441 in heat_2 (17,900,000) and 10,838 in heat_3 (21,200,000). Which sample has the highest HSPA1A CPM?",
    options: [
      { t: "heat_1, because it has the most reads", why: "heat_1 also has the largest library. Per million reads it is the lowest of the three, at about 447.9." },
      { t: "heat_2, at about 471.6", why: "heat_2 is higher than heat_1 after normalization, but heat_3 is higher still." },
      { t: "heat_3, at about 511.2", why: "Correct: 10,838 / 21.2 = 511.2, compared with 447.9 for heat_1 and 471.6 for heat_2." },
      { t: "All three are equal after normalization", why: "Normalization removes depth effects, not real differences between cultures. The three values differ by up to about 14 percent." }
    ],
    answer: 2,
    explain: "Normalization can change which sample looks highest. Rank samples by CPM or another normalized value, never by raw counts."
  },
  {
    id: "bi-038", obj: ["BI.NORM"], lesson: "f3-normalization", level: 2,
    q: "In one sample, gene A (transcripts 1,000 bases long) and gene B (transcripts 4,000 bases long) both have 400 reads. Which statement is most accurate?",
    options: [
      { t: "Gene A probably has about 4 times more RNA molecules, because each long gene B molecule yields more fragments; TPM corrects for this", why: "Correct. Per 1,000 bases, gene A has 400 reads and gene B has 100, so gene A has about 4 times more transcripts." },
      { t: "Both genes have the same amount of RNA, because their counts are equal", why: "Equal counts mean equal numbers of fragments. Long transcripts produce more fragments per molecule, so gene B needs fewer molecules to reach 400 reads." },
      { t: "Gene B has 4 times more molecules, because it is longer", why: "This reverses the logic: being longer gives more reads per molecule, so the same count means fewer molecules." },
      { t: "Their CPM values differ, and that shows the difference", why: "Both genes are in the same sample, so they share one library size and have the same CPM." }
    ],
    answer: 0,
    explain: "TPM divides by transcript length before scaling, so it suits comparisons between genes within one sample. CPM ignores length."
  },
  {
    id: "bi-039", obj: ["BI.NORM"], lesson: "f3-normalization", level: 3,
    q: "In treated samples, one gene becomes so active that it takes 40 percent of all reads, compared with 1 percent in controls. Most other genes do not change per cell. What happens to their CPM, and what helps?",
    options: [
      { t: "Their CPM rises, because the library contains more RNA", why: "CPM is a share of the reads in each sample. When one gene takes more of the share, everything else gets less." },
      { t: "Nothing happens, because CPM corrects for everything", why: "CPM corrects for total depth only. It cannot tell that the drop comes from one dominant gene." },
      { t: "Their CPM drops, and sequencing more deeply fixes it", why: "Deeper sequencing keeps the same proportions, so the distortion stays." },
      { t: "Their CPM drops to about 60 percent of the control value, because their share of the reads shrinks; median-of-ratios (DESeq2) or TMM (edgeR) normalization corrects this using the many unchanged genes", why: "Correct. All other genes together go from 99 percent to 60 percent of the reads, so each looks about 40 percent lower even though nothing changed for it." }
    ],
    answer: 3,
    explain: "This is composition bias. DESeq2's median-of-ratios and edgeR's TMM assume most genes do not change, and they scale samples by a typical gene rather than by the total."
  },
  {
    id: "bi-040", obj: ["BI.NORM"], lesson: "f3-normalization", level: 3,
    q: "A classmate converts the count matrix to TPM and gives the TPM values to DESeq2 for differential expression testing. What is the problem?",
    options: [
      { t: "There is no problem: normalized values always give better results", why: "Normalizing twice, once as TPM and again inside DESeq2, distorts the data and hides information the model needs." },
      { t: "DESeq2 expects raw counts and estimates its own size factors, so TPM values break the assumptions of its statistical model", why: "Correct. The model describes how raw counts vary, including the extra uncertainty of small counts, which TPM hides." },
      { t: "TPM values are too large for DESeq2", why: "Size is not the issue, and TPM values are often smaller than raw counts." },
      { t: "DESeq2 only accepts CPM values", why: "DESeq2 takes raw (unnormalized) counts. CPM would cause the same problem as TPM." }
    ],
    answer: 1,
    explain: "Count-based tools such as DESeq2 and edgeR need raw counts. Use CPM or TPM for plots and for comparing genes, not as input to these tests."
  },

  /* ---------------------------------------------------------------- R.BASICS: vectors, types, indexing */
  {
    id: "r-001", obj: ["R.BASICS"], lesson: "f3-r-basics", level: 1,
    q: "What does R print?",
    code: { lang: "r", src: "lib <- c(18.4, 22.1, 20.3)\nlib[c(1, 3)]" },
    options: [
      { t: "[1] 22.1", why: "That would be the second element alone. R counts from 1, and `c(1, 3)` asks for positions 1 and 3." },
      { t: "[1] 18.4 22.1 20.3", why: "That is the whole vector. Indexing with `c(1, 3)` keeps only two values." },
      { t: "[1] 18.4 20.3", why: "Correct. `c(1, 3)` asks for the first and third elements, counting from 1." }
    ],
    answer: 2,
    verify: {},
    explain: "Square brackets select elements by position, starting at 1. A vector of positions selects several elements at once."
  },
  {
    id: "r-002", obj: ["R.BASICS"], lesson: "f3-r-basics", level: 2,
    q: "What does R print?",
    code: { lang: "r", src: "x <- c(3, 6, 9, 12)\nx[-1]" },
    options: [
      { t: "[1] 12", why: "In Python, `x[-1]` is the last element. In R, a minus sign means leave this position out." },
      { t: "[1]  6  9 12", why: "Correct. A negative index removes that position, so `x[-1]` is everything except the first element." },
      { t: "[1] 3 6 9", why: "That drops the last element. `-1` refers to position 1, the first." }
    ],
    answer: 1,
    verify: {},
    explain: "Negative indexes in R exclude positions. To get the last element in R, use `x[length(x)]`."
  },
  {
    id: "r-003", obj: ["R.BASICS"], lesson: "f3-r-basics", level: 2,
    q: "One value was typed with quotes by mistake. What does R print?",
    code: { lang: "r", src: 'temps <- c(37, "42", 37)\ntemps' },
    options: [
      { t: "[1] 37 42 37", why: "R does not turn the text back into a number. It turns the numbers into text instead." },
      { t: '[1] 37 "42" 37', why: "A vector cannot mix types, so R never prints numbers and text side by side in one vector." },
      { t: '[1] "37" "42" "37"', why: "Correct. A vector holds one type, so R turns every element into text to fit the quoted value." }
    ],
    answer: 2,
    verify: {},
    explain: "Mixing types in `c()` converts everything to the most flexible type, here character. Arithmetic on `temps` would now fail, a common problem when a data file contains stray text."
  },
  {
    id: "r-004", obj: ["R.BASICS"], lesson: "f3-r-basics", level: 1,
    q: "Which symbol completes `counts ___ c(212, 282, 203)` so that the vector is stored under the name `counts`?",
    options: [
      { t: "`==`", why: "`==` compares two values and returns TRUE or FALSE. It does not store anything." },
      { t: "`<-`", why: "Correct. `<-` assigns the value on its right to the name on its left." },
      { t: "`<=`", why: "`<=` means less than or equal to. It compares; it does not assign." },
      { t: "`%in%`", why: "`%in%` checks whether values occur in another vector. It does not assign." }
    ],
    answer: 1,
    explain: "The assignment arrow `<-` stores a value under a name. (A single `=` also works, but `<-` is the usual style in R code.)"
  },
  {
    id: "r-005", obj: ["R.BASICS"], lesson: "f3-r-basics", level: 2,
    q: "What does R print?",
    code: { lang: "r", src: "x <- c(10, NA, 30)\nmean(x)\nmean(x, na.rm = TRUE)" },
    options: [
      { t: "[1] NA\n[1] 20", why: "Correct. A missing value makes the mean unknown, unless `na.rm = TRUE` tells R to remove missing values first." },
      { t: "[1] 20\n[1] 20", why: "R does not skip NA unless you tell it to. This protects you from silently ignoring missing data." },
      { t: "[1] 13.33333\n[1] 20", why: "NA is not treated as 0. Treating it as 0 would give (10 + 0 + 30) / 3 = 13.33." },
      { t: "[1] NA\n[1] NA", why: "`na.rm = TRUE` removes the NA, so the second mean is (10 + 30) / 2 = 20." }
    ],
    answer: 0,
    verify: {},
    explain: "Most R summary functions return NA when any value is missing. Use `na.rm = TRUE` deliberately, after checking why values are missing."
  },
  {
    id: "r-006", obj: ["R.BASICS"], lesson: "f3-r-basics", level: 2,
    q: "You want to use DESeq2, a Bioconductor package, in a new R installation. Which plan is right?",
    options: [
      { t: "Run `library(DESeq2)` only; it downloads the package automatically", why: "`library()` loads packages that are already installed. If DESeq2 is missing, it stops with an error." },
      { t: "Run `install.packages(\"DESeq2\")` at the start of every script", why: "DESeq2 is distributed through Bioconductor, not CRAN, and reinstalling at every run is unnecessary." },
      { t: "Install it once with `BiocManager::install(\"DESeq2\")`, then load it with `library(DESeq2)` in every session that uses it", why: "Correct. Installing copies the package onto your computer; `library()` loads it into the current session." },
      { t: "Copy the package's code from a website into your script", why: "Packages are installed as tested, versioned bundles. Copying code by hand loses the documentation, the tests and the version information." }
    ],
    answer: 2,
    explain: "Install once (`install.packages()` for CRAN packages; `BiocManager::install()` for Bioconductor packages, after installing BiocManager itself), then load with `library()` in each session."
  },
  {
    id: "r-007", obj: ["R.BASICS"], lesson: "f3-r-basics", level: 3,
    q: "`counts` holds HSPA1A's six counts and `lib` holds the six library sizes in reads. A student computes CPM with `counts / lib[1] * 1e6`. What is wrong?",
    options: [
      { t: "Nothing: R matches each count with the right library size automatically", why: "R pairs elements only when both vectors have the same length. `lib[1]` has length 1, so the same value is used every time." },
      { t: "R cannot divide a vector by a single number", why: "It can: a single number is reused for every element. That is exactly why this bug gives no error." },
      { t: "`lib[1]` is the second library size, because R counts from 0", why: "R counts from 1, so `lib[1]` is the first library size, ctrl_1's." },
      { t: "Every count is divided by ctrl_1's library size; `counts / lib * 1e6` divides each count by its own sample's library size", why: "Correct. `lib[1]` is a single number, so R reuses it for all six counts." }
    ],
    answer: 3,
    explain: "Vectorized arithmetic pairs the elements of equal-length vectors. A wrong index can silently turn a per-sample calculation into one that uses a single value for everything."
  },

  /* ---------------------------------------------------------------- R.LOGIC: logical vectors, conditions, loops */
  {
    id: "r-008", obj: ["R.LOGIC"], lesson: "f3-r-control", level: 1,
    q: "What does R print?",
    code: { lang: "r", src: "depth <- c(18.4, 22.1, 20.3)\ndepth > 20" },
    options: [
      { t: "[1] 22.1 20.3", why: "That is what `depth[depth > 20]` returns. The comparison on its own gives logical values." },
      { t: "[1] 2", why: "That is what `sum(depth > 20)` returns: the number of TRUE values." },
      { t: "[1] TRUE", why: "R compares every element, not the vector as a whole." },
      { t: "[1] FALSE  TRUE  TRUE", why: "Correct. The comparison is applied to each element and returns one TRUE or FALSE per sample." }
    ],
    answer: 3,
    verify: {},
    explain: "Comparisons in R are vectorized: they return a logical vector as long as the input."
  },
  {
    id: "r-009", obj: ["R.LOGIC"], lesson: "f3-r-control", level: 2,
    q: "These are the Phred scores of five bases. What does R print?",
    code: { lang: "r", src: "q <- c(38, 12, 30, 25, 9)\nsum(q < 20)" },
    options: [
      { t: "[1] 21", why: "That adds the low scores themselves (12 + 9). Here `sum()` adds TRUE and FALSE values, not the scores." },
      { t: "[1] 2", why: "Correct. `q < 20` gives FALSE TRUE FALSE FALSE TRUE, and `sum()` counts each TRUE as 1." },
      { t: "[1] 2 5", why: "Those are the positions of the low scores, which `which(q < 20)` would return." },
      { t: "[1] FALSE  TRUE FALSE FALSE  TRUE", why: "That is `q < 20` before `sum()` turns it into a count." }
    ],
    answer: 1,
    verify: {},
    explain: "TRUE counts as 1 and FALSE as 0, so `sum()` of a logical vector counts how many values pass a rule, and `mean()` gives the proportion."
  },
  {
    id: "r-010", obj: ["R.LOGIC"], lesson: "f3-r-control", level: 2,
    q: "What does R print?",
    code: { lang: "r", src: 'for (q in c(35, 18, 28)) {\n  if (q >= 30) {\n    print("good")\n  } else if (q >= 20) {\n    print("ok")\n  } else {\n    print("low")\n  }\n}' },
    options: [
      { t: '[1] "good"\n[1] "ok"\n[1] "low"', why: "The loop handles the values in their original order: 35, then 18, then 28. Trace each one through the tests." },
      { t: '[1] "good"\n[1] "low"\n[1] "ok"', why: "Correct. 35 passes the first test; 18 fails both tests and reaches `else`; 28 fails the first test but passes the second." },
      { t: '[1] "good"\n[1] "ok"\n[1] "ok"', why: "18 is below 20, so `q >= 20` is FALSE and the `else` branch prints \"low\"." },
      { t: '[1] "good"', why: "The `for` loop runs its body once for every value, so three lines are printed." }
    ],
    answer: 1,
    verify: {},
    explain: "`if`, `else if` and `else` are tested in order, and only the first branch whose test is TRUE runs. The loop repeats this for each value."
  },
  {
    id: "r-011", obj: ["R.LOGIC"], lesson: "f3-r-control", level: 3,
    q: "A quality rule flags a sample if less than 70 percent of its reads mapped OR it has fewer than 18 million reads. (The mapping percentages are invented for this question.) What does R print?",
    code: { lang: "r", src: "mapped <- c(ctrl_1 = 91, ctrl_2 = 88, ctrl_3 = 62, heat_1 = 90, heat_2 = 85, heat_3 = 89)\ndepth <- c(ctrl_1 = 18.4, ctrl_2 = 22.1, ctrl_3 = 20.3, heat_1 = 24.6, heat_2 = 17.9, heat_3 = 21.2)\nnames(mapped)[mapped < 70 | depth < 18]" },
    options: [
      { t: "character(0)", why: "That is the result with `&`, which needs both rules to fail for the same sample. No sample fails both." },
      { t: '[1] "ctrl_3"', why: "heat_2 has a good mapping rate but only 17.9 million reads, so the depth rule flags it too." },
      { t: '[1] "ctrl_3" "heat_2"', why: "Correct. ctrl_3 fails the mapping rule (62) and heat_2 fails the depth rule (17.9); `|` flags a sample that fails either rule." },
      { t: "[1] 3 5", why: "Those are positions, which `which()` would return. Indexing `names(mapped)` returns names." }
    ],
    answer: 2,
    verify: {},
    explain: "`|` means or, and `&` means and. Choosing the wrong one changes which samples a quality filter removes, so test filters on a small example first."
  },
  {
    id: "r-012", obj: ["R.LOGIC"], lesson: "f3-r-control", level: 3,
    q: "This code stops with `Error in if (lib < 20) ... : the condition has length > 1`. What is the problem, and which fix asks whether any sample is low?",
    code: { lang: "r", src: 'lib <- c(18.4, 22.1, 20.3)\nif (lib < 20) print("low")' },
    options: [
      { t: "R cannot compare decimals with whole numbers; write `20.0` instead", why: "R compares 18.4 with 20 without any trouble. The problem is that there are three results." },
      { t: "`if` needs one TRUE or FALSE, but `lib < 20` gives three; write `if (any(lib < 20)) print(\"low\")`", why: "Correct. `any()` reduces the three logical values to one answer: is at least one of them TRUE?" },
      { t: "`print()` cannot be used inside `if`; use `cat()` instead", why: "`print()` works inside `if`. The error message points to the condition." },
      { t: "The vector must be sorted first", why: "Sorting does not change the number of values, so the condition would still have length 3." }
    ],
    answer: 1,
    explain: "Since R 4.2, `if` gives an error when the test inside it has more than one value. Use `any()` or `all()` for a single answer, `ifelse()` for element-by-element choices, or a loop."
  },
  {
    id: "r-013", obj: ["R.LOGIC"], lesson: "f3-r-control", level: 2,
    q: "What does R print?",
    code: { lang: "r", src: 'depth <- c(18.4, 22.1, 17.9)\nifelse(depth < 20, "low", "ok")' },
    options: [
      { t: '[1] "low"', why: "Unlike `if`, `ifelse()` works on whole vectors and returns one result per element." },
      { t: "[1]  TRUE FALSE  TRUE", why: "That is `depth < 20` alone. `ifelse()` replaces each TRUE and FALSE with the text you supply." },
      { t: '[1] "ok"  "low" "ok"', why: "The second argument is used when the test is TRUE. 18.4 < 20 is TRUE, so the first result is \"low\"." },
      { t: '[1] "low" "ok"  "low"', why: "Correct. `ifelse()` checks every element and picks \"low\" or \"ok\" for each one." }
    ],
    answer: 3,
    verify: {},
    explain: "`ifelse(test, yes, no)` is the vectorized way to label values, for example to mark each sample as passing or failing a quality rule."
  },

  /* ---------------------------------------------------------------- R.DF: data frames, files, R Markdown */
  {
    id: "r-014", obj: ["R.DF"], lesson: "f3-r-dataframes", level: 1,
    q: "What is a data frame in R?",
    options: [
      { t: "A table in which every value must be a number", why: "That describes a numeric matrix. A data frame can mix text and numbers in different columns." },
      { t: "A single vector with names", why: "A named vector is one set of values. A data frame has rows and columns." },
      { t: "A file format, like CSV", why: "CSV is a file format. A data frame is the table in R's memory after such a file is read." },
      { t: "A table whose columns are vectors of equal length, where different columns can hold different types", why: "Correct. For example, `samples.tsv` becomes a data frame with text and integer columns side by side." }
    ],
    answer: 3,
    explain: "Data frames are R's standard table: one row per observation and one column per variable, each column with its own type."
  },
  {
    id: "r-015", obj: ["R.DF"], lesson: "f3-r-dataframes", level: 2,
    q: "`samples.tsv` has a header line plus one line per sample (7 lines in total). What does R print?",
    code: { lang: "r", src: 'samples <- read.delim("samples.tsv")\ndim(samples)' },
    options: [
      { t: "[1] 7 4", why: "The header line is not a data row: `read.delim()` uses it for the column names." },
      { t: "[1] 6 4", why: "Correct. The header becomes the column names, leaving 6 rows (one per sample) and 4 columns." },
      { t: "[1] 4 6", why: "`dim()` gives rows first, then columns." }
    ],
    answer: 1,
    verify: {},
    explain: "`dim()` returns the number of rows and then the number of columns. `nrow()` and `ncol()` return each one separately."
  },
  {
    id: "r-016", obj: ["R.DF"], lesson: "f3-r-dataframes", level: 2,
    q: "A student reads the tab-separated file `counts.tsv` with `read.csv()`. What does R print?",
    code: { lang: "r", src: 'x <- read.csv("counts.tsv")\ndim(x)' },
    options: [
      { t: "[1] 12  7", why: "That is what `read.delim()` would give: 12 genes and 7 columns, including the gene names." },
      { t: "[1] 13  7", why: "Even with the right function, the header line becomes the column names, not a row." },
      { t: "[1] 12  1", why: "Correct. `read.csv()` splits lines at commas. There are none, so each whole line becomes a single column." },
      { t: "[1] 12  6", why: "That would need the right separator and `row.names = 1` to move the gene names out of the columns." }
    ],
    answer: 2,
    verify: {},
    explain: 'Match the reader to the separator: `read.csv()` for commas, and `read.delim()` (or `read.csv(sep = "\\t")`) for tabs. A one-column result is the classic sign of the wrong separator.'
  },
  {
    id: "r-017", obj: ["R.DF"], lesson: "f3-r-dataframes", level: 2,
    q: "What does R print?",
    code: { lang: "r", src: 'condition <- factor(c("untreated", "treated", "untreated", "treated"))\nlevels(condition)' },
    options: [
      { t: '[1] "treated"   "untreated"', why: "Correct. By default, factor levels are sorted alphabetically, so \"treated\" comes first." },
      { t: '[1] "untreated" "treated"', why: "Levels are not kept in the order the values first appear. They are sorted, unless you set `levels =` yourself." },
      { t: '[1] "untreated" "treated"   "untreated" "treated"', why: "That is the data itself. `levels()` lists each category once." }
    ],
    answer: 0,
    verify: {},
    explain: 'The order of levels matters because many analysis tools use the first level as the reference group. Set it explicitly with `factor(x, levels = c("untreated", "treated"))`.'
  },
  {
    id: "r-018", obj: ["R.DF"], lesson: "f3-r-dataframes", level: 3,
    q: "The count matrix columns are ctrl_1, ctrl_2, ctrl_3, heat_1, heat_2, heat_3, but a collaborator's sample table lists heat_1, heat_2, heat_3, ctrl_1, ctrl_2, ctrl_3. An analysis pairs the columns with the table rows by position. What happens?",
    options: [
      { t: "R notices that the names differ and reorders the table automatically", why: "Pairing by position ignores names. Some tools check, but you cannot rely on it: check yourself with `all(colnames(counts) == samples$sample)`." },
      { t: "Every column gets the wrong condition: control columns are treated as heat-shock samples and the reverse, so every change appears in the opposite direction", why: "Correct. Position 1 is ctrl_1 in the matrix but heat_1 in the table, and the same mix-up happens at all six positions." },
      { t: "Nothing changes, because both lists contain the same six names", why: "The same names in a different order still give each column the wrong row." },
      { t: "Only the first sample is affected", why: "All six positions are mismatched, not just the first." }
    ],
    answer: 1,
    explain: "Before analysis, reorder the sample table to match the count columns, for example with `samples[match(colnames(counts), samples$sample), ]`, and confirm that `all(colnames(counts) == samples$sample)` gives TRUE."
  },
  {
    id: "r-019", obj: ["R.DF"], lesson: "f3-r-dataframes", level: 3,
    q: "You set `condition <- factor(c(\"treated\", \"treated\", \"untreated\", \"untreated\"))` and use a tool that compares every group with the first factor level. A gene goes up after treatment. What will the tool report, and how do you fix it?",
    options: [
      { t: "The gene appears to go down, because \"treated\" is the first level and becomes the reference; fix it with `levels = c(\"untreated\", \"treated\")`", why: "Correct. With \"treated\" as the reference, the tool reports untreated compared with treated, so an increase after treatment appears as a decrease." },
      { t: "The gene appears to go up, because the tool always knows which group is the control", why: "Tools cannot tell which group is the control from its name; they use the order of the levels." },
      { t: "The tool stops with an error, because factor levels must be in alphabetical order", why: "Any order of levels is allowed. Alphabetical order is just the default." },
      { t: "Nothing changes, because the order of levels never matters", why: "When groups are compared with a reference level, the order decides the direction of every change." }
    ],
    answer: 0,
    explain: 'Many tools, DESeq2 among them, use the first level as the reference by default. Put the control level first, or use `relevel(condition, ref = "untreated")`.'
  },
  {
    id: "r-020", obj: ["R.DF"], lesson: "f3-r-dataframes", level: 1,
    q: "What is the main advantage of an R Markdown report over pasting results into a word processor?",
    options: [
      { t: "R Markdown runs code faster than a script", why: "The speed is the same; R does the work in both cases." },
      { t: "R Markdown hides the code so that readers see only results", why: "You can hide code, but the point is that the code is part of the document and can be rerun." },
      { t: "Text, code and results come from one file, and knitting reruns the code, so the results always match the code", why: "Correct. If the data or the code change, knitting again updates every number and figure." },
      { t: "Word processors cannot show tables", why: "They can. The problem is that pasted results are disconnected from the code that made them." }
    ],
    answer: 2,
    explain: "An R Markdown file (`.Rmd`) mixes text and code chunks; knitting produces an HTML, PDF or Word report that is regenerated from the code every time."
  }
);
