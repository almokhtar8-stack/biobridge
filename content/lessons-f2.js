/* Foundation 2: Python. Written to tools/CONTENT_GUIDE.md.
   Unit 2A (Python essentials) follows Rice "Python Programming Essentials" and uses plain Python 3 syntax
   that also works in CodeSkulptor (no f-strings). Units 2B and 2C follow KAUST "Fundamental Skills in
   Bioinformatics" Module 3 (Python syntax, pandas, NumPy). Code outputs were produced by real Python. */
window.BB = window.BB || {};
BB.lessons = BB.lessons || [];

BB.lessons.push({
  id: "f2-first-program",
  what: "Python is a programming language: a precise way to write instructions that a computer can carry out. The simplest Python program is an expression such as `(212 + 282 + 203) / 3`. Python works out its value, and `print()` shows that value on the screen.",
  problem: "Biology is full of small calculations that must be repeated exactly: the mean of three replicates, a ratio between two conditions, a count scaled to the size of its sample. A pocket calculator gives an answer but keeps no record of how you got it. A Python program is that record, and it can be run again on new numbers.",
  care: "The first module of the Rice course uses Python as a calculator, and every later program in this foundation, from averaging counts to normalizing a whole table, is built from expressions like these. Getting the order of operations right now prevents silent mistakes later.",
  steps: [
    "You write a program as lines of text, either in a file called a script (ending in `.py`) or in a browser editor such as CodeSkulptor, the beginner environment used in the Rice course.",
    "A program called the interpreter reads your code from top to bottom and carries out each instruction, called a statement, in order.",
    "An expression combines values with operators: `+`, `-`, `*` (multiply), `/` (divide), `//` (divide and drop the remainder), `%` (the remainder) and `**` (power). Python evaluates it, which means it works out a single value.",
    "Operator precedence decides what is calculated first: `**`, then `*`, `/`, `//` and `%`, then `+` and `-`. Equal ranks run left to right (except `**`, which runs right to left), and parentheses override everything.",
    "`print(...)` displays a value. In a script, an expression without `print` is still calculated, but nothing appears on the screen."
  ],
  deeper: "`/` always produces a decimal number: `6 / 3` gives `2.0`. `**` binds more tightly than a leading minus sign, so `-2 ** 2` is `-4`; write `(-2) ** 2` to get 4. An interactive Python session (the `>>>` prompt) shows the value of a bare expression automatically, but scripts need `print`.",
  show: {
    intro: "Five lines summarize the HSPA1A counts from the heat-shock experiment. Compare the first two lines carefully.",
    lang: "python",
    code: "print(212 + 282 + 203 / 3)\nprint((212 + 282 + 203) / 3)\nprint(11018 / 212)\nprint(7 // 2, 7 % 2)\nprint(2 ** 5)",
    output: "561.6666666666666\n232.33333333333334\n51.971698113207545\n3 1\n32",
    notes: [
      "Line 1 is not a mean: division runs before addition, so only 203 is divided by 3.",
      "Line 2 adds the three control counts first, then divides. The long tail of digits comes from the way computers store decimal numbers.",
      "Line 3 is the raw heat_1 to ctrl_1 ratio for HSPA1A, about 52. Foundation 3 explains why real comparisons first adjust for sequencing depth.",
      "`7 // 2` is 3 and `7 % 2` is 1, the remainder; `print` separates the two values with a space. `2 ** 5` is 32: five doublings, as in five cycles of an ideal PCR."
    ],
    run: true
  },
  pitfall: {
    wrong: "`212 + 282 + 203 / 3` gives the mean of the three counts, because Python reads from left to right.",
    right: "Python follows operator precedence, not reading order. Division happens before addition, so only 203 is divided by 3 and the result is about 561.67. Write `(212 + 282 + 203) / 3` to add first."
  },
  try: {
    kind: "widget",
    widget: "pyrun",
    props: {
      code: "# Mean HSPA1A count in the three control samples\nprint((212 + 282 + 203) / 3)\n\n# Mean in the three heat-shock samples\nprint((11018 + 8441 + 10838) / 3)\n\n# Counts per million for ctrl_1: count / total reads * 1000000\nprint(212 / 18400000 * 1000000)\n\n# Try: remove the parentheses in the first calculation.\n# Predict the new value before you press Run."
    }
  },
  check: [
    {
      q: "What does this print?",
      code: { lang: "python", src: "print(2 + 3 * 4)" },
      options: [
        { t: "14", why: "Correct. Multiplication has higher precedence than addition: 3 * 4 is 12, then 2 + 12 is 14." },
        { t: "20", why: "That is (2 + 3) * 4, what you get by working left to right. Python multiplies before it adds unless parentheses say otherwise." },
        { t: "2 + 3 * 4", why: "Without quotes this is an expression, not text. `print` shows its value, not the characters you typed." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "What does this print?",
      code: { lang: "python", src: "print(10 / 4, 10 // 4, 10 % 4)" },
      options: [
        { t: "2 2 2", why: "In Python 3, `/` always gives the exact decimal result. Only `//` drops the fractional part." },
        { t: "2.5 2 2", why: "Correct. `/` gives the exact result 2.5, `//` keeps the whole part 2, and `%` gives the remainder 2 (4 fits twice into 10 with 2 left over)." },
        { t: "2.5 2 0.5", why: "`%` gives the remainder as a whole amount left over, 2, not the decimal part of the division." }
      ],
      answer: 1,
      verify: {}
    },
    {
      q: "Which line prints the mean of the three DNAJB1 control counts, 813, 1035 and 1100?",
      options: [
        { t: "`print(813 + 1035 + 1100 / 3)`", why: "Division runs before addition, so only 1100 is divided by 3. The result, about 2214.7, is not a mean." },
        { t: "`print((813 + 1035 + 1100) // 3)`", why: "`//` drops the remainder and gives 982 instead of 982.67. Use `/` when you want an exact mean." },
        { t: "`print((813 + 1035 + 1100) / 3)`", why: "Correct. The parentheses make Python add the three counts first and then divide the sum by 3." }
      ],
      answer: 2
    }
  ],
  real: "Normalizing RNA-seq counts, which Foundation 3 covers, is built from exactly these expressions. Counts per million (CPM) divides a gene's count by the sample's total number of reads and multiplies by 1,000,000, so ctrl_1's 212 HSPA1A reads become about 11.5 per million. Analysis software evaluates that expression for every gene in every sample.",
  teach: {
    prompt: "Explain to a friend how Python evaluates `(212 + 282 + 203) / 3`, and what changes if the parentheses are removed.",
    points: [
      "An expression is calculated to a single value",
      "Precedence: `**` first, then `* / // %`, then `+ -`",
      "Parentheses force an order",
      "`/` always gives a decimal number; `//` and `%` give whole-number division and the remainder",
      "`print` shows the value"
    ]
  }
});

BB.lessons.push({
  id: "f2-types",
  what: "Every value in Python has a type, which says what kind of thing it is and what you can do with it. The four basic types are `int` (whole numbers such as 212), `float` (numbers with a decimal point such as 232.3), `str` (text such as `\"HSPA1A\"`) and `bool` (`True` or `False`).",
  problem: "The same characters can mean different things. In a file, 212 is just three text characters; in a calculation, it is a number. Python must know which, because `+` adds numbers but joins text. Everything read from a file starts as text, so converting values is an everyday task in bioinformatics.",
  care: "Many beginner bugs are type bugs: counts that are secretly text, so that adding 212 and 282 gives `212282` instead of 494. Knowing the types lets you predict and fix these bugs in seconds.",
  steps: [
    "Python decides a value's type from how it is written: `212` is an int, `212.0` is a float, `\"212\"` in quotes is a str (short for string, a piece of text), and `True` and `False` are bools (Booleans).",
    "`type(value)` tells you the type. For example, `print(type(3.5))` prints `<class 'float'>`.",
    "The type decides what an operator does: `3 + 4` is 7, but `\"3\" + \"4\"` is `\"34\"`, because `+` joins strings (this is called concatenation). `\"AT\" * 3` is `\"ATATAT\"`.",
    "Mixing int and float is allowed and gives a float: `2 * 1.5` is `3.0`. Adding text and a number, as in `\"3\" + 4`, raises a TypeError: Python refuses to guess what you meant.",
    "Changing a value's type on purpose is called type conversion: `int(\"212\")` is 212, `float(\"4.5\")` is 4.5 and `str(212)` is `\"212\"`. `int(3.9)` cuts off the decimal part and gives 3; it does not round."
  ],
  deeper: "`int(\"3.5\")` raises a ValueError, because that text is not a whole number; `int(float(\"3.5\"))` gives 3. Floats have limited precision, so `0.1 + 0.2` is `0.30000000000000004`: round results for display and avoid testing floats for exact equality. Booleans act as 1 and 0 in arithmetic, so adding up True and False values counts the True ones.",
  show: {
    intro: "A count arrives as text, the way it would from a file. Watch how its type changes what Python does with it.",
    lang: "python",
    code: "count_text = \"212\"\ncount = int(count_text)\nprint(type(count_text), type(count))\nprint(count_text * 2)\nprint(count * 2)\nprint(count / 4, type(count / 4))\nprint(\"HSPA1A count: \" + str(count))",
    output: "<class 'str'> <class 'int'>\n212212\n424\n53.0 <class 'float'>\nHSPA1A count: 212",
    notes: [
      "`count_text` is a str because of the quotes; `int()` converts it into the int 212.",
      "Multiplying a string by 2 repeats the text, giving `212212`. Multiplying the number doubles it, giving 424.",
      "`/` always gives a float, even when the division is exact: 212 / 4 is `53.0`.",
      "`+` can only join a str to another str, so the number is converted back with `str()` before joining. Without `str()`, the last line would raise a TypeError."
    ],
    run: true
  },
  pitfall: {
    wrong: "`\"212\"` and `212` are the same thing; the quotes are just decoration.",
    right: "Quotes create a string, which is text. `\"212\" * 2` gives `212212`, while `212 * 2` gives 424. Values read from files are strings until you convert them with `int()` or `float()`."
  },
  try: { kind: "trace", program: "types-convert" },
  check: [
    {
      q: "What does this print?",
      code: { lang: "python", src: "print(type(10 / 5))" },
      options: [
        { t: "<class 'float'>", why: "Correct. `/` always returns a float, even when the answer is a whole number (here 2.0)." },
        { t: "<class 'int'>", why: "10 and 5 are ints and the answer is whole, but `/` still returns a float. Use `//` if you want an int." },
        { t: "2.0", why: "That is the value of `10 / 5`. `type()` reports the kind of value, not the value itself." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "A line from a file gives `a = \"813\"` and `b = \"1035\"`. Which expression gives their sum, 1848?",
      options: [
        { t: "`int(a) + int(b)`", why: "Correct. Each string is converted to an int first, so `+` adds two numbers." },
        { t: "`a + b`", why: "Both values are strings, so `+` joins them into `\"8131035\"`." },
        { t: "`int(a + b)`", why: "The strings are joined first, giving `\"8131035\"`, and only then converted, giving the number 8131035." },
        { t: "`str(a) + str(b)`", why: "They are already strings, so this still joins text and gives `\"8131035\"`." }
      ],
      answer: 0
    },
    {
      q: "What does this print?",
      code: { lang: "python", src: "print(int(7.8), float(7), str(7) + \"7\")" },
      options: [
        { t: "8 7.0 14", why: "`int()` does not round, it cuts off the decimal part. And after `str(7)` both sides are text, so `+` joins instead of adding." },
        { t: "7 7 77", why: "`float(7)` is a float, so it prints with a decimal point: 7.0." },
        { t: "7 7.0 77", why: "Correct. `int()` cuts off the decimals (7), `float(7)` is 7.0, and `\"7\" + \"7\"` joins two strings into 77." }
      ],
      answer: 2,
      verify: {}
    }
  ],
  real: "Count tables, sample sheets and sequence files are all stored as text, so every number in them must be converted before any arithmetic. pandas converts whole columns automatically, but a single stray value such as `1,035` (with a comma) or a note such as `failed` makes it treat the entire column as text. Checking column types is a standard first step after loading a table.",
  teach: {
    prompt: "Explain to a friend why `\"212\" + \"282\"` does not give 494, and how to fix it.",
    points: [
      "Every value has a type: int, float, str or bool",
      "Operators depend on type: `+` adds numbers but joins strings",
      "Data read from files arrives as strings",
      "Convert with `int()`, `float()` and `str()`",
      "`int()` cuts off decimals instead of rounding"
    ]
  }
});

BB.lessons.push({
  id: "f2-variables",
  what: "A variable is a name that refers to a value. The statement `count = 212` is an assignment: it makes the name `count` refer to the value 212, so later lines can use `count` instead of the number.",
  problem: "Programs that repeat raw numbers are hard to read and easy to break. If a threshold of 10 appears in twenty places, changing it means twenty edits and twenty chances to miss one. Names let a program describe a calculation once and reuse each result.",
  care: "Reading code is mostly keeping track of what each variable holds at each moment. Every trace, debugging session and code-reading question in this foundation depends on this skill.",
  steps: [
    "`name = expression` happens in two stages: Python first works out the value on the right, then makes the name on the left refer to it. The `=` sign means assign, not equals.",
    "Using a name before anything has been assigned to it raises a NameError, Python's way of saying it does not know that name.",
    "Assigning to an existing name replaces its value: after `count = 212` and then `count = 282`, `count` is 282 and 212 is forgotten.",
    "Updating uses the current value: `total = total + 5` reads `total`, adds 5 and stores the result back in `total`. The shortcut `total += 5` does the same thing.",
    "Names may contain letters, digits and underscores, cannot start with a digit, and are case-sensitive, so `Total` and `total` are different names. Choose descriptive names such as `heat_mean` rather than `x`."
  ],
  deeper: "After `b = a`, the name `b` refers to whatever value `a` had at that moment. Assigning a new value to `a` later does not change `b`: names are labels, not live links between variables. (Lists, which can be changed in place, need more care; the lists lesson shows why.) If you also read R code, you will see assignment written with an arrow, `count <- 212`; Python uses `=`.",
  show: {
    intro: "Variables turn the heat-shock calculation into readable steps, and an update adds library sizes one at a time.",
    lang: "python",
    code: "ctrl_mean = (212 + 282 + 203) / 3\nheat_mean = (11018 + 8441 + 10838) / 3\nfold_change = heat_mean / ctrl_mean\nprint(round(fold_change, 1))\ntotal_reads = 0\ntotal_reads = total_reads + 18400000\ntotal_reads = total_reads + 22100000\nprint(total_reads)",
    output: "43.5\n40500000",
    notes: [
      "Each name stores one intermediate result, so line 3 reads like the formula it implements: heat mean divided by control mean.",
      "`round(fold_change, 1)` rounds to one decimal place. `round` is a function; the next lesson explains functions.",
      "`total_reads` starts at 0 and grows by one sample's library size per line: 0, then 18,400,000, then 40,500,000.",
      "These raw means ignore sequencing depth, so the ratio is a first look, not a final result."
    ],
    run: true
  },
  pitfall: {
    wrong: "`x = x + 1` is impossible, because x can never equal x plus 1.",
    right: "In Python, `=` is an instruction, not an equation. Python calculates `x + 1` using the current value of x and then stores the result in x. To compare two values, Python uses `==`."
  },
  try: { kind: "trace", program: "var-update" },
  check: [
    {
      q: "What does this print?",
      code: { lang: "python", src: "a = 5\nb = a\na = 10\nprint(a, b)" },
      options: [
        { t: "10 5", why: "Correct. `b` was given the value 5 when line 2 ran. Changing `a` afterwards does not reach back and change `b`." },
        { t: "10 10", why: "This assumes `b` stays linked to `a`. Assignment uses the value at that moment; it does not create a permanent link." },
        { t: "5 5", why: "Line 3 does change `a` to 10. Only `b` keeps the old value." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "Which line increases `count` by 1 and keeps the new value?",
      options: [
        { t: "`count + 1`", why: "This calculates a value and throws it away, because the result is not assigned to any name." },
        { t: "`count == count + 1`", why: "`==` compares. This produces False and changes nothing." },
        { t: "`count + 1 = count`", why: "The left side of `=` must be a name. Python rejects this line with a SyntaxError." },
        { t: "`count = count + 1`", why: "Correct. The right side is calculated with the current value, and the result is stored back in `count`." }
      ],
      answer: 3
    },
    {
      q: "What does this print?",
      code: { lang: "python", src: "x = 3\nx = x * 2\nx = x + 1\nprint(x)" },
      options: [
        { t: "4", why: "This skips line 2. Every assignment runs, in order, and each one replaces the previous value." },
        { t: "8", why: "This applies the lines in the wrong order, (3 + 1) * 2. Python runs statements from top to bottom." },
        { t: "7", why: "Correct. x becomes 3, then 3 * 2 = 6, then 6 + 1 = 7. Each line uses the value left by the line before." }
      ],
      answer: 2,
      verify: {}
    }
  ],
  real: "Analysis scripts usually begin with a block of named settings, such as `min_count = 10` or `counts_file = \"counts.tsv\"`. When a reviewer asks you to rerun with a stricter filter, you change one line, and every calculation that uses the name follows automatically.",
  teach: {
    prompt: "Explain what `total = total + c` does, step by step, and why it is not a contradiction.",
    points: [
      "A variable is a name that refers to a value",
      "Python evaluates the right side first, then assigns",
      "Reassigning replaces the old value",
      "`=` assigns while `==` compares",
      "Names are case-sensitive; an unknown name gives NameError"
    ]
  }
});

BB.lessons.push({
  id: "f2-functions",
  what: "A function is a named block of code that does one job. You define it once with `def`, then call it with different inputs whenever you need it. `return` sends the function's result back to the line that called it.",
  problem: "Without functions, the same calculation gets copied and pasted for every sample or gene. A bug then has to be fixed in every copy, and it is easy to miss one. A function keeps the calculation in one place, so it can be tested once and trusted everywhere.",
  care: "The second module of the Rice course is about functions, and many tools you already use are functions: `print`, `len`, `round` and pandas' `read_csv` all take inputs and give back results. Understanding parameters and return values lets you read any library's documentation.",
  steps: [
    "Define: `def mean3(a, b, c):` names the function and its parameters, the placeholders for its inputs. The indented lines underneath form the body.",
    "Call: `mean3(212, 282, 203)` runs the body with `a = 212`, `b = 282` and `c = 203`. The values you pass in are called arguments, and they are matched to the parameters by position.",
    "`return value` ends the call and hands the value back, so `ctrl = mean3(212, 282, 203)` stores the result in `ctrl`.",
    "A function without `return` gives back `None`, Python's special value meaning nothing. `print` inside a function shows a value to a person but does not give it back to the program.",
    "Variables created inside a function are local: they exist only during that call, and the rest of the program cannot see them."
  ],
  deeper: "Defining a function does not run it: Python only stores it, and the body runs each time the function is called. Parameters can have default values, as in `def cpm(count, library_size, scale=1000000):`, so callers may leave that argument out. Arguments can also be given by name, as in `cpm(count=212, library_size=18400000)`, which makes long calls easier to read and protects against mixing up the order.",
  show: {
    intro: "One function computes counts per million (CPM) for any count and library size. It is called twice, once per sample.",
    lang: "python",
    code: "def cpm(count, library_size):\n    return count / library_size * 1000000\n\nctrl = cpm(212, 18400000)\nheat = cpm(11018, 24600000)\nprint(round(ctrl, 2), round(heat, 2))\nprint(round(heat / ctrl, 1))",
    output: "11.52 447.89\n38.9",
    notes: [
      "Lines 1 and 2 define the function. Nothing is calculated until line 4 calls it.",
      "In the first call, `count` is 212 and `library_size` is 18,400,000 (ctrl_1). In the second call the same names hold heat_1's values.",
      "After adjusting for library size, heat_1 has about 38.9 times more HSPA1A than ctrl_1. The raw ratio was about 52, because heat_1 was sequenced more deeply."
    ],
    run: true
  },
  pitfall: {
    wrong: "`print` and `return` do the same thing: both give me the answer.",
    right: "`print` shows a value on the screen for a person to read. `return` hands the value back to the code that called the function, so it can be stored or used in more calculations. A function that only prints gives back `None`."
  },
  try: { kind: "trace", program: "func-mean3" },
  check: [
    {
      q: "What does this print?",
      code: { lang: "python", src: "def double(x):\n    return x * 2\n\nprint(double(3) + 1)" },
      options: [
        { t: "7", why: "Correct. `double(3)` returns 6, and then 6 + 1 is 7." },
        { t: "8", why: "That would be `double(4)`. The call runs first, and 1 is added to the value it returned." },
        { t: "6", why: "The function returns 6, but the expression then adds 1 before printing." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "What does this print?",
      code: { lang: "python", src: "def show_double(x):\n    print(x * 2)\n\nresult = show_double(5)\nprint(result)" },
      options: [
        { t: "10\n10", why: "This assumes `print` also hands the value back. Only `return` does that." },
        { t: "10\nNone", why: "Correct. The call prints 10, but the function has no `return`, so `result` is None." },
        { t: "None", why: "The body still runs during the call, so 10 is printed before `result` is printed." }
      ],
      answer: 1,
      verify: {}
    },
    {
      q: "`def fold_change(ctrl, heat):` returns `heat / ctrl`. A colleague calls `fold_change(10099, 232.3)`. What happens?",
      options: [
        { t: "Python matches the numbers to the right parameters automatically", why: "Python only matches by position, or by name if you write `fold_change(ctrl=232.3, heat=10099)`. It never guesses from the values." },
        { t: "Python raises an error because the arguments are in the wrong order", why: "Both numbers are valid inputs, so there is no error, just a wrong answer. That is what makes this bug dangerous." },
        { t: "The values are matched by position, so `ctrl` gets 10099 and the result is upside down: about 0.023 instead of about 43", why: "Correct. Python matches arguments to parameters by position. It cannot know which number you meant as the control." }
      ],
      answer: 2
    }
  ],
  real: "Analysis code is built from functions. pandas provides `read_csv` to load a table and `mean` to summarize it, and single-cell analysis packages provide functions that normalize every cell in one call. Writing your own small functions, such as a CPM or GC-content function, keeps a pipeline readable and lets you test each step on a tiny input.",
  teach: {
    prompt: "Explain to a friend the difference between defining and calling a function, and between `print` and `return`.",
    points: [
      "`def` defines; the body runs only when the function is called",
      "Arguments are matched to parameters by position",
      "`return` hands back a value; without it the function returns None",
      "Local variables exist only during the call",
      "Functions let you write a calculation once and reuse it"
    ]
  }
});

BB.lessons.push({
  id: "f2-logic",
  what: "A Boolean is a value that is either `True` or `False`. Comparison operators such as `>` and `==` produce Booleans, and the logical operators `and`, `or` and `not` combine them.",
  problem: "Data analysis is full of yes-or-no questions: is this count above the filter threshold, did this sample pass quality control, is this gene on the list? Booleans are how a program represents the answers so that it can act on them.",
  care: "Every filter and every quality-control rule you write will be a Boolean expression. The third module of the Rice course covers logic, and the KAUST course uses the same idea in R, with logical vectors, for quality control.",
  steps: [
    "A comparison answers a question with `True` or `False`. The comparison operators are `<`, `>`, `<=` (at most), `>=` (at least), `==` (equal) and `!=` (not equal). For example, `212 > 100` is `True`.",
    "`==` compares while `=` assigns. Text comparison is exact: `\"ACTB\" == \"actb\"` is `False`, because upper and lower case differ.",
    "`a and b` is `True` only when both sides are True. `a or b` is `True` when at least one side is True. `not a` flips True to False and False to True.",
    "Precedence: comparisons are evaluated first, then `not`, then `and`, then `or`. Parentheses make your intention clear and are worth adding whenever you mix `and` with `or`.",
    "Python allows chained comparisons: `10 <= count <= 1000` means `10 <= count and count <= 1000`."
  ],
  deeper: "`and` and `or` stop as soon as the answer is known (short-circuit evaluation): in `n > 0 and total / n > 5`, the division is skipped when `n` is 0, so no division-by-zero error occurs. In conditions, Python also treats some values as false even though they are not Booleans: `0`, `0.0`, the empty string `\"\"` and an empty list. Comparing floats with `==` is risky because of rounding: `0.1 + 0.2 == 0.3` is `False`.",
  show: {
    intro: "Questions about one gene and one sample, written as Boolean expressions.",
    lang: "python",
    code: "count = 212\nlibrary_size = 18400000\nprint(count >= 10)\nprint(count > 100 and library_size > 20000000)\nprint(count > 100 or library_size > 20000000)\nprint(not count >= 10)\nprint(\"HSPA1A\" == \"hspa1a\")",
    output: "True\nFalse\nTrue\nFalse\nFalse",
    notes: [
      "Line 3: 212 is at least 10, so the gene passes a minimum-count filter.",
      "Line 4: the first part is True, but the library has fewer than 20,000,000 reads, so `and` gives False.",
      "Line 5: `or` needs only one True side, so the result is True.",
      "Line 6: `count >= 10` is True and `not` flips it to False. The comparison runs before `not`.",
      "Line 7: gene symbols must match exactly, including upper and lower case."
    ],
    run: true
  },
  pitfall: {
    wrong: "`gene == \"HSPA1A\" or \"HSPA1B\"` checks whether gene is one of the two names.",
    right: "Each side of `or` is judged on its own. The right side is just the string `\"HSPA1B\"`, and a non-empty string counts as true, so the test passes for every gene, even ACTB. Write `gene == \"HSPA1A\" or gene == \"HSPA1B\"`."
  },
  try: {
    kind: "predict",
    q: "A sample has 17,900,000 reads, and 65 percent of them matched the genome (a mapped fraction of 0.65). What does this print?",
    code: {
      lang: "python",
      src: "reads = 17900000\nmapped = 0.65\npassed = reads >= 15000000 and mapped >= 0.7\nprint(passed, reads >= 15000000 or mapped >= 0.7)"
    },
    options: [
      { t: "True True", why: "This treats `and` like `or`. One failed condition is enough to make an `and` expression False." },
      { t: "False False", why: "`or` is True when at least one side is True, and the read-count test is True." },
      { t: "True False", why: "This swaps the meanings of `and` and `or`." },
      { t: "False True", why: "Right. The read count passes but the mapped fraction does not. `and` needs both, so `passed` is False; `or` needs only one, so the second value is True." }
    ],
    answer: 3,
    verify: {}
  },
  check: [
    {
      q: "Which expression is True exactly when `count` is from 10 to 1000, including both 10 and 1000?",
      options: [
        { t: "`10 <= count <= 1000`", why: "Correct. This chained comparison means `10 <= count and count <= 1000`, and `<=` includes both end points." },
        { t: "`count >= 10 or count <= 1000`", why: "Every number satisfies at least one side, so this is always True. A range test needs `and`." },
        { t: "`10 < count < 1000`", why: "Strict `<` excludes the end points, so a count of exactly 10 or exactly 1000 would fail." },
        { t: "`count >= 10 and <= 1000`", why: "Each side of `and` must be a complete comparison. Python rejects this with a SyntaxError." }
      ],
      answer: 0
    },
    {
      q: "What does this print?",
      code: { lang: "python", src: "x = 3\ny = 8\nprint(x > 5 and y > 5, x > 5 or y > 5, not (x > 5 and y > 5))" },
      options: [
        { t: "False True False", why: "The parentheses are evaluated first and give False; `not` then flips that to True." },
        { t: "False True True", why: "Correct. x > 5 is False and y > 5 is True: `and` gives False, `or` gives True, and `not` flips the False in the parentheses to True." },
        { t: "True True False", why: "x is 3, so x > 5 is False, and an `and` with one False side cannot be True." }
      ],
      answer: 1,
      verify: {}
    }
  ],
  real: "Single-cell RNA-seq quality control keeps a cell only if several conditions hold at once, for example enough detected genes and a low fraction of reads from mitochondrial genes, because damaged cells tend to fail those checks. In code, that rule is an `and` of comparisons applied to every cell. The same logic filters genes, reads and genetic variants.",
  teach: {
    prompt: "Explain to a friend how `and`, `or` and `not` work, using a quality-control rule for a sample.",
    points: [
      "Comparisons give True or False",
      "`==` compares, `=` assigns",
      "`and` needs both sides True; `or` needs at least one",
      "`not` flips a Boolean",
      "Each side of `and` or `or` must be a complete comparison"
    ]
  }
});

BB.lessons.push({
  id: "f2-conditionals",
  what: "A conditional, or if statement, runs a block of code only when its condition is True. `elif` (short for else if) adds further conditions, checked in order, and `else` runs when none of them were True.",
  problem: "Real data needs different handling for different values: a sample with too few reads should be flagged, a gene with no counts skipped, a strongly changed gene highlighted. Without conditionals, a program does exactly the same thing to every value.",
  care: "Conditionals are at the heart of the third module of the Rice course, and they are how analysis code applies rules: quality thresholds, filters and labels such as up, down or unchanged.",
  steps: [
    "`if condition:` is followed by an indented block. The block runs only when the condition is True.",
    "Indentation, by convention four spaces, shows which lines belong to the block. The first line that returns to the outer level runs whatever the condition was.",
    "`elif other_condition:` is checked only if every condition above it was False.",
    "`else:` runs when none of the conditions above it were True. In one if, elif and else chain, at most one block runs, and with an `else`, exactly one runs.",
    "Order matters: Python runs the first block whose condition is True and skips the rest, so put the strictest test first."
  ],
  deeper: "Two separate `if` statements are checked independently, so both blocks can run; an `if` followed by `elif` cannot. You can put an if statement inside another block (nesting), but deep nesting is hard to read, and combining conditions with `and` is often clearer. Python also has a one-line form, `label = \"high\" if count > 1000 else \"low\"`, which you will meet in other people's code.",
  show: {
    intro: "A depth check for one sample: fewer than 15 million reads means resequence, fewer than 20 million is acceptable, and anything else is good.",
    lang: "python",
    code: "reads = 17900000\nif reads < 15000000:\n    print(\"low depth: resequence\")\nelif reads < 20000000:\n    print(\"acceptable\")\nelse:\n    print(\"good\")\nprint(\"checked\", reads)",
    output: "acceptable\nchecked 17900000",
    notes: [
      "The first condition is False (17,900,000 is not below 15,000,000), so Python moves on to the `elif`.",
      "The `elif` condition is True, so `acceptable` is printed and the `else` block is skipped.",
      "The last line is not indented, so it is outside the chain and always runs.",
      "17,900,000 is heat_2's library size in the practice data."
    ],
    run: true
  },
  pitfall: {
    wrong: "If several conditions are True, Python runs every matching branch of the if, elif and else chain.",
    right: "Python stops at the first True condition. With `if reads > 10000000:` first, a sample with 24,600,000 reads is handled there and never reaches `elif reads > 20000000:`. Put the strictest test first."
  },
  try: { kind: "trace", program: "cond-depth" },
  check: [
    {
      q: "What does this print?",
      code: {
        lang: "python",
        src: "fc = 6.0\nif fc > 2:\n    print(\"up\")\nelif fc > 4:\n    print(\"strongly up\")\nelse:\n    print(\"unchanged\")"
      },
      options: [
        { t: "up", why: "Correct. `fc > 2` is True, so the first block runs and the rest of the chain is skipped, even though `fc > 4` is also True." },
        { t: "strongly up", why: "Python does not search for the best match. It takes the first True condition, which is `fc > 2`." },
        { t: "up\nstrongly up", why: "Only one block of an if, elif and else chain runs. Two separate `if` statements would print both lines." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "What does this print?",
      code: { lang: "python", src: "count = 5\nif count > 10:\n    print(\"keep\")\nprint(\"done\")" },
      options: [
        { t: "keep\ndone", why: "The indented `print(\"keep\")` belongs to the if block, which only runs when the condition is True." },
        { t: "done", why: "Correct. 5 > 10 is False, so the indented line is skipped. `print(\"done\")` is not indented, so it always runs." },
        { t: "keep", why: "The condition is False, and the last line runs no matter what, because it is outside the block." }
      ],
      answer: 1,
      verify: {}
    },
    {
      q: "You want to label samples: below 15 million reads is low, below 20 million is ok, anything else is good. Which order of tests works with if, elif and else?",
      options: [
        { t: "`if reads < 20000000:` then `elif reads < 15000000:` then `else:`", why: "Every sample below 15 million is also below 20 million, so it is caught by the first test and labeled ok. The low branch can never run." },
        { t: "`if reads > 15000000:` then `elif reads > 20000000:` then `else:`", why: "A sample with 24 million reads is caught by the first test, so the second branch can never run." },
        { t: "`if reads < 15000000:` then `elif reads < 20000000:` then `else:`", why: "Correct. Low samples are caught first; the second test is only reached by samples with at least 15 million reads, so it means 15 to 20 million." }
      ],
      answer: 2
    }
  ],
  real: "Pipelines are full of rules like these: discard a read if its average quality is too low, drop a gene if it has fewer than 10 reads in every sample, flag a sample whose library is too small. Writing them as explicit if statements, with the thresholds in named variables, makes each decision visible to anyone who reads the code.",
  teach: {
    prompt: "Explain to a friend how Python decides which block of an if, elif and else chain to run.",
    points: [
      "The condition is evaluated to True or False",
      "Indentation defines the block",
      "Python runs the first True branch and skips the rest",
      "`else` catches everything the earlier tests did not",
      "Separate if statements are checked independently"
    ]
  }
});

BB.lessons.push({
  id: "f2-modules",
  what: "A module is a file of Python code, such as functions and values, that other programs can use. `import math` loads the math module, and `math.log2(8)` calls one of its functions. Python comes with many modules, and you can write your own.",
  problem: "Writing everything yourself is slow and risky: date arithmetic alone must handle month lengths, leap years and year boundaries. Modules let you reuse code that many people have already tested, and let you split your own program into several files.",
  care: "The fourth module of the Rice course is about modules, and the KAUST course's Python module covers pandas and NumPy, which you also load with `import`. Import lines are the first lines of nearly every analysis script.",
  steps: [
    "`import math` makes the module available under its name. Use a dot to reach inside it: `math.sqrt(16)` or `math.pi`.",
    "`from math import log2` imports one name directly, so you can write `log2(8)` without the `math.` prefix.",
    "`import numpy as np` imports a module under a shorter nickname, called an alias. `np` for NumPy and `pd` for pandas are conventions almost everyone follows.",
    "Python's standard library comes with every installation and includes `math`, `datetime` (dates and times), `statistics`, `random`, `os` and `csv`. Other packages, such as pandas, must be installed before they can be imported.",
    "Your own file `tools.py` can be imported with `import tools` by a script in the same folder. Splitting code into files this way keeps larger projects organized."
  ],
  deeper: "Python runs a module's code the first time it is imported and reuses the result afterwards. Avoid naming your own files after modules you use: a script called `pandas.py` or `random.py` can be imported in place of the real module, which causes confusing errors. `help(math.log2)` prints the documentation of a function, and `dir(math)` lists everything inside a module.",
  show: {
    intro: "The math module computes a log2 fold change, and the datetime module counts the days between collecting and sequencing a sample.",
    lang: "python",
    code: "import math\nimport datetime\n\nprint(math.log2(64))\nprint(round(math.log2(10099.0 / 232.3), 2))\n\ncollected = datetime.date(2026, 3, 2)\nsequenced = datetime.date(2026, 3, 30)\nwaited = sequenced - collected\nprint(waited.days)\nprint(collected + datetime.timedelta(days=90))",
    output: "6.0\n5.44\n28\n2026-05-31",
    notes: [
      "`math.log2(64)` is 6.0 because 2 to the power 6 is 64. Gene changes are usually reported as the log2 of a fold change.",
      "10099.0 / 232.3 is the heat to control ratio of the HSPA1A means, about 43; its log2 is 5.44.",
      "`datetime.date(2026, 3, 2)` creates a date (year, month, day). Subtracting two dates gives a duration, and `.days` is that duration in whole days.",
      "Adding `datetime.timedelta(days=90)` moves a date forward 90 days. The module handles the different month lengths for you."
    ],
    run: true
  },
  pitfall: {
    wrong: "After `import math`, I can call `sqrt(16)` directly.",
    right: "`import math` adds only the name `math`; its functions stay inside it, so you write `math.sqrt(16)`. A bare `sqrt(16)` raises NameError: name 'sqrt' is not defined. Use `from math import sqrt` if you want the short form."
  },
  try: {
    kind: "parsons",
    prompt: "Samples must be sequenced within 30 days of collection. Put the lines in order so that the program prints the deadline and how many days remain on 25 March.",
    lang: "python",
    lines: [
      "import datetime",
      "collected = datetime.date(2026, 3, 2)",
      "deadline = collected + datetime.timedelta(days=30)",
      "days_left = (deadline - datetime.date(2026, 3, 25)).days",
      "print(\"deadline:\", deadline, \"days left:\", days_left)"
    ],
    output: "deadline: 2026-04-01 days left: 7",
    hintWrong: "Start with the import, because every other line uses `datetime`. Then, for each line, ask which variable it needs and which line creates that variable: that line must come first.",
    verify: true,
    explain: "The import must come first, because every later line uses `datetime`. Each following line needs the variable created by the line above it: the deadline is computed from the collection date, and the days left from the deadline. `print` comes last because it uses both results."
  },
  check: [
    {
      q: "After `import math`, which line computes the square root of 16?",
      options: [
        { t: "`sqrt(16)`", why: "`import math` adds only the name `math`, so a bare `sqrt` raises a NameError. `from math import sqrt` would allow this form." },
        { t: "`math(sqrt, 16)`", why: "This fails at once: `sqrt` on its own is not defined (a NameError), and a module is not a function, so it cannot be called either. Use the dot to reach the function inside it: `math.sqrt(16)`." },
        { t: "`math.sqrt(16)`", why: "Correct. After a plain import, the module's functions are reached with a dot: module name, dot, function name." },
        { t: "`import sqrt(16)`", why: "`import` loads modules; it does not call functions. Import first, then call the function on a separate line." }
      ],
      answer: 2
    },
    {
      q: "What does this print?",
      code: {
        lang: "python",
        src: "import datetime\nstart = datetime.date(2026, 12, 20)\nend = datetime.date(2027, 1, 10)\nprint((end - start).days)"
      },
      options: [
        { t: "-10", why: "That subtracts only the day numbers (10 minus 20). Date subtraction compares whole calendar dates, including months and years." },
        { t: "21", why: "Correct. 11 days remain in December after the 20th, plus 10 days in January. datetime handles the change of year." },
        { t: "22", why: "This counts both the first and the last day. Subtracting dates counts the days between them." }
      ],
      answer: 1,
      verify: {}
    },
    {
      q: "Why is it better to use the datetime module than to write your own date arithmetic?",
      options: [
        { t: "Python cannot subtract numbers without importing a module", why: "Arithmetic is built into Python. The module adds knowledge of the calendar, not basic arithmetic." },
        { t: "Programs that use modules cannot contain bugs", why: "Your own code can still be wrong, for example by using the wrong dates. Modules reduce the code you write, not the need to check it." },
        { t: "It already handles month lengths, leap years and year boundaries, and it has been tested by many users", why: "Correct. Reusing tested code avoids subtle mistakes such as treating every month as 30 days." }
      ],
      answer: 2
    }
  ],
  real: "Almost every analysis script starts with lines such as `import pandas as pd` and `import numpy as np`, and the KAUST course's Python module teaches both libraries. Dates matter in real projects too: samples collected or sequenced on different days can differ for purely technical reasons (a batch effect), so recording and comparing dates is part of checking a dataset.",
  teach: {
    prompt: "Explain to a friend what a module is, three ways to import one, and why you would use one instead of writing the code yourself.",
    points: [
      "A module is a file of reusable code",
      "`import x`, `from x import y` and `import x as alias`",
      "After a plain import, use dot notation",
      "The standard library ships with Python; packages such as pandas must be installed",
      "Tested code avoids subtle mistakes such as wrong month lengths"
    ]
  }
});

BB.lessons.push({
  id: "f2-strings",
  what: "A string is a sequence of characters written in quotes. DNA sequences are naturally stored as strings such as `\"ATGGCCAAATTTGGGTAA\"`, and Python can measure, cut, search and transform them.",
  problem: "Sequence data is text: reads, genes, primers and proteins. Questions such as what is the GC content, does this sequence start with ATG, or where is this restriction site, all become operations on strings.",
  care: "Strings are the most common data type in sequence bioinformatics. Indexing and slicing also work the same way on lists, so what you learn here pays off twice.",
  steps: [
    "`len(seq)` counts the characters. Square brackets pick one character by its index, its position counted from 0: `seq[0]` is the first base and `seq[-1]` is the last.",
    "A slice `seq[start:stop]` takes the characters from `start` up to but not including `stop`, so `seq[0:3]` is the first codon. Leave out `start` or `stop` to go from the beginning or to the end; `seq[::-1]` reverses.",
    "A method is a function that belongs to a value and is called with a dot: `seq.count(\"G\")`, `seq.replace(\"T\", \"U\")`, `seq.lower()` and `seq.startswith(\"ATG\")`.",
    "Strings cannot be changed in place. A method returns a new string and leaves the original alone, so store the result: `rna = seq.replace(\"T\", \"U\")`.",
    "`\"GAATTC\" in seq` is True if the sequence contains that site. An f-string, written `f\"GC = {gc}\"`, builds text with values inserted in the braces."
  ],
  deeper: "Inside an f-string's braces you can add a format: `{gc:.2f}` shows 2 decimal places and `{gc:.1%}` a percentage. Earlier lessons joined text with `+` and `str()`, a style that works in every Python 3 environment. `seq.find(\"TAA\")` returns the index of the first match, or -1 if there is none, a classic source of bugs because -1 is also a valid index.",
  show: {
    intro: "A short gene, the same one used in Foundation 0, explored as a string.",
    lang: "python",
    code: "seq = \"ATGGCCAAATTTGGGTAA\"\nprint(len(seq))\nprint(seq[0], seq[-1])\nprint(seq[0:3], seq[3:6])\ngc = (seq.count(\"G\") + seq.count(\"C\")) / len(seq)\nprint(f\"GC content: {gc:.2f}\")\nprint(seq.replace(\"T\", \"U\"))\nprint(seq[::-1])",
    output: "18\nA A\nATG GCC\nGC content: 0.39\nAUGGCCAAAUUUGGGUAA\nAATGGGTTTAAACCGGTA",
    notes: [
      "The sequence has 18 bases. `seq[0]` is the first base and `seq[-1]` the last; both are A.",
      "`seq[0:3]` holds positions 0, 1 and 2, the start codon ATG. `seq[3:6]` is the next codon, GCC.",
      "There are 5 G and 2 C, so the GC content is 7 / 18. The f-string shows it with 2 decimal places.",
      "`replace` swaps every T for U, which gives the mRNA sequence: mRNA matches the coding strand, with U in place of T. `seq[::-1]` only reverses: it does not swap bases, so it is not the reverse complement (that comes in the mini-project)."
    ],
    run: true
  },
  pitfall: {
    wrong: "`seq[1]` is the first base, like position 1 in a biology paper.",
    right: "Python counts from 0, so `seq[0]` is the first base and `seq[1]` is the second. Position n in biological numbering is `seq[n - 1]` in Python. R counts from 1, so this is a common trap when switching between the two languages."
  },
  try: {
    kind: "widget",
    widget: "pyrun",
    props: {
      code: "seq = \"ATGGCCAAATTTGGGTAA\"\nprint(\"length:\", len(seq))\nprint(\"first codon:\", seq[0:3])\nprint(\"last codon:\", seq[-3:])\ngc = (seq.count(\"G\") + seq.count(\"C\")) / len(seq)\nprint(f\"GC content: {gc:.2f}\")\nprint(\"mRNA:\", seq.replace(\"T\", \"U\"))\nprint(\"has EcoRI site GAATTC:\", \"GAATTC\" in seq)\n\n# Try: set seq = \"GAATTCGCGC\" and run again,\n# or print seq[3:9] and predict it first."
    }
  },
  check: [
    {
      q: "What does this print?",
      code: { lang: "python", src: "seq = \"ATGCGT\"\nprint(seq[1:4])" },
      options: [
        { t: "TGC", why: "Correct. Index 1 is T, and the slice stops before index 4, giving T, G and C." },
        { t: "ATG", why: "That is `seq[0:3]`. Indexes start at 0, so index 1 is the second character." },
        { t: "TGCG", why: "The stop index is excluded: `seq[1:4]` has 4 minus 1, which is 3 characters." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "What does this print?",
      code: { lang: "python", src: "seq = \"atgc\"\nseq.upper()\nprint(seq)" },
      options: [
        { t: "ATGC", why: "This assumes `upper()` changes `seq` in place. Strings cannot be changed; the uppercase copy was created and thrown away." },
        { t: "atgc", why: "Correct. `upper()` returns a new string, but the result was not stored, and the original string never changes. Write `seq = seq.upper()`." },
        { t: "None", why: "`upper()` returns a new string, and `seq` itself is never set to None. It keeps its original value." }
      ],
      answer: 1,
      verify: {}
    },
    {
      q: "Which expression gives the GC fraction of a DNA string `seq`?",
      options: [
        { t: "`seq.count(\"GC\") / len(seq)`", why: "This counts the two-letter text GC, not every G and every C." },
        { t: "`(seq.count(\"G\") + seq.count(\"C\")) / 100`", why: "Dividing by 100 assumes every sequence is 100 bases long. Divide by the real length, `len(seq)`." },
        { t: "`(seq.count(\"G\") + seq.count(\"C\")) / len(seq)`", why: "Correct. It counts every G and every C, adds them, and divides by the real length of the sequence." }
      ],
      answer: 2
    }
  ],
  real: "Primer design tools check GC content, often aiming for roughly 40 to 60 percent, and scan for restriction sites before cloning. Read-trimming tools cut low-quality ends off reads with what amounts to slicing. Libraries such as Biopython wrap these operations, but underneath they are the same string operations.",
  teach: {
    prompt: "Explain to a friend how to get the first codon, the last base and the GC content of a DNA string in Python.",
    points: [
      "Indexes start at 0; -1 is the last character",
      "Slices include the start but exclude the stop",
      "Methods such as `count` and `replace` return new strings",
      "Strings cannot be changed in place, so store the result",
      "f-strings insert values into text"
    ]
  }
});

BB.lessons.push({
  id: "f2-lists-loops",
  what: "A list holds several values in order, inside square brackets: `counts = [212, 282, 203, 11018, 8441, 10838]`. A for loop runs the same block of code once for each item in a list, or in any other collection.",
  problem: "An experiment has many samples, and a genome has thousands of genes. Writing one line of code per value does not scale. Lists keep related values together, and loops apply the same steps to every one of them.",
  care: "A loop plus a running total is the pattern behind sums, counts, filters and maxima. pandas and NumPy run these loops for you behind the scenes, so understanding them makes those tools much less mysterious.",
  steps: [
    "Create a list with square brackets. Indexing and slicing work as for strings: `counts[0]` is the first item, `counts[-1]` the last, `counts[:3]` the first three, and `len(counts)` the number of items.",
    "Lists can be changed: `counts[0] = 215` replaces an item and `counts.append(500)` adds an item to the end.",
    "`for c in counts:` gives the name `c` each item in turn and runs the indented block once per item. Each pass through the block is called an iteration.",
    "The accumulator pattern: create a variable before the loop (`total = 0`), update it inside the loop (`total = total + c`), and use it after the loop.",
    "Combine a loop with `if` to filter, appending the items that pass to a new list. When you need positions instead of items, `range(n)` gives the whole numbers 0 to n - 1."
  ],
  deeper: "`b = a` does not copy a list: both names then refer to the same list, so `a.append(1)` also changes what `b` shows. Use `b = a.copy()` for an independent copy. A list comprehension, `[c for c in counts if c > 1000]`, builds a filtered list in one line, and built-in functions such as `sum` and `max` replace many simple loops. In R, the same loop is `for (c in counts) { total <- total + c }`: braces mark the block where Python uses indentation.",
  show: {
    intro: "The six HSPA1A counts, in sample order ctrl_1 to heat_3, summed and filtered with one loop.",
    lang: "python",
    code: "hspa1a = [212, 282, 203, 11018, 8441, 10838]\nprint(len(hspa1a), hspa1a[0], hspa1a[-1])\nprint(hspa1a[:3])\ntotal = 0\nhigh = []\nfor c in hspa1a:\n    total = total + c\n    if c > 1000:\n        high.append(c)\nprint(total, total / len(hspa1a))\nprint(high)",
    output: "6 212 10838\n[212, 282, 203]\n30994 5165.666666666667\n[11018, 8441, 10838]",
    notes: [
      "The slice `hspa1a[:3]` holds the three control samples.",
      "The loop body runs six times. On each pass, `c` is the next count, `total` grows by it, and counts above 1000 are appended to `high`.",
      "The last two `print` lines are not indented, so they run once, after the loop has finished.",
      "The overall mean, about 5166, mixes both conditions and describes neither. Summaries should usually be computed per condition."
    ],
    run: true
  },
  pitfall: {
    wrong: "I can put `total = 0` inside the loop so that it starts fresh for each item.",
    right: "Then `total` is reset on every pass and ends up holding only the last item. Create the accumulator once, before the loop, and update it inside the loop."
  },
  try: { kind: "trace", program: "loop-filter" },
  check: [
    {
      q: "What does this print?",
      code: { lang: "python", src: "total = 0\nfor c in [212, 282, 203]:\n    total = total + c\n    print(total)" },
      options: [
        { t: "212\n494\n697", why: "Correct. `print` is indented, so it runs on every pass and shows the running total." },
        { t: "697", why: "That would happen if `print` were not indented: it would run once, after the loop." },
        { t: "212\n282\n203", why: "This prints each item, but the code prints `total`, which accumulates." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "What does this print?",
      code: {
        lang: "python",
        src: "samples = [\"ctrl_1\", \"ctrl_2\", \"ctrl_3\", \"heat_1\", \"heat_2\", \"heat_3\"]\nprint(samples[3], len(samples[3:]))"
      },
      options: [
        { t: "ctrl_3 3", why: "ctrl_3 is the third item, at index 2. Counting starts at 0, so index 3 is the fourth item." },
        { t: "heat_1 3", why: "Correct. Index 3 is the fourth item, heat_1, and the slice from index 3 to the end holds three items." },
        { t: "heat_1 4", why: "`samples[3:]` starts at index 3 and runs to the end: heat_1, heat_2 and heat_3, three items." }
      ],
      answer: 1,
      verify: {}
    },
    {
      q: "Which plan counts how many of the six HSPA1A counts are above 1000?",
      options: [
        { t: "Inside the loop, set `n = 0` and then add 1 to `n` when `c > 1000`", why: "`n` is reset on every pass, so it can never be more than 1. The accumulator must be created before the loop." },
        { t: "After the loop, add 1 to `n` when `c > 1000`", why: "After the loop, `c` holds only the last count. The test has to happen inside the loop, once per item." },
        { t: "Set `n = 0` before the loop; inside the loop, add 1 to `n` when `c > 1000`; print `n` after the loop", why: "Correct. This is the accumulator pattern: create once, update inside the loop, use afterwards." }
      ],
      answer: 2
    }
  ],
  real: "Real scripts loop over samples to compute library sizes, over genes to apply a minimum-count filter, and over reads to compute quality summaries. When a dataset has millions of rows, pandas and NumPy do the same work with fast built-in loops, but the logic of accumulators and filters is identical.",
  teach: {
    prompt: "Explain to a friend how a for loop with an accumulator adds up a list of counts.",
    points: [
      "A list stores values in order and is indexed from 0",
      "A for loop runs its block once per item",
      "The accumulator is created before the loop and updated inside it",
      "Indentation decides what is inside the loop",
      "`append` adds items, for example when filtering"
    ]
  }
});

BB.lessons.push({
  id: "f2-dicts",
  what: "A dictionary stores key-value pairs: each key, such as the codon `\"ATG\"`, is linked to a value, such as the amino acid `\"M\"`. You look values up by key instead of by position.",
  problem: "Lists find items by position, but biology is full of lookups by name: gene to count, codon to amino acid, sample to condition. Searching a list for the right name every time is slow and clumsy; a dictionary goes straight to it.",
  care: "Two of the most common small tasks in bioinformatics, counting things (bases, codons, reads per gene) and translating one code into another (codons into amino acids), are dictionary jobs.",
  steps: [
    "Create a dictionary with braces: `codon = {\"ATG\": \"M\", \"TAA\": \"*\"}`. An empty one is `{}`.",
    "Look up a value with square brackets: `codon[\"ATG\"]` gives `\"M\"`. A missing key raises a KeyError, while `codon.get(\"XYZ\", \"?\")` returns the default `\"?\"` instead.",
    "Add or update with assignment: `d[key] = value`. Keys are unique, so assigning to an existing key replaces its value.",
    "`\"ATG\" in codon` tests whether a key exists. It looks at the keys only, never at the values.",
    "Counting pattern: loop over the items; if an item is already a key, add 1 to its value, otherwise set it to 1. Loop over a finished dictionary with `for key, value in d.items():`."
  ],
  deeper: "Dictionaries keep keys in the order they were first added (guaranteed since Python 3.7). Keys must be values that cannot change, such as strings and numbers, so a list cannot be a key. The standard library's `collections.Counter` performs the counting pattern in one line, `Counter(seq)`, and is worth learning once the manual version makes sense.",
  show: {
    intro: "Counting the bases in a short gene, then looking up one sample's condition.",
    lang: "python",
    code: "seq = \"ATGGCCAAATTTGGGTAA\"\ncounts = {}\nfor base in seq:\n    if base in counts:\n        counts[base] = counts[base] + 1\n    else:\n        counts[base] = 1\nprint(counts)\nprint(counts[\"G\"], counts.get(\"N\", 0))\ncondition = {\"ctrl_1\": \"control\", \"heat_1\": \"heat_shock\"}\nprint(condition[\"heat_1\"])",
    output: "{'A': 6, 'T': 5, 'G': 5, 'C': 2}\n5 0\nheat_shock",
    notes: [
      "Looping over a string gives one character at a time. The first time a base appears it gets the value 1; after that its value goes up by 1.",
      "Keys appear in the order they were first seen: A, T, G, C.",
      "`counts.get(\"N\", 0)` returns 0 because N (an unknown base) never appeared. `counts[\"N\"]` would raise a KeyError.",
      "The second dictionary maps sample names to conditions, a small version of `samples.tsv`."
    ],
    run: true
  },
  pitfall: {
    wrong: "`counts[base] = counts[base] + 1` works even the first time a base appears.",
    right: "The first time, the key does not exist yet, so reading `counts[base]` raises a KeyError. Check `if base in counts` first, or write `counts[base] = counts.get(base, 0) + 1`."
  },
  try: { kind: "trace", program: "dict-count" },
  check: [
    {
      q: "What does this print?",
      code: {
        lang: "python",
        src: "condition = {\"ctrl_1\": \"control\", \"heat_1\": \"heat_shock\"}\nprint(\"control\" in condition, \"ctrl_1\" in condition)"
      },
      options: [
        { t: "False True", why: "Correct. `in` checks keys only. \"control\" is a value, so the first test is False; \"ctrl_1\" is a key, so the second is True." },
        { t: "True True", why: "\"control\" appears in the dictionary, but as a value. `in` never looks at values; use `\"control\" in condition.values()` for that." },
        { t: "True False", why: "This swaps keys and values. The keys are the sample names written before each colon." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "A translation script stops with `KeyError: 'TGA'`. What is the most likely cause?",
      options: [
        { t: "TGA is not a valid DNA sequence", why: "TGA is a real codon, one of the three stop codons. The error means this dictionary lacks the key, not that the sequence is invalid." },
        { t: "The codon dictionary has no entry for TGA, so looking it up with square brackets fails", why: "Correct. A KeyError names the missing key. Add TGA (a stop codon) to the dictionary, or use `get` with a default." },
        { t: "The loop ran past the end of the sequence", why: "Going past the end of a list or string gives an IndexError. A KeyError is specific to dictionary lookups." }
      ],
      answer: 1
    },
    {
      q: "You need to look up the condition of any of 600 samples by name. Which structure fits best?",
      options: [
        { t: "A list of conditions in the same order as the sample names", why: "This works only while both lists stay perfectly aligned, and each lookup means searching for the name's position first." },
        { t: "600 separate variables, one per sample", why: "You could not loop over them, and the code would need 600 names. Collections exist to avoid exactly this." },
        { t: "A dictionary with sample names as keys and conditions as values", why: "Correct. A dictionary goes straight to the value for a key, however many samples there are." }
      ],
      answer: 2
    }
  ],
  real: "Annotation tables become dictionaries that map gene identifiers to gene symbols, metadata becomes a dictionary from sample to condition, and genome assemblers count short subsequences, called k-mers, with dictionary-like structures. When a gene name is missing from a lookup table, the KeyError is often the first warning that two files use different naming systems.",
  teach: {
    prompt: "Explain to a friend how to count the bases in a DNA string with a dictionary.",
    points: [
      "A dictionary maps keys to values",
      "Look up with `d[key]`; a missing key raises KeyError",
      "`get(key, default)` avoids the error",
      "`in` checks keys, not values",
      "Counting: set to 1 the first time, add 1 after that"
    ]
  }
});

BB.lessons.push({
  id: "f2-files",
  what: "Python can open a text file and read it one line at a time. Each line arrives as a string that ends with a newline character, written `\\n`, which you remove before splitting the line into fields.",
  problem: "Data lives in files: count tables, sample sheets and sequence files. Some are too large to open in a spreadsheet or even to fit in memory at once. Reading line by line works for files of any size, and it shows exactly how a table becomes values your program can use.",
  care: "pandas reads tables for you, but knowing what it does underneath helps when something goes wrong. Line-by-line reading is also the standard way to stream through very large FASTA and FASTQ files.",
  steps: [
    "`with open(\"samples.tsv\") as f:` opens the file for reading and closes it automatically when the indented block ends. The file name is a path, relative to the folder the program runs in.",
    "`f.readline()` reads one line. Calling it once before the loop is a simple way to skip the header.",
    "`for line in f:` then gives the remaining lines one at a time, each as a string that still ends with a newline.",
    "`line.rstrip(\"\\n\")` removes that newline and `.split(\"\\t\")` cuts the line at every tab, giving a list of fields. Every field is a string, so convert numbers with `int()` or `float()`.",
    "To write a file, open it with `open(\"out.tsv\", \"w\")` and call `f.write(text + \"\\n\")`. Mode `\"w\"` replaces any existing file with that name, so never point it at your raw data."
  ],
  deeper: "A wrong file name raises a FileNotFoundError that shows the name Python tried, usually enough to spot a wrong folder or a typo. Mode `\"a\"` appends instead of replacing. The `csv` module and pandas handle trickier cases, such as quoted fields, and `gzip.open(path, \"rt\")` from the `gzip` module reads compressed files such as `reads.fastq.gz` as text, line by line.",
  show: {
    intro: "Read `samples.tsv` and report which samples were heated. The program runs in the `data` folder, where the file is.",
    lang: "python",
    code: "with open(\"samples.tsv\") as f:\n    header = f.readline()\n    for line in f:\n        fields = line.rstrip(\"\\n\").split(\"\\t\")\n        sample = fields[0]\n        temperature = int(fields[3])\n        if temperature > 37:\n            print(sample, \"was heated to\", temperature, \"C\")",
    output: "heat_1 was heated to 42 C\nheat_2 was heated to 42 C\nheat_3 was heated to 42 C",
    cwd: "~/project/data",
    notes: [
      "`header` holds the first line (sample, condition, replicate, temperature_C), so the loop starts at the first data row.",
      "For the ctrl_1 line, the fields are `['ctrl_1', 'control', '1', '37']`: four strings, numbered 0 to 3.",
      "`int(fields[3])` converts the text `\"37\"` into the number 37, so it can be compared with `>`.",
      "Only the three heat-shock samples pass the test, so three lines are printed."
    ]
  },
  pitfall: {
    wrong: "Numbers read from a file are already numbers.",
    right: "Every field is a string. Comparing `\"42\" > 37` raises a TypeError, and adding two fields joins them as text. Convert with `int()` or `float()` first. Strip the newline too: without `rstrip`, the last field of each line is `\"37\\n\"`, which is not equal to `\"37\"`."
  },
  try: {
    kind: "parsons",
    prompt: "Put the lines in order so that the program adds up the heat_1 column of `counts.tsv` (column index 4, after the gene name and the three control samples) and prints the total.",
    lang: "python",
    lines: [
      "total = 0",
      "with open(\"counts.tsv\") as f:",
      "    header = f.readline()",
      "    for line in f:",
      "        fields = line.rstrip(\"\\n\").split(\"\\t\")",
      "        total = total + int(fields[4])",
      "print(\"heat_1 total:\", total)"
    ],
    output: "heat_1 total: 277904",
    hintWrong: "The accumulator must exist before the file is read. Inside the `with` block, read the header once, then loop: split each line before adding its column 4. The unindented `print` comes last.",
    verify: true,
    explain: "The accumulator `total` is created before the file is read. Inside the `with` block, the header is read once, and then the loop handles each gene line: strip, split, convert column 4 and add. The final `print` is not indented, so it runs once, after the file has been closed. 277,904 is the total number of heat_1 reads across these 12 genes."
  },
  check: [
    {
      q: "What does this print?",
      code: { lang: "python", src: "print(\"ctrl_1\\tcontrol\\t1\\t37\\n\".rstrip(\"\\n\").split(\"\\t\"))" },
      options: [
        { t: "['ctrl_1', 'control', 1, 37]", why: "`split` never converts anything. The numbers stay strings until you call `int()` or `float()`." },
        { t: "['ctrl_1\\tcontrol\\t1\\t37']", why: "`split(\"\\t\")` cuts at every tab, giving four fields, not one." },
        { t: "['ctrl_1', 'control', '1', '37']", why: "Correct. The newline is removed, the line is cut at each tab, and every field stays a string, which is why each one is shown in quotes." },
        { t: "ctrl_1 control 1 37", why: "`split` returns a list, which `print` shows with brackets, quotes and commas." }
      ],
      answer: 2,
      verify: {}
    },
    {
      q: "This loop reads `samples.tsv` without skipping the header. What happens?",
      code: {
        lang: "python",
        src: "total = 0\nwith open(\"samples.tsv\") as f:\n    for line in f:\n        fields = line.rstrip(\"\\n\").split(\"\\t\")\n        total = total + int(fields[3])\nprint(total)"
      },
      options: [
        { t: "237", why: "That is the sum of the six temperatures (3 x 37 + 3 x 42), which you would get only after skipping the header line." },
        { t: "ValueError: invalid literal for int() with base 10: 'temperature_C'", why: "Correct. The first line is the header, so `fields[3]` is the text temperature_C, which `int()` cannot convert." },
        { t: "TypeError: can only concatenate str (not \"int\") to str", why: "`int()` is called before anything is added, so the program fails at the conversion, not at the addition." }
      ],
      answer: 1,
      verify: { mode: "error" }
    },
    {
      q: "A line of `counts.tsv` has been split into `fields`. Its columns are gene, ctrl_1, ctrl_2, ctrl_3, heat_1, heat_2 and heat_3. Which expression gives the heat_1 count as a number?",
      options: [
        { t: "`int(fields[4])`", why: "Correct. The gene name is at index 0, so heat_1, the fifth column, is at index 4. `int()` converts it from text." },
        { t: "`int(fields[3])`", why: "Index 3 is ctrl_3. The gene name takes index 0, which shifts every sample one place to the right." },
        { t: "`fields[4]`", why: "That is the right column, but it is still a string, so arithmetic with it will fail or join text." },
        { t: "`int(fields[\"heat_1\"])`", why: "A list is indexed by position, not by name, so this raises a TypeError. pandas allows column names; a plain list does not." }
      ],
      answer: 0
    }
  ],
  real: "Sequencing files are often far larger than a computer's memory, so tools stream through them one line or one record at a time, exactly like this loop. Counting FASTA records, extracting sample names from a sample sheet, and checking that every sample in the count table appears in the metadata are everyday scripts built from `open`, `rstrip` and `split`.",
  teach: {
    prompt: "Explain to a friend how to read a tab-separated file line by line and add up one of its numeric columns.",
    points: [
      "`with open(...)` opens the file and closes it afterwards",
      "Each line is a string ending in a newline",
      "`rstrip` removes the newline; `split` cuts at the tabs",
      "Fields are strings; convert with `int()` or `float()`",
      "Skip or handle the header line"
    ]
  }
});

BB.lessons.push({
  id: "f2-pandas",
  what: "pandas is a Python package for tables. Its DataFrame holds rows and columns with labels, like a spreadsheet you control with code. NumPy is the package for numbers underneath it: its array is a grid of values that supports math on every element at once.",
  problem: "Reading tables line by line works, but every question then takes many lines of code. pandas reads a whole table in one line and lets you select, filter and summarize columns by name. NumPy does arithmetic on millions of numbers without a Python loop, which is much faster.",
  care: "The KAUST course's Python module covers pandas and NumPy, and its case study uses Python for single-cell RNA-seq analysis, a field where count matrices and cell information are usually handled with these two libraries.",
  steps: [
    "Import both packages with the usual nicknames: `import pandas as pd` and `import numpy as np`.",
    "`counts = pd.read_csv(\"counts.tsv\", sep=\"\\t\", index_col=0)` reads the table. `sep=\"\\t\"` says the columns are separated by tabs, and `index_col=0` uses the gene column as row labels. `counts.shape` gives the number of rows and columns.",
    "Select by label: `counts[\"heat_1\"]` is one column, `counts[[\"ctrl_1\", \"heat_1\"]]` is several columns, and `counts.loc[\"HSPA1A\"]` is one row.",
    "Calculate on whole columns at once, which is called vectorized code: `counts[\"heat_1\"] / 24600000 * 1000000` converts every heat_1 count to CPM. `counts.mean(axis=1)` averages across each row, giving one mean per gene.",
    "Filter with a Boolean condition inside square brackets: `counts[counts[\"heat_1\"] > 5000]` keeps only the rows where the condition is True."
  ],
  deeper: "Each DataFrame column is stored as a NumPy array, and vectorized operations run in fast compiled code instead of a Python loop. `loc` selects by labels and `iloc` by positions, counting from 0. A DataFrame is the Python counterpart of an R data frame: R's `counts[counts$heat_1 > 5000, ]` and pandas' `counts[counts[\"heat_1\"] > 5000]` are the same filter.",
  show: {
    intro: "Average each condition and compute a log2 fold change for every gene at once. pandas is not available in this site's in-browser Python, so this output comes from a standard installation.",
    lang: "python",
    code: "import numpy as np\nimport pandas as pd\n\ncounts = pd.read_csv(\"counts.tsv\", sep=\"\\t\", index_col=0)\nprint(counts.shape)\nctrl = counts[[\"ctrl_1\", \"ctrl_2\", \"ctrl_3\"]].mean(axis=1)\nheat = counts[[\"heat_1\", \"heat_2\", \"heat_3\"]].mean(axis=1)\nlog2fc = np.log2((heat + 1) / (ctrl + 1))\nprint(log2fc[log2fc > 2].round(2))",
    output: "(12, 6)\ngene\nHSPA1A    5.44\nHSPA1B    5.57\nHSPA6     8.48\nDNAJB1    2.69\ndtype: float64",
    cwd: "~/project/data",
    notes: [
      "`(12, 6)`: 12 genes (rows) and 6 samples (columns). The gene names became row labels, so they are not counted as a column.",
      "`mean(axis=1)` averages across each row, giving one control mean and one heat mean per gene.",
      "`np.log2` works on all 12 genes at once. Adding 1 to each mean (a pseudocount) avoids dividing by zero or taking the log of zero.",
      "The filter keeps genes whose heat mean is over 4 times (2 to the power 2) their control mean. `gene` names the row labels and `dtype: float64` means decimal numbers. This toy calculation skips normalization (Foundation 3)."
    ]
  },
  pitfall: {
    wrong: "`counts.mean()` gives one average per gene.",
    right: "By default pandas averages down each column (`axis=0`), giving one value per sample. Use `counts.mean(axis=1)` to average across each row, giving one value per gene. Check the labels of the result to see which one you got."
  },
  try: {
    kind: "predict",
    q: "What does this print?",
    code: {
      lang: "python",
      src: "import pandas as pd\ncounts = pd.read_csv(\"counts.tsv\", sep=\"\\t\", index_col=0)\nhigh = counts[counts[\"heat_1\"] > 10000]\nprint(high.index.tolist())"
    },
    options: [
      { t: "['HSPA1A', 'HSPA1B']", why: "These two are strongly induced by heat, but the filter only compares one heat_1 value with 10,000. It does not compare heat with control." },
      { t: "['HSPA1A', 'HSPA1B', 'ACTB', 'GAPDH', 'EEF1A1']", why: "Right. The filter keeps every gene whose heat_1 count is above 10,000. That includes housekeeping genes such as ACTB, which are high in every sample: a high value is not the same as a change." },
      { t: "['heat_1']", why: "The condition selects rows (genes), not columns. `index` holds the row labels of the rows that were kept." },
      { t: "5", why: "`len(high)` would print 5. `high.index.tolist()` prints the labels of the kept rows." }
    ],
    answer: 1,
    verify: {}
  },
  check: [
    {
      q: "What does this print?",
      code: {
        lang: "python",
        src: "import numpy as np\ncounts = [212, 282, 203]\nprint(counts * 2)\nprint(np.array(counts) * 2)"
      },
      options: [
        { t: "[212, 282, 203, 212, 282, 203]\n[424 564 406]", why: "Correct. A list times 2 is repeated; a NumPy array times 2 doubles every element. NumPy prints arrays without commas." },
        { t: "[424, 564, 406]\n[424 564 406]", why: "A plain list does not do arithmetic on its items. Multiplying a list by a number repeats the list." },
        { t: "[212, 282, 203, 212, 282, 203]\n[212 282 203 212 282 203]", why: "NumPy arrays do element-by-element math, so `* 2` doubles each number instead of repeating the array." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "`counts` was loaded from `counts.tsv` with `index_col=0`. Which code keeps only the genes with more than 1000 reads in ctrl_1?",
      options: [
        { t: "`counts[\"ctrl_1\"] > 1000`", why: "This gives a column of True and False values, one per gene, not the rows themselves. Put it inside `counts[...]` to filter." },
        { t: "`counts[counts[\"ctrl_1\"] > 1000]`", why: "Correct. The inner part gives True or False for each gene, and the outer brackets keep the rows where it is True." },
        { t: "`counts.loc[\"ctrl_1\" > 1000]`", why: "Python compares the text \"ctrl_1\" with the number 1000 first, which raises a TypeError before pandas is involved." }
      ],
      answer: 1
    },
    {
      q: "What is the main difference between a pandas DataFrame and a NumPy array?",
      options: [
        { t: "A DataFrame is a file format, like TSV", why: "A DataFrame is a structure in memory. `read_csv` builds one from a file, and `to_csv` writes one out." },
        { t: "An array can hold only one number", why: "An array can hold millions of numbers, in one or more dimensions." },
        { t: "A DataFrame has labeled rows and columns, and each column can have its own type; an array is a grid of values of one type, addressed by position", why: "Correct. Labels let you select by gene or sample name, while arrays are built for fast arithmetic." }
      ],
      answer: 2
    }
  ],
  real: "In single-cell RNA-seq, a dataset can contain tens of thousands of cells and genes. The counts are stored in NumPy-style arrays, often in a compressed form because most values are zero, and the information about cells and genes in pandas tables. The KAUST course teaches both libraries in its Python module, before the single-cell case study.",
  teach: {
    prompt: "Explain to a friend what a DataFrame is, how to filter rows in pandas, and why NumPy arrays are useful.",
    points: [
      "A DataFrame is a table with labeled rows and columns",
      "`read_csv` with `sep=\"\\t\"` reads a TSV file",
      "Select columns by name and rows with `loc`",
      "Filter rows with a Boolean condition inside square brackets",
      "NumPy arrays do math on every element at once"
    ]
  }
});

BB.lessons.push({
  id: "f2-read-code",
  what: "Code reading means working out what a program does before you run it or change it: following it line by line, tracking the value of each variable, and predicting the exact output.",
  problem: "Most of the code you will meet in bioinformatics was written by someone else: course notebooks, tutorials, a labmate's pipeline. Changing code you do not understand can introduce bugs that produce wrong numbers without any error message.",
  care: "Predicting output is the fastest way to learn. When the real output differs from your prediction, either the code or your understanding is wrong, and both are worth discovering. The trace activities in this foundation practice exactly this skill.",
  steps: [
    "Skim first: find the inputs, the outputs (what is printed, returned or written to a file) and the overall shape: functions, loops and if statements.",
    "Make a trace table with one column per variable. Go line by line and write down the new value each time a variable changes.",
    "For a loop, write one row per pass. For a function call, note which argument goes into which parameter, and what comes back.",
    "Predict the exact output, including the details: brackets, quotes, decimal points and line breaks.",
    "Run the code and compare. If the output differs, find the first line where your trace and reality disagree."
  ],
  deeper: "Good reading habits: give unclear variables a meaningful name in your head (or in the code), test with the smallest possible input, and add temporary `print` statements to show values at key points. Explaining code aloud, line by line, to another person or even to an object on your desk often reveals the gap in your understanding; programmers call this rubber duck debugging.",
  show: {
    intro: "A function with an unhelpful name. Trace it on the four-letter input yourself before you read the notes.",
    lang: "python",
    code: "def mystery(seq):\n    result = \"\"\n    for base in seq:\n        if base == \"A\":\n            result = result + \"T\"\n        elif base == \"T\":\n            result = result + \"A\"\n        elif base == \"G\":\n            result = result + \"C\"\n        else:\n            result = result + \"G\"\n    return result[::-1]\n\nprint(mystery(\"ATGC\"))",
    output: "GCAT",
    notes: [
      "Trace table for `mystery(\"ATGC\")`: base A makes result T; base T makes TA; base G makes TAC; base C, handled by `else`, makes TACG.",
      "`return result[::-1]` reverses TACG, so the function returns GCAT.",
      "Each base is swapped for its partner and the whole string is reversed: this is the reverse complement. A better name for the function would be `reverse_complement`.",
      "Reading also reveals a hidden assumption: `else` turns any other character, such as N or a lowercase a, into G. Real data would need a check for that."
    ],
    run: true
  },
  pitfall: {
    wrong: "If code runs without an error message, it is correct.",
    right: "Many bugs produce no error at all: a filter with the wrong comparison, a total reset inside a loop, a column that is off by one. Only predicting the output and checking it against a small case you can work out by hand catches these."
  },
  try: { kind: "trace", program: "read-max" },
  check: [
    {
      q: "What does this print?",
      code: { lang: "python", src: "x = 2\nfor i in range(3):\n    x = x * 2 + i\nprint(x)" },
      options: [
        { t: "16", why: "This ignores `+ i` and just doubles x three times." },
        { t: "20", why: "Correct. Trace it: i = 0 gives x = 4, i = 1 gives 9, and i = 2 gives 20." },
        { t: "27", why: "This uses i = 1, 2 and 3, but `range(3)` gives 0, 1 and 2." }
      ],
      answer: 1,
      verify: {}
    },
    {
      q: "In one sentence, what does this function do?",
      code: {
        lang: "python",
        src: "def f(values):\n    best = values[0]\n    for v in values:\n        if v < best:\n            best = v\n    return best"
      },
      options: [
        { t: "It returns the largest value in the list", why: "The test is `v < best`, so `best` moves toward smaller values, not larger ones. Read the comparison carefully." },
        { t: "It returns the first value in the list", why: "`best` starts as the first value, but the loop replaces it whenever a smaller value appears." },
        { t: "It returns the smallest value in the list", why: "Correct. `best` is replaced only when a value is smaller than it, so at the end it holds the minimum." },
        { t: "It returns how many values are smaller than the first one", why: "Nothing is counted: `best` holds a value from the list, not a count." }
      ],
      answer: 2
    },
    {
      q: "You inherit a 200-line script that filters genes, and you must change its count threshold. What should you do first?",
      options: [
        { t: "Read the script to find where the threshold is set and used, then predict and check its output on a small test input", why: "Correct. Understanding comes before editing, and a small test shows whether your change does what you expect." },
        { t: "Change every number that looks like a threshold and rerun it on the full data", why: "A number such as 10 may mean different things on different lines, so blind edits risk silent errors." },
        { t: "Rewrite the script from scratch so that you understand all of it", why: "Rewriting takes far longer and can lose behavior that was already tested." }
      ],
      answer: 0
    }
  ],
  real: "Reproducing a published analysis usually means reading the authors' code to find which filters and settings they used. Reviewing a labmate's notebook, adapting a tutorial to your own data and checking a pipeline's default settings are all code-reading tasks, and they come before any edit.",
  teach: {
    prompt: "Explain to a friend how to trace a short program that contains a loop, using a trace table.",
    points: [
      "Skim for inputs, outputs and structure",
      "Track each variable's value line by line",
      "Write one row per loop pass",
      "Predict the exact output",
      "Compare with the real output and find where they diverge"
    ]
  }
});

BB.lessons.push({
  id: "f2-debug",
  what: "When Python cannot carry out a line, it stops and raises an exception, also called an error, and prints a traceback: a report of where the problem happened and what kind of problem it was. Debugging is the methodical search for the cause of an error or of a wrong result.",
  problem: "Every programmer writes bugs, every day. Beginners often lose hours because tracebacks look intimidating, yet most of them state exactly what went wrong and on which line.",
  care: "Errors appear in every module of the Rice course and in every real analysis. Reading the last line of a traceback first, and knowing the common exception types, turns most errors into a quick fix.",
  steps: [
    "Read the last line first. It names the exception type, such as NameError or TypeError, followed by a message.",
    "Then read the line number and the code shown just above the last line. That is where Python noticed the problem; the cause may be on an earlier line.",
    "Know the common types: SyntaxError (broken grammar, such as a missing colon), IndentationError, NameError (an unknown or misspelled name), TypeError (the wrong type for an operation), IndexError (a position past the end), KeyError (a missing dictionary key) and ValueError (an unusable value, as in `int(\"abc\")`).",
    "No error but a wrong answer means a logic bug. Predict what each step should give, add temporary `print` calls to see the real values, and test on a tiny input whose answer you know.",
    "Change one thing at a time and rerun. When it works, test again with the original data."
  ],
  deeper: "Python checks the grammar of the whole file first, so a SyntaxError stops the program before any line runs; other exceptions happen only when the failing line is reached. The `^` and `~` marks in a traceback point at the exact part of the line that failed. `try` and `except` can catch an expected exception, but catching errors you do not understand hides bugs instead of fixing them.",
  show: {
    intro: "A script stopped halfway. The first part shows the program with line numbers; the second shows exactly what Python printed.",
    lang: "text",
    code: "1  seq = \"ATGGCCAAATTTGGGTAA\"\n2  gc_count = seq.count(\"G\") + seq.count(\"C\")\n3  print(\"GC fraction:\", gc_count / len(seq))\n4  print(\"GC count: \" + gc_count)\n\nGC fraction: 0.3888888888888889\nTraceback (most recent call last):\n  File \"gc.py\", line 4, in <module>\n    print(\"GC count: \" + gc_count)\n          ~~~~~~~~~~~~~^~~~~~~~~~\nTypeError: can only concatenate str (not \"int\") to str",
    notes: [
      "Bottom line first: a TypeError. Python can only join (concatenate) a str to another str, and `gc_count` is an int.",
      "The traceback points to line 4 of `gc.py`, and the `^` marks the `+` that failed.",
      "Line 3 ran before the crash, so its output appears above the traceback. An error stops the program at the failing line, not before it.",
      "Two fixes work: convert with `\"GC count: \" + str(gc_count)`, or let `print` separate the values with a comma: `print(\"GC count:\", gc_count)`."
    ]
  },
  pitfall: {
    wrong: "The cause of an error is always on the line the traceback points to.",
    right: "That line is where Python noticed the problem. The cause is often earlier: a variable that got the wrong value, a bracket left open on the previous line, or a misspelled name assigned above. Work backwards from the reported line."
  },
  try: {
    kind: "debug",
    prompt: "This loop should add up the six HSPA1A counts, but it crashes. Read the error and choose the fix.",
    lang: "python",
    code: "counts = [212, 282, 203, 11018, 8441, 10838]\ntotal = 0\nfor i in range(1, len(counts) + 1):\n    total = total + counts[i]\nprint(total)",
    error: "IndexError: list index out of range",
    options: [
      { t: "Valid indexes are 0 to 5, but `range(1, len(counts) + 1)` gives 1 to 6. Use `range(len(counts))`.", why: "Correct. Six items have indexes 0 to 5, so index 6 does not exist, and index 0 was skipped too. Counting from 1 is an R habit." },
      { t: "The list needs a seventh value so that index 6 exists.", why: "Made-up data would hide the bug and change the total. The loop is wrong, not the data." },
      { t: "`total` should start at 1 instead of 0.", why: "The starting total does not change which indexes are used, and the error is about a position." },
      { t: "Change `counts[i]` to `counts(i)`.", why: "Parentheses call a function; lists are indexed with square brackets. This would raise a TypeError." }
    ],
    answer: 0,
    fixed: "counts = [212, 282, 203, 11018, 8441, 10838]\ntotal = 0\nfor i in range(len(counts)):\n    total = total + counts[i]\nprint(total)",
    fixedOutput: "30994"
  },
  check: [
    {
      q: "A script stops with `NameError: name 'totl' is not defined`. What is the most likely cause?",
      options: [
        { t: "The variable holds a value of the wrong type", why: "Wrong types give a TypeError. A NameError means the name itself is unknown." },
        { t: "The name `totl` was never assigned; most likely `total` was misspelled", why: "Correct. NameError means Python has never seen this name. A typo is the most common reason." },
        { t: "Python does not allow variable names shorter than five letters", why: "Any valid name works once something has been assigned to it, even a one-letter name." }
      ],
      answer: 1
    },
    {
      q: "What happens when this code runs?",
      code: { lang: "python", src: "for c in [1, 2, 3]:\nprint(c)" },
      options: [
        { t: "1\n2\n3", why: "Python uses indentation to decide what belongs to the loop. With no indented line, the loop has no body." },
        { t: "NameError: name 'c' is not defined", why: "Python never gets as far as looking up `c`: the indentation problem is found before anything runs." },
        { t: "IndentationError: expected an indented block after 'for' statement on line 1", why: "Correct. The body of a loop must be indented. Python refuses to run the file at all." }
      ],
      answer: 2,
      verify: { mode: "error" }
    },
    {
      q: "A script prints a mean of 67.67 instead of the expected 232.33, with no error message. What is the best next step?",
      options: [
        { t: "Add a temporary `print` inside the loop to watch the total change, using a small list you can add up by hand", why: "Correct. Seeing the real values step by step shows exactly where the calculation goes wrong." },
        { t: "Run it a few more times, because the problem may go away", why: "Python runs the same code the same way every time. A logic bug stays until the code is changed." },
        { t: "Change `/` to `//` so that the result is a whole number", why: "That changes the format of a wrong answer. It does not fix the logic that produced it." }
      ],
      answer: 0
    }
  ],
  real: "Real pipelines fail on unexpected data: a gene missing from the annotation (KeyError), the text `NA` in a numeric column (ValueError), a misspelled file path (FileNotFoundError). The last line and the line number of the traceback tell you which file, which line and often which value caused the failure.",
  teach: {
    prompt: "Explain to a friend how to read a Python traceback, and what to do when code runs but gives a wrong answer.",
    points: [
      "Read the last line: the exception type and message",
      "Then the line number and the code shown",
      "The cause may be earlier than the reported line",
      "Know SyntaxError, NameError, TypeError, IndexError, KeyError and ValueError",
      "For logic bugs: predict, print, test small and change one thing at a time"
    ]
  }
});

BB.lessons.push({
  id: "f2-bio-project",
  what: "In this mini-project you combine strings, loops, dictionaries and functions into a small DNA toolkit: functions for GC content, reverse complement and translation that you can test and reuse, plus transcription in a single line.",
  problem: "Single operations are easy; real tasks chain several of them. If each step is a small, tested function, the chain is easy to check, and a mistake can be traced to one place.",
  care: "These four operations are classic first bioinformatics programs. Libraries such as Biopython provide polished versions, but writing them once shows exactly what those tools do, and what they assume about their input.",
  steps: [
    "`gc_content(seq)`: count the G and C bases, then divide by the length of the sequence.",
    "`reverse_complement(seq)`: use a dictionary to swap each base for its partner (A with T, G with C), building the result in reverse order.",
    "Transcription: the mRNA has the same sequence as the coding strand, with U in place of T, so `seq.replace(\"T\", \"U\")` is enough.",
    "`translate(seq)`: step through the sequence three letters at a time with `range(0, len(seq) - 2, 3)`, look up each codon in a dictionary, and stop at a stop codon.",
    "Test each function on a tiny input whose answer you can work out by hand before trusting it with real sequences."
  ],
  deeper: "The real genetic code has 64 codons. The toy dictionary holds only the six in the example, so `.get(codon, \"X\")` marks any other codon as unknown instead of crashing. Real tools also handle lowercase letters, ambiguous bases such as N, lengths that are not a multiple of 3, and alternative genetic codes such as the mitochondrial one.",
  show: {
    intro: "The whole toolkit applied to the short gene from Foundation 0. Run it, then experiment in the activity below.",
    lang: "python",
    code: "def gc_content(seq):\n    return (seq.count(\"G\") + seq.count(\"C\")) / len(seq)\n\ndef reverse_complement(seq):\n    pair = {\"A\": \"T\", \"T\": \"A\", \"G\": \"C\", \"C\": \"G\"}\n    result = \"\"\n    for base in seq:\n        result = pair[base] + result\n    return result\n\ncodons = {\"ATG\": \"M\", \"GCC\": \"A\", \"AAA\": \"K\", \"TTT\": \"F\", \"GGG\": \"G\", \"TAA\": \"*\"}\n\ndef translate(seq):\n    protein = \"\"\n    for i in range(0, len(seq) - 2, 3):\n        aa = codons.get(seq[i:i + 3], \"X\")\n        if aa == \"*\":\n            break\n        protein = protein + aa\n    return protein\n\ngene = \"ATGGCCAAATTTGGGTAA\"\nprint(round(gc_content(gene), 3))\nprint(reverse_complement(gene))\nprint(gene.replace(\"T\", \"U\"))\nprint(translate(gene))",
    output: "0.389\nTTACCCAAATTTGGCCAT\nAUGGCCAAAUUUGGGUAA\nMAKFG",
    notes: [
      "GC content: 7 of the 18 bases are G or C, about 0.389.",
      "`result = pair[base] + result` puts each new partner base at the front, so the complement comes out already reversed: TTACCCAAATTTGGCCAT.",
      "The mRNA is the coding strand with U in place of T.",
      "Translation reads ATG, GCC, AAA, TTT and GGG, then stops at TAA, giving MAKFG: Met, Ala, Lys, Phe, Gly, as in the Foundation 0 example."
    ],
    run: true
  },
  pitfall: {
    wrong: "The reverse complement is just the sequence written backwards.",
    right: "Reversing alone (`seq[::-1]`) keeps the same letters, only in the opposite order. The other strand carries the complementary bases and runs in the opposite direction, so you must swap each base for its partner and reverse. For ATGC, reversing gives CGTA, but the reverse complement is GCAT."
  },
  try: {
    kind: "widget",
    widget: "pyrun",
    props: {
      code: "def gc_content(seq):\n    return (seq.count(\"G\") + seq.count(\"C\")) / len(seq)\n\ndef reverse_complement(seq):\n    pair = {\"A\": \"T\", \"T\": \"A\", \"G\": \"C\", \"C\": \"G\"}\n    result = \"\"\n    for base in seq:\n        result = pair[base] + result\n    return result\n\ncodons = {\"ATG\": \"M\", \"GCC\": \"A\", \"AAA\": \"K\", \"TTT\": \"F\", \"GGG\": \"G\", \"TAA\": \"*\"}\n\ndef translate(seq):\n    protein = \"\"\n    for i in range(0, len(seq) - 2, 3):\n        aa = codons.get(seq[i:i + 3], \"X\")\n        if aa == \"*\":\n            break\n        protein = protein + aa\n    return protein\n\n# Test on inputs you can check by hand first\nprint(reverse_complement(\"ATGC\"))\nprint(gc_content(\"GGCC\"), gc_content(\"ATAT\"))\n\ngene = \"ATGAAATTTGCCTAA\"\nprint(\"GC:\", round(gc_content(gene), 3))\nprint(\"reverse complement:\", reverse_complement(gene))\nprint(\"protein:\", translate(gene))\n\n# Try: add \"TGG\": \"W\" to codons, then translate \"ATGTGGTAA\".\n# Try: what does reverse_complement(\"ATGN\") do, and why?"
    }
  },
  check: [
    {
      q: "Using the toolkit function, what does this print?",
      code: {
        lang: "python",
        src: "def reverse_complement(seq):\n    pair = {\"A\": \"T\", \"T\": \"A\", \"G\": \"C\", \"C\": \"G\"}\n    result = \"\"\n    for base in seq:\n        result = pair[base] + result\n    return result\n\nprint(reverse_complement(\"AACG\"))"
      },
      options: [
        { t: "TTGC", why: "That is the complement without the reversal. The function puts each new base at the front, which reverses the order." },
        { t: "GCAA", why: "That is the sequence reversed without swapping the bases for their partners." },
        { t: "CGTT", why: "Correct. The complement of AACG is TTGC, and reversing it gives CGTT." }
      ],
      answer: 2,
      verify: {}
    },
    {
      q: "Using the toolkit function, what does this print?",
      code: {
        lang: "python",
        src: "codons = {\"ATG\": \"M\", \"GCC\": \"A\", \"AAA\": \"K\", \"TTT\": \"F\", \"GGG\": \"G\", \"TAA\": \"*\"}\n\ndef translate(seq):\n    protein = \"\"\n    for i in range(0, len(seq) - 2, 3):\n        aa = codons.get(seq[i:i + 3], \"X\")\n        if aa == \"*\":\n            break\n        protein = protein + aa\n    return protein\n\nprint(translate(\"ATGAAATAAGCC\"))"
      },
      options: [
        { t: "MK", why: "Correct. ATG gives M, AAA gives K, and TAA is a stop codon, so `break` ends the loop before GCC is read." },
        { t: "MK*A", why: "The function never adds the stop symbol, and it stops reading at the stop codon." },
        { t: "MKA", why: "`break` leaves the loop at TAA, so the codon after the stop is never translated." }
      ],
      answer: 0,
      verify: {}
    },
    {
      q: "You accidentally translate a gene starting from index 1 instead of index 0. What happens?",
      options: [
        { t: "The protein only loses its first amino acid", why: "Shifting by one base changes every codon boundary, not just the first codon. Losing exactly one amino acid would need a shift of three bases." },
        { t: "Every codon is read in a different reading frame, so the protein is completely different", why: "Correct. Codons are groups of three from a fixed start. Moving the start by one base regroups every base in the sequence." },
        { t: "Nothing changes, because the same bases are still read", why: "The bases are the same, but they are grouped differently, and the grouping decides which amino acid each codon means." }
      ],
      answer: 1
    }
  ],
  real: "Designing a reverse PCR primer requires the reverse complement of the target sequence, and checking that a cloned gene encodes the intended protein requires translation. GC content affects how strongly DNA strands stick together, which matters in PCR and sequencing. Biopython offers `Seq(\"ATGC\").reverse_complement()` and `.translate()`, which do the same jobs with the full genetic code and careful input checks.",
  teach: {
    prompt: "Explain to a friend how your toolkit computes a reverse complement and translates a gene, and how you tested it.",
    points: [
      "Each task is a small function",
      "A dictionary maps bases to partners and codons to amino acids",
      "Reverse complement means complement and reverse",
      "Translation steps through codons and stops at a stop codon",
      "Test on tiny inputs with known answers"
    ]
  }
});
