# Two Sum

Task taken from [LeetCode](https://leetcode.com/problems/palindrome-number/).

## Prompt:

Given an integer `x`, return true if `x` is palindrome integer.

An integer is a **palindrome** when it reads the same backward as forward.

-   For example, 121 is a palindrome while 123 is not.

## Constraints:

-   `-231 <= x <= 231 - 1`

## Solutions

-   Transform the number into a string and loop through the first half of its characters to check if they each equal their latter counterpart
-   Divide the number by 10 each iteration, building up its reverse by multiplying the current reverse by 10 and adding the additional rest - this is faster, but you need to make sure, that edge-cases are handled (negative numbers & and dividers of 10 other than 0)
