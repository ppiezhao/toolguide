/**
 * TimSort - 简化的 TimSort（插入排序 + 归并排序混合）
 *
 * 将数组分成小块（run），用插入排序排序每个 run，然后归并。
 * 时间复杂度: O(n log n)  空间复杂度: O(n)  稳定排序
 */

const meta = {
  id: 'tim-sort',
  name: 'TimSort',
  nameEn: 'TimSort',
  difficulty: 'hard',
  category: 'sorting',
  tags: ['排序', '混合', '插入', '归并', '稳定'],
  timeComplexity: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(n)',
  stable: true,

  description:
    'TimSort 是一种混合排序算法，由 Tim Peters 为 Python 设计。' +
    '它结合了插入排序和归并排序的优点。\n\n' +
    '算法核心思想：\n' +
    '1. 将数组分割成小的 run（通常长度 32-64）\n' +
    '2. 使用插入排序对每个 run 排序\n' +
    '3. 使用归并排序合并这些 run\n\n' +
    '这里展示一个简化版本，便于理解其核心流程。',

  defaultInput: {
    type: 'array',
    value: [64, 34, 25, 12, 22, 11, 90, 45, 33, 78, 55, 19],
    label: '待排序数组'
  }
};

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;
  const RUN = 4; // 小数组简化展示

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { n, runSize: RUN, stage: 'init' },
    description: `开始 TimSort，数组长度 ${n}，run 大小 = ${RUN}`
  };

  // 阶段1：使用插入排序排序每个 run
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [] },
    variables: { n, runSize: RUN, stage: 'insertion-phase' },
    description: `阶段1：对每个大小为 ${RUN} 的 run 进行插入排序`
  };

  for (let i = 0; i < n; i += RUN) {
    const left = i;
    const right = Math.min(i + RUN - 1, n - 1);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2], dataIndices: [] },
      variables: { n, runSize: RUN, left, right, stage: 'sort-run' },
      description: `对 run [${left}..${right}] 进行插入排序：[${arr.slice(left, right + 1).join(', ')}]`
    };

    // 插入排序
    for (let j = left + 1; j <= right; j++) {
      const key = arr[j];
      let k = j - 1;

      while (k >= left && arr[k] > key) {
        arr[k + 1] = arr[k];
        k--;
      }
      arr[k + 1] = key;
    }

    const runIndices = [];
    for (let idx = left; idx <= right; idx++) runIndices.push(idx);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2], dataIndices: [], sortedIndices: runIndices },
      variables: { n, left, right, runSize: RUN, stage: 'run-sorted' },
      description: `run [${left}..${right}] 排序完成：[${arr.slice(left, right + 1).join(', ')}]`
    };
  }

  // 阶段2：归并 run
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [4], dataIndices: [] },
    variables: { n, stage: 'merge-phase' },
    description: '阶段2：归并排序好的 run'
  };

  for (let size = RUN; size < n; size *= 2) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [4], dataIndices: [] },
      variables: { n, size, stage: 'merge-step' },
      description: `归并阶段：合并大小为 ${size} 的子数组`
    };

    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1);
      const right = Math.min(left + 2 * size - 1, n - 1);

      if (mid >= right) continue;

      // 归并 [left..mid] 和 [mid+1..right]
      const L = arr.slice(left, mid + 1);
      const R = arr.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [6, 7], dataIndices: [] },
        variables: { n, left, mid, right, size, stage: 'merge' },
        description: `归并 [${left}..${mid}] 和 [${mid + 1}..${right}]`
      };

      while (i < L.length && j < R.length) {
        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [9], dataIndices: [k], compareIndices: [left + i, mid + 1 + j] },
          variables: { n, left, mid, right, i, j, k, leftVal: L[i], rightVal: R[j], stage: 'merge-compare' },
          description: `比较：左=${L[i]}，右=${R[j]}`
        };

        if (L[i] <= R[j]) {
          arr[k] = L[i++];
        } else {
          arr[k] = R[j++];
        }
        k++;
      }

      while (i < L.length) { arr[k] = L[i++]; k++; }
      while (j < R.length) { arr[k] = R[j++]; k++; }

      const mergedIndices = [];
      for (let idx = left; idx <= right; idx++) mergedIndices.push(idx);

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [9], dataIndices: [], sortedIndices: mergedIndices },
        variables: { n, left, right, i, j, k: k - 1, stage: 'merge-complete' },
        description: `归并 [${left}..${right}] 完成：[${arr.slice(left, right + 1).join(', ')}]`
      };
    }
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [12], dataIndices: [], sortedIndices: allSorted },
    variables: { n, stage: 'complete' },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function timSort(arr) {',
  '  const n = arr.length;',
  '  const RUN = 32;',
  '  for (let i = 0; i < n; i += RUN)',
  '    insertionSort(arr, i, Math.min(i + RUN - 1, n - 1));',
  '  for (let size = RUN; size < n; size *= 2) {',
  '    for (let left = 0; left < n; left += 2 * size) {',
  '      const mid = Math.min(left + size - 1, n - 1);',
  '      const right = Math.min(left + 2 * size - 1, n - 1);',
  '      if (mid < right) merge(arr, left, mid, right);',
  '    }',
  '  }',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
