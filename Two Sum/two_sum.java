import java.util.Hashtable;

class Solution {
	public int[] twoSum(int[] nums, int target) {
		Hashtable<Integer, Integer> table = new Hashtable<Integer, Integer>();
		table.put(Integer.valueOf(nums[0]), Integer.valueOf(0));
		
		Integer m;
		for (int i = 1; i < nums.length; i++) {
			try {	
				m = table.get(Integer.valueOf(target - nums[i]));
				int[] res = {i, m.intValue()};
				return res;
			} catch (Exception e) {
				table.put(Integer.valueOf(nums[i]), Integer.valueOf(i));
			}
		}
		return null;
	}
}