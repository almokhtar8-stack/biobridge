/* Foundation 0: Starting from absolute zero. Written to tools/CONTENT_GUIDE.md. */
window.BB = window.BB || {};
BB.lessons = BB.lessons || [];

BB.lessons.push({
  id: "f0-bioinformatics",
  what: "Bioinformatics is the use of computers, programming and statistics to store, analyze and make sense of biological data, especially the very large datasets produced by reading DNA and RNA.",
  problem: "Modern instruments produce far more data than any person can read. A single sequencing run can produce hundreds of millions of short DNA or RNA sequences. Biologists needed reliable ways to organize, search and compare that data, and to separate real biological signals from noise.",
  care: "Cancer research, infectious disease tracking, plant breeding and drug development all depend on this kind of data now. Learning the foundations lets you ask questions of the data yourself.",
  steps: [
    "Start with a biological question, for example: which genes do human cells switch on when they get too hot?",
    "Measure something with an instrument, such as a sequencer that reads the RNA molecules in each sample.",
    "Use computers to organize the raw output: check its quality, work out which gene each sequence came from, and count.",
    "Use statistics to decide which differences are larger than you would expect from chance and measurement noise.",
    "Interpret the result biologically, then design the next experiment to test it."
  ],
  deeper: "Bioinformatics overlaps with computational biology. A common distinction is that bioinformatics focuses on building and applying tools and data resources, while computational biology focuses on answering biological questions with models. In practice the two words are often used interchangeably.",
  show: {
    intro: "Here is a tiny piece of this site's main example: how many RNA sequences (reads) from two genes were found in six samples of human cells.",
    lang: "tsv",
    code: "gene\tctrl_1\tctrl_2\tctrl_3\theat_1\theat_2\theat_3\nHSPA1A\t212\t282\t203\t11018\t8441\t10838\nACTB\t44289\t46223\t46941\t55945\t39466\t49070",
    notes: [
      "Each row is a gene. Each column is a sample: three grown at 37 C (ctrl) and three heated to 42 C for one hour (heat).",
      "HSPA1A jumps from about 200 to about 10,000 reads after heating, while ACTB barely changes. Finding patterns like this among roughly 20,000 genes is a bioinformatics task.",
      "Raw numbers are not the final answer: the samples were sequenced to different depths, so they must be compared fairly first. Foundation 3 shows how."
    ]
  },
  pitfall: {
    wrong: "Bioinformatics is mainly about computers, so biology knowledge is optional.",
    right: "Code tells you what is in the data; biology tells you what it means and whether it makes sense. An analysis that ignores the biology can be precise and still confidently wrong."
  },
  try: {
    kind: "predict",
    q: "Look at the table in Show me. Which gene responds to heat?",
    options: [
      { t: "HSPA1A", why: "Right. Its counts rise roughly 40-fold in every heated sample while ACTB stays similar, so the change is specific to HSPA1A rather than to the whole sample." },
      { t: "ACTB", why: "ACTB has the bigger numbers, but its values are similar before and after heating. A response means a change between conditions, not a large value." },
      { t: "Both genes equally", why: "ACTB goes from about 45,000 to about 48,000 on average, a small change, while HSPA1A rises about 40-fold. Compare the change, not just whether numbers differ at all." }
    ],
    answer: 0
  },
  check: [
    {
      q: "Which task is the best example of bioinformatics?",
      options: [
        { t: "Writing a program that counts how many sequencing reads came from each gene in 12 samples", why: "Correct. It uses computation to turn raw biological data into numbers that can be compared, which is a core bioinformatics task." },
        { t: "Looking at a stained tissue section under a microscope", why: "That is valuable biology, but it is direct observation. It becomes bioinformatics-like only when software is used to measure many images systematically." },
        { t: "Repairing a broken laptop in a biology lab", why: "Bioinformatics uses computers, but it is defined by analyzing biological data, not by working with computer hardware." }
      ],
      answer: 0
    },
    {
      q: "A program reports that 300 genes changed after a drug treatment. What should a careful bioinformatician do next?",
      options: [
        { t: "Publish the list right away, because computers do not make mistakes", why: "Computers follow instructions exactly, including wrong ones. Poor-quality samples, swapped labels or an unsuitable test all produce confident but wrong lists." },
        { t: "Check data quality and whether the changes make biological sense, then plan experiments to confirm key genes", why: "Correct. A computational result is evidence to be checked and tested, not a final answer." },
        { t: "Ignore the list, because only laboratory experiments can be trusted", why: "Computational results are real evidence and often point to the right genes. The sensible move is to check them and then test the strongest findings." }
      ],
      answer: 1
    }
  ],
  real: "When SARS-CoV-2 emerged, its genome was sequenced and shared within weeks, and bioinformatics has since tracked new variants by comparing millions of virus genomes. In cancer research, the same skills find genes that are switched on or off in tumors compared with healthy tissue. The heat-shock example in this site is a small version of that kind of analysis.",
  teach: {
    prompt: "Explain to a friend what bioinformatics is, using the heat-shock example. Mention the question, the data and why computers are needed.",
    points: ["It uses computers and statistics to analyze biological data", "It starts with a biological question and ends with a biological interpretation", "The data are too large and noisy to analyze by hand", "Results must be checked, not trusted blindly"]
  }
});

