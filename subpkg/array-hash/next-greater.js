const meta = {
  id: 'next-greater',
  name: '下一个更大元素',
  nameEn: 'Next Greater Element',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['单调栈', '数组', '栈'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '下一个更大元素问题：给定一个数组，返回每个元素右边第一个比它大的元素。如果不存在，返回-1。使用单调栈（递减栈）维护尚未找到更大元素的索引，当前元素比栈顶大时，即为栈顶的下一个更大元素。',
  defaultInput: {
    type: 'array',
    value: [2, 1, 2, 4, 3],
    label: '数组: [2,1,2,4,3]'
  }
};

function* steps(input) {
  const nums = [2, 1, 2, 4, 3];
  const n = nums.length;
  const result = Array(n).fill(-1);
  const stack = [];

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], result: [...result], stack: [...stack], phase: 'init' },
    description: `数组: [${nums.join(', ')}]。单调递减栈，找每个元素右边第一个更大元素。`
  };

  for (let i = 0; i < n; i++) {
    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i, ...stack], sortedIndices: [] },
      variables: {
        nums: [...nums],
        result: [...result],
        stack: [...stack],
        i,
        currentVal: nums[i],
        phase: 'process'
      },
      description: `处理索引${i}（值=${nums[i]}）。当前栈: [${stack.join(', ')}]（栈中索引待定更大元素）`
    };

    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      const top = stack.pop();
      result[top] = nums[i];

      yield {
        data: { type: 'array', value: [...nums] },
        highlights: { dataIndices: [top, i], sortedIndices: [] },
        variables: {
          nums: [...nums],
          result: [...result],
          stack: [...stack],
          top,
          i,
          topVal: nums[top],
          currentVal: nums[i],
          phase: 'found'
        },
        description: `nums[${top}]=${nums[top]} < nums[${i}]=${nums[i]}，所以 result[${top}] = ${nums[i]}（下一个更大元素）。`
      };
    }

    stack.push(i);

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        nums: [...nums],
        result: [...result],
        stack: [...stack],
        i,
        phase: 'push'
      },
      description: `索引${i}（值=${nums[i]}）入栈。当前栈: [${stack.join(', ')}]，对应值: [${stack.map(idx => nums[idx]).join(', ')}]`
    };
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      nums: [...nums],
      result: [...result],
      stack: [...stack],
      complete: true
    },
    description: `计算完成！结果: [${result.join(', ')}]。栈中剩余: [${stack.join(', ')}]（这些元素右边无更大元素，值为-1）`
  };
}

const code = [
  'function nextGreaterElement(nums) {',
  '  const n = nums.length;',
  '  const result = new Array(n).fill(-1);',
  '  const stack = [];',
  '',
  '  for (let i = 0; i < n; i++) {',
  '    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {',
  '      result[stack.pop()] = nums[i];',
  '    }',
  '    stack.push(i);',
  '  }',
  '',
  '  return result;',
  '}'
];

module.exports = { meta, steps, code };
