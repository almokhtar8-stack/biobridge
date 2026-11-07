/* Foundation 3, second half: statistical reasoning, differential expression, single-cell data, interpretation and workflows.
   Written to tools/CONTENT_GUIDE.md. Numbers come from the site's toy datasets (content/vfs.js, content/datasets.js);
   every R example with an output was run with Rscript. */
window.BB = window.BB || {};
BB.lessons = BB.lessons || [];

BB.lessons.push({
  id: "f3-eda",
  what: "Exploratory data analysis (EDA) means summarizing and plotting your data before any formal test. You check its center, its spread, its shape and anything strange, such as missing values, outliers or a sample that failed.",
  problem: "A statistical test squeezes a whole dataset into one number. It still returns a p-value if a sample was mislabeled, a value was typed wrongly or one culture behaved oddly, and that p-value can be badly misleading. Looking first catches these problems while they are still cheap to fix.",
  care: "Most mistakes in real analyses are found by looking, not by testing. A few lines of R, such as `summary()`, `hist()` and `boxplot()`, can save weeks of chasing a result that was never real.",
  steps: [
    "Check the shape of the table: how many rows and columns it has (`dim()`), what one row and one column mean, and whether any values are missing (shown as `NA` in R).",
    "Summarize the center. The mean is the sum of the values divided by how many there are. The median is the middle value after sorting. If the two are far apart, a few extreme values are pulling the mean.",
    "Summarize the spread: the smallest and largest values, the quartiles and the standard deviation. `summary()` prints the minimum, first quartile, median, mean, third quartile and maximum together.",
    "Plot. A histogram shows the distribution of one variable. A boxplot compares groups. A scatter plot shows two variables against each other, for example one replicate against another.",
    "Investigate anything odd before testing. An outlier may be real biology, a technical failure or a typo. Decide what to do from evidence such as lab notes, not from which choice gives a nicer p-value."
  ],
  deeper: "Expression values are strongly right-skewed: in `counts.tsv`, EEF1A1 has about 100,000 reads per sample while HSPA6 has 0 to 3 in the controls. On a normal axis a few genes squash the rest into a corner, so expression is usually plotted on a log scale, such as log2(count + 1). In a boxplot, the line is the median, the box covers the middle half of the data (first to third quartile) and the whiskers reach the most extreme values within 1.5 box-lengths of the box. Points beyond the whiskers are possible outliers to investigate, not automatic errors.",
  show: {
    intro: "Read the count table and look at one gene, FOS, before testing anything.",
    lang: "r",
    code: "counts <- read.delim(\"counts.tsv\", row.names = 1)\nfos <- unlist(counts[\"FOS\", ])\nfos\nmean(fos[4:6])\nmedian(fos[4:6])",
    output: "ctrl_1 ctrl_2 ctrl_3 heat_1 heat_2 heat_3\n   220    223    277    311   1906    260\n[1] 825.6667\n[1] 311",
    notes: [
      "`read.delim()` reads a tab-separated file into a data frame, and `row.names = 1` uses the gene names as row names. `unlist(counts[\"FOS\", ])` turns the FOS row into a vector named by sample.",
      "Two heat replicates (311 and 260) look like the controls (220 to 277), but heat_2 has 1906, about six times more.",
      "The heat mean, 825.7, is pulled up by that one value. The median, 311, is not. A big gap between mean and median is a classic sign of an outlier.",
      "These are raw counts. heat_2 has the smallest library (17.9 million reads), so normalizing makes its value even higher rather than explaining it away. Before testing, ask why: a stressed culture, a handling problem, or a real effect?"
    ]
  },
  pitfall: {
    wrong: "A value that looks strange should be deleted so that the test works better.",
    right: "Remove a value only for a documented reason, such as a failed quality check or a recorded lab problem, ideally decided before you see any test result. Otherwise keep it and report it. Deleting inconvenient values until the p-value looks good produces false discoveries."
  },
  try: {
    kind: "predict",
    q: "Five replicate measurements of one gene are stored in R. One sample failed and gave a very low value. What does this code print?",
    code: { lang: "r", src: "expr <- c(8.2, 7.9, 8.3, 8.0, 2.1)\nround(mean(expr), 2)\nmedian(expr)" },
    options: [
      { t: "[1] 8\n[1] 6.9", why: "The order is swapped. The code asks for the mean first and the median second, and it is the mean that the low value pulls down." },
      { t: "[1] 8.1\n[1] 8.1", why: "These are the mean and median of the four good values only. R uses every value in the vector unless you remove one yourself." },
      { t: "[1] 6.9\n[1] 6.9", why: "The mean and median are close when values are spread symmetrically. One extreme value moves the mean a lot but barely moves the median." },
      { t: "[1] 6.9\n[1] 8", why: "Right. The mean is 34.5 / 5 = 6.9, dragged down by the failed value 2.1. The median is the middle of the sorted values (2.1, 7.9, 8.0, 8.2, 8.3), which is 8, close to the four good replicates." }
    ],
    answer: 3,
    verify: {}
  },
  check: [
    {
      q: "You plot the library sizes of 6 RNA-seq samples. Five have about 20 million reads; one has 0.4 million. What is the best next step?",
      options: [
        { t: "Run the test first, then remove the sample if the results look better without it", why: "Choosing which samples to keep based on the results is fishing for significance. Decide on quality grounds, before testing." },
        { t: "Investigate that sample (RNA quality, lab notes, QC reports) before any testing, and exclude it only with a documented reason", why: "Correct. A library 50 times smaller than the others usually means something went wrong. Find out what, decide on quality grounds and report the decision." },
        { t: "Ignore it, because normalization will correct for the smaller library", why: "Normalization corrects ordinary differences in sequencing depth. A library this small usually signals a failed preparation, and its counts stay very noisy even after scaling." }
      ],
      answer: 1
    },
    {
      q: "Which plot best shows whether a gene's expression differs between 40 patients and 40 healthy people, including any outliers?",
      options: [
        { t: "A boxplot with one box per group", why: "Correct. It shows each group's median, spread and possible outliers side by side. Adding the individual points on top is even better." },
        { t: "A histogram of all 80 values together", why: "A single histogram mixes the two groups, so you cannot see whether they differ." },
        { t: "A scatter plot of patient values against healthy values", why: "A scatter plot needs pairs of values from the same unit, such as two measurements on one person. These are different people, so there is nothing to pair." }
      ],
      answer: 0
    },
    {
      q: "Which summary of a group of replicates is least affected by one extreme value?",
      options: [
        { t: "The median", why: "Correct. The median depends only on the middle of the sorted values, so one extreme value barely moves it." },
        { t: "The mean", why: "The mean uses every value's size, so one extreme value can pull it far from the others, as FOS shows." },
        { t: "The maximum", why: "The maximum is the extreme value itself whenever the outlier is high, so it is the most affected summary of all." }
      ],
      answer: 0
    }
  ],
  real: "In RNA-seq projects, EDA also happens at the sample level: comparing library sizes and checking that replicates group together on a PCA plot or a correlation heatmap. These checks routinely catch swapped labels, failed libraries and batch effects before any differential expression test. In the KAUST course, exploratory data analysis is part of the basic statistics in R in Module 2, with correlation, linear models, t-tests and ANOVA.",
  teach: {
    prompt: "Explain to a friend why you should look at data before testing it, using the FOS example.",
    points: ["A test returns a number even when the data have problems", "The mean is pulled by outliers; the median is not", "Histograms, boxplots and scatter plots reveal shape, group differences and odd values", "Decide what to do with odd values from evidence, not from the p-value"]
  }
});

