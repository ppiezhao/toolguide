/**
 * 归并排序 - Merge Sort
 *
 * 采用分治法，将数组递归分成两半，分别排序后合并。
 * 时间复杂度: O(n log n)  空间复杂度: O(n)  稳定排序
 */

const meta = {
  id: 'merge-sort',
  name: '归并排序',
  nameEn: 'Merge Sort',
  difficulty: 'hard',
  category: 'sorting',
  tags: ['排序', '分治', '递归', '合并'],
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(n)',
  stable: true,

  description:
    '归并排序（Merge Sort）是建立在归并操作上的一种有效的排序算法。' +
    '该算法是采用分治法（Divide and Conquer）的一个典型应用。\n\n' +
    '将已有序的子序列合并，得到完全有序的序列；' +
    '即先使每个子序列有序，再使子序列段间有序。' +
    '若将两个有序表合并成一个有序表，称为二路归并。',

  defaultInput: {
    type: 'array',
    value: [64, 34, 25, 12, 22, 11, 90],
    label: '待排序数组'
  }
};

// 归并两个有序子数组 [left..mid] 和 [mid+1..right]
function* merge(arr, left, mid, right, sortedCount) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  const merged = [];
  let i = 0, j = 0, k = left;

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [8, 9], dataIndices: [] },
    variables: { left, mid, right, i: 0, j: 0, k: left, stage: 'merge' },
    description: `合并区间 [${left}..${mid}] 和 [${mid + 1}..${right}]：左=[${leftArr.join(', ')}]，右=[${rightArr.join(', ')}]`
  };

  while (i < leftArr.length && j < rightArr.length) {
    const leftVal = leftArr[i];
    const rightVal = rightArr[j];
    const compareIndices = [left + i, mid + 1 + j];

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [11], dataIndices: [k], compareIndices },
      variables: { left, mid, right, i, j, k, leftVal, rightVal, stage: 'merge' },
      description: `比较左[${i}]=${leftVal} 和右[${j}]=${rightVal}`
    };

    if (leftVal <= rightVal) {
      arr[k] = leftVal;
      i++;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [12, 13], dataIndices: [k] },
        variables: { left, mid, right, i, j, k, stage: 'merge' },
        description: `取左元素 ${leftVal} 放入 arr[${k}]`
      };
    } else {
      arr[k] = rightVal;
      j++;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [16, 17], dataIndices: [k] },
        variables: { left, mid, right, i, j, k, stage: 'merge' },
        description: `取右元素 ${rightVal} 放入 arr[${k}]`
      };
    }
    k++;
  }

  // 处理剩余元素
  while (i < leftArr.length) {
    arr[k] = leftArr[i];

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [22], dataIndices: [k] },
      variables: { left, mid, right, i, j, k, stage: 'merge' },
      description: `左半部分剩余，将 ${leftArr[i]} 放入 arr[${k}]`
    };

    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [22], dataIndices: [k] },
      variables: { left, mid, right, i, j, k, stage: 'merge' },
      description: `右半部分剩余，将 ${rightArr[j]} 放入 arr[${k}]`
    };

    j++;
    k++;
  }

  // 标记已归并完成的部分
  const mergedIndices = [];
  for (let idx = left; idx <= right; idx++) mergedIndices.push(idx);

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [24], dataIndices: [], sortedIndices: mergedIndices },
    variables: { left, mid, right, i, j, k: k - 1, stage: 'merge-complete' },
    description: `区间 [${left}..${right}] 归并完成：[${arr.slice(left, right + 1).join(', ')}]`
  };
}

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { n, size: 1, left: 0, stage: 'init' },
    description: `开始归并排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  // 自底向上归并排序
  for (let size = 1; size < n; size *= 2) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2], dataIndices: [] },
      variables: { n, size, stage: 'subarray' },
      description: `子数组大小 size=${size}，开始归并大小为 ${size} 的子数组`
    };

    for (let left = 0; left < n - size; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);

      yield* merge(arr, left, mid, right, 0);
    }
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [26], dataIndices: [], sortedIndices: allSorted },
    variables: { n, size: n, stage: 'complete' },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function mergeSort(arr) {',
  '  const n = arr.length;',
  '  for (let size = 1; size < n; size *= 2) {',
  '    for (let left = 0; left < n - size; left += 2 * size) {',
  '      const mid = left + size - 1;',
  '      const right = Math.min(left + 2 * size - 1, n - 1);',
  '      merge(arr, left, mid, right);',
  '    }',
  '  }',
  '  return arr;',
  '}',
  '',
  'function merge(arr, left, mid, right) {',
  '  const L = arr.slice(left, mid + 1);',
  '  const R = arr.slice(mid + 1, right + 1);',
  '  let i = 0, j = 0, k = left;',
  '  while (i < L.length && j < R.length) {',
  '    if (L[i] <= R[j]) {',
  '      arr[k++] = L[i++];',
  '    } else {',
  '      arr[k++] = R[j++];',
  '    }',
  '  }',
  '  while (i < L.length) arr[k++] = L[i++];',
  '  while (j < R.length) arr[k++] = R[j++];',
  '}'
];

module.exports = { meta, steps, code };
