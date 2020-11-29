require('colors').setTheme(require('./colorTheme'));

/**
 *
 * @param {Array} arr A 2D Array containing the input and expected output for each example, where `arr[i][0] == example input` and `arr[i][1] == expected output`
 * @param {Function} func The Method taking the input of `arr` as argument
 */
function test(arr, func) {
	let err = false;
	for (let i = 0; i < arr.length; i++) {
		const el = arr[i],
			expected = el[1],
			input = el[0],
			output = func.apply(undefined, input);
		if (Array.isArray(expected) && Array.isArray(output)) {
			for (let j = 0; j < expected.length; j++) {
				if (expected[j] !== output[j]) err = true;
			}
		} else if (expected != output) err = true;
		if (err) console.log(`${input} - Expected: ${expected} - Output: ${output}`.err);
	}
	if (!err) console.log(`Testing ${func.name} finished without errors \\o/`.success);
}

module.exports = { test };
