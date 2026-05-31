const meta = {
  id: 'max-subarray',
  name: '最大子数组和（Kadane算法）',
  nameEn: 'Maximum Subarray (Kadane)',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['最大子数组', 'Kadane', '数组'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '最大子数组和问题（Kadane算法）：在整数数组中找到和最大的连续子数组并返回其和。算法维护两个变量：以当前位置结尾的最大子数组和（maxEndingHere）和全局最大和（maxSoFar）。',
  defaultInput: {
    type: 'array',
    value: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    label: '数组: [-2,1,-3,4,-1,2,1,-5,4]'
  }
};

function* steps(input) {
  const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const n = nums.length;

  let maxEndingHere = nums[0];
  let maxSoFar = nums[0];
  let start = 0, end = 0, tempStart = 0;

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [0], sortedIndices: [] },
    variables: {
      nums: [...nums],
      maxEndingHere,
      maxSoFar,
      i: 0,
      runningSum: maxEndingHere,
      phase: 'init'
    },
    description: `初始化：maxEndingHere = maxSoFar = nums[0] = ${nums[0]}。Kadane算法开始。`
  };

  for (let i = 1; i < n; i++) {
    if (nums[i] > maxEndingHere + nums[i]) {
      maxEndingHere = nums[i];
      tempStart = i;

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          nums: [...nums],
          maxEndingHere,
          maxSoFar,
          i,
          currentVal: nums[i],
          prevSum: maxEndingHere - nums[i],
          runningSum: maxEndingHere,
          decision: '重新开始',
          phase: 'restart'
        },
        description: `位置${i}（值=${nums[i]}）：重新开始，maxEndingHere = ${nums[i]}。`
      };
    } else {
      maxEndingHere += nums[i];

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i], sortedIndices: Array.from({ length: i - tempStart + 1 }, (_, j) => tempStart + j) },
        variables: {
          nums: [...nums],
          maxEndingHere,
          maxSoFar,
          i,
          currentVal: nums[i],
          runningSum: maxEndingHere,
          decision: '扩展',
          tempStart,
          currentSubarray: nums.slice(tempStart, i + 1),
          phase: 'extend'
        },
        description: `位置${i}（值=${nums[i]}）：扩展子数组 [${nums.slice(tempStart, i + 1)}]，maxEndingHere = ${maxEndingHere}。`
      };
    }

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
    }
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
      start, end,
      maxSubarray: nums.slice(start, end + 1),
      complete: true
    },
    description: `计算完成！最大子数组和为 ${maxSoFar}，子数组为 [${nums.slice(start, end + 1)}]`
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
