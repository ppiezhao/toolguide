/**
 * 桶排序 - Bucket Sort
 *
 * 将元素分布到多个桶中，每个桶独立排序，然后合并。
 * 时间复杂度: O(n+k)  空间复杂度: O(n)  稳定排序
 */

const meta = {
  id: 'bucket-sort',
  name: '桶排序',
  nameEn: 'Bucket Sort',
  difficulty: 'medium',
  category: 'sorting',
  tags: ['排序', '桶', '分布', '非比较'],
  timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n²)' },
  spaceComplexity: 'O(n)',
  stable: true,

  description:
    '桶排序（Bucket Sort）是一种基于分布的排序算法。' +
    '它将元素均匀分布到多个有序的桶中，' +
    '对每个桶内的元素单独排序（通常使用插入排序），' +
    '最后按顺序合并所有桶中的元素。\n\n' +
    '桶排序适用于元素均匀分布的场景，' +
    '当桶的数量接近元素数量时，平均时间复杂度接近 O(n)。',

  defaultInput: {
    type: 'array',
    value: [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51, 0.12],
    label: '待排序数组（0-1浮点数）'
  }
};

function* steps(input) {
  const arr = [...input.value];
  const n = arr.length;
  const bucketCount = 4;

  // 初始状态
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [0, 1], dataIndices: [] },
    variables: { n, bucketCount, stage: 'init' },
    description: `开始桶排序，数组长度为 ${n}，准备 ${bucketCount} 个桶`
  };

  // 创建空桶
  const buckets = Array.from({ length: bucketCount }, () => []);

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [2], dataIndices: [] },
    variables: { n, bucketCount, buckets: buckets.map(b => `[${b.join(',')}]`).join('|'), stage: 'create-buckets' },
    description: `创建 ${bucketCount} 个空桶`
  };

  // 将元素放入桶中
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    const bucketIdx = Math.min(Math.floor(val * bucketCount), bucketCount - 1);
    buckets[bucketIdx].push(val);

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [4, 5], dataIndices: [i] },
      variables: { n, i, val, bucketIdx, buckets: buckets.map(b => `[${b.join(',')}]`).join(' | '), stage: 'distribute' },
      description: `将 arr[${i}]=${val} 放入桶 ${bucketIdx}`
    };
  }

  // 显示各桶内容
  for (let b = 0; b < bucketCount; b++) {
    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [4], dataIndices: [] },
      variables: { n, bucketIdx: b, bucketContent: `[${buckets[b].join(', ')}]`, buckets: buckets.map(bk => `[${bk.join(',')}]`).join(' | '), stage: 'buckets' },
      description: `桶 ${b} 的内容：[${buckets[b].join(', ')}]`
    };
  }

  // 对每个桶内部排序（使用插入排序）
  for (let b = 0; b < bucketCount; b++) {
    if (buckets[b].length <= 1) {
      yield {
        data: { type: 'array', value: [...arr] },
        highlights: { codeLines: [7], dataIndices: [] },
        variables: { n, bucketIdx: b, bucketContent: `[${buckets[b].join(', ')}]`, stage: 'sort-bucket' },
        description: `桶 ${b} 元素数量 ≤ 1，无需排序`
      };
      continue;
    }

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [7], dataIndices: [] },
      variables: { n, bucketIdx: b, bucketContent: `[${buckets[b].join(', ')}]`, stage: 'sort-bucket' },
      description: `对桶 ${b} 进行插入排序：[${buckets[b].join(', ')}]`
    };

    // 对桶内元素排序（插入排序）
    const bucket = buckets[b];
    for (let i = 1; i < bucket.length; i++) {
      const key = bucket[i];
      let j = i - 1;
      while (j >= 0 && bucket[j] > key) {
        bucket[j + 1] = bucket[j];
        j--;
      }
      bucket[j + 1] = key;
    }

    yield {
      data: { type: 'array', value: [...arr] },
      highlights: { codeLines: [7], dataIndices: [] },
      variables: { n, bucketIdx: b, sortedBucket: `[${bucket.join(', ')}]`, stage: 'bucket-sorted' },
      description: `桶 ${b} 排序完成：[${bucket.join(', ')}]`
    };
  }

  // 合并所有桶
  let idx = 0;
  for (let b = 0; b < bucketCount; b++) {
    for (let j = 0; j < buckets[b].length; j++) {
      arr[idx] = buckets[b][j];
      idx++;
    }
  }

  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [9], dataIndices: [] },
    variables: { n, stage: 'merge' },
    description: `合并各桶结果：arr = [${arr.join(', ')}]`
  };

  // 最终状态
  const allSorted = arr.map((_, idx) => idx);
  yield {
    data: { type: 'array', value: [...arr] },
    highlights: { codeLines: [10], dataIndices: [], sortedIndices: allSorted },
    variables: { n, bucketCount, stage: 'complete' },
    description: `排序完成！最终结果：[${arr.join(', ')}]`
  };
}

const code = [
  'function bucketSort(arr, bucketCount = 4) {',
  '  const n = arr.length;',
  '  const buckets = Array.from({ length: bucketCount }, () => []);',
  '  for (let i = 0; i < n; i++) {',
  '    const idx = Math.floor(arr[i] * bucketCount);',
  '    buckets[Math.min(idx, bucketCount - 1)].push(arr[i]);',
  '  }',
  '  for (const bucket of buckets) bucket.sort((a, b) => a - b);',
  '  const result = [].concat(...buckets);',
  '  return result;',
  '}'
];

module.exports = { meta, steps, code };
