/**
 * 鸡尾酒排序 - Cocktail Sort (双向冒泡排序)
 *
 * 冒泡排序的变体，每轮交替从左到右和从右到左进行冒泡。
 * 时间复杂度: O(n²)  空间复杂度: O(1)  稳定排序
 */

const meta = {
  id: 'cocktail-sort',
  name: '鸡尾酒排序',
  nameEn: 'Cocktail Sort',
  difficulty: 'easy',
  category: 'sorting',
  tags: ['排序', '交换', '双向', '冒泡'],
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,

  description:
    '鸡尾酒排序（Cocktail Sort），也称双向冒泡排序（Bidirectional Bubble Sort）' +
    '或鸡尾酒搅拌排序。它是冒泡排序的一种变体，' +
    '每轮遍历中先从左到右将最大元素移到末尾，' +
    '再从右到左将最小元素移到开头。\n\n' +
    '相比普通冒泡排序，鸡尾酒排序在特定情况下（如大部分已排序的数组）' +
    '可以减少遍历次数。',

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
    variables: { left: 0, right: n - 1, swapped: '-', n },
    description: `开始鸡尾酒排序，数组长度为 ${n}，arr = [${arr.join(', ')}]`
  };

  let left = 0;
  let right = n - 1;
  let iteration = 0;

  while (left < right) {
    let swapped = false;

    // 从左到右：将最大值移到右侧
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2], dataIndices: [] },
      variables: { left, right, swapped, iteration, direction: '->', n },
      description: `第 ${iteration + 1} 轮（从左到右），范围 [${left}..${right}]`
    };

    for (let i = left; i < right; i++) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [4, 5], dataIndices: [i], compareIndices: [i, i + 1] },
        variables: { left, right, i, swapped, direction: '->', n },
        description: `比较 arr[${i}]=${arr[i]} 和 arr[${i + 1}]=${arr[i + 1]}`
      };

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;

        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [6, 7], dataIndices: [], swapIndices: [i, i + 1] },
          variables: { left, right, i, swapped, direction: '->', n },
          description: `交换 arr[${i}] 和 arr[${i + 1}] —— ${arr[i + 1]} ↔ ${arr[i]}`
        };
      }
    }

    right--;

    // 标记右侧已排序
    const rightSorted = [];
    for (let k = right + 1; k < n; k++) rightSorted.push(k);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2], dataIndices: [], sortedIndices: rightSorted },
      variables: { left, right, swapped, iteration, direction: '<-', n },
      description: `从左到右完成，arr[${right + 1}]=${arr[right + 1]} 已归位，开始从右向左遍历`
    };

    if (!swapped) break;
    swapped = false;

    // 从右到左：将最小值移到左侧
    for (let i = right; i > left; i--) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [10, 11], dataIndices: [i], compareIndices: [i - 1, i] },
        variables: { left, right, i, swapped, direction: '<-', n },
        description: `比较 arr[${i - 1}]=${arr[i - 1]} 和 arr[${i}]=${arr[i]}`
      };

      if (arr[i - 1] > arr[i]) {
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        swapped = true;

        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [12, 13], dataIndices: [], swapIndices: [i - 1, i] },
          variables: { left, right, i, swapped, direction: '<-', n },
          description: `交换 arr[${i - 1}] 和 arr[${i}] —— ${arr[i]} ↔ ${arr[i - 1]}`
        };
      }
    }

    left++;

    // 标记左侧已排序
    const leftSorted = [];
    for (let k = 0; k < left; k++) leftSorted.push(k);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [10], dataIndices: [], sortedIndices: [...leftSorted, ...rightSorted] },
      variables: { left, right, swapped, iteration, n },
      description: `从右到左完成，arr[${left - 1}]=${arr[left - 1]} 已归位，左右各排好 ${left} 个元素`
    };

    if (!swapped) break;
    iteration++;
  }

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [16], dataIndices: [], sortedIndices: allSorted },
    variables: { left, right, n, iteration, stage: 'complete' },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function cocktailSort(arr) {',
  '  const n = arr.length;',
  '  let left = 0, right = n - 1;',
  '  while (left < right) {',
  '    let swapped = false;',
  '    for (let i = left; i < right; i++) {',
  '      if (arr[i] > arr[i + 1]) {',
  '        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];',
  '        swapped = true;',
  '      }',
  '    }',
  '    right--;',
  '    for (let i = right; i > left; i--) {',
  '      if (arr[i - 1] > arr[i]) {',
  '        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];',
  '        swapped = true;',
  '      }',
  '    }',
  '    left++;',
  '    if (!swapped) break;',
  '  }',
  '  return arr;',
  '}'
];

module.exports = { meta, steps, code };
