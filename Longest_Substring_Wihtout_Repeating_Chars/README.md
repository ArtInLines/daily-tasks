# Longest Substring without repeating Characters

Task taken from [leetcode](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

## Prompt:

Given a string s, find the length of the longest substring without repeating characters.

#### Constraints:

-   `0 <= s.length <= 5 * 104`
-   `s consists of English letters, digits, symbols and spaces`

## Solution:

Looping over every character of the string: Every character gets its own nested loop to determine how long a substring starting with that char can be.
