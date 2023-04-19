function gini(X)
    n = length(X)
    s = 0
    for (i, x) in enumerate(X)
        s += i * x
    end
    den = n * sum(X)
    return 2 * s / den - (n + 1) / n
end

println(round(gini([parse(Float64, x) for x in ARGS]); digits=4))