from sys import argv

def fib(n):
	table = [0, 1]
	for _ in range(len(table), n+1):
		table.append(table[-2] + table[-1])
	return table[-1]

print(fib(int(argv[1])))