const std = @import("std");

pub fn sum(n: u32) u32 {
	return n*(n + 1)/2;
}

// Basically the inverse of sum(n). Meaning we know the sum and figure out n
// I couldn't think of a clever formula to find n directly, so we just iterate
// through the different possibilites until we find the correct n
pub fn getRowAmount(x: u32) u32 {
	var s = @as(u32, 0);
	var n = @as(u32, 0);
	while (s < x) {
		s += n;
		n += 1;
	}
	if (s != x) {
		std.debug.print("Failue in calculating amount of rows from input", .{});
		std.process.exit(1);
	}
	return n;
}

pub fn getMaxSum(args: []u32, depth: u32, row: u32, col: u32, curr: u32, max: u32) u32 {
	const i        = sum(row) + col;
	if (i >= args.len) return max;
	var   mx       = max;
	const new_curr = curr + args[i];
	if (new_curr > max) mx = new_curr;
	const pot = (depth - row)*99 + new_curr;
	if (depth > row and pot > mx) {
		const l = getMaxSum(args, depth, row + 1, col, new_curr, mx);
		if (l > mx) mx = l;
		const r = getMaxSum(args, depth, row + 1, col + 1, new_curr, mx);
		if (r > mx) mx = r;
	}
	return mx;
}

pub fn main() !void {
	const alloc    = std.heap.page_allocator;
	var   argsIter = try std.process.argsWithAllocator(alloc);
	var   args     = std.ArrayList(u32).init(alloc);
	defer args.clearAndFree();
	_          = argsIter.skip();
	var   arg  = argsIter.next();
	const stdout = std.io.getStdOut().writer();
	while (arg) |x| {
		const num = try std.fmt.parseInt(u32, x, 10);
		try args.append(num);
		arg       = argsIter.next();
	}
	argsIter.deinit();

	const depth  = getRowAmount(@intCast(args.items.len));
	const max    = getMaxSum(args.items, depth, 0, 0, 0, 0);
    try stdout.print("{d}\n", .{max});
}