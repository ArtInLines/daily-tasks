#include <assert.h>
#include <stdio.h>
#include "fs.h"
#include "sv.h"

uint32_t part1(SV text)
{
	uint32_t sum = 0;
	size_t w = sv_index_of(text, '\n');
	size_t h = (text.len + 1) / (w + 1); // @Note: By truncating, we remove any potential empty lines that might be left at the end of the input
	size_t row_start = sv_index_of(text, ':') + 1;
	size_t sep_idx = sv_index_of(text, '|');

	for (size_t i = 0; i < h; i++) {
		uint8_t arr[100] = {0};
		uint32_t points  = 0;
		size_t row = i*(w + 1);
		SV left = {
			.str = text.str + row + row_start,
			.len = sep_idx - row_start,
		};
		SV right = {
			.str = text.str + row + sep_idx + 1,
			.len = w - sep_idx - 1,
		};

		size_t j = 0;
		while (j < left.len) {
			if (left.str[j] == ' ') j++;
			else {
				size_t num_len;
				uint32_t num = sv_parse_u32(sv_offset_by(left, j), &num_len);
				arr[num] = 1;
				j += num_len;
			}
		}

		j = 0;
		while (j < right.len) {
			if (right.str[j] == ' ') j++;
			else {
				size_t num_len;
				uint32_t num = sv_parse_u32(sv_offset_by(right, j), &num_len);
				if (arr[num]) points = (points == 0) + (points << 1);
				j += num_len;
			}
		}
		sum += points;
	}

	return sum;
}

int main(int argc, const char *argv[])
{
	assert(argc == 2);
	size_t text_size;
	const char *text = read_complete_file(argv[1], &text_size);
	uint32_t res = part1((SV) { .str = text, .len = text_size });
	printf("%d\n", res);
	return 0;
}