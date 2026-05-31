const meta = {
  id: 'max-subarray-dp',
  name: '最大子数组和（Kadane算法）',
  nameEn: 'Maximum Subarray (Kadane)',
  difficulty: 'medium',
  category: 'dp',
  tags: ['最大子数组', 'Kadane', '动态规划'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '最大子数组和问题：在一个整数数组中找到和最大的连续子数组，并返回其和。Kadane算法使用动态规划思想，维护以每个位置结尾的最大子数组和，状态转移为 dp[i] = max(nums[i], dp[i-1] + nums[i])。',
  defaultInput: {
    type: 'array',
    value: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    label: '数组: [-2,1,-3,4,-1,2,1,-5,4]'
  }
};

function* steps(input) {
  const nums = Array.isArray(input) ? input : input;
  const n = nums.length;

  let maxEndingHere = nums[0];
  let maxSoFar = nums[0];
  let tempStart = 0;
  let start = 0, end = 0;

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [0], sortedIndices: [] },
    variables: {
      nums: [...nums],
      maxEndingHere,
      maxSoFar,
      i: 0,
      phase: 'init'
    },
    description: `初始化：maxEndingHere = maxSoFar = nums[0] = ${nums[0]}`
  };

  for (let i = 1; i < n; i++) {
    const takePrevious = maxEndingHere + nums[i];

    if (nums[i] > takePrevious) {
      maxEndingHere = nums[i];
      tempStart = i;
    } else {
      maxEndingHere = takePrevious;
    }

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
    }

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: {
        dataIndices: [i],
        sortedIndices: Array.from({ length: end - start + 1 }, (_, j) => start + j)
      },
      variables: {
        nums: [...nums],
        maxEndingHere,
        maxSoFar,
        i,
        currentNum: nums[i],
        takePrevious,
        decision: nums[i] > takePrevious ? '重新开始' : '扩展子数组',
        currentSubarray: nums.slice(tempStart, i + 1),
        bestSubarray: nums.slice(start, end + 1),
        start, end,
        phase: 'iterate'
      },
      description: `位置 ${i}（值=${nums[i]}）：maxEndingHere=max(${nums[i]}, ${maxEndingHere - nums[i]}+${nums[i]}) =${maxEndingHere}（${nums[i] > takePrevious ? '重新开始' : '扩展'}）。全局最大=${maxSoFar}，子数组=[${nums.slice(start, end + 1)}]`
    };
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: {
      dataIndices: [],
      sortedIndices: Array.from({ length: end - start + 1 }, (_, i) => start + i)
    },
    variables: {
      nums: [...nums],
      maxEndingHere,
      maxSoFar,
      start,
      end,
      maxSubarray: nums.slice(start, end + 1),
      complete: true
    },
    description: `计算完成！最大子数组和为 ${maxSoFar}，子数组为 [${nums.slice(start, end + 1)}]（从索引${start}到${end}）`
  };
}

const code = [
  'function maxSubArray(nums) {',
  '  let maxEndingHere = nums[0];',
  '  let maxSoFar = nums[0];',
  '',
  '  for (let i = 1; i < nums.length; i++) {',
  '    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);',
  '    maxSoFar = Math.max(maxSoFar, maxEndingHere);',
  '  }',
  '',
  '  return maxSoFar;',
  '}'
];

module.exports = { meta, steps, code };
