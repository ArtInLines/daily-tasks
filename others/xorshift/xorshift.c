#include <stdio.h> // For printf
#include <stdlib.h> // For exit

int RNGState = 0;

int xorshift()
{
	RNGState ^= RNGState << 13;
	RNGState ^= RNGState >> 17;
	RNGState ^= RNGState << 5;
	return RNGState;
}

int main(int argc, char const *argv[])
{
	if (argc < 3)
	{
		printf("Not enough arguments provided\n");
		printf("Usage:\n");
		printf("  <seed> <iterations>\n");
		printf("Description:\n");
		printf("  Seeds the RNG with `seed` and run xorshift `iterations` many times.\n");
		exit(1);
	}

	RNGState = atoi(argv[1]);
	int iters = atoi(argv[2]);

	for (int i = 0; i < iters; i++) xorshift();

	printf("%d\n", RNGState);

	return 0;
}