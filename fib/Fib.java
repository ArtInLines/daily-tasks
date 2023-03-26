public class Fib {
	public static Integer fib(int n) {
		if (n < 2)
			return n;
		Integer[] table = new Integer[n + 1];
		table[0] = 0;
		table[1] = 1;
		for (int i = 2; i <= n; i++) {
			table[i] = table[i - 1] + table[i - 2];
		}
		return table[n];
	}

	public static void main(String[] args) {
		Integer res = Fib.fib(Integer.parseInt(args[0]));
		System.out.println(res);
	}
}
