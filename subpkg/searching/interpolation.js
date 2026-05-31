/**
 * 插值查找 - Interpolation Search
 *
 * 根据目标值在数组中的大致位置进行推测性查找，二分查找的改进版。
 * 时间复杂度: O(log log n)  空间复杂度: O(1)
 */

const meta = {
  id: 'interpolation-search',
  name: '插值查找',
  nameEn: 'Interpolation Search',
  difficulty: 'medium',
  category: 'searching',
  tags: ['查找', '插值', '有序', '推测'],
  timeComplexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',

  description:
    '插值查找（Interpolation Search）是二分查找的改进版本。' +
    '它不是简单地取中间位置，而是根据目标值在数组中的大致比例' +
    '来估计目标可能的位置（类似于查字典时的翻页策略）。\n\n' +
    '插值查找适用于数据分布均匀的有序数组，' +
    '此时平均时间复杂度可达 O(log log n)。' +
    '但对于分布不均匀的数据，最坏情况可能退化为 O(n)。',

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
    variables: { left: 0, right: n - 1, pos: '-', target, found: false, n },
    description: `开始插值查找，在有序数组中查找目标值 ${target}，数组长度 ${n}`
  };

  let left = 0;
  let right = n - 1;
  let found = false;

  while (left <= right && target >= arr[left] && target <= arr[right]) {
    if (left === right) {
      if (arr[left] === target) {
        found = true;
        yield {
          data: { type: 'array', value: [...arr] },
          highlights: { codeLines: [2, 3], dataIndices: [left] },
          variables: { left, right, pos: left, target, value: arr[left], found, n },
          description: `left=right=${left}，arr[${left}]=${arr[left]} === ${target}，找到目标！`
        };
      }
      break;
    }

    // 插值公式：根据值在范围中的比例计算预测位置
    const ratio = (target - arr[left]) / (arr[right] - arr[left]);
    const pos = left + Math.floor(ratio * (right - left));

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2, 3], dataIndices: [pos] },
      variables: { left, right, pos, target, arrLeft: arr[left], arrRight: arr[right], ratio: ratio.toFixed(3), found, n },
      description: `插值计算：pos = ${left} + (${target}-${arr[left]})/(${arr[right]}-${arr[left]}) * (${right}-${left}) = ${pos}`
    };

    if (arr[pos] === target) {
      found = true;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [4, 5], dataIndices: [pos] },
        variables: { left, right, pos, target, found, n },
        description: `找到目标！arr[${pos}]=${arr[pos]} === ${target}，查找成功！`
      };

      break;
    }

    if (arr[pos] < target) {
      left = pos + 1;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [6, 7], dataIndices: [pos] },
        variables: { left, right, pos, target, found, n },
        description: `arr[${pos}]=${arr[pos]} < ${target}，目标在右侧，left=${left}`
      };
    } else {
      right = pos - 1;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [8, 9], dataIndices: [pos] },
        variables: { left, right, pos, target, found, n },
        description: `arr[${pos}]=${arr[pos]} > ${target}，目标在左侧，right=${right}`
      };
    }
  }

  if (!found) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [12], dataIndices: [] },
      variables: { left, right, target, found, n },
      description: `目标 ${target} 不在数组中`
    };
  }

  // 最终状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [12], dataIndices: [], sortedIndices: arr.map((_, i) => i) },
    variables: { left, right, target, found, n },
    description: found
      ? `查找完成！找到 ${target} 位于索引 ${arr.indexOf(target)}`
      : `查找完成！目标 ${target} 不存在于数组中`
  };
}

const code = [
  'function interpolationSearch(arr, target) {',
  '  let left = 0, right = arr.length - 1;',
  '  while (left <= right && target >= arr[left] && target <= arr[right]) {',
  '    const pos = left + Math.floor((target - arr[left]) / (arr[right] - arr[left]) * (right - left));',
  '    if (arr[pos] === target) return pos;',
  '    if (arr[pos] < target) left = pos + 1;',
  '    else right = pos - 1;',
  '  }',
  '  return -1;',
  '}'
];

module.exports = { meta, steps, code };
