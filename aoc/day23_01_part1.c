#include <stdio.h>
#include <stdbool.h>
#include "fs.h"

size_t part1(const char **lines, int line_count)
{
	size_t sum = 0;
	for (size_t i = 0; i < line_count; i++) {
		const char *line = lines[i];
		char first_digit = 0;
		char last_digit;
		for (size_t j = 0; line[j] != 0; j++) {
			char c = line[j];
			if (c >= '0' && c <= '9') {
				if (!first_digit) first_digit = c;
				last_digit = c;
			}
		}
		sum += 10 * (first_digit - '0') + last_digit - '0';
	}
	return sum;
}

int main(int argc, char const *argv[])
{
	size_t res = part1(argv + 1, argc - 1);
	printf("%lld\n", res);
	return 0;
}