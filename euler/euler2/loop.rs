fn sum_filtered_fib(max: u64, div_by: u64) -> u64 {
    let mut res = 0;
    let mut last = 0;
    let mut curr = 1;
    let mut tmp;

    while (curr <= max) {
        if (curr % div_by == 0) {
            res += curr;
        }
        tmp = curr;
        curr += last;
        last = tmp;
    }

    return res;
}

use std::env;
use std::str::FromStr;

fn main() {
    let args: Vec<String> = env::args().collect();
    let args = &args[1..];
    let args: Vec<u64> = args.iter().map(|x| u64::from_str(&x).unwrap()).collect();
    let res = sum_filtered_fib(args[0], args[1]);
    println!("{}", res);
}
