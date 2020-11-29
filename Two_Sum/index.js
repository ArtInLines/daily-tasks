/**
 * @param {number[]} nums Unsorted Array of Numbers.
 * @param {number} target Target Number, that should be found by adding two numbers together in `nums`.
 * @returns {number[]} Returns an Array containing the indices of the two numbers that added together return `target`. If there are no valid solutions, the return value will be `null`.
 */
function twoSum(nums, target) {
	const hashmap = new Map();
	for (let i = 0; i < nums.length; i++) {
		if (hashmap.has(target - nums[i])) return [hashmap.get(target - nums[i]), i];
		hashmap.set(nums[i], i);
	}
	return null;
}

//
//
// Examples
//

const examples = [
	[
		[[15, 2, 7, 11], 9],
		[1, 2],
	],
	[
		[[3, 2, 4], 6],
		[1, 2],
	],
	[
		[[3, 3], 6],
		[0, 1],
	],
	[
		[[4, 7, 8, 2, 18, 33, 64, 22, 5, 15, 10], 32],
		[7, 10],
	],
];
const { test } = require('./../test');
test(examples, twoSum);
