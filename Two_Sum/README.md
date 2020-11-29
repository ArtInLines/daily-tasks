# Two Sum

Task taken from [LeetCode](https://leetcode.com/problems/two-sum/).

## Prompt:

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have _exactly one solution_, and you may _not use the same element twice_.

You can return the answer in any order.

## Constraints:

-   `2 <= nums.length <= 103`
-   `-109 <= nums[i] <= 109`
-   `-109 <= target <= 109`
-   **Only one valid answer exists.**

## Solution:

1. Create a new Hashmap
2. Loop through every element in the `nums` Array
3. For each Element in Array, check if hashmap has needed summand to get `target`.
    - If true, return index of current element of array & index of neededSummand via `hashmap.get(target - nums[i])`
    - Else add current element to hashmap, with the index as value and the element as key: `hashmap.set(nums[i], i)`
