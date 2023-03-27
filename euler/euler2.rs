struct Fib {
    curr: usize,
    prev: usize,
    max: usize,
}

impl Fib {
    fn new(max: usize) -> Self {
        Self {
            curr: 1,
            prev: 0,
            max,
        }
    }
}

impl Iterator for Fib {
    type Item = usize;

    fn next(&mut self) -> Option<Self::Item> {
        let tmp = self.curr;
        self.curr = self.curr + self.prev;
        self.prev = tmp;
        if self.curr > self.max {
            None
        } else {
            Some(self.curr)
        }
    }
}

fn sum_filtered_fib(max: usize, div_by: usize) -> usize {
    Fib::new(max)
        .filter(|x| x % div_by == 0)
        .fold(0, |acc, x| acc + x)
}

use std::env;
use std::str::FromStr;

fn main() {
    let args: Vec<String> = env::args().collect();
    let args = &args[1..];
    let args: Vec<usize> = args.iter().map(|x| usize::from_str(&x).unwrap()).collect();
    let res = sum_filtered_fib(args[0], args[1]);
    println!("{}", res);
}
