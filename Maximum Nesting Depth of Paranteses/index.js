/**
 * Algorithm takes O(n) time
 * @param {string} s
 * @return {number}
 */
var maxDepth = function (s) {
	let maxDepth = 0,
		temp = 0;
	s.split('').map((val) => {
		if (val === '(') {
			temp++;
			if (temp > maxDepth) maxDepth = temp;
		} else if (val === ')') temp--;
	});
	return maxDepth;
};
