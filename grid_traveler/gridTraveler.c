#include <stdio.h>
#include <stdlib.h>

int gridTravelerHelper(int m, int n, int* memo)
{
    if (m == 1 && n == 1) return 1;
}

int gridTraveler(int m, int n)
{
    if (m == 1 && n == 1) return 1;
    if (m <= 0 || n <= 0) return 0;

    // TO CONTINUE WORKING ON:
    int* memo = malloc((m - 1) * (n - 1) * sizeof(int));
    int i, j; for (i = 1; i < m; i++) for (j = 1; j < n; j++) memo[i * j] = 0;
    memo[0] = 1;
    int res = gridTravelerHelper(m, n, memo);
    free(memo);
    return res;
}

int main(int argc, char const *argv[])
{
	int res = gridTraveler(atoi(argv[1]), atoi(argv[2]));
	printf("%d\n", res);
	return 0;
}