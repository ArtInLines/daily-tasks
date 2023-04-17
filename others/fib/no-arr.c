#include <stdio.h>
#include <stdlib.h>

long long fib(long long n)
{
    if (n < 2) return n;
	long long x = 0;
	long long y = 1;
	long long t;
	while (n >= 1) {
		t = x;
		x = x + y;
		y = t;
		n--;
	}
	return x;
}

int main(int argc, char const *argv[])
{
	int res = fib(atol(argv[1]));
	printf("%d\n", res);
	return 0;
}