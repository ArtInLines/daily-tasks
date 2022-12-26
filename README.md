# Coding-Problems

Solving coding prompts & problems (for example from [leetcode.com](https://www.leetcode.com)) and training different languages with these problems.

## Writing Tests

-   For each programming language that's used, a seperate "test"-file must be located in the root-folder
-   Each test file should have its own entry in `languages.json`.
    -   For each language, you need to specify the name of the language, the name of the test-file, the command with which the file can be executed and a list of file-endings that a file of said language can have (without the `.` before the ending).
-   Each Test script should take the name of the directory as an input via the command-line-arguments.
-   The following Error messages should be kept consistent between all Test-scripts:
    -   `Directory '<directory>' couldn't be found`
    -   `Couldn't find a <language> file in the directory '<directory>'`
    -   `Module '<modulePath>' couldn't be found`
    -   `No applicable function was found in the module: '<modulePath>'\nFunctions: <list of functions>`
    -   `No test-file (.json) was found in '<directory>'`
    -   `Each test should be stored as a list or map in the test-file '<test-file>' in the directory '<directory>'`
-   The following should be printed, if all tests were successful:
    -   `All tests passed for task '<taskName>'`
-   The following should be printed if any test fails:
    -   `TEST FAILED\nInput: <input>\nExpected Output: <expected-output>\nActual Output: <actual-output>`

## Requirements for tests.json

-   All Tests must be written as json files either called "tests.json"
-   All Tests-Files must be lists of tests
-   Each test must be stored as an object with an "in" and "out" key.
-   Inputs/Oututs can be any type

## TODO

-   Mark all unfinished files as such
-   Add tests for different programming languages
