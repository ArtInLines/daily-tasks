# Coding-Problems

Solving coding prompts & problems (for example from [Leetcode](https://www.leetcode.com) or [Project Euler](https://projecteuler.net/archives)) and training different languages with these problems.

The name of the project stems from the goal to solve one little coding problem a day. I usually don't actually solve a problem a day, though.

## Languages

The following is a list of all the programming languages used in this repo. The exact commands used to run the files can also be found in `test.js` under the hashmap `EXT_TO_CMD`.

| Language                                                                      | Extension | How to run                                                                            |
| ----------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------- |
| [JavaScript](https://nodejs.org/en/)                                          | `.js`     | `node <name> <input>`                                                                 |
| [Rust](https://www.rust-lang.org/)                                            | `.rs`     | `rustc <name> && <name> <input>`                                                      |
| [Python](https://www.python.org/)                                             | `.py`     | `python3 <name> <input>`                                                              |
| [Java](https://www.oracle.com/java/technologies/downloads/)                   | `.java`   | `javac <name> && java <name w/o extension> <input>`                                   |
| [SetlX](https://randoom.org/Software/SetlX/)                                  | `.stlx`   | `setlX <name> <input>`                                                                |
| [C](<https://en.wikipedia.org/wiki/C_(programming_language)>)[^cbooks][^ccom] | `.c`      | `gcc <name> -o <outname> && <outname> <input>`                                        |
| [Julia](https://julialang.org/)                                               | `.jl`     | `julia <name> <input>`                                                                |
| [Common Lisp](https://lisp-lang.org/)[^cldoc][^clcom]                         | `.lsp`    | `sbcl --noinform --load <name> --quit <input>`                                        |
| [Ruby](https://www.ruby-lang.org/en/)                                         | `.rb`     | `ruby <name> <input>`                                                                 |
| [Kotlin](https://kotlinlang.org/)[^kotlincom]                                 | `.kt`     | `kotlinc <name> -include-runtime -d <outname>.jar && java -jar <outname>.jar <input>` |

[^cbooks]: For books on C, see the PDF-Files [here](https://github.com/ArtInLines/PDF-Files/tree/master/CS/Programming/Languages/C).
[^ccom]: There are many compilers for C. I personally use [Clang](https://clang.llvm.org/) or [GCC](https://gcc.gnu.org/)
[^cldoc]: For documentation see [here](https://lispcookbook.github.io/cl-cookbook/) (includes links to further documentation too)
[^clcom]: For running Common Lisp programs, I recommend using either [CLISP](https://sourceforge.net/projects/clisp/) or [SBCL](https://www.sbcl.org/)
[^kotlincom]: To use kotlin without a specific IDE, see [here](https://kotlinlang.org/docs/command-line.html)

## Automatic Testing

There is a testing framework, that automatically tests all solutions to the specified tasks. The testing works by running the script (potentially compiling it first) and comparing the output in stdout with the expected output. The inputs to the function are given via command line arguments.

This works, because every language, that is used here, can receive arguments via the command-line and print output to stdout.

The downside is, however, that each script needs some additional code to parse the input and print its output. This can be quite cumbersome, when more complex data structures are expected as input/output.

The inputs and expected ouputs for each test are recorded in `tests.json`

### Quickstart

To run all tests:

```console
node test all
```

For further usage, see:

```console
node test --help
```

## TODOs

-   Add Benchmarking to the testing framework
-   The testing framework should allow some simple way of adding more testcases via the command-line
-   Several solutions to the same problem should be tested in parralel
-   Add better Error Handling to the Testing Framework
-   Add ignored Folders, that aren't checked for solution-files
-   As far as I can tell (without having tested it), the testing framework is not cross-platform and only works on windows currently.
-   Think about adding different time-limits for compilation commands & running the actual program
-   Think about allowing custom time-limits per language
-   Log times for compiling/runnning the programs (first step in benchmarking)
