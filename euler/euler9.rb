def main(n)
	(1..(n-3)/3).each do |a|
		(a+1..(n-1-a)/2).each do |b|
			c = n - a - b
			if a*a + b*b == c*c
				return [a,b,c]
			end
		end
	end
	return nil
end

triple = main(ARGV[0].to_i(10))
print(triple[0] * triple[1] * triple[2]);