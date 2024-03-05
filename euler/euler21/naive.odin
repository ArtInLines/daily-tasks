package main

import "core:fmt"
import "core:os"
import "core:strconv"

divisors :: proc(n: u64) -> [dynamic]u64 {
	res: [dynamic]u64
	assert(n > 1)
	append(&res, 1)
	max := n
	i: u64 = 2
	for i < max {
		if n % i == 0 {
			max = n / i
			append(&res, i, n / i)
		}
		i += 1
	}
	return res
}

amicables :: proc(max: u64) -> [dynamic]u64 {
	res: [dynamic]u64
	table := make([]u64, max)
	for i: u64 = 2; i < max; i += 1 {
		xs := divisors(i)
		x  := sum(xs[:])
		delete(xs)
		table[i] = x
		if x < i && table[x] == i {
			append(&res, x, i)
		}
	}
	delete(table)
	return res
}

sum :: proc(xs: []u64) -> u64 {
	s: u64 = 0
	for x in xs do s += x
	return s
}

main :: proc() {
	if len(os.args) != 2 {
		fmt.eprintln("Invalid amount of command line arguments")
		os.exit(1)
	}
	n, ok := strconv.parse_u64(os.args[1])
	assert(ok)
	fmt.println(sum(amicables(u64(n))[:]))
}