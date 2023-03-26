function ∀(p::Function, l::Vector, n::UInt)
    i::UInt32 = 1
    while i <= n
        if !p(l[i])
            return false
        end
        i += 1
    end
    return true
end

function nthPrime(n::UInt)
    if n == 1
        return 2
    end
    primes = Vector{UInt64}(undef, n - 1)
    c::UInt = 1
    i::UInt64 = 3
    while true
        if ∀(p -> (i % p != 0), primes, c - 1)
            primes[c] = i
            c += 1
            if c >= n
                return i
            end
        end
        i += 2
    end
end

n::UInt = 10001
print(nthPrime(n))