BB.lessons.push({
  id: "f3-variability",
  what: "Variability is how much repeated measurements differ from each other. Within a group of biological replicates, it comes from real differences between cultures, animals or people plus measurement noise. Statistics needs it to judge whether a difference between groups is bigger than the usual spread.",
  problem: "Two cultures treated in exactly the same way never give exactly the same numbers. If you only know the group averages, you cannot tell whether a difference between groups is a real effect or ordinary variation. You need to measure the spread within each group, and that requires replicates.",
  care: "The number of replicates and their spread decide what an experiment can conclude. In the heat-shock data, FOS shows a bigger average change than HSPB1, yet HSPB1 gives far stronger evidence, purely because of variability.",
  steps: [
    "The variance measures spread: take each value's distance from the mean, square it, add the squares up and divide by n - 1. For 4, 6 and 8: the mean is 6, the distances are -2, 0 and 2, the squares add up to 8, and 8 / 2 = 4.",
    "The standard deviation (SD) is the square root of the variance, here 2. It is in the same units as the data, so it reads as a typical distance from the mean. In R: `var()` and `sd()`.",
    "Compare the difference between groups with the spread within groups. A difference of 10 units is convincing if replicates vary by about 1, and weak if they vary by about 50.",
    "Use biological replicates: independently grown cultures, separate animals or different people. They capture the variation your conclusion has to cover. Measuring the same RNA several times only measures instrument noise.",
    "More replicates make a group mean more precise. Its uncertainty, the standard error (SD divided by the square root of n), halves when n goes from 3 to 12. The SD itself does not shrink: the biology stays as variable as it is."
  ],
  deeper: "In RNA-seq counts, genes with higher counts vary more in absolute numbers. If only the random sampling of reads mattered, a gene's count variance would equal its mean (a Poisson distribution). Biological replicates vary more than that (overdispersion), so DESeq2 and edgeR model counts with the negative binomial distribution, which adds a per-gene variability term called the dispersion. On a log scale, spreads become more comparable between genes, one reason this site's simplified test uses log2(CPM + 1).",
  show: {
    intro: "Compare the replicates of two genes in normalized units (CPM), then measure the spread of the heat replicates.",
    lang: "r",
    code: "lib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\nhspb1 <- c(2541, 2722, 2736, 5990, 3295, 4989) / lib\nfos <- c(220, 223, 277, 311, 1906, 260) / lib\nround(hspb1, 1)\nround(fos, 1)\nround(c(sd(hspb1[4:6]), sd(fos[4:6])), 1)",
    output: "[1] 138.1 123.2 134.8 243.5 184.1 235.3\n[1]  12.0  10.1  13.6  12.6 106.5  12.3\n[1] 32.2 54.3",
    notes: [
      "`lib` holds the library sizes in millions of reads, so dividing the counts by it gives CPM (counts per million). The first three values are controls, the last three heat.",
      "HSPB1: every heat replicate (184 to 244 CPM) is above every control (123 to 138 CPM). The average rises about 1.7-fold, modestly but consistently.",
      "FOS: two heat replicates (12.6 and 12.3) look like the controls (10.1 to 13.6). Only heat_2 is high. The average rises about 3.7-fold, but that rise comes from one culture.",
      "The SD of the FOS heat replicates (54.3 CPM) is larger than the whole change in the average (from 11.9 to 43.8, about 32 CPM). With spread that large, three replicates cannot show a reliable change."
    ]
  },
  pitfall: {
    wrong: "I sequenced the RNA from one culture per condition three times, so I have three replicates per condition.",
    right: "Those are technical replicates of one culture. They measure sequencing noise, not how much independent cultures differ, so you cannot tell whether the treatment or something special about that culture caused a difference. You need several independently grown and treated cultures per condition."
  },
  try: { kind: "widget", widget: "variability" },
  check: [
    {
      q: "Gene A: control 10, 11, 9; treated 20, 21, 19. Gene B: control 2, 18, 10; treated 5, 35, 20. Both treated means are double the control means. Which gene gives stronger evidence of a real change?",
      options: [
        { t: "Gene B, because its treated values reach higher numbers", why: "The highest single value does not matter. What matters is the difference between groups compared with the spread within groups, and gene B's spread is huge." },
        { t: "Both equally, because the fold change is the same", why: "Equal fold changes can come with very different variability. Evidence depends on the size of the change and on the spread of the replicates." },
        { t: "Gene A, because its replicates are consistent and the two groups do not overlap", why: "Correct. Gene A's difference (10 units) is ten times its replicate SD (1). Gene B's groups overlap heavily (control SD 8, treated SD 15)." }
      ],
      answer: 2
    },
    {
      q: "A study increases its replicates from 3 to 12 per group. What happens?",
      options: [
        { t: "The standard deviation of the replicates becomes four times smaller", why: "The SD describes the biology and the measurement, and it stays about the same with more replicates. It is the uncertainty of the mean that shrinks, and only by the square root of the increase." },
        { t: "Nothing important changes, because the average stays about the same", why: "The average may stay similar, but you become more certain about it. That extra certainty is exactly what makes a small real difference detectable." },
        { t: "The standard error of each group mean halves, so smaller real differences can be detected", why: "Correct. The standard error is SD divided by the square root of n, and the square root of 12 / 3 is 2. More replicates increase statistical power." }
      ],
      answer: 2
    },
    {
      q: "A lab has RNA from one mouse per genotype and sequences each sample four times. What can they conclude about the effect of genotype?",
      options: [
        { t: "Everything, as long as they use a t-test", why: "A test cannot create information the design lacks. With one animal per group, it would only compare sequencing noise, not biological variation." },
        { t: "Very little: with one animal per genotype, genotype cannot be separated from differences between individual mice", why: "Correct. Any two mice differ a little. With one animal per group, the comparison cannot tell genotype effects from individual differences." },
        { t: "A lot, because four sequencing runs per genotype give four replicates", why: "Repeated sequencing of the same RNA gives technical replicates. They show that the sequencer is consistent, not that another mouse of the same genotype would look the same." }
      ],
      answer: 1
    }
  ],
  real: "A yeast RNA-seq study with 48 replicates per condition (Schurch and colleagues, 2016) found that with only 3 replicates, most tools detected just 20 to 40 percent of the changed genes identified with the full set of replicates. The authors recommended at least 6 biological replicates per condition, rising to 12 when changes of every size matter.",
  teach: {
    prompt: "Explain to a friend why replicates matter, using HSPB1 and FOS as examples.",
    points: ["Variability is the spread of repeated measurements; the SD is a typical distance from the mean", "A difference only means something compared with the spread within groups", "Biological replicates, not technical ones, let conclusions generalize", "More replicates make a mean more precise; they do not reduce biological variation"]
  }
});

BB.lessons.push({
  id: "f3-foldchange",
  what: "A fold change is a ratio: a gene's expression in one condition divided by its expression in another, for example heat divided by control. A log2 fold change (log2FC) puts that ratio on the log2 scale, where 0 means no change, +1 means doubled and -1 means halved.",
  problem: "Raw differences mislead. A gene going from 10 to 20 and another going from 10,000 to 10,010 both changed by 10, but only the first one doubled. Ratios fix that, but they are lopsided: doubling is 2 while halving is 0.5, so decreases look smaller than increases of the same size. Taking log2 makes up and down symmetric.",
  care: "log2FC is the effect-size column in every differential expression table and the horizontal axis of every volcano plot. You will read it hundreds of times, so it pays to read it fluently.",
  steps: [
    "Normalize first, for example to CPM, so that a sample that was sequenced more deeply does not look higher. Then average each group.",
    "Fold change = mean treated / mean control. If control is 10 CPM and heat is 40 CPM, the fold change is 4.",
    "log2FC = log2(fold change), and log2(4) = 2. Each +1 is one more doubling: 1 is 2-fold, 2 is 4-fold, 3 is 8-fold. Negative values are decreases: -1 is half, -2 is a quarter.",
    "Symmetry: 4-fold up is +2 and 4-fold down is -2. As plain ratios they would be 4 and 0.25, which look very different.",
    "Zeros break logs, because log2(0) is minus infinity. So a small pseudocount, often 1, is added first: log2((heat + 1) / (control + 1)). This keeps genes that are off in one condition finite, but it shrinks fold changes for genes with very low values."
  ],
  deeper: "Why base 2? Doublings are easy to picture. Some tools and papers use natural logs or log10, so always check the base: a log10 fold change of 1 is a 10-fold change. This site computes log2 of the ratio of group means. Real tools estimate log2FC from a statistical model, and DESeq2 can shrink unreliable fold changes of low-count genes toward zero, a more principled version of what the pseudocount does crudely. Remember that a fold change is an effect size: it says how big a change is, not how sure you can be about it.",
  show: {
    intro: "Compute the log2 fold change of HSPA1A from its counts, the way this site does.",
    lang: "r",
    code: "lib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\ncpm <- c(212, 282, 203, 11018, 8441, 10838) / lib\nctrl <- mean(cpm[1:3])\nheat <- mean(cpm[4:6])\nround(c(ctrl, heat), 2)\nround(log2((heat + 1) / (ctrl + 1)), 3)",
    output: "[1]  11.43 476.89\n[1] 5.265",
    notes: [
      "Dividing by `lib` (library sizes in millions) converts counts to CPM, so the six samples are comparable.",
      "The control average is 11.43 CPM and the heat average is 476.89 CPM.",
      "log2FC = 5.265, so (heat + 1) / (control + 1) is 2 to the power 5.265, about 38.",
      "The +1 pseudocount changes little here, because both averages are well above 1: the plain ratio, 476.89 / 11.43, is about 42. It matters a lot for HSPA6, which is almost off in controls (0.09 CPM): its log2FC is 5.40 with the pseudocount and about 9.0 without it."
    ]
  },
  pitfall: {
    wrong: "A log2 fold change of 2 means expression doubled, and -2 means it fell by 2 units.",
    right: "log2FC 2 means 2 to the power 2 = 4 times higher; doubling is log2FC 1. log2FC -2 means 4 times lower (one quarter of the control level), not a subtraction of 2 units."
  },
  try: { kind: "widget", widget: "log2" },
  check: [
    {
      q: "A gene goes from 50 CPM in control to 12.5 CPM after treatment. What is its log2 fold change (treated versus control)?",
      options: [
        { t: "-4", why: "Expression fell 4-fold, but log2FC counts doublings: a 4-fold change is two doublings, so the value is -2." },
        { t: "-2", why: "Correct. 12.5 / 50 = 0.25, a quarter, and log2(0.25) = -2: two halvings." },
        { t: "0.25", why: "That is the plain fold change. On the log2 scale, a quarter becomes -2." },
        { t: "-37.5", why: "That is the difference in CPM. Fold changes compare ratios, not differences." }
      ],
      answer: 1
    },
    {
      q: "Gene X has log2FC = 3 and gene Y has log2FC = -3. Which statement is correct?",
      options: [
        { t: "X is 8 times higher after treatment and Y is 8 times lower: equal-sized changes in opposite directions", why: "Correct. 2 x 2 x 2 = 8, and the sign gives the direction." },
        { t: "X changed more than Y, because 3 is larger than -3", why: "The sign shows the direction and the absolute value shows the size. 3 and -3 are equally large changes." },
        { t: "X is 3 times higher and Y is 3 times lower", why: "log2FC counts doublings. Three doublings is 2 x 2 x 2 = 8-fold." }
      ],
      answer: 0
    },
    {
      q: "HSPA6 averages 0.09 CPM in controls and 44.85 CPM after heat. Its log2FC is about 9.0 without a pseudocount and 5.4 with +1. Why is the pseudocount version preferred?",
      options: [
        { t: "Because 5.4 is the true fold change and 9.0 is a calculation error", why: "Both numbers are correct arithmetic for their formulas. The pseudocount is a deliberate choice that trades exactness for stability near zero." },
        { t: "Because log2 cannot be used for numbers smaller than 1", why: "log2 works for any positive number, for example log2(0.5) = -1. Only zero is a problem, which is why a pseudocount is added." },
        { t: "Near zero the ratio is unstable: a tiny change in the control value would swing it wildly. The pseudocount keeps it finite and moderate", why: "Correct. Dividing by a number close to 0 magnifies noise. The +1 version still shows a strong induction (about 42-fold) without an extreme, fragile value." }
      ],
      answer: 2
    }
  ],
  real: "Every differential expression table, whether from DESeq2, edgeR or limma, reports a log2 fold change for each gene, and many papers combine an adjusted p-value cutoff with a threshold such as |log2FC| > 1 (more than 2-fold). The same scale appears in proteomics and in single-cell marker tables, where a marker gene's log2FC compares one cluster with all the others.",
  teach: {
    prompt: "Explain fold change and log2 fold change to a friend, using HSPA1A and HSPA6.",
    points: ["A fold change is a ratio of normalized expression between conditions", "log2FC counts doublings: 1 = 2-fold up, 2 = 4-fold up, -1 = half", "The log2 scale makes increases and decreases symmetric", "A pseudocount avoids log of zero but shrinks fold changes for low values"]
  }
});

