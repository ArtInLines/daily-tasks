def two_sum(nums: list[int], target: int) -> list[int]:
	"""Returns indices of two numbers in nums, such that they add together to target. Otherwise returns None.

	Args:
		nums (int[]): Array of Integers
		target (int): Integer target
	"""
	d : dict = dict()
	m : int or None
	n : int
	for i in range(len(nums)):
		n = nums[i]
		m = d.get(target - n)
		if m is not None:
			return [i, m] if i <= m else [m, i]
		else:
			d[n] = i
	return None