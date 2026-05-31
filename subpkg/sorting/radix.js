/**
 * 基数排序 - Radix Sort (LSD)
 *
 * 按位进行排序，从最低有效位到最高有效位，每位使用计数排序。
 * 时间复杂度: O(d*(n+k))  空间复杂度: O(n+k)  稳定排序
 */

const meta = {
  id: 'radix-sort',
  name: '基数排序',
  nameEn: 'Radix Sort',
  difficulty: 'hard',
  category: 'sorting',
  tags: ['排序', '非比较', '基数', '稳定', '按位'],
  timeComplexity: { best: 'O(d*(n+k))', average: 'O(d*(n+k))', worst: 'O(d*(n+k))' },
  spaceComplexity: 'O(n+k)',
  stable: true,

  description:
    '基数排序（Radix Sort）是一种非比较型整数排序算法。' +
    '其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。\n\n' +
    '这里实现 LSD（Least Significant Digit）基数排序，' +
    '即从最低位（个位）开始，向最高位逐位排序。' +
    '每一位的排序采用计数排序作为稳定排序的子程序。',

  defaultInput: {
    type: 'array',
    value: [170, 45, 75, 90, 802, 24, 2, 66],
    label: '待排序数组（正整数）'
  }
};

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { n, max: '-', exp: 1, stage: 'init' },
    description: `开始基数排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  // 找到最大值确定位数
  const maxVal = Math.max(...arr);

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [] },
    variables: { n, max: maxVal, exp: 1, stage: 'find-max' },
    description: `最大值为 ${maxVal}，最大位数为 ${maxVal.toString().length} 位`
  };

  let exp = 1;

  while (Math.floor(maxVal / exp) > 0) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [4], dataIndices: [] },
      variables: { n, max: maxVal, exp, stage: 'digit' },
      description: `========== 按 ${exp} 位（${exp === 1 ? '个' : exp === 10 ? '十' : '百'}位）排序 ==========`
    };

    // 计数排序 - 按当前位
    const count = new Array(10).fill(0);

    // 统计当前位的频率
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [7, 8], dataIndices: [i] },
        variables: { n, exp, i, value: arr[i], digit, count: `[${count.join(', ')}]`, stage: 'count-digit' },
        description: `arr[${i}]=${arr[i]}，当前位数字 = ${digit}，count[${digit}]++ = ${count[digit]}`
      };
    }

    // 前缀和
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [10, 11], dataIndices: [] },
      variables: { n, exp, count: `[${count.join(', ')}]`, stage: 'prefix' },
      description: `前缀和完成，count = [${count.join(', ')}]`
    };

    // 构建输出
    const output = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const pos = count[digit] - 1;
      output[pos] = arr[i];
      count[digit]--;

      yield {
        data: { type: 'array', value: [...output.filter(v => v !== undefined)] },
        highlights: { codeLines: [13, 14, 15], dataIndices: [pos] },
        variables: { n, exp, i, value: arr[i], digit, pos, stage: 'place' },
        description: `将 arr[${i}]=${arr[i]}（${exp === 1 ? '个' : exp === 10 ? '十' : '百'}位=${digit}）放到 output[${pos}]`
      };
    }

    // 复制回原数组
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [17], dataIndices: [] },
      variables: { n, exp, stage: 'digit-complete' },
      description: `${exp === 1 ? '个' : exp === 10 ? '十' : '百'}位排序完成，arr = [${arr.join(', ')}]`
    };

    exp *= 10;
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [19], dataIndices: [], sortedIndices: allSorted },
    variables: { n, max: maxVal, exp: exp / 10, stage: 'complete' },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function radixSort(arr) {',
  '  const n = arr.length;',
  '  const max = Math.max(...arr);',
  '  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {',
  '    const count = new Array(10).fill(0);',
  '    for (let i = 0; i < n; i++) {',
  '      const digit = Math.floor(arr[i] / exp) % 10;',
  '      count[digit]++;',
  '    }',
  '    for (let i = 1; i < 10; i++) count[i] += count[i - 1];',
  '    const output = new Array(n);',
  '    for (let i = n - 1; i >= 0; i--) {',
  '      const digit = Math.floor(arr[i] / exp) % 10;',
  '      output[count[digit] - 1] = arr[i];',
  '      count[digit]--;',
  '    }',
  '    for (let i = 0; i < n; i++) arr[i] = output[i];',
  '  }',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