BB.lessons.push({
  id: "f0-cells-dna",
  what: "Cells are the smallest living units. Most human cells contain DNA, a long molecule that stores instructions as a sequence of four chemical letters: A, C, G and T. A gene is a stretch of DNA that can be used to make a product the cell needs, usually a protein or a working RNA molecule.",
  problem: "Living things need a stable way to store the instructions for building and running cells, and to copy them accurately every time a cell divides. DNA does both: it is chemically stable, it can be copied letter by letter, and its letters can be read to make other molecules.",
  care: "Almost all bioinformatics data is DNA sequence, RNA sequence, or measurements about genes. Once you know what a gene is, the files and tables in later lessons make sense.",
  steps: [
    "DNA has two strands twisted into a double helix. Each strand is a chain of building blocks called nucleotides, and each nucleotide carries one base: A, C, G or T.",
    "The strands pair by a fixed rule: A pairs with T, and C pairs with G. So if you know one strand, you can work out the other. This is called complementarity.",
    "All the DNA of an organism is its genome. One copy of the human genome has about 3.1 billion base pairs, split into 23 chromosomes. Most human cells keep two copies, one from each parent, so 23 pairs, inside the cell nucleus.",
    "Genes are particular regions of the genome. Humans have about 20,000 protein-coding genes, plus thousands of genes that make RNA molecules that are never turned into protein.",
    "Only about 1 to 2 percent of the human genome codes for protein. The rest includes regions that control when and where genes are used, repeated sequences, and DNA whose function, if any, is still being studied."
  ],
  deeper: "Each DNA strand has a direction, labelled 5' (five prime) and 3' (three prime) after the chemistry of its ends. The two strands run in opposite directions. By convention, sequences are written from 5' to 3', so a file usually stores one strand and software works out the other when needed.",
  show: {
    intro: "Here is a short piece of double-stranded DNA, with the pairing drawn in.",
    lang: "text",
    code: "5'-ATGGCCAAATTTGGG-3'   one strand\n   |||||||||||||||\n3'-TACCGGTTTAAACCC-5'   the complementary strand",
    notes: [
      "Every A faces a T and every C faces a G.",
      "The strands run in opposite directions, which is why one is labelled 5' to 3' and the other 3' to 5'.",
      "Sequence files normally store just one strand, written 5' to 3'. Because of the pairing rule, nothing is lost."
    ]
  },
  pitfall: {
    wrong: "Different cells in my body have different DNA. That is why a nerve cell looks different from a skin cell.",
    right: "Almost every cell in one person carries essentially the same genome. Cells differ because they use different genes. That idea, gene expression, is two lessons ahead, and it is exactly what RNA-seq measures."
  },
  try: {
    kind: "predict",
    q: "One DNA strand reads 5'-GATTACA-3'. Which strand pairs with it, written directly underneath it?",
    options: [
      { t: "3'-CTAATGT-5'", why: "Right. Apply the rule letter by letter: G-C, A-T, T-A, T-A, A-T, C-G, A-T. The partner strand runs in the opposite direction, so it is labelled 3' to 5'." },
      { t: "3'-GATTACA-5'", why: "This copies the same letters. Pairing is complementary, so each base needs its partner: A with T and C with G." },
      { t: "3'-CUAAUGU-5'", why: "U (uracil) is used in RNA, not DNA. A DNA partner strand uses T." }
    ],
    answer: 0
  },
  check: [
    {
      q: "In double-stranded DNA, which bases pair with each other?",
      options: [
        { t: "A with T, and C with G", why: "Correct. These pairs fit together and are held by hydrogen bonds, which is why one strand determines the other." },
        { t: "A with G, and C with T", why: "These combinations do not fit together in the double helix. The pairing rule is strict: A only with T, and C only with G." },
        { t: "Any base can pair with any other", why: "If pairing were random, one strand would not determine the other, and DNA could not be copied accurately before cell division." }
      ],
      answer: 0
    },
    {
      q: "About how much of the human genome codes for proteins?",
      options: [
        { t: "About 1 to 2 percent", why: "Correct. Protein-coding regions are a small part of the genome. The rest includes regulatory regions, RNA genes, repeated sequences and DNA whose function is still being studied." },
        { t: "About half", why: "This is a common guess, but protein-coding sequence is far smaller. It matters later: most RNA-seq reads come from a small, gene-rich part of a very large genome." },
        { t: "Almost all of it", why: "Most of the genome does not code for protein. If it did, the genome would contain many more genes than the roughly 20,000 protein-coding genes found." }
      ],
      answer: 0
    }
  ],
  real: "Every sequencing file you will meet stores DNA or RNA as strings of these letters. Because of complementarity, a short read from either strand can be matched back to the reference genome, which is exactly what alignment software does in an RNA-seq analysis.",
  teach: {
    prompt: "Explain what DNA, a genome and a gene are, and how the two strands of DNA relate to each other.",
    points: ["DNA stores information as a sequence of A, C, G and T", "The strands are complementary: A pairs with T, C with G", "A genome is all of an organism's DNA; a gene is a region that can produce RNA or protein", "Only a small part of the human genome codes for protein"]
  }
});

