/**
 * @param {string} s
 * @return {string}
 */
function longestPalindrome(s) {
	s = s.split('');
	for (let i = 0; i < s.length; i++) {}
}

/**
 * @param {(String | String[])} s
 * @return {(Boolean | Number)}
 */
function isPalindrome(s) {
	const len = s.length;
	const half = Math.ceil(len / 2);
	for (let i = 0; i < half; i++) if (s[i] !== s[len - i]) return false;
	return len;
}

console.log(isPalindrome('abba'));
return;

//
//
// Examples
//

const examples = [
	['babed', 'bab'],
	['cbbd', 'bb'],
	['annas', 'anna'],
	['a', 'a'],
	['tabatatataba', 'abatatataba'],
];
const { test } = require('./../test');
test(examples, longestPalindrome);
