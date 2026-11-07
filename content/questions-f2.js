/* Foundation 2 practice bank (Python). Written to tools/CONTENT_GUIDE.md.
   Items with `verify` are executed with real Python by tools/verify_code.py (working directory ~/project/data). */
window.BB = window.BB || {};
BB.questions = BB.questions || [];

BB.questions.push({
  id: "py-001",
  obj: ["PY.EXPR"],
  lesson: "f2-first-program",
  level: 1,
  q: "What does this print?",
  code: { lang: "python", src: "print(3 + 4 * 2)" },
  options: [
    { t: "14", why: "That is (3 + 4) * 2, the result of working strictly left to right. Python applies operator precedence instead." },
    { t: "11", why: "Correct. Multiplication runs before addition: 4 * 2 is 8, and 3 + 8 is 11." },
    { t: "3 + 4 * 2", why: "Without quotes this is an expression, so `print` shows its value, not the characters." }
  ],
  answer: 1,
  explain: "Python evaluates `4 * 2` first because `*` has higher precedence than `+`, then adds 3.",
  verify: {}
});

BB.questions.push({
  id: "py-002",
  obj: ["PY.EXPR"],
  lesson: "f2-first-program",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "print(17 // 5, 17 % 5)" },
  options: [
    { t: "3.4 2", why: "`//` is floor division: it drops the fractional part, so the first value is 3, not 3.4." },
    { t: "2 3", why: "This swaps the two operators: `//` gives how many times 5 fits, `%` gives what is left over." },
    { t: "3 0.4", why: "`%` gives the remainder as a whole amount (2), not the decimal part of the division." },
    { t: "3 2", why: "Correct. 5 fits into 17 three whole times (`//` gives 3), with 2 left over (`%` gives 2)." }
  ],
  answer: 3,
  explain: "`17 // 5` is 3 because 3 * 5 = 15 is the largest multiple of 5 not above 17, and `17 % 5` is the remainder, 17 - 15 = 2.",
  verify: {}
});

BB.questions.push({
  id: "py-003",
  obj: ["PY.EXPR"],
  lesson: "f2-first-program",
  level: 2,
  q: "In R and in spreadsheets, `^` means power. What does this Python line print?",
  code: { lang: "python", src: "print(2 ^ 3, 2 ** 3)" },
  options: [
    { t: "8 8", why: "This assumes `^` means power, as it does in R. In Python it does not, and it gives a different number without any error." },
    { t: "6 8", why: "`^` does not multiply. In Python it compares the binary digits of the two numbers, and here it gives 1." },
    { t: "1 8", why: "Correct. In Python, `^` is a bitwise operator (exclusive or), not power, so `2 ^ 3` is 1. Powers are written `**`." }
  ],
  answer: 2,
  explain: "Python writes powers as `**`. The `^` operator does something unrelated (bitwise exclusive or), so code copied from R or a spreadsheet can silently give wrong numbers.",
  verify: {}
});

BB.questions.push({
  id: "py-004",
  obj: ["PY.EXPR"],
  lesson: "f2-first-program",
  level: 1,
  q: "Which line prints the mean of the three BAG3 control counts, 270, 511 and 552?",
  options: [
    { t: "`print(270 + 511 + 552 / 3)`", why: "Division runs before addition, so only 552 is divided by 3. The result is about 965, not a mean." },
    { t: "`print((270 + 511 + 552) // 3)`", why: "`//` drops the remainder and prints 444 instead of 444.33. Use `/` for an exact mean." },
    { t: "`print(270 + 511 + 552) / 3`", why: "This prints the sum, 1333, and then tries to divide the result of `print` (which is None) by 3, which raises a TypeError." },
    { t: "`print((270 + 511 + 552) / 3)`", why: "Correct. The parentheses make Python add first and then divide the sum by 3, giving about 444.33." }
  ],
  answer: 3,
  explain: "A mean is the sum divided by the number of values, so the sum must be in parentheses and `/` must be used for exact division."
});

BB.questions.push({
  id: "py-005",
  obj: ["PY.EXPR"],
  lesson: "f2-first-program",
  level: 3,
  q: "Sample heat_2 has 17,900,000 reads in total, and 8441 of them come from HSPA1A. Which expression gives the HSPA1A count in counts per million (CPM)?",
  options: [
    { t: "`8441 * 17900000 / 1000000`", why: "Multiplying by the library size makes deeper samples look bigger, the opposite of what normalization should do." },
    { t: "`8441 / 17900000 * 1000000`", why: "Correct. Divide by the library size to get the fraction of reads, then multiply by one million: about 471.6 per million." },
    { t: "`8441 / (17900000 * 1000000)`", why: "The parentheses put both numbers in the denominator, giving a tiny number instead of a count per million." },
    { t: "`17900000 / 8441 * 1000000`", why: "This is upside down: it divides the total reads by the gene's count." }
  ],
  answer: 1,
  explain: "CPM is count / library size * 1,000,000. Python evaluates `/` and `*` from left to right, so `8441 / 17900000 * 1000000` divides first and then scales."
});

BB.questions.push({
  id: "py-006",
  obj: ["PY.TYPES"],
  lesson: "f2-types",
  level: 1,
  q: "Which of these values is a string?",
  options: [
    { t: "`212`", why: "Without quotes, 212 is a whole number, an int." },
    { t: "`212.0`", why: "A number with a decimal point is a float." },
    { t: "`True`", why: "`True` (without quotes) is a Boolean, of type bool." },
    { t: "`\"212\"`", why: "Correct. The quotes make it text, a str, even though the characters are digits." }
  ],
  answer: 3,
  explain: "Quotes create strings. Digits inside quotes are text, which is exactly how numbers arrive when they are read from a file."
});

BB.questions.push({
  id: "py-007",
  obj: ["PY.TYPES"],
  lesson: "f2-types",
  level: 1,
  q: "What does this print?",
  code: { lang: "python", src: "print(\"212\" + \"282\")" },
  options: [
    { t: "494", why: "That would be the sum of the numbers 212 and 282. The quotes make these strings, and `+` joins strings." },
    { t: "212282", why: "Correct. Both values are strings, so `+` joins the text instead of adding numbers." },
    { t: "TypeError: can only concatenate str (not \"int\") to str", why: "There is no int here: both sides are strings, and joining two strings is allowed." }
  ],
  answer: 1,
  explain: "`+` depends on type: it adds ints and floats, but concatenates (joins) strings. Convert with `int()` first to add.",
  verify: {}
});

BB.questions.push({
  id: "py-008",
  obj: ["PY.TYPES"],
  lesson: "f2-types",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "print(int(3.9), round(3.9), float(3))" },
  options: [
    { t: "4 4 3.0", why: "`int()` does not round. It simply drops everything after the decimal point." },
    { t: "3 4 3", why: "`float(3)` is a float, so it prints with a decimal point: 3.0." },
    { t: "3 3 3.0", why: "`round(3.9)` rounds to the nearest whole number, which is 4." },
    { t: "3 4 3.0", why: "Correct. `int()` cuts off the decimal part, `round()` rounds to the nearest whole number, and `float(3)` is shown as 3.0." }
  ],
  answer: 3,
  explain: "`int(3.9)` truncates to 3, `round(3.9)` rounds to 4, and `float(3)` converts the int to the float 3.0.",
  verify: {}
});

BB.questions.push({
  id: "py-009",
  obj: ["PY.TYPES"],
  lesson: "f2-types",
  level: 2,
  q: "What happens when this line runs?",
  code: { lang: "python", src: "print(int(\"3.5\"))" },
  options: [
    { t: "3", why: "`int(3.5)` with a float would give 3, but here the input is the text \"3.5\", which `int()` refuses." },
    { t: "ValueError: invalid literal for int() with base 10: '3.5'", why: "Correct. `int()` can convert text only if it looks like a whole number. \"3.5\" does not, so Python raises a ValueError." },
    { t: "4", why: "`int()` never rounds, and in any case it cannot read decimal text." },
    { t: "3.5", why: "`int()` cannot produce a value with a decimal point; it either converts to a whole number or raises an error." }
  ],
  answer: 1,
  explain: "To convert decimal text to a whole number, convert in two steps: `int(float(\"3.5\"))` gives 3.",
  verify: { mode: "error" }
});

BB.questions.push({
  id: "py-010",
  obj: ["PY.TYPES", "PY.FILES"],
  lesson: "f2-types",
  level: 3,
  q: "Two counts were read from a file into a list. This prints 212282 instead of 494. Which change makes it print 494?",
  code: { lang: "python", src: "fields = [\"HSPA1A\", \"212\", \"282\"]\nprint(fields[1] + fields[2])" },
  options: [
    { t: "`print(int(fields[1] + fields[2]))`", why: "The strings are joined first and then converted, which gives the number 212282." },
    { t: "`print(str(fields[1]) + str(fields[2]))`", why: "The fields are already strings, so this still joins the text." },
    { t: "`print(fields[1] + int(fields[2]))`", why: "This mixes a str and an int, which raises a TypeError." },
    { t: "`print(int(fields[1]) + int(fields[2]))`", why: "Correct. Each field is converted to an int before adding, so `+` does arithmetic." }
  ],
  answer: 3,
  explain: "Values read from files are strings. Convert each value to a number before doing arithmetic with it."
});

