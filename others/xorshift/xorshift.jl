RNGState::Int32 = 0;

function xorshift()
    global RNGState ⊻= RNGState << 13
    global RNGState ⊻= RNGState >> 17
    global RNGState ⊻= RNGState << 5
    return RNGState
end

if length(ARGS) < 2
    println("Not enough arguments provided")
    println("Usage:")
    println("  <seed> <iterations>")
    println("Description:")
    println("  Seeds the RNG with `seed` and run xorshift `iterations` many times.")
    exit(1)
end

RNGState = parse(Int32, ARGS[1]);
iters = parse(Int32, ARGS[2]);

for _ in 1:iters
    xorshift()
end

println(RNGState);