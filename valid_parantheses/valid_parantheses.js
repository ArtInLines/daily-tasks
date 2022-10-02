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

// Faster, but stolen:

// /**
//  * @param {string} s
//  * @return {boolean}
//  */
// var isValid = function (s) {
//   const stack = [];

//   const leftToRight = {
//     '(': ')',
//     '[': ']',
//     '{': '}',
//   };

//   for (let i = 0; i < s.length; i++) {
//     const el = s[i];

//     if (leftToRight[el]) {
//       stack.push(el);
//     } else if (leftToRight[stack.pop()] !== el) {
//       return false;
//     }
//   }

//   return stack.length === 0;
// };

module.exports = { isValid };