BB.questions.push({
  id: "py-011",
  obj: ["PY.VARS"],
  lesson: "f2-variables",
  level: 1,
  q: "What does the statement `x = 5` do in Python?",
  options: [
    { t: "It makes the name x refer to the value 5", why: "Correct. `=` is assignment: Python stores the value under the name, replacing any earlier value." },
    { t: "It checks whether x is equal to 5 and gives True or False", why: "That is what `x == 5` does. A single `=` assigns." },
    { t: "It displays 5 on the screen", why: "Assignment shows nothing. You need `print(x)` to display the value." }
  ],
  answer: 0,
  explain: "In Python, `=` assigns and `==` compares. After `x = 5`, using `x` gives 5 until something else is assigned to it."
});

BB.questions.push({
  id: "py-012",
  obj: ["PY.VARS"],
  lesson: "f2-variables",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "a = 10\nb = a\na = a + 5\nprint(a, b)" },
  options: [
    { t: "15 15", why: "This assumes `b` follows `a`. `b = a` makes `b` refer to the value `a` had at that moment, 10; it creates no lasting link." },
    { t: "10 10", why: "Line 3 really does change `a` to 15." },
    { t: "10 15", why: "This swaps the two names: `a` was updated, and `b` kept the old value." },
    { t: "15 10", why: "Correct. `b` got the value 10 on line 2. Updating `a` afterwards does not change `b`." }
  ],
  answer: 3,
  explain: "Trace it: a = 10, b = 10, then a = 10 + 5 = 15. `b` is unaffected.",
  verify: {}
});

BB.questions.push({
  id: "py-013",
  obj: ["PY.VARS", "PY.READ"],
  lesson: "f2-variables",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "total = 0\ntotal = total + 212\ntotal = total + 282\ntotal + 203\nprint(total)" },
  options: [
    { t: "697", why: "That would need `total = total + 203`. A bare expression is evaluated and then thrown away." },
    { t: "494", why: "Correct. Line 4 calculates `total + 203` but never stores the result, so `total` stays 494." },
    { t: "203", why: "Nothing assigns 203 to `total`. Only lines with `total =` change it." }
  ],
  answer: 1,
  explain: "Only assignments change a variable. `total + 203` on its own line computes 697 and discards it.",
  verify: {}
});

BB.questions.push({
  id: "py-014",
  obj: ["PY.VARS", "PY.READ"],
  lesson: "f2-variables",
  level: 2,
  q: "This code tries to swap x and y. What does it print?",
  code: { lang: "python", src: "x = 3\ny = 4\nx = y\ny = x\nprint(x, y)" },
  options: [
    { t: "4 4", why: "Correct. After `x = y`, x is 4 and the original 3 is gone, so `y = x` makes y refer to that 4 as well." },
    { t: "4 3", why: "That is a successful swap, but the old value of x was overwritten on line 3 before it could be copied into y." },
    { t: "3 4", why: "Lines 3 and 4 do run and change the values. Trace them in order." }
  ],
  answer: 0,
  explain: "A swap needs a temporary variable (`tmp = x`, `x = y`, `y = tmp`) or Python's `x, y = y, x`.",
  verify: {}
});

BB.questions.push({
  id: "py-015",
  obj: ["PY.VARS", "PY.DEBUG"],
  lesson: "f2-variables",
  level: 1,
  q: "You wrote `total = 0` and later `print(Total)`. Python stops with `NameError: name 'Total' is not defined`. Why?",
  options: [
    { t: "`print` cannot display numbers", why: "`print` displays numbers without any problem. The error is about the name." },
    { t: "Variables must be created with `==`", why: "`==` compares values. Variables are created by assigning with `=`." },
    { t: "Names are case-sensitive, so `Total` and `total` are different names", why: "Correct. `Total` was never assigned, so Python does not know it." }
  ],
  answer: 2,
  explain: "Python treats upper and lower case as different characters in names, so `Total`, `total` and `TOTAL` are three different names."
});

BB.questions.push({
  id: "py-016",
  obj: ["PY.VARS"],
  lesson: "f2-variables",
  level: 3,
  q: "A script uses the minimum-count threshold 10 in six places. A reviewer asks you to rerun it with a threshold of 20. What is the most reliable change?",
  options: [
    { t: "Search the file for every 10 and replace it with 20", why: "Some 10s may mean something else, such as a number of samples, so a blind replacement can silently change other calculations." },
    { t: "Create `min_count = 10` once near the top, use `min_count` in all six places, then change that one line to 20", why: "Correct. A single named setting cannot get out of step with itself, and the name explains what the number means." },
    { t: "Copy the script and edit the six places by hand", why: "Missing even one place gives an inconsistent filter, and you now have two versions of the script to maintain." }
  ],
  answer: 1,
  explain: "Named settings make changes safe: one assignment, used everywhere, documents what the number means."
});

BB.questions.push({
  id: "py-017",
  obj: ["PY.FUNC"],
  lesson: "f2-functions",
  level: 1,
  q: "In `def cpm(count, library_size):`, what are `count` and `library_size`?",
  options: [
    { t: "Parameters: names that receive the values passed in when the function is called", why: "Correct. They are placeholders in the definition, filled in by each call." },
    { t: "Arguments: the actual values passed to the function", why: "Arguments are the values written in a call, such as 212 in `cpm(212, 18400000)`." },
    { t: "Return values: what the function gives back", why: "The return value is whatever follows `return` in the body." }
  ],
  answer: 0,
  explain: "Parameters appear in the definition; arguments appear in each call and are matched to the parameters by position."
});

BB.questions.push({
  id: "py-018",
  obj: ["PY.FUNC"],
  lesson: "f2-functions",
  level: 2,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "def fold_change(ctrl, heat):\n    return heat / ctrl\n\nprint(fold_change(200, 1000))"
  },
  options: [
    { t: "0.2", why: "That would be 200 / 1000. The arguments go into `ctrl` and `heat` in order, and the function divides heat by ctrl." },
    { t: "5", why: "`/` always produces a float, so Python prints 5.0." },
    { t: "800", why: "The function divides; it does not subtract." },
    { t: "5.0", why: "Correct. ctrl is 200 and heat is 1000 (matched by position), and 1000 / 200 is 5.0." }
  ],
  answer: 3,
  explain: "The first argument fills the first parameter. `fold_change(200, 1000)` sets ctrl = 200 and heat = 1000 and returns 1000 / 200.",
  verify: {}
});

BB.questions.push({
  id: "py-019",
  obj: ["PY.FUNC", "PY.COND"],
  lesson: "f2-functions",
  level: 3,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "def label(count):\n    if count > 1000:\n        return \"high\"\n    print(\"low\")\n\nx = label(5000)\ny = label(50)\nprint(x, y)"
  },
  options: [
    { t: "high\nlow", why: "`return` sends a value back without printing it. Only `print(\"low\")` and the final `print` produce output." },
    { t: "low\nhigh None", why: "Correct. `label(5000)` returns \"high\" at once. `label(50)` prints low and reaches the end without a `return`, so it gives back None." },
    { t: "high low", why: "The second call prints \"low\" but does not return it. A function that ends without `return` gives back None." },
    { t: "low\nhigh low", why: "The call `label(50)` returns None, not \"low\": printing a value is not the same as returning it." }
  ],
  answer: 1,
  explain: "`return` ends the function immediately. When the end of the body is reached without a `return`, the function returns None.",
  verify: {}
});

BB.questions.push({
  id: "py-020",
  obj: ["PY.FUNC"],
  lesson: "f2-functions",
  level: 1,
  q: "What does this print?",
  code: { lang: "python", src: "def warn():\n    print(\"low depth\")\n\nprint(\"done\")" },
  options: [
    { t: "done", why: "Correct. The function is defined but never called, so its body never runs." },
    { t: "low depth\ndone", why: "Defining a function does not run it. `warn()` would have to be called." },
    { t: "low depth", why: "The body never runs, and the last line prints \"done\"." }
  ],
  answer: 0,
  explain: "`def` only stores the function. Its body runs each time the function is called with parentheses, such as `warn()`.",
  verify: {}
});

BB.questions.push({
  id: "py-021",
  obj: ["PY.FUNC"],
  lesson: "f2-functions",
  level: 3,
  q: "You need a function that you can call on many sequences and whose result you can store and compare. Which definition is best?",
  options: [
    { t: "`def gc(seq): print((seq.count(\"G\") + seq.count(\"C\")) / len(seq))`", why: "This shows the value but returns None, so `x = gc(seq)` stores nothing useful and results cannot be compared." },
    { t: "`def gc(seq): return (seq.count(\"G\") + seq.count(\"C\")) / len(seq)`", why: "Correct. It uses its parameter, so it works for any sequence, and it returns the value so callers can store it." },
    { t: "`def gc(seq): return (dna.count(\"G\") + dna.count(\"C\")) / len(dna)`", why: "The body ignores its parameter and uses another name, `dna`, so it either fails with a NameError or gives the same answer for every input." },
    { t: "`def gc(): return (seq.count(\"G\") + seq.count(\"C\")) / len(seq)`", why: "With no parameter, the function cannot receive a sequence and depends on whatever `seq` happens to exist outside it." }
  ],
  answer: 1,
  explain: "A reusable function takes its input through parameters and hands its result back with `return`."
});