BB.lessons.push({
  id: "f0-dogma",
  what: "Cells read genes in two main steps. Transcription copies a gene's DNA into RNA. Translation reads that RNA three letters at a time to build a protein. This flow of information, DNA to RNA to protein, is often called the central dogma of molecular biology.",
  problem: "DNA must stay protected in the nucleus, but proteins are built in the cytoplasm, and a cell needs many copies of some proteins and very few of others. Temporary RNA copies solve both problems: the master copy stays safe, and the number of RNA copies helps control how much of each product is made.",
  care: "RNA-seq, the main technique in this course, counts RNA molecules. Because RNA is the working copy of a gene, counting RNA tells you which genes a cell is using and how strongly.",
  steps: [
    "Transcription: an enzyme called RNA polymerase reads one DNA strand (the template strand) and builds an RNA molecule that is complementary to it.",
    "The new RNA has the same sequence as the other DNA strand (the coding strand), except that RNA uses U (uracil) where DNA has T.",
    "In human cells the RNA is then processed: segments called introns are cut out (splicing), a protective cap is added at the front and a tail of many A bases (the poly-A tail) at the end, and the finished messenger RNA (mRNA) moves out of the nucleus.",
    "Translation: a ribosome reads the mRNA in groups of three letters called codons. It starts at a start codon (AUG) and stops at a stop codon (UAA, UAG or UGA). Every codon from the start codon onward specifies one amino acid, until the stop codon is reached.",
    "The chain of amino acids folds into a protein, which then does a job in the cell."
  ],
  deeper: "There are 64 possible codons but only 20 standard amino acids, so most amino acids have several codons. This redundancy is why some DNA changes do not alter the protein at all (silent changes). Not every gene makes protein: some produce working RNA molecules, such as the ribosomal RNA that forms part of the ribosome itself.",
  show: {
    intro: "Follow one short gene from DNA to protein.",
    lang: "text",
    code: "DNA coding strand  5'-ATG GCC AAA TTT GGG TAA-3'\nmRNA               5'-AUG GCC AAA UUU GGG UAA-3'\nProtein               Met-Ala-Lys-Phe-Gly (stop)",
    notes: [
      "The mRNA matches the coding strand letter for letter, with U in place of T. (The template strand is the one that was actually read.)",
      "Read three letters at a time: AUG = methionine (Met, the start), GCC = alanine, AAA = lysine, UUU = phenylalanine, GGG = glycine, UAA = stop.",
      "The stop codon adds no amino acid. It tells the ribosome to release the finished chain."
    ]
  },
  pitfall: {
    wrong: "Every gene makes a protein, and the amount of RNA always equals the amount of protein.",
    right: "Some genes make RNA that works without being translated. And cells also regulate translation and protein breakdown, so RNA levels and protein levels are related but not identical. RNA-seq measures RNA, not protein."
  },
  try: { kind: "widget", widget: "dogma" },
  check: [
    {
      q: "A DNA coding strand reads 5'-ATGCTT-3'. What is the mRNA?",
      options: [
        { t: "5'-AUGCUU-3'", why: "Correct. mRNA has the coding strand's sequence with every T replaced by U." },
        { t: "5'-TACGAA-3'", why: "That is the letter-by-letter DNA complement. mRNA matches the coding strand, not its partner, and RNA uses U rather than T." },
        { t: "5'-UACGAA-3'", why: "This takes the complement and swaps in U. It mixes up the strands: the RNA is built from the template strand, so it ends up matching the coding strand." }
      ],
      answer: 0
    },
    {
      q: "One letter changes so that the codon GCC (alanine) becomes GCA. GCA also codes for alanine. What happens to the protein?",
      options: [
        { t: "Nothing changes: this is a silent change", why: "Correct. Several codons code for the same amino acid, so this change leaves the protein sequence identical." },
        { t: "The protein becomes one amino acid shorter", why: "A protein gets shorter when a change creates an early stop codon or deletes letters. Swapping GCC for GCA does neither." },
        { t: "Every amino acid after this point is scrambled", why: "Scrambling everything downstream happens when letters are inserted or deleted and the reading frame shifts. A single substitution affects at most one codon." }
      ],
      answer: 0
    },
    {
      q: "Why can counting RNA molecules tell us which genes a cell is using?",
      options: [
        { t: "Cells make RNA copies of the genes they are actively using, so more RNA usually means a more active gene", why: "Correct. The word usually matters: RNA level is a strong but imperfect proxy for protein activity." },
        { t: "Using a gene changes its DNA sequence, and RNA-seq detects that change", why: "Using a gene does not change its DNA sequence. Transcription reads the DNA and leaves it unchanged; RNA-seq counts the RNA copies." },
        { t: "RNA levels always equal protein levels, so RNA is a direct protein measurement", why: "RNA and protein levels are related but not identical, because translation and protein breakdown are regulated separately." }
      ],
      answer: 0
    }
  ],
  real: "When a read from an RNA-seq experiment is matched to a gene, it is evidence that the gene was transcribed in that sample. Variant-analysis tools use the same codon table you just used to predict whether a DNA change alters a protein, for example in inherited disease or cancer.",
  teach: {
    prompt: "Explain transcription and translation to a friend, using the words template strand, mRNA, codon and protein.",
    points: ["Transcription copies DNA into RNA, with U instead of T", "Translation reads mRNA three letters (one codon) at a time", "AUG starts translation and a stop codon ends it", "Some genes make working RNA rather than protein"]
  }
});