BB.lessons.push({
  id: "f3-tests",
  what: "A hypothesis test asks whether data are consistent with a 'no difference' assumption, called the null hypothesis. The p-value is the probability, if the null hypothesis and the test's assumptions were true, of getting data at least as extreme as what you observed. A t-test compares the means of two groups; ANOVA compares three or more.",
  problem: "Replicates vary, so two group means are almost never exactly equal, even when a treatment does nothing. We need a principled way to ask whether an observed difference is larger than replicate-to-replicate variation would typically produce by chance.",
  care: "Differential expression tables, clinical trials and most biology papers report p-values. Misreading them is one of the most common errors in science, and one of the easiest to avoid.",
  steps: [
    "State the hypotheses. Null hypothesis (H0): mean log2 expression is the same at 37 C and at 42 C. Alternative hypothesis (H1): the means differ.",
    "Compute a test statistic. The t statistic divides the difference between the group means by the standard error of that difference, so a large value means the difference is big compared with the noise.",
    "Turn the statistic into a p-value: how often a statistic at least this extreme would appear if H0 were true.",
    "Compare the p-value with a significance level (alpha) chosen in advance, usually 0.05. If p < alpha, call the result statistically significant. If not, you lack evidence, which is not the same as proving that nothing changed.",
    "Match the test to the design. Two independent groups: Welch's t-test, which does not assume equal variances and is the default of `t.test()` in R. The same subjects measured twice: a paired t-test. Three or more groups: ANOVA, one overall test of whether all means are equal, followed by post hoc comparisons (such as Tukey's test) to find which groups differ."
  ],
  deeper: "Welch's statistic is `t = (m1 - m2) / sqrt(s1^2/n1 + s2^2/n2)`, where m is a group's mean, s its SD and n its size. The test assumes independent samples and roughly normal values in each group, which is hard to check with 3 replicates. Rank-based tests such as the Wilcoxon rank-sum test assume less, but with 3 versus 3 samples their smallest possible two-sided p-value is 0.1, so they can never reach 0.05. Statistical power, the probability of detecting a real effect of a given size, grows with more replicates, larger effects and less noise.",
  show: {
    intro: "Run Welch's t-test on log2(CPM + 1) for two genes, exactly as this site's simplified method does.",
    lang: "r",
    code: "lib <- c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)\nhspa1a <- log2(c(212, 282, 203, 11018, 8441, 10838) / lib + 1)\nfos <- log2(c(220, 223, 277, 311, 1906, 260) / lib + 1)\nsignif(t.test(hspa1a[4:6], hspa1a[1:3])$p.value, 3)\nsignif(t.test(fos[4:6], fos[1:3])$p.value, 3)",
    output: "[1] 9.33e-06\n[1] 0.397",
    notes: [
      "`t.test(heat, control)` runs Welch's t-test by default. `$p.value` extracts the p-value, and `signif(..., 3)` keeps three significant digits.",
      "HSPA1A: 9.33e-06 means 9.33 x 10 to the power -6, or 0.00000933. The replicates agree closely and the difference is huge, so data like these would be very unlikely if heat changed nothing.",
      "FOS: p = 0.397. Its average rose about 3.7-fold, but one replicate drives that rise, so a result at least this extreme would occur about 40 percent of the time even if heat had no effect.",
      "p = 0.397 does not show that FOS is unaffected by heat. It shows that three replicates per group cannot distinguish its change from noise."
    ]
  },
  pitfall: {
    wrong: "p = 0.03 means there is a 3 percent chance that the null hypothesis is true, so a 97 percent chance that the gene really changed.",
    right: "The p-value is calculated by assuming the null hypothesis is true, so it cannot be the probability that the null is true. It is the probability of data at least this extreme under that assumption. It also says nothing about how big the effect is: with many replicates, a tiny and unimportant change can give a very small p-value."
  },
  try: {
    kind: "parsons",
    prompt: "Put these lines in order to test whether HSPB1 changes after heat shock, using the same simplified method as this site.",
    lang: "r",
    lines: [
      "counts <- read.delim(\"counts.tsv\", row.names = 1)",
      "cpm <- unlist(counts[\"HSPB1\", ]) / c(18.4, 22.1, 20.3, 24.6, 17.9, 21.2)",
      "logcpm <- log2(cpm + 1)",
      "result <- t.test(logcpm[4:6], logcpm[1:3])",
      "print(round(result$p.value, 3))"
    ],
    output: "[1] 0.018",
    verify: true,
    explain: "Each line needs the one before it: read the table, convert HSPB1's counts to CPM, log-transform, test heat (columns 4 to 6) against control (columns 1 to 3), then print. The p-value is 0.018, below 0.05 for this single gene. But the experiment tests 1,512 genes, and after correcting for that (two lessons ahead) HSPB1's adjusted p-value is 0.227."
  },
  check: [
    {
      q: "A t-test comparing treated and control samples gives p = 0.01. Which interpretation is correct?",
      options: [
        { t: "If the treatment truly had no effect (and the test's assumptions hold), a difference at least this large would appear about 1 percent of the time", why: "Correct. This is the definition: a probability about the data, calculated assuming the null hypothesis." },
        { t: "There is a 1 percent chance that the treatment has no effect", why: "This reverses the logic. The p-value assumes no effect and asks how surprising the data are; it is not the probability that the null hypothesis is true." },
        { t: "The treatment changed the measurement by 1 percent", why: "A p-value is not an effect size. The size of the change comes from the means or the fold change, not from p." },
        { t: "There is a 99 percent chance that the result will repeat in a new experiment", why: "A p-value is not a probability of replication. Even real effects measured with few replicates often fail to reach p < 0.05 again." }
      ],
      answer: 0
    },
    {
      q: "Mice are fed one of three diets (8 mice per diet) and weighed. Which analysis fits the question 'does diet affect weight'?",
      options: [
        { t: "A correlation between diet and weight", why: "Correlation needs two numeric variables. Diet is a category with three levels, which is what ANOVA is designed for." },
        { t: "A paired t-test", why: "Paired tests are for the same subjects measured twice. Here each mouse eats only one diet, and there are three groups." },
        { t: "One-way ANOVA, then post hoc comparisons to see which diets differ", why: "Correct. ANOVA tests all three means in one test, keeping the false-positive rate at alpha, and post hoc tests then locate the differences." },
        { t: "Three separate t-tests (A vs B, A vs C, B vs C), each at 0.05", why: "Each extra test adds another chance of a false positive, so the overall error rate rises above 5 percent. ANOVA asks the overall question once." }
      ],
      answer: 2
    },
    {
      q: "In the heat-shock data, FOS rises from 11.9 to 43.8 CPM on average, with p = 0.397. Which conclusion is justified?",
      options: [
        { t: "The data do not give good evidence of a change: one heat replicate drives the rise, and more replicates would be needed to decide", why: "Correct. The average moved, but the replicates disagree, so the evidence is weak in both directions." },
        { t: "Heat shock has no effect on FOS", why: "A large p-value means the evidence is weak, not that the effect is zero. With 3 replicates and one extreme value, a real change could easily be missed." },
        { t: "FOS is strongly induced, because a 3.7-fold rise is large", why: "The size of the average change is not enough. Two of the three heat replicates look like the controls, so the rise is not consistent." }
      ],
      answer: 0
    }
  ],
  real: "Real differential expression tools test every gene with a model-based test. DESeq2 uses a Wald test (or a likelihood ratio test) on a negative binomial model, and limma uses moderated t-tests that borrow variance information across genes. The logic is the same as here: an effect divided by its uncertainty, turned into a p-value. In the KAUST course, t-tests and ANOVA are part of Module 2's statistics in R.",
  teach: {
    prompt: "Explain what a p-value is and is not, using HSPA1A and FOS.",
    points: ["The null hypothesis says there is no difference", "The p-value is the probability of data at least this extreme if the null hypothesis were true", "It is not the probability that the null hypothesis is true, and not the size of the effect", "Use a t-test for two groups and ANOVA for three or more"]
  }
});

