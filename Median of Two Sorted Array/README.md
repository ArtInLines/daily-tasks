# Median of Two Sorted Array

Task from [leetcode](https://leetcode.com/problems/median-of-two-sorted-arrays)

## Prompt:

Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.

## Solution:

Merging both arrys into a sorted array and then getting the median. (Far from the best solution)

## Imporvement:

Use two pointers to go through the two arrays, to find the solution in a time complexity of `O(log(m+n))`

See [here](https://medium.com/@hazemu/finding-the-median-of-2-sorted-arrays-in-logarithmic-time-1d3f2ecbeb46)
