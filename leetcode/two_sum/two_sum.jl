function twoSum(nums::Array{Int, 1}, target::Int)
	table = Dict(string(nums[1]) => 1)
	for i in range(2, length(nums))
		n = nums[i]
		m = get(table, string(target - n), false)
		if (m != false)
			return [i, m]
		else
			table[string(n)] = i 
		end
	end
end