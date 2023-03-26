import java.util.ArrayList;
import java.util.List;

public class e4 {
	public static boolean isPalindrome(int n) {
		List<Integer> digits = new ArrayList<>(7);
		do {
			digits.add(n % 10);
			n /= 10;
		} while (n > 0);
		int l = digits.size();
		for (int i = 0; i < l / 2; i++) {
			Integer a = digits.get(i);
			Integer b = digits.get(l - i - 1);
			if (a != b)
				return false;
		}
		return true;
	}

	public static int f(int max) {
		for (int i = 0; i < max; i++) {
			for (int j = 0; j < i; j++) {
				int a = max - i + j;
				int b = max - j;
				int x = a * b;
				if (isPalindrome(x)) {
					return x;
				}
			}
		}
		return 0;
	}

	public static void main(String[] args) {
		int res = e4.f(999);
		System.out.println(res);
	}
}