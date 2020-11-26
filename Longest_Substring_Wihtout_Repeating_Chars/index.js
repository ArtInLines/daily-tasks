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

function slidingWindow(s) {
	let charSet = new Set();
	let maxLength = 0,
		l = 0,
		arr = s.split('');

	for (let i = 0; i < arr.length; i++) {
		while (charSet.has(arr[i])) {
			charSet.delete(arr[l]);
			l += 1;
		}
		charSet.add(s[i]);
		if (i - l + 1 > maxLength) maxLength = i - l + 1;
	}
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
	['abbc', 2],
	['dvdf', 3],
];
const { test } = require('./../test');
test(examples, lengthOfLongestSubstring);
test(examples, slidingWindow);
