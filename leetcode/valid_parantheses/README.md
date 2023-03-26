# Valid Parantheses

Task taken from [Leetcode](https://leetcode.com/problems/valid-parantheses/)

## Prompt

Given a string s containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

-   Open brackets must be closed by the same type of brackets.
-   Open brackets must be closed in the correct order.

## Constraints

-   1 <= s.length <= 104
-   s consists of parentheses only '()[]{}'.

## Solution

Loop trough string and add each opening parantheses to a stack, removing it iff it is on top and the current character is a fitting closing parantheses
