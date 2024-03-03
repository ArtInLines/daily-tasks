package main

import "core:fmt"
import "core:os"
import "core:strconv"

fib :: proc(n: u64) -> u64 {
	if n < 2 do return n
	res : [dynamic]u64
	resize_dynamic_array(&res, int(n + 1))
	#no_bounds_check {
		res[0] = 0
		res[1] = 1
		for i : u64 = 2; i <= n; i += 1 {
			res[i] = res[i - 1] + res[i - 2]
		}
	}
	return res[n]
}

main :: proc() {
	if len(os.args) != 2 {
		fmt.eprintln("Invalid amount of command line arguments")
		os.exit(1)
	}
	n, ok := strconv.parse_u64(os.args[1])
	assert(ok)
	fmt.println(fib(n))
}