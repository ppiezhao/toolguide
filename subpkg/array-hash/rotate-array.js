const meta = {
  id: 'rotate-array',
  name: '轮转数组',
  nameEn: 'Rotate Array',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['数组', '翻转', '轮转'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '轮转数组问题：给定一个数组，将数组中的元素向右轮转 k 个位置。使用三次翻转法：先翻转整个数组，再翻转前 k 个元素，最后翻转剩余元素。这种方法空间复杂度为 O(1)。',
  defaultInput: {
    type: 'array',
    value: [[1, 2, 3, 4, 5, 6, 7], 3],
    label: '数组: [1,2,3,4,5,6,7], k=3'
  }
};

function* steps(input) {
  const nums = [1, 2, 3, 4, 5, 6, 7];
  const k = 3;
  const n = nums.length;
  const rotated = [...nums];

  function reverse(arr, start, end) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], k, n, phase: 'init' },
    description: `数组: [${nums.join(', ')}]，向右轮转 k=${k} 步。使用三次翻转法。`
  };

  // 第一次翻转：整个数组
  reverse(rotated, 0, n - 1);
  yield {
    data: { type: 'array', value: [...rotated] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    variables: { nums: [...rotated], k, n, phase: 'reverse_all' },
    description: `第1次翻转：翻转整个数组 [${rotated.join(', ')}]`
  };

  // 第二次翻转：前k个
  reverse(rotated, 0, k - 1);
  yield {
    data: { type: 'array', value: [...rotated] },
    highlights: { dataIndices: Array.from({ length: k }, (_, i) => i), sortedIndices: Array.from({ length: k }, (_, i) => i) },
    variables: { nums: [...rotated], k, n, phase: 'reverse_first_k' },
    description: `第2次翻转：翻转前${k}个元素 [${rotated.slice(0, k).join(', ')}] => [${rotated.join(', ')}]`
  };

  // 第三次翻转：后n-k个
  reverse(rotated, k, n - 1);
  yield {
    data: { type: 'array', value: [...rotated] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    variables: { nums: [...rotated], k, n, phase: 'reverse_rest' },
    description: `第3次翻转：翻转后${n - k}个元素 [${rotated.slice(k).join(', ')}] => [${rotated.join(', ')}]`
  };

  yield {
    data: { type: 'array', value: [...rotated] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    variables: {
      nums: [...rotated],
      original: [...nums],
      k, n,
      complete: true
    },
    description: `轮转完成！[${nums.join(', ')}] 向右轮转 ${k} 步 = [${rotated.join(', ')}]`
  };
}

const code = [
  'function rotate(nums, k) {',
  '  k %= nums.length;',
  '  function reverse(start, end) {',
  '    while (start < end) {',
  '      [nums[start], nums[end]] = [nums[end], nums[start]];',
  '      start++; end--;',
  '    }',
  '  }',
  '  reverse(0, nums.length - 1);',
  '  reverse(0, k - 1);',
  '  reverse(k, nums.length - 1);',
  '}'
];

module.exports = { meta, steps, code };