BB.lessons.push({
  id: "f0-expression",
  what: "Gene expression is the process of using a gene to make its RNA and, for protein-coding genes, its protein. A gene that is being actively transcribed is said to be expressed. Cells with the same DNA can express very different sets of genes.",
  problem: "A liver cell and a nerve cell carry the same genome but do completely different jobs. Cells also have to respond to change, such as heat, infection or a drug. Gene expression explains both: cells control which genes they use, and how strongly.",
  care: "Measuring gene expression is one of the most common goals in bioinformatics. It answers questions such as: what makes this cell type unique, and what changed in this disease or after this treatment?",
  steps: [
    "Proteins called transcription factors bind DNA near genes and turn transcription up or down.",
    "Signals from inside or outside the cell, such as a hormone, a temperature change or an infection, change which transcription factors are active.",
    "As a result, some genes produce many RNA copies and others produce few or none. The full set of RNA molecules in a cell at one moment is called its transcriptome.",
    "Cell types keep stable long-term patterns (a liver cell keeps making albumin), while responses to conditions can change within minutes to hours (heat switches on heat-shock genes)."
  ],
  deeper: "In the heat-shock response, a transcription factor called HSF1 becomes active when proteins start to unfold, and it switches on genes for chaperones, proteins that help other proteins fold correctly. Expression is also controlled after transcription: by how fast RNA is broken down, how efficiently it is translated and how long the protein lasts. RNA-seq captures the RNA level only.",
  show: {
    intro: "An illustrative on and off pattern for three genes in two cell types from the same person.",
    lang: "text",
    code: "gene     what it makes                         liver cell   nerve cell\nACTB     actin, part of the cell skeleton      on           on\nALB      albumin, a major blood protein        on (high)    off\nSNAP25   a protein for releasing signals       off          on",
    notes: [
      "Both cells contain all three genes in their DNA.",
      "ACTB is used by almost every cell, so it is on in both.",
      "ALB and SNAP25 are switched on only in the cell type that needs them. That difference in expression, not a difference in DNA, is what makes the two cells different."
    ]
  },
  pitfall: {
    wrong: "If a gene is not expressed in a cell, that cell must have lost the gene.",
    right: "The gene is still in the DNA. It is simply not being transcribed in that cell at that time, and under other conditions it can be switched on."
  },
  try: { kind: "widget", widget: "expression" },
  check: [
    {
      q: "A muscle cell and a skin cell from the same person are compared. Which statement is most accurate?",
      options: [
        { t: "They have essentially the same DNA but express different genes", why: "Correct. Cell identity comes from which genes are expressed, not from different genomes." },
        { t: "They have different DNA, which explains their different shapes", why: "This is the most common misconception. Nearly all cells in one body share the same genome; they use it differently." },
        { t: "They express exactly the same genes, just at different speeds", why: "Many genes are completely off in one cell type and on in the other, for example muscle contraction genes. It is not only a matter of speed." }
      ],
      answer: 0
    },
    {
      q: "Cells are moved from 37 C to 42 C. Within an hour, RNA from HSPA1A rises about 40-fold, while ACTB and GAPDH stay flat. What is the best explanation?",
      options: [
        { t: "Heat activates a transcription factor that switches on chaperone genes such as HSPA1A", why: "Correct. This is the heat-shock response: HSF1 drives transcription of genes whose proteins help refold damaged proteins." },
        { t: "Heat made extra copies of the HSPA1A gene in the DNA", why: "The number of gene copies in the DNA does not change within an hour. What increases is transcription, the number of RNA copies made from the same gene." },
        { t: "Heat destroyed RNA from all other genes, so HSPA1A only looks higher", why: "If heat had wiped out other RNAs, ACTB and GAPDH would have dropped too. Their flat counts point to a specific increase in HSPA1A." }
      ],
      answer: 0
    }
  ],
  real: "RNA-seq turns gene expression into numbers: how many RNA molecules from each gene were detected in each sample. Single-cell RNA-seq does this for thousands of individual cells, so researchers can identify cell types by their expression patterns, like the blood immune cells you will explore in Foundation 3.",
  teach: {
    prompt: "Explain how two cells with the same DNA can behave differently, and how heat changes gene expression.",
    points: ["Same genome, different genes switched on", "Transcription factors and signals control expression", "Expression can change quickly in response to conditions such as heat", "RNA-seq measures expression at the RNA level"]
  }
});

