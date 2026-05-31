/**
 * 插入排序 - Insertion Sort
 *
 * 将未排序元素逐个插入到已排序部分的正确位置。
 * 时间复杂度: O(n²)  空间复杂度: O(1)  稳定排序
 */

const meta = {
  id: 'insertion-sort',
  name: '插入排序',
  nameEn: 'Insertion Sort',
  difficulty: 'easy',
  category: 'sorting',
  tags: ['排序', '插入', '比较'],
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,

  description:
    '插入排序（Insertion Sort）是一种简单直观的排序算法。' +
    '它的工作原理是通过构建有序序列，对于未排序数据，' +
    '在已排序序列中从后向前扫描，找到相应位置并插入。\n\n' +
    '插入排序在实现上，通常采用 in-place 排序，' +
    '因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，' +
    '为最新元素提供插入空间。',

  defaultInput: {
    type: 'array',
    value: [64, 34, 25, 12, 22, 11, 90],
    label: '待排序数组'
  }
};

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;

  // Step 0: 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { i: '-', key: '-', j: '-', n },
    description: `开始插入排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  // 第一个元素视为已排序
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [0], sortedIndices: [0] },
    variables: { i: 0, key: '-', j: '-', n },
    description: `第一个元素 arr[0]=${arr[0]} 视为已排序`
  };

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [3, 4], dataIndices: [i] },
      variables: { i, key, j, n },
      description: `取出 arr[${i}]=${key}，准备插入到已排序部分 [${arr.slice(0, i).join(', ')}]`
    };

    while (j >= 0 && arr[j] > key) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [5], dataIndices: [j], compareIndices: [j, j + 1] },
        variables: { i, key, j, n },
        description: `arr[${j}]=${arr[j]} > key=${key}，将 arr[${j}] 后移一位`
      };

      arr[j + 1] = arr[j];
      j--;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [6], dataIndices: [j + 1], swapIndices: [j + 1] },
        variables: { i, key, j, n },
        description: `arr[${j + 1}] = arr[${j + 1} + 1]（即 ${arr[j + 1]}），已后移`
      };
    }

    arr[j + 1] = key;

    // 标记已排序部分
    const sortedIndices = [];
    for (let k = 0; k <= i; k++) sortedIndices.push(k);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [9], dataIndices: [j + 1], sortedIndices },
      variables: { i, key, j: j + 1, n },
      description: `将 key=${key} 插入到 arr[${j + 1}]，已排序部分扩展为 [${arr.slice(0, i + 1).join(', ')}]`
    };
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [12], dataIndices: [], sortedIndices: allSorted },
    variables: { i: n - 1, key: '-', j: '-', n },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function insertionSort(arr) {',
  '  const n = arr.length;',
  '  for (let i = 1; i < n; i++) {',
  '    const key = arr[i];',
  '    let j = i - 1;',
  '    while (j >= 0 && arr[j] > key) {',
  '      arr[j + 1] = arr[j];',
  '      j--;',
  '    }',
  '    arr[j + 1] = key;',
  '  }',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