BB.lessons.push({
  id: "f3-correlation",
  what: "Correlation measures how strongly two numeric variables move together. Pearson's correlation coefficient, r, runs from -1 (a perfect falling straight line) through 0 (no straight-line relationship) to +1 (a perfect rising straight line). A linear model goes further and fits a line, `y = intercept + slope * x`, which describes how much y changes for each unit of x.",
  problem: "Many biological questions are about relationships rather than group differences: does a gene's expression rise with age, do two genes rise and fall together across tumors, do two replicate samples agree? We need numbers that summarize a relationship, and a way to judge them.",
  care: "Correlation is used constantly, from checking replicates to building gene networks. It is also among the most over-interpreted numbers in biology, so knowing its limits protects you from convincing but false stories.",
  steps: [
    "Plot first. A scatter plot puts one variable on each axis. Look for a trend, curves, separate groups and outliers.",
    "Compute r with `cor(x, y)`. The sign gives the direction and the size gives the strength of the straight-line pattern. `cor.test(x, y)` adds a p-value for the null hypothesis that the true correlation is 0.",
    "Fit a line with `lm(y ~ x)`, reading `~` as 'explained by'. `coef()` returns the intercept, the predicted y when x is 0, and the slope, the change in y for each 1-unit increase in x.",
    "Interpret with care. Correlation is not causation: a third factor can drive both variables. r only detects straight-line patterns, so a perfect U shape can give r near 0. A single outlier can create or hide a correlation."
  ],
  deeper: "Spearman's correlation applies the same formula to ranks instead of values, so it captures any steadily rising or falling pattern and is less sensitive to outliers (`cor(x, y, method = \"spearman\")`). r squared is the fraction of the variation in y that the straight line accounts for. Linear models also connect the earlier lessons: `lm(y ~ group)` with a two-level group gives the same p-value as an equal-variance t-test, with three or more groups it gives ANOVA, and differential expression tools such as limma fit a linear model to every gene.",
  show: {
    intro: "Use correlation to check how well samples agree, using log2(CPM + 1) for the 12 genes in `counts.tsv`.",
    lang: "r",
    code: "counts <- read.delim(\"counts.tsv\", row.names = 1)\nc1 <- log2(counts$ctrl_1 / 18.4 + 1)\nc2 <- log2(counts$ctrl_2 / 22.1 + 1)\nh1 <- log2(counts$heat_1 / 24.6 + 1)\nround(cor(c1, c2), 3)\nround(cor(c1, h1), 3)\nround(coef(lm(c2 ~ c1)), 3)",
    output: "[1] 0.998\n[1] 0.811\n(Intercept)          c1\n      0.127       0.984",
    notes: [
      "Each vector holds one sample's 12 genes as log2(CPM + 1). Dividing a count by the library size in millions gives CPM.",
      "Two control replicates: r = 0.998, almost a perfect straight line, as good replicates should be.",
      "Control against heat: r = 0.811. The heat-shock genes moved far above the line, which lowers r.",
      "`lm(c2 ~ c1)` fits a line with slope 0.984 and intercept 0.127: close to slope 1 and intercept 0, so after normalization the two replicates agree almost one to one.",
      "Scale matters. On raw counts, ctrl_1 against heat_1 gives r = 0.995, because three huge genes (EEF1A1, ACTB, GAPDH) dominate the calculation. Extreme values can make almost any two samples look alike."
    ]
  },
  pitfall: {
    wrong: "Gene X expression correlates with tumor size (r = 0.6) across 100 patients, so gene X makes tumors grow.",
    right: "Correlation shows that two things vary together, not why. A third factor, such as the fraction of dividing cells in each sample, could raise both, or tumor growth could raise gene X. Testing causation needs an experiment that changes X directly, such as reducing its expression."
  },
  try: { kind: "widget", widget: "correlation" },
  check: [
    {
      q: "Across 50 people, age and the expression of gene Y have r = -0.85. Which statement is justified?",
      options: [
        { t: "The relationship is weak, because r is negative", why: "The sign is the direction, not the strength. -0.85 is as strong as +0.85." },
        { t: "Older people tend to have lower Y expression: a strong negative straight-line association", why: "Correct. The sign gives the direction and 0.85 is close to 1, so the association is strong." },
        { t: "Aging causes Y expression to fall", why: "Correlation alone cannot show causation. Something linked with age, such as a disease more common in older people, could lower Y." },
        { t: "Y falls by 0.85 units per year of age", why: "That would be a slope from a linear model. r has no units; it measures how closely points follow a line, not how steep the line is." }
      ],
      answer: 1
    },
    {
      q: "A linear model `lm(expression ~ age)` gives an intercept of 2.0 and a slope of 0.05. What expression does it predict at age 40?",
      options: [
        { t: "0.05", why: "That is the slope itself: the change per year, not a predicted value." },
        { t: "4.0", why: "Correct. 2.0 + 0.05 x 40 = 2.0 + 2.0 = 4.0." },
        { t: "2.05", why: "That adds the slope once, which is the prediction at age 1. The slope is multiplied by the age." },
        { t: "80.0", why: "This multiplies 2.0 by 40. The intercept is added, and only the slope is multiplied by x." }
      ],
      answer: 1
    },
    {
      q: "A scatter plot of 20 samples shows no trend, except one point far out in the top-right corner. r = 0.7. What should you do?",
      options: [
        { t: "Delete the point because it is an outlier", why: "Deleting it without a reason is not justified: it might be a real and important sample. Investigate first and show both results." },
        { t: "Check that point and report r with and without it (or use Spearman's rank correlation), because one point may be creating the correlation", why: "Correct. r is very sensitive to a single extreme point, so show how much the result depends on it." },
        { t: "Report r = 0.7 as a strong relationship", why: "A strong-looking r produced by one point does not describe the other 19 samples, which show no trend." }
      ],
      answer: 1
    }
  ],
  real: "Correlation between samples is a standard RNA-seq quality check: replicates should correlate more closely with each other than with other conditions, and a sample that does not may be mislabeled or failed. Across genes, co-expression analysis uses correlation to find genes that rise and fall together, which often share a function. Linear models are the engine inside limma and, in extended form, inside DESeq2 and edgeR.",
  teach: {
    prompt: "Explain correlation and a linear model to a friend, and give two reasons why a correlation can mislead.",
    points: ["r runs from -1 to 1 and measures straight-line association", "A linear model gives an intercept and a slope (change in y per unit of x)", "Correlation is not causation: a third factor can drive both", "Outliers, scale and curved patterns can mislead r"]
  }
});

