/**
 * 计数排序 - Counting Sort
 *
 * 非比较排序，统计每个元素出现次数，按顺序输出。
 * 时间复杂度: O(n+k)  空间复杂度: O(k)  稳定排序
 */

const meta = {
  id: 'counting-sort',
  name: '计数排序',
  nameEn: 'Counting Sort',
  difficulty: 'medium',
  category: 'sorting',
  tags: ['排序', '非比较', '计数', '稳定'],
  timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)' },
  spaceComplexity: 'O(k)',
  stable: true,

  description:
    '计数排序（Counting Sort）是一种非比较型排序算法。' +
    '它通过统计每个元素在数组中出现的次数，' +
    '然后根据计数信息将元素放到正确的位置上。\n\n' +
    '计数排序适用于小范围整数的排序，' +
    '其时间复杂度为 O(n+k)，其中 k 是数据范围。' +
    '当 k=O(n) 时，计数排序的时间复杂度为 O(n)，' +
    '比任何比较排序算法都快。',

  defaultInput: {
    type: 'array',
    value: [4, 2, 2, 8, 3, 3, 1, 5, 7, 6],
    label: '待排序数组（非负整数）'
  }
};

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { n, max: '-', stage: 'init' },
    description: `开始计数排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  // 找到最大值
  const maxVal = Math.max(...arr);

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [] },
    variables: { n, max: maxVal, stage: 'find-max' },
    description: `找到最大值 max=${maxVal}，计数数组长度为 ${maxVal + 1}`
  };

  // 初始化计数数组
  const count = new Array(maxVal + 1).fill(0);

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [3], dataIndices: [] },
    variables: { n, max: maxVal, count: `[${count.join(', ')}]`, stage: 'init-count' },
    description: `创建计数数组 count，长度为 ${maxVal + 1}，全部初始化为 0`
  };

  // 统计每个元素出现次数
  for (let i = 0; i < n; i++) {
    count[arr[i]]++;

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [5, 6], dataIndices: [i] },
      variables: { n, max: maxVal, i, value: arr[i], count: `[${count.join(', ')}]`, stage: 'count' },
      description: `统计 arr[${i}]=${arr[i]}，count[${arr[i]}]++ = ${count[arr[i]]}`
    };
  }

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [5], dataIndices: [] },
    variables: { n, max: maxVal, count: `[${count.join(', ')}]`, stage: 'count-done' },
    description: `计数完成！count = [${count.join(', ')}]，表示各数字出现次数`
  };

  // 计算累计计数（实现稳定排序）
  for (let i = 1; i <= maxVal; i++) {
    count[i] += count[i - 1];
  }

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [8, 9], dataIndices: [] },
    variables: { n, max: maxVal, count: `[${count.join(', ')}]`, stage: 'prefix-sum' },
    description: `计算前缀和，count = [${count.join(', ')}]，表示每个数字的最终位置`
  };

  // 构建输出数组
  const output = new Array(n);

  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const pos = count[val] - 1;
    output[pos] = val;
    count[val]--;

    yield {
      data: { type: 'array', value: [...output.filter(v => v !== undefined)] },
      highlights: { codeLines: [11, 12, 13], dataIndices: [pos] },
      variables: { n, max: maxVal, i, val, pos, count: `[${count.join(', ')}]`, stage: 'place' },
      description: `将 arr[${i}]=${val} 放到 output[${pos}]`
    };
  }

  // 复制回原数组
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [16], dataIndices: [], sortedIndices: allSorted },
    variables: { n, max: maxVal, stage: 'complete' },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function countingSort(arr) {',
  '  const n = arr.length;',
  '  const max = Math.max(...arr);',
  '  const count = new Array(max + 1).fill(0);',
  '  for (let i = 0; i < n; i++) {',
  '    count[arr[i]]++;',
  '  }',
  '  for (let i = 1; i <= max; i++) {',
  '    count[i] += count[i - 1];',
  '  }',
  '  const output = new Array(n);',
  '  for (let i = n - 1; i >= 0; i--) {',
  '    const val = arr[i];',
  '    output[count[val] - 1] = val;',
  '    count[val]--;',
  '  }',
  '  return output;',
  '}'
];

module.exports = { meta, steps, code };
