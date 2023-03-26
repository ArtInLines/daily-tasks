/**
 * @param {string[]} strs
 * @return {string}
 */
function longestCommonPrefix(...strs) {
	let i,
		j,
		m = strs.length - 1,
		res = '',
		l = Math.min(...strs.map((s) => s.length));
	for (i = 0; i < l; i++) {
		for (j = 0; j < m; j++) if (strs[j][i] !== strs[j + 1][i]) return res;
		res += strs[0][i];
	}
	return res;
}

const { argv } = require('process');
console.log(longestCommonPrefix(...argv.slice(2)));
