package fib;

public class Fib {
	public static int fib(int n) {
		Integer[] memo = new Integer[n];
		return fib(n, memo);
	}

	private static Integer fib(Integer n, Integer[] memo) {
		if (n <= 1)
			return n;
		if (memo[n - 1] == null) {
			memo[n - 2] = fib(n - 2, memo);
			memo[n - 1] = fib(n - 1, memo);
		}
		return memo[n - 1] + memo[n - 2];
	}
}
