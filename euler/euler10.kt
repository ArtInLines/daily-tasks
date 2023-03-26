import kotlin.math.*;

fun isPrime(n:Int): Boolean {
	if (n % 2 == 0)	return false;
	else if (n % 3 == 0) return false;
	else {
		val r: Int = sqrt(n.toDouble()).toInt();
		var f: Int = 5;
		while (f <= r) {
			if (n % f == 0) return false;
			else if (n % (f+2) == 0) return false;
			f += 6;
		}
		return true;
	}
}

fun primesBefore10(): Sequence<Int> {
	return sequenceOf(2,3,5,7);
}

fun primesAfter10(n: Int): Sequence<Int> {
	return generateSequence(11, {
		var res: Int? = null;
		for (i in it+2..n-1 step 2) {
			if (isPrime(i)) {
				res = i;
				break;
			}
		}
		res
	});
}

fun mySum(s: Sequence<Int>): Long {
	var sum: Long = 0L;
	for (x in s) {
		sum += x.toLong();
		if (sum < 0) {
			print("OVERFLOW!!!");
		}
	}
	return sum;
}

fun main() {
	val a: Long = mySum(primesBefore10());
	println(a);
	val b: Long = mySum(primesAfter10(2_000_000));
	print(a + b);
}