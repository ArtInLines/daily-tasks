/**
 * Finds the median of two sorted Arrays of numbers
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
	nums1 = merge(nums1, nums2);
	if (nums1.length % 2 === 0) {
		const half = nums1.length / 2;
		return (nums1[half] + nums1[half - 1]) / 2;
	} else return nums1[(nums1.length - 1) / 2];
}

/**
 * Merges to sorted Arrays into a single sorted array.
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
function merge(nums1, nums2) {
	if (nums1.length === 0) return nums2;
	else if (nums2.length === 0) return nums1;

	let i = 0;
	while (nums1.length) {
		// Doesn't need to check nums2.length, cause nums2 will be returned anyways
		if (nums1[0] <= nums2[i]) nums2.splice(i, 0, nums1.shift());
		i++;
		if (i >= nums2.length) {
			nums2 = nums2.concat(nums1);
			break;
		}
	}
	return nums2;
}
