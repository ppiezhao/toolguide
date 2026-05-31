/**
 * 希尔排序 - Shell Sort
 *
 * 基于插入排序的改进，通过间隔（gap）分组进行插入排序，逐步缩小间隔。
 * 时间复杂度: O(n log n) ~ O(n²)  空间复杂度: O(1)  不稳定排序
 */

const meta = {
  id: 'shell-sort',
  name: '希尔排序',
  nameEn: 'Shell Sort',
  difficulty: 'medium',
  category: 'sorting',
  tags: ['排序', '插入', '间隔', '比较'],
  timeComplexity: { best: 'O(n log n)', average: 'O(n^(4/3))', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,

  description:
    '希尔排序（Shell Sort）是插入排序的一种更高效的改进版本。' +
    '它通过将数组按一定间隔（gap）分成多个子序列，' +
    '分别对子序列进行插入排序，然后逐步缩小间隔，' +
    '直到间隔为 1 时完成最终排序。\n\n' +
    '希尔排序的核心思想是：使数组中任意间隔为 gap 的元素都是有序的。' +
    '这样的数组称为 gap-有序的。随着 gap 不断减小，' +
    '数组越来越接近完全有序，最后 gap=1 时就是普通插入排序。',

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
    variables: { gap: '-', i: '-', j: '-', temp: '-', n },
    description: `开始希尔排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  // 计算初始 gap（使用 Knuth 序列）
  let gap = 1;
  while (gap < n / 3) gap = gap * 3 + 1;

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [] },
    variables: { gap, n, phase: 'init-gap' },
    description: `初始间隔 gap=${gap}，将数组分成 ${Math.ceil(n / gap)} 组进行插入排序`
  };

  while (gap >= 1) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [3], dataIndices: [] },
      variables: { gap, n, phase: 'new-gap' },
      description: `========== gap=${gap} ==========`
    };

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [4, 5], dataIndices: [i] },
        variables: { gap, i, j, temp, n },
        description: `gap=${gap}：取 arr[${i}]=${temp}，准备在间隔为 ${gap} 的组中插入`
      };

      while (j >= gap && arr[j - gap] > temp) {
        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [6, 7], dataIndices: [j], compareIndices: [j, j - gap] },
          variables: { gap, i, j, temp, n },
          description: `arr[${j - gap}]=${arr[j - gap]} > temp=${temp}，将 arr[${j - gap}] 移到 arr[${j}]`
        };

        arr[j] = arr[j - gap];
        j -= gap;

        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [7, 8], dataIndices: [j + gap], swapIndices: [j + gap] },
          variables: { gap, i, j, temp, n },
          description: `arr[${j + gap}] = ${arr[j + gap]}，已后移，j=${j}`
        };
      }

      arr[j] = temp;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [11], dataIndices: [j] },
        variables: { gap, i, j, temp, n },
        description: `将 temp=${temp} 放入 arr[${j}]`
      };
    }

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [3], dataIndices: [] },
      variables: { gap, n, phase: 'gap-complete' },
      description: `gap=${gap} 排序完成，当前 arr = [${arr.join(', ')}]`
    };

    gap = Math.floor(gap / 3);
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [13], dataIndices: [], sortedIndices: allSorted },
    variables: { gap: 1, n, phase: 'complete' },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function shellSort(arr) {',
  '  const n = arr.length;',
  '  let gap = 1; while (gap < n / 3) gap = gap * 3 + 1;',
  '  while (gap >= 1) {',
  '    for (let i = gap; i < n; i++) {',
  '      const temp = arr[i];',
  '      let j = i;',
  '      while (j >= gap && arr[j - gap] > temp) {',
  '        arr[j] = arr[j - gap];',
  '        j -= gap;',
  '      }',
  '      arr[j] = temp;',
  '    }',
  '    gap = Math.floor(gap / 3);',
  '  }',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
