from sys import argv


def fact(n):
	res = 1
	while (n > 1):
		res *= n
		n   -= 1
	return res

def sum_digits(s):
	res = 0
	for c in s:
		res += int(c)
	return res


print(sum_digits(str(fact(int(argv[1])))))