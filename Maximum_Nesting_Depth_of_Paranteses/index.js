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

//
//
// Examples
//

const examples = [
	['(1+(2*3)+((8)/4))+1', 3],
	['(1)+((2))+(((3)))', 3],
	['1+(2*3)/(2-1)', 1],
	['1n+4-3', 0],
];
const { test } = require('./../test');
test(examples, maxDepth);
