# Roman to Integer

Task taken from [LeetCode](https://leetcode.com/problems/longest-common-prefix/).

## Prompt:

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

## Constraints:

-   `1 <= strs.length <= 200`
-   `0 <= strs[i].length <= 200`
-   `strs[i]` consists of only lower-case English letters.

## Solutions

-   Build up the result by looping through each letter of all strings at the same time
