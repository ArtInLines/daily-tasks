#define SIZE 20
#define N 4 // N can't be changed without changing part of the code atm

#include <stdio.h>

static inline unsigned int horzProduct(const size_t row, const size_t col, const unsigned int* grid)
{
	// Assumes that N is 4
	// Otherwise a loop would be needed here
	return grid[row * SIZE + col + 1] * grid[row * SIZE + col + 2] * grid[row * SIZE + col + 3];
}

static inline unsigned int vertProduct(const size_t row, const size_t col, const unsigned int* grid)
{
	// Assumes that N is 4
	// Otherwise a loop would be needed here
	return grid[(row + 1) * SIZE + col] * grid[(row + 2) * SIZE + col] * grid[(row + 3) * SIZE + col];
}

static inline unsigned int diagProduct(const size_t row, const size_t col, const unsigned int* grid)
{
	// Goes diagonally from top-left to bottom-right
	// Assumes that N is 4
	// Otherwise a loop would be needed here
	return grid[(row + 1) * SIZE + col + 1] * grid[(row + 2) * SIZE + col + 2] * grid[(row + 3) * SIZE + col + 3];
}

static inline unsigned int diagProduct2(const size_t row, const size_t col, const unsigned int* grid)
{
	// Same as diagProduct, except the row decreases (goes from bottom-left to top-right)
	return grid[(row - 1) * SIZE + col + 1] * grid[(row - 2) * SIZE + col + 2] * grid[(row - 3) * SIZE + col + 3];
}


