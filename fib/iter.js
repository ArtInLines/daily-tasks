const { argv } = require('process');

function fib(n) {
	const memo = [0, 1];
	for (let i = 2; i <= n; i++) {
		memo.push(memo.at(-2) + memo.at(-1));
	}
	return memo[n];
}

console.log(fib(Number(argv[2])));
