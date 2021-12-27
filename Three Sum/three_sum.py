def three_sum(nums: list[int]) -> list[list[int]]:
    res : list[list[int]] = []
    
    for x in nums:
        for y in nums:
            # Check if duplicate list already exists in res
            for z in nums:
                if x + y + z == 0: res.append([x, y, z])