/**
 * 跳跃查找 - Jump Search
 *
 * 跳固定步长（√n）前进，找到包含目标的区间后线性扫描。
 * 时间复杂度: O(√n)  空间复杂度: O(1)
 */

const meta = {
  id: 'jump-search',
  name: '跳跃查找',
  nameEn: 'Jump Search',
  difficulty: 'medium',
  category: 'searching',
  tags: ['查找', '跳跃', '有序', '分块'],
  timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
  spaceComplexity: 'O(1)',

  description:
    '跳跃查找（Jump Search）是介于线性查找和二分查找之间的算法。' +
    '它通过固定步长跳跃前进来减少比较次数。\n\n' +
    '算法步骤：\n' +
    '1. 确定跳跃步长 step = √n\n' +
    '2. 从前往后以 step 为步长跳跃，直到找到一个大于等于目标值的元素\n' +
    '3. 在最后跳跃的区间内进行线性查找\n\n' +
    '其时间复杂度为 O(√n)，优于线性查找的 O(n)。',

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
    variables: { n, step: Math.floor(Math.sqrt(n)), prev: 0, curr: 0, target, found: false },
    description: `开始跳跃查找，步长 = √${n} = ${Math.floor(Math.sqrt(n))}，目标值 = ${target}`
  };

  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = step;
  let found = false;

  // 跳跃阶段：找到包含目标的区间
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [prev] },
    variables: { n, step, prev, curr: 0, target, found, stage: 'jump' },
    description: `从索引 0 开始跳跃，步长 = ${step}`
  };

  while (curr < n && arr[curr] < target) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [2, 3], dataIndices: [curr] },
      variables: { n, step, prev, curr, arrCurr: arr[curr], target, found, stage: 'jump' },
      description: `跳至索引 ${curr}，arr[${curr}]=${arr[curr]} < ${target}，继续跳跃`
    };

    prev = curr;
    curr += step;
  }

  if (curr < n) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [3], dataIndices: [curr] },
      variables: { n, step, prev, curr, arrCurr: arr[curr], target, found, stage: 'jump-stop' },
      description: `停在索引 ${curr}，arr[${curr}]=${arr[curr]} >= ${target}，确定搜索区间 [${prev}..${Math.min(curr, n - 1)}]`
    };
  } else {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [3], dataIndices: [n - 1] },
      variables: { n, step, prev, curr, target, found, stage: 'jump-past' },
      description: `已越过数组末尾，确定搜索区间 [${prev}..${n - 1}]`
    };
  }

  // 线性扫描阶段
  const end = Math.min(curr, n - 1);

  for (let i = prev; i <= end; i++) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [5, 6], dataIndices: [i] },
      variables: { n, step, prev, curr: end, i, target, current: arr[i], found, stage: 'linear' },
      description: `线性扫描 arr[${i}]=${arr[i]}，比较与目标 ${target}`
    };

    if (arr[i] === target) {
      found = true;

      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [7], dataIndices: [i] },
        variables: { n, step, prev, i, target, found, stage: 'found' },
        description: `找到目标！arr[${i}]=${arr[i]} === ${target}，查找成功！`
      };

      break;
    }
  }

  if (!found) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [9], dataIndices: [] },
      variables: { n, step, target, found, stage: 'not-found' },
      description: `目标 ${target} 不在数组中`
    };
  }

  // 最终状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [9], dataIndices: [], sortedIndices: arr.map((_, i) => i) },
    variables: { n, step, target, found },
    description: found
      ? `查找完成！在索引 ${arr.indexOf(target)} 处找到 ${target}`
      : `查找完成！目标 ${target} 不存在`
  };
}

const code = [
  'function jumpSearch(arr, target) {',
  '  const n = arr.length;',
  '  const step = Math.floor(Math.sqrt(n));',
  '  let prev = 0, curr = step;',
  '  while (curr < n && arr[curr] < target) { prev = curr; curr += step; }',
  '  const end = Math.min(curr, n - 1);',
  '  for (let i = prev; i <= end; i++) {',
  '    if (arr[i] === target) return i;',
  '  }',
  '  return -1;',
  '}'
];

module.exports = { meta, steps, code };
