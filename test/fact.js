// Factorial
function fact(n) {
	if (n <= 1) return 1;
	return n * fact(n - 1);
}

console.log(fact(Number(require('process').argv[2])));
