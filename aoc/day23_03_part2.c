#include <assert.h>
#include <stdio.h>
#include "fs.h"
#include "sv.h"

bool is_digit(char c)
{
	return c >= '0' && c <= '9';
}

bool is_sym(char c)
{
	return !is_digit(c) && c != '.' && c != '\n';
}

size_t sv_parse_u64_right_to_left(const char *s, size_t offset)
{
	size_t out  = 0;
	size_t fact = 1;
	char c;
	for (size_t i = 0; i <= offset && is_digit((c = s[offset - i])); i++) {
		out  += fact*(c - '0');
		fact *= 10;
	}
	return out;
}

void parse_nums_helper(SV text, size_t start_idx, size_t nums[], unsigned int *nums_count)
{
	size_t n = 3;
	for (size_t i = 0; *nums_count < 3 && i < n; i++) {
		if (is_digit(text.str[start_idx + i])) {
			if (i == 0) {
				size_t j = 1;
				while (j <= start_idx && is_digit(text.str[start_idx - j])) j++;
				start_idx -= (j - 1);
				n         += (j - 1);
			}
			size_t num_len;
			nums[*nums_count] = sv_parse_u32(sv_offset_by(text, start_idx + i), &num_len);
			*nums_count += 1;
			i += num_len - 1;
		}
	}
}

size_t part2(SV text)
{
	size_t sum = 0;
	size_t w = sv_index_of(text, '\n');
	size_t h = (text.len + 1) / (w + 1); // @Note: By truncating, we remove any potential empty lines that might be left at the end of the input

	for (size_t i = 0; i < h; i++) {
		for (size_t j = 0; j < w; j++) {
			size_t idx = i*(w + 1) + j;
			char c = text.str[idx];
			if (c == '*') {
				size_t nums[3] = {0};
				unsigned int nums_count = 0;

				if (j > 0     && is_digit(text.str[idx - 1])) {
					nums[nums_count++] = sv_parse_u64_right_to_left(text.str, idx - 1);
				}
				if (j < w - 1 && is_digit(text.str[idx + 1])) {
					size_t len;
					nums[nums_count++] = sv_parse_u32(sv_offset_by(text, idx + 1), &len);
					j += len - 1;
				}

				parse_nums_helper(text, idx - 1 - (w + 1), nums, &nums_count);
				parse_nums_helper(text, idx - 1 + (w + 1), nums, &nums_count);

				if (nums_count == 2) sum += nums[0] * nums[1];
			}
		}
	}

	return sum;
}

int main(int argc, const char *argv[])
{
	assert(argc == 2);
	size_t text_size;
	const char *text = read_complete_file(argv[1], &text_size);
	size_t res = part2((SV) { .str = text, .len = text_size });
	printf("%lld\n", res);
	return 0;
}