BB.lessons.push({
  id: "f0-computers",
  what: "A computer follows instructions to process data. A program is a set of instructions written by people. A file is a named piece of stored data, and folders (also called directories) organize files into a tree.",
  problem: "Data and instructions must be stored somewhere, found again later, and passed between programs. Files and folders give every piece of data a name and a place, so both people and programs can find it.",
  care: "A large share of beginner frustration in bioinformatics is not biology or statistics but \"file not found\". Knowing where files live and what is inside them removes that obstacle early.",
  steps: [
    "The processor (CPU) carries out instructions very fast. Memory (RAM) holds what is being worked on right now. Storage (a disk) keeps files when the power is off.",
    "A program reads input, often from files, processes it, and writes output to the screen or to new files.",
    "Each file has a name, usually with an extension that hints at its format, such as `.txt`, `.tsv`, `.fa` or `.py`.",
    "Text files contain characters you can read: DNA letters, numbers, code. Binary files, such as images or compressed archives, need a specific program to read them.",
    "Folders contain files and other folders, forming a tree. A file's location in the tree is written as a path, such as `/home/student/project/data/counts.tsv`."
  ],
  deeper: "Extensions are only labels. Renaming `counts.tsv` to `counts.png` does not turn it into an image; the content stays text. Programs decide how to read a file from its content and from what you tell them, which is why careful naming habits prevent mistakes.",
  show: {
    intro: "This is the folder tree of the practice project used throughout BioBridge.",
    lang: "text",
    code: "/home/student\n├── notes.txt\n└── project\n    ├── README.txt\n    ├── data\n    │   ├── annotation.tsv\n    │   ├── counts.tsv\n    │   ├── reads.fastq\n    │   ├── samples.tsv\n    │   └── sequences.fa\n    ├── results\n    └── scripts\n        ├── count_seqs.sh\n        └── line_report.sh",
    notes: [
      "`/home/student` is the home folder of the user called student.",
      "`project` holds three folders: `data` for input files, `scripts` for programs and `results` for output.",
      "The path to the count table is `/home/student/project/data/counts.tsv`. Each `/` goes one level deeper into the tree."
    ]
  },
  pitfall: {
    wrong: "If a file opens as gibberish, the file must be broken.",
    right: "It may be a binary or compressed file, or a text file opened in the wrong program. Many large sequencing files are compressed (for example `reads.fastq.gz`) and must be read with a tool that understands compression."
  },
  try: { kind: "widget", widget: "filetree" },
  check: [
    {
      q: "Which of these is a path?",
      options: [
        { t: "/home/student/project/data/counts.tsv", why: "Correct. It names every folder from the top of the tree down to the file, so it tells you exactly where the file is." },
        { t: "tab-separated values", why: "That describes the file's format, not where the file is stored." },
        { t: "13 lines and 7 columns", why: "That describes the file's contents. A path describes its location." }
      ],
      answer: 0
    },
    {
      q: "A file is named `reads.fastq.gz`. What does the `.gz` ending most likely tell you?",
      options: [
        { t: "It is compressed, so it must be decompressed or read with a tool that understands compression", why: "Correct. `.gz` marks gzip compression, which is very common for large sequencing files." },
        { t: "It is a picture of the reads", why: "Image files use endings such as `.png` or `.jpg`. `.gz` indicates compression." },
        { t: "It is a program you can run", why: "Scripts often end in `.sh` or `.py` (many programs have no ending at all), and whether something can run depends on its permissions, not on its name." }
      ],
      answer: 0
    },
    {
      q: "A program reads `counts.tsv`, adds up each column and saves the totals as `totals.tsv`. Which statement is true?",
      options: [
        { t: "`counts.tsv` is the input and `totals.tsv` is the output", why: "Correct. The program reads one file and writes another. Keeping the raw input unchanged means the analysis can be rerun." },
        { t: "Both files are programs", why: "Both are data files. The program is the separate set of instructions that reads one and writes the other." },
        { t: "`counts.tsv` is turned into `totals.tsv`, so `counts.tsv` no longer exists", why: "Reading a file does not delete it. Good practice is to never overwrite raw data." }
      ],
      answer: 0
    }
  ],
  real: "A real RNA-seq project can contain hundreds of files: raw reads for every sample, reference genome files, intermediate results and final tables. Researchers keep raw data unchanged, put each kind of file in a predictable folder and use clear names, so that both people and scripts can find everything.",
  teach: {
    prompt: "Explain the difference between a program and a data file, and what a path is.",
    points: ["A program is a set of instructions; a data file is information it reads or writes", "Files live in folders that form a tree", "A path describes where a file is in that tree", "Compressed or binary files need the right tool to read"]
  }
});

