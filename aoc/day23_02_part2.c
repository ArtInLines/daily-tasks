#include "day23_02.h"

uint32_t part2(const char *text, size_t text_size)
{
	uint32_t sum = 0;
	size_t text_offset = 0;
	while (text_offset < text_size) {
		uint32_t rmax = 0;
		uint32_t bmax = 0;
		uint32_t gmax = 0;
		SV line = split_next_sv((SV){ .str = text + text_offset, .len = text_size - text_offset }, '\n');
		// @Note: we know that every non-empty line starts with `Game xxx:`, so we can chop off the first 5 characters ('Game ')
		SV left = split_next_sv(sv_offset_by(line, 5), ':');
		uint32_t game_id = sv_to_u32(left);
		SV right = sv_offset_by(line, 5 + left.len + 1); // No need to split, because we know there's only one ':' per line

		size_t right_offset = 1;
		while (right_offset < right.len) {
			SV shown = split_next_sv2(sv_offset_by(right, right_offset), ';', ',');
			size_t num_len;
			uint32_t amount = sv_parse_u32(shown, &num_len);
			uint32_t max;
			switch (shown.str[num_len + 1]) {
				case 'r':
					if (rmax < amount) rmax = amount;
					break;
				case 'g':
					if (gmax < amount) gmax = amount;
					break;
				case 'b':
					if (bmax < amount) bmax = amount;
					break;
				default:
					printf("Unreachable: %c\n", shown.str[num_len + 1]);
					exit(1);
			}
			right_offset += shown.len + 2;
		}

		uint32_t power_set = rmax * gmax * bmax;
		// printf("power set: %d\n", power_set);
		sum += power_set;
		text_offset += line.len + 1;
	}
	return sum;
}

int main(int argc, const char *argv[])
{
	assert(argc == 2);
	size_t text_size;
	const char *text = read_complete_file(argv[1], &text_size);
	uint32_t res = part2(text, text_size);
	printf("%d\n", res);
	return 0;
}