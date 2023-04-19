// Faster, but stolen:

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
	const stack = [];

	const leftToRight = {
		'(': ')',
		'[': ']',
		'{': '}',
	};

	for (let i = 0; i < s.length; i++) {
		const el = s[i];

		if (leftToRight[el]) {
			stack.push(el);
		} else if (leftToRight[stack.pop()] !== el) {
			return false;
		}
	}

	return stack.length === 0;
};

const { argv } = require('process');
console.log(isValid(argv[2] || '') ? 't' : 'f');