BB.lessons.push({
  id: "f3-multiple",
  what: "Multiple testing is the problem that appears when you run many tests at once: even if nothing truly changed, some tests give small p-values by chance. Corrections such as the Benjamini-Hochberg (BH) method produce adjusted p-values that control the false discovery rate (FDR), the expected proportion of false positives among the results you call significant.",
  problem: "At alpha = 0.05, every truly unchanged gene has a 5 percent chance of p < 0.05. Test 20,000 unchanged genes and you expect about 0.05 x 20,000 = 1,000 false positives. Without a correction, a list of 'significant' genes could be mostly noise.",
  care: "Every genomics result, from differential expression lists to genetic association hits and enriched pathways, depends on handling multiple testing correctly. The adjusted p-value column is the one you will use to decide which genes to report.",
  steps: [
    "Name the errors. A false positive is calling an unchanged gene significant. A false negative is missing a gene that really changed. Stricter cutoffs reduce the first kind and increase the second.",
    "Count the expected chance hits. With m tests of genes that do not change, expect about m x alpha false positives. This site's toy experiment tests 1,512 genes, so even if none of them changed, about 76 would still reach p < 0.05 by chance.",
    "Bonferroni divides alpha by the number of tests (0.05 / 20,000 = 0.0000025). It controls the chance of even one false positive, but it is so strict that many real changes are missed.",
    "Benjamini-Hochberg sorts the p-values from smallest to largest and multiplies each by m / rank: the smallest by m, the second by m / 2, and so on. A final step makes sure the adjusted values never decrease down the sorted list.",
    "Read padj as a property of the list: calling every gene with padj < 0.05 significant means that, on average, at most about 5 percent of the called genes are false discoveries."
  ],
  deeper: "Why does BH work? For genes with no real change, p-values are spread evenly between 0 and 1, so if none of the m genes changed, about m x t would fall below any cutoff t. BH compares how many small p-values you actually see with that expectation: a surplus of small p-values signals real effects. The final step works like this: if a gene's value of p x m / rank would be larger than the value of a gene further down the list, it takes that smaller value instead, so adjusted values keep the order of the p-values.",
  show: {
    intro: "Adjust five p-values with BH in R, and count how many pass 0.05 before and after.",
    lang: "r",
    code: "p <- c(0.001, 0.008, 0.02, 0.045, 0.3)\npadj <- p.adjust(p, method = \"BH\")\nround(padj, 3)\nsum(p < 0.05)\nsum(padj < 0.05)",
    output: "[1] 0.005 0.020 0.033 0.056 0.300\n[1] 4\n[1] 3",
    notes: [
      "With m = 5 tests, each p-value is multiplied by 5 / rank: 0.001 x 5 / 1 = 0.005, 0.02 x 5 / 3 = 0.033 and 0.045 x 5 / 4 = 0.056.",
      "Four raw p-values are below 0.05; after adjustment, three are. The gene with p = 0.045 no longer passes.",
      "`sum(p < 0.05)` counts TRUE values, because R counts TRUE as 1 and FALSE as 0.",
      "With 20,000 genes the multipliers are far larger, so a raw p-value must be much smaller to survive. In the heat-shock toy data, 191 of 1,512 genes have p < 0.05, but only 18 have padj < 0.05."
    ]
  },
  pitfall: {
    wrong: "A gene with padj = 0.03 has a 3 percent chance of being a false positive.",
    right: "padj describes a list, not one gene. If you call significant every gene with padj up to 0.03, you expect at most about 3 percent of that list, on average, to be false discoveries. A particular gene's chance of being false can be higher or lower than that."
  },
  try: { kind: "widget", widget: "pvalues" },
  check: [
    {
      q: "You test 10,000 genes, none of which truly changes, using p < 0.05. About how many will be called significant?",
      options: [
        { t: "About 500", why: "Correct. 10,000 x 0.05 = 500 false positives are expected by chance alone." },
        { t: "0, because none of the genes changed", why: "Unchanged genes still produce small p-values by chance: about 5 percent of them fall below 0.05. That is exactly what alpha means." },
        { t: "About 5", why: "Alpha is a proportion (5 percent), not a count. 5 percent of 10,000 is 500." },
        { t: "About 50", why: "That would be 0.5 percent of the genes. Multiply the number of tests by alpha: 10,000 x 0.05." }
      ],
      answer: 0
    },
    {
      q: "A results table shows a gene with p = 0.004 and padj = 0.12. You use an FDR cutoff of 0.05. What do you conclude?",
      options: [
        { t: "The gene is definitely unchanged", why: "Not significant means insufficient evidence, not proof of no change. It might be a real change that this experiment could not confirm." },
        { t: "It is not called significant: after accounting for all the genes tested, its evidence is not strong enough at 5 percent FDR", why: "Correct. The decision uses padj, and 0.12 is above 0.05." },
        { t: "It is significant, because p is below 0.05", why: "The raw p-value ignores how many tests were run. With thousands of genes, many unchanged genes have p-values around 0.004 by chance." }
      ],
      answer: 1
    },
    {
      q: "Why do genomics studies usually prefer BH (FDR) control over Bonferroni?",
      options: [
        { t: "Bonferroni guards against even one false positive and becomes so strict with 20,000 genes that many real changes are missed; FDR accepts a small, controlled share of false discoveries in exchange for finding more true ones", why: "Correct. For discovery studies, a list that is about 95 percent right is usually more useful than a tiny list that misses most real changes." },
        { t: "Bonferroni only works for experiments with exactly two groups", why: "Bonferroni works for any number of tests and any design. The issue is its strictness." },
        { t: "BH removes all false positives", why: "No method removes all false positives. BH controls their expected proportion among the called genes." }
      ],
      answer: 0
    }
  ],
  real: "DESeq2 reports BH-adjusted p-values in its `padj` column, edgeR's results tables report them as `FDR`, and limma as `adj.P.Val`. Genome-wide association studies use a fixed threshold of 5 x 10 to the power -8, which is roughly a Bonferroni correction for about one million independent tests.",
  teach: {
    prompt: "Explain to a friend why testing 20,000 genes needs a correction, and what padj < 0.05 means.",
    points: ["With m tests and no true effects, expect about m x alpha false positives", "Bonferroni is very strict; BH controls the false discovery rate", "padj < 0.05 means at most about 5 percent of the called list is expected to be false", "A raw p < 0.05 is not enough when thousands of genes are tested"]
  }
});

BB.lessons.push({
  id: "f3-de",
  what: "Differential expression (DE) analysis finds genes whose expression differs between conditions by more than the variation between replicates would explain. For every gene it reports an effect size (log2 fold change) and the strength of evidence (p-value and adjusted p-value).",
  problem: "A count matrix has thousands of genes and only a few replicates per condition. Samples are sequenced to different depths, replicates vary, and testing every gene creates chance hits. DE analysis combines normalization, a test for each gene and multiple-testing correction to turn this into a list you can trust.",
  care: "DE analysis is the core of most bulk RNA-seq studies, and analyzing bulk RNA-seq count data is one of the stated outcomes of the KAUST course. Every idea from the previous lessons comes together here.",
  steps: [
    "Explore and check the data: library sizes, how well replicates agree (correlation or PCA) and any odd samples.",
    "Normalize so samples are comparable. This site uses CPM; real tools use more careful scaling. Genes with almost no reads in any sample are usually filtered out, because they cannot show a reliable change.",
    "For each gene, estimate the effect (log2FC) and test it. This site uses a Welch t-test on log2(CPM + 1).",
    "Adjust the p-values of all genes together with BH to get padj.",
    "Call DE genes with thresholds chosen in advance, for example padj < 0.05 and |log2FC| > 1 (more than 2-fold). Draw a volcano plot: log2FC on the x-axis and -log10(p-value) on the y-axis, so the largest, most convincing changes sit in the top corners.",
    "Interpret and validate: do the results make biological sense, and do key genes hold up in new samples measured another way?"
  ],
  deeper: "This site's method is a teaching simplification. Real tools differ in three main ways. They model how count data behave: DESeq2 and edgeR fit the raw counts with the negative binomial distribution, and limma-voom fits a linear model on log-CPM with precision weights that depend on the count level. They estimate each gene's variability by borrowing information from all genes, which makes estimates far more stable with only 3 replicates. And they handle more complex designs, such as batches or paired samples, through a design formula. Their normalization methods (DESeq2's median-of-ratios, edgeR's TMM) are also less distorted by a few very highly expressed genes than plain CPM.",
  show: {
    intro: "This site's results for the named genes. In total 1,512 genes were tested; the call uses padj < 0.05 and log2FC > 1.",
    lang: "text",
    code: "gene     log2FC   p-value     padj      call\nHSPA1B    5.351   1.25e-06    0.00189   up\nHSPA1A    5.265   9.33e-06    0.00353   up\nDNAJB1    2.606   4.98e-05    0.0151    up\nHSPA6     5.401   6.92e-05    0.0174    up\nHSPH1     1.577   0.000253    0.0318    up\nBAG3      1.822   0.00937     0.149     not significant\nHSPB1     0.739   0.018       0.227     not significant\nFOS       1.796   0.397       0.863     not significant\nGAPDH    -0.104   0.149       0.629     no evidence of change\nACTB     -0.004   0.983       0.998     no evidence of change",
    notes: [
      "Five heat-shock genes pass both thresholds. Across all 1,512 genes, 18 have padj < 0.05.",
      "HSPB1 has p = 0.018 but padj = 0.227: below 0.05 for one gene, but not after accounting for 1,512 tests. Its log2FC (0.739) is also below 1.",
      "BAG3 rises about 3.5-fold in every heat replicate, yet padj = 0.149. With 3 replicates and this simple test, the evidence is not strong enough. Not significant does not mean unchanged.",
      "FOS has a large log2FC (1.796) but p = 0.397, because one heat replicate (heat_2) drives the rise. On a volcano plot it sits far to the right but low down.",
      "Housekeeping genes such as ACTB and GAPDH sit near log2FC 0, as expected. If they had moved, you would suspect a normalization or sample problem."
    ]
  },
  pitfall: {
    wrong: "Genes that are not on the significant list did not change.",
    right: "Not significant means this experiment did not find enough evidence. BAG3 and HSPB1 rise in every heat replicate but miss the cutoffs here; more replicates or a more powerful method might detect them. Report 'no evidence of change', not 'no change'."
  },
  try: { kind: "widget", widget: "rnaseq" },
  check: [
    {
      q: "On a volcano plot, a gene sits far to the right on the x-axis but near the bottom on the y-axis. What does that mean?",
      options: [
        { t: "A gene that decreased strongly", why: "Decreases sit on the left, at negative log2FC. This gene is on the right." },
        { t: "A gene with no change", why: "No change means log2FC near 0, the middle of the x-axis, not the far right." },
        { t: "A large average increase with weak evidence, for example because replicates disagree or counts are low", why: "Correct. The x-axis is log2FC and the y-axis is -log10(p), so far right and low means a big change with little confidence. FOS sits there." },
        { t: "A strong, highly significant increase", why: "High significance appears near the top of the plot. Low on the y-axis means a large p-value." }
      ],
      answer: 2
    },
    {
      q: "With thresholds padj < 0.05 and log2FC > 1, which named genes would you report as induced by heat?",
      options: [
        { t: "HSPA1A, HSPA1B and HSPA6 only", why: "DNAJB1 (log2FC 2.606, padj 0.0151) and HSPH1 (log2FC 1.577, padj 0.0318) pass both thresholds too." },
        { t: "HSPA1A, HSPA1B, HSPA6, DNAJB1 and HSPH1", why: "Correct. These five pass both thresholds." },
        { t: "HSPA1A, HSPA1B, HSPA6, DNAJB1, HSPH1 and HSPB1", why: "HSPB1 fails both thresholds: padj = 0.227 and log2FC = 0.739. Its raw p (0.018) is below 0.05, but raw p ignores the 1,512 tests." },
        { t: "HSPA1A, HSPA1B, HSPA6, DNAJB1, HSPH1 and FOS", why: "FOS has log2FC 1.796 but padj = 0.863. A large fold change without consistent replicates is not reliable evidence." }
      ],
      answer: 1
    },
    {
      q: "A colleague wants to call genes significant using raw p < 0.05, because this gives 191 genes instead of 18. What is the problem?",
      options: [
        { t: "There is no problem: a longer list means more discoveries", why: "More genes on a list are not more discoveries if many of them are false. Follow-up work on false leads wastes time and money." },
        { t: "Raw p-values are always wrong", why: "Raw p-values are correct for a single test. The problem is using them unadjusted when 1,512 tests are run at once." },
        { t: "About 76 of the 1,512 genes would pass p < 0.05 by chance even if nothing changed, so a large share of the 191 could be false positives", why: "Correct. 1,512 x 0.05 is about 76. The FDR cutoff keeps the expected share of false positives in the list small." }
      ],
      answer: 2
    }
  ],
  real: "Published RNA-seq studies usually run DE with DESeq2, edgeR or limma-voom in R, pass the significant genes to enrichment analysis and confirm key genes with qPCR or protein measurements. The typical output has the same kinds of columns you saw here, a log2 fold change, a p-value and an adjusted p-value for every gene, usually with a mean expression column as well, plus a volcano plot.",
  teach: {
    prompt: "Walk a friend through a differential expression analysis of the heat-shock data, from counts to a gene list.",
    points: ["Normalize counts so samples are comparable", "For each gene, estimate log2FC and test it", "Adjust p-values for the number of genes tested", "Use both padj and log2FC thresholds and read the volcano plot", "Not significant is not the same as unchanged"]
  }
});