BB.questions.push({
  id: "py-022",
  obj: ["PY.FUNC", "PY.READ"],
  lesson: "f2-functions",
  level: 2,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "def add_pseudocount(x):\n    x = x + 1\n    return x\n\ncount = 0\nadd_pseudocount(count)\nprint(count)"
  },
  options: [
    { t: "1", why: "The function returns 1, but the call's result is not assigned. Write `count = add_pseudocount(count)` to keep it." },
    { t: "0", why: "Correct. `x` is a local name inside the function, so changing it does not change `count`, and the returned 1 is never stored." },
    { t: "None", why: "`count` was set to 0 and is never reassigned, so it is still 0." }
  ],
  answer: 1,
  explain: "Assigning to a parameter changes only the local name inside the function. To use the result outside, store the returned value.",
  verify: {}
});

BB.questions.push({
  id: "py-023",
  obj: ["PY.LOGIC"],
  lesson: "f2-logic",
  level: 1,
  q: "What does this print?",
  code: { lang: "python", src: "print(10 == 10.0, \"ACTB\" == \"actb\")" },
  options: [
    { t: "True False", why: "Correct. 10 and 10.0 are equal numbers, but text comparison is case-sensitive, so ACTB is not equal to actb." },
    { t: "False False", why: "An int and a float with the same value compare as equal in Python." },
    { t: "True True", why: "Upper and lower case letters are different characters, so the two strings are not equal." }
  ],
  answer: 0,
  explain: "`==` compares values: 10 == 10.0 is True, while string comparison is exact, including case.",
  verify: {}
});

BB.questions.push({
  id: "py-024",
  obj: ["PY.LOGIC"],
  lesson: "f2-logic",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "count = 212\nprint(count > 100 and count < 200, count > 100 or count < 200)" },
  options: [
    { t: "True True", why: "`and` needs both sides to be True, and 212 < 200 is False." },
    { t: "False False", why: "`or` needs only one True side, and 212 > 100 is True." },
    { t: "True False", why: "This swaps the rules for `and` and `or`." },
    { t: "False True", why: "Correct. 212 > 100 is True but 212 < 200 is False, so `and` gives False and `or` gives True." }
  ],
  answer: 3,
  explain: "`and` is True only if both comparisons are True; `or` is True if at least one is.",
  verify: {}
});

BB.questions.push({
  id: "py-025",
  obj: ["PY.LOGIC"],
  lesson: "f2-logic",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "print(not 5 > 3 or 2 > 1, not (5 > 3 or 2 > 1))" },
  options: [
    { t: "False False", why: "In the first expression `not` binds more tightly than `or`, so it flips only `5 > 3`, and the `or` then sees `2 > 1`, which is True." },
    { t: "True False", why: "Correct. Without parentheses, `not` applies only to `5 > 3`: (not True) or True is True. With parentheses, not (True or True) is False." },
    { t: "True True", why: "In the second expression the parentheses come first: True or True is True, and `not` flips it to False." },
    { t: "False True", why: "This applies `not` to the whole first expression and to only part of the second, the reverse of what Python does." }
  ],
  answer: 1,
  explain: "Precedence order: comparisons, then `not`, then `and`, then `or`. Parentheses change the grouping.",
  verify: {}
});

BB.questions.push({
  id: "py-026",
  obj: ["PY.LOGIC", "PY.COND"],
  lesson: "f2-logic",
  level: 3,
  q: "This should print \"other gene\" for GAPDH. What does it print?",
  code: {
    lang: "python",
    src: "gene = \"GAPDH\"\nif gene == \"DNAJB1\" or \"HSPH1\":\n    print(\"heat-shock gene\")\nelse:\n    print(\"other gene\")"
  },
  options: [
    { t: "heat-shock gene", why: "Correct. The right side of `or` is just the string \"HSPH1\", which counts as true, so the condition passes for every gene." },
    { t: "other gene", why: "That is the intended behavior, but `gene == \"DNAJB1\" or \"HSPH1\"` does not compare gene with \"HSPH1\"." },
    { t: "SyntaxError: invalid syntax", why: "The line is valid Python, which is what makes this bug dangerous: it runs and silently gives the wrong answer." }
  ],
  answer: 0,
  explain: "Each side of `or` is judged separately, and a non-empty string counts as true. Write `gene == \"DNAJB1\" or gene == \"HSPH1\"`.",
  verify: {}
});

BB.questions.push({
  id: "py-027",
  obj: ["PY.LOGIC"],
  lesson: "f2-logic",
  level: 3,
  q: "Damaged cells tend to have few detected genes and many reads from mitochondrial genes. You keep a cell only if it has at least 200 detected genes and less than 5% mitochondrial reads. Which expression is correct?",
  options: [
    { t: "`genes >= 200 or mito < 0.05`", why: "`or` keeps a cell that passes only one test, so many damaged cells would slip through." },
    { t: "`genes >= 200 and mito < 0.05`", why: "Correct. Both conditions must hold, so `and` is needed, and \"at least 200\" is `>= 200`." },
    { t: "`genes > 200 and mito <= 0.05`", why: "Both boundaries are wrong: a cell with exactly 200 genes is rejected and a cell with exactly 5% mitochondrial reads is kept." },
    { t: "`not (genes < 200 and mito >= 0.05)`", why: "This rejects a cell only when it fails both tests at once, so it is the same as the `or` version." }
  ],
  answer: 1,
  explain: "A rule with several required conditions is an `and` of comparisons, with each boundary written exactly as the rule states it."
});

BB.questions.push({
  id: "py-028",
  obj: ["PY.COND"],
  lesson: "f2-conditionals",
  level: 1,
  q: "In one if, elif and else chain, how many blocks can run?",
  options: [
    { t: "Every block whose condition is True", why: "That describes separate `if` statements. In a chain, the first True condition wins and the rest are skipped." },
    { t: "Exactly one when there is an `else`, and at most one without it", why: "Correct. Python runs the first block whose condition is True and skips the rest." },
    { t: "The `else` block always runs, plus any True ones", why: "`else` runs only when none of the conditions above it were True." }
  ],
  answer: 1,
  explain: "An if, elif and else chain picks one branch at most. Use separate `if` statements when several actions may all be needed."
});

BB.questions.push({
  id: "py-029",
  obj: ["PY.COND"],
  lesson: "f2-conditionals",
  level: 2,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "reads = 24600000\nif reads > 10000000:\n    print(\"ok\")\nelif reads > 20000000:\n    print(\"deep\")\nelse:\n    print(\"low\")"
  },
  options: [
    { t: "ok", why: "Correct. 24,600,000 > 10,000,000 is True, so the first block runs and the `elif` is never checked." },
    { t: "deep", why: "`reads > 20000000` is also True, but Python never reaches it because an earlier condition was already True." },
    { t: "ok\ndeep", why: "Only one block of a chain runs." }
  ],
  answer: 0,
  explain: "Order matters: put the strictest test first, `if reads > 20000000:` before `elif reads > 10000000:`.",
  verify: {}
});

BB.questions.push({
  id: "py-030",
  obj: ["PY.COND"],
  lesson: "f2-conditionals",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "fc = 6.0\nif fc > 2:\n    print(\"up\")\nif fc > 4:\n    print(\"strongly up\")" },
  options: [
    { t: "up", why: "That would happen with `elif`. Two separate `if` statements are checked independently." },
    { t: "strongly up", why: "The first `if` is also True, so \"up\" is printed first." },
    { t: "up\nstrongly up", why: "Correct. These are two separate if statements, so both conditions are checked and both are True." }
  ],
  answer: 2,
  explain: "Separate `if` statements do not exclude each other; only `elif` and `else` link conditions into one chain.",
  verify: {}
});

BB.questions.push({
  id: "py-031",
  obj: ["PY.COND", "PY.DEBUG"],
  lesson: "f2-conditionals",
  level: 3,
  q: "This chain should print \"down\" for a log2 fold change of -2.5. What does it actually print?",
  code: {
    lang: "python",
    src: "lfc = -2.5\nif lfc > 1:\n    print(\"up\")\nelif lfc > -1:\n    print(\"down\")\nelse:\n    print(\"unchanged\")"
  },
  options: [
    { t: "down", why: "That is the intention, but -2.5 is not greater than -1, so the `elif` condition is False." },
    { t: "unchanged", why: "Correct. -2.5 > 1 is False, and -2.5 > -1 is also False, so the `else` block runs. The `elif` should test `lfc < -1`." },
    { t: "up", why: "-2.5 is not greater than 1." }
  ],
  answer: 1,
  explain: "Check each condition with the actual value. Down-regulated genes have negative log2 fold changes, so the test must be `lfc < -1`.",
  verify: {}
});

