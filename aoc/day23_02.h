#include <assert.h>
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/stat.h>

#if defined(_WIN32)
	#include <windows.h>
	#define open(name, ...)       _open(name, __VA_ARGS__)
	#define read(fd, buf, count)  _read(fd, buf, count)
	#define close(fd)             _close(fd)
#endif

char* read_complete_file(const char *fpath, size_t *size)
{
    // Adapted from https://stackoverflow.com/a/68156485/13764271
    char* out = NULL;
    *size = 0;
    int fd = open(fpath, O_RDONLY, 0777);
    if (fd == -1) goto end;
    struct stat sb;
    if (stat(fpath, &sb) == -1) goto fd_end;
    if (sb.st_size == 0) goto fd_end;
    out = malloc(sb.st_size);
    if (out == NULL) goto fd_end;
    if (read(fd, out, sb.st_size) == -1) goto fd_end;
    *size = (size_t) sb.st_size;
fd_end:
    close(fd);
end:
    return out;
}

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