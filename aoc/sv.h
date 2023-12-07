#include <stdbool.h>
#include <stdint.h>

typedef struct SV {
	const char *str;
	size_t len;
} SV;

SV split_next_str(const char *s, char split_by)
{
	size_t i = 0;
	while (s[i] != 0 && s[i] != split_by) i++;
	return (SV) {
		.str = s,
		.len = i,
	};
}

SV split_next_sv(SV sv, char split_by)
{
	size_t i = 0;
	while (i < sv.len && sv.str[i] != split_by) i++;
	return (SV) {
		.str = sv.str,
		.len = i,
	};
}

SV split_next_sv2(SV sv, char split_by1, char split_by2)
{
	size_t i = 0;
	while (i < sv.len && sv.str[i] != split_by1 && sv.str[i] != split_by2) i++;
	return (SV) {
		.str = sv.str,
		.len = i,
	};
}

SV sv_offset_by(SV sv, size_t offset)
{
	return (SV) {
		.str = sv.str + offset,
		.len = sv.len - offset,
	};
}

uint32_t sv_to_u32(SV sv)
{
	uint32_t out = 0;
	for (size_t i = 0; i < sv.len; i++) {
		out *= 10;
		out += sv.str[i] - '0';
	}
	return out;
}

uint32_t sv_parse_u32(SV sv, size_t *len)
{
	uint32_t out = 0;
	size_t i = 0;
	for (; i < sv.len && sv.str[i] >= '0' && sv.str[i] <= '9'; i++) {
		out *= 10;
		out += sv.str[i] - '0';
	}
	*len = i;
	return out;
}

size_t sv_index_of(SV sv, char c)
{
	size_t i = 0;
	while (i < sv.len && sv.str[i] != c) i++;
	return i;
}