BB.questions.push({
  id: "py-032",
  obj: ["PY.COND"],
  lesson: "f2-conditionals",
  level: 1,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "count = 0\nif count > 0:\n    print(\"expressed\")\nelse:\n    print(\"not detected\")\nprint(\"next gene\")"
  },
  options: [
    { t: "not detected\nnext gene", why: "Correct. 0 > 0 is False, so the `else` block runs, and the unindented last line always runs." },
    { t: "not detected", why: "The last line is not indented, so it is outside the if statement and runs in every case." },
    { t: "expressed\nnext gene", why: "0 is not greater than 0, so the condition is False." }
  ],
  answer: 0,
  explain: "The `else` block handles every case the `if` did not, and unindented lines after the statement always run.",
  verify: {}
});

BB.questions.push({
  id: "py-033",
  obj: ["PY.MODULES"],
  lesson: "f2-modules",
  level: 1,
  q: "Which import lets you write `log2(8)` without any prefix?",
  options: [
    { t: "`import math`", why: "This adds only the name `math`, so you would write `math.log2(8)`." },
    { t: "`import log2`", why: "There is no module called log2, so this raises ModuleNotFoundError. `log2` lives inside the math module." },
    { t: "`from math import log2`", why: "Correct. This imports the name `log2` itself, so you can call it directly." }
  ],
  answer: 2,
  explain: "`from module import name` brings one name in directly; `import module` requires the `module.` prefix."
});

BB.questions.push({
  id: "py-034",
  obj: ["PY.MODULES"],
  lesson: "f2-modules",
  level: 1,
  q: "What does this print?",
  code: { lang: "python", src: "from math import log2\nprint(log2(8), log2(1))" },
  options: [
    { t: "3 0", why: "`math.log2` returns a float, so the values print as 3.0 and 0.0." },
    { t: "3.0 0.0", why: "Correct. 2 to the power 3 is 8 and 2 to the power 0 is 1. The math functions return floats." },
    { t: "3.0 1.0", why: "log2(1) asks: 2 to what power gives 1? The answer is 0." }
  ],
  answer: 1,
  explain: "`log2(x)` is the power you must raise 2 to in order to get x. A log2 fold change of 0 means no change.",
  verify: {}
});

BB.questions.push({
  id: "py-035",
  obj: ["PY.MODULES"],
  lesson: "f2-modules",
  level: 2,
  q: "A sample was collected on 25 February 2026 and sequenced on 4 March 2026. What does this print?",
  code: {
    lang: "python",
    src: "import datetime\ncollected = datetime.date(2026, 2, 25)\nsequenced = datetime.date(2026, 3, 4)\nprint((sequenced - collected).days)"
  },
  options: [
    { t: "9", why: "This assumes February has 30 days. 2026 is not a leap year, so February has 28, and datetime knows it." },
    { t: "7", why: "Correct. February 2026 has 28 days: 3 more days to the end of February, then 4 in March." },
    { t: "-21", why: "That subtracts only the day numbers (4 minus 25). Date subtraction compares whole calendar dates." },
    { t: "8", why: "This counts both the first and the last day. Subtracting dates counts the days between them." }
  ],
  answer: 1,
  explain: "Subtracting two `datetime.date` values gives a duration whose `.days` attribute accounts for month lengths and leap years.",
  verify: {}
});

BB.questions.push({
  id: "py-036",
  obj: ["PY.MODULES"],
  lesson: "f2-modules",
  level: 2,
  q: "What happens when this runs?",
  code: { lang: "python", src: "import numpy as np\nprint(numpy.log2(8))" },
  options: [
    { t: "3.0", why: "That is what `np.log2(8)` would print. The full name `numpy` was never created by this import." },
    { t: "ModuleNotFoundError: No module named 'numpy'", why: "NumPy was found and imported without trouble. The problem is the name used afterwards." },
    { t: "NameError: name 'numpy' is not defined", why: "Correct. The module was imported under the alias `np`, so only the name `np` exists." }
  ],
  answer: 2,
  explain: "`import numpy as np` creates only the name `np`. Use the alias you chose: `np.log2(8)`.",
  verify: { mode: "error" }
});

BB.questions.push({
  id: "py-037",
  obj: ["PY.MODULES", "PY.DEBUG"],
  lesson: "f2-modules",
  level: 3,
  q: "A colleague's script starts with `import pandas as pd`. On your laptop it stops at once with `ModuleNotFoundError: No module named 'pandas'`. What is the most likely cause?",
  options: [
    { t: "The alias `pd` is misspelled", why: "An alias problem would give a NameError later, when `pd` is used. This error happens at the import itself." },
    { t: "pandas is not installed in the Python environment you are using, so it must be installed first (for example with pip or conda)", why: "Correct. pandas is not part of the standard library. Each Python installation or environment has its own set of installed packages." },
    { t: "The script must be renamed to pandas.py", why: "Naming a script after a module causes problems instead of fixing them, because Python may import the script in place of the real module." }
  ],
  answer: 1,
  explain: "ModuleNotFoundError means Python searched its installed modules and found none with that name. Install the package into the environment that runs the script."
});

BB.questions.push({
  id: "py-038",
  obj: ["PY.STR"],
  lesson: "f2-strings",
  level: 1,
  q: "What does this print?",
  code: { lang: "python", src: "seq = \"GATTACA\"\nprint(seq[0], seq[-1], len(seq))" },
  options: [
    { t: "G A 7", why: "Correct. Index 0 is the first character, index -1 is the last, and the string has 7 characters." },
    { t: "G A 6", why: "`len` counts the characters, 7 here. The last index is 6 because counting starts at 0." },
    { t: "IndexError: string index out of range", why: "Negative indexes are allowed: -1 is the last character, -2 the one before it." }
  ],
  answer: 0,
  explain: "Python indexes from 0 at the front and from -1 at the back. `len` gives the number of characters.",
  verify: {}
});

BB.questions.push({
  id: "py-039",
  obj: ["PY.STR"],
  lesson: "f2-strings",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "seq = \"ATGCGTAA\"\nprint(seq[2:5])" },
  options: [
    { t: "TGCG", why: "This takes positions 2 to 5 counted from 1, end included. Python counts from 0, so index 2 is the third character, and the stop index 5 is excluded." },
    { t: "GCG", why: "Correct. Indexes 2, 3 and 4 hold G, C and G; the slice stops before index 5." },
    { t: "GCGT", why: "The stop index is excluded, so index 5 (a T) is not part of the slice." },
    { t: "TGC", why: "This uses positions 2 to 4 counted from 1. Python counts from 0." }
  ],
  answer: 1,
  explain: "`seq[2:5]` has 5 - 2 = 3 characters, starting at index 2.",
  verify: {}
});

BB.questions.push({
  id: "py-040",
  obj: ["PY.STR"],
  lesson: "f2-strings",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "print(\"AAAA\".count(\"AA\"))" },
  options: [
    { t: "3", why: "There are 3 overlapping positions where AA starts, but `count` skips past each match, so matches cannot overlap." },
    { t: "2", why: "Correct. `count` finds non-overlapping matches: AA at index 0, then it continues after that match and finds AA at index 2." },
    { t: "4", why: "`count` looks for the whole text \"AA\", not single letters." }
  ],
  answer: 1,
  explain: "`str.count` counts non-overlapping occurrences. Counting overlapping motifs needs a loop over every start position.",
  verify: {}
});

BB.questions.push({
  id: "py-041",
  obj: ["PY.STR", "PY.BIO"],
  lesson: "f2-strings",
  level: 3,
  q: "Which test is True exactly when `seq` contains the EcoRI site GAATTC anywhere, including at the very start?",
  options: [
    { t: "`seq.find(\"GAATTC\") > 0`", why: "`find` returns 0 when the site is at the very start, and 0 > 0 is False, so that site is missed. `find` returns -1 when there is no match." },
    { t: "`\"GAATTC\" in seq`", why: "Correct. `in` checks for the text anywhere in the string." },
    { t: "`seq.count(\"GAATTC\") == 1`", why: "This is False when the sequence contains two or more sites." },
    { t: "`seq == \"GAATTC\"`", why: "This is True only when the whole sequence is exactly the site." }
  ],
  answer: 1,
  explain: "`in` is the clearest membership test for strings. If you use `find`, compare with `>= 0`, because 0 is a valid position."
});

BB.questions.push({
  id: "py-042",
  obj: ["PY.STR"],
  lesson: "f2-strings",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "gc = 7 / 18\nprint(f\"GC = {gc:.2f}\")\nprint(\"GC = {gc:.2f}\")" },
  options: [
    { t: "GC = 0.39\nGC = 0.39", why: "Without the `f` before the quote, the braces are printed as ordinary characters." },
    { t: "GC = 0.3888888888888889\nGC = {gc:.2f}", why: "`:.2f` inside the braces formats the number with exactly 2 decimal places." },
    { t: "GC = 0.39\nGC = {gc:.2f}", why: "Correct. Only the first string has the `f` prefix, so only it replaces the braces with the formatted value." }
  ],
  answer: 2,
  explain: "An f-string needs the `f` prefix. Inside the braces, a format such as `:.2f` controls how the value is shown.",
  verify: {}
});

