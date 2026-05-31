/**
 * 快速排序 - Quick Sort
 *
 * 选择一个基准元素，将数组分为小于和大于基准的两部分，递归排序。
 * 时间复杂度: O(n log n)  空间复杂度: O(log n)  不稳定排序
 */

const meta = {
  id: 'quick-sort',
  name: '快速排序',
  nameEn: 'Quick Sort',
  difficulty: 'hard',
  category: 'sorting',
  tags: ['排序', '分治', '递归', '分区'],
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  spaceComplexity: 'O(log n)',
  stable: false,

  description:
    '快速排序（Quick Sort）是一种高效的排序算法，采用分治法策略。' +
    '它选择一个元素作为基准（pivot），将数组分为两部分：' +
    '小于基准的元素和大于基准的元素。然后递归地对这两部分进行排序。\n\n' +
    '快速排序的平均时间复杂度为 O(n log n)，' +
    '但最坏情况下（如已排序数组且选择最左元素为基准）会退化到 O(n²)。' +
    '这里实现使用最后一个元素作为基准，并用栈模拟递归。',

  defaultInput: {
    type: 'array',
    value: [64, 34, 25, 12, 22, 11, 90],
    label: '待排序数组'
  }
};

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { low: 0, high: n - 1, pivotIdx: '-', stack: '[]', n },
    description: `开始快速排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  // 用栈模拟递归
  const stack = [{ low: 0, high: n - 1 }];
  let iteration = 0;

  while (stack.length > 0) {
    const { low, high } = stack.pop();
    if (low >= high) continue;

    // 选择基准：最后一个元素
    const pivot = arr[high];
    let i = low - 1;

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2, 3], dataIndices: [high], pivotIndices: [high] },
      variables: { low, high, pivot, i, partitionDone: false, iteration },
      description: `分区范围 [${low}..${high}]，选中基准 pivot=arr[${high}]=${pivot}`
    };

    for (let j = low; j < high; j++) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [6, 7], dataIndices: [j], compareIndices: [j, high], pivotIndices: [high] },
        variables: { low, high, pivot, i, j, iteration },
        description: `比较 arr[${j}]=${arr[j]} 和 pivot=${pivot}`
      };

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];

          yield {
            data: { type: 'array', value: [...arr] },
            highlights: { codeLines: [8, 9], dataIndices: [], swapIndices: [i, j], pivotIndices: [high] },
            variables: { low, high, pivot, i, j, iteration },
            description: `arr[${j}]=${arr[j]} < pivot，交换 arr[${i}] 和 arr[${j}]`
          };
        } else {
          yield {
            data: { type: 'array', value: [...arr] },
            highlights: { codeLines: [8], dataIndices: [i], pivotIndices: [high] },
            variables: { low, high, pivot, i, j, iteration },
            description: `arr[${j}]=${arr[j]} < pivot，i=j=${i}，无需交换`
          };
        }
      }
    }

    // 将基准放到正确位置
    const pivotIdx = i + 1;
    if (pivotIdx !== high) {
      [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [12, 13], dataIndices: [], swapIndices: [pivotIdx, high], pivotIndices: [pivotIdx] },
        variables: { low, high, pivot, i, pivotIdx, j: high, iteration },
        description: `基准归位：交换 arr[${pivotIdx}] 和 arr[${high}]，pivot=${pivot} 已在正确位置`
      };
    }

    // 标记已排序的基准位置
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [15, 16], dataIndices: [], pivotIndices: [pivotIdx], sortedIndices: [pivotIdx] },
      variables: { low, high, pivot, pivotIdx, iteration },
      description: `pivot=${pivot} 已归位，位于索引 ${pivotIdx}，左侧 < pivot，右侧 > pivot`
    };

    // 将左右子区间入栈（先右后左，确保左先处理）
    if (pivotIdx + 1 < high) stack.push({ low: pivotIdx + 1, high });
    if (low < pivotIdx - 1) stack.push({ low, high: pivotIdx - 1 });

    iteration++;
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [18], dataIndices: [], sortedIndices: allSorted },
    variables: { low: 0, high: n - 1, pivotIdx: '-', iteration, n },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function quickSort(arr, low, high) {',
  '  if (low >= high) return;',
  '  const pivot = arr[high];',
  '  let i = low - 1;',
  '  for (let j = low; j < high; j++) {',
  '    if (arr[j] < pivot) {',
  '      i++;',
  '      [arr[i], arr[j]] = [arr[j], arr[i]];',
  '    }',
  '  }',
  '  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];',
  '  const pivotIdx = i + 1;',
  '  quickSort(arr, low, pivotIdx - 1);',
  '  quickSort(arr, pivotIdx + 1, high);',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
