const meta = {
  id: 'subarray-sum',
  name: '和为K的子数组',
  nameEn: 'Subarray Sum Equals K',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['数组', '哈希表', '前缀和', '子数组'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '和为K的子数组问题：给定一个整数数组和一个整数 k，计算和为 k 的连续子数组的个数。使用前缀和 + 哈希表优化，遍历时维护当前前缀和，并检查前缀和 - k 是否在哈希表中出现过。',
  defaultInput: {
    type: 'array',
    value: [[1, 2, 3], 3],
    label: '数组: [1,2,3], k=3'
  }
};

function* steps(input) {
  const nums = [1, 2, 3];
  const k = 3;
  const prefixMap = { 0: 1 };
  let prefixSum = 0;
  let count = 0;

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], k, prefixSum, count, prefixMap: { ...prefixMap }, phase: 'init' },
    description: `数组: [${nums.join(', ')}]，k=${k}。初始化prefixMap={0:1}（空前缀和）。`
  };

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    const need = prefixSum - k;

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        nums: [...nums],
        k, i,
        currentNum: nums[i],
        prefixSum,
        need,
        prefixMap: { ...prefixMap },
        phase: 'check'
      },
      description: `前缀和[0..${i}]=${prefixSum}，需要 ${need}（${prefixSum} - ${k}）。`
    };

    if (need in prefixMap) {
      const matches = prefixMap[need];
      count += matches;

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          nums: [...nums],
          k, i,
          prefixSum,
          need,
          prefixMap: { ...prefixMap },
          matches,
          count,
          phase: 'found'
        },
        description: `找到！前缀和 ${need} 出现过 ${matches} 次，增加 ${matches} 个和为${k}的子数组。当前总数=${count}。`
      };
    } else {
      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          nums: [...nums],
          k, i,
          prefixSum,
          need,
          prefixMap: { ...prefixMap },
          phase: 'not_found'
        },
        description: `前缀和 ${need} 不在哈希表中。`
      };
    }

    prefixMap[prefixSum] = (prefixMap[prefixSum] || 0) + 1;

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        nums: [...nums],
        k, i,
        prefixSum,
        prefixMap: { ...prefixMap },
        phase: 'store'
      },
      description: `将前缀和 ${prefixSum} 存入哈希表，出现次数=${prefixMap[prefixSum]}。`
    };
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      nums: [...nums],
      k,
      prefixSum,
      count,
      prefixMap: { ...prefixMap },
      complete: true
    },
    description: `计算完成！和为 ${k} 的子数组共有 ${count} 个。`
  };
}

const code = [
  'function subarraySum(nums, k) {',
  '  const prefixMap = {0: 1};',
  '  let prefixSum = 0, count = 0;',
  '',
  '  for (const num of nums) {',
  '    prefixSum += num;',
  '    const need = prefixSum - k;',
  '    if (need in prefixMap) count += prefixMap[need];',
  '    prefixMap[prefixSum] = (prefixMap[prefixSum] || 0) + 1;',
  '  }',
  '',
  '  return count;',
  '}'
];

module.exports = { meta, steps, code };
