function fib(n) {
	let table = [0, 1];
	for (let i = 2; i <= n; i++) {
		table.push(table.at(-2) + table.at(-1));
	}
	return table.at(-1);
}

console.log(fib(Number(require('process').argv[2])));