BB.lessons.push({
  id: "f0-data",
  what: "A dataset is a collection of related measurements organized so it can be analyzed. Most biological datasets are tables: each row is one thing that was measured (a gene, a cell, a patient) and each column is one variable or one sample.",
  problem: "Measurements are only useful if you know what each number refers to. Without structure and labels, a pile of numbers cannot be compared, filtered or reused, by you or by anyone else.",
  care: "Every analysis in this course starts by opening a table and asking: what is a row, what is a column, and what does one number mean? Getting this right prevents most beginner mistakes.",
  steps: [
    "Decide what one row represents (in a count table, one gene) and what one column represents (one sample).",
    "Store the table as plain text. CSV files separate columns with commas; TSV files separate them with tab characters. The first line is usually a header with the column names.",
    "Keep metadata, the information about each sample such as condition, replicate and date, in a separate table that uses the same sample names.",
    "Link the tables by sample name. That is how you can compare, for example, all control samples with all heat-shock samples."
  ],
  deeper: "A useful rule from data science, often called tidy data, is: each variable forms a column, each observation forms a row, and each kind of thing measured gets its own table. Count matrices are a common exception: they are wide tables with genes as rows and samples as columns, because that layout suits the analysis tools.",
  show: {
    intro: "This is `samples.tsv`, the metadata table for the heat-shock experiment.",
    lang: "tsv",
    code: "sample\tcondition\treplicate\ttemperature_C\nctrl_1\tcontrol\t1\t37\nctrl_2\tcontrol\t2\t37\nctrl_3\tcontrol\t3\t37\nheat_1\theat_shock\t1\t42\nheat_2\theat_shock\t2\t42\nheat_3\theat_shock\t3\t42",
    notes: [
      "Each row describes one sample, and the header names the four columns.",
      "The sample names are the same as the column names in `counts.tsv`. That shared name links the two tables.",
      "Without this table, nobody could tell which columns of the count table are controls and which were heated."
    ]
  },
  pitfall: {
    wrong: "The numbers are what matter; labels and metadata are optional extras.",
    right: "Mislabelled or missing sample information is one of the most common causes of wrong conclusions in genomics. Metadata is part of the data."
  },
  try: { kind: "widget", widget: "datatable" },
  check: [
    {
      q: "In `counts.tsv`, rows are genes and columns are samples. What does the number in row HSPA6, column heat_2 mean?",
      options: [
        { t: "How many sequencing reads from sample heat_2 were assigned to HSPA6", why: "Correct. One cell of a count matrix is one gene in one sample." },
        { t: "The temperature of sample heat_2", why: "Temperature is a property of the sample, so it lives in the metadata table, `samples.tsv`, not in the count table." },
        { t: "How many genes were detected in heat_2", why: "That would be a summary of a whole column. A single cell refers to one gene and one sample." }
      ],
      answer: 0
    },
    {
      q: "You receive a count table with columns ctrl_1, ctrl_2, heat_1, heat_2, but no information about what \"heat\" means or how the samples were collected. What is the main problem?",
      options: [
        { t: "Missing metadata: you cannot interpret or fairly compare the samples without knowing how they differ", why: "Correct. You need to know the conditions, and ideally the batches and dates, before any comparison is meaningful." },
        { t: "There is no problem, because the column names are enough", why: "Names are short labels. They do not say what temperature, how long, or whether samples were processed on different days, all of which affect interpretation." },
        { t: "The format is wrong, because tables must be CSV rather than TSV", why: "Both CSV and TSV are fine. The problem is missing information, not the separator." }
      ],
      answer: 0
    }
  ],
  real: "Public repositories such as the Gene Expression Omnibus (GEO) store thousands of RNA-seq datasets as count tables plus sample metadata, and reusing them depends entirely on good labels. The KAUST course's RNA-seq case study also works from count data organized like this.",
  teach: {
    prompt: "Explain what a row, a column and metadata are, using `counts.tsv` and `samples.tsv`.",
    points: ["A row is one gene; a column is one sample", "Each number is a count for one gene in one sample", "Metadata describes the samples", "Shared sample names link the tables"]
  }
});

