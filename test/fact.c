#include <stdio.h>

int fact(int n)
{
	if (n <= 1) return 1;
	return n * fact(n-1);
}

int main(int argc, char const *argv[])
{
	int res = fact(atoi(argv[1]));
	printf("%d\n", res);
	return 0;
}
