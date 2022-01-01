#include <stdio.h>

unsigned int fibHelper(unsigned int n, unsigned int* memo) {
    if (memo[n - 1]) return memo[n - 1];
    memo[n - 1] = fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
    return memo[n - 1];
    }

unsigned int fib(unsigned int n) {
    if (n <= 2) return 1;

    unsigned int* memo = malloc((n - 1) * sizeof(unsigned int));
    unsigned int i; for (i = 2; i < n - 1; i++) memo[i] = 0;
    memo[0] = 1; memo[1] = 1;
    unsigned int res = fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
    free(memo);
    return res;
    }

void main() {
    // Testing:
    // int i;
    // for (i = 1; i <= 20; i++) printf("Fib of %d = %d\n", i, fib(i));
    }