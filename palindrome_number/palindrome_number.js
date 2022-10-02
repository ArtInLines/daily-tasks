/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
	x = String(x);
	var h = x.length / 2;
	for (var i = 0; i < h; i++) {
		if (x[i] !== x[x.length - i - 1]) return false;
	}
	return true;
};