BB.lessons.push({
  id: "f0-why-code",
  what: "Code is a written set of instructions that a computer follows exactly. Biologists write code to process data that is too large, too repetitive or too error-prone to handle by hand, and to make their analysis repeatable.",
  problem: "One RNA-seq experiment can produce tens of millions of reads per sample. Counting, filtering and comparing them by hand is impossible, and clicking through spreadsheet software cannot be repeated exactly or checked by someone else.",
  care: "You do not need to become a software engineer. A few dozen lines of Python, R or shell commands can answer real questions, and every line is a record of exactly what you did.",
  steps: [
    "Scale: computers process millions of lines per second, so a task that would take years by hand finishes in minutes.",
    "Repetition: once a step is written as code, it runs the same way on 6 samples or 600.",
    "Reproducibility: the code documents every decision (which samples, which filter, which test), so you and others can rerun and check it.",
    "Fewer silent errors: copying and pasting between files introduces mistakes, and scripts do not get tired. Scripts can still contain bugs, which is why you test them on small examples first."
  ],
  deeper: "A well-known example of silent errors: spreadsheet software automatically converted some gene names into dates (SEPT2 became \"2-Sep\"). A 2016 study found such errors in roughly one in five published papers that shared gene lists as spreadsheets, and in 2020 the human gene naming committee renamed several genes partly to stop it happening. Code that reads files as plain text avoids this kind of change.",
  show: {
    intro: "Five lines of Python compute the average HSPA1A count in each condition. The same approach works just as well for 600 samples.",
    lang: "python",
    code: "hspa1a = [212, 282, 203, 11018, 8441, 10838]\ncontrol = hspa1a[:3]\nheat = hspa1a[3:]\nprint(\"control mean:\", round(sum(control) / len(control), 1))\nprint(\"heat mean:\", round(sum(heat) / len(heat), 1))",
    output: "control mean: 232.3\nheat mean: 10099.0",
    notes: [
      "Line 1 stores the six counts in a list. Lines 2 and 3 split it into the first three (control) and last three (heat) values.",
      "`sum(...) / len(...)` is the average; `round(..., 1)` keeps one decimal place.",
      "You do not need to understand every symbol yet. Notice that each step is written down, so anyone can rerun it and get the same answer."
    ],
    run: true
  },
  pitfall: {
    wrong: "Spreadsheets are enough; code is only for computer scientists.",
    right: "Spreadsheets are fine for looking at small tables, but they struggle with millions of rows, hide the steps you took and can silently change data. Code makes every step visible and repeatable."
  },
  try: { kind: "widget", widget: "scale" },
  check: [
    {
      q: "Why is a script better than doing the same steps by clicking in a spreadsheet?",
      options: [
        { t: "The script records every step, so the analysis can be rerun and checked exactly", why: "Correct. Repeatability and a written record are the main advantages." },
        { t: "Scripts are always faster to write than clicking", why: "For a tiny one-off task, clicking can be quicker. The advantage of code is repeatability and scale, not that it is always quicker to write." },
        { t: "Scripts cannot contain mistakes", why: "Scripts can contain bugs. The difference is that a bug in code is visible and can be found, fixed and rerun." }
      ],
      answer: 0
    },
    {
      q: "A researcher analyzed 6 samples with a script. A month later, 60 new samples arrive. What is the main advantage of having used code?",
      options: [
        { t: "The new samples will not need quality checks", why: "New samples always need quality checks. A script makes those checks easier to repeat, but it does not make them unnecessary." },
        { t: "The same script can process all 66 samples in exactly the same way", why: "Correct. Consistent processing is essential for a fair comparison between old and new samples." },
        { t: "The script guarantees the new samples will show the same result", why: "Code controls the analysis, not the biology. New samples can and sometimes should give different results." }
      ],
      answer: 1
    }
  ],
  real: "Large projects such as The Cancer Genome Atlas analyzed thousands of tumor samples with shared, documented pipelines. Many journals now ask authors to share their analysis code so that others can reproduce the results.",
  teach: {
    prompt: "Give three reasons why biologists write code instead of analyzing data by hand, and one limitation of code.",
    points: ["Scale: millions of data points", "Repetition: the same steps on many samples", "Reproducibility: code documents every step", "Code can still have bugs, so it must be tested"]
  }
});

