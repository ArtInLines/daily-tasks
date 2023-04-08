function lorenz(a)
    sort!(a)
    s = sum(a)
    l = length(a)
    ea = enumerate(a)
    return [[i / l for (i, _) in ea], [sum(a[1:i]) / s for (i, _) in ea]]
end

function gini(a)
    (u, v) = lorenz(a)
    l = length(u)
    if l <= 2
        return 0
    end
    w = u[1]
    firs = w / 2 * (u[1] - v[1])
    las = w * (u[l-2] - v[l-2]) + w / 2 * (u[l-1] - u[l-2]) - w / 2 * (v[l-1] - v[l-2])
    s = firs + las
    for i = 2:(l-1)
        s += w / 2 * (u[i-1] - v[i-1] + u[i] - v[i])
    end
    return s
end

println(round(gini([parse(Float64, x) for x in ARGS]); digits=3))