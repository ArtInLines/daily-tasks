#include <stdio.h>
#include <stdbool.h>
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