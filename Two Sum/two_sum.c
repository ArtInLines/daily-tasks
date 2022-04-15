#include <stdlib.h>

// This implementation runs in O(n^2) time complexity,
// because it doesn't use any hashtables, however
// it uses very very little memory

/**
 * Note: The returned array must be malloced, assume caller calls free().
 * If there are no two values that add to target, return a Null-Pointer
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize){
	*returnSize = 2;
	int i, j;
	for (i = 0; i < numsSize-1; i++) {
		for (j = i+1; j < numsSize; j++) {
			if (nums[i] + nums[j] == target) {
				int* res = (int *) malloc(2 * sizeof(int));
				res[0] = i;
				res[1] = j;
				return res;
			}
		}
	}
	return (int *) NULL;
}