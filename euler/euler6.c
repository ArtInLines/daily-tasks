#include <stdio.h>

unsigned int sumSquares(unsigned int n)
{
	unsigned int sum = 0;
	for (size_t i = 1; i <= n; i++) sum += i * i;
	return sum;
}

unsigned int squareSum(unsigned int n)
{
	unsigned int sum = (n + 1) * n / 2;
	return sum * sum;
}

int main(int argc, char const *argv[])
{
	unsigned int n = (unsigned int) atoi(argv[1]);
	unsigned int a = sumSquares(n);
	unsigned int b = squareSum(n);
	printf("%d\n", b - a);
	return 0;
}
