function test(arr, func) {
	arr.map((el) => {
		console.log(el[0], '-', 'Expected:', el[1], 'Output:', func(el[0]));
	});
}

module.exports = { test };