BB.questions.push({
  id: "py-043",
  obj: ["PY.LISTS"],
  lesson: "f2-lists-loops",
  level: 1,
  q: "What does this print?",
  code: { lang: "python", src: "counts = [212, 282, 203]\nprint(counts[1], len(counts))" },
  options: [
    { t: "212 3", why: "212 is at index 0. Lists are indexed from 0, like strings." },
    { t: "282 3", why: "Correct. Index 1 is the second item, and the list has 3 items." },
    { t: "282 2", why: "`len` counts the items, 3. The last index is 2." }
  ],
  answer: 1,
  explain: "Index 1 is the second item; `len` gives the number of items.",
  verify: {}
});

BB.questions.push({
  id: "py-044",
  obj: ["PY.LISTS"],
  lesson: "f2-lists-loops",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "counts = [5, 10, 15]\ncounts.append(20)\ncounts[0] = 1\nprint(counts)" },
  options: [
    { t: "[1, 10, 15, 20]", why: "Correct. `append` adds 20 at the end, and `counts[0] = 1` replaces the first item." },
    { t: "[1, 5, 10, 15, 20]", why: "Assigning to `counts[0]` replaces the item at index 0; it does not insert a new item." },
    { t: "[5, 10, 15, 20]", why: "`counts[0] = 1` is an assignment that changes the first item, not a comparison." }
  ],
  answer: 0,
  explain: "Lists can be changed in place: `append` grows the list and index assignment replaces one item.",
  verify: {}
});

BB.questions.push({
  id: "py-045",
  obj: ["PY.LISTS"],
  lesson: "f2-lists-loops",
  level: 2,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "samples = [\"ctrl_1\", \"ctrl_2\", \"ctrl_3\", \"heat_1\", \"heat_2\", \"heat_3\"]\nprint(samples[1:3])"
  },
  options: [
    { t: "['ctrl_1', 'ctrl_2', 'ctrl_3']", why: "That is `samples[0:3]` or `samples[:3]`. Index 1 is the second item." },
    { t: "['ctrl_2', 'ctrl_3', 'heat_1']", why: "The stop index 3 is excluded, so heat_1 is not included." },
    { t: "['ctrl_2', 'ctrl_3']", why: "Correct. The slice starts at index 1 (the second item) and stops before index 3." }
  ],
  answer: 2,
  explain: "Slices of lists follow the same rule as strings: start included, stop excluded.",
  verify: {}
});

BB.questions.push({
  id: "py-046",
  obj: ["PY.LOOPS"],
  lesson: "f2-lists-loops",
  level: 1,
  q: "The three HSPA6 control counts are 2, 0 and 3. What does this print?",
  code: { lang: "python", src: "total = 0\nfor c in [2, 0, 3]:\n    total = total + c\nprint(total)" },
  options: [
    { t: "3", why: "3 is only the last item. The accumulator keeps adding on each pass." },
    { t: "5", why: "Correct. total goes 0, 2, 2, 5, and `print` runs once after the loop." },
    { t: "2\n2\n5", why: "`print` is not indented, so it is outside the loop and runs only once." }
  ],
  answer: 1,
  explain: "The accumulator starts at 0, adds each item inside the loop, and is printed after the loop ends.",
  verify: {}
});

BB.questions.push({
  id: "py-047",
  obj: ["PY.LOOPS"],
  lesson: "f2-lists-loops",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "for i in range(1, 4):\n    print(i * 3)" },
  options: [
    { t: "3\n6\n9", why: "Correct. `range(1, 4)` gives 1, 2 and 3; the stop value 4 is excluded." },
    { t: "3\n6\n9\n12", why: "`range` stops before its end value, so 4 is never produced." },
    { t: "0\n3\n6", why: "With a start value of 1, the range begins at 1, not 0." }
  ],
  answer: 0,
  explain: "`range(start, stop)` produces whole numbers from start up to but not including stop.",
  verify: {}
});

BB.questions.push({
  id: "py-048",
  obj: ["PY.LOOPS"],
  lesson: "f2-lists-loops",
  level: 2,
  q: "FOS has one unusually high heat replicate. What does this print?",
  code: {
    lang: "python",
    src: "fos = [220, 223, 277, 311, 1906, 260]\nn = 0\nfor c in fos:\n    if c > 1000:\n        n = n + 1\nprint(n, max(fos))"
  },
  options: [
    { t: "6 1906", why: "`n` increases only when the `if` condition is True, not on every pass." },
    { t: "1906 1906", why: "`n = n + 1` adds 1 for each match; it never stores the matching value." },
    { t: "1 1906", why: "Correct. Only 1906 is above 1000, so `n` ends at 1, and `max` returns the largest value, 1906." }
  ],
  answer: 2,
  explain: "Combining an accumulator with `if` counts how many items pass a test.",
  verify: {}
});

BB.questions.push({
  id: "py-049",
  obj: ["PY.LISTS", "PY.LOOPS"],
  lesson: "f2-lists-loops",
  level: 3,
  q: "The loop should collect the names of genes with at least 1000 heat_1 reads. Which line belongs in the blank?",
  code: {
    lang: "python",
    src: "genes = [\"HSPA6\", \"DNAJB1\", \"TP53\", \"FOS\"]\nheat_1 = [999, 6820, 881, 311]\nkeep = []\nfor i in range(len(genes)):\n    if heat_1[i] >= 1000:\n        ____________\nprint(keep)"
  },
  options: [
    { t: "`keep.append(heat_1[i])`", why: "This collects the counts, not the gene names." },
    { t: "`keep.append(genes[i])`", why: "Correct. `i` is a position, so `genes[i]` is the name that matches `heat_1[i]`, and `append` adds it to the result list." },
    { t: "`keep = genes[i]`", why: "This replaces the whole list with a single name on each match, so at most one name survives." },
    { t: "`genes.append(keep)`", why: "This changes the input list instead of building the result." }
  ],
  answer: 1,
  explain: "When two lists are aligned by position, one index `i` reaches matching items in both."
});

BB.questions.push({
  id: "py-050",
  obj: ["PY.LISTS", "PY.READ"],
  lesson: "f2-lists-loops",
  level: 3,
  q: "What does this print?",
  code: { lang: "python", src: "ctrl = [212, 282, 203]\nbackup = ctrl\nctrl.append(999)\nprint(len(backup))" },
  options: [
    { t: "4", why: "Correct. `backup = ctrl` does not copy the list; both names refer to the same list, so the append is visible through `backup` too." },
    { t: "3", why: "This assumes `backup` is an independent copy. Use `ctrl.copy()` to make one." },
    { t: "999", why: "`len` gives the number of items, not the last value." }
  ],
  answer: 0,
  explain: "Assigning a list to a second name shares the same list. Changes through either name affect both.",
  verify: {}
});

BB.questions.push({
  id: "py-051",
  obj: ["PY.LOOPS", "PY.BIO"],
  lesson: "f2-lists-loops",
  level: 3,
  q: "Which loop collects every codon of `seq`, in order, into the list `codons`?",
  options: [
    { t: "`for i in range(len(seq)): codons.append(seq[i:i + 3])`", why: "This starts a slice at every position, giving overlapping three-letter pieces rather than codons." },
    { t: "`for i in range(0, len(seq), 3): codons.append(seq[i:i + 3])`", why: "Correct. The step of 3 gives the start of each codon: 0, 3, 6 and so on." },
    { t: "`for i in range(1, len(seq), 3): codons.append(seq[i:i + 3])`", why: "Starting at 1 shifts the reading frame by one base, so every codon is wrong." },
    { t: "`for i in range(0, len(seq), 3): codons.append(seq[i:i + 2])`", why: "A slice from i to i + 2 holds only two bases." }
  ],
  answer: 1,
  explain: "Codons are consecutive, non-overlapping groups of three, so the loop steps by 3 and slices 3 characters."
});

BB.questions.push({
  id: "py-052",
  obj: ["PY.DICTS"],
  lesson: "f2-dicts",
  level: 1,
  q: "What does this print?",
  code: { lang: "python", src: "d = {\"HSPA1A\": 212, \"ACTB\": 44289}\nprint(d[\"ACTB\"])" },
  options: [
    { t: "212", why: "212 belongs to the key \"HSPA1A\". Dictionaries look up by key, not by position." },
    { t: "44289", why: "Correct. The key \"ACTB\" looks up its value, 44289." },
    { t: "ACTB", why: "Square brackets with a key return the value, not the key." }
  ],
  answer: 1,
  explain: "`d[key]` returns the value stored under that key.",
  verify: {}
});

