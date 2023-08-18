#include <stdio.h>

int longestValidParentheses(char * s){
    int maxLen  = 0,
        len     = 0,
        i       = 0,
        j, openParans;

    while (s[i]) {
        if (s[i] == '(') {
            j = i + 1;
            openParans = 1;
            while (s[j] && openParans) {
                openParans += 2*(s[j] == '(') - 1;
                j++;
            }
            if (!openParans) {
                if ((len += j - i) > maxLen) maxLen = len;
                i = j;
            } else {
                len = 0;
                i++;
            }
        } else {
            len = 0;
            i++;
        }
    }

    return maxLen;
}

int main(int argc, char const *argv[])
{
	int res = longestValidParentheses(argv[1]);
	printf("%d\n", res);
	return 0;
}
