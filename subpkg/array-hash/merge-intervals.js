const meta = {
  id: 'merge-intervals',
  name: '合并区间',
  nameEn: 'Merge Intervals',
  difficulty: 'medium',
  category: 'array-hash',
  tags: ['区间合并', '数组', '排序'],
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  description: '合并区间问题：给出一个区间的集合，合并所有重叠的区间。先按区间左端点排序，然后遍历合并。如果当前区间的左端点 <= 已合并最后一个区间的右端点，则重叠，更新右端点。',
  defaultInput: {
    type: 'array',
    value: [[1, 3], [2, 6], [8, 10], [15, 18]],
    label: '区间: [[1,3],[2,6],[8,10],[15,18]]'
  }
};

function* steps(input) {
  const intervals = JSON.parse(JSON.stringify(input));
  const sorted = intervals.sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0]];

  yield {
    data: { type: 'array', value: sorted.map(iv => `[${iv.join(',')}]`) },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: { intervals: sorted.map(iv => [...iv]), merged: merged.map(iv => [...iv]), phase: 'sort' },
    description: `排序后区间: ${sorted.map(iv => `[${iv.join(',')}]`).join(', ')}。从第一个开始合并。`
  };

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    if (current[0] <= lastMerged[1]) {
      // 重叠，合并
      const newEnd = Math.max(lastMerged[1], current[1]);
      const oldEnd = lastMerged[1];
      lastMerged[1] = newEnd;

      yield {
        data: { type: 'array', value: sorted.map(iv => `[${iv.join(',')}]`) },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          intervals: sorted.map(iv => [...iv]),
          merged: merged.map(iv => [...iv]),
          i,
          current: [...current],
          lastMerged: [...merged[merged.length - 2]] || [],
          action: 'merge',
          oldEnd,
          newEnd
        },
        description: `区间 [${current.join(',')}] 与 [${lastMerged[0]},${oldEnd}] 重叠，合并为 [${lastMerged[0]},${newEnd}]。`
      };
    } else {
      // 不重叠
      merged.push([...current]);

      yield {
        data: { type: 'array', value: sorted.map(iv => `[${iv.join(',')}]`) },
        highlights: { dataIndices: [i], sortedIndices: [] },
        variables: {
          intervals: sorted.map(iv => [...iv]),
          merged: merged.map(iv => [...iv]),
          i,
          current: [...current],
          action: 'push'
        },
        description: `区间 [${current.join(',')}] 不重叠，直接加入结果。`
      };
    }
  }

  yield {
    data: { type: 'array', value: merged.map(iv => `[${iv.join(',')}]`) },
    highlights: { dataIndices: [], sortedIndices: [] },
    variables: {
      intervals: sorted.map(iv => [...iv]),
      merged: merged.map(iv => [...iv]),
      mergedCount: merged.length,
      complete: true
    },
    description: `合并完成！${sorted.length} 个区间合并为 ${merged.length} 个: ${merged.map(iv => `[${iv.join(',')}]`).join(', ')}`
  };
}

const code = [
  'function merge(intervals) {',
  '  if (intervals.length === 0) return [];',
  '  intervals.sort((a, b) => a[0] - b[0]);',
  '  const merged = [intervals[0]];',
  '',
  '  for (let i = 1; i < intervals.length; i++) {',
  '    const [start, end] = intervals[i];',
  '    if (start <= merged[merged.length - 1][1]) {',
  '      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);',
  '    } else {',
  '      merged.push(intervals[i]);',
  '    }',
  '  }',
  '',
  '  return merged;',
  '}'
];

module.exports = { meta, steps, code };
