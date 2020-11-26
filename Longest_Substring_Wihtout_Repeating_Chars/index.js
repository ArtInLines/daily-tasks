/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
	let maxLength = 0,
		arr = s.split(''),
		temp = 0;
	arr.map((val, i) => {
		let set = new Set();
		while (i < arr.length) {
			if (set.has(arr[i])) break;
			set.add(arr[i]);
			i++, temp++;
		}
		if (temp > maxLength) maxLength = temp;
		temp = 0;
	});
	return maxLength;
}

//
//
// Examples
//

const examples = [
	['abcabcbb', 3],
	['bbbbb', 1],
	['pwwkew', 3],
	['', 0],
	['abb', 2],
	['dvdf', 3],
];
const { test } = require('./../test');
test(examples, lengthOfLongestSubstring);
