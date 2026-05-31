/**
 * 线性查找 - Linear Search
 *
 * 从头到尾遍历数组，逐个比较每个元素是否等于目标值。
 * 时间复杂度: O(n)  空间复杂度: O(1)
 */

const meta = {
  id: 'linear-search',
  name: '线性查找',
  nameEn: 'Linear Search',
  difficulty: 'easy',
  category: 'searching',
  tags: ['查找', '线性', '遍历'],
  timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',

  description:
    '线性查找（Linear Search）是最简单的查找算法。' +
    '它从数组的第一个元素开始，逐个比较每个元素与目标值，' +
    '直到找到目标或遍历完整个数组。\n\n' +
    '线性查找不要求数组有序，适用于任何数据集。' +
    '虽然时间复杂度为 O(n)，但在数据量较小或无序的情况下，' +
    '线性查找仍然是一种实用的选择。',

  defaultInput: {
    type: 'array',
    value: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37],
    label: '有序数组',
    target: 23
  }
};

function* steps(input) {
  const arr = [...input.value];
  const target = input.target || 23;
  const n = arr.length;

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { i: '-', target, found: false, n },
    description: `开始线性查找，在数组中查找目标值 ${target}，数组长度 ${n}`
  };

  let found = false;

  for (let i = 0; i < n; i++) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2, 3], dataIndices: [i] },
      variables: { i, target, current: arr[i], found, n },
      description: `检查 arr[${i}]=${arr[i]} ${arr[i] === target ? '=== ' : '!=='} ${target}`
    };

    if (arr[i] === target) {
      found = true;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [4], dataIndices: [i] },
        variables: { i, target, found, n },
        description: `找到目标！arr[${i}]=${arr[i]} === ${target}，查找成功！`
      };

      break;
    }

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [3], dataIndices: [i] },
      variables: { i, target, current: arr[i], found, n },
      description: `arr[${i}]=${arr[i]} !== ${target}，继续搜索`
    };
  }

  if (!found) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [7], dataIndices: [] },
      variables: { target, found, n },
      description: `已遍历完整个数组，目标 ${target} 不存在`
    };
  }

  // 最终状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [7], dataIndices: [], sortedIndices: arr.map((_, i) => i) },
    variables: { target, found, n },
    description: found
      ? `查找完成！在索引 ${arr.indexOf(target)} 处找到 ${target}`
      : `查找完成！目标 ${target} 不存在`
  };
}

const code = [
  'function linearSearch(arr, target) {',
  '  const n = arr.length;',
  '  for (let i = 0; i < n; i++) {',
  '    if (arr[i] === target) return i;',
  '  }',
  '  return -1;',
  '}'
];

module.exports = { meta, steps, code };
