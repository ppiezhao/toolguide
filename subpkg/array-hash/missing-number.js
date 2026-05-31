const meta = {
  id: 'missing-number',
  name: '缺失数字',
  nameEn: 'Missing Number',
  difficulty: 'easy',
  category: 'array-hash',
  tags: ['数组', '位运算', 'XOR', '数学'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '缺失数字问题：给定一个包含 [0, n] 中 n 个数的数组，找出缺失的那个数。可以使用异或（XOR）运算，利用 a^a=0 和 a^0=a 的性质，将数组所有元素与 0~n 的所有数进行异或，结果就是缺失的数。',
  defaultInput: {
    type: 'array',
    value: [3, 0, 1],
    label: '数组: [3,0,1], 缺失2'
  }
};

function* steps(input) {
  const nums = [3, 0, 1];
  const n = nums.length;

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], n, phase: 'init', method: 'XOR' },
    description: `数组: [${nums.join(', ')}]，范围 [0, ${n}]，长度=${n}。使用XOR找出缺失数字。`
  };

  let xor = 0;

  for (let i = 0; i <= n; i++) {
    xor ^= i;
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      nums: [...nums],
      n,
      xor,
      phase: 'xor_range',
      rangeXor: `0^1^2^...^${n}`
    },
    description: `计算 0~${n} 的XOR值：0..${n} 的XOR = ${xor}`
  };

  for (let i = 0; i < nums.length; i++) {
    const prevXor = xor;
    xor ^= nums[i];

    yield {
      data: { type: 'array', value: [...nums] },
      highlights: { dataIndices: [i], sortedIndices: [] },
      variables: {
        nums: [...nums],
        n,
        xor,
        i,
        currentNum: nums[i],
        prevXor,
        phase: 'xor_array'
      },
      description: `XOR ^= nums[${i}]=${nums[i]}：${prevXor} ^ ${nums[i]} = ${xor}`
    };
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: Array.from({ length: n + 1 }, (_, i) => i) },
    variables: {
      nums: [...nums],
      n,
      xor,
      missing: xor,
      complete: true
    },
    description: `缺失的数字是 ${xor}。`
  };
}

const code = [
  'function missingNumber(nums) {',
  '  let xor = 0;',
  '  for (let i = 0; i <= nums.length; i++) xor ^= i;',
  '  for (const num of nums) xor ^= num;',
  '  return xor;',
  '}'
];

module.exports = { meta, steps, code };
