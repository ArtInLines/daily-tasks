const openingParantheses = ['(', '{', '['];
const closingParantheses = [')', '}', ']'];

/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
	const stack = [];
	let i;
	for (const c of s) {
		i = openingParantheses.indexOf(c);
		if (i >= 0) stack.unshift(i);
		else if (stack.length && stack[0] === closingParantheses.indexOf(c)) stack.shift();
		else return false;
	}
	if (stack.length > 0) return false;
	else return true;
}

const { argv } = require('process');
console.log(isValid(argv[2] ?? '') ? 't' : 'f');
