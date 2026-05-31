/**
 * 选择排序 - Selection Sort
 *
 * 每一轮从未排序部分选出最小值，放到已排序部分的末尾。
 * 时间复杂度: O(n²)  空间复杂度: O(1)  不稳定排序
 */

const meta = {
  id: 'selection-sort',
  name: '选择排序',
  nameEn: 'Selection Sort',
  difficulty: 'easy',
  category: 'sorting',
  tags: ['排序', '选择', '比较'],
  timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,

  description:
    '选择排序（Selection Sort）是一种简单直观的排序算法。' +
    '它的工作原理是：首先在未排序序列中找到最小（大）元素，' +
    '存放到排序序列的起始位置；然后，再从剩余未排序元素中继续寻找最小（大）元素，' +
    '然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。\n\n' +
    '选择排序每次交换一对元素，其中至少有一个被移到其最终位置上，' +
    '因此对 n 个元素的数组进行排序，最多进行 n-1 次交换。',

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
    variables: { i: '-', minIdx: '-', j: '-', n },
    description: `开始选择排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2, 3], dataIndices: [i], sortedIndices: [] },
      variables: { i, minIdx, j: '-', n },
      description: `第 ${i + 1} 轮：从位置 ${i} 开始查找最小值，当前假设 arr[${i}]=${arr[i]} 最小`
    };

    for (let j = i + 1; j < n; j++) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [4, 5], dataIndices: [j], compareIndices: [minIdx, j] },
        variables: { i, minIdx, j, n },
        description: `比较 arr[${minIdx}]=${arr[minIdx]} 和 arr[${j}]=${arr[j]}`
      };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;

        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [5, 6], dataIndices: [minIdx], compareIndices: [i, minIdx] },
          variables: { i, minIdx, j, n },
          description: `发现更小值 arr[${j}]=${arr[j]}，更新最小索引为 ${j}`
        };
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [8, 9], dataIndices: [], swapIndices: [i, minIdx] },
        variables: { i, minIdx, j: j - 1, n },
        description: `交换 arr[${i}]=${arr[i]} 和 arr[${minIdx}]=${arr[minIdx]} —— ${arr[minIdx]} ↔ ${arr[i]}`
      };
    } else {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [8], dataIndices: [i], compareIndices: [i, minIdx] },
        variables: { i, minIdx, j: j - 1, n },
        description: `arr[${i}] 已经是最小值，无需交换`
      };
    }

    // 标记已排序部分
    const sortedIndices = [];
    for (let k = 0; k <= i; k++) sortedIndices.push(k);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2], dataIndices: [], sortedIndices },
      variables: { i, minIdx, j: '-', n },
      description: `第 ${i + 1} 轮结束，arr[${i}]=${arr[i]} 已归位，已排序部分：[${arr.slice(0, i + 1).join(', ')}]`
    };
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [12], dataIndices: [], sortedIndices: allSorted },
    variables: { i: n - 1, minIdx: '-', j: '-', n },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function selectionSort(arr) {',
  '  const n = arr.length;',
  '  for (let i = 0; i < n - 1; i++) {',
  '    let minIdx = i;',
  '    for (let j = i + 1; j < n; j++) {',
  '      if (arr[j] < arr[minIdx]) {',
  '        minIdx = j;',
  '      }',
  '    }',
  '    if (minIdx !== i) {',
  '      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];',
  '    }',
  '  }',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
