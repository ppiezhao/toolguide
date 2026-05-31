const meta = {
  id: 'product-except-self',
  name: '除自身外数组乘积',
  nameEn: 'Product of Array Except Self',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['数组', '前缀积', '后缀积'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '除自身外数组乘积问题：给定一个整数数组，返回一个新数组，每个位置的值等于原数组中除该位置外所有元素的乘积。要求不使用除法，且O(1)额外空间（输出数组不计入空间复杂度）。使用前缀积和后缀积的巧妙方法。',
  defaultInput: {
    type: 'array',
    value: [1, 2, 3, 4],
    label: '数组: [1,2,3,4]'
  }
};

function* steps(input) {
  const nums = [1, 2, 3, 4];
  const n = nums.length;
  const result = Array(n).fill(1);

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], result: [...result], phase: 'init' },
    description: `数组: [${nums.join(', ')}]。第一步：计算每个位置左侧所有元素的乘积。`
  };

  // 左侧前缀乘积
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        nums: [...nums],
        result: [...result],
        leftProduct,
        phase: 'left',
        i,
        description: `左侧乘积`
      },
      description: `前缀积阶段：result[${i}] = ${result[i]}（左侧乘积），leftProduct *= ${nums[i]} = ${leftProduct}`
    };
  }

  // 右侧后缀乘积
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [], sortedIndices: [] },
      variables: {
        nums: [...nums],
        result: [...result],
        rightProduct,
        phase: 'right',
        i
      },
      description: `后缀积阶段：result[${i}] *= ${rightProduct / nums[i]} = ${result[i]}，rightProduct *= ${nums[i]} = ${rightProduct}`
    };
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: n }, (_, i) => i) },
    variables: {
      nums: [...nums],
      result: [...result],
      complete: true
    },
    description: `计算完成！输入: [${nums.join(', ')}]，输出: [${result.join(', ')}]`
  };
}

const code = [
  'function productExceptSelf(nums) {',
  '  const n = nums.length;',
  '  const result = new Array(n).fill(1);',
  '',
  '  let leftProduct = 1;',
  '  for (let i = 0; i < n; i++) {',
  '    result[i] = leftProduct;',
  '    leftProduct *= nums[i];',
  '  }',
  '',
  '  let rightProduct = 1;',
  '  for (let i = n - 1; i >= 0; i--) {',
  '    result[i] *= rightProduct;',
  '    rightProduct *= nums[i];',
  '  }',
  '',
  '  return result;',
  '}'
];

module.exports = { meta, steps, code };
