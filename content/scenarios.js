/* "Choose the right method" scenarios for the methods widget (f3-interpret). Same option rules as questions: every option has a "why".
   Written to tools/CONTENT_GUIDE.md. */
window.BB = window.BB || {};

BB.scenarios = [
  {
    q: "A tumor contains a rare immune cell population, about 1 percent of all its cells. You want to know which genes these cells express and how they differ from the other immune cells. Which method fits?",
    context: "Key point: the cells of interest are rare and mixed with many other cell types.",
    options: [
      { t: "Bulk RNA-seq of the whole tumor", why: "Bulk RNA-seq averages over all cells. A population that makes up 1 percent of the sample barely changes the average, so its profile is lost." },
      { t: "Single-cell RNA-seq", why: "Correct. It measures each cell separately, so a 1 percent population can be found by clustering and described by its own marker genes." },
      { t: "qPCR of three immune genes", why: "qPCR measures a few chosen genes in a whole sample. It cannot discover an unknown population or describe its full expression profile." },
      { t: "Whole-genome DNA sequencing", why: "These cells share essentially the same genome as their neighbors. They differ in which genes they express, which DNA sequencing does not measure." }
    ],
    answer: 1
  },
  {
    q: "You want to know how a drug changes gene expression in mouse liver as a whole, with 4 treated and 4 control mice. Which approach fits best?",
    context: "Key point: the question is about the whole tissue, and there are several animals per group.",
    options: [
      { t: "Bulk RNA-seq of each liver, then differential expression analysis", why: "Correct. Bulk RNA-seq measures the whole-tissue response genome-wide, and 4 biological replicates per group allow a proper statistical comparison." },
      { t: "Single-cell RNA-seq of one liver per group", why: "Single-cell data answers a different, cell-level question, and one animal per group cannot separate the drug effect from differences between individual mice." },
      { t: "DNA sequencing of each liver", why: "A drug does not change the DNA sequence of the genes; it changes how much they are expressed." },
      { t: "qPCR of one gene you already suspect", why: "qPCR is accurate for a few known genes, but the question asks about genome-wide changes, including genes you did not expect." }
    ],
    answer: 0
  },
  {
    q: "A clinician wants to know whether a patient carries a known disease-causing DNA variant. Which method fits?",
    context: "Key point: the question is about the DNA sequence, not about expression.",
    options: [
      { t: "RNA-seq of a blood sample", why: "RNA-seq measures expression. The gene may not even be expressed in blood, and expression levels cannot reliably show which DNA letters a person carries." },
      { t: "Single-cell RNA-seq", why: "This is expensive, measures expression rather than the genome, and captures only part of each cell's RNA. It is the wrong tool for a genotype question." },
      { t: "A targeted DNA test (genotyping or sequencing of that position)", why: "Correct. The question is about the DNA sequence at one known position, which a DNA-based test reads directly and reliably." },
      { t: "A correlation between the gene's expression and age", why: "A correlation describes a relationship across many people. It says nothing about which variant one patient carries." }
    ],
    answer: 2
  },
  {
    q: "You need to know whether the amount of a protein changed after a treatment. Which measurement answers this most directly?",
    context: "Key point: RNA and protein levels are related but not identical.",
    options: [
      { t: "RNA-seq of the treated and control samples", why: "RNA-seq measures RNA. Protein levels also depend on translation and protein breakdown, so RNA is only an indirect guide." },
      { t: "qPCR of the gene's RNA", why: "qPCR also measures RNA, so it has the same limitation as RNA-seq for a question about protein." },
      { t: "Single-cell RNA-seq", why: "Single-cell data adds cell-level detail, but it still measures RNA, not protein." },
      { t: "A protein measurement, such as a western blot or mass spectrometry", why: "Correct. Measuring the protein itself answers the question directly." }
    ],
    answer: 3
  },
  {
    q: "RNA-seq identified 3 top genes induced by a treatment. You want to confirm them. What is the strongest follow-up?",
    context: "Key point: confirmation should be independent of the original experiment.",
    options: [
      { t: "Re-analyze the same RNA-seq data with another software tool", why: "This checks the analysis, not the biology. Any problem in the original samples would simply be repeated." },
      { t: "qPCR of the 3 genes in new, independently treated samples", why: "Correct. qPCR is accurate and affordable for a few genes, and new biological samples test whether the result holds beyond the original experiment." },
      { t: "Sequence the same libraries again more deeply", why: "More reads from the same samples reduce counting noise but cannot reveal problems with those samples, and they are not an independent method." },
      { t: "Single-cell RNA-seq of one new sample", why: "Single-cell data answers cell-level questions. For confirming 3 known genes across replicates, it is costly and weaker than qPCR on several samples." }
    ],
    answer: 1
  },
  {
    q: "Mice are fed one of three diets, 10 mice per diet, and their body weight is measured. Which analysis tests whether diet affects weight?",
    context: "Key point: one numeric outcome, three independent groups.",
    options: [
      { t: "Three separate t-tests, each at p < 0.05", why: "Each extra test adds a chance of a false positive, so the overall error rate rises above 5 percent. ANOVA asks the overall question once." },
      { t: "A correlation between diet and weight", why: "Correlation needs two numeric variables. Diet is a category with three levels." },
      { t: "One-way ANOVA, followed by post hoc comparisons", why: "Correct. ANOVA tests whether all three means are equal in one test, and post hoc tests (such as Tukey's) then show which diets differ." },
      { t: "A paired t-test", why: "Paired tests are for the same subjects measured twice. Here each mouse eats one diet, and there are three groups." }
    ],
    answer: 2
  },
  {
    q: "You measured a gene's expression in blood from 60 people aged 20 to 80. You want to know whether expression changes with age, and by how much per year. Which analysis fits?",
    context: "Key point: both variables are numeric, and the question asks for a rate of change.",
    options: [
      { t: "A t-test comparing the 30 youngest with the 30 oldest people", why: "Splitting age into two groups throws away information and gives no rate of change per year." },
      { t: "Correlation and a linear model of expression against age", why: "Correct. r measures how strongly expression and age are associated, and the slope of `lm(expression ~ age)` gives the change per year." },
      { t: "Single-cell RNA-seq of one young and one old person", why: "One person per age group cannot show a trend, and the question is about overall expression, not cell types." },
      { t: "Benjamini-Hochberg correction", why: "BH corrects p-values when many tests are run. It is not itself a way to relate one gene to age." }
    ],
    answer: 1
  },
  {
    q: "You test all 20,000 genes for a difference between tumor and normal tissue and want a list in which only a small, controlled share of genes are false positives. What should you apply?",
    context: "Key point: thousands of tests at once.",
    options: [
      { t: "A false discovery rate correction such as Benjamini-Hochberg", why: "Correct. BH-adjusted p-values let you call a list in which the expected proportion of false discoveries is about 5 percent or less." },
      { t: "Keep every gene with a raw p-value below 0.05", why: "With 20,000 tests, about 1,000 unchanged genes would pass p < 0.05 by chance, so the list could be mostly false positives." },
      { t: "Keep only the single gene with the smallest p-value", why: "This discards almost every real change. The goal is a list with a controlled share of errors, not a single gene." },
      { t: "Use a larger cutoff, such as p < 0.1, to find more genes", why: "A looser cutoff adds even more false positives. The number of tests must be accounted for, not ignored." }
    ],
    answer: 0
  },
  {
    q: "Blood pressure is measured in the same 15 patients before and after a new drug. Which test fits?",
    context: "Key point: the same people are measured twice.",
    options: [
      { t: "Welch's two-sample t-test", why: "Welch's test is for two independent groups. Here each patient appears in both groups, so the values are paired." },
      { t: "One-way ANOVA", why: "ANOVA compares three or more independent groups. Here there are two measurements on the same people." },
      { t: "A Pearson correlation between before and after", why: "Correlation shows whether high values before go with high values after; it does not test whether the drug changed the average." },
      { t: "A paired t-test", why: "Correct. It tests the 15 within-patient differences, which removes the large differences between patients and gives more power." }
    ],
    answer: 3
  },
  {
    q: "You compare a gene's expression between 6 treated and 6 control cultures. The treated values are much more spread out than the control values. Which test is the safer choice?",
    context: "Key point: two independent groups with unequal spread.",
    options: [
      { t: "Student's t-test, which assumes equal variances", why: "Its equal-variance assumption is clearly broken here, which can make its p-values misleading." },
      { t: "Welch's t-test", why: "Correct. Welch's test does not assume equal variances, and it is the default of `t.test()` in R." },
      { t: "A paired t-test", why: "The cultures are independent, not the same units measured twice, so there is nothing to pair." },
      { t: "No test is possible when variances differ", why: "Unequal variances are common, and Welch's t-test was designed for exactly this situation." }
    ],
    answer: 1
  },
  {
    q: "Before testing 8 RNA-seq samples (4 control, 4 treated), you want to check that replicates agree and that no sample is mislabeled or failed. What should you do?",
    context: "Key point: this is a check on samples, done before any gene-level test.",
    options: [
      { t: "Run the differential expression test and see whether the results look sensible", why: "Problems should be found before testing. A mislabeled or failed sample distorts the test, and judging samples by the results invites bias." },
      { t: "Exploratory checks: library sizes, a PCA plot and sample-to-sample correlations", why: "Correct. Replicates should group together by condition; a sample that sits with the other group or apart from everything needs investigation." },
      { t: "Benjamini-Hochberg correction", why: "BH corrects p-values for many tests. It cannot reveal a mislabeled or failed sample." },
      { t: "qPCR of one housekeeping gene", why: "One gene gives very limited information about overall sample quality or identity. Genome-wide checks such as PCA are far more informative." }
    ],
    answer: 1
  },
  {
    q: "A differential expression analysis gives you 300 significant genes. You want to know which biological processes they point to. What is the next step?",
    context: "Key point: summarizing a gene list in terms of known biology.",
    options: [
      { t: "Read the 300 gene names and guess the common theme", why: "Guessing is biased toward familiar genes and cannot tell you whether a theme appears more often than chance would predict." },
      { t: "Another differential expression test", why: "The genes are already tested. The question now is what the list means biologically." },
      { t: "Enrichment analysis of Gene Ontology terms and pathways, using all tested genes as the background", why: "Correct. It tests which gene sets are over-represented in the list, compared with the genes that could have been found." },
      { t: "Clustering the genes on a UMAP plot", why: "UMAP is a picture for single-cell data. It does not test which biological processes are over-represented." }
    ],
    answer: 2
  }
];
