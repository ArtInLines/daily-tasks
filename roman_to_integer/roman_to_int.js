const RtI = {
	I: 1,
	V: 5,
	X: 10,
	L: 50,
	C: 100,
	D: 500,
	M: 1000,
};

/**
 * @param {string} s
 * @return {number}
 */
function romanToInt(s) {
	let x = RtI[s[s.length - 1]];
	for (let i = s.length - 2; i >= 0; i--) {
		if (RtI[s[i]] < RtI[s[i + 1]]) x -= RtI[s[i]];
		else x += RtI[s[i]];
	}
	return x;
}

module.exports = { romanToInt };
