/**
 * Algorithm with O(n)
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
	let maxLength = 0,
		temp = 0,
		chars = new Set();
	s.split('').map((val) => {
		if (chars.has(val)) {
			chars.clear();
			temp = 0;
		} else {
			temp++;
			chars.add(val);
			if (temp > maxLength) maxLength = temp;
		}
	});
	return maxLength;
};

//
//
// Examples
//

const fs = require('fs');
const inputs = JSON.parse(fs.readFileSync(`${__dirname}/examples.json`));
inputs.map((input, i) => console.log(i, ':', lengthOfLongestSubstring(input)));
