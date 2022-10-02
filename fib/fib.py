def fib(n, memo = {}):
	if (n < 2):
		return n
	elif (n in memo):
		return memo[n]
	memo[n] = fib(n-2, memo) + fib(n-1,memo)
	return memo[n]