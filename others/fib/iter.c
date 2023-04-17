#include <stdio.h>
#include <stdlib.h>

long long fib(long long n)
{
    if (n < 2) return n;

    long long* table = malloc((n + 1) * sizeof(long long));
    table[0] = 0;
    table[1] = 1;
    long long i; for (i = 2; i <= n; i++) table[i] = table[i-2] + table[i - 1];
    long long res = table[n];
    free(table);
    return res;
}

int main(int argc, char const *argv[])
{
	int res = fib(atoi(argv[1]));
	printf("%d\n", res);
	return 0;
}