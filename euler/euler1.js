/**
 * Sum all numbers that are multiples of one of the numbers provided in `xs`
 * @param {number[]} xs List of numbers to get all multiples from
 * @param {number} end Exclusive end index. The range of multiples considered will be from `min(xs)..end`
 */
const sumMultiples = (xs, end) => {
	let sum = 0;
	for (let n = Math.min(...xs); n < end; n++) {
		if (xs.some((x) => n % x === 0)) sum += n;
	}
	return sum;
};

console.log(sumMultiples([3, 5], 1000));
