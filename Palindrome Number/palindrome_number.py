def palindrome_number(x):
	x = str(x)
	l = len(x)
	for i in range(l // 2):
		if x[i] != x[l - i - 1]:
			return False
	return True