#include <stdio.h> // printf
#include <stdlib.h> // malloc, exit, atoi
#include <string.h> // memset

// Cache-Line-Size
#ifndef CLS
#define CLS 64
#endif
// Sub-Matrix dimensions are SM x SM
#define SM (CLS / sizeof(int))

void matrixMul(int n, int* a, int* b, int* c)
{
	for (int i = 0; i < n; i += SM)
		for (int j = 0; j < n; j += SM)
			for (int k = 0; k < n; k += SM)
			{
					int* cc = &c[i * n + j];
					int* aa = &a[i * n + k];
					for (int i2 = 0; i2 < SM && i + i2 < n; i2++, cc += n, aa += n)
					{
						int* bb = &b[k * n + j];
						for (int k2 = 0; k2 < SM && k + k2 < n; k2++, bb += n)
							for (int j2 = 0; j2 < SM && j + j2 < n; j2++)
								cc[j2] += aa[k2] * bb[j2];
					}
			}
}

int RNGState = 0;

int xorshift()
{
	RNGState ^= RNGState << 13;
	RNGState ^= RNGState >> 17;
	RNGState ^= RNGState << 5;
	return RNGState;
}

void randMatrix(int* matrix, int rows, int cols, int limit)
{
	for (int i = 0; i < rows; i++)
		for (int j = 0; j < cols; j++)
			matrix[i * cols + j] = xorshift() % limit;
}

void printMatrix(int* matrix, int rows, int cols) {
	for (int i = 0; i < rows; i++)
	{
		for (int j = 0; j < cols; j++)
		{
			printf("%ld ", matrix[i * cols + j]);
		}
		printf("\n");
	}
}

int main(int argc, char const *argv[])
{
	if (argc < 4)
	{
		printf("Not enough arguments provided\n");
		printf("Usage:\n");
		printf("  <seed> <limit> <n> ['s']\n");
		printf("Description:\n");
		printf("  Multiplies two square matrices A and B and outputs the result. A and B are both n x n matrices.\n");
		printf("  The matrices A and B are filled with random numbers. The random number generator must be Xorshift (https://en.wikipedia.org/wiki/Xorshift). seed gives the starting state of the number generator.\n");
		printf("  The 's' flag is an optional last parameter. When provided, no output will be printed, though all the calculations will be done regardless.");
		exit(1);
	}

	RNGState = atoi(argv[1]);
	int limit = atoi(argv[2]);
	int n = atoi(argv[3]);
	int silent = 0;
	if (argc >= 5 && argv[4][0] == 's') silent = 1;

	int* a = malloc(n * n * sizeof(int));
	randMatrix(a, n, n, limit);
	int* b = malloc(n * n * sizeof(int));
	randMatrix(b, n, n, limit);
	int* c = malloc(n * n * sizeof(int));
	memset(c, 0, n * n * sizeof(int));

	matrixMul(n, a, b, c);

	if (!silent)
	{
		// printMatrix(a, n, n);
		// printf("\n");
		// printMatrix(b, n, n);
		// printf("\n");
		printMatrix(c, n, n);
	}

	// OS will free automatically at end of program anyways
	// free(a);
	// free(b);
	// free(c);
	return 0;
}
