function gridTraveler(m, n, memo = {}) {
	if (m === 1 && n === 1) return 1;
	if (m === 0 || n === 0) return 0;
	let key = m + '-' + n;
	if (key in memo) return memo[key];
	key = n + '-' + m;
	if (key in memo) return memo[key];
	memo[key] = gridTraveler(m - 1, n) + gridTraveler(m, n - 1);
	return memo[key];
}

for (let i = 0; i <= 5; i++) for (let j = 0; j <= 5; j++) console.log(`${i} x ${j} => ${gridTraveler(i, j)}`);
