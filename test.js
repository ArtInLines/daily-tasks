/**
 *
 * @param {Array} arr A 2D Array containing the input and expected output for each example, where `arr[i][0] == example input` and `arr[i][1] == expected output`
 * @param {Function} func The Method taking the input of `arr` as argument
 */
function test(arr, func) {
	let err = false;
	arr.map((el) => {
		if (el[1] !== func(el[0])) {
			console.log(`${el[0]} - Expected: ${el[1]} - Output: ${func(el[0])}`);
			err = true;
		}
	});
	if (!err) console.log(`Testing ${func.name} finished without errors \\o/`);
}

module.exports = { test };
