const meta = {
  id: 'two-sum',
  name: '两数之和',
  nameEn: 'Two Sum',
  difficulty: 'easy',
  category: 'array-hash',
  tags: ['数组', '哈希表', '两数之和'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '两数之和问题：给定一个整数数组和一个目标值，找出数组中和为目标值的两个数的索引。使用哈希表可以做到O(n)的时间复杂度：遍历数组，对于每个元素检查目标值减去当前值是否已在哈希表中。',
  defaultInput: {
    type: 'array',
    value: [[2, 7, 11, 15], 9],
    label: '数组: [2,7,11,15], 目标: 9'
  }
};

function* steps(input) {
  const nums = [2, 7, 11, 15];
  const target = 9;
  const map = {};

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], target, map: { ...map }, phase: 'init' },
    description: `数组: [${nums.join(', ')}]，目标值: ${target}。使用哈希表存储已遍历的元素。`
  };

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        nums: [...nums],
        target,
        i,
        current: nums[i],
        complement,
        map: { ...map },
        phase: 'check'
      },
      description: `检查 nums[${i}]=${nums[i]}，需要的补数=${complement}`
    };

    if (complement in map) {
      const j = map[complement];

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i, j], sortedIndices: [i, j] },
        variables: {
          nums: [...nums],
          target,
          i, j,
          current: nums[i],
          complement,
          map: { ...map },
          phase: 'found',
          result: [j, i]
        },
        description: `找到！nums[${j}]=${complement} + nums[${i}]=${nums[i]} = ${target}，索引为 [${j}, ${i}]`
      };
      break;
    }

    map[nums[i]] = i;

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        nums: [...nums],
        target,
        i,
        current: nums[i],
        complement,
        map: { ...map },
        phase: 'store'
      },
      description: `补数 ${complement} 不在哈希表中，将 nums[${i}]=${nums[i]} 存入哈希表。当前哈希表: ${JSON.stringify(map)}`
    };
  }
}

const code = [
  'function twoSum(nums, target) {',
  '  const map = {};',
  '',
  '  for (let i = 0; i < nums.length; i++) {',
  '    const complement = target - nums[i];',
  '    if (complement in map) {',
  '      return [map[complement], i];',
  '    }',
  '    map[nums[i]] = i;',
  '  }',
  '',
  '  return [];',
  '}'
];

module.exports = { meta, steps, code };
