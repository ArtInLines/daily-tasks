// Bad Solution
// function fib(n) {
// 	if (fib <= 2) return 1;
// 	return fib - 1 + fib(n - 2);
// }

// Better Solution
function fib(n, memo = {}) {
	if (n in memo) return memo[n];
	if (n < 2) return n;
	memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
	return memo[n];
}

// Testing
// for (let i = 0; i <= 30; i++) console.log(`Fib of ${i} = ${fib(i)}`);
