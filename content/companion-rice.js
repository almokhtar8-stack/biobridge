/* Companion topics for Rice: Python Programming Essentials.
   Item titles checked against the public course page on 8 November 2026. */
window.BB = window.BB || {};
BB.companion = BB.companion || [];
BB.companion.push(
  {
    id: 'rice-hello',
    course: 'rice',
    module: 'rice-m1',
    title: 'Your first program: Hello, world!',
    lectures: ['Hello, world!', 'Python Development Environments', 'Using CodeSkulptor3'],
    minutes: 3,
    keywords: ['print', 'Hello, world!', 'program', 'interpreter', 'CodeSkulptor3', 'run', 'output', 'string', 'quotes', 'development environment'],
    explain: 'A **program** is a list of instructions written as text. The **interpreter**, the program that runs Python, checks your code and then carries out its lines one by one, from top to bottom. `print("Hello, world!")` tells it to display the text between the quotes. Text in quotes is called a **string**. A **development environment** is where you write and run code: CodeSkulptor3 runs Python 3 inside a web page, Python installed on your own computer runs `.py` files, and BioBridge can run Python in your browser. Simple code like this gives the same result in each.',
    why: 'Every program, from a one-line calculation to an analysis of millions of DNA reads, follows the same cycle: write the code, run it, read the output. Knowing where your code runs tells you where to look for its results and its error messages.',
    visual: { diagram: 'run-program' },
    example: {
      lang: 'python',
      code: 'print("Hello, world!")\nprint("Gene:", "HSPA1A")\nprint(212 + 282)',
      output: 'Hello, world!\nGene: HSPA1A\n494',
      note: 'Each `print` shows one line. Text in quotes appears exactly as typed, and a comma between values adds a space. `212 + 282` has no quotes, so Python calculates it and shows 494.',
      run: true
    },
    try: {
      kind: 'python',
      task: 'Change the text inside the quotes, add a third `print` line of your own, and run the program again.',
      code: '# Change the text inside the quotes, then run again.\nprint("Hello, world!")\nprint("My favorite gene is", "TP53")'
    },
    mistake: { wrong: 'Typing `print(Hello)` without quotes and expecting to see the word Hello.', fix: 'Without quotes, Python reads `Hello` as the name of a variable. No variable has that name, so Python stops with a NameError. Put text inside matching quotes: `print("Hello")`.' },
    check: {
      q: 'A program has two lines: `print("7 * 6")` and then `print(7 * 6)`. What does it display?',
      options: [
        { t: '`42`, then `42`', why: 'Quotes stop Python from calculating. Everything inside them is text, so `print` shows the characters exactly as they were typed.' },
        { t: '`7 * 6`, then `42`', why: 'The quotes make the first value a string, which is shown exactly as typed. The second has no quotes, so Python calculates `7 * 6` and shows the result.' },
        { t: '`7 * 6`, then `7 * 6`', why: 'Only the first value is in quotes. The second is an expression, so Python works out its value, 42, before `print` displays it.' }
      ],
      answer: 1
    },
    deeper: ['f2-first-program', 'f0-computers']
  },
  {
    id: 'rice-numbers',
    course: 'rice',
    module: 'rice-m1',
    title: 'Numbers: whole numbers and decimals',
    lectures: ['Numbers'],
    minutes: 3,
    keywords: ['int', 'float', 'integer', 'decimal', 'division', '//', '%', 'remainder', 'modulo', 'floor division', '0.30000000000000004', 'type'],
    explain: 'Python has two main kinds of numbers. An **int** (integer) is a whole number, such as `212` or `-3`. A **float** (floating-point number) has a decimal point, such as `0.65`. Division with `/` always gives a float, even when it comes out even. `//` divides and rounds down to a whole number, and `%` gives the remainder: `7 // 2` is 3 and `7 % 2` is 1. Mixing an int and a float gives a float. Floats are stored with limited precision, so `0.1 + 0.2` shows `0.30000000000000004`.',
    why: 'Biological data has both kinds: read counts are whole numbers, while means, ratios and fractions are decimals. The rules explain outputs such as `2.0` and rounding tails, and `//` and `%` answer questions such as how many codons (3-base groups) fit in a sequence.',
    visual: { diagram: 'division' },
    example: {
      lang: 'python',
      code: 'print(38 / 3)\nprint(38 // 3)\nprint(38 % 3)\nprint(6 / 3)\nprint(type(38), type(6 / 3))',
      output: '12.666666666666666\n12\n2\n2.0\n<class \'int\'> <class \'float\'>',
      note: 'A 38-base sequence holds 12 full codons (`38 // 3`) with 2 bases left over (`38 % 3`). `/` gives a float even when the division is exact, so `6 / 3` is `2.0`.',
      run: true
    },
    try: {
      kind: 'python',
      task: 'Predict each line for a 100-base sequence, then run the program to check your predictions.',
      code: '# How many full codons fit in 100 bases, and how many bases are left?\nprint(100 // 3, "full codons")\nprint(100 % 3, "left over")\nprint(100 / 3)\nprint(0.1 + 0.2)'
    },
    mistake: { wrong: 'Reading `%` as "percent", so that `50 % 10` should mean 50 percent of 10.', fix: 'In Python, `%` is the remainder (modulo) operator. `50 % 10` is 0, because 10 fits into 50 with nothing left over. For 50 percent of 10, write `50 / 100 * 10`.' },
    check: {
      q: 'A read is 50 bases long. What does `print(50 // 3, 50 % 3)` display?',
      options: [
        { t: '`16.666666666666668 2`', why: 'That first number is `50 / 3`, ordinary division. `//` rounds down to a whole number, so it gives 16 with no decimal part.' },
        { t: '`17 2`', why: '`//` always rounds down, never to the nearest whole number. Seventeen codons would need 51 bases, one more than the read has.' },
        { t: '`16 2`', why: '3 fits into 50 sixteen whole times, using 48 bases, so `//` gives 16. The 2 bases left over are the remainder, which `%` gives.' },
        { t: '`16 0.67`', why: '`%` gives the remainder as a whole amount left over, here 2 bases. It does not give the decimal part of the division.' }
      ],
      answer: 2
    },
    deeper: ['f2-first-program', 'f2-types']
  },
  {
    id: 'rice-expressions',
    course: 'rice',
    module: 'rice-m1',
    title: 'Simple and compound expressions',
    lectures: ['Simple Expressions', 'Compound Expressions', 'Practice Exercise for Expressions'],
    minutes: 3,
    keywords: ['expression', 'operator', 'precedence', 'order of operations', 'parentheses', '**', 'power', 'compound expression', 'PEMDAS', 'BODMAS'],
    explain: 'An **expression** is code that Python works out to a single value. A simple expression has one operator, as in `212 + 282`. A compound expression combines several, as in `2 + 3 * 4 ** 2`. Python follows **precedence** rules, not reading order. Parentheses come first, then `**` (power), then `*`, `/`, `//` and `%`, then `+` and `-`. Operators of equal rank run left to right, except `**`, which runs right to left. So `2 + 3 * 4 ** 2` becomes `2 + 3 * 16`, then `2 + 48`, which is 50.',
    why: 'Formulas in biology, such as a mean or a ratio between two conditions, are compound expressions. If Python\'s order differs from the order you meant, you still get a number, just the wrong one, and no error message warns you. Parentheses make your meaning certain.',
    visual: { diagram: 'precedence' },
    example: {
      lang: 'python',
      code: 'print(2 + 3 * 4 ** 2)\nprint((2 + 3) * 4 ** 2)\nprint((212 + 282 + 203) / 3)\nprint(10 - 4 - 3)',
      output: '50\n80\n232.33333333333334\n3',
      note: 'Line 1 runs the power, then the multiplication, then the addition. Parentheses change the order in line 2 and make line 3 a true mean. In line 4, equal operators run left to right: `(10 - 4) - 3`.',
      run: true
    },
    try: { kind: 'trace', program: 'calc-precedence' },
    mistake: { wrong: 'Writing a power with `^`, as on a calculator or in a spreadsheet: `2 ^ 3`.', fix: 'Python writes powers as `**`, so `2 ** 3` is 8. `^` is a different operator that works on binary digits, so `2 ^ 3` quietly gives 1 instead of an error.' },
    check: {
      q: 'What does `print(1 + 2 * 3 ** 2)` display?',
      options: [
        { t: '`81`', why: 'That is `((1 + 2) * 3) ** 2`, from working strictly left to right. Python follows precedence instead: `**` first, then `*`, then `+`.' },
        { t: '`37`', why: 'That multiplies before the power: `1 + (2 * 3) ** 2`. But `**` has higher precedence than `*`, so `3 ** 2` is worked out first.' },
        { t: '`27`', why: 'That adds first: `(1 + 2) * 9`. Addition has the lowest precedence of the three operators here, so it runs last.' },
        { t: '`19`', why: 'Power runs first (`3 ** 2` is 9), then multiplication (`2 * 9` is 18), then addition (`1 + 18` is 19).' }
      ],
      answer: 3
    },
    deeper: ['f2-first-program']
  },
  {
    id: 'rice-variables',
    course: 'rice',
    module: 'rice-m1',
    title: 'Variables and assignment',
    lectures: ['Variables and Assignment', 'Practice Exercises for Variables and Assignments'],
    minutes: 3,
    keywords: ['variable', 'assignment', '=', 'name', 'reassign', 'update', 'x = x + 1', 'variable names', 'NameError'],
    explain: 'A **variable** is a name that refers to a value. `count = 212` is an **assignment**: Python first works out the value on the right, then attaches the name on the left to it. So `=` means "assign", not "is equal to". You can give a name a new value at any time, and the old value is forgotten. `total = total + 212` reads the current value of `total`, adds 212 and stores the result under the same name. After `y = x`, both names refer to the same value, but giving `x` a new value later does not change `y`.',
    why: 'Names make calculations readable and easy to change: `ctrl_mean` and `heat_mean` say what they hold, and a threshold stored once in `min_count` can be changed in one place. Reading any program is mostly keeping track of what each name holds at each moment.',
    visual: { diagram: 'py-variables' },
    example: {
      lang: 'python',
      code: 'total = 0\ntotal = total + 212\ntotal = total + 282\ntotal = total + 203\nprint(total)\nmean = total / 3\nprint(mean)',
      output: '697\n232.33333333333334',
      note: 'Each update reads the current `total`, adds one control count and stores the result back: 0, then 212, 494 and 697. The name stays the same while its value changes.',
      run: true
    },
    try: { kind: 'trace', program: 'var-update' },
    mistake: { wrong: 'Choosing a name with a space or a leading digit, such as `read count = 212` or `1st_sample = "ctrl_1"`.', fix: 'Names may contain letters, digits and underscores, but no spaces, and they cannot start with a digit. Python rejects both lines with a SyntaxError. Write `read_count` and `sample_1` instead.' },
    check: {
      q: 'A program runs `ctrl = 200`, then `fold = 1000 / ctrl`, then `ctrl = 400`. What is the value of `fold` now?',
      options: [
        { t: '`2.5`', why: 'That treats `fold` as a formula that updates like a spreadsheet cell. Python calculated `fold` once and stored the number; it keeps no link to `ctrl`.' },
        { t: '`5.0`', why: '`fold` was calculated when `ctrl` was 200, so it holds 1000 / 200, which is 5.0. Giving `ctrl` a new value later does not recalculate it.' },
        { t: 'An error, because `ctrl` was assigned twice', why: 'A name can be reassigned as often as you like. Each assignment simply makes the name refer to a new value.' }
      ],
      answer: 1
    },
    deeper: ['f2-variables']
  },
  {
    id: 'rice-errors',
    course: 'rice',
    module: 'rice-m1',
    title: 'Reading Python error messages',
    lectures: ['Handling Errors in Python', 'A Short Guide to Common Errors in Python'],
    minutes: 3,
    keywords: ['error', 'traceback', 'NameError', 'SyntaxError', 'TypeError', 'is not defined', 'ZeroDivisionError', 'bug', 'debugging', 'error message'],
    explain: 'When Python cannot carry out a line, it stops and prints an **error message**, also called a **traceback**. Read it from the bottom. The last line names the **error type** and describes the problem, for example `NameError: name \'totl\' is not defined`. Just above it, Python shows the line number and the code where it noticed the problem. Common types are **SyntaxError** (broken grammar, such as a missing colon or quote), **NameError** (a name that was never assigned, often a typo), **TypeError** (the wrong kind of value, such as adding text to a number) and **ZeroDivisionError** (dividing by zero).',
    why: 'Errors are normal, for beginners and experts alike. The message usually says what went wrong and where, so reading it carefully is much faster than guessing. Python packages used in bioinformatics, such as pandas, report their errors in exactly the same format.',
    visual: { diagram: 'traceback' },
    example: {
      lang: 'text',
      code: 'total = 212 + 282 + 203\nmean = totl / 3\nprint(mean)',
      output: 'Traceback (most recent call last):\n  File "/home/student/project/mean.py", line 2, in <module>\n    mean = totl / 3\n           ^^^^\nNameError: name \'totl\' is not defined. Did you mean: \'total\'?',
      note: 'Recent standard Python prints this when the program is saved as mean.py. Read the bottom line first: `totl` is a typo for `total`. Line 2 and the `^` marks show where. Other environments use a different layout.'
    },
    try: {
      kind: 'python',
      expectError: true,
      task: 'Run the program, read the last line of the error message, then fix the line it points to so that the program prints `Full codons: 12`.',
      code: '# This should print how many full codons fit in 38 bases.\nseq_length = 38\ncodons = seq_length // 3\nprint("Full codons: " + codons)'
    },
    mistake: { wrong: 'Believing the bug is always on the line the error message points to.', fix: 'That is where Python noticed the problem; the cause can be earlier. If line 1 accidentally says `totl = 494`, then line 2, `print(total)`, raises the NameError, but the fix belongs on line 1.' },
    check: {
      q: 'A program starts with `print("start")`, but running it shows only an error message, never `start`. Which error type is the likely cause?',
      options: [
        { t: 'A NameError on a later line', why: 'A NameError happens only when Python reaches the line with the unknown name. Line 1 would already have run and printed `start`.' },
        { t: 'A TypeError on a later line', why: 'A TypeError happens when the failing line runs. Every line before it runs normally, so `start` would appear above the message.' },
        { t: 'A SyntaxError somewhere in the file', why: 'Python checks the grammar of the whole file before running any line. A SyntaxError anywhere stops the program before `start` can be printed.' }
      ],
      answer: 2
    },
    deeper: ['f2-debug', 'f2-variables']
  },
  {
    id: 'rice-calling',
    course: 'rice',
    module: 'rice-m2',
    title: 'What a function is, and calling one',
    lectures: ['What is a Function?', 'Calling Functions'],
    minutes: 3,
    keywords: ['function', 'call', 'argument', 'return value', 'parentheses', 'len', 'max', 'round', 'built-in function', 'input'],
    explain: 'A **function** is a named piece of code that does one job. You give it inputs, it runs, and it hands back a result, called its **return value**. To **call** a function, write its name and then parentheses containing the inputs, called **arguments**, separated by commas: `len("GATTACA")`, `max(212, 282, 203)`, `round(232.333, 1)`. Python runs the function and replaces the whole call with the value it returned, so `len("GATTACA") + 1` becomes `7 + 1`. Calls can sit inside other calls: in `abs(min(3, -8))`, the inner call runs first.',
    why: 'Python and its modules provide hundreds of ready-made functions, and bioinformatics libraries are mostly large collections of functions. Calling one correctly, with the right name and the right arguments in the right order, is the first step to using any of them.',
    visual: { diagram: 'py-function' },
    example: {
      lang: 'python',
      code: 'seq = "ATGGCCAAATTTGGG"\nprint(len(seq))\nprint(len(seq) // 3)\nprint(max(212, 282, 203))\nprint(round(232.33333, 1))',
      output: '15\n5\n282\n232.3',
      note: '`len(seq)` is replaced by 15, the number of letters, so `len(seq) // 3` becomes `15 // 3`: five codons. `max` returns its largest argument, and `round` keeps one decimal place.',
      run: true
    },
    try: {
      kind: 'python',
      task: 'Predict what each call returns, run the program, then change the arguments and predict again.',
      code: 'dna = "ACGTACGTAA"\nprint(len(dna))\nprint(min(813, 1035, 1100))\nprint(round(10099.0 / 232.3, 2))\nprint(abs(-5))\nprint(max(3, 7) + min(3, 7))'
    },
    mistake: { wrong: 'Leaving out the parentheses, as in `n = len`, and expecting a number.', fix: 'Without parentheses the function is not called: `n` becomes the function itself, and printing it shows a description of the function, not a number. Write `n = len(seq)` to run it.' },
    check: {
      q: 'What does `print(max(4, 9) + len("ACG"))` display?',
      options: [
        { t: '`16`', why: 'That adds every number in sight: 4 + 9 + 3. `max` returns only its largest argument, 9, not the sum of its arguments.' },
        { t: '`12`', why: '`max(4, 9)` is replaced by 9 and `len("ACG")` by 3, the number of characters. Then 9 + 3 is 12.' },
        { t: '`10`', why: 'That counts the string as a single item. `len` counts the characters inside it, so `"ACG"` has length 3.' },
        { t: 'An error, because results of two functions cannot be added', why: 'Each call is replaced by its value, so this is just 9 + 3. A call can be used anywhere a value of that type can.' }
      ],
      answer: 1
    },
    deeper: ['f2-functions']
  },
  {
    id: 'rice-defining',
    course: 'rice',
    module: 'rice-m2',
    title: 'Defining your own functions',
    lectures: ['Defining Functions', 'Functions'],
    minutes: 3,
    keywords: ['def', 'define', 'parameter', 'argument', 'return', 'indentation', 'colon', 'function body', 'function definition', 'IndentationError'],
    explain: 'You create your own function with `def`. The first line holds the keyword `def`, the function\'s name, its **parameters** in parentheses and a colon. Parameters are names for the inputs. The **body** below is indented, usually by 4 spaces, and `return` ends the function and hands a value back. Defining a function only stores it; the body runs each time the function is called. In `gc_percent(9, 12)`, the arguments 9 and 12 are assigned to the parameters in order, the body runs, and the call is replaced by the returned value.',
    why: 'A function lets you name a calculation, test it once on small inputs, and reuse it for every sample or gene. If you find a bug, you fix it in one place. Programs built from small, tested functions are easier to read and to trust.',
    visual: { diagram: 'def-anatomy' },
    example: {
      lang: 'python',
      code: 'def gc_percent(gc_bases, length):\n    return gc_bases / length * 100\n\nprint(gc_percent(9, 12))\nprint(gc_percent(5, 20))',
      output: '75.0\n25.0',
      note: 'Nothing runs until the calls. In the first call `gc_bases` is 9 and `length` is 12: a 12-base sequence with 9 G or C bases is 75 percent GC. The second call reuses the code with new arguments.',
      run: true
    },
    try: {
      kind: 'python',
      task: 'Run the program, then define a second function, `full_codons(length)`, that returns `length // 3`, and print `full_codons(38)`.',
      code: 'def gc_percent(gc_bases, length):\n    return gc_bases / length * 100\n\nprint(gc_percent(9, 12))\n\n# Your turn: define full_codons(length) below.\n# It should return length // 3. Then print full_codons(38).'
    },
    mistake: { wrong: 'Forgetting the colon at the end of the `def` line, or not indenting the body.', fix: 'The colon and the indentation tell Python where the body starts and which lines belong to it. Without them, Python stops with a SyntaxError or an IndentationError before running anything.' },
    check: {
      q: 'A program defines a function with `def` but never calls it. When does the function\'s body run?',
      options: [
        { t: 'Once, when Python reaches the `def` line', why: 'At the `def` line Python stores the function without running its body. That is why defining a function alone prints nothing.' },
        { t: 'Once, automatically, at the end of the program', why: 'Python never calls your functions for you. If no line calls the function, its body never runs.' },
        { t: 'Never: the body runs only when the function is called', why: '`def` creates the function and gives it a name. Python skips the body until some line calls the function by name with parentheses.' }
      ],
      answer: 2
    },
    deeper: ['f2-functions']
  },
  {
    id: 'rice-local',
    course: 'rice',
    module: 'rice-m2',
    title: 'Local variables and how a call runs',
    lectures: ['Local Variables', 'Understanding Function Evaluation'],
    minutes: 3,
    keywords: ['local variable', 'global variable', 'scope', 'frame', 'function call', 'parameter', 'NameError', 'function evaluation'],
    explain: 'Each time you call a function, Python creates a fresh workspace for that call, called a **frame**. It assigns the arguments to the parameters there, then runs the body. Any name assigned inside the body is **local**: it belongs to that frame only. When the function returns its value, the frame is removed, together with its local variables. Names assigned outside every function are **global**. A function can read a global name, but assigning to a name inside a function creates a separate local one, even if a global has the same name.',
    why: 'Local variables keep functions independent: each call starts fresh, and its result depends only on its arguments. Knowing that local names vanish when the call ends explains a common NameError, and picturing frames is how you predict what a program with functions will do.',
    visual: { diagram: 'call-frames' },
    example: {
      lang: 'python',
      code: 'total = 0\n\ndef mean3(a, b, c):\n    total = a + b + c\n    return total / 3\n\nctrl = mean3(212, 282, 203)\nprint(ctrl)\nprint(total)',
      output: '232.33333333333334\n0',
      note: 'Inside the call, a local `total` held 697. It vanished when the call ended, so the global `total` printed on the last line is still 0.',
      run: true
    },
    try: { kind: 'trace', program: 'func-mean3' },
    mistake: { wrong: 'Using a function\'s local variable after the call, such as `print(total)` after `mean3(212, 282, 203)` when no global `total` exists.', fix: 'The local `total` was removed when the call ended, so Python raises a NameError. Keep the result by storing the return value: `ctrl = mean3(212, 282, 203)`, then `print(ctrl)`.' },
    check: {
      q: 'A function body runs `result = n * 2` and `return result`. After a call, the main program runs `print(result)`; no global `result` exists. What happens?',
      options: [
        { t: 'Python stops with a NameError', why: '`result` was local to the call and was removed with its frame. Outside the function, no variable called `result` exists.' },
        { t: 'It prints the value from the last call', why: 'The value was returned, but the name `result` stayed inside the function. Store the returned value in a variable to keep it.' },
        { t: 'It prints 0, the starting value of every variable', why: 'Python gives variables no automatic starting value. A name that was never assigned where you use it is simply unknown.' }
      ],
      answer: 0
    },
    deeper: ['f2-functions', 'f2-read-code']
  },
  {
    id: 'rice-print-return',
    course: 'rice',
    module: 'rice-m2',
    title: 'print versus return',
    lectures: ['Using Print and Return in Functions'],
    minutes: 3,
    keywords: ['print', 'return', 'None', 'return value', 'NoneType', 'output', 'function result', 'print vs return'],
    explain: '`print` and `return` can both seem to "give the answer", but they do different jobs. `print(value)` displays the value on the screen for a person to read; the program cannot use what was printed. `return value` ends the function and hands the value back to the line that called it, where it can be stored, compared or used in more calculations. A function that ends without `return` gives back `None`, Python\'s special value meaning "nothing". A function can do both, but printing is not returning.',
    why: 'Most functions should `return` their result so that other code can use it. A function that only prints a GC percentage cannot be used to sort or filter sequences. Mixing the two up is behind many puzzling outputs of `None` and errors that mention NoneType.',
    visual: { diagram: 'print-return' },
    example: {
      lang: 'python',
      code: 'def show_double(x):\n    print(x * 2)\n\ndef get_double(x):\n    return x * 2\n\na = show_double(21)\nb = get_double(21)\nprint(a, b)',
      output: '42\nNone 42',
      note: 'Calling `show_double` prints 42 at once but hands back nothing, so `a` is None. `get_double` prints nothing; it returns 42, which is stored in `b`.',
      run: true
    },
    try: { kind: 'trace', program: 'func-return-print' },
    mistake: { wrong: 'Doing arithmetic with a function that only prints, as in `show_double(21) + 1`.', fix: 'The call prints 42 but returns None, and None cannot be added to a number, so Python stops with a TypeError. Change `print(x * 2)` to `return x * 2`.' },
    check: {
      q: 'A function `f(x)` has one line in its body: `print(x + 1)`. What does `y = f(4)` store in `y`?',
      options: [
        { t: '`5`', why: 'Five is shown on the screen, but showing is not handing back. Only `return` sends a value to the line that made the call.' },
        { t: '`None`', why: 'The call prints 5, but the function has no `return`, so it hands back None, and that is what `y` stores.' },
        { t: '`4`', why: 'The argument 4 goes into the function as `x`; it is not sent back. The caller receives only what `return` sends.' }
      ],
      answer: 1
    },
    deeper: ['f2-functions']
  },
  {
    id: 'rice-boolean',
    course: 'rice',
    module: 'rice-m3',
    title: 'Boolean logic: and, or, not',
    lectures: ['Boolean Logic', 'Logical Expressions'],
    minutes: 3,
    keywords: ['Boolean', 'True', 'False', 'and', 'or', 'not', 'logical operator', 'truth table', 'logical expression'],
    explain: 'A **Boolean** is a value that is either `True` or `False`, written with a capital first letter. Logical operators combine Booleans into a **logical expression**. `a and b` is True only when both sides are True. `a or b` is True when at least one side is True. `not a` turns True into False and False into True. When they are mixed, Python applies `not` first, then `and`, then `or`, so `True or True and False` means `True or (True and False)`, which is True. Add parentheses whenever you mix `and` with `or`.',
    why: 'Quality checks and filters are logical expressions: a sample passes if it has enough reads **and** enough of them match the genome; a gene is interesting if it goes strongly up **or** strongly down. Swapping `and` for `or` keeps or drops the wrong data, with no error message.',
    visual: { diagram: 'truth-table' },
    example: {
      lang: 'python',
      code: 'enough_reads = True\nwell_mapped = False\nprint(enough_reads and well_mapped)\nprint(enough_reads or well_mapped)\nprint(not well_mapped)\nprint(True or True and False)',
      output: 'False\nTrue\nTrue\nTrue',
      note: 'One False side makes `and` False, while `or` needs only one True side. In the last line `and` runs first: True and False is False, then True or False is True.',
      run: true
    },
    try: { kind: 'trace', program: 'logic-qc' },
    mistake: { wrong: 'Writing `true` and `false` in lowercase, as some other languages do.', fix: 'Python\'s Boolean values are `True` and `False`, with capital letters. Lowercase `true` is read as an unknown name, so Python stops with a NameError.' },
    check: {
      q: 'A sample passes only if both checks pass. With `deep = True` and `mapped = False`, which expression correctly decides whether it passes?',
      options: [
        { t: '`deep or mapped`', why: '`or` is True when at least one side is True, so this sample would pass with only one good check. The rule needs both.' },
        { t: '`not (deep and mapped)`', why: 'This flips the correct answer: it is True exactly when the sample fails. It is useful for flagging failures, not for deciding a pass.' },
        { t: '`deep and mapped`', why: '`and` is True only when both sides are True. The failed mapping check makes the result False, so the sample correctly does not pass.' }
      ],
      answer: 2
    },
    deeper: ['f2-logic']
  },
  {
    id: 'rice-comparisons',
    course: 'rice',
    module: 'rice-m3',
    title: 'Comparisons',
    lectures: ['Comparisons'],
    minutes: 3,
    keywords: ['comparison', '==', '!=', '<', '>', '<=', '>=', 'equal', 'not equal', '= versus ==', 'compare strings', 'chained comparison'],
    explain: 'A **comparison** asks a yes-or-no question about two values and gives a Boolean: `212 > 100` is `True`. The operators are `==` (equal), `!=` (not equal), `<` (less than), `>` (greater than), `<=` (at most) and `>=` (at least). Note the double equals: `=` assigns a value to a name, while `==` compares two values and changes nothing. Strings are compared exactly, so `"heat_shock" == "Heat_shock"` is False, because upper and lower case differ. Python also allows chains: `10 <= count <= 100` means `10 <= count and count <= 100`.',
    why: 'Every filter is built from comparisons: keep genes with at least 10 reads, select samples whose condition equals `"heat_shock"`, flag reads shorter than 30 bases. A comparison turns each of these questions into True or False, which `if` statements and filters can then act on.',
    visual: { diagram: 'comparisons' },
    example: {
      lang: 'python',
      code: 'count = 212\nprint(count >= 10)\nprint(count == 212, count != 212)\nprint("heat_shock" == "Heat_shock")\nprint(10 <= count <= 100)\nprint(2 == 2.0)',
      output: 'True\nTrue False\nFalse\nFalse\nTrue',
      note: '`==` asks a question and leaves `count` unchanged. The two strings differ in one capital letter, which is enough. 212 is above 100, so the chain is False. An int and a float with the same value are equal.',
      run: true
    },
    try: {
      kind: 'python',
      task: 'Change `count` and `condition`, predict each line, then run the program to check.',
      code: 'count = 999\ncondition = "heat_shock"\nprint(count >= 10)\nprint(condition == "control")\nprint(condition != "control")\nprint(0 < count <= 1000)'
    },
    mistake: { wrong: 'Comparing text read from a file with a number, as in `"212" > 100`.', fix: 'A string and a number cannot be put in order, so Python raises a TypeError, and `"212" == 212` is simply False. Convert first: `int("212") > 100` is True.' },
    check: {
      q: 'Which line asks whether `condition` holds the text `heat_shock`, without changing `condition`?',
      options: [
        { t: '`condition == "heat_shock"`', why: '`==` compares the two values and gives True or False. The variable keeps the value it already had.' },
        { t: '`condition = "heat_shock"`', why: 'A single `=` is assignment. It stores the text in `condition`, replacing the old value, instead of asking a question.' },
        { t: '`condition === "heat_shock"`', why: 'Triple equals is used in JavaScript, not in Python. Python rejects `===` with a SyntaxError.' }
      ],
      answer: 0
    },
    deeper: ['f2-logic']
  },
  {
    id: 'rice-conditionals',
    course: 'rice',
    module: 'rice-m3',
    title: 'if, elif and else',
    lectures: ['Conditionals', 'More Conditionals', 'Conditionals in Python'],
    minutes: 3,
    keywords: ['if', 'elif', 'else', 'conditional', 'if statement', 'branch', 'indentation', 'colon', 'condition'],
    explain: 'An `if` statement runs a block of code only when its condition is True. The `if` line ends with a colon, and the block below it is indented. `elif` (short for "else if") adds another condition, which is checked only if every condition above it was False. `else` runs when none of the conditions were True. Python checks the conditions from top to bottom and runs **only the first block whose condition is True**, then skips the rest of the chain. The first line back at the outer indentation runs in every case.',
    why: 'Conditionals let a program treat data differently: label a gene as up, down or unchanged, or flag a sample with too few reads. Any rule of the form "if this, do that, otherwise..." becomes an if, elif and else chain.',
    visual: { diagram: 'if-flow' },
    example: {
      lang: 'python',
      code: 'fold = 0.4\nif fold >= 2:\n    label = "up"\nelif fold <= 0.5:\n    label = "down"\nelse:\n    label = "unchanged"\nprint(label)',
      output: 'down',
      note: 'The first test is False (0.4 is below 2), so Python checks the `elif`, which is True. `label` becomes "down" and the `else` block is skipped. The last line is not indented, so it always runs.',
      run: true
    },
    try: { kind: 'trace', program: 'cond-depth' },
    mistake: { wrong: 'Putting a broad test first: `if fold > 1:` followed by `elif fold > 2:`.', fix: 'Python stops at the first True condition, so a fold of 5 is caught by `fold > 1`, and the `fold > 2` branch can never run. Put the strictest test first.' },
    check: {
      q: 'With `reads = 12`, the chain is: `if reads > 20:` print `A`, `elif reads > 10:` print `B`, `elif reads > 5:` print `C`, `else:` print `D`. What is printed?',
      options: [
        { t: '`B`, then `C`', why: '12 > 5 is also True, but only one block of a chain runs: the first one whose condition is True.' },
        { t: '`B`', why: '12 > 20 is False, so Python checks the next test. 12 > 10 is True, so B is printed and the rest of the chain is skipped.' },
        { t: '`C`', why: 'Python does not search for the closest or best match. It takes the first True condition from the top, which is `reads > 10`.' }
      ],
      answer: 1
    },
    deeper: ['f2-conditionals']
  },
  {
    id: 'rice-style',
    course: 'rice',
    module: 'rice-m3',
    title: 'Python documentation and coding style',
    lectures: ['Using Python Documentation', 'Following Coding Standards', 'Coding Standards and Style'],
    minutes: 3,
    keywords: ['style', 'PEP 8', 'coding standards', 'documentation', 'docstring', 'help', 'comments', 'naming', 'indentation', 'docs.python.org'],
    explain: 'Code is read far more often than it is written, so style matters. **PEP 8**, the widely used style guide for Python, asks for 4 spaces per indentation level, lowercase names with underscores (`read_count`), spaces around `=` in assignments, and lines of at most 79 characters. Good comments, which start with `#`, explain why the code does something. A **docstring** is a string on the first line of a function body that says what the function does. The official documentation at docs.python.org describes every built-in function and standard module, and in standard Python `help(name)` prints a function\'s documentation.',
    why: 'Clear names, a consistent layout and docstrings let you, your teammates and your future self read code quickly and spot mistakes. The documentation answers questions such as "which arguments does `round` take?" faster and more reliably than guessing.',
    visual: { diagram: 'style-compare' },
    example: {
      lang: 'python',
      code: 'def gc_percent(gc_bases, length):\n    """Return the percentage of bases that are G or C."""\n    return gc_bases / length * 100\n\n\nprint(gc_percent(9, 12))\nhelp(gc_percent)',
      output: '75.0\nHelp on function gc_percent in module __main__:\n\ngc_percent(gc_bases, length)\n    Return the percentage of bases that are G or C.',
      note: 'Descriptive names, 4-space indentation and a docstring make the purpose clear. `help` prints the name, the parameters and the docstring; `__main__` means the function was defined in this program.',
      run: true
    },
    try: {
      kind: 'python',
      task: 'This code works but breaks several style rules. Rewrite it with clear names, 4-space indentation, spaces around `=` and a docstring, and check that it still prints 75.0.',
      code: 'def F(A,B):\n  X=A/B*100\n  return X\nprint(F(9,12))'
    },
    mistake: { wrong: 'Thinking that style does not matter as long as the code runs.', fix: 'Python runs messy code without complaint, but people must read it, including you a month later. Unclear names and an uneven layout hide bugs.' },
    check: {
      q: 'Two functions give identical results: `def F(A,B):` with 2-space indents, and `def gc_percent(gc_bases, length):` with 4-space indents and a docstring. Why prefer the second?',
      options: [
        { t: 'It runs faster', why: 'Names, indentation width and docstrings make no practical difference to speed. Style exists for the people who read code, not for the computer.' },
        { t: 'Python refuses to run code that breaks PEP 8', why: 'Python enforces its grammar and consistent indentation, not PEP 8. The first version runs fine; it is just harder to read and check.' },
        { t: 'Readers can see what it does and check it, so mistakes are easier to find', why: 'Descriptive names, standard indentation and a docstring tell the reader what the code means. Code is read far more often than it is written.' }
      ],
      answer: 2
    },
    deeper: ['f2-functions', 'f2-read-code']
  },
  {
    id: 'rice-modules',
    course: 'rice',
    module: 'rice-m4',
    title: 'Modules: import and use',
    lectures: ['Python Modules'],
    minutes: 3,
    keywords: ['module', 'import', 'from import', 'math', 'standard library', 'dot notation', 'math.sqrt', 'library', 'package'],
    explain: 'A **module** is a file of Python code, such as functions and values, that other programs can reuse. Python\'s **standard library** comes with many modules, including `math`, `random` and `datetime`. `import math` makes the module available, and you reach inside it with a dot: `math.sqrt(16)` or `math.pi`. `from datetime import date` imports one name directly, so you can write `date(2026, 3, 2)` without a prefix. Put imports at the top of your program. Your own `.py` files can be imported as modules too.',
    why: 'Modules let you use tested code instead of writing everything yourself: square roots, logarithms for fold changes, random sampling, calendar arithmetic. Bioinformatics relies on modules too: pandas and NumPy, which the KAUST course uses, are imported the same way.',
    visual: { diagram: 'py-modules' },
    example: {
      lang: 'python',
      code: 'import math\nfrom datetime import date\n\nprint(math.sqrt(16))\nprint(math.log2(8))\nprint(round(math.pi, 4))\nprint(date(2026, 3, 2))',
      output: '4.0\n3.0\n3.1416\n2026-03-02',
      note: 'After `import math`, its functions are reached with `math.` in front. `math.log2(8)` is 3.0: an 8-fold change is three doublings. `date` was imported by name, so it needs no prefix.',
      run: true
    },
    try: {
      kind: 'python',
      task: 'Run the program, then delete `math.` from the `sqrt` line and run it again to see which error a missing prefix causes.',
      code: 'import math\n\nprint(math.sqrt(2))\nprint(math.log2(43.5))\n# floor rounds down and ceil rounds up to a whole number\nprint(math.floor(7.9), math.ceil(7.1))'
    },
    mistake: { wrong: 'Calling `sqrt(16)` directly after `import math`, expecting the function to be available on its own.', fix: '`import math` adds only the name `math`, so a bare `sqrt` raises a NameError. Write `math.sqrt(16)`, or import the function itself with `from math import sqrt`.' },
    check: {
      q: 'After `from math import log2`, which call works?',
      options: [
        { t: '`math.log2(8)`', why: 'This form needs `import math`. The `from` import added only the name `log2`, not `math`, so Python raises a NameError.' },
        { t: '`log2.math(8)`', why: 'The dot leads from a module to something inside it, never the reverse. `log2` is a function and has nothing called `math` inside.' },
        { t: '`import log2(8)`', why: '`import` loads modules; it cannot call a function. Import on one line, then call the function on another.' },
        { t: '`log2(8)`', why: '`from math import log2` brings the function\'s own name into your program, so you can call it directly without a prefix.' }
      ],
      answer: 3
    },
    deeper: ['f2-modules']
  },
  {
    id: 'rice-datetime',
    course: 'rice',
    module: 'rice-m4',
    title: 'The datetime module',
    lectures: ['The Datetime Module', 'Datetime Module Quick Reference'],
    minutes: 3,
    keywords: ['datetime', 'date', 'timedelta', 'days', 'date arithmetic', 'subtract dates', 'datetime.date', 'leap year', 'calendar'],
    explain: 'The `datetime` module does calendar arithmetic correctly, including month lengths and leap years. `datetime.date(2026, 6, 24)` creates a **date** object from a year, a month and a day, always in that order. Subtracting one date from another gives a **timedelta**, a length of time, and its `.days` attribute (a value stored inside it) is that length in whole days. Adding a timedelta to a date gives a new date: `datetime.timedelta(days=30)` is 30 days. When printed, a date appears as year-month-day, such as `2026-06-24`.',
    why: 'Biological projects are full of dates: when a sample was collected, frozen, sequenced or analyzed. Counting days by hand goes wrong at month ends and in leap years. The module does the calendar work for you, and it is well tested.',
    visual: { diagram: 'date-math' },
    example: {
      lang: 'python',
      code: 'import datetime\n\nfrozen = datetime.date(2026, 6, 24)\nthawed = datetime.date(2026, 7, 3)\nstored = thawed - frozen\nprint(stored)\nprint(stored.days)\nprint(frozen + datetime.timedelta(days=30))',
      output: '9 days, 0:00:00\n9\n2026-07-24',
      note: 'A sample frozen on 24 June and thawed on 3 July was stored for 9 days. The difference is a timedelta, which prints with a time part; `.days` gives the plain number. Adding 30 days crosses into July correctly.',
      run: true
    },
    try: { kind: 'trace', program: 'module-dates' },
    mistake: { wrong: 'Writing the day first, as on many calendars: `datetime.date(24, 6, 2026)`.', fix: 'The order is always year, month, day: `datetime.date(2026, 6, 24)`. With the day first, Python reads 2026 as the day, which no month has, and raises a ValueError.' },
    check: {
      q: 'What do you get when you subtract one `datetime.date` from another, as in `thawed - frozen`?',
      options: [
        { t: 'A new date', why: 'A date is a point on the calendar, and the gap between two points is a duration. Date plus timedelta is what gives a date.' },
        { t: 'A timedelta: a length of time, whose `.days` is the number of days', why: 'Date minus date is a duration, not a calendar day. Python stores it as a timedelta, and its `.days` attribute holds the whole number of days.' },
        { t: 'An int, the number of days', why: 'The result is a timedelta, which prints as `9 days, 0:00:00`. Use its `.days` attribute when you need the plain int.' },
        { t: 'An error, because dates cannot be subtracted', why: 'The datetime module defines subtraction for dates. Doing date arithmetic correctly is one of the main reasons to use it.' }
      ],
      answer: 1
    },
    deeper: ['f2-modules']
  },
  {
    id: 'rice-random-mod',
    course: 'rice',
    module: 'rice-m4',
    title: 'Random choices and wrapping around with %',
    lectures: ['Python Modules', 'Tips for RPSLS'],
    minutes: 3,
    keywords: ['random', 'random.choice', 'random.randrange', 'random.seed', 'randint', 'modulo', '%', 'remainder', 'wrap around'],
    explain: 'The `random` module makes random choices. `random.randrange(0, 7)` returns a random whole number from 0 up to, but not including, 7. `random.choice("ACGT")` picks one item at random, here a DNA base. Each run can give a different result; calling `random.seed(7)` first makes the results repeatable. The remainder operator `%` makes numbers wrap around, like a clock. Number the days 0 (Monday) to 6 (Sunday): the day `n` days after `day` is `(day + n) % 7`.',
    why: 'Random choices drive games, simulations and sampling, such as picking a random sample of reads to test an analysis. Wrapping with `%` appears whenever positions repeat in a cycle: days of the week, hours on a clock, or a base\'s position inside its codon (`position % 3`).',
    visual: { diagram: 'modulo-wheel' },
    example: {
      lang: 'python',
      code: 'import random\n\nday = 5\nprint((day + 3) % 7)\nprint((day + 14) % 7)\nrandom.seed(7)\nprint(random.choice("ACGT"), random.randrange(0, 7))',
      output: '1\n5\nG 1',
      note: 'Three days after Saturday (5) is Tuesday (1); fourteen days after it is Saturday again. `random.seed(7)` makes the last line the same on every run in standard Python; without it, the base and the number can change.',
      run: true
    },
    try: {
      kind: 'python',
      task: 'Run the program several times: the random lines change, the wrap-around does not. Then change `n` and predict the day number before you run it.',
      code: 'import random\n\n# A random DNA base: run several times and compare.\nprint(random.choice("ACGT"))\n\n# A random whole number from 0 to 9 (10 is not included).\nprint(random.randrange(0, 10))\n\n# Days: 0 is Monday, 6 is Sunday. Saturday is 5.\nn = 3\nprint((5 + n) % 7)'
    },
    mistake: { wrong: 'Expecting `random.randrange(0, 7)` to return 7 now and then, as if both ends were included.', fix: '`randrange` never returns its end value, so `randrange(0, 7)` gives 0 to 6: exactly the seven day numbers. `random.randint(0, 6)` gives the same, because `randint` includes both ends.' },
    check: {
      q: 'Days are numbered 0 (Monday) to 6 (Sunday). Today is Friday, day 4. Which expression gives the day number 10 days from now?',
      options: [
        { t: '`4 + 10 % 7`', why: '`%` runs before `+`, so this is 4 + 3, which is 7, outside 0 to 6. Parentheses must wrap the addition.' },
        { t: '`(4 + 10) // 7`', why: '`//` counts the whole weeks that fit, 2, not the day you land on. The remainder from `%` gives that position.' },
        { t: '`(4 + 10) % 7`', why: 'Adding 10 gives 14, and `% 7` keeps what is left after removing whole weeks. 14 % 7 is 0, which is Monday.' },
        { t: '`(4 + 10) % 6`', why: 'A week has 7 days, so the wheel has 7 positions, 0 to 6. Dividing by 6 would make Sunday, day 6, impossible to reach.' }
      ],
      answer: 2
    },
    deeper: ['f2-modules', 'f2-first-program']
  },
  {
    id: 'rice-dates-project',
    course: 'rice',
    module: 'rice-m4',
    title: 'The dates project: how to work on it',
    lectures: ['Project Description: Working with Dates', 'Project: Working with Dates', 'OwlTest: Automated Feedback and Assessment'],
    minutes: 3,
    keywords: ['project', 'Working with Dates', 'specification', 'testing', 'OwlTest', 'automated feedback', 'test cases', 'edge cases', 'debugging', 'submit'],
    explain: 'A programming project gives you a **specification**: a description of each function you must write: its name, its parameters and what it must return. Work in small steps. Read the whole specification first, noting each function\'s exact name and parameters. Write one function, then test it yourself by calling it with inputs whose answers you worked out by hand, including unusual cases (called **edge cases**). Move on only when it passes. An automated feedback tool such as OwlTest then checks your program and reports problems: read each message, fix one thing, and test again.',
    why: 'If you write everything and test only at the end, a bug could be anywhere; testing as you go keeps each problem small. Revise the skills the project uses: defining functions, return values, comparisons, conditionals and the datetime module.',
    visual: { diagram: 'dev-cycle' },
    example: {
      lang: 'python',
      code: 'def full_codons(length):\n    return length // 3\n\nprint(full_codons(9), "expected 3")\nprint(full_codons(10), "expected 3")\nprint(full_codons(2), "expected 0")\nprint(full_codons(0), "expected 0")',
      output: '3 expected 3\n3 expected 3\n0 expected 0\n0 expected 0',
      note: 'An unrelated practice function, tested the same way: each line shows the real result beside the answer worked out by hand. Edge cases such as 0, or fewer bases than one codon, catch bugs that ordinary inputs miss.',
      run: true
    },
    mistake: { wrong: 'Renaming a required function, or changing the order of its parameters, because another version seems clearer.', fix: 'Automated tests call your functions by the exact names and parameter order in the specification. A renamed function looks missing to them, even if it works perfectly.' },
    check: {
      q: 'You have just written the first of several functions for a project. What is the best next step?',
      options: [
        { t: 'Test it yourself with a few inputs whose answers you know, including edge cases', why: 'Testing each function as you write it keeps any bug small and local, so you know which code caused it before you build on it.' },
        { t: 'Write all the remaining functions, then test everything together', why: 'If several functions fail at once, any line could be the cause. One function at a time keeps each problem easy to find.' },
        { t: 'Submit straight away and let the automated feedback find the bugs', why: 'Automated feedback is useful, but your own tests come first: they show exactly which input fails, and you understand them because you wrote them.' }
      ],
      answer: 0
    },
    deeper: ['f2-debug', 'f2-functions', 'f2-modules']
  }
);
