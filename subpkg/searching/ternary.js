/**
 * 三分查找 - Ternary Search
 *
 * 将有序数组分成三个部分，每次排除三分之一的范围。
 * 时间复杂度: O(log₃ n)  空间复杂度: O(1)
 */

const meta = {
  id: 'ternary-search',
  name: '三分查找',
  nameEn: 'Ternary Search',
  difficulty: 'medium',
  category: 'searching',
  tags: ['查找', '三分', '有序', '分治'],
  timeComplexity: { best: 'O(1)', average: 'O(log₃ n)', worst: 'O(log₃ n)' },
  spaceComplexity: 'O(1)',

  description:
    '三分查找（Ternary Search）是二分查找的变体。' +
    '它将数组分成三个等长的部分，通过两个中间点 mid1 和 mid2 进行比较，' +
    '每次可以排除三分之一的范围。\n\n' +
    '虽然三分查找每次排除更多元素（1/3 vs 1/2），' +
    '但每次需要两次比较，因此实际性能通常不如二分查找。' +
    '不过三分查找的概念对于理解多路搜索很有帮助。',

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
    variables: { left: 0, right: n - 1, mid1: '-', mid2: '-', target, found: false, n },
    description: `开始三分查找，在有序数组中查找目标值 ${target}，数组长度 ${n}`
  };

  let left = 0;
  let right = n - 1;
  let found = false;

  while (left <= right) {
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2, 3], dataIndices: [mid1, mid2] },
      variables: { left, right, mid1, mid2, val1: arr[mid1], val2: arr[mid2], target, found, n },
      description: `计算三分点：mid1=${mid1}（值=${arr[mid1]}），mid2=${mid2}（值=${arr[mid2]}），范围 [${left}..${right}]`
    };

    if (arr[mid1] === target) {
      found = true;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [4, 5], dataIndices: [mid1] },
        variables: { left, right, mid1, mid2, target, found, n },
        description: `找到目标！arr[${mid1}]=${arr[mid1]} === ${target}，查找成功！`
      };

      break;
    }

    if (arr[mid2] === target) {
      found = true;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [6, 7], dataIndices: [mid2] },
        variables: { left, right, mid1, mid2, target, found, n },
        description: `找到目标！arr[${mid2}]=${arr[mid2]} === ${target}，查找成功！`
      };

      break;
    }

    if (target < arr[mid1]) {
      right = mid1 - 1;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [8, 9], dataIndices: [mid1] },
        variables: { left, right, mid1, mid2, target, found, n },
        description: `${target} < arr[${mid1}]=${arr[mid1]}，目标在左侧区间，right=${right}`
      };
    } else if (target > arr[mid2]) {
      left = mid2 + 1;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [10, 11], dataIndices: [mid2] },
        variables: { left, right, mid1, mid2, target, found, n },
        description: `${target} > arr[${mid2}]=${arr[mid2]}，目标在右侧区间，left=${left}`
      };
    } else {
      left = mid1 + 1;
      right = mid2 - 1;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [12, 13], dataIndices: [] },
        variables: { left, right, mid1, mid2, target, found, n },
        description: `目标在中间区间 [${mid1 + 1}..${mid2 - 1}]，缩小范围：left=${left}，right=${right}`
      };
    }
  }

  if (!found) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [16], dataIndices: [] },
      variables: { left, right, target, found, n },
      description: `目标 ${target} 不在数组中`
    };
  }

  // 最终状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [16], dataIndices: [], sortedIndices: arr.map((_, i) => i) },
    variables: { left, right, target, found, n },
    description: found
      ? `查找完成！找到 ${target} 位于索引 ${arr.indexOf(target)}`
      : `查找完成！目标 ${target} 不存在`
  };
}

const code = [
  'function ternarySearch(arr, target) {',
  '  let left = 0, right = arr.length - 1;',
  '  while (left <= right) {',
  '    const mid1 = left + Math.floor((right - left) / 3);',
  '    const mid2 = right - Math.floor((right - left) / 3);',
  '    if (arr[mid1] === target) return mid1;',
  '    if (arr[mid2] === target) return mid2;',
  '    if (target < arr[mid1]) right = mid1 - 1;',
  '    else if (target > arr[mid2]) left = mid2 + 1;',
  '    else { left = mid1 + 1; right = mid2 - 1; }',
  '  }',
  '  return -1;',
  '}'
];

module.exports = { meta, steps, code };
