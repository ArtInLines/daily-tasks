#include <stdio.h>
#include <stdbool.h>

bool isPalindrome(int x)
{
	if(x < 0 || (x != 0 && x % 10 == 0)) return false;

	long int rev = 0;
	while(x > rev) {
		rev = rev * 10 + x % 10;
		x /= 10;
	}

	return (x == rev || x == rev / 10);
}

int main(int argc, char const *argv[])
{
	bool res = isPalindrome(atoi(argv[1]));
	if (res) printf("t\n");
	else printf("f\n");
	return 0;
}