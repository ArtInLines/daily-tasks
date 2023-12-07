#include <assert.h>
#include <stdio.h>
#include "fs.h"
#include "sv.h"

bool is_sym(char c)
{
	return !(c >= '0' && c <= '9') && c != '.' && c != '\n';
}

uint32_t part1(SV text)
{
	uint32_t sum = 0;
	size_t w = sv_index_of(text, '\n');
	size_t h = (text.len + 1) / (w + 1); // @Note: By truncating, we remove any potential empty lines that might be left at the end of the input

	for (size_t i = 0; i < h; i++) {
		for (size_t j = 0; j < w; j++) {
			size_t idx = i*(w + 1) + j;
			char c = text.str[idx];
			if (c >= '0' && c <= '9') {
				size_t len;
				uint32_t num = sv_parse_u32(sv_offset_by(text, idx), &len);
				bool is_valid = (j > 0 && is_sym(text.str[idx - 1])) || (j < w - 1 && is_sym(text.str[idx + len]));
				for (size_t k = 0; !is_valid && k < len + 2; k++) {
					if (i > 0     && is_sym(text.str[idx - (w + 1) - 1 + k])) is_valid = true;
					if (i < h - 1 && is_sym(text.str[idx + (w + 1) - 1 + k])) is_valid = true;
				}
				if (is_valid) {
					// printf("%d\n", num);
					sum += num;}
				j += len - 1;
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
	uint32_t res = part1((SV) { .str = text, .len = text_size });
	printf("%d\n", res);
	return 0;
}