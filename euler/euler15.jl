# S(0, n) = 1
# S(x, n) = S(x-1, n) + S(x-1, n-1) + ... S(x-1, 1) + S(x-1, 0)

# S(1, n) = n+1
# S(2, n) = n+1 + n + n-1 + n-2 + ... + 1 = (n+2)+(n+1)/2
# S(3, n) = Sum(1, n+1, i*(i+1)) / 2

# S(0, 10) = 1
# S(1, 10) = 11
# S(2, 10) = 11 + 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 = 12*11/2
#          = 66
# S(3, 10) = 12*11/2 + 11*10/2 + 10*9/2 + 9*8/2 + 8*7/2 + 7*6/2 + 6*5/2 + 5*4/2 + 4*3/2 + 3*2/2 + 2*1/2
#          = (12*11 + 11*10 + 10*9 + 9*8 + 8*7 + 7*6 + 6*5 + 5*4 + 4*3 + 3*2 + 2*1) / 2
# 		 = 286
# S(4, 10) =

# S(0, 10):
# |-|-|-|-|-|-|-|-|-|-|



function T(x, n, memo)
    if x < n
        x, n = n, x
    end
    if memo[x+1, n+1] != 0
        return memo[x+1, n+1]
    elseif x == 1
        return n + 1
    elseif x == 0
        return 1
    end
    memo[x+1, n+1] = sum(y -> T(x - 1, y, memo), 0:n)
    memo[x+1, n+1]
end

function S(x, n)
    if x < n
        x, n = n, x
    end
    T(x, n, zeros(Int64, x + 1, x + 1))
end

print(S(parse(Int64, ARGS[1]), parse(Int64, ARGS[2])))