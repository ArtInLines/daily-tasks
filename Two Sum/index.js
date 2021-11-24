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
