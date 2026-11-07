/* Practice bank, Foundation 3 second half: statistics (st-), differential expression, single-cell, interpretation and workflows (sc-).
   Written to tools/CONTENT_GUIDE.md. Items with `verify` are executed with Rscript by tools/verify_code.py. */
window.BB = window.BB || {};
BB.questions = BB.questions || [];

BB.questions.push(

  /* ---------------- ST.EDA: exploratory data analysis ---------------- */
  {
    id: "st-001", obj: ["ST.EDA"], lesson: "f3-eda", level: 1,
    q: "You want to see the shape of one numeric variable, for example a gene's expression across 200 tumors: where most values lie, whether there is a long tail, whether there are two peaks. Which plot fits best?",
    options: [
      { t: "A scatter plot", why: "A scatter plot needs two variables, one per axis. Here there is only one." },
      { t: "A line plot of the values in the order they appear in the file", why: "The file order is arbitrary, so lines joining the values show nothing about the distribution." },
      { t: "A histogram", why: "Correct. A histogram splits the range into bins and shows how many values fall in each, which reveals the shape of the distribution." }
    ],
    answer: 2,
    explain: "A histogram (`hist()` in R) shows a distribution: its center, spread, skew and any separate peaks. Boxplots summarize it more compactly and are better for comparing groups, but they hide features such as two peaks."
  },
  {
    id: "st-002", obj: ["ST.EDA"], lesson: "f3-eda", level: 1,
    q: "What does this R code print?",
    code: { lang: "r", src: "x <- c(2, 4, 4, 5, 10)\nmean(x)" },
    options: [
      { t: "[1] 4", why: "4 is the median (the middle of the sorted values) and also the most common value. `mean()` adds the values and divides by how many there are." },
      { t: "[1] 25", why: "25 is the sum, which `sum()` would print. `mean()` divides it by the number of values." },
      { t: "[1] 10", why: "10 is the largest value, which `max()` would print." },
      { t: "[1] 5", why: "Correct. The values add up to 25 and there are 5 of them, so the mean is 25 / 5 = 5." }
    ],
    answer: 3,
    verify: {},
    explain: "`mean()` adds all values (25) and divides by the count (5). The mean (5) is above the median (4) because the value 10 pulls it up."
  },
  {
    id: "st-003", obj: ["ST.EDA"], lesson: "f3-eda", level: 2,
    q: "One sample's measurement is missing and stored as `NA`. What does this code print?",
    code: { lang: "r", src: "x <- c(3, 5, 4, 6, NA)\nmean(x)" },
    options: [
      { t: "[1] NA", why: "Correct. In R, a calculation that involves an unknown value gives an unknown result. `mean(x, na.rm = TRUE)` would skip the NA and print 4.5." },
      { t: "[1] 4.5", why: "That is the result after removing the NA with `na.rm = TRUE`. By default R does not silently drop missing values." },
      { t: "[1] 3.6", why: "This treats NA as 0 (18 / 5 = 3.6). R never treats a missing value as zero, which would distort the result." },
      { t: "Error: missing values are not allowed", why: "`mean()` does not stop with an error here. It returns NA to signal that the answer is unknown." }
    ],
    answer: 0,
    verify: {},
    explain: "NA means 'not available', and R propagates it: the mean of values that include an unknown is unknown. Checking for NAs is part of EDA. Decide deliberately whether to remove them (`na.rm = TRUE`) and report how many there were."
  },
  {
    id: "st-004", obj: ["ST.EDA"], lesson: "f3-eda", level: 2,
    q: "R prints this summary of one gene's expression (CPM) across 200 tumor samples. What does it tell you?",
    code: { lang: "text", src: "   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.\n   0.00    0.40    1.10    6.80    2.00  310.00" },
    options: [
      { t: "A typical sample has an expression of about 6.8 CPM", why: "Three quarters of the samples are at or below 2.0, so 6.8 is not typical. A few very high values pull the mean up." },
      { t: "The values are symmetric, because the median lies between the quartiles", why: "The median always lies between the quartiles. Symmetry would need the mean close to the median and similar distances to both tails; here the upper tail is far longer." },
      { t: "The maximum of 310 is an error and should be deleted", why: "It may be real: some tumors can have very high expression of a gene, for example when the gene is amplified. Investigate before deleting anything." },
      { t: "Most samples have low values and a few are extremely high: the distribution is right-skewed, so the median describes a typical sample better than the mean", why: "Correct. Three quarters of the samples are at or below 2.0, yet the mean is 6.8 because a few huge values pull it up." }
    ],
    answer: 3,
    explain: "Compare the mean (6.8) with the median (1.1), and the third quartile (2.0) with the maximum (310). A mean far above the median plus a long upper tail means right skew. Expression data are often skewed like this, which is why they are usually plotted on a log scale."
  },
  {
    id: "st-005", obj: ["ST.EDA"], lesson: "f3-eda", level: 3,
    q: "In a PCA plot of 8 RNA-seq samples (4 control, 4 treated), three treated samples group together, but the fourth treated sample sits right among the controls. What should you do first?",
    options: [
      { t: "Delete it, because it is an outlier", why: "Deleting it without understanding why throws away information and may hide a bigger problem, such as other swapped samples. Investigate first and report what you decide." },
      { t: "Check the sample sheet and lab records for a label swap or a failed treatment before running any test", why: "Correct. A sample that groups with the other condition is a classic sign of mislabeling or a treatment that did not work, and the answer decides whether to relabel, exclude or keep it." },
      { t: "Relabel it as a control, since it clearly looks like one", why: "Changing labels to fit the expected pattern is circular reasoning. Only evidence, such as lab records or a genotype check, can justify relabeling." },
      { t: "Run the test anyway, because with 4 replicates one odd sample does not matter", why: "One wrong sample in a group of 4 can greatly reduce power or create false results. EDA exists to catch exactly this." }
    ],
    answer: 1,
    explain: "Sample-level EDA (PCA, correlation heatmaps, library sizes) mainly exists to catch mislabeling, failed samples and batch effects. Decisions about a suspicious sample should rest on evidence and be documented, not chosen to produce the expected result."
  },

  /* ---------------- ST.VAR: variability and replicates ---------------- */
  {
    id: "st-006", obj: ["ST.VAR"], lesson: "f3-variability", level: 1,
    q: "What does the standard deviation of a set of replicate measurements describe?",
    options: [
      { t: "How many replicates were measured", why: "That is the sample size, n. The SD describes spread, whatever n is." },
      { t: "How far the values typically lie from their mean", why: "Correct. The SD is a typical distance from the mean, in the same units as the data." },
      { t: "The average of the values", why: "That is the mean. The SD describes the spread around the mean." },
      { t: "The difference between the highest and the lowest value", why: "That is the range. The range depends on only two values; the SD uses all of them." }
    ],
    answer: 1,
    explain: "The SD is the square root of the variance, which averages the squared distances from the mean (dividing by n - 1). Because it is in the original units, it reads as a typical distance from the mean."
  },
  {
    id: "st-007", obj: ["ST.VAR"], lesson: "f3-variability", level: 2,
    q: "What does this R code print?",
    code: { lang: "r", src: "x <- c(4, 6, 8)\nsd(x)" },
    options: [
      { t: "[1] 6", why: "6 is the mean. The SD measures the spread around it." },
      { t: "[1] 2", why: "Correct. The mean is 6, the squared distances are 4, 0 and 4, their sum 8 divided by n - 1 = 2 gives a variance of 4, and its square root is 2." },
      { t: "[1] 4", why: "4 is the variance (`var(x)`). The SD is its square root." },
      { t: "[1] 1.632993", why: "This divides by n (3) instead of n - 1 (2). R's `sd()` uses n - 1, the usual choice for a sample." }
    ],
    answer: 1,
    verify: {},
    explain: "`sd()` is the square root of `var()`, and `var()` divides the sum of squared distances from the mean by n - 1. For 4, 6 and 8: (4 + 0 + 4) / 2 = 4, and the square root of 4 is 2."
  },
  {
    id: "st-008", obj: ["ST.VAR"], lesson: "f3-variability", level: 2,
    q: "Two genes have the same average CPM after heat shock. Gene A's heat replicates are 240, 250 and 245; gene B's are 100, 400 and 235. Which statement is correct?",
    options: [
      { t: "Both means are equally reliable, because they are equal", why: "Equal means can come with very different spreads. The spread decides how much a new set of replicates could differ." },
      { t: "Gene B is more strongly induced, because one replicate reached 400", why: "A single high replicate is not evidence of stronger induction. The averages are the same; gene B is just noisier." },
      { t: "Gene B's mean is much less certain, because its replicates are far more spread out", why: "Correct. Gene A's SD is 5 CPM and gene B's is about 150 CPM, so a new set of gene B replicates could give a very different average." }
    ],
    answer: 2,
    explain: "Both means are 245 CPM, but the SDs are 5 and about 150. The uncertainty of a mean grows with the SD, so any comparison involving gene B needs more replicates to reach the same confidence."
  },
  {
    id: "st-009", obj: ["ST.VAR"], lesson: "f3-variability", level: 3,
    q: "You want to know whether a drug changes gene expression in mouse liver. Which design supports that conclusion best?",
    options: [
      { t: "4 mice per group (drug or control), with each liver sequenced once", why: "Correct. Separate animals in each group are biological replicates, so the comparison covers animal-to-animal variation." },
      { t: "1 mouse per group, with each liver sample sequenced 4 times", why: "Four sequencing runs of one sample are technical replicates. They cannot show whether another mouse would respond the same way." },
      { t: "1 mouse per group, with 4 pieces of each liver sequenced separately", why: "Pieces of one liver come from the same animal, so they share its genetics, health and handling. They do not replicate the comparison between animals." }
    ],
    answer: 0,
    explain: "Only independent biological replicates (separate animals per group) capture the variation that a conclusion about 'mice given the drug' has to cover. Technical replicates and repeated samples from one animal measure smaller sources of noise."
  },
  {
    id: "st-010", obj: ["ST.VAR"], lesson: "f3-variability", level: 3,
    q: "Your replicates have an SD of 0.6 (log2 units) with n = 4 per group. You want to halve the standard error of each group mean. How many replicates per group do you need?",
    options: [
      { t: "8", why: "Doubling n only shrinks the standard error by a factor of sqrt(2), about 1.4, not 2." },
      { t: "6", why: "Going from 4 to 6 replicates shrinks the standard error by only about 18 percent, because sqrt(4 / 6) is about 0.82." },
      { t: "2", why: "Fewer replicates make the standard error larger, not smaller." },
      { t: "16", why: "Correct. The standard error is SD / sqrt(n). To halve it, sqrt(n) must double, so n must be 4 times larger: 4 x 4 = 16." }
    ],
    answer: 3,
    explain: "SE = SD / sqrt(n). With SD 0.6, n = 4 gives SE 0.3 and n = 16 gives SE 0.15. Precision improves with the square root of the number of replicates, so each extra replicate helps a little less than the one before."
  },

  /* ---------------- ST.FC: fold change ---------------- */
  {
    id: "st-011", obj: ["ST.FC"], lesson: "f3-foldchange", level: 1,
    q: "In a differential expression table, a gene has log2 fold change = 1 (treated versus control). What does that mean?",
    options: [
      { t: "Expression rose by 1 CPM", why: "A fold change is a ratio, not a difference in units. +1 on the log2 scale means one doubling, whatever the starting level." },
      { t: "Expression rose by 10 percent", why: "That would be log2(1.1), about 0.14. log2FC 1 is a 100 percent increase." },
      { t: "The gene is significant", why: "log2FC is an effect size. Significance comes from the p-value or the adjusted p-value." },
      { t: "Expression doubled in the treated samples", why: "Correct. 2 to the power 1 is 2." }
    ],
    answer: 3,
    explain: "log2FC counts doublings: 1 = 2-fold up, 2 = 4-fold up, -1 = half. It says how big a change is, not how certain it is."
  },
  {
    id: "st-012", obj: ["ST.FC"], lesson: "f3-foldchange", level: 2,
    q: "A gene averages 40 CPM in control and 5 CPM after treatment. What does this code print?",
    code: { lang: "r", src: "log2(5 / 40)" },
    options: [
      { t: "[1] -3", why: "Correct. 5 / 40 = 0.125 = 1/8, and 8 is 2 x 2 x 2, so log2 gives -3: three halvings." },
      { t: "[1] 3", why: "That is log2(40 / 5), the comparison the wrong way round. Treated / control is below 1, so its log is negative." },
      { t: "[1] 0.125", why: "That is the plain fold change. log2 converts it to -3." },
      { t: "[1] -35", why: "That is the difference in CPM. Fold changes are ratios." }
    ],
    answer: 0,
    verify: {},
    explain: "Divide treated by control (5 / 40 = 0.125) and take log2 to get -3, an 8-fold decrease. The order of division sets the sign, so always check which condition is the reference."
  },
  {
    id: "st-013", obj: ["ST.FC"], lesson: "f3-foldchange", level: 2,
    q: "A gene averages 7 CPM in controls and 0 CPM after treatment. This code adds a pseudocount of 1. What does it print?",
    code: { lang: "r", src: "log2((0 + 1) / (7 + 1))" },
    options: [
      { t: "[1] -Inf", why: "That is what `log2(0 / 7)` gives: the log of zero is minus infinity. The pseudocount is there to prevent exactly this." },
      { t: "[1] NaN", why: "NaN (not a number) comes from impossible operations such as 0 / 0. Here the ratio is 1/8, a normal positive number." },
      { t: "[1] -7", why: "That subtracts instead of dividing. A fold change is a ratio, and 1/8 means three halvings." },
      { t: "[1] -3", why: "Correct. (0 + 1) / (7 + 1) = 1/8, and log2(1/8) = -3." }
    ],
    answer: 3,
    verify: {},
    explain: "Without a pseudocount, a gene that drops to zero has an infinite log2FC, which breaks plots and rankings. Adding 1 to both values gives a finite -3. The price is that fold changes of low-expressed genes are pulled toward 0."
  },
  {
    id: "st-014", obj: ["ST.FC"], lesson: "f3-foldchange", level: 3,
    q: "Gene A goes from 1 to 4 CPM and gene B from 1,000 to 4,000 CPM, each measured in three replicates per group. Both have log2FC = 2. Which statement is correct?",
    options: [
      { t: "Gene B changed more, because its difference is 3,000 CPM", why: "Fold changes compare ratios: both genes rose 4-fold. The difference in CPM mostly reflects how highly each gene is expressed." },
      { t: "Both are equally reliable, because they have the same log2FC", why: "log2FC says nothing about certainty. At a few CPM, a handful of reads more or less changes the ratio a lot; at thousands of CPM, they hardly matter." },
      { t: "They have the same effect size, but gene B's estimate is far more reliable because it rests on many more reads", why: "Correct. With a library of about 20 million reads, 1 CPM is about 20 reads, so random sampling noise is large for gene A and tiny for gene B." }
    ],
    answer: 2,
    explain: "Effect size and certainty are separate. Low counts carry large random noise, so the fold changes of low-expressed genes are unstable. That is why DE tools work with counts rather than ratios alone, and why DESeq2 can shrink unreliable log2FC values toward zero."
  },
  {
    id: "st-015", obj: ["ST.FC"], lesson: "f3-foldchange", level: 3,
    q: "A results table reports log2FC = -1.58 for a gene. About how large is the change?",
    options: [
      { t: "About 1.58 times lower", why: "log2FC is an exponent. The fold change is 2 to the power 1.58, which is about 3." },
      { t: "About 58 percent lower", why: "Reading the decimals as a percentage mixes up the log scale with a linear one. One third of the original is about 67 percent lower." },
      { t: "About 3 times higher", why: "The minus sign shows a decrease. +1.58 would be about 3 times higher." },
      { t: "About 3 times lower in the treated samples", why: "Correct. 2 to the power 1.58 is about 3, and the minus sign means a decrease, so treated is about one third of control." }
    ],
    answer: 3,
    explain: "Convert back with 2 to the power |log2FC| and read the sign for the direction. 2 to the power 1.58 is about 3, so -1.58 is about a 3-fold decrease: treated is about one third of control, a drop of about 67 percent."
  },
  {
    id: "st-016", obj: ["ST.FC"], lesson: "f3-foldchange", level: 1,
    q: "A gene rises 8-fold after treatment. What is its log2 fold change?",
    options: [
      { t: "0.125", why: "That is 1/8, the plain fold change for an 8-fold decrease, not a log value." },
      { t: "3", why: "Correct. 2 x 2 x 2 = 8, so 8-fold is three doublings." },
      { t: "8", why: "8 is the fold change itself. Its log2 is 3." },
      { t: "4", why: "log2FC counts doublings, and 8-fold is three doublings. A log2FC of 4 would be 16-fold." }
    ],
    answer: 1,
    explain: "log2(8) = 3. Useful anchors: 2-fold = 1, 4-fold = 2, 8-fold = 3, 16-fold = 4, and the same numbers with a minus sign for decreases."
  },

  /* ---------------- ST.TEST: hypothesis tests ---------------- */
  {
    id: "st-017", obj: ["ST.TEST"], lesson: "f3-tests", level: 1,
    q: "A t-test compares one gene's expression at 37 C and at 42 C. What is the null hypothesis?",
    options: [
      { t: "The replicates are technical replicates", why: "That describes the design. The null hypothesis is a statement about the group means." },
      { t: "The mean expression is the same at both temperatures", why: "Correct. The null hypothesis is the 'no difference' starting point that the test looks for evidence against." },
      { t: "The gene is strongly induced by heat", why: "That is a specific alternative. The null hypothesis states no difference." },
      { t: "The p-value is below 0.05", why: "The p-value is the output of the test, not a hypothesis about the biology." }
    ],
    answer: 1,
    explain: "The null hypothesis (H0) states that the group means are equal; the alternative hypothesis (H1) states that they differ. The p-value measures how surprising the data would be if H0 were true."
  },
  {
    id: "st-018", obj: ["ST.TEST"], lesson: "f3-tests", level: 2,
    q: "R's `t.test()` runs Welch's t-test by default. Which line could this code print?",
    code: { lang: "r", src: "ctrl <- c(5.1, 4.8, 5.3, 5.0)\ntrt <- c(5.6, 5.9, 5.2, 6.0)\nround(t.test(trt, ctrl)$p.value, 3)" },
    options: [
      { t: "[1] 0.031", why: "Correct. `$p.value` extracts the p-value, a probability between 0 and 1. The treated values are consistently higher, so p is small." },
      { t: "[1] 3.01", why: "3.01 is the t statistic (`$statistic`), the difference in means divided by its standard error. A p-value can never be larger than 1." },
      { t: "[1] 0.969", why: "This is 1 minus the p-value. It is not the probability that the groups differ, and p-values are not turned into that by subtraction." },
      { t: "[1] -0.031", why: "p-values are probabilities, so they cannot be negative. A minus sign can appear on the t statistic, never on p." }
    ],
    answer: 0,
    verify: {},
    explain: "`t.test()` returns a result object: `$p.value` holds the p-value and `$statistic` the t value (3.01 here). Welch's version, the default, does not assume that the two groups have equal variances."
  },
  {
    id: "st-019", obj: ["ST.TEST"], lesson: "f3-tests", level: 2,
    q: "R prints this ANOVA table for the weights of mice on three diets (3 mice per diet). What can you conclude at alpha = 0.05?",
    code: { lang: "text", src: "> summary(aov(weight ~ diet))\n            Df Sum Sq Mean Sq F value Pr(>F)\ndiet         2  8.647   4.323   6.529 0.0312 *\nResiduals    6  3.973   0.662" },
    options: [
      { t: "All three diets differ from each other", why: "ANOVA tests one overall null hypothesis, that all means are equal. Rejecting it says at least one mean differs, not that every pair does." },
      { t: "Diet A differs from diet B", why: "The ANOVA table does not compare specific pairs. Post hoc tests, such as Tukey's test (`TukeyHSD()` in R), do that." },
      { t: "Diet has no effect, because the F value is small", why: "The decision comes from the p-value in the Pr(>F) column, and 0.0312 is below 0.05." },
      { t: "At least one diet's mean weight differs from the others; a post hoc test is needed to find which", why: "Correct. p = 0.0312 is below 0.05, so the null hypothesis that all three means are equal is rejected." }
    ],
    answer: 3,
    explain: "Read the Pr(>F) column: 0.0312 < 0.05, so not all diet means are equal. ANOVA does not say which ones differ; post hoc comparisons with a correction for multiple comparisons, such as Tukey's test, answer that."
  },
  {
    id: "st-020", obj: ["ST.TEST"], lesson: "f3-tests", level: 3,
    q: "Blood pressure is measured in the same 12 patients before and after a drug. Which test fits?",
    options: [
      { t: "A Pearson correlation between before and after", why: "Correlation would show whether patients with high values before also have high values after. It does not test whether the drug changed the average." },
      { t: "A paired t-test on the before and after values", why: "Correct. Each patient acts as their own control: the test looks at the 12 within-patient differences, which removes the large differences between patients." },
      { t: "Welch's two-sample t-test, treating before and after as independent groups", why: "The values come from the same people, so they are not independent. Ignoring the pairing wastes power, because differences between patients stay in the noise." },
      { t: "One-way ANOVA", why: "ANOVA compares three or more independent groups. Here there are two measurements on the same subjects." }
    ],
    answer: 1,
    explain: "Paired designs (the same subject in two conditions) use a paired t-test, `t.test(after, before, paired = TRUE)` in R, which tests whether the mean within-subject difference is zero."
  },
  {
    id: "st-021", obj: ["ST.TEST"], lesson: "f3-tests", level: 3,
    q: "An RNA-seq study with 50 samples per group finds a gene with log2FC = 0.05 and p = 0.0001. Which interpretation is best?",
    options: [
      { t: "The change is probably real but tiny (about 3.5 percent), so it may not matter biologically", why: "Correct. 2 to the power 0.05 is about 1.035. With 50 samples per group, even tiny changes can reach small p-values." },
      { t: "This is a large, important change, because the p-value is very small", why: "A small p-value shows confidence that some change exists, not that it is large. Effect size and significance are different things." },
      { t: "The result must be a false positive, because the change is so small", why: "Small effects can be perfectly real. With many replicates, a test has enough power to detect them." }
    ],
    answer: 0,
    explain: "Significance and effect size answer different questions. Report both, and judge biological importance from the effect size and the biology, not from p."
  },
  {
    id: "st-022", obj: ["ST.TEST"], lesson: "f3-tests", level: 3,
    q: "With 3 replicates per group, a gene gives p = 0.08. A colleague writes 'the treatment has no effect on this gene'. What is wrong?",
    options: [
      { t: "A non-significant result means the evidence is insufficient, not that the effect is zero; with 3 replicates the test has low power", why: "Correct. The honest statement is 'no significant difference was detected'." },
      { t: "Nothing: p above 0.05 proves there is no effect", why: "A test can only fail to find evidence. Absence of evidence is not evidence of absence, especially with few replicates." },
      { t: "p = 0.08 proves there is an effect, because it is close to 0.05", why: "Being close to the cutoff does not prove an effect either. The data are simply inconclusive." }
    ],
    answer: 0,
    explain: "Statistical power, the chance of detecting a real effect, is low with 3 replicates per group. If the question matters, plan a study with more replicates instead of declaring 'no effect'."
  },
  {
    id: "st-023", obj: ["ST.TEST"], lesson: "f3-tests", level: 2,
    q: "Why is Welch's t-test usually a safer default than the classic Student's t-test for two groups?",
    options: [
      { t: "It always gives smaller p-values", why: "Welch's p-value can be larger or smaller than Student's. Its advantage is staying accurate when variances differ, not being more 'significant'." },
      { t: "It works for three or more groups", why: "Both t-tests compare two groups. Three or more groups need ANOVA." },
      { t: "It does not assume that the two groups have equal variances", why: "Correct. It estimates each group's variance separately, so it stays accurate when the spreads differ." },
      { t: "It does not need any replicates", why: "Every t-test needs replicates to estimate the variability within each group." }
    ],
    answer: 2,
    explain: "Student's t-test assumes equal variances in both groups, and when that is false its p-values can mislead. Welch's test estimates each variance separately and adjusts the degrees of freedom, which is why R uses it by default."
  },

  /* ---------------- ST.CORR: correlation and linear models ---------------- */
  {
    id: "st-024", obj: ["ST.CORR"], lesson: "f3-correlation", level: 1,
    q: "Two variables have a Pearson correlation of r = 0. What can you conclude?",
    options: [
      { t: "One of the variables is always zero", why: "r = 0 describes how two variables vary together, not their values." },
      { t: "The relationship is negative", why: "A negative relationship gives r below 0. r = 0 means no straight-line trend in either direction." },
      { t: "There is no straight-line relationship, although a curved relationship is still possible", why: "Correct. r only measures straight-line association, so always plot the data." },
      { t: "The two variables are completely unrelated", why: "A perfect U-shaped relationship can have r close to 0. r is blind to curved patterns." }
    ],
    answer: 2,
    explain: "Pearson's r ranges from -1 to 1 and measures how closely points follow a straight line. A scatter plot shows what r cannot, such as curves, clusters and outliers."
  },
  {
    id: "st-025", obj: ["ST.CORR"], lesson: "f3-correlation", level: 2,
    q: "What does this R code print?",
    code: { lang: "r", src: "x <- c(1, 2, 3, 4, 5)\ny <- c(2, 1, 4, 3, 5)\ncor(x, y)" },
    options: [
      { t: "[1] -0.8", why: "Overall y increases as x increases, so the correlation is positive." },
      { t: "[1] 0", why: "There is a clear upward trend: the first two y values are the smallest and the last is the largest." },
      { t: "[1] 0.8", why: "Correct. y tends to rise with x but zig-zags, so the correlation is strong and positive but not perfect." },
      { t: "[1] 1", why: "r = 1 needs every point exactly on a rising straight line. Here y goes 2, 1, 4, 3, 5, which is not perfectly in step with x." }
    ],
    answer: 2,
    verify: {},
    explain: "Both vectors have mean 3. The products of the deviations from the means add up to 8, and each set of squared deviations adds up to 10, so r = 8 / sqrt(10 x 10) = 0.8."
  },
  {
    id: "st-026", obj: ["ST.CORR"], lesson: "f3-correlation", level: 2,
    q: "A gene is measured in people aged 20, 30, 40 and 50. What does this code print?",
    code: { lang: "r", src: "age <- c(20, 30, 40, 50)\nexpr <- c(5.0, 5.5, 6.0, 6.5)\nfit <- lm(expr ~ age)\ncoef(fit)[[\"age\"]]" },
    options: [
      { t: "[1] 0.5", why: "0.5 is the change per 10 years. The slope is the change per 1 unit of x, here one year." },
      { t: "[1] 1", why: "1 is the correlation r, because these points lie exactly on a line. The slope is in units of expression per year." },
      { t: "[1] 0.05", why: "Correct. This is the slope: expression rises by 0.5 every 10 years, which is 0.05 per year." },
      { t: "[1] 4", why: "4 is the intercept, `coef(fit)[[\"(Intercept)\"]]`, the predicted expression at age 0." }
    ],
    answer: 2,
    verify: {},
    explain: "`lm(expr ~ age)` fits expr = intercept + slope x age. Here expr = 4 + 0.05 x age; check at age 20: 4 + 1.0 = 5.0. Unlike r, the slope has units (expression per year)."
  },
  {
    id: "st-027", obj: ["ST.CORR"], lesson: "f3-correlation", level: 3,
    q: "Across 30 bulk tissue samples, genes A and B have r = 0.9. Both are known to be expressed only in immune cells. What should you suspect before concluding that A regulates B?",
    options: [
      { t: "Nothing: r = 0.9 shows that A regulates B", why: "Correlation cannot show direction or mechanism. B could regulate A, or neither could regulate the other." },
      { t: "That the correlation must really be negative", why: "r = 0.9 is positive: when A is high, B tends to be high." },
      { t: "Both may simply track the proportion of immune cells in each sample, a third factor that drives both", why: "Correct. Samples with more immune cells have more of both RNAs, which creates a correlation without any regulation." }
    ],
    answer: 2,
    explain: "In bulk samples, genes specific to one cell type correlate because samples contain different amounts of that cell type. This confounding by cell-type composition is common in co-expression studies; single-cell data, or experiments that change A, can test a regulatory link."
  },
  {
    id: "st-028", obj: ["ST.CORR"], lesson: "f3-correlation", level: 2,
    q: "A linear model of expression against age, fitted to people aged 20 to 60, has an intercept of 4.0. A student writes 'newborns have an expression of 4.0'. What is wrong?",
    options: [
      { t: "Nothing: the intercept is the measured expression of the youngest group", why: "The intercept is a value on the fitted line at age 0, not a measurement of any sample. The youngest people measured were 20." },
      { t: "The intercept is the slope, so newborns change by 4.0 per year", why: "The intercept and the slope are different numbers: the slope is the change per year, the intercept is where the line meets age 0." },
      { t: "The intercept is the prediction at age 0, far outside the 20 to 60 range studied, so it is an untested extrapolation", why: "Correct. The line was only fitted between 20 and 60, and relationships often change shape outside the data." }
    ],
    answer: 2,
    explain: "Predictions outside the range of the data (extrapolations) are unreliable. The intercept is mainly a mathematical anchor for the line, and is only meaningful when x = 0 lies within or near the data."
  },
  {
    id: "st-029", obj: ["ST.CORR"], lesson: "f3-correlation", level: 2,
    q: "Suppose RNA and protein levels across 5,000 genes correlate with r = 0.6. Roughly what fraction of the variation in protein levels does a straight line on RNA levels account for?",
    options: [
      { t: "About 60 percent", why: "r itself is not a percentage of variation explained. Square it first." },
      { t: "100 percent, because the correlation is positive", why: "A positive r only gives the direction. A perfect fit would need r = 1." },
      { t: "About 6 percent", why: "That misreads r = 0.6 as 0.06. r squared is 0.36." },
      { t: "About 36 percent", why: "Correct. r squared = 0.6 x 0.6 = 0.36, so the line accounts for about 36 percent of the variation in protein levels." }
    ],
    answer: 3,
    explain: "r squared is the fraction of variation in y accounted for by the straight line. Here most of the variation in protein levels is not explained by RNA levels, a reminder that translation and protein breakdown are regulated too, so RNA-seq is an indirect guide to protein."
  },

  /* ---------------- ST.MULTI: multiple testing ---------------- */
  {
    id: "st-030", obj: ["ST.MULTI"], lesson: "f3-multiple", level: 1,
    q: "In a differential expression study, what is a false positive?",
    options: [
      { t: "A gene called significant that did not really change", why: "Correct. The test says 'changed', but the truth is 'unchanged'." },
      { t: "A gene that really changed but was not called significant", why: "That is a false negative: a real change that was missed." },
      { t: "A gene with a positive log2 fold change", why: "'Positive' refers to the test result (called significant), not to the direction of the change." },
      { t: "A gene whose p-value is exactly 0.05", why: "A false positive is defined by the truth behind a call, not by a particular p-value." }
    ],
    answer: 0,
    explain: "False positive: called significant, but unchanged in reality. False negative: not called, but really changed. Stricter thresholds reduce false positives and increase false negatives."
  },
  {
    id: "st-031", obj: ["ST.MULTI"], lesson: "f3-multiple", level: 2,
    q: "You test 20,000 genes at alpha = 0.01, and none of them truly changes. About how many will have p < 0.01?",
    options: [
      { t: "About 1,000", why: "That would be the count at alpha = 0.05. With alpha = 0.01 it is 20,000 x 0.01." },
      { t: "About 20", why: "That would be 0.1 percent of the genes. Multiply the number of tests by alpha." },
      { t: "About 200", why: "Correct. 20,000 x 0.01 = 200 false positives are expected by chance." },
      { t: "None", why: "Unchanged genes still produce small p-values by chance: about 1 percent of them fall below 0.01." }
    ],
    answer: 2,
    explain: "With m tests of true null hypotheses and a cutoff alpha, expect about m x alpha false positives. A stricter cutoff reduces them, but with 20,000 tests even 1 percent is a lot."
  },
  {
    id: "st-032", obj: ["ST.MULTI"], lesson: "f3-multiple", level: 2,
    q: "What does this R code print?",
    code: { lang: "r", src: "p <- c(0.01, 0.02, 0.03, 0.04)\np.adjust(p, method = \"BH\")" },
    options: [
      { t: "[1] 0.01 0.02 0.03 0.04", why: "These are the unadjusted p-values. Adjusted values are always at least as large as the originals." },
      { t: "[1] 0.0025 0.005 0.0075 0.01", why: "This divides by m. Adjustment makes p-values larger; Bonferroni divides the cutoff, not the p-values." },
      { t: "[1] 0.04 0.04 0.04 0.04", why: "Correct. With m = 4: 0.01 x 4/1, 0.02 x 4/2, 0.03 x 4/3 and 0.04 x 4/4 all equal 0.04." },
      { t: "[1] 0.04 0.08 0.12 0.16", why: "This multiplies every p-value by m = 4, which is the Bonferroni correction. BH multiplies by m / rank." }
    ],
    answer: 2,
    verify: {},
    explain: "BH multiplies each p-value by m / rank. Here every product is 0.04, so all four genes pass an FDR cutoff of 0.05. Bonferroni (0.04, 0.08, 0.12, 0.16) would keep only the first."
  },
  {
    id: "st-033", obj: ["ST.MULTI"], lesson: "f3-multiple", level: 3,
    q: "In this site's toy experiment, 1,512 genes were tested and 191 had p < 0.05. What is the best interpretation?",
    options: [
      { t: "None of the genes really changed, because about 76 false positives are expected", why: "191 is far more than 76, which points to real changes. The job is telling which ones, and that is what FDR control does." },
      { t: "About 76 genes would pass by chance even if nothing changed, so there is real signal, but many of the 191 could be false positives; use adjusted p-values", why: "Correct. 191 is well above the 76 expected by chance, but raw p-values cannot tell you which genes are the real ones." },
      { t: "All 191 genes respond to heat", why: "About 76 genes would reach p < 0.05 by chance alone, so many of the 191 are probably not real responders." }
    ],
    answer: 1,
    explain: "1,512 x 0.05 is about 76 expected chance hits. Seeing 191 suggests real effects, but you cannot tell from raw p-values which genes are real. BH adjustment keeps 18 genes at padj < 0.05."
  },
  {
    id: "st-034", obj: ["ST.MULTI"], lesson: "f3-multiple", level: 3,
    q: "A study reports 200 genes as significant at an FDR of 5 percent (padj < 0.05). About how many of them are expected to be false discoveries?",
    options: [
      { t: "About 10 or fewer, on average", why: "Correct. FDR control at 5 percent keeps the expected proportion of false discoveries at or below 5 percent: 5 percent of 200 is 10." },
      { t: "None, because they passed the FDR cutoff", why: "FDR control does not remove false positives; it limits their expected proportion. Some of the 200 are probably false." },
      { t: "About 190", why: "This reverses the meaning. FDR 5 percent means about 5 percent false, so about 95 percent are expected to be true." },
      { t: "Exactly 10", why: "The FDR is an expected proportion, an average over many experiments, not an exact count for one list." }
    ],
    answer: 0,
    explain: "FDR is the expected value of (false discoveries / all discoveries). At 5 percent, a list of 200 is expected to contain at most about 10 false discoveries. You do not know which ones, which is why key genes are validated."
  },
  {
    id: "st-035", obj: ["ST.MULTI"], lesson: "f3-multiple", level: 3,
    q: "What does this code print? (Remember that BH adjusted values never decrease down the sorted list.)",
    code: { lang: "r", src: "p <- c(0.002, 0.03, 0.04, 0.2)\nsum(p.adjust(p, method = \"BH\") < 0.05)" },
    options: [
      { t: "[1] 1", why: "Correct. 0.002 x 4 = 0.008; 0.03 x 4/2 = 0.06; 0.04 x 4/3 = 0.053; 0.2 x 4/4 = 0.2. Adjusted values cannot decrease down the list, so the second becomes 0.053 too. Only the first is below 0.05." },
      { t: "[1] 3", why: "Three raw p-values are below 0.05, but this code counts adjusted values, which are larger." },
      { t: "[1] 2", why: "The second gene's adjusted value is 0.053 (0.06 lowered to match the third), which is still above 0.05." },
      { t: "[1] 0", why: "The first gene's adjusted value is 0.008, well below 0.05." }
    ],
    answer: 0,
    verify: {},
    explain: "BH multiplies by m / rank (4, 2, 1.33, 1) and then makes the values non-decreasing down the list: 0.008, 0.053, 0.053, 0.2. `sum()` counts the TRUE values of `< 0.05`, giving 1."
  },

  /* ---------------- BI.DE: differential expression ---------------- */
  {
    id: "sc-001", obj: ["BI.DE"], lesson: "f3-de", level: 1,
    q: "What are the two axes of a standard volcano plot in a differential expression analysis?",
    options: [
      { t: "x: sample; y: library size", why: "That is a quality-check plot of sequencing depth, not a volcano plot." },
      { t: "x: log2 fold change; y: -log10(p-value)", why: "Correct. Each point is a gene: left is down, right is up, and higher means stronger evidence." },
      { t: "x: gene name; y: raw count", why: "That would be a bar chart of counts. A volcano plot shows the size of each change against the strength of its evidence." },
      { t: "x: p-value; y: fold change", why: "The quantities are right but untransformed and swapped. Using -log10(p) on the y-axis puts the most significant genes at the top." }
    ],
    answer: 1,
    explain: "-log10 turns small p-values into large numbers (p = 0.001 becomes 3), so significant genes rise to the top. Threshold lines are often drawn at |log2FC| = 1 and at the significance cutoff."
  },
  {
    id: "sc-002", obj: ["BI.DE"], lesson: "f3-de", level: 2,
    q: "On a volcano plot, a gene sits in the top-left corner. What does that mean?",
    options: [
      { t: "A gene that did not change", why: "Unchanged genes sit near log2FC 0, the middle of the x-axis, and near the bottom." },
      { t: "A large decrease with strong evidence", why: "Correct. Left means negative log2FC (down) and top means a small p-value (strong evidence)." },
      { t: "A large increase with strong evidence", why: "Increases have positive log2FC and sit on the right. The left side holds decreases." },
      { t: "A large decrease with weak evidence", why: "Weak evidence (a large p-value) sits near the bottom. The top holds the smallest p-values." }
    ],
    answer: 1,
    explain: "The top-left and top-right corners hold the most convincing changes: large in size and strongly supported. Points far to one side but low down, like FOS in the heat-shock data, are large but uncertain."
  },
  {
    id: "sc-003", obj: ["BI.DE"], lesson: "f3-de", level: 2,
    q: "These vectors hold log2FC and padj for five genes from this site's results (HSPA1A, HSPB1, FOS, GAPDH, DNAJB1). What does the code print?",
    code: { lang: "r", src: "lfc <- c(5.27, 0.74, 1.80, -0.10, 2.61)\npadj <- c(0.0035, 0.227, 0.863, 0.629, 0.0151)\nsum(padj < 0.05 & abs(lfc) > 1)" },
    options: [
      { t: "[1] 5", why: "That is the number of genes, not the number that pass both filters." },
      { t: "[1] 2", why: "Correct. Only HSPA1A and DNAJB1 have both padj < 0.05 and |log2FC| > 1." },
      { t: "[1] 3", why: "This is the count with `|` (either condition), which lets FOS in on its log2FC alone. `&` requires both conditions." },
      { t: "[1]  TRUE FALSE FALSE FALSE  TRUE", why: "That is the logical vector before counting. `sum()` turns it into the number of TRUE values." }
    ],
    answer: 1,
    verify: {},
    explain: "`padj < 0.05` and `abs(lfc) > 1` each give a logical vector; `&` combines them element by element, and `sum()` counts the TRUE values. `abs()` keeps strong decreases as well as increases."
  },
  {
    id: "sc-004", obj: ["BI.DE"], lesson: "f3-de", level: 3,
    q: "BAG3 rises about 3.5-fold in every heat replicate, but its padj is 0.149. Which statement is most accurate?",
    options: [
      { t: "The padj must be wrong, because a 3.5-fold change is always significant", why: "Significance also depends on variability and the number of tests. BAG3's control replicates vary (about 15 to 27 CPM), which weakens a 3 versus 3 test." },
      { t: "The change may well be real, but this experiment and test do not give enough evidence after correcting for 1,512 tests", why: "Correct. A consistent rise that misses the cutoff is a possible false negative, worth following up." },
      { t: "BAG3 does not respond to heat", why: "Not significant means the evidence fell short, not that the change is zero. All three heat replicates are above all three controls." },
      { t: "BAG3 should be added to the significant list because its fold change is large", why: "Changing the rules for genes you expect to change biases the list. Apply the thresholds set in advance and discuss BAG3 separately." }
    ],
    answer: 1,
    explain: "With few replicates and a simple per-gene test, real changes are often missed. Tools that share variance information across genes have more power, and an independent experiment, such as qPCR on new samples, could test BAG3 directly."
  },
  {
    id: "sc-005", obj: ["BI.DE"], lesson: "f3-de", level: 2,
    q: "Why do many DE analyses require |log2FC| > 1 in addition to padj < 0.05?",
    options: [
      { t: "Because genes with log2FC below 1 cannot be real", why: "Small changes can be real and sometimes important. The threshold is a practical choice for focus, not a law of biology." },
      { t: "With enough replicates, very small changes can be statistically significant; a fold-change threshold focuses on changes large enough to be likely to matter", why: "Correct. padj answers 'is there a change?', and the log2FC threshold adds 'is it big enough to care about?'." },
      { t: "Because padj alone is not a valid statistic", why: "padj is valid; it measures evidence. The fold-change threshold adds a requirement on effect size, which padj does not measure." }
    ],
    answer: 1,
    explain: "Significance (padj) and effect size (log2FC) answer different questions. A cutoff of |log2FC| > 1 means at least a 2-fold change in either direction."
  },
  {
    id: "sc-006", obj: ["BI.DE"], lesson: "f3-de", level: 3,
    q: "In a new experiment, nearly every gene, including ACTB and GAPDH, shows log2FC of about -1 in the treated group. What is the most likely explanation?",
    options: [
      { t: "The treated samples are of better quality", why: "Better quality does not shift every gene's fold change by the same amount. A uniform shift is the signature of a scaling problem." },
      { t: "A technical problem, such as normalization that did not account for a difference in sequencing depth, rather than real biology", why: "Correct. A shift shared by almost every gene is the signature of a scaling or sample problem." },
      { t: "The treatment halved the expression of almost every gene", why: "Standard normalization assumes most genes do not change, so a correctly normalized analysis cannot even show a uniform halving. A shift of every gene almost always points to a technical cause." }
    ],
    answer: 1,
    explain: "Most genes are expected to be unchanged, so log2FC values should center near 0, and housekeeping genes act as an informal check. When everything shifts, recheck the library sizes, the normalization and the sample sheet."
  },
  {
    id: "sc-007", obj: ["BI.DE"], lesson: "f3-de", level: 3,
    q: "A DE analysis of 3 control and 3 treated samples finds no genes with padj < 0.05. Which conclusion is justified?",
    options: [
      { t: "The treatment has no effect on gene expression", why: "Finding nothing with low power is not proof of no effect. Check data quality and variability, and consider more replicates." },
      { t: "The analysis must have a bug, because every treatment changes some genes", why: "Checking the code and QC is wise, but a null result can be genuine: some treatments have small or no effects at the RNA level." },
      { t: "This experiment found no strong evidence of changes; effects may exist but be too small or too variable to detect with 3 replicates", why: "Correct. A null result from a low-powered design is inconclusive, not proof of no effect." }
    ],
    answer: 2,
    explain: "With 3 replicates, power is limited, especially after correcting for thousands of tests. Look at effect sizes and replicate agreement before deciding what to do next."
  },

  /* ---------------- BI.SC: single-cell RNA-seq ---------------- */
  {
    id: "sc-008", obj: ["BI.SC"], lesson: "f3-single-cell", level: 1,
    q: "In droplet-based single-cell RNA-seq, what does the cell barcode tell you about a read?",
    options: [
      { t: "How good the sequencing quality was", why: "Quality is stored in the FASTQ quality scores. The barcode is a tag that identifies the cell." },
      { t: "Which cell (droplet) the RNA molecule came from", why: "Correct. All molecules captured in one droplet share the same barcode." },
      { t: "Which gene the read belongs to", why: "The gene is found by matching the read's sequence to the genome or transcriptome. The barcode identifies the cell." },
      { t: "Which original molecule the read was copied from", why: "That is the job of the UMI. The barcode is shared by all molecules from one cell." }
    ],
    answer: 1,
    explain: "Barcodes let thousands of cells be pooled for sequencing and sorted back into cells afterwards. The UMI then distinguishes individual molecules within each cell."
  },
  {
    id: "sc-009", obj: ["BI.SC"], lesson: "f3-single-cell", level: 1,
    q: "Why are UMIs (unique molecular identifiers) used in single-cell RNA-seq?",
    options: [
      { t: "To mark which reads come from mitochondrial genes", why: "Mitochondrial reads are identified by the genes they map to (MT- genes), not by UMIs." },
      { t: "To make every gene's count the same", why: "UMIs make counts more accurate; they do not equalize genes." },
      { t: "So that many PCR copies of one RNA molecule are counted once, not many times", why: "Correct. Reads with the same barcode, UMI and gene are collapsed into one molecule." },
      { t: "So that cells from different patients can be told apart", why: "Samples are told apart with sample indexes or genetic differences. UMIs label individual molecules." }
    ],
    answer: 2,
    explain: "The tiny amount of RNA in a cell must be amplified by PCR, which copies some molecules more than others. Counting UMIs instead of reads removes this amplification bias."
  },
  {
    id: "sc-010", obj: ["BI.SC"], lesson: "f3-single-cell", level: 2,
    q: "These are the mitochondrial percentages of six cells. What does the code print?",
    code: { lang: "r", src: "mito <- c(3.2, 41.0, 4.8, 5.5, 27.3, 2.9)\nsum(mito > 20)" },
    options: [
      { t: "[1] FALSE  TRUE FALSE FALSE  TRUE FALSE", why: "That is the logical vector `mito > 20` itself. Wrapping it in `sum()` counts the TRUE values." },
      { t: "[1] 2", why: "Correct. 41.0 and 27.3 are above 20. `mito > 20` is TRUE for those two cells, and `sum()` counts TRUE as 1." },
      { t: "[1] 4", why: "That counts the cells at or below 20, the ones that pass. `mito > 20` is TRUE for the high ones." },
      { t: "[1] 68.3", why: "That is the sum of the two high values. `mito > 20` turns the numbers into TRUE and FALSE first, so `sum()` counts them." }
    ],
    answer: 1,
    verify: {},
    explain: "A comparison on a vector gives one TRUE or FALSE per element, and `sum()` of a logical vector counts the TRUE values. A 20 percent cutoff would flag two cells as likely damaged."
  },
  {
    id: "sc-011", obj: ["BI.SC"], lesson: "f3-single-cell", level: 2,
    q: "QC in R for five cells. Which cells does this code flag for removal?",
    code: { lang: "r", src: "genes <- c(850, 240, 1020, 3900, 910)\nmito <- c(4.1, 35.2, 3.8, 4.5, 22.0)\nwhich(genes < 300 | mito > 15)" },
    options: [
      { t: "[1] 2", why: "Only cell 2 fails both tests, but `|` (or) flags cells that fail either one, so cell 5 is included." },
      { t: "[1] 2 4 5", why: "Cell 4 has many genes (3,900) and few mitochondrial reads, so neither condition is TRUE. Unusually many genes can point to a doublet, but this code does not test for that." },
      { t: "[1] 1 3 4", why: "Those are the cells that pass. `which()` returns the positions where the condition is TRUE, here the failing cells." },
      { t: "[1] 2 5", why: "Correct. Cell 2 fails both tests (240 genes, 35.2 percent) and cell 5 fails the mitochondrial test (22.0 percent). `|` flags a cell if either condition is TRUE, and `which()` returns the positions." }
    ],
    answer: 3,
    verify: {},
    explain: "`|` means OR and `&` means AND, and `which()` turns a logical vector into the positions of its TRUE values. Cell 4, with about four times the usual number of genes, is a possible doublet that needs a separate check."
  },
  {
    id: "sc-012", obj: ["BI.SC"], lesson: "f3-single-cell", level: 3,
    q: "A study compares 10,000 cells from one treated mouse with 10,000 cells from one control mouse and reports thousands of significant genes. What is the main problem?",
    options: [
      { t: "There is only one biological replicate per condition, so differences between the two mice cannot be separated from the treatment effect", why: "Correct. Cells from one animal are not independent replicates of the treatment." },
      { t: "10,000 cells per group is too few for single-cell analysis", why: "10,000 cells is plenty for many questions. The issue is the number of animals, not the number of cells." },
      { t: "Single-cell data cannot be used to compare conditions", why: "It can, with several independent samples per condition, often by adding up counts per sample and cell type (pseudobulk)." }
    ],
    answer: 0,
    explain: "Cells from one animal share its genetics, environment and handling. Treating thousands of cells as replicates inflates significance enormously, so comparisons between conditions need several animals or donors per condition."
  },
  {
    id: "sc-013", obj: ["BI.SC"], lesson: "f3-single-cell", level: 3,
    q: "Bulk RNA-seq shows gene X is 2-fold higher in tumors than in normal tissue. Which experiment best tells you whether tumor cells make more X, or whether tumors simply contain more of a cell type that expresses X?",
    options: [
      { t: "Single-cell RNA-seq of tumor and normal samples", why: "Correct. It measures X in each cell and identifies cell types, so it separates a per-cell change from a change in the mix of cells." },
      { t: "Bulk RNA-seq with deeper sequencing", why: "More reads make the average more precise, but it is still an average over all cell types and cannot separate composition from per-cell changes." },
      { t: "DNA sequencing of the X gene", why: "DNA sequencing shows variants in X, not which cells express it or how much." },
      { t: "qPCR of X in the same bulk samples", why: "qPCR on bulk samples confirms the average change, but it is still an average over the mixture." }
    ],
    answer: 0,
    explain: "A bulk change can come from more expression per cell or from a shift in cell-type composition. Only measurements that resolve cell types, such as scRNA-seq, can tell these apart."
  },

  /* ---------------- BI.CLUST: clusters, UMAP and markers ---------------- */
  {
    id: "sc-014", obj: ["BI.CLUST"], lesson: "f3-clusters", level: 1,
    q: "In single-cell analysis, what is a marker gene?",
    options: [
      { t: "A gene expressed much more in one cluster or cell type than in the others", why: "Correct. Markers are defined by contrast between clusters." },
      { t: "A gene used to mark cells with a barcode", why: "Barcodes are DNA tags added during the experiment, not genes." },
      { t: "A housekeeping gene expressed equally in every cell", why: "Equal expression cannot distinguish clusters. Markers are useful precisely because they differ." },
      { t: "The gene with the most reads in the whole dataset", why: "The most abundant genes are often expressed everywhere. A marker is defined by contrast between clusters." }
    ],
    answer: 0,
    explain: "Markers are found by comparing each cluster with the rest. Known markers, such as CD3E for T cells or MS4A1 for B cells, are then used to suggest cluster identities."
  },
  {
    id: "sc-015", obj: ["BI.CLUST"], lesson: "f3-clusters", level: 2,
    q: "A cluster shows high LYZ and CD14 and almost no CD3E, MS4A1 or PPBP. What is it most likely to be?",
    options: [
      { t: "Platelets", why: "Platelets are marked by PPBP, which this cluster lacks." },
      { t: "B cells", why: "B cells express MS4A1 and CD79A, which this cluster lacks." },
      { t: "CD14 monocytes", why: "Correct. LYZ marks monocytes and CD14 marks the classical CD14 monocytes." },
      { t: "T cells", why: "T cells express CD3E, which this cluster lacks." }
    ],
    answer: 2,
    explain: "LYZ is a monocyte marker (also found in some other myeloid cells), and CD14 marks classical monocytes. LYZ together with FCGR3A would instead suggest FCGR3A monocytes."
  },
  {
    id: "sc-016", obj: ["BI.CLUST"], lesson: "f3-clusters", level: 3,
    q: "Two clusters both express FCGR3A. Cluster P also expresses LYZ; cluster Q expresses NKG7 and GNLY but no LYZ or CD3E. What are they most likely to be?",
    options: [
      { t: "Both are NK cells, because they share FCGR3A", why: "FCGR3A is shared by NK cells and FCGR3A monocytes. The other markers decide." },
      { t: "P: FCGR3A monocytes; Q: CD8 T cells", why: "CD8 T cells express CD3E (and CD8A). Q has NKG7 and GNLY but no CD3E, which fits NK cells." },
      { t: "P: FCGR3A monocytes; Q: NK cells", why: "Correct. LYZ marks P as monocytes; NKG7 and GNLY without CD3E mark Q as NK cells." },
      { t: "P: NK cells; Q: FCGR3A monocytes", why: "The labels are swapped: LYZ is a monocyte marker, and NKG7 and GNLY are cytotoxic-cell markers." }
    ],
    answer: 2,
    explain: "Markers are rarely exclusive: FCGR3A appears in NK cells and FCGR3A monocytes, and NKG7 and GNLY in NK cells and cytotoxic T cells. Combining markers, and checking which ones are absent, resolves the identity."
  },
  {
    id: "sc-017", obj: ["BI.CLUST"], lesson: "f3-clusters", level: 2,
    q: "On a UMAP plot, cluster A sits right next to cluster B and far from cluster C. A student concludes that A is more similar to B than to C. What is the problem?",
    options: [
      { t: "The conclusion should be reversed: close clusters are less similar", why: "Closeness on UMAP is not a reverse signal either. Distances between clusters are simply not trustworthy in either direction." },
      { t: "UMAP preserves local neighborhoods, but distances between clusters are not reliable; compare their expression profiles directly", why: "Correct. Use UMAP to look, and measurements of expression to compare." },
      { t: "There is no problem: UMAP distances are exact measures of similarity", why: "UMAP is designed to keep near neighbors together, not to preserve large distances, and the layout changes with settings and random starts." }
    ],
    answer: 1,
    explain: "UMAP and t-SNE are for visual exploration. To compare clusters, use measurements such as the correlation of average expression profiles, shared markers or distances in PCA space."
  },
  {
    id: "sc-018", obj: ["BI.CLUST"], lesson: "f3-clusters", level: 3,
    q: "One cluster has no clear markers, few detected genes per cell and high expression of mitochondrial genes such as MT-CO1. It sits between other clusters on the UMAP. What is it most likely to be?",
    options: [
      { t: "A newly discovered cell type", why: "A new cell type should have its own distinct, biologically sensible markers. High mitochondrial reads and few genes signal damage." },
      { t: "Platelets, because they have few genes", why: "Platelets have a clear marker, PPBP. This cluster is defined by mitochondrial genes, which flags damage." },
      { t: "Low-quality or damaged cells that QC did not fully remove", why: "Correct. Few genes and many mitochondrial reads are the signature of damaged cells, whatever cell type they came from." }
    ],
    answer: 2,
    explain: "Clusters can reflect technical effects rather than biology. A cluster defined by quality metrics should send you back to the QC thresholds before any interpretation."
  },
  {
    id: "sc-019", obj: ["BI.CLUST"], lesson: "f3-clusters", level: 2,
    q: "Why is PCA usually run before clustering single-cell data?",
    options: [
      { t: "It summarizes thousands of genes as a few dozen components that capture the main patterns, reducing noise and computation", why: "Correct. Clustering and UMAP are then computed on the top components rather than on all genes." },
      { t: "It assigns cell types automatically", why: "PCA only finds axes of variation. Cell types come from clustering and marker genes." },
      { t: "It removes damaged cells", why: "Damaged cells are removed by QC filters. PCA would happily include them." },
      { t: "It is required to count UMIs", why: "UMI counting happens much earlier, when reads are turned into the count matrix." }
    ],
    answer: 0,
    explain: "PCA finds new axes ordered by how much variation they capture. Working on the top components keeps the main biological signal and drops much of the noise."
  },

  /* ---------------- BI.INTERP: interpretation ---------------- */
  {
    id: "sc-020", obj: ["BI.INTERP"], lesson: "f3-interpret", level: 1,
    q: "What does an enrichment analysis of a differential expression list test?",
    options: [
      { t: "Whether the RNA samples were pure", why: "Sample purity is a quality issue checked earlier. Enrichment analysis summarizes a list of results." },
      { t: "Whether genes from known sets, such as a Gene Ontology term or a pathway, appear in the list more often than expected by chance", why: "Correct. It compares the list with a background of all genes tested." },
      { t: "Whether each gene's expression is enriched, meaning higher than average", why: "Enrichment refers to gene sets being over-represented in a list, not to single genes being highly expressed." }
    ],
    answer: 1,
    explain: "Enrichment analysis connects a gene list to biological processes and pathways by testing whether each known gene set is over-represented, compared with a background of all the genes tested."
  },
  {
    id: "sc-021", obj: ["BI.INTERP"], lesson: "f3-interpret", level: 2,
    q: "You want to confirm that your three top heat-induced genes really change. Which follow-up is strongest?",
    options: [
      { t: "Re-running the same RNA-seq data with a different software tool", why: "A different tool on the same data checks the analysis, not the biology. Any problem in the samples would be repeated." },
      { t: "qPCR of the same RNA samples that were sequenced", why: "This checks the measurement method, which is useful, but not whether the result holds in new biological samples." },
      { t: "Searching for other papers that list the same genes", why: "Agreement with the literature is supportive, but it is not a test in your system." },
      { t: "qPCR of the three genes in new, independently heat-shocked cultures", why: "Correct. It uses an independent method on independent biological samples." }
    ],
    answer: 3,
    explain: "The strongest confirmation combines an independent method with independent biological samples. qPCR measures specific RNAs accurately and cheaply, which suits a few genes."
  },
  {
    id: "sc-022", obj: ["BI.INTERP"], lesson: "f3-interpret", level: 3,
    q: "A DE list from a blood immune-cell experiment is enriched for 'immune response' (p = 0.001) when compared with all 20,000 human genes. Why is this weak evidence that the treatment affected immunity?",
    options: [
      { t: "Because enrichment analysis cannot be used for immune genes", why: "It can. The background choice is the issue, not the gene set." },
      { t: "Immune genes are common among the genes expressed in immune cells anyway; the background should be the genes expressed and tested in the experiment", why: "Correct. Genes that are not expressed can never appear in your list, so a whole-genome background makes expressed, tissue-typical genes look enriched." },
      { t: "Because p = 0.001 is not significant", why: "p = 0.001 is small. The problem is the comparison it was computed against." }
    ],
    answer: 1,
    explain: "Use all tested (expressed) genes as the background, and correct for the many gene sets tested. Even then, enrichment suggests which processes are involved; it does not show that they were activated."
  },
  {
    id: "sc-023", obj: ["BI.INTERP"], lesson: "f3-interpret", level: 3,
    q: "RNA-seq shows that gene P's RNA rose 4-fold after treatment (padj = 0.001). Which statement is justified?",
    options: [
      { t: "P's RNA level rose; whether P's protein level changed needs a protein measurement", why: "Correct. The claim stays with what was measured and names the experiment needed for the next claim." },
      { t: "P's protein level rose 4-fold", why: "Protein levels also depend on translation and protein breakdown, so RNA changes are an indirect guide. Measure protein directly, for example by western blot or mass spectrometry." },
      { t: "P's protein is now more active", why: "Protein activity can depend on modifications, location and partners, none of which RNA-seq measures." }
    ],
    answer: 0,
    explain: "RNA-seq measures RNA. RNA and protein levels are related but not identical, so claims about protein need protein data."
  },
  {
    id: "sc-024", obj: ["BI.INTERP"], lesson: "f3-interpret", level: 2,
    q: "A heat-shock DE list contains HSPA1A, HSPA1B, HSPA6, DNAJB1 and HSPH1. Which Gene Ontology term would you expect enrichment analysis to report?",
    options: [
      { t: "Response to heat (and protein folding)", why: "Correct. These genes encode chaperones that refold heat-damaged proteins." },
      { t: "DNA replication", why: "None of these genes copies DNA. They help proteins fold, which is what heat damages." },
      { t: "Immune response", why: "These are chaperone genes, not immune genes." },
      { t: "Cell division", why: "These genes help proteins fold under stress; they are not cell-division genes." }
    ],
    answer: 0,
    explain: "HSPA1A, HSPA1B and HSPA6 belong to the HSP70 family, DNAJB1 to HSP40 and HSPH1 to HSP110: all chaperones. Seeing the expected terms is also a sanity check that the analysis works."
  },

  /* ---------------- BI.WORKFLOW: real workflows and tools ---------------- */
  {
    id: "sc-025", obj: ["BI.WORKFLOW"], lesson: "f3-workflows", level: 1,
    q: "What does FastQC do?",
    options: [
      { t: "It produces a quality report for a file of sequencing reads (FASTQ)", why: "Correct. It summarizes base qualities, adapter content, duplication and more." },
      { t: "It aligns reads to the genome", why: "Alignment is done by tools such as STAR. FastQC only inspects reads." },
      { t: "It tests genes for differential expression", why: "DE testing is done in R with tools such as DESeq2, edgeR or limma." },
      { t: "It removes all low-quality reads", why: "FastQC reports problems but does not change the data. Trimming tools such as fastp change the reads." }
    ],
    answer: 0,
    explain: "FastQC is usually the first step of a sequencing analysis: one report per FASTQ file. MultiQC then combines many reports so that problem samples stand out."
  },
  {
    id: "sc-026", obj: ["BI.WORKFLOW"], lesson: "f3-workflows", level: 1,
    q: "Which pair names a common single-cell analysis toolkit in R and one in Python?",
    options: [
      { t: "edgeR (R) and MultiQC (Python)", why: "edgeR is a bulk DE package, and MultiQC (which is written in Python) summarizes QC reports. Neither analyzes single-cell data." },
      { t: "Seurat (R) and Scanpy (Python)", why: "Correct. Both cover single-cell QC, normalization, PCA, clustering, UMAP and marker genes." },
      { t: "DESeq2 (R) and FastQC (Python)", why: "DESeq2 is for bulk differential expression, and FastQC is a stand-alone quality-report program (written in Java), not a single-cell toolkit." },
      { t: "STAR (R) and Salmon (Python)", why: "STAR and Salmon are command-line programs that turn reads into alignments or abundance estimates. Neither is a single-cell analysis toolkit for R or Python." }
    ],
    answer: 1,
    explain: "Seurat (R) and Scanpy (Python, built around AnnData objects) are the two most widely used single-cell toolkits. They cover the same main steps, so concepts transfer between them."
  },
  {
    id: "sc-027", obj: ["BI.WORKFLOW"], lesson: "f3-workflows", level: 2,
    q: "In a bulk RNA-seq workflow that uses STAR and featureCounts, which order is correct?",
    options: [
      { t: "Align, test for differential expression, then count", why: "DE tests need the count matrix as input, so counting must come first." },
      { t: "Quality-check the reads, align them with STAR, then count reads per gene with featureCounts", why: "Correct. Each step needs the output of the one before it." },
      { t: "Count reads per gene, then align them", why: "Counting needs to know where each read landed in the genome, which is what alignment provides." }
    ],
    answer: 1,
    explain: "featureCounts assigns aligned reads (in BAM files from STAR) to genes using a gene annotation file, producing the count matrix that DE tools test."
  },
  {
    id: "sc-028", obj: ["BI.WORKFLOW"], lesson: "f3-workflows", level: 3,
    q: "Two labs run the same pipeline on the same FASTQ files and get noticeably different counts for some genes. One lab used an older gene annotation. What does this show?",
    options: [
      { t: "One lab's sequencer was faulty", why: "Both labs used the same FASTQ files, so the reads were identical. The difference arose during processing." },
      { t: "Pipelines cannot be reproduced", why: "They can, if every input is recorded, including software and reference versions. This case shows why that matters." },
      { t: "Reference genome and annotation versions affect results, so they must be recorded and matched to reproduce an analysis", why: "Correct. Gene models change between annotation releases, which changes which reads count toward each gene." }
    ],
    answer: 2,
    explain: "Annotation releases add transcripts and change gene boundaries, so counts change. Methods sections and workflow configurations should record genome and annotation versions, together with software versions."
  },
  {
    id: "sc-029", obj: ["BI.WORKFLOW"], lesson: "f3-workflows", level: 3,
    q: "Your Snakemake workflow has already produced alignments, counts and DE results. You change only the significance threshold in the DE step. What does the workflow manager rerun?",
    options: [
      { t: "Nothing; you must run the DE step by hand", why: "Detecting changed inputs or settings and rerunning the affected steps is a main job of a workflow manager." },
      { t: "Only the DE step and anything that depends on its output", why: "Correct. Alignments and counts do not depend on the DE threshold, so they are kept." },
      { t: "Everything, starting from the raw reads", why: "Workflow managers track which outputs are out of date. Nothing upstream of the DE step changed." }
    ],
    answer: 1,
    explain: "Snakemake and Nextflow work out the dependencies between steps from their inputs and outputs. A change reruns only the affected step and everything downstream, which saves hours on large datasets and keeps results consistent."
  }
);
