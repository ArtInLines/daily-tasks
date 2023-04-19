def is_palindrome(x):
	x = str(x)
	l = len(x)
	for i in range(l // 2):
		if x[i] != x[l - i - 1]:
			return False
	return True

from sys import argv
if is_palindrome(int(argv[1])):
	print("t")
else:
	print("f")