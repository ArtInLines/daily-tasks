#include <stdio.h>

long long sum_filtered_fib(long long max, long long div_by) {
    long long res = 0;
    long long last = 0;
    long long curr = 1;
    long long tmp;

    while (curr <= max) {
        if (curr % div_by == 0) {
            res += curr;
        }
        tmp = curr;
        curr += last;
        last = tmp;
    }

    return res;
}

int main(int argc, char const *argv[])
{
	int res = sum_filtered_fib(atoll(argv[1]), atoll(argv[2]));
	printf("%d\n", res);
	return 0;
}
