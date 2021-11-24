# @param {Integer[]} nums
# @param {Integer} target
# @return {Integer[]}
def two_sum(nums, target)
    hash = {}
    nums.each_index do |i|
        x = target - nums[i]
        return [hash[x], i] if hash.has_key?(x)
        hash[nums[i]]= i
    end
    return nil
end


# Faster Solution:
# # @param {Integer[]} nums
# # @param {Integer} target
# # @return {Integer[]}
# def two_sum(nums, target)
#     complement_index = {}
#     nums.each_with_index do |num, index|
#         if complement_index[num]
#             return [index, complement_index[num]]
#         else
#             complement_index[target - num] = index 
#         end
#     end
# end

