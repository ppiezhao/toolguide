/**
 * 指数查找 - Exponential Search
 *
 * 先指数级扩大搜索范围找到包含目标的区间，再在该区间内进行二分查找。
 * 时间复杂度: O(log n)  空间复杂度: O(1)
 */

const meta = {
  id: 'exponential-search',
  name: '指数查找',
  nameEn: 'Exponential Search',
  difficulty: 'medium',
  category: 'searching',
  tags: ['查找', '指数', '二分', '有序', '范围'],
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(1)',

  description:
    '指数查找（Exponential Search）结合了指数扩展和二分查找。' +
    '它首先从索引 0 开始，以 2 的指数倍数（1, 2, 4, 8, ...）扩大搜索范围，' +
    '直到找到一个大于目标值的元素，确定目标所在的区间。\n\n' +
    '然后在该区间内执行标准的二分查找。' +
    '指数查找特别适用于目标值接近数组开头的情况，' +
    '也适用于数组长度无限或未知的场景。',

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
    variables: { target, bound: 1, n, stage: 'init' },
    description: `开始指数查找，在有序数组中查找目标值 ${target}，数组长度 ${n}`
  };

  // 检查第一个元素
  if (arr[0] === target) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2], dataIndices: [0] },
      variables: { target, bound: 1, n, stage: 'found-first' },
      description: `目标就在第一个位置！arr[0]=${arr[0]} === ${target}`
    };

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [11], dataIndices: [], sortedIndices: arr.map((_, i) => i) },
      variables: { target, found: true, foundIndex: 0, n },
      description: `查找完成！找到 ${target} 位于索引 0`
    };

    return;
  }

  // 指数扩展：找到包含目标的区间
  let bound = 1;

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [3], dataIndices: [] },
    variables: { target, bound, n, stage: 'expand' },
    description: `开始指数扩展搜索范围，从 bound=1 开始`
  };

  while (bound < n && arr[bound] < target) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [3, 4], dataIndices: [bound] },
      variables: { target, bound, arrBound: arr[bound], n, stage: 'expand' },
      description: `bound=${bound}，arr[${bound}]=${arr[bound]} < ${target}，继续扩展`
    };

    bound *= 2;

    if (bound < n) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [3], dataIndices: [Math.min(bound, n - 1)] },
        variables: { target, bound: Math.min(bound, n - 1), arrBound: arr[Math.min(bound, n - 1)], n, stage: 'expand' },
        description: `扩大到 bound=${Math.min(bound, n - 1)}，arr[${Math.min(bound, n - 1)}]=${arr[Math.min(bound, n - 1)]}`
      };
    }
  }

  const left = Math.floor(bound / 2);
  const right = Math.min(bound, n - 1);

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [5, 6], dataIndices: [] },
    variables: { target, left, right, bound: Math.min(bound, n - 1), n, stage: 'found-range' },
    description: `确定搜索区间 [${left}..${right}]，在该范围内进行二分查找`
  };

  // 在区间内进行二分查找
  let low = left;
  let high = right;
  let found = false;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [8, 9], dataIndices: [mid] },
      variables: { target, low, high, mid, value: arr[mid], found, n },
      description: `二分查找：mid=${mid}，arr[${mid}]=${arr[mid]}，范围 [${low}..${high}]`
    };

    if (arr[mid] === target) {
      found = true;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [10], dataIndices: [mid] },
        variables: { target, low, high, mid, found, n },
        description: `找到目标！arr[${mid}]=${arr[mid]} === ${target}，查找成功！`
      };

      break;
    }

    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (!found) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [13], dataIndices: [] },
      variables: { target, low, high, found, n },
      description: `目标 ${target} 不在数组中`
    };
  }

  // 最终状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [13], dataIndices: [], sortedIndices: arr.map((_, i) => i) },
    variables: { target, found, n },
    description: found
      ? `查找完成！找到 ${target} 位于索引 ${arr.indexOf(target)}`
      : `查找完成！目标 ${target} 不存在`
  };
}

const code = [
  'function exponentialSearch(arr, target) {',
  '  const n = arr.length;',
  '  if (arr[0] === target) return 0;',
  '  let bound = 1;',
  '  while (bound < n && arr[bound] < target) bound *= 2;',
  '  const left = Math.floor(bound / 2);',
  '  const right = Math.min(bound, n - 1);',
  '  let low = left, high = right;',
  '  while (low <= high) {',
  '    const mid = Math.floor((low + high) / 2);',
  '    if (arr[mid] === target) return mid;',
  '    if (arr[mid] < target) low = mid + 1;',
  '    else high = mid - 1;',
  '  }',
  '  return -1;',
  '}'
];

module.exports = { meta, steps, code };
