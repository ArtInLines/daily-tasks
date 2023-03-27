#define N 4 // N can't be changed without changing part of the code atm

#include <stdio.h>
#include <stdlib.h>

static inline unsigned int horzProduct(const size_t size, const size_t row, const size_t col, const unsigned int* grid)
{
	// Assumes that N is 4
	// Otherwise a loop would be needed here
	return grid[row * size + col + 1] * grid[row * size + col + 2] * grid[row * size + col + 3];
}

static inline unsigned int vertProduct(const size_t size, const size_t row, const size_t col, const unsigned int* grid)
{
	// Assumes that N is 4
	// Otherwise a loop would be needed here
	return grid[(row + 1) * size + col] * grid[(row + 2) * size + col] * grid[(row + 3) * size + col];
}

static inline unsigned int diagProduct(const size_t size, const size_t row, const size_t col, const unsigned int* grid)
{
	// Goes diagonally from top-left to bottom-right
	// Assumes that N is 4
	// Otherwise a loop would be needed here
	return grid[(row + 1) * size + col + 1] * grid[(row + 2) * size + col + 2] * grid[(row + 3) * size + col + 3];
}

static inline unsigned int diagProduct2(const size_t size, const size_t row, const size_t col, const unsigned int* grid)
{
	// Same as diagProduct, except the row decreases (goes from bottom-left to top-right)
	return grid[(row - 1) * size + col + 1] * grid[(row - 2) * size + col + 2] * grid[(row - 3) * size + col + 3];
}


int main(int argc, char** argv)
{
	size_t size = (size_t) strtol(argv[1], (char**)NULL, 10);
	if (argc - 2  != size * size) {
		printf("Invalid amount of arguments.");
		exit(1);
	}
	unsigned int* grid = malloc(size * size * sizeof(unsigned int));
	for (size_t i = 0; i < size * size; i++) {
		grid[i] = (unsigned int) strtol(argv[i + 2], (char**)NULL, 10);
	}

	unsigned int max = 0;

	// Calculate horizontal products
	for (size_t row = 0; row < size; row++)
	{
		for (size_t col = 0; col < size - N; col += 2)
		{
			unsigned int first = grid[row * size + col];
			unsigned int second = grid[row * size + col + N];
			unsigned int sharedProduct = horzProduct(size, row, col, grid);
			unsigned int localMax = sharedProduct * ((first >= second) ? first : second);
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("a - row: %2u  col: %2u\n", row, col);
			// }
			if (localMax > max) max = localMax;
		}
		if (size % 2 == 0)
		{
			unsigned int x = grid[row * size + size - N] * horzProduct(size, row, size - N, grid);
			if (x > max) max = x;
		}
	}

	// Calculate vertical products
	for (size_t col = 0; col < size; col++)
	{
		for (size_t row = 0; row < size - N; row += 2)
		{
			unsigned int first = grid[row * size + col];
			unsigned int second = grid[row * size + col + N];
			unsigned int sharedProduct = vertProduct(size, row, col, grid);
			first *= sharedProduct;
			second *= sharedProduct;
			unsigned int localMax = (first >= second) ? first : second;
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("b - row: %2u  col: %2u\n", row, col);
			// }
			if (localMax > max) max = localMax;
		}
		if (size % 2 == 0)
		{
			unsigned int x = grid[(size - N) * size + col] * vertProduct(size, size - N, col, grid);
			if (x > max) max = x;
		}
	}

	// Diagonals (top-left to bottom-right)
	// Calculate diagonal products (left-bottom)
	for (size_t row = 0; row < size - N; row++)
	{
		for (size_t offset = 0; offset < size - N - row; offset += 2)
		{
			unsigned int first = grid[(row + offset) * size + offset];
			unsigned int second = grid[(row + offset + N) * size + offset + N];
			unsigned int sharedProduct = diagProduct(size, row + offset, offset, grid);
			first *= sharedProduct;
			second *= sharedProduct;
			unsigned int localMax = (first >= second) ? first : second;
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("c - row: %2u  col: %2u\n", row + offset, offset);
			// }
			if (localMax > max) max = localMax;
		}
	}
	// Calculate diagonal products (right-top)
	for (size_t col = 1; col < size - N; col++)
	{
		for (size_t offset = 0; offset < size - N - col; offset += 2)
		{
			unsigned int first = grid[offset * size + col + offset];
			unsigned int second = grid[(offset + N) * size + col + offset + N];
			unsigned int sharedProduct = diagProduct(size, offset, col + offset, grid);
			first *= sharedProduct;
			second *= sharedProduct;
			unsigned int localMax = (first >= second) ? first : second;
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("d - row: %2u  col: %2u\n", offset, col + offset);
			// }
			if (localMax > max) max = localMax;
		}
	}
	if (size % 2 == 0)
	{
		unsigned int x = grid[(size-N) * size + 0] * diagProduct(size, size-N, 0, grid);
		if (x > max) max = x;

		x = grid[0 * size + size - N] * diagProduct(size, 0, size-N, grid);
		if (x > max) max = x;
	}

	// Diagonals (bottom-left to top-right)
	// Calculate diagonal products (left-bottom)
	for (size_t row = size-1; row > N; row--)
	{
		for (size_t offset = 0; offset < 1 + row - N; offset += 2)
		{
			unsigned int first = grid[(row - offset) * size + offset];
			unsigned int second = grid[(row - offset - N) * size + offset + N];
			unsigned int sharedProduct = diagProduct2(size, row - offset, offset, grid);
			first *= sharedProduct;
			second *= sharedProduct;
			unsigned int localMax = (first >= second) ? first : second;
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("e - row: %2u  col: %2u\n", row - offset, offset);
			// }
			if (localMax > max) max = localMax;
		}
	}
	// Calculate diagonal products (right-top)
	for (size_t col = 1; col < size - N; col++)
	{
		for (size_t offset = 0; offset < size - N - col; offset += 2)
		{
			unsigned int first = grid[(size - offset - 1) * size + col + offset];
			unsigned int second = grid[(size - offset - 1 - N) * size + col + offset + N];
			unsigned int sharedProduct = diagProduct2(size, size - offset - 1, col + offset, grid);
			first *= sharedProduct;
			second *= sharedProduct;
			unsigned int localMax = (first >= second) ? first : second;
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("f - row: %2u  col: %2u\n", size - offset - 1, col + offset);
			// }
			if (localMax > max) max = localMax;
		}
	}
	if (size % 2 == 0)
	{
		unsigned int x = grid[N * size + 0] * diagProduct2(size, 0, N, grid);
		if (x > max) max = x;

		x = grid[(size - 1) * size + size - N] * diagProduct2(size, size-1, size-N, grid);
		if (x > max) max = x;
	}

	printf("%u\n", max);
	return 0;
}