BB.lessons.push({
  id: "f0-discovery",
  what: "A bioinformatics project is a chain of steps that turns a biological question into evidence. Each foundation in BioBridge (biology, Linux, Python, R and statistics) supplies one or more links in that chain.",
  problem: "Beginners often learn tools one at a time and cannot see why they matter. Seeing the whole chain first shows where each skill fits, and why each step must be done carefully for the final answer to be trustworthy.",
  care: "When a later lesson feels abstract (paths, loops, p-values), come back to this map to see exactly where it is used.",
  steps: [
    "Question: do heat-shocked human cells switch on particular genes? Prediction: chaperone genes go up.",
    "Experiment: grow cells at 37 C and at 42 C, with three independent cultures each, then extract and sequence their RNA. Output: millions of reads per sample, stored in FASTQ files.",
    "Processing, usually on a Linux server with scripts: check read quality, match reads to genes and count them. Output: a count matrix of genes by samples.",
    "Analysis in R or Python with statistics: adjust for different sequencing depths, compare the conditions, account for variation between replicates and correct for testing thousands of genes. Output: each gene's fold change and adjusted p-value.",
    "Interpretation: HSPA1A, HSPA1B, DNAJB1 and other chaperone genes rise strongly while ACTB and GAPDH stay flat, which fits the known heat-shock response. Next: confirm key genes with an independent method and ask the next question."
  ],
  deeper: "Real projects loop back. A surprising result sends you back to check data quality or sample labels, and an interesting gene suggests a new experiment. Bioinformatics is part of an iterative scientific cycle, not a one-way conveyor belt.",
  show: {
    intro: "The heat-shock project as a chain, where each line is the output of the line above it.",
    lang: "text",
    code: "question     Which genes respond to heat?\nsamples      6 cultures: 3 at 37 C, 3 at 42 C\nreads        FASTQ files, millions of reads per sample\ncounts       one row per gene, one column per sample\nstatistics   normalize, compare, correct for many tests\nresult       HSPA1A: log2 fold change +5.27, adjusted p = 0.0035\nmeaning      heat switches on protein-folding helpers (chaperones)",
    notes: [
      "A log2 fold change of +5.27 means about 38 times more RNA after heat shock, because 2 to the power 5.27 is about 38.",
      "The adjusted p-value says a difference this large would be very unlikely from noise alone, even after accounting for the many genes tested. Foundation 3 explains both numbers.",
      "The last line is biology, not statistics: it connects the numbers to what heat does to proteins."
    ]
  },
  pitfall: {
    wrong: "Once the computer produces a list of significant genes, the discovery is finished.",
    right: "A gene list is a set of hypotheses supported by statistics. It still needs quality checks, biological sense-making and usually independent experiments before it counts as a discovery."
  },
  try: { kind: "widget", widget: "journey" },
  check: [
    {
      q: "In the heat-shock project, which step produces the count matrix?",
      options: [
        { t: "Processing: matching reads to genes and counting them", why: "Correct. Counting is a computational step applied to the reads." },
        { t: "The sequencer itself, which outputs a count matrix directly", why: "A sequencer outputs reads (sequences with quality scores). Turning reads into gene counts is done afterwards by software." },
        { t: "Statistics: the test creates the counts", why: "Statistical tests use counts as their input. They cannot create them." }
      ],
      answer: 0
    },
    {
      q: "HSPA1A rises about 38-fold after heat shock while ACTB stays flat. Why is the flat ACTB result useful?",
      options: [
        { t: "It suggests the increase is specific to certain genes, not a technical shift that affected every gene", why: "Correct. Genes expected to stay stable act as an informal internal check." },
        { t: "It proves the experiment failed", why: "Many genes are not expected to change. A flat ACTB is consistent with a working experiment." },
        { t: "It shows ACTB is the most important gene in the experiment", why: "ACTB is useful here as a reference, not because it is the main finding." }
      ],
      answer: 0
    },
    {
      q: "Which skill is mainly used to organize and process sequencing files on a remote server?",
      options: [
        { t: "The Linux command line", why: "Correct. Most sequencing data lives on Linux servers, and commands and scripts move, inspect and process it." },
        { t: "Reading codons", why: "Codons are a biology concept for understanding genes and proteins, not a way to handle files." },
        { t: "The false discovery rate", why: "That is a statistics idea used later, when deciding which gene changes to trust." }
      ],
      answer: 0
    }
  ],
  real: "Studies of how cells respond to heat, drugs, infection or disease follow this same chain. Real projects add steps such as detailed quality control, alignment software and pathway analysis, which Foundation 3 introduces.",
  teach: {
    prompt: "Describe the journey from a biological question to a discovery, naming what Linux, Python or R, and statistics each contribute.",
    points: ["The question and experimental design come first", "Sequencing produces reads; computation turns reads into counts", "Statistics separates real changes from noise", "Interpretation and follow-up experiments turn results into discoveries"]
  }
});
