/**
 * Sum all numbers that are multiples of one of the numbers provided in `xs`
 * @param {number} end Exclusive end index. The range of multiples considered will be from `min(xs)..end`
 * @param {number[]} xs List of numbers to get all multiples from
 */
const sumMultiples = (end, xs) => {
	let sum = 0;
	for (let n = Math.min(...xs); n < end; n++) {
		if (xs.some((x) => n % x === 0)) sum += n;
	}
	return sum;
};

const { argv, exit } = require('process');
if (argv.length < 4) {
	console.log('Invalid amount of input arguments. Expects the excluive end first and the list of numbers, of which multiples are to be summed, second.');
	exit(1);
}
console.log(
	sumMultiples(
		Number(argv[2]),
		argv.slice(3).map((x) => Number(x))
	)
);
