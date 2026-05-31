const meta = {
  id: 'sliding-window-max',
  name: '滑动窗口最大值',
  nameEn: 'Sliding Window Maximum',
  difficulty: 'hard',
  category: 'array-hash',
  tags: ['滑动窗口', '双端队列', '数组'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(k)',
  description: '滑动窗口最大值问题：给定一个整数数组和一个大小为k的滑动窗口，窗口从左到右每次移动一个位置，返回每个窗口中的最大值。使用双端队列（deque）维护窗口内可能成为最大值的元素索引。',
  defaultInput: {
    type: 'array',
    value: [[1, 3, -1, -3, 5, 3, 6, 7], 3],
    label: '数组: [1,3,-1,-3,5,3,6,7], k=3'
  }
};

function* steps(input) {
  const nums = [1, 3, -1, -3, 5, 3, 6, 7];
  const k = 3;
  const deque = [];
  const result = [];

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], k, deque: [...deque], result: [...result], phase: 'init' },
    description: `滑动窗口最大值：数组 [${nums.join(', ')}]，窗口大小 k=${k}。`
  };

  for (let i = 0; i < nums.length; i++) {
    // 移除不在窗口内的元素
    if (deque.length > 0 && deque[0] <= i - k) {
      const removed = deque.shift();

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: deque, sortedIndices: Array.from({ length: Math.min(i, k) }, (_, j) => Math.max(0, i - k + 1) + j) },
        variables: {
          nums: [...nums],
          k, i,
          deque: [...deque],
          result: [...result],
          removed,
          phase: 'remove_out',
          window: nums.slice(Math.max(0, i - k + 1), i + 1)
        },
        description: `索引${removed}（值=${nums[removed]}）移出窗口范围，从队首移除。`
      };
    }

    // 移除队列中比当前元素小的
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      const removed = deque.pop();

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [i, ...deque], sortedIndices: Array.from({ length: Math.min(i + 1, k) }, (_, j) => Math.max(0, i - k + 1) + j) },
        variables: {
          nums: [...nums],
          k, i,
          deque: [...deque],
          result: [...result],
          removed,
          removedVal: nums[removed],
          currentVal: nums[i],
          phase: 'trim_deque',
          window: nums.slice(Math.max(0, i - k + 1), i + 1)
        },
        description: `nums[${removed}]=${nums[removed]} < nums[${i}]=${nums[i]}，从队尾移除。`
      };
    }

    deque.push(i);

    // 形成窗口
    if (i >= k - 1) {
      result.push(nums[deque[0]]);

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [deque[0], ...deque.slice(1)], sortedIndices: Array.from({ length: k }, (_, j) => i - k + 1 + j) },
        variables: {
          nums: [...nums],
          k, i,
          deque: [...deque],
          result: [...result],
          maxVal: nums[deque[0]],
          maxIdx: deque[0],
          window: nums.slice(i - k + 1, i + 1),
          phase: 'window_max'
        },
        description: `窗口 [${i - k + 1}, ${i}]：${JSON.stringify(nums.slice(i - k + 1, i + 1))}，最大值=${nums[deque[0]]}（索引${deque[0]}）。结果: [${result}]`
      };
    } else {
      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: deque, sortedIndices: [] },
        variables: {
          nums: [...nums],
          k, i,
          deque: [...deque],
          result: [...result],
          phase: 'building'
        },
        description: `索引${i}加入队列，窗口尚未形成（还需 ${k - 1 - i} 个元素）。`
      };
    }
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: nums.length }, (_, i) => i) },
    variables: {
      nums: [...nums],
      k,
      deque: [...deque],
      result: [...result],
      complete: true
    },
    description: `计算完成！滑动窗口最大值: [${result.join(', ')}]`
  };
}

const code = [
  'function maxSlidingWindow(nums, k) {',
  '  const deque = [], result = [];',
  '',
  '  for (let i = 0; i < nums.length; i++) {',
  '    if (deque.length > 0 && deque[0] <= i - k) deque.shift();',
  '    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) deque.pop();',
  '    deque.push(i);',
  '    if (i >= k - 1) result.push(nums[deque[0]]);',
  '  }',
  '',
  '  return result;',
  '}'
];

module.exports = { meta, steps, code };
