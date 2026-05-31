/**
 * 堆排序 - Heap Sort
 *
 * 利用堆数据结构，先将数组构建成最大堆，然后反复取出堆顶元素。
 * 时间复杂度: O(n log n)  空间复杂度: O(1)  不稳定排序
 */

const meta = {
  id: 'heap-sort',
  name: '堆排序',
  nameEn: 'Heap Sort',
  difficulty: 'hard',
  category: 'sorting',
  tags: ['排序', '堆', '选择', '比较'],
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(1)',
  stable: false,

  description:
    '堆排序（Heap Sort）是指利用堆这种数据结构所设计的一种排序算法。' +
    '堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：' +
    '即子结点的键值或索引总是小于（或者大于）它的父节点。\n\n' +
    '堆排序可以分为两个阶段：\n' +
    '1. 建堆（build heap）：将无序数组构建成最大堆\n' +
    '2. 排序：重复将堆顶（最大值）与末尾元素交换，并调整堆',

  defaultInput: {
    type: 'array',
    value: [64, 34, 25, 12, 22, 11, 90],
    label: '待排序数组'
  }
};

// 向下堆化
function* siftDown(arr, n, i, sortedSet) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [13, 14], dataIndices: [i], compareIndices: [i] },
    variables: { n, i, left, right, largest, phase: 'heapify' },
    description: `堆化节点 i=${i}，值=${arr[i]}，左子=${left < n ? arr[left] : '-'}，右子=${right < n ? arr[right] : '-'}`
  };

  if (left < n && arr[left] > arr[largest]) {
    largest = left;

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [15], dataIndices: [largest], compareIndices: [i, left] },
      variables: { n, i, left, right, largest, phase: 'heapify' },
      description: `左子 arr[${left}]=${arr[left]} > arr[${largest}]=${arr[largest]}，更新最大索引为 ${left}`
    };
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [16], dataIndices: [largest], compareIndices: [i, right] },
      variables: { n, i, left, right, largest, phase: 'heapify' },
      description: `右子 arr[${right}]=${arr[right]} > arr[${largest}]=${arr[largest]}，更新最大索引为 ${right}`
    };
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [18, 19], dataIndices: [], swapIndices: [i, largest] },
      variables: { n, i, left, right, largest, phase: 'heapify' },
      description: `交换 arr[${i}]=${arr[i]} 和 arr[${largest}]=${arr[largest]}`
    };

    yield* siftDown(arr, n, largest, sortedSet);
  }
}

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { n, phase: 'init' },
    description: `开始堆排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  // 阶段1：建堆
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [] },
    variables: { n, phase: 'build-heap' },
    description: '阶段1：构建最大堆，从最后一个非叶子节点开始堆化'
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(arr, n, i, new Set());
  }

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [3], dataIndices: [] },
    variables: { n, phase: 'heap-built' },
    description: `最大堆构建完成！堆顶 arr[0]=${arr[0]} 为最大值，arr = [${arr.join(', ')}]`
  };

  // 阶段2：排序
  const sortedIndices = new Set();

  for (let i = n - 1; i > 0; i--) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [5], dataIndices: [0], compareIndices: [0, i] },
      variables: { n, i, phase: 'extract' },
      description: `将堆顶 arr[0]=${arr[0]} 与末尾 arr[${i}]=${arr[i]} 交换`
    };

    [arr[0], arr[i]] = [arr[i], arr[0]];
    sortedIndices.add(i);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [6, 7], dataIndices: [], swapIndices: [0, i] },
      variables: { n, i, phase: 'extract' },
      description: `交换后，arr[${i}]=${arr[i]} 已归位（最大值）`
    };

    // 对堆顶进行堆化
    yield* siftDown(arr, i, 0, sortedIndices);

    const currentSorted = Array.from(sortedIndices).sort((a, b) => a - b);
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [8], dataIndices: [], sortedIndices: currentSorted },
      variables: { n, i: i - 1, phase: 'after-heapify' },
      description: `堆化完成，已排序部分：[${currentSorted.map(idx => arr[idx]).join(', ')}]`
    };
  }

  sortedIndices.add(0);

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [10], dataIndices: [], sortedIndices: allSorted },
    variables: { n, phase: 'complete' },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function heapSort(arr) {',
  '  const n = arr.length;',
  '  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, n, i);',
  '  for (let i = n - 1; i > 0; i--) {',
  '    [arr[0], arr[i]] = [arr[i], arr[0]];',
  '    siftDown(arr, i, 0);',
  '  }',
  '  return arr;',
  '}',
  '',
  'function siftDown(arr, n, i) {',
  '  let largest = i;',
  '  const left = 2 * i + 1;',
  '  const right = 2 * i + 2;',
  '  if (left < n && arr[left] > arr[largest]) largest = left;',
  '  if (right < n && arr[right] > arr[largest]) largest = right;',
  '  if (largest !== i) {',
  '    [arr[i], arr[largest]] = [arr[largest], arr[i]];',
  '    siftDown(arr, n, largest);',
  '  }',
  '}'
];

module.exports = { meta, steps, code };
