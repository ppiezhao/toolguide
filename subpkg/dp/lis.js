const meta = {
  id: 'lis',
  name: '最长递增子序列',
  nameEn: 'Longest Increasing Subsequence',
  difficulty: 'medium',
  category: 'dp',
  tags: ['LIS', '动态规划', '子序列', '递增'],
  timeComplexity: 'O(n^2)',
  spaceComplexity: 'O(n)',
  description: '最长递增子序列（LIS）问题是在一个未排序的数组中找到最长严格递增子序列的长度。子序列不要求连续。使用1D DP方法，dp[i]表示以nums[i]结尾的最长递增子序列长度。',
  defaultInput: {
    type: 'array',
    value: [10, 9, 2, 5, 3, 7, 101, 18],
    label: '数组: [10,9,2,5,3,7,101,18]'
  }
};

function* steps(input) {
  const nums = Array.isArray(input) ? input : input;
  const n = nums.length;
  const dp = Array(n).fill(1);
  const prev = Array(n).fill(-1);

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], dp: [...dp], prev: [...prev], phase: 'init' },
    description: `初始化dp数组，每个元素至少长度为1（自身）。数组: [${nums.join(', ')}]`
  };

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          prev[i] = j;

          yield {
            data: { type: 'array', value: [...nums] },
            highlights: { dataIndices: [i, j], sortedIndices: [] },
            variables: {
              nums: [...nums],
              dp: [...dp],
              prev: [...prev],
              i, j,
              valueI: nums[i],
              valueJ: nums[j],
              newLen: dp[i],
              phase: 'update'
            },
            description: `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}，更新dp[${i}]=dp[${j}]+1=${dp[i]}`
          };
        }
      }
    }

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        nums: [...nums],
        dp: [...dp],
        prev: [...prev],
        i,
        currentDp: dp[i],
        phase: 'progress'
      },
      description: `处理完nums[${i}]=${nums[i]}，dp[${i}]=${dp[i]}。当前dp数组: [${dp.join(', ')}]`
    };
  }

  const lisLength = Math.max(...dp);
  let lisEnd = dp.indexOf(lisLength);

  // 重建LIS序列
  const lisSeq = [];
  while (lisEnd !== -1) {
    lisSeq.unshift(nums[lisEnd]);
    lisEnd = prev[lisEnd];
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: lisSeq.map(v => nums.indexOf(v)), sortedIndices: [] },
    variables: {
      nums: [...nums],
      dp: [...dp],
      prev: [...prev],
      lisLength,
      lisSeq,
      complete: true
    },
    description: `计算完成！最长递增子序列长度=${lisLength}，序列: [${lisSeq.join(', ')}]`
  };
}

const code = [
  'function lengthOfLIS(nums) {',
  '  const n = nums.length;',
  '  const dp = new Array(n).fill(1);',
  '',
  '  for (let i = 0; i < n; i++) {',
  '    for (let j = 0; j < i; j++) {',
  '      if (nums[j] < nums[i]) {',
  '        dp[i] = Math.max(dp[i], dp[j] + 1);',
  '      }',
  '    }',
  '  }',
  '',
  '  return Math.max(...dp);',
  '}'
];

module.exports = { meta, steps, code };
