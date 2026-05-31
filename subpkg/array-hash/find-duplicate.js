const meta = {
  id: 'find-duplicate',
  name: '寻找重复数',
  nameEn: 'Find the Duplicate Number',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['数组', '双指针', '快慢指针', 'Floyd判圈'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '寻找重复数问题：给定一个包含 n+1 个整数的数组，数字都在 [1, n] 范围内，只有一个数字重复出现（可能多次）。使用Floyd判圈算法（快慢指针）在 O(1) 额外空间下找到重复数。',
  defaultInput: {
    type: 'array',
    value: [1, 3, 4, 2, 2],
    label: '数组: [1,3,4,2,2]'
  }
};

function* steps(input) {
  const nums = [1, 3, 4, 2, 2];

  let slow = nums[0];
  let fast = nums[0];

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [slow], sortedIndices: [] },
    variables: { nums: [...nums], slow, fast, phase: 'init' },
    description: `Floyd判圈算法：数组 [${nums.join(', ')}]，slow=fast=nums[0]=${nums[0]}。第一阶段：找到相遇点。`
  };

  // 第一阶段：找相遇点
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [slow, fast], sortedIndices: [] },
      variables: {
        nums: [...nums],
        slow,
        fast,
        phase: 'phase1',
        description: `快慢指针移动`
      },
      description: `第一阶段：slow=nums[slow]=${slow}，fast=nums[nums[fast]]=${fast}${slow === fast ? '，相遇！' : ''}`
    };
  } while (slow !== fast);

  // 第二阶段：找入口
  let finder = nums[0];

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [slow, finder], sortedIndices: [] },
    variables: {
      nums: [...nums],
      slow,
      finder,
      phase: 'phase2_start'
    },
    description: `第一阶段完成，在 ${slow} 相遇。第二阶段：finder从起点，slow从相遇点，同步速度移动。`
  };

  while (finder !== slow) {
    finder = nums[finder];
    slow = nums[slow];

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [slow, finder], sortedIndices: [] },
      variables: {
        nums: [...nums],
        slow,
        finder,
        phase: 'phase2'
      },
      description: `第二阶段：finder=${finder}，slow=${slow}${finder === slow ? '，找到重复数！' : ''}`
    };
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [slow], sortedIndices: Array.from({ length: nums.length }, (_, i) => i) },
    variables: {
      nums: [...nums],
      duplicate: slow,
      phase: 'complete',
      complete: true
    },
    description: `找到重复数！重复的数字是 ${slow}。`
  };
}

const code = [
  'function findDuplicate(nums) {',
  '  let slow = nums[0], fast = nums[0];',
  '',
  '  do {',
  '    slow = nums[slow];',
  '    fast = nums[nums[fast]];',
  '  } while (slow !== fast);',
  '',
  '  let finder = nums[0];',
  '  while (finder !== slow) {',
  '    finder = nums[finder];',
  '    slow = nums[slow];',
  '  }',
  '',
  '  return slow;',
  '}'
];

module.exports = { meta, steps, code };
