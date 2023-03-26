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

int main(void)
{
	unsigned int a = sumSquares(100);
	unsigned int b = squareSum(100);
	printf("%d\n", b - a);
	return 0;
}
