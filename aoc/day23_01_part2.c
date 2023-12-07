#include <stdio.h>
#include <stdbool.h>
#include "fs.h"

typedef struct SV {
	const char *s;
	size_t len;
} SV;

static const SV written_digits[] = {
	{"one"  , 3},
	{"two"  , 3},
	{"three", 5},
	{"four" , 4},
	{"five" , 4},
	{"six"  , 3},
	{"seven", 5},
	{"eight", 5},
	{"nine" , 4},
};

bool unsafe_starts_with(const char *restrict str, const char *restrict prefix)
{
	while (*prefix != 0 && *prefix == *str) {
		prefix++;
		str++;
	}
	return *prefix == 0;
}

size_t part2(const char *text, size_t text_size)
{
#define set_digit(c) do { if (!first_digit) { first_digit = (c); } last_digit = (c); } while(0)
	size_t sum = 0;
	char first_digit = 0;
	char last_digit;
	for (size_t i = 0; i < text_size; i++) {
		char c = text[i];
		if (c >= '0' && c <= '9') {
			set_digit(c);
		} else if (c == '\n') {
			sum += 10 * (first_digit - '0') + last_digit - '0';
			first_digit = 0;
		} else {
			for (size_t j = 0; j < sizeof(written_digits)/sizeof(written_digits[0]); j++) {
				SV wd = written_digits[j];
				if (text_size - i >= wd.len && unsafe_starts_with(text + i, wd.s)) {
					set_digit('0' + j + 1);
					break;
				}
			}
		}
	}
	if (first_digit) sum += 10 * (first_digit - '0') + last_digit - '0';
	return sum;
}

int main(int argc, char const *argv[])
{
	size_t text_size;
	const char *text = read_complete_file(argv[1], &text_size);
	size_t res = part2(text, text_size);
	printf("%lld\n", res);
	return 0;
}