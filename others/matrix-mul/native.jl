RNGState::Int32 = 0;

function matMul(A::Matrix{Int32}, B::Matrix{Int32})::Matrix{Int32}
    return A * B
end

function xorshift()
    global RNGState ⊻= RNGState << 13
    global RNGState ⊻= RNGState >> 17
    global RNGState ⊻= RNGState << 5
    return RNGState
end

function printMat(A::Matrix{Int32})
    for row in eachrow(A)
        for x in row
            print(x)
            print(" ")
        end
        print("\n")
    end
end

function randMat(rows::Int32, cols::Int32, limit::Int32)::Matrix{Int32}
    A = Matrix{Int32}(undef, rows, cols)
    for i in 1:rows
        for j in 1:cols
            A[i, j] = xorshift() % limit
        end
    end
    return A
end



if length(ARGS) < 3
    println("Not enough arguments provided")
    println("Usage:")
    println("  <seed> <limit> <n> ['s']")
    println("Description:")
    println("  Multiplies two square matrices A and B and outputs the result. A and B are both n x n matrices.")
    println("  The matrices A and B are filled with random numbers. The random number generator must be Xorshift (https://en.wikipedia.org/wiki/Xorshift). seed gives the starting state of the number generator.")
    println("  The 's' flag is an optional last parameter. When provided, no output will be printed, though all the calculations will be done regardless.")
    exit(1)
end

RNGState = parse(Int32, ARGS[1]);
limit = parse(Int32, ARGS[2]);
n = parse(Int32, ARGS[3]);
silent = false;
if length(ARGS) >= 4 && startswith(ARGS[4], "s")
    silent = true
end

A = randMat(n, n, limit);
B = randMat(n, n, limit);

C = matMul(A, B)

if !silent
    # printMat(A)
    # println()
    # printMat(B)
    # println()
    printMat(C)
end