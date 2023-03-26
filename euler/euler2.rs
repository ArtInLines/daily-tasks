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

fn main() {
    let res = Fib::new(4_000_000)
        .filter(|x| x % 2 == 0)
        .fold(0, |acc, x| acc + x);
    println!("{}", res);
}