BB.lessons.push({
  id: "f3-single-cell",
  what: "Single-cell RNA-seq (scRNA-seq) measures gene expression in thousands of individual cells separately, instead of one average per sample. The result is a count matrix with one value per gene per cell, usually counting molecules with unique molecular identifiers (UMIs).",
  problem: "Bulk RNA-seq averages over millions of cells. A tissue is a mixture, so a change in the bulk could mean that every cell changed, or that the mix of cell types changed. A rare cell type that makes up 1 percent of a sample barely affects the average. Measuring cells one at a time separates these possibilities.",
  care: "scRNA-seq is how researchers build cell atlases, find rare cells such as unusual immune cells inside a tumor, and see which cell types respond to a treatment. The KAUST course's RNA-seq case study (Module 4) covers it in Python, alongside the bulk analysis in R.",
  steps: [
    "The tissue is broken up into single cells. In common droplet-based methods, each cell is captured in a tiny droplet together with a bead that carries a unique DNA tag, the cell barcode.",
    "Inside the droplet, each captured RNA molecule is copied and labeled with the cell barcode (which cell) and a UMI (which original molecule). The droplets are then pooled and sequenced together.",
    "Software sorts reads by barcode, assigns them to genes and counts each UMI once, so PCR copies of one molecule are not counted many times. The result is a cell-by-gene matrix of UMI counts.",
    "The matrix is sparse: most entries are zero, because each cell contains little RNA and only a fraction of its molecules is captured. A zero often means 'not detected', not 'not expressed'.",
    "Quality control (QC) removes barcodes that are not good single cells: damaged cells (few genes detected and a high mitochondrial fraction), empty droplets (very few UMIs) and doublets (two cells sharing one barcode, with unusually many UMIs and genes and markers of two cell types)."
  ],
  deeper: "Why does a high mitochondrial fraction flag damage? When a cell's outer membrane breaks, cytoplasmic RNA leaks out, but transcripts inside mitochondria are protected by the mitochondrial membranes and stay behind, so the share of reads from mitochondrial genes (named MT- in human, such as MT-CO1) rises. Note also that thousands of cells from one person are not thousands of independent replicates: comparing conditions still needs several donors or samples per condition, often analyzed by adding up counts per sample and cell type ('pseudobulk') and applying bulk DE methods.",
  show: {
    intro: "QC in R with logical vectors. These six cells come from this site's toy blood data: detected genes and mitochondrial percentage for each.",
    lang: "r",
    code: "genes <- c(1096, 274, 904, 920, 190, 797)\nmito <- c(4.4, 41.3, 2.9, 7.2, 42.5, 4.2)\nkeep <- genes >= 300 & mito < 15\nkeep\nsum(keep)",
    output: "[1]  TRUE FALSE  TRUE  TRUE FALSE  TRUE\n[1] 4",
    notes: [
      "`genes >= 300` and `mito < 15` each give a logical vector with one TRUE or FALSE per cell, and `&` keeps only cells that pass both.",
      "Cells 2 and 5 fail: under 300 genes detected and over 40 percent of their UMIs from mitochondrial genes, the typical signature of damaged cells.",
      "`sum(keep)` counts the TRUE values, so 4 cells pass.",
      "In this toy dataset, the 392 healthy cells average about 900 detected genes and a 4 percent mitochondrial fraction, while the 26 damaged cells average about 250 genes and 23 to 46 percent. Real data is rarely this cleanly separated, and the toy data contains no doublets."
    ]
  },
  pitfall: {
    wrong: "A zero in a single-cell count matrix means the gene is switched off in that cell.",
    right: "Often the gene's molecules were simply not captured. Each cell holds very little RNA and only part of it is detected, so zeros are common even for expressed genes. Draw conclusions from patterns across many cells, not from one cell's zero."
  },
  try: { kind: "widget", widget: "singlecell", props: { mode: "qc" } },
  check: [
    {
      q: "Which cell is most likely damaged?",
      options: [
        { t: "Cell B: 230 genes detected, 38 percent mitochondrial", why: "Correct. Few genes and a high mitochondrial fraction is the classic sign of a broken cell that has lost its cytoplasmic RNA." },
        { t: "Cell A: 950 genes detected, 4 percent mitochondrial", why: "These values are typical of a healthy cell in this dataset." },
        { t: "Cell C: 2,900 genes detected, 5 percent mitochondrial, with both T cell (CD3E) and B cell (MS4A1) markers", why: "This barcode is unusual in the other direction: about three times the usual number of genes plus markers of two cell types points to a doublet, not to damage." }
      ],
      answer: 0
    },
    {
      q: "A barcode has about twice the usual number of UMIs and genes, and expresses both CD3E (T cells) and MS4A1 (B cells). What is it most likely to be?",
      options: [
        { t: "A damaged cell", why: "Damaged cells have fewer genes and UMIs than normal, and a high mitochondrial fraction. This barcode has more." },
        { t: "An empty droplet", why: "Empty droplets contain only a little free-floating RNA, so they have very few UMIs, not twice the usual number." },
        { t: "A doublet: two cells captured with the same barcode", why: "Correct. Two cells' worth of RNA plus the markers of two cell types is the typical doublet signature." },
        { t: "A new cell type that is half T cell and half B cell", why: "Mixed markers together with double the usual RNA content is what two cells sharing one barcode look like. Claiming a new cell type would need much stronger evidence." }
      ],
      answer: 2
    },
    {
      q: "A colleague applies a 5 percent mitochondrial cutoff that worked well for blood cells to heart tissue, and most heart muscle cells are removed. What went wrong?",
      options: [
        { t: "Heart tissue cannot be studied with single-cell methods", why: "Heart tissue is studied with single-cell and single-nucleus methods. The problem is a threshold copied from a different tissue." },
        { t: "The cutoff should have been stricter, such as 0.5 percent", why: "A stricter cutoff would remove even more healthy heart cells." },
        { t: "QC thresholds depend on tissue and technology; heart muscle cells naturally have many mitochondria, so their healthy fraction is higher", why: "Correct. Thresholds should be chosen by looking at the distributions in your own data." }
      ],
      answer: 2
    }
  ],
  real: "Large projects such as the Human Cell Atlas use scRNA-seq to map the cell types of the human body, and cancer studies use it to find rare drug-resistant or immune cells inside tumors. Common software includes Seurat in R and Scanpy in Python. Seurat stores genes as rows and cells as columns, while Scanpy's AnnData objects store cells as rows, so always check which way round a matrix is.",
  teach: {
    prompt: "Explain to a friend how single-cell RNA-seq differs from bulk RNA-seq, and how damaged cells and doublets are recognized.",
    points: ["Bulk measures an average; single-cell measures each cell", "Cell barcodes say which cell, UMIs say which molecule", "The matrix is sparse: many zeros are missed molecules", "Damaged cells have few genes and a high mitochondrial fraction; doublets have too many genes and mixed markers"]
  }
});

