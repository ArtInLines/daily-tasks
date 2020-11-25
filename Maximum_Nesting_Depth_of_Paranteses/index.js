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

const fs = require('fs');
const inputs = JSON.parse(fs.readFileSync(`${__dirname}/inputs.json`));
inputs.map((input, i) => console.log(i, ':', maxDepth(input)));
