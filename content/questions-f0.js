/* Foundation 0 practice questions. Original items; not official assessment questions. */
window.BB = window.BB || {};
BB.questions = BB.questions || [];
BB.questions.push(
  { id: 'f0-001', obj: ['F0.BIOINF'], level: 1, lesson: 'f0-bioinformatics',
    q: 'Which description of bioinformatics is most accurate?',
    options: [
      { t: 'Using computation and statistics to organize, analyze and interpret biological data', why: 'Correct. It combines computing, statistics and biology to turn data into biological understanding.' },
      { t: 'Building computers out of biological molecules', why: 'That describes biocomputing or DNA computing, a different research area. Bioinformatics uses ordinary computers to study biology.' },
      { t: 'Storing patient records in a hospital database', why: 'That is health informatics. Bioinformatics focuses on biological data such as DNA, RNA and protein measurements.' },
      { t: 'Any laboratory work that uses electricity', why: 'Using electrical equipment does not make work computational. Bioinformatics is defined by analyzing biological data.' }
    ], answer: 0, explain: 'Bioinformatics exists because modern biology produces data too large and too noisy to interpret by eye.' },
  { id: 'f0-002', obj: ['F0.BIOINF'], level: 2, lesson: 'f0-bioinformatics',
    q: 'A lab sequences RNA from 40 tumor samples and receives 1.5 billion short sequences. What is the FIRST job a bioinformatician does with this data?',
    options: [
      { t: 'Check the quality of the sequences and organize the files before any analysis', why: 'Correct. Every later conclusion depends on the input being trustworthy and well labelled.' },
      { t: 'Report which genes cause the cancer', why: 'That jumps to a conclusion. Raw sequences must be checked, matched to genes, counted and compared with statistics before any biological claim.' },
      { t: 'Read through the sequences by eye to spot unusual ones', why: 'At one sequence per second this would take about 48 years. Software is needed for this scale.' }
    ], answer: 0, explain: 'Quality control comes first: problems in raw data propagate into every result.' },
  { id: 'f0-003', obj: ['F0.BIOINF'], level: 3, lesson: 'f0-bioinformatics',
    q: 'A program reports that 250 genes changed after a treatment, and the top gene is one nobody expected. What is the most scientific next step?',
    options: [
      { t: 'Check sample labels and data quality, look at the gene\'s values in each sample, then plan an independent experiment to confirm it', why: 'Correct. A surprising result is a hypothesis: first rule out technical problems, then test it independently.' },
      { t: 'Remove the gene from the list because it was not expected', why: 'Unexpected results can be real discoveries. Removing them without a reason is a form of bias.' },
      { t: 'Publish it as a discovery, because the program is accurate', why: 'Software can be correct and still give misleading results from mislabelled samples or a poor design. Claims need checks and confirmation.' }
    ], answer: 0, explain: 'Bioinformatics results are evidence that guides experiments, not final answers.' },
  { id: 'f0-004', obj: ['F0.BIOINF', 'F0.WHYCOMP'], level: 1, lesson: 'f0-bioinformatics',
    q: 'Which of these questions could bioinformatics help answer?',
    options: [
      { t: 'Which genes are more active in a tumor than in nearby healthy tissue?', why: 'Correct. This compares measurements of many genes across samples, a classic bioinformatics question.' },
      { t: 'What color should the lab walls be painted?', why: 'This has nothing to do with analyzing biological data.' },
      { t: 'How heavy is one specific laboratory mouse?', why: 'Weighing one animal is a direct measurement; no data analysis across many measurements is needed.' }
    ], answer: 0, explain: 'Good bioinformatics questions involve many measurements that must be compared systematically.' },
  { id: 'f0-005', obj: ['F0.DOGMA'], level: 1, lesson: 'f0-cells-dna',
    q: 'Which pairing rule holds in double-stranded DNA?',
    options: [
      { t: 'A pairs with T, and C pairs with G', why: 'Correct. This complementarity lets one strand determine the other.' },
      { t: 'A pairs with U, and C pairs with G', why: 'U (uracil) is found in RNA, not DNA. In DNA, A pairs with T.' },
      { t: 'A pairs with C, and G pairs with T', why: 'These bases do not fit together in the double helix. The pairs are A-T and C-G.' },
      { t: 'Each base pairs with itself', why: 'Then the two strands would be identical rather than complementary, and the pairing rule would not hold.' }
    ], answer: 0, explain: 'Complementarity explains DNA copying and why software can work out the other strand.' },
  { id: 'f0-006', obj: ['F0.DOGMA'], level: 2, lesson: 'f0-dogma',
    q: 'A DNA coding strand is `5\'-ATGTTTGGC-3\'`. Which mRNA is made from this gene?',
    options: [
      { t: '5\'-AUGUUUGGC-3\'', why: 'Correct. The mRNA matches the coding strand, with U instead of T.' },
      { t: '5\'-TACAAACCG-3\'', why: 'This is the letter-by-letter DNA complement (with T). The mRNA is built against the template strand, so it matches the coding strand.' },
      { t: '5\'-UACAAACCG-3\'', why: 'This complements the coding strand. The RNA matches the coding strand because it is built from the other (template) strand.' },
      { t: '5\'-ATGTTTGGC-3\'', why: 'This is still DNA. RNA uses U in place of T.' }
    ], answer: 0, explain: 'Transcription: the RNA has the coding-strand sequence with U for T.' },
  { id: 'f0-007', obj: ['F0.DOGMA'], level: 2, lesson: 'f0-dogma',
    q: 'Using the standard genetic code, what does the mRNA `AUG GCC UGA` produce?',
    options: [
      { t: 'Met-Ala, then translation stops', why: 'Correct. AUG = methionine (start), GCC = alanine, UGA = stop.' },
      { t: 'Met-Ala-Trp', why: 'UGA is a stop codon in the standard genetic code. (UGG is tryptophan.)' },
      { t: 'Ala-Stop', why: 'AUG is not skipped: it is the start codon and also codes for methionine.' },
      { t: 'Nothing, because the sequence contains U', why: 'mRNA always contains U; that is normal. The ribosome reads it codon by codon.' }
    ], answer: 0, explain: 'Translation starts at AUG (methionine) and ends at UAA, UAG or UGA.' },
  { id: 'f0-008', obj: ['F0.DOGMA'], level: 3, lesson: 'f0-dogma',
    q: 'Two people differ by one letter inside a gene: GAA in one person, GAG in the other. Both codons code for glutamic acid. What would you expect for the protein?',
    options: [
      { t: 'The same amino acid sequence, because the change is silent', why: 'Correct. Different codons can code for the same amino acid, so this change does not alter the protein sequence.' },
      { t: 'A shorter protein, because one letter changed', why: 'A protein becomes shorter if a change creates a stop codon or deletes letters. GAG is not a stop codon.' },
      { t: 'A completely different protein after this point', why: 'That happens with insertions or deletions that shift the reading frame. A substitution changes at most one codon.' }
    ], answer: 0, explain: 'Because the genetic code is redundant, some DNA differences have no effect on the protein sequence (though a few can still affect splicing or translation speed).' },
  { id: 'f0-009', obj: ['F0.DOGMA'], level: 3, lesson: 'f0-dogma',
    q: 'A researcher measures high RNA levels for a gene but finds very little of its protein. Which explanation is biologically possible?',
    options: [
      { t: 'The protein is broken down quickly or the RNA is translated slowly', why: 'Correct. Cells control translation and protein breakdown separately from transcription, so RNA and protein levels can differ.' },
      { t: 'High RNA always means high protein, so the measurement must be wrong', why: 'RNA and protein levels are related but not locked together. Different results can both be correct.' },
      { t: 'The gene must be missing from the DNA', why: 'If the gene were missing, there would be no RNA from it either.' }
    ], answer: 0, explain: 'RNA-seq measures RNA. It is a strong but indirect guide to protein activity.' },
  { id: 'f0-010', obj: ['F0.DOGMA'], level: 1, lesson: 'f0-dogma',
    q: 'What is a codon?',
    options: [
      { t: 'Three letters of mRNA that specify one amino acid or a stop signal', why: 'Correct. The ribosome reads mRNA in these groups of three.' },
      { t: 'One letter (base) of DNA', why: 'A single letter is a nucleotide or base. A codon is a group of three.' },
      { t: 'A whole gene', why: 'A gene contains many codons (and, in humans, introns that are removed).' },
      { t: 'A finished protein', why: 'A protein is the chain of amino acids that codons encode.' }
    ], answer: 0, explain: '64 codons map to 20 amino acids plus stop signals.' },
  { id: 'f0-011', obj: ['F0.EXPR'], level: 1, lesson: 'f0-expression',
    q: 'What does it mean to say a gene is "expressed" in a cell?',
    options: [
      { t: 'The cell is using the gene to make its RNA (and, for protein-coding genes, its protein)', why: 'Correct. Expression means the gene is being transcribed and its product made.' },
      { t: 'The gene is present in the cell\'s DNA', why: 'Almost every cell has nearly every gene in its DNA. Expressed means the gene is actively used.' },
      { t: 'The gene has a mutation', why: 'Mutation is a change in DNA sequence, a different idea from whether a gene is used.' }
    ], answer: 0, explain: 'Having a gene and using it are different. RNA-seq measures use.' },
  { id: 'f0-012', obj: ['F0.EXPR'], level: 2, lesson: 'f0-expression',
    q: 'Liver cells make large amounts of albumin RNA, while nerve cells from the same person make almost none. What is the best explanation?',
    options: [
      { t: 'Both cells have the albumin gene, but it is switched on only in liver cells', why: 'Correct. Cell types differ in which genes they express, not in which genes they have.' },
      { t: 'Nerve cells lost the albumin gene during development', why: 'Cells in one person carry essentially the same genome. The gene is present but silent in nerve cells.' },
      { t: 'The albumin RNA was made in nerve cells and moved to the liver', why: 'RNA does not travel between organs this way. Each cell type makes its own RNAs.' }
    ], answer: 0, explain: 'Gene expression patterns define cell identity.' },
  { id: 'f0-013', obj: ['F0.EXPR'], level: 3, lesson: 'f0-expression',
    q: 'After one hour at 42 C, heat-shock genes rise strongly in cultured cells, while ACTB and GAPDH stay flat. Which conclusion is best supported?',
    options: [
      { t: 'Heat triggered a specific response that switched on heat-shock genes', why: 'Correct. A rise in specific genes, with reference genes unchanged, points to a targeted response rather than a general shift.' },
      { t: 'Heat increased the RNA of every gene', why: 'If every gene had risen, ACTB and GAPDH would have risen too.' },
      { t: 'The heated cells contain more copies of the heat-shock genes in their DNA', why: 'Gene copy number does not change in an hour. Transcription of existing genes increases.' }
    ], answer: 0, explain: 'Reference genes that should not change help separate specific biology from technical effects.' },
  { id: 'f0-014', obj: ['F0.EXPR'], level: 2, lesson: 'f0-expression',
    q: 'What is the transcriptome of a cell?',
    options: [
      { t: 'All the RNA molecules present in the cell at a particular time', why: 'Correct. It changes with cell type and conditions, which is why RNA-seq is informative.' },
      { t: 'All the DNA in the cell', why: 'That is the genome, which is nearly the same in every cell of a person.' },
      { t: 'All the proteins in the cell', why: 'That is the proteome. Protein levels relate to, but differ from, RNA levels.' }
    ], answer: 0, explain: 'Genome = DNA (mostly fixed). Transcriptome = RNA (changes). Proteome = proteins.' },
  { id: 'f0-015', obj: ['F0.EXPR'], level: 3, lesson: 'f0-expression',
    q: 'You want to know which genes help a tumor resist a drug. Which measurement is most directly suited?',
    options: [
      { t: 'Compare RNA levels of all genes in treated tumor cells with untreated ones, using several replicates', why: 'Correct. Changes in expression under the drug, measured with replicates, point to genes involved in the response.' },
      { t: 'Sequence the DNA of one healthy person', why: 'One healthy genome cannot show how tumor cells respond to a drug.' },
      { t: 'Count the number of chromosomes in one tumor cell', why: 'Chromosome counts can matter in cancer, but they do not show which genes respond to the drug.' }
    ], answer: 0, explain: 'Expression comparisons between conditions, with replicates, are the core design of RNA-seq studies.' },
  { id: 'f0-016', obj: ['F0.COMP'], level: 1, lesson: 'f0-computers',
    q: 'What is the difference between a program and a data file?',
    options: [
      { t: 'A program is a set of instructions; a data file holds information that programs read or write', why: 'Correct. For example, a Python script is a program and counts.tsv is data.' },
      { t: 'Programs are always larger than data files', why: 'Size does not define them. A sequencing data file can be far larger than the program that reads it.' },
      { t: 'Data files can only be opened by the person who made them', why: 'Any suitable program can read a data file if it has permission. That is how analyses are shared.' }
    ], answer: 0, explain: 'Keeping instructions (code) and data separate is what makes an analysis repeatable on new data.' },
  { id: 'f0-017', obj: ['F0.COMP'], level: 2, lesson: 'f0-computers',
    q: 'The file `/home/student/project/data/counts.tsv` is inside which folder?',
    options: [
      { t: '/home/student/project/data', why: 'Correct. Everything before the last / is the folder that contains the file.' },
      { t: '/home/student', why: 'That folder contains it indirectly (several levels up). The folder that directly contains it is data.' },
      { t: 'counts', why: 'counts.tsv is the file name; it is not a folder.' }
    ], answer: 0, explain: 'A path lists folders from the top of the tree down, ending with the file name.' },
  { id: 'f0-018', obj: ['F0.COMP'], level: 2, lesson: 'f0-data',
    q: 'In a count table where rows are genes and columns are samples, what is one column?',
    options: [
      { t: 'The counts for every gene in one sample', why: 'Correct. Reading down a column shows one sample\'s measurements.' },
      { t: 'The counts for one gene across every sample', why: 'That is a row. Rows are genes here.' },
      { t: 'The total number of genes in the experiment', why: 'That would be a single number (the number of rows), not a column.' }
    ], answer: 0, explain: 'Always ask: what is a row and what is a column? Different tools use different conventions (single-cell data is often cells by genes).' },
  { id: 'f0-019', obj: ['F0.COMP'], level: 1, lesson: 'f0-data',
    q: 'What does a TSV file use to separate columns?',
    options: [
      { t: 'Tab characters', why: 'Correct. TSV means tab-separated values.' },
      { t: 'Commas', why: 'That is CSV (comma-separated values).' },
      { t: 'Spaces of any length', why: 'Some formats use spaces, but TSV specifically uses a single tab between columns.' }
    ], answer: 0, explain: 'TSV is common in bioinformatics because gene descriptions often contain commas.' },
  { id: 'f0-020', obj: ['F0.COMP'], level: 3, lesson: 'f0-data',
    q: 'Your count table has columns S1 to S6, and a separate sheet says S1 to S3 are controls and S4 to S6 are treated. A colleague accidentally sorted only the second sheet by date. What is the risk?',
    options: [
      { t: 'Sample labels may no longer match the right columns, so controls and treated samples could be mixed up', why: 'Correct. Metadata must stay correctly linked to the data, usually through a shared sample name.' },
      { t: 'No risk, because the counts themselves did not change', why: 'Correct counts with wrong labels lead to wrong comparisons. Mislabelling is a common real-world error.' },
      { t: 'The file format will be damaged and cannot be opened', why: 'Sorting does not damage a file. The danger is silent: wrong labels that still look fine.' }
    ], answer: 0, explain: 'Link tables by an explicit sample name column, never by row order alone.' },
  { id: 'f0-021', obj: ['F0.COMP'], level: 2, lesson: 'f0-computers',
    q: 'A file named `reads.fastq.gz` opens as unreadable symbols in a text editor. What is the most likely reason?',
    options: [
      { t: 'It is compressed and must be decompressed or read with a tool that understands gzip', why: 'Correct. The .gz ending means gzip compression.' },
      { t: 'The sequencing run failed', why: 'A compressed file always looks like unreadable symbols in a plain text editor, even when the data is fine.' },
      { t: 'FASTQ files are always images', why: 'FASTQ is a text format. The .gz compression is what makes it look unreadable.' }
    ], answer: 0, explain: 'Large sequencing files are usually stored compressed to save space.' },
  { id: 'f0-022', obj: ['F0.WHYCOMP'], level: 1, lesson: 'f0-why-code',
    q: 'Which is the strongest reason to analyze data with a script instead of manual spreadsheet steps?',
    options: [
      { t: 'The script records every step, so anyone can rerun and check the analysis', why: 'Correct. Reproducibility is the key benefit.' },
      { t: 'Scripts never contain mistakes', why: 'Scripts can have bugs. The difference is that a script\'s mistakes are written down and can be found and fixed.' },
      { t: 'Spreadsheets cannot do arithmetic', why: 'Spreadsheets can calculate. Their problems are scale, hidden steps and silent changes to data.' }
    ], answer: 0, explain: 'Code is a precise, rerunnable record of an analysis.' },
  { id: 'f0-023', obj: ['F0.WHYCOMP'], level: 2, lesson: 'f0-why-code',
    q: 'Spreadsheet software once converted the gene name SEPT2 into a date. What does this example teach?',
    options: [
      { t: 'Tools can silently change data, so analyses should read files as plain text and be checked', why: 'Correct. This real problem affected many published gene lists and even led to genes being renamed.' },
      { t: 'Gene names should never contain letters', why: 'Gene names are standardized and contain letters. The problem was software reformatting them.' },
      { t: 'Dates and genes are the same kind of data', why: 'They are different. The software guessed wrongly that the text was a date.' }
    ], answer: 0, explain: 'Silent data changes are dangerous because nothing warns you. Scripts that read text exactly avoid this.' },
  { id: 'f0-024', obj: ['F0.WHYCOMP'], level: 3, lesson: 'f0-discovery',
    q: 'Put these steps of an RNA-seq study in a sensible order: (a) count reads per gene, (b) compare conditions with statistics, (c) design the experiment with replicates, (d) sequence RNA, (e) interpret and confirm key genes.',
    options: [
      { t: 'c, d, a, b, e', why: 'Correct. Design, measure, process, test, then interpret and confirm.' },
      { t: 'd, c, a, b, e', why: 'The design (including replicates) must be decided before sequencing. It cannot be fixed afterwards.' },
      { t: 'c, d, b, a, e', why: 'Statistics need counts as input, so counting comes before comparison.' },
      { t: 'c, d, a, e, b', why: 'Interpretation should rest on the statistical comparison, not come before it.' }
    ], answer: 0, explain: 'Each step feeds the next; skipping or reordering steps breaks the chain of evidence.' },
  { id: 'f0-025', obj: ['F0.WHYCOMP'], level: 2, lesson: 'f0-discovery',
    q: 'In a typical RNA-seq project, which skill is mainly used to process millions of reads on a remote server?',
    options: [
      { t: 'The Linux command line and shell scripts', why: 'Correct. Sequencing data usually lives on Linux servers, where commands and scripts process it.' },
      { t: 'Reading the genetic code by hand', why: 'The genetic code explains biology; it is not a way to process files.' },
      { t: 'Choosing the color scheme of a plot', why: 'Plot design matters for communication, but not for processing raw reads.' }
    ], answer: 0, explain: 'Linux for files and pipelines, Python or R for analysis, statistics for deciding what to trust.' },
  { id: 'f0-026', obj: ['F0.WHYCOMP', 'F0.EXPR'], level: 3, lesson: 'f0-discovery',
    q: 'A heat-shock RNA-seq analysis finds HSPA1A strongly increased. Which statement correctly describes what this result is?',
    options: [
      { t: 'Evidence that HSPA1A RNA increased in these cells under these conditions, which supports, but does not prove, a biological role', why: 'Correct. It states what was measured and where, and leaves room for confirmation.' },
      { t: 'Proof that HSPA1A protects every human from heat stroke', why: 'The experiment measured RNA in cultured cells. Claims about people need very different evidence.' },
      { t: 'A meaningless number, because computers cannot measure biology', why: 'The number summarizes real measurements. It needs careful interpretation, not dismissal.' }
    ], answer: 0, explain: 'Good interpretation states the measurement, the system and the limits.' },
  { id: 'f0-027', obj: ['F0.BIOINF'], level: 2, lesson: 'f0-cells-dna',
    q: 'The human genome has about 3.1 billion base pairs but only about 20,000 protein-coding genes. What does that tell you?',
    options: [
      { t: 'Most of the genome does not code for protein', why: 'Correct. Protein-coding sequence is roughly 1 to 2 percent; much of the rest regulates genes, makes non-coding RNA, or is still being studied.' },
      { t: 'Each gene is about 155,000 base pairs of coding sequence', why: 'Dividing the genome by the gene count assumes all DNA codes for protein, which is not true.' },
      { t: 'Some genes must be counted twice', why: 'Gene counts are not inflated this way; the genome simply contains much more than coding sequence.' }
    ], answer: 0, explain: 'Genome size and gene number are different measures.' }
);
