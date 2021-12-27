/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
	const res = [];
	for (let i = 0; i < nums.length - 2; i++) {
		const x = nums[i];
		for (let j = i + 1; j < nums.length - 1; j++) {
			const y = nums[j];
			if (res.findIndex((arr) => arr.includes(x) && arr.includes(y)) >= 0) continue;
			for (let k = j + 1; k < nums.length; k++) {
				const z = nums[k];
				if (x + y + z === 0) {
					res.push([x, y, z]);
					break;
				}
			}
		}
	}
	return res;
}
