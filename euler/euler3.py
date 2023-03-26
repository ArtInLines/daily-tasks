# n i
# n i n
# n i n>0
# n i n i
# n i n%i
# n i n%i==0
	# n i
	# i n
	# i n i
	# i n/i
	# n/i i
# n i n%i!=0
	# n i+1

def max_prime_factor(n):
	i = 2
	while n > 1:
		if n % i == 0:
			n /= i
		else:
			i += 1
	return i

print(max_prime_factor(600851475143))