BB.lessons.push({
  id: "f3-clusters",
  what: "After QC, single-cell analysis groups cells with similar expression into clusters, draws them on a two-dimensional map such as UMAP for viewing, and names each cluster using marker genes: genes much more highly expressed in that cluster than in the others.",
  problem: "Each cell is described by thousands of numbers, one per gene. Nobody can see patterns in 20,000 dimensions, and many genes add only noise. Analysts need to compress the data, group similar cells and connect the groups to known biology.",
  care: "Cell-type maps from single-cell data appear in thousands of papers. Knowing what these pictures can and cannot show keeps you from reading stories into them.",
  steps: [
    "Normalize each cell (for example, scale every cell to the same total count and log-transform) and keep the highly variable genes, often around 2,000, which carry most of the biological signal.",
    "Reduce dimensions with PCA (principal component analysis). It summarizes those genes as a few dozen components, each capturing one main pattern of variation.",
    "Cluster: connect each cell to its most similar neighbors in PCA space, then split this network into communities with an algorithm such as Louvain or Leiden. A resolution setting controls how many clusters you get, so the number of clusters is a choice, not a fact of nature.",
    "Visualize with UMAP or t-SNE, which place similar cells near each other in two dimensions. They are for looking: distances between clusters and cluster sizes on the map are not reliable measurements.",
    "Find marker genes for each cluster and compare them with known markers to annotate cell types. Markers are rarely exclusive, so use combinations of genes, including which genes are absent."
  ],
  deeper: "PCA finds new axes that capture as much variation as possible: the first principal component (PC1) is the direction along which cells differ most, PC2 the next, and so on. UMAP and t-SNE are non-linear methods that preserve local neighborhoods well but distort the global layout; rerunning them with other settings or another random start can move clusters around. Clusters can also reflect technical effects, such as batches, damaged cells or doublets, or cell states such as the cell cycle, rather than cell types. Good practice checks that each cluster has distinct, biologically sensible markers.",
  show: {
    intro: "Average UMI counts per cell for the top markers of each cluster in this site's toy blood data, after QC (392 cells).",
    lang: "text",
    code: "cluster  cells  top markers (mean UMIs per cell)   likely cell type\n1        110    IL7R 3.2, CD3E 2.9                  CD4 T cells\n2         55    CD3E 3.0, CD8A 2.7, NKG7 1.6        CD8 T cells\n3         40    GNLY 6.3, NKG7 5.7, FCGR3A 1.6      NK cells\n4         60    CD79A 4.0, MS4A1 3.0                B cells\n5         85    LYZ 13.1, CD14 3.2                  CD14 monocytes\n6         30    LYZ 5.4, FCGR3A 4.0                 FCGR3A monocytes\n7         12    PPBP 9.1                            platelets",
    notes: [
      "Cluster numbers are arbitrary labels. The cell type comes from the markers, read against known biology.",
      "NKG7 appears in clusters 2 and 3: NK cells and cytotoxic CD8 T cells share killing machinery. CD3E, a T cell gene, separates them: present in cluster 2, absent in cluster 3.",
      "FCGR3A appears in clusters 3 and 6. LYZ marks cluster 6 as monocytes rather than NK cells, and CD14 versus FCGR3A separates the two kinds of monocyte.",
      "The toy map's 2D layout is hand-placed to imitate a UMAP plot. Real UMAP coordinates come from an algorithm and change with its settings."
    ]
  },
  pitfall: {
    wrong: "Clusters that are far apart on a UMAP plot are more different from each other than clusters that are close together, and a bigger blob means a more variable cell type.",
    right: "UMAP keeps neighbors together but does not preserve distances between clusters or their sizes, and the picture changes with its settings. Use it to look, then measure with the expression data: marker genes, PCA and quality metrics."
  },
  try: { kind: "widget", widget: "singlecell", props: { mode: "clusters" } },
  check: [
    {
      q: "A cluster has high MS4A1 and CD79A, and almost no CD3E or LYZ. What is it most likely to be?",
      options: [
        { t: "Platelets", why: "Platelets are marked by PPBP, not by MS4A1 and CD79A." },
        { t: "B cells", why: "Correct. MS4A1 and CD79A are classic B cell markers." },
        { t: "T cells", why: "T cells express CD3E, which this cluster lacks." },
        { t: "Monocytes", why: "Monocytes express LYZ (with CD14 or FCGR3A), which this cluster lacks." }
      ],
      answer: 1
    },
    {
      q: "A cluster has high NKG7 and GNLY. A colleague labels it 'NK cells'. Which extra check matters most?",
      options: [
        { t: "No check is needed, because NKG7 is an NK cell gene", why: "Markers are rarely exclusive. NKG7 is shared by NK cells and cytotoxic T cells, so another gene is needed to decide." },
        { t: "Check CD3E and CD8A: cytotoxic CD8 T cells also express NKG7 and GNLY, but NK cells lack CD3E", why: "Correct. A shared marker needs a second, distinguishing gene before the label can be trusted." },
        { t: "Check the cluster's size on the UMAP plot", why: "Cluster size on a UMAP plot is not a reliable measurement, and it cannot tell two cell types apart." }
      ],
      answer: 1
    },
    {
      q: "Raising the clustering resolution splits one T cell cluster into three. What is the right interpretation?",
      options: [
        { t: "The three clusters are definitely three different cell types", why: "Higher resolution always produces more clusters, whether or not the biology supports them." },
        { t: "The first clustering was wrong and must be discarded", why: "Neither resolution is 'the' truth. Different resolutions answer different questions, such as broad types versus subtypes." },
        { t: "The split may reflect real subtypes or just noise; keep it only if each new cluster has distinct, biologically meaningful markers", why: "Correct. Resolution is a setting, so the biology has to justify the extra clusters." }
      ],
      answer: 2
    }
  ],
  real: "Single-cell atlases annotate cell types this way, often combining manual review of marker genes with automated tools that compare each cell with labeled reference datasets. Marker genes found in these analyses are also used to design follow-up experiments, for example antibody panels that isolate a newly found cell population for further study.",
  teach: {
    prompt: "Explain to a friend how single-cell data goes from a big matrix to labeled cell types, and one way the UMAP picture can mislead.",
    points: ["PCA compresses thousands of genes into a few components", "Clustering groups similar cells, and the resolution is a choice", "Marker genes, used in combination, suggest cell types", "UMAP distances and cluster sizes are not reliable measurements"]
  }
});

BB.lessons.push({
  id: "f3-interpret",
  what: "Interpretation turns statistical results, such as a list of differentially expressed genes or a set of annotated clusters, into careful biological statements: what changed, how confident we are, what it might mean and how to test it.",
  problem: "A list of 500 genes is not an answer. It must be summarized, for example by asking which biological processes are over-represented, connected to what is already known, and limited to claims the design can support. The most common errors at this stage are claims about causes, protein levels or other conditions that the data never measured.",
  care: "Computation can be perfect and the conclusion still wrong. Careful interpretation is what makes a result useful to other scientists, and it is what reviewers check most closely.",
  steps: [
    "Restate exactly what was measured: RNA levels in cultured human cells after 1 hour at 42 C versus 37 C, three biological replicates each. Keep claims inside that frame: RNA, not protein; these cells; this time point.",
    "Report effect sizes with their evidence, not just significance. 'HSPA1A RNA rose about 38-fold (padj = 0.0035)' says far more than 'HSPA1A was significant'.",
    "Look for patterns with enrichment analysis: test whether genes from a known set, such as a Gene Ontology term or a pathway, appear in your list more often than chance would predict, compared with a background of all the genes you tested.",
    "Check against known biology and internal controls. Chaperone genes rising while housekeeping genes stay flat fits the known heat-shock response. A surprising result should first trigger checks of data quality, and then become a hypothesis.",
    "Plan validation. Confirm key genes with an independent method in new samples (qPCR for RNA; western blot or mass spectrometry for protein), and test causes with experiments that change one factor, such as blocking the heat-shock transcription factor HSF1."
  ],
  deeper: "There are two common kinds of enrichment analysis. Over-representation analysis takes a cut list of significant genes and asks, with a test such as Fisher's exact test, whether each gene set appears in it more often than expected from the background. Gene set enrichment analysis (GSEA) uses all genes ranked by their statistic and asks whether a set's genes gather near the top or the bottom of the ranking. Both test thousands of gene sets, so they need multiple-testing correction too. Gene sets also overlap heavily, so several 'different' enriched terms often reflect the same handful of genes.",
  show: {
    intro: "Five claims someone might make from the heat-shock results, each with a verdict.",
    lang: "text",
    code: "1. \"Heat raised HSPA1A RNA about 38-fold in these cells (padj = 0.0035).\"\n   Justified: it names what was measured, the effect size and the evidence.\n\n2. \"Heat shock raises HSP70 protein levels.\"\n   Not shown: RNA was measured, not protein. A good hypothesis to test.\n\n3. \"FOS does not respond to heat.\"\n   Over-claim: not significant means weak evidence, not no change.\n\n4. \"HSPA1A is what lets cells survive heat.\"\n   Not shown: survival was not measured, and a causal claim needs an\n   experiment that removes or blocks HSPA1A.\n\n5. \"The heat-induced genes are enriched for protein folding.\"\n   Reasonable, if tested against all the genes that were tested,\n   with corrected p-values.",
    notes: [
      "A justified claim names the measurement (RNA), the system (these cultured cells, 1 hour at 42 C), the effect size and the evidence.",
      "Claims 2 and 4 may well be true, but this experiment did not test them. They are hypotheses for the next experiment. (HSPA1A encodes a member of the HSP70 protein family.)",
      "Claim 5 depends on how the enrichment was done: the background must be the genes that could have been detected, not the whole genome."
    ]
  },
  pitfall: {
    wrong: "My gene list is enriched for 'immune response' (p = 0.001) compared with all 20,000 human genes, so the treatment activated immunity.",
    right: "Two problems. The background should be the genes actually expressed and tested in your experiment: in immune cells, immune genes are common among the expressed genes anyway, so comparing with the whole genome makes them look enriched. And enrichment suggests that a process is involved; it does not show that the process was activated or that it matters."
  },
  try: { kind: "widget", widget: "methods" },
  check: [
    {
      q: "Which conclusion is justified by the heat-shock RNA-seq experiment (3 cultures per condition, 1 hour at 42 C)?",
      options: [
        { t: "RNA levels of several chaperone genes rose strongly in these cells after 1 hour at 42 C", why: "Correct. It stays within what was measured: RNA, in these cells, at this time point." },
        { t: "Heat shock raises chaperone protein levels in all human tissues", why: "This goes beyond the data twice: the experiment measured RNA, not protein, and only in one kind of cultured cell." },
        { t: "HSPA1A is required for cells to survive heat", why: "The experiment shows that HSPA1A RNA rises, not that the gene is needed. Testing that needs an experiment that removes or blocks HSPA1A and measures survival." },
        { t: "Genes not on the significant list do not respond to heat", why: "Not significant means not enough evidence. BAG3 and HSPB1 rise in every heat replicate but miss the cutoffs." }
      ],
      answer: 0
    },
    {
      q: "Your 200 significant genes include 12 of the 40 genes in the set 'response to unfolded protein'; about 1 would be expected by chance. What is the best interpretation?",
      options: [
        { t: "The set is over-represented, which suggests protein-folding stress is part of the response; check that the right background was used and that p-values were corrected for the many sets tested", why: "Correct. Enrichment points to a process, and its strength depends on a fair comparison." },
        { t: "All 40 genes in the set must have changed", why: "Only 12 of the 40 are on the list. Enrichment means the set is over-represented, not that every member changed." },
        { t: "The 12 genes are the cause of the whole response", why: "Enrichment describes which processes are represented in the list. It does not identify causes." }
      ],
      answer: 0
    },
    {
      q: "A study describes its most significant gene (the smallest padj) as 'the master regulator of the disease'. What is the main problem?",
      options: [
        { t: "Nothing: the most significant gene is the most important one by definition", why: "Highly expressed genes with consistent changes get tiny p-values whether or not they drive anything." },
        { t: "The gene should be ignored because its p-value is too small to be real", why: "Very small p-values can be perfectly real. The problem is the leap from 'changed' to 'causes'." },
        { t: "The smallest p-value means the strongest evidence of a change, not the most important or causal gene; it could even be a consequence of the disease", why: "Correct. Significance measures confidence that a change is real, not its role." }
      ],
      answer: 2
    }
  ],
  real: "Enrichment tools such as clusterProfiler in R, or web tools such as g:Profiler, test gene sets from Gene Ontology, KEGG and Reactome. A good DE study ends with a short list of well-supported findings, each with an effect size and an adjusted p-value, an enrichment summary, validation of key genes in new samples by qPCR or protein measurement, and a clear statement of what was not tested.",
  teach: {
    prompt: "Explain to a friend how to turn the heat-shock gene list into careful biological conclusions.",
    points: ["State what was measured and in which system", "Report effect sizes together with adjusted p-values", "Use enrichment analysis against the right background", "Separate what was shown from hypotheses, and validate key genes independently"]
  }
});