BB.questions.push({
  id: "py-053",
  obj: ["PY.DICTS"],
  lesson: "f2-dicts",
  level: 2,
  q: "What happens when this runs?",
  code: { lang: "python", src: "codons = {\"ATG\": \"M\", \"TAA\": \"*\"}\nprint(codons[\"TAG\"])" },
  options: [
    { t: "KeyError: 'TAG'", why: "Correct. TAG is a real stop codon, but this dictionary has no TAG key, and square-bracket lookup of a missing key raises KeyError." },
    { t: "*", why: "Python does not know biology: it only knows the keys you put in the dictionary." },
    { t: "None", why: "Square brackets raise an error for a missing key. `codons.get(\"TAG\")` would return None instead." }
  ],
  answer: 0,
  explain: "Use `d.get(key, default)` when a key may be missing, or make sure the dictionary is complete.",
  verify: { mode: "error" }
});

BB.questions.push({
  id: "py-054",
  obj: ["PY.DICTS", "PY.READ"],
  lesson: "f2-dicts",
  level: 2,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "counts = {}\nfor base in \"GGCAT\":\n    counts[base] = counts.get(base, 0) + 1\nprint(counts)"
  },
  options: [
    { t: "{'A': 1, 'C': 1, 'G': 2, 'T': 1}", why: "The counts are right, but dictionaries keep insertion order (G, C, A, T); they are not sorted alphabetically." },
    { t: "{'G': 1, 'C': 1, 'A': 1, 'T': 1}", why: "The second G finds the existing value 1 through `get` and stores 2." },
    { t: "{'G': 2, 'C': 1, 'A': 1, 'T': 1}", why: "Correct. `get(base, 0)` returns 0 for a new base, so each base is counted, and keys keep the order in which they first appeared." }
  ],
  answer: 2,
  explain: "`counts.get(base, 0) + 1` is the one-line counting pattern: 0 for a new key, otherwise the current count, plus one.",
  verify: {}
});

BB.questions.push({
  id: "py-055",
  obj: ["PY.DICTS"],
  lesson: "f2-dicts",
  level: 2,
  q: "Line 3 corrects a typo in the ctrl_1 library size. What does this print?",
  code: {
    lang: "python",
    src: "reads = {\"ctrl_1\": 18400000, \"heat_1\": 24600000}\nreads[\"heat_2\"] = 17900000\nreads[\"ctrl_1\"] = 18500000\nprint(len(reads), reads[\"ctrl_1\"])"
  },
  options: [
    { t: "4 18400000", why: "Keys are unique, so the second assignment to ctrl_1 replaces the value instead of adding a second ctrl_1." },
    { t: "3 18500000", why: "Correct. heat_2 is a new key, so there are now 3 keys, and assigning to ctrl_1 again replaces its old value." },
    { t: "4 18500000", why: "ctrl_1 is updated, not duplicated, so there are 3 keys." }
  ],
  answer: 1,
  explain: "Assigning to a new key adds a pair; assigning to an existing key replaces its value.",
  verify: {}
});

BB.questions.push({
  id: "py-056",
  obj: ["PY.DICTS", "PY.BIO"],
  lesson: "f2-dicts",
  level: 3,
  q: "You want to translate codons into one-letter amino-acid codes for many sequences. Which approach fits best?",
  options: [
    { t: "A dictionary with codons as keys and amino acids as values, used for a lookup per codon", why: "Correct. Each codon goes straight to its amino acid, and the table is written once and reused." },
    { t: "Two lists, one of codons and one of amino acids, searched for the codon each time", why: "It works, but every lookup has to search the codon list, and the two lists must be kept perfectly aligned." },
    { t: "A long if and elif chain with one branch per codon", why: "With 64 codons this is long, error-prone and hard to check, whereas a table of pairs is easy to read and change." }
  ],
  answer: 0,
  explain: "Mappings from one code to another are what dictionaries are built for."
});

BB.questions.push({
  id: "py-057",
  obj: ["PY.FILES"],
  lesson: "f2-files",
  level: 1,
  q: "What does `line.rstrip(\"\\n\").split(\"\\t\")` do to a line read from a TSV file?",
  options: [
    { t: "It converts every field into a number", why: "Neither method converts anything; the fields stay strings until you call `int()` or `float()`." },
    { t: "It removes all the tabs and joins the fields into one string", why: "`split` cuts at the tabs and returns a list; it does not join anything." },
    { t: "It removes the newline at the end, then cuts the line at each tab into a list of strings", why: "Correct. These two methods turn one line of text into a list of fields." }
  ],
  answer: 2,
  explain: "`rstrip` removes characters from the right-hand end of a string, and `split` returns a list of the pieces between separators."
});

BB.questions.push({
  id: "py-058",
  obj: ["PY.FILES"],
  lesson: "f2-files",
  level: 2,
  q: "The file `samples.tsv` has a header line and 6 sample lines. What does this print?",
  code: {
    lang: "python",
    src: "with open(\"samples.tsv\") as f:\n    lines = f.readlines()\nprint(len(lines))\nprint(lines[1].split(\"\\t\")[1])"
  },
  options: [
    { t: "6\ncontrol", why: "The header is a line too, so the list has 7 items." },
    { t: "7\ncondition", why: "`lines[0]` is the header. `lines[1]` is the ctrl_1 line, whose second field is control." },
    { t: "7\nctrl_1", why: "Field 0 would be the sample name. `[1]` selects the second field, the condition." },
    { t: "7\ncontrol", why: "Correct. `readlines` returns all 7 lines, including the header. `lines[1]` is the first data line, and its field 1 is the condition." }
  ],
  answer: 3,
  explain: "`readlines()` returns every line as a list of strings, header included; index each line's fields from 0.",
  verify: {}
});

BB.questions.push({
  id: "py-059",
  obj: ["PY.FILES", "PY.BIO"],
  lesson: "f2-files",
  level: 2,
  q: "`sequences.fa` is a FASTA file with 15 lines: 6 header lines starting with `>`, and long sequences wrapped over two lines. What does this print?",
  code: {
    lang: "python",
    src: "n = 0\nwith open(\"sequences.fa\") as f:\n    for line in f:\n        if line.startswith(\">\"):\n            n = n + 1\nprint(n)"
  },
  options: [
    { t: "6", why: "Correct. Each FASTA record has exactly one header line starting with `>`, so counting headers counts sequences." },
    { t: "15", why: "That is the number of lines. Sequence lines are wrapped, so lines are not records." },
    { t: "9", why: "That is the number of sequence lines, not the number of records." }
  ],
  answer: 0,
  explain: "Counting lines that start with `>` counts FASTA records, whatever the line wrapping.",
  verify: {}
});

BB.questions.push({
  id: "py-060",
  obj: ["PY.FILES", "PY.DEBUG"],
  lesson: "f2-files",
  level: 3,
  q: "This should count the samples heated to 42 C (there are 3). What does it print?",
  code: {
    lang: "python",
    src: "n = 0\nwith open(\"samples.tsv\") as f:\n    header = f.readline()\n    for line in f:\n        fields = line.split(\"\\t\")\n        if fields[3] == \"42\":\n            n = n + 1\nprint(n)"
  },
  options: [
    { t: "3", why: "That is the intended answer, but each line still ends with a newline, so the comparison `fields[3] == \"42\"` is always False." },
    { t: "ValueError: invalid literal for int() with base 10: 'temperature_C'", why: "The header was skipped with `readline`, and nothing is converted with `int()`, so no error occurs." },
    { t: "0", why: "Correct. The newline was never stripped, so the last field is \"42\\n\", which is not equal to \"42\"." }
  ],
  answer: 2,
  explain: "Strip the newline before splitting: `line.rstrip(\"\\n\").split(\"\\t\")`. Then compare, or convert with `int()` and compare numbers.",
  verify: {}
});

BB.questions.push({
  id: "py-061",
  obj: ["PY.FILES"],
  lesson: "f2-files",
  level: 1,
  q: "By mistake, you run `open(\"counts.tsv\", \"w\")` on your raw count file. What happens?",
  options: [
    { t: "Python reads the file as usual", why: "Mode \"w\" is for writing. Reading uses the default mode, \"r\"." },
    { t: "The file is emptied immediately and is ready for new text, because mode \"w\" replaces existing content", why: "Correct. Opening for writing truncates the file at once, before anything is written. Keep raw data read-only and write results to new files." },
    { t: "Python refuses because the file already exists", why: "Mode \"w\" overwrites without asking. Mode \"x\" would refuse when the file exists." },
    { t: "New text is added to the end of the file", why: "That is mode \"a\" (append). Mode \"w\" starts the file again from empty." }
  ],
  answer: 1,
  explain: "Write outputs to new files in a results folder and never open raw data in \"w\" mode."
});

BB.questions.push({
  id: "py-062",
  obj: ["PY.PANDAS"],
  lesson: "f2-pandas",
  level: 1,
  q: "What is a pandas DataFrame?",
  options: [
    { t: "A table held in memory, with labeled rows and columns", why: "Correct. It is pandas' main structure for tabular data, such as a count matrix or sample metadata." },
    { t: "A file format for storing tables, like TSV", why: "A DataFrame lives in memory. `read_csv` builds one from a file and `to_csv` writes one out." },
    { t: "A single list of numbers", why: "A DataFrame has rows and columns, and each column can have its own type." }
  ],
  answer: 0,
  explain: "A DataFrame is a two-dimensional, labeled table; each column is stored as a NumPy array."
});