int main(void)
{
	static const unsigned int grid[SIZE*SIZE] = {
		8, 2, 22, 97, 38, 15, 0, 40, 0, 75, 4, 5, 7, 78, 52, 12, 50, 77, 91, 8,
		49, 49, 99, 40, 17, 81, 18, 57, 60, 87, 17, 40, 98, 43, 69, 48, 4, 56, 62, 0,
		81, 49, 31, 73, 55, 79, 14, 29, 93, 71, 40, 67, 53, 88, 30, 3, 49, 13, 36, 65,
		52, 70, 95, 23, 4, 60, 11, 42, 69, 24, 68, 56, 1, 32, 56, 71, 37, 2, 36, 91,
		22, 31, 16, 71, 51, 67, 63, 89, 41, 92, 36, 54, 22, 40, 40, 28, 66, 33, 13, 80,
		24, 47, 32, 60, 99, 3, 45, 2, 44, 75, 33, 53, 78, 36, 84, 20, 35, 17, 12, 50,
		32, 98, 81, 28, 64, 23, 67, 10, 26, 38, 40, 67, 59, 54, 70, 66, 18, 38, 64, 70,
		67, 26, 20, 68, 2, 62, 12, 20, 95, 63, 94, 39, 63, 8, 40, 91, 66, 49, 94, 21,
		24, 55, 58, 5, 66, 73, 99, 26, 97, 17, 78, 78, 96, 83, 14, 88, 34, 89, 63, 72,
		21, 36, 23, 9, 75, 0, 76, 44, 20, 45, 35, 14, 0, 61, 33, 97, 34, 31, 33, 95,
		78, 17, 53, 28, 22, 75, 31, 67, 15, 94, 3, 80, 4, 62, 16, 14, 9, 53, 56, 92,
		16, 39, 5, 42, 96, 35, 31, 47, 55, 58, 88, 24, 0, 17, 54, 24, 36, 29, 85, 57,
		86, 56, 0, 48, 35, 71, 89, 7, 5, 44, 44, 37, 44, 60, 21, 58, 51, 54, 17, 58,
		19, 80, 81, 68, 5, 94, 47, 69, 28, 73, 92, 13, 86, 52, 17, 77, 4, 89, 55, 40,
		4, 52, 8, 83, 97, 35, 99, 16, 7, 97, 57, 32, 16, 26, 26, 79, 33, 27, 98, 66,
		88, 36, 68, 87, 57, 62, 20, 72, 3, 46, 33, 67, 46, 55, 12, 32, 63, 93, 53, 69,
		4, 42, 16, 73, 38, 25, 39, 11, 24, 94, 72, 18, 8, 46, 29, 32, 40, 62, 76, 36,
		20, 69, 36, 41, 72, 30, 23, 88, 34, 62, 99, 69, 82, 67, 59, 85, 74, 4, 36, 16,
		20, 73, 35, 29, 78, 31, 90, 1, 74, 31, 49, 71, 48, 86, 81, 16, 23, 57, 5, 54,
		1, 70, 54, 71, 83, 51, 54, 69, 16, 92, 33, 48, 61, 43, 52, 1, 89, 19, 67, 48,
	};

	unsigned int max = 0;

	// Calculate horizontal products
	for (size_t row = 0; row < SIZE; row++)
	{
		for (size_t col = 0; col < SIZE - N; col += 2)
		{
			unsigned int first = grid[row * SIZE + col];
			unsigned int second = grid[row * SIZE + col + N];
			unsigned int sharedProduct = horzProduct(row, col, grid);
			first *= sharedProduct;
			second *= sharedProduct;
			unsigned int localMax = (first >= second) ? first : second;
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("a - row: %2u  col: %2u\n", row, col);
			// }
			if (localMax > max) max = localMax;
		}
		if (SIZE % 2 == 0)
		{
			unsigned int x = grid[row * SIZE + SIZE - N] * horzProduct(row, SIZE - N, grid);
			if (x > max) max = x;
		}
	}

	// Calculate vertical products
	for (size_t col = 0; col < SIZE; col++)
	{
		for (size_t row = 0; row < SIZE - N; row += 2)
		{
			unsigned int first = grid[row * SIZE + col];
			unsigned int second = grid[row * SIZE + col + N];
			unsigned int sharedProduct = vertProduct(row, col, grid);
			first *= sharedProduct;
			second *= sharedProduct;
			unsigned int localMax = (first >= second) ? first : second;
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("b - row: %2u  col: %2u\n", row, col);
			// }
			if (localMax > max) max = localMax;
		}
		if (SIZE % 2 == 0)
		{
			unsigned int x = grid[(SIZE - N) * SIZE + col] * vertProduct(SIZE - N, col, grid);
			if (x > max) max = x;
		}
	}

	// Diagonals (top-left to bottom-right)
	// Calculate diagonal products (left-bottom)
	for (size_t row = 0; row < SIZE - N; row++)
	{
		for (size_t offset = 0; offset < SIZE - N - row; offset += 2)
		{
			unsigned int first = grid[(row + offset) * SIZE + offset];
			unsigned int second = grid[(row + offset + N) * SIZE + offset + N];
			unsigned int sharedProduct = diagProduct(row + offset, offset, grid);
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
	for (size_t col = 1; col < SIZE - N; col++)
	{
		for (size_t offset = 0; offset < SIZE - N - col; offset += 2)
		{
			unsigned int first = grid[offset * SIZE + col + offset];
			unsigned int second = grid[(offset + N) * SIZE + col + offset + N];
			unsigned int sharedProduct = diagProduct(offset, col + offset, grid);
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
	if (SIZE % 2 == 0)
	{
		unsigned int x = grid[(SIZE-N) * SIZE + 0] * diagProduct(SIZE-N, 0, grid);
		if (x > max) max = x;

		x = grid[0 * SIZE + SIZE - N] * diagProduct(0, SIZE-N, grid);
		if (x > max) max = x;
	}

	// Diagonals (bottom-left to top-right)
	// Calculate diagonal products (left-bottom)
	for (size_t row = SIZE-1; row > N; row--)
	{
		for (size_t offset = 0; offset < 1 + row - N; offset += 2)
		{
			unsigned int first = grid[(row - offset) * SIZE + offset];
			unsigned int second = grid[(row - offset - N) * SIZE + offset + N];
			unsigned int sharedProduct = diagProduct2(row - offset, offset, grid);
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
	for (size_t col = 1; col < SIZE - N; col++)
	{
		for (size_t offset = 0; offset < SIZE - N - col; offset += 2)
		{
			unsigned int first = grid[(SIZE - offset - 1) * SIZE + col + offset];
			unsigned int second = grid[(SIZE - offset - 1 - N) * SIZE + col + offset + N];
			unsigned int sharedProduct = diagProduct2(SIZE - offset - 1, col + offset, grid);
			first *= sharedProduct;
			second *= sharedProduct;
			unsigned int localMax = (first >= second) ? first : second;
			// For debugging:
			// if (localMax > 100000000) {
			// 	printf("f - row: %2u  col: %2u\n", SIZE - offset - 1, col + offset);
			// }
			if (localMax > max) max = localMax;
		}
	}
	if (SIZE % 2 == 0)
	{
		unsigned int x = grid[N * SIZE + 0] * diagProduct2(0, N, grid);
		if (x > max) max = x;

		x = grid[(SIZE - 1) * SIZE + SIZE - N] * diagProduct2(SIZE-1, SIZE-N, grid);
		if (x > max) max = x;
	}

	printf("%u\n", max);
	return 0;
}