BB.lessons.push({
  id: "f3-workflows",
  what: "A workflow, or pipeline, is the full chain of programs that turns raw sequencing files into results, run in a fixed order with recorded settings. Real projects use well-tested tools for each step and often a workflow manager to run them reproducibly.",
  problem: "A real project can have hundreds of samples, each passing through five to ten programs with many settings. Running every step by hand is slow, error-prone and impossible to reproduce exactly. A written workflow makes each step explicit, repeatable and checkable.",
  care: "This lesson goes beyond the three prerequisite courses. You do not need to master these tools now, but knowing the map lets you read the methods section of a paper and understand where a count matrix comes from.",
  steps: [
    "Check the raw reads (FASTQ files). FastQC writes a quality report for each file, and MultiQC combines all the reports into one page so problem samples stand out.",
    "Optionally trim adapters and low-quality ends from the reads, for example with fastp.",
    "Turn reads into counts. Either align reads to the genome with a splice-aware aligner such as STAR and count the reads on each gene with featureCounts, or estimate transcript abundances directly with a fast quantifier such as Salmon and add them up per gene. The result is the count matrix.",
    "Analyze in R: differential expression with DESeq2, edgeR or limma, then enrichment analysis, for example with clusterProfiler.",
    "Single-cell data follow a parallel path: a tool such as Cell Ranger (for 10x Genomics data) turns reads into a cell-by-gene UMI matrix, and Seurat (R) or Scanpy (Python) handle QC, normalization, PCA, clustering, UMAP and marker genes.",
    "A workflow manager such as Snakemake or Nextflow runs all the steps in the right order, reruns only what changed and records what was done. Software versions are fixed with environments (conda) or containers (Docker, Apptainer)."
  ],
  deeper: "Workflow managers work from rules: each rule names its input files, its output files and the command that turns one into the other. The manager works out the order from these dependencies, runs independent samples in parallel on a laptop, a computing cluster or the cloud, and skips steps whose outputs are already up to date. Community pipelines such as nf-core/rnaseq package a complete, tested RNA-seq workflow with sensible defaults. Results also depend on reference files: the genome sequence and the gene annotation must be matching versions (for example GRCh38 with one Ensembl release), and those versions belong in the methods section.",
  show: {
    intro: "The bulk RNA-seq path from raw reads to interpretation, with example files and common tools at each stage.",
    lang: "text",
    code: "stage            example files                   common tools\nraw reads        ctrl_1_R1.fastq.gz              FastQC, MultiQC (quality reports)\ntrimmed reads    ctrl_1_trimmed.fastq.gz         fastp\nalignments       ctrl_1.bam                      STAR (splice-aware aligner)\ncount matrix     counts.tsv (genes x samples)    featureCounts\nDE results       results.csv (log2FC, padj)      DESeq2, edgeR or limma in R\ninterpretation   enriched terms, plots           clusterProfiler, volcano plots",
    notes: [
      "Each stage's output is the next stage's input, so a problem early on, such as a bad sample or the wrong genome version, flows into everything after it.",
      "A BAM file stores, in compressed binary form, where each read aligned in the genome.",
      "Salmon offers a shortcut: it goes from reads to transcript abundances without a separate alignment step, and those estimates are added up into gene-level counts.",
      "This site's `counts.tsv` sits at the count matrix stage. The statistics and differential expression lessons covered the stages below it."
    ]
  },
  pitfall: {
    wrong: "If the pipeline ran to the end without errors, the results are correct.",
    right: "Pipelines happily finish with the wrong genome version, a swapped sample sheet or a failed sample. Check the QC reports (MultiQC), the fraction of reads that aligned, whether replicates group together and whether known control genes behave as expected."
  },
  try: {
    kind: "parsons",
    prompt: "Put the steps of a bulk RNA-seq workflow in order, from raw reads to biological interpretation.",
    lang: "text",
    lines: [
      "Check the quality of every FASTQ file (FastQC, summarized with MultiQC)",
      "Trim adapters and low-quality bases from the reads (fastp)",
      "Align the reads to the reference genome (STAR)",
      "Count the reads on each gene to build the count matrix (featureCounts)",
      "Test every gene for differential expression (DESeq2)",
      "Test the significant genes for enriched pathways (clusterProfiler)"
    ],
    explain: "Each step needs the output of the one before it: quality reports guide trimming, trimmed reads are aligned, alignments are counted, counts are tested, and the significant genes are interpreted. In practice, quality checks are often repeated after trimming and after alignment too."
  },
  check: [
    {
      q: "You have FastQC reports for 48 samples. Which tool gathers them into one summary so that problem samples stand out?",
      options: [
        { t: "featureCounts", why: "featureCounts counts the reads on each gene from alignments." },
        { t: "MultiQC", why: "Correct. MultiQC collects reports from FastQC and many other tools into a single page." },
        { t: "STAR", why: "STAR aligns reads to a genome. It does not summarize quality reports." },
        { t: "DESeq2", why: "DESeq2 tests genes for differential expression, long after quality checks." }
      ],
      answer: 1
    },
    {
      q: "Why do labs run pipelines with Snakemake or Nextflow instead of typing each command?",
      options: [
        { t: "The workflow records every step and setting, runs steps in the right order, reruns only what changed and scales to many samples", why: "Correct. These are the main benefits: order, record-keeping, efficiency and reproducibility." },
        { t: "Workflow managers make the statistics more accurate", why: "They run the same tools and do not change any method. Their value is order, record-keeping and reproducibility." },
        { t: "They remove the need for quality control", why: "They make it easy to run QC on every sample, but a person still has to read the reports." }
      ],
      answer: 0
    },
    {
      q: "A pipeline finished without errors, but MultiQC shows that 20 percent of sample 7's reads aligned, compared with about 90 percent for the others. What should you do?",
      options: [
        { t: "Investigate sample 7 (contamination, degraded RNA, wrong species or reference) before the DE analysis, and exclude it only with a documented reason", why: "Correct. A low alignment rate is a warning sign that needs an explanation before the sample is used." },
        { t: "Nothing, because the pipeline did not report an error", why: "Pipelines report crashes, not biological or technical problems. A person must read the QC." },
        { t: "Normalize the counts, which will fix the difference", why: "Normalization corrects sequencing depth. It cannot fix a sample whose reads mostly came from something other than the expected genome." }
      ],
      answer: 0
    }
  ],
  real: "Community pipelines such as nf-core/rnaseq let labs run the whole bulk RNA-seq path with one command and a sample sheet, and the methods sections of papers list each tool and its version. Reproducing a published analysis usually starts by rerunning its workflow on the shared raw data.",
  teach: {
    prompt: "Describe the path from raw reads to a list of differentially expressed genes, naming one tool for each step, and explain why a workflow manager helps.",
    points: ["QC with FastQC and MultiQC", "Alignment and counting, or direct quantification", "DE analysis in R, then enrichment", "Workflow managers record, order and rerun steps reproducibly"]
  }
});