BB.questions.push({
  id: "py-063",
  obj: ["PY.PANDAS"],
  lesson: "f2-pandas",
  level: 2,
  q: "`counts.tsv` has a header line and 12 gene lines, with a gene column followed by 6 sample columns. What does this print?",
  code: {
    lang: "python",
    src: "import pandas as pd\ncounts = pd.read_csv(\"counts.tsv\", sep=\"\\t\", index_col=0)\nprint(counts.shape)"
  },
  options: [
    { t: "(13, 7)", why: "The header becomes the column names, not a row, and the gene column became the row labels." },
    { t: "(12, 6)", why: "Correct. `index_col=0` turns the gene column into row labels, leaving 12 rows and 6 data columns." },
    { t: "(12, 7)", why: "With `index_col=0`, the gene names are labels, not a data column." },
    { t: "(6, 12)", why: "`shape` lists rows first, then columns. Genes are the rows here." }
  ],
  answer: 1,
  explain: "`shape` is (rows, columns). The header supplies the column names and `index_col=0` supplies the row labels.",
  verify: {}
});

BB.questions.push({
  id: "py-064",
  obj: ["PY.PANDAS"],
  lesson: "f2-pandas",
  level: 1,
  q: "`counts` has genes as rows and samples as columns. What does `counts.mean(axis=1)` give?",
  options: [
    { t: "One mean per sample", why: "That is the default, `axis=0`, which averages down each column." },
    { t: "One mean per gene, averaged across its samples", why: "Correct. `axis=1` averages across the columns of each row." },
    { t: "A single mean of the whole table", why: "`mean` with an axis returns one value per row or per column, not one overall value." }
  ],
  answer: 1,
  explain: "`axis=0` works down the rows (one result per column); `axis=1` works across the columns (one result per row)."
});

BB.questions.push({
  id: "py-065",
  obj: ["PY.PANDAS"],
  lesson: "f2-pandas",
  level: 2,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "import pandas as pd\ncounts = pd.read_csv(\"counts.tsv\", sep=\"\\t\", index_col=0)\nprint(counts.loc[\"HSPA6\", \"ctrl_2\"], counts[\"heat_3\"].max())"
  },
  options: [
    { t: "0 109219", why: "Correct. `loc` takes the row label first and the column label second: HSPA6 in ctrl_2 is 0. The largest heat_3 count is 109219 (EEF1A1)." },
    { t: "2 109219", why: "2 is HSPA6 in ctrl_1. `loc[\"HSPA6\", \"ctrl_2\"]` selects the ctrl_2 column." },
    { t: "0 EEF1A1", why: "`max()` returns the largest value, not its label. `idxmax()` would return the gene name." }
  ],
  answer: 0,
  explain: "`df.loc[row_label, column_label]` selects one cell; column methods such as `max()` summarize all of a column's values.",
  verify: {}
});

BB.questions.push({
  id: "py-066",
  obj: ["PY.PANDAS"],
  lesson: "f2-pandas",
  level: 3,
  q: "Filtering `counts` for heat_1 above 10,000 keeps HSPA1A, HSPA1B, ACTB, GAPDH and EEF1A1. A classmate concludes that all five genes are induced by heat. What is wrong with this conclusion?",
  options: [
    { t: "pandas filters are unreliable when more than three rows match", why: "The filter worked exactly as written. The problem is the question it answers." },
    { t: "The threshold should have been 1000 instead of 10,000", why: "Any single-sample threshold has the same problem: it measures level, not change." },
    { t: "The filter finds genes with high counts in one sample; induction is a change from control to heat, which needs a comparison such as a fold change", why: "Correct. ACTB, GAPDH and EEF1A1 are high in every sample. Only the comparison with the control samples reveals a change." }
  ],
  answer: 2,
  explain: "A high value is not a change. Differential expression compares conditions, using replicates and statistics (Foundation 3)."
});

BB.questions.push({
  id: "py-067",
  obj: ["PY.PANDAS"],
  lesson: "f2-pandas",
  level: 2,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "import numpy as np\nctrl = np.array([212, 282, 203])\nheat = np.array([11018, 8441, 10838])\nprint((heat - ctrl).tolist(), heat.mean())"
  },
  options: [
    { t: "TypeError: unsupported operand type(s) for -: 'list' and 'list'", why: "That is what plain lists would give. NumPy arrays support element-by-element arithmetic." },
    { t: "[10806, 8159, 10635] 10099.0", why: "Correct. Subtracting two arrays works element by element, and `mean` averages the three heat counts." },
    { t: "29600 10099.0", why: "Array subtraction returns an array of three differences, not their total." }
  ],
  answer: 1,
  explain: "NumPy arrays apply arithmetic to each pair of matching elements, which is the basis of vectorized analysis.",
  verify: {}
});

BB.questions.push({
  id: "py-068",
  obj: ["PY.READ"],
  lesson: "f2-read-code",
  level: 2,
  q: "Read carefully: what does this print?",
  code: {
    lang: "python",
    src: "values = [3, 8, 2, 9, 4]\ncount = 0\nfor v in values:\n    if v > 4:\n        count = count + v\nprint(count)"
  },
  options: [
    { t: "2", why: "That is how many values are above 4, but the loop adds `v` itself, not 1." },
    { t: "21", why: "4 is not greater than 4, so it is not included." },
    { t: "26", why: "Only values above 4 are added, not all five." },
    { t: "17", why: "Correct. Despite its name, `count` adds up the values above 4: 8 + 9 = 17." }
  ],
  answer: 3,
  explain: "Read what the code does, not what its names suggest: `count = count + v` sums values.",
  verify: {}
});

BB.questions.push({
  id: "py-069",
  obj: ["PY.READ", "PY.BIO"],
  lesson: "f2-read-code",
  level: 3,
  q: "What does this function do?",
  code: {
    lang: "python",
    src: "def f(seq):\n    n = 0\n    for i in range(len(seq) - 1):\n        if seq[i:i + 2] == \"CG\":\n            n = n + 1\n    return n"
  },
  options: [
    { t: "It counts how many C and G bases the sequence contains", why: "It compares two-letter slices with \"CG\", so single C or G bases are not counted." },
    { t: "It counts how many times the two-letter pair CG occurs, including overlapping positions", why: "Correct. It checks every two-letter window, `seq[i:i + 2]`, and adds 1 for each CG." },
    { t: "It returns the GC content as a fraction", why: "Nothing is divided by the length; `n` is a count of matches." },
    { t: "It checks whether the sequence starts with CG", why: "The loop looks at every position, not only the first." }
  ],
  answer: 1,
  explain: "The loop visits each start position `i` and compares a two-character slice; this counts CpG dinucleotides, which matter in DNA methylation studies."
});

BB.questions.push({
  id: "py-070",
  obj: ["PY.READ", "PY.FUNC"],
  lesson: "f2-read-code",
  level: 2,
  q: "What does this print?",
  code: {
    lang: "python",
    src: "def first_above(values, limit):\n    for i in range(len(values)):\n        if values[i] > limit:\n            return i\n    return -1\n\nprint(first_above([212, 282, 203, 11018, 8441], 1000), first_above([2, 0, 3], 10))"
  },
  options: [
    { t: "4 -1", why: "Indexes count from 0, so the fourth item is at index 3." },
    { t: "3 None", why: "After the loop, `return -1` runs, so the function returns -1, not None." },
    { t: "11018 -1", why: "The function returns the position `i`, not the value." },
    { t: "3 -1", why: "Correct. 11018 at index 3 is the first value above 1000, and the second list has no value above 10, so the loop ends and -1 is returned." }
  ],
  answer: 3,
  explain: "`return` inside a loop ends the function at the first match; the line after the loop runs only when nothing matched.",
  verify: {}
});

BB.questions.push({
  id: "py-071",
  obj: ["PY.READ"],
  lesson: "f2-read-code",
  level: 1,
  q: "What is a trace table for?",
  options: [
    { t: "Recording each variable's value as you follow the code line by line", why: "Correct. It turns reading into a step-by-step record, so you can predict the output and spot where things go wrong." },
    { t: "Listing the files that a program reads", why: "Inputs matter, but a trace table tracks the values of variables as the code runs." },
    { t: "Measuring how long each line takes to run", why: "Timing is called profiling. A trace table records values, not speed." }
  ],
  answer: 0,
  explain: "A trace table has one column per variable and one row per step, which makes loops and function calls easy to follow."
});

BB.questions.push({
  id: "py-072",
  obj: ["PY.DEBUG"],
  lesson: "f2-debug",
  level: 1,
  q: "Which part of a traceback should you read first?",
  options: [
    { t: "The first line, \"Traceback (most recent call last):\"", why: "That line is the same for every error and carries no specific information." },
    { t: "The file name, to check that the right script ran", why: "The file name helps locate the problem, but the last line tells you what the problem is." },
    { t: "The last line, which names the exception type and gives a message", why: "Correct. It says what went wrong; the lines above it say where." }
  ],
  answer: 2,
  explain: "Read the last line for the kind of error, then the line number and the code shown above it for its location."
});

