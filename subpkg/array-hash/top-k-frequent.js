const meta = {
  id: 'top-k-frequent',
  name: '前K个高频元素',
  nameEn: 'Top K Frequent Elements',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['哈希表', '堆', '桶排序', '数组'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '前K个高频元素问题：给定一个整数数组和一个整数 k，返回出现频率前 k 高的元素。可以使用桶排序思想，先用哈希表统计频率，再按频率放入对应桶中，最后从高频到低频遍历桶。',
  defaultInput: {
    type: 'array',
    value: [[1, 1, 1, 2, 2, 3], 2],
    label: '数组: [1,1,1,2,2,3], k=2'
  }
};

function* steps(input) {
  const nums = [1, 1, 1, 2, 2, 3];
  const k = 2;

  // 统计频率
  const freqMap = {};
  for (const num of nums) {
    freqMap[num] = (freqMap[num] || 0) + 1;
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { nums: [...nums], k, freqMap: { ...freqMap }, phase: 'freq' },
    description: `统计频率：${JSON.stringify(freqMap)}。使用桶排序思想，按频率分组。`
  };

  // 桶排序
  const buckets = Array(nums.length + 1).fill(null).map(() => []);
  for (const [num, freq] of Object.entries(freqMap)) {
    buckets[freq].push(parseInt(num));
  }

  yield {
    data: { type: 'array', value: buckets.map((b, i) => `[${i}]:[${b.join(',')}]`).filter((_, i) => buckets[i].length > 0) },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      nums: [...nums],
      k,
      freqMap: { ...freqMap },
      buckets: buckets.map(b => [...b]),
      phase: 'buckets'
    },
    description: `桶分布：${buckets.map((b, i) => b.length > 0 ? `频率${i}=> [${b.join(',')}]` : '').filter(Boolean).join('； ')}`
  };

  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    if (buckets[i].length > 0) {
      for (const num of buckets[i]) {
        if (result.length < k) {
          result.push(num);

          yield {
            data: { type: 'array', value: [...nums] },
            highlights: { dataIndices: [], sortedIndices: [] },
            variables: {
              nums: [...nums],
              k,
              freqMap: { ...freqMap },
              phase: 'collect',
              currentFreq: i,
              currentNum: num,
              result: [...result]
            },
            description: `从频率${i}桶中取出元素 ${num}，加入结果。当前结果: [${result.join(', ')}]`
          };
        }
      }
    }
  }

  yield {
    data: { type: 'array', value: [...nums] },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      nums: [...nums],
      k,
      freqMap: { ...freqMap },
      result: [...result],
      complete: true
    },
    description: `计算完成！前 ${k} 个高频元素: [${result.join(', ')}]`
  };
}

const code = [
  'function topKFrequent(nums, k) {',
  '  const freqMap = {};',
  '  for (const num of nums) freqMap[num] = (freqMap[num] || 0) + 1;',
  '',
  '  const buckets = Array(nums.length + 1).fill(null).map(() => []);',
  '  for (const [num, freq] of Object.entries(freqMap)) buckets[freq].push(+num);',
  '',
  '  const result = [];',
  '  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {',
  '    for (const num of buckets[i]) {',
  '      result.push(num);',
  '      if (result.length >= k) break;',
  '    }',
  '  }',
  '',
  '  return result;',
  '}'
];

module.exports = { meta, steps, code };
