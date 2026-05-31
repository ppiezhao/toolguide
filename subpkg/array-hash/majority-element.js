const meta = {
  id: 'majority-element',
  name: '多数元素',
  nameEn: 'Majority Element',
  difficulty: 'easy',
  category: 'array-hash',
  tags: ['数组', '摩尔投票', 'Boyer-Moore'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '多数元素问题：给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数大于 n/2 的元素。使用Boyer-Moore投票算法，维护一个候选元素和计数器，不同元素则抵消，相同元素则累加。',
  defaultInput: {
    type: 'array',
    value: [2, 2, 1, 1, 1, 2, 2],
    label: '数组: [2,2,1,1,1,2,2]'
  }
};

function* steps(input) {
  const nums = [2, 2, 1, 1, 1, 2, 2];
  let candidate = nums[0];
  let count = 1;

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [0], sortedIndices: [] },
    variables: { nums: [...nums], candidate, count, phase: 'init' },
    description: `Boyer-Moore投票算法：候选=${candidate}（nums[0]），计数=1。`
  };

  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
      count = 1;

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          nums: [...nums],
          candidate,
          count,
          i,
          currentNum: nums[i],
          phase: 'new_candidate'
        },
        description: `计数归零，更新候选为 nums[${i}]=${nums[i]}，计数=1。`
      };
    } else if (nums[i] === candidate) {
      count++;

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          nums: [...nums],
          candidate,
          count,
          i,
          currentNum: nums[i],
          phase: 'same'
        },
        description: `nums[${i}]=${nums[i]} == 候选${candidate}，计数+1 = ${count}。`
      };
    } else {
      count--;

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          nums: [...nums],
          candidate,
          count,
          i,
          currentNum: nums[i],
          phase: 'different'
        },
        description: `nums[${i}]=${nums[i]} != 候选${candidate}，计数-1 = ${count}。`
      };
    }
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: nums.length }, (_, i) => i) },
    variables: {
      nums: [...nums],
      candidate,
      count,
      majority: candidate,
      complete: true
    },
    description: `投票完成！多数元素是 ${candidate}。`
  };
}

const code = [
  'function majorityElement(nums) {',
  '  let candidate = nums[0];',
  '  let count = 1;',
  '',
  '  for (let i = 1; i < nums.length; i++) {',
  '    if (count === 0) {',
  '      candidate = nums[i];',
  '      count = 1;',
  '    } else if (nums[i] === candidate) {',
  '      count++;',
  '    } else {',
  '      count--;',
  '    }',
  '  }',
  '',
  '  return candidate;',
  '}'
];

module.exports = { meta, steps, code };
