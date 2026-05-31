/**
 * 冒泡排序 - Bubble Sort
 *
 * 重复遍历数组，依次比较相邻元素并交换位置，每轮将最大的元素「浮」到末尾。
 * 时间复杂度: O(n²)  空间复杂度: O(1)  稳定排序
 */

const meta = {
  id: 'bubble-sort',
  name: '冒泡排序',
  nameEn: 'Bubble Sort',
  difficulty: 'easy',
  category: 'sorting',
  tags: ['排序', '交换', '比较', '冒泡'],
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,

  description:
    '冒泡排序（Bubble Sort）是一种简单的排序算法。' +
    '它重复地遍历待排序的数组，一次比较两个相邻元素，' +
    '如果它们的顺序错误就把它们交换过来。' +
    '遍历数组的工作是重复进行的，直到没有再需要交换的元素，' +
    '也就是说该数组已经排序完成。\n\n' +
    '这个算法的名字由来是因为越小（或越大）的元素会经由交换慢慢"浮"到数列的顶端，' +
    '就像水中的气泡一样。',

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
    variables: { i: '-', j: '-', swapped: '-', n },
    description: `开始冒泡排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2], dataIndices: [] },
      variables: { i, j: '-', swapped, n },
      description: `第 ${i + 1} 轮排序开始，准备将第 ${n - i} 大的元素归位`
    };

    for (let j = 0; j < n - i - 1; j++) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [4, 5], dataIndices: [j], compareIndices: [j, j + 1] },
        variables: { i, j, swapped, n },
        description: `比较 arr[${j}]=${arr[j]} 和 arr[${j + 1}]=${arr[j + 1]}`
      };

      if (arr[j] > arr[j + 1]) {
        // 交换
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [6, 7], dataIndices: [], swapIndices: [j, j + 1] },
          variables: { i, j, swapped, n },
          description: `${arr[j + 1]} > ${arr[j]}，交换 arr[${j}] 和 arr[${j + 1}] —— ${arr[j]} ↔ ${arr[j + 1]}`
        };
      } else {
        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [5], dataIndices: [j + 1], compareIndices: [j, j + 1] },
          variables: { i, j, swapped, n },
          description: `${arr[j]} ≤ ${arr[j + 1]}，无需交换`
        };
      }
    }

    // 标记末尾已排序元素
    const sortedCount = i + 1;
    const sortedIndices = [];
    for (let k = n - sortedCount; k < n; k++) sortedIndices.push(k);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [10], dataIndices: [], sortedIndices },
      variables: { i, j: j - 1, swapped, n, sortedCount },
      description: swapped
        ? `第 ${i + 1} 轮结束，arr[${n - i - 1}]=${arr[n - i - 1]} 已归位`
        : `第 ${i + 1} 轮未发生交换，数组已有序，提前结束！`
    };

    if (!swapped) break;
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [12], dataIndices: [], sortedIndices: allSorted },
    variables: { i: n - 1, j: '-', swapped: '-', n, sortedCount: n },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function bubbleSort(arr) {',
  '  const n = arr.length;',
  '  for (let i = 0; i < n - 1; i++) {',
  '    let swapped = false;',
  '    for (let j = 0; j < n - i - 1; j++) {',
  '      if (arr[j] > arr[j + 1]) {',
  '        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];',
  '        swapped = true;',
  '      }',
  '    }',
  '    if (!swapped) break;',
  '  }',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
