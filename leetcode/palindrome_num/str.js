/**
 * @param {number} x
 * @return {boolean}
 */
function isPalindrome(x) {
	x = String(x);
	var h = x.length / 2;
	for (var i = 0; i < h; i++) {
		if (x[i] !== x[x.length - i - 1]) return false;
	}
	return true;
}

const { argv } = require('process');
console.log(isPalindrome(Number(argv[2])) ? 't' : 'f');
