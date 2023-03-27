#include <stdio.h>
#include <stdlib.h>

unsigned int max;

unsigned int nextCollatz(unsigned int n)
{
	return (n % 2 == 0) ? n / 2 : 3 * n + 1;
}

unsigned int collatzLen(unsigned int n, unsigned int* mem)
{
	if (n == 1) return 0;
	if (n <= max && mem[n-1]) return mem[n-1];
	unsigned int res = 1 + collatzLen(nextCollatz(n), mem);
	if (n <= max) mem[n-1] = res;
	return res;
}

int main(int argc, char const *argv[])
{
	max = (unsigned int) strtol(argv[1], (char**)NULL, 10);
	unsigned int* mem = malloc(sizeof(unsigned int) * max);
	for (size_t i = 0; i < max; i++) mem[i] = 0;

	unsigned int maxStart = 1;
	unsigned int maxLen = 0;
	size_t i = max;
	while (i > 1) {
		unsigned int len = collatzLen(i, mem);
		if (len > maxLen) {
			maxStart = i;
			maxLen = len;
		}
		i--;
	}

	printf("%d\n", maxStart);
	return 0;
}
