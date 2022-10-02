// Loop through list 1
// Have a pointer pointing at the index of the current element in list 2
// Check if element of list 1 intersects with element of list 2
// Add intersection to return array and increment loop to next element of list 1
// If endi <= endj, increment counter for list 2

/**
 * @param {number[][]} l1
 * @param {number[][]} l2
 * @return {number[][]}
 */
function intervalIntersection(l1, l2) {
	const res = [];
	let end = 0;
	for (let i = 0, j = 0, len1 = l1.length, len2 = l2.length; i < len1 && j < len2; i++) {
		// Increment counter for list2, if intervalj is situated before intervali
		while (l1[i][0] > l2[j][1]) {
			if (j === len2 - 1) return res;
			j++;
		}

		// Check for intersections between intervali and all necessary intervalj
		while (l1[i][0] <= l2[j][1] && l1[i][1] >= l2[j][0]) {
			end = Math.min(l1[i][1], l2[j][1]);
			res.push([Math.max(l1[i][0], l2[j][0]), end]);

			// Only continue loop, if intervalj was a subinterval of intervali
			if (end === l2[j][1]) j++;
			else break;

			if (j === len2) return res;
		}
	}
	return res;
}

module.exports = { intervalIntersection };
