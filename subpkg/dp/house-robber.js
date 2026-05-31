const meta = {
  id: 'house-robber',
  name: '打家劫舍',
  nameEn: 'House Robber',
  difficulty: 'medium',
  category: 'dp',
  tags: ['打家劫舍', '动态规划', '数组'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n) / O(1)',
  description: '打家劫舍问题：一个专业小偷计划偷窃沿街的房屋。每间房内都藏有一定的现金，但相邻的房屋有安保系统连接，如果两间相邻的房屋在同一晚上被闯入，系统会自动报警。计算在不触发警报的情况下能偷到的最高金额。',
  defaultInput: {
    type: 'array',
    value: [2, 7, 9, 3, 1],
    label: '房屋金额: [2,7,9,3,1]'
  }
};

function* steps(input) {
  const nums = Array.isArray(input) ? input : input;
  const n = nums.length;

  if (n === 0) {
    return 0;
  }

  const dp = [nums[0], Math.max(nums[0], nums[1] || 0)];

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [0, 1], sortedIndices: [] },
    variables: { nums: [...nums], dp: [...dp], n, phase: 'init' },
    description: `初始化：dp[0]=${nums[0]}（偷第0家），dp[1]=max(${nums[0]},${nums[1] || 0})=${dp[1]}（前两家选最多的）。`
  };

  for (let i = 2; i < n; i++) {
    const rob = dp[i - 2] + nums[i];
    const skip = dp[i - 1];
    dp[i] = Math.max(rob, skip);

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i, i - 1, i - 2], sortedIndices: [] },
      variables: {
        nums: [...nums],
        dp: [...dp],
        n, i,
        houseValue: nums[i],
        rob: rob,
        skip: skip,
        decision: rob >= skip ? '偷' : '不偷',
        maxAmount: dp[i]
      },
      description: `房屋${i}（金额=${nums[i]}）：偷=dp[${i - 2}]+${nums[i]}=${rob}，不偷=dp[${i - 1}]=${skip}，选择${rob >= skip ? '偷' : '不偷'}，当前最大=${dp[i]}`
    };
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [n - 1], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    variables: {
      nums: [...nums],
      dp: [...dp],
      n,
      result: dp[n - 1],
      complete: true
    },
    description: `计算完成！最多能偷 ${dp[n - 1]} 元。DP数组: [${dp.join(', ')}]`
  };
}

const code = [
  'function rob(nums) {',
  '  if (nums.length === 0) return 0;',
  '  if (nums.length === 1) return nums[0];',
  '',
  '  const dp = [nums[0], Math.max(nums[0], nums[1])];',
  '',
  '  for (let i = 2; i < nums.length; i++) {',
  '    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);',
  '  }',
  '',
  '  return dp[nums.length - 1];',
  '}'
];

module.exports = { meta, steps, code };
