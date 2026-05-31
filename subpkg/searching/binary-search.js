/**
 * 二分查找 - Binary Search
 *
 * 在有序数组中，每次将搜索范围缩小一半，快速定位目标值。
 * 时间复杂度: O(log n)  空间复杂度: O(1)
 */

const meta = {
  id: 'binary-search',
  name: '二分查找',
  nameEn: 'Binary Search',
  difficulty: 'easy',
  category: 'searching',
  tags: ['查找', '二分', '有序', '分治'],
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(1)',

  description:
    '二分查找（Binary Search）是一种在有序数组中查找特定元素的高效算法。' +
    '它通过将目标值与数组中间元素进行比较，' +
    '将搜索范围缩小到一半，直到找到目标或确定目标不存在。\n\n' +
    '二分查找每次比较可以将搜索范围缩小一半，' +
    '因此时间复杂度为 O(log n)，远优于线性查找的 O(n)。',

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
    variables: { left: 0, right: n - 1, mid: '-', target, found: false, n },
    description: `开始二分查找，在有序数组中查找目标值 ${target}，数组长度 ${n}`
  };

  let left = 0;
  let right = n - 1;
  let found = false;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2, 3], dataIndices: [mid] },
      variables: { left, right, mid, target, value: arr[mid], found, n },
      description: `计算中间位置 mid=${mid}，arr[${mid}]=${arr[mid]}，搜索范围 [${left}..${right}]`
    };

    if (arr[mid] === target) {
      found = true;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [4, 5], dataIndices: [mid] },
        variables: { left, right, mid, target, value: arr[mid], found, n },
        description: `找到目标！arr[${mid}]=${arr[mid]} === ${target}，查找成功！`
      };

      break;
    } else if (arr[mid] < target) {
      left = mid + 1;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [6, 7], dataIndices: [mid] },
        variables: { left, right, mid, target, value: arr[mid], found, n },
        description: `arr[${mid}]=${arr[mid]} < ${target}，目标在右侧，left=${left}`
      };
    } else {
      right = mid - 1;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [8, 9], dataIndices: [mid] },
        variables: { left, right, mid, target, value: arr[mid], found, n },
        description: `arr[${mid}]=${arr[mid]} > ${target}，目标在左侧，right=${right}`
      };
    }
  }

  if (!found) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [12], dataIndices: [] },
      variables: { left, right, mid: '-', target, found, n },
      description: `目标 ${target} 不在数组中`
    };
  }

  // 最终状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [12], dataIndices: [], sortedIndices: arr.map((_, i) => i) },
    variables: { left, right, mid: found ? Math.floor((left + right) / 2) : '-', target, found, n },
    description: found
      ? `查找完成！找到 ${target} 位于索引 ${Math.floor((left + right) / 2)}`
      : `查找完成！目标 ${target} 不存在于数组中`
  };
}

const code = [
  'function binarySearch(arr, target) {',
  '  let left = 0, right = arr.length - 1;',
  '  while (left <= right) {',
  '    const mid = Math.floor((left + right) / 2);',
  '    if (arr[mid] === target) return mid;',
  '    if (arr[mid] < target) left = mid + 1;',
  '    else right = mid - 1;',
  '  }',
  '  return -1;',
  '}'
];

module.exports = { meta, steps, code };
