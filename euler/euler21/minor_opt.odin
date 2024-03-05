package main

import "core:fmt"
import "core:os"
import "core:strconv"

divisor_sum :: proc(n: u64) -> u64 {
	assert(n > 1)
	res: u64 = 1
	max := n
	for i: u64 = 2; i < max; i += 1 {
		if n % i == 0 {
			max = n / i
			res += i + max
		}
	}
	return res
}

amicable_sum :: proc(max: u64) -> u64 {
	res: u64 = 0
	table: map[u64]u64
	defer delete(table)
	for i: u64 = 2; i < max; i += 1 {
		x := divisor_sum(i)
		if x < i && table[x] == i {
			res += x + i
		} else {
			table[i] = x
		}
	}
	return res
}

main :: proc() {
	if len(os.args) != 2 {
		fmt.eprintln("Invalid amount of command line arguments")
		os.exit(1)
	}
	n, ok := strconv.parse_u64(os.args[1])
	assert(ok)
	fmt.println(amicable_sum(u64(n)))
}