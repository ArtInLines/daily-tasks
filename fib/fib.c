#include <stdio.h>
#include <stdlib.h>

unsigned int fib(unsigned int n)
{
    if (n < 2) return n;

    unsigned int* table = malloc((n + 1) * sizeof(unsigned int));
    table[0] = 0;
    table[1] = 1;
    unsigned int i; for (i = 2; i <= n; i++) table[i] = table[i-2] + table[i - 1];
    unsigned int res = table[n];
    free(table);
    return res;
}

int main(int argc, char const *argv[])
{
	int res = fib(atoi(argv[1]));
	printf("%d\n", res);
	return 0;
}