BB.questions.push({
  id: "py-073",
  obj: ["PY.DEBUG", "PY.TYPES"],
  lesson: "f2-debug",
  level: 2,
  q: "What happens when this runs?",
  code: { lang: "python", src: "count = 212\nprint(\"HSPA1A: \" + count)" },
  options: [
    { t: "HSPA1A: 212", why: "Python does not convert the number automatically. Use `str(count)` or a comma in `print`." },
    { t: "TypeError: can only concatenate str (not \"int\") to str", why: "Correct. `+` with a str on the left needs a str on the right too, and `count` is an int." },
    { t: "NameError: name 'count' is not defined", why: "`count` was assigned on line 1, so the name exists. The problem is its type." }
  ],
  answer: 1,
  explain: "Fix with `\"HSPA1A: \" + str(count)`, or `print(\"HSPA1A:\", count)`.",
  verify: { mode: "error" }
});

BB.questions.push({
  id: "py-074",
  obj: ["PY.DEBUG", "PY.LOGIC"],
  lesson: "f2-debug",
  level: 2,
  q: "What happens when this runs?",
  code: { lang: "python", src: "count = 10\nif count = 10:\n    print(\"ten\")" },
  options: [
    { t: "SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?", why: "Correct. A condition must compare with `==`. A single `=` is assignment and is not allowed in an if condition." },
    { t: "ten", why: "The program never runs: Python checks the grammar of the whole file first." },
    { t: "NameError: name 'count' is not defined", why: "`count` is defined on line 1. The problem is the grammar of line 2." }
  ],
  answer: 0,
  explain: "Use `==` to compare. Python's message even suggests the fix.",
  verify: { mode: "error" }
});

BB.questions.push({
  id: "py-075",
  obj: ["PY.DEBUG", "PY.LOOPS"],
  lesson: "f2-debug",
  level: 3,
  q: "This should print the mean of the three counts, 232.33, but it prints 67.67, with no error. Which change fixes it?",
  code: {
    lang: "python",
    src: "counts = [212, 282, 203]\nfor c in counts:\n    total = 0\n    total = total + c\nprint(total / len(counts))"
  },
  options: [
    { t: "Change `len(counts)` to 3", why: "`len(counts)` is already 3. The division is fine; the total is wrong." },
    { t: "Move `total = 0` above the `for` line, so the total is created once before the loop", why: "Correct. Inside the loop, `total` is reset on every pass, so only the last count, 203, survives: 203 / 3 is 67.67." },
    { t: "Use `//` instead of `/`", why: "That would print 67, an equally wrong mean in a different format." },
    { t: "Indent the last two lines into the loop", why: "Then a running value is printed on every pass, and the total is still reset each time." }
  ],
  answer: 1,
  explain: "An accumulator must be created before the loop and updated inside it. A wrong result with no error is a logic bug, found by tracing."
});

BB.questions.push({
  id: "py-076",
  obj: ["PY.DEBUG", "PY.DICTS"],
  lesson: "f2-debug",
  level: 3,
  q: "A script that looks up gene annotations in a dictionary stops with `KeyError: 'HSPA1L'`. What does this tell you, and what is a sensible next step?",
  options: [
    { t: "The dictionary is corrupted and must be rebuilt from scratch", why: "A KeyError means one key is absent; the rest of the dictionary is fine." },
    { t: "HSPA1L is in your data but not a key in the annotation dictionary; check both files and decide how to handle genes without annotation, for example with `get` and a default", why: "Correct. The KeyError names the missing key. The fix is a deliberate decision, not just silencing the error." },
    { t: "Python cannot store gene names that contain digits", why: "Strings can contain any characters; HSPA1A works as a key in the same dictionary." }
  ],
  answer: 1,
  explain: "In pipelines, a KeyError often means two files use different gene lists or naming systems. Investigate before choosing a default."
});

BB.questions.push({
  id: "py-077",
  obj: ["PY.BIO"],
  lesson: "f2-bio-project",
  level: 3,
  q: "The restriction enzyme BamHI cuts at GGATCC, a site that reads the same on both strands. What does this print?",
  code: {
    lang: "python",
    src: "def reverse_complement(seq):\n    pair = {\"A\": \"T\", \"T\": \"A\", \"G\": \"C\", \"C\": \"G\"}\n    result = \"\"\n    for base in seq:\n        result = pair[base] + result\n    return result\n\nprint(reverse_complement(\"GGATCC\"))"
  },
  options: [
    { t: "GGATCC", why: "Correct. The complement is CCTAGG, and reversing it gives GGATCC again: the site is its own reverse complement." },
    { t: "CCTAGG", why: "That is only half the job: either the complement or the reversal alone. The function does both, which restores GGATCC." },
    { t: "GGAUCC", why: "The reverse complement of DNA uses T, not U. U appears only after transcription into RNA." }
  ],
  answer: 0,
  explain: "Many restriction sites are reverse-complement palindromes, so the enzyme recognizes the same sequence on both strands.",
  verify: {}
});

BB.questions.push({
  id: "py-078",
  obj: ["PY.BIO"],
  lesson: "f2-bio-project",
  level: 2,
  q: "What does this print?",
  code: { lang: "python", src: "seq = \"GGCATA\"\nprint(round((seq.count(\"G\") + seq.count(\"C\")) / len(seq), 2))" },
  options: [
    { t: "0.33", why: "That counts only the G bases. GC content includes both G and C." },
    { t: "3", why: "3 is the number of G and C bases; the code divides by the length." },
    { t: "50", why: "The code computes a fraction. Multiply by 100 for a percentage." },
    { t: "0.5", why: "Correct. GGCATA has two G and one C: 3 of 6 bases, which is 0.5." }
  ],
  answer: 3,
  explain: "GC content = (G count + C count) / length.",
  verify: {}
});

BB.questions.push({
  id: "py-079",
  obj: ["PY.BIO", "PY.DICTS"],
  lesson: "f2-bio-project",
  level: 2,
  q: "TGG (tryptophan) is missing from the toy codon dictionary. What does this print?",
  code: {
    lang: "python",
    src: "codons = {\"ATG\": \"M\", \"GCC\": \"A\", \"AAA\": \"K\", \"TTT\": \"F\", \"GGG\": \"G\", \"TAA\": \"*\"}\n\ndef translate(seq):\n    protein = \"\"\n    for i in range(0, len(seq) - 2, 3):\n        aa = codons.get(seq[i:i + 3], \"X\")\n        if aa == \"*\":\n            break\n        protein = protein + aa\n    return protein\n\nprint(translate(\"ATGTGGAAATAA\"))"
  },
  options: [
    { t: "MK", why: "Unknown codons are not skipped; `get` returns the default \"X\", which is added to the protein." },
    { t: "MXK", why: "Correct. `codons.get(codon, \"X\")` returns \"X\" for the unknown codon TGG, and translation continues until the stop codon." },
    { t: "KeyError: 'TGG'", why: "`get` with a default never raises KeyError. Square-bracket lookup would." },
    { t: "M", why: "Only the stop symbol \"*\" ends the loop. \"X\" is added like any other amino acid." }
  ],
  answer: 1,
  explain: "Using `get` with a default makes gaps in the table visible (\"X\") instead of crashing.",
  verify: {}
});

BB.questions.push({
  id: "py-080",
  obj: ["PY.BIO", "PY.STR"],
  lesson: "f2-bio-project",
  level: 2,
  q: "Which line turns the coding strand `dna` into its mRNA sequence and keeps the result?",
  options: [
    { t: "`dna.replace(\"T\", \"U\")`", why: "The replacement creates a new string but it is not stored, and `dna` itself never changes." },
    { t: "`rna = dna.replace(\"U\", \"T\")`", why: "This goes the other way, from RNA letters to DNA letters, and `dna` contains no U." },
    { t: "`rna = reverse_complement(dna)`", why: "The mRNA matches the coding strand, not the opposite strand, and it uses U." },
    { t: "`rna = dna.replace(\"T\", \"U\")`", why: "Correct. The mRNA matches the coding strand with U in place of T, and the new string is stored." }
  ],
  answer: 3,
  explain: "Transcription in code: replace T with U on the coding strand, and store the returned string."
});

BB.questions.push({
  id: "py-081",
  obj: ["PY.BIO", "PY.FUNC"],
  lesson: "f2-bio-project",
  level: 3,
  q: "You need the protein encoded on the opposite strand of `seq`. Which call is correct?",
  options: [
    { t: "`reverse_complement(translate(seq))`", why: "A protein cannot be reverse-complemented: the function would receive amino-acid letters, not bases." },
    { t: "`translate(seq[::-1])`", why: "Reversing without complementing does not give the other strand." },
    { t: "`translate(reverse_complement(seq))`", why: "Correct. First build the opposite strand, read 5' to 3', then translate it." }
  ],
  answer: 2,
  explain: "Function calls nest from the inside out: the inner call runs first and its return value becomes the outer call's argument."
});
